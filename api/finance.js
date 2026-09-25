import { createClient } from '@supabase/supabase-js';

const FEE_KEY = 'finance:fee_settings:v1';
const GRADES = ['روضة','تمهيدي','الصف الأول','الصف الثاني','الصف الثالث','الصف الرابع'];

async function requireAdmin(req) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase server configuration is missing.');
  const sb = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    const e = new Error('غير مصرح.');
    e.status = 401;
    throw e;
  }
  const { data: au, error: ae } = await sb.auth.getUser(token);
  if (ae || !au?.user) {
    const e = new Error('جلسة الدخول غير صالحة.');
    e.status = 401;
    throw e;
  }
  const { data: profile, error: pe } = await sb.from('profiles').select('role,name').eq('auth_user_id', au.user.id).maybeSingle();
  if (pe) throw pe;
  if (profile?.role !== 'admin') {
    const e = new Error('هذه العملية للإدارة فقط.');
    e.status = 403;
    throw e;
  }
  return { sb, user: au.user, profile };
}

function normalizeRow(row, grade) {
  const annual = Math.max(0, Number(row?.annual_fee) || 0);
  return {
    grade,
    annual_fee: Number(annual.toFixed(3))
  };
}

async function recalculateAccount(sb, studentAuthId, userId) {
  const { data: accountRow, error: accountError } = await sb.from('school_kv').select('value').eq('key','finance:account:'+studentAuthId).maybeSingle();
  if (accountError) throw accountError;
  if (!accountRow?.value) return null;

  const { data: payRows, error: payError } = await sb.from('school_kv').select('value').like('key','finance:payment:%');
  if (payError) throw payError;
  const paid=(payRows||[]).map(r=>r.value||{}).filter(p=>!p.voided&&String(p.student_auth_id)===String(studentAuthId)).reduce((s,p)=>s+(Number(p.amount)||0),0);
  const annual=Number(accountRow.value.annual_fee)||0;
  const paidAmount=Number(paid.toFixed(3));
  const balance=Number(Math.max(0,annual-paidAmount).toFixed(3));
  const next={...accountRow.value,paid_amount:paidAmount,balance,status:annual<=0?'no_fee':paidAmount>=annual?'paid':paidAmount>0?'partial':'unpaid',synced_at:new Date().toISOString()};
  const { error:updateError }=await sb.from('school_kv').upsert({key:'finance:account:'+studentAuthId,value:next,updated_by:userId,updated_at:new Date().toISOString()},{onConflict:'key'});
  if(updateError) throw updateError;
  return next;
}

async function writeFinanceAudit(sb, user, profile, entry){
  const stamp=Date.now()+'-'+Math.random().toString(36).slice(2,8);
  const value={...entry,actor_id:user.id,actor_name:profile?.name||user.email||'admin',created_at:new Date().toISOString()};
  const {error}=await sb.from('school_kv').insert({key:'finance:audit:'+stamp,value,updated_by:user.id,updated_at:new Date().toISOString()});
  if(error) throw error;
  return value;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { sb, user, profile } = await requireAdmin(req);
    const body = req.body || {};

    if (body.action === 'get-settings') {
      const { data, error } = await sb.from('school_kv').select('value').eq('key', FEE_KEY).maybeSingle();
      if (error) throw error;
      const value = data?.value || {};
      const rows = GRADES.map(g => normalizeRow((value.rows || []).find(x => x.grade === g), g));
      return res.status(200).json({
        settings: {
          academic_year: value.academic_year || '2026/2027',
          rows,
          updated_at: value.updated_at || null,
          updated_by: value.updated_by || ''
        }
      });
    }

    if (body.action === 'save-settings') {
      const settings = body.settings || {};
      const rowsInput = Array.isArray(settings.rows) ? settings.rows : [];
      const rows = GRADES.map(g => normalizeRow(rowsInput.find(x => x.grade === g), g));
      const value = {
        academic_year: String(settings.academic_year || '2026/2027').slice(0, 30),
        rows,
        updated_at: new Date().toISOString(),
        updated_by: profile?.name || user.email || 'admin'
      };
      const { error } = await sb.from('school_kv').upsert({
        key: FEE_KEY,
        value,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      if (error) throw error;
      return res.status(200).json({ ok: true, settings: value });
    }

    if (body.action === 'sync-accounts') {
      const { data: feeRow, error: feeError } = await sb.from('school_kv').select('value').eq('key', FEE_KEY).maybeSingle();
      if (feeError) throw feeError;
      const feeValue = feeRow?.value || {};
      const feeRows = GRADES.map(g => normalizeRow((feeValue.rows || []).find(x => x.grade === g), g));
      const byGrade = new Map(feeRows.map(r => [r.grade, r]));

      const { data: students, error: studentsError } = await sb.from('profiles')
        .select('auth_user_id,name,email,phone,guardian_phone,grade,section,stage,external_id')
        .eq('role','student')
        .order('name',{ascending:true});
      if (studentsError) throw studentsError;

      const { data: paymentRows, error: paymentError } = await sb.from('school_kv').select('value').like('key','finance:payment:%');
      if (paymentError) throw paymentError;
      const paidByStudent = new Map();
      for (const row of (paymentRows || [])) {
        const p = row.value || {};
        if (p.voided) continue;
        const id = String(p.student_auth_id || '');
        paidByStudent.set(id, Number((paidByStudent.get(id)||0) + (Number(p.amount)||0)));
      }

      const now = new Date().toISOString();
      const rows = (students || []).filter(s => s.auth_user_id).map(s => {
        const fee = byGrade.get(s.grade) || normalizeRow({}, s.grade || '');
        const paid = Number((paidByStudent.get(String(s.auth_user_id))||0).toFixed(3));
        const balance = Number(Math.max(0, fee.annual_fee - paid).toFixed(3));
        return {
          key: 'finance:account:' + s.auth_user_id,
          value: {
            student_auth_id: s.auth_user_id,
            student_id: s.external_id || '',
            student_name: s.name || '',
            email: s.email || '',
            phone: s.phone || '',
            guardian_phone: s.guardian_phone || s.phone || '',
            stage: s.stage || '',
            grade: s.grade || '',
            section: s.section || '',
            academic_year: feeValue.academic_year || '2026/2027',
            annual_fee: fee.annual_fee,
            paid_amount: paid,
            balance,
            status: fee.annual_fee <= 0 ? 'no_fee' : paid >= fee.annual_fee ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
            synced_at: now
          },
          updated_by: user.id,
          updated_at: now
        };
      });

      if (rows.length) {
        const { error: upsertError } = await sb.from('school_kv').upsert(rows, { onConflict: 'key' });
        if (upsertError) throw upsertError;
      }
      return res.status(200).json({ ok: true, count: rows.length, accounts: rows.map(x => x.value) });
    }

    if (body.action === 'add-payment') {
      const studentAuthId = String(body.student_auth_id || '').trim();
      const amount = Number(body.amount);
      const paymentDate = /^\d{4}-\d{2}-\d{2}$/.test(String(body.payment_date||'')) ? String(body.payment_date) : new Date().toISOString().slice(0,10);
      const method = ['cash','bank','card'].includes(body.method) ? body.method : 'cash';
      if (!studentAuthId) return res.status(400).json({ error:'اختر الطالب.' });
      if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error:'أدخل مبلغًا صحيحًا أكبر من صفر.' });

      const { data: accountRow, error: accountError } = await sb.from('school_kv').select('value').eq('key','finance:account:'+studentAuthId).maybeSingle();
      if (accountError) throw accountError;
      if (!accountRow?.value) return res.status(404).json({ error:'لم يتم العثور على الحساب المالي للطالب.' });

      const account = accountRow.value;
      const currentBalance = Math.max(0, Number(account.annual_fee||0) - Number(account.paid_amount||0));
      if (amount > currentBalance + 0.0001) return res.status(400).json({ error:'المبلغ أكبر من الرصيد المتبقي على الطالب.' });

      const receiptNo = 'PAY-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-8);
      const payment = {
        id: receiptNo,
        receipt_no: receiptNo,
        student_auth_id: studentAuthId,
        student_id: account.student_id || '',
        student_name: account.student_name || '',
        grade: account.grade || '',
        section: account.section || '',
        guardian_phone: account.guardian_phone || '',
        amount: Number(amount.toFixed(3)),
        payment_date: paymentDate,
        method,
        reference: String(body.reference||'').slice(0,120),
        note: String(body.note||'').slice(0,300),
        created_at: new Date().toISOString(),
        created_by: profile?.name || user.email || 'admin',
        voided: false
      };
      const { error: payError } = await sb.from('school_kv').insert({
        key:'finance:payment:'+receiptNo,
        value:payment,
        updated_by:user.id,
        updated_at:new Date().toISOString()
      });
      if (payError) throw payError;

      const newPaid = Number((Number(account.paid_amount||0)+amount).toFixed(3));
      const newBalance = Number(Math.max(0, Number(account.annual_fee||0)-newPaid).toFixed(3));
      const nextAccount = {...account, paid_amount:newPaid, balance:newBalance, status:newBalance<=0?'paid':'partial', synced_at:new Date().toISOString()};
      const { error:updateError } = await sb.from('school_kv').upsert({
        key:'finance:account:'+studentAuthId,value:nextAccount,updated_by:user.id,updated_at:new Date().toISOString()
      },{onConflict:'key'});
      if(updateError) throw updateError;
      return res.status(200).json({ok:true,payment,account:nextAccount});
    }

    if (body.action === 'update-payment') {
      const receiptNo=String(body.receipt_no||'').trim();
      const amount=Number(body.amount);
      const reason=String(body.reason||'').trim().slice(0,300);
      if(!receiptNo) return res.status(400).json({error:'رقم الإيصال مطلوب.'});
      if(!Number.isFinite(amount)||amount<=0) return res.status(400).json({error:'أدخل مبلغًا صحيحًا.'});
      if(!reason) return res.status(400).json({error:'اكتب سبب التعديل.'});

      const key='finance:payment:'+receiptNo;
      const {data:row,error:rowError}=await sb.from('school_kv').select('value').eq('key',key).maybeSingle();
      if(rowError) throw rowError;
      if(!row?.value) return res.status(404).json({error:'الدفعة غير موجودة.'});
      if(row.value.voided) return res.status(400).json({error:'لا يمكن تعديل دفعة ملغاة.'});

      const before=row.value;
      const accountId=String(before.student_auth_id||'');
      const {data:accountRow,error:accountError}=await sb.from('school_kv').select('value').eq('key','finance:account:'+accountId).maybeSingle();
      if(accountError) throw accountError;
      const annual=Number(accountRow?.value?.annual_fee)||0;

      const {data:payRows,error:payError}=await sb.from('school_kv').select('value').like('key','finance:payment:%');
      if(payError) throw payError;
      const others=(payRows||[]).map(r=>r.value||{}).filter(p=>!p.voided&&String(p.student_auth_id)===accountId&&String(p.receipt_no)!==receiptNo).reduce((s,p)=>s+(Number(p.amount)||0),0);
      if(others+amount>annual+0.0001) return res.status(400).json({error:'بعد التعديل سيتجاوز إجمالي الدفعات الرسوم السنوية.'});

      const next={...before,
        amount:Number(amount.toFixed(3)),
        payment_date:/^\d{4}-\d{2}-\d{2}$/.test(String(body.payment_date||''))?String(body.payment_date):before.payment_date,
        method:['cash','bank','card'].includes(body.method)?body.method:before.method,
        reference:String(body.reference??before.reference??'').slice(0,120),
        note:String(body.note??before.note??'').slice(0,300),
        edited_at:new Date().toISOString(),
        edited_by:profile?.name||user.email||'admin'
      };
      const {error:updateError}=await sb.from('school_kv').upsert({key,value:next,updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:'key'});
      if(updateError) throw updateError;
      await writeFinanceAudit(sb,user,profile,{action:'payment_updated',receipt_no:receiptNo,student_auth_id:accountId,student_name:before.student_name||'',reason,before,after:next});
      const account=await recalculateAccount(sb,accountId,user.id);
      return res.status(200).json({ok:true,payment:next,account});
    }

    if (body.action === 'void-payment') {
      const receiptNo=String(body.receipt_no||'').trim();
      const reason=String(body.reason||'').trim().slice(0,300);
      if(!receiptNo) return res.status(400).json({error:'رقم الإيصال مطلوب.'});
      if(!reason) return res.status(400).json({error:'اكتب سبب الإلغاء.'});
      const key='finance:payment:'+receiptNo;
      const {data:row,error:rowError}=await sb.from('school_kv').select('value').eq('key',key).maybeSingle();
      if(rowError) throw rowError;
      if(!row?.value) return res.status(404).json({error:'الدفعة غير موجودة.'});
      if(row.value.voided) return res.status(400).json({error:'هذه الدفعة ملغاة مسبقًا.'});
      const before=row.value;
      const next={...before,voided:true,void_reason:reason,voided_at:new Date().toISOString(),voided_by:profile?.name||user.email||'admin'};
      const {error:updateError}=await sb.from('school_kv').upsert({key,value:next,updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:'key'});
      if(updateError) throw updateError;
      await writeFinanceAudit(sb,user,profile,{action:'payment_voided',receipt_no:receiptNo,student_auth_id:before.student_auth_id||'',student_name:before.student_name||'',reason,before,after:next});
      const account=await recalculateAccount(sb,String(before.student_auth_id||''),user.id);
      return res.status(200).json({ok:true,payment:next,account});
    }

    if (body.action === 'list-audit') {
      const {data,error}=await sb.from('school_kv').select('value').like('key','finance:audit:%');
      if(error) throw error;
      let audit=(data||[]).map(r=>r.value||{});
      if(body.student_auth_id) audit=audit.filter(x=>String(x.student_auth_id)===String(body.student_auth_id));
      audit.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
      return res.status(200).json({audit});
    }

    if (body.action === 'list-payments') {
      let q = sb.from('school_kv').select('value').like('key','finance:payment:%');
      const { data, error } = await q;
      if (error) throw error;
      let payments=(data||[]).map(r=>r.value||{}).filter(p=>!p.voided);
      if(body.student_auth_id) payments=payments.filter(p=>String(p.student_auth_id)===String(body.student_auth_id));
      payments.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
      return res.status(200).json({payments});
    }

    if (body.action === 'list-accounts') {
      const { data, error } = await sb.from('school_kv').select('key,value').like('key','finance:account:%');
      if (error) throw error;
      const accounts = (data || []).map(r => r.value || {}).sort((a,b) => String(a.student_name||'').localeCompare(String(b.student_name||''),'ar'));
      return res.status(200).json({ accounts });
    }

    return res.status(400).json({ error: 'عملية غير معروفة.' });
  } catch (e) {
    console.error(e);
    return res.status(e?.status || 500).json({ error: e?.message || 'حدث خطأ في الخادم.' });
  }
}

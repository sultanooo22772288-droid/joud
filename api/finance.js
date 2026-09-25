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
  const installments = Math.max(1, Math.min(12, Math.trunc(Number(row?.installments) || 1)));
  const dueDay = Math.max(1, Math.min(28, Math.trunc(Number(row?.due_day) || 1)));
  const firstDueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(row?.first_due_date || '')) ? String(row.first_due_date) : '';
  return {
    grade,
    annual_fee: Number(annual.toFixed(3)),
    installments,
    installment_amount: Number((annual / installments).toFixed(3)),
    first_due_date: firstDueDate,
    due_day: dueDay
  };
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

      const now = new Date().toISOString();
      const rows = (students || []).filter(s => s.auth_user_id).map(s => {
        const fee = byGrade.get(s.grade) || normalizeRow({}, s.grade || '');
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
            installments: fee.installments,
            installment_amount: fee.installment_amount,
            first_due_date: fee.first_due_date,
            due_day: fee.due_day,
            status: 'active',
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

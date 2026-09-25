import { createClient } from '@supabase/supabase-js';

// إرسال رسائل الغياب عبر WaSenderAPI وتتبّع حالة الاستلام.
// المتغيرات المطلوبة في Vercel:
//   WASENDER_API_KEY         مفتاح API الخاص بجلسة واتساب في WaSender
//   WASENDER_WEBHOOK_SECRET  السر المضبوط في إعدادات Webhook داخل WaSender
// عنوان Webhook في WaSender: https://nakhalschool.com/api/whatsapp

const WASENDER_URL = 'https://www.wasenderapi.com/api/send-message';
const RANK = { pending: 0, failed: 1, sent: 2, delivered: 3, read: 4 };

function normalizeStatus(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const n = Number(value);
    if (n >= 4) return 'read';
    if (n === 3) return 'delivered';
    if (n === 2 || n === 1) return 'sent';
    if (n === 0) return 'failed';
    return null;
  }
  const v = String(value).toLowerCase();
  if (/read|played/.test(v)) return 'read';
  if (/deliver/.test(v)) return 'delivered';
  if (/error|fail/.test(v)) return 'failed';
  if (/sent|server|ack|progress/.test(v)) return 'sent';
  return null;
}

function toWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 8) return '+968' + digits;
  return '+' + digits.replace(/^00/, '');
}

async function readKv(sb, key) {
  const { data, error } = await sb.from('school_kv').select('value').eq('key', key).maybeSingle();
  if (error) throw error;
  return data?.value || null;
}
async function writeKv(sb, key, value) {
  const { error } = await sb.from('school_kv').upsert({ key, value, updated_by: null, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

async function handleWebhook(req, res, sb) {
  const secret = process.env.WASENDER_WEBHOOK_SECRET;
  const signature = req.headers['x-webhook-signature'];
  if (!secret || !signature || signature !== secret) return res.status(401).json({ error: 'Invalid signature' });

  const body = req.body || {};
  const event = String(body.event || '');
  if (!['messages.update', 'message-receipt.update', 'message.sent'].includes(event)) return res.status(200).json({ ok: true, ignored: event });

  const entries = Array.isArray(body.data) ? body.data : (body.data ? [body.data] : []);
  let updated = 0;
  for (const entry of entries) {
    const key = entry?.key || {};
    let status;
    if (event === 'message-receipt.update') {
      const r = entry?.receipt || {};
      status = r.readTimestamp ? 'read' : r.receiptTimestamp ? 'delivered' : normalizeStatus(r.status);
    } else {
      status = normalizeStatus(entry?.update?.status ?? entry?.status);
    }
    if (!status) continue;
    for (const id of [key.msgId, key.id].filter(Boolean).map(String)) {
      const link = await readKv(sb, `wa_msg:${id}`);
      if (!link?.notification_id) continue;
      const statusKey = `wa_status:${link.notification_id}`;
      const current = (await readKv(sb, statusKey)) || {};
      if ((RANK[status] ?? 0) > (RANK[current.status] ?? 0)) {
        await writeKv(sb, statusKey, { ...current, status, updated_at: new Date().toISOString() });
        updated++;
      }
      break;
    }
  }
  return res.status(200).json({ ok: true, updated });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return res.status(500).json({ error: 'Supabase server configuration is missing.' });
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    if (req.headers['x-webhook-signature'] !== undefined) return await handleWebhook(req, res, sb);

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'غير مصرح.' });
    const { data: au, error: ae } = await sb.auth.getUser(token);
    if (ae || !au?.user) return res.status(401).json({ error: 'جلسة الدخول غير صالحة.' });
    const { data: profile } = await sb.from('profiles').select('role').eq('auth_user_id', au.user.id).maybeSingle();
    if (profile?.role !== 'admin') return res.status(403).json({ error: 'هذه العملية للإدارة فقط.' });

    const b = req.body || {};

    if (b.action === 'status') {
      return res.status(200).json({ configured: !!process.env.WASENDER_API_KEY, webhook: !!process.env.WASENDER_WEBHOOK_SECRET });
    }

    if (b.action === 'statuses') {
      const ids = (Array.isArray(b.ids) ? b.ids : []).map(String).slice(0, 1000);
      if (!ids.length) return res.status(200).json({ statuses: {} });
      const { data, error } = await sb.from('school_kv').select('key,value').in('key', ids.map(id => `wa_status:${id}`));
      if (error) throw error;
      const statuses = {};
      (data || []).forEach(r => { statuses[String(r.key).slice('wa_status:'.length)] = r.value; });
      return res.status(200).json({ statuses });
    }

    if (b.action === 'send-finance') {
      const apiKey = process.env.WASENDER_API_KEY;
      if (!apiKey) return res.status(503).json({ error: 'لم يتم ربط واتساب بعد. أضف WASENDER_API_KEY في إعدادات Vercel.', code: 'not_configured' });

      const studentAuthId = String(b.student_auth_id || '').trim();
      if (!studentAuthId) return res.status(400).json({ error: 'student_auth_id مطلوب.' });

      const accountKey = 'finance:account:' + studentAuthId;
      const account = await readKv(sb, accountKey);
      if (!account) return res.status(404).json({ error: 'الحساب المالي للطالب غير موجود.' });

      const annual = Number(account.annual_fee) || 0;
      const paid = Number(account.paid_amount) || 0;
      const balance = Math.max(0, annual - paid);
      if (annual <= 0) return res.status(400).json({ error: 'لا توجد رسوم سنوية محددة لهذا الطالب.' });
      if (balance <= 0) return res.status(400).json({ error: 'تم سداد الرسوم كاملة ولا يوجد مبلغ متبقٍ.' });

      const to = toWhatsAppNumber(account.guardian_phone);
      if (!to) return res.status(400).json({ error: 'رقم ولي الأمر غير موجود.', code: 'no_phone' });

      const fmt = n => Number(n || 0).toFixed(3);
      const text =
        'السلام عليكم ورحمة الله وبركاته 🌷\n\n' +
        'ولي أمر الطالب/ة: *' + (account.student_name || 'الطالب') + '*\n' +
        'نود تذكيركم بالرصيد المتبقي من الرسوم الدراسية السنوية.\n\n' +
        '📚 ' + (account.grade || '') + (account.section ? ' — الشعبة ' + account.section : '') + '\n' +
        '💰 إجمالي الرسوم: ' + fmt(annual) + ' ر.ع\n' +
        '✅ إجمالي المدفوع: ' + fmt(paid) + ' ر.ع\n' +
        '⏳ المبلغ المتبقي: *' + fmt(balance) + ' ر.ع*\n\n' +
        'شاكرين لكم تعاونكم.\nإدارة مدرسة نخل الخاصة 🏫';

      const reminderId = 'FIN-' + studentAuthId + '-' + Date.now();
      const statusKey = 'wa_status:' + reminderId;
      const r = await fetch(WASENDER_URL, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, text })
      });
      const out = await r.json().catch(() => ({}));
      if (r.status === 429) {
        const retry = Number(r.headers.get('retry-after')) || Number(out.retry_after) || 10;
        return res.status(429).json({ error: 'تم تجاوز حد الإرسال، سيُعاد المحاولة.', retry_after: retry });
      }
      if (!r.ok || out.success === false) {
        const message = out.message || out.error || ('HTTP ' + r.status);
        await writeKv(sb, statusKey, { status:'failed', error:String(message).slice(0,300), to, updated_at:new Date().toISOString() });
        return res.status(502).json({ error:'تعذر الإرسال: ' + message });
      }

      const msgId = out?.data?.msgId ?? out?.data?.id ?? null;
      const now = new Date().toISOString();
      await writeKv(sb, 'finance:reminder:' + reminderId, {
        id: reminderId,
        student_auth_id: studentAuthId,
        student_name: account.student_name || '',
        guardian_phone: account.guardian_phone || '',
        annual_fee: annual,
        paid_amount: paid,
        balance,
        message: text,
        sent_at: now,
        sent_by: au.user.id
      });
      await writeKv(sb, statusKey, { status:'sent', msg_id:msgId, to, sent_at:now, updated_at:now, error:'' });
      if (msgId !== null) await writeKv(sb, 'wa_msg:' + msgId, { notification_id: reminderId });
      return res.status(200).json({ ok:true, status:'sent', reminder_id:reminderId, msg_id:msgId });
    }

    if (b.action === 'finance-reminders') {
      const { data, error } = await sb.from('school_kv').select('key,value').like('key','finance:reminder:%');
      if (error) throw error;
      let reminders=(data||[]).map(x=>x.value||{});
      if (b.student_auth_id) reminders=reminders.filter(x=>String(x.student_auth_id)===String(b.student_auth_id));
      reminders.sort((a,b)=>String(b.sent_at||'').localeCompare(String(a.sent_at||'')));
      return res.status(200).json({ reminders });
    }

    if (b.action === 'send') {
      const apiKey = process.env.WASENDER_API_KEY;
      if (!apiKey) return res.status(503).json({ error: 'لم يتم ربط واتساب بعد. أضف WASENDER_API_KEY في إعدادات Vercel.', code: 'not_configured' });

      const nid = String(b.notification_id || '');
      if (!nid) return res.status(400).json({ error: 'notification_id مطلوب.' });
      const { data: n, error: ne } = await sb.from('attendance_notifications').select('*').eq('id', nid).maybeSingle();
      if (ne) throw ne;
      if (!n) return res.status(404).json({ error: 'الرسالة غير موجودة.' });
      const { data: session, error: se } = await sb.from('attendance_sessions').select('approval_status').eq('id', n.session_id).maybeSingle();
      if (se) throw se;
      if (session?.approval_status !== 'approved') return res.status(400).json({ error: 'يجب اعتماد التحضير قبل إرسال الرسائل.' });

      const to = toWhatsAppNumber(n.guardian_phone);
      const statusKey = `wa_status:${nid}`;
      if (!to) {
        await writeKv(sb, statusKey, { status: 'failed', error: 'no_phone', updated_at: new Date().toISOString() });
        return res.status(400).json({ error: 'رقم ولي الأمر غير موجود.', code: 'no_phone' });
      }

      const r = await fetch(WASENDER_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, text: n.message || '' })
      });
      const out = await r.json().catch(() => ({}));
      if (r.status === 429) {
        const retry = Number(r.headers.get('retry-after')) || Number(out.retry_after) || 10;
        return res.status(429).json({ error: 'تم تجاوز حد الإرسال، سيُعاد المحاولة.', retry_after: retry });
      }
      if (!r.ok || out.success === false) {
        const message = out.message || out.error || `HTTP ${r.status}`;
        await writeKv(sb, statusKey, { status: 'failed', error: String(message).slice(0, 300), to, updated_at: new Date().toISOString() });
        return res.status(502).json({ error: 'تعذر الإرسال: ' + message });
      }

      const msgId = out?.data?.msgId ?? out?.data?.id ?? null;
      const now = new Date().toISOString();
      await writeKv(sb, statusKey, { status: 'sent', msg_id: msgId, to, sent_at: now, updated_at: now, error: '' });
      if (msgId !== null) await writeKv(sb, `wa_msg:${msgId}`, { notification_id: nid });
      await sb.from('attendance_notifications').update({ status: 'sent', sent_at: now }).eq('id', nid);
      return res.status(200).json({ ok: true, status: 'sent', msg_id: msgId });
    }

    return res.status(400).json({ error: 'عملية غير معروفة.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message || 'حدث خطأ في الخادم.' });
  }
}

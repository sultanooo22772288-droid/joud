const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!url || !anon || !service) return res.status(500).json({ error: 'Server Supabase configuration is incomplete.' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  const publicClient = createClient(url, anon, { auth: { persistSession: false } });
  const { data: userData, error: userError } = await publicClient.auth.getUser(token);
  if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid session' });

  const caller = userData.user;
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: callerProfile } = await admin.from('profiles').select('role,name,email').eq('auth_user_id', caller.id).maybeSingle();

  const preBody = req.body || {};
  if (preBody.action === 'sync-self') {
    if (!callerProfile) return res.status(403).json({ error: 'Profile not found' });
    return res.status(200).json({ ok: true });
  }

  const isAdmin = callerProfile?.role === 'admin' || (adminEmail && (caller.email || '').toLowerCase() === adminEmail);
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

  async function nextExternalId(role) {
    const { data, error } = await admin.from('profiles').select('external_id').eq('role', role);
    if (error) throw error;
    const max=(data||[]).reduce((m,r)=>{const n=parseInt(String(r.external_id||'').replace(/\D+/g,''),10);return Number.isFinite(n)?Math.max(m,n):m},0);
    return String(max+1);
  }

  // أسماء مستخدمي الطلاب الرقمية: 101001، 101002… تستمر من آخر رقم مستخدم.
  const STUDENT_DOMAIN = 'students.nakhalschool.com';
  const DEFAULT_STUDENT_PASSWORD = '123456';
  const FIRST_STUDENT_NUMBER = 101001;
  function studentNumberFromEmail(email) {
    const m = String(email || '').toLowerCase().match(/^(\d+)@students\.nakhalschool\.com$/);
    return m ? parseInt(m[1], 10) : 0;
  }
  async function nextStudentNumber() {
    const { data, error } = await admin.from('profiles').select('email').eq('role', 'student');
    if (error) throw error;
    const max = (data || []).reduce((m, r) => Math.max(m, studentNumberFromEmail(r.email)), FIRST_STUDENT_NUMBER - 1);
    return max + 1;
  }
  // علامة غير سرية: الحساب ما زال يستخدم الرقم السري الموحد، لتظهر في قائمة الطباعة.
  async function markDefaultPassword(authUserId, password) {
    const key = `default_password:${authUserId}`;
    if (password === DEFAULT_STUDENT_PASSWORD) {
      await admin.from('school_kv').upsert({ key, value: { default: true }, updated_at: new Date().toISOString() });
    } else {
      await admin.from('school_kv').delete().eq('key', key);
    }
  }

  const body = req.body || {};
  const action = body.action;

  try {
    if (action === 'credentials-list') {
      const { data, error } = await admin
        .from('profiles')
        .select('auth_user_id,role,name,email')
        .in('role',['student','teacher']);
      if (error) throw error;
      const { data: flags, error: flagError } = await admin.from('school_kv').select('key').like('key', 'default_password:%');
      if (flagError) throw flagError;
      const defaults = new Set((flags || []).map(x => String(x.key).slice('default_password:'.length)));
      return res.status(200).json({
        credentials:(data||[]).map(x=>({
          auth_user_id:x.auth_user_id,
          role:x.role,
          name:x.name||'',
          email:x.email||'',
          password:'',
          default_password:defaults.has(String(x.auth_user_id))
        }))
      });
    }

    if (action === 'bootstrap-self') {
      if (!adminEmail || (caller.email || '').toLowerCase() !== adminEmail) return res.status(403).json({ error: 'Not bootstrap admin' });
      const { data, error } = await admin.from('profiles').upsert({
        auth_user_id: caller.id, role: 'admin', name: 'إدارة المدرسة', email: caller.email
      }, { onConflict: 'auth_user_id' }).select().single();
      if (error) throw error;
      return res.status(200).json({ profile: data });
    }

    if (action === 'create') {
      const p = body.profile || {};
      if (!['student','teacher'].includes(p.role)) return res.status(400).json({ error: 'Invalid role' });
      if (p.role === 'student' && p.auto_username) p.email = `${await nextStudentNumber()}@${STUDENT_DOMAIN}`;
      if (p.role === 'student' && !body.password) body.password = DEFAULT_STUDENT_PASSWORD;
      if (!p.email || !body.password) return res.status(400).json({ error: 'Email and password are required' });
      const email = String(p.email).trim().toLowerCase();
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email, password: String(body.password), email_confirm: true,
        user_metadata: { role: p.role, name: p.name || '' }
      });
      if (createError) throw createError;
      const row = {
        auth_user_id: created.user.id, role: p.role, name: p.name || '', phone: p.phone || '', guardian_phone: p.guardian_phone || '', email,
        external_id: await nextExternalId(p.role), stage: p.stage || '', grade: p.grade || '', section: p.section || '',
        subject: p.subject || '', stages: Array.isArray(p.stages) ? p.stages : []
      };
      const { data: profile, error: profileError } = await admin.from('profiles').insert(row).select().single();
      if (profileError) {
        await admin.auth.admin.deleteUser(created.user.id);
        throw profileError;
      }
      if (p.role === 'student') await markDefaultPassword(created.user.id, String(body.password));
      return res.status(200).json({ profile });
    }

    if (action === 'bulk-create') {
      const role=body.role, users=Array.isArray(body.users)?body.users:[];
      if(!['student','teacher'].includes(role)) return res.status(400).json({error:'Invalid role'});
      if(!users.length) return res.status(400).json({error:'No users'});
      if(users.length>500) return res.status(400).json({error:'Maximum 500 users per import'});

      const {data:existing,error:exErr}=await admin.from('profiles').select('email,external_id').eq('role',role);
      if(exErr) throw exErr;
      const emails=new Set((existing||[]).map(x=>String(x.email||'').toLowerCase()));
      let next=(existing||[]).reduce((m,r)=>{const n=parseInt(String(r.external_id||'').replace(/\D+/g,''),10);return Number.isFinite(n)?Math.max(m,n):m},0)+1;
      const created=[],errors=[];
      let nextNumber=role==='student'?await nextStudentNumber():0;

      for(let i=0;i<users.length;i++){
        const item=users[i]||{},p={...(item.profile||{}),role};
        if(role==='student'&&p.auto_username){
          while(emails.has(`${nextNumber}@${STUDENT_DOMAIN}`)) nextNumber++;
          p.email=`${nextNumber++}@${STUDENT_DOMAIN}`;
        }
        const password=String(item.password||(role==='student'?DEFAULT_STUDENT_PASSWORD:'')),email=String(p.email||'').trim().toLowerCase();
        if(!p.name||!email||!password){errors.push({index:i,email,error:'Missing required data'});continue}
        if(emails.has(email)){errors.push({index:i,email,error:'Email already exists'});continue}
        let authId=null;
        try{
          const {data:u,error:ue}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{role,name:p.name||''}});
          if(ue) throw ue; authId=u.user.id;
          const row={auth_user_id:authId,role,name:p.name||'',phone:p.phone||'',guardian_phone:p.guardian_phone||'',email,external_id:String(next++),stage:p.stage||'',grade:p.grade||'',section:p.section||'',subject:p.subject||'',stages:Array.isArray(p.stages)?p.stages:[]};
          const {data:saved,error:se}=await admin.from('profiles').insert(row).select().single();
          if(se){await admin.auth.admin.deleteUser(authId);throw se}
          if(role==='student') await markDefaultPassword(authId,password);
          emails.add(email);created.push(saved);
        }catch(e){errors.push({index:i,email,error:e?.message||String(e)})}
      }
      return res.status(200).json({created,errors});
    }

    if (action === 'update') {
      const p = body.profile || {};
      if (!p.auth_user_id) return res.status(400).json({ error: 'auth_user_id is required' });
      const authPatch = {};
      if (p.email) authPatch.email = String(p.email).trim().toLowerCase();
      if (body.password) authPatch.password = String(body.password);
      if (Object.keys(authPatch).length) {
        const { error } = await admin.auth.admin.updateUserById(p.auth_user_id, authPatch);
        if (error) throw error;
      }
      const row = {
        name: p.name || '', phone: p.phone || '', guardian_phone: p.guardian_phone || '', email: p.email || '', external_id: p.external_id || '',
        stage: p.stage || '', grade: p.grade || '', section: p.section || '', subject: p.subject || '',
        stages: Array.isArray(p.stages) ? p.stages : []
      };
      const { data: profile, error } = await admin.from('profiles').update(row).eq('auth_user_id', p.auth_user_id).select().single();
      if (error) throw error;
      if (body.password && profile?.role === 'student') await markDefaultPassword(p.auth_user_id, String(body.password));
      return res.status(200).json({ profile });
    }

    if (action === 'delete') {
      if (!body.auth_user_id) return res.status(400).json({ error: 'auth_user_id is required' });
      const authUserId=body.auth_user_id;
      const { error } = await admin.auth.admin.deleteUser(authUserId);
      if (error) throw error;
      await admin.from('school_kv').delete().in('key',[`login_credential:${authUserId}`,`default_password:${authUserId}`]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(400).json({ error: e.message || String(e) });
  }
};

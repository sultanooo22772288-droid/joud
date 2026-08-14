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

  async function saveCredentialRecord(authUserId, role, name, email, password, preservePassword=false) {
    const key=`login_credential:${authUserId}`;
    let previousPassword='';
    if(preservePassword){
      const {data:old}=await admin.from('school_kv').select('value').eq('key',key).maybeSingle();
      previousPassword=old?.value?.password||'';
    }
    const value={
      auth_user_id:authUserId,
      role:role||'',
      name:name||'',
      email:email||'',
      password:password || previousPassword || '',
      updated_at:new Date().toISOString()
    };
    const {error}=await admin.from('school_kv').upsert({
      key,value,updated_by:caller.id,updated_at:new Date().toISOString()
    },{onConflict:'key'});
    if(error) throw error;
    return value;
  }

  const preBody = req.body || {};
  if(preBody.action==='sync-self'){
    if(!callerProfile) return res.status(403).json({error:'Profile not found'});
    const email=String(preBody.email||caller.email||callerProfile.email||'').trim().toLowerCase();
    const password=String(preBody.password||'');
    await saveCredentialRecord(caller.id,callerProfile.role,callerProfile.name,email,password,!password);
    return res.status(200).json({ok:true});
  }

  const isAdmin = callerProfile?.role === 'admin' || (adminEmail && (caller.email || '').toLowerCase() === adminEmail);
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

  async function nextExternalId(role) {
    const { data, error } = await admin.from('profiles').select('external_id').eq('role', role);
    if (error) throw error;
    const max=(data||[]).reduce((m,r)=>{const n=parseInt(String(r.external_id||'').replace(/\D+/g,''),10);return Number.isFinite(n)?Math.max(m,n):m},0);
    return String(max+1);
  }

  const body = req.body || {};
  const action = body.action;

  try {
    if (action === 'credentials-list') {
      const {data,error}=await admin.from('school_kv').select('key,value').like('key','login_credential:%');
      if(error) throw error;
      return res.status(200).json({credentials:(data||[]).map(x=>x.value)});
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
      if (!p.email || !body.password) return res.status(400).json({ error: 'Email and password are required' });
      const email = String(p.email).trim().toLowerCase();
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email, password: String(body.password), email_confirm: true,
        user_metadata: { role: p.role, name: p.name || '' }
      });
      if (createError) throw createError;
      const row = {
        auth_user_id: created.user.id, role: p.role, name: p.name || '', phone: p.phone || '', email,
        external_id: await nextExternalId(p.role), stage: p.stage || '', grade: p.grade || '', section: p.section || '',
        subject: p.subject || '', stages: Array.isArray(p.stages) ? p.stages : []
      };
      const { data: profile, error: profileError } = await admin.from('profiles').insert(row).select().single();
      if (profileError) {
        await admin.auth.admin.deleteUser(created.user.id);
        throw profileError;
      }
      await saveCredentialRecord(created.user.id,p.role,p.name||'',email,String(body.password||''),false);
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

      for(let i=0;i<users.length;i++){
        const item=users[i]||{},p={...(item.profile||{}),role},password=String(item.password||''),email=String(p.email||'').trim().toLowerCase();
        if(!p.name||!email||!password){errors.push({index:i,email,error:'Missing required data'});continue}
        if(emails.has(email)){errors.push({index:i,email,error:'Email already exists'});continue}
        let authId=null;
        try{
          const {data:u,error:ue}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{role,name:p.name||''}});
          if(ue) throw ue; authId=u.user.id;
          const row={auth_user_id:authId,role,name:p.name||'',phone:p.phone||'',email,external_id:String(next++),stage:p.stage||'',grade:p.grade||'',section:p.section||'',subject:p.subject||'',stages:Array.isArray(p.stages)?p.stages:[]};
          const {data:saved,error:se}=await admin.from('profiles').insert(row).select().single();
          if(se){await admin.auth.admin.deleteUser(authId);throw se}
          await saveCredentialRecord(authId,role,p.name||'',email,password,false);
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
        name: p.name || '', phone: p.phone || '', email: p.email || '', external_id: p.external_id || '',
        stage: p.stage || '', grade: p.grade || '', section: p.section || '', subject: p.subject || '',
        stages: Array.isArray(p.stages) ? p.stages : []
      };
      const { data: profile, error } = await admin.from('profiles').update(row).eq('auth_user_id', p.auth_user_id).select().single();
      if (error) throw error;
      await saveCredentialRecord(
        p.auth_user_id,
        profile.role||p.role||'',
        profile.name||p.name||'',
        profile.email||p.email||'',
        String(body.password||''),
        !body.password
      );
      return res.status(200).json({ profile });
    }

    if (action === 'delete') {
      if (!body.auth_user_id) return res.status(400).json({ error: 'auth_user_id is required' });
      const authUserId=body.auth_user_id;
      const { error } = await admin.auth.admin.deleteUser(authUserId);
      if (error) throw error;
      await admin.from('school_kv').delete().eq('key',`login_credential:${authUserId}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(400).json({ error: e.message || String(e) });
  }
};

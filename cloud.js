(function(){
  let client=null, cfg=null;

  async function init(){
    if(client) return client;
    const r=await fetch('/api/config',{cache:'no-store'});
    if(!r.ok) throw new Error('تعذر تحميل إعدادات Supabase من Vercel.');
    cfg=await r.json();
    if(!window.supabase?.createClient) throw new Error('مكتبة Supabase غير محملة.');
    client=window.supabase.createClient(cfg.url,cfg.anonKey);
    return client;
  }

  function toLegacyProfile(p){
    if(!p) return null;
    const base={
      id:Number(p.id), authUserId:p.auth_user_id, name:p.name||'', phone:p.phone||'', email:p.email||'',
      password:'', role:p.role
    };
    if(p.role==='student') return {...base,studentId:p.external_id||'',stage:p.stage||'',grade:p.grade||'',section:p.section||''};
    if(p.role==='teacher') return {...base,teacherId:p.external_id||'',subject:p.subject||'',stages:Array.isArray(p.stages)?p.stages:[]};
    return base;
  }

  async function signIn(email,password){
    const c=await init();
    const {data,error}=await c.auth.signInWithPassword({email,password});
    if(error) throw error;
    let {data:profile,error:pe}=await c.from('profiles').select('*').eq('auth_user_id',data.user.id).maybeSingle();
    if(pe) throw pe;
    if(!profile && cfg.adminEmail && (data.user.email||'').toLowerCase()===cfg.adminEmail){
      const x=await adminRequest({action:'bootstrap-self'});
      profile=x.profile;
    }
    if(!profile) throw new Error('الحساب موجود في المصادقة لكن لا توجد له بيانات مستخدم في المنصة.');
    return {session:data.session,user:data.user,profile:toLegacyProfile(profile)};
  }

  async function signOut(){
    const c=await init();
    await c.auth.signOut();
  }

  async function getAccessToken(){
    const c=await init();
    const {data}=await c.auth.getSession();
    return data.session?.access_token||'';
  }

  async function adminRequest(payload){
    const token=await getAccessToken();
    const r=await fetch('/api/admin-user',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify(payload)
    });
    const out=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(out.error||'تعذر تنفيذ العملية السحابية.');
    return out;
  }

  async function loadProfiles(){
    const c=await init();
    const {data,error}=await c.from('profiles').select('*').order('id',{ascending:true});
    if(error) throw error;
    return (data||[]).map(toLegacyProfile);
  }

  async function createUser(role,legacy,password){
    const p={role,name:legacy.name||'',phone:legacy.phone||'',email:legacy.email||'',
      external_id:role==='student'?(legacy.studentId||''):(legacy.teacherId||''),
      stage:legacy.stage||'',grade:legacy.grade||'',section:legacy.section||'',subject:legacy.subject||'',stages:legacy.stages||[]};
    const out=await adminRequest({action:'create',profile:p,password});
    return toLegacyProfile(out.profile);
  }

  async function updateUser(legacy,password){
    const p={auth_user_id:legacy.authUserId,name:legacy.name||'',phone:legacy.phone||'',email:legacy.email||'',
      external_id:legacy.role==='student'?(legacy.studentId||''):(legacy.teacherId||''),
      stage:legacy.stage||'',grade:legacy.grade||'',section:legacy.section||'',subject:legacy.subject||'',stages:legacy.stages||[]};
    const out=await adminRequest({action:'update',profile:p,password:password||''});
    return toLegacyProfile(out.profile);
  }

  async function deleteUser(authUserId){ return adminRequest({action:'delete',auth_user_id:authUserId}); }

  window.NabdCloud={init,signIn,signOut,loadProfiles,createUser,updateUser,deleteUser,get config(){return cfg;}};
})();

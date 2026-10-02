const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const url=process.env.SUPABASE_URL;
  const anon=process.env.SUPABASE_ANON_KEY;
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!anon||!service) return res.status(500).json({error:'Server Supabase configuration is incomplete.'});

  const authHeader=req.headers.authorization||'';
  const token=authHeader.startsWith('Bearer ')?authHeader.slice(7):'';
  if(!token) return res.status(401).json({error:'Missing access token'});

  const pub=createClient(url,anon,{auth:{persistSession:false}});
  const {data:userData,error:userError}=await pub.auth.getUser(token);
  if(userError||!userData?.user) return res.status(401).json({error:'Invalid session'});

  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const user=userData.user;
  const {data:profile,error:profileError}=await admin.from('profiles')
    .select('auth_user_id,role,name,email,subject,stages')
    .eq('auth_user_id',user.id).maybeSingle();
  if(profileError) return res.status(500).json({error:profileError.message});
  if(!profile) return res.status(404).json({error:'Profile not found'});

  const action=(req.body||{}).action;

  // منهج التحضير: الوحدات والدروس تحفظ لكل مادة + صف.
  if(action==='curriculum'){
    const subject=String((req.body||{}).subject||'').trim();
    const grades=Array.isArray((req.body||{}).grades)?req.body.grades.map(x=>String(x||'').trim()).filter(Boolean):[];
    if(!subject||!grades.length) return res.status(400).json({error:'المادة والصف مطلوبة'});

    if(profile.role==='teacher'){
      const mapKey='teacher_subject_assignments:'+user.id;
      const {data:mapRow,error:mapErr}=await admin.from('school_kv').select('value').eq('key',mapKey).maybeSingle();
      if(mapErr) return res.status(500).json({error:mapErr.message});
      const assignments=Array.isArray(mapRow?.value?.assignments)?mapRow.value.assignments:[];
      const a=assignments.find(x=>String(x.subject||'')===subject);
      const allowed=new Set((a?.classes||[]).map(x=>String(x.grade||'')));
      if(!a||grades.some(g=>!allowed.has(g))) return res.status(403).json({error:'هذه المادة أو الصف غير مسند للمعلم'});
    }else if(profile.role!=='admin'){
      return res.status(403).json({error:'غير مصرح'});
    }

    const norm=s=>String(s||'').trim().replace(/\s+/g,' ');
    // اقرأ سجلات المناهج ثم طابق المادة والصف من داخل القيمة نفسها.
    // هذا أكثر ثباتًا من الاعتماد على شكل ترميز المفتاح العربي (%D8...) فقط.
    const {data:rows,error:rowsError}=await admin.from('school_kv')
      .select('key,value')
      .like('key','preparation_curriculum:%');
    if(rowsError) return res.status(500).json({error:rowsError.message});

    const wantedSubject=norm(subject);
    const curriculum=grades.map(g=>{
      const wantedGrade=norm(g);
      const row=(rows||[]).find(r=>{
        const v=r?.value||{};
        if(norm(v.subject)===wantedSubject && norm(v.grade)===wantedGrade) return true;
        // توافق رجعي مع السجلات القديمة حتى لو لم تكن subject/grade داخل value.
        const raw=String(r?.key||'').replace(/^preparation_curriculum:/,'');
        const cut=raw.lastIndexOf(':');
        if(cut<0) return false;
        try{
          const keySubject=norm(decodeURIComponent(raw.slice(0,cut)));
          const keyGrade=norm(decodeURIComponent(raw.slice(cut+1)));
          return keySubject===wantedSubject && keyGrade===wantedGrade;
        }catch(_e){ return false; }
      });
      const value=row?.value||{};
      return {grade:g,units:Array.isArray(value.units)?value.units:[]};
    });
    return res.status(200).json({subject,curriculum});
  }

  if(action==='save-curriculum'){
    if(profile.role!=='admin') return res.status(403).json({error:'Admin access required'});
    const subject=String((req.body||{}).subject||'').trim();
    const grade=String((req.body||{}).grade||'').trim();
    const units=Array.isArray((req.body||{}).units)?req.body.units:[];
    if(!subject||!grade) return res.status(400).json({error:'المادة والصف مطلوبة'});
    const cleanUnits=units.map((u,i)=>({
      id:String(u?.id||('u'+(i+1))),
      title:String(u?.title||'').trim(),
      lessons:Array.isArray(u?.lessons)?u.lessons.map((l,j)=>({id:String(l?.id||('l'+(j+1))),title:String(l?.title||'').trim()})).filter(l=>l.title):[]
    })).filter(u=>u.title);
    const key='preparation_curriculum:'+encodeURIComponent(subject)+':'+encodeURIComponent(grade);
    const value={subject,grade,units:cleanUnits,updatedAt:new Date().toISOString()};
    const {error:saveError}=await admin.from('school_kv').upsert({key,value,updated_by:user.id,updated_at:new Date().toISOString()});
    if(saveError) return res.status(500).json({error:saveError.message});
    return res.status(200).json({ok:true,value});
  }
  if(action==='mark-viewed'){
    if(profile.role!=='admin') return res.status(403).json({error:'Admin access required'});
    const teacherId=String((req.body||{}).teacher_auth_user_id||'').trim();
    if(!teacherId) return res.status(400).json({error:'Teacher is required'});
    const key='teacher_latest_preparation:'+teacherId;
    const {data:row,error:readError}=await admin.from('school_kv').select('value').eq('key',key).maybeSingle();
    if(readError) return res.status(500).json({error:readError.message});
    if(!row?.value) return res.status(404).json({error:'لا يوجد تحضير مرسل لهذا المعلم'});
    const value={...row.value,status:'viewed',viewedAt:new Date().toISOString(),viewedBy:profile.name||''};
    const {error:saveError}=await admin.from('school_kv').upsert({key,value,updated_at:new Date().toISOString()});
    if(saveError) return res.status(500).json({error:saveError.message});
    return res.status(200).json({ok:true,value});
  }
  if(action!=='context') return res.status(400).json({error:'Unsupported action'});

  if(profile.role==='teacher'){
    const key='teacher_subject_assignments:'+user.id;
    const {data:kv,error:kvError}=await admin.from('school_kv').select('value').eq('key',key).maybeSingle();
    if(kvError) return res.status(500).json({error:kvError.message});
    let assignments=Array.isArray(kv?.value?.assignments)?kv.value.assignments:[];
    if(!assignments.length && profile.subject){
      const classes=(Array.isArray(profile.stages)?profile.stages:[]).map(s=>{
        const m=String(s).match(/—\s*([^—]+?)\s*—\s*الشعبة\s*\(([^)]+)\)/);
        return m?{grade:m[1].trim(),section:m[2].trim(),stage:String(s)}:null;
      }).filter(Boolean);
      assignments=[{subject:profile.subject,classes}];
    }
    return res.status(200).json({
      teacher:{name:profile.name,email:profile.email},
      assignments
    });
  }

  if(profile.role==='admin'){
    const requestedTeacher=String((req.body||{}).teacher_auth_user_id||'').trim();
    if(requestedTeacher){
      const {data:tp,error:tpe}=await admin.from('profiles').select('auth_user_id,name,email,subject,stages').eq('auth_user_id',requestedTeacher).eq('role','teacher').maybeSingle();
      if(tpe) return res.status(500).json({error:tpe.message});
      if(!tp) return res.status(404).json({error:'Teacher not found'});
      const {data:prepKv}=await admin.from('school_kv').select('value').eq('key','teacher_latest_preparation:'+requestedTeacher).maybeSingle();
      return res.status(200).json({teacher:{name:tp.name,email:tp.email},latestPreparation:prepKv?.value||null});
    }

    const {data:teachers,error:teachersError}=await admin.from('profiles')
      .select('auth_user_id,name,email,subject,stages').eq('role','teacher').order('name',{ascending:true});
    if(teachersError) return res.status(500).json({error:teachersError.message});

    const ids=(teachers||[]).map(t=>t.auth_user_id);
    let kvRows=[];
    if(ids.length){
      const {data:kvs,error:kvsError}=await admin.from('school_kv').select('key,value').like('key','teacher_subject_assignments:%');
      if(kvsError) return res.status(500).json({error:kvsError.message});
      kvRows=kvs||[];
    }
    const map=new Map(kvRows.map(x=>[String(x.key).replace('teacher_subject_assignments:',''),x.value||{}]));
    const result=(teachers||[]).map(t=>{
      let assignments=Array.isArray(map.get(t.auth_user_id)?.assignments)?map.get(t.auth_user_id).assignments:[];
      if(!assignments.length&&t.subject){
        const classes=(Array.isArray(t.stages)?t.stages:[]).map(s=>{
          const m=String(s).match(/—\\s*([^—]+?)\\s*—\\s*الشعبة\\s*\\(([^)]+)\\)/);
          return m?{grade:m[1].trim(),section:m[2].trim(),stage:String(s)}:null;
        }).filter(Boolean);
        assignments=[{subject:t.subject,classes}];
      }
      return {authUserId:t.auth_user_id,name:t.name,email:t.email,assignments,latestPreparation:null};
    });
    return res.status(200).json({teacher:{name:profile.name,email:profile.email},teachers:result});
  }

  return res.status(403).json({error:'This section is available to teachers and admin only'});
};
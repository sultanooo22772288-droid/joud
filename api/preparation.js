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
    const wantedSubject=norm(subject);

    const curriculum=[];
    for(const g of grades){
      const wantedGrade=norm(g);

      // ابحث أولاً داخل JSON نفسه؛ هذا يتجنب أي مشكلة في ترميز المفتاح العربي.
      let {data:row,error:rowError}=await admin.from('school_kv')
        .select('key,value')
        .like('key','preparation_curriculum:%')
        .contains('value',{subject:wantedSubject,grade:wantedGrade})
        .limit(1)
        .maybeSingle();
      if(rowError) return res.status(500).json({error:rowError.message});

      // توافق احتياطي مع السجلات القديمة.
      if(!row){
        const exactKey='preparation_curriculum:'+encodeURIComponent(wantedSubject)+':'+encodeURIComponent(wantedGrade);
        const exact=await admin.from('school_kv').select('key,value').eq('key',exactKey).maybeSingle();
        if(exact.error) return res.status(500).json({error:exact.error.message});
        row=exact.data||null;
      }

      const value=row?.value||{};
      const allUnits=Array.isArray(value.units)?value.units:[];
      // التحضير في منصة جود مخصص حاليًا للفصل الدراسي الأول فقط.
      // نخفي أي وحدات موسومة صراحة بأنها من الفصل/الفصل الدراسي الثاني.
      const firstTermUnits=allUnits.filter(u=>{
        const title=String(u?.title||'').trim();
        return !/(الفصل\s*(الدراسي\s*)?الثاني|semester\s*2|term\s*2)/i.test(title);
      });
      curriculum.push({grade:g,units:firstTermUnits});
    }
    return res.status(200).json({subject,curriculum,term:'first'});
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

  const prepRecordKey=(teacherId,recordId)=>'teacher_preparation:'+teacherId+':'+recordId;
  const cleanPrepPayload=(p={})=>({
    recordId:String(p.recordId||'').trim(),
    subject:String(p.subject||'').trim(),
    grade:String(p.grade||'').trim(),
    unit:String(p.unit||'').trim(),
    lesson:String(p.lesson||'').trim(),
    date:String(p.date||'').trim(),
    period:String(p.period||'').trim(),
    sections:Array.isArray(p.sections)?p.sections.map(x=>String(x||'').trim()).filter(Boolean):[],
    fields:{
      outcomeNums:String(p.fields?.outcomeNums||'').trim(),
      prior:String(p.fields?.prior||'').trim(),
      intro:String(p.fields?.intro||'').trim(),
      concepts:String(p.fields?.concepts||'').trim(),
      objectives:String(p.fields?.objectives||'').trim(),
      strategies:Array.isArray(p.fields?.strategies)?p.fields.strategies.map(x=>String(x||'').trim()).filter(Boolean):[],
      strategyOther:String(p.fields?.strategyOther||'').trim(),
      activities:String(p.fields?.activities||'').trim(),
      resources:String(p.fields?.resources||'').trim(),
      teacherNotes:String(p.fields?.teacherNotes||'').trim(),
      formative:String(p.fields?.formative||'').trim(),
      enrichment:String(p.fields?.enrichment||'').trim(),
      summative:String(p.fields?.summative||'').trim(),
      homework:String(p.fields?.homework||'').trim()
    }
  });

  if(action==='get-record'){
    if(profile.role!=='teacher') return res.status(403).json({error:'Teacher access required'});
    const recordId=String((req.body||{}).recordId||'').trim();
    if(!recordId) return res.status(400).json({error:'Record id is required'});
    const {data:row,error:e}=await admin.from('school_kv').select('value').eq('key',prepRecordKey(user.id,recordId)).maybeSingle();
    if(e) return res.status(500).json({error:e.message});
    return res.status(200).json({ok:true,preparation:row?.value||null});
  }

  if(action==='save-preparation'||action==='send-preparation'){
    if(profile.role!=='teacher') return res.status(403).json({error:'Teacher access required'});
    const p=cleanPrepPayload((req.body||{}).preparation||{});
    if(!p.recordId||!p.subject||!p.grade||!p.unit||!p.lesson||!p.date) return res.status(400).json({error:'بيانات التحضير ناقصة'});

    const mapKey='teacher_subject_assignments:'+user.id;
    const {data:mapRow,error:mapErr}=await admin.from('school_kv').select('value').eq('key',mapKey).maybeSingle();
    if(mapErr) return res.status(500).json({error:mapErr.message});
    const assignments=Array.isArray(mapRow?.value?.assignments)?mapRow.value.assignments:[];
    const a=assignments.find(x=>String(x.subject||'').trim()===p.subject);
    const allowedClasses=(a?.classes||[]).filter(x=>String(x.grade||'').trim()===p.grade);
    const allowedSections=new Set(allowedClasses.map(x=>String(x.section||'').trim()));
    if(!a||!allowedClasses.length||p.sections.some(s=>!allowedSections.has(s))) return res.status(403).json({error:'هذه المادة أو الصف أو الشعبة غير مسندة للمعلم'});

    const key=prepRecordKey(user.id,p.recordId);
    const {data:existing,error:readErr}=await admin.from('school_kv').select('value').eq('key',key).maybeSingle();
    if(readErr) return res.status(500).json({error:readErr.message});
    if(existing?.value?.status==='viewed') return res.status(409).json({error:'تم الاطلاع على هذا التحضير من الإدارة، ولا يمكن تعديله بعد الآن.',locked:true});

    const now=new Date().toISOString();
    const previous=existing?.value||{};
    const status=action==='send-preparation'?'sent':(previous.status==='sent'?'sent':'saved');
    const value={
      ...previous,...p,
      teacherId:user.id,
      teacherName:profile.name||'',
      title:p.lesson,
      displayName:p.unit+' — '+p.lesson+' — '+p.date,
      status,
      createdAt:previous.createdAt||now,
      savedAt:now,
      sentAt:action==='send-preparation'?(previous.sentAt||now):previous.sentAt||null,
      viewedAt:null,
      viewedBy:null
    };
    const {error:saveErr}=await admin.from('school_kv').upsert({key,value,updated_by:user.id,updated_at:now});
    if(saveErr) return res.status(500).json({error:saveErr.message});

    if(status==='sent'){
      const latestKey='teacher_latest_preparation:'+user.id;
      const {error:latestErr}=await admin.from('school_kv').upsert({key:latestKey,value,updated_by:user.id,updated_at:now});
      if(latestErr) return res.status(500).json({error:latestErr.message});
    }
    return res.status(200).json({ok:true,value});
  }

  if(action==='mark-viewed'){
    if(profile.role!=='admin') return res.status(403).json({error:'Admin access required'});
    const teacherId=String((req.body||{}).teacher_auth_user_id||'').trim();
    const recordId=String((req.body||{}).recordId||'').trim();
    if(!teacherId) return res.status(400).json({error:'Teacher is required'});
    const latestKey='teacher_latest_preparation:'+teacherId;
    const recordKey=recordId?prepRecordKey(teacherId,recordId):null;
    let row=null;
    if(recordKey){
      const r=await admin.from('school_kv').select('value').eq('key',recordKey).maybeSingle();
      if(r.error) return res.status(500).json({error:r.error.message});
      row=r.data;
    }else{
      const r=await admin.from('school_kv').select('value').eq('key',latestKey).maybeSingle();
      if(r.error) return res.status(500).json({error:r.error.message});
      row=r.data;
    }
    if(!row?.value) return res.status(404).json({error:'لا يوجد تحضير مرسل لهذا المعلم'});
    const now=new Date().toISOString();
    const value={...row.value,status:'viewed',viewedAt:now,viewedBy:profile.name||''};
    const actualRecordKey=prepRecordKey(teacherId,value.recordId);
    const {error:recordErr}=await admin.from('school_kv').upsert({key:actualRecordKey,value,updated_at:now});
    if(recordErr) return res.status(500).json({error:recordErr.message});
    const {data:latest}=await admin.from('school_kv').select('value').eq('key',latestKey).maybeSingle();
    if(latest?.value?.recordId===value.recordId){
      const {error:latestErr}=await admin.from('school_kv').upsert({key:latestKey,value,updated_at:now});
      if(latestErr) return res.status(500).json({error:latestErr.message});
    }
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
      const {data:prepRows,error:prepRowsErr}=await admin.from('school_kv').select('value').like('key','teacher_preparation:'+requestedTeacher+':%');
      if(prepRowsErr) return res.status(500).json({error:prepRowsErr.message});
      const preparations=(prepRows||[]).map(x=>x.value).filter(x=>x&&['sent','viewed'].includes(x.status)).sort((a,b)=>String(b.sentAt||b.savedAt||'').localeCompare(String(a.sentAt||a.savedAt||'')));
      return res.status(200).json({teacher:{name:tp.name,email:tp.email},latestPreparation:prepKv?.value||null,preparations});
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
    const {data:latestRows,error:latestRowsErr}=await admin.from('school_kv').select('key,value').like('key','teacher_latest_preparation:%');
    if(latestRowsErr) return res.status(500).json({error:latestRowsErr.message});
    const latestMap=new Map((latestRows||[]).map(x=>[String(x.key).replace('teacher_latest_preparation:',''),x.value||null]));
    const result=(teachers||[]).map(t=>{
      let assignments=Array.isArray(map.get(t.auth_user_id)?.assignments)?map.get(t.auth_user_id).assignments:[];
      if(!assignments.length&&t.subject){
        const classes=(Array.isArray(t.stages)?t.stages:[]).map(s=>{
          const m=String(s).match(/—\\s*([^—]+?)\\s*—\\s*الشعبة\\s*\\(([^)]+)\\)/);
          return m?{grade:m[1].trim(),section:m[2].trim(),stage:String(s)}:null;
        }).filter(Boolean);
        assignments=[{subject:t.subject,classes}];
      }
      return {authUserId:t.auth_user_id,name:t.name,email:t.email,assignments,latestPreparation:latestMap.get(t.auth_user_id)||null};
    });
    return res.status(200).json({teacher:{name:profile.name,email:profile.email},teachers:result});
  }

  return res.status(403).json({error:'This section is available to teachers and admin only'});
};
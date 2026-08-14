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


  async function reportRequest(payload){
    const token=await getAccessToken();
    const r=await fetch('/api/report',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify(payload)
    });
    const out=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(out.error||'تعذر تنفيذ عملية التقرير.');
    return out;
  }

  async function saveStudentReport(payload){
    const out=await reportRequest({action:'save',...payload});
    return out.report;
  }

  async function myStudentReports(){
    const out=await reportRequest({action:'list-my'});
    return out.reports||[];
  }

  async function myStudentReportBundle(){
    const out=await reportRequest({action:'list-my'});
    return {profile:out.profile||null,reports:out.reports||[]};
  }

  async function getTeacherStudentReport(studentAuthId,subject){
    const out=await reportRequest({action:'get-for-teacher',student_auth_id:studentAuthId,subject});
    return out.report||null;
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
    return (data||[]).map(toLegacyProfile).sort((a,b)=>(a.name||'').localeCompare(b.name||'','ar'));
  }

  async function bulkCreateUsers(role,users){ return adminRequest({action:'bulk-create',role,users}); }

  async function loadAdminCredentials(){
    const out=await adminRequest({action:'credentials-list'});
    return out.credentials||[];
  }

  async function syncOwnCredential(email,password){
    return adminRequest({action:'sync-self',email,password});
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


  async function currentUser(){
    const c=await init();
    const {data,error}=await c.auth.getUser();
    if(error) throw error;
    return data.user||null;
  }

  function safeFileName(name){
    return String(name||'file').replace(/[^\p{L}\p{N}._-]+/gu,'_').slice(-140);
  }

  async function uploadSchoolFile(file,folder='homeworks'){
    const c=await init();
    const user=await currentUser();
    if(!user) throw new Error('يجب تسجيل الدخول أولاً.');
    const path=`${folder}/${user.id}/${Date.now()}_${safeFileName(file.name)}`;
    const {error}=await c.storage.from('school-files').upload(path,file,{
      upsert:false,
      contentType:file.type||undefined
    });
    if(error) throw error;
    return {path,name:file.name,size:file.size,type:file.type||'',uploadedAt:new Date().toISOString()};
  }

  async function signedSchoolFileUrl(path,expires=3600){
    const c=await init();
    const {data,error}=await c.storage.from('school-files').createSignedUrl(path,expires);
    if(error) throw error;
    return data.signedUrl;
  }

  async function createInteractiveHomework(payload){
    const c=await init();
    const user=await currentUser();
    if(!user) throw new Error('يجب تسجيل الدخول أولاً.');
    const row={
      teacher_id:user.id,
      teacher_name:payload.teacher_name||'معلم',
      title:payload.title||'واجب',
      description:payload.description||'',
      grade:payload.grade||'',
      section:payload.section||'',
      due_at:payload.due_at||null,
      questions:Array.isArray(payload.questions)?payload.questions:[],
      mode:payload.mode||'online',
      attachment:payload.attachment||null,
      max_score:Number(payload.max_score)||null,
      updated_at:new Date().toISOString()
    };
    const {data,error}=await c.from('homeworks').insert(row).select('*').single();
    if(error) throw error;
    return data;
  }

  async function listInteractiveHomeworks(){
    const c=await init();
    const {data,error}=await c.from('homeworks').select('*').order('created_at',{ascending:false});
    if(error) throw error;
    return data||[];
  }

  async function deleteInteractiveHomework(id){
    const c=await init();
    const {error}=await c.from('homeworks').delete().eq('id',id);
    if(error) throw error;
  }

  async function submitInteractiveHomework(homeworkId,answers,studentName){
    const c=await init();
    const user=await currentUser();
    if(!user) throw new Error('يجب تسجيل الدخول أولاً.');
    const {data:existing,error:ee}=await c.from('homework_submissions')
      .select('id').eq('homework_id',homeworkId).eq('student_id',user.id).maybeSingle();
    if(ee) throw ee;
    if(existing) throw new Error('تم تسليم هذا الواجب مسبقًا.');

    const {data:hw,error:he}=await c.from('homeworks').select('questions,max_score').eq('id',homeworkId).single();
    if(he) throw he;
    const questions=Array.isArray(hw?.questions)?hw.questions:[];
    let autoScore=0;
    const details={};
    let hasEssay=false;
    for(const q of questions){
      const pts=Number(q.points)||1;
      if(q.type==='mcq'){
        const correctText=(q.options||[])[Number(q.correct)]??'';
        const given=answers?.[q.id]??'';
        const correct=String(given)===String(correctText);
        if(correct) autoScore+=pts;
        details[q.id]={type:'mcq',correct,points:pts,earned:correct?pts:0};
      }else{
        hasEssay=true;
        details[q.id]={type:'essay',correct:null,points:pts,earned:null};
      }
    }
    const maxScore=Number(hw?.max_score)||questions.reduce((s,q)=>s+(Number(q.points)||1),0);
    const initialScore=hasEssay?autoScore:autoScore;

    const {data,error}=await c.from('homework_submissions').insert({
      homework_id:homeworkId,
      student_id:user.id,
      student_name:studentName||'طالب',
      answers:answers||{},
      submitted_at:new Date().toISOString(),
      auto_score:autoScore,
      max_score:maxScore,
      score:initialScore,
      grading_details:details,
      score_visible:false,
      graded_at:hasEssay?null:new Date().toISOString()
    }).select('*').single();
    if(error) throw error;
    return data;
  }

  async function myInteractiveSubmission(homeworkId){
    const c=await init();
    const user=await currentUser();
    if(!user) return null;
    const {data,error}=await c.from('homework_submissions').select('*')
      .eq('homework_id',homeworkId).eq('student_id',user.id).maybeSingle();
    if(error) throw error;
    return data||null;
  }

  async function teacherHomeworkSubmissions(homeworkId){
    const c=await init();
    const {data,error}=await c.from('homework_submissions').select('*')
      .eq('homework_id',homeworkId).order('submitted_at',{ascending:false});
    if(error) throw error;
    return data||[];
  }

  async function gradeHomeworkSubmission(id,score,feedback){
    const c=await init();
    const {data,error}=await c.from('homework_submissions').update({
      score:score===''||score==null?null:Number(score),
      feedback:feedback||'',
      graded_at:new Date().toISOString()
    }).eq('id',id).select('*').single();
    if(error) throw error;
    return data;
  }

  async function setHomeworkScoreVisibility(id,visible){
    const c=await init();
    const {data,error}=await c.from('homework_submissions').update({
      score_visible:!!visible
    }).eq('id',id).select('*').single();
    if(error) throw error;
    return data;
  }

  async function listClassStudents(grade,section){
    const c=await init();
    let q=c.from('profiles').select('id,auth_user_id,name,email,grade,section,role').eq('role','student');
    if(grade) q=q.eq('grade',grade);
    if(section) q=q.eq('section',section);
    const {data,error}=await q.order('name',{ascending:true});
    if(error) throw error;
    return data||[];
  }

  window.NabdCloud={
    init,signIn,signOut,loadProfiles,createUser,updateUser,deleteUser,bulkCreateUsers,loadAdminCredentials,syncOwnCredential,
    currentUser,uploadSchoolFile,signedSchoolFileUrl,
    createInteractiveHomework,listInteractiveHomeworks,deleteInteractiveHomework,
    submitInteractiveHomework,myInteractiveSubmission,teacherHomeworkSubmissions,gradeHomeworkSubmission,
    setHomeworkScoreVisibility,listClassStudents,
    saveStudentReport,myStudentReports,myStudentReportBundle,getTeacherStudentReport,
    get config(){return cfg;}
  };
})();

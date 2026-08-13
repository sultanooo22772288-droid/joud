import { createClient } from '@supabase/supabase-js';

export default async function handler(req,res){
  if(req.method!=='POST'){
    return res.status(405).json({error:'Method not allowed'});
  }
  try{
    const url=process.env.SUPABASE_URL;
    const serviceRoleKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!serviceRoleKey){
      return res.status(500).json({error:'Supabase server configuration is missing.'});
    }

    const supabase=createClient(url,serviceRoleKey,{
      auth:{autoRefreshToken:false,persistSession:false}
    });

    const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    if(!token) return res.status(401).json({error:'غير مصرح.'});

    const {data:authData,error:authError}=await supabase.auth.getUser(token);
    if(authError||!authData?.user) return res.status(401).json({error:'جلسة الدخول غير صالحة.'});

    const uid=authData.user.id;
    const {data:profile,error:pe}=await supabase.from('profiles').select('*').eq('auth_user_id',uid).maybeSingle();
    if(pe||!profile) return res.status(403).json({error:'ملف المستخدم غير موجود.'});

    const body=req.body||{};
    const action=body.action||'';

    if(action==='save'){
      if(profile.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const studentAuthId=String(body.student_auth_id||'').trim();
      const subject=String(body.subject||profile.subject||'').trim();
      const reportText=String(body.report_text||'').trim();
      if(!studentAuthId||!reportText) return res.status(400).json({error:'الطالب ونص التقرير مطلوبان.'});

      const {data:studentProfile,error:spErr}=await supabase.from('profiles')
        .select('*').eq('auth_user_id',studentAuthId).eq('role','student').maybeSingle();
      if(spErr) throw spErr;
      if(!studentProfile) return res.status(404).json({error:'تعذر العثور على حساب الطالب المحدد.'});

      const key=`student_report:${studentAuthId}:${uid}:${subject||'general'}`;
      const value={
        student_auth_id:studentAuthId,
        student_name:studentProfile.name||'طالب',
        student_email:studentProfile.email||'',
        teacher_auth_id:uid,
        teacher_name:profile.name||'معلم',
        teacher_email:profile.email||'',
        subject:subject||profile.subject||'غير محدد',
        grade:studentProfile.grade||'',
        section:studentProfile.section||'',
        report_text:reportText,
        updated_at:new Date().toISOString()
      };
      const {error}=await supabase.from('school_kv').upsert({
        key,value,updated_by:uid,updated_at:new Date().toISOString()
      },{onConflict:'key'});
      if(error) throw error;
      return res.status(200).json({report:value});
    }

    if(action==='list-my'){
      if(profile.role!=='student') return res.status(403).json({error:'هذه العملية للطالب فقط.'});
      const prefix=`student_report:${uid}:`;
      const {data,error}=await supabase.from('school_kv').select('key,value,updated_at').like('key',prefix+'%').order('updated_at',{ascending:false});
      if(error) throw error;
      return res.status(200).json({
        profile:{
          auth_user_id:profile.auth_user_id,
          name:profile.name||'طالب',
          email:profile.email||'',
          grade:profile.grade||'',
          section:profile.section||''
        },
        reports:(data||[]).map(x=>x.value)
      });
    }

    if(action==='get-for-teacher'){
      if(profile.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const studentAuthId=String(body.student_auth_id||'').trim();
      const subject=String(body.subject||profile.subject||'').trim();
      const key=`student_report:${studentAuthId}:${uid}:${subject||'general'}`;
      const {data,error}=await supabase.from('school_kv').select('value').eq('key',key).maybeSingle();
      if(error) throw error;
      return res.status(200).json({report:data?.value||null});
    }

    return res.status(400).json({error:'عملية غير معروفة.'});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error?.message||'حدث خطأ في الخادم.'});
  }
}

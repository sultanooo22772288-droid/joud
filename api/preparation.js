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
    return res.status(200).json({teacher:{name:profile.name,email:profile.email},assignments:[]});
  }

  return res.status(403).json({error:'This section is available to teachers and admin only'});
};
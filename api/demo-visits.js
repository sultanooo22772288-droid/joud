import { createClient } from '@supabase/supabase-js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  try{
    const url=process.env.SUPABASE_URL;
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!key) return res.status(500).json({error:'Supabase server configuration is missing.'});

    const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const body=req.body||{};
    const action=String(body.action||'');

    if(action==='visit'){
      const raw=String(body.visitor_id||'').trim();
      const visitorId=raw.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
      if(!visitorId) return res.status(400).json({error:'visitor_id is required'});

      const kvKey='demo_visitor:'+visitorId;
      const now=new Date().toISOString();
      const {data:existing,error:readError}=await sb.from('school_kv')
        .select('value').eq('key',kvKey).maybeSingle();
      if(readError) throw readError;

      const previous=(existing&&existing.value)||{};
      const value={
        visitor_id:visitorId,
        first_seen:previous.first_seen||now,
        last_seen:now,
        visits:(Number(previous.visits)||0)+1
      };

      const {error:writeError}=await sb.from('school_kv').upsert({
        key:kvKey,
        value,
        updated_by:null,
        updated_at:now
      },{onConflict:'key'});
      if(writeError) throw writeError;

      return res.status(200).json({ok:true});
    }

    if(action==='exclude-owner'){
      const ownerToken=String(body.owner_token||'');
      if(ownerToken!=='JoudOwner_9m4Qx7L2pA6v') return res.status(403).json({error:'غير مصرح.'});
      const raw=String(body.visitor_id||'').trim();
      const visitorId=raw.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
      if(visitorId){
        const {error}=await sb.from('school_kv').delete().eq('key','demo_visitor:'+visitorId);
        if(error) throw error;
      }
      return res.status(200).json({ok:true});
    }

    if(action==='stats'){
      const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
      if(!token) return res.status(401).json({error:'غير مصرح.'});

      const {data:authData,error:authError}=await sb.auth.getUser(token);
      if(authError||!authData?.user) return res.status(401).json({error:'جلسة الدخول غير صالحة.'});

      const uid=authData.user.id;
      const {data:profile,error:profileError}=await sb.from('profiles')
        .select('role').eq('auth_user_id',uid).maybeSingle();
      if(profileError||!profile||profile.role!=='admin'){
        return res.status(403).json({error:'هذه البيانات للإدارة فقط.'});
      }

      const {data:rows,error}=await sb.from('school_kv')
        .select('value,updated_at')
        .like('key','demo_visitor:%')
        .order('updated_at',{ascending:false});
      if(error) throw error;

      const list=rows||[];
      const unique=list.length;
      const total=list.reduce((sum,row)=>sum+(Number(row?.value?.visits)||0),0);
      const lastVisit=list[0]?.value?.last_seen||list[0]?.updated_at||null;

      return res.status(200).json({unique,total,last_visit:lastVisit});
    }

    return res.status(400).json({error:'عملية غير معروفة.'});
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e?.message||'حدث خطأ في الخادم.'});
  }
}
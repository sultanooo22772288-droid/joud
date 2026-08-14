import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const url=process.env.SUPABASE_URL;
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!key) return res.status(500).json({error:'Supabase server configuration is missing.'});

    const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    if(!token) return res.status(401).json({error:'غير مصرح.'});

    const {data:au,error:ae}=await sb.auth.getUser(token);
    if(ae||!au?.user) return res.status(401).json({error:'جلسة الدخول غير صالحة.'});
    const uid=au.user.id;

    const {data:p,error:pe}=await sb.from('profiles').select('*').eq('auth_user_id',uid).maybeSingle();
    if(pe||!p) return res.status(403).json({error:'ملف المستخدم غير موجود.'});

    const b=req.body||{}, action=b.action||'';

    if(action==='teacher-create'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const type=String(b.type||'');
      if(!['lesson','quiz'].includes(type)) return res.status(400).json({error:'نوع المحتوى غير صحيح.'});
      const item=b.item||{};
      if(!String(item.title||'').trim()) return res.status(400).json({error:'العنوان مطلوب.'});

      const id=randomUUID();
      const value={
        id,type,
        teacher_id:uid,
        teacher_name:p.name||'معلم',
        teacher_email:p.email||'',
        subject:item.subject||p.subject||'',
        title:String(item.title||'').trim(),
        description:item.description||'',
        grade:item.grade||'',
        section:item.section||'',
        scheduled_at:item.scheduled_at||null,
        questions_count:Number(item.questions_count)||null,
        attachment:item.attachment||null,
        video:item.video||null,
        created_at:new Date().toISOString()
      };
      const {error}=await sb.from('school_kv').insert({
        key:`teacher_content:${type}:${uid}:${id}`,
        value,updated_by:uid,updated_at:new Date().toISOString()
      });
      if(error) throw error;
      return res.status(200).json({item:value});
    }

    if(action==='teacher-list'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const type=String(b.type||'');
      const prefix=`teacher_content:${type}:${uid}:`;
      const {data,error}=await sb.from('school_kv').select('key,value,updated_at').like('key',prefix+'%').order('updated_at',{ascending:false});
      if(error) throw error;
      return res.status(200).json({items:(data||[]).map(x=>x.value)});
    }

    if(action==='teacher-delete'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const type=String(b.type||''), id=String(b.id||'');
      const keyName=`teacher_content:${type}:${uid}:${id}`;
      const {error}=await sb.from('school_kv').delete().eq('key',keyName);
      if(error) throw error;
      return res.status(200).json({ok:true});
    }

    if(action==='teacher-create-homework'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const item=b.item||{};
      const title=String(item.title||'').trim();
      if(!title) return res.status(400).json({error:'عنوان الواجب مطلوب.'});
      if(!item.due_at) return res.status(400).json({error:'موعد التسليم مطلوب.'});

      const row={
        teacher_id:uid,
        teacher_name:p.name||'معلم',
        title,
        description:item.description||'',
        grade:item.grade||'',
        section:item.section||'',
        due_at:item.due_at,
        questions:Array.isArray(item.questions)?item.questions:[],
        mode:item.mode||'online',
        attachment:item.attachment||null,
        max_score:Number(item.max_score)||null,
        updated_at:new Date().toISOString()
      };
      const {data,error}=await sb.from('homeworks').insert(row).select('*').single();
      if(error) throw error;
      return res.status(200).json({item:data});
    }

    if(action==='teacher-list-homeworks'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const {data,error}=await sb.from('homeworks')
        .select('*').eq('teacher_id',uid).order('created_at',{ascending:false});
      if(error) throw error;
      return res.status(200).json({items:data||[]});
    }

    if(action==='teacher-delete-homework'){
      if(p.role!=='teacher') return res.status(403).json({error:'هذه العملية للمعلم فقط.'});
      const id=Number(b.id);
      if(!id) return res.status(400).json({error:'معرف الواجب غير صحيح.'});
      const {data:hw,error:he}=await sb.from('homeworks').select('id,teacher_id').eq('id',id).maybeSingle();
      if(he) throw he;
      if(!hw || String(hw.teacher_id)!==uid) return res.status(403).json({error:'لا يمكنك حذف واجب لمعلم آخر.'});
      await sb.from('homework_submissions').delete().eq('homework_id',id);
      const {error}=await sb.from('homeworks').delete().eq('id',id);
      if(error) throw error;
      return res.status(200).json({ok:true});
    }

    if(action==='admin-list-all'){
      if(p.role!=='admin') return res.status(403).json({error:'هذه العملية للإدارة فقط.'});

      const {data:kv,error:ke}=await sb.from('school_kv')
        .select('key,value,updated_at')
        .like('key','teacher_content:%')
        .order('updated_at',{ascending:false});
      if(ke) throw ke;

      const {data:homeworks,error:he}=await sb.from('homeworks')
        .select('*').order('created_at',{ascending:false});
      if(he) throw he;

      return res.status(200).json({
        lessons:(kv||[]).filter(x=>x.key.startsWith('teacher_content:lesson:')).map(x=>x.value),
        quizzes:(kv||[]).filter(x=>x.key.startsWith('teacher_content:quiz:')).map(x=>x.value),
        homeworks:homeworks||[]
      });
    }

    return res.status(400).json({error:'عملية غير معروفة.'});
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e?.message||'حدث خطأ في الخادم.'});
  }
}

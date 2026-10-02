const { createClient } = require('@supabase/supabase-js');
const { getVercelOidcToken } = require('@vercel/oidc');

function jsonFromText(text){
  const raw=String(text||'').trim();
  try{return JSON.parse(raw);}catch(_e){}
  const fenced=raw.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/i);
  if(fenced){ try{return JSON.parse(fenced[1]);}catch(_e){} }
  const a=raw.indexOf('{'), b=raw.lastIndexOf('}');
  if(a>=0&&b>a){ try{return JSON.parse(raw.slice(a,b+1));}catch(_e){} }
  return null;
}

module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  const supabaseUrl=process.env.SUPABASE_URL;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!supabaseUrl||!serviceKey) return res.status(500).json({error:'Supabase server configuration is missing.'});

  const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'').trim();
  if(!token) return res.status(401).json({error:'يجب تسجيل الدخول أولاً.'});

  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:userError}=await admin.auth.getUser(token);
  if(userError||!user) return res.status(401).json({error:'جلسة الدخول غير صالحة.'});

  const {data:profile,error:profileError}=await admin.from('profiles').select('role,name').eq('auth_user_id',user.id).maybeSingle();
  if(profileError) return res.status(500).json({error:profileError.message});
  if(!profile||!['teacher','admin'].includes(profile.role)) return res.status(403).json({error:'غير مصرح باستخدام توليد التحضير.'});

  const body=req.body||{};
  const subject=String(body.subject||'').trim();
  const grade=String(body.grade||'').trim();
  const unit=String(body.unit||'').trim();
  const lesson=String(body.lesson||'').trim();
  const sections=Array.isArray(body.sections)?body.sections.map(x=>String(x||'').trim()).filter(Boolean):[];
  const date=String(body.date||'').trim();
  const period=String(body.period||'').trim();

  if(!subject||!grade||!unit||!lesson) return res.status(400).json({error:'اختر المادة والصف والوحدة والدرس أولاً.'});

  if(profile.role==='teacher'){
    const {data:mapRow,error:mapErr}=await admin.from('school_kv').select('value').eq('key','teacher_subject_assignments:'+user.id).maybeSingle();
    if(mapErr) return res.status(500).json({error:mapErr.message});
    const assignments=Array.isArray(mapRow?.value?.assignments)?mapRow.value.assignments:[];
    const a=assignments.find(x=>String(x.subject||'').trim()===subject);
    const validClasses=(a?.classes||[]).filter(x=>String(x.grade||'').trim()===grade);
    if(!a||!validClasses.length) return res.status(403).json({error:'هذه المادة أو الصف غير مسند للمعلم.'});
    if(sections.length){
      const allowed=new Set(validClasses.map(x=>String(x.section||'').trim()));
      if(sections.some(s=>!allowed.has(s))) return res.status(403).json({error:'إحدى الشعب المختارة غير مسندة للمعلم.'});
    }
  }

  let apiKey=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!apiKey){
    try{ apiKey=await getVercelOidcToken(); }catch(_e){}
  }
  if(!apiKey) return res.status(503).json({error:'تعذر الحصول على رمز تشغيل الذكاء الاصطناعي من Vercel.'});

  const subjectRules=subject.includes('اللغة الإنجليزية')?
    'اكتب أهداف وأنشطة مادة اللغة الإنجليزية بلغة إنجليزية بسيطة مناسبة للصف مع شرح عربي قصير عند الحاجة، ولا تجعل النص معقدًا.':
    subject.includes('ديني')?
    'في التربية الإسلامية لا تختلق آية أو حديثًا أو حكمًا شرعيًا. إذا لم يكن النص الأصلي متاحًا فاكتب توجيهًا مثل: تلاوة الآيات المحددة في الكتاب، وركز على الفهم والقيمة والسلوك.':
    subject.includes('الرياضيات')?
    'في الرياضيات استخدم أمثلة عددية وأنشطة محسوسة وتدرجًا من المحسوس إلى المصور ثم المجرد.':
    subject.includes('العلوم')?
    'في العلوم اجعل الأنشطة قائمة على الملاحظة والاستقصاء والتنبؤ والتفسير والسلامة.':
    subject.includes('الحاسوب')?
    'في الحاسوب اجعل الخطوات عملية وقابلة للتطبيق على الجهاز مع مراعاة السلامة الرقمية.':
    subject.includes('الموسيق')?
    'في المهارات الموسيقية ركز على الاستماع والإيقاع والأداء والتذوق بطريقة مناسبة للعمر.':
    subject.includes('الفنون')?
    'في الفنون البصرية ركز على الملاحظة والتجريب والخامات والإبداع والتقويم البصري.':
    subject.includes('الرياضة')?
    'في الرياضة المدرسية اجعل الأنشطة حركية تدريجية مع الإحماء والسلامة والفروق الفردية.':
    'اجعل المحتوى مناسبًا للمرحلة العمرية ومباشرًا وقابلًا للتطبيق داخل الحصة.';

  const prompt=`أنت خبير تربوي متخصص في مناهج سلطنة عُمان للمرحلة الأساسية. أنشئ تحضير حصة احترافيًا ومترابطًا، جاهزًا للمعلم وقابلًا للتعديل.

بيانات الحصة:
- المادة: ${subject}
- الصف: ${grade}
- الوحدة: ${unit}
- عنوان الدرس الرسمي: ${lesson}
- الشعبة/الشعب: ${sections.join('، ')||'حسب اختيار المعلم'}
- التاريخ: ${date||'تلقائي'}
- الحصة: ${period||'1'}

قاعدة مهمة جدًا: لا تغيّر عنوان الدرس ولا تخترع معلومات رسمية غير متاحة. لا تخترع أرقام مخرجات أو نصوص قرآن/حديث أو حقائق خاصة بالكتاب. إذا كانت معلومة رسمية غير معروفة اتركها فارغة أو صغها دون ادعاء أنها من الكتاب.
${subjectRules}

أريد كل خانة بجودة عالية ومستقلة لكنها متناسقة مع بقية الخانات:
1) prior: التعلم القبلي، 2-4 نقاط قصيرة تربط بالمعرفة السابقة.
2) intro: تمهيد جذاب وسريع مع سؤال أو موقف محفز.
3) concepts: أهم المفاهيم/المفردات، كل مفهوم في سطر.
4) objectives: 3-5 أهداف قابلة للقياس، تبدأ بأفعال سلوكية واضحة، وتتنوع معرفيًا ومهاريًا وقيميًا حسب طبيعة الدرس.
5) strategies: اختر 3-5 فقط من: الحوار والمناقشة، الاستقصاء، العصف الذهني، تنبأ وفسر ولاحظ، التعلم التعاوني، شكل V المعرفي، القياس، القصة، الخرائط الذهنية، الاستكشاف الاستقرائي، التعلم باللعب، تمثيل الأدوار، التعلم بالأقران، حل المشكلات.
6) activities: آلية تنفيذ تفصيلية مرتبة زمنيًا: تهيئة، تقديم/استكشاف، ممارسة موجهة، ممارسة مستقلة/تعاونية، إغلاق. اجعلها عملية وتذكر دور المعلم والمتعلم.
7) resources: وسائل ومصادر تعلم محددة وقابلة للتوفر في المدرسة، دون اختراع صفحات كتاب.
8) formative: تقويم تكويني متنوع أثناء الحصة مع أسئلة/مؤشرات نجاح مرتبطة بالأهداف.
9) enrichment: قسمان واضحان: نشاط علاجي للمتعثرين + نشاط إثرائي للمتقدمين.
10) summative: تقويم ختامي قصير يقيس الهدف الأساسي.
11) homework: واجب منزلي خفيف ومحدد ومرتبط بالدرس.
12) teacherNotes: ملاحظات عملية للمعلم حول الفروق الفردية وإدارة الوقت أو السلامة حسب المادة.
13) outcomeNums: اتركها سلسلة فارغة "" ما لم تكن لديك أرقام رسمية مؤكدة من البيانات المعطاة.

أعد JSON فقط بهذه المفاتيح بالضبط:
{"prior":"","intro":"","concepts":"","objectives":"","strategies":[],"activities":"","resources":"","formative":"","enrichment":"","summative":"","homework":"","teacherNotes":"","outcomeNums":""}
لا تضف أي نص خارج JSON.`;

  try{
    const gateway=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'anthropic/claude-opus-5',
        messages:[
          {role:'system',content:'أنت مصمم تعلم خبير. اتبع النموذج المطلوب بدقة وأعد JSON صالحًا فقط.'},
          {role:'user',content:prompt}
        ],
        stream:false
      })
    });
    const out=await gateway.json().catch(()=>({}));
    if(!gateway.ok){
      console.error('AI gateway error',gateway.status,out);
      return res.status(502).json({error:'تعذر توليد التحضير بالذكاء الاصطناعي الآن. حاول مرة أخرى.'});
    }
    const content=out?.choices?.[0]?.message?.content||'';
    const data=jsonFromText(content);
    if(!data) return res.status(502).json({error:'تم التوليد لكن تعذر قراءة النتيجة المنظمة. أعد المحاولة.'});

    const clean={
      prior:String(data.prior||'').trim(),
      intro:String(data.intro||'').trim(),
      concepts:String(data.concepts||'').trim(),
      objectives:String(data.objectives||'').trim(),
      strategies:Array.isArray(data.strategies)?data.strategies.map(x=>String(x||'').trim()).filter(Boolean).slice(0,5):[],
      activities:String(data.activities||'').trim(),
      resources:String(data.resources||'').trim(),
      formative:String(data.formative||'').trim(),
      enrichment:String(data.enrichment||'').trim(),
      summative:String(data.summative||'').trim(),
      homework:String(data.homework||'').trim(),
      teacherNotes:String(data.teacherNotes||'').trim(),
      outcomeNums:String(data.outcomeNums||'').trim()
    };
    return res.status(200).json({ok:true,data:clean,model:out.model||'ai-gateway'});
  }catch(e){
    console.error('AI preparation generation failed',e);
    return res.status(500).json({error:'حدث خطأ أثناء توليد التحضير. حاول مرة أخرى.'});
  }
};
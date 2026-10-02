const { createClient } = require('@supabase/supabase-js');

const DATA = [
  {
    subject:'أحب لغتي',
    grade:'الصف الأول',
    units:[
      {id:'s1u0',title:'الفصل الأول — التهيئة',lessons:[
        {id:'l1',title:'أتعرف مدرستي'},{id:'l2',title:'أتعرف صفي'},{id:'l3',title:'من البيت إلى المدرسة'}
      ]},
      {id:'s1u1',title:'الفصل الأول — المحور الأول: هنا أعيش',lessons:[
        {id:'l1',title:'حرف ب'},{id:'l2',title:'حرف ل'},{id:'l3',title:'حرف م'},{id:'l4',title:'حرف ر'},{id:'l5',title:'المراجعة: ب ل م ر'},{id:'l6',title:'نشيد: أمي وأبي'}
      ]},
      {id:'s1u2',title:'الفصل الأول — المحور الثاني: هنا أتعلم',lessons:[
        {id:'l1',title:'حرف د'},{id:'l2',title:'حرف س'},{id:'l3',title:'حرف ك'},{id:'l4',title:'حرف ن'},{id:'l5',title:'المراجعة: د س ك ن'},{id:'l6',title:'نشيد: مدرستي حديقتي'}
      ]},
      {id:'s1u3',title:'الفصل الأول — المحور الثالث: أنا نظيف',lessons:[
        {id:'l1',title:'حرف ف'},{id:'l2',title:'حرف ت'},{id:'l3',title:'حرف ح'},{id:'l4',title:'حرف ق'},{id:'l5',title:'حرف ز'},{id:'l6',title:'حرف ط'},{id:'l7',title:'المراجعة: ف ت ح ق ز ط'},{id:'l8',title:'نشيد: النظافة'}
      ]},
      {id:'s1u4',title:'الفصل الأول — المحور الرابع: هذا غذائي',lessons:[
        {id:'l1',title:'حرف ء'},{id:'l2',title:'حرف ج'},{id:'l3',title:'حرف و'},{id:'l4',title:'حرف ش'},{id:'l5',title:'حرف ع'},{id:'l6',title:'حرف ظ'},{id:'l7',title:'المراجعة: ء ج و ش ع ظ'},{id:'l8',title:'نشيد: توازن الغذاء'}
      ]},
      {id:'s2u1',title:'الفصل الثاني — المحور الأول: هذه مدينتي',lessons:[
        {id:'l1',title:'حرف خ'},{id:'l2',title:'حرف ث'},{id:'l3',title:'حرف ذ'},{id:'l4',title:'حرف ص'},{id:'l5',title:'المراجعة: خ ث ذ ص'},{id:'l6',title:'نشيد: أنا المدينة'}
      ]},
      {id:'s2u2',title:'الفصل الثاني — المحور الثاني: هذا وطني',lessons:[
        {id:'l1',title:'حرف ه'},{id:'l2',title:'حرف غ'},{id:'l3',title:'حرف ض'},{id:'l4',title:'حرف ي'},{id:'l5',title:'المراجعة: ه غ ض ي'},{id:'l6',title:'نشيد: يحيا الوطن'}
      ]},
      {id:'s2u3',title:'الفصل الثاني — المحور الثالث: هواياتي',lessons:[
        {id:'l1',title:'نشيد: تمارين الصباح'},{id:'l2',title:'ندى تحب الرسم'},{id:'l3',title:'زينب تصنع كوبًا'},{id:'l4',title:'هيا بنا نركض'},{id:'l5',title:'رحلة أخرى'}
      ]},
      {id:'s2u4',title:'الفصل الثاني — المحور الرابع: حكاياتي العجيبة',lessons:[
        {id:'l1',title:'نشيد: طفل يسأل'},{id:'l2',title:'العصفور الصغير والسلحفاة'},{id:'l3',title:'بذرة عجيبة'},{id:'l4',title:'الفراشة في أمان'},{id:'l5',title:'الذئب والحمل'}
      ]}
    ]
  },
  {
    subject:'ديني حياتي',
    grade:'الصف الأول',
    units:[
      {id:'s1u1',title:'الفصل الأول — الوحدة الأولى',lessons:[
        {id:'l1',title:'سورة الفاتحة'},{id:'l2',title:'أنا مسلم نظيف'},{id:'l3',title:'آداب العطاس'},{id:'l4',title:'مولد الصادق الأمين'},{id:'l5',title:'النجاسات'},{id:'l6',title:'شكراً يا رب'}
      ]},
      {id:'s1u2',title:'الفصل الأول — الوحدة الثانية',lessons:[
        {id:'l1',title:'أحب الله ربي'},{id:'l2',title:'سورة الناس'},{id:'l3',title:'أحق الناس'},{id:'l4',title:'أطيع أمي وأبي'},{id:'l5',title:'طهارتي عنواني'},{id:'l6',title:'رسولي محمد ﷺ'}
      ]},
      {id:'s1u3',title:'الفصل الأول — الوحدة الثالثة',lessons:[
        {id:'l1',title:'سورة الفلق'},{id:'l2',title:'الله تعالى رب كل شيء'},{id:'l3',title:'من آداب الطعام'},{id:'l4',title:'آداب قضاء الحاجة'},{id:'l5',title:'محمد ﷺ الطفل المبارك'},{id:'l6',title:'أحترم معلمتي'}
      ]},
      {id:'s1u4',title:'الفصل الأول — الوحدة الرابعة',lessons:[
        {id:'l1',title:'سورة الإخلاص'},{id:'l2',title:'الله تعالى خالقي'},{id:'l3',title:'الصدق طريق الجنة'},{id:'l4',title:'الاستنجاء'},{id:'l5',title:'أساعد الآخرين'},{id:'l6',title:'النشأة المباركة'}
      ]},
      {id:'s2u1',title:'الفصل الثاني — الوحدة الأولى',lessons:[
        {id:'l1',title:'سورة المسد'},{id:'l2',title:'سلامي محبة ووئام'},{id:'l3',title:'الله تعالى الواحد'},{id:'l4',title:'يتم الرسول ﷺ'},{id:'l5',title:'الماء الطهور'},{id:'l6',title:'آداب الزيارة'}
      ]},
      {id:'s2u2',title:'الفصل الثاني — الوحدة الثانية',lessons:[
        {id:'l1',title:'سورة الكوثر'},{id:'l2',title:'آداب الطريق'},{id:'l3',title:'الله خالق كل شيء'},{id:'l4',title:'كيف أتوضأ؟'},{id:'l5',title:'آداب الزيارة (2)'},{id:'l6',title:'الرسول ﷺ في كفالة جده'}
      ]},
      {id:'s2u3',title:'الفصل الثاني — الوحدة الثالثة',lessons:[
        {id:'l1',title:'سورة الماعون'},{id:'l2',title:'من آداب المجالس'},{id:'l3',title:'نعمة الغيث'},{id:'l4',title:'مبطلات الوضوء'},{id:'l5',title:'آداب التعامل'},{id:'l6',title:'الرسول محمد ﷺ في كفالة عمه'}
      ]},
      {id:'s2u4',title:'الفصل الثاني — الوحدة الرابعة',lessons:[
        {id:'l1',title:'سورة قريش'},{id:'l2',title:'أتعلم من القرآن الكريم'},{id:'l3',title:'الحواس نعمة'},{id:'l4',title:'الصلوات الخمس'},{id:'l5',title:'آداب الحديث'},{id:'l6',title:'مولد الفجر الجديد'}
      ]}
    ]
  }
];

module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  if(String(req.query?.k||'')!=='grade1-core-20261002') return res.status(403).json({error:'Forbidden'});
  const url=process.env.SUPABASE_URL;
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!service) return res.status(500).json({error:'Missing Supabase config'});
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const now=new Date().toISOString();
  for(const item of DATA){
    const key='preparation_curriculum:'+encodeURIComponent(item.subject)+':'+encodeURIComponent(item.grade);
    const value={...item,source:'المناهج العمانية — بيانات التحضير المعتمدة',updatedAt:now};
    const {error}=await admin.from('school_kv').upsert({key,value,updated_at:now});
    if(error) return res.status(500).json({subject:item.subject,error:error.message});
  }
  return res.status(200).json({ok:true,count:DATA.length,subjects:DATA.map(x=>x.subject)});
};
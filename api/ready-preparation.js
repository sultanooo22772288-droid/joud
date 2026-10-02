const { createClient } = require('@supabase/supabase-js');

const clean=v=>String(v??'').trim();
const bullets=a=>a.filter(Boolean).map(x=>'• '+x).join('\n');

function strategies(subject){
  if(/رياضيات/.test(subject)) return ['التعلم التعاوني','حل المشكلات','الحوار والمناقشة','التعلم بالأقران'];
  if(/علوم/.test(subject)) return ['الاستقصاء','تنبأ وفسر ولاحظ','التعلم التعاوني','الحوار والمناقشة'];
  if(/إنجليز/.test(subject)) return ['التعلم باللعب','التعلم بالأقران','الحوار والمناقشة','تمثيل الأدوار'];
  if(/ديني/.test(subject)) return ['الحوار والمناقشة','القصة','التعلم التعاوني','الخرائط الذهنية'];
  if(/حاسوب|تقنية/.test(subject)) return ['التعلم بالممارسة','حل المشكلات','التعلم بالأقران','الحوار والمناقشة'];
  if(/موسيق/.test(subject)) return ['التعلم بالممارسة','التعلم بالأقران','الحوار والمناقشة','التعلم باللعب'];
  if(/فنون/.test(subject)) return ['التعلم بالممارسة','الاستكشاف','العصف الذهني','التعلم بالأقران'];
  if(/رياضة/.test(subject)) return ['التعلم بالممارسة','التعلم التعاوني','التعلم بالأقران','التعلم باللعب'];
  return ['الحوار والمناقشة','التعلم التعاوني','العصف الذهني','التعلم بالأقران'];
}

function lessonKind(subject,lesson){
  const t=clean(lesson);
  if(/استماع/.test(t)) return 'listening';
  if(/نشيد|أنشد|أغنية/.test(t)) return 'chant';
  if(/سورة|حديث|آية|القرآن/.test(t)) return 'religious_text';
  if(/^حرف\s/.test(t)||/حرف/.test(t)) return 'letter';
  if(/مراجعة|أقيم|تحقق من تقدمك/.test(t)) return 'review';
  if(/رياضيات/.test(subject)) return 'math';
  if(/علوم/.test(subject)) return 'science';
  if(/إنجليز/.test(subject)) return 'english';
  if(/حاسوب|تقنية/.test(subject)) return 'computer';
  if(/فنون/.test(subject)) return 'art';
  if(/موسيق/.test(subject)) return 'music';
  if(/رياضة/.test(subject)) return 'pe';
  if(/ديني/.test(subject)) return 'islamic';
  if(/الهوية|المواطنة/.test(subject)) return 'citizenship';
  return 'language';
}

function buildReady({subject,grade,unit,lesson}){
  const kind=lessonKind(subject,lesson);
  const context=`${lesson} (${unit})`;

  let prior, intro, concepts, objectives, activities, resources, formative, enrichment, summative, homework, notes;

  if(kind==='math'){
    prior=bullets(['مراجعة سريعة لمهارة عددية مرتبطة بالدرس السابق.','استدعاء المفاهيم الأساسية اللازمة لفهم '+lesson+'.','حل مثال شفهي قصير لتهيئة المتعلمين.']);
    intro='يعرض المعلم موقفًا حياتيًا بسيطًا يرتبط بـ «'+lesson+'»، ثم يطلب من المتعلمين اقتراح طريقة للحل ومناقشة أكثر من استراتيجية ممكنة.';
    concepts=bullets([lesson,'التمثيل الرياضي','الاستراتيجية المناسبة للحل','التحقق من معقولية الإجابة']);
    objectives=bullets(['أن يفسر المتعلم مفهوم «'+lesson+'» بلغته الخاصة.','أن يطبق المهارة على أمثلة متدرجة بدقة.','أن يختار استراتيجية مناسبة للحل ويبرر اختياره.','أن يتحقق من صحة الناتج باستخدام طريقة بديلة أو التقدير.']);
    activities=bullets(['التهيئة: سؤال عددي قصير يربط بالخبرة السابقة.','العرض: تمثيل المفهوم باستخدام أدوات محسوسة أو رسم/خط أعداد ثم الانتقال للرموز.','الممارسة الموجهة: حل مثالين مع مناقشة خطوات التفكير.','الممارسة التعاونية: بطاقات مسائل قصيرة متفاوتة المستوى.','الممارسة الفردية: مسألتان للتحقق من إتقان كل متعلم.','الإغلاق: يشرح متعلم واحد طريقة الحل ويذكر زميله طريقة أخرى.']);
    resources=bullets(['كتاب الطالب','السبورة','بطاقات أعداد/مسائل','مكعبات أو أدوات محسوسة عند الحاجة','ورقة خروج قصيرة']);
    formative=bullets(['أسئلة شفهية أثناء العرض: ما الخطوة التالية؟ ولماذا؟','ملاحظة قدرة المتعلم على تمثيل المسألة واختيار الاستراتيجية.','بطاقة تحقق من سؤال واحد في منتصف الحصة.']);
    enrichment=bullets(['علاجي: استخدام أعداد أصغر وتمثيل محسوس مع إرشاد خطوة بخطوة.','إثرائي: مسألة حياتية متعددة الخطوات تتطلب تفسير الحل.']);
    summative='سؤال ختامي مستقل يقيس المهارة الأساسية في «'+lesson+'» مع طلب توضيح خطوة واحدة من الحل.';
    homework='حل تمرينين قصيرين مرتبطين مباشرة بمهارة «'+lesson+'» وكتابة طريقة التحقق من إحدى الإجابتين.';
    notes='مراعاة الفروق الفردية، وإتاحة وقت للتفكير قبل طلب الإجابة، وعدم الانتقال للمجرد قبل التأكد من فهم التمثيل.';
  } else if(kind==='science'){
    prior=bullets(['مناقشة خبرة يومية مرتبطة بموضوع '+lesson+'.','استرجاع مفهوم علمي من الدرس السابق يساعد على تفسير الظاهرة.','تسجيل توقعات المتعلمين قبل النشاط.']);
    intro='يعرض المعلم صورة/جسمًا/موقفًا مرتبطًا بـ «'+lesson+'» ويسأل: ماذا تلاحظ؟ ماذا تتوقع؟ وكيف يمكننا التأكد؟';
    concepts=bullets([lesson,'الملاحظة العلمية','التنبؤ','التفسير المبني على الدليل']);
    objectives=bullets(['أن يصف المتعلم الظاهرة أو المفهوم المرتبط بـ «'+lesson+'».','أن يلاحظ ويسجل بيانات أو خصائص بصورة منظمة.','أن يفسر ملاحظاته باستخدام مفردات علمية مناسبة.','أن يميز بين التوقع والدليل والاستنتاج.']);
    activities=bullets(['التهيئة: سؤال تنبؤي قصير.','الاستكشاف: نشاط ملاحظة/تصنيف أو تجربة بسيطة آمنة.','المناقشة: مقارنة النتائج بين المجموعات وربطها بالمفهوم.','البناء: صياغة التفسير العلمي بمساعدة المعلم.','التطبيق: موقف جديد يطبق فيه المتعلم الفكرة.','الإغلاق: جملة «كنت أعتقد… والآن عرفت… لأن…».']);
    resources=bullets(['كتاب الطالب','صور أو عينات مناسبة','أدوات النشاط البسيطة','بطاقة ملاحظة','سبورة']);
    formative=bullets(['سؤال تنبؤ قبل النشاط ثم مقارنة التنبؤ بالنتيجة.','قائمة ملاحظة لمهارة التسجيل والتفسير.','سؤال: ما الدليل الذي يدعم إجابتك؟']);
    enrichment=bullets(['علاجي: صورة/مخطط مبسط مع كلمات مساعدة وترتيب خطوات النشاط.','إثرائي: اقتراح متغير جديد أو سؤال استقصائي امتدادًا للنشاط.']);
    summative='يقدم المتعلم تفسيرًا قصيرًا لموقف جديد مرتبط بـ «'+lesson+'» ويذكر دليلًا واحدًا.';
    homework='ملاحظة مثال من البيئة المنزلية مرتبط بالدرس وكتابة ملاحظتين علميتين عنه.';
    notes='التأكد من السلامة أثناء الأنشطة، وتشجيع الإجابات المبنية على دليل لا على التخمين فقط.';
  } else if(kind==='english'){
    prior=bullets(['Quick review of familiar vocabulary related to the topic.','A short oral warm-up using words or sentence patterns from the previous lesson.']);
    intro='Show a picture or real object connected to “'+lesson+'”. Ask a simple prediction/question and let pupils respond in pairs before whole-class sharing.';
    concepts=bullets([lesson,'Key vocabulary','Target language pattern','Listening / speaking interaction']);
    objectives=bullets(['Pupils can understand the key vocabulary in “'+lesson+'”.','Pupils can use the target words in a short spoken sentence.','Pupils can respond to a simple question related to the lesson.','Pupils can complete a short pair task using the target language.']);
    activities=bullets(['Warm-up: picture/gesture guessing game.','Presentation: model key words and sentence pattern with repetition and meaning checks.','Guided practice: choral and individual responses.','Pair work: short information-gap / matching / speaking task.','Independent check: one short written or oral response.','Plenary: two pupils model the target exchange.']);
    resources=bullets(['Coursebook','Picture/word cards','Board','Real objects when available','Mini whiteboards or exit slips']);
    formative=bullets(['Thumbs/traffic-light check for vocabulary understanding.','Teacher observation during pair work.','One quick oral question for each pair/group.']);
    enrichment=bullets(['Support: word bank, sentence frame and picture cues.','Challenge: extend the sentence with one extra detail or ask a follow-up question.']);
    summative='Each pupil gives one correct spoken or written response using the lesson vocabulary/pattern.';
    homework='Practise the lesson vocabulary and write or say 2–3 simple sentences using it.';
    notes='Keep teacher talk short, maximize pupil speaking time, model pronunciation clearly, and support shy learners with pair rehearsal.';
  } else if(kind==='computer'){
    prior=bullets(['مراجعة المهارة الرقمية السابقة المرتبطة بالدرس.','تذكير بقواعد الاستخدام الآمن والمنظم للجهاز.','سؤال سريع: أين نستخدم هذه المهارة في الحياة اليومية؟']);
    intro='يعرض المعلم النتيجة النهائية لمهمة مرتبطة بـ «'+lesson+'» ثم يسأل المتعلمين: كيف يمكننا الوصول إليها بخطوات صحيحة وآمنة؟';
    concepts=bullets([lesson,'الخطوات الإجرائية','الأداة/الأمر المناسب','السلامة الرقمية']);
    objectives=bullets(['أن يحدد المتعلم وظيفة الأداة أو المفهوم في «'+lesson+'».','أن ينفذ خطوات المهارة بالترتيب الصحيح.','أن يصحح خطأ بسيطًا أثناء التنفيذ.','أن يطبق قواعد السلامة الرقمية المرتبطة بالمهمة.']);
    activities=bullets(['التهيئة: عرض نموذج نهائي للمهمة.','النمذجة: المعلم ينفذ الخطوات أمام المتعلمين مع تفسير مختصر.','ممارسة موجهة: تنفيذ الخطوات خطوة بخطوة.','ممارسة فردية/ثنائية: إنجاز مهمة قصيرة مستقلة.','تحدي: تعديل بسيط أو إضافة عنصر للمهمة.','الإغلاق: حفظ العمل بالطريقة الصحيحة وذكر أهم خطوتين.']);
    resources=bullets(['جهاز حاسوب لكل متعلم/ثنائي','جهاز عرض','البرنامج المطلوب','ملف تدريب','بطاقة خطوات مختصرة']);
    formative=bullets(['قائمة تحقق للخطوات الأساسية.','ملاحظة استخدام الأداة الصحيحة.','سؤال عملي: نفذ الخطوة التالية أمام المعلم.']);
    enrichment=bullets(['علاجي: بطاقة مصورة للخطوات مع دعم زميل.','إثرائي: مهمة إضافية تتطلب استخدام الأداة بطريقة جديدة.']);
    summative='ينجز المتعلم مهمة عملية قصيرة مرتبطة بـ «'+lesson+'» دون مساعدة مباشرة.';
    homework='مراجعة أسماء الأدوات والخطوات أو تصميم مخطط بسيط يوضح تسلسل تنفيذ المهارة.';
    notes='التأكد من حفظ الأعمال، وتنظيم وقت استخدام الأجهزة، وعدم مشاركة أي بيانات شخصية أثناء الأنشطة الرقمية.';
  } else if(kind==='letter'){
    const m=lesson.match(/حرف\s*([^\s]+)/); const letter=m?.[1]||'الحرف';
    prior=bullets(['مراجعة أصوات الحروف التي سبق تعلمها.','تمييز كلمات مألوفة من صور أو بطاقات.']);
    intro='يعرض المعلم صورًا لأشياء تحتوي على '+letter+'، وينطق الكلمات ببطء ويطلب من المتعلمين اكتشاف الصوت المشترك.';
    concepts=bullets(['صوت '+letter,'شكل الحرف','موضع الحرف في الكلمة','تمييز الحرف سمعيًا وبصريًا']);
    objectives=bullets(['أن يميز المتعلم صوت '+letter+' في كلمات مسموعة.','أن يتعرف شكل '+letter+' في مواضع مختلفة من الكلمة.','أن يقرأ مقاطع/كلمات بسيطة تحتوي على '+letter+'.','أن يكتب '+letter+' كتابة صحيحة على السطر.']);
    activities=bullets(['تمييز الصوت من خلال لعبة الاستماع ورفع البطاقة.','عرض شكل الحرف ونمذجة اتجاه الكتابة.','تركيب مقاطع وكلمات باستخدام بطاقات الحروف.','قراءة جماعية ثم فردية لكلمات مختارة.','تدريب كتابي قصير مع تغذية راجعة.']);
    resources=bullets(['بطاقات صور','بطاقات حروف','سبورة','كتاب الطالب','أقلام/لوح صغير']);
    formative=bullets(['هل تسمع صوت الحرف في بداية/وسط/نهاية الكلمة؟','اختيار شكل الحرف الصحيح من بين بدائل.','كتابة الحرف مرة أمام المعلم.']);
    enrichment=bullets(['علاجي: تتبع الحرف وتوصيل الصورة بالحرف الصحيح.','إثرائي: إيجاد ثلاث كلمات جديدة تحتوي على الحرف واستخدام إحداها في جملة.']);
    summative='قراءة كلمة جديدة تحتوي على '+letter+' ثم كتابة الحرف في موضعه الصحيح.';
    homework='البحث في المنزل عن ثلاث كلمات/صور تحتوي على '+letter+' وكتابتها أو رسمها.';
    notes='التركيز على الصوت قبل اسم الحرف، وتصحيح اتجاه الكتابة بلطف مع تدريب قصير ومتكرر.';
  } else if(kind==='religious_text'){
    prior=bullets(['استرجاع معنى أو قيمة مرتبطة بالنص السابق.','تهيئة المتعلمين لاحترام آداب التلاوة/الاستماع.']);
    intro='تمهيد بقيمة أو موقف حياتي يرتبط بموضوع «'+lesson+'» ثم ربطه بالنص المقرر في الكتاب دون إضافة نصوص غير مؤكدة.';
    concepts=bullets([lesson,'المعنى الإجمالي','القيمة المستفادة','التطبيق السلوكي']);
    objectives=bullets(['أن يتابع المتعلم النص المقرر قراءة/استماعًا بصورة صحيحة حسب مستوى الصف.','أن يوضح المعنى الإجمالي للنص بلغته.','أن يستنتج قيمة أو توجيهًا سلوكيًا من النص.','أن يذكر موقفًا من حياته يطبق فيه القيمة المستفادة.']);
    activities=bullets(['التهيئة بموقف أو سؤال قيمي.','قراءة/استماع للنص المقرر من الكتاب.','شرح المفردات والمعنى الإجمالي بأسئلة موجهة.','استخراج القيم في مجموعات صغيرة.','ربط القيمة بموقف حياتي وتمثيل تطبيق صحيح لها.','الإغلاق بجملة: سأطبق اليوم…']);
    resources=bullets(['الكتاب المدرسي','سبورة','بطاقات مفردات/قيم','تسجيل معتمد عند توفره']);
    formative=bullets(['سؤال عن معنى مفردة أو فكرة رئيسية.','اختيار السلوك الذي يوافق قيمة النص.','ملاحظة القراءة/التلاوة حسب المطلوب.']);
    enrichment=bullets(['علاجي: شرح مصور للمفردات وتجزئة النص إلى مقاطع قصيرة.','إثرائي: كتابة موقف قصير يبين أثر تطبيق القيمة.']);
    summative='يذكر المتعلم معنى إجماليًا واحدًا وقيمة عملية واحدة من النص المقرر.';
    homework='مراجعة النص المقرر وكتابة مثال واحد على تطبيق القيمة في المنزل أو المدرسة.';
    notes='الالتزام بالنص المدرسي المعتمد وعدم إضافة آيات أو أحاديث أو أحكام غير موجودة في الدرس.';
  } else if(kind==='music'){
    prior=bullets(['مراجعة إيقاع/نغمة/مهارة صوتية سابقة.','تهيئة سمعية قصيرة بالتصفيق أو الاستماع.']);
    intro='يؤدي المعلم نموذجًا قصيرًا مرتبطًا بـ «'+lesson+'» ويطلب من المتعلمين وصف ما سمعوه أو تقليد النمط.';
    concepts=bullets([lesson,'الإيقاع','الأداء السليم','الاستماع والتذوق']);
    objectives=bullets(['أن يميز المتعلم العنصر الموسيقي المستهدف في الدرس.','أن يحاكي نموذجًا إيقاعيًا/صوتيًا بصورة صحيحة.','أن يؤدي النشاط جماعيًا مع الالتزام بالإشارة والإيقاع.','أن يعبر عن ملاحظته السمعية بكلمات بسيطة.']);
    activities=bullets(['تهيئة إيقاعية قصيرة.','نمذجة المعلم للمهارة.','تقليد جماعي ثم مجموعات صغيرة.','أداء فردي اختياري مع تشجيع.','لعبة تمييز سمعي مرتبطة بالمفهوم.','إغلاق بأداء جماعي قصير.']);
    resources=bullets(['آلة موسيقية متاحة','بطاقات إيقاع','تسجيل صوتي معتمد عند توفره','سبورة']);
    formative=bullets(['ملاحظة الالتزام بالإيقاع.','تكرار نمط قصير بعد المعلم.','تمييز بين نموذجين سمعيين.']);
    enrichment=bullets(['علاجي: تبطيء النمط وتقسيمه إلى أجزاء.','إثرائي: ابتكار نمط قصير مشابه وأداؤه للمجموعة.']);
    summative='أداء نمط قصير مرتبط بمهارة «'+lesson+'» بصورة مستقلة أو ضمن مجموعة صغيرة.';
    homework='تدريب قصير على النمط/المهارة وتسجيل ملاحظة واحدة عن الأداء.';
    notes='مراعاة الفروق الفردية والثقة بالنفس، وعدم رفع مستوى الصوت بما يسبب إزعاجًا أو إجهادًا سمعيًا.';
  } else if(kind==='art'){
    prior=bullets(['مراجعة عنصر بصري أو خامة سبق استخدامها.','ملاحظة نماذج فنية بسيطة مرتبطة بالموضوع.']);
    intro='يعرض المعلم صورتين أو نموذجين مرتبطين بـ «'+lesson+'» ويسأل: ما العنصر البصري الذي تلاحظه؟ وكيف يمكننا توظيفه؟';
    concepts=bullets([lesson,'الخط/الشكل/اللون حسب النشاط','التكوين','التجريب بالخامات']);
    objectives=bullets(['أن يلاحظ المتعلم العنصر الفني المستهدف ويصفه.','أن يجرب التقنية أو الخامة بصورة صحيحة وآمنة.','أن ينتج عملًا بصريًا يعبر عن فكرة الدرس.','أن يتحدث عن اختياره الفني باختصار ويحترم أعمال زملائه.']);
    activities=bullets(['ملاحظة ومناقشة نموذج بصري.','عرض التقنية أو الخامة ونمذجتها.','تجريب سريع قبل العمل النهائي.','تنفيذ العمل مع متابعة فردية.','عرض مختصر للأعمال وتغذية راجعة إيجابية.','تنظيف وترتيب الأدوات.']);
    resources=bullets(['كتاب/صور مرجعية','أوراق أو خامة مناسبة','ألوان وأدوات رسم','مواد آمنة متاحة']);
    formative=bullets(['ملاحظة طريقة استخدام الخامة.','سؤال: لماذا اخترت هذا الشكل/اللون؟','تغذية راجعة أثناء التنفيذ وفق معيارين واضحين.']);
    enrichment=bullets(['علاجي: نموذج خطوة بخطوة وخيارات أبسط للخامة.','إثرائي: إضافة تفصيل أو معالجة جديدة مع الحفاظ على فكرة العمل.']);
    summative='يعرض المتعلم عمله ويذكر عنصرًا فنيًا واحدًا طبقه بنجاح.';
    homework='رسم تخطيط صغير أو جمع صورة من البيئة مرتبطة بفكرة الدرس.';
    notes='تهيئة الخامات مسبقًا ومراعاة السلامة والنظافة، مع احترام اختلاف الأساليب وعدم فرض نموذج واحد على الجميع.';
  } else if(kind==='pe'){
    prior=bullets(['إحماء عام مناسب للعمر.','مراجعة وضعية أو حركة أساسية مرتبطة بالمهارة.']);
    intro='يوضح المعلم هدف مهارة «'+lesson+'» ويعرض نموذجًا صحيحًا مع التركيز على نقاط السلامة.';
    concepts=bullets([lesson,'الوضع الصحيح','التوازن/التوافق حسب المهارة','السلامة']);
    objectives=bullets(['أن يؤدي المتعلم المهارة الأساسية المرتبطة بـ «'+lesson+'» بصورة صحيحة.','أن يطبق تعليمات السلامة أثناء النشاط.','أن يحسن التوازن أو التوافق الحركي أثناء الأداء.','أن يتعاون مع زملائه ويلتزم بقواعد النشاط.']);
    activities=bullets(['إحماء تدريجي.','شرح ونمذجة المهارة.','تدريب مجزأ على عناصر المهارة.','محطات تدريبية قصيرة.','لعبة تطبيقية توظف المهارة.','تهدئة ومراجعة نقاط الأداء.']);
    resources=bullets(['أقماع','كرات/أدوات مناسبة للمهارة','مساحة آمنة','صافرة عند الحاجة']);
    formative=bullets(['قائمة ملاحظة لنقطتين في الأداء.','تغذية راجعة فورية قصيرة.','مقارنة الأداء قبل التدريب وبعده.']);
    enrichment=bullets(['علاجي: تقليل المسافة/السرعة وتبسيط الحركة.','إثرائي: زيادة الدقة أو دمج المهارة في تحدٍ مركب.']);
    summative='أداء المهارة مرة واحدة في موقف تطبيقي مع الالتزام بقواعد السلامة.';
    homework='نشاط حركي بسيط وآمن لمدة 5 دقائق مع وصف المهارة التي تم التدريب عليها.';
    notes='التأكد من خلو المساحة من العوائق، مراعاة الحالة الصحية والفروق البدنية، ومنع المنافسة غير الآمنة.';
  } else if(kind==='citizenship'){
    prior=bullets(['مناقشة موقف من حياة المتعلم يرتبط بموضوع الدرس.','استدعاء قيمة أو قاعدة سبق تعلمها.']);
    intro='يقدم المعلم موقفًا قصيرًا واقعيًا حول «'+lesson+'» ويطلب من المتعلمين تحديد السلوك الأفضل وسبب اختيارهم.';
    concepts=bullets([lesson,'المسؤولية','الحقوق والواجبات','السلوك الإيجابي']);
    objectives=bullets(['أن يشرح المتعلم فكرة «'+lesson+'» بمثال من حياته.','أن يميز بين سلوك إيجابي وسلوك يحتاج إلى تحسين.','أن يقترح تصرفًا مسؤولًا في موقف مرتبط بالدرس.','أن يشارك في نشاط جماعي باحترام وتعاون.']);
    activities=bullets(['موقف تمهيدي قصير.','مناقشة المفاهيم من خلال صور/بطاقات.','عمل مجموعات لتحليل مواقف.','تمثيل دور أو اتخاذ قرار في موقف.','صياغة قاعدة أو تعهد صفّي مرتبط بالدرس.']);
    resources=bullets(['كتاب الطالب','بطاقات مواقف','صور','سبورة']);
    formative=bullets(['لماذا اخترت هذا السلوك؟','تصنيف بطاقات إلى مناسب/غير مناسب مع التعليل.','ملاحظة المشاركة واحترام الرأي الآخر.']);
    enrichment=bullets(['علاجي: موقف مصور بخيارين واضحين.','إثرائي: اقتراح مبادرة صغيرة تطبق قيمة الدرس في المدرسة.']);
    summative='يكتب/يذكر المتعلم موقفًا واحدًا ويحدد السلوك المسؤول فيه مع سبب مختصر.';
    homework='تطبيق قيمة الدرس في المنزل وتسجيل مثال واحد لما فعله.';
    notes='ربط الدرس بواقع المتعلم دون إحراجه أو طلب معلومات شخصية، وتشجيع الحوار واحترام الاختلاف.';
  } else if(kind==='review'){
    prior='استرجاع سريع لأبرز مفاهيم الوحدة/المحور السابق باستخدام أسئلة قصيرة ومتنوعة.';
    intro='لعبة مراجعة سريعة بعنوان «ماذا أتذكر؟» تتضمن بطاقات أسئلة متفاوتة الصعوبة.';
    concepts=bullets([unit,'المفاهيم الرئيسة','المهارات الأساسية','تصحيح الأخطاء الشائعة']);
    objectives=bullets(['أن يسترجع المتعلم المفاهيم الأساسية في الوحدة.','أن يطبق المهارات في مواقف متنوعة.','أن يحدد نقطة قوة ونقطة تحتاج إلى مراجعة.']);
    activities=bullets(['أسئلة استرجاع سريعة.','محطات مراجعة قصيرة.','تصحيح تعاوني للأخطاء.','مهمة فردية ختامية.']);
    resources=bullets(['الكتاب','بطاقات مراجعة','سبورة','ورقة قصيرة']);
    formative='ملاحظة الأداء في المحطات وتسجيل المفاهيم التي تحتاج إعادة شرح.';
    enrichment=bullets(['علاجي: إعادة شرح مركزة مع مثال إضافي.','إثرائي: سؤال مركب أو تطبيق جديد للمفهوم.']);
    summative='اختبار قصير من 3–5 بنود يغطي أهم أهداف الوحدة.';
    homework='مراجعة الخطأ الذي ظهر في التقويم وكتابة التصحيح.';
    notes='استخدام النتائج لتحديد الحاجة إلى إعادة التدريس قبل الانتقال إلى الدرس التالي.';
  } else {
    prior=bullets(['استرجاع خبرة أو مفردة مرتبطة بموضوع الدرس.','مراجعة مهارة سابقة تمهد لـ «'+lesson+'».']);
    intro='يعرض المعلم صورة أو موقفًا أو سؤالًا مشوقًا مرتبطًا بـ «'+lesson+'» ويمنح المتعلمين وقتًا للتفكير ثم المشاركة.';
    concepts=bullets([lesson,'الفكرة الرئيسة','المفردات الأساسية','التطبيق']);
    objectives=bullets(['أن يوضح المتعلم الفكرة الأساسية في «'+lesson+'».','أن يستخدم المفردات/المفاهيم الرئيسة استخدامًا صحيحًا.','أن يطبق ما تعلمه في نشاط قصير.','أن يعبر عن فهمه شفهيًا أو كتابيًا بما يناسب الصف.']);
    activities=bullets(['تهيئة بسؤال أو صورة.','قراءة/عرض المحتوى وتحديد الكلمات أو الأفكار الرئيسة.','مناقشة موجهة مع أمثلة.','نشاط تعاوني قصير.','تطبيق فردي للتحقق من الفهم.','إغلاق بتلخيص الفكرة في جملة واحدة.']);
    resources=bullets(['كتاب الطالب','سبورة','بطاقات كلمات/صور','ورقة نشاط قصيرة']);
    formative=bullets(['أسئلة فهم متدرجة.','ملاحظة المشاركة في النشاط.','بطاقة خروج بسؤال واحد.']);
    enrichment=bullets(['علاجي: تبسيط المهمة واستخدام صور/كلمات مساعدة.','إثرائي: توسيع الفكرة أو تطبيقها في موقف جديد.']);
    summative='مهمة قصيرة يوضح فيها المتعلم الفكرة الرئيسة ويطبق مهارة واحدة مرتبطة بالدرس.';
    homework='نشاط قصير من سطرين أو مثال واحد مرتبط بـ «'+lesson+'».';
    notes='مراعاة الفروق الفردية، تنويع المشاركة، وربط الأمثلة ببيئة المتعلم.';
  }

  return {
    title:lesson, subject, grade, unit,
    prior,intro,concepts,objectives,
    strategies:strategies(subject),
    activities,resources,formative,enrichment,summative,homework,
    teacherNotes:notes,outcomeNums:''
  };
}

module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const supabaseUrl=process.env.SUPABASE_URL, serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!supabaseUrl||!serviceKey) return res.status(500).json({error:'Supabase configuration is missing.'});
  const token=clean(req.headers.authorization).replace(/^Bearer\s+/i,'').trim();
  if(!token) return res.status(401).json({error:'يجب تسجيل الدخول أولاً.'});
  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:userError}=await admin.auth.getUser(token);
  if(userError||!user) return res.status(401).json({error:'جلسة الدخول غير صالحة.'});
  const {data:profile}=await admin.from('profiles').select('role').eq('auth_user_id',user.id).maybeSingle();
  if(!profile||!['teacher','admin'].includes(profile.role)) return res.status(403).json({error:'غير مصرح.'});

  const subject=clean(req.body?.subject),grade=clean(req.body?.grade),unit=clean(req.body?.unit),lesson=clean(req.body?.lesson);
  if(!subject||!grade||!unit||!lesson) return res.status(400).json({error:'اختر المادة والصف والوحدة والدرس.'});

  if(profile.role==='teacher'){
    const {data:mapRow}=await admin.from('school_kv').select('value').eq('key','teacher_subject_assignments:'+user.id).maybeSingle();
    const assignments=Array.isArray(mapRow?.value?.assignments)?mapRow.value.assignments:[];
    const a=assignments.find(x=>clean(x.subject)===subject);
    const ok=(a?.classes||[]).some(x=>clean(x.grade)===grade);
    if(!ok) return res.status(403).json({error:'هذه المادة أو الصف غير مسند للمعلم.'});
  }

  const key='ready_preparation:'+encodeURIComponent(subject)+':'+encodeURIComponent(grade)+':'+encodeURIComponent(unit)+':'+encodeURIComponent(lesson);
  const {data:stored}=await admin.from('school_kv').select('value').eq('key',key).maybeSingle();
  if(stored?.value) return res.status(200).json({ok:true,data:stored.value,source:'stored'});

  const ready=buildReady({subject,grade,unit,lesson});
  return res.status(200).json({ok:true,data:ready,source:'ready-library'});
};

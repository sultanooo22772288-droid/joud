/* جود — أيقونات SVG وحركات الواجهة */
(function(){
  const P={
    home:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    book:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    cap:'M22 9 12 4 2 9l10 5 10-5zM6 11v5c3 2 9 2 12 0v-5',
    clip:'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
    check:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM8 12l3 3 5-6',
    tick:'m5 12 5 5 9-10',
    trophy:'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
    chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
    trend:'M3 17l6-6 4 4 8-8M15 7h6v6',
    cal:'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
    spark:'M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
    bell:'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
    user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M18 14a6 6 0 0 1 4 7',
    teacher:'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0M15 14l2 3',
    list:'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
    school:'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5M12 10v2',
    mega:'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM17 9a3 3 0 0 1 0 6M20 6a7 7 0 0 1 0 12',
    palette:'M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 21zM7.5 11h.01M10 7h.01M14.5 7h.01M17 11h.01',
    gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    math:'M5 7h6M8 4v6M14 7h5M5 17h6M14 14l5 5M19 14l-5 5',
    flask:'M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
    pen:'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
    globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
    mail:'M3 5h18v14H3zM3 6l9 7 9-7',
    lock:'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    arrow:'M19 12H5M11 6l-6 6 6 6'
  };
  const FILLED={
    star:'<svg class="jd-ico" viewBox="0 0 24 24" fill="#F2A93B" stroke="#C47D12" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    flame:'<svg class="jd-ico jd-flame" viewBox="0 0 24 24" fill="#F08A5D" stroke="#B8431F" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1.5 1 2.5 2 3 3 .5-2 0-4 0-6z"/></svg>'
  };
  const EMOJI={
    '🏠':'home','📚':'book','🎓':'cap','📝':'clip','✅':'check','🏆':'trophy','📈':'trend','📊':'chart',
    '🗓️':'cal','🗓':'cal','📅':'cal','🤖':'spark','🔔':'bell','👤':'user','📋':'list','👨‍🎓':'users','👨‍🏫':'teacher',
    '🏫':'school','📢':'mega','🎨':'palette','⚙️':'gear','➗':'math','🧪':'flask','📖':'pen','🔤':'globe',
    '🌍':'globe','🏅':'star','⭐':'star','🔥':'flame','👥':'users','🧑‍🎓':'users','👩‍🏫':'teacher','📣':'mega','🕒':'cal','⏰':'cal'
  };
  function svg(name){
    if(FILLED[name]) return FILLED[name];
    const d=P[name]; if(!d) return '';
    return '<svg class="jd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';
  }
  window.jdSvg=svg;
  window.jdIcon=function(e){const k=EMOJI[String(e||'').trim()];return k?svg(k):e};

  /* ألوان المواد: الخلفية القديمة ← خلفية ولون جديدان */
  const SUBJECT={
    '#eaf4ff':['#E7EFFD','#2F64C8'],
    '#e8fff5':['#E3F5EC','#17805A'],
    '#fff2df':['#FDF0DA','#A8650B'],
    '#f2eaff':['#EFE9FB','#6A48C9'],
    '#ffe8e8':['#FCE6DE','#B8431F']
  };
  window.jdSubjectColors=function(bg){return SUBJECT[String(bg||'').toLowerCase()]||[bg,'var(--primary)']};

  const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* عدّاد الأرقام في بطاقات الإحصاء */
  function countUp(el){
    if(el.dataset.jdCounted) return;
    const text=el.textContent.trim();
    const m=text.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if(!m){el.dataset.jdCounted='1';return;}
    const target=parseFloat(m[2].replace(/,/g,''));
    if(!isFinite(target)||target===0){el.dataset.jdCounted='1';return;}
    el.dataset.jdCounted='1';
    if(reduced()) return;
    const hasComma=m[2].includes(','), decimals=(m[2].split('.')[1]||'').length;
    const fmt=v=>{const s=v.toFixed(decimals);return hasComma?Number(s).toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}):s};
    const start=performance.now()+250, dur=1400;
    el.textContent=m[1]+fmt(0)+m[3];
    const step=now=>{
      const t=Math.max(0,Math.min(1,(now-start)/dur)), e=1-Math.pow(1-t,3);
      el.textContent=m[1]+fmt(target*e)+m[3];
      if(t<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  window.jdAfterShow=function(id){
    const page=document.getElementById(id)||document.querySelector('.page.active');
    if(page) page.querySelectorAll('.stat h4, .jd-ring-label b').forEach(countUp);
    document.querySelectorAll('.mobile-nav button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  };

  /* إظهار وإخفاء كلمة المرور */
  window.jdTogglePassword=function(btn){
    const input=document.getElementById('loginPassword'); if(!input) return;
    const show=input.type==='password';
    input.type=show?'text':'password';
    btn.setAttribute('aria-label',show?'إخفاء كلمة المرور':'إظهار كلمة المرور');
    btn.setAttribute('aria-pressed',show?'true':'false');
  };
})();


/* ===== جود: المالية — رسوم سنوية مرنة ===== */
(function jdFinanceBootstrap(){
  const GRADES=['روضة','تمهيدي','الصف الأول','الصف الثاني','الصف الثالث','الصف الرابع'];
  let financeState={settings:null,accounts:[],loading:false,saving:false,syncing:false,synced:false,filters:{search:'',grade:'',section:'',status:''},tableScrollTop:0};

  function money(v){
    return jfNum(v)+' ر.ع';
  }
  // الأرقام في المالية بالإنجليزية (تنسيق 1,234.500)
  function jfNum(v){
    const n=Number(v)||0;
    return n.toLocaleString('en-US',{minimumFractionDigits:3,maximumFractionDigits:3});
  }
  const JF_ICON={
    plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    gear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
    download:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>',
    chevron:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    more:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chat:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>',
    doc:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
    history:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
    bell:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    close:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  const JF_STATUS={paid:'مكتمل',partial:'جزئي',unpaid:'غير مسدد',no_fee:'بلا رسوم'};
  const JF_BAR={paid:'var(--jf-paid)',partial:'var(--jf-part)',unpaid:'var(--jf-unpaid)',no_fee:'var(--jf-nofee)'};
  const JF_TONES=[['var(--jf-accent-soft)','var(--jf-accent)'],['var(--jf-part-bg)','var(--jf-part-fg)'],['var(--jf-paid-bg)','var(--jf-paid-fg)'],['var(--jf-unpaid-bg)','var(--jf-unpaid-fg)']];
  function jfStatus(a){
    const annual=Number(a.annual_fee)||0, paid=Number(a.paid_amount)||0;
    return annual<=0?'no_fee':paid>=annual?'paid':paid>0?'partial':'unpaid';
  }
  function jfInitials(name){
    const p=String(name||'').trim().split(/\s+/).filter(Boolean);
    return p.length?(p[0][0]+(p[1]?' '+p[1][0]:'')):'؟';
  }
  function jfTone(key){
    let h=0; for(const ch of String(key||'')) h=(h*31+ch.charCodeAt(0))>>>0;
    return JF_TONES[h%JF_TONES.length];
  }
  function jfPalette(){
    try{ return localStorage.getItem('jdFinancePalette')==='emerald'?'emerald':'royal'; }catch(e){ return 'royal'; }
  }
  window.jdSetFinancePalette=function(p){
    p=p==='emerald'?'emerald':'royal';
    try{ localStorage.setItem('jdFinancePalette',p); }catch(e){}
    document.querySelectorAll('.jf,.jf-modal').forEach(el=>{el.dataset.palette=p;});
    document.querySelectorAll('.jf-palette button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.p===p)));
  };
  // إغلاق القوائم المنسدلة عند الضغط خارجها
  document.addEventListener('click',e=>{
    document.querySelectorAll('.jf-menu[open]').forEach(m=>{ if(!m.contains(e.target)) m.removeAttribute('open'); });
  });
  function defaultRows(){
    return GRADES.map(grade=>({grade,annual_fee:0}));
  }
  async function ensureSettings(force=false){
    if(financeState.settings&&!force) return financeState.settings;
    financeState.loading=true;
    try{
      const s=await NabdCloud.getFinanceFeeSettings();
      financeState.settings=s||{academic_year:'2026/2027',rows:defaultRows()};
      if(!Array.isArray(financeState.settings.rows)) financeState.settings.rows=defaultRows();
      return financeState.settings;
    }finally{ financeState.loading=false; }
  }
  async function ensureAccounts(force=false){
    if(financeState.accounts.length&&!force) return financeState.accounts;
    financeState.accounts=await NabdCloud.listFinanceAccounts();
    return financeState.accounts;
  }

  window.jdSaveFeeSettings=async function(){
    if(financeState.saving) return;
    const status=document.getElementById('financeSaveStatus');
    try{
      financeState.saving=true;
      if(status){status.textContent='جاري الحفظ…';status.style.color='var(--muted)';}
      const rows=GRADES.map((grade,i)=>({
        grade,
        annual_fee:Number(document.getElementById('feeAnnual'+i)?.value)||0
      }));
      const academic_year=(document.getElementById('financeAcademicYear')?.value||'2026/2027').trim();
      financeState.settings=await NabdCloud.saveFinanceFeeSettings({academic_year,rows});
      // بعد تغيير الرسوم نحدّث حسابات الطلاب فورًا لتأخذ الرسوم السنوية الجديدة.
      const sync=await NabdCloud.syncFinanceAccounts();
      financeState.accounts=sync.accounts||[];
      financeState.synced=true;
      await window.renderFinanceAdmin();
      document.getElementById('financeSettings')?.setAttribute('open','');
      const next=document.getElementById('financeSaveStatus');
      if(next){next.textContent='✓ تم حفظ الرسوم وتحديث حسابات الطلاب';next.style.color='#178a5b';}
    }catch(e){
      if(status){status.textContent='تعذر الحفظ: '+(e.message||'');status.style.color='#c0392b';}
      else alert('تعذر الحفظ: '+(e.message||''));
    }finally{financeState.saving=false;}
  };

  window.jdSyncFinanceAccounts=async function(){
    if(financeState.syncing) return;
    const btn=document.getElementById('financeSyncBtn');
    const st=document.getElementById('financeSyncStatus');
    try{
      financeState.syncing=true;
      if(btn) btn.disabled=true;
      if(st){st.textContent='جاري إنشاء وتحديث الحسابات…';st.style.color='var(--muted)';}
      const out=await NabdCloud.syncFinanceAccounts();
      financeState.accounts=out.accounts||[];
      financeState.synced=true;
      await window.renderFinanceAdmin();
      const msg=document.getElementById('financeSyncStatus');
      if(msg){msg.textContent='✓ تمت مزامنة '+Number(out.count||0)+' حساب طالب';msg.style.color='#178a5b';}
    }catch(e){
      if(st){st.textContent='تعذر تحديث الحسابات: '+(e.message||'');st.style.color='#c0392b';}
    }finally{
      financeState.syncing=false;
      if(btn) btn.disabled=false;
    }
  };

  function jdFinanceFilteredRows(ignoreStatus=false){
    const searchEl=document.getElementById('financeAccountSearch');
    const gradeEl=document.getElementById('financeAccountGrade');
    const sectionEl=document.getElementById('financeAccountSection');
    const statusEl=document.getElementById('financeAccountStatus');
    const rawSearch=searchEl?searchEl.value:(financeState.filters.search||'');
    const grade=gradeEl?gradeEl.value:(financeState.filters.grade||'');
    const section=sectionEl?sectionEl.value:(financeState.filters.section||'');
    const status=statusEl?statusEl.value:(financeState.filters.status||'');
    financeState.filters={search:rawSearch,grade,section,status};
    const q=String(rawSearch||'').trim().toLowerCase();
    return financeState.accounts.filter(a=>{
      const annual=Number(a.annual_fee)||0;
      const paid=Number(a.paid_amount)||0;
      const st=annual<=0?'no_fee':paid>=annual?'paid':paid>0?'partial':'unpaid';
      return (!grade||a.grade===grade)&&
        (!section||String(a.section||'')===section)&&
        (ignoreStatus||!status||st===status)&&
        (!q||String(a.student_name||'').toLowerCase().includes(q)||String(a.student_id||'').toLowerCase().includes(q)||String(a.guardian_phone||'').includes(q));
    });
  }

  function jdFinanceStatusLabel(a){
    const annual=Number(a.annual_fee)||0, paid=Number(a.paid_amount)||0;
    return annual<=0?'بلا رسوم محددة':paid>=annual?'مكتمل السداد':paid>0?'سداد جزئي':'غير مسدد';
  }

  window.jdExportFinanceExcel=function(){
    const rows=jdFinanceFilteredRows();
    if(!rows.length){alert('لا توجد بيانات لتصديرها حسب الفلاتر الحالية.');return;}
    if(!window.XLSX){alert('مكتبة Excel لم تكتمل بعد. حاول مرة أخرى بعد لحظات.');return;}
    const data=rows.map((a,i)=>({
      'م':i+1,
      'اسم الطالب':a.student_name||'',
      'رقم الطالب':a.student_id||'',
      'الصف':a.grade||'',
      'الشعبة':a.section||'',
      'هاتف ولي الأمر':a.guardian_phone||'',
      'الرسوم السنوية (ر.ع)':Number(a.annual_fee)||0,
      'المدفوع (ر.ع)':Number(a.paid_amount)||0,
      'المتبقي (ر.ع)':Math.max(0,(Number(a.annual_fee)||0)-(Number(a.paid_amount)||0)),
      'حالة السداد':jdFinanceStatusLabel(a)
    }));
    const ws=XLSX.utils.json_to_sheet(data);
    ws['!cols']=[{wch:6},{wch:28},{wch:16},{wch:16},{wch:10},{wch:18},{wch:18},{wch:16},{wch:16},{wch:18}];
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'التقرير المالي');
    const grade=document.getElementById('financeAccountGrade')?.value||'الكل';
    const section=document.getElementById('financeAccountSection')?.value||'الكل';
    XLSX.writeFile(wb,`تقرير-الرسوم-${grade}-${section}.xlsx`);
  };

  window.jdExportFinancePdf=function(){
    const rows=jdFinanceFilteredRows();
    if(!rows.length){alert('لا توجد بيانات لتصديرها حسب الفلاتر الحالية.');return;}
    const totalFees=rows.reduce((s,a)=>s+(Number(a.annual_fee)||0),0);
    const totalPaid=rows.reduce((s,a)=>s+(Number(a.paid_amount)||0),0);
    const totalBalance=Math.max(0,totalFees-totalPaid);
    const grade=document.getElementById('financeAccountGrade')?.value||'كل الصفوف';
    const section=document.getElementById('financeAccountSection')?.value||'كل الشعب';
    const statusText=document.getElementById('financeAccountStatus')?.selectedOptions?.[0]?.textContent||'كل حالات السداد';
    const win=window.open('','_blank','noopener,noreferrer');
    if(!win){alert('اسمح بفتح النوافذ المنبثقة حتى يتم تجهيز تقرير PDF.');return;}
    const report=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>التقرير المالي</title>
      <style>
        @page{size:A4 landscape;margin:10mm}
        body{font-family:Arial,Tahoma,sans-serif;color:#222;margin:0}
        h1{margin:0 0 6px;font-size:22px}.sub{color:#666;margin-bottom:14px}
        .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0 16px}
        .box{border:1px solid #ddd;border-radius:8px;padding:10px}.box b{display:block;font-size:17px;margin-top:4px}
        table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #ccc;padding:6px;text-align:center}th{background:#f2f4f7}td:first-child{text-align:right}
        .foot{margin-top:10px;color:#777;font-size:10px}
      </style></head><body>
      <h1>التقرير المالي — مدرسة نخل الخاصة</h1>
      <div class="sub">العام الدراسي: ${esc(financeState.settings?.academic_year||'')} | الصف: ${esc(grade)} | الشعبة: ${esc(section)} | الحالة: ${esc(statusText)}</div>
      <div class="summary">
        <div class="box">إجمالي الرسوم<b>${money(totalFees)}</b></div>
        <div class="box">إجمالي المحصل<b>${money(totalPaid)}</b></div>
        <div class="box">إجمالي المتبقي<b>${money(totalBalance)}</b></div>
      </div>
      <table><thead><tr><th>الطالب</th><th>الصف</th><th>الشعبة</th><th>ولي الأمر</th><th>الرسوم السنوية</th><th>المدفوع</th><th>المتبقي</th><th>الحالة</th></tr></thead><tbody>
      ${rows.map(a=>`<tr><td>${esc(a.student_name||'')}</td><td>${esc(a.grade||'')}</td><td>${esc(a.section||'')}</td><td dir="ltr">${esc(a.guardian_phone||'')}</td><td>${money(a.annual_fee)}</td><td>${money(a.paid_amount||0)}</td><td>${money(Math.max(0,(Number(a.annual_fee)||0)-(Number(a.paid_amount)||0)))}</td><td>${jdFinanceStatusLabel(a)}</td></tr>`).join('')}
      </tbody></table>
      <div class="foot">عدد الطلاب: ${rows.length} — تاريخ التقرير: ${new Date().toLocaleDateString('ar-OM-u-nu-latn')}</div>
      <script>window.onload=()=>setTimeout(()=>window.print(),250);<\/script>
      </body></html>`;
    win.document.open();win.document.write(report);win.document.close();
  };

  window.jdFilterFinanceAccounts=function(){
    const rows=jdFinanceFilteredRows();
    // الأرقام العلوية وعدّادات التبويبات تتبع البحث والصف والشعبة، بغض النظر عن تبويب الحالة.
    const base=jdFinanceFilteredRows(true);
    const body=document.getElementById('financeAccountsBody');
    const count=document.getElementById('financeAccountsCount');
    if(count) count.textContent=rows.length;

    const totalFees=base.reduce((s,a)=>s+(Number(a.annual_fee)||0),0);
    const totalPaid=base.reduce((s,a)=>s+(Number(a.paid_amount)||0),0);
    const totalBalance=Math.max(0,totalFees-totalPaid);
    const rate=totalFees>0?Math.min(100,Math.floor(totalPaid/totalFees*100)):0;
    const counts={paid:0,partial:0,unpaid:0,no_fee:0};
    base.forEach(a=>{counts[jfStatus(a)]++;});
    const owing=base.filter(a=>(Number(a.annual_fee)||0)>(Number(a.paid_amount)||0));
    const setText=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    setText('financeKpiRate',rate+'%');
    setText('financeKpiFees',jfNum(totalFees));
    setText('financeKpiPaid',jfNum(totalPaid));
    setText('financeKpiBalance',jfNum(totalBalance));
    setText('financeKpiUnpaid',counts.unpaid);
    setText('financeKpiPartial',counts.partial);
    setText('financeKpiComplete',counts.paid);
    setText('financeKpiNoFee',counts.no_fee);
    setText('financeKpiStudents',base.length);
    setText('financeKpiOwing',owing.length);
    setText('financeKpiOwingAmount',jfNum(totalBalance));
    const bar=document.getElementById('financeKpiRateBar'); if(bar) bar.style.width=rate+'%';
    const stack=document.getElementById('financeKpiStack');
    if(stack){
      const n=base.length||1;
      stack.innerHTML=['paid','partial','unpaid','no_fee'].filter(k=>counts[k]>0)
        .map(k=>`<span style="width:${counts[k]/n*100}%;background:${JF_BAR[k]}"></span>`).join('')
        ||'<span style="width:100%;background:var(--jf-track)"></span>';
    }
    const status=financeState.filters.status||'';
    document.querySelectorAll('.jf-tabs button').forEach(b=>{
      b.setAttribute('aria-pressed',String((b.dataset.status||'')===status));
      const c=b.querySelector('.num'); if(c) c.textContent=b.dataset.status?counts[b.dataset.status]:base.length;
    });
    const grade=financeState.filters.grade||'';
    document.querySelectorAll('.jf-grade').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.grade===grade)));

    if(!body) return;
    body.innerHTML=rows.length?rows.map(a=>{
      const fee=Number(a.annual_fee)||0, paid=Number(a.paid_amount)||0, left=Math.max(0,fee-paid), st=jfStatus(a);
      const pct=fee>0?Math.min(100,Math.round(paid/fee*100)):0;
      const tone=jfTone(a.student_auth_id||a.student_name);
      const id=JSON.stringify(a.student_auth_id);
      return `<div class="jf-row" role="row">
        <div class="c-student jf-student" role="cell"><span class="jf-avatar" style="background:${tone[0]};color:${tone[1]}">${esc(jfInitials(a.student_name))}</span><div style="min-width:0"><b>${esc(a.student_name||'طالب')}</b><small><span class="num">${esc(a.student_id||'')}</span></small></div></div>
        <div class="c-grade" role="cell">${esc(a.grade||'—')} <span class="jf-sub">/ ${esc(a.section||'—')}</span></div>
        <div class="c-phone" role="cell"><span class="num">${esc(a.guardian_phone||'—')}</span></div>
        <div class="c-prog jf-prog" role="cell"><div class="l">${fee?`<b class="num">${jfNum(paid)}</b><span>من <span class="num">${jfNum(fee)}</span></span>`:'<span>لم تُحدَّد رسوم لصفّه</span>'}</div><div class="jf-track"><span style="width:${pct}%;background:${JF_BAR[st]}"></span></div></div>
        <div class="c-left jf-left${left>0?'':' zero'}" role="cell"><span class="num">${fee?jfNum(left):'—'}</span></div>
        <div class="c-status" role="cell"><span class="jf-chip ${st}">${JF_STATUS[st]}</span></div>
        <div class="c-actions jf-row-actions" role="cell">
          ${left>0?`<button type="button" class="jf-btn primary sm" onclick='jdOpenPaymentModal(${JSON.stringify(JSON.stringify(a))})'>+ دفعة</button>`:''}
          <button type="button" class="jf-icon" title="كشف الحساب" aria-label="كشف الحساب" onclick='jdShowStudentStatement(${id})'>${JF_ICON.doc}</button>
          <button type="button" class="jf-icon" title="سجل الدفعات" aria-label="سجل الدفعات" onclick='jdShowPaymentHistory(${id})'>${JF_ICON.history}</button>
          <button type="button" class="jf-icon wa" title="تذكير واتساب" aria-label="تذكير واتساب" onclick='jdSendFinanceReminder(${id},this)' ${left<=0?'disabled':''}>${JF_ICON.chat}</button>
        </div>
      </div>`;
    }).join(''):'<div class="jf-empty">لا توجد حسابات مطابقة.</div>';
  };

  window.jdFinancePickStatus=function(s){
    const sel=document.getElementById('financeAccountStatus');
    if(sel) sel.value=s||'';
    window.jdFilterFinanceAccounts();
  };
  window.jdFinancePickGrade=function(g){
    const sel=document.getElementById('financeAccountGrade');
    if(sel) sel.value=(sel.value===g?'':g);
    window.jdFilterFinanceAccounts();
  };
  window.jdOpenFeeSettings=function(){
    const d=document.getElementById('financeSettings');
    if(!d) return;
    d.open=true;
    d.scrollIntoView({behavior:'smooth',block:'start'});
  };
  window.jdFocusFinanceSearch=function(){
    const input=document.getElementById('financeAccountSearch');
    const hint=document.getElementById('financeSyncStatus');
    if(input){ input.scrollIntoView({behavior:'smooth',block:'center'}); input.focus({preventScroll:true}); }
    if(hint){ hint.textContent='ابحث عن الطالب ثم اضغط «+ دفعة» في صفّه.'; hint.style.color='var(--jf-accent)'; }
  };
  window.jdOpenPaymentModal=function(accountJson){
    const a=typeof accountJson==='string'?JSON.parse(accountJson):accountJson;
    document.getElementById('financePaymentModal')?.remove();
    const fee=Number(a.annual_fee)||0, paid=Number(a.paid_amount)||0;
    const balance=Math.max(0,fee-paid);
    const pct=fee>0?Math.min(100,Math.round(paid/fee*100)):0;
    const st=jfStatus(a);
    const wrap=document.createElement('div');
    wrap.id='financePaymentModal';
    wrap.className='jf-modal';
    wrap.dataset.palette=jfPalette();
    wrap.addEventListener('click',e=>{ if(e.target===wrap) wrap.remove(); });
    wrap.innerHTML=`
      <div class="jf-sheet" role="dialog" aria-modal="true" aria-labelledby="financePayTitle">
        <div class="jf-sheet-head">
          <div><h3 id="financePayTitle">تسجيل دفعة</h3><p>${esc(a.student_name||'')} · ${esc(a.grade||'')} / ${esc(a.section||'')}</p></div>
          <button type="button" class="jf-close" aria-label="إغلاق" onclick="document.getElementById('financePaymentModal').remove()">${JF_ICON.close}</button>
        </div>
        <div class="jf-sheet-body">
          <div class="jf-summary">
            <div class="jf-ring" style="background:conic-gradient(${JF_BAR[st]} 0 ${pct}%, var(--jf-line) 0)"><b class="num">${pct}%</b></div>
            <div class="cols">
              <div><small>الرسوم السنوية</small><b class="num">${jfNum(fee)}</b></div>
              <div><small>المدفوع</small><b class="num" style="color:var(--jf-paid-fg)">${jfNum(paid)}</b></div>
              <div><small>المتبقي</small><b class="num" style="color:var(--jf-unpaid-fg)">${jfNum(balance)}</b></div>
            </div>
          </div>
          <label class="jf-field jf-amount">المبلغ المدفوع (ر.ع)
            <input id="financePayAmount" type="number" min="0.001" max="${balance}" step="0.001" placeholder="0.000" dir="ltr" inputmode="decimal">
          </label>
          <div class="jf-quick">
            <button type="button" onclick="document.getElementById('financePayAmount').value='${balance.toFixed(3)}'">كامل المتبقي · <span class="num">${jfNum(balance)}</span></button>
            ${balance>=0.002?`<button type="button" onclick="document.getElementById('financePayAmount').value='${(Math.floor(balance/2*1000)/1000).toFixed(3)}'">نصف المتبقي · <span class="num">${jfNum(Math.floor(balance/2*1000)/1000)}</span></button>`:''}
          </div>
          <div class="jf-two">
            <div class="jf-field"><span>طريقة الدفع</span>
              <input id="financePayMethod" type="hidden" value="cash">
              <div class="jf-seg" role="group" aria-label="طريقة الدفع">
                ${[['cash','نقدي'],['bank','تحويل بنكي'],['card','بطاقة']].map(([v,l],i)=>`<button type="button" data-v="${v}" aria-pressed="${i===0}" onclick="document.getElementById('financePayMethod').value='${v}';this.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===this)))">${l}</button>`).join('')}
              </div>
            </div>
            <label class="jf-field">تاريخ الدفع<input id="financePayDate" type="date" value="${new Date().toISOString().slice(0,10)}" dir="ltr"></label>
          </div>
          <div class="jf-two">
            <label class="jf-field">رقم المرجع (اختياري)<input id="financePayRef" placeholder="رقم التحويل / المرجع"></label>
            <label class="jf-field">ملاحظة (اختياري)<input id="financePayNote"></label>
          </div>
          <div id="financePayStatus" class="jf-status"></div>
          <button type="button" class="jf-btn primary jf-submit" onclick='jdSavePayment(${JSON.stringify(a.student_auth_id)})'>حفظ الدفعة وإصدار إيصال</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    setTimeout(()=>document.getElementById('financePayAmount')?.focus(),30);
  };
  window.jdSavePayment=async function(studentAuthId){
    const st=document.getElementById('financePayStatus');
    try{
      if(st){st.textContent='جاري حفظ الدفعة…';st.style.color='var(--muted)';}
      const amount=Number(document.getElementById('financePayAmount')?.value)||0;
      const payment_date=document.getElementById('financePayDate')?.value||'';
      const method=document.getElementById('financePayMethod')?.value||'cash';
      const reference=document.getElementById('financePayRef')?.value||'';
      const note=document.getElementById('financePayNote')?.value||'';
      const out=await NabdCloud.addFinancePayment({student_auth_id:studentAuthId,amount,payment_date,method,reference,note});
      let waSent=false,waError='';
      try{
        await NabdCloud.sendFinancePaymentReceipt(out.payment.receipt_no);
        waSent=true;
      }catch(wa){
        waError=wa?.message||'تعذر إرسال رسالة واتساب.';
      }
      if(st){
        st.textContent=waSent
          ? '✓ تم تسجيل الدفعة وإرسال الإيصال لولي الأمر — رقم الإيصال: '+out.payment.receipt_no
          : '✓ تم تسجيل الدفعة — رقم الإيصال: '+out.payment.receipt_no+' | ملاحظة: '+waError;
        st.style.color=waSent?'#178a5b':'#b87100';
      }
      financeState.accounts=await NabdCloud.listFinanceAccounts();
      setTimeout(()=>{document.getElementById('financePaymentModal')?.remove();window.renderFinanceAdmin();},waSent?1200:1800);
    }catch(e){
      if(st){st.textContent='تعذر الحفظ: '+(e.message||'');st.style.color='#c0392b';}
    }
  };

  window.jdShowPaymentHistory=async function(studentAuthId){
    try{
      const list=await NabdCloud.listFinancePayments(studentAuthId);
      document.getElementById('financeHistoryModal')?.remove();
      const a=financeState.accounts.find(x=>String(x.student_auth_id)===String(studentAuthId))||{};
      const wrap=document.createElement('div');
      wrap.id='financeHistoryModal';
      wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(20,28,45,.38);display:grid;place-items:center;padding:16px';
      wrap.innerHTML=`
        <div class="card" style="width:min(760px,96vw);max-height:90vh;overflow:auto">
          <div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="margin:0">🧾 سجل الدفعات</h3><small style="color:var(--muted)">${esc(a.student_name||'')}</small></div><button class="btn soft" onclick="document.getElementById('financeHistoryModal').remove()">✕</button></div>
          <div style="overflow:auto;margin-top:14px"><table style="width:100%;border-collapse:collapse;min-width:650px"><thead><tr><th>الإيصال</th><th>التاريخ</th><th>المبلغ</th><th>الطريقة</th><th>المرجع</th><th>المسجل بواسطة</th><th>إجراء</th></tr></thead><tbody>
          ${list.length?list.map(p=>`<tr><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.receipt_no||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.payment_date||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(p.amount)}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${p.method==='bank'?'تحويل بنكي':p.method==='card'?'بطاقة':'نقدي'}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.reference||'—')}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.created_by||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line)"><button class="btn soft" style="padding:6px 8px" onclick='jdEditPayment(${JSON.stringify(JSON.stringify(p))})'>تعديل</button><button class="btn soft" style="padding:6px 8px;margin-right:4px" onclick='jdVoidPayment(${JSON.stringify(p.receipt_no)},${JSON.stringify(studentAuthId)})'>إلغاء</button></td></tr>`).join(''):'<tr><td colspan="7" style="padding:22px;text-align:center;color:var(--muted)">لا توجد دفعات مسجلة.</td></tr>'}
          </tbody></table></div>
          <div style="margin-top:12px"><button class="btn soft" onclick='jdShowFinanceAudit(${JSON.stringify(studentAuthId)})'>🧾 عرض سجل التدقيق</button></div>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل سجل الدفعات: '+(e.message||''));}
  };


  window.jdEditPayment=function(paymentJson){
    const p=typeof paymentJson==='string'?JSON.parse(paymentJson):paymentJson;
    document.getElementById('financeEditPaymentModal')?.remove();
    const wrap=document.createElement('div');
    wrap.id='financeEditPaymentModal';
    wrap.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(20,28,45,.38);display:grid;place-items:center;padding:16px';
    wrap.innerHTML=`
      <div class="card" style="width:min(540px,96vw);max-height:90vh;overflow:auto">
        <div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="margin:0">✏️ تعديل دفعة</h3><small style="color:var(--muted)">${esc(p.receipt_no||'')}</small></div><button class="btn soft" onclick="document.getElementById('financeEditPaymentModal').remove()">✕</button></div>
        <div class="upload-row" style="margin-top:14px">
          <div><label>المبلغ</label><input id="financeEditAmount" type="number" min="0.001" step="0.001" value="${Number(p.amount)||0}" dir="ltr"></div>
          <div><label>التاريخ</label><input id="financeEditDate" type="date" value="${esc(p.payment_date||'')}" dir="ltr"></div>
          <div><label>طريقة الدفع</label><select id="financeEditMethod"><option value="cash" ${p.method==='cash'?'selected':''}>نقدي</option><option value="bank" ${p.method==='bank'?'selected':''}>تحويل بنكي</option><option value="card" ${p.method==='card'?'selected':''}>بطاقة</option></select></div>
          <div><label>المرجع</label><input id="financeEditRef" value="${esc(p.reference||'')}"></div>
        </div>
        <div style="margin-top:10px"><label>ملاحظة</label><textarea id="financeEditNote" rows="2" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px">${esc(p.note||'')}</textarea></div>
        <div style="margin-top:10px"><label>سبب التعديل *</label><textarea id="financeEditReason" rows="2" placeholder="مثال: تصحيح مبلغ أدخل بالخطأ" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px"></textarea></div>
        <div id="financeEditStatus" style="margin-top:10px;font-size:13px;font-weight:800"></div>
        <button class="btn primary" style="width:100%;margin-top:12px" onclick='jdSaveEditedPayment(${JSON.stringify(p.receipt_no)},${JSON.stringify(p.student_auth_id)})'>حفظ التعديل</button>
      </div>`;
    document.body.appendChild(wrap);
  };

  window.jdSaveEditedPayment=async function(receiptNo,studentAuthId){
    const st=document.getElementById('financeEditStatus');
    try{
      const payload={
        receipt_no:receiptNo,
        amount:Number(document.getElementById('financeEditAmount')?.value)||0,
        payment_date:document.getElementById('financeEditDate')?.value||'',
        method:document.getElementById('financeEditMethod')?.value||'cash',
        reference:document.getElementById('financeEditRef')?.value||'',
        note:document.getElementById('financeEditNote')?.value||'',
        reason:(document.getElementById('financeEditReason')?.value||'').trim()
      };
      if(st){st.textContent='جاري حفظ التعديل…';st.style.color='var(--muted)';}
      await NabdCloud.updateFinancePayment(payload);
      financeState.accounts=await NabdCloud.listFinanceAccounts();
      if(st){st.textContent='✓ تم تعديل الدفعة وتسجيل العملية في سجل التدقيق';st.style.color='#178a5b';}
      setTimeout(()=>{document.getElementById('financeEditPaymentModal')?.remove();document.getElementById('financeHistoryModal')?.remove();jdShowPaymentHistory(studentAuthId);window.renderFinanceAdmin();},800);
    }catch(e){if(st){st.textContent='تعذر التعديل: '+(e.message||'');st.style.color='#c0392b';}}
  };

  window.jdVoidPayment=async function(receiptNo,studentAuthId){
    const reason=prompt('اكتب سبب إلغاء هذه الدفعة:');
    if(reason===null) return;
    if(!String(reason).trim()){alert('سبب الإلغاء مطلوب.');return;}
    if(!confirm('تأكيد إلغاء الدفعة '+receiptNo+'؟ لن يتم حذفها من سجل التدقيق.')) return;
    try{
      await NabdCloud.voidFinancePayment(receiptNo,String(reason).trim());
      financeState.accounts=await NabdCloud.listFinanceAccounts();
      document.getElementById('financeHistoryModal')?.remove();
      await jdShowPaymentHistory(studentAuthId);
      window.renderFinanceAdmin();
    }catch(e){alert('تعذر إلغاء الدفعة: '+(e.message||''));}
  };

  window.jdShowFinanceAudit=async function(studentAuthId){
    try{
      const list=await NabdCloud.listFinanceAudit(studentAuthId);
      document.getElementById('financeAuditModal')?.remove();
      const wrap=document.createElement('div');
      wrap.id='financeAuditModal';
      wrap.style.cssText='position:fixed;inset:0;z-index:10001;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';
      wrap.innerHTML=`
        <div class="card" style="width:min(820px,96vw);max-height:90vh;overflow:auto">
          <div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="margin:0">🧾 سجل تدقيق الدفعات</h3><small style="color:var(--muted)">لا يمكن حذف هذا السجل من الواجهة.</small></div><button class="btn soft" onclick="document.getElementById('financeAuditModal').remove()">✕</button></div>
          <div style="margin-top:14px">
          ${list.length?list.map(x=>`<div class="card" style="padding:12px;margin-bottom:9px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><b>${x.action==='payment_voided'?'إلغاء دفعة':'تعديل دفعة'} — ${esc(x.receipt_no||'')}</b><span class="tag ${x.action==='payment_voided'?'red':'orange'}">${new Date(x.created_at).toLocaleString('ar-OM-u-nu-latn')}</span></div><div style="margin-top:6px;color:var(--muted);font-size:12px">بواسطة: ${esc(x.actor_name||'')} — السبب: ${esc(x.reason||'')}</div>${x.action==='payment_updated'?'<div style="margin-top:6px;font-size:12px">المبلغ قبل: <b>'+money(x.before?.amount||0)+'</b> — بعد: <b>'+money(x.after?.amount||0)+'</b></div>':''}</div>`).join(''):'<div style="padding:20px;text-align:center;color:var(--muted)">لا توجد تعديلات أو إلغاءات مسجلة.</div>'}
          </div>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل سجل التدقيق: '+(e.message||''));}
  };


  function jdFinanceSleep(ms){return new Promise(r=>setTimeout(r,ms));}

  window.jdSendFinanceReminder=async function(studentAuthId,btn){
    const a=financeState.accounts.find(x=>String(x.student_auth_id)===String(studentAuthId));
    if(!a) return alert('تعذر العثور على حساب الطالب.');
    const balance=Math.max(0,(Number(a.annual_fee)||0)-(Number(a.paid_amount)||0));
    if(balance<=0) return alert('لا يوجد مبلغ متبقٍ على هذا الطالب.');
    if(!a.guardian_phone) return alert('رقم ولي الأمر غير موجود لهذا الطالب.');
    if(!confirm('إرسال تذكير واتساب لولي أمر '+(a.student_name||'الطالب')+' بالمبلغ المتبقي '+money(balance)+'؟')) return;
    const old=btn?.innerHTML;
    const iconOnly=!!btn?.classList.contains('jf-icon');
    try{
      if(btn){btn.disabled=true;btn.textContent=iconOnly?'…':'إرسال…';}
      await NabdCloud.sendFinanceReminder(studentAuthId);
      if(btn){btn.textContent=iconOnly?'✓':'تم ✓';}
    }catch(e){
      alert('تعذر إرسال التذكير: '+(e.message||''));
      if(btn){btn.disabled=false;btn.innerHTML=old||'واتساب';}
    }
  };

  window.jdSendFinanceRemindersFiltered=async function(){
    const rows=jdFinanceFilteredRows().filter(a=>(Number(a.annual_fee)||0)>(Number(a.paid_amount)||0)&&a.guardian_phone);
    if(!rows.length) return alert('لا توجد حسابات مستحقة برقم ولي أمر ضمن النتائج الحالية.');
    if(!confirm('سيتم إرسال تذكير واتساب إلى '+rows.length+' ولي أمر حسب الفلاتر الحالية. متابعة؟')) return;
    const btn=document.getElementById('financeBulkWaBtn');
    const st=document.getElementById('financeBulkWaStatus');
    let sent=0,failed=0;
    try{
      if(btn) btn.disabled=true;
      for(let i=0;i<rows.length;i++){
        if(st) st.textContent='جاري الإرسال '+(i+1)+' / '+rows.length+'…';
        try{
          await NabdCloud.sendFinanceReminder(rows[i].student_auth_id);
          sent++;
        }catch(e){
          failed++;
          if(e?.status===429 && e?.retryAfter){
            await jdFinanceSleep(Math.max(5500,Number(e.retryAfter)*1000));
            try{await NabdCloud.sendFinanceReminder(rows[i].student_auth_id);sent++;failed--;}catch(_e){}
          }
        }
        if(i<rows.length-1) await jdFinanceSleep(5500);
      }
      if(st){st.textContent='تم الإرسال: '+sent+(failed?' — تعذر: '+failed:'');st.style.color=failed?'#b87100':'#178a5b';}
    }finally{if(btn)btn.disabled=false;}
  };

  window.jdShowFinanceReminderHistory=async function(){
    try{
      const list=await NabdCloud.listFinanceReminders('');
      document.getElementById('financeReminderHistoryModal')?.remove();
      const wrap=document.createElement('div');
      wrap.id='financeReminderHistoryModal';
      wrap.style.cssText='position:fixed;inset:0;z-index:10002;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';
      wrap.innerHTML=`
        <div class="card" style="width:min(850px,96vw);max-height:90vh;overflow:auto">
          <div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="margin:0">📱 سجل تذكيرات الرسوم</h3><small style="color:var(--muted)">آخر الرسائل التي أرسلت لأولياء الأمور.</small></div><button class="btn soft" onclick="document.getElementById('financeReminderHistoryModal').remove()">✕</button></div>
          <div style="overflow:auto;margin-top:14px"><table style="width:100%;border-collapse:collapse;min-width:700px"><thead><tr><th>الطالب</th><th>ولي الأمر</th><th>المتبقي وقت الإرسال</th><th>وقت الإرسال</th></tr></thead><tbody>
          ${list.length?list.map(x=>`<tr><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(x.student_name||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line)" dir="ltr">${esc(x.guardian_phone||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(x.balance||0)}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${x.sent_at?new Date(x.sent_at).toLocaleString('ar-OM-u-nu-latn'):'—'}</td></tr>`).join(''):'<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--muted)">لا توجد تذكيرات مسجلة بعد.</td></tr>'}
          </tbody></table></div>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل سجل التذكيرات: '+(e.message||''));}
  };


  function jdStatementPaymentMethod(method){
    return method==='bank'?'تحويل بنكي':method==='card'?'بطاقة':'نقدي';
  }

  window.jdShowStudentStatement=async function(studentAuthId){
    try{
      const account=financeState.accounts.find(x=>String(x.student_auth_id)===String(studentAuthId));
      if(!account) return alert('تعذر العثور على حساب الطالب.');
      const [payments,audit]=await Promise.all([
        NabdCloud.listFinancePayments(studentAuthId),
        NabdCloud.listFinanceAudit(studentAuthId)
      ]);

      document.getElementById('financeStatementModal')?.remove();
      const annual=Number(account.annual_fee)||0;
      const paid=Number(account.paid_amount)||0;
      const balance=Math.max(0,annual-paid);
      const wrap=document.createElement('div');
      wrap.id='financeStatementModal';
      wrap.style.cssText='position:fixed;inset:0;z-index:10003;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';

      const paymentsHtml=payments.length?payments.map(p=>`
        <tr>
          <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.payment_date||'')}</td>
          <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.receipt_no||'')}</td>
          <td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(p.amount)}</td>
          <td style="padding:8px;border-bottom:1px solid var(--line)">${jdStatementPaymentMethod(p.method)}</td>
          <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.reference||'—')}</td>
          <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.created_by||'')}</td>
        </tr>`).join(''):'<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--muted)">لا توجد دفعات مسجلة.</td></tr>';

      const auditHtml=audit.length?audit.map(x=>`
        <div class="card" style="padding:10px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <b>${x.action==='payment_voided'?'إلغاء دفعة':'تعديل دفعة'} — ${esc(x.receipt_no||'')}</b>
            <small style="color:var(--muted)">${x.created_at?new Date(x.created_at).toLocaleString('ar-OM-u-nu-latn'):'—'}</small>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:5px">بواسطة: ${esc(x.actor_name||'')} — السبب: ${esc(x.reason||'')}</div>
          ${x.action==='payment_updated'?'<div style="font-size:12px;margin-top:5px">المبلغ قبل: <b>'+money(x.before?.amount||0)+'</b> — بعد: <b>'+money(x.after?.amount||0)+'</b></div>':''}
        </div>`).join(''):'<div style="padding:14px;text-align:center;color:var(--muted)">لا توجد تعديلات أو إلغاءات.</div>';

      wrap.innerHTML=`
        <div class="card" style="width:min(980px,97vw);max-height:92vh;overflow:auto">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
            <div>
              <h3 style="margin:0">📄 كشف حساب الطالب</h3>
              <small style="color:var(--muted)">${esc(account.student_name||'')} — ${esc(account.grade||'')} / ${esc(account.section||'')}</small>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn primary" onclick='jdPrintStudentStatement(${JSON.stringify(studentAuthId)})'>🖨️ طباعة / PDF</button>
              <button class="btn soft" onclick="document.getElementById('financeStatementModal').remove()">✕</button>
            </div>
          </div>

          <div class="grid grid-4" style="margin-top:14px">
            <div class="card" style="padding:12px"><small>الرسوم السنوية</small><b style="display:block;margin-top:5px">${money(annual)}</b></div>
            <div class="card" style="padding:12px"><small>إجمالي المدفوع</small><b style="display:block;margin-top:5px">${money(paid)}</b></div>
            <div class="card" style="padding:12px"><small>المتبقي</small><b style="display:block;margin-top:5px">${money(balance)}</b></div>
            <div class="card" style="padding:12px"><small>حالة السداد</small><b style="display:block;margin-top:5px">${jdFinanceStatusLabel(account)}</b></div>
          </div>

          <div class="grid grid-3" style="margin-top:12px">
            <div class="card" style="padding:12px"><small>رقم الطالب</small><b style="display:block;margin-top:5px">${esc(account.student_id||'—')}</b></div>
            <div class="card" style="padding:12px"><small>ولي الأمر</small><b style="display:block;margin-top:5px" dir="ltr">${esc(account.guardian_phone||'—')}</b></div>
            <div class="card" style="padding:12px"><small>العام الدراسي</small><b style="display:block;margin-top:5px">${esc(account.academic_year||financeState.settings?.academic_year||'')}</b></div>
          </div>

          <div class="card" style="margin-top:14px">
            <h4 style="margin-top:0">💵 سجل الدفعات</h4>
            <div style="overflow:auto">
              <table style="width:100%;border-collapse:collapse;min-width:760px">
                <thead><tr><th>التاريخ</th><th>رقم الإيصال</th><th>المبلغ</th><th>طريقة الدفع</th><th>المرجع</th><th>المسجل بواسطة</th></tr></thead>
                <tbody>${paymentsHtml}</tbody>
              </table>
            </div>
          </div>

          <details class="card" style="margin-top:14px">
            <summary style="cursor:pointer;font-weight:800">🧾 سجل التعديلات والإلغاءات (${audit.length})</summary>
            <div style="margin-top:12px">${auditHtml}</div>
          </details>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل كشف الحساب: '+(e.message||''));}
  };

  window.jdPrintStudentStatement=async function(studentAuthId){
    try{
      const account=financeState.accounts.find(x=>String(x.student_auth_id)===String(studentAuthId));
      if(!account) return alert('تعذر العثور على حساب الطالب.');
      const payments=await NabdCloud.listFinancePayments(studentAuthId);
      const annual=Number(account.annual_fee)||0;
      const paid=Number(account.paid_amount)||0;
      const balance=Math.max(0,annual-paid);
      const win=window.open('','_blank','noopener,noreferrer');
      if(!win) return alert('اسمح بفتح النوافذ المنبثقة حتى يتم تجهيز كشف الحساب.');
      const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>كشف حساب - ${esc(account.student_name||'')}</title>
      <style>
        @page{size:A4;margin:12mm}
        body{font-family:Arial,Tahoma,sans-serif;color:#222;margin:0}
        h1{font-size:22px;margin:0 0 4px}.sub{color:#666;margin-bottom:14px}
        .info{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
        .box{border:1px solid #ddd;border-radius:8px;padding:10px}.box b{display:block;margin-top:4px;font-size:16px}
        table{width:100%;border-collapse:collapse;font-size:11px;margin-top:12px}th,td{border:1px solid #ccc;padding:6px;text-align:center}th{background:#f3f5f7}
        .foot{margin-top:14px;font-size:10px;color:#777}
      </style></head><body>
      <h1>كشف حساب الطالب — مدرسة نخل الخاصة</h1>
      <div class="sub">${esc(account.student_name||'')} | ${esc(account.grade||'')} | الشعبة ${esc(account.section||'')} | العام الدراسي ${esc(account.academic_year||financeState.settings?.academic_year||'')}</div>
      <div class="info">
        <div class="box">الرسوم السنوية<b>${money(annual)}</b></div>
        <div class="box">إجمالي المدفوع<b>${money(paid)}</b></div>
        <div class="box">المبلغ المتبقي<b>${money(balance)}</b></div>
        <div class="box">حالة السداد<b>${jdFinanceStatusLabel(account)}</b></div>
        <div class="box">رقم الطالب<b>${esc(account.student_id||'—')}</b></div>
        <div class="box">ولي الأمر<b dir="ltr">${esc(account.guardian_phone||'—')}</b></div>
      </div>
      <h3>سجل الدفعات</h3>
      <table><thead><tr><th>التاريخ</th><th>رقم الإيصال</th><th>المبلغ</th><th>طريقة الدفع</th><th>المرجع</th></tr></thead><tbody>
      ${payments.length?payments.map(p=>`<tr><td>${esc(p.payment_date||'')}</td><td>${esc(p.receipt_no||'')}</td><td>${money(p.amount)}</td><td>${jdStatementPaymentMethod(p.method)}</td><td>${esc(p.reference||'—')}</td></tr>`).join(''):'<tr><td colspan="5">لا توجد دفعات مسجلة.</td></tr>'}
      </tbody></table>
      <div class="foot">تاريخ إصدار الكشف: ${new Date().toLocaleString('ar-OM-u-nu-latn')}</div>
      <script>window.onload=()=>setTimeout(()=>window.print(),250);<\/script>
      </body></html>`;
      win.document.open();win.document.write(html);win.document.close();
    }catch(e){alert('تعذر تجهيز كشف الحساب: '+(e.message||''));}
  };

  window.renderFinanceAdmin=async function(){
    const page=document.getElementById('financeAdmin');
    if(!page) return;
    if(typeof role==='undefined'||role!=='admin'){
      page.innerHTML='<div class="card"><h3>🔒 قسم المالية والأقساط متاح لإدارة المدرسة فقط.</h3></div>';
      return;
    }
    page.innerHTML='<div class="card">جاري تحميل النظام المالي…</div>';
    let settings;
    try{
      settings=await ensureSettings();
      // أول دخول للقسم: أنشئ/حدّث حسابات جميع الطلاب تلقائيًا.
      if(!financeState.synced){
        const synced=await NabdCloud.syncFinanceAccounts();
        financeState.accounts=synced.accounts||[];
        financeState.synced=true;
      }else{
        await ensureAccounts();
      }
    }catch(e){
      page.innerHTML='<div class="card"><h3>تعذر تحميل النظام المالي</h3><p style="color:var(--muted)">'+esc(String(e.message||''))+'</p><button class="btn soft" onclick="renderFinanceAdmin()">إعادة المحاولة</button></div>';
      return;
    }

    const rows=GRADES.map(g=>(settings.rows||[]).find(x=>x.grade===g)||{grade:g,annual_fee:0});
    const configured=rows.filter(r=>Number(r.annual_fee)>0).length;
    const accounts=financeState.accounts||[];
    const pricedAccounts=accounts.filter(a=>Number(a.annual_fee)>0).length;
    const unpricedAccounts=accounts.length-pricedAccounts;

    const f=financeState.filters;
    const gradeStats=GRADES.map(g=>{
      const list=accounts.filter(a=>a.grade===g);
      const fees=list.reduce((s,a)=>s+(Number(a.annual_fee)||0),0);
      const paid=list.reduce((s,a)=>s+(Number(a.paid_amount)||0),0);
      return {grade:g,count:list.length,left:Math.max(0,fees-paid),pct:fees>0?Math.min(100,Math.floor(paid/fees*100)):0,fees};
    });
    const pal=jfPalette();

    page.innerHTML=`
    <div class="jf" data-palette="${pal}">
      <div class="jf-head">
        <div><h2>المالية والأقساط</h2><p>العام الدراسي <span class="num">${esc(settings.academic_year||'')}</span> · الرسوم السنوية والتحصيل والرصيد المتبقي لكل طالب</p></div>
        <div class="jf-actions">
          <div class="jf-palette" role="group" aria-label="ألوان واجهة المالية">
            <button type="button" data-p="royal" aria-pressed="${pal==='royal'}" onclick="jdSetFinancePalette('royal')"><i style="background:#22358A"></i>ملكي</button>
            <button type="button" data-p="emerald" aria-pressed="${pal==='emerald'}" onclick="jdSetFinancePalette('emerald')"><i style="background:#0F4D3F"></i>زمردي</button>
          </div>
          <button type="button" class="jf-btn" onclick="jdOpenFeeSettings()">${JF_ICON.gear}إعداد الرسوم</button>
          <details class="jf-menu">
            <summary class="jf-btn">${JF_ICON.download}تصدير${JF_ICON.chevron}</summary>
            <div class="jf-menu-list">
              <button type="button" onclick="this.closest('details').removeAttribute('open');jdExportFinanceExcel()">تصدير Excel</button>
              <button type="button" onclick="this.closest('details').removeAttribute('open');jdExportFinancePdf()">تصدير PDF</button>
            </div>
          </details>
          <details class="jf-menu">
            <summary class="jf-icon" style="width:44px;height:44px;border-radius:12px" aria-label="المزيد" title="المزيد">${JF_ICON.more}</summary>
            <div class="jf-menu-list">
              <button type="button" id="financeSyncBtn" onclick="this.closest('details').removeAttribute('open');jdSyncFinanceAccounts()">↻ مزامنة حسابات الطلاب</button>
              <button type="button" onclick="this.closest('details').removeAttribute('open');jdShowFinanceReminderHistory()">سجل تذكيرات واتساب</button>
            </div>
          </details>
          <button type="button" class="jf-btn primary" onclick="jdFocusFinanceSearch()">${JF_ICON.plus}تسجيل دفعة</button>
        </div>
      </div>

      <div class="jf-hero">
        <div class="jf-card jf-rate">
          <svg class="pattern" viewBox="0 0 64 64" fill="none" stroke="rgba(242,169,59,.28)" stroke-width=".5" aria-hidden="true"><path d="M16 16h32v32H16z"/><path d="M32 9.4 54.6 32 32 54.6 9.4 32z"/><circle cx="32" cy="32" r="10"/></svg>
          <div class="label">نسبة التحصيل</div>
          <div class="big num" id="financeKpiRate">0%</div>
          <div class="jf-rbar"><span id="financeKpiRateBar" style="width:0%"></span></div>
          <div class="cols">
            <div><small>المحصّل</small><b class="num" id="financeKpiPaid">0.000</b></div>
            <div><small>المتبقي</small><b class="num hl" id="financeKpiBalance">0.000</b></div>
            <div><small>إجمالي الرسوم</small><b class="num" id="financeKpiFees">0.000</b></div>
          </div>
          <div class="foot">المبالغ بالريال العُماني · حسب البحث والصف والشعبة المختارة</div>
        </div>
        <div class="jf-card">
          <div style="display:flex;justify-content:space-between;align-items:center"><h3>حالة السداد</h3><small style="color:var(--jf-muted);font-size:13px"><span class="num" id="financeKpiStudents">0</span> طالبًا</small></div>
          <div class="jf-stack" id="financeKpiStack"></div>
          <div class="jf-legend">
            <div><i style="background:var(--jf-paid)"></i>مكتمل<b class="num" id="financeKpiComplete">0</b></div>
            <div><i style="background:var(--jf-part)"></i>جزئي<b class="num" id="financeKpiPartial">0</b></div>
            <div><i style="background:var(--jf-unpaid)"></i>غير مسدد<b class="num" id="financeKpiUnpaid">0</b></div>
            <div><i style="background:var(--jf-nofee)"></i>بلا رسوم<b class="num" id="financeKpiNoFee">0</b></div>
          </div>
        </div>
        <div class="jf-card jf-due">
          <div class="ttl"><span class="ico">${JF_ICON.bell}</span><h3>عليهم مبالغ متبقية</h3></div>
          <div class="big num" id="financeKpiOwing">0</div>
          <p>طالبًا بإجمالي <b class="num" id="financeKpiOwingAmount">0.000</b> ر.ع</p>
          <button type="button" id="financeBulkWaBtn" class="jf-btn" onclick="jdSendFinanceRemindersFiltered()">${JF_ICON.chat}تذكير أولياء الأمور (النتائج الحالية)</button>
          <div class="st" id="financeBulkWaStatus"></div>
        </div>
      </div>

      <div class="jf-grades">
        ${gradeStats.map(g=>`<button type="button" class="jf-grade" data-grade="${esc(g.grade)}" aria-pressed="${f.grade===g.grade}" onclick='jdFinancePickGrade(${JSON.stringify(g.grade)})'>
          <div class="top"><span>${esc(g.grade)}</span><span class="num">${g.fees>0?g.pct+'%':'—'}</span></div>
          <div class="jf-track"><span style="width:${g.pct}%;background:var(--jf-accent)"></span></div>
          <small><span class="num">${g.count}</span> طالبًا · متبقٍ <span class="num">${jfNum(g.left)}</span></small>
        </button>`).join('')}
      </div>

      <div class="jf-table">
        <div class="jf-toolbar">
          <div class="jf-tabs" role="group" aria-label="حالة السداد">
            ${[['','الكل'],['unpaid','غير مسدد'],['partial','جزئي'],['paid','مكتمل'],['no_fee','بلا رسوم']].map(([k,l])=>`<button type="button" data-status="${k}" aria-pressed="${(f.status||'')===k}" onclick="jdFinancePickStatus('${k}')">${l}<span class="num">0</span></button>`).join('')}
          </div>
          <div class="jf-filters">
            <label class="jf-search">${JF_ICON.search}<input id="financeAccountSearch" value="${esc(f.search||'')}" placeholder="اسم الطالب، رقمه، أو هاتف ولي الأمر" aria-label="بحث" oninput="jdFilterFinanceAccounts()"></label>
            <select id="financeAccountGrade" aria-label="الصف" onchange="jdFilterFinanceAccounts()"><option value="">كل الصفوف</option>${GRADES.map(g=>`<option value="${g}" ${f.grade===g?'selected':''}>${g}</option>`).join('')}</select>
            <select id="financeAccountSection" aria-label="الشعبة" onchange="jdFilterFinanceAccounts()"><option value="">كل الشعب</option>${['1','2','3','4','أ','ب','ج','د'].map(s=>`<option value="${s}" ${String(f.section||'')===s?'selected':''}>${s}</option>`).join('')}</select>
            <select id="financeAccountStatus" class="jf-sr" tabindex="-1" aria-hidden="true" onchange="jdFilterFinanceAccounts()">
              <option value="">كل حالات السداد</option>
              <option value="unpaid" ${f.status==='unpaid'?'selected':''}>غير مسدد</option>
              <option value="partial" ${f.status==='partial'?'selected':''}>سداد جزئي</option>
              <option value="paid" ${f.status==='paid'?'selected':''}>مكتمل السداد</option>
              <option value="no_fee" ${f.status==='no_fee'?'selected':''}>بلا رسوم محددة</option>
            </select>
          </div>
        </div>
        <div class="jf-meta"><div>عدد النتائج: <b class="num" id="financeAccountsCount">${accounts.length}</b></div><span id="financeSyncStatus" style="font-weight:700"></span></div>
        <div id="financeAccountsScroll" class="jf-scroll" role="table" aria-label="الحسابات المالية للطلاب" onscroll="jdFinanceRememberScroll(this.scrollTop)">
          <div class="jf-row head" role="row">
            <div role="columnheader">الطالب</div><div role="columnheader">الصف / الشعبة</div><div role="columnheader">ولي الأمر</div><div role="columnheader">المدفوع من الرسوم</div><div role="columnheader">المتبقي</div><div role="columnheader">الحالة</div><div role="columnheader"><span class="jf-sr">إجراءات</span></div>
          </div>
          <div id="financeAccountsBody" style="display:contents"></div>
        </div>
      </div>

      <details class="jf-settings" id="financeSettings">
        <summary>${JF_ICON.gear}إعداد الرسوم السنوية للصفوف<span class="jf-count"><span class="num">${configured}/${GRADES.length}</span> صفوف محددة${unpricedAccounts?` · <span class="num">${unpricedAccounts}</span> طالبًا بلا رسوم`:''}</span></summary>
        <div class="jf-settings-body">
          <label class="jf-field" style="max-width:220px">العام الدراسي<input id="financeAcademicYear" value="${esc(settings.academic_year||'2026/2027')}" dir="ltr"></label>
          <div class="jf-fee-grid">
            ${rows.map((r,i)=>`<label class="jf-field">${esc(r.grade)} (ر.ع)<input id="feeAnnual${i}" type="number" min="0" step="0.001" value="${Number(r.annual_fee)||0}" dir="ltr"></label>`).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <button type="button" class="jf-btn primary" onclick="jdSaveFeeSettings()">حفظ إعدادات الرسوم</button><span id="financeSaveStatus" style="font-size:13px;font-weight:700"></span>
          </div>
        </div>
      </details>
    </div>`;

    window.jdFilterFinanceAccounts();
    requestAnimationFrame(()=>{
      const sc=document.getElementById('financeAccountsScroll');
      if(sc) sc.scrollTop=Number(financeState.tableScrollTop)||0;
    });
  };

  window.jdFinanceRememberScroll=function(v){ financeState.tableScrollTop=Number(v)||0; };

  function boot(){
    if(typeof navByRole==='undefined' || !document.querySelector('.content')) return setTimeout(boot,60);
    if(!document.getElementById('financeAdmin')){
      const page=document.createElement('section');
      page.id='financeAdmin'; page.className='page';
      document.querySelector('.content').appendChild(page);
    }
    const admin=navByRole.admin||[];
    if(!admin.some(x=>x[0]==='financeAdmin')){
      const attendanceIndex=admin.findIndex(x=>x[0]==='attendance');
      admin.splice(attendanceIndex>=0?attendanceIndex+1:1,0,['financeAdmin','💳','المالية والأقساط']);
    }
    const oldAfter=window.jdAfterShow;
    window.jdAfterShow=function(id){
      if(typeof oldAfter==='function') oldAfter(id);
      if(id==='financeAdmin') window.renderFinanceAdmin();
    };
    if(typeof renderNav==='function' && typeof role!=='undefined' && role==='admin') renderNav();
  }
  boot();
})();

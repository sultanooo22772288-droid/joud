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

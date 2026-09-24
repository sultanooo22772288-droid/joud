/* ===== نبض المدرسة: حركات تفاعلية خفيفة (تموّج الأزرار، عدّاد الأرقام، ظل الشريط العلوي) ===== */
(function(){
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // تموّج عند الضغط على الأزرار
  document.addEventListener('pointerdown',e=>{
    if(reduce)return;
    const btn=e.target.closest('.btn,.nav button,.mobile-nav button');
    if(!btn||btn.disabled)return;
    const r=btn.getBoundingClientRect();
    const size=Math.max(r.width,r.height);
    const dot=document.createElement('span');
    dot.className='m-ripple';
    dot.style.width=dot.style.height=size+'px';
    dot.style.left=(e.clientX-r.left-size/2)+'px';
    dot.style.top=(e.clientY-r.top-size/2)+'px';
    if(getComputedStyle(btn).position==='static')btn.style.position='relative';
    btn.style.overflow='hidden';
    btn.appendChild(dot);
    dot.addEventListener('animationend',()=>dot.remove());
  });

  // عدّاد تصاعدي لأرقام بطاقات الإحصائيات
  const NUM=/^(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(%?)$/;
  function countUp(el){
    if(el.dataset.mCounted)return;
    const raw=el.textContent.trim();
    const m=raw.match(NUM);
    if(!m)return;
    el.dataset.mCounted='1';
    const grouped=m[1].includes(','),target=parseFloat(m[1].replace(/,/g,'')),suffix=m[2],decimals=(m[1].split('.')[1]||'').length;
    if(reduce||target===0)return;
    const dur=Math.min(1400,500+target*8),start=performance.now();
    function tick(now){
      const t=Math.min(1,(now-start)/dur),eased=1-Math.pow(1-t,3);
      const v=target*eased;
      el.textContent=(grouped?Math.round(v).toLocaleString('en-US'):v.toFixed(decimals))+suffix;
      if(t<1)requestAnimationFrame(tick);else el.textContent=raw;
    }
    requestAnimationFrame(tick);
  }
  function animatePage(page){
    if(page)page.querySelectorAll('.stat h4').forEach(countUp);
  }

  // تشغيل العدّاد عند التنقل بين الصفحات وعند إعادة رسم الصفحة الحالية
  if(typeof window.showPage==='function'){
    const original=window.showPage;
    window.showPage=function(id){
      const res=original.apply(this,arguments);
      animatePage(document.querySelector('.page.active'));
      return res;
    };
  }
  const content=document.querySelector('.content');
  if(content){
    let queued=false;
    new MutationObserver(()=>{
      if(queued)return;queued=true;
      requestAnimationFrame(()=>{queued=false;animatePage(document.querySelector('.page.active'))});
    }).observe(content,{childList:true,subtree:true});
  }

  // ظل الشريط العلوي عند التمرير
  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(ticking)return;ticking=true;
    requestAnimationFrame(()=>{document.body.classList.toggle('m-scrolled',window.scrollY>8);ticking=false});
  },{passive:true});
})();

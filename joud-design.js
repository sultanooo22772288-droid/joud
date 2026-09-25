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
  let financeState={settings:null,accounts:[],loading:false,saving:false,syncing:false,synced:false};

  function money(v){
    const n=Number(v)||0;
    return n.toLocaleString('ar-OM',{minimumFractionDigits:3,maximumFractionDigits:3})+' ر.ع';
  }
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

  window.jdFilterFinanceAccounts=function(){
    const grade=document.getElementById('financeAccountGrade')?.value||'';
    const section=document.getElementById('financeAccountSection')?.value||'';
    const q=(document.getElementById('financeAccountSearch')?.value||'').trim().toLowerCase();
    const rows=financeState.accounts.filter(a=>
      (!grade||a.grade===grade)&&
      (!section||String(a.section||'')===section)&&
      (!q||String(a.student_name||'').toLowerCase().includes(q)||String(a.student_id||'').toLowerCase().includes(q)||String(a.guardian_phone||'').includes(q))
    );
    const body=document.getElementById('financeAccountsBody');
    const count=document.getElementById('financeAccountsCount');
    if(count) count.textContent=rows.length;
    if(!body) return;
    body.innerHTML=rows.length?rows.map(a=>`
      <tr>
        <td style="padding:8px;border-bottom:1px solid var(--line)"><b>${esc(a.student_name||'طالب')}</b><small style="display:block;color:var(--muted)">${esc(a.student_id||'')}</small></td>
        <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(a.grade||'—')}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line)">${esc(a.section||'—')}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line)" dir="ltr">${esc(a.guardian_phone||'—')}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(a.annual_fee)}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(a.paid_amount||0)}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money((Number(a.annual_fee)||0)-(Number(a.paid_amount)||0))}</td>
        <td style="padding:8px;border-bottom:1px solid var(--line)"><span class="tag ${Number(a.paid_amount)>=Number(a.annual_fee)&&Number(a.annual_fee)>0?'green':Number(a.paid_amount)>0?'orange':'blue'}">${Number(a.paid_amount)>=Number(a.annual_fee)&&Number(a.annual_fee)>0?'مكتمل':Number(a.paid_amount)>0?'جزئي':'غير مسدد'}</span></td>
        <td style="padding:8px;border-bottom:1px solid var(--line)">
          <button class="btn primary" style="padding:7px 10px" onclick='jdOpenPaymentModal(${JSON.stringify(JSON.stringify(a))})' ${Number(a.annual_fee)<=Number(a.paid_amount)?'disabled':''}>+ دفعة</button>
          <button class="btn soft" style="padding:7px 10px;margin-right:4px" onclick='jdShowPaymentHistory(${JSON.stringify(a.student_auth_id)})'>السجل</button>
        </td>
      </tr>`).join(''):'<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--muted)">لا توجد حسابات مطابقة.</td></tr>';
  };


  window.jdOpenPaymentModal=function(accountJson){
    const a=typeof accountJson==='string'?JSON.parse(accountJson):accountJson;
    document.getElementById('financePaymentModal')?.remove();
    const balance=Math.max(0,(Number(a.annual_fee)||0)-(Number(a.paid_amount)||0));
    const wrap=document.createElement('div');
    wrap.id='financePaymentModal';
    wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(20,28,45,.38);display:grid;place-items:center;padding:16px';
    wrap.innerHTML=`
      <div class="card" style="width:min(560px,96vw);max-height:90vh;overflow:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div><h3 style="margin:0">💵 تسجيل دفعة</h3><small style="color:var(--muted)">${esc(a.student_name||'')} — ${esc(a.grade||'')} / ${esc(a.section||'')}</small></div>
          <button class="btn soft" onclick="document.getElementById('financePaymentModal').remove()">✕</button>
        </div>
        <div class="grid grid-3" style="margin-top:14px">
          <div class="card" style="padding:12px"><small>الرسوم السنوية</small><b style="display:block;margin-top:5px">${money(a.annual_fee)}</b></div>
          <div class="card" style="padding:12px"><small>المدفوع</small><b style="display:block;margin-top:5px">${money(a.paid_amount||0)}</b></div>
          <div class="card" style="padding:12px"><small>المتبقي</small><b style="display:block;margin-top:5px">${money(balance)}</b></div>
        </div>
        <div class="upload-row" style="margin-top:14px">
          <div><label>المبلغ المدفوع</label><input id="financePayAmount" type="number" min="0.001" max="${balance}" step="0.001" placeholder="مثال: 100.000" dir="ltr"></div>
          <div><label>تاريخ الدفع</label><input id="financePayDate" type="date" value="${new Date().toISOString().slice(0,10)}" dir="ltr"></div>
          <div><label>طريقة الدفع</label><select id="financePayMethod"><option value="cash">نقدي</option><option value="bank">تحويل بنكي</option><option value="card">بطاقة</option></select></div>
          <div><label>رقم المرجع (اختياري)</label><input id="financePayRef" placeholder="رقم التحويل / المرجع"></div>
        </div>
        <div style="margin-top:12px"><label>ملاحظة (اختياري)</label><textarea id="financePayNote" rows="2" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px"></textarea></div>
        <div id="financePayStatus" style="margin-top:10px;font-size:13px;font-weight:800"></div>
        <button class="btn primary" style="width:100%;margin-top:12px" onclick='jdSavePayment(${JSON.stringify(a.student_auth_id)})'>حفظ الدفعة وإصدار إيصال</button>
      </div>`;
    document.body.appendChild(wrap);
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
      if(st){st.textContent='✓ تم تسجيل الدفعة — رقم الإيصال: '+out.payment.receipt_no;st.style.color='#178a5b';}
      financeState.accounts=await NabdCloud.listFinanceAccounts();
      setTimeout(()=>{document.getElementById('financePaymentModal')?.remove();window.renderFinanceAdmin();},900);
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
          <div style="overflow:auto;margin-top:14px"><table style="width:100%;border-collapse:collapse;min-width:650px"><thead><tr><th>الإيصال</th><th>التاريخ</th><th>المبلغ</th><th>الطريقة</th><th>المرجع</th><th>المسجل بواسطة</th></tr></thead><tbody>
          ${list.length?list.map(p=>`<tr><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.receipt_no||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.payment_date||'')}</td><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:800">${money(p.amount)}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${p.method==='bank'?'تحويل بنكي':p.method==='card'?'بطاقة':'نقدي'}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.reference||'—')}</td><td style="padding:8px;border-bottom:1px solid var(--line)">${esc(p.created_by||'')}</td></tr>`).join(''):'<tr><td colspan="6" style="padding:22px;text-align:center;color:var(--muted)">لا توجد دفعات مسجلة.</td></tr>'}
          </tbody></table></div>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل سجل الدفعات: '+(e.message||''));}
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

    page.innerHTML=`
      <div class="page-head">
        <div><h2>المالية والرسوم 💳</h2><p>إدارة الرسوم السنوية والتحصيل المرن والرصيد المتبقي لكل طالب.</p></div>
        <span class="tag green">الخطوة 3 جاهزة ✓</span>
      </div>

      <div class="grid grid-4">
        ${stat('👨‍🎓','#E7EFFD',accounts.length,'حساب مالي')}
        ${stat('✅','#E3F5EC',pricedAccounts,'طلاب برسوم محددة')}
        ${stat('⚠️','#FDF0DA',unpricedAccounts,'طلاب بلا رسوم')}
        ${stat('📅','#FCE6DE',esc(settings.academic_year||'2026/2027'),'العام الدراسي')}
      </div>

      <div class="card" style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
          <div><h3 style="margin:0">👨‍🎓 الحسابات المالية للطلاب</h3><small style="color:var(--muted)">مرتبطة تلقائيًا ببيانات الطالب وصفه وشعبته ورقم ولي الأمر ورسوم صفه.</small></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button id="financeSyncBtn" class="btn primary" type="button" onclick="jdSyncFinanceAccounts()">↻ مزامنة الطلاب</button>
            <span id="financeSyncStatus" style="font-size:12px;font-weight:800"></span>
          </div>
        </div>
        <div class="upload-row" style="margin-top:14px;grid-template-columns:1.4fr 1fr 1fr">
          <input id="financeAccountSearch" placeholder="بحث بالاسم أو رقم الطالب أو هاتف ولي الأمر" oninput="jdFilterFinanceAccounts()">
          <select id="financeAccountGrade" onchange="jdFilterFinanceAccounts()"><option value="">كل الصفوف</option>${GRADES.map(g=>`<option>${g}</option>`).join('')}</select>
          <select id="financeAccountSection" onchange="jdFilterFinanceAccounts()"><option value="">كل الشعب</option><option>1</option><option>2</option><option>3</option><option>4</option><option>أ</option><option>ب</option><option>ج</option><option>د</option></select>
        </div>
        <div style="margin:12px 0 6px;color:var(--muted);font-size:12px">عدد النتائج: <b id="financeAccountsCount">${accounts.length}</b></div>
        <div style="overflow:auto">
          <table style="width:100%;border-collapse:collapse;min-width:900px">
            <thead><tr>
              <th style="text-align:right;padding:9px;border-bottom:1px solid var(--line)">الطالب</th><th>الصف</th><th>الشعبة</th><th>ولي الأمر</th><th>الرسوم السنوية</th><th>المدفوع</th><th>المتبقي</th><th>الحالة</th><th>إجراء</th>
            </tr></thead>
            <tbody id="financeAccountsBody"></tbody>
          </table>
        </div>
      </div>

      <details class="card" style="margin-top:16px">
        <summary style="cursor:pointer;font-weight:800">⚙️ إعداد الرسوم السنوية للصفوف (${configured}/${GRADES.length})</summary>
        <div style="display:flex;justify-content:flex-end;margin:14px 0">
          <div style="min-width:170px"><label style="display:block;font-size:11px;color:var(--muted);margin-bottom:4px">العام الدراسي</label><input id="financeAcademicYear" value="${esc(settings.academic_year||'2026/2027')}" style="width:100%;padding:9px;border:1px solid var(--line);border-radius:10px"></div>
        </div>
        <div style="overflow:auto">
          <table style="width:100%;border-collapse:collapse;min-width:520px">
            <thead><tr><th style="text-align:right">الصف</th><th>الرسوم السنوية (ر.ع)</th></tr></thead>
            <tbody>${rows.map((r,i)=>`
              <tr>
                <td style="padding:9px;border-bottom:1px solid var(--line)"><b>${esc(r.grade)}</b></td>
                <td style="padding:7px;border-bottom:1px solid var(--line)"><input id="feeAnnual${i}" type="number" min="0" step="0.001" value="${Number(r.annual_fee)||0}" style="width:160px;padding:8px;border:1px solid var(--line);border-radius:9px" dir="ltr"></td>
              </tr>`).join('')}</tbody>
          </table>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px">
          <button class="btn primary" onclick="jdSaveFeeSettings()">💾 حفظ إعدادات الرسوم</button><span id="financeSaveStatus" style="font-size:13px;font-weight:800"></span>
        </div>
      </details>

      <div class="grid grid-3" style="margin-top:16px">
        <div class="card"><h3 style="margin-top:0">✅ إعداد الرسوم</h3><p style="color:var(--muted)">رسوم سنوية لكل صف بدون أقساط ثابتة.</p><span class="tag green">جاهز</span></div>
        <div class="card"><h3 style="margin-top:0">✅ حسابات الطلاب</h3><p style="color:var(--muted)">تم ربط الحساب المالي ببيانات كل طالب.</p><span class="tag green">جاهز</span></div>
        <div class="card"><h3 style="margin-top:0">💵 سجل الدفعات</h3><p style="color:var(--muted)">تسجيل أي مبلغ يدفعه ولي الأمر وخصمه من الرصيد السنوي.</p><span class="tag orange">الخطوة 4</span></div>
      </div>`;

    window.jdFilterFinanceAccounts();
  };

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

/* =====================================================================
   جود — الحضور والغياب: لوحة الإدارة المباشرة، الاعتماد، المزامنة، وواتساب
   يُحمَّل بعد السكربت الرئيسي فيستبدل بعض دوال صفحة الحضور.
   ===================================================================== */
(function(){
  const GRADE_ORDER=['روضة','تمهيدي','الصف الأول','الصف الثاني','الصف الثالث','الصف الرابع'];
  const REFRESH_MS=30000;
  const SEND_GAP_MS=5500;
  const WA_LABEL={
    pending:['⏳','لم تُرسل','orange'],
    sending:['…','جارٍ الإرسال','blue'],
    sent:['✓','أُرسلت','blue'],
    delivered:['✓✓','وصلت لولي الأمر','green'],
    read:['✓✓','قرأها ولي الأمر','green'],
    failed:['⚠','فشل الإرسال','red'],
    no_phone:['—','لا يوجد رقم','red']
  };
  const state={date:'',details:[],notifs:[],statuses:{},waConfigured:null,sending:false,timer:null,progress:''};
  const esc=(v)=>typeof window.esc==='function'?window.esc(v):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const today=()=>window.NabdCloud?.localToday?NabdCloud.localToday():new Date().toISOString().slice(0,10);
  const gradeIdx=(g)=>{const i=GRADE_ORDER.indexOf(g);return i<0?99:i;};

  function schoolClasses(){
    const map=new Map();
    (typeof demoData!=='undefined'?demoData.students||[]:[]).forEach(s=>{
      if(!s.grade||!s.section) return;
      const k=s.grade+'||'+s.section;
      map.set(k,(map.get(k)||0)+1);
    });
    let list=[...map.entries()].map(([k,count])=>{const [grade,section]=k.split('||');return {grade,section,count};});
    if(!list.length) list=GRADE_ORDER.flatMap(grade=>['1','2','3','4'].map(section=>({grade,section,count:0})));
    return list.sort((a,b)=>gradeIdx(a.grade)-gradeIdx(b.grade)||String(a.section).localeCompare(String(b.section),'ar',{numeric:true}));
  }

  function notifStatus(n){
    if(!String(n.guardian_phone||'').replace(/\D/g,'')) return 'no_phone';
    const s=state.statuses[String(n.id)];
    if(s?.status) return s.status;
    return n.status==='sent'?'sent':'pending';
  }
  function waChip(status,title){
    const [ic,label,color]=WA_LABEL[status]||WA_LABEL.pending;
    return `<span class="tag ${color} jd-wa-chip" data-status="${status}"${title?` title="${esc(title)}"`:''}>${ic} ${label}</span>`;
  }

  async function loadLive(){
    state.date=window.attendanceAdminDate||today();
    const sessions=(await NabdCloud.listAttendanceSessions()).filter(x=>x.attendance_date===state.date);
    state.details=await Promise.all(sessions.map(async s=>({session:s,records:await NabdCloud.getAttendanceRecords(s.id)})));
    const approved=state.details.filter(d=>d.session.approval_status==='approved');
    let notifs=await NabdCloud.listNotificationsForSessions(approved.map(d=>d.session.id));
    // تحضير معتمد فيه غياب ولا توجد له رسائل بعد: جهّزها.
    const withNotifs=new Set(notifs.map(n=>String(n.session_id)));
    const missing=approved.filter(d=>d.records.some(r=>r.status==='absent')&&!withNotifs.has(String(d.session.id)));
    if(missing.length){
      for(const d of missing){try{await NabdCloud.prepareAttendanceNotifications(d.session.id);}catch(_e){}}
      notifs=await NabdCloud.listNotificationsForSessions(approved.map(d=>d.session.id));
    }
    state.notifs=notifs;
    try{state.statuses=await NabdCloud.whatsappStatuses(notifs.map(n=>n.id));}catch(_e){}
    if(state.waConfigured===null){try{state.waConfigured=(await NabdCloud.whatsappConfig()).configured;}catch(_e){state.waConfigured=false;}}
  }

  function renderLive(){
    const box=document.getElementById('jdAttLive'); if(!box) return;
    const classes=schoolClasses();
    const byClass=new Map(state.details.map(d=>[d.session.grade+'||'+d.session.section,d]));
    const total=state.details.reduce((n,d)=>n+d.records.length,0);
    const absent=state.details.reduce((n,d)=>n+d.records.filter(r=>r.status==='absent').length,0);
    const prepared=classes.filter(c=>byClass.has(c.grade+'||'+c.section)).length;
    const waiting=classes.filter(c=>!byClass.has(c.grade+'||'+c.section));
    const pendingApproval=state.details.filter(d=>(d.session.approval_status||'pending')==='pending');
    const approved=state.details.filter(d=>d.session.approval_status==='approved');
    const pct=classes.length?Math.round(prepared/classes.length*100):0;
    const isToday=state.date===today();

    const tile=(c)=>{
      const d=byClass.get(c.grade+'||'+c.section);
      let cls='wait',label='ينتظر التحضير',extra=`${c.count||'—'} طالب`;
      if(d){
        const a=d.records.filter(r=>r.status==='absent').length;
        extra=`حاضر ${d.records.length-a} · غائب ${a}`;
        const st=d.session.approval_status||'pending';
        if(st==='approved'){cls='ok';label='معتمد';}
        else if(st==='rejected'){cls='bad';label='مرفوض — بانتظار التعديل';}
        else {cls='review';label='بانتظار الاعتماد';}
      }
      return `<div class="jd-class-tile ${cls}"><b>${esc(c.grade)} — ${esc(c.section)}</b><span>${label}</span><small>${esc(extra)}</small></div>`;
    };

    const sessionCard=(d)=>{
      const s=d.session,abs=d.records.filter(r=>r.status==='absent');
      const st=s.approval_status||'pending';
      const time=s.updated_at||s.submitted_at;
      const head=`<div class="jd-sess-head"><div><b>${esc(s.grade)} — الشعبة ${esc(s.section)}</b><small>${esc(s.teacher_name||'معلم')}${time?' · '+new Date(time).toLocaleTimeString('ar-OM',{hour:'2-digit',minute:'2-digit'}):''}</small></div><div class="jd-sess-counts"><span class="tag green">حاضر ${d.records.length-abs.length}</span><span class="tag red">غائب ${abs.length}</span></div></div>`;
      const names=abs.length?`<div class="jd-absent-names">${abs.map(r=>`<span>${esc(r.student_name||'طالب')}</span>`).join('')}</div>`:'<div class="jd-absent-names none">لا يوجد غياب — جميع الطلاب حاضرون ✓</div>';
      let actions='';
      if(st==='pending'){
        actions=`<button class="btn primary" type="button" onclick="jdApproveSession('${s.id}')">✅ اعتماد</button><button class="btn soft" type="button" onclick="rejectAttendanceSession('${s.id}')">رفض وإرجاع للمعلم</button>`;
      }else if(st==='approved'){
        const sync=s.sync_status||'not_ready';
        const syncBtn=sync==='synced'?'<span class="tag green">✓ تمت المزامنة مع موقع الوزارة</span>'
          :sync==='pending'?'<span class="tag blue">⏳ في قائمة المزامنة مع موقع الوزارة</span>'
          :`<button class="btn primary" type="button" onclick="jdQueueSync('${s.id}')">🔄 مزامنة مع موقع الوزارة${sync==='failed'?' (إعادة)':''}</button>`;
        const sessNotifs=state.notifs.filter(n=>String(n.session_id)===String(s.id));
        const unsent=sessNotifs.filter(n=>['pending','failed'].includes(notifStatus(n)));
        const waBtn=abs.length?`<button class="btn soft jd-wa-btn" type="button" ${unsent.length?'':'disabled'} onclick="jdSendForSession('${s.id}')">📲 واتساب للمتغيبين (${unsent.length?unsent.length:'تم'})</button>`:'';
        actions=`${syncBtn}${waBtn}<button class="btn soft" type="button" onclick="jdExportSession('${s.id}')">⬇️ ملف المزامنة</button>`;
      }else{
        actions=`<span class="tag red">مرفوض${s.rejection_note?': '+esc(s.rejection_note):''}</span><small style="color:var(--muted)">بانتظار تعديل المعلم وإعادة الإرسال</small>`;
      }
      return `<div class="jd-sess ${st}">${head}${names}<div class="jd-sess-actions">${actions}</div></div>`;
    };

    const notifRows=state.notifs.map(n=>{
      const d=state.details.find(x=>String(x.session.id)===String(n.session_id));
      const st=notifStatus(n),err=state.statuses[String(n.id)]?.error;
      const canSend=['pending','failed'].includes(st);
      return `<tr data-nid="${n.id}"><td><b>${esc(n.student_name||'')}</b></td><td>${esc(d?.session.grade||'')} — ${esc(d?.session.section||'')}</td><td dir="ltr">${esc(n.guardian_phone||'—')}</td><td class="jd-wa-cell">${waChip(st,err&&err!=='no_phone'?err:'')}</td><td>${canSend?`<button class="btn soft" type="button" onclick="jdSendWhatsApp(['${n.id}'])">${st==='failed'?'إعادة الإرسال':'إرسال'}</button>`:''}</td></tr>`;
    }).join('');
    const unsentAll=state.notifs.filter(n=>['pending','failed'].includes(notifStatus(n)));
    const delivered=state.notifs.filter(n=>['delivered','read'].includes(notifStatus(n))).length;

    box.innerHTML=`
      <div class="jd-live-head">
        <div><h3>لوحة اليوم المباشرة</h3><small>${esc(state.date)}${isToday?' · <span class="jd-live-dot"></span> مباشر — يتحدّث تلقائيًا كل 30 ثانية':''}</small></div>
        <button class="btn soft" type="button" onclick="jdRefreshAttendance(true)">↻ تحديث الآن</button>
      </div>
      <div class="grid grid-4 jd-live-stats">
        ${stat('✅','#E3F5EC',total-absent,'حاضر')}${stat('🔴','#FCE6DE',absent,'غائب')}${stat('📋','#E7EFFD',prepared+' / '+classes.length,'صفوف تم تحضيرها')}${stat('⏳','#FDF0DA',pendingApproval.length,'بانتظار الاعتماد')}
      </div>
      <div class="card jd-live-card">
        <div class="jd-progress-row"><b>تقدّم التحضير</b><span>${pct}%</span></div>
        <div class="progress jd-prep-progress"><span style="width:${pct}%"></span></div>
        ${waiting.length
          ?`<div class="jd-waiting"><b>⏳ قائمة انتظار التحضير (${waiting.length})</b><div>${waiting.map(c=>`<span class="jd-wait-chip">${esc(c.grade)} — الشعبة ${esc(c.section)} ينتظر التحضير</span>`).join('')}</div></div>`
          :`<div class="jd-waiting done">✓ اكتمل تحضير جميع الصفوف${pendingApproval.length?` — بقي اعتماد ${pendingApproval.length}`:''}</div>`}
        <div class="jd-class-grid">${classes.map(tile).join('')}</div>
      </div>
      ${pendingApproval.length?`<div class="card jd-live-card"><div class="jd-section-head"><h3>التحضيرات بانتظار الاعتماد (${pendingApproval.length})</h3><button class="btn primary" type="button" onclick="jdApproveAll()">✅ اعتماد الكل</button></div>${pendingApproval.map(sessionCard).join('')}</div>`:''}
      ${approved.length?`<div class="card jd-live-card"><div class="jd-section-head"><h3>التحضيرات المعتمدة (${approved.length})</h3></div>${approved.map(sessionCard).join('')}</div>`:''}
      ${state.details.filter(d=>d.session.approval_status==='rejected').length?`<div class="card jd-live-card"><div class="jd-section-head"><h3>تحضيرات مرفوضة</h3></div>${state.details.filter(d=>d.session.approval_status==='rejected').map(sessionCard).join('')}</div>`:''}
      <div class="card jd-live-card">
        <div class="jd-section-head"><h3>📲 رسائل أولياء أمور المتغيبين</h3>
          <button class="btn primary" type="button" ${unsentAll.length&&!state.sending?'':'disabled'} onclick="jdSendWhatsApp(null)">📲 إرسال لجميع أولياء الأمور (${unsentAll.length})</button></div>
        ${state.waConfigured===false?`<div class="jd-wa-setup">⚠️ لم يتم ربط واتساب بعد. أضف المتغيرين <code>WASENDER_API_KEY</code> و<code>WASENDER_WEBHOOK_SECRET</code> في إعدادات Vercel، واضبط Webhook في WaSender على <code dir="ltr">https://nakhalschool.com/api/whatsapp</code> مع تفعيل حدث <code>messages.update</code>.</div>`:''}
        <div id="jdWaProgress" class="jd-wa-progress">${esc(state.progress)}</div>
        ${state.notifs.length?`<div class="jd-wa-summary"><span class="tag blue">الرسائل: ${state.notifs.length}</span><span class="tag green">وصلت: ${delivered}</span><span class="tag orange">لم تُرسل: ${unsentAll.length}</span></div>
          <div style="overflow:auto"><table class="jd-wa-table"><thead><tr><th>الطالب</th><th>الصف</th><th>هاتف ولي الأمر</th><th>حالة الرسالة</th><th></th></tr></thead><tbody>${notifRows}</tbody></table></div>
          <details class="jd-msg-preview"><summary>معاينة نص الرسالة</summary><pre>${esc(state.notifs[0].message||'')}</pre></details>`
          :'<div class="jd-empty">تظهر هنا رسائل الغياب بعد اعتماد التحضير.</div>'}
      </div>`;
  }

  window.jdRefreshAttendance=async function(manual){
    const page=document.getElementById('attendance');
    if(!page||!page.classList.contains('active')||role!=='admin'||!document.getElementById('jdAttLive')) return;
    if(state.sending&&!manual) return;
    try{await loadLive();renderLive();}catch(e){if(manual)alert('تعذر التحديث: '+(e.message||''));}
  };
  function startTimer(){
    clearInterval(state.timer);
    state.timer=setInterval(()=>{
      if(document.hidden) return;
      if(!document.getElementById('attendance')?.classList.contains('active')){clearInterval(state.timer);return;}
      if((window.attendanceAdminDate||today())===today()) window.jdRefreshAttendance(false);
    },REFRESH_MS);
  }

  window.jdApproveSession=async function(id){
    try{await NabdCloud.updateAttendanceApproval(id,'approved','');await window.jdRefreshAttendance(true);}
    catch(e){alert('تعذر اعتماد التحضير: '+(e.message||''));}
  };
  window.jdApproveAll=async function(){
    const list=state.details.filter(d=>(d.session.approval_status||'pending')==='pending');
    if(!list.length||!confirm(`اعتماد ${list.length} تحضير الآن؟`)) return;
    for(const d of list){try{await NabdCloud.updateAttendanceApproval(d.session.id,'approved','');}catch(e){alert(`تعذر اعتماد ${d.session.grade} — ${d.session.section}: ${e.message||''}`);}}
    await window.jdRefreshAttendance(true);
  };
  window.jdQueueSync=async function(id){
    if(!confirm('إضافة هذا التحضير إلى قائمة المزامنة مع موقع الوزارة؟\nسيُنقل تلقائيًا عند تشغيل أداة المزامنة.')) return;
    try{await NabdCloud.updateAttendanceSyncStatus(id,'pending');await window.jdRefreshAttendance(true);}
    catch(e){alert('تعذر إضافة التحضير للمزامنة: '+(e.message||''));}
  };
  window.jdExportSession=function(id){
    const d=state.details.find(x=>String(x.session.id)===String(id)); if(!d) return;
    const lines=[['التاريخ','الصف','الشعبة','اسم الطالب','الحالة'].join(',')].concat(
      d.records.map(r=>[d.session.attendance_date,d.session.grade,d.session.section,r.student_name,r.status==='absent'?'غائب':'حاضر'].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(','))
    );
    const blob=new Blob(['﻿'+lines.join('\n')],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=`attendance-${d.session.attendance_date}-${d.session.grade}-${d.session.section}.csv`;
    document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove();
  };
  window.jdSendForSession=function(sessionId){
    const ids=state.notifs.filter(n=>String(n.session_id)===String(sessionId)&&['pending','failed'].includes(notifStatus(n))).map(n=>String(n.id));
    window.jdSendWhatsApp(ids);
  };

  function setRowStatus(id,status,err){
    state.statuses[String(id)]={...(state.statuses[String(id)]||{}),status,error:err||''};
    const cell=document.querySelector(`tr[data-nid="${id}"] .jd-wa-cell`);
    if(cell) cell.innerHTML=waChip(status,err);
  }
  function setProgress(text){state.progress=text;const el=document.getElementById('jdWaProgress');if(el)el.textContent=text;}

  window.jdSendWhatsApp=async function(ids){
    if(state.sending) return;
    const list=(ids||state.notifs.filter(n=>['pending','failed'].includes(notifStatus(n))).map(n=>String(n.id)))
      .filter(id=>{const n=state.notifs.find(x=>String(x.id)===String(id));return n&&notifStatus(n)!=='no_phone';});
    if(!list.length){alert('لا توجد رسائل بانتظار الإرسال (أو لا توجد أرقام لأولياء الأمور).');return;}
    if(!ids&&!confirm(`إرسال رسالة واتساب إلى ${list.length} من أولياء الأمور؟`)) return;
    state.sending=true;
    let ok=0,fail=0;
    for(let i=0;i<list.length;i++){
      const id=list[i];
      setRowStatus(id,'sending');
      setProgress(`جارٍ الإرسال ${i+1} من ${list.length}…`);
      try{
        await NabdCloud.sendWhatsAppNotification(id);
        setRowStatus(id,'sent');ok++;
      }catch(e){
        if(e.status===429){setRowStatus(id,'pending');setProgress(`تم بلوغ حد الإرسال، انتظار ${e.retryAfter||10} ثانية…`);await sleep((e.retryAfter||10)*1000);i--;continue;}
        if(e.code==='not_configured'){setRowStatus(id,'pending');state.waConfigured=false;alert(e.message);break;}
        setRowStatus(id,'failed',e.message);fail++;
      }
      if(i<list.length-1) await sleep(SEND_GAP_MS);
    }
    state.sending=false;
    setProgress(ok||fail?`تم إرسال ${ok} رسالة${fail?`، وتعذر ${fail}`:''}. تتحدّث حالة الاستلام تلقائيًا.`:'');
    await window.jdRefreshAttendance(true);
  };

  /* ---------- صفحة الإدارة: إضافة اللوحة المباشرة فوق التقارير ---------- */
  const originalRender=window.renderAttendancePage;
  window.renderAttendancePage=async function(){
    if(role==='admin'&&!window.attendanceAdminDate) window.attendanceAdminDate=today();
    if(role==='teacher') return renderTeacherAttendance();
    await originalRender();
    if(role!=='admin') return;
    const list=document.getElementById('attendanceAdminList'); if(!list) return;
    const oldStats=list.querySelector(':scope > .grid.grid-4'); if(oldStats) oldStats.remove();
    list.insertAdjacentHTML('afterbegin','<div id="jdAttLive"><div class="jd-empty">جاري تحميل لوحة اليوم…</div></div>');
    await window.jdRefreshAttendance(true);
    startTimer();
  };

  /* ---------- صفحة المعلم ---------- */
  function renderTeacherAttendance(){
    const page=document.getElementById('attendance'); if(!page) return;
    page.innerHTML=`<div class="page-head"><div><h2>الحضور والغياب 📋</h2><p>اختر الصف والشعبة، علّم الغائبين، ثم أرسل التحضير للإدارة للاعتماد.</p></div></div>
      <div class="card"><div class="upload-row"><select id="attGrade" aria-label="الصف" onchange="attendanceGradeChanged()"><option value="">اختر الصف</option>${GRADE_ORDER.map(g=>`<option>${esc(g)}</option>`).join('')}</select><select id="attSection" aria-label="الشعبة" onchange="loadAttendanceStudents()"><option value="">اختر الشعبة</option></select></div><div id="attStudents" style="margin-top:16px"></div></div>
      <div class="card" style="margin-top:16px"><div class="jd-section-head"><h3>تحضيراتي اليوم</h3><button class="btn soft" type="button" onclick="jdLoadMyAttendance()">↻ تحديث</button></div><div id="jdMyAttendance">جاري التحميل…</div></div>`;
    window.jdLoadMyAttendance();
  }
  function myName(){const t=(typeof demoData!=='undefined'?demoData.teachers||[]:[]).find(x=>String(x.email||'').toLowerCase()===String((typeof currentLoginEmail!=='undefined'&&currentLoginEmail)||'').toLowerCase());return t?.name||'';}
  window.jdLoadMyAttendance=async function(){
    const box=document.getElementById('jdMyAttendance'); if(!box) return;
    try{
      const name=myName();
      const rows=(await NabdCloud.listAttendanceSessions()).filter(x=>x.attendance_date===today()&&(!name||x.teacher_name===name));
      if(!rows.length){box.innerHTML='<div class="jd-empty">لم تُرسل أي تحضير اليوم بعد.</div>';return;}
      box.innerHTML=rows.map(s=>{
        const st=s.approval_status||'pending';
        const badge=st==='approved'?'<span class="tag green">✓ معتمد من الإدارة</span>':st==='rejected'?`<span class="tag red">مرفوض${s.rejection_note?': '+esc(s.rejection_note):''} — عدّل وأعد الإرسال</span>`:'<span class="tag orange">⏳ بانتظار اعتماد الإدارة</span>';
        return `<div class="jd-my-row"><b>${esc(s.grade)} — الشعبة ${esc(s.section)}</b>${badge}</div>`;
      }).join('');
    }catch(e){box.textContent='تعذر تحميل التحضيرات: '+(e.message||'');}
  };

  window.loadAttendanceStudents=async function(){
    const grade=document.getElementById('attGrade')?.value||'',section=document.getElementById('attSection')?.value||'',box=document.getElementById('attStudents');
    if(!grade||!section||!box) return;
    box.innerHTML='جاري تحميل الطلاب…';
    try{
      const students=await NabdCloud.listClassStudents(grade,section);
      if(!students.length){box.innerHTML='<div class="jd-empty">لا يوجد طلاب في هذا الصف والشعبة.</div>';return;}
      const existing=(await NabdCloud.listAttendanceSessions()).find(x=>x.attendance_date===today()&&x.grade===grade&&x.section===section);
      let absentIds=new Set(),locked=false,note='';
      if(existing){
        const recs=await NabdCloud.getAttendanceRecords(existing.id);
        absentIds=new Set(recs.filter(r=>r.status==='absent').map(r=>String(r.student_id)));
        const st=existing.approval_status||'pending';
        locked=st==='approved';
        note=st==='approved'?'<div class="jd-att-note ok">✓ هذا التحضير معتمد من الإدارة ولا يمكن تعديله.</div>'
          :st==='rejected'?`<div class="jd-att-note bad">أرجعت الإدارة التحضير${existing.rejection_note?': '+esc(existing.rejection_note):''}. عدّله ثم أعد الإرسال.</div>`
          :'<div class="jd-att-note">⏳ أرسلت هذا التحضير اليوم وهو بانتظار الاعتماد. يمكنك تعديله وإعادة إرساله.</div>';
      }
      box.innerHTML=`${note}
        <div class="jd-att-toolbar"><span id="jdAttCounts"></span><button class="btn soft" type="button" ${locked?'disabled':''} onclick="document.querySelectorAll('.attAbsent').forEach(x=>x.checked=false);jdAttCount()">الكل حاضر</button></div>
        <div class="jd-att-list">${students.map(s=>`<label class="jd-att-item"><span><b>${esc(s.name||'طالب')}</b></span><span class="jd-att-toggle"><input type="checkbox" class="attAbsent" data-id="${esc(s.auth_user_id)}" data-name="${esc(s.name||'')}" ${absentIds.has(String(s.auth_user_id))?'checked':''} ${locked?'disabled':''} onchange="jdAttCount()"> غائب</span></label>`).join('')}</div>
        ${locked?'':`<button class="btn primary" type="button" style="margin-top:16px" onclick="saveAttendance()">📤 حفظ وإرسال التحضير للإدارة</button>`}<span id="attSaveStatus" style="margin-right:12px"></span>`;
      window.jdAttCount();
    }catch(e){box.textContent='تعذر تحميل الطلاب: '+(e.message||'');}
  };
  window.jdAttCount=function(){
    const all=document.querySelectorAll('.attAbsent'),abs=[...all].filter(x=>x.checked).length;
    const el=document.getElementById('jdAttCounts');
    if(el) el.innerHTML=`<span class="tag green">حاضر ${all.length-abs}</span> <span class="tag red">غائب ${abs}</span>`;
    all.forEach(x=>x.closest('.jd-att-item')?.classList.toggle('is-absent',x.checked));
  };
  window.saveAttendance=async function(){
    const grade=document.getElementById('attGrade')?.value||'',section=document.getElementById('attSection')?.value||'',st=document.getElementById('attSaveStatus');
    const checks=[...document.querySelectorAll('.attAbsent')];
    try{
      if(st){st.style.color='';st.textContent='جاري الإرسال…';}
      const students=checks.map(x=>({auth_user_id:x.dataset.id,name:x.dataset.name,status:x.checked?'absent':'present'}));
      await NabdCloud.saveAttendanceSession({grade,section,students});
      const abs=students.filter(x=>x.status==='absent').length;
      if(st){st.style.color='#178a5b';st.textContent=`✓ أُرسل التحضير للإدارة للاعتماد — حاضر ${students.length-abs}، غائب ${abs}`;}
      window.jdLoadMyAttendance();
    }catch(e){if(st){st.style.color='#c0392b';st.textContent=e.message||'تعذر الحفظ';}}
  };
})();

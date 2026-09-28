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
        actions=`<button class="btn primary" type="button" onclick="jdReviewAttendanceSession('${s.id}')">🔎 مراجعة وتعديل الغياب</button>`;
      }else if(st==='approved'){
        const sync=s.sync_status||'not_ready';
        const syncState=sync==='synced'
          ?'<span class="tag green" style="font-size:13px">🟢 تمت المزامنة</span>'
          :sync==='failed'
            ?'<span class="tag red" style="font-size:13px">🔴 فشلت المزامنة</span>'
            :'<span class="tag red" style="font-size:13px">🔴 غير مزامن</span>';
        const syncBtn=sync==='synced'?'':`<button class="btn primary" type="button" onclick="jdQueueSync('${s.id}')">🏛️ توريد الغياب للوزارة${sync==='failed'?' — إعادة المحاولة':''}</button>`;
        const sessNotifs=state.notifs.filter(n=>String(n.session_id)===String(s.id));
        const unsent=sessNotifs.filter(n=>['pending','failed'].includes(notifStatus(n)));
        const sentCount=sessNotifs.filter(n=>['sent','delivered','read'].includes(notifStatus(n))).length;
        const failedCount=sessNotifs.filter(n=>notifStatus(n)==='failed').length;
        let waState='<span class="tag orange">واتساب: لم يُرسل</span>';
        if(!abs.length) waState='<span class="tag green">لا يوجد غياب</span>';
        else if(sentCount===sessNotifs.length&&sessNotifs.length) waState='<span class="tag green">واتساب: تم الإرسال للجميع</span>';
        else if(sentCount>0) waState=`<span class="tag blue">واتساب: إرسال جزئي ${sentCount}/${sessNotifs.length}</span>`;
        else if(failedCount>0) waState='<span class="tag red">واتساب: تعذر الإرسال</span>';
        const waBtns=abs.length?`<button class="btn soft jd-wa-btn" type="button" ${unsent.length?'':'disabled'} onclick="jdSendForSession('${s.id}')">📲 إرسال للجميع</button><button class="btn soft" type="button" ${unsent.length?'':'disabled'} onclick="jdChooseAttendanceWhatsApp('${s.id}')">☑️ اختيار طلاب</button>`:'';
        const timeText=time?new Date(time).toLocaleTimeString('ar-OM',{hour:'2-digit',minute:'2-digit'}):'—';
        return `<div class="jd-sess approved" style="border:1px solid var(--line);border-radius:18px;padding:16px;margin-top:12px;background:#fff">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:12px;border-bottom:1px solid var(--line)">
            <div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:4px">الصف والشعبة</div>
              <b style="font-size:18px">${esc(s.grade)} — الشعبة ${esc(s.section)}</b>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <span class="tag green" style="font-size:13px">✅ معتمد</span>
              ${syncState}
              ${waState}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:14px">
            <div><div style="font-size:12px;color:var(--muted)">إجمالي الطلاب</div><b style="font-size:17px">${d.records.length}</b></div>
            <div><div style="font-size:12px;color:var(--muted)">الحضور</div><b style="font-size:17px;color:#178a5b">${d.records.length-abs.length}</b></div>
            <div><div style="font-size:12px;color:var(--muted)">الغياب</div><b style="font-size:17px;color:#c0392b">${abs.length}</b></div>
            <div><div style="font-size:12px;color:var(--muted)">المعلم</div><b>${esc(s.teacher_name||'معلم')}</b></div>
            <div><div style="font-size:12px;color:var(--muted)">وقت التسجيل</div><b>${esc(timeText)}</b></div>
          </div>

          <div style="margin-top:14px;padding:12px;border-radius:14px;background:#f8f9ff">
            <div style="font-size:12px;color:var(--muted);margin-bottom:7px">الطلاب الغائبون</div>
            ${abs.length?`<div style="display:flex;gap:7px;flex-wrap:wrap">${abs.map(r=>`<span class="tag red">${esc(r.student_name||'طالب')}</span>`).join('')}</div>`:'<span class="tag green">لا يوجد غياب — جميع الطلاب حاضرون ✓</span>'}
          </div>

          <div style="display:flex;gap:8px;align-items:center;justify-content:flex-start;flex-wrap:wrap;margin-top:14px">
            ${syncBtn}
            ${waBtns}
            <button class="btn soft" type="button" onclick="jdExportSession('${s.id}')">⬇️ ملف التوريد</button>
          </div>
        </div>`;
      }else{
        actions=`<span class="tag red">غير معتمد</span>`;
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
    const syncedCount=approved.filter(d=>d.session.sync_status==='synced').length;
    const approvedCount=approved.length;
    const sentWaCount=state.notifs.filter(n=>['sent','delivered','read'].includes(notifStatus(n))).length;

    box.innerHTML=`
      <div class="jd-live-head">
        <div><h3>لوحة اليوم المباشرة</h3><small>${esc(state.date)}${isToday?' · <span class="jd-live-dot"></span> مباشر — يتحدّث تلقائيًا كل 30 ثانية':''}</small></div>
        <button class="btn soft" type="button" onclick="jdRefreshAttendance(true)">↻ تحديث الآن</button>
      </div>
      <div class="grid grid-4 jd-live-stats">
        ${stat('✅','#E3F5EC',total-absent,'حاضر')}${stat('🔴','#FCE6DE',absent,'غائب')}${stat('📋','#E7EFFD',prepared+' / '+classes.length,'صفوف تم تحضيرها')}${stat('⏳','#FDF0DA',pendingApproval.length,'بانتظار الاعتماد')}
      </div>
      <div class="grid grid-4 jd-live-stats" style="margin-top:10px">
        ${stat('✅','#E3F5EC',approvedCount,'غياب معتمد')}${stat('🏛️','#E7EFFD',syncedCount,'تم توريده للوزارة')}${stat('📲','#E7EFFD',sentWaCount,'رسائل واتساب أُرسلت')}${stat('👁️','#E3F5EC',delivered,'وصلت/قُرئت')}
      </div>
      <div class="card jd-live-card">
        <div class="jd-section-head">
          <div><h3 style="margin:0">📊 تقارير الغياب</h3><small style="color:var(--muted)">تقارير رسمية من الغياب المعتمد فقط — يومي أو شهري، مع فلترة حسب الصف والشعبة والطالب.</small></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <select id="jdAttReportPeriod" onchange="jdAttendanceReportPeriodChanged()" style="min-width:130px">
            <option value="day">تقرير يومي</option>
            <option value="month">تقرير شهري</option>
          </select>
          <input id="jdAttReportDay" type="date" value="${esc(state.date)}" style="min-width:145px">
          <input id="jdAttReportMonth" type="month" value="${esc(String(state.date).slice(0,7))}" style="min-width:145px;display:none">
          <select id="jdAttReportGrade" style="min-width:150px"><option value="">كل الصفوف</option>${GRADE_ORDER.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('')}</select>
          <select id="jdAttReportSection" style="min-width:115px"><option value="">كل الشعب</option>${['1','2','3','4','أ','ب','ج','د'].map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select>
          <input id="jdAttReportStudent" placeholder="اسم الطالب (اختياري)" style="min-width:180px">
          <button class="btn soft" type="button" onclick="jdPreviewAttendanceReport()">🔎 معاينة</button>
          <button class="btn soft" type="button" onclick="jdExportAttendanceExcel()">📊 Excel</button>
          <button class="btn soft" type="button" onclick="jdExportAttendancePdf()">📄 PDF</button>
        </div>
        <div id="jdAttendanceReportPreview" style="margin-top:12px"></div>
      </div>
      <div class="card jd-live-card">
        <div class="jd-progress-row"><b>تقدّم التحضير</b><span>${pct}%</span></div>
        <div class="progress jd-prep-progress"><span style="width:${pct}%"></span></div>
        ${waiting.length
          ?`<div class="jd-waiting"><b>⏳ قائمة انتظار التحضير (${waiting.length})</b><div>${waiting.map(c=>`<span class="jd-wait-chip">${esc(c.grade)} — الشعبة ${esc(c.section)} ينتظر التحضير</span>`).join('')}</div></div>`
          :`<div class="jd-waiting done">✓ اكتمل تحضير جميع الصفوف${pendingApproval.length?` — بقي اعتماد ${pendingApproval.length}`:''}</div>`}
        <div class="jd-class-grid">${classes.map(tile).join('')}</div>
      </div>
      ${pendingApproval.length?`<div class="card jd-live-card"><div class="jd-section-head"><div><h3 style="margin:0">📥 صندوق وارد الغياب للإدارة (${pendingApproval.length})</h3><small style="color:var(--muted)">راجع كل طلب قبل الاعتماد. لن يظهر التوريد أو إرسال الرسائل إلا بعد اعتماد الإدارة.</small></div></div>${pendingApproval.map(sessionCard).join('')}</div>`:''}
      ${approved.length?`<div class="card jd-live-card"><div class="jd-section-head"><h3>✅ الغياب المعتمد (${approved.length})</h3></div>${approved.map(sessionCard).join('')}</div>`:''}
      
      ${approved.length?`<div class="card jd-live-card">
        <div class="jd-section-head"><div><h3 style="margin:0">📲 رسائل أولياء أمور المتغيبين</h3><small style="color:var(--muted)">تظهر خيارات الإرسال فقط بعد اعتماد الغياب من الإدارة.</small></div>
          <button class="btn primary" type="button" ${unsentAll.length&&!state.sending?'':'disabled'} onclick="jdSendWhatsApp(null)">📲 إرسال لجميع أولياء الأمور (${unsentAll.length})</button></div>
        ${state.waConfigured===false?`<div class="jd-wa-setup">⚠️ لم يتم ربط واتساب بعد. أضف المتغيرين <code>WASENDER_API_KEY</code> و<code>WASENDER_WEBHOOK_SECRET</code> في إعدادات Vercel، واضبط Webhook في WaSender على <code dir="ltr">https://nakhalschool.com/api/whatsapp</code> مع تفعيل حدث <code>messages.update</code>.</div>`:''}
        <div id="jdWaProgress" class="jd-wa-progress">${esc(state.progress)}</div>
        ${state.notifs.length?`<div class="jd-wa-summary"><span class="tag blue">الرسائل: ${state.notifs.length}</span><span class="tag green">وصلت: ${delivered}</span><span class="tag orange">لم تُرسل: ${unsentAll.length}</span></div>
          <div style="overflow:auto"><table class="jd-wa-table"><thead><tr><th>الطالب</th><th>الصف</th><th>هاتف ولي الأمر</th><th>حالة الرسالة</th><th></th></tr></thead><tbody>${notifRows}</tbody></table></div>
          <details class="jd-msg-preview"><summary>معاينة نص الرسالة</summary><pre>${esc(state.notifs[0].message||'')}</pre></details>`
          :'<div class="jd-empty">لا توجد رسائل غياب جاهزة للإرسال.</div>'}
      </div>`:''}`;
  }


  window.jdAttendanceReportPeriodChanged=function(){
    const period=document.getElementById('jdAttReportPeriod')?.value||'day';
    const day=document.getElementById('jdAttReportDay'),month=document.getElementById('jdAttReportMonth');
    if(day) day.style.display=period==='day'?'':'none';
    if(month) month.style.display=period==='month'?'':'none';
  };

  async function jdAttendanceReportData(){
    const period=document.getElementById('jdAttReportPeriod')?.value||'day';
    const day=document.getElementById('jdAttReportDay')?.value||state.date||today();
    const month=document.getElementById('jdAttReportMonth')?.value||String(day).slice(0,7);
    const grade=document.getElementById('jdAttReportGrade')?.value||'';
    const section=document.getElementById('jdAttReportSection')?.value||'';
    const student=String(document.getElementById('jdAttReportStudent')?.value||'').trim().toLowerCase();
    const all=await NabdCloud.listAttendanceSessions();
    const sessions=all.filter(s=>{
      if(s.approval_status!=='approved') return false;
      if(period==='day'&&s.attendance_date!==day) return false;
      if(period==='month'&&!String(s.attendance_date||'').startsWith(month)) return false;
      if(grade&&s.grade!==grade) return false;
      if(section&&String(s.section)!==String(section)) return false;
      return true;
    });
    const details=await Promise.all(sessions.map(async s=>({session:s,records:await NabdCloud.getAttendanceRecords(s.id)})));
    const rows=[];
    details.forEach(d=>d.records.forEach(r=>{
      if(student&&!String(r.student_name||'').toLowerCase().includes(student)) return;
      rows.push({
        date:d.session.attendance_date||'',
        student_name:r.student_name||'',
        grade:d.session.grade||'',
        section:d.session.section||'',
        status:r.status==='absent'?'غائب':'حاضر',
        sync_status:d.session.sync_status==='synced'?'تم التوريد':d.session.sync_status==='pending'?'بانتظار التوريد':d.session.sync_status==='failed'?'فشل التوريد':'لم يورد'
      });
    }));
    const total=rows.length,absent=rows.filter(r=>r.status==='غائب').length,present=total-absent;
    const absentByStudent={};
    rows.filter(r=>r.status==='غائب').forEach(r=>{
      const k=r.student_name+'||'+r.grade+'||'+r.section;
      absentByStudent[k]=(absentByStudent[k]||0)+1;
    });
    const repeated=Object.entries(absentByStudent).map(([k,count])=>{const [name,g,s]=k.split('||');return {name,grade:g,section:s,count};}).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'ar'));
    return {period,day,month,grade,section,student,rows,total,absent,present,repeated};
  }

  window.jdPreviewAttendanceReport=async function(){
    const box=document.getElementById('jdAttendanceReportPreview'); if(!box) return;
    box.innerHTML='جاري تجهيز التقرير…';
    try{
      const d=await jdAttendanceReportData();
      const rate=d.total?Math.round((d.absent/d.total)*1000)/10:0;
      box.innerHTML=`
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <span class="tag blue">السجلات: ${d.total}</span>
          <span class="tag green">الحضور: ${d.present}</span>
          <span class="tag red">الغياب: ${d.absent}</span>
          <span class="tag orange">نسبة الغياب: ${rate}%</span>
        </div>
        ${d.rows.length?`<div style="overflow:auto;max-height:360px"><table style="width:100%;min-width:720px"><thead><tr><th>التاريخ</th><th>الطالب</th><th>الصف</th><th>الشعبة</th><th>الحالة</th><th>التوريد</th></tr></thead><tbody>${d.rows.map(r=>`<tr><td>${esc(r.date)}</td><td><b>${esc(r.student_name)}</b></td><td>${esc(r.grade)}</td><td>${esc(r.section)}</td><td>${r.status==='غائب'?'<span class="tag red">غائب</span>':'<span class="tag green">حاضر</span>'}</td><td>${esc(r.sync_status)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="jd-empty">لا توجد بيانات مطابقة للفلاتر.</div>'}
        ${d.period==='month'&&d.repeated.length?`<div style="margin-top:14px"><b>أكثر الطلاب غيابًا في الفترة</b><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px">${d.repeated.slice(0,10).map(x=>`<span class="tag orange">${esc(x.name)} — ${x.count} أيام</span>`).join('')}</div></div>`:''}`;
    }catch(e){box.textContent='تعذر تجهيز التقرير: '+(e.message||'');}
  };

  window.jdExportAttendanceExcel=async function(){
    try{
      const d=await jdAttendanceReportData();
      if(!d.rows.length){alert('لا توجد بيانات لتصديرها.');return;}
      const data=d.rows.map((r,i)=>({
        '#':i+1,
        'التاريخ':r.date,
        'اسم الطالب':r.student_name,
        'الصف':r.grade,
        'الشعبة':r.section,
        'الحالة':r.status,
        'حالة التوريد':r.sync_status
      }));
      if(window.XLSX){
        const ws=XLSX.utils.json_to_sheet(data);
        const wb=XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb,ws,'الغياب');
        XLSX.writeFile(wb,`attendance-${d.period==='day'?d.day:d.month}.xlsx`);
      }else{
        const headers=Object.keys(data[0]);
        const lines=[headers.join(',')].concat(data.map(row=>headers.map(h=>'"'+String(row[h]??'').replace(/"/g,'""')+'"').join(',')));
        const blob=new Blob(['﻿'+lines.join('\n')],{type:'text/csv;charset=utf-8'});
        const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`attendance-${d.period==='day'?d.day:d.month}.csv`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove();
      }
    }catch(e){alert('تعذر تصدير Excel: '+(e.message||''));}
  };

  window.jdExportAttendancePdf=async function(){
    try{
      const d=await jdAttendanceReportData();
      if(!d.rows.length){alert('لا توجد بيانات لتصديرها.');return;}
      const rate=d.total?Math.round((d.absent/d.total)*1000)/10:0;
      const w=window.open('','_blank','noopener,noreferrer');
      if(!w){alert('اسمح بفتح النوافذ المنبثقة حتى يتم تجهيز PDF.');return;}
      const periodLabel=d.period==='day'?'تقرير يوم '+d.day:'تقرير شهر '+d.month;
      w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>تقرير الغياب</title><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial,Tahoma,sans-serif;color:#222}h1{margin:0 0 5px;font-size:22px}.sub{color:#666;margin-bottom:12px}.stats{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.stat{border:1px solid #ddd;border-radius:8px;padding:8px 12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #ccc;padding:5px;text-align:center}th{background:#f3f5f7}.foot{margin-top:10px;color:#777;font-size:9px}</style></head><body>
        <h1>تقرير الحضور والغياب — مدرسة نخل الخاصة</h1><div class="sub">${esc(periodLabel)}${d.grade?' — '+esc(d.grade):''}${d.section?' — الشعبة '+esc(d.section):''}${d.student?' — بحث: '+esc(d.student):''}</div>
        <div class="stats"><div class="stat">السجلات: <b>${d.total}</b></div><div class="stat">الحضور: <b>${d.present}</b></div><div class="stat">الغياب: <b>${d.absent}</b></div><div class="stat">نسبة الغياب: <b>${rate}%</b></div></div>
        <table><thead><tr><th>#</th><th>التاريخ</th><th>الطالب</th><th>الصف</th><th>الشعبة</th><th>الحالة</th><th>التوريد</th></tr></thead><tbody>${d.rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.date)}</td><td>${esc(r.student_name)}</td><td>${esc(r.grade)}</td><td>${esc(r.section)}</td><td>${esc(r.status)}</td><td>${esc(r.sync_status)}</td></tr>`).join('')}</tbody></table>
        <div class="foot">تاريخ إصدار التقرير: ${new Date().toLocaleString('ar-OM')}</div><script>window.onload=()=>setTimeout(()=>window.print(),250);<\/script>
      </body></html>`);
      w.document.close();
    }catch(e){alert('تعذر تجهيز PDF: '+(e.message||''));}
  };

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


  window.jdReviewAttendanceSession=function(id){
    const d=state.details.find(x=>String(x.session.id)===String(id)); if(!d) return;
    const s=d.session,abs=d.records.filter(r=>r.status==='absent');
    document.getElementById('jdAttendanceReviewModal')?.remove();
    const wrap=document.createElement('div');
    wrap.id='jdAttendanceReviewModal';
    wrap.style.cssText='position:fixed;inset:0;z-index:10020;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';
    wrap.innerHTML=`
      <div class="card" style="width:min(860px,97vw);max-height:92vh;overflow:auto">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
          <div><h3 style="margin:0">🔎 مراجعة الغياب</h3><small style="color:var(--muted)">${esc(s.grade||'')} — الشعبة ${esc(s.section||'')} · المعلم: ${esc(s.teacher_name||'معلم')}</small></div>
          <button class="btn soft" onclick="document.getElementById('jdAttendanceReviewModal').remove()">✕</button>
        </div>
        <div class="grid grid-3" style="margin-top:14px">
          <div class="card" style="padding:12px"><small>إجمالي الطلاب</small><b style="display:block;margin-top:5px">${d.records.length}</b></div>
          <div class="card" style="padding:12px"><small>الحضور</small><b style="display:block;margin-top:5px">${d.records.length-abs.length}</b></div>
          <div class="card" style="padding:12px"><small>الغياب</small><b style="display:block;margin-top:5px">${abs.length}</b></div>
        </div>
        <div style="overflow:auto;margin-top:14px">
          <table style="width:100%;border-collapse:collapse;min-width:560px">
            <thead><tr><th style="text-align:right">الطالب</th><th>الحالة</th></tr></thead>
            <tbody>${d.records.map(r=>`<tr data-record-id="${esc(r.id)}"><td style="padding:9px;border-bottom:1px solid var(--line)"><b>${esc(r.student_name||'طالب')}</b></td><td style="padding:9px;border-bottom:1px solid var(--line)"><select class="jdAdminAttendanceStatus" data-record-id="${esc(r.id)}" style="min-width:120px"><option value="present" ${r.status==='absent'?'':'selected'}>✅ حاضر</option><option value="absent" ${r.status==='absent'?'selected':''}>🔴 غائب</option></select></td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:16px">
          <button class="btn primary" onclick="jdSaveAndApproveAttendance('${s.id}')">✅ حفظ التعديلات واعتماد الغياب</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  };

  window.jdSaveAndApproveAttendance=async function(id){
    if(!confirm('حفظ تعديلات الإدارة واعتماد الغياب؟ بعد الاعتماد ستظهر خيارات التوريد للوزارة وإرسال رسائل أولياء الأمور.')) return;
    try{
      const changes=[...document.querySelectorAll('.jdAdminAttendanceStatus')].map(x=>({id:x.dataset.recordId,status:x.value==='absent'?'absent':'present'}));
      await NabdCloud.adminUpdateAttendanceRecords(id,changes);
      await NabdCloud.updateAttendanceApproval(id,'approved','');
      document.getElementById('jdAttendanceReviewModal')?.remove();
      await window.jdRefreshAttendance(true);
    }catch(e){alert('تعذر حفظ واعتماد الغياب: '+(e.message||''));}
  };


  window.jdShowAttendanceAudit=async function(sessionId){
    const d=state.details.find(x=>String(x.session.id)===String(sessionId));
    try{
      const rows=await NabdCloud.listAttendanceAudit(sessionId);
      document.getElementById('jdAttendanceAuditModal')?.remove();
      const labels={
        submitted:'📤 أرسل المعلم الغياب للإدارة',
        updated:'✏️ عدّل المعلم الغياب وأعاد إرساله',
        approved:'✅ اعتمدت الإدارة الغياب',
        rejected:'↩ أعادت الإدارة الغياب للمعلم',
        sync_queued:'🏛️ تم تجهيز الغياب للتوريد للوزارة',
        sync_synced:'✅ تم تأكيد التوريد للوزارة',
        sync_failed:'⚠️ فشل التوريد للوزارة',
        sync_reset:'↻ تمت إعادة حالة التوريد',
        whatsapp_send:'📲 إرسال رسائل واتساب',
        admin_edited:'✏️ عدلت الإدارة حالات الحضور والغياب'
      };
      const wrap=document.createElement('div');
      wrap.id='jdAttendanceAuditModal';
      wrap.style.cssText='position:fixed;inset:0;z-index:10030;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';
      wrap.innerHTML=`
        <div class="card" style="width:min(780px,97vw);max-height:92vh;overflow:auto">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
            <div><h3 style="margin:0">📜 سجل إجراءات الغياب</h3><small style="color:var(--muted)">${esc(d?.session.grade||'')} — الشعبة ${esc(d?.session.section||'')}</small></div>
            <button class="btn soft" onclick="document.getElementById('jdAttendanceAuditModal').remove()">✕</button>
          </div>
          <div style="display:grid;gap:9px;margin-top:14px">
            ${rows.length?rows.map(r=>`<div style="border:1px solid var(--line);border-radius:12px;padding:11px">
              <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
                <b>${labels[r.action]||esc(r.action||'إجراء')}</b>
                <small style="color:var(--muted)">${r.created_at?new Date(r.created_at).toLocaleString('ar-OM'):'—'}</small>
              </div>
              ${r.note?`<div style="margin-top:6px;font-size:13px">${esc(r.note)}</div>`:''}
            </div>`).join(''):'<div class="jd-empty">لا توجد إجراءات مسجلة حتى الآن.</div>'}
          </div>
        </div>`;
      document.body.appendChild(wrap);
    }catch(e){alert('تعذر تحميل سجل الإجراءات: '+(e.message||''));}
  };

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

  window.jdChooseAttendanceWhatsApp=function(sessionId){
    const d=state.details.find(x=>String(x.session.id)===String(sessionId));
    const list=state.notifs.filter(n=>String(n.session_id)===String(sessionId));
    if(!d||!list.length){alert('لا توجد رسائل غياب جاهزة لهذا التحضير.');return;}
    document.getElementById('jdAttendanceWaSelectModal')?.remove();
    const wrap=document.createElement('div');
    wrap.id='jdAttendanceWaSelectModal';
    wrap.style.cssText='position:fixed;inset:0;z-index:10025;background:rgba(20,28,45,.42);display:grid;place-items:center;padding:16px';
    wrap.innerHTML=`
      <div class="card" style="width:min(760px,97vw);max-height:92vh;overflow:auto">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <div><h3 style="margin:0">☑️ اختيار الطلاب لإرسال واتساب</h3><small style="color:var(--muted)">${esc(d.session.grade||'')} — الشعبة ${esc(d.session.section||'')}</small></div>
          <button class="btn soft" onclick="document.getElementById('jdAttendanceWaSelectModal').remove()">✕</button>
        </div>
        <div style="margin:14px 0;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn soft" type="button" onclick="document.querySelectorAll('.jdWaPick:not(:disabled)').forEach(x=>x.checked=true)">تحديد الكل</button>
          <button class="btn soft" type="button" onclick="document.querySelectorAll('.jdWaPick').forEach(x=>x.checked=false)">إلغاء التحديد</button>
        </div>
        <div style="display:grid;gap:8px">
          ${list.map(n=>{
            const st=notifStatus(n);
            const available=['pending','failed'].includes(st)&&String(n.guardian_phone||'').replace(/\D/g,'');
            return `<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:12px;padding:10px">
              <span><b>${esc(n.student_name||'طالب')}</b><small style="display:block;color:var(--muted)" dir="ltr">${esc(n.guardian_phone||'لا يوجد رقم')}</small></span>
              <span style="display:flex;align-items:center;gap:8px">${waChip(st)}<input type="checkbox" class="jdWaPick" value="${esc(n.id)}" ${available?'checked':'disabled'}></span>
            </label>`;
          }).join('')}
        </div>
        <div id="jdWaSelectStatus" style="margin-top:10px;font-size:13px;font-weight:800"></div>
        <button class="btn primary" type="button" style="width:100%;margin-top:12px" onclick="jdSendSelectedAttendanceWhatsApp('${sessionId}')">📲 إرسال للمختارين</button>
      </div>`;
    document.body.appendChild(wrap);
  };

  window.jdSendSelectedAttendanceWhatsApp=async function(sessionId){
    const ids=[...document.querySelectorAll('.jdWaPick:checked')].map(x=>String(x.value));
    if(!ids.length){alert('اختر طالبًا واحدًا على الأقل.');return;}
    if(!confirm('إرسال رسالة الغياب إلى '+ids.length+' من أولياء الأمور؟')) return;
    document.getElementById('jdAttendanceWaSelectModal')?.remove();
    await window.jdSendWhatsApp(ids);
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
    const auditGroups={};
    list.forEach(id=>{const n=state.notifs.find(x=>String(x.id)===String(id));if(n?.session_id){const k=String(n.session_id);auditGroups[k]=(auditGroups[k]||0)+1;}});
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
    for(const [sessionId,count] of Object.entries(auditGroups)){
      try{await NabdCloud.addAttendanceAudit(sessionId,'whatsapp_send',`تمت محاولة إرسال ${count} رسالة واتساب لأولياء أمور الطلاب الغائبين. ناجح: ${ok}، متعذر: ${fail}.`);}catch(_e){}
    }
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
    page.innerHTML=`<div class="page-head"><div><h2>الحضور والغياب 📋</h2><p>اختر الصف والشعبة، وحدد لكل طالب حاضر أو غائب فقط، ثم أرسل الغياب للإدارة للاعتماد.</p></div></div>
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
        locked=st==='approved'||st==='pending';
        note=st==='approved'?'<div class="jd-att-note ok">✓ هذا التحضير معتمد من الإدارة ولا يمكن تعديله.</div>'
          :st==='rejected'?`<div class="jd-att-note bad">أرجعت الإدارة التحضير${existing.rejection_note?': '+esc(existing.rejection_note):''}. عدّله ثم أعد الإرسال.</div>`
          :'<div class="jd-att-note">⏳ تم إرسال الغياب للإدارة وهو بانتظار الاعتماد. لا يمكن تعديله إلا إذا أعادته الإدارة لك.</div>';
      }
      box.innerHTML=`${note}
        <div class="jd-att-toolbar"><span id="jdAttCounts"></span><button class="btn soft" type="button" ${locked?'disabled':''} onclick="document.querySelectorAll('.attChoice').forEach(x=>x.value='present');jdAttCount()">تحديد الكل حاضر</button></div>
        <div class="jd-att-list">${students.map(s=>`<div class="jd-att-item ${absentIds.has(String(s.auth_user_id))?'is-absent':''}" data-id="${esc(s.auth_user_id)}" data-name="${esc(s.name||'')}"><span><b>${esc(s.name||'طالب')}</b></span><select class="attChoice" ${locked?'disabled':''} onchange="jdAttCount()" style="min-width:120px"><option value="present" ${absentIds.has(String(s.auth_user_id))?'':'selected'}>✅ حاضر</option><option value="absent" ${absentIds.has(String(s.auth_user_id))?'selected':''}>🔴 غائب</option></select></div>`).join('')}</div>
        ${locked?'':`<button class="btn primary" type="button" style="margin-top:16px" onclick="saveAttendance()">📤 إرسال الغياب للإدارة</button>`}<span id="attSaveStatus" style="margin-right:12px"></span>`;
      window.jdAttCount();
    }catch(e){box.textContent='تعذر تحميل الطلاب: '+(e.message||'');}
  };
  window.jdAttCount=function(){
    const all=[...document.querySelectorAll('.attChoice')],abs=all.filter(x=>x.value==='absent').length;
    const el=document.getElementById('jdAttCounts');
    if(el) el.innerHTML=`<span class="tag green">حاضر ${all.length-abs}</span> <span class="tag red">غائب ${abs}</span>`;
    all.forEach(x=>x.closest('.jd-att-item')?.classList.toggle('is-absent',x.value==='absent'));
  };
  window.saveAttendance=async function(){
    const grade=document.getElementById('attGrade')?.value||'',section=document.getElementById('attSection')?.value||'',st=document.getElementById('attSaveStatus');
    const checks=[...document.querySelectorAll('.attChoice')];
    try{
      if(st){st.style.color='';st.textContent='جاري إرسال الغياب للإدارة…';}
      const students=checks.map(x=>({auth_user_id:x.closest('.jd-att-item')?.dataset.id,name:x.closest('.jd-att-item')?.dataset.name,status:x.value==='absent'?'absent':'present'}));
      await NabdCloud.saveAttendanceSession({grade,section,students});
      const abs=students.filter(x=>x.status==='absent').length;
      if(st){st.style.color='#178a5b';st.textContent=`✓ تم إرسال الغياب للإدارة للاعتماد — حاضر ${students.length-abs}، غائب ${abs}`;}
      window.jdLoadMyAttendance();
    }catch(e){if(st){st.style.color='#c0392b';st.textContent=e.message||'تعذر الحفظ';}}
  };
})();

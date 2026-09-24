/* =====================================================================
   جود — ثيمات المناسبات: مشهد متحرك، خطوط، وتحية لكل مناسبة
   يعتمد على body[data-theme] الذي يضبطه applyPlatformTheme في index.html
   ===================================================================== */
(function(){
  const FONT_URL={
    ramadan:'Aref+Ruqaa:wght@400;700',
    teacher:'Aref+Ruqaa:wght@400;700',
    book:'Amiri:wght@400;700',
    tree:'El+Messiri:wght@500;700',
    sports:'Lalezar',
    ocean:'Baloo+Bhaijaan+2:wght@500;600;700;800',
    garden:'Baloo+Bhaijaan+2:wght@500;600;700;800',
    rainbow:'Baloo+Bhaijaan+2:wght@500;600;700;800',
    children:'Baloo+Bhaijaan+2:wght@500;600;700;800',
    backtoschool:'Baloo+Bhaijaan+2:wght@500;600;700;800'
  };

  /* رمز صغير لكل مناسبة (يظهر في شارة التحية وفي صفحة الثيمات) */
  const ICON={
    ramadan:'<path d="M15 3a8 8 0 1 0 6 13A9 9 0 0 1 15 3z" fill="currentColor"/>',
    national:'<path d="M5 21V3M5 4h13l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    space:'<path d="M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10zM9 16l-3 4 4-1M15 16l3 4-4-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2" fill="currentColor"/>',
    ocean:'<path d="M3 15c2 0 2-2 4.5-2S10 15 12 15s2-2 4.5-2S19 15 21 15M3 19c2 0 2-2 4.5-2S10 19 12 19s2-2 4.5-2S19 19 21 19M14 5c-3 0-6 2-7 4 1 2 4 4 7 4 2 0 3-1 4-2l2 2V7l-2 2c-1-1-2-4-4-4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    garden:'<circle cx="12" cy="9" r="2.5" fill="currentColor"/><path d="M12 4.5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5zM16.5 9a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0zM12 13.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5zM7.5 9a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0zM12 13v8M12 18c-2-2-4-2-5-1M12 17c2-2 4-2 5-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    rainbow:'<path d="M3 18a9 9 0 0 1 18 0M6 18a6 6 0 0 1 12 0M9 18a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    teacher:'<path d="M3 4h18v12H3zM8 20l2-4M16 20l-2-4M7 9h5M7 12h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    tree:'<path d="M12 22v-7M12 15l-3-3M12 17l3-3M12 3a6 6 0 0 0-5.6 8.2A4 4 0 0 0 9 18h6a4 4 0 0 0 2.6-6.8A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    sports:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    backtoschool:'<path d="M6 8a6 6 0 0 1 12 0v12H6zM9 8V6a3 3 0 0 1 6 0v2M6 13h12M10 13v3h4v-3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    children:'<path d="M12 3a6 6 0 0 1 6 6c0 4-3 7-6 7s-6-3-6-7a6 6 0 0 1 6-6zM11 16l1 2 1-2M12 18c0 2-2 2-2 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    book:'<path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'
  };
  const icon=(id)=>ICON[id]?`<svg class="jt-icon" viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg>`:'';

  const GREETING={
    ramadan:['رمضان كريم','مبارك عليكم الشهر، وكل عام وأنتم بخير'],
    national:['كل عام وعُمان بخير','نحتفل معًا بالعيد الوطني المجيد'],
    space:['رحلة الفضاء','انطلق نحو المعرفة… السماء ليست الحد'],
    ocean:['عالم المحيط','غُص في بحر المعرفة واكتشف كنوزه'],
    garden:['حديقة التعلّم','ازرع اليوم، تقطف غدًا'],
    rainbow:['عالم الألوان','تعلّم بكل الألوان'],
    teacher:['شكرًا معلّمي','في يوم المعلم… نقول لكل معلم: شكرًا'],
    tree:['يوم الشجرة','ازرع شجرة… تزرع حياة'],
    sports:['اليوم الرياضي','العقل السليم في الجسم السليم'],
    backtoschool:['عودًا حميدًا','عام دراسي سعيد ومليء بالإنجاز'],
    children:['يوم الطفل','كل يوم هو يومك… استمتع وتعلّم'],
    book:['يوم الكتاب','وخير جليس في الزمان كتاب']
  };

  /* ---------------- رسوم بطاقة الترحيب (viewBox 1200×320) ---------------- */
  const stars=(n,seed,w=1200,h=200,cls='jt-twinkle')=>{
    let s=seed,out='';const r=()=>{s=(s*9301+49297)%233280;return s/233280};
    for(let i=0;i<n;i++){out+=`<circle class="${cls}" cx="${(r()*w).toFixed(0)}" cy="${(r()*h).toFixed(0)}" r="${(0.8+r()*1.8).toFixed(1)}" style="animation-delay:-${(r()*4).toFixed(1)}s"/>`;}
    return out;
  };
  const lantern=(x,len,delay,scale=1)=>`<g transform="translate(${x} 0) scale(${scale})"><g class="jt-swing" style="animation-delay:${delay}s"><line x1="0" y1="0" x2="0" y2="${len}" stroke="#E7C36A" stroke-width="1.5"/><g transform="translate(0 ${len})"><circle r="34" cy="34" fill="rgba(255,205,110,.16)" class="jt-glow"/><path d="M-12 0h24l-6 9h-12z" fill="#E7C36A"/><path d="M-17 9h34l-5 44h-24z" fill="#F4C451"/><path d="M-9 14h18l-3 34h-12z" fill="#FFE7A8"/><path d="M0 14v34M-5 14l-2 34M5 14l2 34" stroke="#C99A2E" stroke-width="1.2"/><path d="M-12 53h24l-8 10h-8z" fill="#E7C36A"/><circle cy="67" r="3" fill="#E7C36A"/></g></g></g>`;
  const ART={
    ramadan:`${stars(38,7,1200,220)}
      <path d="M170 34a62 62 0 1 0 44 106 50 50 0 1 1-44-106z" fill="#F4C451" class="jt-moon"/>
      ${lantern(300,40,0)}${lantern(390,90,-1.2,.85)}${lantern(470,55,-.6,.7)}
      <path d="M0 320V262h40v-30l8-10 8 10v30h30a40 40 0 0 1 80 0h40v-60l10-14 10 14v60h60a55 55 0 0 1 110 0h50v-40l8-10 8 10v40h90a30 30 0 0 1 60 0h60v-50l10-14 10 14v50h80a60 60 0 0 1 120 0h50v-34l8-10 8 10v34h60a40 40 0 0 1 80 0h52v58z" fill="rgba(12,6,32,.55)"/>`,
    national:`<g class="jt-fire" style="--d:0s"><g transform="translate(250 90)">${Array.from({length:12},(_,i)=>`<line x1="0" y1="10" x2="0" y2="34" stroke="#C8102E" stroke-width="3" stroke-linecap="round" transform="rotate(${i*30})"/>`).join('')}</g></g>
      <g class="jt-fire" style="--d:-1.1s"><g transform="translate(420 60)">${Array.from({length:12},(_,i)=>`<line x1="0" y1="8" x2="0" y2="26" stroke="#1F7A4D" stroke-width="3" stroke-linecap="round" transform="rotate(${i*30})"/>`).join('')}</g></g>
      <g class="jt-fire" style="--d:-2s"><g transform="translate(110 70)">${Array.from({length:10},(_,i)=>`<line x1="0" y1="8" x2="0" y2="24" stroke="#E0A526" stroke-width="3" stroke-linecap="round" transform="rotate(${i*36})"/>`).join('')}</g></g>
      <g transform="translate(40 150)" fill="#8E6A45">
        <path d="M0 170V70h30V40l6-8h6l6 8v30h40V52h8v-8h8v8h8v8h8v-8h8v8h8V70h40V20l-6-8 16-12 16 12-6 8v50h60v100z"/>
        <path d="M200 170V60a36 36 0 0 1 72 0v110z"/><path d="M196 58h80v-10h-8v6h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8z"/>
        <path d="M272 170V100h120v70zM300 170v-30h24v30z" />
        <path d="M60 170v-40h22v40zM140 120h12v18h-12zM226 90h10v16h-10z" fill="#5B4028"/>
      </g>
      <g transform="translate(372 100)"><line x1="0" y1="0" x2="0" y2="150" stroke="#6B4F2E" stroke-width="4"/><g class="jt-wave-flag"><path d="M2 4h96v66H2z" fill="#fff"/><path d="M2 26h96v22H2z" fill="#C8102E"/><path d="M2 48h96v22H2z" fill="#1F7A4D"/><path d="M2 4h30v66H2z" fill="#C8102E"/></g></g>`,
    space:`${stars(60,3,1200,320)}
      <g class="jt-float"><circle cx="190" cy="120" r="62" fill="url(#jtPlanet)"/><ellipse cx="190" cy="120" rx="110" ry="22" fill="none" stroke="#F2A93B" stroke-width="6" opacity=".85" transform="rotate(-18 190 120)"/></g>
      <circle cx="420" cy="60" r="16" fill="#C9D2F5"/><circle cx="415" cy="56" r="4" fill="#AEB8E2"/><circle cx="426" cy="66" r="3" fill="#AEB8E2"/>
      <g class="jt-rocket"><g transform="rotate(-35)"><path d="M0-40c14 10 18 30 14 52H-14c-4-22 0-42 14-52z" fill="#fff"/><circle cy="-10" r="6" fill="#3E7BE0"/><path d="M-14 4l-12 16 14-4zM14 4l12 16-14-4z" fill="#E4643F"/><path d="M-8 14h16l-8 22z" fill="#F2A93B" class="jt-flame"/></g></g>
      <defs><radialGradient id="jtPlanet" cx=".35" cy=".35"><stop offset="0" stop-color="#8C7CFF"/><stop offset="1" stop-color="#3A2A9E"/></radialGradient></defs>`,
    ocean:`<g class="jt-bubbles">${Array.from({length:14},(_,i)=>`<circle cx="${40+i*80}" cy="330" r="${4+(i%4)*3}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" style="animation-delay:-${(i*0.9)%7}s;animation-duration:${6+(i%5)}s"/>`).join('')}</g>
      <g class="jt-fish" style="animation-duration:22s"><path d="M0 0c18-16 44-16 60 0-16 16-42 16-60 0zM60 0l16-12v24z" fill="#F2A93B"/><circle cx="14" cy="-3" r="3" fill="#123"/></g>
      <g class="jt-fish" style="animation-duration:30s;animation-delay:-12s;--y:90px"><path d="M0 0c12-11 30-11 42 0-12 11-30 11-42 0zM42 0l11-9v18z" fill="#FF8FA3"/><circle cx="10" cy="-2" r="2.4" fill="#123"/></g>
      <g class="jt-sway" style="transform-origin:120px 320px"><path d="M120 320c-20-40 20-60 0-100s20-60 0-90" fill="none" stroke="#2BB08A" stroke-width="10" stroke-linecap="round"/></g>
      <g class="jt-sway" style="transform-origin:170px 320px;animation-delay:-1.5s"><path d="M170 320c14-30-14-50 0-80s-14-40 0-60" fill="none" stroke="#1E8F70" stroke-width="8" stroke-linecap="round"/></g>
      <g class="jt-waves"><path d="M0 285c100-30 200 30 300 0s200-30 300 0 200 30 300 0 200-30 300 0 200 30 300 0 200-30 300 0 200 30 300 0 200-30 300 0v40H0z" fill="rgba(255,255,255,.16)"/><path d="M0 300c100-24 200 24 300 0s200-24 300 0 200 24 300 0 200-24 300 0 200 24 300 0 200-24 300 0 200 24 300 0 200-24 300 0v30H0z" fill="rgba(255,255,255,.22)"/></g>`,
    garden:`<g class="jt-spin-slow" style="transform-origin:90px 70px"><circle cx="90" cy="70" r="34" fill="#FFD166"/>${Array.from({length:10},(_,i)=>`<line x1="90" y1="18" x2="90" y2="4" stroke="#FFD166" stroke-width="5" stroke-linecap="round" transform="rotate(${i*36} 90 70)"/>`).join('')}</g>
      <path d="M0 320V250c120-50 260-40 380 0s260 40 420 0 300-40 400 0v70z" fill="#7CCB7A"/><path d="M0 320V280c160-30 320-20 480 10s320 20 720-10v40z" fill="#4FAF63"/>
      ${[[70,262,'#FF7AA2'],[150,250,'#FFD166'],[240,258,'#B98CFF'],[330,248,'#FF9F5A'],[420,262,'#FF7AA2'],[510,252,'#FFD166']].map(([x,y,c],i)=>`<g class="jt-bob" style="animation-delay:-${i*.7}s"><line x1="${x}" y1="${y}" x2="${x}" y2="${y+40}" stroke="#2E7D4F" stroke-width="3"/>${[0,72,144,216,288].map(a=>`<ellipse cx="${x}" cy="${y-9}" rx="6" ry="10" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="5" fill="#FFF3B0"/></g>`).join('')}
      <g class="jt-butterfly" style="--x:260px;--y:120px"><g class="jt-flap"><path d="M0 0c-18-22-34-8-22 8 8 8 22 0 22-8zM0 0c18-22 34-8 22 8-8 8-22 0-22-8z" fill="#B98CFF"/></g><line x1="0" y1="-6" x2="0" y2="10" stroke="#3D2A5C" stroke-width="2.5"/></g>
      <g class="jt-butterfly" style="--x:430px;--y:90px;animation-delay:-3s"><g class="jt-flap" style="animation-delay:-.2s"><path d="M0 0c-14-18-28-6-18 6 6 6 18 0 18-6zM0 0c14-18 28-6 18 6-6 6-18 0-18-6z" fill="#FF9F5A"/></g><line x1="0" y1="-5" x2="0" y2="8" stroke="#3D2A5C" stroke-width="2"/></g>`,
    rainbow:`<g transform="translate(260 330)" fill="none" stroke-width="18">${['#FF6B6B','#FF9F43','#FECA57','#1DD1A1','#54A0FF','#8E6CF5'].map((c,i)=>`<path class="jt-arc" style="animation-delay:${i*.12}s" d="M-${220-i*18} 0a${220-i*18} ${220-i*18} 0 0 1 ${2*(220-i*18)} 0" stroke="${c}"/>`).join('')}</g>
      ${[[40,70,1],[380,40,.8],[700,90,.7],[980,50,.9]].map(([x,y,s],i)=>`<g class="jt-drift" style="animation-delay:-${i*6}s"><g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><circle cx="0" cy="20" r="22"/><circle cx="26" cy="10" r="28"/><circle cx="56" cy="20" r="22"/><rect x="0" y="20" width="56" height="22" rx="11"/></g></g>`).join('')}
      ${stars(16,11,600,220,'jt-sparkle')}`,
    teacher:`<text x="400" y="70" class="jt-chalk" font-size="28" text-anchor="middle">١ + ٢ = ٣</text>
      <text x="390" y="132" class="jt-chalk" font-size="44" text-anchor="middle">أ ب ت</text>
      <path class="jt-draw" d="M320 152c40-14 100-14 140 0" fill="none" stroke="#FDF7E4" stroke-width="3" stroke-linecap="round"/>
      <path class="jt-draw" style="animation-delay:.6s" d="M440 175l9 19 21 3-15 15 4 21-19-10-19 10 4-21-15-15 21-3z" fill="none" stroke="#FFD166" stroke-width="3" stroke-linejoin="round"/>
      <g transform="translate(340 262) scale(.8)"><g class="jt-bob"><path d="M0 0c-26-18-50 6-40 34 8 22 30 30 40 20 10 10 32 2 40-20 10-28-14-52-40-34z" fill="#E4443A"/><path d="M0 0c2-10 8-16 16-18" stroke="#5B3A1A" stroke-width="4" fill="none"/><path d="M4-6c10-12 22-10 26-4-10 6-18 8-26 4z" fill="#4CAF50"/></g></g>
      <g transform="translate(390 300)"><rect x="0" y="0" width="56" height="9" rx="3" fill="#FDF7E4"/><rect x="70" y="-2" width="44" height="9" rx="3" fill="#FFD166" transform="rotate(-8 70 0)"/></g>`,
    tree:`<path d="M0 320v-30c200-20 400-20 600 0s400 20 600 0v30z" fill="#5AA469"/>
      <g class="jt-sway-tree" style="transform-origin:200px 300px"><path d="M188 300c6-50 4-90-6-130h36c-10 40-12 80-6 130z" fill="#7A5230"/><path d="M200 190l-40-40M204 200l44-36" stroke="#7A5230" stroke-width="10" stroke-linecap="round"/>
        <circle cx="200" cy="110" r="70" fill="#3E9B5A"/><circle cx="140" cy="140" r="50" fill="#4FB06A"/><circle cx="262" cy="140" r="52" fill="#48A864"/><circle cx="200" cy="60" r="46" fill="#5CBF76"/>
        <circle cx="160" cy="100" r="7" fill="#E4643F"/><circle cx="238" cy="120" r="7" fill="#E4643F"/><circle cx="205" cy="160" r="7" fill="#E4643F"/></g>
      ${Array.from({length:8},(_,i)=>`<path class="jt-leaf" style="--x:${120+i*55}px;animation-delay:-${i*1.3}s;animation-duration:${7+(i%3)*2}s" d="M0 0c8-10 20-10 24 0-8 10-20 10-24 0z" fill="${['#5CBF76','#9CCB5A','#E0A526'][i%3]}"/>`).join('')}`,
    sports:`<g opacity=".22">${Array.from({length:10},(_,i)=>`<path d="M${-200+i*140} 320L${-40+i*140} 0h40L${-160+i*140} 320z" fill="#fff"/>`).join('')}</g>
      <g transform="translate(40 240)">${Array.from({length:4},(_,r)=>Array.from({length:12},(_,c)=>(r+c)%2?`<rect x="${c*16}" y="${r*16}" width="16" height="16" fill="#fff"/>`:'').join('')).join('')}</g>
      <g class="jt-bounce"><g class="jt-roll"><circle r="34" fill="#fff"/><path d="M0-34v68M-34 0h68M-24-24c14 14 14 34 0 48M24-24c-14 14-14 34 0 48" stroke="#153956" stroke-width="3" fill="none"/></g></g>
      ${Array.from({length:14},(_,i)=>`<rect class="jt-confetti" x="${30+i*38}" y="-20" width="8" height="14" rx="2" fill="${['#FFD166','#FF6B6B','#1DD1A1','#fff'][i%4]}" style="animation-delay:-${(i*.55)%5}s;animation-duration:${4+(i%3)}s"/>`).join('')}`,
    backtoschool:`<g class="jt-bus"><g transform="translate(0 222)"><rect x="0" y="0" width="190" height="70" rx="14" fill="#FFC531"/><rect x="0" y="44" width="190" height="8" fill="#2D2D2D" opacity=".75"/>${[16,56,96,136].map(x=>`<rect x="${x}" y="10" width="30" height="24" rx="4" fill="#BFE3FF"/>`).join('')}<rect x="166" y="10" width="18" height="34" rx="3" fill="#BFE3FF"/><g class="jt-wheel" style="transform-origin:40px 72px"><circle cx="40" cy="72" r="15" fill="#2D2D2D"/><circle cx="40" cy="72" r="5" fill="#ccc"/></g><g class="jt-wheel" style="transform-origin:150px 72px"><circle cx="150" cy="72" r="15" fill="#2D2D2D"/><circle cx="150" cy="72" r="5" fill="#ccc"/></g></g></g>
      <g transform="translate(330 60) rotate(28)"><g class="jt-bob"><rect width="160" height="22" rx="4" fill="#FFB020"/><rect x="0" width="24" height="22" rx="4" fill="#FF8FA3"/><rect x="18" width="8" height="22" fill="#C0C0C0"/><path d="M160 0l26 11-26 11z" fill="#F6D7A7"/><path d="M178 7l8 4-8 4z" fill="#333"/></g></g>
      <g class="jt-plane"><path d="M0 0l60 20-60 20 12-20z" fill="#fff" stroke="#3867D6" stroke-width="2" stroke-linejoin="round"/><path d="M12 20h48" stroke="#3867D6" stroke-width="2"/></g>
      <text x="120" y="120" font-size="54" fill="#3867D6" opacity=".25" font-weight="800">أ ب ت</text>`,
    children:`${[[70,'#FF6FA8',0],[150,'#6E72D9',-2],[230,'#FFD166',-4],[320,'#1DD1A1',-1],[410,'#FF9F43',-3],[490,'#54A0FF',-5]].map(([x,c,d])=>`<g class="jt-balloon" style="--x:${x}px;animation-delay:${d}s"><ellipse cx="0" cy="0" rx="26" ry="32" fill="${c}"/><ellipse cx="-9" cy="-12" rx="6" ry="9" fill="rgba(255,255,255,.45)"/><path d="M-4 31h8l-4 6z" fill="${c}"/><path d="M0 37c-8 14 8 22 0 40s8 20 0 34" stroke="#9A8FB0" stroke-width="1.5" fill="none"/></g>`).join('')}
      ${Array.from({length:16},(_,i)=>`<rect class="jt-confetti" x="${20+i*36}" y="-20" width="7" height="12" rx="2" fill="${['#FF6FA8','#6E72D9','#FFD166','#1DD1A1'][i%4]}" style="animation-delay:-${(i*.6)%5}s;animation-duration:${5+(i%3)}s"/>`).join('')}`,
    book:`<g transform="translate(260 250)"><path d="M0 0c-60-24-140-24-200-4v-150c60-20 140-20 200 4z" fill="#FFF8E7" stroke="#B58B5C" stroke-width="3"/><path d="M0 0c60-24 140-24 200-4v-150c-60-20-140-20-200 4z" fill="#FFF8E7" stroke="#B58B5C" stroke-width="3"/>
        ${[0,1,2,3,4].map(i=>`<path d="M-180 ${-130+i*24}c50-12 110-12 160 0M20 ${-130+i*24}c50-12 110-12 160 0" stroke="#D8C3A0" stroke-width="3" fill="none"/>`).join('')}
        <g class="jt-page"><path d="M0 0c60-24 140-24 200-4v-150c-60-20-140-20-200 4z" fill="#FFFDF5" stroke="#B58B5C" stroke-width="2"/></g>
        <path d="M-4 0h8v12h-8z" fill="#8E5E3B"/></g>
      ${['ق','ر','أ','ك','ت','ا','ب'].map((l,i)=>`<text class="jt-letter" x="${120+i*55}" y="80" font-size="${26+(i%3)*8}" fill="#795548" style="animation-delay:-${i*.9}s">${l}</text>`).join('')}`
  };
  const art=(id,fit='meet')=>ART[id]?`<svg class="jt-art" viewBox="0 0 1200 320" preserveAspectRatio="xMinYMax ${fit}" aria-hidden="true">${ART[id]}</svg>`:'';

  /* ---------------- مشهد الخلفية للصفحة ---------------- */
  function particles(id){
    const seq=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
    switch(id){
      case 'ramadan': return `<div class="js-stars"></div>`+seq(4,i=>`<svg class="js-lantern" style="left:${8+i*26}%;--len:${40+(i%2)*50}px;animation-delay:-${i*.9}s" viewBox="-40 0 80 170" aria-hidden="true">${lantern(0,60+(i%2)*30,0)}</svg>`);
      case 'space': return `<div class="js-stars"></div><div class="js-stars js-stars2"></div><span class="js-comet"></span>`;
      case 'ocean': return seq(12,i=>`<span class="js-bubble" style="left:${(i*8.3+3)%100}%;width:${8+(i%4)*6}px;height:${8+(i%4)*6}px;animation-delay:-${(i*1.7)%12}s;animation-duration:${10+(i%5)*2}s"></span>`)+`<div class="js-seafloor"></div>`;
      case 'garden': case 'tree': return seq(10,i=>`<span class="js-leaf" style="left:${(i*10.7+4)%100}%;animation-delay:-${(i*2.1)%16}s;animation-duration:${12+(i%4)*3}s;--c:${id==='garden'?['#FF9DBB','#FFD166','#C8A8FF'][i%3]:['#5CBF76','#9CCB5A','#E0A526'][i%3]}"></span>`);
      case 'rainbow': return seq(4,i=>`<span class="js-cloud" style="top:${10+i*22}%;animation-delay:-${i*14}s;animation-duration:${50+i*10}s"></span>`);
      case 'children': return seq(8,i=>`<span class="js-balloon" style="left:${(i*12.5+5)%100}%;--c:${['#FF6FA8','#6E72D9','#FFD166','#1DD1A1'][i%4]};animation-delay:-${(i*2.6)%18}s;animation-duration:${16+(i%3)*4}s"></span>`);
      case 'sports': return seq(16,i=>`<span class="js-confetti" style="left:${(i*6.3+2)%100}%;--c:${['#FFD166','#FF6B6B','#1DD1A1','#0968C7'][i%4]};animation-delay:-${(i*1.1)%9}s;animation-duration:${8+(i%4)*2}s"></span>`);
      case 'backtoschool': return seq(3,i=>`<svg class="js-plane" style="top:${15+i*28}%;animation-delay:-${i*9}s" viewBox="0 0 64 40" aria-hidden="true"><path d="M2 2l60 18-60 18 12-18z" fill="#fff" stroke="#3867D6" stroke-width="2" stroke-linejoin="round"/></svg>`);
      case 'book': return seq(8,i=>`<span class="js-letter" style="left:${(i*12.1+6)%100}%;animation-delay:-${(i*2.3)%18}s;animation-duration:${18+(i%3)*4}s">${'أبتثجحخد'[i]}</span>`);
      case 'national': return `<div class="js-flagband"></div>`+seq(3,i=>`<span class="js-burst" style="left:${15+i*33}%;top:${18+(i%2)*30}%;--c:${['#C8102E','#1F7A4D','#E0A526'][i]};animation-delay:-${i*1.3}s"></span>`);
      case 'teacher': return `<div class="js-doodles"></div>`;
      default: return '';
    }
  }

  let fontLoaded={};
  function ensureFont(id){
    const f=FONT_URL[id]; if(!f||fontLoaded[f]) return;
    fontLoaded[f]=true;
    const l=document.createElement('link');l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family='+f+'&display=swap';
    document.head.appendChild(l);
  }

  function currentTheme(){return document.body.getAttribute('data-theme')||'default'}

  function decorate(){
    const id=currentTheme();
    document.querySelectorAll('.role-welcome').forEach(w=>{
      const old=w.querySelector(':scope > .jt-art'); const oldBadge=w.querySelector('.jt-badge');
      if(id==='default'||!ART[id]){old&&old.remove();oldBadge&&oldBadge.remove();return;}
      if(!old||old.dataset.t!==id){old&&old.remove();w.insertAdjacentHTML('afterbegin',art(id));w.querySelector(':scope > .jt-art').dataset.t=id;}
      const content=w.querySelector('.role-welcome-content');
      if(content&&(!oldBadge||oldBadge.dataset.t!==id)){
        oldBadge&&oldBadge.remove();
        const [title,msg]=GREETING[id]||['',''];
        content.insertAdjacentHTML('afterbegin',`<div class="jt-badge" data-t="${id}">${icon(id)}<div><b>${title}</b><span>${msg}</span></div></div>`);
      }
    });
  }

  function renderScene(id){
    let scene=document.getElementById('jdScene');
    if(!scene){scene=document.createElement('div');scene.id='jdScene';scene.setAttribute('aria-hidden','true');document.body.insertBefore(scene,document.body.firstChild);}
    if(scene.dataset.t===id) return;
    scene.dataset.t=id;
    scene.className='jd-scene js-'+id;
    scene.innerHTML=particles(id);
  }

  window.jdApplyThemeVisuals=function(){
    const id=currentTheme();
    ensureFont(id);
    renderScene(id);
    decorate();
  };
  window.jdThemePreview=function(id){
    ensureFont(id);
    if(id==='default') return `<div class="jt-preview" data-tp="default"><span class="jt-prev-mark">جود</span></div>`;
    const [title]=GREETING[id]||[''];
    return `<div class="jt-preview" data-tp="${id}">${art(id,'slice')}<span class="jt-prev-title">${title}</span></div>`;
  };
  window.jdThemeIcon=icon;

  /* مزامنة الثيم المشترك من السحابة بعد الدخول */
  window.jdSyncTheme=async function(){
    try{
      if(!window.NabdCloud?.getSchoolTheme) return;
      const id=await NabdCloud.getSchoolTheme();
      if(id&&id!==currentTheme()&&typeof applyPlatformTheme==='function') applyPlatformTheme(id,true);
    }catch(e){console.warn('تعذر تحميل ثيم المدرسة:',e);}
  };

  /* إعادة التزيين عند تغيّر الثيم أو إعادة رسم لوحة الرئيسية */
  const start=()=>{
    window.jdApplyThemeVisuals();
    new MutationObserver(()=>window.jdApplyThemeVisuals()).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
    const dash=document.getElementById('dashboard');
    if(dash) new MutationObserver(decorate).observe(dash,{childList:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();

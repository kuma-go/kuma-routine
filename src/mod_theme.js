window.ModTheme = (function(){

  /* ---------- module state ---------- */
  let mqList = null;
  let mqHandler = null;
  let carouselTimer = null;
  let transitionTimer = null;

  const ADS = [
    { emoji:'📚', text:'○○학습지 · 초등 전과목 하루 10분 습관', cta:'무료체험' },
    { emoji:'🍯', text:'튼튼영양제 · 성장기 아이를 위한 맞춤 영양', cta:'더보기' },
    { emoji:'🎠', text:'○○키즈카페 · 이번 주말 2+1 이벤트', cta:'예약하기' },
    { emoji:'🎨', text:'○○미술학원 · 신규 등록 첫 달 반값', cta:'상담신청' }
  ];

  /* ---------- helpers ---------- */
  function $ad(){ return document.querySelector('#phone > .ad'); }

  function systemPrefersDark(){
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function resolvedMode(){
    const t = App.state.theme || 'system';
    if(t === 'system') return systemPrefersDark() ? 'dark' : 'light';
    return t;
  }

  function applyTransitionGuard(){
    const phone = document.getElementById('phone'); if(!phone) return;
    phone.classList.add('th-anim');
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(()=>{ phone.classList.remove('th-anim'); }, 320);
  }

  function paint(){
    const phone = document.getElementById('phone'); if(!phone) return;
    phone.classList.toggle('th-dark', resolvedMode() === 'dark');
  }

  function ensureMQ(){
    if(mqList || !window.matchMedia) return;
    mqList = window.matchMedia('(prefers-color-scheme: dark)');
    mqHandler = ()=>{
      if((App.state.theme || 'system') === 'system'){ applyTransitionGuard(); paint(); }
    };
    if(mqList.addEventListener) mqList.addEventListener('change', mqHandler);
    else if(mqList.addListener) mqList.addListener(mqHandler); // old Safari
  }

  /* ---------- ad slot ---------- */
  function renderAdItem(a){
    return `<button type="button" class="ad-item">
      <span class="ad-emoji">${a.emoji}</span>
      <span class="ad-text">${a.text}</span>
      <span class="ad-cta">${a.cta}</span>
    </button>`;
  }

  function stopCarousel(){
    if(carouselTimer){ clearInterval(carouselTimer); carouselTimer = null; }
  }

  function startCarousel(track){
    stopCarousel();
    let idx = 0;
    carouselTimer = setInterval(()=>{
      idx++;
      track.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
      track.style.transform = 'translateY(-' + (idx * 46) + 'px)';
      if(idx === ADS.length){
        setTimeout(()=>{
          track.style.transition = 'none';
          track.style.transform = 'translateY(0px)';
          void track.offsetWidth; // force reflow so next transition re-arms
          idx = 0;
        }, 520);
      }
    }, 7000);
  }

  function initAdSlot(){
    const ad = $ad(); if(!ad) return;
    stopCarousel();
    ad.classList.add('ad-slot');
    const list = ADS.concat([ADS[0]]);
    ad.innerHTML = `
      <span class="ad-label">AD</span>
      <div class="ad-viewport">
        <div class="ad-track" id="thAdTrack">${list.map(renderAdItem).join('')}</div>
      </div>
      <button type="button" class="ad-close" id="thAdClose" aria-label="광고 없이 쓰기">✕</button>
    `;
    ad.classList.toggle('ad-hide', !!App.state.adFree);

    ad.querySelectorAll('.ad-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{ App.toast('프로토타입이라 링크는 열리지 않아요'); });
    });
    const closeBtn = ad.querySelector('#thAdClose');
    if(closeBtn) closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); openSubscribeSheet(); });

    if(!App.state.adFree){
      const track = ad.querySelector('#thAdTrack');
      if(track) startCarousel(track);
    }
  }

  function hideAdsAnimated(){
    const ad = $ad(); if(!ad) return;
    ad.classList.add('ad-hide');
    stopCarousel();
  }

  function openSubscribeSheet(){
    App.sheet('광고 없이 쓰기', `
      <div class="th-sub-hero">
        <div class="th-sub-badge">🎈</div>
        <div class="th-sub-name">KUMA routine <span>Plus</span></div>
        <div class="th-sub-price">월 <b>₩2,900</b> · 첫 7일 무료 체험</div>
      </div>
      <div class="panel th-sub-benefits">
        <div class="th-sub-row"><span class="th-sub-emoji">🚫</span><div><div class="th-sub-title">광고 없이 매끈하게</div><div class="th-sub-desc">타임테이블 상단 광고가 완전히 사라져요</div></div></div>
        <div class="th-sub-row"><span class="th-sub-emoji">🎨</span><div><div class="th-sub-title">프리미엄 테마 색상</div><div class="th-sub-desc">우리 가족만의 포인트 컬러를 골라요</div></div></div>
        <div class="th-sub-row"><span class="th-sub-emoji">💾</span><div><div class="th-sub-title">더 오래 보관되는 기록</div><div class="th-sub-desc">주간 성취 리포트를 1년치까지 볼 수 있어요</div></div></div>
      </div>
    `, `
      <button class="btn line" id="thSubCancel" style="flex:0 0 84px">나중에</button>
      <button class="btn warm full" id="thSubStart">체험 시작하기</button>
    `, (b, f)=>{
      f.querySelector('#thSubCancel').onclick = ()=> App.closeSheet();
      f.querySelector('#thSubStart').onclick = ()=>{
        App.state.adFree = true; App.save();
        App.closeSheet();
        hideAdsAnimated();
        App.toast('광고를 껐어요 · 7일 무료 체험');
      };
    });
  }

  /* ---------- theme picker sheet ---------- */
  function thumbHTML(cls, cards){
    return `<span class="th-thumb ${cls}">
      <span class="th-t-bar"></span>
      ${cards.map(c=>`<span class="th-t-card" style="--c:${c}"></span>`).join('')}
      <span class="th-t-tab"></span>
    </span>`;
  }

  function optHTML(mode, cur, emoji, label, desc, thumb){
    return `<button type="button" class="th-opt ${cur===mode?'on':''}" data-m="${mode}">
      ${thumb}
      <span class="th-opt-info"><b>${emoji} ${label}</b><span>${desc}</span></span>
      <span class="th-opt-check">✓</span>
    </button>`;
  }

  function openPicker(){
    const cur = App.state.theme || 'system';
    const body = `<div class="th-opt-list">
      ${optHTML('light', cur, '☀️', '라이트', '밝고 또렷하게', thumbHTML('th-thumb-light', ['#B6DD6E','#7B96EF','#FFD166']))}
      ${optHTML('dark', cur, '🌙', '다크', '눈이 편안하게', thumbHTML('th-thumb-dark', ['#6E8A4E','#4E63A0','#B08C46']))}
      ${optHTML('system', cur, '📱', '시스템 설정 따르기', '기기 설정에 맞춰 자동으로 바뀌어요', `<span class="th-thumb th-thumb-system"></span>`)}
    </div>`;

    App.sheet('화면 테마', body, '', (b)=>{
      b.querySelectorAll('.th-opt').forEach(btn=>{
        btn.onclick = ()=>{
          const m = btn.dataset.m;
          b.querySelectorAll('.th-opt').forEach(x=>x.classList.toggle('on', x === btn));
          ModTheme.apply(m);
          App.haptic();
          const msg = m === 'light' ? '☀️ 라이트 모드로 바꿨어요' : m === 'dark' ? '🌙 다크 모드로 바꿨어요' : '📱 시스템 설정을 따라가요';
          setTimeout(()=>{ App.toast(msg); App.closeSheet(); }, 200);
        };
      });
    });
  }

  /* ---------- public API ---------- */
  return {
    css: `
      /* re-anchor color inheritance at the phone root. body{color:var(--ink)} resolves against
         :root (body sits OUTSIDE #phone), so any element that relies on inherited color instead
         of redeclaring color:var(--ink) itself would otherwise stay frozen at the light value
         even after #phone.th-dark flips the token. This single rule fixes that app-wide. */
      #phone{ color:var(--ink); }

      /* ===== transition guard (toggled only while switching) ===== */
      #phone.th-anim, #phone.th-anim *{
        transition: background-color .28s ease, color .28s ease, border-color .28s ease, box-shadow .28s ease;
      }

      /* ===== dark palette (scoped override, never touches :root) ===== */
      #phone.th-dark{
        --ink:#F2F2F7; --ink2:#C7C7D2; --muted:#93939F; --muted-soft:#6E6E79; --line:#2B2B36;
        --bg:#121218; --paper:#1C1C24;
        --indigo:#7A6EEA; --indigo-d:#5A4FCB; --indigo-s:#241F3D;
        --orange:#FF7A45; --orange-s:#3A2415;
        --sh-1:0 1px 2px rgba(0,0,0,.55);
        --sh-2:0 10px 26px rgba(0,0,0,.5);
        --sh-3:0 -10px 34px rgba(0,0,0,.6);
      }

      /* ===== core chrome fixups: hardcoded colors that don't derive from tokens ===== */
      #phone.th-dark .icobtn:active{ background:#26262f; }
      #phone.th-dark .dots i{ background:#33333f; }
      #phone.th-dark .todaypill.ghost{ background:var(--paper); }
      #phone.th-dark .pchip{ background:#23232c; color:var(--ink2); }
      #phone.th-dark .pchip .pav{ background:#2c2c37; }
      #phone.th-dark .pchip.on .pav{ background:rgba(255,255,255,.18); }
      #phone.th-dark .scrim{ background:rgba(0,0,0,.58); }
      /* background-COLOR only (not the shorthand): select.inp relies on the shorthand-free
         background-image/repeat/position rule elsewhere, and the shorthand here would
         out-specificity + reset those to initial, tiling the chevron icon */
      #phone.th-dark .inp{ background-color:#20202a; border-color:#33333f; color:var(--ink); }
      #phone.th-dark .inp:focus{ background-color:#24242f; }
      #phone.th-dark select.inp{
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888894' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      }
      #phone.th-dark .sw-tog{ background:#33333f; }
      #phone.th-dark .daychip{ background:#20202a; border-color:#33333f; color:var(--muted); }
      #phone.th-dark .btn.line{ background:var(--paper); border-color:var(--line); color:var(--ink2); }
      #phone.th-dark .btn.ghost{ background:var(--indigo-s); color:var(--indigo); }
      #phone.th-dark .tabbar{ background:rgba(18,18,24,.92); border-top-color:#26262f; }
      #phone.th-dark .tab{ color:#5c5c68; }
      #phone.th-dark .dr-item:active{ background:#24242e; }
      #phone.th-dark .hr{ background:var(--line); }
      #phone.th-dark .vseg{ background:#1a1a22; }
      #phone.th-dark .vseg button.on{ background:#2c2c3a; color:var(--indigo); }
      #phone.th-dark .td-coin,
      #phone.th-dark .rw-benefit-cost b,
      #phone.th-dark .rw-hist-cost{ color:#FF9D6B; }

      /* timetable cards */
      #phone.th-dark .card.empty{ border-color:#2a2a35; }
      #phone.th-dark .card.empty .t{ color:#5b5b68; }
      #phone.th-dark .card.ghost-top{ border-color:#33333f; }
      #phone.th-dark .card.locked{ background:#20202a; color:#75757f; border-color:#33333f; }
      /* pastel event cards: darken + desaturate the fill only (never the inherited text color) */
      #phone.th-dark .card:not(.empty):not(.locked)::before{
        content:''; position:absolute; inset:0; z-index:-1; pointer-events:none;
        background:rgba(6,6,10,.36); mix-blend-mode:multiply;
      }
      #phone.th-dark .card:not(.empty):not(.locked)::after{
        content:''; position:absolute; inset:0; z-index:-1; pointer-events:none;
        background:#9a9aa0; mix-blend-mode:saturation; opacity:.3;
      }
      #phone.th-dark .card .memo{ background:rgba(6,6,12,.62); color:#F2F2F7; }
      #phone.th-dark .card .memo .lb{ color:#C7C7D2; }
      #phone.th-dark .card .memo .chip{ background:rgba(255,255,255,.14); }
      #phone.th-dark .card .bell:active{ background:rgba(255,255,255,.22); }
      #phone.th-dark .prep-bar .track{ background:rgba(255,255,255,.12); }
      #phone.th-dark .chip.pk.ok{ background:rgba(63,191,127,.24); color:#7CE7AC; }
      #phone.th-dark .chip.pk.ok .bx{ background:#3FBF7F; border-color:#3FBF7F; }
      #phone.th-dark .prep-bar.done{ color:#7CE7AC; }

      /* week view */
      #phone.th-dark .wk-hours i{ background:#24242e; }
      #phone.th-dark .wk-lb b{ color:#71717c; }
      #phone.th-dark .wk-col.today{ background:linear-gradient(180deg,rgba(255,122,69,.16),rgba(255,122,69,0)); }
      #phone.th-dark .wk-ev:not(.lock)::before{
        content:''; position:absolute; inset:0; z-index:-1; pointer-events:none; border-radius:inherit;
        background:rgba(6,6,10,.36); mix-blend-mode:multiply;
      }
      #phone.th-dark .wk-ev:not(.lock)::after{
        content:''; position:absolute; inset:0; z-index:-1; pointer-events:none; border-radius:inherit;
        background:#9a9aa0; mix-blend-mode:saturation; opacity:.3;
      }
      #phone.th-dark .wk-ev.lock{ background:#20202a; color:#75757f; border-color:#33333f; }

      /* context menu / pin pad / toast stays intentionally dark already */
      #phone.th-dark .ctx{ background:#23232d; box-shadow:0 12px 40px rgba(0,0,0,.6); }
      #phone.th-dark .ctx button:active{ background:#2c2c38; }
      #phone.th-dark .ctx button + button{ border-top-color:#2f2f3b; }
      #phone.th-dark .ctx-head{ background:#1d1d27; color:var(--muted); }
      #phone.th-dark .pinpad button{ background:#20202a; color:var(--ink); }
      #phone.th-dark .pinpad button:active{ background:var(--indigo-s); }
      #phone.th-dark .pinpad button.ghosted{ color:var(--muted); }
      #phone.th-dark .pinrow i{ background:#2c2c38; }

      /* QR: background must stay white to remain scannable, and the modules must stay
         a fixed dark ink regardless of theme (the module foreground uses var(--ink)
         which would otherwise flip to a near-white color and disappear) */
      #phone.th-dark .fm-qr-card, #phone.th-dark .fm-qr{ --ink:#17171C; background:#fff; }
      /* "나" badge: background:var(--ink) + hardcoded white text would flip to
         white-bg/white-text in dark mode. Pin it to a theme-independent chip. */
      #phone.th-dark .fm-me-badge{ background:#3a3a46; color:#fff; }
      /* in-app banner is a frosted glass card; its text already follows var(--ink)/--ink2,
         so the frosted backdrop itself must flip too or text goes invisible on white */
      #phone.th-dark .nt-banner{
        background:rgba(26,26,34,.88); border-color:rgba(255,255,255,.08);
        box-shadow:0 16px 36px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.35);
      }

      /* ===== theme picker sheet ===== */
      .th-opt-list{ display:flex; flex-direction:column; gap:10px; }
      .th-opt{
        display:flex; align-items:center; gap:12px; width:100%; padding:12px; border-radius:16px;
        border:1.5px solid var(--line); background:var(--paper); text-align:left; transition:.15s;
      }
      .th-opt:active{ transform:scale(.98); }
      .th-opt.on{ border-color:var(--indigo); background:var(--indigo-s); }
      .th-opt-info{ flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
      .th-opt-info b{ font-size:14px; font-weight:800; color:var(--ink); }
      .th-opt-info span{ font-size:11.5px; font-weight:600; color:var(--muted); }
      .th-opt-check{
        width:23px; height:23px; border-radius:50%; border:1.6px solid var(--line); flex:0 0 auto;
        display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:transparent;
        transition:.15s;
      }
      .th-opt.on .th-opt-check{ background:var(--indigo); border-color:var(--indigo); color:#fff; }

      .th-thumb{ position:relative; width:64px; height:52px; border-radius:10px; overflow:hidden; flex:0 0 auto; box-shadow:0 1px 4px rgba(0,0,0,.2); }
      .th-thumb-light{ background:#F3F3F6; }
      .th-thumb-dark{ background:#121218; }
      .th-t-bar{ position:absolute; left:0; right:0; top:0; height:9px; background:#FFFFFF; }
      .th-thumb-dark .th-t-bar{ background:#1C1C24; }
      .th-t-card{ position:absolute; left:5px; right:5px; height:7px; border-radius:3px; background:var(--c); }
      .th-t-card:nth-child(2){ top:14px; }
      .th-t-card:nth-child(3){ top:24px; }
      .th-t-card:nth-child(4){ top:34px; }
      .th-t-tab{ position:absolute; left:0; right:0; bottom:0; height:8px; background:#FFFFFF; border-top:1px solid rgba(0,0,0,.06); }
      .th-thumb-dark .th-t-tab{ background:#1C1C24; border-top-color:rgba(255,255,255,.08); }
      .th-thumb-system{ background:linear-gradient(115deg,#F3F3F6 0 48%,#121218 52% 100%); }
      .th-thumb-system::before{ content:'☀️'; position:absolute; left:6px; top:6px; font-size:11px; }
      .th-thumb-system::after{ content:'🌙'; position:absolute; right:5px; bottom:4px; font-size:11px; }

      /* ===== subscribe (ad-free) sheet ===== */
      .th-sub-hero{ text-align:center; padding:4px 0 18px; }
      .th-sub-badge{ font-size:40px; line-height:1; }
      .th-sub-name{ font-size:20px; font-weight:800; margin-top:8px; color:var(--ink); }
      .th-sub-name span{ color:var(--orange); }
      .th-sub-price{ font-size:13px; font-weight:700; color:var(--muted); margin-top:5px; }
      .th-sub-price b{ font-size:15px; color:var(--ink); }
      .th-sub-benefits{ display:flex; flex-direction:column; gap:13px; padding:16px 14px; }
      .th-sub-row{ display:flex; gap:11px; align-items:flex-start; }
      .th-sub-emoji{ font-size:17px; flex:0 0 auto; line-height:1.3; }
      .th-sub-title{ font-size:13.5px; font-weight:800; color:var(--ink); }
      .th-sub-desc{ font-size:11.5px; color:var(--muted); font-weight:600; margin-top:2px; line-height:1.4; }

      /* ===== ad slot ===== */
      .ad.ad-slot{
        position:relative; overflow:hidden; padding:0; display:flex; align-items:stretch;
        transition:height .32s cubic-bezier(.22,1,.36,1), opacity .28s ease, margin .32s cubic-bezier(.22,1,.36,1);
      }
      .ad.ad-slot.ad-hide{ height:0; opacity:0; margin-top:0; margin-bottom:0; pointer-events:none; }
      #phone.th-dark .ad.ad-slot{ background:linear-gradient(180deg,#22222c,#1a1a22); }
      .ad-label{
        position:absolute; left:7px; top:50%; transform:translateY(-50%); z-index:3; pointer-events:none;
        font-size:8.5px; font-weight:800; letter-spacing:.12em; color:rgba(110,120,165,.9);
        background:rgba(255,255,255,.6); padding:1.5px 4px; border-radius:4px;
      }
      #phone.th-dark .ad-label{ background:rgba(0,0,0,.4); color:rgba(200,205,235,.9); }
      .ad-viewport{ flex:1; position:relative; overflow:hidden; margin:0 32px 0 28px; }
      .ad-track{ position:absolute; left:0; right:0; top:0; will-change:transform; }
      .ad-item{
        height:46px; width:100%; display:flex; align-items:center; gap:7px; padding:0 2px;
        font-size:11.5px; font-weight:700; color:var(--ink2); text-align:left;
      }
      .ad-emoji{ font-size:16px; flex:0 0 auto; }
      .ad-text{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .ad-cta{
        flex:0 0 auto; font-size:10px; font-weight:800; color:var(--indigo);
        background:rgba(255,255,255,.75); padding:3px 8px; border-radius:20px;
      }
      #phone.th-dark .ad-cta{ background:rgba(0,0,0,.32); color:#B7AEFF; }
      .ad-close{
        position:absolute; right:6px; top:50%; transform:translateY(-50%); z-index:3;
        width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center;
        color:rgba(90,95,130,.7); font-size:12px; font-weight:800;
      }
      .ad-close::before{ content:''; position:absolute; inset:-10px; }
      .ad-close:active{ background:rgba(255,255,255,.5); }
      #phone.th-dark .ad-close{ color:rgba(190,195,220,.75); }
      #phone.th-dark .ad-close:active{ background:rgba(255,255,255,.12); }
    `,

    init(){
      if(typeof App.state.theme !== 'string') App.state.theme = 'system';
      if(typeof App.state.adFree !== 'boolean') App.state.adFree = false;
      ensureMQ();
      paint();          // instant on boot, no transition flash
      initAdSlot();
    },

    openPicker,

    apply(mode){
      if(mode !== 'light' && mode !== 'dark' && mode !== 'system') return;
      App.state.theme = mode;
      App.save();
      applyTransitionGuard();
      paint();
    },

    current(){
      return resolvedMode();
    },

    showAds(){
      App.state.adFree = false;
      App.save();
      initAdSlot();
      App.toast('광고를 다시 켰어요');
    }
  };
})();

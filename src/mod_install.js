/**
 * ModInstall — 홈 화면에 앱으로 앉히기
 *
 * 브라우저는 "몰래 설치"를 허용하지 않는다. 사용자의 확인이 반드시 한 번 들어간다.
 * 그래서 목표를 "자동 설치"가 아니라 "탭 수를 최소로" 로 잡았다.
 *
 *   안드로이드/크롬 계열 : beforeinstallprompt 를 잡아뒀다가 배너 한 번 탭 → 설치
 *   iOS 사파리          : 설치 API 자체가 없다. 공유 시트 위치를 그림으로 짚어준다
 *   이미 설치됨         : 아무것도 띄우지 않는다
 *
 * 설치하면 저장소가 새로 잡히므로, 첫 실행에서 초대 코드를 이어받도록 돕는다.
 */
window.ModInstall = {
  css: `
    .in-banner{
      position:absolute; left:12px; right:12px; z-index:120;
      bottom:calc(var(--tabh,64px) + 12px + env(safe-area-inset-bottom,0px));
      display:flex; align-items:center; gap:12px; padding:12px 14px;
      border-radius:var(--r-m); background:var(--paper);
      box-shadow:0 12px 34px rgba(20,20,50,.20); border:1px solid var(--line);
      transform:translateY(140%); transition:transform .38s cubic-bezier(.22,1,.36,1);
    }
    .in-banner.on{ transform:translateY(0); }
    .in-ico{ width:40px; height:40px; border-radius:11px; flex:0 0 auto;
      background:var(--indigo-s); display:flex; align-items:center; justify-content:center; }
    .in-tx{ display:flex; flex-direction:column; gap:2px; min-width:0; flex:1 1 auto; }
    .in-tx b{ font-size:13.5px; font-weight:800; color:var(--ink); }
    .in-tx small{ font-size:11.5px; font-weight:700; color:var(--muted); line-height:1.45; }
    .in-go{ flex:0 0 auto; padding:10px 15px; border-radius:14px; border:0;
      background:var(--indigo); color:#fff; font-size:13px; font-weight:800; cursor:pointer; }
    .in-x{ flex:0 0 auto; width:28px; height:28px; border-radius:50%; border:0;
      background:transparent; color:var(--muted); font-size:16px; font-weight:800; cursor:pointer; }

    .in-steps{ display:flex; flex-direction:column; gap:10px; margin:4px 0 0; }
    .in-step{ display:flex; align-items:center; gap:12px; padding:13px 14px;
      border-radius:var(--r-m); background:var(--bg); }
    .in-num{ width:26px; height:26px; border-radius:50%; flex:0 0 auto;
      background:var(--indigo); color:#fff; font-size:13px; font-weight:800;
      display:flex; align-items:center; justify-content:center; }
    .in-step-tx{ font-size:13.5px; font-weight:700; color:var(--ink2); line-height:1.5; }
    .in-step-tx b{ color:var(--ink); font-weight:800; }
    .in-shot{ flex:0 0 auto; }
    .in-hero{ text-align:center; padding:2px 0 16px; }
    .in-hero-ic{ width:78px; height:78px; margin:0 auto 10px; border-radius:20px;
      background:var(--indigo-s); display:flex; align-items:center; justify-content:center; }
    .in-hero-t{ font-size:17px; font-weight:800; color:var(--ink); }
    .in-hero-s{ font-size:12.5px; font-weight:700; color:var(--muted); margin-top:4px; line-height:1.6; }
    #phone.th-dark .in-banner{ background:#22222C; border-color:#33333F; }
  `,

  _deferred: null,
  _bannerEl: null,

  /* ================= 환경 판별 ================= */
  standalone(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches
          || window.navigator.standalone === true;
    }catch(e){ return false; }
  },
  isIOS(){
    const ua = navigator.userAgent || '';
    /* iPadOS 는 데스크톱으로 위장하므로 터치로 한 번 더 확인한다 */
    return /iPad|iPhone|iPod/.test(ua)
        || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  },
  iosSafari(){
    if(!this.isIOS()) return false;
    const ua = navigator.userAgent || '';
    return !/CriOS|FxiOS|EdgiOS|OPiOS|Whale|SamsungBrowser/.test(ua);
  },
  canInstall(){ return !!this._deferred; },
  /* 안내할 만한 상황인가 */
  available(){
    if(this.standalone()) return false;
    if(!location.protocol.startsWith('http')) return false;
    return this.canInstall() || this.isIOS();
  },
  dismissed(){ try{ return localStorage.getItem('kuma.inst.off')==='1'; }catch(e){ return false; } },
  _dismiss(){ try{ localStorage.setItem('kuma.inst.off','1'); }catch(e){} },

  /* ================= 부팅 ================= */
  init(){
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();                 // 브라우저 기본 배너를 미루고 우리가 때를 고른다
      this._deferred = e;
      App.renderDrawer && App.renderDrawer();
      this._maybeBanner();
    });
    window.addEventListener('appinstalled', () => {
      this._deferred = null;
      this.hideBanner();
      App.toast('홈 화면에 추가했어요 🎉');
      App.renderDrawer && App.renderDrawer();
    });
    /* 설치한 앱을 처음 열었는데 아무것도 없으면, 초대 코드로 이어받게 돕는다 */
    if(this.standalone()) setTimeout(() => this._offerHandoff(), 1200);
    else setTimeout(() => this._maybeBanner(), 2600);
  },

  /* 배너는 한 번 닫으면 다시 조르지 않는다 */
  _maybeBanner(){
    if(this.dismissed() || !this.available()) return;
    if(App.state && !App.state.onboarded) return;      // 온보딩 중에는 방해하지 않는다
    this.showBanner();
  },

  showBanner(){
    if(this._bannerEl) return;
    const phone = document.getElementById('phone') || document.body;
    const el = document.createElement('div');
    el.className = 'in-banner';
    el.innerHTML = `
      <span class="in-ico">${this._markSVG(22)}</span>
      <span class="in-tx">
        <b>홈 화면에 앱으로 두기</b>
        <small>${this.canInstall() ? '한 번만 누르면 끝나요' : '아이콘을 눌러 바로 열 수 있어요'}</small>
      </span>
      <button class="in-go" id="inGo">${this.canInstall() ? '추가' : '방법 보기'}</button>
      <button class="in-x" id="inX" aria-label="닫기">×</button>`;
    phone.appendChild(el);
    this._bannerEl = el;
    requestAnimationFrame(() => el.classList.add('on'));
    el.querySelector('#inGo').onclick = () => this.start();
    el.querySelector('#inX').onclick = () => { this._dismiss(); this.hideBanner(); };
  },
  hideBanner(){
    const el = this._bannerEl;
    if(!el) return;
    this._bannerEl = null;
    el.classList.remove('on');
    setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 400);
  },

  /* ================= 설치 ================= */
  async start(){
    if(this.standalone()) return App.toast('이미 홈 화면 앱으로 쓰고 있어요');
    if(this._deferred){
      this.hideBanner();
      const e = this._deferred;
      this._deferred = null;
      try{
        e.prompt();
        const r = await e.userChoice;
        if(r && r.outcome === 'accepted') App.toast('홈 화면에 추가하는 중이에요');
        else { this._deferred = e; App.toast('언제든 메뉴에서 다시 할 수 있어요'); }
      }catch(err){ this._deferred = e; App.toast('추가하지 못했어요'); }
      App.renderDrawer && App.renderDrawer();
      return;
    }
    this.openGuide();
  },

  /* 설치 API 가 없는 환경 — 눌러야 할 자리를 그림으로 짚어준다 */
  openGuide(){
    const ios = this.isIOS(), safari = this.iosSafari();
    const body = `
      <div class="in-hero">
        <div class="in-hero-ic">${this._markSVG(40)}</div>
        <div class="in-hero-t">KUMA routine</div>
        <div class="in-hero-s">홈 화면에 두면 아이콘을 눌러 바로 열려요.<br>
          주소창 없이 앱처럼 쓰입니다.</div>
      </div>
      ${(ios && !safari) ? `
        <div class="panel" style="padding:13px 15px;margin-bottom:14px;background:var(--orange-s)">
          <div style="font-size:12.5px;font-weight:800;color:var(--orange);line-height:1.6">
            지금 브라우저에서는 추가할 수 없어요<br>
            <span style="font-weight:700;color:var(--ink2)">
              아이폰은 <b>사파리</b>에서만 홈 화면에 추가할 수 있습니다.
              아래 주소를 복사해 사파리에서 열어 주세요.</span>
          </div>
        </div>
        <button class="btn full" id="inCopyUrl">앱 주소 복사하기</button>
      ` : ios ? `
        <div class="in-steps">
          <div class="in-step">
            <span class="in-num">1</span>
            <span class="in-step-tx">아래쪽 <b>공유 버튼</b>을 누르세요</span>
            <span class="in-shot">${this._shareSVG()}</span>
          </div>
          <div class="in-step">
            <span class="in-num">2</span>
            <span class="in-step-tx">목록을 내려 <b>홈 화면에 추가</b>를 누르세요</span>
            <span class="in-shot">${this._plusSVG()}</span>
          </div>
          <div class="in-step">
            <span class="in-num">3</span>
            <span class="in-step-tx">오른쪽 위 <b>추가</b>를 누르면 끝!</span>
          </div>
        </div>
        <p style="margin:14px 2px 0;font-size:11.5px;font-weight:700;color:var(--muted);line-height:1.65">
          아이폰은 앱이 대신 눌러줄 수 없어요. 애플이 막아둔 부분이라
          이 세 번은 직접 눌러 주셔야 합니다.
        </p>
      ` : `
        <div class="in-steps">
          <div class="in-step">
            <span class="in-num">1</span>
            <span class="in-step-tx">주소창 오른쪽 <b>⋮ 메뉴</b>를 누르세요</span>
          </div>
          <div class="in-step">
            <span class="in-num">2</span>
            <span class="in-step-tx"><b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 누르세요</span>
          </div>
        </div>
      `}`;

    App.sheet('홈 화면에 추가하기', body,
      `<button class="btn line full" id="inC">닫기</button>`, (b, f) => {
      f.querySelector('#inC').onclick = () => App.closeSheet();
      const cp = b.querySelector('#inCopyUrl');
      if(cp) cp.onclick = () => {
        const u = App.appUrl();
        if(navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(u).then(() => App.toast('주소를 복사했어요 · 사파리에 붙여넣어 주세요'))
            .catch(() => App.toast('복사에 실패했어요'));
        else App.toast('복사에 실패했어요');
      };
    });
  },

  /* ================= 설치 직후 이어받기 =================
     홈 화면 앱은 브라우저와 저장 공간이 갈린다. 빈 화면으로 시작하는 대신
     "받은 초대 코드가 있나요?" 를 먼저 물어 한 번에 이어붙인다. */
  _offerHandoff(){
    if(!App.state || App.hasAnyData()) return;
    if(window.ModSync && ModSync.enabled && ModSync.enabled()) return;
    if(!(window.ModSync && ModSync.configured && ModSync.configured())) return;
    try{ if(localStorage.getItem('kuma.handoff')==='1') return; }catch(e){}
    try{ localStorage.setItem('kuma.handoff','1'); }catch(e){}

    App.sheet('앱으로 열었어요 🎉', `
      <p style="margin:0 0 16px;font-size:13.5px;font-weight:600;color:var(--ink2);line-height:1.75">
        브라우저에서 쓰던 내용은 <b>따로 저장</b>돼요.<br>
        받은 <b>초대 코드</b>를 한 번만 넣으면 그대로 이어집니다.
      </p>
      <div class="field">
        <input class="inp" id="hoCode" placeholder="ABCD-1234" maxlength="9"
          style="text-align:center;letter-spacing:.14em;font-family:'SFMono-Regular',Menlo,monospace;text-transform:uppercase">
      </div>
      <button class="btn line full" id="hoPaste">붙여넣기</button>`,
      `<button class="btn line" id="hoSkip" style="flex:0 0 96px">나중에</button>
       <button class="btn full" id="hoGo">이어받기</button>`, (b, f) => {
      const inp = b.querySelector('#hoCode');
      f.querySelector('#hoSkip').onclick = () => App.closeSheet();
      b.querySelector('#hoPaste').onclick = async () => {
        try{
          const t = await navigator.clipboard.readText();
          const m = String(t||'').toUpperCase().match(/[A-Z0-9]{4}-[A-Z0-9]{4}/);
          if(m){ inp.value = m[0]; App.toast('붙여넣었어요'); }
          else App.toast('복사된 초대 코드를 찾지 못했어요');
        }catch(e){ App.toast('붙여넣기를 쓸 수 없어요 · 직접 입력해 주세요'); }
      };
      const go = f.querySelector('#hoGo');
      go.onclick = async () => {
        const v = (inp.value || '').trim();
        if(!v) return App.toast('초대 코드를 넣어 주세요');
        go.textContent = '확인하는 중…'; go.disabled = true;
        try{
          const inv = await ModSync.peekInvite(v);
          App.closeSheet();
          setTimeout(() => ModSync.openInvite(inv), 260);
        }catch(e){
          go.textContent = '이어받기'; go.disabled = false;
          App.toast(e.message || '확인하지 못했어요');
        }
      };
    });
  },

  /* ================= 아이콘 ================= */
  _markSVG(size){
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none"
      style="color:var(--indigo)" aria-hidden="true">
      <circle cx="12.6" cy="12.6" r="5.4" stroke="currentColor" stroke-width="3"/>
      <circle cx="35.4" cy="12.6" r="5.4" stroke="currentColor" stroke-width="3"/>
      <path d="M36.69 22.88 A13.5 13.5 0 1 1 30.75 15.81" stroke="currentColor" stroke-width="3.4"
        fill="none" stroke-linecap="round"/>
      <circle cx="30.75" cy="15.81" r="2.2" fill="currentColor"/>
      <path d="M24 20.6 V27.6 L28.9 30.4" stroke="currentColor" stroke-width="2.9"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },
  /* iOS 공유 아이콘 — 사용자가 화면에서 찾아야 할 바로 그 모양 */
  _shareSVG(){
    return `<svg width="22" height="26" viewBox="0 0 22 26" fill="none"
      style="color:#0A84FF" aria-hidden="true">
      <path d="M11 1.6 V15.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M6.4 6.2 L11 1.6 L15.6 6.2" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M5 10.4 H3.2 A1.6 1.6 0 0 0 1.6 12 V22.6 A1.6 1.6 0 0 0 3.2 24.2 H18.8
        A1.6 1.6 0 0 0 20.4 22.6 V12 A1.6 1.6 0 0 0 18.8 10.4 H17"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>`;
  },
  _plusSVG(){
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      style="color:#0A84FF" aria-hidden="true">
      <rect x="1.4" y="1.4" width="21.2" height="21.2" rx="5.6"
        stroke="currentColor" stroke-width="2"/>
      <path d="M12 7.2 V16.8 M7.2 12 H16.8" stroke="currentColor" stroke-width="2"
        stroke-linecap="round"/>
    </svg>`;
  }
};

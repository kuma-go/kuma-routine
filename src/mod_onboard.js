window.ModOnboard = {
  css: `
    /* ---- 루트 ---- */
    .ob-root{ position:absolute; inset:0; z-index:300; background:var(--bg); overflow:hidden; }
    .ob-root.ob-root-out{ animation:ob-root-fade .26s ease forwards; }
    @keyframes ob-root-fade{ to{ opacity:0; } }

    /* ---- 스플래시 ---- */
    .ob-splash{
      position:absolute; inset:0; z-index:2; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:16px; overflow:hidden;
      background:linear-gradient(165deg,#4B3FD4 0%,#4437C9 45%,#2C2490 100%);
    }
    .ob-splash.ob-out{ animation:ob-splash-out .35s cubic-bezier(.4,0,1,1) forwards; }
    @keyframes ob-splash-out{
      0%{ opacity:1; transform:scale(1); }
      55%{ opacity:1; transform:scale(1.06); }
      100%{ opacity:0; transform:scale(1.06); }
    }
    .ob-splash-mark-wrap{ color:#fff; filter:drop-shadow(0 8px 20px rgba(15,8,70,.38)); }
    .ob-splash-word{ display:flex; align-items:baseline; gap:5px; opacity:0; transform:translateY(6px);
      animation:ob-fade-up .36s cubic-bezier(.22,1,.36,1) .52s forwards; }
    .ob-splash-word b{ font-size:28px; font-weight:800; letter-spacing:.12em; color:#fff; }
    .ob-splash-word span{ font-size:18px; font-weight:600; color:rgba(255,255,255,.86); letter-spacing:-.01em; }
    .ob-splash-tag{
      position:absolute; left:0; right:0; bottom:calc(34px + env(safe-area-inset-bottom)); text-align:center;
      font-size:11.5px; font-weight:700; letter-spacing:.01em; color:rgba(255,255,255,.62);
      opacity:0; animation:ob-fade-up .3s ease .7s forwards;
    }
    @keyframes ob-fade-up{ to{ opacity:1; transform:translateY(0); } }

    /* 마크 드로잉 */
    .ob-splash-mark .ob-hand{ stroke-dasharray:13; stroke-dashoffset:13; animation:ob-draw .26s cubic-bezier(.4,0,.2,1) .46s forwards; }
    .ob-splash-mark .ob-ear{ stroke-dasharray:34; stroke-dashoffset:34; animation:ob-draw .3s cubic-bezier(.4,0,.2,1) forwards; }
    .ob-splash-mark .ob-ear.ob-l{ animation-delay:.02s; }
    .ob-splash-mark .ob-ear.ob-r{ animation-delay:.09s; }
    .ob-splash-mark .ob-ring{ stroke-dasharray:76; stroke-dashoffset:76; animation:ob-draw .32s cubic-bezier(.4,0,.2,1) .17s forwards; }
    .ob-splash-mark .ob-dot{ opacity:0; transform:scale(0); transform-origin:30.75px 15.81px;
      animation:ob-dot-pop .2s cubic-bezier(.34,1.56,.64,1) .46s forwards; }
    @keyframes ob-draw{ to{ stroke-dashoffset:0; } }
    @keyframes ob-dot-pop{ to{ opacity:1; transform:scale(1); } }

    /* ---- 온보딩 플로우 ---- */
    .ob-flow{ position:absolute; inset:0; z-index:1; display:flex; flex-direction:column; background:var(--bg); }
    .ob-progress{ flex:0 0 auto; display:flex; gap:6px; padding:calc(22px + env(safe-area-inset-top)) 22px 0;
      opacity:1; transition:opacity .2s ease; }
    .ob-progress.ob-hide{ opacity:0; pointer-events:none; }
    .ob-progress i{ flex:1; height:4px; border-radius:3px; background:#E3E3EC; overflow:hidden; position:relative; }
    .ob-progress i b{ position:absolute; inset:0; background:var(--orange); border-radius:3px;
      transform:scaleX(0); transform-origin:left; transition:transform .32s cubic-bezier(.22,1,.36,1); }
    .ob-progress i.on b{ transform:scaleX(1); }

    .ob-viewport{ flex:1; overflow:hidden; position:relative; }
    .ob-track{ display:flex; width:400%; height:100%; transition:transform .34s cubic-bezier(.22,1,.36,1); }
    .ob-slide{ width:25%; flex:0 0 25%; display:flex; flex-direction:column; align-items:center;
      justify-content:center; padding:8px 30px 40px; text-align:center; overflow-y:auto; }

    .ob-illust{ width:100%; height:220px; display:flex; align-items:center; justify-content:center; position:relative; margin:6px 0 22px; }
    .ob-title{ font-size:22px; font-weight:800; color:var(--ink); letter-spacing:-.02em; line-height:1.35; margin-bottom:10px; }
    .ob-desc{ font-size:14px; font-weight:600; color:var(--ink2); line-height:1.6; }

    .ob-foot{ flex:0 0 auto; display:flex; align-items:center; justify-content:space-between;
      padding:14px 22px calc(20px + env(safe-area-inset-bottom)); transition:opacity .2s ease; }
    .ob-foot.ob-hide{ opacity:0; pointer-events:none; }
    .ob-skip{ font-size:14px; font-weight:700; color:var(--muted); padding:11px 8px; }
    .ob-next{ min-width:128px; }

    /* ---- 스텝1: 타임테이블 카드 스택 ---- */
    .ob-i1{ position:relative; width:190px; height:210px; }
    .ob-i1-stack{ position:absolute; left:50%; top:12px; transform:translateX(-50%); width:154px; display:flex; flex-direction:column; }
    .ob-i1-card{ height:52px; border-radius:16px; background:var(--c,#DCC9A2); box-shadow:var(--sh-1); margin-top:-14px; }
    .ob-i1-card:first-child{ margin-top:0; }
    .ob-i1-line{ position:absolute; left:2px; right:2px; top:0; height:3px; border-radius:2px; background:var(--orange);
      box-shadow:0 0 12px rgba(255,90,0,.55); }
    .ob-i1.ob-run .ob-i1-line{ animation:ob-i1-line-move 3.2s linear infinite; }
    .ob-i1.ob-run .ob-i1-card:nth-child(1){ animation:ob-i1-pulse-a 3.2s ease-in-out infinite; }
    .ob-i1.ob-run .ob-i1-card:nth-child(2){ animation:ob-i1-pulse-b 3.2s ease-in-out infinite; }
    .ob-i1.ob-run .ob-i1-card:nth-child(3){ animation:ob-i1-pulse-c 3.2s ease-in-out infinite; }
    .ob-i1.ob-run .ob-i1-card:nth-child(4){ animation:ob-i1-pulse-d 3.2s ease-in-out infinite; }
    @keyframes ob-i1-line-move{ 0%{ transform:translateY(0); } 100%{ transform:translateY(202px); } }
    @keyframes ob-i1-pulse-a{ 0%,8%,20%,100%{ transform:scale(1); } 14%{ transform:scale(1.07); } }
    @keyframes ob-i1-pulse-b{ 0%,27%,39%,100%{ transform:scale(1); } 33%{ transform:scale(1.07); } }
    @keyframes ob-i1-pulse-c{ 0%,45%,57%,100%{ transform:scale(1); } 51%{ transform:scale(1.07); } }
    @keyframes ob-i1-pulse-d{ 0%,63%,75%,100%{ transform:scale(1); } 69%{ transform:scale(1.07); } }

    /* ---- 스텝2: 준비물 칩 ---- */
    .ob-i2{ width:226px; }
    .ob-i2-card{ background:#7B96EF; border-radius:22px; padding:18px 18px 20px; color:#fff; box-shadow:var(--sh-2); }
    .ob-i2.ob-run .ob-i2-card{ animation:ob-i2-card-open 2.6s cubic-bezier(.22,1,.36,1) infinite; }
    @keyframes ob-i2-card-open{ 0%{ transform:scale(.97); } 12%{ transform:scale(1); } 100%{ transform:scale(1); } }
    .ob-i2-head{ display:flex; align-items:center; gap:7px; font-size:15px; font-weight:800; margin-bottom:13px; }
    .ob-i2-head i{ width:7px; height:7px; border-radius:50%; background:#fff; opacity:.8; display:inline-block; }
    .ob-i2-chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .ob-i2-chip{ background:rgba(255,255,255,.94); color:#1B2E75; font-size:12.5px; font-weight:800;
      padding:7px 12px; border-radius:12px; opacity:0; transform:translateY(10px) scale(.7); }
    .ob-i2.ob-run .ob-i2-chip:nth-child(1){ animation:ob-i2-pop 2.6s cubic-bezier(.34,1.56,.64,1) infinite; }
    .ob-i2.ob-run .ob-i2-chip:nth-child(2){ animation:ob-i2-pop 2.6s cubic-bezier(.34,1.56,.64,1) .18s infinite; }
    .ob-i2.ob-run .ob-i2-chip:nth-child(3){ animation:ob-i2-pop 2.6s cubic-bezier(.34,1.56,.64,1) .36s infinite; }
    @keyframes ob-i2-pop{
      0%{ opacity:0; transform:translateY(10px) scale(.7); }
      18%{ opacity:1; transform:translateY(0) scale(1.1); }
      28%{ transform:translateY(0) scale(1); }
      80%{ opacity:1; transform:translateY(0) scale(1); }
      92%{ opacity:0; transform:translateY(-5px) scale(.85); }
      100%{ opacity:0; transform:translateY(10px) scale(.7); }
    }

    /* ---- 스텝3: 코인 -> 선물 ---- */
    .ob-i3{ position:relative; width:200px; height:216px; }
    .ob-i3-confetti{ position:absolute; top:6px; width:8px; height:14px; border-radius:2px; opacity:0; }
    .ob-i3-confetti.ob-c1{ left:24%; background:#FFD166; }
    .ob-i3-confetti.ob-c2{ left:58%; background:#55D2F5; }
    .ob-i3-confetti.ob-c3{ left:75%; background:#EEB6EC; }
    .ob-i3.ob-run .ob-i3-confetti{ animation:ob-i3-confetti-fall 2.8s ease-in infinite; }
    .ob-i3.ob-run .ob-i3-confetti.ob-c2{ animation-delay:.22s; }
    .ob-i3.ob-run .ob-i3-confetti.ob-c3{ animation-delay:.44s; }
    @keyframes ob-i3-confetti-fall{
      0%,55%{ opacity:0; transform:translateY(0) rotate(0deg); }
      62%{ opacity:1; }
      100%{ opacity:0; transform:translateY(168px) rotate(280deg); }
    }
    .ob-i3-coin,.ob-i3-gift{ position:absolute; left:50%; bottom:14px; transform:translateX(-50%); font-size:46px; line-height:1; }
    .ob-i3-gift{ opacity:0; }
    .ob-i3.ob-run .ob-i3-coin{ animation:ob-i3-rise 2.8s cubic-bezier(.3,.7,.4,1) infinite; }
    .ob-i3.ob-run .ob-i3-gift{ animation:ob-i3-appear 2.8s cubic-bezier(.3,.7,.4,1) infinite; }
    @keyframes ob-i3-rise{
      0%{ bottom:8px; opacity:0; transform:translateX(-50%) scale(.6) rotate(-10deg); }
      20%{ opacity:1; transform:translateX(-50%) scale(1) rotate(6deg); }
      55%{ bottom:126px; opacity:1; transform:translateX(-50%) scale(1.06) rotate(-4deg); }
      63%{ opacity:0; }
      100%{ opacity:0; }
    }
    @keyframes ob-i3-appear{
      0%,58%{ opacity:0; bottom:126px; transform:translateX(-50%) scale(.5) rotate(0deg); }
      68%{ opacity:1; transform:translateX(-50%) scale(1.16) rotate(-6deg); }
      78%{ transform:translateX(-50%) scale(1) rotate(4deg); }
      92%{ opacity:1; bottom:134px; transform:translateX(-50%) scale(1) rotate(0deg); }
      100%{ opacity:0; bottom:134px; }
    }

    /* ---- 가족 설정 화면 ---- */
    .ob-fam{ display:flex; flex-direction:column; align-items:center; padding-top:18px; width:100%; }
    .ob-fam-mark{ color:var(--indigo); margin-bottom:14px; }
    .ob-fam-title{ font-size:22px; font-weight:800; color:var(--ink); letter-spacing:-.02em; margin-bottom:8px; }
    .ob-fam-sub{ font-size:13.5px; font-weight:600; color:var(--muted); margin-bottom:26px; }
    .ob-fam-cards{ width:100%; display:flex; flex-direction:column; gap:12px; }
    .ob-fam-card{
      width:100%; display:flex; align-items:center; gap:14px; padding:18px 18px; border-radius:var(--r-l);
      background:var(--paper); box-shadow:var(--sh-1); border:1.6px solid var(--line); text-align:left;
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .2s, box-shadow .2s;
    }
    .ob-fam-card:active{ transform:scale(.97); border-color:var(--indigo); box-shadow:var(--sh-2); }
    .ob-fam-emoji{ flex:0 0 auto; width:52px; height:52px; border-radius:16px; background:var(--indigo-s);
      display:flex; align-items:center; justify-content:center; font-size:26px; }
    .ob-fam-label{ font-size:16.5px; font-weight:800; color:var(--ink); }
    .ob-fam-hint{ margin-top:22px; font-size:12px; font-weight:600; color:var(--muted); text-align:center; }
  `,

  _root: null,
  _timers: [],
  _idx: 0,
  _illustEls: [],

  init(){
    if(App.state.onboarded) return;
    this.start();
  },

  start(){
    if(this._root) return; // 이미 진행 중이면 중복 생성 방지
    this._idx = 0;
    this._illustEls = [];
    this._buildRoot();
    this._showSplash();
  },

  brandMark(size){
    return this._markSvg(size || 40, false);
  },

  _markSvg(size, animated){
    const cls = animated ? ' class="ob-splash-mark"' : '';
    return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle class="ob-ear ob-l" cx="12.6" cy="12.6" r="5.4" stroke="currentColor" stroke-width="3" fill="none"/>
      <circle class="ob-ear ob-r" cx="35.4" cy="12.6" r="5.4" stroke="currentColor" stroke-width="3" fill="none"/>
      <path class="ob-ring" d="M36.69 22.88 A13.5 13.5 0 1 1 30.75 15.81" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" fill="none"/>
      <circle class="ob-dot" cx="30.75" cy="15.81" r="2.2" fill="currentColor"/>
      <path class="ob-hand" d="M24 20.6 V27.6 L28.9 30.4" stroke="currentColor" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  },

  _buildRoot(){
    const phone = document.getElementById('phone');
    if(!phone) return;
    const root = document.createElement('div');
    root.className = 'ob-root';
    phone.appendChild(root);
    this._root = root;
  },

  _pushTimer(fn, ms){
    const id = setTimeout(fn, ms);
    this._timers.push(id);
    return id;
  },

  _clearTimers(){
    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];
  },

  _showSplash(){
    if(!this._root) return;
    const splash = document.createElement('div');
    splash.className = 'ob-splash';
    splash.innerHTML = `
      <div class="ob-splash-mark-wrap">${this._markSvg(84, true)}</div>
      <div class="ob-splash-word"><b>KUMA</b><span>routine</span></div>
      <div class="ob-splash-tag">우리 가족의 하루를 한 장에</div>
    `;
    this._root.appendChild(splash);

    this._pushTimer(() => { splash.classList.add('ob-out'); }, 1250);
    this._pushTimer(() => {
      if(splash.parentNode) splash.parentNode.removeChild(splash);
      this._showFlow();
    }, 1600);
  },

  _steps: [
    {
      title: '하루가 카드로 흘러가요',
      desc: '오늘 할 일들이 시간 순서대로<br>카드가 되어 차곡차곡 쌓여요',
      illustClass: 'ob-i1',
      illustHtml: `
        <div class="ob-i1-stack">
          <div class="ob-i1-card" style="--c:#DCC9A2"></div>
          <div class="ob-i1-card" style="--c:#7B96EF"></div>
          <div class="ob-i1-card" style="--c:#B6DD6E"></div>
          <div class="ob-i1-card" style="--c:#EEB6EC"></div>
        </div>
        <div class="ob-i1-line"></div>
      `
    },
    {
      title: '준비물까지 챙겨줘요',
      desc: '일정 카드를 열면 오늘 필요한<br>준비물을 하나하나 알려줘요',
      illustClass: 'ob-i2',
      illustHtml: `
        <div class="ob-i2-card">
          <div class="ob-i2-head"><i></i>15:30 태권도</div>
          <div class="ob-i2-chips">
            <span class="ob-i2-chip">🥋 도복</span>
            <span class="ob-i2-chip">🎗 띠</span>
            <span class="ob-i2-chip">💧 물통</span>
          </div>
        </div>
      `
    },
    {
      title: '다 하면 진짜 보상이 와요',
      desc: '할 일을 끝내고 모은 코인은<br>진짜 선물로 바꿀 수 있어요',
      illustClass: 'ob-i3',
      illustHtml: `
        <div class="ob-i3-confetti ob-c1"></div>
        <div class="ob-i3-confetti ob-c2"></div>
        <div class="ob-i3-confetti ob-c3"></div>
        <div class="ob-i3-coin">🪙</div>
        <div class="ob-i3-gift">🎁</div>
      `
    }
  ],

  _showFlow(){
    if(!this._root) return;
    const flow = document.createElement('div');
    flow.className = 'ob-flow';

    const stepSlides = this._steps.map(st => `
      <div class="ob-slide">
        <div class="ob-illust ${st.illustClass}">${st.illustHtml}</div>
        <div class="ob-title">${st.title}</div>
        <div class="ob-desc">${st.desc}</div>
      </div>
    `).join('');

    const famSlide = `
      <div class="ob-slide">
        <div class="ob-fam">
          <div class="ob-fam-mark">${this.brandMark(44)}</div>
          <div class="ob-fam-title">누가 쓰나요?</div>
          <div class="ob-fam-sub">고른 모습으로 하루를 보여드려요</div>
          <div class="ob-fam-cards">
            <button type="button" class="ob-fam-card" data-role="child">
              <span class="ob-fam-emoji">🐣</span><span class="ob-fam-label">아이로 시작</span>
            </button>
            <button type="button" class="ob-fam-card" data-role="master">
              <span class="ob-fam-emoji">🌷</span><span class="ob-fam-label">부모로 시작</span>
            </button>
          </div>
          <div class="ob-fam-hint">나중에 메뉴에서 언제든 바꿀 수 있어요</div>
        </div>
      </div>
    `;

    flow.innerHTML = `
      <div class="ob-progress" id="obProgress"><i><b></b></i><i><b></b></i><i><b></b></i></div>
      <div class="ob-viewport">
        <div class="ob-track" id="obTrack">${stepSlides}${famSlide}</div>
      </div>
      <div class="ob-foot" id="obFoot">
        <button type="button" class="ob-skip" id="obSkip">건너뛰기</button>
        <button type="button" class="btn ob-next" id="obNext">다음</button>
      </div>
    `;

    this._root.appendChild(flow);
    this._flow = flow;
    this._illustEls = flow.querySelectorAll('.ob-slide .ob-illust');
    this._track = flow.querySelector('#obTrack');
    this._progress = flow.querySelectorAll('#obProgress i');
    this._footEl = flow.querySelector('#obFoot');
    this._progressEl = flow.querySelector('#obProgress');

    this._bindFlow(flow);
    this._goStep(0);
  },

  _bindFlow(flow){
    flow.querySelector('#obSkip').addEventListener('click', () => this._finish(null));
    flow.querySelector('#obNext').addEventListener('click', () => {
      if(this._idx < 2) this._goStep(this._idx + 1);
      else this._goStep(3);
    });
    flow.querySelectorAll('.ob-fam-card').forEach(btn => {
      btn.addEventListener('click', () => {
        if(App.haptic) App.haptic();
        this._finish(btn.dataset.role);
      });
    });

    let x0 = null, y0 = null;
    const vp = flow.querySelector('.ob-viewport');
    vp.addEventListener('touchstart', e => {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    vp.addEventListener('touchend', e => {
      if(x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if(Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6){
        if(dx < 0 && this._idx < 3) this._goStep(this._idx + 1);
        else if(dx > 0 && this._idx > 0) this._goStep(this._idx - 1);
      }
      x0 = null;
    }, { passive: true });
  },

  _goStep(idx){
    idx = Math.max(0, Math.min(3, idx));
    this._idx = idx;

    if(this._track) this._track.style.transform = `translateX(-${idx * 25}%)`;

    if(this._progress){
      this._progress.forEach((el, i) => el.classList.toggle('on', i === idx));
    }
    if(this._progressEl) this._progressEl.classList.toggle('ob-hide', idx === 3);
    if(this._footEl) this._footEl.classList.toggle('ob-hide', idx === 3);

    const nextBtn = this._flow && this._flow.querySelector('#obNext');
    if(nextBtn) nextBtn.textContent = idx === 2 ? '시작하기' : '다음';

    // 현재 스텝 애니메이션만 재시작(클래스 토글) 하고 나머지는 멈춤
    if(this._illustEls){
      this._illustEls.forEach((el, i) => {
        el.classList.remove('ob-run');
        if(i === idx){
          void el.offsetWidth; // reflow로 애니메이션 재시작
          el.classList.add('ob-run');
        }
      });
    }
  },

  _finish(role){
    if(role) App.state.role = role;
    App.state.onboarded = true;
    App.save();
    this._clearTimers();

    const root = this._root;
    if(root){
      root.classList.add('ob-root-out');
      this._pushTimer(() => {
        if(root.parentNode) root.parentNode.removeChild(root);
        if(this._root === root) this._root = null;
        this._flow = null; this._track = null; this._progress = null;
        this._illustEls = []; this._footEl = null; this._progressEl = null;
        App.render();
      }, 260);
    } else {
      App.render();
    }
  }
};

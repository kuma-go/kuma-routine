/**
 * ModWatch — 갤럭시 워치용 읽기 전용 화면  (?watch=1)
 *
 * Wear OS 는 PWA 설치를 지원하지 않는다. 그래서 설치하는 대신
 * Samsung Internet for Wear OS 로 여는 "가벼운 한 장"을 따로 둔다.
 *
 *   · 폰 레이아웃(390px)을 쓰지 않는다. 원형 화면에 맞춘 별도 DOM 을 통째로 그린다
 *   · 읽기만 한다. 추가·수정·삭제·동기화 쓰기를 일절 하지 않는다
 *   · 초대 코드를 한 번 넣으면 그 뒤로는 열 때마다 알아서 받아온다
 */
window.ModWatch = {
  /* 주소에 ?watch=1 이 있거나, 한 번 켠 기기라면 계속 워치 모드 */
  active(){
    try{
      if(/[?&]watch=1/.test(location.search)){ localStorage.setItem('kuma.watch','1'); return true; }
      if(/[?&]watch=0/.test(location.search)){ localStorage.removeItem('kuma.watch'); return false; }
      return localStorage.getItem('kuma.watch') === '1';
    }catch(e){ return /[?&]watch=1/.test(location.search); }
  },

  css: `
    body.wt{ background:#000; margin:0; display:block; }
    body.wt #phone, body.wt .scrim, body.wt #sheet, body.wt #drawer, body.wt #toast{ display:none !important; }
    .wt-root{
      position:fixed; inset:0; background:#000; color:#fff; overflow-y:auto;
      -webkit-overflow-scrolling:touch; overscroll-behavior:contain;
      font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
      /* 원형 화면은 가장자리가 잘린다 — 위아래를 넉넉히 비운다 */
      padding:14% 9% 16%;
      box-sizing:border-box; text-align:center;
    }
    .wt-top{ font-size:13px; font-weight:800; color:#8E8EA8; letter-spacing:.02em; }
    .wt-name{ color:#B7AEFF; }
    .wt-now{ font-size:12px; font-weight:700; color:#6E6E86; margin-top:2px; }
    .wt-fresh{ font-size:10.5px; font-weight:700; color:#4E4E60; margin-top:3px; letter-spacing:.02em; }
    .wt-fresh.err{ color:#FF9A4D; }

    .wt-card{
      margin:13px 0; padding:15px 14px; border-radius:20px; background:#16161E;
      border:1px solid #26262F; text-align:left;
    }
    .wt-card.next{ background:#1B1636; border-color:#4B3FD4; }
    .wt-card.now{ background:#2A1508; border-color:#FF6A00; }
    .wt-badge{
      display:inline-block; font-size:11px; font-weight:800; letter-spacing:.04em;
      padding:3px 9px; border-radius:9px; margin-bottom:7px;
    }
    .wt-card.next .wt-badge{ background:#4B3FD4; color:#fff; }
    .wt-card.now  .wt-badge{ background:#FF6A00; color:#fff; }
    .wt-time{ font-size:26px; font-weight:800; line-height:1.1; letter-spacing:-.01em; }
    .wt-title{ font-size:17px; font-weight:800; margin-top:3px; line-height:1.3; word-break:keep-all; }
    .wt-memo{ font-size:13px; font-weight:600; color:#A0A0B8; margin-top:6px; line-height:1.5; word-break:keep-all; }

    .wt-items{ display:flex; flex-wrap:wrap; gap:5px; margin-top:9px; }
    .wt-item{
      font-size:13px; font-weight:800; padding:6px 11px; border-radius:11px;
      background:#2A2A36; color:#E6E6F0;
    }
    .wt-item.ok{ background:#1E4D35; color:#7FE0A8; }
    .wt-item.ok::before{ content:'✓ '; }
    .wt-prep-t{ font-size:11.5px; font-weight:800; color:#6E6E86; margin-top:11px; letter-spacing:.03em; }

    .wt-rest{ margin-top:16px; }
    .wt-row{
      display:flex; align-items:baseline; gap:9px; padding:9px 2px;
      border-top:1px solid #1E1E27; text-align:left;
    }
    .wt-row b{ font-size:14px; font-weight:800; color:#8E8EA8; flex:0 0 52px; font-variant-numeric:tabular-nums; }
    .wt-row span{ font-size:15px; font-weight:700; flex:1; min-width:0; word-break:keep-all; }
    .wt-row.done b, .wt-row.done span{ color:#4E4E60; text-decoration:line-through; }
    .wt-row .wt-dot{ flex:0 0 auto; font-size:11px; color:#FF9A4D; }

    .wt-empty{ margin-top:22%; font-size:15px; font-weight:700; color:#6E6E86; line-height:1.7; }
    .wt-foot{ margin-top:18px; font-size:11px; font-weight:700; color:#4E4E60; line-height:1.7; }
    .wt-btn{
      display:block; width:100%; margin-top:11px; padding:13px 0; border:0; border-radius:16px;
      background:#4B3FD4; color:#fff; font-size:14px; font-weight:800; cursor:pointer;
    }
    .wt-btn.line{ background:transparent; border:1.5px solid #33333F; color:#8E8EA8; }
    .wt-inp{
      width:100%; box-sizing:border-box; margin-top:11px; padding:12px 10px; border-radius:14px;
      border:1.5px solid #33333F; background:#16161E; color:#fff; text-align:center;
      font-size:17px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
    }
  `,

  init(){
    if(!this.active()) return;
    document.body.classList.add('wt');
    const el = document.createElement('div');
    el.className = 'wt-root'; el.id = 'wtRoot';
    document.body.appendChild(el);
    this._root = el;
    this.render();
    /* 1분마다 다시 그린다 — 시간이 지나면 "다음 일정"이 바뀐다 */
    clearInterval(this._t);
    this._t = setInterval(() => this.render(), 60000);
    this.pull();
    /* 셀룰러 단독일 때 배터리가 중요하다 — 화면이 켜져 있을 때만 받아온다.
       워치는 손목을 내리면 곧바로 hidden 이 되므로 이걸로 충분하다. */
    this._schedulePull();
    document.addEventListener('visibilitychange', () => {
      if(document.hidden){ clearInterval(this._p); this._p = null; }
      else { this.pull(); this._schedulePull(); this.render(); }
    });
  },
  _schedulePull(){
    clearInterval(this._p);
    this._p = setInterval(() => { if(!document.hidden) this.pull(); }, 120000);
  },

  /* 읽기만 한다 — 워치에서 올리는 일은 없다 */
  async pull(){
    const S = window.ModSync;
    if(!S || !S.configured || !S.configured()) return;
    const code = (App.state.sync || {}).group;
    if(!code) return;
    try{
      await S._auth();
      const r = await fetch(S._url('/groups/' + code + '/state'));
      if(!r.ok) return;
      const st = await r.json();
      if(!st) return;
      const s = App.state;
      if(st.members) s.members = st.members;
      if(st.schedules) s.schedules = st.schedules;
      if(st.todos) s.todos = st.todos;
      if(st.doneEv) s.doneEv = st.doneEv;
      if(st.weekAnchor) s.weekAnchor = st.weekAnchor;
      if(st.hiddenNext) s.hiddenNext = st.hiddenNext;
      const byUid = (s.members||[]).find(m => m.uid && m.uid === S._uid);
      if(byUid) s.meId = byUid.id;
      App.rollWeeks(); App.migrate();
      this._seen = Date.now(); this._netErr = false;
      try{ localStorage.setItem('haruk', JSON.stringify(s)); localStorage.setItem('kuma.watch.seen', String(this._seen)); }catch(e){}
      this.render();
    }catch(e){
      /* 못 받아도 마지막으로 본 내용을 그대로 보여준다 — 언제 기준인지만 알린다 */
      this._netErr = true; this.render();
    }
  },

  /* 마지막으로 받아온 시점 — 손목에서 "이거 최신인가?" 를 알 수 있게 */
  _fresh(){
    let at = this._seen;
    if(!at){ try{ at = +localStorage.getItem('kuma.watch.seen') || 0; }catch(e){ at = 0; } }
    if(!at) return this._netErr ? '연결 안 됨' : '';
    const m = Math.floor((Date.now() - at) / 60000);
    const ago = m < 1 ? '방금' : (m < 60 ? m + '분 전' : Math.floor(m/60) + '시간 전');
    return this._netErr ? ('연결 안 됨 · ' + ago) : ago;
  },

  _hhmm(t){ return String(t||'').replace(/^0/,''); },
  _min(t){ const [h,m] = String(t||'0:0').split(':').map(Number); return (h||0)*60 + (m||0); },

  render(){
    const el = this._root;
    if(!el) return;
    App.week = 0;
    App.day = new Date().getDay();

    if(!(App.state.sync||{}).group && window.ModSync && ModSync.configured && ModSync.configured()){
      return this.renderPair(el);
    }

    const me = App.me() || {};
    const now = App.nowMin();
    const list = App.evs(App.day, 0)
      .filter(e => App.canSee(e))
      .slice().sort((a,b) => this._min(a.s) - this._min(b.s));

    if(!list.length){
      el.innerHTML = `
        <div class="wt-top">${esc(me.emoji||'')} <span class="wt-name">${esc(me.name||'')}</span></div>
        <div class="wt-empty">오늘은 일정이 없어요<br>푹 쉬어요 🌙</div>`;
      return;
    }

    /* 지금 진행 중인 것이 있으면 그것을, 없으면 다음 것을 크게 */
    const cur  = list.find(e => this._min(e.s) <= now && now < this._min(e.e));
    const next = cur || list.find(e => this._min(e.s) > now);
    const hero = next || list[list.length - 1];
    const heroNow = !!cur;

    const items = (hero.items||[]).map(x =>
      `<span class="wt-item ${App.isPacked&&App.isPacked(hero.id,x)?'ok':''}">${esc(x)}</span>`).join('');

    const rest = list.filter(e => e !== hero).map(e => {
      const past = this._min(e.e) <= now;
      return `<div class="wt-row ${past?'done':''}">
        <b>${esc(this._hhmm(e.s))}</b>
        <span>${esc(e.t)}</span>
        ${(e.items&&e.items.length)?`<i class="wt-dot">🎒</i>`:''}
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="wt-top">${esc(me.emoji||'')} <span class="wt-name">${esc(me.name||'')}</span></div>
      <div class="wt-now">${['일','월','화','수','목','금','토'][App.day]}요일 · ${esc(this._hhmm(typeof toStr==='function'?toStr(now):''))}</div>
      ${this._fresh()?`<div class="wt-fresh ${this._netErr?'err':''}">${esc(this._fresh())}</div>`:''}

      <div class="wt-card ${heroNow?'now':'next'}">
        <span class="wt-badge">${heroNow?'지금':'다음'}</span>
        <div class="wt-time">${esc(this._hhmm(hero.s))}</div>
        <div class="wt-title">${esc(hero.t)}</div>
        ${hero.memo?`<div class="wt-memo">${esc(hero.memo)}</div>`:''}
        ${items?`<div class="wt-prep-t">준비물</div><div class="wt-items">${items}</div>`:''}
      </div>

      ${rest?`<div class="wt-rest">${rest}</div>`:''}
      <div class="wt-foot">폰에서 고칠 수 있어요<br>손목에서는 보기만 합니다</div>`;
  },

  /* 폰에서 여는 안내 — 워치에 어떻게 띄우는지 */
  watchUrl(){ return App.appUrl() + '?watch=1'; },
  openInfo(){
    const u = this.watchUrl();
    App.sheet('갤럭시 워치에서 보기', `
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.75">
        워치에는 앱을 설치할 수 없지만, <b>주소를 열어 보기만</b> 할 수 있어요.<br>
        오늘 일정과 준비물이 큰 글씨로 뜹니다.
      </p>
      <div class="in-steps">
        <div class="in-step"><span class="in-num">1</span>
          <span class="in-step-tx">워치에 <b>Samsung Internet</b> 을 설치하세요<br>
            <small style="color:var(--muted)">갤럭시 스토어 · 워치용 브라우저</small></span></div>
        <div class="in-step"><span class="in-num">2</span>
          <span class="in-step-tx">아래 주소를 워치 브라우저에 넣고 <b>즐겨찾기</b> 하세요</span></div>
        <div class="in-step"><span class="in-num">3</span>
          <span class="in-step-tx">처음 한 번 <b>초대 코드</b>를 넣으면 끝이에요</span></div>
      </div>
      <div class="sy-code" style="font-size:12px;letter-spacing:0;height:auto;padding:13px 10px;margin-top:14px;word-break:break-all">${esc(u)}</div>
      <button class="btn full" id="wtCopy">주소 복사하기</button>
      <div class="panel" style="padding:13px 15px;margin-top:14px">
        <div style="font-size:12.5px;font-weight:800;color:var(--ink);margin-bottom:6px">셀룰러 단독으로 쓸 때</div>
        <div style="font-size:12px;font-weight:700;color:var(--ink2);line-height:1.7">
          <b style="color:#1E7A50">○ 이 화면은 됩니다</b> — 워치가 직접 인터넷에 붙어 받아옵니다. 폰이 꺼져 있어도 열려요.<br>
          <b style="color:#C43F00">× 알림은 안 됩니다</b> — 폰 알림을 손목에 비추는 방식이라 폰이 곁에 있어야 합니다.
        </div>
      </div>
      <p class="sy-note">
        워치는 <b>보기 전용</b>이에요. 손목에서 고치거나 지울 수 없고,
        가족의 자리를 차지하지도 않습니다.<br>
        화면 위에 <b>언제 기준인지</b>가 작게 뜨니, 신호가 없을 땐 그걸 보고 판단하세요.<br>
        주소·코드 입력이 번거로우면 워치 브라우저의 <b>음성 입력</b>을 쓰면 빠릅니다.
      </p>`,
      `<button class="btn line full" id="wtC">닫기</button>`, (b,f) => {
      f.querySelector('#wtC').onclick = () => App.closeSheet();
      b.querySelector('#wtCopy').onclick = () => {
        if(navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(u).then(() => App.toast('주소를 복사했어요'))
            .catch(() => App.toast('복사에 실패했어요'));
        else App.toast('복사에 실패했어요');
      };
    });
  },

  /* 워치를 처음 열었을 때 — 초대 코드 한 번만 받는다 */
  renderPair(el){
    el.innerHTML = `
      <div class="wt-top">KUMA <span class="wt-name">routine</span></div>
      <div class="wt-empty" style="margin-top:12%">가족 초대 코드를<br>한 번만 넣어 주세요</div>
      <input class="wt-inp" id="wtCode" placeholder="ABCD-1234" maxlength="9">
      <button class="wt-btn" id="wtGo">연결하기</button>
      <div class="wt-foot">폰에서 <b>가족 초대하기</b> 로 받은 코드예요.<br>워치는 보기만 하므로 자리를 뺏지 않아요.</div>`;
    const go = el.querySelector('#wtGo');
    go.onclick = async () => {
      const v = (el.querySelector('#wtCode').value||'').trim().toUpperCase();
      if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(v)){ go.textContent = '코드를 확인해 주세요'; return; }
      go.textContent = '연결하는 중…'; go.disabled = true;
      try{
        const inv = await ModSync.peekInvite(v);
        App.state.sync.group = inv.group;
        App.state.meId = inv.member;
        try{ localStorage.setItem('haruk', JSON.stringify(App.state)); }catch(e){}
        await this.pull();
        this.render();
      }catch(e){
        go.textContent = '연결하기'; go.disabled = false;
        el.querySelector('.wt-foot').innerHTML = esc(e.message||'연결하지 못했어요');
      }
    };
  }
};

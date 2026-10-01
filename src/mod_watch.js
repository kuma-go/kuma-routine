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
    body.wt{ background:#F4F4F8; margin:0; display:block; }
    body.wt #phone, body.wt .scrim, body.wt #sheet, body.wt #drawer, body.wt #toast{ display:none !important; }
    .wt-root{
      position:fixed; inset:0; background:#F4F4F8; color:#1A1A24; overflow-y:auto;
      -webkit-overflow-scrolling:touch; overscroll-behavior:contain;
      font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
      /* 원형 화면은 가장자리가 잘린다 — 위아래를 넉넉히 비운다 */
      padding:14% 9% 16%;
      box-sizing:border-box; text-align:center;
    }
    .wt-top{
      display:inline-flex; align-items:center; gap:7px; padding:5px 4px;
      font-size:14px; font-weight:800; color:#4A4A5A; letter-spacing:.01em;
      background:none; border:0; -webkit-tap-highlight-color:transparent;
    }
    .wt-top.tap{ padding:6px 13px; border-radius:16px; background:#FFF;
      box-shadow:0 1px 4px rgba(20,20,50,.10); cursor:pointer; }
    .wt-name{ color:#4B3FD4; }
    .wt-arw{ font-size:12px; color:#A8A8BC; font-weight:800; }
    .wt-now{ font-size:12px; font-weight:700; color:#8E8EA8; margin-top:3px; }
    .wt-fresh{ font-size:10.5px; font-weight:700; color:#A8A8BC; margin-top:2px; letter-spacing:.02em; }
    .wt-fresh.err{ color:#C43F00; }

    .wt-card{
      margin:12px 0; padding:15px 14px; border-radius:20px; background:#FFF;
      border:1px solid #E8E8F0; text-align:left; box-shadow:0 2px 10px rgba(20,20,50,.06);
    }
    .wt-card.next{ background:#F2F0FF; border-color:#4B3FD4; }
    .wt-card.now{ background:#FFF1E6; border-color:#FF6A00; }
    .wt-badge{
      display:inline-block; font-size:11px; font-weight:800; letter-spacing:.04em;
      padding:3px 9px; border-radius:9px; margin-bottom:7px;
    }
    .wt-card.next .wt-badge{ background:#4B3FD4; color:#fff; }
    .wt-card.now  .wt-badge{ background:#FF6A00; color:#fff; }
    .wt-time{ font-size:27px; font-weight:800; line-height:1.1; letter-spacing:-.01em; color:#15151F; }
    .wt-title{ font-size:17.5px; font-weight:800; margin-top:3px; line-height:1.3;
      word-break:keep-all; color:#15151F; }
    .wt-memo{ font-size:13px; font-weight:600; color:#5A5A6E; margin-top:6px; line-height:1.5; word-break:keep-all; }

    .wt-items{ display:flex; flex-wrap:wrap; gap:5px; margin-top:9px; }
    .wt-item{
      font-size:13px; font-weight:800; padding:6px 11px; border-radius:11px;
      background:#EDEDF4; color:#3A3A4C;
    }
    .wt-item.ok{ background:#DFF3E7; color:#1E7A50; }
    .wt-item.ok::before{ content:'✓ '; }
    .wt-prep-t{ font-size:11.5px; font-weight:800; color:#8E8EA8; margin-top:11px; letter-spacing:.03em; }

    .wt-rest{ margin-top:14px; background:#FFF; border-radius:18px; padding:2px 13px;
      border:1px solid #E8E8F0; }
    .wt-row{
      display:flex; align-items:baseline; gap:9px; padding:10px 1px;
      border-top:1px solid #EFEFF5; text-align:left;
    }
    .wt-row:first-child{ border-top:0; }
    .wt-row b{ font-size:14px; font-weight:800; color:#6E6E86; flex:0 0 52px; font-variant-numeric:tabular-nums; }
    .wt-row span{ font-size:15px; font-weight:700; flex:1; min-width:0; word-break:keep-all; color:#22222E; }
    /* 흐리게 하는 건 "다녀옴" 체크한 것뿐이다 */
    .wt-row.done b, .wt-row.done span{ color:#B0B0C2; text-decoration:line-through; }
    /* 지났는데 아직 체크 안 한 일정 — 또렷하게 두고 시간만 표시를 바꾼다 */
    .wt-row.over b{ color:#C43F00; }
    .wt-row .wt-dot{ flex:0 0 auto; font-size:11px; color:#FF6A00; }
    .wt-row .wt-ck{ flex:0 0 auto; font-size:12px; font-style:normal; color:#1E7A50; font-weight:800; }
    /* 큰 카드가 목록 사이에 끼므로 위아래 간격을 맞춘다 */
    .wt-rest + .wt-card, .wt-card + .wt-rest{ margin-top:10px; }

    .wt-empty{ margin-top:20%; font-size:15px; font-weight:700; color:#8E8EA8; line-height:1.7; }
    .wt-foot{ margin-top:16px; font-size:11px; font-weight:700; color:#A8A8BC; line-height:1.7; }
    .wt-btn{
      display:block; width:100%; margin-top:11px; padding:13px 0; border:0; border-radius:16px;
      background:#4B3FD4; color:#fff; font-size:14px; font-weight:800; cursor:pointer;
    }
    .wt-btn.line{ background:#FFF; border:1.5px solid #DCDCE6; color:#5A5A6E; }
    .wt-inp{
      width:100%; box-sizing:border-box; margin-top:11px; padding:12px 10px; border-radius:14px;
      border:1.5px solid #CFCFDC; background:#FFF; color:#15151F; text-align:center;
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
    /* 타이머를 먼저 걸어 둔다. 연결 화면(renderPair)이 뜨면 그쪽에서 도로 끈다 —
       순서가 반대면 코드 입력 중에 타이머가 살아나 입력이 지워진다. */
    clearInterval(this._t);
    this._t = setInterval(() => this.render(), 60000);
    this.render();
    /* 셀룰러 단독일 때 배터리가 중요하다 — 화면이 켜져 있을 때만 받아온다.
       워치는 손목을 내리면 곧바로 hidden 이 되므로 이걸로 충분하다.
       연결 화면(코드 입력 중)에서는 아무것도 돌리지 않는다. */
    if(this._pairing){ clearInterval(this._t); this._t = null; }
    else { this.pull(); this._schedulePull(); }
    document.addEventListener('visibilitychange', () => {
      if(document.hidden){ clearInterval(this._p); this._p = null; return; }
      if(this._pairing) return;                 // 코드 입력 중에는 건드리지 않는다
      this.pull(); this._schedulePull(); this.render();
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

  /* 부모(다른 사람 일정 보기 권한)는 가족을 돌려가며 볼 수 있다.
     아이는 자기 것만 본다 — 폰과 같은 규칙이다. */
  canSwitch(){ try{ return !!App.can('editOthers'); }catch(e){ return false; } },
  viewable(){
    if(!this.canSwitch()) return [App.meId()];
    const me = App.meId();
    const ids = (App.state.members||[]).map(m=>m.id);
    return [me].concat(ids.filter(x=>x!==me));   // 나를 맨 앞에
  },
  vm(){
    const list = this.viewable();
    let v = this._vm;
    if(!v){ try{ v = localStorage.getItem('kuma.watch.vm')||''; }catch(e){ v=''; } }
    if(!v || list.indexOf(v) < 0) v = list[0];
    this._vm = v;
    return v;
  },
  cycle(dir){
    const list = this.viewable();
    if(list.length < 2) return;
    const i = list.indexOf(this.vm());
    this._vm = list[(i + (dir||1) + list.length) % list.length];
    try{ localStorage.setItem('kuma.watch.vm', this._vm); }catch(e){}
    this.render();
  },

  /* 보고 있는 사람 기준의 "다녀옴" 체크 (App.doneKey 는 내 시점이라 쓰지 않는다) */
  _isDone(id, vmId){
    const k = (vmId||this.vm()) + '|' + App.day + '|' + id;
    return !!(App.state.doneEv||{})[k];
  },

  _hhmm(t){ return String(t||'').replace(/^0/,''); },
  _min(t){ const [h,m] = String(t||'0:0').split(':').map(Number); return (h||0)*60 + (m||0); },

  render(){
    const el = this._root;
    if(!el) return;
    /* 워치 키보드로 코드 한 줄 치는 데 1분이 넘게 걸린다.
       그동안 타이머가 화면을 다시 그리면 입력이 통째로 날아간다. */
    if(this._pairing) return;
    const ae = document.activeElement;
    if(ae && ae.tagName === 'INPUT' && el.contains(ae)) return;
    App.week = 0;
    App.day = new Date().getDay();

    if(!(App.state.sync||{}).group && window.ModSync && ModSync.configured && ModSync.configured()){
      return this.renderPair(el);
    }

    const vmId = this.vm();
    const me = App.member(vmId) || {};
    const multi = this.viewable().length > 1;
    const now = App.nowMin();
    const list = App.evs(App.day, 0, vmId)
      .filter(e => App.canSee(e))
      .slice().sort((a,b) => this._min(a.s) - this._min(b.s));

    if(!list.length){
      el.innerHTML = `
        <button class="wt-top ${multi?'tap':''}" id="wtWho">${multi?'<span class="wt-arw">‹</span>':''}${esc(me.emoji||'')} <span class="wt-name">${esc(me.name||'')}</span>${multi?'<span class="wt-arw">›</span>':''}</button>
        <div class="wt-empty">오늘은 일정이 없어요<br>푹 쉬어요 🌙</div>`;
      this._bindWho(el);
      return;
    }

    /* 카드는 언제나 시간 순서대로 둔다.
       지금(또는 다음) 일정만 그 자리에서 크게 보일 뿐, 순서를 바꾸지 않는다. */
    const cur  = list.find(e => this._min(e.s) <= now && now < this._min(e.e));
    const hero = cur || list.find(e => this._min(e.s) > now) || null;

    /* 흐리게 하는 기준은 "시간이 지났는가" 가 아니라 "다녀왔다고 체크했는가" 다.
       체크하지 않은 일정은 지났더라도 또렷하게 보여야 미리 챙길 수 있다. */
    const rows = list.map(e => {
      const done = this._isDone(e.id, vmId);
      const over = !done && this._min(e.e) <= now;      // 지났는데 아직 체크 안 함
      if(e === hero){
        const items = (e.items||[]).map(x =>
          `<span class="wt-item ${App.isPacked&&App.isPacked(e.id,x)?'ok':''}">${esc(x)}</span>`).join('');
        return `<div class="wt-card ${cur?'now':'next'}">
          <span class="wt-badge">${cur?'지금':'다음'}</span>
          <div class="wt-time">${esc(this._hhmm(e.s))}</div>
          <div class="wt-title">${esc(e.t)}</div>
          ${e.memo?`<div class="wt-memo">${esc(e.memo)}</div>`:''}
          ${items?`<div class="wt-prep-t">준비물</div><div class="wt-items">${items}</div>`:''}
        </div>`;
      }
      return `<div class="wt-row ${done?'done':''} ${over?'over':''}">
        <b>${esc(this._hhmm(e.s))}</b>
        <span>${esc(e.t)}</span>
        ${done?'<i class="wt-ck">✓</i>':((e.items&&e.items.length)?`<i class="wt-dot">🎒</i>`:'')}
      </div>`;
    });

    /* 큰 카드를 기준으로 앞뒤를 묶어 준다 — 순서는 그대로 유지된다 */
    const hi = hero ? list.indexOf(hero) : -1;
    const wrap = (arr, from, to) => {
      const part = arr.slice(from, to).join('');
      return part ? `<div class="wt-rest">${part}</div>` : '';
    };
    const body = hi < 0
      ? wrap(rows, 0, rows.length)
      : wrap(rows, 0, hi) + rows[hi] + wrap(rows, hi+1, rows.length);

    el.innerHTML = `
      <button class="wt-top ${multi?'tap':''}" id="wtWho">${multi?'<span class="wt-arw">‹</span>':''}${esc(me.emoji||'')} <span class="wt-name">${esc(me.name||'')}</span>${multi?'<span class="wt-arw">›</span>':''}</button>
      <div class="wt-now">${['일','월','화','수','목','금','토'][App.day]}요일 · ${esc(this._hhmm(typeof toStr==='function'?toStr(now):''))}</div>
      ${this._fresh()?`<div class="wt-fresh ${this._netErr?'err':''}">${esc(this._fresh())}</div>`:''}
      ${body}
      <div class="wt-foot">${multi?'이름을 눌러 가족을 바꿔요<br>':''}폰에서 고칠 수 있어요 · 손목에서는 보기만 합니다</div>`;
    this._bindWho(el);
  },

  /* 이름을 누르거나 좌우로 쓸어 가족을 바꾼다 */
  _bindWho(el){
    const w = el.querySelector('#wtWho');
    if(w) w.onclick = () => this.cycle(1);
    if(this._swipeBound) return;
    this._swipeBound = true;
    let x0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive:true});
    el.addEventListener('touchend', e => {
      if(x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if(Math.abs(dx) > 55) this.cycle(dx < 0 ? 1 : -1);
    }, {passive:true});
  },

  /* 폰에서 여는 안내 — 워치에 어떻게 띄우는지 */
  /* 워치에서 손으로 치기 쉬운 짧은 주소 — 물음표도 등호도 없다 */
  watchUrl(){ return App.appUrl().replace(/\/$/,'') + '/w'; },
  watchUrlLong(){ return App.appUrl() + '?watch=1'; },
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
          <span class="in-step-tx">아래 주소를 워치 브라우저에 넣고 <b>즐겨찾기</b> 하세요<br>
            <small style="color:var(--muted)">음성 입력을 쓰면 빠릅니다</small></span></div>
        <div class="in-step"><span class="in-num">3</span>
          <span class="in-step-tx">처음 한 번 <b>초대 코드</b>를 넣으면 끝이에요</span></div>
      </div>
      <div class="field" style="margin-top:14px">
        <label>누구의 일정을 볼까요?</label>
        <div class="iv-list" id="wtWho">
          ${App.state.members.map(m=>`<button class="iv-opt ${m.id===App.meId()?'on':''}" data-id="${esc(m.id)}">
            <span class="iv-av">${esc(m.emoji)}</span>
            <span class="iv-tx"><b>${esc(m.name)}</b><small>${esc(ROLE_LABEL[m.role]||'아이')}</small></span>
          </button>`).join('')}
        </div>
      </div>
      <div class="sy-code" id="wtUrl" style="font-size:12px;letter-spacing:0;height:auto;padding:13px 10px;word-break:break-all">${esc(u)}</div>
      <button class="btn full" id="wtCopy">주소 복사하기</button>
      <p class="sy-note" id="wtHint">위에서 사람을 고르면 <b>코드가 들어간 주소</b>로 바뀝니다.
        그 주소를 워치에 넣으면 <b>코드를 따로 칠 필요가 없어요.</b></p>
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
      let url = u;
      const urlEl = b.querySelector('#wtUrl');
      const pick = async (id, btn) => {
        b.querySelectorAll('#wtWho .iv-opt').forEach(x => x.classList.toggle('on', x === btn));
        const m = App.member(id);
        if(m && m.role === 'master'){
          url = u; urlEl.textContent = url;
          b.querySelector('#wtHint').innerHTML = '마스터는 초대 코드를 만들 수 없어요 · 워치에서 다른 사람을 골라 주세요';
          return;
        }
        urlEl.textContent = '코드 만드는 중…';
        try{
          const tok = await ModSync.createInvite(id);       // 이미 있으면 그대로 돌려준다
          url = u + '#' + tok;
          urlEl.textContent = url;
          b.querySelector('#wtHint').innerHTML =
            `이 주소를 워치에 넣으면 <b>${esc(m.name)}</b>의 일정이 바로 열려요. 코드를 칠 필요가 없습니다.`;
        }catch(e){
          url = u; urlEl.textContent = url;
          b.querySelector('#wtHint').textContent = e.message || '코드를 만들지 못했어요';
        }
      };
      b.querySelectorAll('#wtWho .iv-opt').forEach(o => o.onclick = () => pick(o.dataset.id, o));
      b.querySelector('#wtCopy').onclick = () => {
        if(navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(url).then(() => App.toast('주소를 복사했어요'))
            .catch(() => App.toast('복사에 실패했어요'));
        else App.toast('복사에 실패했어요');
      };
    });
  },

  /* 워치를 처음 열었을 때 — 초대 코드 한 번만 받는다 */
  renderPair(el){
    this._pairing = true;
    clearInterval(this._t); this._t = null;      // 그리는 타이머를 멈춘다
    clearInterval(this._p); this._p = null;      // 받아오는 타이머도 멈춘다
    el.innerHTML = `
      <div class="wt-top">KUMA <span class="wt-name">routine</span></div>
      <div class="wt-empty" style="margin-top:12%">가족 초대 코드를<br>한 번만 넣어 주세요</div>
      <input class="wt-inp" id="wtCode" placeholder="ABCD-1234" maxlength="9"
        type="text" autocomplete="off" autocorrect="off" autocapitalize="characters"
        spellcheck="false" enterkeyhint="go">
      <button class="wt-btn" id="wtGo">연결하기</button>
      <div class="wt-foot">폰에서 <b>가족 초대하기</b> 로 받은 코드예요.<br>워치는 보기만 하므로 자리를 뺏지 않아요.</div>`;
    const inp = el.querySelector('#wtCode');
    /* 주소 뒤에 코드를 붙여 오면(…/w#ABCD-1234) 타자 없이 바로 연결한다 */
    let fromUrl = '';
    try{ fromUrl = decodeURIComponent((location.hash||'').replace(/^#/,'')).trim().toUpperCase(); }catch(e){}
    if(/^[A-Z0-9]{4}-?[A-Z0-9]{4}$/.test(fromUrl)){
      inp.value = fromUrl.length === 8 ? fromUrl.slice(0,4)+'-'+fromUrl.slice(4) : fromUrl;
    }
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
        this._pairing = false;
        try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}  // 주소에서 코드를 지운다
        clearInterval(this._t);
        this._t = setInterval(() => this.render(), 60000);
        this._schedulePull();
        await this.pull();
        this.render();
      }catch(e){
        go.textContent = '연결하기'; go.disabled = false;
        el.querySelector('.wt-foot').innerHTML = esc(e.message||'연결하지 못했어요');
      }
    };
  }
};

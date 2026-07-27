/**
 * ModSync — 가족 그룹 실시간 동기화
 *
 * Firebase Realtime Database 를 SDK 없이 REST + EventSource 로 붙인다.
 * (단일 HTML 구조를 유지하기 위해 외부 스크립트를 쓰지 않는다)
 *
 *   익명 로그인 : identitytoolkit REST
 *   읽기/쓰기   : <db>/groups/<code>.json?auth=<idToken>
 *   실시간      : 같은 경로에 EventSource 로 구독
 *
 * 설정이 없으면 아무것도 하지 않고 기존 로컬 모드로 동작한다.
 */
/* ============================================================
 *  운영자 설정 — 배포 전에 여기 두 줄만 채우면 됩니다.
 *
 *  Firebase 콘솔 → ⚙️ 프로젝트 설정 → 내 앱(웹) 에서 복사.
 *  이 값들은 브라우저에 공개되는 "식별자"이지 비밀번호가 아닙니다.
 *  실제 보호는 Realtime Database 보안 규칙과 API 키 제한으로 합니다.
 *  (자세한 내용은 SYNC-SETUP.md)
 *
 *  비워두면 앱이 "각자 서버를 넣는 모드"로 동작합니다.
 * ============================================================ */
const KUMA_FIREBASE = {
  apiKey: '',
  dbUrl:  ''
};

window.ModSync = {
  css: `
    .sy-state{
      display:flex; align-items:center; gap:9px; padding:13px 15px; border-radius:var(--r-m);
      background:var(--bg); font-size:13px; font-weight:800; color:var(--ink2); margin-bottom:16px;
    }
    .sy-dot{ width:9px; height:9px; border-radius:50%; background:#C9C9D4; flex:0 0 auto; }
    .sy-dot.live{ background:#3FBF7F; box-shadow:0 0 0 3px rgba(63,191,127,.18); animation:syPulse 2s ease-in-out infinite; }
    .sy-dot.busy{ background:var(--orange); animation:syPulse 1s ease-in-out infinite; }
    .sy-dot.err{ background:#E0483C; }
    @keyframes syPulse{ 0%,100%{opacity:1} 50%{opacity:.45} }
    .sy-state small{ display:block; font-size:11px; font-weight:700; color:var(--muted); margin-top:2px; }

    .sy-code{
      display:flex; align-items:center; justify-content:center; gap:2px;
      height:64px; border-radius:var(--r-m); background:var(--indigo-s);
      font-family:'SFMono-Regular',Menlo,Consolas,monospace;
      font-size:26px; font-weight:800; letter-spacing:.18em; color:var(--indigo);
      margin-bottom:12px;
    }
    .sy-members{ display:flex; flex-wrap:wrap; gap:7px; margin-top:10px; }
    .sy-mem{
      display:flex; align-items:center; gap:5px; padding:6px 11px; border-radius:20px;
      background:var(--bg); font-size:12px; font-weight:800; color:var(--ink2);
    }
    .sy-mem i{ width:6px; height:6px; border-radius:50%; background:#3FBF7F; font-style:normal; }
    .sy-mem.off i{ background:#C9C9D4; }

    .sy-steps{ margin:0; padding-left:18px; font-size:12.5px; font-weight:600;
      color:var(--ink2); line-height:1.95; }
    .sy-steps b{ color:var(--ink); }
    .sy-note{ font-size:11.5px; font-weight:700; color:var(--muted); line-height:1.6; margin-top:14px; }
    .sy-rules{
      background:var(--bg); border-radius:var(--r-s); padding:11px 12px; margin-top:9px;
      font-family:'SFMono-Regular',Menlo,Consolas,monospace; font-size:10.5px; line-height:1.6;
      color:var(--ink2); white-space:pre; overflow-x:auto;
    }
  `,

  /* ================= 상태 ================= */
  _es: null,          // EventSource
  _tok: null,         // idToken
  _uid: null,
  _refresh: null,     // refreshToken
  _expAt: 0,
  _pushTimer: null,
  _pullingSelf: false,  // 내가 올린 변경이 되돌아온 것인지 구분
  _status: 'off',       // off | connecting | live | error
  _statusMsg: '',
  _lastPushed: '',

  /* ================= 부팅 ================= */
  init(){
    const s = App.state;
    if(!s.sync) s.sync = { cfg:null, group:null, on:false };
    // 앱의 저장 훅에 올라타 변경분을 자동 업로드한다
    if(!App._saveHooked){
      App._saveHooked = true;
      const origSave = App.save.bind(App);
      App.save = (...a) => { const r = origSave(...a); try{ ModSync.onLocalChange(); }catch(e){} return r; };
    }
    if(this.enabled()) this.connect();
  },

  /* 내장 설정이 있으면 그것을 쓰고, 없을 때만 사용자가 넣은 값을 쓴다 */
  cfg(){
    if(KUMA_FIREBASE.apiKey && KUMA_FIREBASE.dbUrl) return KUMA_FIREBASE;
    const c = (App.state.sync || {}).cfg;
    return (c && c.apiKey && c.dbUrl) ? c : null;
  },
  /* 앱에 서버가 내장돼 있는가 (사용자가 설정할 필요가 없는가) */
  builtIn(){ return !!(KUMA_FIREBASE.apiKey && KUMA_FIREBASE.dbUrl); },

  enabled(){
    const s = App.state.sync || {};
    return !!(s.on && this.cfg() && s.group);
  },
  configured(){ return !!this.cfg(); },

  /* 개발자 모드 — 주소에 ?dev=1 을 붙였을 때만 서버 직접 입력 화면이 열린다.
     일반 사용자는 이 화면을 만나지 않는다. 한 번 켜면 이 기기에 기억한다. */
  devMode(){
    try{
      if(/[?&]dev=1/.test(location.search)){ localStorage.setItem('kuma.dev','1'); }
      if(/[?&]dev=0/.test(location.search)){ localStorage.removeItem('kuma.dev'); }
      return localStorage.getItem('kuma.dev') === '1';
    }catch(e){ return false; }
  },
  status(){ return this._status; },

  /* ================= 인증 ================= */
  async _auth(){
    const c = this.cfg();
    if(this._tok && Date.now() < this._expAt - 60000) return this._tok;

    let res, data;
    if(this._refresh){
      res = await fetch('https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(c.apiKey), {
        method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:'grant_type=refresh_token&refresh_token=' + encodeURIComponent(this._refresh)
      });
      data = await res.json();
      if(data.id_token){
        this._tok = data.id_token; this._uid = data.user_id;
        this._refresh = data.refresh_token;
        this._expAt = Date.now() + (+data.expires_in || 3600) * 1000;
        return this._tok;
      }
    }
    res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + encodeURIComponent(c.apiKey), {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ returnSecureToken:true })
    });
    data = await res.json();
    if(!data.idToken){
      const m = (data.error && data.error.message) || 'AUTH_FAILED';
      throw new Error(m === 'ADMIN_ONLY_OPERATION' ? '익명 로그인이 꺼져 있어요' : m);
    }
    this._tok = data.idToken; this._uid = data.localId;
    this._refresh = data.refreshToken;
    this._expAt = Date.now() + (+data.expiresIn || 3600) * 1000;
    return this._tok;
  },

  _url(path){
    const base = String(this.cfg().dbUrl).replace(/\/+$/,'');
    return base + path + '.json?auth=' + encodeURIComponent(this._tok);
  },

  /* ================= 그룹 ================= */
  newCode(){
    // 사람이 부르기 쉬우면서 추측은 어렵게 — 혼동되는 글자(0,O,1,I)는 뺀다
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for(let i=0;i<8;i++) s += A[Math.floor(Math.random()*A.length)];
    return s.slice(0,4) + '-' + s.slice(4);
  },

  async createGroup(){
    await this._auth();
    const code = this.newCode();
    const body = {
      createdAt: Date.now(),
      owner: this._uid,
      members: { [this._uid]: { name: (App.member(App.meId())||{}).name || '나', at: Date.now() } },
      rev: 1,
      by: this._uid,
      state: this._snapshot()
    };
    const r = await fetch(this._url('/groups/' + code), {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if(!r.ok) throw new Error(await this._errText(r));
    App.state.sync.group = code;
    App.state.sync.on = true;
    App.state.inviteCode = code;
    App.save();
    this.connect();
    return code;
  },

  async joinGroup(rawCode){
    const code = String(rawCode||'').trim().toUpperCase().replace(/\s/g,'');
    if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) throw new Error('코드 형식이 올바르지 않아요');
    await this._auth();
    const r = await fetch(this._url('/groups/' + code));
    if(!r.ok) throw new Error(await this._errText(r));
    const g = await r.json();
    if(!g) throw new Error('그 코드의 그룹을 찾지 못했어요');

    await fetch(this._url('/groups/' + code + '/members/' + this._uid), {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:(App.member(App.meId())||{}).name || '나', at: Date.now() })
    });

    App.state.sync.group = code;
    App.state.sync.on = true;
    App.state.inviteCode = code;
    if(g.state) this._applyRemote(g.state);
    App.save();
    this.connect();
    return { code, members: Object.keys(g.members||{}).length };
  },

  leaveGroup(){
    this.disconnect();
    App.state.sync.group = null;
    App.state.sync.on = false;
    App.save();
    this._setStatus('off','');
    App.render();
  },

  async _errText(r){
    try{ const j = await r.json(); return (j.error && (j.error.message || j.error)) || ('HTTP ' + r.status); }
    catch(e){ return 'HTTP ' + r.status; }
  },

  /* ================= 동기화 ================= */
  _snapshot(){
    const s = App.state;
    return {
      members: s.members, schedules: s.schedules, todos: s.todos,
      reward: s.reward, coins: s.coins, doneEv: s.doneEv || {},
      badges: s.badges || {}
    };
  },

  _applyRemote(st){
    if(!st) return;
    this._pullingSelf = true;
    const s = App.state;
    if(st.members) s.members = st.members;
    if(st.schedules) s.schedules = st.schedules;
    if(st.todos) s.todos = st.todos;
    if(st.reward) s.reward = st.reward;
    if(typeof st.coins === 'number') s.coins = st.coins;
    if(st.doneEv) s.doneEv = st.doneEv;
    if(st.badges) s.badges = st.badges;
    try{ localStorage.setItem('haruk', JSON.stringify(s)); }catch(e){}
    this._pullingSelf = false;
  },

  onLocalChange(){
    if(!this.enabled() || this._pullingSelf) return;
    clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => this.push(), 700);   // 연타를 묶어서 한 번만 올린다
  },

  async push(){
    if(!this.enabled()) return;
    try{
      await this._auth();
      const snap = this._snapshot();
      const json = JSON.stringify(snap);
      if(json === this._lastPushed) return;
      this._setStatus('busy','올리는 중');
      const r = await fetch(this._url('/groups/' + App.state.sync.group), {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ state: snap, rev: Date.now(), by: this._uid })
      });
      if(!r.ok) throw new Error(await this._errText(r));
      this._lastPushed = json;
      this._setStatus('live','');
    }catch(e){
      this._setStatus('error', e.message || '올리지 못했어요');
    }
  },

  async connect(){
    this.disconnect();
    if(!this.enabled()) return;
    this._setStatus('connecting','연결하는 중');
    try{
      await this._auth();
      const url = this._url('/groups/' + App.state.sync.group);
      const es = new EventSource(url);
      this._es = es;

      es.addEventListener('put', ev => this._onEvent(ev));
      es.addEventListener('patch', ev => this._onEvent(ev));
      es.addEventListener('open', () => this._setStatus('live',''));
      es.onerror = () => {
        this._setStatus('error','연결이 끊겼어요');
        // 토큰 만료 등 — 잠시 뒤 재연결
        clearTimeout(this._retry);
        this._retry = setTimeout(() => { this._tok = null; this.connect(); }, 6000);
      };
    }catch(e){
      this._setStatus('error', e.message || '연결하지 못했어요');
    }
  },

  _onEvent(ev){
    let d;
    try{ d = JSON.parse(ev.data); }catch(e){ return; }
    if(!d || d.data === undefined) return;
    this._setStatus('live','');

    // path 가 '/' 면 그룹 전체, 아니면 부분 갱신
    const path = d.path || '/';
    let st = null, by = null;
    if(path === '/'){
      if(d.data === null){ this._setStatus('error','그룹이 삭제됐어요'); return; }
      st = d.data.state; by = d.data.by;
    } else if(path === '/state'){
      st = d.data;
    } else if(path.indexOf('/state/') === 0){
      // 부분 변경은 전체를 다시 받아 단순하게 처리한다
      this._pullOnce(); return;
    } else if(path === '/by'){ by = d.data; }

    if(by && by === this._uid) return;      // 내가 올린 것이 되돌아온 경우
    if(st){
      this._applyRemote(st);
      this._lastPushed = JSON.stringify(this._snapshot());
      App.render();
      if(App.toast) App.toast('가족의 변경 내용을 받았어요');
    }
  },

  async _pullOnce(){
    try{
      await this._auth();
      const r = await fetch(this._url('/groups/' + App.state.sync.group + '/state'));
      if(!r.ok) return;
      const st = await r.json();
      if(st){ this._applyRemote(st); this._lastPushed = JSON.stringify(this._snapshot()); App.render(); }
    }catch(e){}
  },

  disconnect(){
    clearTimeout(this._retry);
    if(this._es){ try{ this._es.close(); }catch(e){} this._es = null; }
  },

  _setStatus(s, msg){
    this._status = s; this._statusMsg = msg || '';
    const el = document.getElementById('syState');
    if(el) el.outerHTML = this.stateHtml();
  },

  stateHtml(){
    const map = {
      off:      ['',      '이 기기에서만 사용 중',
                 this.configured() ? '가족과 함께 쓰려면 그룹을 만들어 주세요' : '실시간 동기화는 아직 켜지지 않았어요'],
      connecting:['busy', '연결하는 중…',        ''],
      live:     ['live',  '가족과 연결됨',        App.state.sync && App.state.sync.group ? ('그룹 ' + App.state.sync.group) : ''],
      busy:     ['busy',  '동기화 중…',          ''],
      error:    ['err',   '연결 문제',            this._statusMsg]
    };
    const [cls, title, sub] = map[this._status] || map.off;
    return `<div class="sy-state" id="syState">
      <span class="sy-dot ${cls}"></span>
      <span>${title}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
    </div>`;
  },

  /* ================= UI ================= */
  open(){
    const s = App.state.sync || {};
    const inGroup = !!(s.group && s.on);

    const body = this.configured()
      ? `${this.stateHtml()}
         ${inGroup ? `
           <div class="field">
             <label>우리 가족 초대 코드</label>
             <div class="sy-code">${esc(s.group)}</div>
             <button class="btn full" id="syCopy">초대 코드 복사하기</button>
           </div>
           <p class="sy-note">
             같이 쓸 사람에게 이 코드를 알려주고, 상대방 앱에서
             <b>가족 그룹 → 코드로 참여하기</b> 에 입력하면 됩니다.<br>
             한쪽에서 일정을 바꾸면 다른 기기에 바로 반영돼요.
           </p>
           <button class="btn line full" id="syLeave" style="margin-top:18px">그룹에서 나가기</button>
         ` : `
           <button class="btn full" id="syCreate" style="margin-bottom:12px">새 가족 그룹 만들기</button>
           <div class="field" style="margin-top:18px">
             <label>이미 있는 그룹에 들어가기</label>
             <input class="inp" id="syCode" placeholder="ABCD-1234" maxlength="9"
               style="text-align:center;letter-spacing:.14em;font-family:'SFMono-Regular',Menlo,monospace;text-transform:uppercase">
           </div>
           <button class="btn line full" id="syJoin">코드로 참여하기</button>
           <p class="sy-note">
             그룹을 만들면 이 기기의 일정이 그대로 올라가고,
             참여하면 <b>그룹의 내용을 받아옵니다.</b><br>
             한쪽에서 일정을 바꾸면 다른 기기에 바로 반영돼요.
           </p>
         `}
         ${this.builtIn() || !this.devMode() ? '' : `<button class="btn line full" id="syCfgBtn" style="margin-top:22px">서버 설정 바꾸기</button>`}`
      : this.devMode() ? `${this.stateHtml()}
         <div class="panel" style="padding:13px 15px;margin-bottom:16px;background:var(--orange-s)">
           <div style="font-size:12.5px;font-weight:800;color:var(--orange);line-height:1.6">
             개발자 모드 (?dev=1)<br>
             <span style="font-weight:700;color:var(--ink2)">일반 사용자에게는 이 화면이 보이지 않습니다.
             여기 넣은 값은 이 기기에만 저장되고 저장소·배포본에는 들어가지 않아요.
             끄려면 주소에 <b>?dev=0</b> 을 붙여 새로고침하세요.</span>
           </div>
         </div>
         <p style="margin:0 0 16px;font-size:13.5px;font-weight:600;color:var(--ink2);line-height:1.7">
           가족끼리 <b>실시간으로 같은 일정을 보려면</b> 무료 서버가 하나 필요해요.
           구글 Firebase 를 쓰면 카드 등록 없이 무료로 쓸 수 있습니다.
         </p>
         <div class="panel" style="padding:15px 16px">
           <div style="font-size:13px;font-weight:800;margin-bottom:9px">준비 (5분)</div>
           <ol class="sy-steps">
             <li><b>console.firebase.google.com</b> 접속 · 구글 로그인</li>
             <li><b>프로젝트 만들기</b> — 이름은 아무거나, 애널리틱스는 꺼도 됨</li>
             <li>왼쪽 <b>빌드 → Realtime Database → 데이터베이스 만들기</b><br>위치는 아무거나, <b>잠금 모드</b>로 시작</li>
             <li><b>빌드 → Authentication → 시작하기 → 익명</b> 사용 설정</li>
             <li>⚙️ <b>프로젝트 설정 → 내 앱 → 웹(&lt;/&gt;)</b> 추가 후<br>
                 <b>apiKey</b> 와 <b>databaseURL</b> 을 복사</li>
           </ol>
         </div>
         <div class="field" style="margin-top:18px">
           <label>apiKey</label>
           <input class="inp" id="syKey" placeholder="AIza..." autocomplete="off" spellcheck="false">
         </div>
         <div class="field">
           <label>databaseURL</label>
           <input class="inp" id="syDb" placeholder="https://...firebasedatabase.app" autocomplete="off" spellcheck="false">
         </div>
         <button class="btn full" id="sySave">저장하고 연결하기</button>
         <p class="sy-note">
           이 두 값은 브라우저에 공개되는 <b>식별자</b>라 비밀번호가 아닙니다.
           다만 아무나 쓰지 못하게 <b>보안 규칙</b>을 아래처럼 넣어 주세요.
           (Realtime Database → 규칙 탭)
         </p>
         <div class="sy-rules">{
  "rules": {
    "groups": {
      "$code": {
        ".read":  "auth != null",
        ".write": "auth != null"
      }
    }
  }
}</div>
         <p class="sy-note">
           로그인한 사람만 접근할 수 있고, 그룹은 <b>8자리 코드를 아는 사람만</b>
           찾을 수 있습니다. 더 엄격히 막으려면 멤버 목록 기반 규칙이 필요해요.
         </p>`
      : `${this.stateHtml()}
         <p style="margin:0 0 18px;font-size:13.5px;font-weight:600;color:var(--ink2);line-height:1.75">
           이 버전에는 <b>실시간 동기화 서버가 아직 연결되어 있지 않아요.</b><br>
           대신 <b>코드로 주고받기</b>로 가족에게 일정을 그대로 넘길 수 있습니다.
         </p>
         <button class="btn full" id="syExport">코드로 주고받기</button>
         <p class="sy-note">
           내 일정을 한 줄짜리 코드로 만들어 카톡으로 보내면,
           받는 사람이 <b>같은 화면에서 붙여넣어</b> 그대로 가져갑니다.<br>
           실시간은 아니지만 지금 바로 함께 쓸 수 있어요.
         </p>`;

    App.sheet('가족 그룹 · 실시간 동기화', body,
      `<button class="btn line full" id="syClose">닫기</button>`,
      (b, f) => {
        const $ = id => b.querySelector(id);
        f.querySelector('#syClose').onclick = () => App.closeSheet();

        const save = $('#sySave');
        if(save) save.onclick = async () => {
          const apiKey = $('#syKey').value.trim();
          const dbUrl  = $('#syDb').value.trim().replace(/\/+$/,'');
          if(!apiKey || !dbUrl){ App.toast('두 값을 모두 넣어 주세요'); return; }
          if(!/^https:\/\//.test(dbUrl)){ App.toast('databaseURL 은 https:// 로 시작해요'); return; }
          App.state.sync.cfg = { apiKey, dbUrl };
          App.save();
          save.textContent = '확인하는 중…'; save.disabled = true;
          try{
            this._tok = null; this._refresh = null;
            await this._auth();
            App.toast('서버에 연결됐어요');
            App.closeSheet(); setTimeout(() => this.open(), 260);
          }catch(e){
            save.textContent = '저장하고 연결하기'; save.disabled = false;
            App.toast('연결 실패 · ' + (e.message || ''));
          }
        };

        const exp = $('#syExport');
        if(exp) exp.onclick = () => {
          App.closeSheet();
          setTimeout(() => App.shareSheet(), 240);
        };

        const cfgBtn = $('#syCfgBtn');
        if(cfgBtn) cfgBtn.onclick = () => {
          App.state.sync.cfg = null; App.save();
          App.closeSheet(); setTimeout(() => this.open(), 260);
        };

        const create = $('#syCreate');
        if(create) create.onclick = async () => {
          create.textContent = '만드는 중…'; create.disabled = true;
          try{
            const code = await this.createGroup();
            App.closeSheet();
            App.toast('가족 그룹을 만들었어요 · ' + code);
            if(window.ModSound) ModSound.play('complete');
            setTimeout(() => this.open(), 300);
          }catch(e){
            create.textContent = '새 가족 그룹 만들기'; create.disabled = false;
            App.toast('만들지 못했어요 · ' + (e.message || ''));
          }
        };

        const join = $('#syJoin');
        if(join) join.onclick = async () => {
          const v = $('#syCode').value;
          join.textContent = '들어가는 중…'; join.disabled = true;
          try{
            const r = await this.joinGroup(v);
            App.closeSheet();
            App.toast(`그룹에 들어왔어요 · 가족 ${r.members}명`);
            if(window.ModSound) ModSound.play('complete');
            App.render();
            setTimeout(() => this.open(), 300);
          }catch(e){
            join.textContent = '코드로 참여하기'; join.disabled = false;
            App.toast(e.message || '들어가지 못했어요');
          }
        };

        const copy = $('#syCopy');
        if(copy) copy.onclick = () => {
          const code = App.state.sync.group;
          const done = () => App.toast('초대 코드를 복사했어요');
          if(navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(code).then(done).catch(() => App.toast('복사에 실패했어요'));
          else App.toast('복사에 실패했어요');
        };

        const leave = $('#syLeave');
        if(leave) leave.onclick = () => {
          this.leaveGroup();
          App.closeSheet();
          App.toast('그룹에서 나왔어요 · 이 기기에서만 사용해요');
        };
      });
  }
};

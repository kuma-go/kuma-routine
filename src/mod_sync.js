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
    .sy-meline{ display:flex; align-items:center; gap:12px; padding:13px 15px; border-radius:var(--r-m);
      background:var(--indigo-s); margin-bottom:12px; }
    .sy-meav{ width:40px; height:40px; border-radius:50%; background:#fff;
      display:flex; align-items:center; justify-content:center; font-size:21px; flex:0 0 auto; }
    .sy-metx{ display:flex; flex-direction:column; gap:2px; min-width:0; }
    .sy-metx b{ font-size:14.5px; font-weight:800; color:var(--indigo); }
    .sy-metx small{ font-size:11.5px; font-weight:700; color:var(--ink2); }

    .iv-list{ display:flex; flex-direction:column; gap:8px; }
    .iv-opt{ display:flex; align-items:center; gap:11px; width:100%; padding:12px 14px;
      border-radius:var(--r-m); border:1.6px solid var(--line); background:transparent;
      text-align:left; cursor:pointer; transition:.18s cubic-bezier(.22,1,.36,1); }
    .iv-opt.on{ border-color:var(--indigo); background:var(--indigo-s); }
    .iv-av{ width:36px; height:36px; border-radius:50%; background:var(--bg);
      display:flex; align-items:center; justify-content:center; font-size:19px; flex:0 0 auto; }
    .iv-tx{ display:flex; flex-direction:column; gap:2px; min-width:0; }
    .iv-tx b{ font-size:14px; font-weight:800; color:var(--ink); }
    .iv-tx small{ font-size:11.5px; font-weight:700; color:var(--muted); }
    .iv-opt.on .iv-tx b{ color:var(--indigo); }
    .iv-go{ margin-left:auto; font-size:12px; font-weight:800; color:var(--indigo); flex:0 0 auto; }

    .iv-role{ display:flex; gap:8px; }
    .iv-rb{ flex:1; padding:11px 0; border-radius:var(--r-s); border:1.6px solid var(--line);
      background:transparent; font-size:13px; font-weight:800; color:var(--muted); cursor:pointer;
      transition:.18s cubic-bezier(.22,1,.36,1); }
    .iv-rb.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo); }

    /* 마스터 전용 토글 */
    .sy-opt{ display:flex; align-items:center; gap:12px; margin-top:16px; padding:13px 15px;
      border-radius:var(--r-m); border:1.6px solid var(--line); cursor:pointer; }
    .sy-opt-tx{ display:flex; flex-direction:column; gap:3px; min-width:0; }
    .sy-opt-tx b{ font-size:13.5px; font-weight:800; color:var(--ink); }
    .sy-opt-tx small{ font-size:11.5px; font-weight:700; color:var(--muted); line-height:1.5; }
    .sy-sw{ margin-left:auto; flex:0 0 auto; width:46px; height:27px; border-radius:14px;
      background:#DCDCE6; position:relative; transition:.2s cubic-bezier(.22,1,.36,1); }
    .sy-sw i{ position:absolute; top:3px; left:3px; width:21px; height:21px; border-radius:50%;
      background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.2); transition:.2s cubic-bezier(.22,1,.36,1); }
    .sy-sw.on{ background:var(--indigo); }
    .sy-sw.on i{ transform:translateX(19px); }
    .sy-reqbtns{ margin-left:auto; display:flex; gap:6px; flex:0 0 auto; }
    .sy-reqbtns button{ padding:7px 12px; border-radius:14px; font-size:12px; font-weight:800; cursor:pointer; }
    .sy-yes{ background:var(--indigo); color:#fff; border:0; }
    .sy-no{ background:transparent; color:var(--muted); border:1.5px solid var(--line); }
    #phone.th-dark .sy-opt{ border-color:#33333F; }
    #phone.th-dark .sy-sw{ background:#3A3A48; }
    #phone.th-dark .sy-sw.on{ background:#7A6EEA; }
    #phone.th-dark .sy-no{ border-color:#3A3A48; }

    .iv-card{ text-align:center; padding:6px 0 16px; }
    .iv-card-av{ width:76px; height:76px; margin:0 auto 10px; border-radius:50%;
      background:var(--indigo-s); display:flex; align-items:center; justify-content:center; font-size:38px; }
    .iv-card-nm{ font-size:20px; font-weight:800; color:var(--ink); }
    .iv-card-rl{ font-size:12.5px; font-weight:700; color:var(--muted); margin-top:3px; }

    #phone.th-dark .iv-opt, #phone.th-dark .iv-rb{ border-color:#33333F; }
    #phone.th-dark .iv-opt.on, #phone.th-dark .iv-rb.on{
      border-color:#7A6EEA; background:rgba(122,110,234,.16); }
    #phone.th-dark .iv-opt.on .iv-tx b, #phone.th-dark .iv-rb.on{ color:#B7AEFF; }
    #phone.th-dark .sy-meav{ background:#2A2A36; }

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
    if(!s.groupOpts) s.groupOpts = {approval:false};
    if(this.enabled()) this.connect();
    else if(this.pending()) this.watchPending();   // 승인을 기다리다 앱을 껐던 경우
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

    /* 그룹을 만든 사람이 마스터다. 이 기기의 주인에게 uid 를 묶고,
       나머지 프로필은 "아직 아무 기기도 쓰지 않는 상태"로 둔다. */
    const meId = App.meId();
    App.state.members.forEach(m => {
      m.uid = (m.id === meId) ? this._uid : null;
      m.role = (m.id === meId) ? 'master' : (m.role === 'master' ? 'parent' : (m.role || 'child'));
    });
    App.migrate();

    const body = {
      createdAt: Date.now(),
      owner: this._uid,
      devices: { [this._uid]: { member: meId, at: Date.now() } },
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

  /* ---------- 지정 초대 ----------
     "누구로 들어올지"를 초대장에 적어서 발급한다.
     받는 사람은 역할을 고를 수 없다 — 아이가 부모로 들어오는 일을 막는다.

     코드는 1회용이 아니라 **그 사람의 코드**다.
     사파리에서 수락한 뒤 홈 화면에 앱을 설치하면 저장소가 새로 잡히는데,
     같은 코드를 다시 넣으면 같은 사람으로 이어붙는다. 기기를 바꿔도 마찬가지다.
     새 코드가 필요하면 마스터가 재발급하면 예전 코드는 죽는다. */
  async createInvite(memberId, opt){
    if(!this.enabled()) throw new Error('먼저 가족 그룹을 만들어 주세요');
    if(!App.can('invite')) throw new Error('초대할 권한이 없어요');
    const m = App.member(memberId);
    if(!m) throw new Error('그 프로필을 찾지 못했어요');
    if(m.role === 'master') throw new Error('마스터는 초대로 넘길 수 없어요');
    await this._auth();

    /* 이미 발급된 코드가 있으면 그대로 다시 보여준다 (재발급이 아니라면) */
    const reissue = !!(opt && opt.reissue);
    if(m.invite && !reissue) return m.invite;

    const old = m.invite;
    const token = this.newCode();
    m.invite = token;
    App.save();
    /* 방금 만든 프로필이 아직 안 올라갔을 수 있다.
       초대장을 먼저 뿌리면 받는 쪽이 "그런 사람 없다"를 보게 된다. */
    clearTimeout(this._pushTimer);
    await this.push();

    const r = await fetch(this._url('/invites/' + token), {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        group: App.state.sync.group, member: memberId,
        name: m.name, emoji: m.emoji, role: m.role,
        by: this._uid, at: Date.now()
      })
    });
    if(!r.ok){ m.invite = old || null; App.save(); throw new Error(await this._errText(r)); }
    /* 재발급이면 예전 코드를 무효로 만든다 */
    if(reissue && old && old !== token){
      try{ await fetch(this._url('/invites/' + old), {method:'PUT',headers:{'Content-Type':'application/json'},body:'null'}); }catch(e){}
    }
    return token;
  },

  /* 초대장을 열어보기만 한다 — 확인 화면에 보여줄 정보 */
  async peekInvite(rawToken){
    const token = String(rawToken||'').trim().toUpperCase().replace(/\s/g,'');
    if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(token)) throw new Error('코드 형식이 올바르지 않아요');
    await this._auth();
    const r = await fetch(this._url('/invites/' + token));
    if(!r.ok) throw new Error(await this._errText(r));
    const inv = await r.json();
    if(!inv) throw new Error('그 초대 코드를 찾지 못했어요 · 가족에게 다시 받아 주세요');
    /* 이미 쓴 코드도 막지 않는다 — 같은 사람이 기기를 바꾸거나 앱을 새로 깐 경우다 */
    return Object.assign({token}, inv);
  },

  /* ---------- 참여 승인 ----------
     마스터가 켜 두면, 초대 코드를 넣어도 바로 연결되지 않고
     마스터가 확인해 줄 때까지 기다린다. 기본은 꺼짐. */
  needsApproval(){ return !!(App.state.groupOpts && App.state.groupOpts.approval); },
  async setApproval(on){
    if(!App.can('manageMembers')) throw new Error('마스터만 바꿀 수 있어요');
    App.state.groupOpts = Object.assign({}, App.state.groupOpts, {approval: !!on});
    App.save();
    clearTimeout(this._pushTimer);
    this._lastPushed = '';
    if(this.enabled()) await this.push();
    return !!on;
  },

  /* 초대장대로 참여한다.
     bundle 을 넘기면 이 기기에 있던 일정을 내 프로필 밑으로 옮겨 붙인다. */
  async acceptInvite(inv, bundle){
    await this._auth();
    const code = inv.group;
    const r = await fetch(this._url('/groups/' + code));
    if(!r.ok) throw new Error(await this._errText(r));
    const g = await r.json();
    if(!g) throw new Error('그룹을 찾지 못했어요');

    /* 승인제가 켜져 있으면 자리를 먼저 차지하지 않고 요청만 남긴다.
       단, 그 프로필이 이미 내 uid 로 묶여 있으면 같은 기기의 재연결이므로 그냥 통과시킨다. */
    const opts = (g.state && g.state.groupOpts) || {};
    const seat = ((g.state && g.state.members) || []).find(m => m.id === inv.member) || {};
    if(opts.approval && seat.uid !== this._uid){
      return this.requestJoin(inv, bundle, g);
    }

    /* 그룹 상태를 받되, "내가 누구인지"는 초대장이 정한다 */
    if(g.state) this._applyRemote(g.state, {keepMe:false});
    const mine = App.state.members.find(m => m.id === inv.member);
    if(!mine) throw new Error('초대된 프로필이 그룹에서 사라졌어요');

    /* 같은 코드로 다시 들어오면 같은 사람이다.
       기기를 바꿨거나, 브라우저에서 쓰다가 앱을 설치한 경우가 여기에 해당한다. */
    const moved = !!(mine.uid && mine.uid !== this._uid);
    mine.uid = this._uid;
    App.state.meId = mine.id;
    App.state.sync.group = code;
    App.state.sync.on = true;
    App.state.inviteCode = code;
    App.viewMember = null;
    App.migrate();

    let merged = 0;
    if(bundle && bundle.count) merged = App.mergeBundleInto(bundle, mine.id);

    await fetch(this._url('/groups/' + code + '/devices/' + this._uid), {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ member: mine.id, at: Date.now() })
    });
    await fetch(this._url('/invites/' + inv.token), {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ usedBy: this._uid, usedAt: Date.now() })
    });

    /* 올리기 직전에 프로필만 다시 읽는다.
       내가 확인 화면을 보고 있는 사이 가족이 이름·이모지를 바꿨을 수 있는데,
       그걸 내 오래된 사본으로 덮어쓰면 "프로필이 초기화됐다"가 된다. */
    try{
      const fr = await fetch(this._url('/groups/' + code + '/state/members'));
      if(fr.ok){
        const fresh = await fr.json();
        if(Array.isArray(fresh) && fresh.length){
          App.state.members = fresh.map(fm => {
            const local = (App.state.members||[]).find(x => x.id === fm.id) || {};
            const out = Object.assign({role:'child',uid:null,perm:null}, fm);
            if(out.id === mine.id) out.uid = this._uid;      // 내 바인딩만 얹는다
            if(!out.invite && local.invite) out.invite = local.invite;
            return out;
          });
          App.migrate();
        }
      }
    }catch(e){ /* 못 읽으면 방금 받은 사본을 그대로 쓴다 */ }

    App.save();
    this.connect();
    await this.push();                       // 내 uid 바인딩과 합친 데이터를 곧바로 올린다
    return { code, member: App.member(mine.id), merged, moved };
  },

  /* ---------- 승인 대기 (참여하는 쪽) ---------- */
  async requestJoin(inv, bundle, g){
    const code = inv.group;
    await fetch(this._url('/groups/' + code + '/requests/' + this._uid), {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ member: inv.member, name: inv.name, emoji: inv.emoji,
        role: inv.role, at: Date.now() })
    });
    App.state.sync.pending = {
      group: code, member: inv.member, token: inv.token,
      name: inv.name, emoji: inv.emoji, at: Date.now(),
      bundle: (bundle && bundle.count) ? bundle : null      // 승인되면 그때 붙인다
    };
    App.save();
    this._setStatus('busy','승인을 기다리는 중');
    this.watchPending();
    App.render();
    return { pending:true, member:{ id:inv.member, name:inv.name, emoji:inv.emoji, role:inv.role } };
  },

  pending(){ return (App.state.sync || {}).pending || null; },

  /* 마스터가 눌러줄 때까지 지켜본다. 앱을 껐다 켜도 다시 붙는다. */
  watchPending(){
    clearInterval(this._pendTimer);
    if(!this.pending()) return;
    const tick = () => this.checkPending().catch(() => {});
    this._pendTimer = setInterval(tick, 5000);
    tick();
  },
  stopPending(){ clearInterval(this._pendTimer); this._pendTimer = null; },

  async checkPending(){
    const p = this.pending();
    if(!p) { this.stopPending(); return false; }
    await this._auth();
    const r = await fetch(this._url('/groups/' + p.group + '/state/members'));
    if(!r.ok) return false;
    const members = await r.json();
    const seat = (members || []).find(m => m.id === p.member);
    if(!seat) return false;
    if(seat.uid !== this._uid) return false;          // 아직 안 눌러줬다
    await this._finishPending(p);
    return true;
  },

  async _finishPending(p){
    this.stopPending();
    const r = await fetch(this._url('/groups/' + p.group));
    const g = r.ok ? await r.json() : null;
    if(g && g.state) this._applyRemote(g.state, {keepMe:false});
    App.state.meId = p.member;
    App.state.sync.group = p.group;
    App.state.sync.on = true;
    App.state.sync.pending = null;
    App.state.inviteCode = p.group;
    App.viewMember = null;
    App.migrate();
    let merged = 0;
    if(p.bundle && p.bundle.count) merged = App.mergeBundleInto(p.bundle, p.member);
    try{
      await fetch(this._url('/groups/' + p.group + '/requests/' + this._uid), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:'null' });
    }catch(e){}
    App.save();
    this.connect();
    await this.push();
    const me = App.member(p.member);
    App.toast(`${me.emoji} ${me.name}(으)로 승인됐어요` + (merged ? ` · ${merged}개 가져옴` : ''));
    if(window.ModSound) ModSound.play('complete');
    App.render();
  },

  cancelPending(){
    const p = this.pending();
    this.stopPending();
    if(p){
      try{ fetch(this._url('/groups/' + p.group + '/requests/' + this._uid), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:'null' }); }catch(e){}
    }
    App.state.sync.pending = null;
    App.save();
    this._setStatus('off','');
    App.render();
  },

  /* ---------- 승인 처리 (마스터 쪽) ---------- */
  async listRequests(){
    if(!this.enabled() || !App.can('manageMembers')) return [];
    await this._auth();
    const r = await fetch(this._url('/groups/' + App.state.sync.group + '/requests'));
    if(!r.ok) return [];
    const obj = await r.json();
    return Object.keys(obj || {}).map(uid => Object.assign({uid}, obj[uid]));
  },

  async approveRequest(req){
    if(!App.can('manageMembers')) throw new Error('마스터만 승인할 수 있어요');
    const m = App.member(req.member);
    if(!m) throw new Error('그 프로필이 없어졌어요');
    m.uid = req.uid;                       // 자리를 내어준다
    App.save();
    clearTimeout(this._pushTimer);
    this._lastPushed = '';
    await this.push();                     // 기다리는 기기가 이걸 보고 들어온다
    App.render();
    return m;
  },

  async rejectRequest(req){
    if(!App.can('manageMembers')) throw new Error('마스터만 할 수 있어요');
    await this._auth();
    await fetch(this._url('/groups/' + App.state.sync.group + '/requests/' + req.uid), {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:'null' });
    return true;
  },

  /* 공용 코드로 들어오는 예전 방식 — 초대 코드로 먼저 해석해 보고, 아니면 그룹 코드로 본다 */
  async joinGroup(rawCode, bundle){
    const code = String(rawCode||'').trim().toUpperCase().replace(/\s/g,'');
    if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) throw new Error('코드 형식이 올바르지 않아요');
    let inv = null;
    try{ inv = await this.peekInvite(code); }catch(e){ /* 그룹 코드일 수 있다 */ }
    if(inv) return this.acceptInvite(inv, bundle);
    throw new Error('초대 코드를 찾지 못했어요 · 가족에게 새로 발급받아 주세요');
  },

  /* 연결 끊기 — 끊기 전에 "기기 없음"을 먼저 올려야 가족 화면에 반영된다.
     예전에는 sync.on 을 먼저 꺼버려서 push 가 그냥 무시됐고,
     마스터 쪽에는 계속 연결된 것처럼 보였다. */
  async leaveGroup(){
    const me = App.member(App.meId());
    const wasOn = this.enabled();
    if(me && me.uid === this._uid){
      me.uid = null;
      if(wasOn){
        try{
          clearTimeout(this._pushTimer);
          this._lastPushed = '';        // 강제로 한 번 올린다
          await this.push();
        }catch(e){ /* 못 올려도 로컬 연결은 끊는다 */ }
      }
    }
    this.disconnect();
    App.state.sync.group = null;
    App.state.sync.on = false;
    App.save();
    this._setStatus('off','');
    App.render();
  },

  /* 마스터가 남의 기기 연결을 떼어낸다 (그 사람 폰을 잃어버렸을 때 등) */
  async unlinkDevice(memberId){
    if(!App.can('manageMembers')) throw new Error('마스터만 할 수 있어요');
    const m = App.member(memberId);
    if(!m) throw new Error('그 프로필을 찾지 못했어요');
    if(m.id === App.meId()) throw new Error('내 기기는 여기서 뗄 수 없어요');
    m.uid = null;
    App.save();
    clearTimeout(this._pushTimer);
    this._lastPushed = '';
    await this.push();
    App.render();
    return m;
  },

  /* 마스터 위임 — 한 번에 두 사람을 바꿔야 마스터가 둘이 되지 않는다 */
  transferMaster(toId){
    if(!App.isMaster()) throw new Error('마스터만 넘길 수 있어요');
    const to = App.member(toId);
    if(!to || to.id === App.meId()) throw new Error('넘길 사람을 골라 주세요');
    if(to.role === 'child') throw new Error('아이에게는 넘길 수 없어요');
    App.state.members.forEach(m => {
      if(m.role === 'master') m.role = 'parent';
    });
    to.role = 'master';
    App.migrate();
    App.save();
    App.render();
    return to;
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
      badges: s.badges || {},
      groupOpts: s.groupOpts || {approval:false}   // 그룹 정책 — 마스터가 정한다
    };
  },

  /* 그룹의 내용을 받아 덮되, "이 기기가 누구인지"는 절대 덮지 않는다.
     meId 는 동기화 대상이 아니다 — 기기마다 다른 사람이기 때문. */
  _applyRemote(st, opt){
    if(!st) return;
    const keepMe = !opt || opt.keepMe !== false;
    this._pullingSelf = true;
    const s = App.state;
    const prevMe = s.meId;

    if(st.members) s.members = st.members;
    if(st.schedules) s.schedules = st.schedules;
    if(st.todos) s.todos = st.todos;
    if(st.reward) s.reward = st.reward;
    if(typeof st.coins === 'number') s.coins = st.coins;
    if(st.doneEv) s.doneEv = st.doneEv;
    if(st.badges) s.badges = st.badges;
    if(st.groupOpts) s.groupOpts = st.groupOpts;

    if(keepMe){
      /* 우선 uid 로 나를 찾는다. 이름이 바뀌어도 흔들리지 않는다. */
      const byUid = (s.members||[]).find(m => m.uid && m.uid === this._uid);
      if(byUid) s.meId = byUid.id;
      else if((s.members||[]).some(m => m.id === prevMe)) s.meId = prevMe;
      /* 둘 다 아니면 migrate 가 첫 멤버로 떨어뜨린다 */
    }
    App.migrate();
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
      busy:     ['busy',  this.pending() ? '가족의 확인을 기다리는 중' : '동기화 중…', this._statusMsg],
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
           <div class="sy-meline">
             <span class="sy-meav">${esc((App.me()||{}).emoji||'🙂')}</span>
             <span class="sy-metx">
               <b>${esc((App.me()||{}).name||'나')}</b>
               <small>이 기기는 ${esc(ROLE_LABEL[(App.me()||{}).role]||'아이')}로 연결돼 있어요</small>
             </span>
           </div>
           <div class="sy-members">
             ${(App.state.members||[]).map(m=>`<span class="sy-mem ${m.uid?'':'off'}">
               <i></i>${esc(m.emoji)} ${esc(m.name)}
               <em style="font-style:normal;opacity:.62">${m.uid?'':'· 기기 없음'}</em></span>`).join('')}
           </div>
           ${App.can('invite') ? `<button class="btn full" id="syInvite" style="margin-top:16px">가족 초대하기</button>` : ''}
           <p class="sy-note">
             초대는 <b>누구로 들어올지 정해서</b> 발급합니다.
             받는 사람은 역할을 고를 수 없어서, 아이가 부모로 들어오는 일이 없어요.
           </p>
           ${App.can('manageMembers') ? `
             <div class="sy-opt" id="syApproval">
               <span class="sy-opt-tx">
                 <b>참여할 때 내 확인 받기</b>
                 <small>초대 코드를 넣어도 내가 눌러줘야 연결돼요</small>
               </span>
               <span class="sy-sw ${this.needsApproval()?'on':''}"><i></i></span>
             </div>
             <div id="syReqs"></div>` : ''}
           <button class="btn line full" id="syLeave" style="margin-top:18px">이 기기 연결 끊기</button>
         ` : this.pending() ? `
           <div class="iv-card">
             <div class="iv-card-av">${esc(this.pending().emoji||'🙂')}</div>
             <div class="iv-card-nm">${esc(this.pending().name||'가족')}</div>
             <div class="iv-card-rl">가족의 확인을 기다리는 중이에요</div>
           </div>
           <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.75;text-align:center">
             마스터가 <b>확인해 주면 바로 연결</b>됩니다.<br>
             이 화면을 닫아도 괜찮아요. 승인되면 알려드릴게요.
           </p>
           <button class="btn full" id="syCheck">지금 확인해 보기</button>
           <button class="btn line full" id="syCancel" style="margin-top:10px">요청 취소하기</button>
         ` : `
           <button class="btn full" id="syCreate" style="margin-bottom:12px">새 가족 그룹 만들기</button>
           <div class="field" style="margin-top:18px">
             <label>받은 초대 코드로 참여하기</label>
             <input class="inp" id="syCode" placeholder="ABCD-1234" maxlength="9"
               style="text-align:center;letter-spacing:.14em;font-family:'SFMono-Regular',Menlo,monospace;text-transform:uppercase">
           </div>
           <button class="btn line full" id="syJoin">초대 코드로 참여하기</button>
           <p class="sy-note">
             그룹을 만든 사람이 <b>마스터</b>가 되고, 권한을 정합니다.
             참여할 때는 초대장에 적힌 프로필로 들어가요.
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
    },
    "invites": {
      "$token": {
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
          join.textContent = '확인하는 중…'; join.disabled = true;
          try{
            const inv = await this.peekInvite(v);
            App.closeSheet();
            setTimeout(() => this.openInvite(inv), 260);
          }catch(e){
            join.textContent = '초대 코드로 참여하기'; join.disabled = false;
            App.toast(e.message || '들어가지 못했어요');
          }
        };

        const invBtn = $('#syInvite');
        if(invBtn) invBtn.onclick = () => {
          App.closeSheet();
          setTimeout(() => this.openInviteIssue(), 240);
        };

        /* 승인 대기 중인 기기 쪽 */
        const chk = $('#syCheck');
        if(chk) chk.onclick = async () => {
          chk.textContent = '확인하는 중…'; chk.disabled = true;
          const done = await this.checkPending().catch(() => false);
          if(done) App.closeSheet();
          else { chk.textContent = '지금 확인해 보기'; chk.disabled = false;
                 App.toast('아직 확인 전이에요 · 조금만 기다려 주세요'); }
        };
        const cancel = $('#syCancel');
        if(cancel) cancel.onclick = () => {
          this.cancelPending(); App.closeSheet(); App.toast('요청을 취소했어요');
        };

        /* 마스터 — 승인 토글과 대기 목록 */
        const ap = $('#syApproval');
        if(ap) ap.onclick = async () => {
          const sw = ap.querySelector('.sy-sw');
          const next = !sw.classList.contains('on');
          sw.classList.toggle('on', next);
          try{
            await this.setApproval(next);
            App.toast(next ? '이제 참여할 때 확인을 받아요' : '확인 없이 바로 연결돼요');
          }catch(e){ sw.classList.toggle('on', !next); App.toast(e.message || '바꾸지 못했어요'); }
        };
        const reqBox = $('#syReqs');
        if(reqBox) this._paintRequests(reqBox);

        const copy = $('#syCopy');
        if(copy) copy.onclick = () => {
          const code = App.state.sync.group;
          const done = () => App.toast('초대 코드를 복사했어요');
          if(navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(code).then(done).catch(() => App.toast('복사에 실패했어요'));
          else App.toast('복사에 실패했어요');
        };

        const leave = $('#syLeave');
        if(leave) leave.onclick = async () => {
          leave.textContent = '끊는 중…'; leave.disabled = true;
          await this.leaveGroup();          // 가족에게 "기기 없음"을 먼저 알린 뒤 끊는다
          App.closeSheet();
          App.toast('연결을 끊었어요 · 같은 초대 코드로 다시 들어올 수 있어요');
        };
      });
  },

  /* 대기 목록을 그린다 — 시트가 열려 있는 동안만 */
  async _paintRequests(box){
    let reqs = [];
    try{ reqs = await this.listRequests(); }catch(e){}
    if(!box.isConnected) return;
    if(!reqs.length){ box.innerHTML = ''; return; }
    box.innerHTML = `
      <div class="field" style="margin-top:16px"><label>기다리는 사람 ${reqs.length}명</label>
        <div class="iv-list">
          ${reqs.map(q => `<div class="iv-opt" style="cursor:default">
            <span class="iv-av">${esc(q.emoji||'🙂')}</span>
            <span class="iv-tx"><b>${esc(q.name||'가족')}</b><small>${esc(ROLE_LABEL[q.role]||'아이')}로 참여하려고 해요</small></span>
            <span class="sy-reqbtns">
              <button class="sy-no"  data-no="${esc(q.uid)}">거절</button>
              <button class="sy-yes" data-yes="${esc(q.uid)}">확인</button>
            </span></div>`).join('')}
        </div>
      </div>`;
    const find = uid => reqs.find(x => x.uid === uid);
    box.querySelectorAll('[data-yes]').forEach(b => b.onclick = async () => {
      b.disabled = true;
      try{
        const m = await this.approveRequest(find(b.dataset.yes));
        App.toast(`${m.emoji} ${m.name}의 참여를 확인했어요`);
        if(window.ModSound) ModSound.play('complete');
        this._paintRequests(box);
      }catch(e){ b.disabled = false; App.toast(e.message || '확인하지 못했어요'); }
    });
    box.querySelectorAll('[data-no]').forEach(b => b.onclick = async () => {
      b.disabled = true;
      try{ await this.rejectRequest(find(b.dataset.no)); App.toast('요청을 거절했어요'); this._paintRequests(box); }
      catch(e){ b.disabled = false; App.toast(e.message || '거절하지 못했어요'); }
    });
  },

  /* ================= 초대 발급 (마스터·권한자) ================= */
  openInviteIssue(){
    if(!App.can('invite')) return App.toast('초대할 권한이 없어요');
    const list = App.state.members.filter(m => m.role !== 'master');

    const body = `
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.7">
        <b>누구로 들어올지</b> 먼저 정해요.<br>
        받는 사람은 역할을 바꿀 수 없어서 안전합니다.
      </p>
      ${list.length ? `
        <div class="field"><label>가족 프로필</label>
          <div class="iv-list">
            ${list.map(m => `<button class="iv-opt" data-id="${esc(m.id)}">
                <span class="iv-av">${esc(m.emoji)}</span>
                <span class="iv-tx"><b>${esc(m.name)}</b><small>${esc(ROLE_LABEL[m.role]||'아이')}${m.uid?' · 기기 연결됨':''}</small></span>
                <span class="iv-go">${m.invite?'코드 보기':'초대'} →</span>
              </button>`).join('')}
          </div>
          <p style="margin:9px 2px 0;font-size:11.5px;font-weight:700;color:var(--muted);line-height:1.6">
            이미 연결된 사람도 <b>같은 코드</b>를 다시 쓸 수 있어요.<br>
            기기를 바꾸거나 앱을 새로 설치했을 때 넣으면 됩니다.
          </p>
        </div>` : `
        <div class="panel" style="padding:14px 15px;margin-bottom:16px">
          <div style="font-size:12.5px;font-weight:700;color:var(--ink2);line-height:1.6">
            초대할 프로필이 없어요.<br>아래에서 새로 만들어 주세요.
          </div>
        </div>`}
      <div class="field" style="margin-top:6px"><label>새로 만들어 초대하기</label>
        <input class="inp" id="ivName" placeholder="이름 (예: 아빠, 둘째)" maxlength="12">
        <div class="iv-role" id="ivRole" style="margin-top:10px">
          <button class="iv-rb on" data-r="child">🐣 아이</button>
          <button class="iv-rb" data-r="parent">🌷 부모</button>
        </div>
      </div>
      <button class="btn full" id="ivNew">만들고 초대 코드 받기</button>
      `;

    App.sheet('가족 초대하기', body, `<button class="btn line full" id="ivC">닫기</button>`, (b,f) => {
      f.querySelector('#ivC').onclick = () => App.closeSheet();
      let role = 'child';
      b.querySelectorAll('#ivRole .iv-rb').forEach(r => r.onclick = () => {
        role = r.dataset.r;
        b.querySelectorAll('#ivRole .iv-rb').forEach(x => x.classList.toggle('on', x === r));
      });
      const issue = async (memberId, btn, label) => {
        btn.textContent = '발급하는 중…'; btn.disabled = true;
        try{
          const token = await this.createInvite(memberId);
          App.closeSheet();
          setTimeout(() => this.showInviteCode(token, App.member(memberId)), 260);
        }catch(e){
          btn.textContent = label; btn.disabled = false;
          App.toast(e.message || '발급하지 못했어요');
        }
      };
      b.querySelectorAll('.iv-opt').forEach(o => o.onclick = () => issue(o.dataset.id, o, '초대 →'));
      b.querySelector('#ivNew').onclick = () => {
        const name = (b.querySelector('#ivName').value || '').trim();
        if(!name) return App.toast('이름을 적어 주세요');
        const m = App.newMember({ name, emoji: role === 'parent' ? '🌷' : '🐣', role });
        App.save();
        issue(m.id, b.querySelector('#ivNew'), '만들고 초대 코드 받기');
      };
    });
  },

  showInviteCode(token, member){
    const url = App.appUrl() + '?invite=' + encodeURIComponent(token);
    const body = `
      <div class="iv-card">
        <div class="iv-card-av">${esc((member||{}).emoji||'🙂')}</div>
        <div class="iv-card-nm">${esc((member||{}).name||'가족')}</div>
        <div class="iv-card-rl">${esc(ROLE_LABEL[(member||{}).role]||'아이')}로 참여합니다</div>
      </div>
      <div class="sy-code">${esc(token)}</div>
      <button class="btn full" id="ivCopy">초대 링크 복사하기</button>
      <p class="sy-note">
        이 코드는 <b>${esc((member||{}).name||'이 사람')} 전용</b>이에요. 여러 번 써도 됩니다.<br>
        <b>브라우저에서 쓰다가 홈 화면에 앱을 설치했다면</b>, 앱에서 같은 코드를 한 번 더 넣어 주세요.
        같은 사람으로 이어집니다. 기기를 바꿀 때도 마찬가지예요.
      </p>
      ${window.ModQR ? `<div id="ivQR" style="display:flex;justify-content:center;margin-top:16px"></div>` : ''}
      ${App.can('invite') ? `<button class="btn line full" id="ivRe" style="margin-top:18px">코드 새로 만들기</button>
      <p class="sy-note">코드가 남에게 새어 나갔을 때만 쓰세요. 새로 만들면 <b>예전 코드는 못 쓰게</b> 됩니다.</p>` : ''}`;
    App.sheet('초대 코드', body, `<button class="btn line full" id="ivkC">닫기</button>`, (b,f) => {
      f.querySelector('#ivkC').onclick = () => App.closeSheet();
      b.querySelector('#ivCopy').onclick = () => {
        const txt = `KUMA routine 가족 초대\n${(member||{}).name||''} 님으로 참여해 주세요\n${url}`;
        if(navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(txt).then(() => App.toast('초대 링크를 복사했어요'))
            .catch(() => App.toast('복사에 실패했어요'));
        else App.toast('복사에 실패했어요');
      };
      const re = b.querySelector('#ivRe');
      if(re) re.onclick = async () => {
        re.textContent = '만드는 중…'; re.disabled = true;
        try{
          const t2 = await this.createInvite((member||{}).id, {reissue:true});
          App.closeSheet();
          setTimeout(() => this.showInviteCode(t2, App.member((member||{}).id)), 260);
          App.toast('새 코드를 만들었어요 · 예전 코드는 이제 안 돼요');
        }catch(e){
          re.textContent = '코드 새로 만들기'; re.disabled = false;
          App.toast(e.message || '만들지 못했어요');
        }
      };
      const q = b.querySelector('#ivQR');
      if(q && window.ModQR && ModQR.render) { try{ ModQR.render(q, url, 168); }catch(e){} }
    });
  },

  /* ================= 초대 받기 ================= */
  async openInvite(invOrToken){
    let inv = invOrToken;
    try{
      if(typeof inv === 'string') inv = await this.peekInvite(inv);
    }catch(e){ return App.toast(e.message || '초대를 확인하지 못했어요'); }

    const bundle = App.hasAnyData() ? App.localBundle() : null;
    const body = `
      <div class="iv-card">
        <div class="iv-card-av">${esc(inv.emoji||'🙂')}</div>
        <div class="iv-card-nm">${esc(inv.name||'가족')}</div>
        <div class="iv-card-rl">${esc(ROLE_LABEL[inv.role]||'아이')}로 참여해요</div>
      </div>
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.7;text-align:center">
        이 기기는 앞으로 <b>${esc(inv.name||'이 사람')}</b>의 기기가 됩니다.<br>
        가족의 일정이 실시간으로 함께 보여요.
      </p>
      ${bundle ? `
        <div class="field"><label>이 기기에 있던 일정 ${bundle.count}개</label>
          <div class="iv-list">
            <button class="iv-opt iv-pick on" data-k="keep">
              <span class="iv-av">📦</span>
              <span class="iv-tx"><b>가져올래요</b><small>내 프로필 밑으로 옮겨서 함께 봐요</small></span>
            </button>
            <button class="iv-opt iv-pick" data-k="drop">
              <span class="iv-av">✨</span>
              <span class="iv-tx"><b>새로 시작할래요</b><small>가족의 일정만 받아옵니다</small></span>
            </button>
          </div>
        </div>` : ''}`;

    App.sheet('가족 초대를 받았어요', body,
      `<button class="btn line" id="ivnLater" style="flex:0 0 96px">나중에</button>
       <button class="btn full" id="ivnGo">참여하기</button>`, (b,f) => {
      let keep = true;
      b.querySelectorAll('.iv-pick').forEach(p => p.onclick = () => {
        keep = p.dataset.k === 'keep';
        b.querySelectorAll('.iv-pick').forEach(x => x.classList.toggle('on', x === p));
      });
      f.querySelector('#ivnLater').onclick = () => App.closeSheet();
      const go = f.querySelector('#ivnGo');
      go.onclick = async () => {
        go.textContent = '참여하는 중…'; go.disabled = true;
        try{
          const r = await this.acceptInvite(inv, keep ? bundle : null);
          App.closeSheet();
          if(r.pending){
            App.toast(`${r.member.emoji} ${r.member.name} · 가족의 확인을 기다리는 중이에요`);
            setTimeout(() => this.open(), 320);
            return;
          }
          App.toast(r.moved
            ? `${r.member.emoji} ${r.member.name} · 이 기기로 옮겨왔어요`
            : `${r.member.emoji} ${r.member.name}(으)로 참여했어요` + (r.merged ? ` · ${r.merged}개 가져옴` : ''));
          if(window.ModSound) ModSound.play('complete');
          App.render();
        }catch(e){
          go.textContent = '참여하기'; go.disabled = false;
          App.toast(e.message || '참여하지 못했어요');
        }
      };
    });
  }
};

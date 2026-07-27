window.ModBadge = {
  css: `
    /* ---- 배지 컬렉션 시트 ---- */
    .bd-progress{ margin-bottom:16px; }
    .bd-progress-top{ font-size:13px; font-weight:700; color:var(--ink2); margin-bottom:8px; }
    .bd-progress-top b{ font-size:19px; color:var(--orange); font-weight:800; }
    .bd-progress-bar{ height:10px; border-radius:6px; background:var(--line); overflow:hidden; }
    .bd-progress-fill{ height:100%; background:var(--orange); border-radius:6px; transition:width .5s cubic-bezier(.22,1,.36,1); }

    .bd-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .bd-cell{
      display:flex; flex-direction:column; align-items:center; text-align:center; gap:4px;
      padding:14px 6px 12px; border-radius:var(--r-m); background:var(--bg); min-height:96px;
      justify-content:center; transition:transform .15s, background .2s;
    }
    .bd-cell.got{ background:var(--indigo-s); cursor:pointer; }
    .bd-cell.got:active{ transform:scale(.95); }
    .bd-cell-badge{ font-size:32px; line-height:1; }
    .bd-cell.locked .bd-cell-badge{ filter:grayscale(1); opacity:.4; }
    .bd-cell-name{ font-size:11.5px; font-weight:800; color:var(--ink); line-height:1.25; }
    .bd-cell.locked .bd-cell-name{ color:var(--muted); }
    .bd-cell-date{ font-size:9.5px; font-weight:700; color:var(--indigo-d); }
    .bd-cell-desc{ font-size:9px; font-weight:600; color:var(--muted-soft); line-height:1.35; }

    /* ---- 획득 연출 오버레이 ---- */
    .bd-earn{
      position:absolute; inset:0; z-index:250; overflow:hidden;
      display:flex; align-items:center; justify-content:center;
      background:rgba(10,10,18,.64); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
      animation:bd-fade-in .22s cubic-bezier(.22,1,.36,1);
    }
    .bd-earn.bd-earn--out{ animation:bd-fade-out .24s cubic-bezier(.4,0,1,1) forwards; }
    @keyframes bd-fade-in{ from{ opacity:0; } to{ opacity:1; } }
    @keyframes bd-fade-out{ to{ opacity:0; } }

    .bd-earn-rays{
      position:absolute; width:460px; height:460px; border-radius:50%;
      background:conic-gradient(from 0deg,
        rgba(255,255,255,.24) 0deg 9deg, transparent 9deg 28deg,
        rgba(255,255,255,.18) 28deg 37deg, transparent 37deg 56deg,
        rgba(255,255,255,.24) 56deg 65deg, transparent 65deg 84deg,
        rgba(255,255,255,.18) 84deg 93deg, transparent 93deg 112deg,
        rgba(255,255,255,.24) 112deg 121deg, transparent 121deg 140deg,
        rgba(255,255,255,.18) 140deg 149deg, transparent 149deg 168deg,
        rgba(255,255,255,.24) 168deg 177deg, transparent 177deg 196deg,
        rgba(255,255,255,.18) 196deg 205deg, transparent 205deg 224deg,
        rgba(255,255,255,.24) 224deg 233deg, transparent 233deg 252deg,
        rgba(255,255,255,.18) 252deg 261deg, transparent 261deg 280deg,
        rgba(255,255,255,.24) 280deg 289deg, transparent 289deg 308deg,
        rgba(255,255,255,.18) 308deg 317deg, transparent 317deg 336deg,
        rgba(255,255,255,.24) 336deg 345deg, transparent 345deg 360deg);
      animation:bd-spin 10s linear infinite;
    }
    @keyframes bd-spin{ from{ transform:rotate(0deg); } to{ transform:rotate(360deg); } }

    .bd-earn-card{ position:relative; width:270px; display:flex; flex-direction:column; align-items:center; text-align:center; }
    .bd-earn-badge{
      width:118px; height:118px; border-radius:50%; background:var(--paper); box-shadow:var(--sh-3);
      display:flex; align-items:center; justify-content:center; margin-bottom:16px;
      animation:bd-pop .6s cubic-bezier(.2,1.5,.4,1);
    }
    @keyframes bd-pop{
      0%{ transform:scale(0) rotate(-50deg); opacity:0; }
      55%{ transform:scale(1.15) rotate(8deg); opacity:1; }
      100%{ transform:scale(1) rotate(0deg); opacity:1; }
    }
    .bd-earn-emoji{ font-size:56px; line-height:1; }
    .bd-earn-tag{
      font-size:11px; font-weight:800; letter-spacing:.14em; color:#FF9D6B;
      background:rgba(255,157,107,.16); border-radius:10px; padding:4px 10px; margin-bottom:9px;
    }
    .bd-earn-name{ font-size:20px; font-weight:800; color:#fff; margin-bottom:6px; }
    .bd-earn-desc{ font-size:13px; font-weight:600; color:rgba(255,255,255,.82); margin-bottom:22px; line-height:1.5; }
    .bd-earn-ok{ width:100%; }
    .bd-earn-queue{ font-size:11.5px; font-weight:700; color:rgba(255,255,255,.6); margin-top:10px; }
  `,

  _queue: [],
  _queueShowing: false,
  _earnTimer: null,

  init(){
    if(!App || !App.state) return;
    App.state.badges = App.state.badges || {};
  },

  _list(){
    return [
      { id:'first_todo', emoji:'✅', name:'첫 발걸음', desc:'할 일을 처음으로 완료했어요',
        test: s => (s.todos || []).some(t => t.done) },

      { id:'day_all_done', emoji:'🌟', name:'오늘 다 했어요', desc:'하루의 할 일을 모두 끝냈어요',
        test: () => {
          for(let d = 0; d < 7; d++){
            const list = App.todosOf(d, 0).filter(t => App.canSee(t));
            if(list.length > 0 && list.every(t => t.done)) return true;
          }
          return false;
        } },

      { id:'streak3', emoji:'🔥', name:'꾸준함 뱃지', desc:'한 주에 3일이나 하루 할 일을 다 끝냈어요',
        test: () => {
          let count = 0;
          for(let d = 0; d < 7; d++){
            const list = App.todosOf(d, 0).filter(t => App.canSee(t));
            if(list.length > 0 && list.every(t => t.done)) count++;
          }
          return count >= 3;
        } },

      { id:'coin100', emoji:'🪙', name:'코인 부자', desc:'코인을 100개 모았어요',
        test: s => (s.coins || 0) >= 100 },

      { id:'coin500', emoji:'💰', name:'코인 갑부', desc:'코인을 500개나 모았어요',
        test: s => (s.coins || 0) >= 500 },

      { id:'prep_day', emoji:'🎒', name:'완벽 준비', desc:'준비물을 하루치 모두 챙겼어요',
        test: s => {
          const packed = App.packed || {};
          const sched = s.schedules || {};
          return Object.keys(sched).some(mid => {
            const byDay = sched[mid] || {};
            return Object.keys(byDay).some(d => {
              const evs = (byDay[d] || []).filter(ev => App.canSee(ev) && (ev.items || []).length > 0);
              if(evs.length === 0) return false;
              return evs.every(ev => (ev.items || []).every(it => !!packed[`${d}|${ev.id}|${it}`]));
            });
          });
        } },

      { id:'prep20', emoji:'🧳', name:'준비물 마스터', desc:'준비물을 20개나 챙겼어요',
        test: () => {
          const packed = App.packed || {};
          return Object.keys(packed).filter(k => packed[k]).length >= 20;
        } },

      { id:'game_first', emoji:'🎮', name:'첫 게임 도전', desc:'미니게임을 처음 플레이했어요',
        test: s => {
          const hist = (s.reward && s.reward.history) || [];
          return hist.some(h => h.tier === 'gold' || h.tier === 'silver' || h.tier === 'bronze');
        } },

      { id:'game_gold', emoji:'🏆', name:'골드 획득!', desc:'미니게임에서 골드를 뽑았어요',
        test: s => {
          const hist = (s.reward && s.reward.history) || [];
          return hist.some(h => h.tier === 'gold');
        } },

      { id:'sched10', emoji:'🗓️', name:'일정 정리왕', desc:'일정을 10개 넘게 등록했어요',
        test: s => {
          const sched = s.schedules || {};
          let count = 0;
          Object.keys(sched).forEach(mid => {
            const byDay = sched[mid] || {};
            Object.keys(byDay).forEach(d => { count += (byDay[d] || []).length; });
          });
          return count >= 10;
        } },

      { id:'sched_repeat', emoji:'🔁', name:'반복의 힘', desc:'매주 반복되는 일정을 만들었어요',
        test: s => {
          const sched = s.schedules || {};
          return Object.keys(sched).some(mid => {
            const byDay = sched[mid] || {};
            return Object.keys(byDay).some(d => (byDay[d] || []).some(ev => !!ev.repeat));
          });
        } },

      { id:'family3', emoji:'👨‍👩‍👧', name:'우리 가족', desc:'가족 구성원을 3명 모았어요',
        test: s => (s.members || []).length >= 3 }
    ];
  },

  check(reason){
    if(!App || !App.state) return false;
    App.state.badges = App.state.badges || {};
    const earned = App.state.badges;
    const list = this._list();
    const fresh = [];

    list.forEach(b => {
      if(earned[b.id]) return;
      let ok = false;
      try{ ok = !!b.test(App.state, reason); }catch(e){ ok = false; }
      if(ok) fresh.push(b);
    });

    if(fresh.length === 0) return false;

    fresh.forEach(b => { earned[b.id] = new Date().toISOString(); });
    App.save();

    /* 'silent' 은 앱 시작 시 이미 달성돼 있던 배지를 연출 없이 반영 */
    if(reason === 'silent') return true;

    fresh.forEach(b => this._queue.push(b));
    if(!this._queueShowing) this._advanceQueue();

    return true;
  },

  earnedCount(){
    if(!App || !App.state || !App.state.badges) return 0;
    return Object.keys(App.state.badges).length;
  },

  _advanceQueue(){
    if(this._queue.length === 0){ this._queueShowing = false; return; }
    this._queueShowing = true;
    const badge = this._queue.shift();
    this._showEarnOverlay(badge, () => this._advanceQueue());
  },

  _showEarnOverlay(badge, onDone){
    const phone = document.getElementById('phone');
    if(!phone){ onDone(); return; }

    clearTimeout(this._earnTimer);
    const prev = phone.querySelector('.bd-earn');
    if(prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.className = 'bd-earn';
    overlay.innerHTML = `
      <div class="bd-earn-rays"></div>
      <div class="bd-earn-card">
        <div class="bd-earn-badge"><span class="bd-earn-emoji">${badge.emoji}</span></div>
        <div class="bd-earn-tag">NEW BADGE</div>
        <div class="bd-earn-name">${this._esc(badge.name)}</div>
        <div class="bd-earn-desc">${this._esc(badge.desc)}</div>
        <button type="button" class="btn full bd-earn-ok">좋아요!</button>
        ${this._queue.length > 0 ? `<div class="bd-earn-queue">다음 배지가 ${this._queue.length}개 더 있어요</div>` : ''}
      </div>
    `;
    phone.appendChild(overlay);
    if(App.haptic) App.haptic();
    window.ModSound && ModSound.play('badge');

    const close = () => {
      clearTimeout(this._earnTimer);
      overlay.classList.add('bd-earn--out');
      setTimeout(() => {
        if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
        onDone();
      }, 260);
    };

    overlay.querySelector('.bd-earn-ok').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });

    this._earnTimer = setTimeout(close, 4200);
  },

  open(){
    const list = this._list();
    const earned = (App.state && App.state.badges) || {};
    const total = list.length;
    const got = Object.keys(earned).filter(id => earned[id] && list.some(b => b.id === id)).length;
    const pct = total ? Math.round((got / total) * 100) : 0;

    const body = `
      <div class="bd-progress">
        <div class="bd-progress-top"><b>${got}</b> / ${total} 모았어요</div>
        <div class="bd-progress-bar"><div class="bd-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="bd-grid">
        ${list.map(b => {
          const at = earned[b.id];
          return `
            <div class="bd-cell ${at ? 'got' : 'locked'}" data-badge="${b.id}">
              <div class="bd-cell-badge">${b.emoji}</div>
              <div class="bd-cell-name">${this._esc(b.name)}</div>
              ${at
                ? `<div class="bd-cell-date">${this._fmtDate(at)}</div>`
                : `<div class="bd-cell-desc">${this._esc(b.desc)}</div>`}
            </div>
          `;
        }).join('')}
      </div>
    `;

    App.sheet('배지 컬렉션 🏅', body, '', (bodyEl) => {
      bodyEl.querySelectorAll('.bd-cell.got').forEach(cell => {
        cell.addEventListener('click', () => {
          const b = list.find(x => x.id === cell.dataset.badge);
          if(!b) return;
          this._queue.push(b);
          if(!this._queueShowing) this._advanceQueue();
        });
      });
    });
  },

  _fmtDate(iso){
    try{
      const d = new Date(iso);
      if(isNaN(d.getTime())) return '';
      return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    }catch(e){ return ''; }
  },

  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
};

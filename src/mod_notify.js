window.ModNotify = {
  css: `
    /* ---- 알림 센터 시트 헤더 ---- */
    .nt-sheet-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .nt-sheet-head-label{ font-size:12px; font-weight:800; color:var(--muted); }
    .nt-gear-btn{
      width:36px; height:36px; border-radius:12px; background:var(--bg); font-size:16px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      transition:transform .15s cubic-bezier(.22,1,.36,1), background .2s;
    }
    .nt-gear-btn:active{ transform:scale(.9); background:var(--indigo-s); }

    /* ---- 알림 목록 ---- */
    .nt-list{ display:flex; flex-direction:column; gap:8px; }
    .nt-item{
      display:flex; align-items:flex-start; gap:10px; background:var(--paper);
      border-radius:var(--r-l); box-shadow:var(--sh-1); padding:12px 13px; transition:opacity .25s;
    }
    .nt-item.past{ opacity:.48; }
    .nt-item-time{
      flex:0 0 46px; font-size:10.5px; font-weight:800; color:var(--muted); line-height:1.4; padding-top:1px;
    }
    .nt-item-time b{ display:block; font-size:13px; font-weight:800; color:var(--ink); }
    .nt-item-icon{
      flex:0 0 auto; width:34px; height:34px; border-radius:11px; background:var(--indigo-s);
      font-size:16px; display:flex; align-items:center; justify-content:center;
    }
    .nt-item-main{ flex:1; min-width:0; }
    .nt-item-title{ font-size:13.5px; font-weight:800; color:var(--ink); }
    .nt-item-body{
      font-size:11.5px; font-weight:600; color:var(--muted); margin-top:2px;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .nt-item-right{ flex:0 0 auto; display:flex; align-items:center; padding-top:2px; }
    .nt-item-sent{
      font-size:10px; font-weight:800; color:var(--muted); background:var(--bg);
      padding:4px 8px; border-radius:8px;
    }
    .nt-item-toggle{
      width:40px; height:24px; border-radius:14px; background:#DEDEE6; position:relative;
      transition:background .2s; flex:0 0 auto;
    }
    .nt-item-toggle::after{
      content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%;
      background:#fff; box-shadow:var(--sh-1); transition:left .2s cubic-bezier(.3,1.4,.5,1);
    }
    .nt-item-toggle.on{ background:var(--indigo); }
    .nt-item-toggle.on::after{ left:19px; }

    .nt-divider{
      display:flex; align-items:center; gap:8px; margin:2px 0; color:var(--muted);
      font-size:10.5px; font-weight:800; letter-spacing:.04em;
    }
    .nt-divider::before, .nt-divider::after{ content:''; flex:1; height:1px; background:var(--line); }

    /* ---- 알림 설정 ---- */
    .nt-lead-row{ display:flex; gap:8px; flex-wrap:wrap; }
    .nt-lead-chip{
      flex:1; min-width:64px; height:44px; border-radius:var(--r-m); border:1.5px solid var(--line);
      font-size:13px; font-weight:800; color:var(--ink2); display:flex; align-items:center; justify-content:center;
      transition:border-color .18s cubic-bezier(.22,1,.36,1), background .18s cubic-bezier(.22,1,.36,1),
                 color .18s cubic-bezier(.22,1,.36,1), transform .15s;
    }
    .nt-lead-chip:active{ transform:scale(.96); }
    .nt-lead-chip.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo-d); }

    .nt-seg{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px; background:var(--bg); border-radius:var(--r-m); padding:5px; }
    .nt-seg-btn{
      height:42px; border-radius:10px; font-size:12px; font-weight:800; color:var(--ink2); opacity:.6;
      transition:background .2s cubic-bezier(.22,1,.36,1), opacity .2s, color .2s, box-shadow .2s;
    }
    .nt-seg-btn.on{ background:var(--paper); color:var(--indigo-d); opacity:1; box-shadow:var(--sh-1); }

    .nt-quiet-times{ margin-top:2px; }

    /* ---- 인앱 배너 (상단 슬라이드 다운) ---- */
    .nt-banner{
      position:absolute; top:0; left:10px; right:10px; z-index:180;
      display:flex; align-items:flex-start; gap:10px;
      padding:13px 14px 14px; border-radius:20px;
      background:rgba(255,255,255,.86);
      -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px);
      box-shadow:0 16px 36px rgba(20,20,50,.24), 0 2px 8px rgba(20,20,50,.10);
      border:1px solid rgba(255,255,255,.6);
      transform:translateY(-120%); transform-origin:top center;
      transition:transform .42s cubic-bezier(.22,1,.36,1), opacity .3s;
      touch-action:none; cursor:pointer; margin-top:calc(10px + env(safe-area-inset-top));
    }
    .nt-banner-icon{
      flex:0 0 auto; width:38px; height:38px; border-radius:12px; background:var(--indigo);
      color:#fff; font-size:17px; font-weight:800; display:flex; align-items:center; justify-content:center;
    }
    .nt-banner[data-tone="good"] .nt-banner-icon{ background:#3FBF7F; }
    .nt-banner[data-tone="warn"] .nt-banner-icon{ background:var(--orange); }
    .nt-banner-main{ flex:1; min-width:0; }
    .nt-banner-top{ display:flex; align-items:center; gap:5px; margin-bottom:2px; }
    .nt-banner-app{ font-size:11px; font-weight:800; color:var(--ink2); letter-spacing:.01em; }
    .nt-banner-dot{ font-size:10px; color:var(--muted); }
    .nt-banner-now{ font-size:11px; font-weight:700; color:var(--muted); }
    .nt-banner-title{ font-size:13.5px; font-weight:800; color:var(--ink); margin-top:1px; }
    .nt-banner-text{
      font-size:12px; font-weight:600; color:var(--ink2); margin-top:2px; line-height:1.4;
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    }
  `,

  /* ================= 부팅 ================= */
  init(){
    if(!App.state.notify){
      App.state.notify = {
        lead:10,
        prepLead:'night',
        todoDaily:true,
        rewardOn:true,
        quiet:{ on:true, from:'22:00', to:'07:00' },
        read:[],
        log:[]
      };
      App.save();
    }
    this._stack = this._stack || [];

    // 이미 지난 시각의 알림은 부팅 시점에 "이미 지나감"으로 처리해서
    // 새로고침할 때마다 배너가 한꺼번에 쏟아지지 않게 함.
    // (시간 미리보기를 되감으면 이 표시가 초기화되어 다시 재생됨)
    this._fired = new Set();
    const now = App.nowMin();
    this._computeToday().forEach(it => { if(it.time <= now) this._fired.add(it.id); });
    this._lastKnownNow = now;

    if(this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => this._tick(), 3000);
  },

  _tick(){
    if(!App.state.notify) return;
    const now = App.nowMin();
    if(this._lastKnownNow != null && now < this._lastKnownNow - 1){
      this._fired = new Set(); // 시간이 되감김 -> 다시 알릴 수 있게 초기화
    }
    this._lastKnownNow = now;

    this._computeToday().forEach(it => {
      if(it.time <= now && !this._fired.has(it.id)){
        this._fired.add(it.id);
        this._fireItem(it);
      }
    });
  },

  _fireItem(it){
    const payload = { emoji:it.icon, title:it.title, body:it.body, tone:it.tone };
    if(this._inQuiet(App.nowMin())){
      this._log(payload); // 방해 금지 시간엔 배너 없이 기록만
    } else {
      this.push(payload);
    }
  },

  _inQuiet(min){
    const q = App.state.notify && App.state.notify.quiet;
    if(!q || !q.on) return false;
    const from = toMin(q.from), to = toMin(q.to);
    if(from === to) return false;
    if(from < to) return min >= from && min < to;
    return min >= from || min < to; // 자정을 넘어가는 구간
  },

  /* ================= 오늘의 알림 계산 ================= */
  _ampm(min){
    const h = Math.floor((((min % 1440) + 1440) % 1440) / 60);
    return h < 12 ? '오전' : '오후';
  },

  _computeToday(){
    if(!App.state.notify) return [];
    const cfg = App.state.notify;
    const vm = App.vm();
    const items = [];

    // 1) 일정 시작 알림 — 알림은 항상 "이번 주" 기준(w=0)
    App.evs(App.today, 0, vm).forEach(ev => {
      if(!ev.alarm || !App.canSee(ev)) return;
      const t = toMin(ev.s) - (cfg.lead || 10);
      items.push({
        id:`nt:${vm}:sched:${ev.id}`, time:t, icon:'🔔', tone:'info',
        title:`${cfg.lead}분 후 ${esc(ev.t)} 시작`,
        body:`${this._ampm(toMin(ev.s))} ${disp(toMin(ev.s))} 시작`,
        toggleType:'sched', schedId:ev.id, schedDay:App.today, schedWeek:0
      });
    });

    // 2) 준비물 알림
    if(cfg.prepLead === 'night'){
      const tmr = (App.today + 1) % 7;
      // 오늘이 토요일이면 "내일"은 다음 주 일요일이 된다
      const tmrW = App.today === 6 ? 1 : 0;
      App.evs(tmr, tmrW, vm).forEach(ev => {
        if(!ev.alarm || !ev.items || !ev.items.length || !App.canSee(ev)) return;
        items.push({
          id:`nt:${vm}:prep:${ev.id}`, time:21 * 60, icon:'🎒', tone:'warn',
          title:`내일 ${esc(ev.t)} 준비물`,
          body:ev.items.join(', '),
          toggleType:'sched', schedId:ev.id, schedDay:tmr, schedWeek:tmrW
        });
      });
    } else if(cfg.prepLead === 'morning'){
      App.evs(App.today, 0, vm).forEach(ev => {
        if(!ev.alarm || !ev.items || !ev.items.length || !App.canSee(ev)) return;
        items.push({
          id:`nt:${vm}:prepm:${ev.id}`, time:7 * 60, icon:'🎒', tone:'warn',
          title:`오늘 ${esc(ev.t)} 준비물`,
          body:ev.items.join(', '),
          toggleType:'sched', schedId:ev.id, schedDay:App.today, schedWeek:0
        });
      });
    }

    // 3) 할 일 알림
    if(cfg.todoDaily){
      const undone = App.todosOf(App.today, 0).filter(t => !t.done && App.canSee(t));
      if(undone.length){
        items.push({
          id:`nt:${vm}:todo:${App.today}`, time:8 * 60 + 30, icon:'✅', tone:'good',
          title:`오늘 할 일 ${undone.length}개가 남았어요`,
          body:undone.slice(0, 3).map(t => t.text).join(', '),
          toggleType:'todo'
        });
      }
    }

    items.sort((a, b) => a.time - b.time);
    return items;
  },

  count(){
    if(!App.state.notify) return 0;
    const now = App.nowMin();
    const read = App.state.notify.read || [];
    return this._computeToday().filter(it => it.time <= now && read.indexOf(it.id) === -1).length;
  },

  /* ================= 알림 센터 시트 ================= */
  open(){
    if(!App.state.notify) this.init();
    const items = this._computeToday();
    const now = App.nowMin();

    let changed = false;
    const read = App.state.notify.read;
    items.forEach(it => {
      if(it.time <= now && read.indexOf(it.id) === -1){ read.push(it.id); changed = true; }
    });
    if(changed) App.save();

    const body = `
      <div class="nt-sheet-head">
        <span class="nt-sheet-head-label">오늘 예정된 알림</span>
        <button type="button" class="nt-gear-btn" id="nt-gear" aria-label="알림 설정">⚙️</button>
      </div>
      ${items.length
        ? this._listHtml(items, now)
        : `<div class="empty-note"><div class="big">🔕</div>오늘은 예정된 알림이 없어요</div>`}
    `;

    App.sheet('알림', body, '', (bodyEl) => {
      this._bindList(bodyEl);
    });
  },

  _listHtml(items, now){
    const rows = [];
    let dividerPlaced = false;
    items.forEach(it => {
      if(!dividerPlaced && it.time > now){
        rows.push(`<div class="nt-divider">지금</div>`);
        dividerPlaced = true;
      }
      rows.push(this._itemHtml(it, now));
    });
    if(!dividerPlaced) rows.push(`<div class="nt-divider">지금</div>`);
    return `<div class="nt-list">${rows.join('')}</div>`;
  },

  _itemHtml(it, now){
    const past = it.time <= now;
    const right = past
      ? `<span class="nt-item-sent">보냄</span>`
      : `<button type="button" class="nt-item-toggle on" data-toggle-type="${it.toggleType}"
           data-sched-id="${it.schedId || ''}" data-sched-day="${it.schedDay != null ? it.schedDay : ''}"
           data-sched-week="${it.schedWeek != null ? it.schedWeek : 0}"
           aria-label="알림 끄기"></button>`;
    return `
      <div class="nt-item ${past ? 'past' : ''}">
        <div class="nt-item-time">${this._ampm(it.time)}<b>${disp(it.time)}</b></div>
        <div class="nt-item-icon">${it.icon}</div>
        <div class="nt-item-main">
          <div class="nt-item-title">${this._esc(it.title)}</div>
          <div class="nt-item-body">${this._esc(it.body)}</div>
        </div>
        <div class="nt-item-right">${right}</div>
      </div>
    `;
  },

  _bindList(root){
    const gear = root.querySelector('#nt-gear');
    if(gear) gear.addEventListener('click', () => this.openSettings());

    root.querySelectorAll('.nt-item-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.toggleType;
        if(type === 'todo'){
          App.state.notify.todoDaily = false;
          App.save();
          App.toast('할 일 알림을 껐어요');
        } else {
          const day = +btn.dataset.schedDay;
          const week = +btn.dataset.schedWeek || 0;
          const id = btn.dataset.schedId;
          const list = App.evs(day, week);
          const ev = list.find(x => x.id === id);
          if(ev){
            ev.alarm = false;
            App.save();
            App.toast('알림을 껐어요');
          }
        }
        if(App.haptic) App.haptic();
        App.render();
        this.open(); // 목록 새로고침
      });
    });
  },

  /* ================= 알림 설정 시트 ================= */
  _timeOptions(sel){
    let out = '';
    for(let m = 0; m < 1440; m += 30){
      const v = toStr(m);
      out += `<option value="${v}" ${v === sel ? 'selected' : ''}>${this._ampm(m)} ${disp(m)}</option>`;
    }
    return out;
  },

  openSettings(){
    const cfg = App.state.notify;
    const leads = [5, 10, 15, 30];

    const body = `
      <div class="field">
        <label>일정 시작 몇 분 전에 알릴까요?</label>
        <div class="nt-lead-row" id="ntLeadRow">
          ${leads.map(v => `<button type="button" class="nt-lead-chip ${cfg.lead === v ? 'on' : ''}" data-lead="${v}">${v}분 전</button>`).join('')}
        </div>
      </div>
      <div class="field">
        <label>준비물 알림</label>
        <div class="nt-seg" id="ntPrepSeg">
          <button type="button" class="nt-seg-btn ${cfg.prepLead === 'night' ? 'on' : ''}" data-prep="night">전날 밤</button>
          <button type="button" class="nt-seg-btn ${cfg.prepLead === 'morning' ? 'on' : ''}" data-prep="morning">당일 아침</button>
          <button type="button" class="nt-seg-btn ${cfg.prepLead === 'off' ? 'on' : ''}" data-prep="off">안 받기</button>
        </div>
      </div>
      <div class="panel" style="padding:4px 14px">
        <div class="toggle-row">
          <div><div class="tl">할 일 알림</div><div class="td">오늘 할 일이 남으면 알려줘요</div></div>
          <button type="button" class="sw-tog ${cfg.todoDaily ? 'on' : ''}" id="ntTodoTog"></button>
        </div>
        <div class="toggle-row">
          <div><div class="tl">보상 알림</div><div class="td">코인을 모으면 알려줘요</div></div>
          <button type="button" class="sw-tog warm ${cfg.rewardOn ? 'on' : ''}" id="ntRewardTog"></button>
        </div>
        <div class="toggle-row">
          <div><div class="tl">방해 금지 시간</div><div class="td">이 시간엔 배너 없이 조용히 기록만 해요</div></div>
          <button type="button" class="sw-tog ${cfg.quiet.on ? 'on' : ''}" id="ntQuietTog"></button>
        </div>
      </div>
      <div class="field two nt-quiet-times">
        <div><label>시작</label><select class="inp" id="ntQuietFrom">${this._timeOptions(cfg.quiet.from)}</select></div>
        <div><label>끝</label><select class="inp" id="ntQuietTo">${this._timeOptions(cfg.quiet.to)}</select></div>
      </div>
    `;

    const foot = `<button type="button" class="btn line full" id="ntPreview">🔔 미리 보기</button>`;

    App.sheet('알림 설정', body, foot, (b, f) => {
      b.querySelectorAll('#ntLeadRow .nt-lead-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          cfg.lead = +btn.dataset.lead;
          App.save();
          b.querySelectorAll('#ntLeadRow .nt-lead-chip').forEach(x => x.classList.remove('on'));
          btn.classList.add('on');
          if(App.haptic) App.haptic();
        });
      });

      b.querySelectorAll('#ntPrepSeg .nt-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          cfg.prepLead = btn.dataset.prep;
          App.save();
          b.querySelectorAll('#ntPrepSeg .nt-seg-btn').forEach(x => x.classList.remove('on'));
          btn.classList.add('on');
          if(App.haptic) App.haptic();
        });
      });

      b.querySelector('#ntTodoTog').addEventListener('click', e => {
        cfg.todoDaily = !cfg.todoDaily;
        App.save();
        e.currentTarget.classList.toggle('on', cfg.todoDaily);
        if(App.haptic) App.haptic();
      });
      b.querySelector('#ntRewardTog').addEventListener('click', e => {
        cfg.rewardOn = !cfg.rewardOn;
        App.save();
        e.currentTarget.classList.toggle('on', cfg.rewardOn);
        if(App.haptic) App.haptic();
      });
      b.querySelector('#ntQuietTog').addEventListener('click', e => {
        cfg.quiet.on = !cfg.quiet.on;
        App.save();
        e.currentTarget.classList.toggle('on', cfg.quiet.on);
        if(App.haptic) App.haptic();
      });
      b.querySelector('#ntQuietFrom').addEventListener('change', e => { cfg.quiet.from = e.target.value; App.save(); });
      b.querySelector('#ntQuietTo').addEventListener('change', e => { cfg.quiet.to = e.target.value; App.save(); });

      f.querySelector('#ntPreview').addEventListener('click', () => {
        this.push({ emoji:'🔔', title:'준비물을 챙길 시간이에요', body:'도복, 띠, 물통 — 잊지 말고 챙겨 주세요!', tone:'info' });
      });
    });
  },

  /* ================= 인앱 배너 ================= */
  _log(payload){
    if(!App.state.notify) return;
    App.state.notify.log.unshift({
      id:uid(), time:App.nowMin(),
      emoji:payload.emoji || '🔔', title:payload.title || '', body:payload.body || '',
      tone:payload.tone || 'info', at:Date.now()
    });
    if(App.state.notify.log.length > 30) App.state.notify.log.length = 30;
    App.save();
  },

  push(payload){
    if(!payload) return;
    this._log(payload);

    const phone = document.getElementById('phone');
    if(!phone) return;

    const tone = payload.tone || 'info';
    const el = document.createElement('div');
    el.className = 'nt-banner';
    el.dataset.tone = tone;
    el.innerHTML = `
      <div class="nt-banner-icon">${esc(payload.emoji || 'K')}</div>
      <div class="nt-banner-main">
        <div class="nt-banner-top">
          <span class="nt-banner-app">KUMA routine</span>
          <span class="nt-banner-dot">·</span>
          <span class="nt-banner-now">지금</span>
        </div>
        <div class="nt-banner-title">${this._esc(payload.title || '')}</div>
        <div class="nt-banner-text">${this._esc(payload.body || '')}</div>
      </div>
    `;
    el.style.transform = 'translateY(-120%)';
    phone.appendChild(el);

    const entry = { el, timer:null, _dragged:false, _dismissed:false };
    this._stack.unshift(entry);
    if(this._stack.length > 3){
      const old = this._stack.pop();
      this._animateOut(old);
    }
    this._layoutStack();
    // 다음 프레임에 슬라이드 다운 시작
    requestAnimationFrame(() => requestAnimationFrame(() => this._layoutStack()));

    entry.timer = setTimeout(() => this._dismiss(entry), 4500);
    el.addEventListener('click', () => {
      if(entry._dragged) return;
      this._dismiss(entry);
      this.open();
    });
    this._bindDrag(entry);
  },

  _layoutStack(){
    this._stack.forEach((entry, idx) => {
      if(entry._dragging) return;
      const y = idx === 0 ? 0 : idx * 9;
      const scale = idx === 0 ? 1 : 0.96;
      entry.el.style.zIndex = String(180 - idx);
      entry.el.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1), opacity .3s';
      entry.el.style.transform = `translateY(${y}px) scale(${scale})`;
      entry.el.style.opacity = idx === 0 ? '1' : '.92';
    });
  },

  _animateOut(entry){
    if(!entry || entry._dismissed) return;
    entry._dismissed = true;
    clearTimeout(entry.timer);
    entry.el.style.transition = 'transform .32s cubic-bezier(.4,0,1,1), opacity .28s';
    entry.el.style.transform = 'translateY(-120%)';
    entry.el.style.opacity = '0';
    setTimeout(() => { if(entry.el.parentNode) entry.el.parentNode.removeChild(entry.el); }, 340);
  },

  _dismiss(entry){
    if(!entry || entry._dismissed) return;
    const idx = this._stack.indexOf(entry);
    if(idx > -1) this._stack.splice(idx, 1);
    this._animateOut(entry);
    this._layoutStack();
  },

  _bindDrag(entry){
    const el = entry.el;
    let startY = 0, dragging = false;
    const stackY = () => {
      const idx = this._stack.indexOf(entry);
      return idx <= 0 ? 0 : idx * 9;
    };
    const pointY = e => (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY);

    const onDown = e => {
      dragging = true;
      entry._dragging = true;
      entry._dragged = false;
      startY = pointY(e);
      el.style.transition = 'none';
      if(el.setPointerCapture && e.pointerId != null){
        try{ el.setPointerCapture(e.pointerId); }catch(err){}
      }
    };
    const onMove = e => {
      if(!dragging) return;
      const dy = pointY(e) - startY;
      if(Math.abs(dy) > 4) entry._dragged = true;
      const clamped = Math.min(0, dy); // 위로만 드래그 허용
      const idx = this._stack.indexOf(entry);
      const scale = idx <= 0 ? 1 : 0.96;
      el.style.transform = `translateY(${stackY() + clamped}px) scale(${scale})`;
    };
    const onUp = e => {
      if(!dragging) return;
      dragging = false;
      entry._dragging = false;
      const dy = pointY(e) - startY;
      el.style.transition = 'transform .32s cubic-bezier(.22,1,.36,1), opacity .3s';
      if(dy < -40){
        this._dismiss(entry);
      } else {
        this._layoutStack();
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  },

  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
};

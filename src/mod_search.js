window.ModSearch = {
  css: `
    /* ---- 검색 시트 ---- */
    .sr-head{ margin-bottom:14px; }
    .sr-inp-wrap{ position:relative; }
    .sr-inp-ico{ position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; opacity:.55; pointer-events:none; }
    .sr-inp{ width:100%; padding-left:38px; }

    .sr-results{ display:flex; flex-direction:column; gap:20px; }

    .sr-group-h{ display:flex; align-items:center; gap:7px; font-size:12px; font-weight:800; color:var(--muted); margin-bottom:8px; }
    .sr-count{ background:var(--bg); color:var(--ink2); font-size:11px; font-weight:800; padding:2px 8px; border-radius:9px; }

    .sr-rows{ display:flex; flex-direction:column; gap:8px; }
    .sr-row{
      display:flex; align-items:flex-start; gap:11px; width:100%; text-align:left;
      background:var(--paper); border-radius:var(--r-l); box-shadow:var(--sh-1); padding:12px 13px; min-height:44px;
      transition:transform .15s cubic-bezier(.22,1,.36,1), background .2s;
    }
    .sr-row:active{ transform:scale(.98); background:var(--bg); }
    .sr-dot{ flex:0 0 auto; width:12px; height:12px; border-radius:50%; margin-top:4px; }
    .sr-icon{
      flex:0 0 auto; width:34px; height:34px; border-radius:11px; background:var(--indigo-s);
      font-size:16px; display:flex; align-items:center; justify-content:center;
    }
    .sr-row-main{ flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
    .sr-row-title{
      font-size:13.5px; font-weight:800; color:var(--ink);
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .sr-row-meta{ font-size:11.5px; font-weight:700; color:var(--muted); }
    .sr-row-sub{
      font-size:11px; font-weight:600; color:var(--ink2); margin-top:1px;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .sr-mark{ background:var(--indigo-s); color:var(--indigo-d); border-radius:4px; padding:0 2px; font-weight:800; }
    .sr-wk-badge{
      display:inline-block; margin-left:6px; font-size:9.5px; font-weight:800; color:var(--indigo-d);
      background:var(--indigo-s); padding:2px 6px; border-radius:7px; vertical-align:middle;
    }

    .sr-block{ margin-bottom:2px; }
    .sr-block-h{ font-size:12px; font-weight:800; color:var(--muted); margin-bottom:9px; }
    .sr-chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .sr-chip{
      display:inline-flex; align-items:center; gap:7px; height:40px; padding:0 8px 0 14px;
      border-radius:20px; background:var(--bg); border:1.5px solid var(--line);
      font-size:12.5px; font-weight:800; color:var(--ink2); transition:transform .15s cubic-bezier(.22,1,.36,1);
    }
    .sr-chip:active{ transform:scale(.96); }
    .sr-chip-sugg{ background:var(--indigo-s); border-color:transparent; color:var(--indigo-d); padding:0 14px; }
    .sr-chip-x{
      display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px;
      border-radius:50%; color:var(--muted); font-size:10px; flex:0 0 auto;
    }
    .sr-chip-x:active{ background:var(--line); }

    /* ---- 템플릿 빠른 추가 시트 ---- */
    .sr-tpl-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:18px; }
    .sr-tpl-card{
      position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:3px;
      min-height:96px; text-align:left; background:var(--paper); border-radius:var(--r-l);
      box-shadow:var(--sh-1); padding:14px 14px 16px; border:1.5px solid transparent;
      transition:border-color .18s cubic-bezier(.22,1,.36,1), background .18s cubic-bezier(.22,1,.36,1), transform .15s;
    }
    .sr-tpl-card:active{ transform:scale(.97); }
    .sr-tpl-card.on{ border-color:var(--indigo); background:var(--indigo-s); }
    .sr-tpl-card.dup{ opacity:.55; }
    .sr-tpl-emoji{ font-size:26px; line-height:1; }
    .sr-tpl-name{ font-size:14px; font-weight:800; color:var(--ink); margin-top:4px; }
    .sr-tpl-time{ font-size:11px; font-weight:700; color:var(--muted); }
    .sr-tpl-badge{
      position:absolute; top:10px; right:10px; background:var(--bg); color:var(--ink2);
      font-size:9.5px; font-weight:800; padding:3px 7px; border-radius:8px;
    }
    .sr-tpl-dupflag{
      position:absolute; top:10px; right:10px; background:var(--bg); color:var(--muted);
      font-size:9.5px; font-weight:800; padding:3px 7px; border-radius:8px;
    }
    .sr-tpl-check{
      position:absolute; bottom:10px; right:10px; width:22px; height:22px; border-radius:50%;
      background:var(--indigo); color:#fff; font-size:12px; font-weight:800;
      display:none; align-items:center; justify-content:center;
    }
    .sr-tpl-card.on .sr-tpl-check{ display:flex; }

    .sr-day-chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .sr-day-chip{
      flex:1; min-width:40px; height:44px; border-radius:var(--r-m); border:1.5px solid var(--line);
      font-size:13px; font-weight:800; color:var(--ink2);
      transition:border-color .18s cubic-bezier(.22,1,.36,1), background .18s cubic-bezier(.22,1,.36,1),
                 color .18s cubic-bezier(.22,1,.36,1), transform .15s;
    }
    .sr-day-chip:active{ transform:scale(.94); }
    .sr-day-chip.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo-d); }
  `,

  /* 자주 쓰는 일정 프리셋 */
  _TEMPLATES: [
    { emoji:'🌅', t:'기상',    s:'07:00', e:'08:00', c:'sand',  items:[], memo:'', alarm:false },
    { emoji:'🏫', t:'학교',    s:'08:00', e:'13:00', c:'wheat', items:['실내화','알림장','물통'], memo:'', alarm:false },
    { emoji:'🎹', t:'피아노',  s:'14:00', e:'15:00', c:'lime',  items:['악보'], memo:'', alarm:true },
    { emoji:'🥋', t:'태권도',  s:'15:30', e:'16:30', c:'blue',  items:['도복','띠'], memo:'', alarm:true },
    { emoji:'🏊', t:'수영',    s:'15:00', e:'16:00', c:'sky',   items:['수영복','수경','수건'], memo:'', alarm:true },
    { emoji:'🔤', t:'영어학원', s:'16:00', e:'17:30', c:'mint',  items:['교재'], memo:'', alarm:true },
    { emoji:'➗', t:'수학학원', s:'16:00', e:'17:30', c:'coral', items:['교재','필통'], memo:'', alarm:true },
    { emoji:'📝', t:'숙제',    s:'19:00', e:'19:30', c:'sun',   items:[], memo:'', alarm:false },
    { emoji:'📚', t:'독서',    s:'19:30', e:'20:00', c:'wheat', items:['책'], memo:'', alarm:false },
    { emoji:'🍚', t:'저녁',    s:'18:30', e:'19:00', c:'coral', items:[], memo:'', alarm:false },
    { emoji:'🛁', t:'목욕',    s:'20:30', e:'21:00', c:'sky',   items:[], memo:'', alarm:false },
    { emoji:'🌙', t:'취침',    s:'21:30', e:'22:30', c:'pink',  items:[], memo:'', alarm:true }
  ],

  _SUGGEST: ['준비물', '학원', '취침', '숙제'],

  /* ================= 부팅 ================= */
  init(){
    this._ensureHistory();
  },

  _ensureHistory(){
    if(!App.state.searchHistory) App.state.searchHistory = [];
  },

  /* ================= 통합 검색 ================= */
  open(){
    this._ensureHistory();
    clearTimeout(this._debounceTimer);

    const body = `
      <div class="sr-head">
        <div class="sr-inp-wrap">
          <span class="sr-inp-ico">🔍</span>
          <input type="text" class="inp sr-inp" id="srInput" placeholder="일정·할 일·준비물 검색" autocomplete="off" autofocus>
        </div>
      </div>
      <div class="sr-results" id="srResults"></div>
    `;

    App.sheet('검색', body, '', (bodyEl) => {
      const input = bodyEl.querySelector('#srInput');
      const results = bodyEl.querySelector('#srResults');

      this._renderResults(results, '');
      setTimeout(() => input.focus(), 30);

      input.addEventListener('input', () => {
        clearTimeout(this._debounceTimer);
        const q = input.value;
        this._debounceTimer = setTimeout(() => this._renderResults(results, q), 120);
      });
      input.addEventListener('keydown', e => {
        if(e.key === 'Enter'){
          clearTimeout(this._debounceTimer);
          this._renderResults(results, input.value);
        }
      });

      results.addEventListener('click', e => this._onResultsClick(e, input, results));
    });
  },

  _onResultsClick(e, input, results){
    const xEl = e.target.closest('.sr-chip-x');
    if(xEl){
      e.stopPropagation();
      this._removeHistory(xEl.dataset.x);
      this._renderResults(results, input.value);
      return;
    }
    const chipEl = e.target.closest('.sr-chip');
    if(chipEl){
      const q = chipEl.dataset.q;
      input.value = q;
      this._addHistory(q);
      this._renderResults(results, q);
      input.focus();
      return;
    }
    const rowEl = e.target.closest('.sr-row');
    if(rowEl){
      const q = input.value.trim();
      if(q) this._addHistory(q);
      this._goToResult(rowEl.dataset);
    }
  },

  _renderResults(root, rawQuery){
    const q = (rawQuery || '').trim();
    if(!q){
      root.innerHTML = this._emptyStateHtml();
      return;
    }
    const { schedRows, todoRows, supplyRows } = this._collectMatches(q);
    const total = schedRows.length + todoRows.length + supplyRows.length;
    if(!total){
      root.innerHTML = `<div class="empty-note"><div class="big">🔍</div>"${this._esc(q)}"에 대한 검색 결과가 없어요</div>`;
      return;
    }
    let html = '';
    if(schedRows.length) html += this._groupHtml('일정', schedRows.length, schedRows.map(r => this._schedRowHtml(r, q)).join(''));
    if(todoRows.length) html += this._groupHtml('할 일', todoRows.length, todoRows.map(r => this._todoRowHtml(r, q)).join(''));
    if(supplyRows.length) html += this._groupHtml('준비물', supplyRows.length, supplyRows.map(r => this._supplyRowHtml(r, q)).join(''));
    root.innerHTML = html;
  },

  _emptyStateHtml(){
    const hist = App.state.searchHistory || [];
    let html = '';
    if(hist.length){
      html += `
        <div class="sr-block">
          <div class="sr-block-h">최근 검색어</div>
          <div class="sr-chips">
            ${hist.map(h => `
              <span class="sr-chip" data-q="${this._esc(h)}">
                <span>${this._esc(h)}</span>
                <span class="sr-chip-x" data-x="${this._esc(h)}" aria-label="삭제">✕</span>
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }
    html += `
      <div class="sr-block">
        <div class="sr-block-h">추천 검색어</div>
        <div class="sr-chips">
          ${this._SUGGEST.map(s => `<span class="sr-chip sr-chip-sugg" data-q="${this._esc(s)}"><span>${this._esc(s)}</span></span>`).join('')}
        </div>
      </div>
    `;
    return html;
  },

  /* ---------- 매칭 ----------
     이번 주(0)·다음 주(1) 를 모두 훑는다. App.evs() 를 쓰면 다음 주엔 반복 일정도
     자동으로 얹혀서 나오므로 별도 처리 없이 그대로 검색 대상에 포함된다. */
  _collectMatches(q){
    const ql = q.toLowerCase();
    const memberIds = App.canSwitchMember() ? App.state.members.map(m => m.id) : [App.meId()];
    const schedRows = [], todoRows = [], supplyRows = [];

    memberIds.forEach(mid => {
      const member = App.member(mid);
      for(let week = 0; week <= 1; week++){
        for(let day = 0; day < 7; day++){
          App.evs(day, week, mid).forEach(ev => {
            if(!App.canSee(ev)) return;
            const titleHit = ev.t && ev.t.toLowerCase().indexOf(ql) > -1;
            const memoHit = ev.memo && ev.memo.toLowerCase().indexOf(ql) > -1;
            if(titleHit || memoHit) schedRows.push({ ev, day, week, member });
            (ev.items || []).forEach(it => {
              if(it.toLowerCase().indexOf(ql) > -1) supplyRows.push({ ev, day, week, member, item: it });
            });
          });
        }
      }
      App.state.todos.forEach(t => {
        const forId = t.for || App.defaultTodoOwner();
        if(forId !== mid) return;
        if(!App.canSee(t)) return;
        if(t.text && t.text.toLowerCase().indexOf(ql) > -1) todoRows.push({ todo: t, member, week:(t.w || 0) });
      });
    });

    return { schedRows, todoRows, supplyRows };
  },

  /* ---------- 행 렌더 ---------- */
  _groupHtml(label, count, rowsHtml){
    return `
      <div class="sr-group">
        <div class="sr-group-h">${label} <span class="sr-count">${count}</span></div>
        <div class="sr-rows">${rowsHtml}</div>
      </div>
    `;
  },

  _ampm(min){
    const h = Math.floor((((min % 1440) + 1440) % 1440) / 60);
    return h < 12 ? '오전' : '오후';
  },

  _wkBadge(week){
    return week ? `<span class="sr-wk-badge">다음 주</span>` : '';
  },

  _schedRowHtml(r, q){
    const { ev, day, week, member } = r;
    const color = CFILL(ev.c).fill;
    const startMin = toMin(ev.s);
    const meta = `${esc(member.name)} · ${DAYS[day][0]}요일 ${this._ampm(startMin)} ${disp(startMin)}`;
    const showMemo = ev.memo && ev.memo.toLowerCase().indexOf(q.toLowerCase()) > -1;
    return `
      <button type="button" class="sr-row" data-kind="sched" data-member="${member.id}" data-day="${day}" data-week="${week}" data-id="${ev.id}">
        <span class="sr-dot" style="background:${color}"></span>
        <span class="sr-row-main">
          <span class="sr-row-title">${this._hilite(ev.t, q)}${this._wkBadge(week)}</span>
          <span class="sr-row-meta">${this._esc(meta)}</span>
          ${showMemo ? `<span class="sr-row-sub">${this._hilite(ev.memo, q)}</span>` : ''}
        </span>
      </button>
    `;
  },

  _todoRowHtml(r, q){
    const { todo, member, week } = r;
    const icon = todo.done ? '✅' : '⬜️';
    const meta = `${esc(member.name)} · ${DAYS[todo.day][0]}요일${todo.done ? ' · 완료' : ''}`;
    return `
      <button type="button" class="sr-row" data-kind="todo" data-member="${member.id}" data-day="${todo.day}" data-week="${week || 0}" data-id="${todo.id}">
        <span class="sr-icon">${icon}</span>
        <span class="sr-row-main">
          <span class="sr-row-title">${this._hilite(todo.text, q)}${this._wkBadge(week)}</span>
          <span class="sr-row-meta">${this._esc(meta)}</span>
        </span>
      </button>
    `;
  },

  _supplyRowHtml(r, q){
    const { ev, day, week, member, item } = r;
    const color = CFILL(ev.c).fill;
    const startMin = toMin(ev.s);
    const meta = `${esc(ev.t)} · ${esc(member.name)} · ${DAYS[day][0]}요일 ${this._ampm(startMin)} ${disp(startMin)}`;
    return `
      <button type="button" class="sr-row" data-kind="supply" data-member="${member.id}" data-day="${day}" data-week="${week}" data-id="${ev.id}">
        <span class="sr-dot" style="background:${color}"></span>
        <span class="sr-row-main">
          <span class="sr-row-title">${this._hilite(item, q)}${this._wkBadge(week)}</span>
          <span class="sr-row-meta">${this._esc(meta)}</span>
        </span>
      </button>
    `;
  },

  /* ---------- 이동 ---------- */
  _goToResult(ds){
    const day = +ds.day;
    const week = +ds.week || 0;
    App.closeSheet();
    if(ds.kind === 'todo'){
      App.viewMember = ds.member;
      App.go('todo');
      App.setDay(day, undefined, week);
    } else {
      App.viewMember = ds.member;
      App.view = 'day';
      App.setDay(day, undefined, week);
      App.openCard = ds.id;
      App.render();
    }
  },

  /* ---------- 최근 검색어 ---------- */
  _addHistory(q){
    q = (q || '').trim();
    if(!q) return;
    this._ensureHistory();
    const hist = App.state.searchHistory;
    const idx = hist.indexOf(q);
    if(idx > -1) hist.splice(idx, 1);
    hist.unshift(q);
    if(hist.length > 6) hist.length = 6;
    App.save();
  },

  _removeHistory(q){
    if(!App.state.searchHistory) return;
    App.state.searchHistory = App.state.searchHistory.filter(h => h !== q);
    App.save();
  },

  /* ================= 일정 템플릿 빠른 추가 ================= */
  openTemplates(){
    this._tplSelected = new Set();
    this._daySelected = new Set([App.day]);

    const body = `
      <div class="sr-tpl-grid" id="srTplGrid">${this._tplGridHtml()}</div>
      <div class="field">
        <label>어느 요일에 추가할까요?</label>
        <div class="sr-day-chips" id="srDayChips">${this._dayChipsHtml()}</div>
      </div>
    `;
    const foot = `<button type="button" class="btn full" id="srTplAddBtn" disabled>일정을 골라주세요</button>`;

    App.sheet('일정 템플릿', body, foot, (bodyEl, footEl) => {
      this._bindTemplates(bodyEl, footEl);
    });
  },

  _isDup(tpl){
    const days = this._daySelected && this._daySelected.size ? [...this._daySelected] : [App.day];
    return days.some(d => App.evs(d).some(ev => ev.t === tpl.t));
  },

  _tplGridHtml(){
    // 이제는 중복이 된 선택을 정리
    [...this._tplSelected].forEach(i => {
      if(this._isDup(this._TEMPLATES[i])) this._tplSelected.delete(i);
    });
    return this._TEMPLATES.map((tpl, i) => {
      const dup = this._isDup(tpl);
      const sel = this._tplSelected.has(i);
      return `
        <button type="button" class="sr-tpl-card ${sel ? 'on' : ''} ${dup ? 'dup' : ''}" data-i="${i}" ${dup ? 'disabled aria-disabled="true"' : ''}>
          <span class="sr-tpl-emoji">${tpl.emoji}</span>
          <span class="sr-tpl-name">${this._esc(tpl.t)}</span>
          <span class="sr-tpl-time">${disp(toMin(tpl.s))}~${disp(toMin(tpl.e))}</span>
          ${dup
            ? `<span class="sr-tpl-dupflag">이미 있어요</span>`
            : (tpl.items.length ? `<span class="sr-tpl-badge">준비물 ${tpl.items.length}</span>` : '')}
          <span class="sr-tpl-check">✓</span>
        </button>
      `;
    }).join('');
  },

  _dayChipsHtml(){
    return DAYS.map((d, i) => `<button type="button" class="sr-day-chip ${this._daySelected.has(i) ? 'on' : ''}" data-d="${i}">${d[0]}</button>`).join('');
  },

  _bindTemplates(bodyEl, footEl){
    const grid = bodyEl.querySelector('#srTplGrid');
    const dayWrap = bodyEl.querySelector('#srDayChips');
    const addBtn = footEl.querySelector('#srTplAddBtn');

    const updateFoot = () => {
      const n = this._tplSelected.size;
      addBtn.disabled = n === 0;
      addBtn.textContent = n === 0 ? '일정을 골라주세요' : `${n}개 일정 추가하기`;
    };

    const bindCardClicks = () => {
      grid.querySelectorAll('.sr-tpl-card').forEach(card => {
        card.addEventListener('click', () => {
          if(card.hasAttribute('disabled')) return;
          const i = +card.dataset.i;
          if(this._tplSelected.has(i)) this._tplSelected.delete(i);
          else this._tplSelected.add(i);
          if(App.haptic) App.haptic();
          refreshGrid();
        });
      });
    };

    const refreshGrid = () => {
      grid.innerHTML = this._tplGridHtml();
      bindCardClicks();
      updateFoot();
    };

    const bindDayClicks = () => {
      dayWrap.querySelectorAll('.sr-day-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const d = +chip.dataset.d;
          if(this._daySelected.has(d)){
            if(this._daySelected.size > 1) this._daySelected.delete(d);
          } else {
            this._daySelected.add(d);
          }
          if(App.haptic) App.haptic();
          refreshDays();
          refreshGrid();
        });
      });
    };

    const refreshDays = () => {
      dayWrap.innerHTML = this._dayChipsHtml();
      bindDayClicks();
    };

    bindCardClicks();
    bindDayClicks();
    updateFoot();

    addBtn.addEventListener('click', () => this._commitTemplates());
  },

  _commitTemplates(){
    const tpls = [...this._tplSelected].map(i => this._TEMPLATES[i]);
    const days = [...this._daySelected];
    if(!tpls.length || !days.length) return;

    let count = 0;
    days.forEach(d => {
      const list = App.bucket(d);
      tpls.forEach(tpl => {
        if(list.some(ev => ev.t === tpl.t)) return;
        list.push({
          id: uid(), s: tpl.s, e: tpl.e, t: tpl.t, c: tpl.c,
          alarm: !!tpl.alarm, memo: tpl.memo || '', items: (tpl.items || []).slice(),
          secret: false, owner: App.meId(), repeat: false
        });
        count++;
      });
    });

    App.save();
    App.closeSheet();
    App.render();
    App.toast(count ? `${count}개 일정을 추가했어요 ✨` : '이미 모두 있는 일정이었어요');
  },

  /* ================= 유틸 ================= */
  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  },

  _hilite(text, q){
    const esc = this._esc(text);
    const escQ = this._esc(q).trim();
    if(!escQ) return esc;
    const idx = esc.toLowerCase().indexOf(escQ.toLowerCase());
    if(idx === -1) return esc;
    return esc.slice(0, idx) + '<mark class="sr-mark">' + esc.slice(idx, idx + escQ.length) + '</mark>' + esc.slice(idx + escQ.length);
  }
};

window.ModTodo = {
  css: `
    .td-wrap{ padding:18px 18px 100px; }

    /* ---- 요일 칩 스트립 ---- */
    .td-days{ display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; margin-bottom:16px; }
    .td-day-chip{
      position:relative; flex:1 0 auto; min-width:40px; height:52px;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
      border:none; border-radius:var(--r-m); background:var(--paper); box-shadow:var(--sh-1);
      font-weight:800; font-size:13px; color:var(--ink2); cursor:pointer;
      transition:background .22s cubic-bezier(.22,1,.36,1), color .22s cubic-bezier(.22,1,.36,1), transform .15s;
    }
    .td-day-chip:active{ transform:scale(.94); }
    .td-day-chip.today{ box-shadow:inset 0 0 0 1.6px var(--indigo-s); }
    .td-day-chip.on{ background:var(--indigo); color:#fff; }
    .td-day-label{ line-height:1; }
    .td-day-dot{
      position:absolute; top:4px; right:4px; min-width:15px; height:15px; padding:0 3px;
      border-radius:8px; background:var(--orange); color:#fff; font-size:9px; font-weight:800;
      display:flex; align-items:center; justify-content:center;
    }
    .td-day-chip.on .td-day-dot{ background:#fff; color:var(--orange); }

    /* ---- 진행 요약 카드 ---- */
    .td-summary{ margin-bottom:16px; transition:background .3s cubic-bezier(.22,1,.36,1); }
    .td-summary-top{ display:flex; align-items:center; gap:16px; }
    .td-ring{
      --pct:0; flex-shrink:0; width:84px; height:84px; border-radius:50%;
      background:conic-gradient(var(--indigo) calc(var(--pct)*1%), var(--line) 0);
      display:flex; align-items:center; justify-content:center;
      transition:background .5s cubic-bezier(.22,1,.36,1);
    }
    .td-summary--done .td-ring{ background:conic-gradient(var(--orange) 100%, var(--line) 0); }
    .td-ring-inner{
      width:64px; height:64px; border-radius:50%; background:var(--paper);
      display:flex; align-items:baseline; justify-content:center; gap:1px;
    }
    .td-ring-inner b{ font-size:20px; color:var(--ink); }
    .td-ring-slash{ font-size:12px; color:var(--muted); font-weight:700; }
    .td-summary--done .td-ring-inner b{ color:var(--orange); }
    .td-summary-info{ flex:1; min-width:0; }
    .td-summary-title{ font-size:16px; font-weight:800; color:var(--ink); margin-bottom:2px; }
    .td-summary--done .td-summary-title{ color:var(--orange); }
    .td-summary-sub{ font-size:12.5px; color:var(--muted); font-weight:700; margin-bottom:8px; }
    .td-summary-metrics{ display:flex; flex-direction:column; gap:3px; }
    .td-metric{ font-size:12px; font-weight:700; color:var(--ink2); }
    .td-metric b{ color:var(--ink); font-weight:800; }
    .td-goto-reward{
      display:block; width:100%; margin-top:14px; padding-top:12px; border:none; background:none;
      border-top:1px solid var(--line); text-align:right; font-size:13px; font-weight:800;
      color:var(--indigo); cursor:pointer;
    }
    .td-summary--done .td-goto-reward{ color:var(--orange); border-top-color:var(--orange-s); }

    /* ---- 부모 모드 퀵 추가 ---- */
    .td-quickadd{
      display:flex; align-items:center; gap:8px; background:var(--paper); border-radius:var(--r-m);
      box-shadow:var(--sh-1); padding:4px 14px; margin-bottom:14px;
    }
    .td-quickadd-icon{ font-size:16px; }
    .td-quickadd-inp{ border:none; background:none; flex:1; height:44px; font-size:14px; font-weight:700; padding:0; }
    .td-quickadd-inp:focus{ outline:none; }

    /* ---- 리스트 ---- */
    .td-list-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
    .td-add-btn{ font-size:12.5px; padding:8px 14px; height:auto; min-height:36px; flex:0 0 auto; }
    /* 주 전환은 코어의 .wknav 모양을 그대로 쓰고, 높이만 이 줄에 맞춘다 */
    .td-weeknav{ flex:0 0 auto; }
    .td-weeknav button{ min-height:36px; }
    .td-weekhint{ font-size:12px; font-weight:700; color:var(--indigo); margin:-4px 0 12px; }
    #phone.th-dark .td-weekhint{ color:#B7AEFF; }
    .td-group-divider{
      display:flex; align-items:center; gap:8px; margin:14px 0 8px; color:var(--muted);
      font-size:11.5px; font-weight:800;
    }
    .td-group-divider::before, .td-group-divider::after{ content:''; flex:1; height:1px; background:var(--line); }

    .td-item{
      display:flex; align-items:center; gap:10px; background:var(--paper); border-radius:var(--r-m);
      box-shadow:var(--sh-1); padding:4px 14px 4px 4px; margin-bottom:8px;
      transition:opacity .25s cubic-bezier(.22,1,.36,1), background .25s cubic-bezier(.22,1,.36,1);
    }
    .td-item.done{ opacity:.55; }
    .td-item--secret{ background:var(--indigo-s); border:1.6px dashed var(--indigo); box-shadow:none; }
    .td-item--locked{ background:var(--bg); box-shadow:none; opacity:.75; }

    .td-check{
      width:44px; height:44px; flex-shrink:0; border:none; background:none; padding:0;
      display:flex; align-items:center; justify-content:center; cursor:pointer;
    }
    .td-check--locked{ font-size:18px; cursor:default; }
    .td-check-box{
      width:26px; height:26px; border-radius:9px; border:2.5px solid var(--line); background:var(--paper);
      display:flex; align-items:center; justify-content:center;
      transition:background .25s cubic-bezier(.22,1,.36,1), border-color .25s cubic-bezier(.22,1,.36,1);
    }
    .td-check.on .td-check-box{ background:var(--indigo); border-color:var(--indigo); }
    .td-check-mark{ width:15px; height:15px; color:#fff; transform:scale(0); transition:transform .28s cubic-bezier(.34,1.56,.64,1); }
    .td-check.on .td-check-mark{ transform:scale(1); }

    .td-text{ flex:1; min-width:0; display:flex; align-items:center; gap:6px; flex-wrap:wrap; cursor:pointer; }
    .td-txt{ font-size:14px; font-weight:700; color:var(--ink); word-break:break-all; }
    .td-item.done .td-txt{ text-decoration:line-through; color:var(--muted); }
    .td-item--locked .td-txt{ font-size:13px; font-weight:700; color:var(--muted); }
    .td-secret-tag{ font-size:13px; }
    .td-mine-badge{
      font-size:10px; font-weight:800; color:var(--indigo); background:#fff; border-radius:6px;
      padding:2px 6px;
    }
    .td-coin{
      flex-shrink:0; font-size:12.5px; font-weight:800; color:var(--orange); background:var(--orange-s);
      border-radius:10px; padding:5px 9px;
    }

    /* ---- 스와이프 액션 (완료/삭제) ---- */
    .td-wrap{ --td-green:#3FAE63; --td-green-ink:#fff; --td-red:#E5473E; --td-red-ink:#fff; }
    .td-row{
      position:relative; border-radius:var(--r-m); margin-bottom:8px; overflow:hidden;
      transition:max-height .32s cubic-bezier(.22,1,.36,1), opacity .32s cubic-bezier(.22,1,.36,1), margin-bottom .32s cubic-bezier(.22,1,.36,1);
    }
    .td-swipe-bg{
      position:absolute; inset:0; display:flex; align-items:center; border-radius:var(--r-m);
      opacity:0; pointer-events:none;
    }
    .td-swipe-bg-right{ background:var(--td-green); color:var(--td-green-ink); justify-content:flex-start; padding-left:24px; }
    .td-swipe-bg-left{ background:var(--td-red); color:var(--td-red-ink); justify-content:flex-end; padding-right:24px; }
    .td-swipe-icon{ width:22px; height:22px; display:block; transition:transform .18s cubic-bezier(.34,1.56,.64,1); }
    .td-swipe-icon--trash{ font-size:21px; line-height:1; width:auto; height:auto; }
    .td-swipe-bg--armed .td-swipe-icon{ transform:scale(1.28); }
    .td-row .td-item{ position:relative; z-index:1; margin-bottom:0; touch-action:pan-y; }

    /* ---- 되돌리기 바 ---- */
    .td-undo{
      --td-undo-bg:#22222B; --td-undo-ink:#fff; --td-undo-accent:#FF9D6B;
      position:absolute; left:14px; right:14px; bottom:76px; z-index:150;
      display:flex; align-items:center; justify-content:space-between; gap:10px;
      background:var(--td-undo-bg); color:var(--td-undo-ink); border-radius:var(--r-m);
      box-shadow:var(--sh-3); padding:10px 8px 10px 16px;
      opacity:0; transform:translateY(14px) scale(.97); pointer-events:none;
      transition:opacity .26s cubic-bezier(.22,1,.36,1), transform .26s cubic-bezier(.22,1,.36,1);
    }
    .td-undo.show{ opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }
    #phone.th-dark .td-undo{ --td-undo-bg:#2E2E3A; }
    .td-undo-msg{
      font-size:12.5px; font-weight:700; flex:1; min-width:0; overflow:hidden;
      text-overflow:ellipsis; white-space:nowrap;
    }
    .td-undo-btn{
      flex-shrink:0; font-size:13px; font-weight:800; color:var(--td-undo-accent);
      background:rgba(255,255,255,.14); border-radius:10px; padding:9px 16px;
      min-height:44px; min-width:44px;
    }

    /* ---- 에디터 시트 ---- */
    .td-coin-chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .td-coin-chip{ border:1.6px solid var(--line); background:var(--paper); cursor:pointer; font-weight:800; }
    .td-coin-chip.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo-d); }
    .td-coin-note{ font-size:12px; color:var(--muted); font-weight:700; }
    .td-day-chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .td-daysel-chip{ border:1.6px solid var(--line); background:var(--paper); cursor:pointer; font-weight:800; min-width:40px; text-align:center; }
    .td-daysel-chip.on{ border-color:var(--indigo); background:var(--indigo); color:#fff; }

    /* ---- 완료 축하 오버레이 ---- */
    .td-cele{
      position:absolute; inset:0; z-index:80; overflow:hidden;
      display:flex; align-items:center; justify-content:center;
      background:rgba(23,23,28,.46); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
      animation:td-fade-in .25s cubic-bezier(.22,1,.36,1);
    }
    @keyframes td-fade-in{ from{ opacity:0; } to{ opacity:1; } }
    .td-confetti{
      position:absolute; top:-24px; width:9px; height:15px; border-radius:2px;
      animation-name:td-fall; animation-timing-function:linear; animation-iteration-count:1; animation-fill-mode:forwards;
    }
    @keyframes td-fall{
      0%{ transform:translateY(0) rotate(0deg); opacity:1; }
      100%{ transform:translateY(560px) rotate(600deg); opacity:.15; }
    }
    .td-cele-card{
      position:relative; width:270px; background:var(--paper); border-radius:var(--r-l);
      box-shadow:var(--sh-3); padding:28px 22px 22px; text-align:center;
      animation:td-pop .55s cubic-bezier(.2,1.5,.4,1);
    }
    @keyframes td-pop{
      0%{ transform:scale(.4); opacity:0; }
      60%{ transform:scale(1.06); opacity:1; }
      100%{ transform:scale(1); opacity:1; }
    }
    .td-cele-emoji{ font-size:52px; line-height:1; margin-bottom:10px; }
    .td-cele-title{ font-size:19px; font-weight:800; color:var(--ink); margin-bottom:6px; }
    .td-cele-coin{
      font-size:14px; font-weight:800; color:var(--orange); background:var(--orange-s);
      border-radius:12px; padding:8px 14px; display:inline-block; margin-bottom:16px;
    }
    .td-cele-go{ width:100%; }
  `,

  _celebrated: {},

  /* '오늘' / '수요일' / '다음 주 수요일' — 지금 보고 있는 칸을 한마디로 */
  _scopeLabel(w, day){
    const d = (day == null) ? App.day : day;
    const ww = (w == null) ? App.week : (w ? 1 : 0);
    if(ww) return `다음 주 ${DAYS[d][0]}요일`;
    if(d === App.today) return '오늘';
    return `${DAYS[d][0]}요일`;
  },

  render(root){
    const day = App.day;
    const week = App.week ? 1 : 0;
    const isChildView = App.roleOf(App.vm()) === 'child';
    const list = App.todosOf(day);   // 지금 보고 있는 주 기준
    const visible = list.filter(t => App.canSee(t));
    const totalCount = visible.length;
    const doneCount = visible.filter(t => t.done).length;
    const totalCoins = visible.reduce((s, t) => s + (t.coin || 0), 0);
    const earnedCoins = visible.filter(t => t.done).reduce((s, t) => s + (t.coin || 0), 0);
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const allDone = totalCount > 0 && doneCount === totalCount;

    const incomplete = list.filter(t => !t.done);
    const completed = list.filter(t => t.done);

    root.innerHTML = `
      <div class="td-wrap">
        ${this._daysStripHtml()}
        ${this._summaryHtml({ doneCount, totalCount, totalCoins, earnedCoins, pct, allDone, isChildView, week })}
        ${App.canSetCoin() ? this._quickAddHtml(week) : ''}
        <div class="td-list">
          <div class="td-list-head">
            ${this._weekNavHtml(week)}
            <button type="button" class="btn ghost td-add-btn">+ 새 할 일 추가</button>
          </div>
          ${list.length === 0
            ? `<div class="empty-note"><div class="big">${week ? '🌱' : '🍃'}</div>${
                week ? '다음 주 할 일을 미리 적어둘 수 있어요'
                     : (day === App.today ? '오늘은 할 일이 없어요!' : `${DAYS[day][0]}요일은 할 일이 없어요`)
              }</div>`
            : `
              ${incomplete.map(t => this._itemHtml(t)).join('')}
              ${completed.length > 0
                ? `<div class="td-group-divider"><span>완료</span></div>${completed.map(t => this._itemHtml(t)).join('')}`
                : ''}
            `}
        </div>
      </div>
    `;

    this._bind(root);
  },

  openEditor(id){
    const editing = id ? App.state.todos.find(t => t.id === id) : null;
    const canSetCoin = App.canSetCoin();
    const coinPresets = [5, 10, 15, 20, 25, 30];
    const day = editing ? editing.day : App.day;
    /* 수정할 때는 그 할 일이 들어 있는 주, 새로 만들 때는 지금 보고 있는 주 */
    const week = editing ? ((editing.w || 0) ? 1 : 0) : (App.week ? 1 : 0);
    const coin = editing ? (editing.coin || 0) : 0;
    const secret = editing ? !!editing.secret : false;
    const text = editing ? editing.text : '';

    let coinFieldHtml = '';
    if(canSetCoin){
      coinFieldHtml = `
        <div class="field">
          <label>코인 보상</label>
          <div class="td-coin-chips" id="td-ed-coins">
            ${coinPresets.map(c => `<button type="button" class="pill td-coin-chip ${c === coin ? 'on' : ''}" data-coin="${c}">🪙 ${c}</button>`).join('')}
          </div>
        </div>
      `;
    } else if(App.roleOf(App.vm()) === 'child'){
      coinFieldHtml = `
        <div class="field">
          <label>코인 보상</label>
          <div class="td-coin-note">코인 보상은 부모님이 정해요 🌷</div>
        </div>
      `;
    }
    // 어른이 자기 자신의 할 일을 만들 때(canSetCoin false && vm이 아이가 아닐 때)는 코인 영역 자체를 렌더하지 않음

    const body = `
      <div class="field">
        <label>할 일 내용</label>
        <input class="inp" id="td-ed-text" placeholder="예) 방 청소하기" value="${this._esc(text)}" maxlength="40" />
      </div>
      ${coinFieldHtml}
      <div class="field">
        <label>${week ? '다음 주 요일 선택' : '요일 선택'}</label>
        ${week ? '<div class="td-weekhint">다음 주에 할 일이 생겨요</div>' : ''}
        <div class="td-day-chips" id="td-ed-days">
          ${DAYS.map((d, i) => `<button type="button" class="pill td-daysel-chip ${i === day ? 'on' : ''}" data-dsel="${i}">${d[0]}</button>`).join('')}
        </div>
      </div>
      <div class="toggle-row">
        <div>
          <div class="tl">비밀 할 일</div>
          <div class="td">나만 볼 수 있어요</div>
        </div>
        <button type="button" class="sw-tog ${secret ? 'on' : ''}" id="td-ed-secret"></button>
      </div>
    `;

    const foot = `
      ${editing ? `<button type="button" class="btn ghost" id="td-ed-del">삭제하기</button>` : ''}
      <button type="button" class="btn full" id="td-ed-save">${editing ? '수정 완료' : '할 일 등록'}</button>
    `;

    const sheetTitle = editing
      ? (week ? '다음 주 할 일 수정' : '할 일 수정')
      : (week ? '다음 주 할 일 등록' : '할 일 등록');

    App.sheet(sheetTitle, body, foot, (bodyEl, footEl) => {
      let selDay = day;
      let selCoin = coin;
      let selSecret = secret;

      if(canSetCoin){
        bodyEl.querySelectorAll('[data-coin]').forEach(btn => {
          btn.addEventListener('click', () => {
            selCoin = Number(btn.dataset.coin);
            bodyEl.querySelectorAll('[data-coin]').forEach(b => b.classList.remove('on'));
            btn.classList.add('on');
          });
        });
      }

      bodyEl.querySelectorAll('[data-dsel]').forEach(btn => {
        btn.addEventListener('click', () => {
          selDay = Number(btn.dataset.dsel);
          bodyEl.querySelectorAll('[data-dsel]').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
        });
      });

      const secretBtn = bodyEl.querySelector('#td-ed-secret');
      secretBtn.addEventListener('click', () => {
        selSecret = !selSecret;
        secretBtn.classList.toggle('on', selSecret);
      });

      const delBtn = footEl.querySelector('#td-ed-del');
      if(delBtn){
        delBtn.addEventListener('click', () => {
          App.state.todos = App.state.todos.filter(t => t.id !== editing.id);
          App.save();
          App.render();
          App.closeSheet();
          App.toast('할 일을 삭제했어요');
        });
      }

      footEl.querySelector('#td-ed-save').addEventListener('click', () => {
        const inputEl = bodyEl.querySelector('#td-ed-text');
        const val = inputEl.value.trim();
        if(!val){
          inputEl.focus();
          return;
        }
        if(editing){
          editing.text = val;
          editing.day = selDay;
          editing.secret = selSecret;
          if(canSetCoin) editing.coin = selCoin;
        } else {
          App.state.todos.push({
            id: uid(),
            day: selDay,
            w: week,                 // 0 = 이번 주, 1 = 다음 주
            for: App.vm(),
            text: val,
            coin: canSetCoin ? selCoin : 0,
            done: false,
            secret: selSecret,
            owner: App.meId()
          });
        }
        App.save();
        App.render();
        App.closeSheet();
      });
    });
  },

  _daysStripHtml(){
    return `
      <div class="td-days">
        ${DAYS.map((d, i) => {
          /* App.todosOf(i) 는 지금 보고 있는 주 기준이라 그대로 쓴다 */
          const cnt = App.todosOf(i).filter(t => App.canSee(t) && !t.done).length;
          const isToday = !App.week && i === App.today;   // '오늘'은 이번 주에만 있다
          return `
            <button type="button" class="td-day-chip ${i === App.day ? 'on' : ''} ${isToday ? 'today' : ''}" data-day="${i}">
              <span class="td-day-label">${d[0]}</span>
              ${cnt > 0 ? `<span class="td-day-dot">${cnt > 9 ? '9+' : cnt}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  },

  /* 이번 주 / 다음 주 전환 — 코어의 .wknav 스타일(선택 = 테두리 + 컬러)을 그대로 쓴다 */
  _weekNavHtml(week){
    return `
      <div class="wknav td-weeknav" id="td-weeknav">
        <button type="button" data-wk="0" class="${week ? '' : 'on'}">이번 주</button>
        <button type="button" data-wk="1" class="${week ? 'on' : ''}">다음 주</button>
      </div>
    `;
  },

  _summaryHtml({ doneCount, totalCount, totalCoins, earnedCoins, pct, allDone, isChildView, week }){
    const member = App.member();
    const name = this._esc(member.name);
    const showCoinMetrics = isChildView && totalCoins > 0;
    const scope = this._scopeLabel(week);   // '오늘' / '수요일' / '다음 주 수요일'
    const title = allDone
      ? (isChildView ? `${scope} 다 끝냈어요! 🎉` : `${name}의 ${scope} 다 끝냈어요! 🎉`)
      : (isChildView ? `${scope} 할 일` : `${name}의 ${scope} 할 일`);
    const sub = allDone
      ? '정말 최고예요!'
      : (totalCount > 0
          ? `${totalCount - doneCount}개 남았어요`
          : (week ? '미리 적어두면 다음 주가 편해요' : '아직 할 일이 없어요'));

    return `
      <div class="panel td-summary ${allDone ? 'td-summary--done' : ''}">
        <div class="td-summary-top">
          <div class="td-ring" style="--pct:${pct}">
            <div class="td-ring-inner">
              <b>${doneCount}</b><span class="td-ring-slash">/${totalCount}</span>
            </div>
          </div>
          <div class="td-summary-info">
            <div class="td-summary-title">${title}</div>
            <div class="td-summary-sub">${sub}</div>
            ${showCoinMetrics ? `
              <div class="td-summary-metrics">
                <span class="td-metric">${scope} 모을 수 있는 코인 <b>🪙 ${totalCoins}</b></span>
                <span class="td-metric">지금까지 모은 코인 <b>🪙 ${earnedCoins}</b></span>
              </div>
            ` : ''}
          </div>
        </div>
        <button type="button" class="td-goto-reward">보상 보러가기 →</button>
      </div>
    `;
  },

  _quickAddHtml(week){
    const ph = week ? '다음 주 할 일을 미리 내주세요 (Enter로 추가)' : '아이에게 할 일을 내주세요 (Enter로 추가)';
    return `
      <div class="td-quickadd">
        <span class="td-quickadd-icon">✏️</span>
        <input type="text" class="inp td-quickadd-inp" placeholder="${ph}" maxlength="40" />
      </div>
    `;
  },

  _itemHtml(t){
    const locked = t.secret && !App.canSee(t);
    if(locked){
      return `
        <div class="td-item td-item--locked">
          <div class="td-check td-check--locked" aria-hidden="true">🔒</div>
          <div class="td-text"><span class="td-txt">비밀 할 일</span></div>
        </div>
      `;
    }
    const mine = !!t.secret && App.canSee(t);
    const parentLocked = App.roleOf(t.owner) !== 'child' && t.owner !== App.meId() && !App.can('editOthers');
    return `
      <div class="td-row" data-row="${t.id}" data-locked="${parentLocked ? '1' : '0'}">
        <div class="td-swipe-bg td-swipe-bg-right" aria-hidden="true">
          <svg class="td-swipe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 18 20 6"></polyline></svg>
        </div>
        <div class="td-swipe-bg td-swipe-bg-left" aria-hidden="true">
          <span class="td-swipe-icon td-swipe-icon--trash">🗑</span>
        </div>
        <div class="td-item ${t.done ? 'done' : ''} ${mine ? 'td-item--secret' : ''}" data-id="${t.id}" data-dragged="0">
          <button type="button" class="td-check ${t.done ? 'on' : ''}" data-check="${t.id}" aria-label="${t.done ? '완료 취소하기' : '완료로 표시하기'}">
            <span class="td-check-box">
              <svg class="td-check-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 18 20 6"></polyline></svg>
            </span>
          </button>
          <div class="td-text" data-edit="${t.id}">
            ${mine ? '<span class="td-secret-tag">🤫</span>' : ''}
            <span class="td-txt">${this._esc(t.text)}</span>
            ${mine ? '<span class="td-mine-badge">나만 보임</span>' : ''}
          </div>
          ${t.coin > 0 ? `<span class="td-coin">🪙 ${t.coin}</span>` : ''}
        </div>
      </div>
    `;
  },

  _bind(root){
    root.querySelectorAll('[data-day]').forEach(chip => {
      chip.addEventListener('click', () => {
        /* 보고 있는 주는 그대로 두고 요일만 옮긴다 */
        App.setDay(Number(chip.dataset.day));
      });
    });

    root.querySelectorAll('#td-weeknav [data-wk]').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = Number(btn.dataset.wk);
        if((App.week ? 1 : 0) === w) return;
        App.goWeek(w);
        App.haptic && App.haptic();
        App.toast(w ? '다음 주 할 일이에요' : '이번 주 할 일이에요');
      });
    });

    root.querySelectorAll('[data-check]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = btn.closest('.td-item');
        if(item && item.dataset.dragged === '1') return;
        this._toggle(btn.dataset.check);
      });
    });

    root.querySelectorAll('[data-edit]').forEach(el => {
      el.addEventListener('click', () => {
        const item = el.closest('.td-item');
        if(item && item.dataset.dragged === '1') return;
        this.openEditor(el.dataset.edit);
      });
    });

    root.querySelectorAll('.td-row[data-row]').forEach(rowEl => {
      this._bindSwipeRow(rowEl);
    });

    const addBtn = root.querySelector('.td-add-btn');
    if(addBtn){
      addBtn.addEventListener('click', () => this.openEditor(null));
    }

    const rewardBtn = root.querySelector('.td-goto-reward');
    if(rewardBtn){
      rewardBtn.addEventListener('click', () => App.go('reward'));
    }

    const quickInp = root.querySelector('.td-quickadd-inp');
    if(quickInp){
      quickInp.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
          const val = quickInp.value.trim();
          if(!val) return;
          App.state.todos.push({
            id: uid(),
            day: App.day,
            w: App.week ? 1 : 0,     // 지금 보고 있는 주에 넣는다
            for: App.vm(),
            text: val,
            coin: App.canSetCoin() ? 10 : 0,
            done: false,
            secret: false,
            owner: App.meId()
          });
          App.save();
          App.toast(App.week ? '다음 주 할 일을 냈어요!' : '할 일을 냈어요!');
          App.render();
        }
      });
    }
  },

  _toggle(id){
    const t = App.state.todos.find(x => x.id === id);
    if(!t || !App.canSee(t)) return;
    const willBeDone = !t.done;
    t.done = willBeDone;
    if(willBeDone){
      App.state.coins = (App.state.coins || 0) + (t.coin || 0);
    } else {
      App.state.coins = Math.max(0, (App.state.coins || 0) - (t.coin || 0));
    }
    App.save();
    if(App.haptic) App.haptic();
    if(willBeDone) window.ModSound && ModSound.play('check');
    if(willBeDone && t.coin > 0) window.ModSound && ModSound.play('coin');

    /* 그 할 일이 들어 있는 주 기준으로 센다 (예전 데이터는 w 가 없으니 0) */
    const tw = (t.w || 0) ? 1 : 0;
    const dayTodos = App.todosOf(t.day, tw).filter(x => App.canSee(x));
    const remaining = dayTodos.filter(x => !x.done).length;
    const key = `${App.vm()}_${tw}_${t.day}`;
    this._celebrated = this._celebrated || {};

    if(willBeDone){
      if(t.coin > 0){
        App.toast(`🪙 ${t.coin}코인 획득!`);
      } else {
        App.toast('완료했어요!');
      }
      if(dayTodos.length > 0 && remaining === 0 && !this._celebrated[key]){
        this._celebrated[key] = true;
        const coinTotal = dayTodos.reduce((s, x) => s + (x.coin || 0), 0);
        this._celebrate(coinTotal, this._scopeLabel(tw, t.day));
      }
    } else {
      this._celebrated[key] = false;
    }

    if(willBeDone && window.ModBadge && typeof ModBadge.check === 'function'){ ModBadge.check('todo'); }

    App.render();
  },

  _celebrate(coinTotal, scopeLabel){
    window.ModSound && ModSound.play('complete');
    const phone = document.getElementById('phone');
    if(!phone) return;

    clearTimeout(this._celeTimer);
    const prevOverlay = phone.querySelector('.td-cele');
    if(prevOverlay) prevOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'td-cele';

    const pieceCount = 40 + Math.floor(Math.random() * 21); // 40~60
    let confettiHtml = '';
    for(let i = 0; i < pieceCount; i++){
      const left = (Math.random() * 100).toFixed(1);
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)].fill;
      const rot = Math.floor(Math.random() * 360);
      const delay = (Math.random() * 0.5).toFixed(2);
      const dur = (1.8 + Math.random() * 1.2).toFixed(2);
      confettiHtml += `<i class="td-confetti" style="left:${left}%; background:${color}; transform:rotate(${rot}deg); animation-delay:${delay}s; animation-duration:${dur}s;"></i>`;
    }

    overlay.innerHTML = `
      ${confettiHtml}
      <div class="td-cele-card">
        <div class="td-cele-emoji">🎉</div>
        <div class="td-cele-title">${this._esc(scopeLabel || '오늘')} 할 일 완료!</div>
        ${coinTotal > 0 ? `<div class="td-cele-coin">🪙 ${coinTotal}코인 모았어요</div>` : ''}
        <button type="button" class="btn full td-cele-go">보상 받으러 가기 →</button>
      </div>
    `;

    overlay.addEventListener('click', () => this._closeCelebrate());
    overlay.querySelector('.td-cele-go').addEventListener('click', (e) => {
      e.stopPropagation();
      this._closeCelebrate();
      App.go('reward');
    });

    phone.appendChild(overlay);

    this._celeTimer = setTimeout(() => this._closeCelebrate(), 3200);
  },

  _closeCelebrate(){
    clearTimeout(this._celeTimer);
    const phone = document.getElementById('phone');
    const overlay = phone && phone.querySelector('.td-cele');
    if(overlay) overlay.remove();
  },

  /* ================= 스와이프 제스처 ================= */

  _bindSwipeRow(rowEl){
    const id = rowEl.dataset.row;
    const itemEl = rowEl.querySelector('.td-item');
    if(!itemEl) return;
    const t = App.state.todos.find(x => x.id === id);
    if(!t) return;
    const parentLocked = rowEl.dataset.locked === '1';
    const bgRight = rowEl.querySelector('.td-swipe-bg-right');
    const bgLeft = rowEl.querySelector('.td-swipe-bg-left');
    const THRESH_RATIO = 0.32;

    let dragging = false, axis = null, startX = 0, startY = 0, curX = 0, rowW = 0;
    let captured = false, pointerId = null, blockedAttempt = false;

    const resetBg = () => {
      if(bgRight){ bgRight.style.opacity = '0'; bgRight.classList.remove('td-swipe-bg--armed'); }
      if(bgLeft){ bgLeft.style.opacity = '0'; bgLeft.classList.remove('td-swipe-bg--armed'); }
    };

    const onDown = e => {
      if(e.button != null && e.button !== 0) return;
      dragging = true; axis = null; curX = 0; blockedAttempt = false; captured = false;
      startX = e.clientX; startY = e.clientY;
      rowW = rowEl.offsetWidth || 300;
      pointerId = e.pointerId;
      itemEl.dataset.dragged = '0';
    };

    const onMove = e => {
      if(!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if(axis === null){
        if(Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y';
        if(axis === 'y'){ dragging = false; return; }
        // 가로 스와이프 확정 — 이제부터 포인터를 이 요소에 붙잡아 둠
        itemEl.dataset.dragged = '1';
        itemEl.style.transition = 'none';
        if(itemEl.setPointerCapture && pointerId != null){
          try{ itemEl.setPointerCapture(pointerId); captured = true; }catch(err){}
        }
      }
      if(axis !== 'x') return;
      if(e.cancelable) e.preventDefault();

      let x = dx;
      if(x < 0 && parentLocked){
        x = Math.max(x * 0.45, -rowW * 0.24);
        if(x < -30) blockedAttempt = true;
      } else {
        const cap = rowW * 0.92;
        if(x > cap) x = cap + (x - cap) * 0.18;
        if(x < -cap) x = -cap + (x + cap) * 0.18;
      }
      curX = x;
      itemEl.style.transform = `translateX(${x}px)`;

      const thresh = rowW * THRESH_RATIO;
      if(x > 0){
        if(bgRight){
          bgRight.style.opacity = String(Math.min(1, x / 28));
          bgRight.classList.toggle('td-swipe-bg--armed', x > thresh);
        }
        if(bgLeft){ bgLeft.style.opacity = '0'; bgLeft.classList.remove('td-swipe-bg--armed'); }
      } else if(x < 0){
        if(bgLeft){
          bgLeft.style.opacity = String(Math.min(1, Math.abs(x) / 28));
          bgLeft.classList.toggle('td-swipe-bg--armed', Math.abs(x) > thresh);
        }
        if(bgRight){ bgRight.style.opacity = '0'; bgRight.classList.remove('td-swipe-bg--armed'); }
      } else {
        resetBg();
      }
    };

    const onUp = () => {
      if(!dragging){ axis = null; return; }
      dragging = false;
      if(captured && itemEl.releasePointerCapture && pointerId != null){
        try{ itemEl.releasePointerCapture(pointerId); }catch(err){}
      }
      if(axis !== 'x'){ axis = null; return; }
      const thresh = rowW * THRESH_RATIO;
      if(curX > thresh){
        this._completeSwipe(rowEl, itemEl, id);
      } else if(curX < -thresh && !parentLocked){
        this._deleteSwipe(rowEl, itemEl, id);
      } else {
        this._snapBack(rowEl, itemEl);
        if(parentLocked && blockedAttempt){
          App.toast('부모님이 낸 할 일은 지울 수 없어요');
        }
      }
      axis = null;
    };

    itemEl.addEventListener('pointerdown', onDown);
    itemEl.addEventListener('pointermove', onMove);
    itemEl.addEventListener('pointerup', onUp);
    itemEl.addEventListener('pointercancel', onUp);
  },

  _snapBack(rowEl, itemEl){
    itemEl.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1)';
    itemEl.style.transform = 'translateX(0)';
    const bgRight = rowEl.querySelector('.td-swipe-bg-right');
    const bgLeft = rowEl.querySelector('.td-swipe-bg-left');
    [bgRight, bgLeft].forEach(bg => {
      if(!bg) return;
      bg.style.transition = 'opacity .3s';
      bg.style.opacity = '0';
      bg.classList.remove('td-swipe-bg--armed');
    });
  },

  _completeSwipe(rowEl, itemEl, id){
    const width = rowEl.offsetWidth || 300;
    itemEl.style.transition = 'transform .26s cubic-bezier(.22,1,.36,1), opacity .22s';
    itemEl.style.transform = `translateX(${width}px)`;
    itemEl.style.opacity = '0.35';
    clearTimeout(this._swipeActTimer);
    this._swipeActTimer = setTimeout(() => { this._toggle(id); }, 230);
  },

  _deleteSwipe(rowEl, itemEl, id){
    const t = App.state.todos.find(x => x.id === id);
    if(!t) return;
    const originalIndex = App.state.todos.indexOf(t);
    const width = rowEl.offsetWidth || 300;

    itemEl.style.transition = 'transform .22s cubic-bezier(.4,0,1,1), opacity .22s';
    itemEl.style.transform = `translateX(-${width}px)`;
    itemEl.style.opacity = '0';

    clearTimeout(this._swipeActTimer);
    this._swipeActTimer = setTimeout(() => {
      const h = rowEl.offsetHeight;
      rowEl.style.maxHeight = h + 'px';
      // 강제 리플로우 후 0으로 접기
      void rowEl.offsetHeight;
      rowEl.style.maxHeight = '0px';
      rowEl.style.opacity = '0';
      rowEl.style.marginBottom = '0px';

      clearTimeout(this._swipeCollapseTimer);
      this._swipeCollapseTimer = setTimeout(() => {
        const idx = App.state.todos.indexOf(t);
        if(idx > -1) App.state.todos.splice(idx, 1);
        App.save();
        this._showUndo(t, originalIndex);
        App.render();
      }, 300);
    }, 200);
  },

  _showUndo(item, originalIndex){
    clearTimeout(this._undoTimer);
    const phone = document.getElementById('phone');
    if(!phone) return;
    const prev = phone.querySelector('.td-undo');
    if(prev) prev.remove();

    const bar = document.createElement('div');
    bar.className = 'td-undo';
    bar.innerHTML = `
      <span class="td-undo-msg">"${this._esc(item.text)}" 삭제됨</span>
      <button type="button" class="td-undo-btn">실행 취소</button>
    `;
    phone.appendChild(bar);
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('show')));

    bar.querySelector('.td-undo-btn').addEventListener('click', () => {
      clearTimeout(this._undoTimer);
      const idx = Math.min(originalIndex, App.state.todos.length);
      App.state.todos.splice(idx, 0, item);
      App.save();
      this._hideUndo();
      App.render();
      App.toast('되돌렸어요');
    });

    this._undoTimer = setTimeout(() => this._hideUndo(), 5000);
  },

  _hideUndo(){
    clearTimeout(this._undoTimer);
    const phone = document.getElementById('phone');
    const bar = phone && phone.querySelector('.td-undo');
    if(!bar) return;
    bar.classList.remove('show');
    setTimeout(() => { if(bar.parentNode) bar.parentNode.removeChild(bar); }, 260);
  },

  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
};

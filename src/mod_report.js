window.ModReport = {
  css: `
    /* ---- 헤더 카드 ---- */
    .rp-head{
      background:linear-gradient(135deg,var(--indigo),#6D5CF0); border-radius:var(--r-l);
      padding:18px 18px 20px; color:#fff; box-shadow:var(--sh-2);
    }
    .rp-head-top{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }
    .rp-head-av{
      width:48px; height:48px; border-radius:16px; background:rgba(255,255,255,.22);
      display:flex; align-items:center; justify-content:center; font-size:24px; flex:0 0 auto;
    }
    .rp-head-name{ font-size:17px; font-weight:800; }
    .rp-head-sub{ font-size:12px; font-weight:700; opacity:.82; margin-top:1px; }
    .rp-score-wrap{ display:flex; align-items:flex-end; justify-content:space-between; gap:10px; }
    .rp-score-num{ font-size:44px; font-weight:800; line-height:1; letter-spacing:-.02em; }
    .rp-score-num .unit{ font-size:15px; font-weight:700; opacity:.75; margin-left:2px; }
    .rp-score-empty{ font-size:14px; font-weight:700; opacity:.9; line-height:1.5; padding-bottom:4px; }
    .rp-grade{
      padding:8px 15px; border-radius:20px; background:rgba(255,255,255,.22);
      font-size:12.5px; font-weight:800; white-space:nowrap;
    }

    /* ---- 섹션 공통 ---- */
    .rp-sec{ margin-top:16px; }
    .rp-sec-h{ font-size:13px; font-weight:800; color:var(--ink2); margin-bottom:10px; letter-spacing:-.01em; }

    /* ---- 요일별 완료율 막대 ---- */
    .rp-bars{
      display:flex; justify-content:space-between; align-items:flex-end; gap:6px;
      background:var(--paper); border-radius:var(--r-l); padding:16px 12px 12px; box-shadow:var(--sh-1);
    }
    .rp-bar-col{ flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; min-width:0; }
    .rp-bar-label{ font-size:10.5px; font-weight:800; color:var(--ink2); }
    .rp-bar-col.empty .rp-bar-label{ color:var(--muted); opacity:.7; }
    .rp-bar-track{
      width:100%; max-width:26px; height:100px; border-radius:8px; background:#F1F1F6;
      display:flex; align-items:flex-end; overflow:hidden; position:relative;
    }
    .rp-bar-col.empty .rp-bar-track{ background:transparent; border:1.5px dashed #E2E2EA; }
    .rp-bar-fill{
      width:100%; height:0%; background:var(--indigo); border-radius:8px 8px 0 0;
      transition:height .6s cubic-bezier(.22,1,.36,1);
    }
    .rp-bar-col.today .rp-bar-fill{ background:var(--orange); }
    .rp-bar-day{ font-size:11px; font-weight:800; color:var(--muted); }
    .rp-bar-col.today .rp-bar-day{ color:var(--orange); }

    /* ---- 코인 추이 ---- */
    .rp-coin-card{ background:var(--paper); border-radius:var(--r-l); padding:14px 14px 8px; box-shadow:var(--sh-1); }
    .rp-coin-total{ font-size:12.5px; font-weight:800; color:var(--ink2); margin-bottom:4px; }
    .rp-coin-total b{ color:var(--orange); font-size:14px; }
    .rp-coin-svg{ display:block; width:100%; height:auto; }
    .rp-line{ fill:none; stroke:var(--indigo); stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
    .rp-pt{ fill:var(--indigo); stroke:#fff; stroke-width:1.6; }
    .rp-pt.today{ fill:var(--orange); }
    .rp-coin-days{ display:flex; justify-content:space-between; padding:2px 4px 6px; }
    .rp-coin-days span{ font-size:10px; font-weight:800; color:var(--muted); flex:1; text-align:center; }
    .rp-coin-days span.today{ color:var(--orange); }

    /* ---- 준비물 챙김률 ---- */
    .rp-prep-card{
      background:var(--paper); border-radius:var(--r-l); padding:16px; box-shadow:var(--sh-1);
      display:flex; gap:16px; align-items:center;
    }
    .rp-ring-wrap{ position:relative; width:96px; height:96px; flex:0 0 auto; }
    .rp-ring-bg{ stroke:#F1F1F6; }
    .rp-ring-fg{
      stroke:#3FBF7F; stroke-linecap:round;
      transition:stroke-dashoffset .7s cubic-bezier(.22,1,.36,1);
    }
    .rp-ring-center{
      position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
    }
    .rp-ring-num{ font-size:16px; font-weight:800; color:var(--ink); }
    .rp-ring-pct{ font-size:10px; font-weight:700; color:var(--muted); margin-top:1px; }
    .rp-prep-info{ flex:1; min-width:0; }
    .rp-prep-title{ font-size:13.5px; font-weight:800; margin-bottom:4px; }
    .rp-prep-sub{ font-size:11.5px; color:var(--muted); font-weight:600; line-height:1.5; }
    .rp-prep-list{ margin-top:10px; display:flex; flex-direction:column; gap:6px; }
    .rp-prep-row{
      display:flex; align-items:center; justify-content:space-between; background:var(--bg);
      border-radius:10px; padding:8px 10px; font-size:11.5px; font-weight:700; color:var(--ink2);
    }
    .rp-prep-row b{ color:var(--ink); font-weight:800; }
    .rp-prep-row .cnt{ font-weight:800; color:var(--muted); }
    .rp-prep-row .cnt.ok{ color:#1E7A50; }

    /* ---- 잘한 점 / 도와줄 점 ---- */
    .rp-insights{ display:flex; flex-direction:column; gap:8px; }
    .rp-insight{
      display:flex; gap:9px; align-items:flex-start; padding:12px 13px; border-radius:14px;
      font-size:13px; font-weight:700; line-height:1.45;
    }
    .rp-insight .ico{ font-size:15px; flex:0 0 auto; }
    .rp-insight.good{ background:rgba(63,191,127,.14); color:#1E7A50; }
    .rp-insight.help{ background:var(--orange-s); color:#B5450A; }

    /* ---- 아이별 비교 ---- */
    .rp-cmp-wrap{ background:var(--paper); border-radius:var(--r-l); padding:16px; box-shadow:var(--sh-1); }
    .rp-cmp-row{ display:flex; align-items:center; gap:10px; }
    .rp-cmp-row + .rp-cmp-row{ margin-top:12px; }
    .rp-cmp-name{
      width:64px; font-size:12px; font-weight:800; color:var(--ink2); flex:0 0 auto;
      display:flex; align-items:center; gap:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .rp-cmp-track{ flex:1; height:14px; border-radius:8px; background:#F1F1F6; overflow:hidden; }
    .rp-cmp-fill{
      height:100%; border-radius:8px; background:var(--indigo); width:0%;
      transition:width .6s cubic-bezier(.22,1,.36,1);
    }
    .rp-cmp-score{ width:32px; text-align:right; font-size:12px; font-weight:800; color:var(--ink2); flex:0 0 auto; }

    /* ---- 하단 액션 ---- */
    .rp-foot-btn.line{ flex:0 0 108px; font-size:13px; padding:0 10px; white-space:nowrap; }
  `,

  /* ================= 부팅 ================= */
  init(){
    this._token = 0;
    this._raf1 = null;
    this._raf2 = null;
  },

  /* ================= 데이터 집계 =================
     리포트는 이번 주 기준(w=0)이다. 다음 주에 넣어둔 일정이나 반복 일정의
     "다음 주 얹힘"이 이번 주 성취에 섞이면 안 되므로 App.evs(d, 0, memberId) 로 고정해서 읽는다.
     archive=true 이면 지난 주 스냅샷(App.state.archive)에서 할 일만 집계한다
     (스케줄/준비물은 rollWeeks() 때 보존되지 않으므로 지난 주 리포트에는 포함하지 않는다). */
  _weekData(memberId, archive){
    const days = [];
    let totalTodos = 0, doneTodos = 0, totalItems = 0, packedItemsCount = 0, totalEvents = 0, alarmOnEvents = 0;
    const itemTitleStats = {};
    const todosSource = archive
      ? (App.state.archive && App.state.archive.todos || []).filter(t => (t.w || 0) === 0)
      : null;

    for(let d = 0; d < 7; d++){
      const todosDay = archive
        ? todosSource.filter(t => (t.for || App.defaultTodoOwner()) === memberId && t.day === d && App.canSee(t))
        : App.state.todos.filter(t => (t.for || App.defaultTodoOwner()) === memberId && t.day === d && (t.w || 0) === 0 && App.canSee(t));
      const doneDay = todosDay.filter(t => t.done);
      const coinDay = doneDay.reduce((s, t) => s + (t.coin || 0), 0);
      totalTodos += todosDay.length; doneTodos += doneDay.length;

      const evs = archive ? [] : App.evs(d, 0, memberId).filter(ev => App.canSee(ev));
      totalEvents += evs.length;
      alarmOnEvents += evs.filter(ev => ev.alarm).length;

      let dayItemsTotal = 0, dayItemsPacked = 0;
      const prepEvs = [];
      evs.forEach(ev => {
        const items = ev.items || [];
        if(items.length){
          prepEvs.push(ev);
          let evPacked = 0;
          items.forEach(it => {
            totalItems++; dayItemsTotal++;
            const packed = !!App.packed[`${d}|${ev.id}|${it}`];
            if(packed){ packedItemsCount++; dayItemsPacked++; evPacked++; }
          });
          const st = itemTitleStats[ev.t] || (itemTitleStats[ev.t] = { total:0, missed:0 });
          st.total += items.length;
          st.missed += (items.length - evPacked);
        }
      });

      days.push({
        day:d, total:todosDay.length, done:doneDay.length,
        rate: todosDay.length ? doneDay.length / todosDay.length : null,
        coin:coinDay, prepEvs, itemsTotal:dayItemsTotal, itemsPacked:dayItemsPacked
      });
    }

    return { days, totalTodos, doneTodos, totalItems, packedItemsCount, totalEvents, alarmOnEvents, itemTitleStats, archive:!!archive };
  },

  _score(wd){
    const comps = [];
    if(wd.totalTodos > 0) comps.push({ v: wd.doneTodos / wd.totalTodos, w:50 });
    if(wd.totalItems > 0) comps.push({ v: wd.packedItemsCount / wd.totalItems, w:25 });
    if(wd.totalEvents > 0) comps.push({ v: wd.alarmOnEvents / wd.totalEvents, w:25 });
    if(!comps.length) return null;
    const wsum = comps.reduce((s, c) => s + c.w, 0);
    const val = comps.reduce((s, c) => s + c.v * c.w, 0) / wsum;
    return Math.max(0, Math.min(100, Math.round(val * 100)));
  },

  _grade(score){
    if(score == null) return null;
    if(score >= 90) return { label:'최고예요' };
    if(score >= 70) return { label:'잘하고 있어요' };
    if(score >= 50) return { label:'조금만 더' };
    return { label:'함께 해봐요' };
  },

  _insights(wd){
    const msgs = [];
    const daysWithData = wd.days.filter(d => d.total > 0);

    const fullDays = daysWithData.filter(d => d.rate === 1);
    if(fullDays.length){
      msgs.push({ tone:'good', text:`${DAYS[fullDays[0].day][0]}요일엔 할 일을 다 끝냈어요` });
    }

    let streak = [], bestStreak = [];
    for(let i = 0; i < 7; i++){
      const d = wd.days[i];
      if(d.total > 0 && d.rate === 1){ streak.push(i); if(streak.length > bestStreak.length) bestStreak = streak.slice(); }
      else streak = [];
    }
    if(bestStreak.length >= 3){
      const s = DAYS[bestStreak[0]][0], e = DAYS[bestStreak[bestStreak.length - 1]][0];
      msgs.push({ tone:'good', text:`${s}~${e}요일, ${bestStreak.length}일 연속 다 했어요!` });
    }

    const incomplete = daysWithData.filter(d => d.rate < 1).sort((a, b) => a.rate - b.rate);
    if(incomplete.length){
      msgs.push({ tone:'help', text:`${DAYS[incomplete[0].day][0]}요일은 조금 힘들었나 봐요` });
    }

    let worstTitle = null, worstRatio = 0;
    Object.keys(wd.itemTitleStats).forEach(t => {
      const st = wd.itemTitleStats[t];
      if(st.total >= 2){
        const ratio = st.missed / st.total;
        if(ratio >= 0.5 && ratio > worstRatio){ worstRatio = ratio; worstTitle = t; }
      }
    });
    if(worstTitle){
      msgs.push({ tone:'help', text:`${this._esc(worstTitle)} 준비물을 자주 놓쳐요` });
    }

    if(!msgs.length) return null;
    if(msgs.length === 1 && wd.totalTodos > 0){
      msgs.push({ tone:'good', text:'꾸준히 기록을 이어가고 있어요' });
    }
    return msgs.slice(0, 4);
  },

  /* ================= 마크업 ================= */
  _headHtml(member, score, grade, archive){
    const scoreHtml = score == null
      ? `<div class="rp-score-empty">${archive ? '지난 주엔 기록된 활동이 없어요' : '이번 주엔 기록된 활동이 아직 없어요'}</div>`
      : `<div class="rp-score-num">${score}<span class="unit">점</span></div><div class="rp-grade">${grade.label}</div>`;
    return `
      <div class="rp-head">
        <div class="rp-head-top">
          <div class="rp-head-av">${esc(member.emoji || '🙂')}</div>
          <div>
            <div class="rp-head-name">${this._esc(member.name)}</div>
            <div class="rp-head-sub">${archive ? '지난 주 리포트' : '이번 주 리포트'}</div>
          </div>
        </div>
        <div class="rp-score-wrap">${scoreHtml}</div>
      </div>
    `;
  },

  _barsHtml(wd){
    const cols = wd.days.map(d => {
      const isToday = d.day === App.today;
      const pct = d.total ? Math.round(d.rate * 100) : 0;
      const label = d.total ? `${d.done}/${d.total}` : '-';
      return `
        <div class="rp-bar-col ${isToday ? 'today' : ''} ${d.total ? '' : 'empty'}">
          <div class="rp-bar-label">${label}</div>
          <div class="rp-bar-track"><div class="rp-bar-fill" data-pct="${pct}"></div></div>
          <div class="rp-bar-day">${DAYS[d.day][0]}</div>
        </div>
      `;
    }).join('');
    return `<div class="rp-bars">${cols}</div>`;
  },

  _coinHtml(wd){
    const W = 320, H = 104, padX = 18, padY = 14;
    const maxCoin = Math.max(1, ...wd.days.map(d => d.coin));
    const stepX = (W - padX * 2) / 6;
    const pts = wd.days.map((d, i) => {
      const x = +(padX + i * stepX).toFixed(1);
      const y = +(H - padY - (d.coin / maxCoin) * (H - padY * 2)).toFixed(1);
      return { x, y, d };
    });
    const lineStr = pts.map(p => `${p.x},${p.y}`).join(' ');
    const circles = pts.map(p => `<circle class="rp-pt ${p.d.day === App.today ? 'today' : ''}" cx="${p.x}" cy="${p.y}" r="4"></circle>`).join('');
    const totalCoin = wd.days.reduce((s, d) => s + d.coin, 0);
    const daysRow = wd.days.map(d => `<span class="${d.day === App.today ? 'today' : ''}">${DAYS[d.day][0]}</span>`).join('');
    return `
      <div class="rp-coin-card">
        <div class="rp-coin-total">${wd.archive ? '지난 주' : '이번 주'} 누적 <b>${totalCoin}</b>코인 모았어요</div>
        <svg class="rp-coin-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <polyline class="rp-line" points="${lineStr}"></polyline>
          ${circles}
        </svg>
        <div class="rp-coin-days">${daysRow}</div>
      </div>
    `;
  },

  _prepHtml(wd){
    const r = 40, C = +(2 * Math.PI * r).toFixed(2);
    const prepRate = wd.totalItems ? wd.packedItemsCount / wd.totalItems : 0;
    const target = +(C * (1 - prepRate)).toFixed(2);
    const centerHtml = wd.totalItems
      ? `<div class="rp-ring-num">${wd.packedItemsCount}/${wd.totalItems}</div><div class="rp-ring-pct">${Math.round(prepRate * 100)}%</div>`
      : `<div class="rp-ring-num">–</div><div class="rp-ring-pct">기록 없음</div>`;
    let subText;
    if(!wd.totalItems){
      subText = wd.archive ? '지난 주 준비물 기록은 남아있지 않아요' : '이번 주엔 준비물이 있는 일정이 없어요';
    } else if(prepRate >= 0.8){
      subText = '이번 주 준비물 챙기기, 잘 해내고 있어요';
    } else if(prepRate >= 0.4){
      subText = '준비물을 절반 정도 챙겼어요, 조금만 더 신경 써볼까요';
    } else {
      subText = '준비물을 자주 놓치고 있어요, 같이 챙겨봐요';
    }

    const prepEvents = [];
    wd.days.forEach(d => d.prepEvs.forEach(ev => prepEvents.push({ day:d.day, ev })));
    const listHtml = prepEvents.length ? `
      <div class="rp-prep-list">
        ${prepEvents.map(({ day, ev }) => {
          const items = ev.items || [];
          const packedN = items.filter(it => !!App.packed[`${day}|${ev.id}|${it}`]).length;
          return `<div class="rp-prep-row">
            <span>${DAYS[day][0]} · <b>${this._esc(ev.t)}</b></span>
            <span class="cnt ${packedN === items.length ? 'ok' : ''}">${packedN}/${items.length}</span>
          </div>`;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="rp-prep-card">
        <div class="rp-ring-wrap">
          <svg viewBox="0 0 96 96" width="96" height="96">
            <circle class="rp-ring-bg" cx="48" cy="48" r="${r}" fill="none" stroke-width="9"></circle>
            <circle class="rp-ring-fg" cx="48" cy="48" r="${r}" fill="none" stroke-width="9"
              stroke-dasharray="${C}" stroke-dashoffset="${C}" data-target="${target}"
              transform="rotate(-90 48 48)"></circle>
          </svg>
          <div class="rp-ring-center">${centerHtml}</div>
        </div>
        <div class="rp-prep-info">
          <div class="rp-prep-title">준비물 챙김률</div>
          <div class="rp-prep-sub">${subText}</div>
        </div>
      </div>
      ${listHtml}
    `;
  },

  _insightsHtml(wd){
    const insights = this._insights(wd);
    if(!insights){
      return `<div class="empty-note"><div class="big">🌱</div>아직 이야기할 만한 기록이 없어요</div>`;
    }
    return `<div class="rp-insights">${insights.map(m => `
      <div class="rp-insight ${m.tone}"><span class="ico">${m.tone === 'good' ? '🌟' : '🤝'}</span><span>${m.text}</span></div>
    `).join('')}</div>`;
  },

  _compareHtml(archive){
    if(!App.can('editOthers')) return '';
    const children = App.state.members.filter(m => m.role === 'child');
    if(children.length < 2) return '';
    const rows = children.map(m => ({ m, score:this._score(this._weekData(m.id, archive)) }));
    const rowsHtml = rows.map(r => `
      <div class="rp-cmp-row">
        <div class="rp-cmp-name">${esc(r.m.emoji || '🙂')} ${this._esc(r.m.name)}</div>
        <div class="rp-cmp-track"><div class="rp-cmp-fill" data-pct="${r.score || 0}"></div></div>
        <div class="rp-cmp-score">${r.score == null ? '-' : r.score}</div>
      </div>
    `).join('');
    return `
      <div class="rp-sec">
        <div class="rp-sec-h">아이별 비교</div>
        <div class="rp-cmp-wrap">${rowsHtml}</div>
      </div>
    `;
  },

  /* ================= 진입점 =================
     archive=true 면 App.state.archive(지난 주 스냅샷)로 보여준다. */
  open(memberId, archive){
    if(this._raf1) cancelAnimationFrame(this._raf1);
    if(this._raf2) cancelAnimationFrame(this._raf2);
    this._token = (this._token || 0) + 1;
    const token = this._token;

    const mid = memberId || App.vm();
    const member = App.member(mid);
    if(!member) return App.toast('멤버를 찾을 수 없어요');

    const showArchive = !!archive && !!App.state.archive;
    if(archive && !App.state.archive){ App.toast('지난 주 기록이 아직 없어요'); return; }

    const wd = this._weekData(mid, showArchive);
    const score = this._score(wd);
    const grade = this._grade(score);

    const body = `
      ${this._headHtml(member, score, grade, showArchive)}
      <div class="rp-sec">
        <div class="rp-sec-h">요일별 할 일 완료율</div>
        ${this._barsHtml(wd)}
      </div>
      <div class="rp-sec">
        <div class="rp-sec-h">코인 추이</div>
        ${this._coinHtml(wd)}
      </div>
      <div class="rp-sec">
        <div class="rp-sec-h">준비물 챙김률</div>
        ${this._prepHtml(wd)}
      </div>
      <div class="rp-sec">
        <div class="rp-sec-h">잘한 점 · 도와줄 점</div>
        ${this._insightsHtml(wd)}
      </div>
      ${this._compareHtml(showArchive)}
    `;

    const foot = showArchive
      ? `
        <button type="button" class="btn line rp-foot-btn" id="rpThisWeek">이번 주 보기</button>
        <button type="button" class="btn full" id="rpShare">리포트 공유하기</button>
      `
      : `
        <button type="button" class="btn line rp-foot-btn" id="rpLastWeek">지난 주 보기</button>
        <button type="button" class="btn full" id="rpShare">리포트 공유하기</button>
      `;

    App.sheet(`${esc(member.name)}의 주간 리포트`, body, foot, (b, f) => {
      this._raf1 = requestAnimationFrame(() => {
        this._raf2 = requestAnimationFrame(() => {
          if(token !== this._token) return;
          b.querySelectorAll('.rp-bar-fill').forEach(el => { el.style.height = (el.dataset.pct || 0) + '%'; });
          b.querySelectorAll('.rp-cmp-fill').forEach(el => { el.style.width = (el.dataset.pct || 0) + '%'; });
          const ring = b.querySelector('.rp-ring-fg');
          if(ring) ring.style.strokeDashoffset = ring.dataset.target;
        });
      });

      const shareBtn = f.querySelector('#rpShare');
      if(shareBtn) shareBtn.addEventListener('click', () => {
        if(App.haptic) App.haptic();
        App.toast('리포트를 공유했어요 📤');
      });
      const lastBtn = f.querySelector('#rpLastWeek');
      if(lastBtn) lastBtn.addEventListener('click', () => {
        if(App.haptic) App.haptic();
        this.open(mid, true);
      });
      const thisBtn = f.querySelector('#rpThisWeek');
      if(thisBtn) thisBtn.addEventListener('click', () => {
        if(App.haptic) App.haptic();
        this.open(mid, false);
      });
    });
  },

  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
};

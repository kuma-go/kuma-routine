window.ModFamily = {
  css: `
    .fm-wrap{ padding:18px 18px 100px; }
    .fm-section{ margin-bottom:20px; }

    /* ---- 역할 전환 스위처 ---- */
    .fm-role-switch{ margin-bottom:20px; }
    .fm-role-track{
      display:grid; grid-template-columns:1fr 1fr; gap:6px; background:var(--indigo-s);
      border-radius:18px; padding:5px;
    }
    .fm-role-opt{
      display:flex; align-items:center; justify-content:center; gap:6px;
      height:48px; border-radius:14px; font-size:15px; font-weight:800; color:var(--indigo-d);
      background:transparent; opacity:.55;
      transition:background .24s cubic-bezier(.22,1,.36,1), color .24s cubic-bezier(.22,1,.36,1),
                 opacity .24s cubic-bezier(.22,1,.36,1), transform .15s;
    }
    .fm-role-opt:active{ transform:scale(.97); }
    .fm-role-opt.on{ background:var(--paper); color:var(--indigo); opacity:1; box-shadow:var(--sh-2); }
    .fm-role-opt.on[data-role="master"]{ color:var(--orange); }
    .fm-role-hint{
      margin-top:10px; text-align:center; font-size:12.5px; font-weight:700; color:var(--ink2);
      background:var(--bg); border-radius:12px; padding:10px 12px; line-height:1.4;
    }

    /* ---- 가족 멤버 ---- */
    .fm-members{ display:flex; flex-direction:column; gap:10px; }
    .fm-member-card{
      display:flex; align-items:center; gap:12px; background:var(--paper); border-radius:var(--r-l);
      box-shadow:var(--sh-1); padding:12px 14px;
    }
    .fm-member-avatar{
      flex-shrink:0; width:48px; height:48px; border-radius:16px; border:1.6px solid transparent;
      display:flex; align-items:center; justify-content:center; font-size:23px;
      -webkit-appearance:none; appearance:none; padding:0; font-family:inherit; cursor:pointer;
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .2s;
    }
    .fm-member-avatar:active{ transform:scale(.93); }
    .fm-member-avatar.fm-avatar-locked{ cursor:default; }
    .fm-member-avatar.fm-avatar-locked:active{ transform:none; }
    .fm-member-info{ flex:1; min-width:0; }
    .fm-member-name-row{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
    .fm-member-name{ font-size:15px; font-weight:800; color:var(--ink); }
    .fm-role-badge{ font-size:11px; font-weight:800; padding:3px 9px; border-radius:10px; }
    .fm-role-badge--master{ background:var(--indigo-s); color:var(--indigo-d); }
    .fm-role-badge--child{ background:var(--orange-s); color:var(--orange); }
    .fm-me-badge{ font-size:10.5px; font-weight:800; color:#fff; background:var(--ink); padding:3px 8px; border-radius:9px; }
    .fm-member-perm{ margin-top:5px; font-size:12px; font-weight:600; color:var(--muted); }
    .fm-member-week{ margin-top:4px; font-size:11.5px; font-weight:700; color:var(--muted); }
    .fm-add-btn{ margin-top:10px; }

    /* ---- 아바타/프로필 편집 시트 ---- */
    .fm-avatar-grid{ display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
    .fm-avatar-cell{
      position:relative; display:flex; align-items:center; justify-content:center; height:44px;
      border-radius:12px; background:var(--bg); border:1.6px solid transparent; font-size:20px;
      -webkit-appearance:none; appearance:none; padding:0; cursor:pointer;
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .2s, background .2s;
    }
    .fm-avatar-cell:active{ transform:scale(.92); }
    .fm-avatar-cell.on{ border-color:var(--indigo); background:var(--indigo-s); transform:scale(1.1); }
    .fm-avatar-emoji{ display:inline-block; transition:transform .15s cubic-bezier(.22,1,.36,1); }
    .fm-avatar-cell.on .fm-avatar-emoji{ transform:scale(1.18); }
    .fm-avatar-cell.dupe{ opacity:.5; }
    .fm-avatar-dupe-label{
      position:absolute; bottom:-3px; left:50%; transform:translateX(-50%); font-size:8px; font-weight:800;
      color:var(--muted); background:var(--paper); padding:0 3px; border-radius:4px; white-space:nowrap;
      max-width:38px; overflow:hidden; text-overflow:ellipsis; box-shadow:var(--sh-1);
    }

    /* ---- 초대/공유 ---- */
    .fm-invite-row{ display:flex; align-items:center; gap:10px; margin-bottom:16px; }
    .fm-code-box{
      flex:1; min-width:0; height:52px; border-radius:var(--r-m); background:var(--bg);
      border:1.6px dashed var(--line); display:flex; align-items:center; justify-content:center;
      font-family:'SFMono-Regular',Menlo,Consolas,monospace; font-size:19px; font-weight:800;
      letter-spacing:.13em; color:var(--indigo-d);
    }
    .fm-copy-btn{ flex-shrink:0; font-size:13px; padding:0 16px; }
    .fm-qr-wrap{
      display:flex; flex-direction:column; align-items:center; gap:8px; padding-top:16px;
      border-top:1px solid var(--line);
    }
    .fm-qr{
      display:grid; width:148px; height:148px; padding:9px; background:#fff; border-radius:var(--r-m);
      box-shadow:var(--sh-1); border:1px solid var(--line);
    }
    .fm-qr-cell{ background:transparent; border-radius:1px; }
    .fm-qr-cell.on{ background:var(--ink); }
    .fm-qr-card{
      width:164px; height:164px; padding:12px; background:#fff; border-radius:var(--r-m);
      box-shadow:var(--sh-1); border:1px solid var(--line); box-sizing:border-box;
    }
    .fm-qr-card svg{ display:block; width:100%; height:100%; }
    .fm-qr-label{ font-size:11.5px; font-weight:700; color:var(--muted); text-align:center; }
    .fm-qr-label span{ display:block; font-size:10.5px; color:#C6C6D0; margin-top:1px; }
    .fm-qr-link{
      max-width:230px; min-height:44px; display:flex; align-items:center; justify-content:center; gap:5px;
      margin:0; padding:6px 10px; background:var(--bg); border:1px solid var(--line);
      border-radius:var(--r-s); font-size:10.5px; font-weight:700; color:var(--ink2);
      font-family:'SFMono-Regular',Menlo,Consolas,monospace; word-break:break-all; line-height:1.35;
      text-align:center; cursor:pointer; transition:background .15s cubic-bezier(.22,1,.36,1);
    }
    .fm-qr-link:active{ background:var(--indigo-s); border-color:var(--indigo); color:var(--indigo-d); }
    .fm-qr-link .fm-qr-link-ico{ flex-shrink:0; font-size:11px; }

    /* ---- 잠긴 토글 ---- */
    .fm-lock-ico{ font-size:10.5px; margin-left:3px; }
    .fm-locked{ opacity:.9; cursor:not-allowed; }

    /* ---- 비밀 항목 패널 ---- */
    .fm-secret-panel{ padding:0; overflow:hidden; }
    .fm-secret-head{
      width:100%; display:flex; align-items:center; gap:10px; padding:16px; min-height:44px;
      text-align:left; background:none; border:none; cursor:pointer;
    }
    .fm-secret-icon{ font-size:19px; }
    .fm-secret-title{ flex:1; font-size:14px; font-weight:700; color:var(--ink2); }
    .fm-secret-title b{ color:var(--indigo); font-size:15px; font-weight:800; }
    .fm-secret-chevron{
      width:18px; height:18px; color:var(--muted); flex-shrink:0;
      transition:transform .25s cubic-bezier(.22,1,.36,1);
    }
    .fm-secret-head.on .fm-secret-chevron{ transform:rotate(180deg); }
    .fm-secret-body{ max-height:0; overflow:hidden; transition:max-height .32s cubic-bezier(.22,1,.36,1); }
    .fm-secret-inner{ padding:0 16px 16px; display:flex; flex-direction:column; gap:8px; }
    .fm-secret-item{
      display:flex; align-items:center; gap:10px; background:var(--indigo-s); border-radius:var(--r-s);
      padding:10px 12px;
    }
    .fm-secret-emoji{ font-size:16px; flex-shrink:0; }
    .fm-secret-item-text{ display:flex; flex-direction:column; gap:1px; min-width:0; }
    .fm-secret-item-text b{ font-size:13px; font-weight:800; color:var(--indigo-d); word-break:break-all; }
    .fm-secret-item-text span{ font-size:11px; font-weight:600; color:var(--muted); }

    /* ---- 주간 요약 ---- */
    .fm-weekly-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .fm-weekly-stat{
      display:flex; flex-direction:column; align-items:flex-start; gap:5px; background:var(--paper);
      border-radius:var(--r-l); box-shadow:var(--sh-1); padding:16px;
    }
    .fm-weekly-icon{ font-size:20px; }
    .fm-weekly-value{ font-size:21px; font-weight:800; color:var(--ink); letter-spacing:-.01em; }
    .fm-weekly-label{ font-size:12px; font-weight:700; color:var(--muted); }

    /* ---- 공유 카드 CTA ---- */
    .fm-share-cta{ display:flex; align-items:center; justify-content:center; gap:8px; }

    /* ---- 공유 미리보기 카드 (시트 안) ---- */
    .fm-share-card{
      border-radius:var(--r-xl); padding:22px 20px 20px; color:#fff;
      background:linear-gradient(135deg, var(--indigo) 0%, #6D5CF0 55%, var(--orange) 135%);
      box-shadow:var(--sh-2); position:relative; overflow:hidden;
    }
    .fm-share-card-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .fm-share-badge{
      font-size:11px; font-weight:800; letter-spacing:.08em; background:rgba(255,255,255,.24);
      padding:5px 10px; border-radius:10px;
    }
    .fm-share-week{ font-size:11.5px; font-weight:800; opacity:.82; font-variant-numeric:tabular-nums; }
    .fm-share-badge b{ font-weight:600; letter-spacing:.02em; text-transform:none; }
    .fm-share-title{ font-size:21px; font-weight:800; letter-spacing:-.02em; }
    .fm-share-head{ font-size:13px; font-weight:700; opacity:.86; margin:3px 0 16px; line-height:1.4; }

    .fm-share-stats{ display:flex; gap:8px; margin-bottom:14px; }
    .fm-share-stats > div{
      flex:1; background:rgba(255,255,255,.17); border-radius:var(--r-m); padding:9px 6px 10px; text-align:center;
    }
    .fm-share-stats span{ display:block; font-size:9.5px; font-weight:800; opacity:.8; letter-spacing:.01em; margin-bottom:3px; }
    .fm-share-stats b{ display:block; font-size:19px; font-weight:800; line-height:1; font-variant-numeric:tabular-nums; }
    .fm-share-stats b i{ font-style:normal; font-size:11.5px; font-weight:700; opacity:.72; margin-left:1px; }

    .fm-share-chart{ background:rgba(255,255,255,.14); border-radius:var(--r-m); padding:10px 12px 9px; }
    .fm-share-chart-head{
      display:flex; align-items:center; justify-content:space-between;
      font-size:9.5px; font-weight:800; opacity:.8; margin-bottom:8px;
    }
    .fm-share-legend{ display:flex; align-items:center; gap:4px; opacity:.9 }
    .fm-share-legend i{ display:inline-block; margin-left:5px }
    .fm-share-legend .lg-bar{ width:5px; height:9px; border-radius:2px; background:#fff }
    .fm-share-legend .lg-dot{ width:6px; height:6px; border-radius:50%; background:#8AF0BE }
    .fm-share-bars{ display:flex; align-items:flex-end; gap:5px; }
    .fm-share-bar-col{ flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; min-width:0 }
    .fm-share-num{ font-size:10.5px; font-weight:800; opacity:.95; font-variant-numeric:tabular-nums; line-height:1 }
    .fm-share-num.z{ opacity:.4 }
    .fm-share-track{
      width:100%; max-width:20px; height:44px;
      background:transparent; border-bottom:1.5px solid rgba(255,255,255,.34);
      display:flex; align-items:flex-end;
    }
    .fm-share-bar{ width:100%; background:#fff; border-radius:3px 3px 0 0; min-height:3px; transition:height .4s cubic-bezier(.22,1,.36,1); }
    .fm-share-dow{ font-size:10px; font-weight:800; opacity:.82; }
    .fm-share-todo{ width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.22); }
    .fm-share-todo.full{ background:#8AF0BE }
    .fm-share-todo.part{ background:#8AF0BE; opacity:.45 }
    .fm-share-todo.zero{ background:rgba(255,255,255,.3) }
    .fm-share-todo.none{ background:transparent; box-shadow:inset 0 0 0 1px rgba(255,255,255,.22) }

    .fm-share-foot{ display:flex; align-items:center; gap:9px; margin-top:13px; font-size:10.5px; font-weight:800; opacity:.9 }
    .fm-share-rate{ flex:1; height:6px; border-radius:4px; background:rgba(255,255,255,.2); overflow:hidden }
    .fm-share-rate-fill{ height:100%; border-radius:4px; background:#8AF0BE; transition:width .45s cubic-bezier(.22,1,.36,1) }

    /* ---- 브랜딩 워드마크 ---- */
    .fm-brand{
      text-align:center; margin-top:4px; padding:10px 0 2px; font-size:12px; font-weight:800;
      letter-spacing:.06em; color:var(--muted);
    }
    .fm-brand b{ color:var(--indigo-d); font-weight:800; }
  `,

  render(root){
    if(!App.state.share){
      App.state.share = { scheduleShare:true, itemAlarm:true, todoDoneAlert:true, secretHide:true };
      App.save();
    } else if(App.state.share.secretHide !== true){
      App.state.share.secretHide = true;
    }
    this._avatarList();

    const role = App.state.role;
    const secretItems = this._secretItems();

    root.innerHTML = `
      <div class="fm-wrap">
        ${this._roleSwitchHtml(role)}
        ${this._membersHtml()}
        ${this._inviteHtml()}
        ${this._shareSettingsHtml()}
        ${this._secretPanelHtml(secretItems)}
        ${this._weeklyHtml(this._weeklyStats())}
        ${this._shareCtaHtml()}
        ${this._brandHtml()}
      </div>
    `;

    this._bind(root);
  },

  openSharePreview(){
    const stats = this._weeklyStats();
    const maxCount = Math.max(1, ...stats.perDay);
    const who = App.member(App.vm());
    const name = who ? who.name : '우리 가족';
    const mid = App.vm();

    /* 이번 주 날짜 범위 */
    const now = new Date();
    const sun = new Date(now); sun.setDate(now.getDate() - now.getDay());
    const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
    const fmt = d => `${d.getMonth() + 1}.${d.getDate()}`;

    /* 요일별 할 일 완료 상태 */
    const todoByDay = DAYS.map((_, i) => {
      const list = (App.state.todos || []).filter(t => (t.for || 'm1') === mid && t.day === i && App.canSee(t));
      return { total: list.length, done: list.filter(t => t.done).length };
    });
    const perfectDays = todoByDay.filter(d => d.total > 0 && d.done === d.total).length;

    /* 한 줄 요약 문장 — 데이터에서 생성 */
    let head;
    if (stats.todoTotal === 0) head = `일정 ${stats.totalSchedules}개로 채운 한 주였어요`;
    else if (stats.todoDone === stats.todoTotal) head = `할 일 ${stats.todoTotal}개를 모두 끝냈어요!`;
    else if (perfectDays >= 3) head = `${perfectDays}일이나 할 일을 다 끝냈어요`;
    else head = `할 일 ${stats.todoTotal}개 중 ${stats.todoDone}개를 끝냈어요`;

    const rate = stats.todoTotal ? Math.round(stats.todoDone / stats.todoTotal * 100) : 0;

    const body = `
      <div class="fm-share-card">
        <div class="fm-share-card-top">
          <span class="fm-share-badge">KUMA <b>routine</b></span>
          <span class="fm-share-week">${fmt(sun)} – ${fmt(sat)}</span>
        </div>
        <div class="fm-share-title">${this._esc(name)}의 한 주</div>
        <div class="fm-share-head">${head}</div>

        <div class="fm-share-stats">
          <div><span>일정</span><b>${stats.totalSchedules}<i>개</i></b></div>
          <div><span>할 일 완료</span><b>${stats.todoDone}<i>/${stats.todoTotal}</i></b></div>
          <div><span>모은 코인</span><b>${stats.coins}<i>개</i></b></div>
        </div>

        <div class="fm-share-chart">
          <div class="fm-share-chart-head">
            <span>요일별 일정 수</span>
            <span class="fm-share-legend"><i class="lg-bar"></i>일정<i class="lg-dot"></i>할 일 완료</span>
          </div>
          <div class="fm-share-bars">
            ${DAYS.map((d, i) => {
              const c = stats.perDay[i], t = todoByDay[i];
              const hp = Math.round(c / maxCount * 100);
              const st = t.total === 0 ? 'none' : (t.done === t.total ? 'full' : (t.done > 0 ? 'part' : 'zero'));
              return `<div class="fm-share-bar-col">
                <b class="fm-share-num ${c ? '' : 'z'}">${c || '·'}</b>
                <div class="fm-share-track"><div class="fm-share-bar" style="height:${c ? Math.max(8, hp) : 0}%"></div></div>
                <span class="fm-share-dow">${d[0]}</span>
                <i class="fm-share-todo ${st}" title="${t.done}/${t.total}"></i>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="fm-share-foot">
          <div class="fm-share-rate"><div class="fm-share-rate-fill" style="width:${rate}%"></div></div>
          <span>할 일 완료율 ${rate}%</span>
        </div>
      </div>
    `;

    const foot = `
      <button type="button" class="btn line" id="fm-share-save">이미지로 저장</button>
      <button type="button" class="btn full" id="fm-share-link">링크 복사</button>
    `;

    App.sheet('이번 주 일정 카드', body, foot, (bodyEl, footEl) => {
      footEl.querySelector('#fm-share-save').addEventListener('click', () => {
        App.toast('이미지로 저장했어요');
      });
      footEl.querySelector('#fm-share-link').addEventListener('click', () => {
        this._copyText('https://kumaroutine.app/share/' + App.state.inviteCode, '공유 링크를 복사했어요');
      });
    });
  },

  _roleSwitchHtml(role){
    const ms = App.state.members || [];
    const kid = ms.find(m => m.id === 'm1') || ms.find(m => m.role === 'child') || {};
    const par = ms.find(m => m.id === 'm2') || ms.find(m => m.role === 'master') || {};
    const hint = role === 'master'
      ? '부모 모드에서는 보상과 할 일을 설정할 수 있어요'
      : '아이 모드에서는 오늘 할 일과 일정을 확인할 수 있어요';
    return `
      <div class="fm-role-switch">
        <div class="sec-h" style="margin-bottom:8px;"><h2>지금 보는 사람</h2></div>
        <div class="fm-role-track">
          <button type="button" class="fm-role-opt ${role === 'child' ? 'on' : ''}" data-role="child">
            <span class="fm-role-em">${esc(kid.emoji || '🐣')}</span>${esc(kid.name || '아이')}</button>
          <button type="button" class="fm-role-opt ${role === 'master' ? 'on' : ''}" data-role="master">
            <span class="fm-role-em">${esc(par.emoji || '🌷')}</span>${esc(par.name || '부모')}</button>
        </div>
        <div class="fm-role-hint">${hint}</div>
      </div>
    `;
  },

  _membersHtml(){
    const members = App.state.members || [];
    const addBtn = App.isMaster()
      ? `<button type="button" class="btn line full fm-add-btn" id="fm-add-member">+ 가족 추가</button>`
      : '';
    return `
      <div class="fm-section">
        <div class="sec-h"><h2>가족 구성원</h2><span class="sub">${members.length}명</span></div>
        <div class="fm-members">
          ${members.map(m => this._memberCardHtml(m)).join('')}
        </div>
        ${addBtn}
      </div>
    `;
  },

  _memberCardHtml(m){
    const isMe = m.id === App.meId();
    const roleLabel = m.role === 'master' ? '부모' : '아이';
    const roleClass = m.role === 'master' ? 'fm-role-badge--master' : 'fm-role-badge--child';
    const perm = App.isMaster() ? `<div class="fm-member-perm">${this._permSummary(m.role)}</div>` : '';
    const color = m.color || '#7B96EF';
    const canEdit = isMe || App.isMaster();
    const weekCount = this._memberWeekCount(m.id);
    return `
      <div class="fm-member-card">
        <button type="button" class="fm-member-avatar ${canEdit ? '' : 'fm-avatar-locked'}" data-edit-member="${m.id}"
          style="background:${color}2A;border-color:${color}66;" aria-label="${this._esc(m.name)} 프로필 편집">${esc(m.emoji || '🙂')}</button>
        <div class="fm-member-info">
          <div class="fm-member-name-row">
            <span class="fm-member-name">${this._esc(m.name)}</span>
            <span class="fm-role-badge ${roleClass}">${roleLabel}</span>
            ${isMe ? '<span class="fm-me-badge">나</span>' : ''}
          </div>
          ${perm}
          <div class="fm-member-week">📅 이번 주 일정 ${weekCount}개</div>
        </div>
      </div>
    `;
  },

  _permSummary(role){
    return role === 'master'
      ? '일정 · 할 일 관리 · 보상 승인 · 초대 관리'
      : '일정 확인 · 할 일 완료하기 · 코인 모으기';
  },

  _memberWeekCount(id){
    const S = (App.state.schedules && App.state.schedules[id]) || {};
    let n = 0;
    for(let i = 0; i < 7; i++){
      (S[i] || []).forEach(s => { if(App.canSee(s)) n++; });
    }
    return n;
  },

  _avatarList(){
    if(!App.state.avatars || !App.state.avatars.length){
      App.state.avatars = [
        '🐣','🐻','🐰','🦊','🐼','🐨','🦁','🐯','🐸','🐧','🦄','🐙',
        '🐝','🦋','🌷','🌻','🌸','🍀','⭐️','🌙','☀️','🍎','🍓','🍑',
        '🎈','🎨','🎸','⚽️','🚀','🎮','📚','🧸','👑','💎','🧁','🍩'
      ];
      App.save();
    }
    return App.state.avatars;
  },

  _findMember(id){
    return (App.state.members || []).find(x => x.id === id);
  },

  _openMemberEditor(id){
    const isNew = !id;
    const canEdit = isNew ? App.isMaster() : (id === App.meId() || App.isMaster());
    if(!canEdit){
      App.toast('본인 프로필만 바꿀 수 있어요');
      return;
    }

    const avatars = this._avatarList();
    const existing = isNew ? null : this._findMember(id);
    if(!isNew && !existing){
      App.toast('프로필을 찾을 수 없어요');
      return;
    }
    const mem = isNew
      ? { name:'', emoji:avatars[0], role:'child', color:PALETTE[3].fill }
      : existing;

    const usedBy = {};
    (App.state.members || []).forEach(x => {
      if(!isNew && x.id === mem.id) return;
      if(x.emoji) usedBy[x.emoji] = x.name;
    });

    const body = `
      <div class="field">
        <label>이름</label>
        <input class="inp" id="fmName" placeholder="이름을 입력해주세요" maxlength="8" value="${this._esc(mem.name)}">
      </div>
      ${isNew ? `
      <div class="field">
        <label>역할</label>
        <div class="fm-role-track" id="fmRolePick">
          <button type="button" class="fm-role-opt on" data-role-pick="child">🐣 아이</button>
          <button type="button" class="fm-role-opt" data-role-pick="master">🌷 부모</button>
        </div>
      </div>` : ''}
      <div class="field">
        <label>아바타</label>
        <div class="fm-avatar-grid" id="fmAvatarGrid">
          ${avatars.map(e => {
            const dupeName = usedBy[e];
            const on = e === mem.emoji;
            return `<button type="button" class="fm-avatar-cell ${on ? 'on' : ''} ${dupeName ? 'dupe' : ''}" data-emoji="${e}">
              <span class="fm-avatar-emoji">${e}</span>
              ${dupeName ? `<span class="fm-avatar-dupe-label">${this._esc(dupeName)}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="field">
        <label>프로필 색</label>
        <div class="swatches" id="fmColorPick">
          ${PALETTE.map(p => `<button type="button" class="sw ${p.fill === mem.color ? 'on' : ''}" data-color="${p.fill}" style="background:${p.fill}"></button>`).join('')}
        </div>
      </div>
    `;

    const foot = `
      <button type="button" class="btn line" id="fmCancel" style="flex:0 0 96px">취소</button>
      <button type="button" class="btn full" id="fmSave">${isNew ? '추가하기' : '저장하기'}</button>
    `;

    App.sheet(isNew ? '가족 추가' : '프로필 편집', body, foot, (b, f) => {
      let pickEmoji = mem.emoji, pickColor = mem.color, pickRole = mem.role || 'child';

      b.querySelectorAll('#fmAvatarGrid .fm-avatar-cell').forEach(btn => {
        btn.addEventListener('click', () => {
          pickEmoji = btn.dataset.emoji;
          b.querySelectorAll('#fmAvatarGrid .fm-avatar-cell').forEach(x => x.classList.remove('on'));
          btn.classList.add('on');
          if(App.haptic) App.haptic();
        });
      });

      b.querySelectorAll('#fmColorPick .sw').forEach(btn => {
        btn.addEventListener('click', () => {
          pickColor = btn.dataset.color;
          b.querySelectorAll('#fmColorPick .sw').forEach(x => x.classList.remove('on'));
          btn.classList.add('on');
          if(App.haptic) App.haptic();
        });
      });

      const roleTrack = b.querySelector('#fmRolePick');
      if(roleTrack){
        roleTrack.querySelectorAll('[data-role-pick]').forEach(btn => {
          btn.addEventListener('click', () => {
            pickRole = btn.dataset.rolePick;
            roleTrack.querySelectorAll('[data-role-pick]').forEach(x => x.classList.remove('on'));
            btn.classList.add('on');
          });
        });
      }

      f.querySelector('#fmCancel').addEventListener('click', () => App.closeSheet());
      f.querySelector('#fmSave').addEventListener('click', () => {
        const name = b.querySelector('#fmName').value.trim();
        if(!name){
          App.toast('이름을 입력해주세요');
          b.querySelector('#fmName').focus();
          return;
        }
        if(isNew){
          const newId = uid();
          App.state.members.push({ id:newId, name, emoji:pickEmoji, role:pickRole, color:pickColor });
          App.state.schedules[newId] = {};
          App.save();
          App.render();
          App.closeSheet();
          App.toast('가족을 추가했어요');
        } else {
          Object.assign(mem, { name, emoji:pickEmoji, color:pickColor });
          App.save();
          App.render();
          App.closeSheet();
          App.toast('프로필을 저장했어요');
        }
      });
    });
  },

  _inviteHtml(){
    return `
      <div class="fm-section">
        <div class="sec-h"><h2>초대 코드</h2><span class="sub">가족에게 공유해보세요</span></div>
        <div class="panel fm-invite">
          <div class="fm-invite-row">
            <div class="fm-code-box">${this._esc(App.state.inviteCode)}</div>
            <button type="button" class="btn ghost fm-copy-btn" id="fm-copy-code">코드 복사</button>
          </div>
          <div class="fm-qr-wrap">
            ${this._qrHtml(App.state.inviteCode)}
            <div class="fm-qr-label">QR로도 초대할 수 있어요<span>카메라로 스캔하면 초대 링크가 열려요</span></div>
            <button type="button" class="fm-qr-link" id="fm-copy-link">
              <span class="fm-qr-link-ico">🔗</span>${this._esc(this._inviteUrl())}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _inviteUrl(code){
    return 'https://kuma.routine/invite/' + String(code || App.state.inviteCode || 'HRK-0000');
  },

  _qrHtml(code){
    // 실제 스캔 가능한 QR (ModQR). 모듈이 없으면 아래 임시 격자로 폴백.
    if(window.ModQR && typeof ModQR.svg === 'function'){
      const svg = ModQR.svg(this._inviteUrl(code), { size: 140, margin: 2, dark: 'var(--ink)', rounded: false });
      if(svg) return `<div class="fm-qr-card">${svg}</div>`;
    }
    return this._qrFallbackHtml(code);
  },

  _qrFallbackHtml(code){
    const n = 13;
    const str = String(code || 'HRK');
    const isFinderBlock = (r, c) => (r < 5 && c < 5) || (r < 5 && c >= n - 5) || (r >= n - 5 && c < 5);
    const finderOn = (r, c) => {
      const lr = r < 5 ? r : r - (n - 5);
      const lc = c < 5 ? c : c - (n - 5);
      return lr === 0 || lr === 4 || lc === 0 || lc === 4 || (lr === 2 && lc === 2);
    };
    const hash = (r, c) => {
      const s = str + '_' + r + '_' + c;
      let h = 0;
      for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return h;
    };
    let cells = '';
    for(let r = 0; r < n; r++){
      for(let c = 0; c < n; c++){
        const on = isFinderBlock(r, c) ? finderOn(r, c) : (hash(r, c) % 5 < 2);
        cells += `<span class="fm-qr-cell${on ? ' on' : ''}"></span>`;
      }
    }
    return `<div class="fm-qr" style="grid-template-columns:repeat(${n},1fr);grid-template-rows:repeat(${n},1fr)">${cells}</div>`;
  },

  _shareSettingsHtml(){
    const sh = App.state.share;
    return `
      <div class="fm-section">
        <div class="sec-h"><h2>일정 공유 설정</h2><span class="sub">가족과 무엇을 나눌지 정해요</span></div>
        <div class="panel">
          <div class="toggle-row">
            <div><div class="tl">일정 공유</div><div class="td">가족이 내 일정을 볼 수 있어요</div></div>
            <button type="button" class="sw-tog ${sh.scheduleShare ? 'on' : ''}" data-share-key="scheduleShare"></button>
          </div>
          <div class="toggle-row">
            <div><div class="tl">준비물 알림 함께 받기</div><div class="td">잊지 않도록 같이 알려드려요</div></div>
            <button type="button" class="sw-tog ${sh.itemAlarm ? 'on' : ''}" data-share-key="itemAlarm"></button>
          </div>
          <div class="toggle-row">
            <div><div class="tl">할 일 완료 알림</div><div class="td">아이가 할 일을 끝내면 알려줘요</div></div>
            <button type="button" class="sw-tog warm ${sh.todoDoneAlert ? 'on' : ''}" data-share-key="todoDoneAlert"></button>
          </div>
          <div class="toggle-row">
            <div><div class="tl">비밀 항목 숨기기 <span class="fm-lock-ico">🔒</span></div><div class="td">작성자만 볼 수 있어요</div></div>
            <button type="button" class="sw-tog on fm-locked" data-share-key="secretHide"></button>
          </div>
        </div>
      </div>
    `;
  },

  _secretItems(){
    const my = App.meId();
    const items = [];
    const allSchedules = App.state.schedules || {};
    Object.keys(allSchedules).forEach(mid => {
      const byDay = allSchedules[mid] || {};
      for(let i = 0; i < 7; i++){
        (byDay[i] || []).forEach(s => {
          if(s.secret && s.owner === my){
            items.push({ type: 'schedule', label: s.t, sub: `${DAYS[i][0]}요일 · ${disp(toMin(s.s))}` });
          }
        });
      }
    });
    (App.state.todos || []).forEach(t => {
      if(t.secret && t.owner === my){
        items.push({ type: 'todo', label: t.text, sub: `${DAYS[t.day][0]}요일 · 🪙 ${t.coin || 0}` });
      }
    });
    return items;
  },

  _secretPanelHtml(items){
    return `
      <div class="fm-section">
        <div class="panel fm-secret-panel">
          <button type="button" class="fm-secret-head" id="fm-secret-toggle" aria-expanded="false">
            <span class="fm-secret-icon">🤫</span>
            <span class="fm-secret-title">나만 보는 항목 <b>${items.length}</b>개</span>
            <svg class="fm-secret-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="fm-secret-body" id="fm-secret-body">
            <div class="fm-secret-inner">
              ${items.length ? items.map(it => `
                <div class="fm-secret-item">
                  <span class="fm-secret-emoji">${it.type === 'schedule' ? '📅' : '✅'}</span>
                  <div class="fm-secret-item-text"><b>${this._esc(it.label)}</b><span>${it.sub}</span></div>
                </div>
              `).join('') : `<div class="empty-note"><div class="big">🙂</div>아직 나만 보는 항목이 없어요</div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _weeklyStats(){
    const vmId = App.vm();
    const S = App.sched(vmId);
    let totalSchedules = 0, alarmOn = 0;
    const perDay = [0, 0, 0, 0, 0, 0, 0];
    for(let i = 0; i < 7; i++){
      (S[i] || []).forEach(s => {
        if(!App.canSee(s)) return;
        totalSchedules++;
        perDay[i]++;
        if(s.alarm) alarmOn++;
      });
    }
    let todoDone = 0, todoTotal = 0;
    for(let i = 0; i < 7; i++){
      App.todosOf(i).forEach(t => {
        if(!App.canSee(t)) return;
        todoTotal++;
        if(t.done) todoDone++;
      });
    }
    return { totalSchedules, alarmOn, todoDone, todoTotal, perDay, coins: App.state.coins || 0 };
  },

  _weeklyHtml(stats){
    const who = App.member(App.vm());
    const whoLabel = who ? `${esc(who.emoji)} ${this._esc(who.name)} 기준` : '가족과 함께한 기록이에요';
    return `
      <div class="fm-section">
        <div class="sec-h"><h2>이번 주 요약</h2><span class="sub">${whoLabel}</span></div>
        <div class="fm-weekly-grid">
          <div class="fm-weekly-stat">
            <span class="fm-weekly-icon">📅</span>
            <b class="fm-weekly-value">${stats.totalSchedules}</b>
            <span class="fm-weekly-label">이번 주 일정</span>
          </div>
          <div class="fm-weekly-stat">
            <span class="fm-weekly-icon">🔔</span>
            <b class="fm-weekly-value">${stats.alarmOn}</b>
            <span class="fm-weekly-label">알림 켜진 일정</span>
          </div>
          <div class="fm-weekly-stat">
            <span class="fm-weekly-icon">✅</span>
            <b class="fm-weekly-value">${stats.todoDone}/${stats.todoTotal}</b>
            <span class="fm-weekly-label">완료한 할 일</span>
          </div>
          <div class="fm-weekly-stat">
            <span class="fm-weekly-icon">🪙</span>
            <b class="fm-weekly-value">${stats.coins}</b>
            <span class="fm-weekly-label">모은 코인</span>
          </div>
        </div>
      </div>
    `;
  },

  _shareCtaHtml(){
    return `
      <div class="fm-section">
        <button type="button" class="btn full fm-share-cta" id="fm-share-cta">
          <span>📤</span> 이번 주 일정 카드로 공유하기
        </button>
      </div>
    `;
  },

  _brandHtml(){
    return `<div class="fm-brand">KUMA <b>routine</b></div>`;
  },

  _bind(root){
    root.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = btn.dataset.role;
        if(App.state.role === r) return;
        if(r === 'master' && typeof App.toMaster === 'function'){ App.toMaster(); return; }
        if(r === 'child' && typeof App.toChild === 'function'){ App.toChild(); return; }
        App.state.role = r;
        App.save();
        App.render();
      });
    });

    const copyBtn = root.querySelector('#fm-copy-code');
    if(copyBtn){
      copyBtn.addEventListener('click', () => {
        this._copyText(App.state.inviteCode, '초대 코드를 복사했어요');
      });
    }

    const copyLinkBtn = root.querySelector('#fm-copy-link');
    if(copyLinkBtn){
      copyLinkBtn.addEventListener('click', () => {
        this._copyText(this._inviteUrl(), '초대 링크를 복사했어요');
      });
    }

    root.querySelectorAll('[data-share-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.shareKey;
        if(key === 'secretHide'){
          App.toast('이 설정은 항상 켜져 있어요');
          return;
        }
        App.state.share[key] = !App.state.share[key];
        App.save();
        btn.classList.toggle('on', App.state.share[key]);
        if(App.haptic) App.haptic();
      });
    });

    root.querySelectorAll('[data-edit-member]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._openMemberEditor(btn.dataset.editMember);
      });
    });

    const addMemberBtn = root.querySelector('#fm-add-member');
    if(addMemberBtn){
      addMemberBtn.addEventListener('click', () => this._openMemberEditor(null));
    }

    const secretToggle = root.querySelector('#fm-secret-toggle');
    const secretBody = root.querySelector('#fm-secret-body');
    if(secretToggle && secretBody){
      secretToggle.addEventListener('click', () => {
        const expanded = secretToggle.getAttribute('aria-expanded') === 'true';
        secretToggle.setAttribute('aria-expanded', String(!expanded));
        secretToggle.classList.toggle('on', !expanded);
        if(App.haptic) App.haptic();
        if(expanded){
          secretBody.style.maxHeight = '0px';
        } else {
          secretBody.style.maxHeight = secretBody.scrollHeight + 'px';
        }
      });
    }

    const shareCta = root.querySelector('#fm-share-cta');
    if(shareCta){
      shareCta.addEventListener('click', () => this.openSharePreview());
    }
  },

  _copyText(text, successMsg){
    const done = () => {
      App.toast(successMsg);
      if(App.haptic) App.haptic();
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(() => this._fallbackCopy(text, done));
    } else {
      this._fallbackCopy(text, done);
    }
  },

  _fallbackCopy(text, done){
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }catch(e){
      App.toast('복사에 실패했어요');
    }
  },

  _esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
};

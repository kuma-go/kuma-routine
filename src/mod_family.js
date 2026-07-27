/* ================= 가족 · 공유 =================
   신원/권한 모델 v2 기준.
   - 역할은 사람에 붙는다 (master / parent / child). 마스터는 그룹에 정확히 한 명.
   - "프로필 추가"(기기 없는 아이용)와 "가족 초대하기"(기기를 연결)는 서로 다른 일이다.
   - 권한 조절 · 역할 변경 · 마스터 위임은 마스터(manageMembers)만 할 수 있다.
   시각 규칙: 선택 표시는 테두리 + 컬러 텍스트, 액션 버튼만 채운다. 위험 액션만 채워진 빨강. */
window.ModFamily = {
  css: `
    .fm-wrap{ padding:18px 18px 100px; }
    .fm-section{ margin-bottom:20px; }

    /* ---- 이 기기의 나 ---- */
    .fm-me{
      display:flex; align-items:center; gap:12px; background:var(--paper); border-radius:var(--r-l);
      box-shadow:var(--sh-1); padding:13px 14px; margin-bottom:20px;
    }
    .fm-me-av{
      flex-shrink:0; width:46px; height:46px; border-radius:50%; background:var(--indigo-s);
      display:flex; align-items:center; justify-content:center; font-size:23px;
    }
    .fm-me-tx{ flex:1; min-width:0; }
    .fm-me-tx b{ display:block; font-size:15px; font-weight:800; color:var(--ink); }
    .fm-me-tx small{ display:block; margin-top:2px; font-size:11.5px; font-weight:700; color:var(--muted); }
    .fm-me-swap{
      flex-shrink:0; min-height:38px; padding:0 13px; border-radius:12px;
      border:1.6px solid var(--line); background:transparent;
      font-size:12px; font-weight:800; color:var(--ink2);
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .18s, color .18s;
    }
    .fm-me-swap:active{ transform:scale(.95); border-color:var(--indigo); color:var(--indigo); }

    /* ---- 가족 멤버 ---- */
    .fm-members{ display:flex; flex-direction:column; gap:10px; }
    .fm-member-card{
      display:flex; align-items:center; gap:12px; background:var(--paper); border-radius:var(--r-l);
      box-shadow:var(--sh-1); padding:12px 14px;
    }
    .fm-member-avatar{
      position:relative; flex-shrink:0; width:48px; height:48px; border-radius:16px;
      border:1.6px solid transparent;
      display:flex; align-items:center; justify-content:center; font-size:23px;
      -webkit-appearance:none; appearance:none; padding:0; font-family:inherit; cursor:pointer;
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .2s;
    }
    .fm-member-avatar:active{ transform:scale(.93); }
    .fm-member-avatar.fm-avatar-locked{ cursor:default; }
    .fm-member-avatar.fm-avatar-locked:active{ transform:none; }
    .fm-crown{
      position:absolute; top:-9px; left:50%; transform:translateX(-50%) rotate(-14deg);
      font-size:15px; line-height:1; pointer-events:none;
      filter:drop-shadow(0 1px 1px rgba(20,20,40,.28));
    }
    .fm-member-info{ flex:1; min-width:0; }
    .fm-member-name-row{ display:flex; align-items:center; gap:5px; flex-wrap:wrap; }
    .fm-member-name{ font-size:15px; font-weight:800; color:var(--ink); }

    .fm-rb{ font-size:11px; font-weight:800; padding:3px 9px; border-radius:10px; white-space:nowrap; }
    .fm-rb--master{ background:var(--indigo-s); color:var(--indigo-d); }
    .fm-rb--parent{ background:var(--bg); color:var(--ink2); }
    .fm-rb--child{ background:var(--orange-s); color:var(--orange); }
    .fm-me-badge{ font-size:10.5px; font-weight:800; color:#fff; background:var(--ink); padding:3px 8px; border-radius:9px; }
    .fm-nodev{
      font-size:10.5px; font-weight:800; color:var(--muted);
      border:1.3px dashed var(--line); padding:2px 8px; border-radius:9px; white-space:nowrap;
    }
    .fm-member-perm{ margin-top:5px; font-size:12px; font-weight:600; color:var(--muted); line-height:1.4; }
    .fm-member-week{ margin-top:4px; font-size:11.5px; font-weight:700; color:var(--muted); }
    .fm-member-gear{
      flex-shrink:0; align-self:center; width:38px; height:38px; border-radius:12px;
      border:1.6px solid var(--line); background:transparent;
      display:flex; align-items:center; justify-content:center; font-size:15px; color:var(--ink2);
      transition:transform .15s cubic-bezier(.22,1,.36,1), border-color .18s;
    }
    .fm-member-gear:active{ transform:scale(.92); border-color:var(--indigo); }

    /* ---- 액션 버튼 묶음 ---- */
    .fm-actions{ display:flex; flex-direction:column; gap:9px; margin-top:12px; }
    .fm-note{
      background:var(--paper); border:1px solid var(--line); border-radius:var(--r-m); padding:13px 14px;
      font-size:12.5px; font-weight:700; color:var(--ink2); line-height:1.6;
    }
    .fm-note b{ color:var(--indigo); font-weight:800; }
    .fm-note.warm b{ color:var(--orange); }

    /* ---- 시트: 사람 고르기 ---- */
    .fm-pick-list{ display:flex; flex-direction:column; gap:8px; }
    .fm-pick{
      display:flex; align-items:center; gap:11px; width:100%; padding:12px 14px;
      border-radius:var(--r-m); border:1.6px solid var(--line); background:transparent;
      text-align:left; cursor:pointer; transition:.18s cubic-bezier(.22,1,.36,1);
    }
    .fm-pick:active{ transform:scale(.985); }
    .fm-pick.on{ border-color:var(--indigo); background:var(--indigo-s); }
    .fm-pick.on .fm-pick-tx b{ color:var(--indigo); }
    .fm-pick[disabled]{ opacity:.45; pointer-events:none; }
    .fm-pick-av{
      width:36px; height:36px; border-radius:50%; background:var(--bg); flex:0 0 auto;
      display:flex; align-items:center; justify-content:center; font-size:19px;
    }
    .fm-pick-tx{ display:flex; flex-direction:column; gap:2px; min-width:0; }
    .fm-pick-tx b{ font-size:14px; font-weight:800; color:var(--ink); }
    .fm-pick-tx small{ font-size:11.5px; font-weight:700; color:var(--muted); }
    .fm-pick-go{ margin-left:auto; font-size:12px; font-weight:800; color:var(--indigo); flex:0 0 auto; }

    /* ---- 시트: 멤버 메뉴 ---- */
    .fm-menu{ display:flex; flex-direction:column; gap:8px; }
    .fm-menu button{
      display:flex; align-items:center; gap:11px; width:100%; min-height:52px; padding:0 14px;
      border-radius:var(--r-m); border:1.6px solid var(--line); background:transparent;
      font-size:14px; font-weight:800; color:var(--ink); text-align:left;
      transition:.16s cubic-bezier(.22,1,.36,1);
    }
    .fm-menu button:active{ transform:scale(.985); border-color:var(--indigo); color:var(--indigo); }
    .fm-menu .fm-menu-em{ font-size:17px; flex:0 0 auto; }
    .fm-menu small{ display:block; font-size:11px; font-weight:700; color:var(--muted); margin-top:1px; }

    /* ---- 시트: 권한 ---- */
    .fm-perm-head{
      display:flex; align-items:center; gap:11px; padding:12px 14px; border-radius:var(--r-m);
      background:var(--indigo-s); margin-bottom:14px;
    }
    .fm-perm-head .fm-pick-av{ background:var(--paper); }
    .fm-perm-head b{ font-size:14.5px; font-weight:800; color:var(--indigo-d); }
    .fm-perm-head small{ display:block; font-size:11.5px; font-weight:700; color:var(--ink2); margin-top:1px; }
    .fm-perm-locked-note{
      margin:0 0 14px; background:var(--bg); border-radius:var(--r-m); padding:12px 14px;
      font-size:12.5px; font-weight:700; color:var(--ink2); line-height:1.6;
    }
    .fm-perm-locked-note b{ color:var(--indigo); }

    /* ---- 잠긴 토글 ---- */
    .fm-lock-ico{ font-size:10.5px; margin-left:3px; }
    .fm-locked{ opacity:.5; cursor:not-allowed; }

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
    /* 역할 고르기 세그먼트 — 선택은 테두리 + 컬러 */
    .fm-role-track{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .fm-role-opt{
      display:flex; align-items:center; justify-content:center; gap:6px;
      height:48px; border-radius:14px; font-size:14.5px; font-weight:800;
      background:transparent; border:1.6px solid var(--line); color:var(--muted);
      transition:border-color .2s, color .2s, background .2s, transform .15s;
    }
    .fm-role-opt:active{ transform:scale(.97); }
    .fm-role-opt.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo); }
    .fm-role-em{ font-size:17px; }

    /* ---- 초대 / 그룹 코드 ---- */
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
    .fm-qr-label span{ display:block; font-size:10.5px; color:var(--muted-soft); margin-top:1px; }
    .fm-qr-link{
      max-width:230px; min-height:44px; display:flex; align-items:center; justify-content:center; gap:5px;
      margin:0; padding:6px 10px; background:var(--bg); border:1px solid var(--line);
      border-radius:var(--r-s); font-size:10.5px; font-weight:700; color:var(--ink2);
      font-family:'SFMono-Regular',Menlo,Consolas,monospace; word-break:break-all; line-height:1.35;
      text-align:center; cursor:pointer; transition:background .15s cubic-bezier(.22,1,.36,1);
    }
    .fm-qr-link:active{ background:var(--indigo-s); border-color:var(--indigo); color:var(--indigo-d); }
    .fm-qr-link .fm-qr-link-ico{ flex-shrink:0; font-size:11px; }

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

    /* ---- 다크 모드 ---- */
    #phone.th-dark .fm-rb--parent{ background:#26262F; color:var(--ink2); }
    #phone.th-dark .fm-nodev{ border-color:#3A3A48; }
    #phone.th-dark .fm-me-swap,
    #phone.th-dark .fm-member-gear,
    #phone.th-dark .fm-pick,
    #phone.th-dark .fm-menu button,
    #phone.th-dark .fm-role-opt{ border-color:#33333F; }
    #phone.th-dark .fm-pick.on,
    #phone.th-dark .fm-role-opt.on{ border-color:#7A6EEA; background:rgba(122,110,234,.16); color:#B7AEFF; }
    #phone.th-dark .fm-pick.on .fm-pick-tx b{ color:#B7AEFF; }
    #phone.th-dark .fm-perm-head b{ color:#B7AEFF; }
    #phone.th-dark .fm-note b, #phone.th-dark .fm-perm-locked-note b{ color:#B7AEFF; }
  `,

  init(){
    this._avatarList();
  },

  render(root){
    if(!App.state.share){
      App.state.share = { scheduleShare:true, itemAlarm:true, todoDoneAlert:true, secretHide:true };
      App.save();
    } else if(App.state.share.secretHide !== true){
      App.state.share.secretHide = true;
    }
    this._avatarList();

    const secretItems = this._secretItems();

    root.innerHTML = `
      <div class="fm-wrap">
        ${this._meHtml()}
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

  /* ================= 이 기기의 나 ================= */

  _meHtml(){
    const me = App.me() || {};
    const roleLabel = this._roleLabel(me.role);
    const canSwap = typeof App.canSwitchDevice === 'function' ? App.canSwitchDevice() : false;
    const desc = App.isMaster()
      ? '우리 가족 마스터예요 · 권한을 정할 수 있어요'
      : (App.can('editOthers') ? roleLabel + ' · 가족 일정을 함께 볼 수 있어요' : roleLabel + ' · 내 일정과 할 일을 봐요');
    return `
      <div class="fm-me">
        <div class="fm-me-av">${esc(me.emoji || '🙂')}</div>
        <div class="fm-me-tx">
          <b>${esc(me.name || '나')}</b>
          <small>${esc(desc)}</small>
        </div>
        ${canSwap ? `<button type="button" class="fm-me-swap" id="fm-swap-owner">바꾸기</button>` : ''}
      </div>
    `;
  },

  /* ================= 가족 구성원 ================= */

  _membersHtml(){
    const members = App.state.members || [];
    return `
      <div class="fm-section">
        <div class="sec-h"><h2>가족 구성원</h2><span class="sub">${members.length}명</span></div>
        <div class="fm-members">
          ${members.map(m => this._memberCardHtml(m)).join('')}
        </div>
        ${this._actionsHtml()}
      </div>
    `;
  },

  _memberCardHtml(m){
    const isMe = m.id === App.meId();
    const isMaster = m.role === 'master';
    const canManage = App.can('manageMembers');
    const canEdit = isMe || canManage;
    const color = this._cssColor(m.color);
    const weekCount = this._memberWeekCount(m.id);
    const roleCls = isMaster ? 'fm-rb--master' : (m.role === 'parent' ? 'fm-rb--parent' : 'fm-rb--child');
    const permLine = canManage
      ? `<div class="fm-member-perm">${esc(this._permSummary(m))}</div>`
      : '';
    return `
      <div class="fm-member-card">
        <button type="button" class="fm-member-avatar ${canEdit ? '' : 'fm-avatar-locked'}" data-edit-member="${esc(m.id)}"
          style="background:${color}2A;border-color:${color}66;" aria-label="${esc(m.name)} 프로필 편집">
          <span>${esc(m.emoji || '🙂')}</span>
          ${isMaster ? '<span class="fm-crown" aria-hidden="true">👑</span>' : ''}
        </button>
        <div class="fm-member-info">
          <div class="fm-member-name-row">
            <span class="fm-member-name">${esc(m.name)}</span>
            <span class="fm-rb ${roleCls}">${isMaster ? '👑 ' : ''}${esc(this._roleLabel(m.role))}</span>
            ${isMe ? '<span class="fm-me-badge">나</span>' : ''}
            ${this._showNoDevice(m) ? '<span class="fm-nodev">기기 없음</span>' : ''}
          </div>
          ${permLine}
          <div class="fm-member-week">📅 이번 주 일정 ${weekCount}개</div>
        </div>
        ${canManage ? `<button type="button" class="fm-member-gear" data-member-menu="${esc(m.id)}" aria-label="${esc(m.name)} 관리">⚙️</button>` : ''}
      </div>
    `;
  },

  _actionsHtml(){
    const canManage = App.can('manageMembers');
    const canInvite = App.can('invite');
    const syncOn = !!(window.ModSync && typeof ModSync.enabled === 'function' && ModSync.enabled());
    let h = '';

    if(canManage){
      h += `<button type="button" class="btn line full" id="fm-add-member">+ 프로필 추가</button>`;
    }

    if(canInvite){
      if(syncOn){
        h += `<button type="button" class="btn full" id="fm-invite">💌 가족 초대하기</button>`;
      } else {
        h += `<div class="fm-note">먼저 <b>가족 그룹</b>을 만들어 주세요.<br>그룹을 만들면 가족을 초대할 수 있어요.</div>`;
        h += `<button type="button" class="btn full" id="fm-open-sync">가족 그룹 만들기</button>`;
      }
    }

    if(canManage){
      h += `<button type="button" class="btn line full" id="fm-perm">🔑 권한 정하기</button>`;
      h += `<button type="button" class="btn line full" id="fm-transfer">👑 마스터 넘기기</button>`;
    }

    if(!h){
      h = `<div class="fm-note">가족을 초대하거나 권한을 정하는 건 <b>마스터</b>가 해요.</div>`;
    }
    return `<div class="fm-actions">${h}</div>`;
  },


  /* "기기 없음"은 그룹에 연결됐을 때만 뜻이 있다.
     혼자 쓰는 기기에서는 모두 uid 가 없으니 표시하면 혼란스럽다. */
  _showNoDevice(m){
    if(!(window.ModSync && ModSync.enabled && ModSync.enabled())) return false;
    if(m.id === App.meId()) return false;
    return !m.uid;
  },
  _roleLabel(role){
    return (window.ROLE_LABEL && ROLE_LABEL[role]) || '아이';
  },

  _permSummary(m){
    if(m.role === 'master') return '모든 권한을 가지고 있어요';
    const p = App.permOf(m);
    const keys = Object.keys(window.PERM_KEYS || {}).filter(k => k !== 'manageMembers' && p[k]);
    if(!keys.length) return '내 일정과 할 일만 볼 수 있어요';
    return keys.map(k => PERM_KEYS[k].t).join(' · ');
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
    }
    return App.state.avatars;
  },

  _findMember(id){
    return (App.state.members || []).find(x => x.id === id);
  },

  /* 색은 스타일 속성에 직접 들어가므로 형식을 검사한다 */
  _cssColor(c){
    return /^#[0-9a-fA-F]{6}$/.test(String(c || '')) ? String(c) : '#7B96EF';
  },

  /* ================= 멤버 관리 시트 ================= */

  _openMemberMenu(id){
    const m = this._findMember(id);
    if(!m) return App.toast('프로필을 찾을 수 없어요');
    if(!App.can('manageMembers')) return App.toast('마스터만 할 수 있어요');

    const isMaster = m.role === 'master';
    const syncOn = !!(window.ModSync && typeof ModSync.enabled === 'function' && ModSync.enabled());

    const body = `
      <div class="fm-perm-head">
        <div class="fm-pick-av">${esc(m.emoji || '🙂')}</div>
        <div><b>${esc(m.name)}</b><small>${esc(this._roleLabel(m.role))}${this._showNoDevice(m) ? ' · 기기 없음' : ''}</small></div>
      </div>
      <div class="fm-menu">
        <button type="button" data-menu="edit"><span class="fm-menu-em">✏️</span>
          <span>프로필 편집<small>이름 · 아바타 · 색을 바꿔요</small></span></button>
        <button type="button" data-menu="perm"><span class="fm-menu-em">🔑</span>
          <span>권한 정하기<small>${isMaster ? '마스터는 항상 전권이에요' : '무엇을 할 수 있는지 정해요'}</small></span></button>
        ${isMaster ? '' : `<button type="button" data-menu="role"><span class="fm-menu-em">🔁</span>
          <span>역할 바꾸기<small>부모 또는 아이로 바꿔요</small></span></button>`}
        ${isMaster ? '' : `<button type="button" data-menu="transfer"><span class="fm-menu-em">👑</span>
          <span>마스터 넘기기<small>${m.role === 'parent' ? '이 사람을 마스터로 만들어요' : '부모 역할인 가족에게만 넘길 수 있어요'}</small></span></button>`}
        ${(!isMaster && syncOn && App.can('invite')) ? `<button type="button" data-menu="invite"><span class="fm-menu-em">💌</span>
          <span>초대 코드 ${m.invite ? '보기' : '보내기'}<small>${m.uid ? '기기를 바꿔도 같은 코드를 다시 쓰면 돼요' : '이 프로필로 기기를 연결해요'}</small></span></button>` : ''}
        ${(m.uid && m.id !== App.meId() && syncOn && App.can('manageMembers')) ? `<button type="button" data-menu="unlink"><span class="fm-menu-em">🔌</span>
          <span>기기 연결 끊기<small>폰을 잃어버렸을 때 · 초대 코드는 그대로예요</small></span></button>` : ''}
      </div>
    `;

    App.sheet('가족 관리', body, `<button type="button" class="btn line full" id="fmMenuC">닫기</button>`, (b, f) => {
      f.querySelector('#fmMenuC').addEventListener('click', () => App.closeSheet());
      b.querySelectorAll('[data-menu]').forEach(btn => {
        btn.addEventListener('click', () => {
          const a = btn.dataset.menu;
          if(a === 'edit') this._openMemberEditor(id);
          else if(a === 'perm') this._openPermFor(id);
          else if(a === 'role') this._openRoleSheet(id);
          else if(a === 'transfer') this._openTransferConfirm(id);
          else if(a === 'invite'){
            App.closeSheet();
            setTimeout(async () => {
              try{
                const tok = await ModSync.createInvite(id);
                ModSync.showInviteCode(tok, App.member(id));
              }catch(e){ App.toast(e.message || '초대 코드를 만들지 못했어요'); }
            }, 240);
          }
          else if(a === 'unlink'){
            App.closeSheet();
            setTimeout(async () => {
              try{
                const mm = await ModSync.unlinkDevice(id);
                App.toast(`${mm.emoji} ${mm.name}의 기기 연결을 끊었어요`);
              }catch(e){ App.toast(e.message || '끊지 못했어요'); }
            }, 240);
          }
        });
      });
    });
  },

  /* ================= 권한 시트 ================= */

  openPermSheet(){
    if(!App.can('manageMembers')) return App.toast('마스터만 권한을 정할 수 있어요');
    const members = App.state.members || [];
    const body = `
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.7">
        권한을 정할 가족을 골라 주세요.<br>
        <b>마스터</b>는 언제나 모든 걸 할 수 있어요.
      </p>
      <div class="fm-pick-list">
        ${members.map(m => `
          <button type="button" class="fm-pick" data-perm-id="${esc(m.id)}">
            <span class="fm-pick-av">${esc(m.emoji || '🙂')}</span>
            <span class="fm-pick-tx"><b>${esc(m.name)}</b><small>${esc(this._permSummary(m))}</small></span>
            <span class="fm-pick-go">정하기 →</span>
          </button>`).join('')}
      </div>
    `;
    App.sheet('권한 정하기', body, `<button type="button" class="btn line full" id="fmPermPickC">닫기</button>`, (b, f) => {
      f.querySelector('#fmPermPickC').addEventListener('click', () => App.closeSheet());
      b.querySelectorAll('[data-perm-id]').forEach(btn => {
        btn.addEventListener('click', () => this._openPermFor(btn.dataset.permId));
      });
    });
  },

  _openPermFor(id){
    if(!App.can('manageMembers')) return App.toast('마스터만 권한을 정할 수 있어요');
    const m = this._findMember(id);
    if(!m) return App.toast('프로필을 찾을 수 없어요');

    const isMaster = m.role === 'master';
    const cur = App.permOf(m);
    const keys = Object.keys(window.PERM_KEYS || {});

    const rows = keys.map(k => {
      const meta = PERM_KEYS[k];
      const locked = isMaster || k === 'manageMembers';
      const on = isMaster ? true : !!cur[k];
      return `
        <div class="toggle-row">
          <div>
            <div class="tl">${esc(meta.t)}${locked ? '<span class="fm-lock-ico">🔒</span>' : ''}</div>
            <div class="td">${esc(meta.d)}</div>
          </div>
          <button type="button" class="sw-tog ${on ? 'on' : ''} ${locked ? 'fm-locked' : ''}"
            data-perm-key="${esc(k)}" ${locked ? 'data-perm-locked="1"' : ''}
            aria-pressed="${on ? 'true' : 'false'}"></button>
        </div>`;
    }).join('');

    const notice = isMaster
      ? `<p class="fm-perm-locked-note"><b>마스터는 항상 전권이에요.</b><br>권한을 줄이고 싶다면 먼저 다른 가족에게 마스터를 넘겨 주세요.</p>`
      : `<p class="fm-perm-locked-note">🔒 표시가 있는 <b>프로필·권한 관리</b>는 마스터만 할 수 있어서 바꿀 수 없어요.</p>`;

    const body = `
      <div class="fm-perm-head">
        <div class="fm-pick-av">${esc(m.emoji || '🙂')}</div>
        <div><b>${esc(m.name)}</b><small>${esc(this._roleLabel(m.role))}${this._showNoDevice(m) ? ' · 기기 없음' : ''}</small></div>
      </div>
      ${notice}
      <div class="panel" style="padding:4px 15px">${rows}</div>
    `;

    const foot = isMaster
      ? `<button type="button" class="btn line full" id="fmPermC">닫기</button>`
      : `<button type="button" class="btn line" id="fmPermC" style="flex:0 0 96px">취소</button>
         <button type="button" class="btn full" id="fmPermS">저장하기</button>`;

    App.sheet('권한 정하기', body, foot, (b, f) => {
      const draft = {};
      keys.forEach(k => { draft[k] = !!cur[k]; });

      b.querySelectorAll('[data-perm-key]').forEach(btn => {
        btn.addEventListener('click', () => {
          if(btn.dataset.permLocked){
            App.toast(isMaster ? '마스터는 항상 전권이에요' : '이 권한은 마스터만 가질 수 있어요');
            return;
          }
          const k = btn.dataset.permKey;
          draft[k] = !draft[k];
          btn.classList.toggle('on', draft[k]);
          btn.setAttribute('aria-pressed', draft[k] ? 'true' : 'false');
          if(App.haptic) App.haptic();
        });
      });

      f.querySelector('#fmPermC').addEventListener('click', () => App.closeSheet());
      const saveBtn = f.querySelector('#fmPermS');
      if(saveBtn){
        saveBtn.addEventListener('click', () => {
          const preset = (window.PERM_PRESET && PERM_PRESET[m.role]) || {};
          const next = {};
          keys.forEach(k => {
            if(k === 'manageMembers') return;                 // 마스터 전용 — 건드리지 않는다
            if(!!preset[k] !== draft[k]) next[k] = draft[k] ? 1 : 0;
          });
          m.perm = Object.keys(next).length ? next : null;
          App.migrate();
          App.save();
          App.render();
          App.closeSheet();
          App.toast(`${m.name}님의 권한을 저장했어요`);
        });
      }
    });
  },

  /* ================= 역할 바꾸기 ================= */

  _openRoleSheet(id){
    if(!App.can('manageMembers')) return App.toast('마스터만 역할을 바꿀 수 있어요');
    const m = this._findMember(id);
    if(!m) return App.toast('프로필을 찾을 수 없어요');
    if(m.role === 'master') return App.toast('마스터 역할은 넘기기로만 바꿀 수 있어요');

    const body = `
      <div class="fm-perm-head">
        <div class="fm-pick-av">${esc(m.emoji || '🙂')}</div>
        <div><b>${esc(m.name)}</b><small>지금은 ${esc(this._roleLabel(m.role))}예요</small></div>
      </div>
      <div class="field">
        <label>어떤 역할로 바꿀까요?</label>
        <div class="fm-role-track" id="fmRoleSet">
          <button type="button" class="fm-role-opt ${m.role === 'parent' ? 'on' : ''}" data-role-pick="parent">
            <span class="fm-role-em">🌷</span>부모</button>
          <button type="button" class="fm-role-opt ${m.role === 'child' ? 'on' : ''}" data-role-pick="child">
            <span class="fm-role-em">🐣</span>아이</button>
        </div>
      </div>
      <div class="fm-note">
        마스터는 <b>넘기기</b>로만 바꿀 수 있어요.<br>
        역할을 바꾸면 권한은 그 역할의 기본값으로 돌아가요.
      </div>
    `;

    App.sheet('역할 바꾸기', body,
      `<button type="button" class="btn line" id="fmRoleC" style="flex:0 0 96px">취소</button>
       <button type="button" class="btn full" id="fmRoleS">바꾸기</button>`, (b, f) => {
      let pick = m.role === 'parent' ? 'parent' : 'child';
      b.querySelectorAll('[data-role-pick]').forEach(btn => {
        btn.addEventListener('click', () => {
          pick = btn.dataset.rolePick;
          b.querySelectorAll('[data-role-pick]').forEach(x => x.classList.toggle('on', x === btn));
          if(App.haptic) App.haptic();
        });
      });
      f.querySelector('#fmRoleC').addEventListener('click', () => App.closeSheet());
      f.querySelector('#fmRoleS').addEventListener('click', () => {
        if(pick === m.role){ App.closeSheet(); return; }
        m.role = pick;
        m.perm = null;                       // 새 역할의 기본 권한으로
        App.migrate();
        App.save();
        App.render();
        App.closeSheet();
        App.toast(`${m.name}님이 ${this._roleLabel(pick)}가 됐어요`);
      });
    });
  },

  /* ================= 마스터 넘기기 ================= */

  openTransferSheet(){
    if(!App.isMaster()) return App.toast('마스터만 넘길 수 있어요');
    const meId = App.meId();
    const cands = (App.state.members || []).filter(m => m.id !== meId && m.role === 'parent');

    const body = `
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:var(--ink2);line-height:1.7">
        마스터는 우리 가족에 <b>딱 한 명</b>이에요.<br>
        넘기면 나는 <b>부모</b>가 되고, 권한 관리는 그 사람이 하게 돼요.
      </p>
      ${cands.length ? `
        <div class="fm-pick-list">
          ${cands.map(m => `
            <button type="button" class="fm-pick" data-transfer-id="${esc(m.id)}">
              <span class="fm-pick-av">${esc(m.emoji || '🙂')}</span>
              <span class="fm-pick-tx"><b>${esc(m.name)}</b><small>${esc(this._roleLabel(m.role))}${this._showNoDevice(m) ? ' · 기기 없음' : ''}</small></span>
              <span class="fm-pick-go">넘기기 →</span>
            </button>`).join('')}
        </div>` : `
        <div class="fm-note">
          넘길 수 있는 가족이 없어요.<br>
          먼저 가족을 <b>부모</b> 역할로 바꿔 주세요. 아이에게는 넘길 수 없어요.
        </div>`}
    `;

    App.sheet('마스터 넘기기', body, `<button type="button" class="btn line full" id="fmTrC">닫기</button>`, (b, f) => {
      f.querySelector('#fmTrC').addEventListener('click', () => App.closeSheet());
      b.querySelectorAll('[data-transfer-id]').forEach(btn => {
        btn.addEventListener('click', () => this._openTransferConfirm(btn.dataset.transferId));
      });
    });
  },

  _openTransferConfirm(id){
    if(!App.isMaster()) return App.toast('마스터만 넘길 수 있어요');
    const m = this._findMember(id);
    if(!m) return App.toast('프로필을 찾을 수 없어요');
    if(m.role === 'child'){
      return App.toast('아이에게는 넘길 수 없어요 · 먼저 부모로 바꿔 주세요');
    }
    const me = App.me() || {};

    const body = `
      <div class="fm-perm-head">
        <div class="fm-pick-av">${esc(m.emoji || '🙂')}</div>
        <div><b>${esc(m.name)}</b><small>새 마스터가 돼요</small></div>
      </div>
      <p style="margin:0 0 4px;font-size:13.5px;font-weight:700;color:var(--ink2);line-height:1.7">
        정말 <b>${esc(m.name)}</b>님에게 마스터를 넘길까요?
      </p>
      <div class="fm-note">
        넘기고 나면 <b>${esc(me.name || '나')}</b>님은 부모가 돼요.<br>
        되돌리려면 새 마스터가 다시 넘겨줘야 해요.
      </div>
    `;

    App.sheet('마스터를 넘길까요?', body,
      `<button type="button" class="btn line" id="fmTcC" style="flex:0 0 96px">취소</button>
       <button type="button" class="btn full" id="fmTcOk">넘기기</button>`, (b, f) => {
      f.querySelector('#fmTcC').addEventListener('click', () => App.closeSheet());
      f.querySelector('#fmTcOk').addEventListener('click', () => {
        if(!window.ModSync || typeof ModSync.transferMaster !== 'function'){
          App.toast('아직 넘길 수 없어요');
          return;
        }
        try{
          const to = ModSync.transferMaster(id);
          App.closeSheet();
          App.toast(`이제 ${(to && to.name) || m.name}님이 마스터예요`);
          if(App.haptic) App.haptic();
        }catch(e){
          App.toast((e && e.message) || '넘기지 못했어요');
        }
      });
    });
  },

  /* ================= 프로필 편집 / 추가 ================= */

  _openMemberEditor(id){
    const isNew = !id;
    const canManage = App.can('manageMembers');
    const canEdit = isNew ? canManage : (id === App.meId() || canManage);
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
      ${isNew ? `<div class="fm-note" style="margin-bottom:15px">
        기기가 없는 아이도 프로필만 먼저 만들 수 있어요.<br>
        나중에 <b>가족 초대하기</b>로 기기를 연결하면 돼요.
      </div>` : ''}
      <div class="field">
        <label>이름</label>
        <input class="inp" id="fmName" placeholder="이름을 입력해주세요" maxlength="8" value="${esc(mem.name)}">
      </div>
      ${isNew ? `
      <div class="field">
        <label>역할</label>
        <div class="fm-role-track" id="fmRolePick">
          <button type="button" class="fm-role-opt on" data-role-pick="child"><span class="fm-role-em">🐣</span>아이</button>
          <button type="button" class="fm-role-opt" data-role-pick="parent"><span class="fm-role-em">🌷</span>부모</button>
        </div>
      </div>` : ''}
      <div class="field">
        <label>아바타</label>
        <div class="fm-avatar-grid" id="fmAvatarGrid">
          ${avatars.map(e => {
            const dupeName = usedBy[e];
            const on = e === mem.emoji;
            return `<button type="button" class="fm-avatar-cell ${on ? 'on' : ''} ${dupeName ? 'dupe' : ''}" data-emoji="${esc(e)}">
              <span class="fm-avatar-emoji">${esc(e)}</span>
              ${dupeName ? `<span class="fm-avatar-dupe-label">${esc(dupeName)}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="field">
        <label>프로필 색</label>
        <div class="swatches" id="fmColorPick">
          ${PALETTE.map(p => `<button type="button" class="sw ${p.fill === mem.color ? 'on' : ''}" data-color="${esc(p.fill)}" style="background:${this._cssColor(p.fill)}"></button>`).join('')}
        </div>
      </div>
    `;

    const foot = `
      <button type="button" class="btn line" id="fmCancel" style="flex:0 0 96px">취소</button>
      <button type="button" class="btn full" id="fmSave">${isNew ? '추가하기' : '저장하기'}</button>
    `;

    App.sheet(isNew ? '프로필 추가' : '프로필 편집', body, foot, (b, f) => {
      let pickEmoji = mem.emoji, pickColor = mem.color, pickRole = 'child';

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
            roleTrack.querySelectorAll('[data-role-pick]').forEach(x => x.classList.toggle('on', x === btn));
            if(App.haptic) App.haptic();
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
          const created = App.newMember({ name, emoji:pickEmoji, role:pickRole, color:pickColor });
          App.migrate();
          App.save();
          App.render();
          App.closeSheet();
          App.toast(`${created.name} 프로필을 만들었어요`);
        } else {
          Object.assign(mem, { name, emoji:pickEmoji, color:pickColor });
          App.migrate();
          App.save();
          App.render();
          App.closeSheet();
          App.toast('프로필을 저장했어요');
        }
      });
    });
  },

  /* ================= 초대 / 그룹 코드 ================= */

  _inviteHtml(){
    const syncOn = !!(window.ModSync && typeof ModSync.enabled === 'function' && ModSync.enabled());
    const code = App.state.inviteCode;
    return `
      <div class="fm-section">
        <div class="sec-h">
          <h2>${syncOn ? '우리 가족 그룹' : '앱 주소'}</h2>
          <span class="sub">${syncOn ? '연결된 코드예요' : '가족에게 알려주세요'}</span>
        </div>
        <div class="panel fm-invite">
          ${syncOn ? `
          <div class="fm-invite-row">
            <div class="fm-code-box">${esc(code)}</div>
            <button type="button" class="btn line fm-copy-btn" id="fm-copy-code">코드 복사</button>
          </div>` : ''}
          <div class="fm-qr-wrap" ${syncOn ? '' : 'style="border-top:0;padding-top:0"'}>
            ${this._qrHtml()}
            <div class="fm-qr-label">카메라로 스캔하면 앱이 열려요<span>가족을 참여시킬 땐 초대 코드를 따로 보내주세요</span></div>
            <button type="button" class="fm-qr-link" id="fm-copy-link">
              <span class="fm-qr-link-ico">🔗</span>${esc(this._appUrl())}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _appUrl(){
    return App.appUrl ? App.appUrl() : 'https://kuma-go.github.io/kuma-routine/';
  },

  _qrHtml(){
    // 실제 스캔 가능한 QR (ModQR). 모듈이 없으면 아래 임시 격자로 폴백.
    if(window.ModQR && typeof ModQR.svg === 'function'){
      const svg = ModQR.svg(this._appUrl(), { size: 140, margin: 2, dark: 'var(--ink)', rounded: false });
      if(svg) return `<div class="fm-qr-card">${svg}</div>`;
    }
    return this._qrFallbackHtml(App.state.inviteCode);
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

  /* ================= 공유 설정 ================= */

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

  /* ================= 비밀 항목 ================= */

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
                  <div class="fm-secret-item-text"><b>${esc(it.label)}</b><span>${esc(it.sub)}</span></div>
                </div>
              `).join('') : `<div class="empty-note"><div class="big">🙂</div>아직 나만 보는 항목이 없어요</div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ================= 주간 요약 ================= */

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
    const whoLabel = who ? `${esc(who.emoji)} ${esc(who.name)} 기준` : '가족과 함께한 기록이에요';
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

  /* ================= 주간 요약 공유 카드 ================= */

  openSharePreview(){
    const stats = this._weeklyStats();
    const maxCount = Math.max(1, ...stats.perDay);
    const mid = App.vm();
    const who = App.member(mid);
    const name = who ? who.name : '우리 가족';

    /* 이번 주 날짜 범위 */
    const now = new Date();
    const sun = new Date(now); sun.setDate(now.getDate() - now.getDay());
    const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
    const fmt = d => `${d.getMonth() + 1}.${d.getDate()}`;

    /* 요일별 할 일 완료 상태 */
    const defOwner = App.defaultTodoOwner ? App.defaultTodoOwner() : 'm1';
    const todoByDay = DAYS.map((_, i) => {
      const list = (App.state.todos || []).filter(t => (t.for || defOwner) === mid && t.day === i && App.canSee(t));
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
        <div class="fm-share-title">${esc(name)}의 한 주</div>
        <div class="fm-share-head">${esc(head)}</div>

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
        this._copyText(this._appUrl(), '앱 링크를 복사했어요');
      });
    });
  },

  /* ================= 바인딩 ================= */

  _bind(root){
    const on = (sel, fn) => {
      const el = root.querySelector(sel);
      if(el) el.addEventListener('click', fn);
    };

    on('#fm-swap-owner', () => {
      if(typeof App.openDeviceOwner === 'function') App.openDeviceOwner();
    });

    on('#fm-add-member', () => this._openMemberEditor(null));

    on('#fm-invite', () => {
      if(window.ModSync && typeof ModSync.openInviteIssue === 'function') ModSync.openInviteIssue();
      else App.toast('초대를 불러올 수 없어요');
    });

    on('#fm-open-sync', () => {
      if(window.ModSync && typeof ModSync.open === 'function') ModSync.open();
      else App.toast('가족 그룹을 불러올 수 없어요');
    });

    on('#fm-perm', () => this.openPermSheet());
    on('#fm-transfer', () => this.openTransferSheet());

    on('#fm-copy-code', () => this._copyText(App.state.inviteCode, '그룹 코드를 복사했어요'));
    on('#fm-copy-link', () => this._copyText(this._appUrl(), '앱 링크를 복사했어요'));

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
      btn.addEventListener('click', () => this._openMemberEditor(btn.dataset.editMember));
    });

    root.querySelectorAll('[data-member-menu]').forEach(btn => {
      btn.addEventListener('click', () => this._openMemberMenu(btn.dataset.memberMenu));
    });

    const secretToggle = root.querySelector('#fm-secret-toggle');
    const secretBody = root.querySelector('#fm-secret-body');
    if(secretToggle && secretBody){
      secretToggle.addEventListener('click', () => {
        const expanded = secretToggle.getAttribute('aria-expanded') === 'true';
        secretToggle.setAttribute('aria-expanded', String(!expanded));
        secretToggle.classList.toggle('on', !expanded);
        if(App.haptic) App.haptic();
        secretBody.style.maxHeight = expanded ? '0px' : (secretBody.scrollHeight + 'px');
      });
    }

    on('#fm-share-cta', () => this.openSharePreview());
  },

  /* ================= 유틸 ================= */

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

  _esc(s){ return esc(s); }
};

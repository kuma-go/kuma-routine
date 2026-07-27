/* ================= SCHEDULE EDITOR + DRAWER + INIT ================= */
window.App=App; window.PALETTE=PALETTE; window.DAYS=DAYS;

App.editSchedule=function(id,presetStart){
  const S=this.sched();
  const list=S[this.day]||(S[this.day]=[]);
  const who=this.member();
  const ev=id?list.find(x=>x.id===id):null;
  if(id&&!ev)id=null;
  if(ev&&!this.canSee(ev)){this.toast('🔒 작성자만 볼 수 있는 일정이에요');return;}
  const d=ev||{s:presetStart||'15:00',e:presetStart?toStr(Math.min(23*60,toMin(presetStart)+60)):'16:00',t:'',c:'lime',alarm:true,memo:'',items:[],secret:false};
  const times=[];for(let m=5*60;m<=23*60;m+=10)times.push(m);
  const opt=(sel)=>times.map(m=>`<option value="${toStr(m)}" ${toStr(m)===sel?'selected':''}>${m<720?'오전':'오후'} ${disp(m)}</option>`).join('');

  this.sheet(id?'일정 수정':'새 일정',`
    <div style="display:flex;align-items:center;gap:8px;margin:-2px 0 14px;padding:9px 12px;background:var(--indigo-s);border-radius:14px">
      <span style="font-size:17px">${esc(who.emoji)}</span>
      <span style="font-size:13px;font-weight:800;color:var(--indigo)">${esc(who.name)}의 일정에 저장돼요</span>
    </div>
    <div class="field">
      <label>무엇을 하나요?</label>
      <input class="inp" id="fT" placeholder="예: 피아노 학원" value="${esc(d.t||'')}">
    </div>
    <div class="field two">
      <div><label>시작</label><select class="inp" id="fS">${opt(d.s)}</select></div>
      <div><label>끝</label><select class="inp" id="fE">${opt(d.e)}</select></div>
    </div>
    ${id?'':`<div class="field">
      <label>요일 <span style="color:var(--muted);font-weight:700">· 여러 날 한 번에 추가돼요</span></label>
      <div class="swatches" id="fDays">${DAYS.map((x,i)=>`<button class="daychip ${i===this.day?'on':''}" data-d="${i}">${x[0]}</button>`).join('')}</div>
    </div>`}
    <div class="field">
      <label>색상</label>
      <div class="swatches" id="fC">${PALETTE.map(p=>`<button class="sw ${p.k===d.c?'on':''}" data-c="${p.k}" style="background:${p.fill}"></button>`).join('')}</div>
    </div>
    <div class="field">
      <label>준비물 (쉼표로 구분)</label>
      <input class="inp" id="fI" placeholder="예: 악보, 연습노트" value="${esc((d.items||[]).join(', '))}">
    </div>
    <div class="field">
      <label>메모</label>
      <textarea class="inp" id="fM" placeholder="아이에게 전할 말을 적어주세요">${esc(d.memo||'')}</textarea>
    </div>
    <div class="panel" style="padding:4px 14px">
      <div class="toggle-row">
        <div><div class="tl">🔔 알림 받기</div><div class="td">시작 10분 전에 알려줘요</div></div>
        <button class="sw-tog ${d.alarm?'on':''}" id="fA"></button>
      </div>
      <div class="toggle-row">
        <div><div class="tl">🔁 매주 반복</div><div class="td">다음 주에도 같은 시간에 반복돼요</div></div>
        <button class="sw-tog ${d.repeat?'on':''}" id="fRep"></button>
      </div>
      <div class="toggle-row">
        <div><div class="tl">🤫 비밀 일정</div><div class="td">나만 볼 수 있어요</div></div>
        <button class="sw-tog warm ${d.secret?'on':''}" id="fSec"></button>
      </div>
    </div>
    ${id?`<button class="btn line full" id="fDel" style="margin-top:16px;color:#D8453A;border-color:#F5D6D3">일정 삭제</button>`:''}
  `,`
    <button class="btn line" id="fCancel" style="flex:0 0 96px">취소</button>
    <button class="btn full" id="fSave">${id?'수정 완료':'추가하기'}</button>
  `,(b,f)=>{
    let pick=d.c, days=[this.day];
    b.querySelectorAll('#fC .sw').forEach(s=>s.onclick=()=>{pick=s.dataset.c;b.querySelectorAll('#fC .sw').forEach(x=>x.classList.remove('on'));s.classList.add('on')});
    b.querySelectorAll('#fDays .daychip').forEach(s=>s.onclick=()=>{
      const i=+s.dataset.d; s.classList.toggle('on');
      days=[...b.querySelectorAll('#fDays .daychip.on')].map(x=>+x.dataset.d);
    });
    b.querySelectorAll('#fA,#fRep,#fSec').forEach(t=>t.onclick=e=>e.currentTarget.classList.toggle('on'));
    const del=b.querySelector('#fDel');
    if(del)del.onclick=()=>{
      S[this.day]=list.filter(x=>x.id!==id);
      this.save();this.closeSheet();this.render();this.toast('일정을 삭제했어요');
    };
    f.querySelector('#fCancel').onclick=()=>this.closeSheet();
    f.querySelector('#fSave').onclick=()=>{
      const t=b.querySelector('#fT').value.trim();
      if(!t){this.toast('일정 이름을 적어주세요');b.querySelector('#fT').focus();return;}
      const s=b.querySelector('#fS').value,e=b.querySelector('#fE').value;
      if(toMin(e)<=toMin(s)){this.toast('끝 시간이 시작보다 빨라요');return;}
      const base={t,s,e,c:pick,
        alarm:b.querySelector('#fA').classList.contains('on'),
        repeat:b.querySelector('#fRep').classList.contains('on'),
        secret:b.querySelector('#fSec').classList.contains('on'),
        memo:b.querySelector('#fM').value.trim(),
        items:b.querySelector('#fI').value.split(',').map(x=>x.trim()).filter(Boolean),
        owner:this.meId()};
      if(id){Object.assign(ev,base);}
      else{
        (days.length?days:[this.day]).forEach(dy=>{
          (S[dy]=S[dy]||[]).push(Object.assign({id:uid()},base));
        });
      }
      this.save();this.closeSheet();this.openCard=null;this.render();
      this.toast(id?'일정을 수정했어요':`일정을 ${days.length>1?days.length+'일에 ':''}추가했어요 ✨`);
    };
  });
};

/* ---------- PARENT MODE PIN GATE ---------- */
App.toMaster=function(after){
  if(this.state.pinOff){ this._setRole('master'); after&&after(); return; }
  const pin=this.state.pin||'1234';
  this.sheet('부모 모드로 전환',`
    <p style="margin:0 0 4px;font-size:13.5px;color:var(--ink2);font-weight:600;line-height:1.6">
      보상과 할 일을 정하는 건 부모님만 할 수 있어요.<br>PIN 4자리를 입력해 주세요.</p>
    <p style="margin:0 0 18px;font-size:11.5px;color:var(--muted);font-weight:700">처음 PIN은 ${pin} 이에요</p>
    <div class="pinrow" id="pinDots">${[0,1,2,3].map(i=>`<i data-i="${i}"></i>`).join('')}</div>
    <div class="pinpad" id="pinPad">
      ${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}">${n}</button>`).join('')}
      <button class="ghosted" data-k="off">건너뛰기</button>
      <button data-k="0">0</button>
      <button data-k="del">⌫</button>
    </div>`,'',(b)=>{
    let buf='';
    const dots=b.querySelectorAll('#pinDots i');
    const paint=()=>dots.forEach((d,i)=>d.classList.toggle('on',i<buf.length));
    b.querySelectorAll('#pinPad button').forEach(k=>k.onclick=()=>{
      const v=k.dataset.k;
      if(v==='off'){ this.state.pinOff=true; this.save(); this.closeSheet(); this._setRole('master'); after&&after(); return; }
      if(v==='del'){ buf=buf.slice(0,-1); paint(); return; }
      if(buf.length>=4)return;
      buf+=v; paint(); this.haptic();
      if(buf.length===4){
        setTimeout(()=>{
          if(buf===pin){ this.closeSheet(); this._setRole('master'); this.toast('🌷 부모 모드로 전환했어요'); after&&after(); }
          else { buf=''; paint(); const p=b.querySelector('#pinDots'); p.classList.add('shake'); setTimeout(()=>p.classList.remove('shake'),420); this.toast('PIN이 맞지 않아요'); }
        },160);
      }
    });
  });
};
App.toChild=function(){ this._setRole('child'); this.toast('🐣 아이 모드로 전환했어요'); };
App._setRole=function(r){
  this.state.role=r; this.viewMember='m1'; this.openCard=null; this._scrolled=false;
  this.save(); this.render(); this.renderDrawer&&this.renderDrawer();
};

App.renderDrawer=function(){
  const m=this.isMaster();
  const me=this.member(this.meId());
  document.getElementById('drawer').innerHTML=`
    <div class="who">
      <div class="brand">KUMA <b>routine</b></div>
      <div class="av">${esc(me.emoji)}</div>
      <div class="nm">${esc(me.name)}</div>
      <div class="rl">${m?'부모 (마스터) · 설정 권한 있음':'아이 · 우리 가족 루틴'}</div>
    </div>
    <div class="dr-list">
      <button class="dr-item" data-go="time"><span class="em">🗓</span>오늘 일정</button>
      <button class="dr-item" data-go="todo"><span class="em">✅</span>할 일</button>
      <button class="dr-item" data-go="reward"><span class="em">🎁</span>보상 · 미니게임</button>
      <button class="dr-item" data-go="family"><span class="em">👥</span>가족 · 공유</button>
      <div class="hr"></div>
      ${window.ModSearch?`<button class="dr-item" data-act="search"><span class="em">🔍</span>일정 · 할 일 검색</button>`:''}
      ${window.ModSearch?`<button class="dr-item" data-act="tpl"><span class="em">⚡</span>템플릿으로 빠른 추가</button>`:''}
      ${window.ModBadge?`<button class="dr-item" data-act="badge"><span class="em">🏅</span>배지 컬렉션<span class="pill" style="background:var(--indigo-s);color:var(--indigo);margin-left:auto">${ModBadge.earnedCount?ModBadge.earnedCount():0}</span></button>`:''}
      <button class="dr-item" data-act="report"><span class="em">📊</span>주간 리포트</button>
      <button class="dr-item" data-act="notify"><span class="em">🔔</span>알림 센터${window.ModNotify&&ModNotify.count&&ModNotify.count()?`<span class="pill" style="background:var(--orange);color:#fff;margin-left:auto">${ModNotify.count()}</span>`:''}</button>
      <button class="dr-item" data-act="nset"><span class="em">⚙️</span>알림 설정</button>
      <button class="dr-item" data-act="theme"><span class="em">🎨</span>화면 테마</button>
      ${window.ModSound?`<button class="dr-item" data-act="sound"><span class="em">🔊</span>소리 설정</button>`:''}
      ${window.ModTheme&&this.state.adFree?`<button class="dr-item" data-act="ads"><span class="em">📺</span>광고 다시 보기</button>`:''}
      <div class="hr"></div>
      <button class="dr-item" data-act="role"><span class="em">${m?'🐣':'🌷'}</span>${m?'아이 모드로 보기':'부모 모드로 보기'}</button>
      <button class="dr-item" data-act="sim"><span class="em">⏱</span>시간 미리보기 ${this.simNow!==null?'<span class="pill" style="background:var(--orange-s);color:var(--orange);margin-left:auto">'+disp(this.simNow)+'</span>':''}</button>
      <div class="hr"></div>
      <button class="dr-item" data-act="tour"><span class="em">✨</span>앱 소개 다시 보기</button>
      <button class="dr-item" data-act="reset"><span class="em">↺</span>데이터 초기화</button>
    </div>
    <div style="padding:14px 20px calc(18px + env(safe-area-inset-bottom));font-size:11px;color:var(--muted);font-weight:600;line-height:1.5">
      KUMA routine · v1.0<br>일정 · 준비물 · 할 일 · 보상을 한 곳에서
    </div>`;
  document.querySelectorAll('#drawer .dr-item').forEach(b=>b.onclick=()=>{
    if(b.dataset.go){this.closeSheet();this.go(b.dataset.go);return;}
    const a=b.dataset.act;
    if(a==='role'){this.closeSheet(); m?this.toChild():this.toMaster();}
    if(a==='sim'){this.closeSheet();this.openSim();}
    if(a==='search'){this.closeSheet();window.ModSearch?ModSearch.open():this.toast('검색을 불러올 수 없어요');}
    if(a==='tpl'){this.closeSheet();window.ModSearch?ModSearch.openTemplates():this.toast('템플릿을 불러올 수 없어요');}
    if(a==='badge'){this.closeSheet();window.ModBadge?ModBadge.open():this.toast('배지를 불러올 수 없어요');}
    if(a==='report'){this.closeSheet();window.ModReport?ModReport.open():this.toast('리포트를 불러올 수 없어요');}
    if(a==='notify'){this.closeSheet();window.ModNotify?ModNotify.open():this.toast('알림 센터를 불러올 수 없어요');}
    if(a==='nset'){this.closeSheet();window.ModNotify?ModNotify.openSettings():this.toast('알림 설정을 불러올 수 없어요');}
    if(a==='theme'){this.closeSheet();window.ModTheme?ModTheme.openPicker():this.toast('테마를 불러올 수 없어요');}
    if(a==='sound'){this.closeSheet();window.ModSound?ModSound.openSettings():this.toast('소리 설정을 불러올 수 없어요');}
    if(a==='ads'){this.closeSheet();window.ModTheme?ModTheme.showAds():this.toast('광고를 불러올 수 없어요');}
    if(a==='tour'){this.closeSheet();window.ModOnboard?ModOnboard.start():this.toast('소개 화면을 불러올 수 없어요');}
    if(a==='reset'){localStorage.clear();location.reload();}
  });
};

App.openSim=function(){
  const cur=this.simNow!==null?this.simNow:this.nowMin();
  this.sheet('시간 미리보기',`
    <p style="margin:0 0 16px;font-size:13.5px;color:var(--ink2);line-height:1.6">
      시간을 옮겨 보면 <b>현재 시간 라인</b>이 따라 움직이고,<br>
      곧 시작하는 일정 카드가 <b>누르지 않아도 준비물을 펼치는</b> 가변 UI를 확인할 수 있어요.
    </p>
    <div style="text-align:center;font-size:38px;font-weight:800;color:var(--orange);font-variant-numeric:tabular-nums" id="simV">${disp(cur)}</div>
    <input type="range" min="${6*60}" max="${23*60}" step="5" value="${cur}" id="simR" style="width:100%;margin-top:14px;accent-color:var(--orange);height:34px">
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);font-weight:700"><span>오전 6:00</span><span>오후 11:00</span></div>
  `,`
    <button class="btn line" id="simOff" style="flex:1">실제 시간으로</button>
    <button class="btn full" id="simOk" style="flex:1">적용</button>
  `,(b,f)=>{
    const r=b.querySelector('#simR'),v=b.querySelector('#simV');
    r.oninput=()=>{v.textContent=disp(+r.value)};
    f.querySelector('#simOk').onclick=()=>{this.simNow=+r.value;this.day=this.today;this._scrolled=false;this.closeSheet();this.render();setTimeout(()=>this.scrollToNow(),120);};
    f.querySelector('#simOff').onclick=()=>{this.simNow=null;this.closeSheet();this.render();};
  });
};

/* ---------- INIT ---------- */
(function init(){
  App.load();
  Object.keys(window).filter(k=>/^Mod[A-Z]/.test(k)).forEach(k=>{
    const m=window[k];
    if(m&&m.css){const s=document.createElement('style');s.setAttribute('data-mod',k);s.textContent=m.css;document.head.appendChild(s);}
    if(m&&typeof m.init==='function'){try{m.init()}catch(e){console.error(k+'.init',e)}}
  });
  /* --- a11y / polish overrides (must come after module styles) --- */
  const a11y=document.createElement('style');
  a11y.textContent=`
    .td-coin,.rw-benefit-cost b,.rw-hist-cost{color:#C43F00}
    .rw-gamechip{min-height:44px}
    .rw-gamechips{position:relative;mask-image:linear-gradient(90deg,#000 0,#000 88%,transparent 100%);
      -webkit-mask-image:linear-gradient(90deg,#000 0,#000 88%,transparent 100%)}
    .td-day-chip,.fm-seg-btn,.rw-seg-btn{min-height:44px}
    .sw,.daychip{width:42px;height:42px}
    .td-check{min-width:44px;min-height:44px}
    .fm-avatar-opt,.fm-av-opt{min-width:44px;min-height:44px}
    .pinrow{display:flex;gap:14px;justify-content:center;margin:6px 0 22px}
    .pinrow i{width:14px;height:14px;border-radius:50%;background:#E4E4EC;transition:.18s cubic-bezier(.34,1.56,.64,1)}
    .pinrow i.on{background:var(--indigo);transform:scale(1.18)}
    .pinrow.shake{animation:pinShake .4s}
    @keyframes pinShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
    .pinpad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .pinpad button{min-height:54px;border-radius:16px;background:#F5F5F9;font-size:20px;font-weight:800;color:var(--ink);transition:.13s}
    .pinpad button:active{background:var(--indigo-s);transform:scale(.95)}
    .pinpad button.ghosted{font-size:13px;font-weight:800;color:var(--muted);background:transparent}

    /* 보상 결과 카드 다크 대응 (모듈 CSS의 하드코딩 그라디언트 덮어쓰기) */
    #phone.th-dark .rw-result.gold{background:linear-gradient(135deg,#4A3A12,#6B5518)}
    #phone.th-dark .rw-result.silver{background:linear-gradient(135deg,#2A2C36,#3B3E4C)}
    #phone.th-dark .rw-result.bronze{background:linear-gradient(135deg,#3E2C18,#573C1F)}
    #phone.th-dark .rw-result .rw-result-tier{color:rgba(255,255,255,.72)}
    #phone.th-dark .rw-result .rw-result-benefit{color:#F5F5FA}
    #phone.th-dark .rw-celebrate{background:rgba(255,90,0,.14)}
    #phone.th-dark .rw-celebrate .rw-cel-text{color:#FFD3B8}

    /* 요일 캐러셀 다크 대응 */
    #phone.th-dark .dots button::after{background:#3A3A48}
    #phone.th-dark .dots button.has::after{background:#55556A}
    #phone.th-dark .dots button.today::after{background:var(--orange);box-shadow:0 0 0 3px rgba(255,90,0,.22)}

    /* 드래그 중 네이티브 텍스트 선택 방지 */
    #phone.nosel,#phone.nosel *{user-select:none!important;-webkit-user-select:none!important}
    .card,.wk-ev,.pchip,.vseg button,.morebtn,.rsz,.dragtip,.dragbar{-webkit-user-select:none;user-select:none}
  `;
  document.head.appendChild(a11y);

  const extra=document.createElement('style');
  extra.textContent=`
    .daychip{width:38px;height:38px;border-radius:12px;border:1.5px solid var(--line);background:#FAFAFC;font-weight:800;font-size:14px;color:var(--muted);transition:.15s}
    .daychip.on{background:var(--indigo);border-color:var(--indigo);color:#fff}
    select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A3A3AF' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:30px}
  `;
  document.head.appendChild(extra);

  document.getElementById('btnMenu').onclick=()=>{App.renderDrawer();document.getElementById('drawer').classList.add('on');document.getElementById('scrim').classList.add('on');};
  document.getElementById('scrim').onclick=()=>{App.closeCtx();App.closeSheet();};
  document.getElementById('btnAdd').onclick=()=>{
    if(App.tab==='todo'&&window.ModTodo&&ModTodo.openEditor)ModTodo.openEditor(null);
    else App.editSchedule(null);
  };
  document.getElementById('btnToday').onclick=()=>{App.setDay(App.today);setTimeout(()=>App.scrollToNow(),120)};

  App.pickDay=function(){
    this.sheet('요일 선택',`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${DAYS.map((x,i)=>{
        const n=(this.sched()[i]||[]).length;
        return `<button class="dpick ${i===this.day?'on':''}" data-d="${i}">
          <b>${x[0]}</b><span>${x[1]}</span><i>${n}개</i>${i===this.today?'<u>오늘</u>':''}</button>`;
      }).join('')}
    </div>`,'',(b)=>{
      b.querySelectorAll('.dpick').forEach(x=>x.onclick=()=>{App.setDay(+x.dataset.d);App.closeSheet();});
    });
  };
  const dp=document.createElement('style');
  dp.textContent=`.dpick{position:relative;padding:12px 4px 10px;border-radius:16px;border:1.5px solid var(--line);background:#FAFAFC;display:flex;flex-direction:column;align-items:center;gap:1px;transition:.15s}
  .dpick b{font-size:17px;font-weight:800}.dpick span{font-size:9.5px;font-weight:800;color:var(--muted);letter-spacing:.06em}
  .dpick i{font-size:10.5px;font-style:normal;font-weight:700;color:var(--muted);margin-top:3px}
  .dpick u{position:absolute;top:-7px;right:-4px;background:var(--orange);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:9px;text-decoration:none}
  .dpick.on{background:var(--indigo-s);border-color:var(--indigo)}.dpick.on b,.dpick.on i{color:var(--indigo)}`;
  document.head.appendChild(dp);

  /* swipe between days */
  const stage=document.getElementById('stage');
  let x0=null,y0=null;
  stage.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(x0===null||App.tab!=='time'||App.view!=='day')return;
    const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;
    if(Math.abs(dx)>62&&Math.abs(dx)>Math.abs(dy)*1.8){App.setDay(App.day+(dx<0?1:-1));App.haptic();}
    x0=null;
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if(App.tab!=='time')return;
    if(e.key==='ArrowRight')App.setDay(App.day+1);
    if(e.key==='ArrowLeft')App.setDay(App.day-1);
    if(e.key==='Escape')App.closeSheet();
  });

  /* PWA: 서비스워커 등록 (file:// 로 열면 조용히 건너뜀) */
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    });
  }

  App.render();
  /* 시작 시 이미 달성된 배지는 연출 없이 반영 */
  if(window.ModBadge&&ModBadge.check){try{ModBadge.check('silent')}catch(e){}}
  setInterval(()=>App.tick(),1000);
})();

# 하루칸(HaruKan) 프로토타입 — 모듈 제작 계약서

한국 초등 아이 + 학부모용 **일정 공유 앱** 인터랙티브 프로토타입. 단일 HTML 파일로 통합됨.
당신은 그 안에 들어갈 **JS 모듈 1개**를 작성한다.

## 절대 규칙
1. 순수 바닐라 JS. 외부 라이브러리/CDN/빌드 도구 **금지**. `localStorage` 직접 접근 금지(App.save() 사용).
2. 결과물은 **JS 파일 1개**. 최상위에 IIFE 없이 `window.ModXxx = { css:`...`, render(root){...} }` 형태로 정의.
   - `css`: 이 모듈 전용 CSS 문자열(백틱 템플릿). 클래스명은 반드시 모듈 접두사(`td-`, `rw-`, `fm-`)로 시작.
   - `render(root)`: `root.innerHTML = ...` 로 화면 전체를 그리고, 그 뒤 이벤트 핸들러를 바인딩. **여러 번 호출돼도 안전해야 함(멱등).**
3. 이미 정의된 전역 토큰/유틸을 재사용하고, 색상 하드코딩 대신 CSS 변수를 쓸 것.
4. 모든 텍스트는 한국어. 아이도 읽을 수 있게 쉽고 다정한 말투.
5. 터치 타겟 최소 44px. 폰트 12px 이상.
6. 화면 폭 390px 기준. 하단 탭바(60px)에 가리지 않게 컨테이너 하단 padding 100px.

## 사용 가능한 전역 (이미 존재함, 재정의 금지)
```js
App.state = {
  role:'child'|'master',                   // 현재 보는 사람의 역할
  me:{name,emoji,role},
  members:[{id:'m1',name:'루아',emoji:'🐣',role:'child',color:'#7B96EF'},
           {id:'m2',name:'엄마',emoji:'🌷',role:'master',color:'#EEB6EC'},
           {id:'m3',name:'아빠',emoji:'🐻',role:'master',color:'#C9B08A'}],
  inviteCode:'HRK-4821',
  coins:120,
  reward:{ mode:'game'|'real', realBenefit:'주말 놀이공원 가기', cost:80, tier:null, history:[] },
  schedules:{ 0..6: [{id,s:'14:00',e:'15:00',t:'피아노',c:'lime',alarm:true,memo:'',items:['악보'],secret:false,owner:'m1'}] },
  todos:[ {id,day:0..6,text,coin:15,done:false,secret:false,owner:'m1'} ]
}
App.day          // 현재 보고 있는 요일 0=일
App.today        // 오늘 요일
App.nowMin()     // 현재 시각(분)
App.isMaster()   // 부모 모드 여부
App.meId()       // 'm2'(부모) 또는 'm1'(아이)
App.canSee(obj)  // 비밀 항목 열람 가능 여부 (obj.secret && obj.owner!==meId() 면 false)
App.save()       // 상태 저장
App.render()     // 현재 탭 전체 리렌더 (상태 바꾼 뒤 호출)
App.toast('메시지')
App.haptic()
App.sheet(title, bodyHTML, footHTML, onMount)  // 바텀시트 열기. onMount(bodyEl, footEl)에서 이벤트 바인딩
App.closeSheet()
App.go('time'|'todo'|'reward'|'family')
PALETTE   // [{k:'lime',fill:'#B6DD6E',ink:'#4A6B12'}, ...] 9색
CFILL(k)  // 팔레트 조회
uid()     // 랜덤 id
disp(min) // 840 -> '2:00' (12시간제)
toMin('14:00') // 840
DAYS      // [['일','SUN'],['월','MON'],...]
```

## 재사용 가능한 공통 CSS 클래스 (새로 만들지 말 것)
`.sec`(padding 18px) `.sec-h`(제목줄, 안에 h2 + .sub) `.panel`(흰 카드)
`.btn` `.btn.ghost` `.btn.warm` `.btn.line` `.btn.full`
`.pill` `.field`(label+.inp) `.inp` `textarea.inp` `.two`(2컬럼 그리드)
`.toggle-row`(.tl 제목/.td 설명 + `.sw-tog` 스위치, `.on` 클래스로 켜짐. `.sw-tog.warm`는 오렌지)
`.swatches`+`.sw`(색상칩, `.on`이면 선택) `.empty-note`(빈 상태, 안에 `.big` 이모지)

## 디자인 토큰 (CSS 변수)
```
--ink:#17171C  --ink2:#4A4A55  --muted:#A3A3AF  --line:#EAEAF0
--bg:#F3F3F6   --paper:#FFF
--indigo:#4B3FD4 --indigo-d:#3A2FB0 --indigo-s:#EEECFF
--orange:#FF5A00 --orange-s:#FFF0E8
--r-s:10px --r-m:16px --r-l:22px --r-xl:28px
--sh-1 --sh-2 --sh-3 (그림자)
```
톤앤매너: 흰 배경 + 파스텔 카드 + 굵은(800) 산세리프 + 큰 라운드(22px). 인디고=구조/네비, 오렌지=지금·강조·보상. 아이가 쓰는 화면이라 크고 명확하게, 하지만 유아용처럼 촌스럽지 않게. 아이콘은 인라인 SVG(stroke, width 1.9) 또는 이모지.

## 애니메이션
CSS transition/keyframes만 사용. 0.15~0.4s, `cubic-bezier(.22,1,.36,1)` 선호. 과하지 않게.

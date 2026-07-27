# CONTRACT v2 — 변경된 코어 API (기존 CONTRACT.md 위에 덮어쓰는 내용)

앱 이름이 **KUMA routine** 으로 바뀌었습니다. UI에 앱 이름이 노출되는 곳은 이 이름을 씁니다.

## 1) 일정 데이터가 멤버별로 중첩됨
```js
// 이전: App.state.schedules[0..6] = [...]
// 지금:
App.state.schedules = { m1:{0..6:[...]}, m2:{0..6:[...]}, m3:{...} }
```
직접 접근하지 말고 **반드시 아래 헬퍼**를 쓸 것:
```js
App.vm()            // 지금 보고 있는 멤버 id. 아이 모드면 항상 'm1'
App.member(id?)     // 멤버 객체 {id,name,emoji,role,color}. 인자 없으면 App.vm()의 멤버
App.sched(id?)      // 해당 멤버의 {0..6:[일정]} 객체 (없으면 자동 생성)
App.todosOf(day)    // 지금 보고 있는 멤버의 그 요일 할 일 배열
App.canSetCoin()    // 코인 보상을 설정할 권한이 있는가 (부모 모드 && 아이 프로필을 보는 중일 때만 true)
```
`App.state.todos`의 각 항목에 **`for` 필드**가 추가됨 (`'m1'`=아이 것, `'m2'`=엄마 본인 것). 없으면 `'m1'`으로 간주.
전체 순회가 꼭 필요할 때만 `App.state.todos`를 직접 쓰고, 화면 표시는 `App.todosOf(day)`를 쓸 것.

부모 모드에서는 상단에 프로필 전환 칩(🐣 루아 / 🌷 엄마 / 🐻 아빠)이 자동으로 뜹니다(코어가 그림). 모듈은 그냥 `App.vm()` 기준으로 렌더하면 됩니다.

## 2) 멤버 프로필
```js
App.state.members = [{id,name,emoji,role:'child'|'master',color}]
App.state.avatars  // 없으면 만들어 쓸 것. 아바타 이모지 후보 목록
```

## 3) 그 외는 CONTRACT.md 와 동일
`App.state.role`, `App.isMaster()`, `App.meId()`, `App.canSee(o)`, `App.save()`, `App.render()`,
`App.toast()`, `App.haptic()`, `App.sheet(title,bodyHTML,footHTML,onMount)`, `App.closeSheet()`, `App.go(tab)`,
`PALETTE`, `CFILL`, `uid`, `disp`, `toMin`, `DAYS`, 공통 CSS 클래스(`.panel .btn .field .inp .toggle-row .sw-tog .empty-note .pill .two .swatches .sw`), 디자인 토큰 CSS 변수.

`render(root)`는 반드시 멱등. rAF/타이머는 모듈 변수에 저장하고 render 시작 시 정리.
외부 라이브러리 금지. 순수 바닐라 JS + CSS만.

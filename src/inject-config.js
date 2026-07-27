/**
 * 배포 시 동기화 설정을 주입한다.
 *
 *   FIREBASE_API_KEY / FIREBASE_DB_URL 환경변수를 읽어
 *   src/mod_sync.js 의 KUMA_FIREBASE 를 채운 뒤 빌드하게 한다.
 *
 * 저장소에는 빈 값이 커밋되어 있고, 이 스크립트는 CI 워크스페이스에서만
 * 파일을 고친다. 키가 저장소에 남지 않는다.
 *
 *   node src/inject-config.js
 */
const fs = require('fs');
const path = require('path');

const key = process.env.FIREBASE_API_KEY || '';
const db  = process.env.FIREBASE_DB_URL  || '';

if(!key || !db){
  console.log('[inject-config] 환경변수가 없어 건너뜁니다 — 동기화는 개발자 모드로 동작합니다.');
  process.exit(0);
}
if(!/^https:\/\//.test(db)){
  console.error('[inject-config] FIREBASE_DB_URL 은 https:// 로 시작해야 합니다.');
  process.exit(1);
}

const p = path.join(__dirname, 'mod_sync.js');
let s = fs.readFileSync(p, 'utf8');

const re = /const KUMA_FIREBASE = \{[\s\S]*?\};/;
if(!re.test(s)){
  console.error('[inject-config] KUMA_FIREBASE 블록을 찾지 못했습니다.');
  process.exit(1);
}
s = s.replace(re, `const KUMA_FIREBASE = {\n  apiKey: ${JSON.stringify(key)},\n  dbUrl:  ${JSON.stringify(db)}\n};`);
fs.writeFileSync(p, s);

// 로그에 키가 남지 않도록 앞 6자만 표시
console.log('[inject-config] 주입 완료 —', key.slice(0,6) + '…', '/', db.replace(/^https:\/\//,'').split('.')[0] + '…');

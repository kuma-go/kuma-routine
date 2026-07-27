/**
 * 배포 시 동기화 설정을 주입한다.
 *
 *   FIREBASE_API_KEY / FIREBASE_DB_URL 환경변수를 읽어
 *   src/mod_sync.js 의 KUMA_FIREBASE 를 채운 뒤 빌드하게 한다.
 *
 * 저장소에는 빈 값이 커밋되어 있고, 이 스크립트는 CI 워크스페이스에서만
 * 파일을 고친다. 키가 저장소에 남지 않는다.
 *
 *   node src/inject-config.js            로컬 — 값이 없으면 그냥 건너뛴다
 *   node src/inject-config.js --require   CI  — 값이 없으면 실패한다
 *
 * CI 에서 --require 를 쓰는 이유: 시크릿을 늦게 등록했거나 이름을 잘못 적으면
 * 예전에는 조용히 건너뛰고 "성공"으로 끝나 배포본에 키가 안 들어갔다.
 * 그 상황을 눈에 보이게 만들기 위해서다.
 */
const fs = require('fs');
const path = require('path');

const key = process.env.FIREBASE_API_KEY || '';
const db  = process.env.FIREBASE_DB_URL  || '';

const REQUIRE = process.argv.includes('--require') || process.env.REQUIRE_CONFIG === '1';

if(!key || !db){
  const missing = [!key && 'FIREBASE_API_KEY', !db && 'FIREBASE_DB_URL'].filter(Boolean).join(', ');
  if(REQUIRE){
    console.error('[inject-config] 필요한 시크릿이 비어 있습니다: ' + missing);
    console.error('  GitHub → Settings → Secrets and variables → Actions → **Repository secrets** 에');
    console.error('  같은 이름으로 등록되어 있는지 확인하세요.');
    console.error('  (Environment secrets / Dependabot secrets 에 넣으면 이 워크플로에서 보이지 않습니다)');
    process.exit(1);
  }
  console.log('[inject-config] 환경변수가 없어 건너뜁니다 — 동기화 없이 빌드합니다.');
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

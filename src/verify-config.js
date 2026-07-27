/**
 * 빌드 결과물(index.html)에 동기화 설정이 실제로 들어갔는지 확인한다.
 * 키 값 자체는 출력하지 않는다 — CI 로그에 남으면 안 되기 때문.
 *
 *   node src/verify-config.js
 */
const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const m = s.match(/const KUMA_FIREBASE = \{[\s\S]{0,240}?\};/);
if(!m){
  console.error('[verify-config] index.html 에서 KUMA_FIREBASE 블록을 찾지 못했습니다.');
  process.exit(1);
}
const pick = k => { const r = m[0].match(new RegExp(k + ':\\s*"([^"]*)"')); return r ? r[1] : ''; };
const key = pick('apiKey'), db = pick('dbUrl');

if(!key || !db){
  console.error('[verify-config] 빌드 결과물에 동기화 설정이 들어가지 않았습니다.');
  console.error('  주입 단계가 건너뛰어졌을 가능성이 높습니다. 시크릿 이름을 확인하세요.');
  process.exit(1);
}
console.log('[verify-config] 확인 — apiKey ' + key.length + '자, dbUrl ' +
  db.replace(/^https:\/\//,'').split('.')[0] + '…');

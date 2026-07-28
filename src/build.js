/**
 * KUMA routine — 빌드 스크립트
 * src/_core.html 에 모듈 JS를 순서대로 인라인해 단일 index.html 을 만든다.
 *   node src/build.js
 */
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const OUT = path.join(SRC, '..');

const MODULES = [
  'mod_qr.js',      // QR 인코더 (mod_family 보다 먼저)
  'mod_todo.js',
  'mod_reward.js',
  'mod_family.js',
  'mod_notify.js',
  'mod_onboard.js',
  'mod_theme.js',
  'mod_report.js',
  'mod_search.js',
  'mod_badge.js',
  'mod_sound.js',
  'mod_sync.js',    // 가족 그룹 실시간 동기화
  'mod_install.js', // 홈 화면에 추가
  'app_wire.js',    // 마지막: 모듈 등록과 부팅
];

let html = fs.readFileSync(path.join(SRC, '_core.html'), 'utf8');

const bundle = MODULES
  .filter(f => fs.existsSync(path.join(SRC, f)))
  .map(f => `\n/* ===== ${f} ===== */\n` + fs.readFileSync(path.join(SRC, f), 'utf8'))
  .join('\n');

html = html.replace('</script>\n</body>', bundle + '\n</script>\n</body>');

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('built index.html —', html.length.toLocaleString(), 'bytes');

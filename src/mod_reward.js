window.ModReward = {
  css: `
.rw-wrap{padding-bottom:100px;--rw-gold:#FFC93C;--rw-silver:#C9CDDB;--rw-bronze:#D8A868;}

.rw-wallet{margin:18px 18px 16px;padding:20px 22px;border-radius:var(--r-xl);
  background:linear-gradient(135deg,var(--indigo) 0%,var(--indigo-d) 100%);color:#fff;box-shadow:var(--sh-2);}
.rw-wallet-top{display:flex;align-items:center;gap:8px;}
.rw-coin-ico{font-size:28px;}
.rw-coin-num{font-size:38px;font-weight:800;letter-spacing:-.5px;}
.rw-coin-label{font-size:14px;font-weight:700;opacity:.85;margin-left:2px;}
.rw-wallet-sub{display:flex;gap:16px;margin-top:6px;font-size:13px;font-weight:600;opacity:.9;}
.rw-wallet-sub b{font-weight:800;}
.rw-goal-row{margin-top:14px;}
.rw-goal-bar{height:10px;border-radius:99px;background:rgba(255,255,255,.25);overflow:hidden;}
.rw-goal-fill{height:100%;border-radius:99px;background:var(--orange);transition:width .4s cubic-bezier(.22,1,.36,1);}
.rw-goal-text{margin-top:6px;font-size:12px;font-weight:700;opacity:.9;}

.rw-benefit-card{margin:0 18px 16px;padding:20px;border-radius:var(--r-xl);background:var(--paper);
  box-shadow:var(--sh-1);border:1px solid var(--line);}
.rw-benefit-badge{display:inline-block;padding:6px 12px;border-radius:99px;background:var(--orange-s);
  color:var(--orange);font-size:12px;font-weight:800;}
.rw-benefit-body{display:flex;align-items:center;gap:12px;margin-top:14px;}
.rw-benefit-emoji{font-size:36px;flex:none;}
.rw-benefit-text{font-size:19px;font-weight:800;color:var(--ink);line-height:1.35;}
.rw-benefit-cost{margin-top:12px;font-size:14px;font-weight:700;color:var(--ink2);}
.rw-benefit-cost b{color:var(--orange);}
.rw-benefit-note{margin-top:4px;font-size:12px;color:var(--muted);font-weight:600;}

.rw-game{margin:0 18px 16px;padding:20px;border-radius:var(--r-xl);background:var(--paper);
  box-shadow:var(--sh-1);border:1px solid var(--line);}
.rw-game-title{font-size:16px;font-weight:800;color:var(--ink);margin-bottom:4px;}
.rw-game-desc{font-size:13px;color:var(--ink2);margin-bottom:16px;font-weight:600;line-height:1.4;}

.rw-gamechips{display:flex;flex-wrap:nowrap;gap:7px;margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px;}
.rw-gamechips > *{flex:0 0 auto;white-space:nowrap;}
.rw-gamechips::-webkit-scrollbar{display:none;}
.rw-gamechip{flex:none;padding:10px 14px;border-radius:999px;border:1.5px solid var(--line);
  background:var(--paper);font-size:13px;font-weight:800;color:var(--ink2);cursor:pointer;min-height:44px;
  white-space:nowrap;transition:all .15s cubic-bezier(.22,1,.36,1);}
.rw-gamechip.on{border-color:var(--orange);background:var(--orange-s);color:var(--orange);}

.rw-track{position:relative;height:56px;border-radius:16px;overflow:hidden;
  --rw-gold:#FFC93C;--rw-silver:#C9CDDB;--rw-bronze:#D8A868;
  background:linear-gradient(to right,
    var(--rw-bronze) 0%, var(--rw-bronze) 31%,
    var(--rw-silver) 31%, var(--rw-silver) 46%,
    var(--rw-gold) 46%, var(--rw-gold) 54%,
    var(--rw-silver) 54%, var(--rw-silver) 69%,
    var(--rw-bronze) 69%, var(--rw-bronze) 100%);}
.rw-marker{position:absolute;top:-6px;width:8px;height:68px;border-radius:4px;background:var(--ink);
  box-shadow:0 0 0 3px #fff,0 2px 6px rgba(0,0,0,.3);transform:translateX(-50%);}
.rw-track-labels{display:flex;justify-content:space-between;margin-top:6px;font-size:13px;font-weight:700;color:var(--muted);}

.rw-play-btn{width:100%;margin-top:18px;padding:16px;border:none;border-radius:var(--r-l);
  background:var(--orange);color:#fff;font-size:16px;font-weight:800;min-height:56px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-play-btn:active{transform:scale(.97);}
.rw-play-btn:disabled{background:var(--line);color:var(--muted);cursor:not-allowed;}
.rw-play-btn.stop{background:var(--indigo);}
.rw-play-hint{margin-top:8px;text-align:center;font-size:12px;color:var(--muted);font-weight:700;}

.rw-result{margin-top:18px;padding:22px;border-radius:var(--r-l);text-align:center;position:relative;
  overflow:hidden;animation:rwPop .4s cubic-bezier(.22,1,.36,1);}
.rw-result.gold{background:linear-gradient(135deg,#FFF3D0,#FFE29A);}
.rw-result.silver{background:linear-gradient(135deg,#F1F2F7,#DEE1EC);}
.rw-result.bronze{background:linear-gradient(135deg,#FBEAD9,#F0D2AE);}
.rw-result-medal{font-size:44px;}
.rw-result-tier{font-size:14px;font-weight:800;margin-top:4px;color:var(--ink2);}
.rw-result-benefit{font-size:18px;font-weight:800;color:var(--ink);margin-top:10px;line-height:1.4;}
.rw-confetti{position:absolute;inset:0;pointer-events:none;}
.rw-confetti span{position:absolute;top:-20px;font-size:18px;animation:rwFall 1.1s ease-in forwards;}
@keyframes rwFall{to{transform:translateY(160px) rotate(360deg);opacity:0;}}
@keyframes rwPop{0%{transform:scale(.85);opacity:0;}100%{transform:scale(1);opacity:1;}}

.rw-retry-btn{margin-top:16px;width:100%;padding:14px;border:none;border-radius:var(--r-l);
  background:var(--indigo);color:#fff;font-weight:800;font-size:15px;min-height:48px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-retry-btn:active{transform:scale(.97);}
.rw-retry-btn:disabled{background:var(--line);color:var(--muted);cursor:not-allowed;}

.rw-real-btn{width:100%;margin-top:4px;padding:18px;border:none;border-radius:var(--r-l);
  background:var(--orange);color:#fff;font-size:17px;font-weight:800;min-height:56px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-real-btn:active{transform:scale(.97);}
.rw-real-btn:disabled{background:var(--line);color:var(--muted);cursor:not-allowed;}

.rw-celebrate{margin-top:16px;text-align:center;padding:18px;border-radius:var(--r-l);
  background:var(--orange-s);animation:rwPop .4s cubic-bezier(.22,1,.36,1);}
.rw-celebrate .rw-cel-emoji{font-size:40px;}
.rw-celebrate .rw-cel-text{margin-top:6px;font-weight:800;color:var(--ink);}

.rw-master{}
.rw-child-note{margin:0 18px 16px;padding:20px;border-radius:var(--r-l);background:var(--indigo-s);
  text-align:center;font-size:14px;font-weight:700;color:var(--indigo-d);}

.rw-seg{display:flex;gap:8px;margin-top:6px;}
.rw-seg-btn{flex:1;padding:12px 8px;border-radius:var(--r-m);border:1.5px solid var(--line);
  background:var(--paper);font-size:13px;font-weight:800;color:var(--ink2);cursor:pointer;min-height:44px;
  transition:all .15s cubic-bezier(.22,1,.36,1);}
.rw-seg-btn.on{border-color:var(--indigo);background:var(--indigo-s);color:var(--indigo-d);}
.rw-tier-fields{margin-top:4px;}
.rw-tier-fields.hidden{display:none;}

.rw-gamepick-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;}
.rw-gamepick-btn{flex:1 1 42%;padding:10px 8px;border-radius:var(--r-m);border:1.5px solid var(--line);
  background:var(--paper);font-size:12.5px;font-weight:800;color:var(--ink2);cursor:pointer;min-height:44px;
  transition:all .15s cubic-bezier(.22,1,.36,1);}
.rw-gamepick-btn.on{border-color:var(--indigo);background:var(--indigo-s);color:var(--indigo-d);}
.rw-gamepick-btn:disabled{opacity:.45;cursor:not-allowed;}

.rw-hist-item{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid var(--line);}
.rw-hist-item:last-child{border-bottom:none;}
.rw-hist-medal{font-size:22px;width:30px;text-align:center;flex:none;}
.rw-hist-body{flex:1;min-width:0;}
.rw-hist-benefit{font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rw-hist-date{font-size:11px;color:var(--muted);font-weight:600;margin-top:2px;}
.rw-hist-right{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
.rw-hist-cost{font-size:12px;font-weight:800;color:var(--orange);white-space:nowrap;flex:none;}
.rw-hist-badge{font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:8px;white-space:nowrap;}
.rw-hist-badge.claimed{background:rgba(63,191,127,.16);color:#2E8B57;}
.rw-hist-badge.waiting{background:var(--orange-s);color:var(--orange);}
.rw-hist-badge.requested{background:var(--indigo-s);color:var(--indigo-d);}
#phone.th-dark .rw-hist-badge.claimed{background:rgba(63,191,127,.22);color:#7CE7AC;}

/* ---- 실물 보상 수령 확인 ---- */
.rw-claim-banner{
  margin:0 18px 16px;padding:16px 18px;border-radius:var(--r-l);
  background:var(--orange-s);border:1.6px solid var(--orange);
  display:flex;align-items:center;gap:12px;
  animation:rwClaimPulse 1.8s ease-in-out infinite;
}
.rw-claim-banner.requested{animation:none;border-color:var(--line);background:var(--paper);}
@keyframes rwClaimPulse{
  0%,100%{box-shadow:0 0 0 0 rgba(255,90,0,.28);}
  50%{box-shadow:0 0 0 9px rgba(255,90,0,0);}
}
.rw-claim-emoji{font-size:30px;flex:none;animation:rwClaimBounce 1.8s ease-in-out infinite;}
.rw-claim-banner.requested .rw-claim-emoji{animation:none;}
@keyframes rwClaimBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
.rw-claim-text{flex:1;min-width:0;}
.rw-claim-title{font-size:14.5px;font-weight:800;color:var(--ink);}
.rw-claim-sub{font-size:12px;font-weight:700;color:var(--ink2);margin-top:2px;}
.rw-claim-btn{flex:none;padding:12px 14px;border:none;border-radius:var(--r-m);
  background:var(--orange);color:#fff;font-weight:800;font-size:13px;min-height:44px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-claim-btn:active{transform:scale(.95);}
.rw-claim-btn:disabled{background:var(--line);color:var(--muted);cursor:default;}

.rw-parent-claims{}
.rw-claim-card{
  position:relative;margin:0 0 12px;padding:16px;border-radius:var(--r-l);background:var(--paper);
  box-shadow:var(--sh-1);border:1px solid var(--line);overflow:hidden;
  transition:opacity .3s cubic-bezier(.22,1,.36,1), max-height .3s cubic-bezier(.22,1,.36,1);
}
.rw-claim-card-top{display:flex;gap:10px;align-items:center;}
.rw-claim-card-medal{font-size:26px;flex:none;}
.rw-claim-card-body{flex:1;min-width:0;}
.rw-claim-card-benefit{font-size:14px;font-weight:800;color:var(--ink);}
.rw-claim-card-date{font-size:11.5px;font-weight:700;color:var(--muted);margin-top:2px;}
.rw-claim-card-btns{display:flex;gap:8px;margin-top:12px;}
.rw-claim-later-btn{flex:0 0 84px;padding:12px;border-radius:var(--r-m);border:1.5px solid var(--line);
  background:var(--paper);color:var(--ink2);font-weight:800;font-size:13px;min-height:44px;cursor:pointer;}
.rw-claim-done-btn{flex:1;padding:12px;border:none;border-radius:var(--r-m);
  background:var(--orange);color:#fff;font-weight:800;font-size:13px;min-height:44px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-claim-done-btn:active{transform:scale(.96);}
.rw-claim-check-overlay{
  position:absolute;inset:0;z-index:5;display:none;align-items:center;justify-content:center;
  background:rgba(255,255,255,.94);
}
#phone.th-dark .rw-claim-check-overlay{background:rgba(28,28,36,.94);}
.rw-claim-check-overlay.show{display:flex;}
.rw-check-svg{width:64px;height:64px;}
.rw-check-circle{fill:none;stroke:var(--orange);stroke-width:4;stroke-dasharray:100;stroke-dashoffset:100;
  animation:rwCheckCircle .35s ease-out forwards;}
.rw-check-path{fill:none;stroke:var(--orange);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:100;stroke-dashoffset:100;animation:rwCheckPath .3s ease-out .32s forwards;}
@keyframes rwCheckCircle{to{stroke-dashoffset:0;}}
@keyframes rwCheckPath{to{stroke-dashoffset:0;}}
.rw-claim-card--done{opacity:.55;}

/* ---- 랜덤 뽑기 (가챠 캡슐) ---- */
.rw-gacha-row{display:flex;justify-content:center;align-items:flex-end;gap:14px;padding:22px 4px 10px;min-height:140px;flex-wrap:wrap;}
.rw-capsule{width:54px;height:54px;border-radius:50%;position:relative;cursor:pointer;flex:none;
  background:linear-gradient(180deg,#fff 0 50%,var(--indigo) 50% 100%);
  box-shadow:0 3px 8px rgba(0,0,0,.18), inset 0 -2px 0 rgba(0,0,0,.08);
  border:2px solid #fff;outline:2px solid var(--line);
  animation:rwCapIdle 1.5s ease-in-out infinite;}
.rw-capsule:nth-child(2n){animation-delay:.12s;background:linear-gradient(180deg,#fff 0 50%,var(--orange) 50% 100%);}
.rw-capsule:nth-child(3n){animation-delay:.24s;background:linear-gradient(180deg,#fff 0 50%,#3FBF6F 50% 100%);}
.rw-capsule:nth-child(4n){animation-delay:.36s;}
.rw-capsule:nth-child(5n){animation-delay:.48s;background:linear-gradient(180deg,#fff 0 50%,#E85D8B 50% 100%);}
.rw-capsule:active{transform:scale(.92);}
@keyframes rwCapIdle{0%,100%{transform:rotate(-6deg) translateY(0);}50%{transform:rotate(6deg) translateY(-4px);}}
.rw-gacha-hint{text-align:center;font-size:13px;font-weight:700;color:var(--ink2);margin-top:4px;}

.rw-gacha-stage{position:relative;min-height:200px;display:flex;align-items:center;justify-content:center;padding:20px 0;}
.rw-cap-big{position:relative;width:92px;height:92px;}
.rw-cap-big .rw-cap-top,.rw-cap-big .rw-cap-bottom{position:absolute;left:0;width:100%;height:50%;overflow:hidden;
  box-shadow:0 4px 10px rgba(0,0,0,.15);}
.rw-cap-big .rw-cap-top{top:0;border-radius:46px 46px 0 0;background:linear-gradient(180deg,#fff,#F1F1F6);
  animation:rwCapPop .35s ease-out both, rwCapShake .55s ease-in-out .35s, rwCapTopOpen .5s ease-in .95s forwards;}
.rw-cap-big .rw-cap-bottom{bottom:0;border-radius:0 0 46px 46px;background:linear-gradient(180deg,var(--indigo),var(--indigo-d));
  animation:rwCapPop .35s ease-out both, rwCapShake .55s ease-in-out .35s, rwCapBotOpen .5s ease-in .95s forwards;}
.rw-cap-light{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;
  background:radial-gradient(circle,#fff 0%,rgba(255,255,255,0) 72%);
  transform:translate(-50%,-50%) scale(0);opacity:0;
  animation:rwCapLight .6s ease-out 1.05s forwards;}
@keyframes rwCapPop{0%{transform:scale(.5);opacity:0;}100%{transform:scale(1);opacity:1;}}
@keyframes rwCapShake{0%,100%{transform:rotate(0);}25%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}75%{transform:rotate(-5deg);}}
@keyframes rwCapTopOpen{to{transform:translateY(-44px) rotate(-24deg);opacity:0;}}
@keyframes rwCapBotOpen{to{transform:translateY(44px) rotate(24deg);opacity:0;}}
@keyframes rwCapLight{0%{transform:translate(-50%,-50%) scale(0);opacity:0;}55%{opacity:1;}100%{transform:translate(-50%,-50%) scale(20);opacity:0;}}

/* ---- 사다리타기 ---- */
.rw-ladder-wrap{padding:4px 2px 2px;}
.rw-ladder-tops,.rw-ladder-bottoms{display:grid;gap:6px;}
.rw-ladder-top-btn{padding:10px 4px;border-radius:12px;border:1.5px solid var(--indigo);background:var(--indigo-s);
  color:var(--indigo-d);font-weight:800;font-size:13px;cursor:pointer;min-height:44px;
  transition:all .15s cubic-bezier(.22,1,.36,1);}
.rw-ladder-top-btn:disabled{opacity:.4;cursor:default;}
.rw-ladder-top-btn.chosen{background:var(--orange);border-color:var(--orange);color:#fff;}
.rw-ladder-svg{width:100%;display:block;height:180px;margin:4px 0;}
.rw-ladder-bottom-box{padding:10px 4px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);
  text-align:center;font-size:19px;font-weight:800;color:var(--muted);min-height:44px;
  display:flex;align-items:center;justify-content:center;}

/* ---- 룰렛 ---- */
.rw-roulette-stage{position:relative;display:flex;flex-direction:column;align-items:center;padding:14px 0 4px;}
.rw-roulette-pointer{width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;
  border-top:16px solid var(--ink);margin-bottom:-4px;position:relative;z-index:2;
  filter:drop-shadow(0 1px 1px rgba(0,0,0,.25));}
.rw-wheel{width:216px;height:216px;border-radius:50%;position:relative;border:6px solid #fff;
  box-shadow:0 4px 16px rgba(0,0,0,.2), inset 0 0 0 2px var(--line);
  transition:transform 4s cubic-bezier(.15,.9,.25,1);}
.rw-wheel-hub{position:absolute;left:50%;top:50%;width:34px;height:34px;border-radius:50%;background:#fff;
  transform:translate(-50%,-50%);box-shadow:0 2px 6px rgba(0,0,0,.25);
  display:flex;align-items:center;justify-content:center;font-size:16px;}
.rw-spin-btn{width:100%;margin-top:18px;padding:16px;border:none;border-radius:var(--r-l);
  background:var(--orange);color:#fff;font-size:16px;font-weight:800;min-height:56px;cursor:pointer;
  transition:transform .15s cubic-bezier(.22,1,.36,1);}
.rw-spin-btn:active{transform:scale(.97);}
.rw-spin-btn:disabled{background:var(--line);color:var(--muted);cursor:not-allowed;}
`,

  render(root) {
    // 진행 중이던 애니메이션/타이머 정리 (멱등성 보장)
    if (ModReward._raf) { cancelAnimationFrame(ModReward._raf); ModReward._raf = null; }
    if (ModReward._celTimer) { clearTimeout(ModReward._celTimer); ModReward._celTimer = null; }
    if (ModReward._timers) { ModReward._timers.forEach(dispose => { try { dispose(); } catch (e) {} }); }
    ModReward._timers = [];
    if (!ModReward._dismissed) ModReward._dismissed = {};

    function addTimeout(fn, ms) {
      const id = setTimeout(fn, ms);
      ModReward._timers.push(() => clearTimeout(id));
      return id;
    }
    function addRaf(fn) {
      const id = requestAnimationFrame(fn);
      ModReward._timers.push(() => cancelAnimationFrame(id));
      return id;
    }

    // ---- 헬퍼 ----
    function escHtml(str) {
      return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function fmtDate() {
      const d = new Date();
      return (d.getMonth() + 1) + '.' + d.getDate();
    }

    function ensureDefaults() {
      const r = App.state.reward;
      let changed = false;
      if (!r.tiers) {
        r.tiers = {
          gold: r.realBenefit || '',
          silver: (r.realBenefit || '') + ' (조금 작게)',
          bronze: '아쉽지만 작은 응원 선물이에요 🍭'
        };
        changed = true;
      }
      if (!r.history) { r.history = []; changed = true; }
      // 실물 보상 수령 확인 필드 마이그레이션 (기존 기록은 claimed:false 로 채움)
      r.history.forEach(h => {
        if (!h.id) { h.id = uid(); changed = true; }
        if (typeof h.claimed !== 'boolean') { h.claimed = false; changed = true; }
        if (h.claimedAt === undefined) { h.claimedAt = null; changed = true; }
        if (typeof h.requested !== 'boolean') { h.requested = false; changed = true; }
      });
      if (changed) App.save();
    }

    const GAMES = {
      stop: { emoji: '🎯', label: '럭키 스톱' },
      gacha: { emoji: '🥚', label: '랜덤 뽑기' },
      ladder: { emoji: '🪜', label: '사다리타기' },
      roulette: { emoji: '🎡', label: '룰렛' }
    };
    const TIER_META = {
      gold: { medal: '🥇', label: '🥇 골드!' },
      silver: { medal: '🥈', label: '🥈 실버' },
      bronze: { medal: '🥉', label: '🥉 브론즈' }
    };
    const ROULETTE_LAYOUT = ['bronze', 'silver', 'bronze', 'gold', 'bronze', 'silver', 'bronze', 'bronze'];

    function ensureGameDefaults() {
      const r = App.state.reward;
      let changed = false;
      if (!r.game || !GAMES[r.game]) { r.game = 'stop'; changed = true; }
      if (typeof r.freePick !== 'boolean') { r.freePick = true; changed = true; }
      if (changed) App.save();
    }

    function weightedTier() {
      const roll = Math.random() * 100;
      if (roll < 10) return 'gold';
      if (roll < 40) return 'silver';
      return 'bronze';
    }

    function earnedStats() {
      const todos = App.state.todos || [];
      let today = 0, week = 0;
      todos.forEach(t => {
        if (t.done && App.canSee(t)) {
          week += (t.coin || 0);
          if (t.day === App.today) today += (t.coin || 0);
        }
      });
      return { today, week };
    }

    function animateCoinNum(el, from, to) {
      if (from === to) { el.textContent = to; return; }
      const dur = 600, start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * eased);
        if (p < 1) { ModReward._coinRaf = requestAnimationFrame(step); }
        else { el.textContent = to; ModReward._coinRaf = null; }
      }
      if (ModReward._coinRaf) cancelAnimationFrame(ModReward._coinRaf);
      ModReward._coinRaf = requestAnimationFrame(step);
    }

    ensureDefaults();
    ensureGameDefaults();

    // ---- 게임별 상태(모듈 전역, render 재호출에도 유지) ----
    function freshGameState(kind) {
      return {
        kind: kind,
        phase: 'idle',   // idle | playing | result
        tier: null,
        celebrate: false,
        stop: { pos: 50, dir: 1, lastTs: 0, playing: false },
        gacha: { capsules: [], pickedIdx: null, sub: 'choose' },
        ladder: { lanes: 0, rows: 7, rungs: [], tiers: [], startIdx: null, path: null, endCol: null, sub: 'pick' },
        roulette: { rotation: 0, targetTier: null }
      };
    }

    if (!ModReward._game || ModReward._game.kind !== App.state.reward.game) {
      ModReward._game = freshGameState(App.state.reward.game);
    }
    const g = ModReward._game;

    // ---- 럭키 스톱 루프 ----
    function loop(ts) {
      const s = g.stop;
      if (!s.playing) return;
      if (!s.lastTs) s.lastTs = ts;
      const dt = ts - s.lastTs;
      s.lastTs = ts;
      const speed = 0.078; // %/ms
      s.pos += s.dir * speed * dt;
      if (s.pos >= 100) { s.pos = 100; s.dir = -1; }
      else if (s.pos <= 0) { s.pos = 0; s.dir = 1; }
      const markerEl = root.querySelector('.rw-marker');
      if (markerEl) markerEl.style.left = s.pos + '%';
      ModReward._raf = requestAnimationFrame(loop);
    }
    function tierForPos(pos) {
      const d = Math.abs(pos - 50);
      if (d <= 4) return 'gold';
      if (d <= 19) return 'silver';
      return 'bronze';
    }

    // ---- 공통 액션 ----
    function chargeCoin() {
      const r = App.state.reward;
      if (App.state.coins < r.cost) return false;
      App.state.coins -= r.cost;
      App.save();
      App.haptic();
      return true;
    }

    function finalizeResult(tier) {
      g.tier = tier;
      g.phase = 'result';
      window.ModSound && ModSound.play(tier === 'gold' ? 'win' : 'lose');
      const r = App.state.reward;
      const benefitText = (r.tiers && r.tiers[tier]) || r.realBenefit;
      r.history = r.history || [];
      r.history.unshift({ id: uid(), date: fmtDate(), tier, benefit: benefitText, cost: r.cost, claimed: false, claimedAt: null, requested: false });
      App.save();
      App.haptic();
      paint();
    }

    function resultBlockHTML(tier) {
      const r = App.state.reward;
      const benefit = (r.tiers && r.tiers[tier]) || r.realBenefit;
      const meta = TIER_META[tier];
      const confettiCount = tier === 'gold' ? 18 : tier === 'silver' ? 8 : 0;
      const emos = ['🎉', '✨', '🎊', '⭐'];
      let confetti = '';
      for (let i = 0; i < confettiCount; i++) {
        const left = Math.round(Math.random() * 90) + 5;
        const delay = (Math.random() * 0.4).toFixed(2);
        confetti += `<span style="left:${left}%;animation-delay:${delay}s">${emos[i % emos.length]}</span>`;
      }
      return `
      <div class="rw-result ${tier}">
        <div class="rw-confetti">${confetti}</div>
        <div class="rw-result-medal">${meta.medal}</div>
        <div class="rw-result-tier">${meta.label}</div>
        <div class="rw-result-benefit">${escHtml(benefit)}</div>
      </div>`;
    }

    function retryButtonHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      return `
      <button class="rw-retry-btn" id="rwRetryBtn" ${enough ? '' : 'disabled'}>${enough ? `다시 도전하기 (-${r.cost} 🪙)` : '코인이 부족해요'}</button>
      ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}`;
    }

    // ---- 1) 럭키 스톱 ----
    function startStop() {
      if (!chargeCoin()) return;
      window.ModSound && ModSound.play('spin');
      const s = g.stop;
      s.pos = 50; s.dir = 1; s.lastTs = 0; s.playing = true;
      g.phase = 'playing'; g.tier = null;
      paint();
    }
    function stopStop() {
      const s = g.stop;
      if (!s.playing) return;
      if (ModReward._raf) { cancelAnimationFrame(ModReward._raf); ModReward._raf = null; }
      s.playing = false;
      finalizeResult(tierForPos(s.pos));
    }
    function trackHTML(pos) {
      return `<div class="rw-track"><div class="rw-marker" style="left:${pos}%"></div></div>
      <div class="rw-track-labels"><span>🥉</span><span>🥈</span><span>🥇</span><span>🥈</span><span>🥉</span></div>`;
    }
    function stopSectionHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      if (g.phase === 'playing') {
        return `
        <div class="rw-game-title">럭키 스톱</div>
        <div class="rw-game-desc">마커가 골드 구역에 멈추면 최고의 보상을 받아요!</div>
        ${trackHTML(g.stop.pos)}
        <button class="rw-play-btn stop" id="rwStopBtn">STOP! ✋</button>`;
      }
      if (g.phase === 'result') {
        return `
        <div class="rw-game-title">럭키 스톱 결과</div>
        ${trackHTML(g.stop.pos)}
        ${resultBlockHTML(g.tier)}
        ${retryButtonHTML()}`;
      }
      return `
      <div class="rw-game-title">럭키 스톱</div>
      <div class="rw-game-desc">마커가 좌우로 움직여요. 딱 맞는 순간 STOP을 눌러보세요!</div>
      ${trackHTML(50)}
      <button class="rw-play-btn" id="rwPlayBtn" ${enough ? '' : 'disabled'}>${enough ? `플레이하기 (-${r.cost} 🪙)` : '코인이 부족해요'}</button>
      ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}`;
    }

    // ---- 2) 랜덤 뽑기 (가챠 캡슐) ----
    function startGacha() {
      if (!chargeCoin()) return;
      window.ModSound && ModSound.play('spin');
      const ga = g.gacha;
      const count = 3 + Math.floor(Math.random() * 3); // 3~5
      ga.capsules = Array.from({ length: count }, (_, i) => ({ id: i, tier: weightedTier() }));
      ga.pickedIdx = null;
      ga.sub = 'choose';
      g.phase = 'playing'; g.tier = null;
      paint();
    }
    function pickCapsule(idx) {
      const ga = g.gacha;
      if (ga.sub !== 'choose') return;
      ga.pickedIdx = idx;
      ga.sub = 'opening';
      App.haptic();
      paint();
      addTimeout(() => { finalizeResult(ga.capsules[idx].tier); }, 1750);
    }
    function gachaSectionHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      const ga = g.gacha;
      if (g.phase === 'playing' && ga.sub === 'choose') {
        const row = ga.capsules.map((c, i) => `<div class="rw-capsule" data-idx="${i}"></div>`).join('');
        return `
        <div class="rw-game-title">랜덤 뽑기</div>
        <div class="rw-game-desc">캡슐 하나를 골라 탭 해보세요!</div>
        <div class="rw-gacha-row">${row}</div>
        <div class="rw-gacha-hint">마음에 드는 캡슐을 골라주세요 👆</div>`;
      }
      if (g.phase === 'playing' && ga.sub === 'opening') {
        return `
        <div class="rw-game-title">랜덤 뽑기</div>
        <div class="rw-gacha-stage">
          <div class="rw-cap-big">
            <div class="rw-cap-top"></div>
            <div class="rw-cap-light"></div>
            <div class="rw-cap-bottom"></div>
          </div>
        </div>
        <div class="rw-gacha-hint">캡슐이 열리고 있어요...</div>`;
      }
      if (g.phase === 'result') {
        return `
        <div class="rw-game-title">랜덤 뽑기 결과</div>
        ${resultBlockHTML(g.tier)}
        ${retryButtonHTML()}`;
      }
      return `
      <div class="rw-game-title">랜덤 뽑기</div>
      <div class="rw-game-desc">캡슐 머신 속 캡슐 중 하나를 골라보세요!</div>
      <button class="rw-play-btn" id="rwPlayBtn" ${enough ? '' : 'disabled'}>${enough ? `플레이하기 (-${r.cost} 🪙)` : '코인이 부족해요'}</button>
      ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}`;
    }

    // ---- 3) 사다리타기 ----
    function laneX(i, lanes) { return (i + 0.5) * (100 / lanes); }
    function generateRungs(lanes, rows) {
      const rungs = [];
      for (let r = 0; r < rows; r++) {
        const row = new Array(lanes - 1).fill(false);
        for (let i = 0; i < lanes - 1; i++) {
          if (row[i - 1]) continue;
          if (Math.random() < 0.45) row[i] = true;
        }
        rungs.push(row);
      }
      return rungs;
    }
    function computeLadderPath(rungs, lanes, rows, startCol, rowH) {
      let col = startCol;
      const pts = [{ x: laneX(col, lanes), y: 10 }];
      for (let r = 0; r < rows; r++) {
        const row = rungs[r];
        const yMid = 10 + (r + 0.5) * rowH;
        const yBot = 10 + (r + 1) * rowH;
        pts.push({ x: laneX(col, lanes), y: yMid });
        if (col > 0 && row[col - 1]) { col -= 1; pts.push({ x: laneX(col, lanes), y: yMid }); }
        else if (col < lanes - 1 && row[col]) { col += 1; pts.push({ x: laneX(col, lanes), y: yMid }); }
        pts.push({ x: laneX(col, lanes), y: yBot });
      }
      return { pts, endCol: col };
    }
    function pathLength(pts) {
      let len = 0;
      for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      }
      return len;
    }
    function startLadder() {
      if (!chargeCoin()) return;
      window.ModSound && ModSound.play('spin');
      const la = g.ladder;
      la.lanes = 3 + Math.floor(Math.random() * 2); // 3~4
      la.rows = 7;
      la.rungs = generateRungs(la.lanes, la.rows);
      la.tiers = Array.from({ length: la.lanes }, () => weightedTier());
      la.startIdx = null;
      la.path = null;
      la.endCol = null;
      la.sub = 'pick';
      g.phase = 'playing'; g.tier = null;
      paint();
    }
    function pickLadderStart(idx) {
      const la = g.ladder;
      if (la.sub !== 'pick') return;
      const rowH = 140 / la.rows;
      const { pts, endCol } = computeLadderPath(la.rungs, la.lanes, la.rows, idx, rowH);
      la.startIdx = idx;
      la.path = pts;
      la.endCol = endCol;
      la.sub = 'drawing';
      App.haptic();
      paint();

      const pathEl = root.querySelector('#rwLadderPath');
      if (pathEl) {
        const len = pathLength(pts) || 1;
        pathEl.style.strokeDasharray = String(len);
        pathEl.style.strokeDashoffset = String(len);
        addRaf(() => {
          addRaf(() => {
            pathEl.style.transition = 'stroke-dashoffset 1.6s linear';
            pathEl.style.strokeDashoffset = '0';
          });
        });
      }
      addTimeout(() => { finalizeResult(la.tiers[endCol]); }, 1750);
    }
    function ladderSectionHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      const la = g.ladder;
      if (g.phase === 'playing') {
        const lanes = la.lanes;
        const tops = Array.from({ length: lanes }, (_, i) =>
          `<button class="rw-ladder-top-btn ${la.startIdx === i ? 'chosen' : ''}" data-start="${i}" ${la.sub !== 'pick' ? 'disabled' : ''}>${i + 1}</button>`
        ).join('');
        const rowH = 140 / la.rows;
        let lines = '';
        for (let i = 0; i < lanes; i++) {
          const x = laneX(i, lanes);
          lines += `<line x1="${x}" y1="10" x2="${x}" y2="150" stroke="#C9C9D6" stroke-width="2.4" stroke-linecap="round"/>`;
        }
        for (let rr = 0; rr < la.rows; rr++) {
          const yMid = 10 + (rr + 0.5) * rowH;
          la.rungs[rr].forEach((on, i) => {
            if (on) lines += `<line x1="${laneX(i, lanes)}" y1="${yMid}" x2="${laneX(i + 1, lanes)}" y2="${yMid}" stroke="#C9C9D6" stroke-width="2.4" stroke-linecap="round"/>`;
          });
        }
        let pathSvg = '';
        if (la.path) {
          const d = 'M ' + la.path.map(p => `${p.x},${p.y}`).join(' L ');
          pathSvg = `<path id="rwLadderPath" d="${d}" fill="none" stroke="var(--orange)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        const bottoms = Array.from({ length: lanes }, () => `<div class="rw-ladder-bottom-box">❓</div>`).join('');
        const descText = la.sub === 'pick' ? '출발점 하나를 골라보세요!' : '경로를 따라 내려가는 중...';
        return `
        <div class="rw-game-title">사다리타기</div>
        <div class="rw-game-desc">${descText}</div>
        <div class="rw-ladder-wrap">
          <div class="rw-ladder-tops" style="grid-template-columns:repeat(${lanes},1fr)">${tops}</div>
          <svg class="rw-ladder-svg" viewBox="0 0 100 160" preserveAspectRatio="none">${lines}${pathSvg}</svg>
          <div class="rw-ladder-bottoms" style="grid-template-columns:repeat(${lanes},1fr)">${bottoms}</div>
        </div>`;
      }
      if (g.phase === 'result') {
        return `
        <div class="rw-game-title">사다리타기 결과</div>
        ${resultBlockHTML(g.tier)}
        ${retryButtonHTML()}`;
      }
      return `
      <div class="rw-game-title">사다리타기</div>
      <div class="rw-game-desc">사다리를 타고 내려가면 결과가 나와요!</div>
      <button class="rw-play-btn" id="rwPlayBtn" ${enough ? '' : 'disabled'}>${enough ? `플레이하기 (-${r.cost} 🪙)` : '코인이 부족해요'}</button>
      ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}`;
    }

    // ---- 4) 룰렛 ----
    function rouletteGradient() {
      const colorVar = { gold: 'var(--rw-gold)', silver: 'var(--rw-silver)', bronze: 'var(--rw-bronze)' };
      const stops = ROULETTE_LAYOUT.map((t, i) => `${colorVar[t]} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ');
      return `conic-gradient(from 0deg, ${stops})`;
    }
    function startRoulette() {
      if (!chargeCoin()) return;
      window.ModSound && ModSound.play('spin');
      const ro = g.roulette;
      const idx = Math.floor(Math.random() * 8);
      const tier = ROULETTE_LAYOUT[idx];
      const jitter = (Math.random() * 20 - 10); // 슬라이스 중심에서 ±10도
      const land = idx * 45 + 22.5 + jitter;
      const spins = 6 + Math.floor(Math.random() * 2); // 6~7바퀴 (항상 5바퀴 이상)
      const rotation = spins * 360 - land;
      ro.rotation = rotation;
      ro.targetTier = tier;
      g.phase = 'playing'; g.tier = null;
      paint();

      const wheelEl = root.querySelector('#rwWheel');
      if (wheelEl) {
        wheelEl.style.transition = 'none';
        wheelEl.style.transform = 'rotate(0deg)';
        addRaf(() => {
          addRaf(() => {
            wheelEl.style.transition = 'transform 4s cubic-bezier(.15,.9,.25,1)';
            wheelEl.style.transform = `rotate(${rotation}deg)`;
          });
        });
      }
      addTimeout(() => { finalizeResult(tier); }, 4200);
    }
    function rouletteSectionHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      if (g.phase === 'playing') {
        return `
        <div class="rw-game-title">룰렛</div>
        <div class="rw-game-desc">룰렛이 돌아가고 있어요...</div>
        <div class="rw-roulette-stage">
          <div class="rw-roulette-pointer"></div>
          <div class="rw-wheel" id="rwWheel" style="background:${rouletteGradient()};transform:rotate(0deg)"><div class="rw-wheel-hub">🎡</div></div>
        </div>`;
      }
      if (g.phase === 'result') {
        return `
        <div class="rw-game-title">룰렛 결과</div>
        ${resultBlockHTML(g.tier)}
        ${retryButtonHTML()}`;
      }
      return `
      <div class="rw-game-title">룰렛</div>
      <div class="rw-game-desc">SPIN을 누르면 룰렛이 돌아가요!</div>
      <div class="rw-roulette-stage">
        <div class="rw-roulette-pointer"></div>
        <div class="rw-wheel" style="background:${rouletteGradient()}"><div class="rw-wheel-hub">🎡</div></div>
      </div>
      <button class="rw-spin-btn" id="rwPlayBtn" ${enough ? '' : 'disabled'}>${enough ? `SPIN! 🎯 (-${r.cost} 🪙)` : '코인이 부족해요'}</button>
      ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}`;
    }

    // ---- 게임 선택 칩 + 디스패치 ----
    function gameChipsHTML() {
      const r = App.state.reward;
      if (!r.freePick) return '';
      return `<div class="rw-gamechips">${Object.keys(GAMES).map(k =>
        `<button class="rw-gamechip ${k === r.game ? 'on' : ''}" data-game="${k}">${GAMES[k].emoji} ${GAMES[k].label}</button>`
      ).join('')}</div>`;
    }
    function gameSectionHTML() {
      const r = App.state.reward;
      if (r.game === 'gacha') return gachaSectionHTML();
      if (r.game === 'ladder') return ladderSectionHTML();
      if (r.game === 'roulette') return rouletteSectionHTML();
      return stopSectionHTML();
    }
    function switchGame(newKind) {
      const r = App.state.reward;
      if (!r.freePick || !GAMES[newKind] || r.game === newKind) return;
      // 진행 중이던 게임 상태는 초기화. 이미 차감된 코인은 환불하지 않음(아직 시작 전이면 애초에 차감이 없었음).
      r.game = newKind;
      App.save();
      // g(=ModReward._game)는 이 render() 클로저 전체에서 const로 캡처돼 있으므로
      // 참조 자체를 바꾸지 않고 내용만 초기화해 동기화가 깨지지 않게 한다.
      Object.assign(g, freshGameState(newKind));
      paint();
    }

    // ---- 보상 바로 받기 ----
    function receiveReal() {
      const r = App.state.reward;
      if (App.state.coins < r.cost) return;
      App.state.coins -= r.cost;
      r.history = r.history || [];
      r.history.unshift({ id: uid(), date: fmtDate(), tier: 'real', benefit: r.realBenefit, cost: r.cost, claimed: false, claimedAt: null, requested: false });
      App.save();
      App.haptic();
      App.toast('축하해요! 보상을 받았어요 🎉');
      g.celebrate = true;
      paint();
      ModReward._celTimer = setTimeout(() => { g.celebrate = false; paint(); }, 2200);
    }

    function openSettingsSheet() {
      const r = App.state.reward;
      const body = `
        <div class="field"><label>보상 내용</label><input class="inp" id="rwInpBenefit" value="${escHtml(r.realBenefit || '')}" placeholder="예: 주말 놀이공원 가기"></div>
        <div class="field"><label>필요 코인</label><input class="inp" type="number" min="1" id="rwInpCost" value="${r.cost || 0}"></div>
        <div class="field">
          <label>보상 받는 방법</label>
          <div class="rw-seg">
            <button type="button" class="rw-seg-btn ${r.mode === 'real' ? 'on' : ''}" data-mode="real">🎁 바로 받기</button>
            <button type="button" class="rw-seg-btn ${r.mode === 'game' ? 'on' : ''}" data-mode="game">🎲 미니게임으로 결정</button>
          </div>
        </div>
        <div class="rw-tier-fields ${r.mode === 'game' ? '' : 'hidden'}" id="rwTierFields">
          <div class="field"><label>🥇 골드 보상 문구</label><input class="inp" id="rwInpGold" value="${escHtml(r.tiers.gold || '')}"></div>
          <div class="field"><label>🥈 실버 보상 문구</label><input class="inp" id="rwInpSilver" value="${escHtml(r.tiers.silver || '')}"></div>
          <div class="field"><label>🥉 브론즈 보상 문구</label><input class="inp" id="rwInpBronze" value="${escHtml(r.tiers.bronze || '')}"></div>
          <div class="field">
            <label>아이가 할 게임</label>
            <div class="rw-gamepick-row" id="rwGamePick">
              ${Object.keys(GAMES).map(k => `<button type="button" class="rw-gamepick-btn ${k === r.game ? 'on' : ''}" data-game="${k}">${GAMES[k].emoji} ${GAMES[k].label}</button>`).join('')}
            </div>
          </div>
          <div class="panel" style="padding:4px 14px;margin-top:2px">
            <div class="toggle-row">
              <div><div class="tl">🙌 아이가 직접 고르게 하기</div><div class="td">켜면 아이 화면에 4가지 게임이 모두 보이고 아이가 골라요</div></div>
              <button type="button" class="sw-tog ${r.freePick ? 'on' : ''}" id="rwFreePickTog"></button>
            </div>
          </div>
        </div>
      `;
      const foot = `<button class="btn full" id="rwSaveBtn">저장하기</button>`;
      App.sheet('보상 설정하기', body, foot, (bodyEl, footEl) => {
        let mode = r.mode;
        let gamePick = r.game;
        let freePickVal = r.freePick;
        bodyEl.querySelectorAll('.rw-seg-btn').forEach(b => {
          b.addEventListener('click', () => {
            mode = b.dataset.mode;
            bodyEl.querySelectorAll('.rw-seg-btn').forEach(x => x.classList.remove('on'));
            b.classList.add('on');
            const tf = bodyEl.querySelector('#rwTierFields');
            if (tf) tf.classList.toggle('hidden', mode !== 'game');
          });
        });
        bodyEl.querySelectorAll('.rw-gamepick-btn').forEach(b => {
          b.addEventListener('click', () => {
            gamePick = b.dataset.game;
            bodyEl.querySelectorAll('.rw-gamepick-btn').forEach(x => x.classList.remove('on'));
            b.classList.add('on');
          });
        });
        const freePickBtn = bodyEl.querySelector('#rwFreePickTog');
        if (freePickBtn) {
          freePickBtn.addEventListener('click', () => {
            freePickVal = !freePickVal;
            freePickBtn.classList.toggle('on', freePickVal);
          });
        }
        const saveBtn = footEl.querySelector('#rwSaveBtn');
        saveBtn.addEventListener('click', () => {
          const benefit = bodyEl.querySelector('#rwInpBenefit').value.trim() || r.realBenefit;
          const cost = Math.max(1, parseInt(bodyEl.querySelector('#rwInpCost').value, 10) || r.cost);
          r.realBenefit = benefit;
          r.cost = cost;
          r.mode = mode;
          r.game = gamePick;
          r.freePick = freePickVal;
          if (mode === 'game') {
            r.tiers = {
              gold: bodyEl.querySelector('#rwInpGold').value.trim() || benefit,
              silver: bodyEl.querySelector('#rwInpSilver').value.trim() || (benefit + ' (조금 작게)'),
              bronze: bodyEl.querySelector('#rwInpBronze').value.trim() || '아쉽지만 작은 응원 선물이에요 🍭'
            };
          }
          App.save();
          App.render();
          App.closeSheet();
          App.toast('보상이 저장됐어요!');
        });
      });
    }

    function realSectionHTML() {
      const r = App.state.reward;
      const enough = App.state.coins >= r.cost;
      return `
      <div class="rw-game">
        <div class="rw-game-title">보상 받기</div>
        <div class="rw-game-desc">코인을 다 모으면 바로 받을 수 있어요!</div>
        <button class="rw-real-btn" id="rwRealBtn" ${enough ? '' : 'disabled'}>${enough ? '보상 받기 🎁' : '코인을 더 모아주세요'}</button>
        ${!enough ? `<div class="rw-play-hint">할 일을 더 완료해야 해요</div>` : ''}
        ${g.celebrate ? `<div class="rw-celebrate"><div class="rw-cel-emoji">🎉</div><div class="rw-cel-text">축하해요! 보상을 받았어요</div></div>` : ''}
      </div>`;
    }

    // ---- 실물 보상 수령 확인 ----
    function unclaimedList() {
      return (App.state.reward.history || []).filter(h => !h.claimed);
    }

    function historyBadge(h) {
      if (h.claimed) return `<span class="rw-hist-badge claimed">받았어요</span>`;
      if (h.requested) return `<span class="rw-hist-badge requested">확인 요청</span>`;
      return `<span class="rw-hist-badge waiting">기다리는 중</span>`;
    }

    // 아이 화면: 미수령 보상이 있으면 눈에 띄는 배너를 보여주고, "부모님께 보여주기"만 누르게 함
    function childClaimBannerHTML() {
      const list = unclaimedList();
      if (!list.length) return '';
      const allRequested = list.every(h => h.requested);
      return `
      <div class="rw-claim-banner ${allRequested ? 'requested' : ''}">
        <div class="rw-claim-emoji">🎁</div>
        <div class="rw-claim-text">
          <div class="rw-claim-title">${allRequested ? '부모님 확인을 기다리고 있어요' : '받을 보상이 있어요!'}</div>
          <div class="rw-claim-sub">${allRequested ? '조금만 기다려주세요' : `아직 못 받은 보상이 ${list.length}개 있어요`}</div>
        </div>
        <button type="button" class="rw-claim-btn" id="rwClaimBtn" ${allRequested ? 'disabled' : ''}>${allRequested ? '요청 보냄 ✓' : '부모님께 보여주기'}</button>
      </div>`;
    }

    function requestParentCheck() {
      const r = App.state.reward;
      const targets = (r.history || []).filter(h => !h.claimed && !h.requested);
      if (!targets.length) return;
      targets.forEach(h => { h.requested = true; });
      App.save();
      App.haptic();
      App.toast('부모님께 확인 요청을 보냈어요');
      paint();
    }

    // 부모 모드: 미수령 보상 카드 목록. "줬어요"를 누르면 체크마크 연출 후 claimed 처리
    function parentClaimSectionHTML() {
      const list = unclaimedList().filter(h => !ModReward._dismissed[h.id]);
      if (!list.length) return '';
      return `
      <div class="sec rw-parent-claims">
        <div class="sec-h"><h2>보상을 줬는지 확인해주세요</h2></div>
        ${list.map(h => parentClaimCardHTML(h)).join('')}
      </div>`;
    }

    function parentClaimCardHTML(h) {
      const medal = { gold: '🥇', silver: '🥈', bronze: '🥉', real: '🎁' };
      return `
      <div class="rw-claim-card" data-claim-id="${h.id}">
        <div class="rw-claim-card-top">
          <span class="rw-claim-card-medal">${medal[h.tier] || '🎁'}</span>
          <div class="rw-claim-card-body">
            <div class="rw-claim-card-benefit">${escHtml(h.benefit)}</div>
            <div class="rw-claim-card-date">${escHtml(h.date)} · ${h.cost}🪙${h.requested ? ' · 아이가 확인 요청했어요' : ''}</div>
          </div>
        </div>
        <div class="rw-claim-card-btns">
          <button type="button" class="rw-claim-later-btn" data-claim-later="${h.id}">나중에</button>
          <button type="button" class="rw-claim-done-btn" data-claim-done="${h.id}">줬어요 ✓</button>
        </div>
        <div class="rw-claim-check-overlay" data-claim-overlay="${h.id}"></div>
      </div>`;
    }

    function dismissLater(id) {
      ModReward._dismissed[id] = true;
      paint();
    }

    function markClaimed(id) {
      const r = App.state.reward;
      const h = (r.history || []).find(x => x.id === id);
      if (!h || h.claimed) return;
      const cardEl = root.querySelector(`[data-claim-id="${id}"]`);
      const overlayEl = root.querySelector(`[data-claim-overlay="${id}"]`);
      const finish = () => {
        h.claimed = true;
        h.claimedAt = new Date().toISOString();
        App.save();
        App.toast('보상을 전달했어요 🎉');
        paint();
      };
      if (cardEl && overlayEl) {
        overlayEl.innerHTML = `
          <svg class="rw-check-svg" viewBox="0 0 64 64">
            <circle class="rw-check-circle" cx="32" cy="32" r="26" pathLength="100"></circle>
            <path class="rw-check-path" d="M20 33 L28 41 L45 22" pathLength="100"></path>
          </svg>`;
        overlayEl.classList.add('show');
        cardEl.classList.add('rw-claim-card--done');
        App.haptic();
        addTimeout(finish, 650);
      } else {
        finish();
      }
    }

    function historyHTML() {
      const hist = App.state.reward.history || [];
      if (!hist.length) {
        return `<div class="empty-note"><div class="big">🗂️</div>아직 받은 보상이 없어요</div>`;
      }
      const medal = { gold: '🥇', silver: '🥈', bronze: '🥉', real: '🎁' };
      return hist.slice(0, 10).map(h => `
        <div class="rw-hist-item">
          <div class="rw-hist-medal">${medal[h.tier] || '🎁'}</div>
          <div class="rw-hist-body">
            <div class="rw-hist-benefit">${escHtml(h.benefit)}</div>
            <div class="rw-hist-date">${escHtml(h.date)}</div>
          </div>
          <div class="rw-hist-right">
            <div class="rw-hist-cost">-${h.cost}🪙</div>
            ${historyBadge(h)}
          </div>
        </div>
      `).join('');
    }

    function template() {
      const r = App.state.reward;
      const modeBadge = r.mode === 'game' ? '🎲 게임으로 결정' : '🎁 바로 받기';
      const stats = earnedStats();
      const pct = r.cost > 0 ? Math.min(100, Math.round(App.state.coins / r.cost * 100)) : 100;
      const remaining = Math.max(0, r.cost - App.state.coins);
      const goalText = remaining > 0 ? `목표까지 ${remaining} 코인 남았어요!` : `목표를 달성했어요! 🎉`;

      return `
      <div class="rw-wrap">
        <div class="rw-wallet">
          <div class="rw-wallet-top">
            <span class="rw-coin-ico">🪙</span>
            <span class="rw-coin-num" id="rwCoinNum">${App.state.coins}</span>
            <span class="rw-coin-label">코인</span>
          </div>
          <div class="rw-wallet-sub">
            <span>오늘 <b>+${stats.today}</b></span>
            <span>이번 주 <b>+${stats.week}</b></span>
          </div>
          <div class="rw-goal-row">
            <div class="rw-goal-bar"><div class="rw-goal-fill" style="width:${pct}%"></div></div>
            <div class="rw-goal-text">${goalText}</div>
          </div>
        </div>

        ${App.isMaster() ? parentClaimSectionHTML() : childClaimBannerHTML()}

        <div class="rw-benefit-card">
          <div class="rw-benefit-badge">${modeBadge}</div>
          <div class="rw-benefit-body">
            <div class="rw-benefit-emoji">🎁</div>
            <div class="rw-benefit-text">${escHtml(r.realBenefit || '아직 정해지지 않았어요')}</div>
          </div>
          <div class="rw-benefit-cost">필요 코인 <b>${r.cost}</b> 🪙</div>
          <div class="rw-benefit-note">부모님이 정한 보상이에요</div>
        </div>

        ${r.mode === 'game' ? `
        <div class="rw-game">
          ${gameChipsHTML()}
          ${gameSectionHTML()}
        </div>` : realSectionHTML()}

        ${App.isMaster() ? `
        <div class="sec rw-master">
          <div class="sec-h"><h2>보상 관리</h2></div>
          <button class="btn line full" id="rwSettingsBtn">보상 설정하기 ⚙️</button>
        </div>` : `<div class="rw-child-note">보상은 부모님이 정해요 🌷</div>`}

        <div class="sec">
          <div class="sec-h"><h2>최근 보상 기록</h2></div>
          ${historyHTML()}
        </div>
      </div>`;
    }

    function bindEvents() {
      const r = App.state.reward;
      if (r.mode === 'game') {
        if (r.freePick) {
          const _onChip = root.querySelector('.rw-gamechip.on');
          const _strip = root.querySelector('.rw-gamechips');
          if (_onChip && _strip) {
            const want = _onChip.offsetLeft - (_strip.clientWidth - _onChip.offsetWidth) / 2;
            const max = Math.max(0, _strip.scrollWidth - _strip.clientWidth);
            _strip.scrollLeft = Math.max(0, Math.min(max, want));
          }
          root.querySelectorAll('.rw-gamechip').forEach(b => {
            b.addEventListener('click', () => switchGame(b.dataset.game));
          });
        }
        const kind = r.game;
        if (kind === 'gacha') {
          if (g.phase === 'idle') { const btn = root.querySelector('#rwPlayBtn'); if (btn) btn.addEventListener('click', startGacha); }
          else if (g.phase === 'playing' && g.gacha.sub === 'choose') {
            root.querySelectorAll('.rw-capsule').forEach(el => el.addEventListener('click', () => pickCapsule(+el.dataset.idx)));
          } else if (g.phase === 'result') { const btn = root.querySelector('#rwRetryBtn'); if (btn) btn.addEventListener('click', startGacha); }
        } else if (kind === 'ladder') {
          if (g.phase === 'idle') { const btn = root.querySelector('#rwPlayBtn'); if (btn) btn.addEventListener('click', startLadder); }
          else if (g.phase === 'playing' && g.ladder.sub === 'pick') {
            root.querySelectorAll('.rw-ladder-top-btn').forEach(el => el.addEventListener('click', () => pickLadderStart(+el.dataset.start)));
          } else if (g.phase === 'result') { const btn = root.querySelector('#rwRetryBtn'); if (btn) btn.addEventListener('click', startLadder); }
        } else if (kind === 'roulette') {
          if (g.phase === 'idle') { const btn = root.querySelector('#rwPlayBtn'); if (btn) btn.addEventListener('click', startRoulette); }
          else if (g.phase === 'result') { const btn = root.querySelector('#rwRetryBtn'); if (btn) btn.addEventListener('click', startRoulette); }
        } else {
          if (g.phase === 'idle') { const btn = root.querySelector('#rwPlayBtn'); if (btn) btn.addEventListener('click', startStop); }
          else if (g.phase === 'playing') { const btn = root.querySelector('#rwStopBtn'); if (btn) btn.addEventListener('click', stopStop); }
          else if (g.phase === 'result') { const btn = root.querySelector('#rwRetryBtn'); if (btn) btn.addEventListener('click', startStop); }
        }
      } else {
        const btn = root.querySelector('#rwRealBtn');
        if (btn) btn.addEventListener('click', receiveReal);
      }
      if (App.isMaster()) {
        const sBtn = root.querySelector('#rwSettingsBtn');
        if (sBtn) sBtn.addEventListener('click', openSettingsSheet);
      }
      bindClaimEvents();
    }

    function bindClaimEvents() {
      if (App.isMaster()) {
        root.querySelectorAll('[data-claim-done]').forEach(btn => {
          btn.addEventListener('click', () => markClaimed(btn.dataset.claimDone));
        });
        root.querySelectorAll('[data-claim-later]').forEach(btn => {
          btn.addEventListener('click', () => dismissLater(btn.dataset.claimLater));
        });
      } else {
        const cb = root.querySelector('#rwClaimBtn');
        if (cb) cb.addEventListener('click', requestParentCheck);
      }
    }

    function paint() {
      const from = (ModReward._lastCoins === undefined) ? App.state.coins : ModReward._lastCoins;
      root.innerHTML = template();
      bindEvents();
      const coinEl = root.querySelector('#rwCoinNum');
      if (coinEl) animateCoinNum(coinEl, from, App.state.coins);
      ModReward._lastCoins = App.state.coins;
      if (g.kind === 'stop' && g.stop.playing) {
        g.stop.lastTs = 0;
        ModReward._raf = requestAnimationFrame(loop);
      }
    }

    paint();
  }
};

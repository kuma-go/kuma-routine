window.ModSound = {
  css: `
    .sd-list{ display:flex; flex-direction:column; gap:2px; margin-top:4px; }
    .sd-row{
      display:flex; align-items:center; gap:12px; width:100%; min-height:44px;
      padding:10px 6px; border:none; background:none; border-radius:var(--r-m);
      text-align:left; cursor:pointer; transition:background .15s;
    }
    .sd-row:active{ background:var(--bg); }
    .sd-row-ico{ font-size:20px; flex:none; width:30px; text-align:center; }
    .sd-row-info{ flex:1; min-width:0; }
    .sd-row-name{ font-size:14px; font-weight:800; color:var(--ink); }
    .sd-row-desc{ font-size:11.5px; font-weight:600; color:var(--muted); margin-top:1px; }
    .sd-row-play{ font-size:11px; font-weight:800; color:var(--indigo); flex:none; }

    .sd-vol-seg{ display:flex; gap:8px; margin-top:6px; }
    .sd-vol-btn{
      flex:1; padding:12px 8px; border-radius:var(--r-m); border:1.5px solid var(--line);
      background:var(--paper); font-size:13px; font-weight:800; color:var(--ink2); cursor:pointer;
      min-height:44px; transition:all .15s cubic-bezier(.22,1,.36,1);
    }
    .sd-vol-btn.on{ border-color:var(--indigo); background:var(--indigo-s); color:var(--indigo-d); }
    .sd-vol-fields{ transition:opacity .2s; }
    .sd-vol-fields.off{ opacity:.4; pointer-events:none; }
    .sd-sec-label{ font-size:12px; font-weight:800; color:var(--muted); margin:18px 2px 4px; }
  `,

  _ctx: null,
  _lastTap: 0,

  init(){
    if(!App || !App.state) return;
    if(typeof App.state.sound !== 'object' || App.state.sound === null){
      App.state.sound = { on: true, vol: 0.6 };
    } else {
      if(typeof App.state.sound.on !== 'boolean') App.state.sound.on = true;
      if(typeof App.state.sound.vol !== 'number') App.state.sound.vol = 0.6;
    }
  },

  enabled(){
    return !!(App.state && App.state.sound && App.state.sound.on);
  },

  _ensureCtx(){
    if(this._ctx){
      if(this._ctx.state === 'suspended'){ try{ this._ctx.resume(); }catch(e){} }
      return this._ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    try{ this._ctx = new AC(); }catch(e){ return null; }
    return this._ctx;
  },

  _vol(){
    return (App.state && App.state.sound && typeof App.state.sound.vol === 'number') ? App.state.sound.vol : 0.6;
  },

  // attack/release 램프가 있는 짧은 톤 하나 생성. 0 게인으로 바로 램프하면 예외가 나므로 0.0001을 바닥값으로 씀.
  _tone(ctx, opt){
    const vol = this._vol();
    const t0 = ctx.currentTime + (opt.delay || 0);
    const dur = opt.dur || 0.15;
    const osc = ctx.createOscillator();
    osc.type = opt.type || 'sine';
    osc.frequency.setValueAtTime(Math.max(1, opt.freq), t0);
    if(opt.freqEnd){
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opt.freqEnd), t0 + dur);
    }
    if(opt.detune) osc.detune.setValueAtTime(opt.detune, t0);
    const gain = ctx.createGain();
    const peak = Math.max(0.0001, (opt.gainPeak != null ? opt.gainPeak : 0.1) * vol);
    const attack = opt.attack != null ? opt.attack : 0.008;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
    osc.addEventListener('ended', () => { try{ osc.disconnect(); gain.disconnect(); }catch(e){} });
    return osc;
  },

  // 8종 효과음. 전부 OscillatorNode+GainNode 합성이며 오디오 파일을 쓰지 않음.
  _sounds: {
    tap(ctx){ // 아주 짧은 클릭
      this._tone(ctx, { freq: 1100, dur: 0.045, attack: 0.003, gainPeak: 0.05, type: 'square' });
    },
    check(ctx){ // 할 일 완료 — 밝게 두 음 상승
      this._tone(ctx, { freq: 659.25, dur: 0.09, attack: 0.005, gainPeak: 0.09, type: 'sine' });
      this._tone(ctx, { freq: 880.00, dur: 0.10, attack: 0.005, gainPeak: 0.10, type: 'sine', delay: 0.075 });
    },
    coin(ctx){ // 코인 획득 — 짧은 3연음 아르페지오
      this._tone(ctx, { freq: 523.25, dur: 0.06, attack: 0.004, gainPeak: 0.09, type: 'triangle' });
      this._tone(ctx, { freq: 659.25, dur: 0.06, attack: 0.004, gainPeak: 0.09, type: 'triangle', delay: 0.05 });
      this._tone(ctx, { freq: 783.99, dur: 0.08, attack: 0.004, gainPeak: 0.10, type: 'triangle', delay: 0.10 });
    },
    complete(ctx){ // 하루 전부 완료 — 4음 상승 팡파레
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        this._tone(ctx, {
          freq: f, delay: i * 0.13,
          dur: i === notes.length - 1 ? 0.28 : 0.15,
          attack: 0.006, gainPeak: i === notes.length - 1 ? 0.12 : 0.10,
          type: 'triangle'
        });
      });
    },
    badge(ctx){ // 배지 획득 — 반짝이는 느낌, 고음 + 약간의 디튠
      this._tone(ctx, { freq: 1046.50, freqEnd: 1318.51, dur: 0.14, attack: 0.006, gainPeak: 0.10, type: 'sine' });
      this._tone(ctx, { freq: 1318.51, dur: 0.15, attack: 0.02, gainPeak: 0.06, type: 'sine', detune: 14, delay: 0.02 });
    },
    spin(ctx){ // 미니게임 시작 — 짧은 상승 스윕
      this._tone(ctx, { freq: 300, freqEnd: 900, dur: 0.16, attack: 0.006, gainPeak: 0.08, type: 'sawtooth' });
    },
    win(ctx){ // 골드 — 화려한 상승
      const notes = [523.25, 659.25, 783.99, 987.77, 1318.51];
      notes.forEach((f, i) => {
        this._tone(ctx, {
          freq: f, delay: i * 0.09,
          dur: i === notes.length - 1 ? 0.22 : 0.10,
          attack: 0.005, gainPeak: i === notes.length - 1 ? 0.12 : 0.09,
          type: 'triangle'
        });
      });
      this._tone(ctx, { freq: 1318.51, dur: 0.30, attack: 0.05, gainPeak: 0.05, type: 'sine', detune: 18, delay: 0.36 });
    },
    lose(ctx){ // 브론즈 — 하강 두 음
      this._tone(ctx, { freq: 392.00, dur: 0.09, attack: 0.005, gainPeak: 0.08, type: 'triangle' });
      this._tone(ctx, { freq: 293.66, dur: 0.10, attack: 0.005, gainPeak: 0.08, type: 'triangle', delay: 0.07 });
    }
  },

  play(name){
    if(!this.enabled()) return;
    if(!this._sounds[name]) return;
    if(name === 'tap'){
      // tap 소리는 자주 울리므로 80ms 쓰로틀
      const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
      if(this._lastTap && now - this._lastTap < 80) return;
      this._lastTap = now;
    }
    const ctx = this._ensureCtx();
    if(!ctx) return;
    try{ this._sounds[name].call(this, ctx); }catch(e){}
  },

  _sndMeta(){
    return [
      { k: 'tap', emoji: '👆', name: '탭', desc: '화면을 가볍게 눌렀을 때' },
      { k: 'check', emoji: '✅', name: '완료 체크', desc: '할 일을 완료했을 때' },
      { k: 'coin', emoji: '🪙', name: '코인 획득', desc: '코인을 모았을 때' },
      { k: 'complete', emoji: '🎉', name: '하루 완료', desc: '오늘 할 일을 다 끝냈을 때' },
      { k: 'badge', emoji: '🏅', name: '배지 획득', desc: '새로운 배지를 받았을 때' },
      { k: 'spin', emoji: '🎲', name: '게임 시작', desc: '미니게임을 시작할 때' },
      { k: 'win', emoji: '🥇', name: '골드 결과', desc: '미니게임에서 골드가 나왔을 때' },
      { k: 'lose', emoji: '🥉', name: '브론즈 결과', desc: '미니게임에서 브론즈가 나왔을 때' }
    ];
  },

  openSettings(){
    if(!App.state.sound) this.init();
    const s = App.state.sound;
    const body = `
      <div class="toggle-row">
        <div><div class="tl">소리 켜기</div><div class="td">효과음을 켜고 꺼요</div></div>
        <button type="button" class="sw-tog ${s.on ? 'on' : ''}" id="sdOnTog"></button>
      </div>
      <div class="sd-vol-fields ${s.on ? '' : 'off'}" id="sdVolFields">
        <div class="field">
          <label>소리 크기</label>
          <div class="sd-vol-seg">
            <button type="button" class="sd-vol-btn ${s.vol <= 0.35 ? 'on' : ''}" data-vol="0.3">작게</button>
            <button type="button" class="sd-vol-btn ${s.vol > 0.35 && s.vol < 0.8 ? 'on' : ''}" data-vol="0.6">보통</button>
            <button type="button" class="sd-vol-btn ${s.vol >= 0.8 ? 'on' : ''}" data-vol="0.9">크게</button>
          </div>
        </div>
        <div class="sd-sec-label">효과음 미리듣기</div>
        <div class="sd-list">
          ${this._sndMeta().map(m => `
            <button type="button" class="sd-row" data-play="${m.k}">
              <span class="sd-row-ico">${m.emoji}</span>
              <span class="sd-row-info">
                <div class="sd-row-name">${m.name}</div>
                <div class="sd-row-desc">${m.desc}</div>
              </span>
              <span class="sd-row-play">▶ 재생</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.sheet('소리 설정', body, '', (bodyEl) => {
      const onTog = bodyEl.querySelector('#sdOnTog');
      const volFields = bodyEl.querySelector('#sdVolFields');
      onTog.addEventListener('click', () => {
        App.state.sound.on = !App.state.sound.on;
        onTog.classList.toggle('on', App.state.sound.on);
        volFields.classList.toggle('off', !App.state.sound.on);
        App.save();
        if(App.state.sound.on) this.play('tap');
      });
      bodyEl.querySelectorAll('.sd-vol-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          App.state.sound.vol = Number(btn.dataset.vol);
          bodyEl.querySelectorAll('.sd-vol-btn').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
          App.save();
          this.play('tap');
        });
      });
      bodyEl.querySelectorAll('[data-play]').forEach(row => {
        row.addEventListener('click', () => this.play(row.dataset.play));
      });
    });
  }
};

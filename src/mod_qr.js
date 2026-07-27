/* ============================================================
   mod_qr.js — 실제 스캔 가능한 QR Code (Model 2) 인코더
   순수 바닐라 JS. 외부 라이브러리/CDN 없음.
   지원: Byte 모드(UTF-8), 버전 1~10, EC 레벨 L/M/Q/H
   ============================================================ */
window.ModQR = {

  css:`
    .qr-svg{ display:block; width:100%; height:auto; }
  `,

  /* ---------- GF(256) 로그/역로그 테이블 (원시다항식 0x11D) ---------- */
  _gf:null,
  _gfInit(){
    if(this._gf) return this._gf;
    const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
    let x = 1;
    for(let i = 0; i < 255; i++){
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if(x & 0x100) x ^= 0x11D;
    }
    for(let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    this._gf = { EXP, LOG };
    return this._gf;
  },
  _gmul(a, b){
    if(a === 0 || b === 0) return 0;
    const g = this._gfInit();
    return g.EXP[g.LOG[a] + g.LOG[b]];
  },

  /* 생성 다항식 (최고차항 먼저) */
  _genPoly(deg){
    const g = this._gfInit();
    let p = [1];
    for(let i = 0; i < deg; i++){
      const np = new Array(p.length + 1).fill(0);
      for(let j = 0; j < p.length; j++){
        np[j] ^= p[j];
        np[j + 1] ^= this._gmul(p[j], g.EXP[i]);
      }
      p = np;
    }
    return p;
  },

  /* Reed-Solomon EC 코드워드 생성 */
  _rsEncode(data, ecLen){
    const gp = this._genPoly(ecLen);
    const res = new Array(data.length + ecLen).fill(0);
    for(let i = 0; i < data.length; i++) res[i] = data[i];
    for(let i = 0; i < data.length; i++){
      const coef = res[i];
      if(coef === 0) continue;
      for(let j = 0; j < gp.length; j++) res[i + j] ^= this._gmul(gp[j], coef);
    }
    return res.slice(data.length);
  },

  /* ---------- 스펙 테이블 ---------- */
  /* 버전별 총 코드워드 수 (데이터 + EC), 버전 1~10 */
  _TOTAL: [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346],

  /* EC 블록 구성: [EC 코드워드/블록, 그룹1 블록수, 그룹1 데이터코드워드, 그룹2 블록수, 그룹2 데이터코드워드] */
  _EC: {
    L:[null,
      [ 7,1, 19,0,  0],[10,1, 34,0,  0],[15,1, 55,0,  0],[20,1, 80,0,  0],[26,1,108,0,  0],
      [18,2, 68,0,  0],[20,2, 78,0,  0],[24,2, 97,0,  0],[30,2,116,0,  0],[18,2, 68,2, 69]],
    M:[null,
      [10,1, 16,0,  0],[16,1, 28,0,  0],[26,1, 44,0,  0],[18,2, 32,0,  0],[24,2, 43,0,  0],
      [16,4, 27,0,  0],[18,4, 31,0,  0],[22,2, 38,2, 39],[22,3, 36,2, 37],[26,4, 43,1, 44]],
    Q:[null,
      [13,1, 13,0,  0],[22,1, 22,0,  0],[18,2, 17,0,  0],[26,2, 24,0,  0],[18,2, 15,2, 16],
      [24,4, 19,0,  0],[18,2, 14,4, 15],[22,4, 18,2, 19],[20,4, 16,4, 17],[24,6, 19,2, 20]],
    H:[null,
      [17,1,  9,0,  0],[28,1, 16,0,  0],[22,2, 13,0,  0],[16,4,  9,0,  0],[22,2, 11,2, 12],
      [28,4, 15,0,  0],[26,4, 13,1, 14],[26,4, 14,2, 15],[24,4, 12,4, 13],[28,6, 15,2, 16]]
  },

  /* 얼라인먼트 패턴 중심 좌표 (버전 1~10) */
  _ALIGN: [null, [], [6,18], [6,22], [6,26], [6,30], [6,34], [6,22,38], [6,24,42], [6,26,46], [6,28,50]],

  /* 포맷 정보용 EC 레벨 비트 */
  _ECBITS: { L:1, M:0, Q:3, H:2 },

  /* ---------- 유틸 ---------- */
  _utf8(str){
    const out = [];
    for(let i = 0; i < str.length; i++){
      let c = str.charCodeAt(i);
      if(c >= 0xD800 && c <= 0xDBFF && i + 1 < str.length){
        const c2 = str.charCodeAt(i + 1);
        if(c2 >= 0xDC00 && c2 <= 0xDFFF){ c = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00); i++; }
      }
      if(c < 0x80) out.push(c);
      else if(c < 0x800){ out.push(0xC0 | (c >> 6), 0x80 | (c & 63)); }
      else if(c < 0x10000){ out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
      else { out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    }
    return out;
  },

  _bchDigit(n){ let d = 0; while(n !== 0){ d++; n >>>= 1; } return d; },

  /* 포맷 정보: BCH(15,5), 생성다항 0x537, 마스크 0x5412 */
  _formatBits(ecLevel, mask){
    const data = (this._ECBITS[ecLevel] << 3) | mask;
    let d = data << 10;
    const G = 0x537, gd = this._bchDigit(G);
    while(this._bchDigit(d) - gd >= 0) d ^= (G << (this._bchDigit(d) - gd));
    return ((data << 10) | d) ^ 0x5412;
  },

  /* 버전 정보: BCH(18,6), 생성다항 0x1F25 */
  _versionBits(version){
    let d = version << 12;
    const G = 0x1F25, gd = this._bchDigit(G);
    while(this._bchDigit(d) - gd >= 0) d ^= (G << (this._bchDigit(d) - gd));
    return (version << 12) | d;
  },

  _dataCodewords(version, ecLevel){
    const t = this._EC[ecLevel][version];
    return t[1] * t[2] + t[3] * t[4];
  },

  /* ---------- 비트 버퍼 ---------- */
  _mkBuf(){
    return {
      bits: [],
      put(num, len){ for(let i = len - 1; i >= 0; i--) this.bits.push((num >>> i) & 1); },
      len(){ return this.bits.length; }
    };
  },

  /* ---------- 코드워드 생성 (데이터 + EC 인터리브) ---------- */
  _codewords(bytes, version, ecLevel){
    const t = this._EC[ecLevel][version];
    const ecLen = t[0];
    const totalData = this._dataCodewords(version, ecLevel);
    const capBits = totalData * 8;

    const buf = this._mkBuf();
    buf.put(4, 4);                                   // Byte 모드
    buf.put(bytes.length, version < 10 ? 8 : 16);    // 문자 수 지시자
    for(let i = 0; i < bytes.length; i++) buf.put(bytes[i], 8);
    if(buf.len() > capBits) return null;

    // 종단 패턴 (최대 4비트)
    const term = Math.min(4, capBits - buf.len());
    buf.put(0, term);
    // 바이트 경계까지 0 패딩
    while(buf.len() % 8 !== 0) buf.bits.push(0);

    const cw = [];
    for(let i = 0; i < buf.bits.length; i += 8){
      let b = 0;
      for(let j = 0; j < 8; j++) b = (b << 1) | buf.bits[i + j];
      cw.push(b);
    }
    // 패드 코드워드 0xEC / 0x11 교대
    const PAD = [0xEC, 0x11];
    let pi = 0;
    while(cw.length < totalData) cw.push(PAD[pi++ % 2]);

    // 블록 분할
    const dataBlocks = [], ecBlocks = [];
    let off = 0;
    for(let grp = 0; grp < 2; grp++){
      const nb = grp === 0 ? t[1] : t[3];
      const dl = grp === 0 ? t[2] : t[4];
      for(let b = 0; b < nb; b++){
        const d = cw.slice(off, off + dl);
        off += dl;
        dataBlocks.push(d);
        ecBlocks.push(this._rsEncode(d, ecLen));
      }
    }

    // 스펙대로 인터리브
    const out = [];
    const maxD = Math.max.apply(null, dataBlocks.map(b => b.length));
    for(let i = 0; i < maxD; i++){
      for(let b = 0; b < dataBlocks.length; b++){
        if(i < dataBlocks[b].length) out.push(dataBlocks[b][i]);
      }
    }
    for(let i = 0; i < ecLen; i++){
      for(let b = 0; b < ecBlocks.length; b++) out.push(ecBlocks[b][i]);
    }
    return out;
  },

  /* ---------- 함수 패턴 배치 ---------- */
  _baseMatrix(version){
    const size = version * 4 + 17;
    const m = [];
    for(let r = 0; r < size; r++) m.push(new Array(size).fill(null));

    const finder = (r0, c0) => {
      for(let r = -1; r <= 7; r++){
        for(let c = -1; c <= 7; c++){
          const rr = r0 + r, cc = c0 + c;
          if(rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
          const on = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                     (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                     (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          m[rr][cc] = on;
        }
      }
    };
    finder(0, 0);
    finder(0, size - 7);
    finder(size - 7, 0);

    // 타이밍 패턴
    for(let i = 8; i < size - 8; i++){
      const on = (i % 2 === 0);
      m[6][i] = on;
      m[i][6] = on;
    }

    // 얼라인먼트 패턴
    const ap = this._ALIGN[version];
    for(let i = 0; i < ap.length; i++){
      for(let j = 0; j < ap.length; j++){
        const r = ap[i], c = ap[j];
        if((i === 0 && j === 0) || (i === 0 && j === ap.length - 1) || (i === ap.length - 1 && j === 0)) continue;
        for(let dr = -2; dr <= 2; dr++){
          for(let dc = -2; dc <= 2; dc++){
            m[r + dr][c + dc] = (Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
          }
        }
      }
    }

    // 포맷 정보 영역 예약 (임시값 false)
    for(let i = 0; i < 9; i++){
      if(m[8][i] === null) m[8][i] = false;
      if(m[i][8] === null) m[i][8] = false;
    }
    for(let i = 0; i < 8; i++){
      if(m[8][size - 1 - i] === null) m[8][size - 1 - i] = false;
      if(m[size - 1 - i][8] === null) m[size - 1 - i][8] = false;
    }
    // 항상 어두운 모듈
    m[size - 8][8] = true;

    // 버전 정보 영역 예약
    if(version >= 7){
      for(let i = 0; i < 18; i++){
        const a = Math.floor(i / 3), b = (i % 3) + size - 11;
        m[a][b] = false;
        m[b][a] = false;
      }
    }
    return m;
  },

  _setFormat(m, ecLevel, mask){
    const size = m.length;
    const bits = this._formatBits(ecLevel, mask);
    for(let i = 0; i < 15; i++){
      const on = ((bits >> i) & 1) === 1;
      if(i < 6) m[i][8] = on;
      else if(i < 8) m[i + 1][8] = on;
      else m[size - 15 + i][8] = on;
    }
    for(let i = 0; i < 15; i++){
      const on = ((bits >> i) & 1) === 1;
      if(i < 8) m[8][size - i - 1] = on;
      else if(i === 8) m[8][7] = on;
      else m[8][15 - i - 1] = on;
    }
    m[size - 8][8] = true;
  },

  _setVersion(m, version){
    if(version < 7) return;
    const size = m.length;
    const bits = this._versionBits(version);
    for(let i = 0; i < 18; i++){
      const on = ((bits >> i) & 1) === 1;
      m[Math.floor(i / 3)][(i % 3) + size - 11] = on;
      m[(i % 3) + size - 11][Math.floor(i / 3)] = on;
    }
  },

  /* 마스크 조건식 (i=행, j=열) */
  _maskFn(k, i, j){
    switch(k){
      case 0: return (i + j) % 2 === 0;
      case 1: return i % 2 === 0;
      case 2: return j % 3 === 0;
      case 3: return (i + j) % 3 === 0;
      case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5: return ((i * j) % 2) + ((i * j) % 3) === 0;
      case 6: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case 7: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
    }
    return false;
  },

  /* 지그재그 데이터 배치 (리마인더 비트는 0으로 채워짐) */
  _mapData(m, data, mask){
    const size = m.length;
    let inc = -1, row = size - 1, bitIdx = 7, byteIdx = 0;
    for(let col = size - 1; col > 0; col -= 2){
      if(col === 6) col--;
      for(;;){
        for(let c = 0; c < 2; c++){
          if(m[row][col - c] === null){
            let dark = false;
            if(byteIdx < data.length) dark = ((data[byteIdx] >>> bitIdx) & 1) === 1;
            if(this._maskFn(mask, row, col - c)) dark = !dark;
            m[row][col - c] = dark;
            bitIdx--;
            if(bitIdx === -1){ byteIdx++; bitIdx = 7; }
          }
        }
        row += inc;
        if(row < 0 || row >= size){ row -= inc; inc = -inc; break; }
      }
    }
  },

  /* ---------- 마스크 페널티 (N1~N4) ---------- */
  _penalty(m){
    const size = m.length;
    let score = 0;
    const P1 = [1,0,1,1,1,0,1,0,0,0,0], P2 = [0,0,0,0,1,0,1,1,1,0,1];

    // N1: 같은 색 5개 이상 연속
    for(let i = 0; i < size; i++){
      let runC = 1, runR = 1;
      for(let j = 1; j < size; j++){
        if(m[i][j] === m[i][j - 1]) runC++;
        else { if(runC >= 5) score += 3 + (runC - 5); runC = 1; }
        if(m[j][i] === m[j - 1][i]) runR++;
        else { if(runR >= 5) score += 3 + (runR - 5); runR = 1; }
      }
      if(runC >= 5) score += 3 + (runC - 5);
      if(runR >= 5) score += 3 + (runR - 5);
    }

    // N2: 2x2 동색 블록
    for(let i = 0; i < size - 1; i++){
      for(let j = 0; j < size - 1; j++){
        const v = m[i][j];
        if(v === m[i][j + 1] && v === m[i + 1][j] && v === m[i + 1][j + 1]) score += 3;
      }
    }

    // N3: 1:1:3:1:1 + 4 공백 패턴
    for(let i = 0; i < size; i++){
      for(let j = 0; j <= size - 11; j++){
        let h1 = true, h2 = true, v1 = true, v2 = true;
        for(let k = 0; k < 11; k++){
          const h = m[i][j + k] ? 1 : 0, v = m[j + k][i] ? 1 : 0;
          if(h !== P1[k]) h1 = false;
          if(h !== P2[k]) h2 = false;
          if(v !== P1[k]) v1 = false;
          if(v !== P2[k]) v2 = false;
        }
        if(h1) score += 40;
        if(h2) score += 40;
        if(v1) score += 40;
        if(v2) score += 40;
      }
    }

    // N4: 어두운 모듈 비율 편차
    let dark = 0;
    for(let i = 0; i < size; i++) for(let j = 0; j < size; j++) if(m[i][j]) dark++;
    const total = size * size;
    const dev = Math.abs(dark * 100 / total - 50); // 50%에서 벗어난 정도(%)
    score += Math.floor(dev / 5) * 10;

    return score;
  },

  /* ---------- 공개 API: encode ---------- */
  encode(text, ecLevel){
    try{
      const ec = (ecLevel && this._EC[String(ecLevel).toUpperCase()]) ? String(ecLevel).toUpperCase() : 'M';
      const bytes = this._utf8(String(text == null ? '' : text));

      // 최소 버전 선택 (1~10)
      let version = 0;
      for(let v = 1; v <= 10; v++){
        const need = 4 + (v < 10 ? 8 : 16) + bytes.length * 8;
        if(need <= this._dataCodewords(v, ec) * 8){ version = v; break; }
      }
      if(!version) return null;

      const data = this._codewords(bytes, version, ec);
      if(!data) return null;

      const base = this._baseMatrix(version);
      let best = null, bestScore = Infinity;
      for(let mask = 0; mask < 8; mask++){
        const m = base.map(row => row.slice());
        this._setFormat(m, ec, mask);
        this._setVersion(m, version);
        this._mapData(m, data, mask);
        const sc = this._penalty(m);
        if(sc < bestScore){ bestScore = sc; best = m; }
      }
      return {
        size: best.length,
        version: version,
        ecLevel: ec,
        modules: best.map(row => row.map(v => v === true))
      };
    }catch(e){
      return null;
    }
  },

  /* ---------- 공개 API: svg ---------- */
  svg(text, opts){
    opts = opts || {};
    const qr = this.encode(text, opts.ec || opts.ecLevel || 'M');
    if(!qr) return '';
    const margin = (opts.margin == null ? 4 : Math.max(0, opts.margin | 0));
    const n = qr.size + margin * 2;
    const px = opts.size || 148;
    const dark = opts.dark || 'var(--ink)';
    const light = opts.light || '#FFFFFF';
    const rounded = !!opts.rounded;
    const r = 0.22, R = '.22';
    // 짧은 숫자 표기 (0.56 -> .56)
    const f = v => String(Math.round(v * 1000) / 1000).replace(/^(-?)0\./, '$1.');

    let d = '';
    for(let row = 0; row < qr.size; row++){
      let c = 0;
      while(c < qr.size){
        if(!qr.modules[row][c]){ c++; continue; }
        let w = 1;
        while(c + w < qr.size && qr.modules[row][c + w]) w++;
        const x = c + margin, y = row + margin;
        if(rounded){
          const mid = f(w - 2 * r), inner = f(1 - 2 * r);
          d += `M${f(x + r)} ${y}h${mid}q${R} 0 ${R} ${R}v${inner}q0 ${R}-${R} ${R}h-${mid}`
             + `q-${R} 0-${R}-${R}v-${inner}q0-${R} ${R}-${R}z`;
        } else {
          d += `M${x} ${y}h${w}v1h-${w}z`;
        }
        c += w;
      }
    }

    return `<svg class="qr-svg" viewBox="0 0 ${n} ${n}" width="${px}" height="${px}" `
      + `xmlns="http://www.w3.org/2000/svg" shape-rendering="${rounded ? 'geometricPrecision' : 'crispEdges'}" `
      + `role="img" aria-label="초대 링크 QR 코드">`
      + `<rect width="${n}" height="${n}" fill="${light}"/>`
      + `<path d="${d}" fill="${dark}"/>`
      + `</svg>`;
  }
};

/* =====================================================================
   SDV interactive deck: behaviour (v5)
   v5 adds: redesigned target dossiers (target rail + four sections).
   v7 adds: company screen, how the thinking changed, business models, personas.
   v4 adds: fixes from the 30 Oct review: funnel logic, one number per
   position, market reasoning, score sensitivity, growth-slide framing.
   v3 adds: executive summary, shortlist funnel + weight sensitivity,
   target dossiers, research plan, reading mode, focus management.
   Content comes from data.js; icons and logo sizes from assets.js.
   v2 adds: source citations, fact-check ledger, Before/With SDV era,
   value-chain lenses + drag-to-rotate, growth-chart measures,
   company finder (/), speaker notes (N).
   ===================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const P = window.PALETTE;
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const STAGE_W = 1600, STAGE_H = 900;
  // v15: ?export=1 renders one slide per 1600 × 900 page for the PDF (no top bar or dock)
  const EXPORT = new URLSearchParams(location.search).has('export');
  if (EXPORT) document.documentElement.classList.add('export');

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ''}"/></svg>`;
  const cv = (c) => `--c:${P[c].m};--cs:${P[c].s};--cl:${P[c].l}`;
  const svgEl = (tag, attrs = {}) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const layerById = (id) => LAYERS.find((l) => l.id === id);
  // shortlisted candidates are numbered by final rank; the screened-out one shows ✕ everywhere
  const candOf = (n) => CANDIDATES.find((c) => c.n === n);
  const candMark = (n) => (candOf(n).screened ? '✕' : String(n));
  const candStatus = (n) => (candOf(n).screened ? 'shortlisted, then screened out in Round 1' : `Round 1 target #${n}; ${candOf(n).now.toLowerCase()}`);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ------------------------------------------------------------------ CITATIONS
  // [^id] in data.js text -> numbered link to SOURCES[id]; numbering = SOURCES order.
  const SRC_IDS = Object.keys(SOURCES);
  const srcNum = (id) => SRC_IDS.indexOf(id) + 1;
  function citeHtml(id) {
    const s = SOURCES[id];
    if (!s) return '';
    const href = s.url ? ` href="${esc(s.url)}" target="_blank" rel="noopener"` : ' role="note" tabindex="0"';
    return `<sup class="cite" data-s="${id}"><a${href} aria-label="Source ${srcNum(id)}: ${esc(s.pub)}">${srcNum(id)}</a></sup>`;
  }
  const CITE_RE = /\[\^([\w-]+)\]/g;
  const rich = (t) => esc(t).replace(CITE_RE, (_, id) => citeHtml(id));
  const plain = (t) => String(t).replace(CITE_RE, '');
  function hydrateCites(scope = document) {
    $$('sup.cite:not([data-done])', scope).forEach((sup) => {
      sup.dataset.done = '1';
      if (!sup.firstChild) sup.outerHTML = citeHtml(sup.dataset.s).replace('<sup class="cite"', '<sup class="cite" data-done="1"');
    });
  }
  const KIND = { primary: 'Primary source', analyst: 'Analyst / research firm', survey: 'Vendor survey', press: 'Press report', team: 'Team assessment' };

  // ------------------------------------------------------------------ LOGO CHIPS
  const NAMES = { nvidia: 'NVIDIA', qualcomm: 'Qualcomm', nxp: 'NXP', qnx: 'QNX', vector: 'Vector', android: 'Android Automotive',
    mobileye: 'Mobileye', tesla: 'Tesla', 'tesla-t': 'Tesla', rivian: 'Rivian', harman: 'Harman', onstar: 'OnStar', motive: 'Motive',
    att: 'AT&T', aws: 'AWS', azure: 'Microsoft Azure', gcloud: 'Google Cloud', infineon: 'Infineon', renesas: 'Renesas', bosch: 'Bosch',
    aptiv: 'Aptiv', zf: 'ZF', windriver: 'Wind River', excelfore: 'Excelfore', gm: 'GM', verizon: 'Verizon', tomtom: 'TomTom',
    plaxidityx: 'PlaxidityX', dspace: 'dSPACE', applied: 'Applied Intuition', synopsys: 'Synopsys', hertz: 'Hertz', uber: 'Uber',
    lyft: 'Lyft', waymo: 'Waymo', ford: 'Ford', toyota: 'Toyota', vw: 'Volkswagen', bmw: 'BMW', hyundai: 'Hyundai', honda: 'Honda', nio: 'NIO', byd: 'BYD' };
  const logoSrc = (id) => `assets/logos/${id}.${id === 'applied' ? 'png' : 'svg'}`;

  // canonical company name for a chip spec (used by the finder and highlight)
  function specName(spec) {
    if (spec[0] === '~') return null;
    let n;
    if (spec[0] === '=') n = spec.slice(1);
    else {
      const [id, txt] = spec.split('|');
      n = id === 'gm' && txt ? `${txt} (GM)` : (txt || NAMES[id] || id);
      if (id === 'onstar') n = 'OnStar (GM)';
    }
    return n.replace(/\s*\((Aumovio|Trend Micro|Rivian–VW)\)$/, '');
  }
  const specKey = (spec) => { const n = specName(spec); return n ? n.toLowerCase() : ''; };

  function chip(spec, size = 'sm') {
    const key = esc(specKey(spec));
    if (spec[0] === '=') return `<span class="chip txt" data-n="${key}">${esc(spec.slice(1))}</span>`;
    if (spec[0] === '~') return `<span class="chip muted">${esc(spec.slice(1))}</span>`;
    const [id, txt] = spec.split('|');
    const k = size === 'lg' ? 78 : 54, max = size === 'lg' ? 27 : 18;
    const h = Math.min((LOGO_H[id] || 0.3) * k, max).toFixed(1);
    const name = NAMES[id] || id;
    return `<span class="chip" data-n="${key}"><img src="${logoSrc(id)}" alt="${esc(txt ? '' : name)}" style="height:${h}px" draggable="false">${txt ? `<span>${esc(txt)}</span>` : ''}</span>`;
  }
  const chips = (list, size) => `<div class="chips${size === 'lg' ? ' lg' : ''}">${list.map((s) => chip(s, size)).join('')}</div>`;

  function meter(level) {
    let bars = '';
    for (let i = 1; i <= 3; i++) bars += `<i class="${i <= level ? 'on' : ''}"></i>`;
    return `<span class="meter">${bars}<span>${COMP_LABEL[level]}</span></span>`;
  }
  const pocket = (p) => `<span class="pocket${p.star ? ' star' : ''}${p.none ? ' none' : ''}${p.screened ? ' screened' : ''}">${esc(p.text)}${p.target ? `<em class="tgt" title="${p.target === 'lead' ? 'W1, first to test' : 'W2, conditional'}">${p.target === 'lead' ? 'W1' : 'W2'}</em>` : ''}${p.screened ? `<em class="scr" title="${p.label === 'dropped' ? 'A Round 1 target, dropped after the company screen' : 'Screened out as a stand-alone wedge'}">${p.label || 'screened out'}</em>` : ''}</span>`;

  function hydrateIcons(scope = document) {
    $$('[data-icon]', scope).forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });
  }

  // segmented control: buttons + sliding thumb
  function segCtl(el, onChange) {
    const thumb = $('.seg-thumb', el);
    const btns = $$('button', el);
    const isTabs = el.getAttribute('role') === 'tablist';
    const stateAttr = isTabs ? 'aria-selected' : 'aria-checked';
    const sync = () => btns.forEach((x) => { const on = x.classList.contains('on'); x.setAttribute(stateAttr, String(on)); x.tabIndex = on ? 0 : -1; });
    // arrow keys move the selection (radio group / tab list pattern)
    el.addEventListener('keydown', (e) => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % btns.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = btns.length - 1;
      if (j < 0) return;
      e.preventDefault(); e.stopPropagation();
      btns[j].focus(); btns[j].click();
    });
    const place = () => {
      const on = btns.find((b) => b.classList.contains('on')) || btns[0];
      thumb.style.left = on.offsetLeft + 'px';
      thumb.style.width = on.offsetWidth + 'px';
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      if (b.classList.contains('on')) return;
      btns.forEach((x) => x.classList.toggle('on', x === b));
      sync(); place();
      onChange(b);
    }));
    sync();
    requestAnimationFrame(place);
    document.fonts && document.fonts.ready.then(place);
    return { place, set(val, attr) { const b = btns.find((x) => x.dataset[attr] === val); if (b) b.click(); } };
  }

  // ------------------------------------------------------------------ TOOLTIP
  const tip = $('#tip');
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('show');
    const r = tip.getBoundingClientRect();
    let tx = x + 16, ty = y + 16;
    if (tx + r.width > innerWidth - 10) tx = x - r.width - 16;
    if (ty + r.height > innerHeight - 10) ty = y - r.height - 16;
    tip.style.left = tx + 'px';
    tip.style.top = ty + 'px';
  }
  const hideTip = () => tip.classList.remove('show');

  // citation hover / click (delegated)
  document.addEventListener('pointerover', (e) => {
    const c = e.target.closest && e.target.closest('.cite');
    if (!c) return;
    const s = SOURCES[c.dataset.s]; if (!s) return;
    const r = c.getBoundingClientRect();
    showTip(`<span class="tip-k">[${srcNum(c.dataset.s)}] ${esc(KIND[s.kind] || '')}</span><b>${esc(s.pub)}</b>${esc(s.title)}<br><span class="tip-d">${esc(s.date)}${s.url ? ' · click to open ↗' : ''}</span>`, r.right, r.bottom);
  });
  document.addEventListener('pointerout', (e) => { if (e.target.closest && e.target.closest('.cite')) hideTip(); });
  document.addEventListener('focusin', (e) => {
    const c = e.target.closest && e.target.closest('.cite');
    if (!c) return;
    const s = SOURCES[c.dataset.s]; if (!s) return;
    const r = c.getBoundingClientRect();
    showTip(`<span class="tip-k">[${srcNum(c.dataset.s)}] ${esc(KIND[s.kind] || '')}</span><b>${esc(s.pub)}</b>${esc(s.title)}<br><span class="tip-d">${esc(s.date)}${s.url ? ' · Enter to open ↗' : ''}</span>`, r.right, r.bottom);
  });
  document.addEventListener('focusout', (e) => { if (e.target.closest && e.target.closest('.cite')) hideTip(); });
  // a citation inside a clickable card opens its source, not the card
  document.addEventListener('click', (e) => {
    const c = e.target.closest && e.target.closest('.cite');
    if (!c) return;
    e.stopPropagation();
    if (!c.querySelector('a[href]')) e.preventDefault();
  }, true);

  // ------------------------------------------------------------------ STAGE FIT
  let scale = 1, stageW = STAGE_W;
  // v14: the stage keeps its 900 height but grows wider (up to 2240) on wide windows, so a
  // 16:10 or 21:9 window is filled instead of showing empty bands. Slide CSS reflows with
  // --sw (stage width), --k (how much the 1480 content width grew) and --dx (half the growth).
  const STAGE_W_MAX = 2240, SIDE = 20;
  function fit() {
    const top = EXPORT ? 0 : 52, bot = EXPORT ? 0 : 66; // v12: room for the dock, which now stays visible
    const vw = innerWidth, vh = innerHeight;
    const availH = Math.max(200, vh - top - bot);
    scale = Math.min(vw / STAGE_W, availH / STAGE_H);
    stageW = Math.round(clamp((vw - 2 * SIDE) / scale, STAGE_W, STAGE_W_MAX));
    root.style.setProperty('--sw', stageW + 'px');
    root.style.setProperty('--k', ((stageW - 120) / 1480).toFixed(4));
    root.style.setProperty('--dx', (stageW - STAGE_W) / 2 + 'px');
    // v17: the wide layout is sized for a ~2240 stage, so it starts at 2150; narrower stages use the
    // standard layout, which reflows into the extra width
    document.body.classList.toggle('wide', stageW >= 2150);
    root.style.setProperty('--s', scale);
    // v17: pop-ups (layer deep dive) use the whole window, at most 1900 wide on the stage
    root.style.setProperty('--sf', Math.min(vw / Math.min(stageW, 1900), vh / STAGE_H));
    root.style.setProperty('--cx', vw / 2 + 'px');
    root.style.setProperty('--cy', top + availH / 2 + 'px');
    cover.resize();
  }
  function toStage(stage, x, y) {
    const r = stage.getBoundingClientRect();
    return { x: (x - r.left) / scale, y: (y - r.top) / scale };
  }

  // ------------------------------------------------------------------ COUNT-UP
  function countUp(el, delay = 450) {
    cancelAnimationFrame(el._raf);
    clearTimeout(el._to);
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (REDUCE) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    el.textContent = pre + (0).toFixed(dec) + suf;
    el._to = setTimeout(() => {
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = pre + (to * e).toFixed(dec) + suf;
        if (k < 1) el._raf = requestAnimationFrame(step);
      };
      el._raf = requestAnimationFrame(step);
    }, delay);
  }

  // ------------------------------------------------------------------ TILT CARDS
  function bindTilt(scope = document) {
    $$('.tilt', scope).forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', (px - 0.5) * 8 + 'deg');
        card.style.setProperty('--rx', (0.5 - py) * 8 + 'deg');
        card.style.setProperty('--px', px * 100 + '%');
        card.style.setProperty('--py', py * 100 + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  // highlight a company's chip inside a container (finder jump)
  function flashChip(scope, key) {
    if (!key) return;
    $$(`.chip[data-n="${CSS.escape(key)}"]`, scope).forEach((c) => {
      c.classList.remove('hl'); void c.offsetWidth; c.classList.add('hl');
    });
  }

  // =================================================================== COVER
  const cover = (() => {
    const canvas = $('#coverCanvas');
    const ctx = canvas.getContext('2d');
    const carPath = new Path2D(ICONS.car);
    const RING_SP = [0.34, 0.25, 0.19, 0.14];
    const bodies = LAYERS.map((l, i) => ({ l, ring: i % 4, a: (i >= 4 ? Math.PI : 0) + (i % 4) * 1.3, sp: RING_SP[i % 4] }));
    const stars = Array.from({ length: 180 }, () => ({ x: Math.random() * STAGE_W_MAX, y: Math.random() * STAGE_H, r: Math.random() * 1.3 + 0.2, p: Math.random() * 6.28, v: Math.random() * 0.12 + 0.03 }));
    const rings = [112, 182, 252, 322];
    let raf = 0, running = false, mx = 0, my = 0, last = 0, dpr = 1;

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(stageW * scale * dpr);
      canvas.height = Math.round(STAGE_H * scale * dpr);
      if (!running) draw(performance.now());
    }
    function draw(t) {
      const k = scale * dpr;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, stageW, STAGE_H);
      const time = t / 1000;
      for (const s of stars) {
        s.x -= s.v; if (s.x < 0) s.x = stageW;
        ctx.globalAlpha = 0.25 + 0.35 * Math.sin(time * 1.4 + s.p) ** 2;
        ctx.fillStyle = '#c7d2fe';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      const cx = stageW - 450 + mx * 26, cy = 470 + my * 18, tilt = -0.22, squash = 0.4;
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const proj = (r, a) => {
        const ex = Math.cos(a) * r, ey = Math.sin(a) * r * squash;
        return { x: cx + ex * cosT - ey * sinT, y: cy + ex * sinT + ey * cosT, z: Math.sin(a) };
      };
      rings.forEach((r, i) => {
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(tilt);
        ctx.beginPath(); ctx.ellipse(0, 0, r, r * squash, 0, 0, 6.283);
        ctx.setLineDash([2, 9]); ctx.lineDashOffset = -time * (10 + i * 4);
        ctx.strokeStyle = `rgba(165,180,252,${0.42 - i * 0.07})`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
      });
      const pos = bodies.map((b) => {
        const a = b.a + time * b.sp * (REDUCE ? 0 : 1);
        return { b, a, p: proj(rings[b.ring], a) };
      });
      const drawBody = ({ b, a, p }) => {
        const c = P[b.l.colour], depth = (p.z + 1) / 2;
        for (let j = 16; j > 0; j--) {
          const q = proj(rings[b.ring], a - j * 0.035);
          ctx.globalAlpha = (1 - j / 16) * 0.5 * (0.4 + depth * 0.6);
          ctx.fillStyle = c.m;
          ctx.beginPath(); ctx.arc(q.x, q.y, 2.2 * (1 - j / 20), 0, 6.283); ctx.fill();
        }
        const r = 6 + depth * 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, c.l); g.addColorStop(0.25, c.m + 'aa'); g.addColorStop(1, c.m + '00');
        ctx.globalAlpha = 0.5 + depth * 0.5;
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.55, 0, 6.283); ctx.fill();
        // v15: only the V&V body is labelled (it is our story), so no label can sit on the hub
        if (b.l.id === 8 && depth > 0.2) {
          ctx.globalAlpha = Math.min(1, (depth - 0.2) * 2.2);
          ctx.font = '700 17px Inter, sans-serif'; ctx.fillStyle = '#f5d0fe';
          const lab = 'Integration & V&V · our focus', tw = ctx.measureText(lab).width;
          // flip the label to the left of the body when it would run off the stage
          if (p.x + r + 10 + tw > stageW - 24) ctx.fillText(lab, p.x - r - 10 - tw, p.y + 6); else ctx.fillText(lab, p.x + r + 10, p.y + 6);
        }
        ctx.globalAlpha = 1;
      };
      pos.forEach(({ b, p }) => {
        ctx.strokeStyle = P[b.l.colour].m; ctx.globalAlpha = 0.12; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      pos.filter((o) => o.p.z < 0).forEach(drawBody);
      const pulse = 1 + Math.sin(time * 1.6) * 0.06;
      let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170 * pulse);
      g.addColorStop(0, 'rgba(99,102,241,.55)'); g.addColorStop(0.4, 'rgba(59,130,246,.18)'); g.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 170 * pulse, 0, 6.283); ctx.fill();
      g = ctx.createRadialGradient(cx - 20, cy - 24, 4, cx, cy, 66);
      g.addColorStop(0, '#3b5bdb'); g.addColorStop(1, '#0b1533');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 64, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(165,180,252,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.translate(cx - 30, cy - 34); ctx.scale(2.5, 2.5); ctx.fillStyle = '#fff'; ctx.fill(carPath); ctx.restore();
      pos.filter((o) => o.p.z >= 0).forEach(drawBody);
      // the hub label is drawn last, below the circle, so no orbiting body can cover it
      ctx.globalAlpha = 1; ctx.font = '700 15px Inter, sans-serif'; ctx.fillStyle = '#c7d2fe'; ctx.textAlign = 'center';
      ctx.fillText('THE AUTOMAKER (OEM)', cx, cy + 92); ctx.textAlign = 'left';
    }
    function loop(t) {
      if (!running) return;
      if (t - last > 15) { draw(t); last = t; }
      raf = requestAnimationFrame(loop);
    }
    return {
      resize,
      start() { if (running) return; running = true; raf = requestAnimationFrame(loop); },
      stop() { running = false; cancelAnimationFrame(raf); },
      mouse(x, y) { mx = x; my = y; },
    };
  })();

  // =================================================================== WHY: ECU merge
  const ecus = (() => {
    const box = $('#ecus');
    const items = [];
    for (let i = 0; i < 17; i++) { const e = document.createElement('i'); box.appendChild(e); items.push(e); }
    let state = 0, timer = 0;
    const keep = [0, 3, 6, 8, 11, 13, 16];
    function layout() {
      items.forEach((e, i) => {
        if (state === 0) { e.style.left = i * 20 + 'px'; e.style.opacity = 1; e.style.transform = 'scale(.75)'; }
        else {
          const slot = keep.findIndex((k) => k >= i);
          const s = keep.includes(i) ? keep.indexOf(i) : Math.max(0, slot);
          e.style.left = s * 50 + 'px';
          e.style.opacity = keep.includes(i) ? 1 : 0;
          e.style.transform = keep.includes(i) ? 'scale(1.3)' : 'scale(.4)';
        }
      });
    }
    layout();
    return {
      start() { clearInterval(timer); state = 0; layout(); timer = setInterval(() => { state ^= 1; layout(); }, 2600); },
      stop() { clearInterval(timer); },
    };
  })();

  // =================================================================== ECOSYSTEM
  const eco = (() => {
    const stage = $('#eco');
    const svg = $('#ecoSvg');
    const html = $('#ecoHtml');
    const narr = $('#narr');
    const drawer = $('#drawer');
    const H = HUB, R = H.r + 28;
    const flowEls = {};
    const actorEls = {};
    const state = { hover: null, pinned: null, shift: 0, playing: false, playTimer: 0, era: 'after' };

    const actor = (id) => ACTORS.find((a) => a.id === id);
    const hubPt = (ang) => ({ x: H.x + R * Math.cos(ang * Math.PI / 180), y: H.y - R * Math.sin(ang * Math.PI / 180) });
    const hubToward = (p) => { const a = Math.atan2(H.y - p.y, p.x - H.x) * 180 / Math.PI; return hubPt(a); };
    const actorPt = (a, dy = 0) => ({ x: a.side === 'L' ? a.x + 180 : a.x - 180, y: a.y + dy });
    function endpoints(f) {
      const resolve = (end) => {
        if (typeof end === 'object') return end;
        if (end === 'hub') return null;
        return actorPt(actor(end), f.dy || 0);
      };
      let a = resolve(f.from), b = resolve(f.to);
      if (!a) a = f.ang != null ? hubPt(f.ang) : hubToward(b);
      if (!b) b = f.ang != null ? hubPt(f.ang) : hubToward(a);
      return [a, b];
    }
    function pathD(f, a, b) {
      if (f.curve) return `M${a.x},${a.y} C${a.x - 10},${a.y + 90} ${b.x + 40},${b.y - 90} ${b.x},${b.y}`;
      return `M${a.x},${a.y} L${b.x},${b.y}`;
    }
    const actorsOf = (f) => {
      const s = new Set(f.a || []);
      [f.from, f.to].forEach((e) => { if (typeof e === 'string') s.add(e); });
      if (f.type === 'rules') s.add('reg');
      return s;
    };

    function build() {
      const defs = svgEl('defs');
      const mk = (id, color) => {
        const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 9, markerHeight: 9, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' });
        m.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: color }));
        defs.appendChild(m);
      };
      mk('ah-goods', '#8091ab'); mk('ah-shift', '#f97316'); mk('ah-data', '#a78bfa'); mk('ah-rules', '#64748b');
      const clip = svgEl('clipPath', { id: 'ecoClip' });
      clip.appendChild(svgEl('rect', { x: 0, y: 150, width: 1600, height: 660 }));
      defs.appendChild(clip);
      const rg = svgEl('radialGradient', { id: 'hubGlow' });
      rg.appendChild(svgEl('stop', { offset: '0%', 'stop-color': '#3b82f6', 'stop-opacity': '.16' }));
      rg.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#3b82f6', 'stop-opacity': '0' }));
      defs.appendChild(rg);
      svg.appendChild(defs);

      const bg = svgEl('g', { 'clip-path': 'url(#ecoClip)' });
      bg.appendChild(svgEl('circle', { cx: H.x, cy: H.y, r: 300, fill: 'url(#hubGlow)' }));
      bg.appendChild(svgEl('ellipse', { class: 'orbit', cx: H.x, cy: H.y, rx: 585, ry: 530 }));
      bg.appendChild(svgEl('ellipse', { class: 'orbit o2', cx: H.x, cy: H.y, rx: 360, ry: 312 }));
      svg.appendChild(bg);

      const gFlows = svgEl('g');
      const gParts = svgEl('g');
      svg.appendChild(gFlows); svg.appendChild(gParts);

      FLOWS.forEach((f) => {
        const [a, b] = endpoints(f);
        const kind = f.shift ? 'shift' : f.type;
        const nw = f.isNew ? ' is-new' : '';
        const path = svgEl('path', {
          d: pathD(f, a, b),
          class: `flow dimmable t-${f.type}${f.shift ? ' shift' : ''}${nw}`,
          'marker-end': `url(#ah-${kind})`,
        });
        gFlows.appendChild(path);
        const len = path.getTotalLength();
        const samples = [];
        for (let i = 0; i <= 100; i++) { const q = path.getPointAtLength((len * i) / 100); samples.push([q.x, q.y]); }
        const g = svgEl('g', { class: 'dimmable' + nw });
        gParts.appendChild(g);
        const parts = [];
        const add = (cls, dir, n, speed, r) => {
          for (let i = 0; i < n; i++) {
            const halo = svgEl('circle', { r: r * 2.4, class: `part halo ${cls}` });
            const dot = svgEl('circle', { r, class: `part ${cls}` });
            g.appendChild(halo); g.appendChild(dot);
            parts.push({ halo, dot, dir, phase: i / n, speed });
          }
        };
        const pcls = f.shift ? 'p-shift' : `p-${f.type}`;
        add(pcls, 1, Math.max(1, Math.round(len / 85)), 62, f.shift ? 3.2 : 2.6);
        if (f.money) add('p-money', -1, Math.max(1, Math.round(len / 150)), 40, 3.4);

        let label = null;
        if (f.label) {
          label = document.createElement('div');
          label.className = `fl dimmable${f.inline ? ' inline' : ''}${f.shift && f.inline ? ' sh' : ''}${nw}`;
          const sn = f.shift && !f.shiftNote ? `<span class="sn">${f.shift}</span>` : '';
          let inner = '';
          if (f.type === 'rules') inner = `<span class="rl">${esc(f.label)}</span>`;
          else {
            inner = `<span class="lbl">${sn}${esc(f.label)}</span>`;
            if (f.money) inner += `<span class="m">${esc(f.money)}</span>`;
            if (f.shiftNote) inner += `<span class="shn"><span class="sn">${f.shift}</span>${esc(f.shiftNote)}</span>`;
            if (f.back) inner += `<span class="bk">${esc(f.back)}</span>`;
          }
          label.innerHTML = inner;
          let lp;
          if (f.inline) lp = { x: a.x, y: (a.y + b.y) / 2 };
          else { const q = path.getPointAtLength(len * (f.t ?? 0.5)); lp = { x: q.x, y: q.y }; }
          if (f.dy && f.ang != null) lp.y += f.dy;
          label.style.left = lp.x + 'px';
          label.style.top = lp.y + 'px';
          html.appendChild(label);
        }
        flowEls[f.id] = { f, path, g, label, samples, len, parts, actors: actorsOf(f) };
      });

      const reg = document.createElement('div');
      reg.className = 'reg rv'; reg.style.setProperty('--d', 3); reg.tabIndex = 0; reg.dataset.node = 'reg';
      reg.innerHTML = `<span class="disc">${icon('gavel')}</span><div><div class="r-t">${esc(REGULATORS.title)}<span>${esc(REGULATORS.sub)}</span></div>
        <div class="r-l">${REGULATORS.list.map(esc).join(' · ')}</div></div>`;
      html.appendChild(reg);
      actorEls.reg = reg;

      const hub = document.createElement('div');
      hub.className = 'hub'; hub.tabIndex = 0; hub.dataset.node = 'hub';
      hub.style.left = H.x - H.r + 'px'; hub.style.top = H.y - H.r + 'px';
      let ring = '';
      H.oems.forEach((id, k) => {
        const ang = -90 + k * 36;
        ring += `<span class="oem" data-n="${esc((NAMES[id] || id).toLowerCase())}" style="transform:rotate(${ang}deg) translate(${H.r}px) rotate(${-ang}deg)"><img src="${logoSrc(id)}" alt="${esc(NAMES[id] || id)}" draggable="false"></span>`;
      });
      hub.innerHTML = `<div class="ring">${ring}</div><div class="hub-in"><div class="car">${icon('car')}</div><div class="hk">THE HUB</div>
        <div class="ht">Automakers</div><div class="ho">(OEMs)</div><div class="hs" id="hubSub">vehicle margin +<br>recurring software revenue</div></div>`;
      html.appendChild(hub);
      actorEls.hub = hub;

      ACTORS.forEach((a, i) => {
        const el = document.createElement('div');
        el.className = `actor rv${a.focus ? ' focus' : ''}`;
        el.style.cssText = `${cv(a.colour)};left:${a.x - 180}px;top:${a.y - 48}px;--d:${3 + (i % 5) * 0.6}`;
        el.tabIndex = 0; el.dataset.node = a.id;
        el.innerHTML = `${a.focus ? '<span class="badge">★ OUR FOCUS AREA</span>' : ''}<span class="disc">${icon(a.icon)}</span>
          <div><div class="a-t">${esc(a.title)}</div><div class="a-s">${esc(a.sub)}</div>${chips(a.logos)}</div>`;
        html.appendChild(el);
        actorEls[a.id] = el;
      });

      const sb = $('#shiftBtns');
      SHIFTS.forEach((s) => {
        const b = document.createElement('button');
        b.className = 'shb'; b.dataset.shift = s.n;
        b.innerHTML = `<span class="sn">${s.n}</span>${esc(s.title)}`;
        b.addEventListener('click', () => { stopPlay(); setShift(state.shift === s.n ? 0 : s.n); });
        sb.appendChild(b);
      });

      segCtl($('#eraCtl'), (b) => setEra(b.dataset.era));
      bind();
      setNarr();
    }

    // ---- era: before / with SDV
    function setEra(era) {
      state.era = era;
      const before = era === 'before';
      if (before) { stopPlay(); state.shift = 0; $$('.shb').forEach((b) => b.classList.remove('on')); closeDrawer(true); }
      stage.classList.toggle('era-before', before);
      for (const id in flowEls) {
        const fe = flowEls[id];
        if (fe.f.shift) fe.path.setAttribute('marker-end', `url(#ah-${before ? fe.f.type : 'shift'})`);
      }
      const hs = $('#hubSub');
      hs.classList.remove('swap'); void hs.offsetWidth; hs.classList.add('swap');
      hs.innerHTML = before ? 'vehicle margin,<br>paid once at the sale' : 'vehicle margin +<br>recurring software revenue';
      apply(); setNarr();
    }

    // ---- focus logic
    function apply() {
      let nodes = null, flows = null;
      const pick = state.hover || state.pinned;
      const live = (fe) => !(state.era === 'before' && fe.f.isNew);
      if (pick && pick !== 'hub') {
        flows = new Set(); nodes = new Set([pick, 'hub']);
        for (const id in flowEls) {
          const fe = flowEls[id];
          if (live(fe) && fe.actors.has(pick)) { flows.add(id); fe.actors.forEach((x) => nodes.add(x)); }
        }
      } else if (!pick && state.shift) {
        const s = SHIFTS[state.shift - 1];
        flows = new Set(s.flows); nodes = new Set([...s.actors, 'hub']);
      }
      stage.classList.toggle('focusing', !!flows);
      for (const id in flowEls) {
        const fe = flowEls[id], on = !!flows && flows.has(id);
        [fe.path, fe.g, fe.label].forEach((e) => e && e.classList.toggle('on', on));
        fe.boost = on ? 1.8 : 1;
      }
      for (const id in actorEls) actorEls[id].classList.toggle('on', !!nodes && nodes.has(id));
    }

    function setShift(n) {
      if (state.era === 'before') return;
      state.shift = n;
      $$('.shb').forEach((b) => b.classList.toggle('on', +b.dataset.shift === n));
      if (n) closeDrawer(true);
      apply(); setNarr();
    }
    function setNarr() {
      if (state.era === 'before') {
        narr.className = 'narr show era';
        narr.innerHTML = `<h4>${esc(ERA_TEXT.before.title)}</h4><p>${esc(ERA_TEXT.before.text)}</p>`;
        return;
      }
      if (!state.shift) {
        narr.className = 'narr hint';
        narr.innerHTML = 'Hover an actor to trace its flows · click it for detail · or play the four SDV shifts below';
        return;
      }
      const s = SHIFTS[state.shift - 1];
      narr.className = 'narr show' + (state.playing ? ' playing' : '');
      narr.innerHTML = `<h4><span class="sn">${s.n}</span>${esc(s.title)}</h4><p>${rich(s.text)}</p><div class="prog"><i></i></div>`;
    }
    function play() {
      if (state.playing) { stopPlay(); return; }
      if (state.era === 'before') return;
      state.playing = true;
      $('#playShifts').innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg><span>Pause</span>`;
      let n = 0;
      const next = () => {
        n++;
        if (n > SHIFTS.length) { stopPlay(); setShift(0); return; }
        setShift(n);
        state.playTimer = setTimeout(next, 5500);
      };
      next();
    }
    function stopPlay() {
      state.playing = false;
      clearTimeout(state.playTimer);
      $('#playShifts').innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><span>Play</span>`;
      narr.classList.remove('playing');
    }

    // ---- drawer
    function openDrawer(id, hlKey) {
      stopPlay(); state.shift = 0; $$('.shb').forEach((b) => b.classList.remove('on')); setNarr();
      state.pinned = id;
      let colour, ic, title, sub, logos, gives, gets, sdv, layers = [];
      const before = state.era === 'before';
      if (id === 'hub') {
        colour = 'Ltwo'; ic = 'car'; title = H.title; sub = 'The hub of the ecosystem';
        logos = H.oems.slice(); gives = H.gives; gets = before ? H.getsBefore : H.gets; sdv = H.sdv; layers = [1, 2, 3, 4, 5, 6];
      } else if (id === 'reg') {
        colour = 'Ltwo'; ic = 'gavel'; title = REGULATORS.title; sub = REGULATORS.sub;
        logos = REGULATORS.list.map((x) => '=' + x); gives = 'Rules, type approval and recalls.'; gets = null; sdv = REGULATORS.detail; layers = [7];
      } else {
        const a = actor(id);
        colour = a.colour; ic = a.icon; title = a.title; sub = a.sub; logos = a.logos; gives = a.gives; gets = a.gets; sdv = a.sdv; layers = a.layers;
      }
      const side = id === 'reg' || (actor(id) && actor(id).side === 'R') ? 'left' : 'right';
      drawer.className = `drawer ${side}`;
      drawer.style.cssText = cv(colour);
      drawer.innerHTML = `<button class="x" aria-label="Close">×</button>
        <div class="dr-ico">${icon(ic)}</div>
        <div class="dr-t">${esc(title)}</div><div class="dr-s">${esc(sub)}</div>
        ${chips(logos)}
        <div class="dr-sec"><div class="mini-kicker">What they bring</div><p>${rich(gives)}</p></div>
        ${gets ? `<div class="dr-sec"><div class="mini-kicker" style="color:var(--money)">$ How they get paid</div><p>${rich(gets)}</p></div>` : ''}
        <div class="dr-sec sdv"><div class="mini-kicker">${id === 'reg' ? 'Why it matters' : 'What SDVs change'}</div><p>${rich(sdv)}</p></div>
        <div class="dr-sec"><div class="mini-kicker">Value-chain layers · open deep dive</div><div class="dr-links">
          ${layers.map((n) => { const l = layerById(n); return `<button class="lchip" data-layer="${n}" style="${cv(l.colour)}"><b>${l.num}</b>${esc(l.short)}<span class="go">→</span></button>`; }).join('')}
        </div></div>`;
      requestAnimationFrame(() => drawer.classList.add('open'));
      drawer.setAttribute('aria-hidden', 'false');
      drawer.setAttribute('role', 'region'); drawer.setAttribute('aria-label', title);
      if (document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-node]')) {
        drawerReturn = document.activeElement;
        setTimeout(() => { const x = $('.x', drawer); if (x) x.focus(); }, 60);
      }
      $('.x', drawer).addEventListener('click', () => closeDrawer());
      $$('.lchip', drawer).forEach((b) => b.addEventListener('click', () => {
        closeDrawer(); goId('s-vc');
        setTimeout(() => dive.open(+b.dataset.layer), 650);
      }));
      if (hlKey) setTimeout(() => flashChip(drawer, hlKey), 350);
      apply();
    }
    let drawerReturn = null;
    function closeDrawer(silent) {
      if (!state.pinned && !drawer.classList.contains('open')) return;
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      state.pinned = null;
      if (drawerReturn && drawer.contains(document.activeElement)) { drawerReturn.focus(); }
      drawerReturn = null;
      if (!silent) apply();
    }

    function bind() {
      $$('[data-node]', html).forEach((el) => {
        const id = el.dataset.node;
        el.addEventListener('pointerenter', () => { state.hover = id; apply(); });
        el.addEventListener('pointerleave', () => { state.hover = null; apply(); });
        el.addEventListener('click', (e) => { e.stopPropagation(); state.pinned === id ? closeDrawer() : openDrawer(id); });
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(id); } });
      });
      drawer.addEventListener('click', (e) => e.stopPropagation());
      stage.addEventListener('click', (e) => { if (!e.target.closest('.eco-bar')) closeDrawer(); });
      $$('.eco-bar .tog').forEach((b) => b.addEventListener('click', () => {
        b.classList.toggle('on');
        stage.classList.toggle('hide-' + b.dataset.tog, !b.classList.contains('on'));
      }));
      $('#playShifts').addEventListener('click', play);
    }

    let raf = 0, running = false, t0 = 0;
    function frame(t) {
      if (!running) return;
      const dt = Math.min(0.05, (t - (t0 || t)) / 1000); t0 = t;
      for (const id in flowEls) {
        const fe = flowEls[id], s = fe.samples, boost = fe.boost || 1;
        for (const p of fe.parts) {
          p.phase = (p.phase + (dt * p.speed * boost) / fe.len) % 1;
          const u = p.dir > 0 ? p.phase : 1 - p.phase;
          const fi = u * 100, i = Math.floor(fi), k = fi - i;
          const a = s[i], b = s[Math.min(100, i + 1)];
          const x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k;
          const alpha = Math.min(1, p.phase * 6, (1 - p.phase) * 6);
          p.dot.setAttribute('cx', x); p.dot.setAttribute('cy', y); p.dot.setAttribute('opacity', alpha);
          p.halo.setAttribute('cx', x); p.halo.setAttribute('cy', y); p.halo.setAttribute('opacity', alpha * 0.3);
        }
      }
      raf = requestAnimationFrame(frame);
    }

    return {
      build,
      open: openDrawer,
      enter() { $('#eraCtl') && segPlace('#eraCtl'); if (REDUCE) { running = true; frame(performance.now()); running = false; return; } running = true; t0 = 0; raf = requestAnimationFrame(frame); },
      leave() { running = false; cancelAnimationFrame(raf); stopPlay(); },
      escape() {
        if (state.pinned) { closeDrawer(); return true; }
        if (state.shift) { stopPlay(); setShift(0); return true; }
        return false;
      },
    };
  })();

  // re-measure a segmented control once its slide is visible
  function segPlace(sel) {
    const el = $(sel); if (!el) return;
    const on = $('button.on', el), th = $('.seg-thumb', el);
    if (on && th) { th.style.left = on.offsetLeft + 'px'; th.style.width = on.offsetWidth + 'px'; }
  }

  // =================================================================== VALUE CHAIN (the car + lenses)
  const vc = (() => {
    const stage = $('#vc');
    const rig = $('#rig');
    const camG = $('#cam');
    const cvs = $('#carFx');
    const ctx = cvs.getContext('2d');
    const lead = $('#leaders');
    const calls = $('#callouts');
    const legend = $('#lensLegend');
    const where = $('#where');
    const labelBox = $('#carLabels');

    // Physical order, top to bottom, so rows and parts line up and connectors do not cross.
    const ORDER = [6, 5, 4, 3, 2, 1, 7, 8];
    const BUILD = [1, 2, 3, 4, 5, 6, 7, 8];   // silicon up to services, then the two that wrap around
    const GROUND = 682, WHEELS = [[345, 626], [725, 626]];
    const SHIELD_D = 'M180 652 C168 610 172 574 206 552 C250 530 318 518 352 512 C392 472 440 434 498 424 C556 412 628 412 680 426 C734 440 782 476 818 502 C850 514 872 530 876 558 C884 590 882 628 870 656 C864 672 848 678 826 678 L214 678 C196 678 186 668 180 652 Z';
    const FLOW_D = {
      top: 'M206 604 C208 590 216 578 238 568 C272 554 322 540 372 528 C410 498 450 472 506 458 C556 448 616 446 668 454 C716 462 768 494 804 518 C826 526 844 534 850 548 C857 570 857 604 846 630',
      low: 'M206 604 C204 622 212 636 226 642 L277 642 A70 70 0 1 1 413 642 L657 642 A70 70 0 1 1 793 642 L818 642 C832 642 842 638 846 630',
      busF: 'M493 566 C460 562 440 548 400 546 C360 544 320 545 296 552 C282 556 270 564 262 572',
      busR: 'M577 566 C610 562 632 550 670 548 C710 546 750 545 776 552 C790 556 802 564 808 572',
      cloudFin: 'M528 298 C540 342 590 378 630 420',
      finChip: 'M632 498 C612 514 580 528 556 546',
      finCloud: 'M650 406 C640 360 606 326 566 298',
      harness: 'M528 738 C528 700 542 672 544 640',
    };
    const ECUS = [[299, 560], [432, 508], [650, 508], [771, 560], [261, 586], [809, 586]];
    const SENSORS = [[208, 612], [458, 486], [510, 449], [398, 522], [826, 533], [852, 600]];

    // label left edge and centre line, connector start where the label is far from its row
    const LABEL = { 6: [440, 313], 5: [704, 384], 4: [738, 458], 3: [246, 410], 2: [592, 530], 1: [472, 618], 7: [744, 676], 8: [706, 786] };
    const ANCHOR = { 3: [826, 533], 1: [832, 586] };
    const SPOT = { 1: [535, 574], 2: [541, 512], 3: [510, 449], 4: [596, 528], 5: [645, 436], 6: [502, 250], 7: [530, 408], 8: [540, 790] };
    const CAM = { 1: [535, 545, 1.14], 2: [541, 520, 1.34], 3: [530, 520, 1.03], 4: [560, 450, 1.03], 5: [640, 450, 1.24], 6: [510, 330, 1.12], 7: [530, 520, 1], 8: [585, 690, 1.18] };
    const HOME = [530, 500, 1], C0 = [530, 500];
    const WHERE = {
      6: ['Off the car', 'In the cloud', 'The data platforms and backend services the vehicle talks to.'],
      5: ['On the roof', 'Antenna and telematics unit', 'They keep the car connected to the cellular network.'],
      4: ['At every controller', 'Over the air, then everywhere', 'A package goes from cloud to antenna, then out to each controller.'],
      3: ['Around the body', 'Cameras, radar and lidar', 'The sensors that feed driver assistance and automated driving.'],
      2: ['On the central computer', 'Software, not a box', 'OS, hypervisor and middleware, running on the computer below them.'],
      1: ['Through the floor', 'Central computer and zones', 'One central computer and zonal controllers, joined by a backbone.'],
      7: ['Around everything', 'A boundary, not a part', 'It covers every connection into and out of the vehicle.'],
      8: ['Before launch', 'On the test bench', 'HIL rigs and virtual ECUs prove the car works before it ships.'],
    };
    const INTRO = ['Read it top to bottom', 'Every layer, where it lives', 'Hover a label or a row, or take the tour. Click for the deep dive.'];
    const EXPLODED = ['Exploded view', 'The same car, pulled apart', 'Each layer lines up with its row. Features flow up, money flows down.'];
    const LINKED = { 4: [1, 5, 6], 2: [1], 5: [6], 6: [5] };

    // lens colour per layer
    const HEAT = { 3: '#dc2626', 2: '#f59e0b', 1: '#22c55e' };
    const CAPC = { once: '#6366f1', mixed: '#14b8a6', recurring: '#f43f5e', spans: '#a855f7' };
    const LENSES = {
      layers: { legend: () => '<span class="ll-t">Layers</span>One colour per layer · <span class="ll-star">★</span>where W1 and W2 sit' },
      competition: {
        tint: (l) => HEAT[l.comp],
        legend: () => `<span class="ll-t">Competition</span><i style="--k:${HEAT[3]}"></i>Crowded <i style="--k:${HEAT[2]}"></i>Contested <i style="--k:${HEAT[1]}"></i>Fragmented`,
      },
      capture: {
        tint: (l) => CAPC[l.capture],
        legend: () => `<span class="ll-t">Value capture</span><i style="--k:${CAPC.once}"></i>Once per car <i style="--k:${CAPC.mixed}"></i>Per car + upgrades <i style="--k:${CAPC.recurring}"></i>Monthly <i style="--k:${CAPC.spans}"></i>Spans all`,
      },
      pockets: {
        dim: (l) => !l.pocket.star || l.pocket.screened,
        legend: () => '<span class="ll-t">Open pockets</span><span class="ll-star">★</span>Where&nbsp;<b class="ll-b">W1</b>&nbsp;and&nbsp;<b class="ll-b">W2</b>&nbsp;sit&nbsp;·&nbsp;✕&nbsp;dropped',
      },
    };

    const parts = {}, rows = {}, labels = {}, base = {}, pulse = {}, dots = {}, slabEls = {};
    let exEls = [];
    const tint = {}, layerC = {}, lv = {}, flows = {};
    let lens = 'layers', hot = null, hotSrc = null, entered = false, exploded = false, built = false;
    let running = false, raf = 0, last = 0, time = 0;
    let camT = 0, leaveT = 0, tourT = 0, touring = false, lensTimers = [];
    let carOnly = [], exOnly = [], lastE = 0;
    let rowsLeft = 970;
    const rowY = {}, rowYS = {};   // v16: row centres in car (rig) units and in stage units
    // v16: on narrower stages the car scales down (vs) so the rows keep their large type
    const CAR_L = 50, CAR_R = 940, ROWS_W = 1150, GAP = 56;
    let vs = 1, vox = 0, voy = 0, slabS = 0;

    // camera + world state
    const cam = { x: HOME[0], y: HOME[1], z: HOME[2] };
    let camTo = HOME;
    let mx = 0, my = 0, pmx = 0, pmy = 0;
    let speed = 0, speedTo = 0, roadA = 0, roadOff = 0, spin = 0;
    const ex = {}, exV = {}, exAt = {};
    let E = 0, exTarget = 0;

    // the build sequence
    let boot = null;
    let otaT0 = 0, scanT0 = -3, threatT = 6, lidarT = 0, gleamT0 = -20;
    const fx = { pool: [], rings: [], ripples: [], scan: null };
    let hexes = [], shieldP = null, dpr = 1, lastScale = 0, wheelEls = [];

    // ---------------------------------------------------------------- build
    function sample(d, n = 90) {
      const p = svgEl('path', { d }), L = p.getTotalLength(), pts = [];
      for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); pts.push([q.x, q.y]); }
      return pts;
    }
    const at = (pts, t) => {
      const f = clamp(t, 0, 1) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), k = f - i;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    };

    function buildWheels() {
      const box = $('#wheels');
      WHEELS.forEach(([cx, cy], w) => {
        let blades = '';
        for (let i = 0; i < 10; i++) blades += `<path class="blade" transform="rotate(${i * 36})" d="M0 -9 C7 -19 11 -29 9 -39"/>`;
        const g = svgEl('g', { transform: `translate(${cx} ${cy})` });
        g.innerHTML = `<g class="wheel-in" style="animation-delay:${w * 90}ms"><circle class="tire" r="56"/><circle class="tire-w" r="50"/><circle class="rim-b" r="42"/><circle class="disc" r="27"/><path class="caliper" d="M26.5 -15 A30 30 0 0 1 29.5 8"/><g class="spin">${blades}</g><circle class="blur-ring" r="27"/><circle class="hub" r="6"/></g>`;
        box.appendChild(g);
        wheelEls.push({ spin: $('.spin', g), blur: $('.blur-ring', g) });
      });
    }

    function buildSlabs() {
      const box = $('#exSlabs');
      [6, 5, 4, 3, 2, 1].forEach((id) => {
        const y = rowY[id], s = svgEl('path', { class: 'ex-slab', d: `M252 ${y - 25} L888 ${y - 25} L858 ${y + 25} L222 ${y + 25} Z` });
        s.dataset.layer = id; s.style.pointerEvents = 'none';
        box.appendChild(s); slabEls[id] = s;
      });
      box.appendChild(svgEl('path', { class: 'ex-spine', stroke: '#c7d2fe', d: `M246 ${rowY[6] - 24} V${rowY[1] + 24}` }));
      box.appendChild(svgEl('path', { class: 'ex-spine', stroke: '#4ade80', d: `M274 ${rowY[6] - 24} V${rowY[1] + 24}` }));
      // v16: the cybersecurity frame wraps the slabs at any car scale; its label sits on the bottom edge
      const fr = $('#carSvg .ex-frame');
      if (fr) { fr.setAttribute('y', (rowY[6] - 48).toFixed(1)); fr.setAttribute('height', (rowY[7] - rowY[6] + 48).toFixed(1)); }
    }

    function build() {
      Object.entries(FLOW_D).forEach(([k, d]) => { flows[k] = sample(d); });
      shieldP = new Path2D(SHIELD_D);
      buildHexes();
      buildWheels();

      ORDER.forEach((id, k) => {
        const l = layerById(id);
        const row = document.createElement('div');
        row.dataset.layer = id; row.tabIndex = 0;
        row.style.cssText = `${cv(l.colour)};--d:${k}`;
        const capl = `<span class="capl" style="--k:${CAPC[l.capture]}">${esc(CAPTURE_LABEL[l.capture])}</span>`;
        // v16: every layer, the two wrap-around ones included, has the same row: name, who plays,
        // how value is captured, the open pocket and a competition meter that fills as it lands
        row.className = `co c${l.comp}`;
        const bars = [1, 2, 3].map((i) => `<i class="${i <= l.comp ? 'on' : ''}" style="--i:${i}"></i>`).join('');
        row.innerHTML = `<div class="l1"><b class="nm">${esc(l.short)}</b><div class="chips">${(l.callLogos || []).map((s) => chip(s, 'lg')).join('')}</div><div class="r1">${pocket(l.pocket)}</div></div>
            <div class="l2"><div class="st">${rich(l.callStat)}</div><div class="r2"><span class="meter vm">${bars}<span>${esc(COMP_LABEL[l.comp])}</span></span>${capl}</div></div>`;
        calls.appendChild(row);
        rows[id] = row;

        const m = P[l.colour].m;
        const b = svgEl('path', { class: 'base', stroke: m, pathLength: 1 });
        const q = svgEl('path', { class: 'pulse', stroke: '#fff', pathLength: 1 });
        const c = svgEl('circle', { r: 3.5, fill: m });
        q.style.setProperty('--ld', `${-k * .4}s`);
        lead.append(b, q, c);
        base[id] = b; pulse[id] = q; dots[id] = c;

        const lab = document.createElement('div');
        lab.className = 'cp'; lab.dataset.layer = id;
        lab.innerHTML = `<b>${l.num}</b>${esc(l.short)}<em></em>`;
        labelBox.appendChild(lab);
        labels[id] = lab;

        parts[id] = $(`#carSvg .part[data-layer="${id}"]`);
        const halos = $$('.halo', parts[id]);
        if (halos.length) {
          const g = svgEl('radialGradient', { id: `halo${id}` });
          g.innerHTML = '<stop offset="0" style="stop-color:var(--c)" stop-opacity=".9"/><stop offset=".45" style="stop-color:var(--c)" stop-opacity=".3"/><stop offset="1" style="stop-color:var(--c)" stop-opacity="0"/>';
          parts[id].prepend(g);
          halos.forEach((c) => c.setAttribute('fill', `url(#halo${id})`));
        }
        layerC[id] = m;
        setTint(id, null);
        lv[id] = 1; ex[id] = 0; exV[id] = 0; exAt[id] = 0;
      });

      // v16: an always-visible key for the competition meters
      const lg = $('#vcLegend');
      if (lg) lg.innerHTML = '<span class="vl-t">Competition<small>team rating</small></span>' + [3, 2, 1].map((c) => `<span class="vl c${c}"><span class="meter vm">${[1, 2, 3].map((i) => `<i class="${i <= c ? 'on' : ''}"></i>`).join('')}</span><b>${esc(COMP_LABEL[c])}</b><em>${esc((window.COMP_PLAIN || {})[c] || '')}</em></span>`).join('');

      exEls = $$('#carSvg .ex').map((el) => ({
        el, id: +el.closest('.part').dataset.layer,
        ax: +el.dataset.ax, ay: +el.dataset.ay,
        tx: el.dataset.tx ? +el.dataset.tx : +el.dataset.ax,
        es: el.dataset.es ? +el.dataset.es : 1,
      }));
      carOnly = $$('#carSvg .car-only');
      exOnly = $$('#carSvg .ex-only');
      exOnly.forEach((el) => { el.style.display = 'none'; el.style.opacity = 0; });

      ORDER.forEach((id) => {
        [parts[id], labels[id], rows[id]].forEach((el) => {
          const src = el === rows[id] ? 'row' : 'part';
          el.addEventListener('pointerenter', () => { clearTimeout(leaveT); if (boot) return; stopTour(); setHot(id, src); });
          el.addEventListener('pointerleave', () => { clearTimeout(leaveT); leaveT = setTimeout(() => { if (!touring) setHot(null); }, 90); });
          el.addEventListener('click', (e) => { if (e.target.closest('.cite a')) return; e.stopPropagation(); stopTour(); dive.open(id); });
          el.addEventListener('keydown', (e) => { if (e.key === 'Enter') dive.open(id); });
          el.addEventListener('focusin', () => { if (!boot && el.matches(':focus-visible')) setHot(id, 'row'); });
          el.addEventListener('focusout', () => { if (!touring) setHot(null); });
        });
      });

      stage.addEventListener('pointermove', (e) => {
        const p = toStage(stage, e.clientX, e.clientY);
        pmx = p.x / STAGE_W - 0.5; pmy = p.y / STAGE_H - 0.5;
      });
      stage.addEventListener('pointerleave', () => { pmx = 0; pmy = 0; });
      // a click on the car while it builds skips to the finished state
      stage.addEventListener('pointerdown', () => { if (boot && boot.t > .4) finishBoot(); });

      segCtl($('#lensCtl'), (b) => setLens(b.dataset.lens));
      $('#tExplode').addEventListener('click', (e) => { if (boot) finishBoot(); setExploded(!exploded); e.currentTarget.classList.toggle('on', exploded); });
      $('#tTour').addEventListener('click', () => { if (boot) finishBoot(); touring ? (stopTour(), setHot(null)) : startTour(); });
      $('#tReplay').addEventListener('click', () => { resetView(); startBoot(); });
      setLens('layers');
      setWhere(null);
      built = true;
    }

    function resetView() {
      stopTour(); setHot(null);
      if (exploded) { exploded = false; exTarget = 0; $('#tExplode').classList.remove('on'); stage.classList.remove('exploded'); ORDER.forEach((id) => { ex[id] = 0; exV[id] = 0; }); }
    }

    // ---------------------------------------------------------------- tints, lenses, focus
    function setTint(id, c) {
      const l = layerById(id), m = c || P[l.colour].m, cl = c || P[l.colour].l;
      [parts[id], labels[id], slabEls[id]].forEach((el) => { if (el) { el.style.setProperty('--c', m); el.style.setProperty('--cl', cl); } });
      base[id].setAttribute('stroke', m); dots[id].setAttribute('fill', m);
      tint[id] = m;
    }

    function setLens(name) {
      lens = name;
      const L = LENSES[name];
      stage.dataset.lens = name;
      lensTimers.forEach(clearTimeout); lensTimers = [];
      if (built && !REDUCE && !boot) fx.scan = { t0: time, dur: .85, soft: true };
      ORDER.forEach((id) => {
        const l = layerById(id), dim = !!(L.dim && L.dim(l));
        // the new colour lands as the sweep passes this part
        const delay = REDUCE || !built || boot ? 0 : clamp((SPOT[id][0] - 180) / 700, 0, 1) * 850;
        const apply = () => setTint(id, L.tint ? L.tint(l) : null);
        if (delay) lensTimers.push(setTimeout(apply, delay)); else apply();
        parts[id].classList.toggle('dim', dim);
        labels[id].classList.toggle('dim', dim && !l.pocket.screened);
        rows[id].classList.toggle('dim', dim);
        base[id].classList.toggle('dim', dim); pulse[id].classList.toggle('dim', dim); dots[id].classList.toggle('dim', dim);
        // v15: the W1 and W2 stars show in every lens; "out" marks only in the Open pockets lens
        const em = $('em', labels[id]), t = l.pocket.target ? (l.pocket.target === 'lead' ? '★ W1' : '★ W2') : name === 'pockets' && l.pocket.screened ? '✕ OUT' : '';
        em.textContent = t; em.classList.toggle('on', !!t); em.classList.toggle('scr', !!l.pocket.screened && name === 'pockets');
      });
      legend.classList.remove('in'); void legend.offsetWidth;
      legend.innerHTML = L.legend();
      legend.classList.add('in');
      // v15: a lens change also pulls the eye to the rows on the right, where the reading is
      if (built && !boot) { calls.classList.remove('lens-in'); void calls.offsetWidth; calls.classList.add('lens-in'); }
    }

    function setWhere(id) {
      const w = id ? WHERE[id] : exploded ? EXPLODED : INTRO;
      where.classList.toggle('on', !!id);
      if (id) { where.style.setProperty('--c', tint[id]); where.style.setProperty('--cl', P[layerById(id).colour].l); }
      else { where.style.removeProperty('--c'); where.style.removeProperty('--cl'); }
      where.innerHTML = `<small>${esc(w[0])}</small><strong>${esc(w[1])}</strong><span>${esc(w[2])}</span>`;
    }

    function setHot(id, src) {
      if (hot === id) return;
      hot = id; hotSrc = src;
      stage.classList.toggle('focusing', !!id);
      stage.classList.toggle('hot-8', id === 8);
      const lensDim = (n) => { const L = LENSES[lens]; return !!(L.dim && L.dim(layerById(n))); };
      ORDER.forEach((n) => {
        const on = n === id, link = !!id && (LINKED[id] || []).includes(n);
        [parts[n], labels[n], rows[n], base[n], pulse[n]].forEach((e) => e.classList.toggle('hot', on));
        if (slabEls[n]) slabEls[n].classList.toggle('hot', on);
        parts[n].classList.toggle('linked', link); labels[n].classList.toggle('linked', link);
        const d = id ? !on : lensDim(n);
        rows[n].classList.toggle('dim', d); base[n].classList.toggle('dim', d); pulse[n].classList.toggle('dim', d); dots[n].classList.toggle('dim', d);
      });
      setWhere(id);
      clearTimeout(camT);
      // a part under the pointer must not fly away from it, so only rows and the tour move the camera
      if (id && src !== 'part' && !exploded) camT = setTimeout(() => { camTo = CAM[id]; }, touring ? 0 : 170);
      else camTo = HOME;
      if (id === 4) otaT0 = time;
      if (id === 8) scanT0 = time;
      if (id === 7) threatT = time;
    }

    function setExploded(on) {
      exploded = on; exTarget = on ? 1 : 0;
      stage.classList.toggle('exploded', on);
      camTo = HOME; clearTimeout(camT);
      const seq = on ? ORDER : [...ORDER].reverse();
      seq.forEach((id, i) => { exAt[id] = time + (REDUCE ? 0 : i * .06); });
      setWhere(hot);
    }

    // ---------------------------------------------------------------- tour
    function startTour() {
      if (exploded) { setExploded(false); $('#tExplode').classList.remove('on'); }
      touring = true;
      const btn = $('#tTour'); btn.classList.add('on'); $('span', btn).textContent = 'Stop';
      let i = 0;
      const step = () => {
        if (i >= BUILD.length) { stopTour(); setHot(null); return; }
        const id = BUILD[i++]; setHot(id, 'tour');
        tourT = setTimeout(step, id === 4 ? 6200 : 3600);
      };
      step();
    }
    function stopTour() {
      if (!touring) return;
      touring = false; clearTimeout(tourT);
      const btn = $('#tTour'); btn.classList.remove('on'); $('span', btn).textContent = 'Tour the car';
    }

    // ---------------------------------------------------------------- the build sequence
    const BOOT_K = 3.3;   // v16: the whole build plays in about 2.5 s, every time the slide is entered
    const LAYER_AT = { 1: 2.25, 2: 2.8, 3: 3.3, 4: 3.8, 5: 4.3, 6: 4.8, 7: 5.3, 8: 5.9 };
    function setBootVisual(on) {
      stage.classList.toggle('booting', on);
      ['shell-on', 'wheels-on', 'lights-on', 'bench-on'].forEach((c) => stage.classList.toggle(c, !on));
      ORDER.forEach((id) => {
        [parts[id], labels[id], rows[id], base[id], pulse[id]].forEach((e) => e.classList.toggle('off', on));
        parts[id].classList.remove('drawing');
        dots[id].style.opacity = on ? 0 : '';
      });
      where.classList.toggle('off', on);
      if (on) { $('#ln1').style.strokeDashoffset = 1; $('#ln2').style.strokeDashoffset = 1; }
      else { $('#ln1').style.strokeDashoffset = 0; $('#ln2').style.strokeDashoffset = 0; }
    }
    function revealLayer(id) {
      parts[id].classList.remove('off');
      labels[id].classList.remove('off');
      if (id === 7) { parts[7].classList.add('drawing'); setTimeout(() => parts[7].classList.remove('drawing'), 1100); }
      if (id === 8) stage.classList.add('bench-on');
      base[id].classList.remove('off'); dots[id].style.opacity = '';
      setTimeout(() => {
        if (!boot && !rows[id].classList.contains('off')) return;
        rows[id].classList.remove('off'); pulse[id].classList.remove('off');
        rows[id].classList.remove('flash'); void rows[id].offsetWidth; rows[id].classList.add('flash');
      }, 120);
      if (REDUCE) return;
      const c = tint[id], [x, y] = SPOT[id];
      fx.rings.push({ x, y, t0: time, dur: .9, r0: 8, r1: id === 1 ? 300 : 90, c, w: id === 1 ? 3 : 2 });
      if (id === 1) burst(x, y, c, 46, 240);
      if (id === 3) SENSORS.forEach(([sx, sy]) => fx.rings.push({ x: sx, y: sy, t0: time, dur: .7, r0: 3, r1: 42, c, w: 1.6 }));
      if (id === 6) for (let i = 0; i < 70; i++) { const q = at(flows.finCloud, Math.random()); fx.pool.push({ kind: 'seek', sx: q[0] + (Math.random() - .5) * 40, sy: q[1], ex: 410 + Math.random() * 190, ey: 212 + Math.random() * 82, t0: time + Math.random() * .25, dur: .55 + Math.random() * .3, c, r: 5 }); }
      if (id === 7) fx.ripples.push({ x: 530, y: 560, t0: time, dur: 1.2, c, big: true });
      if (id === 8) { scanT0 = time; }
    }
    function startBoot() {
      if (REDUCE) { setBootVisual(false); return; }
      boot = { t: 0, done: {}, k: BOOT_K, t0: performance.now() };
      fx.pool.length = 0; fx.rings.length = 0; fx.ripples.length = 0;
      speed = 0; speedTo = 0; roadA = 0; spin = 0;
      setBootVisual(true);
    }
    function stepBoot(dt) {
      boot.t = (performance.now() - boot.t0) / 1000 * boot.k;   // wall clock, so slow frames do not stretch the build
      const t = boot.t, d = boot.done;
      const once = (k, when, fn) => { if (!d[k] && t >= when) { d[k] = 1; fn(); } };
      roadA = Math.max(roadA, clamp(t / 1.2, 0, 1) * .55);
      // two laser pens leave the nose together, one over the roof and one along the sills
      const pen = clamp((t - .25) / 1.3, 0, 1), e = 1 - Math.pow(1 - pen, 2.2);
      $('#ln1').style.strokeDashoffset = (1 - e).toFixed(4);
      $('#ln2').style.strokeDashoffset = (1 - e).toFixed(4);
      if (pen > 0 && pen < 1) {
        [flows.top, flows.low].forEach((f) => {
          const q = at(f, e);
          drawSprite('#dbeafe', q[0], q[1], 34, 1);
          if (Math.random() < .9) fx.pool.push({ kind: 'spark', x: q[0], y: q[1], vx: (Math.random() - .5) * 120, vy: (Math.random() - .3) * 110, t0: time, dur: .4 + Math.random() * .45, c: '#a5b4fc', r: 7 });
        });
      }
      once('shell', 1.45, () => stage.classList.add('shell-on'));
      once('wheels', 1.72, () => stage.classList.add('wheels-on'));
      once('lights', 2.02, () => {
        stage.classList.add('lights-on');
        fx.rings.push({ x: 256, y: 568, t0: time, dur: .5, r0: 4, r1: 70, c: '#eaf2ff', w: 2 });
        fx.rings.push({ x: 828, y: 534, t0: time, dur: .5, r0: 4, r1: 46, c: '#fb7185', w: 2 });
      });
      BUILD.forEach((id) => once('L' + id, LAYER_AT[id], () => revealLayer(id)));
      once('where', 6.3, () => where.classList.remove('off'));
      once('go', 6.45, () => { speedTo = 1; gleamT0 = time; });
      once('end', 6.8, () => { boot = null; roadA = 1; stage.classList.remove('booting'); });
    }
    function finishBoot() {
      if (!boot) return;
      boot = null;
      setBootVisual(false);
      ORDER.forEach((id) => rows[id].classList.remove('flash'));
      fx.pool.length = 0; fx.rings.length = 0;
      speedTo = 1; roadA = 1;
    }

    // ---------------------------------------------------------------- canvas helpers
    const sprites = {};
    function sprite(c) {
      if (sprites[c]) return sprites[c];
      const s = document.createElement('canvas'); s.width = s.height = 64;
      const g = s.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      r.addColorStop(0, '#fff'); r.addColorStop(.16, c); r.addColorStop(.44, c + '55'); r.addColorStop(1, c + '00');
      g.fillStyle = r; g.fillRect(0, 0, 64, 64);
      return (sprites[c] = s);
    }
    function drawSprite(c, x, y, r, a) { ctx.globalAlpha = a; ctx.drawImage(sprite(c), x - r, y - r, r * 2, r * 2); }
    function burst(x, y, c, n, v) {
      for (let i = 0; i < n; i++) { const th = Math.random() * 6.283, s = v * (.3 + Math.random()); fx.pool.push({ kind: 'spark', x, y, vx: Math.cos(th) * s, vy: Math.sin(th) * s * .7, t0: time, dur: .5 + Math.random() * .6, c, r: 8 }); }
    }
    function buildHexes() {
      const R = 11, w = R * 1.732, h = R * 1.5, probe = document.createElement('canvas').getContext('2d');
      for (let y = 396, j = 0; y < 686; y += h, j++) for (let x = 170 + (j % 2 ? w / 2 : 0); x < 890; x += w) if (probe.isPointInPath(shieldP, x, y)) hexes.push([x, y]);
      hexes.R = R;
    }
    const posOf = (id) => { const e = ex[id] || 0, [x, y] = SPOT[id]; return [x, y + (rowY[id] - y) * e]; };

    function resizeFx() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.round(STAGE_W * scale * dpr);
      cvs.height = Math.round(STAGE_H * scale * dpr);
      lastScale = scale;
    }

    // ---------------------------------------------------------------- the frame
    function stepCamera(dt) {
      const k = 1 - Math.pow(.0016, dt);
      cam.x += (camTo[0] - cam.x) * k; cam.y += (camTo[1] - cam.y) * k; cam.z += (camTo[2] - cam.z) * k;
      const m = 1 - Math.pow(.02, dt);
      mx += (pmx - mx) * m; my += (pmy - my) * m;
    }
    const toScreen = (x, y) => [C0[0] + (x - cam.x) * cam.z - mx * 10, C0[1] + (y - cam.y) * cam.z - my * 7];

    function stepExplode(dt) {
      let sum = 0;
      ORDER.forEach((id) => {
        const target = time >= exAt[id] ? exTarget : 1 - exTarget;
        if (REDUCE) ex[id] = exTarget;
        else for (let left = dt; left > 0; left -= 1 / 240) { const h = Math.min(left, 1 / 240), f = (target - ex[id]) * 92 - exV[id] * 13.5; exV[id] += f * h; ex[id] += exV[id] * h; }
        sum += clamp(ex[id], 0, 1);
      });
      E = sum / ORDER.length;
    }

    function applyTransforms(dt) {
      const [sx, sy] = toScreen(0, 0);
      camG.setAttribute('transform', `matrix(${cam.z.toFixed(4)} 0 0 ${cam.z.toFixed(4)} ${sx.toFixed(2)} ${sy.toFixed(2)})`);

      exEls.forEach((p) => {
        const e = ex[p.id], ty = rowY[p.id], s = 1 + (p.es - 1) * e;
        const x = p.ax + (p.tx - p.ax) * e, y = p.ay + (ty - p.ay) * e;
        p.el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(3)}) translate(${-p.ax} ${-p.ay})`);
      });

      if (Math.abs(E - lastE) > .002) {
        const a = clamp(1 - E * 1.5, 0, 1).toFixed(3), b = clamp(E * 1.6 - .25, 0, 1).toFixed(3);
        carOnly.forEach((el) => { el.style.opacity = E > .002 ? a : ''; });
        exOnly.forEach((el) => { el.style.opacity = b; el.style.display = +b > 0 ? '' : 'none'; });
        $('#shell').style.opacity = hot ? '' : (E > .01 ? clamp(1 - E * .94, .05, 1).toFixed(3) : '');
        lastE = E;
      }
      // suspension: the car breathes while it drives
      const bob = speed * (1 - E) * Math.sin(time * 5.2) * .7;
      $('#carRoot').setAttribute('transform', `translate(0 ${bob.toFixed(2)})`);
      const depth = (1 - E);
      parts[6].setAttribute('transform', `translate(${(mx * -12 * depth).toFixed(2)} ${(my * -7 * depth).toFixed(2)})`);
      parts[8].setAttribute('transform', `translate(${(mx * 7 * depth).toFixed(2)} ${(my * 4 * depth).toFixed(2)})`);

      spin -= speed * dt * 300;
      const blur = clamp(speed * .32, 0, .32);
      wheelEls.forEach((w) => { w.spin.setAttribute('transform', `rotate(${spin.toFixed(1)})`); w.blur.style.opacity = (blur * .55).toFixed(3); });

      const g = (time - gleamT0) / 1.5;
      if (g >= 0 && g <= 1) $('#gleam').setAttribute('x', (200 + g * 1000).toFixed(1));
      if (time - gleamT0 > 11 && !boot) gleamT0 = time;

      ORDER.forEach((id) => {
        const e = clamp(ex[id], -.1, 1.1), w = labels[id].offsetWidth;
        const [lx, ly] = LABEL[id];
        const tx = 878 - w, ty = id === 7 ? rowY[7] : id === 8 ? rowY[8] : rowY[id];
        const [px, py] = toScreen(lx + (tx - lx) * e, ly + (ty - ly) * e);
        labels[id].style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      });
    }

    function drawLeaders() {
      ORDER.forEach((id) => {
        const e = clamp(ex[id], 0, 1), ry = rowYS[id], rx = rowsLeft - (hot === id ? 8 : 0);
        const lab = labels[id], w = lab.offsetWidth, [lx, ly] = LABEL[id];
        const tx = 878, ty = rowY[id];
        const a0 = ANCHOR[id] || [lx + w, ly];
        const [ax0, ay0] = toScreen(a0[0] + (tx - a0[0]) * e, a0[1] + (ty - a0[1]) * e);
        const ax = vox + ax0 * vs, ay = voy + ay0 * vs;   // v16: car units to stage units
        const k = Math.max(16, (rx - ax) * .55);
        const d = `M${ax.toFixed(1)},${ay.toFixed(1)} C${(ax + k).toFixed(1)},${ay.toFixed(1)} ${(rx - k).toFixed(1)},${ry} ${rx},${ry}`;
        base[id].setAttribute('d', d); pulse[id].setAttribute('d', d);
        dots[id].setAttribute('cx', ax.toFixed(1)); dots[id].setAttribute('cy', ay.toFixed(1));
      });
    }

    // ---------------------------------------------------------------- everything that moves fast
    function drawRoad(dt) {
      roadOff += speed * dt * 320;
      const a = roadA * (1 - E);
      if (a < .01) return;
      ctx.globalCompositeOperation = 'lighter';
      // perspective floor lines slide under the car
      ctx.lineWidth = 1;
      const grad = ctx.createLinearGradient(0, GROUND, 0, 734);
      grad.addColorStop(0, `rgba(147,167,220,${.22 * a})`); grad.addColorStop(1, 'rgba(147,167,220,0)');
      ctx.strokeStyle = grad; ctx.globalAlpha = 1;
      ctx.beginPath();
      const span = 64, o = roadOff % span;
      for (let i = -14; i < 15; i++) { const x = 530 + i * span + o; ctx.moveTo(x, GROUND + 1); ctx.lineTo(530 + (x - 530) * 1.9, 734); }
      ctx.stroke();
      // ground line
      const gl = ctx.createLinearGradient(170, 0, 900, 0);
      gl.addColorStop(0, 'rgba(165,180,252,0)'); gl.addColorStop(.2, `rgba(165,180,252,${.5 * a})`); gl.addColorStop(.8, `rgba(165,180,252,${.5 * a})`); gl.addColorStop(1, 'rgba(165,180,252,0)');
      ctx.fillStyle = gl; ctx.fillRect(170, GROUND, 730, 1.4);
      // lane dashes, nearer is faster
      [[700, 2, .3, 54, 46, .75], [716, 3.4, .42, 86, 74, 1.25]].forEach(([y, h, al, len, gap, par]) => {
        ctx.fillStyle = `rgba(199,210,254,${al * a * (.35 + speed * .65)})`;
        const per = len + gap, off = (roadOff * par) % per;
        for (let x = 130 - per + off; x < 930; x += per) ctx.fillRect(x, y, len, h);
      });
      // speed streaks low behind the car
      if (speed > .05) {
        for (let i = 0; i < 12; i++) {
          const y = 648 + ((i * 37) % 34), v = .7 + ((i * 13) % 7) / 6, len = 40 + ((i * 53) % 110);
          const x = 150 + ((roadOff * v * 1.7 + i * 173) % 800);
          const g = ctx.createLinearGradient(x, 0, x - len, 0);
          g.addColorStop(0, `rgba(199,210,254,${.2 * a * speed})`); g.addColorStop(1, 'rgba(199,210,254,0)');
          ctx.fillStyle = g; ctx.fillRect(x - len, y, len, 1.3);
        }
      }
    }

    function trail(pts, t, c, a, n = 6, r = 9) {
      for (let i = 0; i < n; i++) { const q = at(pts, t - i * .018); drawSprite(c, q[0], q[1], r * (1 - i / (n + 1)), a * (1 - i / n)); }
    }
    function fxLevel(id) {
      const target = hot ? (hot === id ? 1.7 : (LINKED[hot] || []).includes(id) ? .55 : .06) : 1;
      lv[id] += (target - lv[id]) * .1;
      const l = LENSES[lens]; const dim = l.dim && l.dim(layerById(id)) ? .2 : 1;
      return lv[id] * dim * (1 - E) * (parts[id].classList.contains('off') ? 0 : 1);
    }

    function drawFlows(dt) {
      ctx.globalCompositeOperation = 'lighter';
      // 01: traffic on the backbone, both directions
      let a = fxLevel(1);
      if (a > .02) {
        const c = tint[1];
        for (let i = 0; i < 3; i++) {
          const p = (time * .42 + i / 3) % 1, b = (time * .34 + i / 3 + .2) % 1;
          trail(flows.busF, p, c, a * .95); trail(flows.busR, p, c, a * .95);
          drawSprite('#ffffff', ...at(flows.busF, 1 - b), 7, a * .5); drawSprite('#ffffff', ...at(flows.busR, 1 - b), 7, a * .5);
        }
        drawSprite(c, 535, 574, 68 + Math.sin(time * 3) * 7, a * .22);
      }
      // 02: the plates tick over
      a = fxLevel(2);
      if (a > .02) for (let i = 0; i < 3; i++) { const y = 532 - i * 14, p = (time * .5 + i * .28) % 1; drawSprite(tint[2], 513 + p * 54, y, 7, a * .9 * Math.sin(p * 3.14)); }
      // 03: lidar rings on the road, radar arcs off both bumpers, a sweep on the puck
      a = fxLevel(3);
      if (a > .02) {
        const c = tint[3];
        ctx.strokeStyle = c;
        for (let i = 0; i < 3; i++) {
          const p = ((time / 3.2) + i / 3) % 1;
          ctx.globalAlpha = a * (1 - p) * .55; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.ellipse(510, GROUND + 2, 60 + p * 390, 6 + p * 40, 0, 0, 6.283); ctx.stroke();
        }
        [[208, 612, Math.PI], [852, 600, 0]].forEach(([x, y, th]) => {
          for (let i = 0; i < 3; i++) {
            const p = ((time / 1.7) + i / 3) % 1, r = 8 + p * (th ? 56 : 40);
            ctx.globalAlpha = a * (1 - p) * .9; ctx.lineWidth = 1.7;
            ctx.beginPath(); ctx.arc(x, y, r, th - .5, th + .5); ctx.stroke();
          }
        });
        const sw = time * 2.6;
        drawSprite(c, 510 + Math.cos(sw) * 17, 448 + Math.sin(sw) * 3.5, 8, a);
        // the lidar reads back a point cloud along the road
        for (let i = 0; i < 26; i++) {
          const q = (i * 97.13 + Math.floor(time * 2.2 + i * .13) * 41.7) % 1, side = i % 2 ? 1 : -1, xx = 510 + side * (340 + ((i * 53) % 90) * (q + .2));
          if (xx > 178 && xx < 900) drawSprite(c, xx, GROUND + 6 + ((i * 11) % 28), 2.6, a * .65);
        }
      }
      // 04: one package, cloud to antenna to computer to every controller
      a = fxLevel(4);
      if (a > .02) {
        const c = tint[4], p = ((time - otaT0) % 6) / 6;
        const pkg = (x, y, s = 6) => { drawSprite(c, x, y, s * 3.4, a); ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = '#fff'; ctx.fillRect(x - s * .7, y - s * .7, s * 1.4, s * 1.4); ctx.fillStyle = c; ctx.fillRect(x - s * .45, y - s * .45, s * .9, s * .9); ctx.restore(); };
        if (p < .22) pkg(...at(flows.cloudFin, p / .22));
        else if (p >= .24 && p < .36) pkg(...at(flows.finChip, (p - .24) / .12));
        else if (p >= .37 && p < .5) { const t = (p - .37) / .13; pkg(...at(flows.busF, t), 5); pkg(...at(flows.busR, t), 5); }
        if (p >= .5 && p < .68) {
          const t = (p - .5) / .18;
          ctx.strokeStyle = c; ctx.lineWidth = 2;
          ECUS.forEach(([x, y]) => { ctx.globalAlpha = a * (1 - t); ctx.beginPath(); ctx.arc(x, y, 8 + t * 22, 0, 6.283); ctx.stroke(); drawSprite(c, x, y, 18, a * (1 - t) * .9); });
        }
      }
      // 05 + 06: telemetry leaves through the roof for the cloud
      a = Math.max(fxLevel(5), fxLevel(6));
      if (a > .02) for (let i = 0; i < 4; i++) trail(flows.finCloud, (time * .3 + i / 4) % 1, tint[6], a * .9, 5, 7);
      // 08: bench signals up the harness
      a = fxLevel(8);
      if (a > .02) for (let i = 0; i < 2; i++) trail(flows.harness, (time * .5 + i / 2) % 1, tint[8], a, 4, 7);

      // 08: a scan passes through the car, and everything it touches answers
      const s = time - scanT0;
      const scanEvery = hot === 8 ? 3 : 8.5;
      if (!boot && s > scanEvery) scanT0 = time;
      if (s >= 0 && s < 2 && !(parts[8].classList.contains('off'))) {
        const t = s / 2, x = 180 + t * 710, al = fxLevel(8) ? Math.min(1, lv[8] + .35) * (1 - E) : 0;
        if (al > .02) {
          ctx.save(); ctx.clip(shieldP);
          const g = ctx.createLinearGradient(x - 90, 0, x + 6, 0), c = tint[8];
          g.addColorStop(0, c + '00'); g.addColorStop(.85, c + '38'); g.addColorStop(1, '#ffffffb0');
          ctx.fillStyle = g; ctx.globalAlpha = al; ctx.fillRect(x - 90, 395, 96, 290);
          ctx.restore();
          [...SENSORS, ...ECUS].forEach(([px, py]) => { const d = Math.abs(px - x); if (d < 46) drawSprite(c, px, py, 20, al * (1 - d / 46)); });
        }
      }
      // lens sweep: a clean band carries the new colour across the car
      if (fx.scan) {
        const t = (time - fx.scan.t0) / fx.scan.dur;
        if (t >= 1) fx.scan = null;
        else {
          const x = 180 + t * 720;
          const g = ctx.createLinearGradient(x - 70, 0, x + 70, 0);
          g.addColorStop(0, '#ffffff00'); g.addColorStop(.5, '#ffffff55'); g.addColorStop(1, '#ffffff00');
          ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(x - 70, 180, 140, 680);
        }
      }
    }

    function drawHexRipples() {
      if (parts[7].classList.contains('off') && !fx.ripples.length) return;
      const a7 = fxLevel(7);
      // attacks arrive from outside, and the boundary lights up where they land
      if (!boot && !parts[7].classList.contains('off') && E < .3 && a7 > .02 && time > threatT) {
        const th = 3.6 + Math.random() * 2.3, tx = 530 + Math.cos(th) * 300, ty = 560 + Math.sin(th) * 150;
        fx.pool.push({ kind: 'threat', sx: tx + Math.cos(th) * 170, sy: ty + Math.sin(th) * 110, ex: tx, ey: ty, t0: time, dur: .5, c: '#fb7185', r: 9 });
        threatT = time + (hot === 7 ? .55 : 4 + Math.random() * 3);
      }
      fx.ripples = fx.ripples.filter((r) => time - r.t0 < r.dur);
      if (!fx.ripples.length) return;
      ctx.globalCompositeOperation = 'lighter';
      const R = hexes.R;
      fx.ripples.forEach((r) => {
        const t = (time - r.t0) / r.dur, rad = t * (r.big ? 520 : 170), band = r.big ? 54 : 30;
        ctx.strokeStyle = r.c; ctx.lineWidth = 1.1; ctx.globalAlpha = (1 - t) * .85;
        ctx.beginPath();
        hexes.forEach(([x, y]) => {
          const d = Math.hypot(x - r.x, (y - r.y) * 1.2);
          if (Math.abs(d - rad) > band) return;
          for (let k = 0; k < 6; k++) { const an = .5236 + k * 1.0472, hx = x + Math.cos(an) * R, hy = y + Math.sin(an) * R; k ? ctx.lineTo(hx, hy) : ctx.moveTo(hx, hy); }
          ctx.closePath();
        });
        ctx.stroke();
      });
    }

    function drawPool(dt) {
      ctx.globalCompositeOperation = 'lighter';
      fx.rings = fx.rings.filter((r) => time - r.t0 < r.dur);
      fx.rings.forEach((r) => {
        const t = (time - r.t0) / r.dur, e = 1 - Math.pow(1 - t, 3);
        ctx.strokeStyle = r.c; ctx.lineWidth = r.w * (1 - t) + .4; ctx.globalAlpha = 1 - t;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r0 + (r.r1 - r.r0) * e, 0, 6.283); ctx.stroke();
      });
      if (fx.pool.length > 500) fx.pool.splice(0, fx.pool.length - 500);
      fx.pool = fx.pool.filter((p) => {
        const t = (time - p.t0) / p.dur;
        if (t >= 1) {
          if (p.kind === 'threat') { fx.ripples.push({ x: p.ex, y: p.ey, t0: time, dur: .7, c: tint[7] }); fx.rings.push({ x: p.ex, y: p.ey, t0: time, dur: .4, r0: 3, r1: 26, c: '#ffffff', w: 2 }); }
          return false;
        }
        if (t < 0) return true;
        if (p.kind === 'spark') { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt; drawSprite(p.c, p.x, p.y, p.r * (1 - t * .6), (1 - t) * .95); }
        else if (p.kind === 'seek') { const e = t * t * (3 - 2 * t); drawSprite(p.c, p.sx + (p.ex - p.sx) * e, p.sy + (p.ey - p.sy) * e, p.r, Math.sin(t * 3.14)); }
        else if (p.kind === 'threat') { const x = p.sx + (p.ex - p.sx) * t, y = p.sy + (p.ey - p.sy) * t; drawSprite(p.c, x, y, p.r, .4 + t * .6); }
        else if (p.kind === 'coin') {
          ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.sin(t * 3.14) * p.a; ctx.fillStyle = '#86efac'; ctx.font = '800 17px var(--display), sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('$', p.x + Math.sin(t * 6 + p.ph) * 5, p.y - t * 62); ctx.restore();
        }
        return true;
      });
    }

    // the lenses change what moves, not only the colour
    let coinAt = {}, pingAt = 0;
    const COIN_EVERY = { recurring: .55, mixed: 1.9, once: 5.2, spans: 3 };
    const SWARM = { 3: 13, 2: 6, 1: 2 };
    function drawLensFx() {
      if (lens === 'competition') {
        ctx.globalCompositeOperation = 'lighter';
        ORDER.forEach((id) => {
          const l = layerById(id), [x, y] = posOf(id), n = SWARM[l.comp] || 0, R = id === 6 ? 96 : id === 7 ? 54 : 46;
          const f = hot && hot !== id ? .15 : 1;
          for (let i = 0; i < n; i++) {
            const a = time * (.5 + (i % 5) * .13) * (i % 2 ? 1 : -1) + i * 2.4, r = R * (.75 + ((i * 37) % 10) / 22);
            drawSprite(tint[id], x + Math.cos(a) * r, y + Math.sin(a) * r * .55, 5.5, .85 * f);
          }
        });
      } else if (lens === 'capture') {
        ORDER.forEach((id) => {
          const l = layerById(id);
          if (!coinAt[id] || time > coinAt[id]) {
            const [x, y] = posOf(id);
            fx.pool.push({ kind: 'coin', x: x + (Math.random() - .5) * 26, y: y - 8, t0: time, dur: 1.5, ph: Math.random() * 6, a: hot && hot !== id ? .2 : 1 });
            coinAt[id] = time + COIN_EVERY[l.capture] * (.85 + Math.random() * .3);
          }
        });
      } else if (lens === 'pockets' && time > pingAt) {
        ORDER.forEach((id) => { const l = layerById(id); if (l.pocket.target) { const [x, y] = posOf(id); fx.rings.push({ x, y, t0: time, dur: 1.5, r0: 10, r1: 92, c: '#fcd34d', w: 2.4 }); } });
        pingAt = time + 1.9;
      }
    }

    function drawSpine() {
      if (E < .35) return;
      ctx.globalCompositeOperation = 'lighter';
      const top = rowY[6] - 24, bot = rowY[1] + 24, a = clamp((E - .35) / .5, 0, 1);
      for (let i = 0; i < 5; i++) {
        const p = (time * .16 + i / 5) % 1;
        drawSprite('#c7d2fe', 246, bot - (bot - top) * p, 7, a * Math.sin(p * 3.14));
        const q = (time * .13 + i / 5) % 1;
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = a * Math.sin(q * 3.14); ctx.fillStyle = '#86efac'; ctx.font = '800 14px var(--display), sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('$', 274, top + (bot - top) * q + 5); ctx.restore();
      }
    }

    function drawFx(dt) {
      if (scale !== lastScale) resizeFx();
      const k = scale * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const [sx, sy] = toScreen(0, 0);
      ctx.setTransform(k * cam.z, 0, 0, k * cam.z, k * sx, k * sy);
      drawRoad(dt);
      if (boot) stepBoot(dt);
      drawFlows(dt);
      drawHexRipples();
      drawLensFx();
      drawSpine();
      drawPool(dt);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }

    function layout() {
      const s = clamp((stageW - 40 - ROWS_W - GAP - CAR_L) / (CAR_R - CAR_L), .74, 1);
      vs = s; vox = CAR_L * (1 - s); voy = 640 * (1 - s);
      rig.style.transform = s < 1 ? `translate(${vox.toFixed(1)}px, ${voy.toFixed(1)}px) scale(${s.toFixed(4)})` : '';
      rig.style.transformOrigin = '0 0';
      const left = Math.round(vox + CAR_R * s + GAP);
      stage.style.setProperty('--vcS', s.toFixed(4));
      stage.style.setProperty('--vcL', left + 'px');
      stage.style.setProperty('--vcMT', Math.max(0, (150 - voy) / s).toFixed(1) + 'px');   // the soft top edge stays at stage y 150
      stage.classList.toggle('vc-compact', stageW - 40 - left < 1080);
      stage.classList.toggle('vc-tight', stageW - 40 - left < 900);
    }
    function measureRows() {
      layout();
      rowsLeft = calls.offsetLeft;
      ORDER.forEach((id) => { rowYS[id] = calls.offsetTop + rows[id].offsetTop + rows[id].offsetHeight / 2; rowY[id] = (rowYS[id] - voy) / vs; });
      // the exploded-view slabs sit on the rows, so redraw them when the car scale changes
      if ($('#exSlabs').firstChild && Math.abs(slabS - vs) > .001) {
        $('#exSlabs').innerHTML = ''; buildSlabs();
        ORDER.forEach((id) => setTint(id, tint[id] === P[layerById(id).colour].m ? null : tint[id]));
      }
      if ($('#exSlabs').firstChild) slabS = vs;
    }

    function frame(now) {
      if (!running) return;
      const dt = last ? Math.min(.12, (now - last) / 1000) : .016;
      last = now; time += dt;
      speed += (speedTarget() - speed) * (1 - Math.pow(.25, dt));
      stepCamera(dt);
      stepExplode(dt);
      applyTransforms(dt);
      drawLeaders();
      if (REDUCE) { if (scale !== lastScale) resizeFx(); } else drawFx(dt);
      raf = requestAnimationFrame(frame);
    }
    const speedTarget = () => (REDUCE ? 0 : speedTo * (exploded ? 0 : hot ? .32 : 1));

    return {
      build,
      remeasure: measureRows,
      enter() {
        segPlace('#lensCtl');
        measureRows();
        if (!$('#exSlabs').firstChild) { buildSlabs(); ORDER.forEach((id) => setTint(id, tint[id] === P[layerById(id).colour].m ? null : tint[id])); }
        resizeFx();
        running = true; last = 0;
        raf = requestAnimationFrame(frame);
        entered = true;
        // v16: a quick build (car, then each layer and its row, meters filling) on every entry;
        // reduced motion and the PDF export show the finished state
        if (REDUCE || EXPORT) { speedTo = REDUCE ? 0 : 1; roadA = 1; setBootVisual(false); return; }
        resetView();
        startBoot();
      },
      leave() {
        running = false; cancelAnimationFrame(raf);
        if (boot) finishBoot();
        stopTour(); clearTimeout(camT); clearTimeout(leaveT); setHot(null);
      },
    };
  })();

  // =================================================================== DEEP DIVE
  const dive = (() => {
    const wrap = $('#dive');
    const stage = $('#diveStage');
    let cur = 0;
    const tiles = [
      ['trend', 'What winning looks like', 'winning'],
      ['castle', 'Moats & growth drivers', 'moats'],
      ['target', 'Critical, and where competition is low', 'critical'],
      ['alert', 'Engineering pain points', 'pain'],
    ];
    function render(id, hlKey) {
      const l = layerById(id);
      cur = id;
      const nav = LAYERS.map((x) => `<button class="dn${x.id === id ? ' cur' : ''}" data-l="${x.id}" style="${cv(x.colour)}" title="${esc(x.name)}"><i></i>${x.num}<span>${esc(x.short)}</span></button>`).join('');
      const tileHtml = tiles.map(([ic, h, key], k) => {
        let body = `<ul>${l[key].map((b) => `<li>${rich(b)}</li>`).join('')}</ul>`;
        if (key === 'winning') body += `<div class="kpi"><b>KPIs</b>${esc(l.kpis)}</div>`;
        if (key === 'critical' && l.critPocket) body += pocket(l.critPocket);
        if (key === 'pain' && LAYER_FIT[l.id]) body += `<div class="kpi"><b>Where our skills fit</b>${esc(LAYER_FIT[l.id])}</div>`;
        return `<section class="tile" style="--d:${k}"><div class="tile-h"><span>${icon(ic)}</span><h4>${esc(h)}</h4></div>${body}</section>`;
      }).join('');
      // v17: three big tiles of facts we can defend (window.LAYER_DIVE), not four tiles of small bullets
      const D17 = (window.LAYER_DIVE || {})[l.id];
      let bodyHtml = `<div class="dv-right">${tileHtml}</div>`;
      if (D17) {
        const bars = [1, 2, 3].map((i) => `<i class="${i <= l.comp ? 'on' : ''}"></i>`).join('');
        const compName = { 3: 'Crowded', 2: 'Contested', 1: 'Fragmented' }[l.comp];
        const lvl = D17.fit[0], pk = l.pocket;
        const pkTag = pk && D17.tag ? D17.tag : pk && (pk.target ? (pk.target === 'lead' ? 'W1' : 'W2') : pk.screened ? (pk.label || 'screened out') : '');
        bodyHtml = `<div class="dv-right dv3">
          <section class="tile t-money" style="--d:0"><div class="tile-h"><span>${icon('trend')}</span><h4>How money is made</h4></div>
            <p class="t-big">${rich(D17.money)}</p><p class="t-proof">${rich(D17.proof)}</p></section>
          <section class="tile t-pain" style="--d:1"><div class="tile-h"><span>${icon('alert')}</span><h4>Where engineers struggle</h4></div>
            <ul>${D17.pains.map((p) => `<li>${rich(p)}</li>`).join('')}</ul></section>
          <section class="tile t-fit" style="--d:2"><div class="tile-h"><span>${icon('target')}</span><h4>Is there room for us?</h4><b class="lvl lvl-${lvl.toLowerCase()}">${esc(lvl)} fit</b></div>
            <p class="t-fit-p">${rich(D17.fit[1])}</p>
            ${pk ? `<div class="t-pk${pk.star && !pk.screened ? ' on' : ''}${pk.none ? ' none' : ''}"><small>${pk.none ? 'Open space' : 'Our pocket here'}</small><span>${esc(pk.text)}</span>${pkTag ? `<em>${esc(pkTag)}</em>` : ''}</div>` : ''}
          </section>
        </div>`;
        stage.innerHTML = `<div class="dv dv17" style="${cv(l.colour)}">
        <div class="dv-left">
          <div class="dv-big">${l.num}</div>
          <div class="dv-k">${esc(l.kicker)}</div>
          <div class="dv-name">${esc(l.name)}</div>
          <div class="dv-scope">${esc(D17.scope || l.scope)}</div>
          <div class="dv-comp"><span class="dv-bars">${bars}</span><b>${compName}</b><span>${esc((window.COMP_PLAIN || {})[l.comp] || '')}</span></div>
          <div class="dv-stat">${esc(l.stat)}</div>
          <div class="dv-statcap">${rich(D17.cap || l.statcap)}</div>
          <div class="dv-who">Who plays</div>
          ${chips(l.logos.slice(0, 6), 'lg')}
        </div>
        <nav class="dv-nav">${nav}<div class="arrows">
          <button data-step="-1" aria-label="Previous layer"><svg viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg></button>
          <button data-step="1" aria-label="Next layer"><svg viewBox="0 0 24 24"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg></button></div></nav>
        <button class="x" aria-label="Close deep dive">×</button>
        ${bodyHtml}
      </div>`;
      } else {
      const capRow = `<div class="dv-tags">${meter(l.comp)}<span class="dv-cap">${esc(CAPTURE_LABEL[l.capture])}</span></div>`;
      stage.innerHTML = `<div class="dv" style="${cv(l.colour)}">
        <div class="dv-left">
          <div class="dv-big">${l.num}</div>
          <div class="dv-ico">${icon(l.icon)}</div>
          <div class="dv-k">${esc(l.kicker)}</div>
          <div class="dv-name">${esc(l.name)}</div>
          <div class="dv-scope">${esc(l.scope)}</div>
          ${capRow}
          <div class="dv-stat">${esc(l.stat)}</div>
          <div class="dv-statcap">${rich(l.statcap)}</div>
          <div class="dv-who">WHO PLAYS</div>
          ${chips(l.logos, 'lg')}
        </div>
        <nav class="dv-nav">${nav}<div class="arrows">
          <button data-step="-1" aria-label="Previous layer"><svg viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg></button>
          <button data-step="1" aria-label="Next layer"><svg viewBox="0 0 24 24"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg></button></div></nav>
        <button class="x" aria-label="Close deep dive">×</button>
        <div class="dv-right">${tileHtml}</div>
      </div>`;
      }
      $$('.dn', stage).forEach((b) => b.addEventListener('click', () => render(+b.dataset.l)));
      $$('[data-step]', stage).forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
      $('.x', stage).addEventListener('click', close);
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.tile', stage).forEach((t) => t.classList.add('in'))));
      if (!REDUCE) {
        const st = $('.dv-stat', stage);
        st.animate([{ opacity: 0, transform: 'translateY(16px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', delay: 150, fill: 'backwards' });
        $('.dv-left', stage).animate([{ filter: 'brightness(1.4)' }, { filter: 'none' }], { duration: 600 });
      }
      if (hlKey) setTimeout(() => flashChip(stage, hlKey), 300);
    }
    function step(d) { const n = ((cur - 1 + d + LAYERS.length) % LAYERS.length) + 1; render(n); }
    function open(id, hlKey) {
      const was = wrap.classList.contains('open');
      render(id, hlKey); wrap.classList.add('open'); wrap.setAttribute('aria-hidden', 'false'); hideTip();
      if (!was) modal.open(wrap, () => $('.x', stage));
    }
    function close() { if (!wrap.classList.contains('open')) return; wrap.classList.remove('open'); wrap.setAttribute('aria-hidden', 'true'); modal.close(wrap); }
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    return { open, close, step, isOpen: () => wrap.classList.contains('open') };
  })();

  // =================================================================== GROWTH CHART
  // v16: the three-measure toggle is gone; the slide is built by the v16:grow module
  const pools = { build() {}, ready() {} };

  // =================================================================== WHITESPACE
  const ws = (() => {
    const stage = $('#ws');
    const dotsBox = $('#dots');
    const links = $('#wsLinks');
    const PW = 820, PH = 510, OX = 60 + 74, OY = 190 + 20;
    const dotEls = {};
    function build() {
      DOTS.forEach((d, k) => {
        const el = document.createElement('div');
        el.className = `wd${d.cand ? ' is-cand' : ''}${d.left ? ' left' : ''}`;
        el.style.cssText = `${cv(d.colour)};left:${d.x * PW}px;top:${(1 - d.y) * PH}px;--d:${k}`;
        el.innerHTML = `<i>${d.cand ? candMark(d.cand) : ''}</i><span>${esc(d.label)}</span>`;
        const l = layerById(d.layer);
        el.tabIndex = 0; el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `${d.label}: layer ${l.num} ${l.short}, ${COMP_LABEL[l.comp].toLowerCase()}${d.cand ? `, ${candStatus(d.cand)}` : ''}. Opens the layer deep dive.`);
        const tipHtml = (how) => `<b>${esc(d.label)}</b>Layer ${l.num} · ${esc(l.short)} · ${esc(COMP_LABEL[l.comp].toLowerCase())}${d.cand ? `<br><span style="color:var(--gold-l)">★ Shortlisted · ${esc(candStatus(d.cand))}</span>` : ''}<br><span style="color:var(--faint)">Team placement · ${how} for the layer deep dive</span>`;
        el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); showTip(tipHtml('Enter'), r.right, r.bottom); if (d.cand) hotCand(d.cand); });
        el.addEventListener('blur', () => { hideTip(); if (d.cand) hotCand(null); });
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dive.open(d.layer); } });
        el.addEventListener('pointermove', (e) => showTip(tipHtml('click'), e.clientX, e.clientY));
        el.addEventListener('pointerleave', () => { hideTip(); if (d.cand) hotCand(null); });
        el.addEventListener('pointerenter', () => { if (d.cand) hotCand(d.cand); });
        el.addEventListener('click', () => dive.open(d.layer));
        dotsBox.appendChild(el);
        if (d.cand) dotEls[d.cand] = { el, d };
      });
      const box = $('#cands');
      CANDIDATES.forEach((c, k) => {
        const el = document.createElement('article');
        el.className = 'cand'; el.tabIndex = 0;
        el.dataset.n = c.n;
        el.style.cssText = `${cv(c.colour)};--d:${k}`;
        el.classList.toggle('screened', !!c.screened);
        const badge = c.target ? `<span class="c-out r">Round 1 #${c.target}</span>` : c.screened ? '<span class="c-out s">Screened out in Round 1</span>' : '';
        el.innerHTML = `<span class="cn">${candMark(c.n)}</span><h4>${esc(c.title)}</h4><span class="ctag">${esc(c.tag)}</span>${badge}
          <p>${rich(c.text)}</p><div class="per c-now">${esc(c.now)}</div>`;
        el.classList.toggle('old-out', !!c.out);
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `${c.title}. ${c.target ? 'Round 1 target ' + c.target : c.screened ? 'Screened out' : ''}. ${c.now}. Opens its dossier.`);
        el.addEventListener('pointerenter', () => hotCand(c.n));
        el.addEventListener('pointerleave', () => hotCand(null));
        el.addEventListener('focus', () => hotCand(c.n));
        el.addEventListener('blur', () => hotCand(null));
        const openIt = () => dossier.show(c.id, true);
        el.addEventListener('click', openIt);
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); } });
        box.appendChild(el);
      });
      $('.q-ws').addEventListener('pointerenter', () => $('#matrix').classList.add('ws-only'));
      $('.q-ws').addEventListener('pointerleave', () => $('#matrix').classList.remove('ws-only'));
    }
    function hotCand(n) {
      links.innerHTML = '';
      $$('.cand', stage).forEach((c) => c.classList.toggle('hot', +c.dataset.n === n));
      Object.values(dotEls).forEach(({ el, d }) => el.classList.toggle('hot', d.cand === n));
      if (!n) return;
      const { d } = dotEls[n];
      const card = $(`.cand[data-n="${n}"]`, stage);
      const r = card.getBoundingClientRect();
      const a = toStage(stage, r.left, r.top + r.height / 2);
      a.x -= links.offsetLeft; // v14: the links layer may be shifted on a wide stage
      const bx = OX + d.x * PW, by = OY + (1 - d.y) * PH;
      links.appendChild(svgEl('path', { d: `M${a.x - 2},${a.y} C${a.x - 120},${a.y} ${bx + 160},${by} ${bx + 20},${by}`, stroke: P[candOf(n).colour].l }));
    }
    return { build, leave() { hotCand(null); } };
  })();

  // =================================================================== EVIDENCE AUDIT SLIDE
  // v16: bigger type, one line of metadata per claim, no hand-check notes (they confused readers)
  const fc = (() => {
    const list = $('#fcList');
    const COLORS = { verified: '#22c55e', corrected: '#f59e0b', forecast: '#a78bfa', estimate: '#38bdf8', hypothesis: '#94a3b8' };
    let filter = 'all', tab = 'claims', segApi = null;
    const counts = {};
    CLAIMS.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    const nVC = (counts.verified || 0) + (counts.corrected || 0);
    const nFlag = CLAIMS.length - nVC;
    const nPend = CLAIMS.filter((c) => c.pending).length;
    const nSrc = SRC_IDS.filter((id) => !SOURCES[id].post).length;

    function build() {
      const tot = $('#fcTotal');
      tot.dataset.count = CLAIMS.length;
      tot.textContent = CLAIMS.length;
      $('#fcSub').textContent = `Checked against ${nSrc} sources. ${nVC} verified or corrected, ${nFlag} clearly labelled as forecasts, estimates or team hypotheses.`;
      $('#fcSplit').innerHTML = `<div class="ax-st axv"><b data-count="${nVC}">${nVC}</b><span>verified or corrected</span></div><div class="ax-st axf"><b data-count="${nFlag}">${nFlag}</b><span>labelled as forecasts, estimates or hypotheses</span></div>`;
      $('#fcBar').innerHTML = Object.keys(STATUS).map((k) => counts[k] ? `<i style="flex:${counts[k]};background:${COLORS[k]}" title="${esc(STATUS[k].label)}: ${counts[k]}"></i>` : '').join('');
      $$('#fcBar i').forEach((x, k) => x.style.setProperty('--b', k));
      const f = $('#fcFilters');
      const btn = (k, label, n, desc, i) => `<button class="ax-f${k === filter ? ' on' : ''}" data-f="${k}" style="--k:${COLORS[k] || '#e2e8f0'};--i:${i}" aria-pressed="${k === filter}" title="${esc(desc)}"><i></i><b>${esc(label)}</b><em>${n}</em></button>`;
      f.innerHTML = btn('all', 'All claims', CLAIMS.length, 'Everything audited', 0) +
        Object.keys(STATUS).filter((k) => counts[k]).map((k, i) => btn(k, STATUS[k].label, counts[k], STATUS[k].desc, i + 1)).join('');
      $$('.ax-f', f).forEach((b) => b.addEventListener('click', () => {
        filter = b.dataset.f;
        $$('.ax-f', f).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        if (tab !== 'claims') segApi.set('claims', 'tab');
        render();
      }));
      segApi = segCtl($('#fcTabs'), (b) => { tab = b.dataset.tab; list.setAttribute('aria-labelledby', b.id); render(); });
      render();
    }
    function srcLink(id) {
      const s = SOURCES[id]; if (!s) return '';
      const body = `[${srcNum(id)}] ${esc(s.pub)} · ${esc(s.date)}`;
      return s.url ? `<a class="ax-src" href="${esc(s.url)}" target="_blank" rel="noopener">${body} ↗</a>` : `<span class="ax-src">${body}</span>`;
    }
    function render() {
      list.classList.remove('in'); void list.offsetWidth;
      if (tab === 'claims') {
        const items = CLAIMS.filter((c) => filter === 'all' || c.status === filter);
        const desc = filter === 'all' ? '' : `<p class="ax-intro" style="--k:${COLORS[filter]}"><b>${esc(STATUS[filter].label)}:</b> ${esc(STATUS[filter].desc)}</p>`;
        list.innerHTML = desc + items.map((c, i) => `<div class="ax-row" style="--k:${COLORS[c.status]};--i:${Math.min(i, 10)}">
            <span class="ax-pill">${esc(STATUS[c.status].label)}</span>
            <div class="ax-m"><p>${esc(c.claim)}</p><div class="ax-meta"><span>${esc(c.slide)}</span>${srcLink(c.src)}</div></div></div>`).join('');
      } else if (tab === 'sources') {
        list.innerHTML = SRC_IDS.map((id, i) => {
          const s = SOURCES[id];
          return `<div class="ax-row ax-srow" style="--i:${Math.min(i, 10)}"><span class="ax-num k-${s.kind}">${srcNum(id)}</span>
            <div class="ax-m"><p><b>${esc(s.pub)}</b>: ${esc(s.title)}</p><div class="ax-meta"><span>${esc(KIND[s.kind])} · ${esc(s.date)}</span>${s.url ? `<a class="ax-src" href="${esc(s.url)}" target="_blank" rel="noopener">Open source ↗</a>` : '<span class="ax-src plain">Team document</span>'}</div></div></div>`;
        }).join('');
      } else {
        list.innerHTML = GLOSSARY.map(([t, d], i) => `<div class="ax-row ax-grow" style="--i:${Math.min(i, 10)}"><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('');
      }
      list.scrollTop = 0;
      list.classList.add('in');
    }
    return { build, enter() { segPlace('#fcTabs'); }, counts: { nVC, nFlag, nPend, nSrc } };
  })();

  // =================================================================== COMPANY FINDER
  const finder = (() => {
    const wrap = $('#finder');
    const input = $('#finderInput');
    const out = $('#finderList');
    const index = new Map();
    let sel = 0, results = [];
    function add(spec, role) {
      const name = specName(spec);
      if (!name) return;
      const key = name.toLowerCase();
      if (!index.has(key)) {
        const id = spec[0] === '=' ? null : spec.split('|')[0];
        index.set(key, { name, key, logo: id, roles: [] });
      }
      const e = index.get(key);
      if (!e.roles.some((r) => r.kind === role.kind && r.id === role.id)) e.roles.push(role);
    }
    function build() {
      LAYERS.forEach((l) => [...(l.callLogos || []), ...l.logos].forEach((s) => add(s, { kind: 'layer', id: l.id, label: `${l.num} ${l.short}`, colour: l.colour })));
      ACTORS.forEach((a) => a.logos.forEach((s) => add(s, { kind: 'actor', id: a.id, label: a.title, colour: a.colour })));
      HUB.oems.forEach((o) => add(o, { kind: 'actor', id: 'hub', label: 'OEM hub', colour: 'Ltwo' }));
      input.addEventListener('input', () => { sel = 0; render(); });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { sel = Math.min(results.length - 1, sel + 1); mark(); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); mark(); e.preventDefault(); }
        else if (e.key === 'Enter') { const r = results[sel]; if (r) jump(r, r.roles[0]); e.preventDefault(); }
        else if (e.key === 'Escape') { close(); e.preventDefault(); }
      });
      wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    }
    function render() {
      const q = input.value.trim().toLowerCase();
      results = [...index.values()].filter((e) => !q || e.key.includes(q))
        .sort((a, b) => (q && a.key.startsWith(q) ? -1 : 0) - (q && b.key.startsWith(q) ? -1 : 0) || b.roles.length - a.roles.length || a.name.localeCompare(b.name));
      if (!results.length) { out.innerHTML = `<div class="fd-empty">No company matches “${esc(input.value)}”.</div>`; return; }
      out.innerHTML = results.map((e, i) => `<div class="fd-row${i === sel ? ' sel' : ''}" data-i="${i}" role="option" aria-selected="${i === sel}">
          <span class="fd-logo">${e.logo ? `<img src="${logoSrc(e.logo)}" alt="">` : `<b>${esc(e.name[0])}</b>`}</span>
          <span class="fd-name">${esc(e.name)}<small>${e.roles.length} role${e.roles.length > 1 ? 's' : ''}</small></span>
          <span class="fd-roles">${e.roles.map((r, j) => `<button class="fd-role" data-j="${j}" style="${cv(r.colour)}">${r.kind === 'layer' ? '<i class="lay"></i>' : '<i class="eco"></i>'}${esc(r.label)}</button>`).join('')}</span>
        </div>`).join('');
      $$('.fd-row', out).forEach((row) => {
        const e = results[+row.dataset.i];
        $$('.fd-role', row).forEach((b) => b.addEventListener('click', () => jump(e, e.roles[+b.dataset.j])));
        row.addEventListener('pointerenter', () => { sel = +row.dataset.i; mark(); });
      });
    }
    function mark() {
      $$('.fd-row', out).forEach((r, i) => r.classList.toggle('sel', i === sel));
      const s = $('.fd-row.sel', out); if (s) s.scrollIntoView({ block: 'nearest' });
    }
    function jump(e, role) {
      close();
      if (mode.is('read')) { reader.jumpTo(role.kind === 'layer' ? `r-layer-${role.id}` : `r-actor-${role.id}`); return; }
      if (role.kind === 'layer') {
        const wait = slides[cur].id === 's-vc' ? 0 : 650;
        goId('s-vc'); setTimeout(() => dive.open(role.id, e.key), wait);
      } else {
        const wait = slides[cur].id === 's-eco' ? 0 : 650;
        goId('s-eco'); setTimeout(() => eco.open(role.id, e.key), wait);
      }
    }
    function open() {
      dive.close();
      wrap.classList.add('open'); wrap.setAttribute('aria-hidden', 'false');
      input.value = ''; sel = 0; render();
      modal.open(wrap, () => input);
    }
    function close() { if (!wrap.classList.contains('open')) return; wrap.classList.remove('open'); wrap.setAttribute('aria-hidden', 'true'); modal.close(wrap); }
    return { build, open, close, isOpen: () => wrap.classList.contains('open') };
  })();

  // =================================================================== SPEAKER NOTES
  const notes = (() => {
    const el = $('#notes');
    let on = false;
    function update() {
      $('#notesSlide').textContent = `${cur + 1} · ${slides[cur] ? slides[cur].dataset.title : ''}`;
      $('#notesText').textContent = (slides[cur] && NOTES[slides[cur].id]) || '';
    }
    function toggle(v) {
      on = v ?? !on;
      el.classList.toggle('open', on);
      el.setAttribute('aria-hidden', String(!on));
      $('#btnNotes').classList.toggle('on', on);
      if (on) update();
    }
    return { toggle, update, isOpen: () => on };
  })();

  // =================================================================== NAVIGATION
  const slides = $$('.slide');
  let cur = -1;
  const slideIndex = (id) => slides.findIndex((x) => x.id === id);
  const goId = (id) => go(slideIndex(id));
  const HOOKS = {
    's-cover': { enter: () => cover.start(), leave: () => cover.stop() },
    's-why': { enter: () => ecus.start(), leave: () => ecus.stop() },
    's-eco': { enter: () => eco.enter(), leave: () => eco.leave() },
    's-vc': { enter: () => vc.enter(), leave: () => vc.leave() },
    's-grow': { enter: () => { segPlace('#poolCtl'); pools.ready(); } },
    's-ws': { leave: () => ws.leave() },
    's-funnel': { enter: () => screen.enter() },
    's-evolve': { enter: () => evolve.enter(), leave: () => evolve.leave() },
    's-dossier': { enter: () => dossier.enter() },
    's-wedges': { enter: () => wedgeSlide.enter() },
    's-fc': { enter: () => fc.enter() },
  };
  const hooks = {};
  slides.forEach((sl, i) => { if (HOOKS[sl.id]) hooks[i] = HOOKS[sl.id]; });
  // v16: slide modules register builders in V16 (run at init, before the first slide shows)
  // and add enter/leave hooks with hookOn, which runs them after any existing hook
  const V16 = [];
  const hookOn = (id, h) => {
    const i = slideIndex(id);
    if (i < 0) return;
    const o = hooks[i] || {};
    hooks[i] = {
      enter: () => { if (o.enter) o.enter(); if (h.enter) h.enter(); },
      leave: () => { if (o.leave) o.leave(); if (h.leave) h.leave(); },
    };
  };

  // v12: chapters (data-ch on each slide) group the dock and menu, and label every slide
  const chOf = (s) => CHAPTERS.find((c) => c.id === s.dataset.ch) || CHAPTERS[0];
  const chLabel = (c) => (c.n === '' ? c.name : c.n === 'A' ? c.name : `${c.n} · ${c.short || c.name}`);
  function buildChrome() {
    const segs = $('#segs'), list = $('#menuList');
    let lastCh = null;
    slides.forEach((s, i) => {
      const c = chOf(s);
      const first = c.id !== lastCh;
      lastCh = c.id;
      const b = document.createElement('button');
      b.className = 'seg' + (first && i ? ' ch-start' : '') + (c.id === 'appx' ? ' appx' : '');
      b.setAttribute('aria-label', `Go to slide ${i + 1}: ${s.dataset.title} (${c.name})`);
      b.innerHTML = `<span>${i + 1} · ${esc(s.dataset.title)}<small>${esc(chLabel(c))}</small></span>`;
      b.addEventListener('click', () => go(i));
      segs.appendChild(b);
      if (first && c.id !== 'intro') {
        const h = document.createElement('li');
        h.className = 'menu-ch';
        h.innerHTML = `<b>${esc(chLabel(c))}</b>${c.code ? `<small>${esc(c.code)}</small>` : ''}`;
        list.appendChild(h);
      }
      const li = document.createElement('li');
      li.innerHTML = `<button style="--i:${i}">${esc(s.dataset.title)}</button>`;
      li.firstChild.addEventListener('click', () => { menu(false); go(i); });
      list.appendChild(li);
      // chapter tag in front of each slide's kicker
      const k = $('.head .kicker', s);
      if (k && c.id !== 'intro') {
        const t = document.createElement('span');
        t.className = 'chap' + (c.id === 'appx' ? ' appx' : '');
        t.innerHTML = c.id === 'appx' ? 'Appendix' : `Chapter ${c.n} · ${esc(c.short || c.name)}${c.code ? ` <i>${esc(c.code)}</i>` : ''}`;
        k.prepend(t);
      }
    });
  }

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur) return;
    const prev = cur;
    if (prev >= 0 && hooks[prev] && hooks[prev].leave) hooks[prev].leave();
    hideTip();
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.classList.toggle('back', k < i); s.inert = k !== i; s.setAttribute('aria-hidden', String(k !== i)); });
    document.body.classList.toggle('calm', slides[i].id !== 's-cover');
    cur = i;
    $$('.seg').forEach((s, k) => { s.classList.toggle('cur', k === i); s.classList.toggle('done', k < i); });
    $$('#menuList button').forEach((b, k) => b.classList.toggle('cur', k === i));
    const nx = slides[i + 1];
    $('#count').innerHTML = `${i + 1} / ${slides.length}${nx ? `<span class="nx">Next: ${esc(nx.dataset.title)}</span>` : ''}`;
    const ch = chOf(slides[i]);
    $('#nowTitle').textContent = i ? `${ch.id === 'intro' ? '' : chLabel(ch) + ' — '}${slides[i].dataset.title}` : '';
    $$('[data-count]', slides[i]).forEach((el) => countUp(el));
    if (hooks[i] && hooks[i].enter) hooks[i].enter();
    notes.update();
    if (!mode.is('read') && location.hash !== '#' + i) history.replaceState(null, '', location.pathname + location.search + '#' + i);
  }
  const next = () => go(cur + 1), prev = () => go(cur - 1);

  function menu(open) {
    const m = $('#menu');
    const o = open ?? !m.classList.contains('open');
    if (o === m.classList.contains('open')) return;
    m.classList.toggle('open', o);
    m.setAttribute('aria-hidden', String(!o));
    if (o) modal.open(m, () => $('#menuList button.cur') || $('#menuList button')); else modal.close(m);
  }
  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }

  // ------------------------------------------------------------------ INPUT
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (document.querySelector('dialog[open]')) return;
    if (finder.isOpen()) return; // the finder input handles its own keys
    if (e.target.matches && e.target.matches('input, textarea, select')) return;
    if (mode.is('read')) {
      if (k === '/') { finder.open(); e.preventDefault(); }
      else if (k === 'Escape' && notes.isOpen()) notes.toggle(false);
      return;
    }
    // Space on a focused card (tabindex, not a native control) activates it like a button,
    // unless the card already handled the key itself
    if (k === ' ' && !e.defaultPrevented && e.target.matches && e.target.matches('[tabindex]:not(button):not(a):not(input):not(.fc-list):not(.do-panel):not(.slide)')) {
      e.preventDefault();
      e.target.click();
      return;
    }
    if (dive.isOpen()) {
      if (k === 'Escape') dive.close();
      else if (k === 'ArrowRight' || k === 'ArrowDown') dive.step(1);
      else if (k === 'ArrowLeft' || k === 'ArrowUp') dive.step(-1);
      else if (k === '/') finder.open();
      else return;
      e.preventDefault(); return;
    }
    if ($('#menu').classList.contains('open')) {
      if (k === 'Escape' || k === 'o' || k === 'O') { menu(false); e.preventDefault(); }
      return;
    }
    const onControl = e.target.closest && e.target.closest('button, a, [tabindex], [role="slider"], input');
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !onControl)) { next(); e.preventDefault(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { prev(); e.preventDefault(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'o' || k === 'O') menu(true);
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 'n' || k === 'N') notes.toggle();
    else if (k === '/') { finder.open(); e.preventDefault(); }
    else if (k === 'Escape') { if (notes.isOpen()) notes.toggle(false); else if (slides[cur].id === 's-eco') eco.escape(); }
    else if (/^[1-9]$/.test(k) && +k <= slides.length) go(+k - 1);
  });

  let touch = null;
  document.addEventListener('touchstart', (e) => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, inScene: !!e.target.closest('#rig, .fc-list') }; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!touch || dive.isOpen() || touch.inScene) { touch = null; return; }
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev();
    touch = null;
  });

  document.addEventListener('pointermove', (e) => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
    if (cur === 0) cover.mouse(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cover.stop();
    else if (cur === 0) cover.start();
  });

  $('#prev').addEventListener('click', prev);
  $('#next').addEventListener('click', next);
  $('#btnMenu').addEventListener('click', () => menu());
  $('#btnFull').addEventListener('click', toggleFull);
  $('#btnFind').addEventListener('click', () => finder.open());
  $('#btnNotes').addEventListener('click', () => notes.toggle());
  $('#verPill').addEventListener('click', () => (mode.is('read') ? reader.jumpTo('r-audit') : goId('s-fc')));
  $('#menu').addEventListener('click', (e) => { if (e.target.id === 'menu') menu(false); });
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.go)));
  $$('[data-goid]').forEach((b) => b.addEventListener('click', () => goId(b.dataset.goid)));
  window.addEventListener('resize', () => { fit(); vc.remeasure(); ['#eraCtl', '#lensCtl', '#poolCtl', '#fcTabs', '#dpViews'].forEach(segPlace); mode.auto(); });
  window.addEventListener('hashchange', () => { if (mode.is('read')) return; const n = parseInt(location.hash.slice(1), 10); if (!isNaN(n)) go(n); });

  // =================================================================== v3 · MODAL FOCUS MANAGEMENT
  // Open dialogs make everything else inert (no focus, no clicks), take focus,
  // and give it back to the control that opened them when they close.
  const modal = (() => {
    const stack = [];
    const regions = () => ['.chrome-top', '#deck', '.dock', '#reader', '#notes', '#dive', '#menu', '#finder'].map((q) => $(q)).filter(Boolean);
    function apply() {
      const top = stack[stack.length - 1];
      regions().forEach((r) => { r.inert = !!top && r !== top.el; });
    }
    return {
      open(el, target) {
        if (stack.some((x) => x.el === el)) return;
        stack.push({ el, ret: document.activeElement });
        apply();
        setTimeout(() => { const t = (target && target()) || el; if (t && t.focus) t.focus({ preventScroll: true }); }, 50);
      },
      close(el) {
        const i = stack.findIndex((x) => x.el === el);
        if (i < 0) return;
        const [entry] = stack.splice(i, 1);
        apply();
        if (entry.ret && document.contains(entry.ret) && !entry.ret.closest('[inert]')) entry.ret.focus({ preventScroll: true });
      },
    };
  })();

  // =================================================================== v3 · DOCK (auto-hides while presenting)
  const dock = (() => {
    const d = $('.dock');
    let t = 0;
    // v12: the dock stays visible so a reviewer reading alone always sees where they are and what comes next
    const AUTO_HIDE = false;
    function show() {
      d.classList.remove('hide');
      clearTimeout(t);
      if (AUTO_HIDE) t = setTimeout(() => {
        if (mode.is('read') || d.matches(':hover') || d.contains(document.activeElement)) return;
        d.classList.add('hide');
      }, 2800);
    }
    return {
      init() {
        document.addEventListener('pointermove', (e) => { if (e.clientY > innerHeight - 140 || e.movementY > 0) show(); }, { passive: true });
        document.addEventListener('keydown', show);
        document.addEventListener('touchstart', show, { passive: true });
        d.addEventListener('focusin', show);
        show();
      },
      show,
    };
  })();

  // =================================================================== v3 · COVER TEXT + IDENTITY
  function coverText() {
    const who = [TEAM.name, TEAM.university].filter(Boolean).join(' · ');
    const tl = $('#teamLine');
    if (who) { tl.textContent = who; tl.hidden = false; document.title = `${TEAM.name || 'SDV'} · SDV Value Chain Portfolio`; }
    $('#coverSub').textContent = EXEC.sub;
    // v15: one submission name and one as-of date, in one place
    $('#coverAsOf').textContent = `${TEAM.submission} · as of ${TEAM.updated}`;
    $('#verText').textContent = 'Evidence audit';
  }

  // feasibility math shared by the slides and the reading view
  function feas(p, w) {
    const W = SCREEN.criteria.reduce((a, c) => a + (w ? w[c.id] : c.w), 0) || 1;
    return SCREEN.criteria.reduce((a, c) => a + (w ? w[c.id] : c.w) * p.s[c.id], 0) / W;
  }
  const screenPos = (id) => SCREEN.positions.find((p) => p.id === id);
  const TEAM_W = Object.fromEntries(SCREEN.criteria.map((c) => [c.id, c.w]));
  const SHORTLISTED = new Set(CANDIDATES.map((c) => c.id));
  function ranking(weights = TEAM_W, positions = SCREEN.positions) {
    return positions.map((p) => { const f = feas(p, weights); return { p, f, pr: f * p.market }; }).sort((a, b) => b.pr - a.pr);
  }
  const top3Key = (r) => r.slice(0, 3).map((x) => x.p.id).sort().join();

  // How fragile is the ranking? Weights: each criterion ±10 points. Scores: each criterion score ±1
  // (kept within 1–5) and each market score ±0.5, one change at a time. The scores are the
  // uncalibrated draft, so the second test matters more.
  function sensitivity(weights = TEAM_W) {
    const base = ranking(weights), key = top3Key(base), top1 = base[0].p.id;
    const w = { total: 0, same3: 0, sameTop: 0 };
    SCREEN.criteria.forEach((c) => [-10, 10].forEach((d) => {
      const r = ranking({ ...weights, [c.id]: Math.max(0, weights[c.id] + d) });
      w.total++; if (top3Key(r) === key) w.same3++; if (r[0].p.id === top1) w.sameTop++;
    }));
    const s = { total: 0, same3: 0, sameTop: 0, swaps: [], newTops: new Set() };
    const trial = (label, positions) => {
      const r = ranking(weights, positions);
      s.total++; if (top3Key(r) === key) s.same3++;
      if (r[0].p.id === top1) s.sameTop++; else { s.swaps.push(label); s.newTops.add(r[0].p.id); }
    };
    SCREEN.positions.forEach((p, i) => {
      const swap = (q) => SCREEN.positions.map((x, j) => (j === i ? q : x));
      SCREEN.criteria.forEach((c) => [-1, 1].forEach((d) => {
        const v = p.s[c.id] + d;
        if (v >= 1 && v <= 5) trial(`${p.short} ${c.label.toLowerCase()} ${d > 0 ? '+1' : '−1'}`, swap({ ...p, s: { ...p.s, [c.id]: v } }));
      }));
      [-0.5, 0.5].forEach((d) => {
        const v = p.market + d;
        if (v >= 1 && v <= 5) trial(`${p.short} market ${d > 0 ? '+0.5' : '−0.5'}`, swap({ ...p, market: v }));
      });
    });
    return { base, w, s };
  }
  const orList = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} or ${a[a.length - 1]}`);
  function sensitivityHtml(sv) {
    const { base, w, s } = sv, top = base[0].p, second = base[1].p;
    const weights = `<span><b>Weights:</b> across ${w.total} single-weight changes of ±10 points, the top three hold in ${w.same3} and ${esc(top.short)} stays #1 in ${w.sameTop}.</span>`;
    let scores = `<span><b>Scores:</b> across ${s.total} single-score changes (±1 on a criterion, ±0.5 on market), the top three hold in ${s.same3}`;
    if (!s.swaps.length) scores += ` and ${esc(top.short)} stays #1 in all of them.`;
    else {
      const swapsTwo = s.newTops.size === 1 && s.newTops.has(second.id);
      scores += `. #1 is the close call (${base[0].pr.toFixed(1)} vs ${base[1].pr.toFixed(1)}): ${esc(orList(s.swaps))} would ${swapsTwo ? `put ${esc(second.short)} first` : 'change it'}.`;
    }
    return weights + scores + '</span>';
  }
  const marketWhy = (p) => `Criticality ${p.crit[0].toLowerCase()}: ${p.crit[1]}. Competition ${p.comp[0].toLowerCase()}: ${p.comp[1]}.`;
  const CONF = { High: 3, Medium: 2, Low: 1, 'Screened out': 0 };
  function confMeter(level) {
    const n = CONF[level] ?? 0;
    return `<span class="conf conf-${n}" title="Confidence: ${esc(level)}"><i class="${n >= 1 ? 'on' : ''}"></i><i class="${n >= 2 ? 'on' : ''}"></i><i class="${n >= 3 ? 'on' : ''}"></i><b>${esc(level)}</b></span>`;
  }

  // =================================================================== v3 · EXECUTIVE SUMMARY SLIDE
  const execSlide = {
    // v16: the bottom line with its growth figure, the three wedges dealt in as cards, then the biggest risk
    build() {
      $('#exBottom').innerHTML = `<div class="x16-bl-txt"><div class="mini-kicker gold">Bottom line</div><p>${esc(EXEC.bottomShort || EXEC.bottomLine)}</p></div>
        <div class="x16-stat"><b><span data-count="11.4" data-dec="1" data-suffix="%">11.4%</span><small>a year</small></b><span>${esc(EXEC.statLine || '')}${citeHtml('mck')}</span></div>`;
      $('#exWk').innerHTML = `<span class="mini-kicker">Three wedges we will test in Studio 2</span><button type="button" class="ext-link" id="exEvolve">How we narrowed to these three →</button>`;
      $('#exTargets').innerHTML = WEDGES.list.map((w, k) => `<button type="button" class="x16-w${w.id === 'w2' ? ' weak' : ''}" style="${cv(w.colour)};--i:${k}" data-wedge="${w.id}">
          <span class="x16-w-top"><span class="x16-w-n">${esc(w.code)}</span><span class="x16-w-tag">${esc(w.id === 'w2' ? 'Weakest' : w.tag)}</span><span class="x16-w-go" aria-hidden="true">→</span></span>
          <b>${esc(w.name)}</b><span class="x16-w-p">${esc(w.plain)}</span></button>`).join('');
      $('#exEvolve').addEventListener('click', () => goId('s-evolve'));
      $$('#exTargets [data-wedge]').forEach((b) => b.addEventListener('click', () => wedgeSlide.show(b.dataset.wedge)));
      $('#exRisk').innerHTML = `<span class="x16-risk-k">Biggest risk</span><p>${esc(EXEC.risk)}</p><button type="button" class="ext-link" id="exRiskGo">Our risks and what we do →</button>`;
      $('#exRiskGo').addEventListener('click', () => goId('s-gaps'));
      $('#exFoot').textContent = EXEC.howToRead;
    },
  };

  // =================================================================== v3 · FUNNEL + WEIGHT SENSITIVITY
  const screen = (() => {
    const w = {};
    const ROW = 48;
    const rowEls = {};
    const tgtIds = ['hil', 'zonal', 'ota']; // the Round 1 targets
    function build() {
      $('#funnel').innerHTML = FUNNEL.map((f, i) => `<li class="fn st-${f.stage.replace(/\W/g, '')}" style="--i:${i}">
          <span class="fn-n">${esc(String(f.n))}</span><span class="fn-l">${esc(f.label)}</span><span class="fn-note">${esc(f.note)}</span><span class="fn-st">${esc(f.stage)}</span></li>`).join('');
      SCREEN.criteria.forEach((c) => { w[c.id] = c.w; });
      $('#weights').innerHTML = `<div class="w-h"><span>Criterion weight</span><span>share</span></div>` + SCREEN.criteria.map((c) => `
        <label class="wt" data-c="${c.id}"><span class="wt-l">${esc(c.label)}</span>
          <input type="range" min="0" max="40" step="5" value="${c.w}" data-c="${c.id}" aria-label="${esc(c.label)} weight" aria-describedby="wd-${c.id}">
          <output id="wo-${c.id}">${c.w}%</output><span class="wt-d" id="wd-${c.id}">A 5 means: ${esc(c.five)}</span></label>`).join('');
      $$('#weights input').forEach((inp) => inp.addEventListener('input', () => { w[inp.dataset.c] = +inp.value; update(); }));
      $('#wReset').addEventListener('click', () => { SCREEN.criteria.forEach((c) => { w[c.id] = c.w; $(`#weights input[data-c="${c.id}"]`).value = c.w; }); update(); });
      const box = $('#ranks');
      box.style.height = SCREEN.positions.length * ROW + 'px';
      SCREEN.positions.forEach((p) => {
        const l = layerById(p.layer);
        const short = SHORTLISTED.has(p.id);
        const r = document.createElement('div');
        r.className = 'rk' + (short ? ' was-short' : '');
        r.setAttribute('role', 'listitem');
        r.tabIndex = 0;
        r.style.cssText = cv(l.colour);
        r.setAttribute('aria-label', `${p.name}${short ? ', shortlisted in B-2.3.1' : ''}. ${SCREEN.criteria.map((c) => `${c.label} ${p.s[c.id]}`).join(', ')}. Market attractiveness ${p.market.toFixed(1)}. ${marketWhy(p)}`);
        r.innerHTML = `<span class="rk-n"></span><span class="rk-name"><i></i>${esc(p.name)}${short ? '<em aria-hidden="true">★</em>' : ''}</span>
          <span class="rk-f"><span class="rk-bar"><i class="f"></i></span><b class="fv"></b></span><span class="rk-x">× ${p.market.toFixed(1)}</span>
          <span class="rk-p"><span class="rk-bar p"><i class="pv-bar"></i></span><b class="pv"></b></span>`;
        const tipHtml = () => `<b>${esc(p.name)}</b>${short ? '<span style="color:var(--gold-l)">★ Shortlisted in B-2.3.1</span><br>' : ''}${SCREEN.criteria.map((c) => `${esc(c.label)} ${p.s[c.id]}`).join(' · ')}
          <span class="tip-mk">Market attractiveness ${p.market.toFixed(1)}/5</span><span class="tip-mr"><em>Criticality: ${esc(p.crit[0])}</em>${esc(p.crit[1])}</span><span class="tip-mr"><em>Competition: ${esc(p.comp[0])}</em>${esc(p.comp[1])}</span>`;
        r.addEventListener('pointermove', (e) => showTip(tipHtml(), e.clientX, e.clientY));
        r.addEventListener('pointerleave', hideTip);
        r.addEventListener('focus', () => { const b = r.getBoundingClientRect(); showTip(tipHtml(), b.left + 320, b.bottom); });
        r.addEventListener('blur', hideTip);
        box.appendChild(r);
        rowEls[p.id] = r;
      });
      $('#scNote').innerHTML = `<span class="ll-star">★</span> shortlisted in B-2.3.1 · Market (1–5) = team judgement of criticality to launch or approval and how open the competition is; hover or focus a row for the reasoning · Draft scores, to calibrate as a team${citeHtml('b133')}`;
      update();
    }
    function update() {
      const W = SCREEN.criteria.reduce((a, c) => a + w[c.id], 0) || 1;
      SCREEN.criteria.forEach((c) => { $(`#wo-${c.id}`).textContent = `${Math.round((w[c.id] / W) * 100)}%`; });
      const r = ranking({ ...w });
      const changed = SCREEN.criteria.some((c) => c.w !== w[c.id]);
      r.forEach((x, k) => {
        const el = rowEls[x.p.id];
        el.style.top = k * ROW + 'px';
        el.classList.toggle('top3', k < 3);
        $('.rk-n', el).textContent = k + 1;
        $('.f', el).style.width = (x.f / 5) * 100 + '%';
        $('.fv', el).textContent = x.f.toFixed(2);
        $('.pv-bar', el).style.width = (x.pr / 25) * 100 + '%';
        $('.pv', el).textContent = x.pr.toFixed(1);
      });
      const sameSet = top3Key(r) === tgtIds.slice().sort().join();
      $('#ranks').dataset.state = changed ? 'custom' : 'team';
      const lead = changed ? (sameSet ? 'With your weights the same three Round 1 targets still lead. ' : '<b class="warn">With your weights the top three change.</b> ') : '';
      let rob = $('#robust');
      if (!rob) { rob = document.createElement('p'); rob.id = 'robust'; rob.className = 'robust'; rob.setAttribute('aria-live', 'polite'); $('#scNote').before(rob); }
      rob.innerHTML = (lead ? `<span>${lead}</span>` : '') + sensitivityHtml(sensitivity(w));
    }
    return { build, enter() {} };
  })();

  // =================================================================== v3 · TARGET DOSSIERS
  // v16: each wedge is a four-step story (the pain, today's tools, our edge, when we drop it)
  // that builds left to right; the earlier targets sit on one card each. No company scores.
  const dossier = (() => {
    const pick = $('#dxPick'), panel = $('#dxPanel');
    const FOCUS = DOSSIERS.filter((d) => d.focus && d.story);
    const OLD = DOSSIERS.filter((d) => !d.focus && d.record);
    let sel = FOCUS.length ? FOCUS[0].id : 'old', flash = null;
    const wedgeOf = (d) => WEDGES.list.find((w) => w.id === d.story.wedge) || {};
    function build() {
      const b = (id, inner, extra, style) => `<button type="button" role="tab" class="dx-tab${extra}" id="dxt-${id}" data-id="${id}" aria-controls="dxPanel" style="${style}">${inner}</button>`;
      pick.innerHTML = FOCUS.map((d) => { const w = wedgeOf(d); return b(d.id, `<i class="dx-code">${esc(w.code || '')}</i><span>${esc(w.name || d.title)}</span>`, '', cv(d.colour)); }).join('')
        + b('old', `<i class="dx-code">${OLD.length}</i><span>Earlier targets</span>`, ' old', '')
        + (FOCUS.some((d) => d.story.wedge === 'w3') ? '' : '<button type="button" class="dx-w3" id="dxW3" aria-label="W3 is on the Wedge hypotheses slide">W3 → Wedge hypotheses slide</button>');
      $$('.dx-tab', pick).forEach((t) => t.addEventListener('click', () => select(t.dataset.id)));
      pick.addEventListener('keydown', (e) => {
        const bs = $$('.dx-tab', pick), i = bs.indexOf(document.activeElement);
        if (i < 0) return;
        let j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % bs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + bs.length) % bs.length;
        else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = bs.length - 1;
        if (j < 0) return;
        e.preventDefault(); e.stopPropagation(); bs[j].focus(); select(bs[j].dataset.id);
      });
      if ($('#dxW3')) $('#dxW3').addEventListener('click', () => goId('s-wedges'));
      panel.addEventListener('click', (e) => {
        const g = e.target.closest('[data-go]'); if (g) { setStep(step + +g.dataset.go); return; }
        const t = e.target.closest('[data-to]'); if (t) { setStep(+t.dataset.to); return; }
        const f = e.target.closest('[data-full]'); if (f) { full(f.dataset.full); return; }
        const c = e.target.closest('.cf-c:not(.on)'); if (c && !e.target.closest('.cite')) setStep(+c.dataset.n);
      });
      if (window.DOSSIER_INTRO) $('#dxSub').textContent = DOSSIER_INTRO.sub;
      select(sel);
    }
    // v27: the four steps sit on a 3D carousel; one is in focus, the others lean away. Click a
    // card, a step or the arrows to move; "Full dossier" opens the in-depth detail.
    let step = 0;
    function cfHtml(d) {
      const s = d.story;
      const rows = s.today.map(([t, ok, no], r) => `<div class="cf-row" style="--r:${r}"><b>${esc(t)}</b><span class="ok"><i>✓</i>${esc(ok)}</span><span class="no"><i>✗</i>${esc(no)}</span></div>`).join('');
      const cards = [
        ['pain', 'The pain', `<p class="cf-big">${rich(s.pain)}</p>`],
        ['today', 'What teams use today', `<div class="cf-rows">${rows}</div>${s.todayNote ? `<p class="cf-note">${esc(s.todayNote)}</p>` : ''}`],
        ['edge', 'Our edge', `<p class="cf-big">${rich(s.edge)}</p>`],
        ['drop', 'We drop it if', `<ul>${s.drop.map((k) => `<li>${esc(k)}</li>`).join('')}</ul><small>Tested in Studio 2 interviews</small>`],
      ];
      return `<div class="cf" style="${cv(d.colour)}">
        <div class="cf-stage">${cards.map(([cls, h, inner], n) => `<section class="cf-c ${cls}" data-n="${n}" style="--n:${n};--o:${n};--a:${n}"><span class="cf-wm" aria-hidden="true">${n + 1}</span><h4><i>${n + 1}</i>${h}</h4><div class="cf-b">${inner}</div></section>`).join('')}</div>
        <nav class="cf-nav"><button type="button" class="cf-ar" data-go="-1" aria-label="Previous step">‹</button>
          ${cards.map(([cls, h], n) => `<button type="button" class="cf-dot ${cls}" data-to="${n}"><i>${n + 1}</i>${h}</button>`).join('<span class="cf-sep" aria-hidden="true"></span>')}
          <button type="button" class="cf-ar" data-go="1" aria-label="Next step">›</button>
          <button type="button" class="cf-full" data-full="${d.id}">Full dossier ↗</button></nav></div>`;
    }
    function setStep(n) {
      const cf = $('.cf', panel); if (!cf) return;
      step = Math.max(0, Math.min(3, n));
      $$('.cf-c', cf).forEach((c) => { const o = +c.dataset.n - step; c.style.setProperty('--o', o); c.style.setProperty('--a', Math.abs(o)); c.classList.toggle('on', o === 0); });
      $$('.cf-dot', cf).forEach((b) => b.classList.toggle('on', +b.dataset.to === step));
    }
    function full(id) {
      const d = DOSSIERS.find((x) => x.id === id); if (!d) return;
      const w = wedgeOf(d);
      let dl = $('#dxDlg');
      if (!dl) {
        dl = document.createElement('dialog'); dl.id = 'dxDlg'; dl.className = 'wp-dlg dx-dlg'; dl.setAttribute('aria-labelledby', 'dxDlgH');
        document.body.appendChild(dl);
        dl.addEventListener('click', (e) => { if (e.target === dl || e.target.closest('[data-close]')) dl.close(); });
      }
      const sec = (h, inner, cls = '') => inner ? `<section class="wp-s ${cls}"><h5>${h}</h5>${inner}</section>` : '';
      const p = (t) => (t ? `<p>${rich(t)}</p>` : '');
      const ul = (xs) => (xs && xs.length ? `<ul>${xs.map((x) => `<li>${rich(x)}</li>`).join('')}</ul>` : '');
      dl.style.cssText = `--k:var(--${d.colour}-m);--kl:var(--${d.colour}-l)`;
      dl.innerHTML = `<header><i class="wp-code">${esc(w.code || '')}</i><div><small>Full dossier · confidence ${esc((d.confidence || {}).level || 'low')}</small><h3 id="dxDlgH">${esc(w.name || d.title)}</h3></div><nav><button type="button" class="tog" data-close>Close</button></nav></header>
        <div class="wp-b">
          <div class="wp-col">${sec('The problem', p(d.problem))}${sec('Our edge', p(d.edge))}${sec('Who has the pain', p(d.users))}${sec('Who might pay', p(d.budget))}${sec('Gatekeepers', p(d.gate))}${sec('What they use today', p(d.workaround))}</div>
          <div class="wp-col">${sec('Evidence for', ul(d.forE), 'dx-for')}${sec('Evidence against', ul(d.against), 'dx-ag')}${sec('We drop it if', ul(d.kill), 'wp-drop')}${sec('First interviews', p(d.first))}${sec('Open business questions', ul(d.biz))}${d.confidence ? sec('Why confidence is ' + esc(d.confidence.level.toLowerCase()), p(d.confidence.why)) : ''}</div>
        </div>`;
      hydrateCites(dl);
      if (!dl.open) dl.showModal();
      dl.scrollTop = 0;
    }
    function storyHtml(d) {
      return cfHtml(d);
    }
    function storyHtmlOld(d) {
      const s = d.story;
      const step = (n, cls, h, inner) => `<section class="dx-b ${cls}" style="--s:${n}"><h4><i>${n + 1}</i>${h}</h4>${inner}</section>`;
      const arrow = (n) => `<span class="dx-arr dxa${n}" aria-hidden="true"><i></i></span>`;
      const rows = s.today.map(([t, ok, no], r) => `<div class="dx-row" style="--r:${r}"><b>${esc(t)}</b>
          <span class="ok"><i aria-label="Shows">✓</i>${esc(ok)}</span><span class="no"><i aria-label="Misses">✗</i>${esc(no)}</span></div>`).join('');
      return `<div class="dx-flow" style="${cv(d.colour)}">
        ${step(0, 'pain', 'The pain', `<p>${rich(s.pain)}</p>`)}${arrow(0)}
        ${step(1, 'today', 'What teams use today', `<div class="dx-rows">${rows}</div>`)}${arrow(1)}
        ${step(2, 'edge', 'Our edge', `<p>${rich(s.edge)}</p>`)}${arrow(2)}
        ${step(3, 'drop', 'We drop it if', `<ul>${s.drop.map((k) => `<li>${esc(k)}</li>`).join('')}</ul><small>Tested in Studio 2 interviews</small>`)}
      </div>`;
    }
    function oldHtml() {
      return `<div class="dx-old">
        <p class="dx-old-h">${esc(DOSSIER_INTRO.old)}</p>
        <div class="dx-cards">${OLD.map((d, k) => `<article class="dx-card${/^Narrowed/.test(d.record.tag) ? ' kept' : ''}${flash === d.id ? ' flash' : ''}" id="dxc-${d.id}" style="${cv(d.colour)};--s:${k}">
          <span class="dx-stamp">${esc(d.record.tag)}</span><h4>${esc(d.title)}</h4><p>${esc(d.record.line)}</p></article>`).join('')}</div>
      </div>`;
    }
    function select(id) {
      if (id !== 'old' && !FOCUS.some((d) => d.id === id)) { flash = id; id = 'old'; }
      sel = id;
      $$('.dx-tab', pick).forEach((t) => { const on = t.dataset.id === id; t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panel.setAttribute('aria-labelledby', `dxt-${id}`);
      const d = FOCUS.find((x) => x.id === id);
      panel.innerHTML = d ? storyHtml(d) : oldHtml();
      if (d) { setStep(0); hydrateCites(panel); }
      flash = null;
    }
    function show(id, navigate) {
      // v30: the Dossiers slide is cut; a Round 1 pick opens its short story in a pop-up instead
      if (slideIndex('s-dossier') < 0) { r1Story(id); return; }
      if (mode.is('read')) { reader.jumpTo(`r-dossier-${id}`); return; }
      const onSlide = slides[cur].id === 's-dossier';
      if (navigate && !onSlide) { goId('s-dossier'); setTimeout(() => select(id), 120); } else select(id);
    }
    return { build, show, enter() {} };
  })();

  // =================================================================== v7 · HELPERS
  const r2Pair = (posId, coId) => ROUND2.pairs[`${posId}.${coId}`];
  const r2Total = (pair) => pair.s.reduce((a, b) => a + b, 0);
  const RES_ORDER = { pass: 0, cond: 1, near: 2, fail: 3 };

  // =================================================================== v7 · BUSINESS MODELS SLIDE
  const bmcSlide = {
    build() {
      const TAG = { core: 'Core', growth: 'Growth', future: 'Future bet' };
      $('#bmGrid').innerHTML = BMCS.map((b, k) => `
        <article class="bmc rv" style="--k:${b.colour};--d:${3 + k}">
          <header><span class="bmc-logo">${chip(b.logo, 'lg')}</span><span class="bmc-role">${esc(b.role)}</span></header>
          <p class="bmc-what">${esc(b.what)}${citeHtml(b.src)}</p>
          <div class="bmc-stats">${b.stats.map(([v, t]) => `<div><b>${esc(v)}</b><span>${esc(t)}</span></div>`).join('')}</div>
          <h4>How it makes money</h4>
          <ul class="bmc-money">${b.money.map(([g, t]) => `<li class="g-${g}"><i title="${TAG[g]}"></i>${esc(t)}</li>`).join('')}</ul>
          <h4>What protects it</h4>
          <p>${esc(b.moat)}</p>
          <div class="bmc-lesson"><h4>What it taught us</h4><p>${esc(b.lesson)}</p></div>
          <footer><a class="bmc-pdf" href="${esc(b.file)}" target="_blank" rel="noopener">Open the full canvas ↗ <small>PDF · ${b.nsrc} sources on page 2</small></a></footer>
        </article>`).join('');
      $('#bmFoot').innerHTML = ''; // v16: the two-canvas slide (v16:bmc block) carries its own legend and sources
    },
  };

  // =================================================================== v7 · ROUND 2 COMPANY SCREEN
  const round2 = (() => {
    let sel = 'adas.ds';
    function cell(pos, co) {
      const key = `${pos.id}.${co.id}`, p = r2Pair(pos.id, co.id), t = r2Total(p);
      return `<button class="r2c res-${p.res}" type="button" data-key="${key}" style="--i:${ROUND2.positions.indexOf(pos) * 3 + ROUND2.companies.indexOf(co)}" aria-label="${esc(pos.name)} with ${esc(co.name)}: ${t} of 25, ${esc(p.label)}">
        <b>${t}</b><span class="r2c-l">${esc(p.cell || p.label.split(':')[0])}</span>
        <span class="r2c-bars" aria-hidden="true">${p.s.map((v) => `<i style="--v:${v}"></i>`).join('')}</span></button>`;
    }
    function panel() {
      const [posId, coId] = sel.split('.');
      const pos = ROUND2.positions.find((x) => x.id === posId), co = ROUND2.companies.find((x) => x.id === coId), p = r2Pair(posId, coId), t = r2Total(p);
      $('#r2Panel').innerHTML = `<header><div><small>${esc(co.name)}</small><h3>${esc(pos.name)}</h3></div><div class="r2p-t res-${p.res}"><b>${t}</b><span>of 25</span></div></header>
        <div class="r2p-res"><span class="res res-${p.res}">${esc(p.label)}</span></div>
        <p class="r2p-dec">${esc(p.decide)}</p>
        <ul class="r2p-crit">${ROUND2.criteria.map((c, i) => `<li><span class="r2p-l">${esc(c.label)}</span><span class="r2p-b"><i style="--v:${p.s[i]}"></i></span><b>${p.s[i]}</b><p>${esc(p.why[i])}</p></li>`).join('')}</ul>
        ${p.margin ? `<p class="r2p-m"><b>How firm is it?</b> ${esc(p.margin)}</p>` : ''}`;
      $$('.r2c', $('#r2Matrix')).forEach((b) => { const on = b.dataset.key === sel; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    }
    function build() {
      $('#r2Matrix').innerHTML = `<div class="r2h"></div>${ROUND2.companies.map((c) => `<div class="r2h co"><span>${chip(c.logo, 'lg')}</span><small>${esc(c.tag)}</small></div>`).join('')}
        ${ROUND2.positions.map((pos) => `<div class="r2r" style="${cv(pos.colour)}"><b>${esc(pos.name)}</b><small>${esc(pos.sub)}</small></div>${ROUND2.companies.map((co) => cell(pos, co)).join('')}`).join('')}`;
      $$('.r2c', $('#r2Matrix')).forEach((b) => b.addEventListener('click', () => { sel = b.dataset.key; panel(); }));
      $('#r2Foot').innerHTML = `<b>How a pair passes.</b> ${esc(ROUND2.rule)}${citeHtml('b133v2')}`;
      panel();
    }
    return { build };
  })();

  // =================================================================== v16 · HOW WE NARROWED
  // Seven open pockets (left) pass a team-fit and real-company check (the gate); dropped ones stop
  // at the gate with their reason, survivors land on W1 and W2, and W3 arrives last. No dates, no
  // scores. The default view and the export show the whole picture; "Play the story" steps through.
  const evolve = (() => {
    const N = () => window.NARROW;
    const WC = { w1: 'Lthree', w2: 'Lvv', w3: 'Lone' };
    let built = false, timer = null, step = 0, subText = '';
    const flow = () => $('#nwFlow');
    const wedge = (id) => WEDGES.list.find((w) => w.id === id) || {};
    function dialog(r) {
      let d = $('#nwDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'nwDlg'; d.className = 'nw-dlg'; d.setAttribute('aria-labelledby', 'nwDlgH');
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      const out = !r.to;
      d.style.cssText = cv(r.colour);
      d.innerHTML = `<header><div><small class="${out ? 'out' : 'in'}">${esc(r.fate)}</small><h3 id="nwDlgH">${esc(r.name)}</h3></div><button type="button" class="tog" data-close>Close</button></header>
        <div class="nw-dlg-b"><section><h5>What we thought at first</h5><p>${esc(r.thought)}</p></section>
        <section><h5>What we learned</h5><p>${esc(r.learned)}</p></section>
        <section class="nw-now"><h5>What we do now</h5><p>${esc(r.now)}</p></section>
        <p class="more"><b>${out ? 'What would reopen it' : 'Note'}</b> ${esc(r.more)}</p></div>`;
      d.showModal();
    }
    // lines: row → gate for everyone; gate → wedge card for survivors; W1 → W3 arc for "added after"
    function draw() {
      const f = flow(); if (!f || !f.offsetWidth) return;
      // layout offsets, not screen rects, so running entry animations (translateX) don't skew the lines
      const pt = (el) => { let l = 0, t = 0, e = el; while (e && e !== f) { l += e.offsetLeft; t += e.offsetTop; e = e.offsetParent; }
        return { l, t, r: l + el.offsetWidth, b: t + el.offsetHeight }; };
      const svg = $('#nwLines');
      svg.setAttribute('viewBox', `0 0 ${f.offsetWidth} ${f.offsetHeight}`);
      svg.setAttribute('width', f.offsetWidth); svg.setAttribute('height', f.offsetHeight);
      svg.innerHTML = '';
      const gate = pt($('.nw-gate', f)), gx = (gate.l + gate.r) / 2;
      const cards = {}; $$('.nw-card', f).forEach((c) => { cards[c.dataset.id] = pt(c); });
      const into = { w1: 0, w2: 0 };
      const rows = $$('.nw-row', f);
      N().rows.forEach((r, i) => {
        const p = pt(rows[i]), y = (p.t + p.b) / 2, x0 = p.r + 4;
        const col = P[r.colour].m;
        svg.appendChild(svgEl('path', { d: `M${x0},${y} L${gx},${y}`, class: `nw-l a${r.to ? ' keep' : ' out'}`, stroke: r.to ? col : '#64748b', pathLength: 1, style: `--i:${i}` }));
        if (!r.to) {
          const o = svgEl('g', { transform: `translate(${gx},${y})` }), g = svgEl('g', { class: 'nw-x', style: `--i:${i}` });
          g.appendChild(svgEl('circle', { r: 15 }));
          g.appendChild(svgEl('path', { d: 'M-6,-6 L6,6 M6,-6 L-6,6' }));
          o.appendChild(g); svg.appendChild(o);
          return;
        }
        const c = cards[r.to], n = into[r.to]++;
        const ty = c.t + (c.b - c.t) * (r.to === 'w1' ? (n ? 0.68 : 0.32) : 0.5), tx = c.l - 2;
        const mx = (gx + tx) / 2;
        svg.appendChild(svgEl('path', { d: `M${gx},${y} C${mx},${y} ${mx},${ty} ${tx},${ty}`, class: `nw-l b${r.soft ? ' soft' : ''}`, stroke: col, pathLength: 1, style: `--i:${i}` }));
        svg.appendChild(svgEl('circle', { class: 'nw-pass', cx: gx, cy: y, r: 7, fill: col, style: `--i:${i}` }));
      });
      const a = cards.w1, b = cards.w3;
      if (a && b) {
        const x = a.l - 2, y1 = a.b - 26, y2 = (b.t + b.b) / 2, bend = Math.min(90, (a.l - gx) * 0.7);
        svg.appendChild(svgEl('path', { d: `M${x},${y1} C${x - bend},${y1} ${x - bend},${y2} ${x},${y2}`, class: 'nw-l w3arc', stroke: P[WC.w3].l, pathLength: 1 }));
      }
    }
    function setStep(n) {
      const st = $('#ev');
      step = n;
      st.classList.toggle('nw-playing', n > 0);
      for (let s = 2; s <= 5; s++) st.classList.toggle('nw-st' + s, n >= s);
      const sub = $('#nwSub'), btn = $('#nwPlay');
      if (n > 0) { sub.textContent = N().steps[n - 1]; sub.classList.add('step'); btn.classList.add('on'); btn.innerHTML = n < 5 ? 'Next step ▸' : 'Show all'; }
      else { sub.textContent = subText; sub.classList.remove('step'); btn.classList.remove('on'); btn.innerHTML = '▶ Play the story'; }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (step > 0) $('#ev').classList.add('nw-played'); setStep(0); }
    function advance() {
      if (step >= 5) { stop(); return; }
      setStep(step + 1);
    }
    function play() {
      if (EXPORT) return;
      if (step > 0) { if (timer) { clearInterval(timer); timer = null; } advance(); return; }
      setStep(1);
      timer = setInterval(() => { if (step >= 5) { clearInterval(timer); timer = null; return; } advance(); }, 2800);
    }
    function build() {
      if (built) return; built = true;
      const D = N();
      subText = $('#nwSub').textContent;
      $('#nwBand').innerHTML = D.check.map((c, i) => `<div class="nw-chk rv" style="--d:${3 + i}"><b class="nw-k"><i>${i + 1}</i>${esc(c.k)}</b><span class="nw-t">${esc(c.t)}</span><span class="nw-items${c.lines ? ' lines' : ''}">${c.items.map((t) => `<em>${esc(t)}</em>`).join('')}</span></div>`).join('') +
        `<div class="nw-chk now rv" style="--d:5"><b class="nw-k"><i>3</i>Where we are now</b><button class="tog nw-play" id="nwPlay" type="button">▶ Play the story</button></div>`;
      $('#nwRows').innerHTML = D.rows.map((r, i) => `<li class="nw-row ${r.to ? 'keep' : 'out'}${r.soft ? ' soft' : ''}" style="${cv(r.colour)};--i:${i}">
        <button type="button" data-i="${i}" aria-label="${esc(r.name)}: ${esc(r.fate)}. ${esc(r.why)}. Opens the full story."><i class="nw-dot"></i>
        <span class="nw-tx"><b class="nw-nm">${esc(r.name)}</b><span class="nw-fate">${esc(r.fate)}</span><span class="nw-why">${esc(r.why)}</span></span><span class="nw-more" aria-hidden="true">›</span></button></li>`).join('');
      $('#nwCards').innerHTML = D.wedges.map((w, i) => { const x = wedge(w.id); return `<article class="nw-card ${w.id}" data-id="${w.id}" style="${cv(WC[w.id])};--i:${i}">
        <small>${esc(w.k)}</small><h3>${esc(x.name || '')}</h3><p>${esc(w.edge)}</p></article>`; }).join('');
      $$('.nw-row button', flow()).forEach((b) => b.addEventListener('click', () => dialog(D.rows[+b.dataset.i])));
      $$('.nw-card', flow()).forEach((c) => { c.tabIndex = 0; c.setAttribute('role', 'link'); c.setAttribute('aria-label', `${c.querySelector('h3').textContent}: open the wedge hypotheses`);
        const go = () => goId('s-wedges'); c.addEventListener('click', go); c.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); }); });
      $('#nwPlay').addEventListener('click', play);
      draw();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
      let t = null; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 120); });
    }
    return { build, enter() { stop(); $('#ev').classList.remove('nw-played'); draw(); }, leave() { stop(); } };
  })();

  // =================================================================== v7 · PERSONAS
  const personaSlide = (() => {
    const CO = { ds: ['dSPACE', '#4fd1c5'], ai: ['Applied Intuition', '#f6ad55'], me: ['Mobileye (near-miss)', '#b794f4'] };
    function open(p) {
      const d = $('#peDlg');
      $('img', d).src = p.img; $('img', d).alt = `Full persona card: ${p.name}, a fictional archetype`;
      $('a', d).href = p.img;
      $('.pe-dlg-t', d).innerHTML = `<b>${esc(p.code)} · ${esc(p.name)}</b><span class="arch">Archetype</span><small>A fictional persona built from public job postings; the quote is imagined. Scroll to read the whole card.</small>`;
      d.showModal();
      d.scrollTop = 0;
    }
    function build() {
      // v15: the persona slide merged into "Who we will interview"; only the dialog is built here
      const d = document.createElement('dialog');
      d.id = 'peDlg'; d.className = 'pe-dlg'; d.setAttribute('aria-label', 'Full persona card');
      d.innerHTML = '<div class="pe-dlg-h"><div class="pe-dlg-t"></div><a target="_blank" rel="noopener">Open full size ↗</a><button type="button" class="tog">Close</button></div><img alt="">';
      document.body.appendChild(d);
      $('button', d).addEventListener('click', () => d.close());
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    }
    function buildOld() {
      $('#peLegend').innerHTML = Object.values(CO).map(([n, c]) => `<span><i style="background:${c}"></i>${esc(n)}</span>`).join('');
      $('#peGrid').innerHTML = PERSONAS.map((p, k) => `<button type="button" class="pc rv${p.near ? ' near' : ''}" data-i="${k}" style="--k:${CO[p.co][1]};--d:${3 + k * .6}">
        <span class="pc-av">${esc(p.ini)}<small>${esc(p.code)}</small></span>
        <span class="pc-m"><b>${esc(p.name)}</b><span>${esc(p.title)} · ${esc(p.company)}</span></span>
        <span class="pc-tags"><em class="${p.prime ? 'prime' : ''}">${esc(p.tag)}</em><i>Interview #${p.rank}</i></span>
        <span class="pc-role">${esc(p.role)}</span>
        <small class="pc-qtag">Imagined quote</small><q>${esc(p.quote)}</q></button>`).join('');
      $$('.pc', $('#peGrid')).forEach((b) => b.addEventListener('click', () => open(PERSONAS[+b.dataset.i])));
      $('#peIns').innerHTML = PERSONA_INSIGHTS.map((x) => `<div><b>${esc(x.t)}</b><span>${esc(x.d)}</span></div>`).join('');
      const d = document.createElement('dialog');
      d.id = 'peDlg'; d.className = 'pe-dlg'; d.setAttribute('aria-label', 'Full persona card');
      d.innerHTML = '<img alt=""><div class="pe-dlg-b"><a target="_blank" rel="noopener">Open full size ↗</a><button type="button" class="tog">Close</button></div>';
      document.body.appendChild(d);
      $('button', d).addEventListener('click', () => d.close());
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    }
    return { build, open };
  })();

  // =================================================================== v8 · WEDGE HYPOTHESES (B-2.3.4)
  const wedgeSlide = (() => {
    const W = WEDGES;
    let sel = 'all';
    const G = { D: 'Desirability', F: 'Feasibility', V: 'Viability' };
    const col = { w1: 3, w2: 4, w3: 5 };
    const fmt = (n) => String(Math.round(n * 100) / 100);
    function totals() {
      const max = { D: 0, F: 0, V: 0 };
      const out = W.list.map(() => ({ D: 0, F: 0, V: 0 }));
      W.dfv.forEach((r) => {
        max[r[0]] += 5 * r[2];
        W.list.forEach((w, i) => { out[i][r[0]] += r[col[w.id]] * r[2]; });
      });
      const fvMax = max.F + max.V;
      out.forEach((t) => { t.T = t.D + t.F + t.V; t.pos = (t.D / max.D + (t.F + t.V) / fvMax) / 2; });
      return { max, out, T: max.D + fvMax };
    }
    const scoreTable = (cls = 'wd-tb') => `<table class="${cls}"><thead><tr><th>Criterion (weight)</th>${W.list.map((w) => `<th class="n">${w.code}</th>`).join('')}<th>Basis</th></tr></thead><tbody>${
      ['D', 'F', 'V'].map((g) => `<tr class="wd-g"><td colspan="5">${G[g]}</td></tr>${W.dfv.filter((r) => r[0] === g).map((r) => `<tr><td>${esc(r[1])} <small>${r[2]}</small></td><td class="n">${r[3]}</td><td class="n">${r[4]}</td><td class="n">${r[5]}</td><td class="b">${esc(r[6])}</td></tr>`).join('')}`).join('')
    }</tbody></table>`;
    const resultTable = (cls = 'wd-tb') => {
      const t = totals();
      const row = (l, k) => `<tr><td>${l}</td>${t.out.map((x) => `<td class="n">${fmt(x[k])}</td>`).join('')}<td class="n">${fmt(t.max[k])}</td></tr>`;
      return `<table class="${cls} wd-res"><thead><tr><th>Result</th>${W.list.map((w) => `<th class="n">${w.code}</th>`).join('')}<th class="n">Max</th></tr></thead><tbody>${row('Desirability', 'D')}${row('Feasibility', 'F')}${row('Viability', 'V')}
        <tr class="wd-tot"><td>Total</td>${t.out.map((x) => `<td class="n">${fmt(x.T)}</td>`).join('')}<td class="n">${fmt(t.T)}</td></tr>
        <tr><td>Position in range</td>${t.out.map((x) => `<td class="n">${Math.round(x.pos * 100)}%</td>`).join('')}<td class="n">Middle: 45–70%</td></tr></tbody></table>`;
    };
    const marketTable = (w, cls = 'wd-tb') => `<table class="${cls}"><thead><tr><th>Level</th><th>Arithmetic</th><th class="n">${w.marketHead[0]}</th><th class="n">${w.marketHead[1]}</th></tr></thead><tbody>${w.market.map((m) => `<tr><td><b>${esc(m[0])}</b></td><td>${rich(m[1])}</td><td class="n">${esc(m[2])}</td><td class="n">${esc(m[3])}</td></tr>`).join('')}</tbody></table>`;
    const planTable = (w, cls = 'wd-tb') => `<table class="${cls}"><thead><tr><th>Hypothesis</th><th>Type</th><th>Test</th><th>Fails if</th><th>Evidence source</th></tr></thead><tbody>${w.plan.map((p) => `<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td>${esc(p[2])}</td><td>${esc(p[3])}</td><td>${esc(p[4] || '')}</td></tr>`).join('')}</tbody></table>`;
    const painTable = (w, cls = 'wd-tb') => `<table class="${cls}"><thead><tr><th>Persona</th><th>Their pain</th><th>How this wedge answers it</th></tr></thead><tbody>${w.pains.map((p) => `<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td>${esc(p[2])}</td></tr>`).join('')}</tbody></table>`;
    const card = (w) => [['End user', w.user], ['Pain', w.pain], ['Our narrow first foothold', w.wedge], ['Input', w.input], ['Output', w.output], ['What changes for the user', w.change], ['Workaround today', w.workaround], ['Budget owner', w.owner]];
    // v16: the slide in plain English. Big tabs across the top; the default view shows all
    // three wedges side by side with the desk scores as three plain questions (Strong /
    // Medium / Weak dots); each wedge opens three blocks (the pain, a rough market size,
    // the Studio 2 tests); "How we scored them" is a short explainer, criteria behind a toggle.
    let more = false;
    const LV = [['weak', 'Weak', 1], ['medium', 'Medium', 2], ['strong', 'Strong', 3]];
    const level = (p) => (p >= W.levels.strong ? LV[2] : p >= W.levels.medium ? LV[1] : LV[0]);
    const pcts = (i) => { const t = totals(); return { D: Math.round((t.out[i].D / t.max.D) * 100), F: Math.round((t.out[i].F / t.max.F) * 100), V: Math.round((t.out[i].V / t.max.V) * 100) }; };
    const dots = (p, n0, withPct) => {
      const [c, word, n] = level(p);
      return `<span class="wx-lv ${c}" title="Desk score: ${p}% of the top possible score"><span class="wx-dots" aria-hidden="true">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}" style="--n:${n0 + k}"></i>`).join('')}</span><b>${word}</b>${withPct ? `<small>${p}%</small>` : ''}</span>`;
    };
    const check = (i) => { const p = pcts(i); return `<ul class="wx-check">${W.qs.map(([k, q], r) => `<li class="${level(p[k])[0]}"><span>${esc(q)}</span>${dots(p[k], r * 3)}</li>`).join('')}</ul>`; };
    const wStyle = (w, c) => `--k:var(--${w.colour}-m);--kl:var(--${w.colour}-l);--c:${c}`;
    // v26: the first view is three clean cards (name, the question, the kill test, a compact
    // desk-check meter); clicking a card opens a pop-out with the rest.
    const HOOK = window.WEDGE_HOOK || {}, SHORTQ = { D: 'Want', F: 'Build', V: 'Pay' };
    function homeHtml() {
      return `<div class="wx-home">${W.list.map((w, i) => {
        const s = w.slide, weak = w.id === 'w2', p = pcts(i);
        return `<button type="button" class="wx-hc${weak ? ' weak' : ''}" data-pop="${w.id}" style="${wStyle(w, i)}" aria-label="${esc(w.code)}: ${esc(w.name)}. Open the detail">
          <span class="wx-hc-wm" aria-hidden="true">${esc(w.code)}</span>
          <span class="wx-hc-top"><i>${esc(w.code)}</i><em>${esc(weak ? 'Weakest' : w.tag)}</em></span>
          <b class="wx-hc-n">${esc(w.name)}</b>
          <p class="wx-hc-q">${esc(HOOK[w.id] || w.plain)}</p>
          <span class="wx-hc-who"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span><small>Who has it</small>${esc(w.who)}</span></span>
          <span class="wx-hc-k"><small>We drop it if</small>${esc(s.drop)}</span>
          <span class="wx-hc-m">${W.qs.map(([k], r) => `<span class="${level(p[k])[0]}"><small>${SHORTQ[k]}</small>${dots(p[k], r * 3)}</span>`).join('')}</span>
          <span class="wx-hc-go">Open the detail <u aria-hidden="true">↗</u></span></button>`;
      }).join('')}</div>
      <div class="wx-home-f"><span>Dots: our desk check before any interviews</span><button type="button" class="wx-more" data-w="dfv">How we scored them →</button></div>`;
    }
    function pop(id) {
      const w = W.list.find((x) => x.id === id); if (!w) return;
      const i = W.list.indexOf(w), s = w.slide, weak = id === 'w2';
      let d = $('#wpDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'wpDlg'; d.className = 'wp-dlg'; d.setAttribute('aria-labelledby', 'wpDlgH');
        document.body.appendChild(d);
        d.addEventListener('click', (e) => {
          if (e.target === d || e.target.closest('[data-close]')) { d.close(); return; }
          const st = e.target.closest('[data-step]');
          if (st) { const k = W.list.findIndex((x) => x.id === d.dataset.w), n = W.list.length; pop(W.list[(k + +st.dataset.step + n) % n].id); return; }
          const g = e.target.closest('[data-go]');
          if (g) { d.close(); sel = g.dataset.go; more = false; render(); }
        });
      }
      d.dataset.w = id;
      d.style.cssText = wStyle(w, 0);
      d.classList.toggle('weak', weak);
      d.innerHTML = `<header><i class="wp-code">${esc(w.code)}</i><div><small>${esc(weak ? 'Weakest wedge' : w.tag)}</small><h3 id="wpDlgH">${esc(w.name)}</h3></div>
          <nav><button type="button" class="pr-nb" data-step="-1" aria-label="Previous wedge">‹</button><button type="button" class="pr-nb" data-step="1" aria-label="Next wedge">›</button><button type="button" class="tog" data-close>Close</button></nav></header>
        <div class="wp-b">
          <div class="wp-col">
            <section class="wp-s"><h5><b>1</b>Who has the problem</h5><p>${esc(w.who)}</p></section>
            <section class="wp-s"><h5><b>2</b>The problem</h5><p>${esc(w.plain)}</p></section>
            <section class="wp-s"><h5><b>3</b>What we would offer</h5><p>${esc(s.offer)}</p></section>
          </div>
          <div class="wp-col">
            <section class="wp-s"><h5><b>4</b>How we test it</h5><p>${esc(s.test)}</p></section>
            <section class="wp-s wp-drop"><h5><b>✕</b>We drop it if</h5><p>${esc(s.drop)}</p></section>
            <section class="wp-s wp-ck"><h5>Desk check, before interviews</h5>${check(i)}</section>
          </div>
        </div>
        <footer><button type="button" class="wx-more" data-go="${esc(id)}">Market size and the full test plan →</button></footer>`;
      if (!d.open) d.showModal();
      d.scrollTop = 0;
    }
    function allHtml() {
      return `<div class="wx-all">${W.list.map((w, i) => {
        const s = w.slide, weak = w.id === 'w2';
        return `<button type="button" class="wx-card${weak ? ' weak' : ''}" data-w="${w.id}" style="${wStyle(w, i)}" aria-label="${esc(w.code)}: ${esc(w.name)}. Open its market and test plan">
          <header><i>${esc(w.code)}</i><b>${esc(w.name)}</b>${weak ? '<em>Weakest</em>' : ''}</header>
          <p class="wx-for"><span>For:</span> ${esc(w.who)}</p>
          <p><span>The problem:</span> ${esc(w.plain)}</p>
          <p><span>We would offer:</span> ${esc(s.offer)}</p>
          <p class="wx-test"><span>We test it by:</span> ${esc(s.test)}</p>
          <p class="wx-drop"><span>We drop it if:</span> ${esc(s.drop)}</p>
          <div class="wx-ck"><small>Desk check, before interviews<u>Open →</u></small>${check(i)}</div></button>`;
      }).join('')}</div>`;
    }
    function wedgeHtml(w) {
      const i = W.list.indexOf(w), s = w.slide, p = pcts(i), m = s.market, top = m.rows[0].n;
      const sq = m.rows.map((r, k) => `<i class="l${k}" style="--a:${Math.sqrt(r.n / top).toFixed(3)};--q:${k}"></i>`).join(''); // side ∝ √value, so area is to scale
      const rows = m.rows.map((r, k) => `<li class="l${k}" style="--q:${k}"><b>${esc(r.v)}</b><span><em>${esc(r.k)}.</em> ${rich(r.t)}</span></li>`).join('');
      const tests = W.qs.map(([k, q], r) => { const [t, d] = s.tests[k]; return `<li class="${level(p[k])[0]}" style="--r:${r}"><header><b>${esc(q)}</b>${dots(p[k], r * 3)}</header><p>${esc(t)}</p><p class="wx-drop"><span>Drop it if:</span> ${esc(d)}</p></li>`; }).join('');
      return `<div class="wx-one${w.id === 'w2' ? ' weak' : ''}" style="${wStyle(w, 0)}">
        <div class="wx-blocks">
          <section class="wx-b" style="--c:0"><h3>The pain &amp; who has it<em>${esc(w.id === 'w2' ? 'Weakest' : w.tag)}</em></h3>
            <p class="wx-2"><span>For:</span> ${esc(w.who)}</p><p><span>The problem:</span> ${esc(w.plain)}</p><p><span>We would offer:</span> ${esc(s.offer)}</p><p class="wx-2"><span>Today they:</span> ${esc(s.today)}</p><p class="wx-bet"><span>Biggest technical bet:</span> ${esc(s.bet)}</p></section>
          <section class="wx-b wx-mk" style="--c:1"><h3>Market <small>rough, top-down, ${esc(m.year)}</small></h3>
            <div class="wx-mkv"><div class="wx-sq" aria-hidden="true">${sq}</div><ul>${rows}</ul></div><p class="wx-how">${rich(m.how)}</p></section>
          <section class="wx-b wx-tp" style="--c:2"><h3>How we test it in Studio 2<button type="button" class="wx-more" data-more="1" title="All technical assumptions, the full test plan, persona pains and the market arithmetic">Full detail →</button></h3><ol>${tests}</ol></section>
        </div></div>`;
    }
    function wedgeMore(w) {
      return `<div class="wx-det" style="${wStyle(w, 0)}"><header class="wx-dh"><button type="button" class="wx-back" data-more="0">← Back</button><b>${esc(w.code)}. ${esc(w.name)}: the full detail</b></header>
        <h4>Technical assumptions</h4><ul>${w.assume.map((a) => `<li>${rich(a)}</li>`).join('')}</ul>
        <h4>The assumption most likely to fail</h4><p>${esc(w.weakTech)}</p>
        <h4>Full Studio 2 test plan</h4><div class="wx-scroll">${planTable(w, 'wx-tb')}</div>
        <h4>Who has the pain (persona codes)</h4><div class="wx-scroll">${painTable(w, 'wx-tb')}</div>
        <h4>Market arithmetic</h4><div class="wx-scroll">${marketTable(w, 'wx-tb')}</div><p>${rich(w.marketNote)}</p>
        <h4>Still missing</h4><ul>${w.missing.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    }
    function dfvHtml() {
      if (more) {
        return `<div class="wx-det"><header class="wx-dh"><button type="button" class="wx-back" data-more="0">← Back</button><b>The 14 criteria, scored 1–5 from desk research</b></header>
          <div class="wx-scroll"><table class="wx-tb wx-crit"><thead><tr><th>Criterion <small>(weight)</small></th>${W.list.map((w) => `<th class="n">${w.code}</th>`).join('')}<th>Why</th></tr></thead><tbody>${
            W.qs.map(([g, q]) => `<tr class="wx-g"><td colspan="5">${esc(q)} <small>(${esc(G[g])})</small></td></tr>${W.dfv.filter((r) => r[0] === g).map((r) => `<tr><td>${esc(r[1])} <small>×${r[2]}</small></td><td class="n">${r[3]}</td><td class="n">${r[4]}</td><td class="n">${r[5]}</td><td>${esc(r[6])}</td></tr>`).join('')}`).join('')
          }</tbody></table></div><p>${rich(W.dfvNote)}</p></div>`;
      }
      let n = 0;
      const rows = W.qs.map(([k, q], r) => {
        const crit = W.dfv.filter((x) => x[0] === k);
        return `<div class="wx-dr" style="--r:${r}">
          <div class="wx-crits">${crit.map((x) => `<i title="${esc(x[1])}" style="--n:${n++}"></i>`).join('')}<span>${crit.length} criteria</span></div>
          <span class="wx-ar" aria-hidden="true"></span>
          <b class="wx-q">${esc(q)}<small>${esc(G[k])}</small></b>
          <span class="wx-ar" aria-hidden="true"></span>
          ${W.list.map((w, i) => `<span class="wx-cell" style="--k:var(--${w.colour}-m)">${dots(pcts(i)[k], r * 3 + i, true)}</span>`).join('')}</div>`;
      }).join('');
      const keyPct = (c) => (c === 'strong' ? `${W.levels.strong}%+` : c === 'medium' ? `${W.levels.medium}–${W.levels.strong - 1}%` : `under ${W.levels.medium}%`);
      return `<div class="wx-how-v">
        <div class="wx-how-t">${W.howPlain.map((x) => `<p>${rich(x)}</p>`).join('')}</div>
        <div class="wx-dg">
          <div class="wx-dh2"><small>14 criteria, 1–5 each</small><span></span><small>3 questions</small><span></span>${W.list.map((w) => `<small class="wx-wc" style="--k:var(--${w.colour}-m)">${esc(w.code)}</small>`).join('')}</div>
          ${rows}
        </div>
        <div class="wx-how-f"><span class="wx-key">${LV.slice().reverse().map(([c, word, k]) => `<span class="wx-lv ${c}"><span class="wx-dots">${[0, 1, 2].map((j) => `<i class="${j < k ? 'on' : ''}"></i>`).join('')}</span><b>${word}</b><small>${keyPct(c)}</small></span>`).join('')}</span>
          <button type="button" class="wx-more" data-more="1">Show the 14 criteria →</button></div></div>`;
    }
    function body() {
      if (sel === 'all') return homeHtml();
      if (sel === 'dfv') return dfvHtml();
      const w = W.list.find((x) => x.id === sel);
      return more ? wedgeMore(w) : wedgeHtml(w);
    }
    function moveInd() {
      const on = $('#wxTabs .wx-t.on'), ind = $('#wxTabs .wx-ind');
      if (!on || !ind) return;
      ind.style.left = on.offsetLeft + 'px';
      ind.style.width = on.offsetWidth + 'px';
    }
    function render() {
      $$('#wxTabs .wx-t').forEach((b) => { const on = b.dataset.w === sel; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      moveInd();
      const p = $('#wxPanel');
      p.closest('.wedge-stage').classList.toggle('wx-homev', sel === 'all');
      p.className = `wx-panel rv v-${sel === 'all' || sel === 'dfv' ? sel : 'one'}${more ? ' more' : ''}`;
      p.innerHTML = body();
      hydrateCites();
      p.scrollTop = 0;
    }
    function build() {
      const items = [['all', '1–3', 'All three'], ...W.list.map((w) => [w.id, w.code, w.name, w.colour]), ['dfv', '?', 'How we scored them']];
      $('#wxTabs').innerHTML = items.map(([id, c, n, k]) => `<button type="button" role="tab" class="wx-t${id === 'w2' ? ' weak' : ''}" data-w="${id}" style="--k:var(--${k || 'Lfive'}-m)"><i>${esc(c)}</i><b>${esc(n)}</b></button>`).join('') + '<span class="wx-ind" aria-hidden="true"></span>';
      if (W.weakPlain) $('#wdSub').textContent = W.weakPlain;
      render();
      $('#wxTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-w]'); if (b) { sel = b.dataset.w; more = false; render(); } });
      $('#wxPanel').addEventListener('click', (e) => {
        const bp = e.target.closest('[data-pop]'); if (bp) { pop(bp.dataset.pop); return; }
        const bw = e.target.closest('[data-w]'); if (bw) { sel = bw.dataset.w; more = false; render(); return; }
        const b = e.target.closest('[data-more]'); if (b) { more = b.dataset.more === '1'; render(); }
      });
      addEventListener('resize', moveInd);
    }
    function readerHtml(sec) {
      const t = 'r-table';
      return sec('r-wedges', 'B-2.3.4 · Candidate wedge hypotheses', 'Three wedges, each with a test that could kill it',
        `<p>${esc(W.focus)} ${esc(W.intro)}</p>${W.list.map((w) => `<article class="r-wd" id="r-wedge-${w.id}" style="--k:var(--${w.colour}-m)"><h3>${esc(w.code)}. ${esc(w.name)} <em>${esc(w.tag)} · Confidence: Low</em></h3>
          <p><b>Problem.</b> ${esc(w.problem)}</p><p class="r-wd-h">${esc(w.hyp)}</p><p class="r-dim">${esc(w.origin)}</p>
          <div class="r-scroll"><table class="${t}"><tbody>${card(w).map(([k, x]) => `<tr><th scope="row">${k}</th><td>${esc(x)}</td></tr>`).join('')}<tr><th scope="row">Part of EcoCAR it addresses</th><td>Driverless Mobility (GM). ${esc(w.fit)}</td></tr></tbody></table></div>
          <h4>Persona pains this wedge answers</h4><div class="r-scroll">${painTable(w, t)}</div>
          <p class="r-weak"><b>Weakest technical assumption:</b> ${esc(w.weakTech)}</p>
          <h4>Early top-down market proxy</h4><div class="r-scroll">${marketTable(w, t)}</div><p class="r-dim">${rich(w.marketNote)}</p>
          <h4>What is still missing</h4><ul>${w.missing.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
          <h4>Technical assumptions</h4><ul>${w.assume.map((a) => `<li>${rich(a)}</li>`).join('')}</ul>
          <h4>Studio 2 validation plan</h4><div class="r-scroll">${planTable(w, t)}</div>
          <p class="r-note"><b>Personas:</b> ${esc(w.personas)}. <b>Weakest link:</b> ${esc(w.weak)}.</p></article>`).join('')}
         <h3>DFV scoring</h3><div class="r-scroll">${scoreTable(t)}</div><div class="r-scroll">${resultTable(t)}</div><p class="r-note">${rich(W.dfvNote)} ${esc(W.weakest)}</p>`,
        'Who has the problem, what we would offer, how big it could be, and how Studio 2 tests it. We describe our approach in general terms and keep the method private.');
    }
    const pct = () => totals().out.map((x) => Math.round(x.pos * 100));
    function show(id) { sel = id; more = false; render(); goId('s-wedges'); }
    return { build, enter: render, readerHtml, pct, show, pop };
  })();

  // =================================================================== v12 · CONTENTS, OUTREACH, SOCIETY, RISKS, ASKS
  // Replaces the v10 reviewer guide and the v3 risks + plan slide. The scorecard
  // map is kept, one click away, in a dialog on the contents slide.
  const extra = (() => {
    const slides = () => [...document.querySelectorAll('#deck > .slide')];
    const no = (id) => slides().findIndex((s) => s.id === id) + 1;
    const nm = (id) => { const s = document.getElementById(id); return s ? s.dataset.title : id; };
    const rid = (id) => (id === 's-fc' ? 'r-audit' : id.replace(/^s-/, 'r-'));
    const inCh = (cid) => slides().filter((s) => s.dataset.ch === cid);
    const chName = (cid) => { const c = CHAPTERS.find((x) => x.id === cid); return c.n === 'A' ? c.name : `${c.n} · ${c.short || c.name}`; };
    const chRange = (ids) => { const ns = ids.map((id) => CHAPTERS.find((c) => c.id === id).n); return ns.length > 1 ? `Chapters ${ns[0]}–${ns[ns.length - 1]}` : `Chapter ${ns[0]}`; };
    const pipeRows = () => PIPELINE.rows.slice().sort((a, b) => (a.n === 'Parked') - (b.n === 'Parked'));
    const ST = { 'In progress': 'on', Parked: 'park', 'Not started': 'new' };

    const guide = (link) => `<div class="gd">${GUIDE.groups.map((g) => `<section class="gd-g"><h5>${esc(g.cat)}</h5>${g.rows.map((r) => `<div class="gd-r"><span class="gd-q">${esc(r.q)}</span><span class="gd-w">${r.where.map(([id, x]) => link(id, x)).join('')}</span></div>`).join('')}</section>`).join('')}</div>`;
    const pipeTable = (cls) => `<table class="${cls}"><thead><tr><th class="n">#</th><th>Persona</th><th>Who we look for</th><th class="n">Wedges</th><th>Channel</th><th>Status and next step</th></tr></thead><tbody>${pipeRows().map((r, i) => `<tr><td class="n">${i + 1}</td><td><b>${esc(r.p)}</b></td><td>${esc(r.who)}</td><td class="n">${esc(r.w)}</td><td>${esc(r.ch)} <span class="pl-k k-${r.kind.toLowerCase()}">${esc(r.kind)}</span></td><td><span class="pl-st st-${ST[r.n] || 'on'}">${esc(r.n)}</span> ${esc(r.next)}</td></tr>`).join('')}</tbody></table>`;
    const socTable = (cls) => `<table class="${cls}"><thead><tr><th></th><th>What could go wrong</th><th>What we do about it</th><th>Still open</th></tr></thead><tbody>${SOCIETY.rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table>`;
    const gapTable = (cls) => `<table class="${cls}"><thead><tr><th>Area</th><th>Gap</th><th>Action</th><th class="n">When</th></tr></thead><tbody>${GAPS.map((g) => `<tr><td><b>${esc(g[0])}</b></td><td>${esc(g[1])}</td><td>${esc(g[2])}</td><td class="n">${esc(g[3])}</td></tr>`).join('')}</tbody></table>`;
    const indep = PIPELINE.rows.filter((r) => r.kind !== 'Sponsor').length;

    function scorecard() {
      let d = $('#scDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'scDlg'; d.className = 'sc-dlg'; d.setAttribute('aria-labelledby', 'scDlgH');
        d.innerHTML = `<header><div><small>Check-In 1 scorecard</small><h3 id="scDlgH">Where each scorecard question is answered</h3></div><button type="button" class="tog" data-close>Close</button></header>`
          + guide((id, x) => `<button type="button" data-gs="${id}"><em>${no(id)}</em>${esc(nm(id))}${x ? `<small>${esc(x)}</small>` : ''}</button>`)
          + `<p class="sc-note">You do not need this to follow the portfolio: the chapters already answer these questions in order. It is here for reviewers checking coverage.</p>`;
        document.body.appendChild(d);
        d.addEventListener('click', (e) => {
          if (e.target === d || e.target.closest('[data-close]')) { d.close(); return; }
          const b = e.target.closest('[data-gs]'); if (b) { d.close(); goId(b.dataset.gs); }
        });
      }
      d.showModal();
    }

    function build() {
      // contents: one card per chapter
      $('#mpGrid').innerHTML = CHAPTERS.filter((c) => typeof c.n === 'number').map((c, k) => `<article class="mp-ch rv" style="--d:${3 + k}">
          <header><b>${c.n}</b><span>${esc(c.name)}</span>${c.code ? `<i>${esc(c.code)}</i>` : ''}</header>
          <p>${esc(c.q)}</p>
          <ol>${inCh(c.id).map((s) => `<li><button type="button" data-gs="${s.id}"><em>${no(s.id)}</em>${esc(s.dataset.title)}</button></li>`).join('')}</ol></article>`).join('');
      $('#mpCheck').innerHTML = `<div class="mp-ci"><span class="mp-k">Check-In 1 asks for</span>${CHECKIN.map((x) => `<button type="button" data-gs="${inCh(x.ch[0])[0].id}"><b>${esc(x.code)}</b><span>${esc(x.t)}</span><small>${chRange(x.ch)}</small></button>`).join('')}</div>
        <p class="mp-terms"><span>Key terms</span>${KEY_TERMS.map(([t, d]) => `<b>${esc(t)}</b> ${esc(d)}`).join(' · ')}. Full glossary in the evidence audit.</p>
        <div class="mp-tools"><button type="button" class="tog" id="mpScore">Scorecard map</button><span class="mp-appx">Appendix: ${inCh('appx').map((s) => `<button type="button" data-gs="${s.id}">${esc(s.dataset.title)}</button>`).join(' · ')}</span></div>`;
      $('#s-map').addEventListener('click', (e) => { const b = e.target.closest('[data-gs]'); if (b) goId(b.dataset.gs); });
      $('#mpScore').addEventListener('click', scorecard);

      // outreach plan
      $('#plBody').innerHTML = `${pipeTable('wd-tb x-tb pl-tb')}
        <div class="pl-sum"><div><b>~10</b><span>${esc(PIPELINE.aimShort)}</span></div><div><b>${indep} of ${PIPELINE.rows.length}</b><span>channels use independent outreach (one alongside a sponsor contact), so at least half of our interviews can come from independent outreach, as Studio 2 requires</span></div></div>
        <div class="pl-rules"><p><b>How we reach out</b> ${PIPELINE.rules.map(esc).join(' · ')}</p><p><b>How we interview</b> ${PLAN.rules.map(esc).join(' · ')}</p></div>`;

      // innovation in society: one card per area
      $('#soBody').innerHTML = SOCIETY.rows.map((r, k) => `<article class="so-c rv" style="--d:${3 + k}"><h4>${esc(r[0])}</h4>
          <h5>Could go wrong</h5><p>${esc(r[1])}</p><h5 class="do">What we do</h5><p class="do">${esc(r[2])}</p><h5 class="op">Still open</h5><p class="op">${esc(r[3])}</p></article>`).join('')
        + `<p class="so-note rv" style="--d:9">${esc(SOCIETY.note)}</p>`;

      // risks & gaps
      $('#riskCards').innerHTML = RISKS.map((r, k) => `<article class="rg rv" style="--d:${3 + k}"><div class="rg-k">${esc(r.k)}</div><div class="rg-n">${esc(r.n)}</div><p>${esc(r.t)}</p>
          <div class="rg-do"><h5>What we do</h5><p>${esc(r.act)}</p><span class="rg-by">By ${esc(r.by)}</span></div></article>`).join('');
      $('#gpBody').innerHTML = `<h5>Smaller gaps we are closing</h5>${gapTable('wd-tb x-tb')}`;

      // questions for reviewers
      $('#askList').innerHTML = ASKS.map((q, k) => `<li class="rv" style="--d:${3 + k}"><b>${k + 1}</b><span>${esc(q)}</span></li>`).join('');
      $('#askEnd').innerHTML = `<span>That is the end of the main story. The appendix has the detail behind it:</span>${inCh('appx').map((s) => `<button type="button" class="tog" data-gs="${s.id}">${esc(s.dataset.title)}</button>`).join('')}`;
      $('#askEnd').addEventListener('click', (e) => { const b = e.target.closest('[data-gs]'); if (b) goId(b.dataset.gs); });
    }

    function readerMap(sec) {
      return sec('r-map', 'Contents', 'Five chapters, in the order of the Studio 1 brief',
        `<ol class="r-chs">${CHAPTERS.filter((c) => typeof c.n === 'number').map((c) => `<li><b>${c.n}. ${esc(c.name)}</b>${c.code ? ` <small>${esc(c.code)}</small>` : ''}<span>${esc(c.q)}</span><span class="r-dim">${inCh(c.id).map((s) => `<a href="#${rid(s.id)}">${esc(s.dataset.title)}</a>`).join(' · ')}</span></li>`).join('')}</ol>
         <p class="r-note"><b>Check-In 1:</b> ${CHECKIN.map((x) => `${esc(x.code)} ${esc(x.t)} (${chRange(x.ch).toLowerCase()})`).join('; ')}. Appendix: ${inCh('appx').map((s) => `<a href="#${rid(s.id)}">${esc(s.dataset.title)}</a>`).join(' · ')}.</p>
         <details class="r-score"><summary>Scorecard map: where each Check-In question is answered</summary>${guide((id, x) => `<a href="#${rid(id)}">${esc(nm(id))}</a>${x ? ` <small>(${esc(x)})</small>` : ''} `)}</details>`);
    }
    function readerRest(sec) {
      return sec('r-pipeline', 'Chapter 5 · Next steps · Outreach pipeline', 'Who we will interview first, and how we reach them',
          `<div class="r-scroll">${pipeTable('r-table')}</div><p class="r-note"><b>Aim:</b> ${esc(PIPELINE.aim)} ${esc(PIPELINE.note)}</p><p><b>How we reach out:</b> ${PIPELINE.rules.map(esc).join(' · ')}.</p><p><b>How we interview:</b> ${PLAN.rules.map(esc).join(' · ')}.</p><p class="r-note">${esc(PLAN.after)}</p>`)
        + sec('r-society', 'Chapter 5 · Next steps · Innovation in society', 'What could go wrong for people, and what we do about it',
          `<div class="r-scroll">${socTable('r-table')}</div><p class="r-note">${esc(SOCIETY.note)}</p>`)
        + sec('r-gaps', 'Chapter 5 · Next steps · Our gaps', 'What could prove us wrong, and what we do about it',
          `<div class="r-cards c4">${RISKS.map((r) => `<article><h4>${esc(r.k)}</h4><b class="r-big">${esc(r.n)}</b><p>${esc(r.t)}</p><p class="r-dim"><b>What we do:</b> ${esc(r.act)}</p></article>`).join('')}</div>
           <h3>Smaller gaps we are closing</h3><div class="r-scroll">${gapTable('r-table')}</div>
           <h3>What we still don’t know</h3><ul>${EVOLUTION.unknown.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`)
        + sec('r-asks', 'Chapter 5 · Next steps · Questions for reviewers', 'Where your advice would change what we do next',
          `<ol class="r-asks">${ASKS.map((q, k) => `<li>${esc(q)}${window.ASK_WHY && ASK_WHY[k] ? `<br><span class="r-dim">Why we ask: ${esc(ASK_WHY[k])}</span>` : ''}</li>`).join('')}</ol>`);
    }
    return { build, readerMap, readerRest, scorecard };
  })();

  // =================================================================== v13 · ORGANIZER VALUE CHAIN, FATES, WHERE NUMBERS COME FROM
  const v13 = (() => {
    const ZK = { covered: 'z-cov', adjacent: 'z-adj', discovery: 'z-disc' };
    const wd = (id) => WEDGES.list.find((w) => w.id === id);
    const wChip = (id) => { const w = wd(id); return `<span class="ch-w" style="--k:var(--${w.colour}-m)">${w.code}</span>`; };

    // v15: the main slide shows three rows (Does, Example challenge, Where we sit) and no layer codes;
    // the appendix crosswalk shows all six rows with our L01–L08 layers under each stage.
    function chain(sel = '#chBody', full = false) {
      const C = CHAIN, S = C.stages;
      const rowsShown = full ? C.rows : C.rows.filter(([k]) => (C.mainRows || C.rows.map((r) => r[0])).includes(k));
      const disc = S.filter((s) => s.zone === 'discovery');
      let h = `<div class="ch-grid${full ? ' full' : ' main'}">
        <div class="ch-zone" style="grid-row:1;grid-column:${disc[0].n + 1} / ${disc[disc.length - 1].n + 2}"><span>EcoCAR discovery zone</span></div>
        <div class="ch-corner" style="grid-row:2;grid-column:1">${full ? '<small>Click a row name to focus on it</small>' : ''}</div>`
        + S.map((st) => `<div class="ch-head ${ZK[st.zone]}" style="grid-row:2;grid-column:${st.n + 1}"><b>${st.n}. ${esc(st.name)}</b>${full ? `<span class="ch-ours">${st.ours.length ? st.ours.map((n) => `<i>L0${n}</i>`).join('') : '<i class="none">not one of our layers</i>'}</span>` : ''}</div>`).join('');
      rowsShown.forEach(([k, label], r) => {
        h += `<button type="button" class="ch-rl${k === 'us' ? ' us' : ''}" style="grid-row:${r + 3};grid-column:1" data-row="${k}">${esc(label)}</button>`
          + S.map((st) => {
            let inner = `<span>${rich(st[k])}</span>`;
            if (k === 'us') inner = `${(st.w || []).map(wChip).join('')}${st.drop ? '<span class="ch-x">Dropped</span>' : ''}${inner}`;
            return `<div class="ch-c ${ZK[st.zone]}${k === 'us' ? ' us' : ''}" style="grid-row:${r + 3};grid-column:${st.n + 1}" data-row="${k}">${inner}</div>`;
          }).join('');
      });
      h += `</div><div class="ch-legend">${Object.entries(C.zones).map(([z, t]) => `<span><i class="${ZK[z]}"></i>${esc(t)}</span>`).join('')}<span class="ch-src">Format and zones from the organizers’ example; content is our research.${full ? '' : ' All six rows, mapped to our layers, are in the appendix.'}</span></div>`;
      const box = $(sel);
      box.innerHTML = h;
      box.addEventListener('click', (e) => {
        const b = e.target.closest('.ch-rl'); if (!b) return;
        const on = b.classList.contains('on');
        $$('.ch-rl', box).forEach((x) => x.classList.toggle('on', !on && x === b));
        $('.ch-grid', box).classList.toggle('focus', !on);
        $$('.ch-c', box).forEach((c) => c.classList.toggle('hot', !on && c.dataset.row === b.dataset.row));
      });
    }

    function fates() {
      // dots: what happened to each Round 1 pick, and where W1 and W3 grew from
      $$('#dots .wd').forEach((el, k) => {
        const d = DOTS[k];
        if (d.cand) {
          const c = CANDIDATES.find((x) => x.n === d.cand), f = CAND_FATE[c.id];
          el.classList.add('fate-' + f.k);
          el.insertAdjacentHTML('beforeend', `<em class="wd-fate">${esc(f.tag)}</em>`);
        }
        if (d.label === 'L2+ ADAS stacks') { el.classList.add('fate-grew'); el.insertAdjacentHTML('beforeend', '<em class="wd-fate">W1 and W3 grew from a narrow niche here</em>'); }
      });
      // cards: one reason each; SBOM gets the two-round explanation
      $$('#cands .cand').forEach((el) => {
        const c = CANDIDATES.find((x) => x.n === +el.dataset.n), f = CAND_FATE[c.id];
        el.classList.add('fate-' + f.k);
        const now = $('.c-now', el);
        now.innerHTML = `<b class="fate-tag">${esc(f.tag)}</b>${c.id === 'sbom' ? ' Real need, weak fit, in both rounds:' : ' ' + esc(f.why)}`;
        if (c.id === 'sbom') now.insertAdjacentHTML('afterend', `<div class="sb-why">${SBOM_WHY.steps.map(([w, t, d]) => `<div><small>${esc(w)}</small><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('')}</div><p class="sb-keep">${esc(SBOM_WHY.keep)}</p>`);
      });
    }

    function scoreNotes() {
      const H = SCORE_HOW.round2;
      $('#r2Foot').innerHTML = `<div class="r2-how"><b class="r2-h">${esc(H.head)}</b><p>${esc(H.intro)}</p>
        <ol><li class="lbl">Bars in each cell, left to right:</li>${H.q.map(([k, q], i) => `<li><em>${i + 1}</em><b>${esc(k)}</b> ${esc(q)}</li>`).join('')}</ol>
        <p class="r2-rule"><b>Pass</b> = at least 17 of 25, with Fit and Access each at least 3. Differentiation of 2 or less makes a pass conditional.${citeHtml('b133v2')}</p></div>`;
      $('#scNote').innerHTML = `<span class="ll-star">★</span> shortlisted on the map. <b>${esc(SCORE_HOW.round1.split('. ')[0])}.</b> ${esc(SCORE_HOW.round1.split('. ').slice(1).join('. '))}${citeHtml('b133')}`;
    }

    function bmcStages() {
      $$('#bmGrid .bmc').forEach((el, k) => {
        const b = BMCS[k], on = BMC_STAGES[b.id] || [];
        $('.bmc-what', el).insertAdjacentHTML('afterend', `<div class="bmc-st"><span>Where it plays</span><ol>${CHAIN.stages.map((st) => `<li class="${on.includes(st.n) ? 'on' : ''}${st.zone === 'discovery' ? ' dz' : ''}" title="${esc(st.n + '. ' + st.name)}">${st.n}</li>`).join('')}</ol><em>${on.map((n) => esc(CHAIN.stages[n - 1].name)).join(' · ')}</em></div>`);
      });
    }

    function pipeBar() {
      const box = $('#plBody .pl-sum > div:last-child');
      if (!box) return;
      const kinds = [['Sponsor', 'sponsor'], ['Both', 'both'], ['Independent', 'independent']].map(([k, c]) => [k, c, PIPELINE.rows.filter((r) => r.kind === k).length]);
      box.classList.add('pl-mix');
      box.innerHTML = `<div class="pl-bar">${kinds.map(([k, c, n]) => `<i class="k-${c}" style="flex:${n}">${n} ${k.toLowerCase()}</i>`).join('')}</div><span>Channels for our 7 personas. 5 of 7 use independent outreach, so at least half of our interviews can come from it, as Studio 2 requires.</span>`;
    }

    function build() { chain(); chain('#chxBody', true); fates(); scoreNotes(); bmcStages(); pipeBar(); }

    function readerChain(sec) {
      const S = CHAIN.stages;
      return sec('r-chain', 'Value chain · the organizers’ format', 'All three wedges sit inside the EcoCAR discovery zone',
        `<div class="r-scroll"><table class="r-table r-chain"><thead><tr><th></th>${S.map((st) => `<th class="${ZK[st.zone]}">${st.n}. ${esc(st.name)}<small>${st.zone === 'discovery' ? 'Discovery zone' : st.zone === 'adjacent' ? 'Adjacent' : 'OEM has it covered'}${st.ours.length ? ' · our layers ' + st.ours.map((n) => 'L0' + n).join(', ') : ''}</small></th>`).join('')}</tr></thead>
         <tbody>${CHAIN.rows.map(([k, l]) => `<tr><th scope="row">${esc(l)}</th>${S.map((st) => `<td>${k === 'us' ? (st.w || []).map((id) => `<b>${wd(id).code}</b> `).join('') : ''}${rich(st[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
         <p class="r-note">Format and zones from the organizers’ example; content is our research. The positions we dropped (zonal migration, OTA, SBOM) all sat outside the discovery zone.</p>`,
        'The organizers’ seven-stage value chain, filled in with our research.');
    }
    function readerSbom() {
      return `<div class="r-sbom"><h3>${esc(SBOM_WHY.title)}</h3><p>${rich(SBOM_WHY.need)}</p><ol>${SBOM_WHY.steps.map(([w, t, d]) => `<li><b>${esc(w)}: ${esc(t)}.</b> ${esc(d)}</li>`).join('')}</ol><p>${esc(SBOM_WHY.keep)}</p></div>`;
    }
    return { build, readerChain, readerSbom };
  })();

  // =================================================================== v14 · CALMER LATE SLIDES
  // Outreach as a contact sequence, society as five guardrail cards, risks on one
  // timeline, questions linked to their evidence, and lighter appendix notes.
  const v14 = (() => {
    const wd = (id) => WEDGES.list.find((w) => w.id === id);
    const wChips = (s) => s.split(/,\s*/).map((c) => { const w = WEDGES.list.find((x) => x.code === c.trim()); return w ? `<i class="v-w" style="--k:var(--${w.colour}-m)">${w.code}</i>` : ''; }).join('');
    const nm = (id) => { const e = document.getElementById(id); return e ? e.dataset.title : id; };
    const PATHS = {
      shield: 'M12 2 4 5v6c0 5.2 3.4 9.6 8 11 4.6-1.4 8-5.8 8-11V5zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4z',
      lock: 'M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z',
      eye: 'M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      people: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 21v-2c0-3 4-5 8-5s8 2 8 5v2zm17 0v-2c0-1.6-.6-2.9-1.7-3.9C19.6 15.4 23 16.8 23 19v2z',
      leaf: 'M21 3C10 3 4 8 4 15.5c0 1.6.4 3 1 4.2L3 21.6 4.4 23l2-2c1.2.6 2.6 1 4.1 1C17 22 22 16 21 3zM8.5 18.5c1.5-4.2 4.4-7.5 8.5-9.5-3 2.8-5 6-6.2 9.8z',
    };
    const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${PATHS[k]}"/></svg>`;
    const ST = { 'In progress': 'on', Parked: 'park', 'Not started': 'new' };

    function rulesDialog() {
      let d = $('#poDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'poDlg'; d.className = 'sc-dlg po-dlg'; d.setAttribute('aria-labelledby', 'poDlgH');
        d.innerHTML = `<header><div><small>Outreach plan</small><h3 id="poDlgH">How we reach out, and how we interview</h3></div><button type="button" class="tog" data-close>Close</button></header>
          <div class="po-rl"><section><h5>Reaching out</h5><ul>${PIPELINE.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>
          <section><h5>In the interview</h5><ul>${PLAN.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section></div>`;
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      d.showModal();
    }

    function pipeline() {
      const rows = PIPELINE.rows.slice().sort((a, b) => (a.n === 'Parked') - (b.n === 'Parked'));
      const kinds = [['Sponsor', 'sponsor'], ['Both', 'both'], ['Independent', 'independent']].map(([k, c]) => [k, c, PIPELINE.rows.filter((r) => r.kind === k).length]);
      const indep = PIPELINE.rows.filter((r) => r.kind !== 'Sponsor').length;
      const maxC = Math.max(...PIPELINE.convs.map((c) => c[1]));
      const box = $('#plBody');
      box.className = 'po rv';
      box.innerHTML = `<ol class="po-track">${rows.map((r, i) => `<li class="po-c st-${ST[r.n] || 'on'} rv" style="--d:${3 + i * 0.5}">
          <header><em>${i + 1}</em><b>${esc(r.p)}</b><span class="pl-st st-${ST[r.n] || 'on'}">${esc(r.n)}</span></header>
          <p>${esc(r.who)}</p><div class="po-w">${wChips(r.w)}</div>
          <div class="po-ch"><span class="pl-k k-${r.kind.toLowerCase()}">${esc(r.kind)}</span><span>${esc(r.ch)}</span></div>
          <footer>${esc(r.next)}</footer></li>`).join('')}</ol>
        <div class="po-sum">
          <div class="po-t"><b>~10</b><span>people to interview. Many speak to two wedges, so we expect about this many conversations per wedge:</span>
            <div class="po-cv">${PIPELINE.convs.map(([id, n]) => { const w = wd(id); return `<span style="--k:var(--${w.colour}-m)"><em>${w.code}</em><i><u style="width:${(n / maxC) * 100}%"></u></i><b>${n}</b></span>`; }).join('')}</div></div>
          <div class="po-t"><b>${indep} of ${PIPELINE.rows.length}</b><span>personas we can reach through independent outreach, so at least half of our interviews can come from it, as Studio 2 requires</span>
            <div class="pl-bar">${kinds.map(([k, c, n]) => `<i class="k-${c}" style="flex:${n}">${n} ${k.toLowerCase()}</i>`).join('')}</div></div>
          <div class="po-t po-go"><b>15 Dec</b><span>licence and data access confirmed, and a named Applied Intuition contact</span><button type="button" class="tog" id="poRules">How we reach out and interview</button></div>
        </div>`;
      $('#poRules').addEventListener('click', rulesDialog);
    }

    function society() {
      const box = $('#soBody');
      box.className = 'so2';
      box.innerHTML = SOCIETY.cards.map((c, k) => `<article class="so2-c rv" style="--d:${3 + k}">
          <header><span class="so2-i">${svg(c.icon)}</span><h4>${esc(c.k)}</h4></header>
          <p class="so2-r"><small>Could go wrong</small>${esc(c.risk)}</p>
          <div class="so2-g"><small>What we do</small><ul>${c.guard.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
          <p class="so2-o"><small>Still open</small>${esc(c.open)}</p></article>`).join('')
        + `<p class="so2-note rv" style="--d:9">${esc(SOCIETY.note)}</p>`;
    }

    function gaps() {
      const RC = ['#f87171', '#fbbf24', '#22d3ee', '#a78bfa'];
      $('#riskCards').innerHTML = RISKS.map((r, k) => `<article class="rg2 rv" style="--d:${3 + k};--rc:${RC[k]}"><div class="rg-k">${esc(r.k)}</div><div class="rg-n">${esc(r.n)}</div><p>${esc(r.t)}</p></article>`).join('');
      $('#gpBody').innerHTML = `<h5>What we do about it, and by when <small>(stops in date order, not to scale)</small></h5>
        <ol class="tl">${GAP_TIMELINE.map((st) => `<li${st.r.length + st.g.length > 2 ? ' class="tl-wide"' : ''}><b class="tl-d">${esc(st.when)}</b><i class="tl-dot"></i>
          ${st.r.map((i) => `<div class="tl-a" style="--rc:${RC[i]}"><small>${esc(RISKS[i].k)}</small>${esc(RISKS[i].act)}</div>`).join('')}
          ${st.g.map((i) => `<div class="tl-a gap" title="${esc(GAPS[i][1])}"><small>${esc(GAPS[i][0])}</small>${esc(GAPS[i][2])}</div>`).join('')}</li>`).join('')}</ol>`;
    }

    function asks() {
      const list = $('#askList');
      list.innerHTML = ASKS.map((q, k) => { const [tag, id] = ASK_TAGS[k]; return `<li class="rv" style="--d:${3 + k}"><b>${k + 1}</b><span>${esc(q)}</span><button type="button" class="ask-tag" data-gs="${id}"><em>${esc(tag)}</em>${esc(nm(id))} →</button></li>`; }).join('');
      list.addEventListener('click', (e) => { const b = e.target.closest('[data-gs]'); if (b) goId(b.dataset.gs); });
    }

    function appendix() {
      // Round 1 scoring: chevron notes and weight descriptions become tooltips; the method note folds away
      $$('#funnel .fn').forEach((li) => { const n = $('.fn-note', li); if (n) li.title = n.textContent; });
      $$('#weights .wt').forEach((l) => { const d = $('.wt-d', l); if (d) l.title = d.textContent; });
      const sc = $('#scNote');
      if (sc && !sc.querySelector('details')) sc.innerHTML = `<details class="v14-how"><summary>Where these numbers come from</summary><div>${sc.innerHTML}</div></details>`;
      // evidence audit: shorter subtitle (the counts are on the left)
      // v15: the audit subtitle is set by fc.build (counts that add up)
    }

    function build() { pipeline(); society(); gaps(); asks(); appendix(); }
    return { build };
  })();

  // =================================================================== v15 · REVIEW FIXES
  // Contents as chapter cards with their Check-In codes; one growth callout; a static
  // company-screen legend with the sponsor check; personas merged into the interview plan;
  // risks with their dated actions; and progress since 10 Nov.
  const v15 = (() => {
    const wd = (id) => WEDGES.list.find((w) => w.id === id);
    const wChips = (s) => s.split(/,\s*/).map((c) => { const w = WEDGES.list.find((x) => x.code === c.trim()); return w ? `<i class="v-w" style="--k:var(--${w.colour}-m)">${w.code}</i>` : ''; }).join('');
    const sl = () => [...document.querySelectorAll('#deck > .slide')];
    const no = (id) => sl().findIndex((s) => s.id === id) + 1;
    const inCh = (cid) => sl().filter((s) => s.dataset.ch === cid);

    function contents() {
      const ck = (cid) => CHECKIN.filter((x) => x.ch.includes(cid)).map((x) => `<em title="${esc(x.t)}">Check-In ${esc(x.code)}</em>`).join('');
      $('#mpGrid').innerHTML = CHAPTERS.filter((c) => typeof c.n === 'number').map((c, k) => `<article class="mp-ch rv" style="--d:${3 + k}">
          <header><b>${c.n}</b><span>${esc(c.name)}</span></header>
          <div class="mp-tags">${c.code ? `<i>Brief ${esc(c.code)}</i>` : ''}${ck(c.id)}</div>
          <p>${esc(c.q)}</p>
          <ol>${inCh(c.id).map((s) => `<li><button type="button" data-gs="${s.id}"><em>${no(s.id)}</em>${esc(s.dataset.title)}</button></li>`).join('')}</ol></article>`).join('');
      $('#mpCheck').innerHTML = `<div class="mp-tools"><span class="mp-appx">Appendix: ${inCh('appx').map((s) => `<button type="button" data-gs="${s.id}">${esc(s.dataset.title)}</button>`).join(' · ')}</span>
        <button type="button" class="tog" id="mpGloss">Glossary of terms</button><button type="button" class="tog" id="mpScore2">Scorecard map</button></div>`;
      $('#mpScore2').addEventListener('click', () => extra.scorecard());
      $('#mpGloss').addEventListener('click', () => { goId('s-fc'); setTimeout(() => { const b = $('#tab-glossary'); if (b) b.click(); }, 150); });
    }

    function grow() { /* v16: the growth callout is built by the v16:grow module */ }

    function screenLegend() {
      const H = SCORE_HOW.round2;
      $('#r2Foot').innerHTML = `<div class="r2-key"><span class="r2-k1"><b>Each cell</b> = five team scores, 1–5 each, from public evidence (bars, left to right):</span>
          ${H.q.map(([k], i) => `<span><em>${i + 1}</em>${esc(k)}</span>`).join('')}
          <span class="r2-k2"><b>Pass</b> = 17+ of 25, with Fit and Access at least 3${citeHtml('b133v2')}</span></div>
        <p class="r2-sponsor">${esc(ROUND2.sponsorCheck)}</p>`;
      // label the five bars on the first cell only, so the reader learns the code once
      const first = $('#r2Matrix .r2c');
      if (first && !first.querySelector('.r2c-lab')) first.insertAdjacentHTML('beforeend', `<span class="r2c-lab" aria-hidden="true">${ROUND2.criteria.map((c) => `<i>${esc(c.short)}</i>`).join('')}</span>`);
    }

    function interview() {
      const ST = (n) => (/match/.test(n) ? 'found' : n === 'Parked' ? 'park' : n === 'Not started' ? 'new' : 'on');
      const P = Object.fromEntries(PERSONAS.map((p) => [p.code, p]));
      const indep = PIPELINE.rows.filter((r) => r.kind !== 'Sponsor').length;
      const kinds = [['Sponsor', 'sponsor'], ['Both', 'both'], ['Independent', 'independent']].map(([k, c]) => [k, c, PIPELINE.rows.filter((r) => r.kind === k).length]);
      const maxC = Math.max(...PIPELINE.convs.map((c) => c[1]));
      const F = PIPELINE.found;
      const box = $('#plBody');
      box.className = 'iv rv';
      box.innerHTML = `<ol class="iv-track">${PIPELINE.rows.map((r, i) => {
          const p = P[r.p];
          return `<li class="iv-c st-${ST(r.n)} rv" style="--d:${3 + i * 0.4}">
          <button type="button" class="iv-b" ${p ? `data-p="${esc(r.p)}"` : 'disabled'} aria-label="${esc(r.p)}: ${esc(r.who)}${p ? '. Open the full persona' : ''}">
            <header><em>${i + 1}</em><span class="iv-code">${esc(r.p)}</span><span class="arch">${p ? 'Archetype' : 'To draft'}</span></header>
            ${p ? `<b class="iv-n">${esc(p.name)}</b>` : '<b class="iv-n">Persona to draft</b>'}
            <p class="iv-who">${esc(r.who)}</p>
            <div class="iv-w">${wChips(r.w)}</div>
            <div class="iv-st"><span class="pl-st st-${ST(r.n)}">${esc(r.n)}</span>${r.found ? `<span class="iv-dots" title="${r.found} real ${r.found > 1 ? 'people' : 'person'} matched; names kept private">${'<i></i>'.repeat(r.found)}</span>` : ''}</div>
            <div class="iv-ch"><span class="pl-k k-${r.kind.toLowerCase()}">${esc(r.kind)}</span></div>
            <p class="iv-chx">${esc(r.ch)}</p>
            <footer><small>Next</small>${esc(r.next)}</footer>
          </button></li>`;
        }).join('')}</ol>
        <div class="iv-sum">
          <div class="po-t"><b>${F.people} real people</b><span>matched to ${F.personas} of our ${F.of} written personas on ${esc(F.date.replace(' 2026', ''))}. Names stay in our private tracker; no one contacted yet.</span></div>
          <div class="po-t"><b>~10</b><span>interviews. Many people speak to two wedges, so about this many conversations per wedge:</span>
            <div class="po-cv">${PIPELINE.convs.map(([id, n]) => { const w = wd(id); return `<span style="--k:var(--${w.colour}-m)"><em>${w.code}</em><i><u style="width:${(n / maxC) * 100}%"></u></i><b>${n}</b></span>`; }).join('')}</div></div>
          <div class="po-t"><b>${indep} of ${PIPELINE.rows.length}</b><span>reachable without a sponsor, so at least half of our interviews can be independent, as Studio 2 requires</span>
            <div class="pl-bar">${kinds.map(([k, c, n]) => `<i class="k-${c}" style="flex:${n}">${n} ${k.toLowerCase()}</i>`).join('')}</div></div>
          <div class="po-t po-go"><b>15 Dec</b><span>licence access confirmed and a named Applied Intuition contact</span><button type="button" class="tog" id="poRules">How we reach out and interview</button></div>
        </div>`;
      box.addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) personaSlide.open(P[b.dataset.p]); });
      $('#poRules').addEventListener('click', () => { const d = $('#poDlg'); if (d) d.showModal(); else v14rules(); });
    }
    // the outreach-rules dialog from v14, built on demand
    function v14rules() {
      const d = document.createElement('dialog');
      d.id = 'poDlg'; d.className = 'sc-dlg po-dlg'; d.setAttribute('aria-labelledby', 'poDlgH');
      d.innerHTML = `<header><div><small>Who we will interview</small><h3 id="poDlgH">How we reach out, and how we interview</h3></div><button type="button" class="tog" data-close>Close</button></header>
        <div class="po-rl"><section><h5>Reaching out</h5><ul>${PIPELINE.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>
        <section><h5>In the interview</h5><ul>${PLAN.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section></div>`;
      document.body.appendChild(d);
      d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      d.showModal();
    }

    function gaps() {
      const RC = ['#f87171', '#fbbf24', '#22d3ee', '#a78bfa'];
      $('#riskCards').innerHTML = RISKS.map((r, k) => `<article class="rg3 rv" style="--d:${3 + k};--rc:${RC[k]}"><div class="rg-k">${esc(r.k)}</div><div class="rg-n">${esc(r.n)}</div><p>${esc(r.t)}</p>
          <div class="rg-act"><small>What we do · by ${esc(r.by)}</small><p>${esc(r.act)}</p></div></article>`).join('');
      $('#gpBody').innerHTML = `<div class="rg-line"><h5>Done since 10 Nov</h5><ul>${DONE.map(([k, t, d]) => `<li class="done"><b>${esc(k)}</b>${esc(t)}<em>${esc(d)}</em></li>`).join('')}</ul></div>
        <div class="rg-line"><h5>Smaller gaps we are closing</h5><ul>${GAPS.map(([k, , a, d]) => `<li><b>${esc(k)}</b>${esc(a)}<em>${esc(d)}</em></li>`).join('')}</ul></div>`;
    }

    function society() {
      const n = $('.so2-note'); if (n) n.innerHTML = `<b>${esc(SOCIETY.summary)}</b> ${esc(SOCIETY.note)}`;
    }

    function dossierAlt() {
      // W1's dossier: what today's tools show, what they miss, and what W1 adds (general terms)
      // v16: the dossier slide renders this itself (DOSSIERS[].story.today), so nothing to add
      if (!$('#dpBody')) return;
      const add = () => {
        const wk = $('#dpBody .ds-case .wk');
        if (!wk || wk.dataset.v15) return;
        wk.dataset.v15 = '1';
        wk.innerHTML = `<h4>What they use today, and what it misses</h4><table class="alt"><thead><tr><th>Today</th><th>Shows</th><th>Misses</th></tr></thead><tbody>${ALTERNATIVES.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table><p class="alt-add">${esc(ALT_ADDS)}</p>`;
      };
      new MutationObserver(() => { if ($('#doPanel').getAttribute('aria-labelledby') === 'dt-ml') add(); }).observe($('#dpBody'), { childList: true });
      add();
    }

    function titles() {
      // long action titles drop to a smaller size so they stay on one or two lines
      $$('.head .title').forEach((t) => t.classList.toggle('long', t.textContent.trim().length > 48));
    }
    function build() { contents(); grow(); screenLegend(); interview(); gaps(); society(); dossierAlt(); titles(); }
    return { build };
  })();

  // =================================================================== v3 · READING MODE
  // A responsive, scrolling document generated from the same data: works on
  // phones and small laptops, prints to PDF, and needs no 1600×900 stage.
  let reader18 = () => {};   // v18: reading-mode fixes, set by the v18:asks module
  const reader = (() => {
    const root = $('#reader');
    let built = false;
    const sec = (id, kicker, title, body, sub = '') => `<section class="r-sec" id="${id}" aria-labelledby="${id}-h">
        <div class="r-k">${kicker}</div><h2 id="${id}-h">${title}</h2>${sub ? `<p class="r-sub">${sub}</p>` : ''}${body}</section>`;
    const ul = (arr, cls = '') => `<ul class="${cls}">${arr.map((t) => `<li>${rich(t)}</li>`).join('')}</ul>`;
    function build() {
      const who = [TEAM.name, TEAM.university].filter(Boolean).join(' · ');
      const toc = [['r-exec', 'Summary'], ['r-map', 'Contents'], ['r-why', '1 Market'], ['r-eco', 'Ecosystem'], ['r-chain', 'Value chain map'], ['r-vc', 'Value chain'], ['r-grow', 'Growth'], ['r-bmc', '2 Business models'], ['r-evolve', '3 Where we fit'], ['r-people', 'Personas'], ['r-wedges', '4 Wedges'], ['r-pipeline', '5 Outreach'], ['r-society', 'Society'], ['r-gaps', 'Risks & gaps'], ['r-asks', 'Questions'], ['r-ws', 'Appendix'], ['r-audit', 'Evidence']];
      const tg = DOSSIERS.filter((d) => d.focus);
      let h = `<nav class="r-toc" aria-label="Contents">${toc.map(([id, t]) => `<a href="#${id}" data-r="${id}">${t}</a>`).join('')}</nav><div class="r-wrap">`;

      // cover
      h += `<header class="r-cover" id="r-top"><div class="r-k">${esc(TEAM.program)} · ${esc(TEAM.track)} · Check-In 1 (B-1.3.1 to B-1.3.3) · Studio 1 (B-2.3.1 to B-2.3.4)</div>${who ? `<div class="r-team">${esc(who)}</div>` : ''}
        <h1>${esc(EXEC.thesis)}</h1><p class="r-lead">${esc(EXEC.sub)}</p>
        <div class="r-stats"><div><b>8</b>value-chain layers mapped</div><div><b>15</b>company tests: 5 ideas × 3 companies</div><div class="hl"><b>3</b>wedges to test in Studio 2</div></div>
        <p class="r-map"><b>How it is organized:</b> five chapters that follow the Studio 1 brief, then an appendix. <a href="#r-map">See the contents and the Check-In map</a>.</p>
        <p class="r-asof">${esc(TEAM.submission)} · as of ${esc(TEAM.updated)} <button class="r-present" type="button">Present fullscreen ▸</button></p></header>`;


      // executive summary
      h += sec('r-exec', 'Executive summary', 'Our opening is the evidence work every OEM must finish before launch',
        `<p class="r-bl">${esc(EXEC.bottomLine)}</p><div class="r-facts">${EXEC.facts.map((f) => `<div><b>${esc(f.v)}</b><span>${rich(f.t)}</span></div>`).join('')}</div>
         <h3>Three wedges for customer discovery</h3><ol class="r-targets">${WEDGES.list.map((w, k) => `<li style="${cv(w.colour)}"><a href="#r-wedge-${w.id}"><b>${esc(w.code)} · ${esc(w.name)}</b></a><span>${esc(w.tag)} · ${esc(w.from)} · DFV ${wedgeSlide.pct()[k]}% · confidence low</span></li>`).join('')}</ol>
         <p class="r-note"><b>Weakest:</b> ${esc(WEDGES.weakestShort)} Our first screen pointed to HIL, zonal and OTA; testing them against real companies dropped zonal and OTA and narrowed HIL. <a href="#r-evolve">How we narrowed.</a></p><p class="r-note">${esc(EXEC.howToRead)}</p>
         <h3>First claim we test for each wedge</h3><ol>${EXEC.tests.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`);

      // why
      h += sec('r-why', 'Why the market is changing', 'Why companies are betting on SDVs',
        `<div class="r-cards c4">
          <article><h4>Recurring revenue</h4><b class="r-big">$3.1B</b><p>GM guides ~$3.1B of OnStar revenue for 2026${citeHtml('gm-q1')} and targets ~70% gross margins on OnStar and Super Cruise${citeHtml('gm-q3l')}.</p></article>
          <article><h4>Cheaper hardware</h4><b class="r-big">17 → 7</b><p>Rivian’s Gen 2 R1 cut ECUs from 17 to 7${citeHtml('rivian')}.</p></article>
          <article><h4>Cheaper recalls</h4><b class="r-big">29.3M</b><p>vehicles in 891 US recalls in 2025${citeHtml('nhtsa')}. OTA fixes could save US OEMs $1.5B by 2028 (2023 forecast)${citeHtml('abi')}.</p></article>
          <article><h4>Faster development</h4><b class="r-big">18–24 mo</b><p>Chinese rivals target 18–24-month cycles, about half the Western norm${citeHtml('spg-china')}.</p></article></div>`,
        `Automotive software and electronics: $519B by 2035, growing 4.5% a year against ~1% for vehicles${citeHtml('mck')}.`);

      // ecosystem
      const supply = ACTORS.filter((a) => a.side === 'L'), demand = ACTORS.filter((a) => a.side === 'R');
      const actorCard = (a) => `<article class="r-actor" id="r-actor-${a.id}" style="${cv(a.colour)}"><h4>${esc(a.title)}${a.focus ? ' <em>our focus area</em>' : ''}</h4><p class="r-dim">${esc(a.sub)}</p>${chips(a.logos)}
          <dl><dt>Brings</dt><dd>${rich(a.gives)}</dd><dt>Gets paid</dt><dd>${rich(a.gets)}</dd><dt>What SDVs change</dt><dd>${rich(a.sdv)}</dd></dl></article>`;
      const flowRows = FLOWS.filter((f) => f.label && f.type !== 'rules').map((f) => {
        const nm = (e) => (typeof e === 'object' ? (f.a || []).map((x) => (ACTORS.find((a) => a.id === x) || {}).title).join(' → ') : e === 'hub' ? 'Automakers' : (ACTORS.find((a) => a.id === e) || {}).title);
        const from = typeof f.from === 'object' ? (ACTORS.find((a) => a.id === f.a[0]) || {}).title : nm(f.from);
        const to = typeof f.to === 'object' ? (ACTORS.find((a) => a.id === f.a[1]) || {}).title : nm(f.to);
        return `<tr><td>${esc(from)} → ${esc(to)}</td><td>${esc(f.label)}</td><td>${f.money ? esc(f.money) : '—'}</td><td>${f.back ? esc(f.back) : f.type === 'data' ? 'data' : '—'}</td><td>${f.shift ? `<span class="r-shift">${f.shift}</span>` : ''}${f.isNew ? ' new with SDVs' : ''}</td></tr>`;
      }).join('');
      h += sec('r-eco', 'Ecosystem', 'The OEM is still the hub, but SDVs add a second revenue loop after the sale',
        `<article class="r-actor r-hub" id="r-actor-hub" style="${cv('Ltwo')}"><h4>Automakers (OEMs): the hub</h4>${chips(HUB.oems)}<dl><dt>Brings</dt><dd>${rich(HUB.gives)}</dd><dt>Gets paid</dt><dd>Before SDVs: ${esc(HUB.getsBefore)} With SDVs: ${esc(HUB.gets)}</dd><dt>Risk</dt><dd>${rich(HUB.sdv)}</dd></dl></article>
         <article class="r-actor" id="r-actor-reg" style="${cv('Ltwo')}"><h4>${esc(REGULATORS.title)}</h4><p class="r-dim">${esc(REGULATORS.list.join(' · '))}</p><p>${rich(REGULATORS.detail)}</p></article>
         <h3>Supply side</h3><div class="r-cards c2">${supply.map(actorCard).join('')}</div>
         <h3>Demand side</h3><div class="r-cards c2">${demand.map(actorCard).join('')}</div>
         <h3>What SDVs change</h3><ol class="r-shifts">${SHIFTS.map((s) => `<li><b>${esc(s.title)}.</b> ${rich(s.text)}</li>`).join('')}</ol>
         <p class="r-note"><b>Before SDVs:</b> ${esc(ERA_TEXT.before.text)}</p>
         <h3>Flows</h3><div class="r-scroll"><table class="r-table"><thead><tr><th>From → to</th><th>Product or service</th><th>Paid back</th><th>Data</th><th>SDV shift</th></tr></thead><tbody>${flowRows}</tbody></table></div>`);

      // value chain (the 2D view)
      const order = [6, 5, 4, 3, 2, 1, 8, 7];
      h += sec('r-vc', 'Value chain', 'Six layers from silicon to paid services, and two that run through all of them',
        `<div class="r-layers">${order.map((id) => {
          const l = layerById(id);
          return `<article class="r-layer" id="r-layer-${id}" style="${cv(l.colour)}">
            <header><span class="r-num">${l.num}</span><div><h4>${esc(l.name)}</h4><p class="r-dim">${esc(l.scope)}</p></div></header>
            <div class="r-lrow">${meter(l.comp)}<span class="r-cap">${esc(CAPTURE_LABEL[l.capture])}</span>${pocket(l.pocket)}</div>
            <p class="r-stat"><b>${esc(l.stat)}</b> ${rich(l.statcap)}</p>${chips(l.logos)}
            <details><summary>The brief’s four questions</summary>
              <h5>What winning looks like</h5>${ul(l.winning)}<p class="r-dim"><b>KPIs:</b> ${esc(l.kpis)}</p>
              <h5>Moats &amp; growth drivers</h5>${ul(l.moats)}
              <h5>Critical, and where competition is low</h5>${ul(l.critical)}${l.critPocket ? pocket(l.critPocket) : ''}
              <h5>Engineering pain points</h5>${ul(l.pain)}${LAYER_FIT[l.id] ? `<p class="r-dim"><b>Where our skills fit:</b> ${esc(LAYER_FIT[l.id])}</p>` : ''}</details></article>`;
        }).join('')}</div>`,
        'Competition ratings and open pockets are team hypotheses. W1 and W2 mark where two of our wedges sit (W3 sits with W1 in the ADAS layer); dropped marks earlier targets.');

      // growth
      h += sec('r-grow', 'Value capture', 'Where the money grows',
        `<div class="r-pools">${POOLS.slice().sort((a, b) => b.to - a.to).map((p) => `<div class="r-pool"><span class="r-pn">${esc(p.name)} <small>${esc(p.years)} · ${esc(COMP_LABEL[layerById(p.layer).comp].toLowerCase())}</small></span>
            <span class="r-pt"><i style="left:${(p.from / 55) * 100}%;width:${((p.to - p.from) / 55) * 100}%"></i></span><span class="r-pv">${p.approx ? '~' : ''}$${p.from}B → <b>${p.approx ? '~' : ''}$${p.to}B</b> · ${p.cagr.toFixed(1)}%/yr${p.computed ? ' (computed)' : ''}</span></div>`).join('')}</div>
         <p class="r-note">Every pool ends in 2035, so end values compare like with like; start years differ (2025 or 2030). Source: McKinsey${citeHtml('mck')}. All four sit in layers we rate crowded; our wedges are evidence work beside them, not rivals in them. McKinsey gives no comparable pool for telematics, data or OTA.</p>
         <div class="r-cards c2">
          <article><h4>Every month: telematics, data &amp; cloud</h4><p>Smaller, but still growing: GM guides OnStar to ~$3.1B in 2026, +15%${citeHtml('gm-q1')}; Samsara’s ARR is up 30% a year${citeHtml('samsara')}.</p></article>
          <article><h4>Integration and V&amp;V: 11.4%/yr</h4><p>The fastest-growing of McKinsey’s top-level auto software segments, growing 11.4% a year through 2035, about 2.5 times the 4.5% of the whole software and electronics market${citeHtml('mck')}. Split by function instead, ADAS software grows faster, in a crowded layer. All three of our wedges are validation work.</p></article></div>`,
        'The biggest pools are per-vehicle software and compute, in crowded layers; recurring services are smaller but growing.');

      // whitespace
      const quad = (fx) => DOTS.filter(fx).map((d) => `<li style="${cv(d.colour)}">${d.cand ? '<b>★</b> ' : ''}${esc(d.label)}</li>`).join('');
      h += sec('r-ws', 'Round 1 · Cross-layer synthesis', 'Round 1 pointed to four whitespace pockets',
        `<div class="r-quads"><div class="ws"><h4>Engineering whitespace</h4><small>critical, fragmented</small><ul>${quad((d) => d.y >= 0.5 && d.x < 0.5)}</ul></div>
          <div><h4>Crowded core</h4><small>critical, crowded</small><ul>${quad((d) => d.y >= 0.5 && d.x >= 0.5)}</ul></div>
          <div><h4>Unproven</h4><small>less critical, fragmented</small><ul>${quad((d) => d.y < 0.5 && d.x < 0.5)}</ul></div>
          <div><h4>Commodity</h4><small>less critical, crowded</small><ul>${quad((d) => d.y < 0.5 && d.x >= 0.5)}</ul></div></div>
         <div class="r-cards c2">${CANDIDATES.map((c) => `<article style="${cv(c.colour)}" class="${c.screened ? 'r-scr' : ''}"><h4>${esc(c.title)} ${c.screened ? '<em>cut in Round 1</em>' : ''}</h4><p>${rich(c.text)}</p><p class="r-dim"><b>Personas:</b> ${esc(c.personas)}</p><p><b>${esc(c.now)}</b></p></article>`).join('')}</div>`,
        'Placed by criticality to launch and competitive intensity: team assessments, not measurements.');

      // funnel + scores
      h += sec('r-funnel', 'Round 1 · 5 Oct · How the shortlist was produced', 'From seven open pockets to three targets',
        `<ol class="r-funnel">${FUNNEL.map((f) => `<li><b>${esc(String(f.n))}</b> ${esc(f.label)} <small>${esc(f.stage)} · ${esc(f.note)}</small></li>`).join('')}</ol>
         <div class="r-scroll"><table class="r-table"><thead><tr><th>Position</th>${SCREEN.criteria.map((c) => `<th>${esc(c.label)}<small>${c.w}%</small></th>`).join('')}<th>Feasibility</th><th>Market</th><th>Priority</th></tr></thead>
         <tbody>${ranking().map(({ p, f, pr }, i) => `<tr class="${i < 3 ? 'top' : ''}"><td>${i + 1}. ${esc(p.name)}${SHORTLISTED.has(p.id) ? ' ★' : ''}</td>${SCREEN.criteria.map((c) => `<td>${p.s[c.id]}</td>`).join('')}<td><b>${f.toFixed(2)}</b></td><td>${p.market.toFixed(1)}</td><td><b>${pr.toFixed(1)}</b></td></tr>`).join('')}</tbody></table></div>
         <p class="r-note">★ shortlisted in B-2.3.1. All seven open pockets were re-scored, so the shortlist could be overturned. ${rich(SCREEN.note)} ${esc(SCREEN.capabilities)}</p>
         <h3>How market attractiveness was judged</h3><p>${esc(SCREEN.marketNote)}</p>
         <div class="r-scroll"><table class="r-table r-market"><thead><tr><th>Position</th><th>Criticality to launch or approval</th><th>Competition</th><th>Market</th></tr></thead>
         <tbody>${ranking().map(({ p }) => `<tr><td>${esc(p.name)}</td><td><b>${esc(p.crit[0])}</b>: ${esc(p.crit[1])}</td><td><b>${esc(p.comp[0])}</b>: ${esc(p.comp[1])}</td><td>${p.market.toFixed(1)}</td></tr>`).join('')}</tbody></table></div>
         <h3>How sensitive is the ranking?</h3><p class="r-robust">${sensitivityHtml(sensitivity())}</p>`,
        'Priority = team feasibility (skill, assets, prototype, access, edge) × market attractiveness from the B-2.3.1 map.');

      // v7: business models, company screen, how the thinking changed (v16: two canvases, sources behind a fold)
      h += sec('r-bmc', 'B-2.3.2 · Incumbent business models', 'How two incumbents make money',
        `<div class="r-cards c2">${BMC_PICK.map((id) => BMCS.find((b) => b.id === id)).map((b) => { const c = BMC_V16.cards[b.id], src = BMC_SOURCES[b.id]; return `<article><h4>${esc(b.name)}: ${esc(c.head[0].toLowerCase() + c.head.slice(1))}</h4><p class="r-dim">${esc(b.what)}</p>
            <p>Where it sells on the organizers’ value chain: ${(BMC_STAGES[b.id] || []).map((n) => `stage ${n}, ${esc(CHAIN.stages[n - 1].name)}`).join('; ')}.</p>
            <p>${b.stats.map(([v, t]) => `<b>${esc(v)}</b> ${esc(t)}`).join(' · ')}</p>
            <h5>How it makes money</h5>${ul(c.money.map(([g, t]) => `${t} (${g === 'now' ? 'main income today' : 'newer, growing'})`))}
            <h5>What protects it</h5><p>${esc(c.moat)}</p><p class="r-dim">${esc(b.watch)}</p>
            <h5>What it taught us</h5><p>${esc(c.lesson)}</p>
            <details><summary>Sources (${src.length})</summary><ol>${src.map(([p, t, dt, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t || p)}</a> <span class="r-dim">${t ? `${esc(p)} · ` : ''}${esc(dt)}</span></li>`).join('')}</ol></details>
            <p><a href="${esc(b.file)}">Full canvas (PDF)</a></p></article>`; }).join('')}</div>
         <p class="r-note">${esc(BMC_NOTE)} ${esc(BMC_V16.also.lead)} <a href="${esc(BMC_V16.also.file)}">${esc(BMC_V16.also.label)}</a>.</p>`,
        'Two companies at different stages of the value chain. Why these two: both are where our wedges would sell or plug in. dSPACE sponsors the challenge; Applied Intuition does not, so it tests whether we can reach a company on our own.');

      const co = ROUND2.companies;
      h += sec('r-round2', 'Round 2 · 26 Oct · Feasibility against real companies', 'Tested against real companies, 3 of 15 company tests pass',
        `<div class="r-scroll"><table class="r-table"><thead><tr><th>Position</th>${co.map((c) => `<th>${esc(c.name)}</th>`).join('')}</tr></thead>
         <tbody>${ROUND2.positions.map((p) => `<tr><td><b>${esc(p.name)}</b><br><small>${esc(p.sub)}</small></td>${co.map((c) => { const x = r2Pair(p.id, c.id); return `<td><b>${r2Total(x)}</b> of 25<br><small>${esc(x.label)}</small></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
         <p class="r-note">${esc(ROUND2.rule)} ${esc(ROUND2.notes)}${citeHtml('b133v2')}</p>
         <h3>All 15 company tests, and what decides each</h3>
         <div class="r-scroll"><table class="r-table"><thead><tr><th>Company test</th>${ROUND2.criteria.map((c) => `<th>${esc(c.short)}</th>`).join('')}<th>Total</th><th>What decides it</th></tr></thead>
         <tbody>${ROUND2.positions.flatMap((p) => co.map((c) => ({ p, c, x: r2Pair(p.id, c.id) }))).sort((a, b) => r2Total(b.x) - r2Total(a.x)).map(({ p, c, x }) => `<tr><td>${esc(p.name)} × ${esc(c.name)}</td>${x.s.map((v) => `<td>${v}</td>`).join('')}<td><b>${r2Total(x)}</b></td><td>${esc(x.decide)}${x.margin ? ` ${esc(x.margin)}` : ''}</td></tr>`).join('')}</tbody></table></div>`,
        'Can we do the work, can we reach them, and what can we add that they lack?');

      // v16: no dates, scores or ranks; one plain reason per idea, then the story behind it
      h += sec('r-evolve', 'How we narrowed', 'Two ideas survived the company check; W3 came after',
        `<p><b>Team fit</b>, what we are good at: HIL test benches, CAV perception work, and verification research we reach through our faculty advisor. <b>Real-company check</b> against dSPACE, Applied Intuition and Mobileye: does one already do it, could we reach them, and would they pull our work?</p>
         <div class="r-scroll"><table class="r-table"><thead><tr><th>Idea from our value chain map</th><th>What happened</th><th>Why</th></tr></thead>
         <tbody>${NARROW.rows.map((r) => `<tr><td>${esc(r.name)}</td><td><b>${esc(r.fate)}</b></td><td>${esc(r.why)}. <small>${esc(r.learned)} ${esc(r.more)}</small></td></tr>`).join('')}
         <tr><td>Added afterwards</td><td><b>W3</b></td><td>${esc(WEDGES.list.find((w) => w.id === 'w3').name)}: same focus area; not yet checked against companies.</td></tr></tbody></table></div>
         <h3>Why the answer changed</h3><ol>${NARROW.why.map(([t, d]) => `<li><b>${esc(t)}.</b> ${esc(d)}</li>`).join('')}</ol>
         <div class="r-cards c2"><article><h4>What stayed the same</h4>${ul(EVOLUTION.stayed)}</article><article><h4>What we still don’t know</h4>${ul(EVOLUTION.unknown)}</article></div>
         <p class="r-note">${esc(EVOLUTION.caution)}</p>`,
        'Each open pocket from our value chain map was screened for team fit, then checked against dSPACE, Applied Intuition and Mobileye.');

      // dossiers
      h += sec('r-dossier', 'B-2.3.3 · Wedge dossiers', 'What today’s tools miss, and where W1, W2 and W3 come in',
        DOSSIERS.map((d, di) => {
          const first = !d.focus && DOSSIERS[di - 1].focus ? '<h3 class="r-oldh">Earlier targets, kept on record</h3><p class="r-dim">Our first four targets, each with why it was dropped or narrowed.</p>' : '';
          return `${first}<article class="r-dos${d.screened ? ' r-scr' : ''}" id="r-dossier-${d.id}" style="${cv(d.colour)}">
            <h3>${d.focus ? esc(d.role) : d.screened ? 'Screened out in Round 1' : 'Round 1 #' + d.rank} · ${esc(d.title)}</h3>
            <p class="r-dim">Evidence confidence: <b>${esc(d.confidence.level)}</b>. ${esc(d.confidence.why)}</p>
            ${d.was ? `<p class="r-changed"><b>What changed in Round 2: ${esc(d.was.status.toLowerCase())}.</b> ${esc(d.record ? d.record.line : d.was.text)} ${esc(d.was.reopen)}</p>` : ''}
            <p>${rich(d.problem)}</p><p><b>${d.screened ? 'Why screened out' : 'Our edge'}:</b> ${rich(d.edge)}</p>
            ${d.screened ? '' : `<dl class="r-who"><dt>Users</dt><dd>${esc(d.users)}</dd><dt>Budget owners</dt><dd>${esc(d.budget)}</dd><dt>Gatekeepers</dt><dd>${esc(d.gate)}</dd><dt>Influencers</dt><dd>${esc(d.influence)}</dd><dt>Workaround today</dt><dd>${esc(d.workaround)}</dd></dl>`}
            <div class="r-ev"><div><h5 class="for">Evidence for</h5>${ul(d.forE)}</div><div><h5 class="against">Evidence against</h5>${ul(d.against.filter((t) => !/ of 25|scores only/.test(t)))}</div></div>
            ${d.screened ? '' : `<div class="r-ev"><div><h5>First test</h5><p>${esc(d.first)}</p><h5>We drop it if</h5>${ul(d.story ? d.story.drop : d.kill)}</div><div><h5>Open commercial questions</h5>${ul(d.biz)}</div></div>`}
          </article>`;
        }).join(''),
        'Confidence rubric: High needs external interviews and primary data, so nothing can be above Low before Studio 2 interviews.');

      h += sec('r-people', 'B-2.3.3 · Engineering personas', 'Six personas: fictional archetypes of the engineers we will interview',
        `<div class="r-cards c2">${PERSONAS.map((p) => `<article><h4>${esc(p.code)} · ${esc(p.title)} <em>${esc(p.company)} · fictional archetype</em></h4><p><b>${esc(p.tag)}, interview #${p.rank}.</b> ${esc(p.role)}</p><p class="r-persona-q">“${esc(p.quote)}” <small>(imagined quote)</small></p><p><a href="${esc(p.img)}">Full persona card</a></p></article>`).join('')}</div>
         <p class="r-note">Every persona is a fictional archetype, not a real person, and every quote is illustrative. These replace the P1–P8 persona codes from Round 1. ${esc(PERSONA_INSIGHTS.map((x) => x.t + ': ' + x.d).join(' '))}${citeHtml('b133v2')}</p>`,
        'Ranked by who decides and who we can reach first.');

      h += wedgeSlide.readerHtml(sec);

      h += extra.readerRest(sec);

      // audit
      const COLORS = { verified: '#22c55e', corrected: '#f59e0b', forecast: '#a78bfa', estimate: '#38bdf8', hypothesis: '#94a3b8' };
      const cnt = fc.counts;
      h += sec('r-audit', 'Method & evidence appendix', 'Every material claim, audited and classified',
        `<p>${CLAIMS.length} market claims audited against ${cnt.nSrc} sources on ${esc(TEAM.asOf)}: <b>${cnt.nVC}</b> verified or corrected and <b>${cnt.nFlag}</b> labelled as forecasts, estimates or team hypotheses (${cnt.nVC + cnt.nFlag} in all). <a href="downloads/fact-check-report.html">Full audit report</a>. The business model canvases have their own source lists and were not part of this audit.</p>
         <h3>Claims</h3><div class="r-claims">${CLAIMS.map((c) => { const s = SOURCES[c.src]; return `<div class="r-claim" style="--k:${COLORS[c.status]}"><span class="r-badge">${esc(STATUS[c.status].label)}</span><div><small>${esc(c.slide)}</small><p>${esc(c.claim)}</p><p class="r-src">[${srcNum(c.src)}] ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.pub)}</a>` : esc(s.pub)} · ${esc(s.date)}</p></div></div>`; }).join('')}</div>
         <h3>Sources</h3><ol class="r-sources">${SRC_IDS.map((id) => { const s = SOURCES[id]; return `<li id="r-src-${id}"><b>${esc(s.pub)}</b>, ${esc(s.title)} (${esc(s.date)}; ${esc(KIND[s.kind])})${s.url ? `. <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url.replace(/^https?:\/\//, '').slice(0, 70))}${s.url.length > 78 ? '…' : ''}</a>` : ''}</li>`; }).join('')}</ol>
         <h3>Glossary</h3><dl class="r-gloss">${GLOSSARY.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>`);

      const vers = VERSION.showOlder ? `Versions: <b>v${VERSION.n}</b> (this)${VERSION.older.map(([t, u]) => ` · <a href="${esc(u)}">${t}</a>`).join('')}. ` : '';
      h += `<footer class="r-foot"><p>${vers}Logos are trademarks of their owners, shown for identification only. Public sources only; no OEM data (B-1.2).</p></footer></div>`;
      h += v13.readerChain(sec);
      root.innerHTML = h;
      { const ws = $('#r-ws', root); if (ws) ws.insertAdjacentHTML('beforeend', v13.readerSbom()); }
      // v12: same chapter order and labels as the slides
      const wrap = $('.r-wrap', root), foot = $('.r-foot', root);
      const map = $('#r-map', root);
      if (!map) { const tmp = document.createElement('div'); tmp.innerHTML = extra.readerMap(sec); wrap.insertBefore(tmp.firstElementChild, $('#r-why', root)); }
      const R_ORDER = ['r-exec', 'r-map', 'r-why', 'r-eco', 'r-chain', 'r-vc', 'r-grow', 'r-bmc', 'r-evolve', 'r-people', 'r-wedges', 'r-pipeline', 'r-society', 'r-gaps', 'r-asks', 'r-ws', 'r-dossier', 'r-audit'];
      // v16: the company-score grid and Round 1 scoring are no longer part of the portfolio
      ['r-round2', 'r-funnel', 'r-dossier'].forEach((id) => { const el = document.getElementById(id); if (el) el.remove(); });
      R_ORDER.forEach((id) => { const el = document.getElementById(id); if (el) wrap.insertBefore(el, foot); });
      R_ORDER.forEach((id) => {
        const el = document.getElementById(id), sl = document.getElementById(id === 'r-audit' ? 's-fc' : id.replace(/^r-/, 's-'));
        if (!el || !sl) return;
        const c = chOf(sl);
        if (c.id === 'intro') return;
        $('.r-k', el).textContent = c.id === 'appx' ? `Appendix · ${sl.dataset.title}` : `Chapter ${c.n} · ${c.short || c.name} · ${sl.dataset.title}`;
      });
      hydrateCites(root);
      // printing (and ?print=1 for PDF export) expands every layer's details
      const openAll = () => $$('details', root).forEach((d) => { d.open = true; });
      if (new URLSearchParams(location.search).get('print')) openAll();
      window.addEventListener('beforeprint', () => { if (EXPORT) return; if (!mode.is('read')) mode.set('read'); openAll(); });
      $('.r-present', root).addEventListener('click', () => mode.set('present', true));
      // highlight the current section in the contents bar
      const links = $$('.r-toc a', root);
      const io = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.dataset.r === en.target.id));
      }), { rootMargin: '-30% 0px -60% 0px' });
      $$('.r-sec', root).forEach((s) => io.observe(s));
      built = true;
      reader18();
    }
    return {
      show() { if (!built) build(); },
      jumpTo(id) {
        if (!mode.is('read')) mode.set('read', true);
        const el = document.getElementById(id); if (!el) return;
        const det = el.querySelector('details'); if (det) det.open = true;
        el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      },
    };
  })();

  // =================================================================== v3 · MODE (present ↔ read)
  const mode = (() => {
    let m = 'present', userSet = false;
    const KEY = 'sdv-portfolio-mode';
    const tooSmall = () => innerWidth < 900 || Math.min(innerWidth / STAGE_W, (innerHeight - 70) / STAGE_H) < 0.66;
    function set(v, user) {
      if (user) { userSet = true; try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } }
      if (v === m && document.body.classList.contains('mode-' + v)) return;
      const prevMode = m;
      m = v;
      const read = v === 'read';
      document.documentElement.classList.toggle('mode-read', read);
      document.body.classList.toggle('mode-read', read);
      document.body.classList.toggle('mode-present', !read);
      $('#reader').hidden = !read;
      $('#deck').hidden = read;
      $('.dock').hidden = read;
      $('#modeLabel').textContent = read ? 'Present' : 'Read';
      $('#btnMode').setAttribute('aria-pressed', String(read));
      $('#btnMode').title = read ? 'Switch to the full-screen presentation' : 'Switch to the scrolling reading view';
      const switched = prevMode !== v;
      if (read) {
        if (switched && hooks[cur] && hooks[cur].leave) hooks[cur].leave();
        reader.show();
        if (switched) window.scrollTo(0, 0);
      } else {
        fit();
        if (switched && hooks[cur] && hooks[cur].enter) hooks[cur].enter();
        requestAnimationFrame(() => ['#eraCtl', '#lensCtl', '#poolCtl', '#fcTabs', '#dpViews'].forEach(segPlace));
      }
    }
    return {
      is: (v) => m === v,
      set,
      init() {
        const q = new URLSearchParams(location.search).get('mode');
        let saved = null;
        try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
        if (EXPORT) { userSet = true; set('present'); }
        else if (q === 'read' || q === 'present') { userSet = true; set(q); }
        else if (saved === 'read' || saved === 'present') { userSet = true; set(saved); }
        else set(tooSmall() ? 'read' : 'present');
        $('#btnMode').addEventListener('click', () => set(m === 'read' ? 'present' : 'read', true));
        // deep links into the reading view (#r-vc, #r-dossier-hil …)
        const h = location.hash.slice(1);
        if (/^r-/.test(h)) { if (m !== 'read') set('read'); setTimeout(() => { const el = document.getElementById(h); if (el) { const det = el.querySelector('details'); if (det) det.open = true; el.scrollIntoView({ block: 'start' }); } }, 80); }
      },
      auto() { if (!userSet) set(tooSmall() ? 'read' : 'present'); },
    };
  })();

  // ------------------------------------------------------------------ v16 SLIDE MODULES
  /* v16:chain start */
  // Value chain stages: seven chevrons with two short rows on the slide. Clicking a stage
  // grows a panel out of its column with all six of the organizers' rows for that stage.
  V16.push(() => {
    const box = $('#chBody');
    if (!box || !CHAIN.stages[0].short) return;
    const C = CHAIN, S = C.stages;
    const ZK = { covered: 'z-cov', adjacent: 'z-adj', discovery: 'z-disc' };
    const wd = (id) => WEDGES.list.find((w) => w.id === id);
    const badge = (id, k) => { const w = wd(id); return `<span class="c16-w" style="--k:var(--${w.colour}-m);--j:${k}" title="${esc(w.code + ': ' + w.name)}">${w.code}</span>`; };
    const ROWS = [['does', 'Does'], ['us', 'Where we sit']];
    const FULL = [['does', 'Does'], ['handoff', 'Handoff'], ['challenge', 'Example challenge'], ['stable', 'Stable'], ['motion', 'In motion'], ['us', 'Where we sit']];
    const EXP = '<svg class="c16-exp" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v2H7.4l4.3 4.3-1.4 1.4L6 7.4V11H4zm16 16h-7v-2h3.6l-4.3-4.3 1.4-1.4 4.3 4.3V13h2z"/></svg>';
    const PTR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v15.5l4-3.7 2.7 6.2 2.6-1.1-2.7-6.1H19z"/></svg>';
    // consecutive stages in the same zone share one band above the chevrons
    const bands = [];
    S.forEach((st) => { const b = bands[bands.length - 1]; if (b && b.z === st.zone) b.to = st.n; else bands.push({ z: st.zone, from: st.n, to: st.n }); });

    let h = '<div class="c16-grid">'
      + bands.map((b) => `<div class="c16-zone ${ZK[b.z]}" style="grid-column:${b.from + 1} / ${b.to + 2};--i:${b.from - 1}" title="${esc(C.zones[b.z])}">${b.z === 'discovery' ? '<i class="c16-br l"></i><i class="c16-br t"></i><i class="c16-br r"></i>' : ''}<span>${esc(C.zoneShort[b.z])}</span></div>`).join('')
      + S.map((st) => `<div class="c16-head ${ZK[st.zone]}" data-n="${st.n}" style="grid-column:${st.n + 1};--i:${st.n - 1}"><i>${st.n}</i><b>${esc(st.short.hd)}</b></div>`).join('');
    ROWS.forEach(([k, label], r) => {
      h += `<div class="c16-rl${k === 'us' ? ' us' : ''}" style="grid-row:${r + 3}">${esc(label)}</div>`;
      h += S.map((st) => {
        let inner = `<span class="c16-t">${esc(st.short[k])}</span>`;
        if (k === 'us') {
          const tags = (st.w || []).map(badge).join('') + (st.drop ? '<span class="c16-x">Dropped</span>' : '');
          inner = (tags ? `<span class="c16-tags">${tags}</span>` : '') + inner + EXP;
        }
        return `<div class="c16-c ${ZK[st.zone]} r-${k}${st.drop ? ' drop' : ''}" data-n="${st.n}" style="grid-row:${r + 3};grid-column:${st.n + 1};--i:${st.n - 1};--r:${r}">${inner}</div>`;
      }).join('');
    });
    h += S.map((st) => `<button type="button" class="c16-hit" data-n="${st.n}" style="grid-column:${st.n + 1};grid-row:2 / ${ROWS.length + 3}" aria-haspopup="dialog" aria-label="Stage ${st.n}, ${esc(st.name)}: open all six rows"></button>`).join('');
    h += `</div><div class="c16-foot"><span class="c16-hint">${PTR}<span><b>Click any stage</b> to open all six rows</span></span><span class="c16-src">Format and zones: the organizers’ example</span></div>
      <dialog class="c16-dlg" aria-labelledby="c16Title">
        <div class="c16-dk"><span class="c16-dn"></span><span class="c16-dz"></span><div class="c16-ours"></div></div>
        <div class="c16-dtop">
          <h3 id="c16Title" tabindex="-1"></h3>
          <div class="c16-nav" role="group" aria-label="Choose a stage">${S.map((st) => `<button type="button" class="${ZK[st.zone]}" data-n="${st.n}" aria-label="Stage ${st.n}: ${esc(st.name)}" title="${esc(st.n + '. ' + st.name)}">${st.n}</button>`).join('')}</div>
          <button type="button" class="c16-close" aria-label="Close the stage detail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"/></svg><span>Close</span></button>
        </div>
        <div class="c16-cards"></div>
      </dialog>`;
    box.innerHTML = h;

    const grid = $('.c16-grid', box), dlg = $('.c16-dlg', box), cards = $('.c16-cards', dlg);
    const instant = () => REDUCE || EXPORT;
    let cur = 0, closing = 0;

    // hovering or focusing a stage lights its whole column
    const light = (n) => $$('.c16-head, .c16-c', grid).forEach((e) => e.classList.toggle('hov', e.dataset.n === String(n)));
    $$('.c16-hit', grid).forEach((b) => {
      b.addEventListener('pointerenter', () => light(b.dataset.n));
      b.addEventListener('pointerleave', () => light(0));
      b.addEventListener('focus', () => light(b.dataset.n));
      b.addEventListener('blur', () => light(0));
      b.addEventListener('click', () => open(+b.dataset.n));
    });

    function fill(n) {
      const st = S[n - 1];
      cur = n;
      $('.c16-dn', dlg).textContent = `Stage ${n} of ${S.length}`;
      const dz = $('.c16-dz', dlg);
      dz.className = 'c16-dz ' + ZK[st.zone];
      dz.textContent = C.zones[st.zone];
      $('#c16Title', dlg).textContent = st.name;
      $('.c16-ours', dlg).innerHTML = '<span>Our layers</span>' + (st.ours.length
        ? st.ours.map((k) => { const L = LAYERS.find((l) => l.id === k); return `<i>L0${k} ${esc(L ? L.name : '')}</i>`; }).join('')
        : '<i class="none">Not one of our eight layers</i>');
      $$('.c16-nav button', dlg).forEach((b) => { const on = +b.dataset.n === n; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'true' : 'false'); });
      dlg.classList.remove('z-cov', 'z-adj', 'z-disc');
      dlg.classList.add(ZK[st.zone]);
      cards.innerHTML = FULL.map(([k, label], i) => {
        let body = `<p>${rich(st[k])}</p>`;
        if (k === 'us') {
          const ws = (st.w || []).map((id) => { const w = wd(id); return `<li><span class="c16-w" style="--k:var(--${w.colour}-m)">${w.code}</span>${esc(w.name)}</li>`; }).join('');
          body = (st.drop ? '<span class="c16-x">Dropped</span>' : '') + (ws ? `<ul class="c16-wl">${ws}</ul>` : '') + body;
        }
        return `<div class="c16-card k-${k}" style="--j:${i}"><b>${esc(label)}</b>${body}</div>`;
      }).join('');
      // replay the card build on every stage change
      cards.classList.remove('go'); void cards.offsetWidth; cards.classList.add('go');
    }

    function colRect(n) {
      const b = $(`.c16-hit[data-n="${n}"]`, grid);
      const W = box.offsetWidth, H = box.offsetHeight;
      const t = b.offsetTop + grid.offsetTop, l = b.offsetLeft + grid.offsetLeft;
      return `inset(${t}px ${W - l - b.offsetWidth}px ${H - t - b.offsetHeight}px ${l}px round 12px)`;
    }
    function open(n) {
      clearTimeout(closing);
      fill(n);
      if (!dlg.open) {
        dlg.show();
        grid.inert = true;
        if (!instant()) {
          dlg.style.transition = 'none';
          dlg.style.clipPath = colRect(n);
          void dlg.offsetWidth;
          dlg.style.transition = '';
          dlg.style.clipPath = 'inset(0px 0px 0px 0px round 16px)';
        } else dlg.style.clipPath = '';
      }
      box.classList.add('c16-open');
      $('#c16Title', dlg).focus({ preventScroll: true });
    }
    function close(now) {
      if (!dlg.open) return;
      const n = cur;
      box.classList.remove('c16-open');
      grid.inert = false;
      const done = () => { dlg.close(); dlg.style.clipPath = ''; };
      if (now || instant()) done();
      else { dlg.style.clipPath = colRect(n); closing = setTimeout(done, 460); }
      if (!now) { const b = $(`.c16-hit[data-n="${n}"]`, grid); if (b) b.focus({ preventScroll: true }); }
    }
    const step = (d) => fill(((cur - 1 + d + S.length) % S.length) + 1);

    $('.c16-close', dlg).addEventListener('click', () => close());
    $$('.c16-nav button', dlg).forEach((b) => b.addEventListener('click', () => fill(+b.dataset.n)));
    // the deck ignores keys while a dialog is open, so the panel handles its own
    document.addEventListener('keydown', (e) => {
      if (!dlg.open || !box.classList.contains('c16-open') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step(1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step(-1);
      else return;
      e.preventDefault();
    });
    hookOn('s-chain', { leave: () => close(true) });
  });
  /* v16:chain end */
  /* v16:grow start */
  // Where value grows: one measure (2035 size, bars that grow) and a two-bar growth comparison
  (() => {
    const sl = $('#s-grow');
    if (!sl || !$('#gw', sl)) return;
    const C = GROW_CHART, G = GROW_CALLOUT;
    const money = (p, v) => `${p.approx ? '~' : ''}$${v}B`;
    const max = Math.max(...POOLS.map((p) => p.to));
    const vmax = Math.max(...G.bars.map((b) => b.v));
    const gap = 150; // ms between rows
    function build() {
      $('#gwKicker').textContent = C.kicker;
      $('#gwHead').innerHTML = `${esc(C.head)}${citeHtml('mck')}`;
      $('#gwKey').innerHTML = `<span class="gw-comp c3">${meter(3)}</span><span>${esc(C.key)}</span>`;
      $('#gwSrc').textContent = C.src;
      $('#gwHint').textContent = C.hint;
      const rows = $('#gwRows');
      POOLS.slice().sort((a, b) => b.to - a.to).forEach((p, i) => {
        const l = layerById(p.layer), c = P[p.colour];
        const li = document.createElement('li');
        li.className = 'gw-row';
        li.style.cssText = `--c1:${c.s};--c2:${c.m};--cl:${c.l};--f:${p.to / max};--i:${i}`;
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `${p.name}: ${money(p, p.to)} in 2035, layer ${l.num} ${l.short}, rated ${COMP_LABEL[l.comp].toLowerCase()}. Opens the layer deep dive.`);
        li.innerHTML = `<div class="gw-lab"><b>${esc(p.name)}</b><span class="gw-comp c${l.comp}">${meter(l.comp)}</span></div>
          <div class="gw-track"><span class="gw-bar"><span class="gw-val" data-count="${p.to}" data-prefix="${p.approx ? '~' : ''}$" data-suffix="B">${money(p, p.to)}</span></span></div>`;
        const tip = `<b>${esc(p.name)}</b>${money(p, p.from)} in ${p.years.slice(0, 4)} → ${money(p, p.to)} in 2035<br>Layer ${esc(l.num)} ${esc(l.short)} · ${esc(COMP_LABEL[l.comp].toLowerCase())}<br><span style="color:var(--faint)">Click for the layer deep dive</span>`;
        li.addEventListener('pointermove', (e) => showTip(tip, e.clientX, e.clientY));
        li.addEventListener('pointerleave', hideTip);
        li.addEventListener('focus', () => { const r = li.getBoundingClientRect(); showTip(tip, r.left + 40, r.bottom); });
        li.addEventListener('blur', hideTip);
        li.addEventListener('click', () => dive.open(p.layer));
        li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dive.open(p.layer); } });
        rows.appendChild(li);
      });
      $('#gwCall').innerHTML = `<div class="gw-ck">${esc(G.kicker)}</div>
        <div class="gw-big"><span data-count="${G.big}" data-dec="1" data-suffix="%">${G.big}%</span><small>${esc(G.unit)}</small></div>
        <h3>${esc(G.head)}${citeHtml('mck')}</h3>
        <div class="gw-cmp">${G.bars.map((b, i) => `<div class="gw-cr${b.hi ? ' hi' : ''}" style="--f:${b.v / vmax};--i:${i}">
            <span class="gw-cl">${esc(b.label)}</span>
            <span class="gw-ct"><i></i><b data-count="${b.v}" data-dec="1" data-suffix="%/yr">${b.v}%/yr</b></span></div>`).join('')}</div>
        <p class="gw-punch">${esc(G.punch)}</p>
        <p class="gw-fn">${esc(G.foot)}</p>`;
    }
    // keep clear space under the subtitle, whatever its line count at this stage width
    function place() {
      const head = $('.head', sl), sub = $('.head .sub', sl);
      if (!head || !sub) return;
      const y = head.offsetTop + sub.offsetTop + sub.offsetHeight;
      $('#gw', sl).style.top = Math.max(200, Math.round(y + 36)) + 'px';
    }
    // staggered count-ups that match the bars; final values at once in export or reduced motion
    function counts() {
      if (EXPORT || REDUCE) {
        $$('[data-count]', $('#gw', sl)).forEach((el) => { cancelAnimationFrame(el._raf); clearTimeout(el._to); el.textContent = (el.dataset.prefix || '') + (+el.dataset.count).toFixed(+(el.dataset.dec || 0)) + (el.dataset.suffix || ''); });
        return;
      }
      $$('.gw-row .gw-val', sl).forEach((el, i) => countUp(el, 600 + i * gap));
      countUp($('.gw-big [data-count]', sl), 700);
      $$('.gw-cr [data-count]', sl).forEach((el, i) => countUp(el, 1150 + i * 200));
    }
    V16.push(() => { build(); place(); });
    hookOn('s-grow', { enter() { place(); counts(); } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    window.addEventListener('resize', place);
  })();
  /* v16:grow end */
  /* v16:bmc start */
  // Business models: two canvases (dSPACE, Applied Intuition), a shared seven-stage strip that
  // shows where each one sells, count-up figures, and each canvas's sources in a dialog.
  const bm16 = (() => {
    const V = BMC_V16, SRC = BMC_SOURCES;
    const pick = () => BMC_PICK.map((id) => BMCS.find((b) => b.id === id)).filter(Boolean);
    const num = (s, v) => (s.still ? String(v) : Math.round(v).toLocaleString('en-US'));
    const statTxt = (s, v) => `${s.pre}${num(s, v)}${s.suf}`;

    function strip() {
      const cos = pick();
      const lit = new Set(cos.flatMap((b) => BMC_STAGES[b.id] || []));
      const chev = CHAIN.stages.map((st, i) => `<li class="${lit.has(st.n) ? 'on' : ''}" style="--i:${i}" title="${esc(st.n + '. ' + st.name + ': ' + st.sub)}"><b>${st.n}</b><span>${esc(V.stageShort[st.n] || st.name)}</span></li>`).join('');
      const bars = cos.map((b, r) => (V.lanes[b.id] || []).map(([a, z, t, sec], j) => `<i class="bm2-bar${sec ? ' sec' : ''}" style="grid-row:${r + 1};grid-column:${a} / ${z + 1};--k:${b.colour};--j:${r * 2 + j}">${esc(t)}</i>`).join('')).join('');
      $('#bmStrip').innerHTML = `<ol class="bm2-chev" aria-label="The organizers' seven value-chain stages">${chev}</ol>
        <div class="bm2-lanes"><p class="bm2-cap">${esc(V.stripLabel)}</p>${bars}</div>`;
    }

    const card = (b, k) => {
      const c = V.cards[b.id];
      return `<article class="bm2-card rv" style="--k:${b.colour};--d:${5 + k}">
        <header><span class="bm2-logo">${chip(b.logo, 'lg')}</span><h3>${esc(c.head)}</h3></header>
        <div class="bm2-stats">${c.stats.map((s) => `<div><b data-bm-to="${s.to}" data-pre="${esc(s.pre)}" data-suf="${esc(s.suf)}"${s.still ? ' data-still="1"' : ''}>${esc(statTxt(s, s.to))}</b><span>${esc(s.t)}</span></div>`).join('')}</div>
        <div class="bm2-money"><div class="bm2-mh"><h4>How it makes money</h4><span class="bm2-key">${V.legend.map(([g, t]) => `<span><i class="g-${g}"></i>${esc(t)}</span>`).join('')}</span></div>
          <ul>${c.money.map(([g, t]) => `<li class="g-${g}"><i></i>${esc(t)}</li>`).join('')}</ul></div>
        <div class="bm2-two"><div class="bm2-moat"><h4>What protects it</h4><p>${esc(c.moat)}</p>
          <footer><button type="button" class="bm2-src" data-bm-src="${b.id}" aria-haspopup="dialog">Sources <em>${SRC[b.id].length}</em></button><a href="${esc(b.file)}" target="_blank" rel="noopener" aria-label="${esc(b.name)} full canvas (PDF)">PDF ↗</a></footer></div>
          <div class="bm2-lesson"><h4>What it taught us</h4><p>${esc(c.lesson)}</p></div></div>
      </article>`;
    };

    function dialog(id) {
      const b = BMCS.find((x) => x.id === id), c = V.cards[id], list = SRC[id] || [];
      let d = $('#bmDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'bmDlg'; d.className = 'bm2-dlg'; d.setAttribute('aria-labelledby', 'bmDlgH');
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      d.style.setProperty('--k', b.colour);
      d.innerHTML = `<header><div><small>Business model canvas · sources</small><h3 id="bmDlgH">${esc(b.name)}: ${list.length} sources</h3></div><button type="button" class="tog" data-close>Close</button></header>
        <p class="bm2-dlg-in">The figures and claims on the ${esc(b.name)} canvas come from these sources, as listed on page 2 of its PDF. ${esc(V.asOf)}.</p>
        <ol class="bm2-dlg-list">${list.map(([p, t, dt, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t || p)}</a><span>${t ? `${esc(p)} · ` : ''}${esc(dt)}</span></li>`).join('')}</ol>
        <p class="bm2-dlg-care"><b>Read with care.</b> ${esc(c.caveat)}</p>
        <footer><a class="bm2-dlg-pdf" href="${esc(b.file)}" target="_blank" rel="noopener">Open the full canvas (PDF) ↗</a><span class="bm2-also">${esc(V.also.lead)} <a href="${esc(V.also.file)}" target="_blank" rel="noopener">${esc(V.also.label)}</a></span></footer>`;
      d.showModal();
      d.scrollTop = 0;
      $('[data-close]', d).focus();
    }

    function count() {
      $$('#bmGrid [data-bm-to]').forEach((el, i) => {
        const to = +el.dataset.bmTo, s = { pre: el.dataset.pre, suf: el.dataset.suf, still: !!el.dataset.still };
        cancelAnimationFrame(el._raf); clearTimeout(el._to);
        if (EXPORT || REDUCE || s.still) { el.textContent = statTxt(s, to); return; }
        el.textContent = statTxt(s, 0);
        el._to = setTimeout(() => {
          const t0 = performance.now(), dur = 1200;
          const step = (t) => {
            const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
            el.textContent = statTxt(s, k < 1 ? to * e : to);
            if (k < 1) el._raf = requestAnimationFrame(step);
          };
          el._raf = requestAnimationFrame(step);
        }, 800 + (i % 3) * 90);
      });
    }

    function build() {
      strip();
      const grid = $('#bmGrid');
      grid.className = 'bm2-grid';
      grid.innerHTML = pick().map(card).join('');
      const foot = $('#bmFoot');
      foot.innerHTML = '';
      foot.hidden = true;
      grid.addEventListener('click', (e) => { const btn = e.target.closest('[data-bm-src]'); if (btn) dialog(btn.dataset.bmSrc); });
    }
    return { build, count, dialog };
  })();
  V16.push(() => bm16.build());
  hookOn('s-bmc', { enter: () => bm16.count(), leave: () => { const d = $('#bmDlg'); if (d && d.open) d.close(); } });
  /* v16:bmc end */
  /* v16:narrow start */
  // Round 1 map (appendix): dots placed by percentage so the map can grow with the stage, cand
  // markers show the fate (W2 or ✕) instead of a Round 1 rank, and the right-hand list is name +
  // fate + one plain reason (the same reasons as "How we narrowed"). No dates, no scores.
  V16.push(() => {
    const stage = $('#ws'); if (!stage) return;
    const row = (id) => (window.NARROW.rows.find((r) => r.id === id) || {});
    const mark = (c) => (c.id === 'hil' ? 'W2' : '✕');
    $$('#dots .wd').forEach((el, k) => {
      const d = DOTS[k]; if (!d) return;
      el.style.left = d.x * 100 + '%'; el.style.top = (1 - d.y) * 100 + '%';
      if (d.cand) { const c = candOf(d.cand); const i = $('i', el); if (i) i.textContent = mark(c); el.dataset.cid = c.id; }
      const f = $('.wd-fate', el);
      if (f && d.label === 'L2+ ADAS stacks') f.textContent = 'W1 and W3 grew from here';
    });
    const svg = svgEl('svg', { class: 'ws-link2', 'aria-hidden': 'true' });
    stage.appendChild(svg);
    const box = $('#cands');
    box.innerHTML = CANDIDATES.map((c, k) => { const f = CAND_FATE[c.id] || {}, r = row(c.id);
      return `<article class="cand nw-cand fate-${f.k}" data-n="${c.n}" data-cid="${c.id}" tabindex="0" role="button" style="${cv(c.colour)};--d:${k}"
        aria-label="${esc(r.name || c.title)}: ${esc(f.tag)}. ${esc(r.why || f.why)}. Opens its dossier.">
        <span class="cn">${mark(c)}</span><div class="nw-cb"><h4>${esc(r.name || c.title)}<b class="fate-tag">${esc(f.tag)}</b></h4><p>${esc(r.why || f.why)}</p></div></article>`; }).join('');
    function hot(id) {
      svg.innerHTML = '';
      $$('.nw-cand', stage).forEach((c) => c.classList.toggle('hot', c.dataset.cid === id));
      $$('#dots .wd.is-cand', stage).forEach((d) => d.classList.toggle('hot', d.dataset.cid === id));
      if (!id) return;
      const card = $(`.nw-cand[data-cid="${id}"]`, stage), dot = $(`#dots .wd[data-cid="${id}"] i`, stage);
      if (!card || !dot) return;
      const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1;
      const cr = card.getBoundingClientRect(), dr = dot.getBoundingClientRect();
      const ax = (cr.left - sr.left) / k - 4, ay = (cr.top + cr.height / 2 - sr.top) / k;
      const bx = (dr.right - sr.left) / k + 6, by = (dr.top + dr.height / 2 - sr.top) / k;
      svg.setAttribute('viewBox', `0 0 ${stage.offsetWidth} ${stage.offsetHeight}`);
      svg.appendChild(svgEl('path', { d: `M${ax},${ay} C${ax - 140},${ay} ${bx + 160},${by} ${bx},${by}`, stroke: P[candOf(+card.dataset.n).colour].l }));
    }
    $$('.nw-cand', stage).forEach((el) => {
      const id = el.dataset.cid;
      el.addEventListener('pointerenter', () => hot(id));
      el.addEventListener('pointerleave', () => hot(null));
      el.addEventListener('focus', () => hot(id));
      el.addEventListener('blur', () => hot(null));
      const openIt = () => dossier.show(id, true);
      el.addEventListener('click', openIt);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); } });
    });
    $$('#dots .wd.is-cand', stage).forEach((el) => {
      el.addEventListener('pointerenter', () => hot(el.dataset.cid));
      el.addEventListener('pointerleave', () => hot(null));
    });
    hookOn('s-ws', { leave: () => hot(null) });
  });
  /* v16:narrow end */
  /* v16:people start */
  // Who we will interview: two rows of plain job cards (4 + 3) joined by a contact-order line,
  // and one summary band answering the organizers' question (matched, per wedge, independent, channels)
  (() => {
    const KIND = { Sponsor: ['sp', 'Sponsor'], Both: ['bo', 'Both'], Independent: ['in', 'Independent'] };
    const chips = (s) => s.split(/,\s*/).map((c) => { const w = WEDGES.list.find((x) => x.code === c.trim()); return w ? `<i class="pp-w" style="--k:var(--${w.colour}-m)">${w.code}</i>` : ''; }).join('');
    const role = (r) => `${r.role} ${r.at}`;
    function layout() {
      const box = $('#plBody'), svg = box && $('.pp-line', box);
      if (!svg) return;
      const cs = $$('.pp-c', box);
      if (cs.length < 2) return;
      const pt = (c) => { const b = $('.pp-n', c); return [c.offsetLeft + b.offsetLeft + b.offsetWidth / 2, c.offsetTop + b.offsetTop + b.offsetHeight / 2]; };
      const rows = [];
      cs.forEach((c) => { const t = c.offsetTop; const r = rows.find((x) => Math.abs(x.t - t) < 4); if (r) r.c.push(c); else rows.push({ t, c: [c] }); });
      let d = '';
      rows.forEach((r, k) => {
        const a = pt(r.c[0]), z = pt(r.c[r.c.length - 1]);
        if (!k) d += `M${a[0]} ${a[1]}`;
        else {
          // turn down the right side, run back along the row gap, then into the next row
          const prev = rows[k - 1], last = prev.c[prev.c.length - 1];
          const xr = last.offsetLeft + last.offsetWidth + 26, xl = r.c[0].offsetLeft - 26;
          const gy = (last.offsetTop + last.offsetHeight + r.c[0].offsetTop) / 2;
          const p = pt(last), R = 18;
          d += ` H${xr - R} Q${xr} ${p[1]} ${xr} ${p[1] + R} V${gy - R} Q${xr} ${gy} ${xr - R} ${gy} H${xl + R} Q${xl} ${gy} ${xl} ${gy + R} V${a[1] - R} Q${xl} ${a[1]} ${xl + R} ${a[1]}`;
        }
        d += ` H${z[0]}`;
      });
      $('path', svg).setAttribute('d', d);
    }
    function openPersona(code) {
      const p = PERSONAS.find((x) => x.code === code), r = PIPELINE.rows.find((x) => x.p === code);
      if (!p) return;
      personaSlide.open(p);
      const d = $('#peDlg');
      if (!d || !r) return;
      $('.pe-dlg-t', d).innerHTML = `<b>${esc(code)} · ${esc(role(r))}</b><small>A fictional archetype of a real job, built from public job postings; the name and quote are imagined. Scroll to read the whole card.</small>`;
      $('img', d).alt = `Full persona card: ${role(r)}, a fictional archetype`;
    }
    function rules() {
      let d = $('#poDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'poDlg'; d.className = 'sc-dlg po-dlg'; d.setAttribute('aria-labelledby', 'poDlgH');
        d.innerHTML = `<header><div><small>Who we will interview</small><h3 id="poDlgH">How we reach out, and how we interview</h3></div><button type="button" class="tog" data-close>Close</button></header>
          <div class="po-rl"><section><h5>Reaching out</h5><ul>${PIPELINE.rules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
          <section><h5>In the interview</h5><ul>${PLAN.rules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      d.showModal();
    }
    V16.push(() => {
      const box = $('#plBody');
      if (!box) return;
      const rows = PIPELINE.rows;
      const has = (c) => PERSONAS.some((p) => p.code === c);
      const F = PIPELINE.found;
      const indep = rows.filter((r) => r.kind !== 'Sponsor').length;
      const kinds = ['Sponsor', 'Both', 'Independent'].map((k) => [k, rows.filter((r) => r.kind === k).length]);
      const maxC = Math.max(...PIPELINE.convs.map((c) => c[1]));
      const cnt = (n) => (EXPORT ? '' : ` data-count="${n}"`);
      const card = (r, i) => {
        const open = has(r.p), st = r.n === 'Parked' ? ' hold' : !open ? ' draft' : '';
        const k = KIND[r.kind] || KIND.Independent;
        const row2 = i >= 4;
        return `<li class="pp-c${st}${row2 ? ' r2' : ''}" style="--d:${row2 ? 7 + (i - 4) * 0.8 : 3 + i * 0.8}">
          <button type="button" class="pp-b" ${open ? `data-pp="${esc(r.p)}" aria-label="${i + 1}. ${esc(role(r))}. Open the full persona"` : 'disabled'}>
            <header><em class="pp-n">${i + 1}</em><span class="pp-code">${esc(r.p === 'New' ? 'To write' : r.p)}</span>${st === ' hold' ? '<span class="pp-tag">On hold</span>' : ''}<span class="pp-ws">${chips(r.w)}</span></header>
            <h4>${esc(r.role)}</h4>
            <p class="pp-at">${esc(r.at)}</p>
            <p class="pp-rt"><b class="k-${k[0]}">${esc(k[1])}</b>${esc(r.route)}</p>
            <p class="pp-nx"><span aria-label="Next step">→</span>${esc(r.step)}</p>
          </button></li>`;
      };
      box.className = 'pp';
      box.innerHTML = `<svg class="pp-line" aria-hidden="true"><path pathLength="1" d=""/></svg>
        <ol class="pp-grid" aria-label="Personas in the order we will contact them">${rows.map(card).join('')}</ol>
        <div class="pp-sum">
          <div class="pp-s pp-s1 rv" style="--d:10"><b class="pp-big"><span${cnt(F.people)}>${F.people}</span></b><p><strong>real people found</strong> for ${F.personas} of these personas. Names kept private.</p></div>
          <div class="pp-s pp-s2 rv" style="--d:11"><div class="pp-sl"><b class="pp-big">~<span${cnt(10)}>10</span></b><p><strong>people to interview</strong></p></div>
            <div class="pp-cw"><small>Per wedge</small><div class="pp-cv">${PIPELINE.convs.map(([id, n], j) => { const w = WEDGES.list.find((x) => x.id === id); return `<span style="--k:var(--${w.colour}-m);--j:${j};--h:${(n / maxC) * 100}%"><b>${n}</b><i></i><em>${w.code}</em></span>`; }).join('')}</div></div>
            <p class="pp-xw">Conversations per wedge. Many people cover two wedges.</p></div>
          <div class="pp-s pp-s3 rv" style="--d:12"><b class="pp-big"><span${cnt(indep)}>${indep}</span><small>of ${rows.length}</small></b><p><strong>reachable without a sponsor</strong><span class="pp-xw">, so at least half our interviews can be independent</span></p>
            <div class="pp-bar">${kinds.map(([k, n], j) => `<i class="k-${KIND[k][0]}" style="flex:${n};--j:${j}">${n} ${k === 'Both' ? 'both' : k.toLowerCase()}</i>`).join('')}</div></div>
          <div class="pp-s pp-s4 rv" style="--d:13"><div class="pp-sh"><p class="pp-k">Channels</p><button type="button" class="tog" id="ppRules">How we reach out and interview</button></div><ul>${PIPELINE.channels.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
        </div>`;
      box.addEventListener('click', (e) => { const b = e.target.closest('[data-pp]'); if (b) openPersona(b.dataset.pp); });
      $('#ppRules', box).addEventListener('click', rules);
      layout();
      addEventListener('resize', () => requestAnimationFrame(layout));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
      hookOn('s-pipeline', { enter() { layout(); } });
    });
  })();
  /* v16:people end */
  /* v16:next start */
  // Innovation in society, risks and questions: bigger cards, one line each, a
  // cause → response reveal (the risk shows first, then what we do about it).
  V16.push(() => {
    const NX_PATHS = {
      shield: 'M12 2 4 5v6c0 5.2 3.4 9.6 8 11 4.6-1.4 8-5.8 8-11V5zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4z',
      lock: 'M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z',
      eye: 'M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      people: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 21v-2c0-3 4-5 8-5s8 2 8 5v2zm17 0v-2c0-1.6-.6-2.9-1.7-3.9C19.6 15.4 23 16.8 23 19v2z',
      leaf: 'M21 3C10 3 4 8 4 15.5c0 1.6.4 3 1 4.2L3 21.6 4.4 23l2-2c1.2.6 2.6 1 4.1 1C17 22 22 16 21 3zM8.5 18.5c1.5-4.2 4.4-7.5 8.5-9.5-3 2.8-5 6-6.2 9.8z',
      key: 'M12.65 10A6 6 0 0 0 7 6a6 6 0 1 0 5.65 8H17v4h4v-4h2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
    };
    const nxSvg = (k) => (NX_PATHS[k] ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${NX_PATHS[k]}"/></svg>` : icon(k));
    const nxName = (id) => { const e = document.getElementById(id); return e ? e.dataset.title : id; };

    // innovation in society: five big cards, risk → guardrail
    const so = $('#soBody');
    if (so) {
      so.className = 'so16';
      const F = SOCIETY.foot || {};
      so.innerHTML = `<div class="so16-row">${SOCIETY.cards.map((c, k) => `<article class="so16-c${c.stress ? ' is-key' : ''}" style="--i:${k}">
          <header><span class="so16-i">${nxSvg(c.icon)}</span><h4>${esc(c.k)}</h4>${c.stress ? '<em>We stress</em>' : ''}</header>
          <div class="so16-r"><small>Could go wrong</small><p>${esc(c.line || c.risk)}</p></div>
          <i class="so16-ar" aria-hidden="true"></i>
          <div class="so16-g"><small>What we do</small><p>${esc(c.act || (c.guard || [])[0] || '')}</p></div></article>`).join('')}</div>
        <p class="so16-foot"><span><b>Across all five:</b> ${esc(F.all || SOCIETY.note)}</span>${F.open ? `<span><b class="op">Still open:</b> ${esc(F.open)}</span>` : ''}</p>`;
    }

    // risks & gaps: four cards with a headline, the risk, then what we do; smaller gaps as one strip
    const RC = ['#f87171', '#fbbf24', '#22d3ee', '#a78bfa'];
    const rc = $('#riskCards');
    if (rc) {
      rc.className = 'rk16';
      rc.innerHTML = RISKS.map((r, k) => `<article class="rk16-c" style="--i:${k};--rc:${RC[k % 4]}">
          <header><span class="rk16-i">${nxSvg(r.icon || 'alert')}</span><span class="rk16-k">${esc(r.k)}</span>${k === 0 ? `<span class="rk16-dots" role="img" aria-label="No wedge pain confirmed yet">${WEDGES.list.map((w) => `<i>${esc(w.code)}</i>`).join('')}</span>` : ''}</header>
          <h4>${esc(r.n)}</h4>
          <div class="rk16-r"><small>Risk</small><p>${esc(r.t)}</p></div>
          <i class="rk16-ar" aria-hidden="true"></i>
          <div class="rk16-do"><small>What we do</small><p>${esc(r.act)}</p></div></article>`).join('');
    }
    const gp = $('#gpBody');
    if (gp) {
      gp.className = 'rk16-more';
      gp.innerHTML = `<h5>Smaller gaps we are closing</h5><ul>${GAPS.map((g, k) => `<li style="--i:${k}" title="${esc(g[1])}">${esc(g[4] || g[2])}</li>`).join('')}</ul>`;
    }

    // questions: number, question, why we ask, and the slide behind it
    const al = $('#askList');
    if (al) {
      al.className = 'qa16';
      al.innerHTML = ASKS.map((q, k) => {
        const [tag, id] = ASK_TAGS[k] || ['', 's-wedges'];
        const why = (window.ASK_WHY || [])[k];
        return `<li style="--i:${k}"><b class="qa16-n">${k + 1}</b><div class="qa16-t"><p class="qa16-q">${esc(q)}</p>${why ? `<p class="qa16-w"><span aria-hidden="true">→</span>${esc(why)}</p>` : ''}</div>
          <button type="button" class="qa16-tag" data-gs="${id}"><em>${esc(tag)}</em>${esc(nxName(id))} →</button></li>`;
      }).join('');
    }
    const ae = $('#askEnd');
    if (ae) {
      ae.className = 'qa16-end';
      const ap = $$('#deck > .slide').filter((s) => s.dataset.ch === 'appx' && !s.hidden && !s.classList.contains('slide-cut'));
      ae.innerHTML = `<span>End of the main story. The appendix has the detail:</span>${ap.map((s) => `<button type="button" class="tog" data-gs="${s.id}">${esc(s.dataset.title)}</button>`).join('')}`;
    }
  });
  /* v16:next end */
  /* v17:people start */
  // Who we will interview, as an outreach road: a car drives past seven stops in contact order,
  // and each persona card (an illustrated avatar, the job, how we reach them) lifts in as the car
  // passes. Click a card for a short, defensible profile (window.PERSONA_DETAIL).
  (() => {
    const KIND = { Sponsor: ['sp', 'Sponsor'], Both: ['bo', 'Both'], Independent: ['in', 'Independent'] };
    const CO = { 'dS-1': '#2dd4bf', 'dS-2': '#2dd4bf', 'dS-3': '#60a5fa', 'AI-1': '#fb923c', 'AI-2': '#fb923c', New: '#818cf8', 'ME-1': '#a78bfa' };
    const SHORT_AT = { New: 'at an automaker or supplier' };
    const wchips = (s) => s.split(/,\s*/).map((c) => { const w = WEDGES.list.find((x) => x.code === c.trim()); return w ? `<i class="pr-w" style="--k:var(--${w.colour}-m)">${w.code}</i>` : ''; }).join('');
    // flat avatars: a person bust with a role prop, one per persona (fictional, not real people)
    const HAIR = {
      bench: '<path d="M25 33 Q25 17 40 17 Q55 17 55 33 L53 33 Q52 23 40 23 Q28 23 27 33Z" fill="#1f2937"/><path d="M22 30 Q23 12 40 12 Q57 12 58 30 Z" fill="#facc15"/><rect x="20" y="28" width="40" height="5" rx="2.5" fill="#eab308"/>',
      product: '<path d="M26 34 Q24 15 40 15 Q57 15 54 34 Q52 24 44 22 Q35 27 27 27 Z" fill="#3f2a1d"/><path d="M24 33 Q22 22 27 20" stroke="#0f172a" stroke-width="3" fill="none"/><rect x="21" y="30" width="6" height="10" rx="3" fill="#0f172a"/><path d="M24 40 Q26 47 33 47" stroke="#0f172a" stroke-width="2" fill="none"/>',
      sim: '<path d="M25 36 Q23 14 40 14 Q58 14 55 36 L56 46 Q51 38 52 28 Q40 22 28 28 Q29 38 24 46 Z" fill="#7c2d12"/>',
      shield: '<path d="M26 31 Q26 16 40 16 Q54 16 54 31 Q47 22 40 23 Q32 22 26 31Z" fill="#111827"/><circle cx="34.5" cy="33" r="4.6" fill="none" stroke="#0f172a" stroke-width="2"/><circle cx="45.5" cy="33" r="4.6" fill="none" stroke="#0f172a" stroke-width="2"/><path d="M39 33 H41" stroke="#0f172a" stroke-width="2"/>',
      car: '<path d="M26 31 Q27 15 41 16 Q54 17 54 30 L50 26 Q44 21 36 23 Q30 25 26 31Z" fill="#b45309"/><circle cx="40" cy="15" r="5" fill="#b45309"/>',
      model: '<path d="M26 32 Q25 16 40 16 Q55 16 54 32 Q50 24 46 24 L44 20 L42 24 Q33 23 26 32Z" fill="#334155"/>',
      badge: '<path d="M25 34 Q24 15 40 15 Q56 15 55 34 Q53 26 48 24 Q38 28 29 25 Q26 28 25 34Z" fill="#9ca3af"/>',
    };
    const PROP = {
      bench: '<rect x="-7" y="-8" width="14" height="16" rx="2"/><path d="M-4 -4 H4 M-4 0 H4 M-4 4 H1" stroke-width="1.6"/>',
      product: '<path d="M0 -8 A5.5 5.5 0 0 1 3.5 2 V4 H-3.5 V2 A5.5 5.5 0 0 1 0 -8Z"/><path d="M-2.5 7 H2.5" stroke-width="1.8"/>',
      sim: '<rect x="-8" y="-7" width="16" height="11" rx="1.5"/><path d="M-3 7 H3 M0 4 V7" stroke-width="1.6"/><path d="M-5 0 L-2 -3 L1 -1 L5 -5" stroke-width="1.4"/>',
      shield: '<path d="M0 -8 L7 -5 V0 Q7 6 0 9 Q-7 6 -7 0 V-5Z"/><path d="M-3 0 L-0.5 2.5 L3.5 -2.5" stroke-width="1.8"/>',
      car: '<path d="M-8 2 L-6 -3 Q-5 -5 -3 -5 H3 Q5 -5 6 -3 L8 2 V5 H-8Z"/><circle cx="-4.5" cy="5.5" r="2"/><circle cx="4.5" cy="5.5" r="2"/>',
      model: '<circle cx="-5" cy="-5" r="2"/><circle cx="-5" cy="5" r="2"/><circle cx="5" cy="0" r="2.4"/><path d="M-5 -5 L5 0 L-5 5 M-5 -5 V5" stroke-width="1.3"/>',
      badge: '<circle cx="0" cy="-2" r="5.5"/><path d="M-3 3 L-4 9 L0 7 L4 9 L3 3" stroke-width="1.3"/>',
    };
    const avatar = (code, kind, n) => {
      const c = CO[code] || '#818cf8', skin = { 'dS-2': '#f2c7a5', 'dS-1': '#e0ac83', 'dS-3': '#c98b62', 'AI-1': '#f1c9a8', 'AI-2': '#8d5a3b', New: '#d9a37e', 'ME-1': '#efd3bd' }[code] || '#e5b48f';
      const id = 'pra' + code.replace(/\W/g, '');
      return `<svg class="pr-av" viewBox="0 0 80 80" aria-hidden="true">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset="1" stop-color="${c}" stop-opacity=".18"/></linearGradient>
        <clipPath id="${id}c"><circle cx="40" cy="40" r="36"/></clipPath></defs>
        <circle cx="40" cy="40" r="38" fill="#0b1228" stroke="${c}" stroke-width="2.5"/>
        <g clip-path="url(#${id}c)"><circle cx="40" cy="40" r="36" fill="url(#${id})"/>
          <path d="M14 82 Q14 54 40 54 Q66 54 66 82Z" fill="${c}"/><path d="M33 54 L40 64 L47 54Z" fill="#f8fafc" opacity=".85"/>
          <rect x="35" y="44" width="10" height="11" rx="4" fill="${skin}"/><circle cx="40" cy="33" r="13" fill="${skin}"/>
          ${HAIR[kind] || ''}</g>
        <g class="pr-prop" transform="translate(64 62)"><circle r="12.5" fill="#0b1228" stroke="${c}" stroke-width="2"/><g fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PROP[kind] || ''}</g></g>
        <g transform="translate(14 14)"><circle r="11.5" fill="#fbbf24" stroke="#0b1228" stroke-width="2.5"/><text y="5" text-anchor="middle" font-family="Inter Tight, Inter, sans-serif" font-weight="900" font-size="14" fill="#1a1300">${n}</text></g>
      </svg>`;
    };
    const CAR = `<svg class="pr-carsvg" viewBox="0 0 120 52" aria-hidden="true"><path d="M8 34 Q8 26 18 24 L36 22 L50 10 Q54 7 60 7 H84 Q90 7 94 12 L104 23 Q114 25 115 33 V38 Q115 41 111 41 H12 Q8 41 8 37Z" fill="#fbbf24"/><path d="M54 12 H70 V23 H42Z M74 12 H86 Q89 12 91 15 L97 23 H74Z" fill="#0b1228" opacity=".85"/><circle cx="32" cy="41" r="9" fill="#0b1228"/><circle cx="32" cy="41" r="4" fill="#94a3b8"/><circle cx="92" cy="41" r="9" fill="#0b1228"/><circle cx="92" cy="41" r="4" fill="#94a3b8"/><path d="M111 28 h5" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/></svg>`;
    function dialog(i) {
      const r = PIPELINE.rows[i], D = (window.PERSONA_DETAIL || {})[r.p];
      if (!D) return;
      let d = $('#prDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'prDlg'; d.className = 'pr-dlg'; d.setAttribute('aria-labelledby', 'prDlgH');
        document.body.appendChild(d);
        d.addEventListener('click', (e) => {
          if (e.target === d || e.target.closest('[data-close]')) { d.close(); return; }
          const s = e.target.closest('[data-step]');
          if (s) { const n = PIPELINE.rows.length; let j = i; do { j = (j + +s.dataset.step + n) % n; } while (!(window.PERSONA_DETAIL || {})[PIPELINE.rows[j].p] && j !== i); dialog(j); }
        });
      }
      const k = KIND[r.kind] || KIND.Independent;
      const list = (h, cls, xs) => xs && xs.length ? `<section class="${cls}"><h4>${h}</h4><ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>` : '';
      d.style.setProperty('--pc', CO[r.p] || '#818cf8');
      d.innerHTML = `<header>${avatar(r.p, D.av, i + 1)}<div class="pr-dh"><small>Interview ${i + 1} of ${PIPELINE.rows.length} · ${esc(D.role)}${D.draft ? ' · draft persona' : ''}${D.hold ? ' · on hold' : ''}</small>
          <h3 id="prDlgH">${esc(r.role)}</h3><p>${esc(r.at)}</p>
          <div class="pr-dt"><b class="k-${k[0]}">${esc(k[1])}</b>${wchips(r.w)}</div></div>
          <nav><button type="button" class="pr-nb" data-step="-1" aria-label="Previous persona">‹</button><button type="button" class="pr-nb" data-step="1" aria-label="Next persona">›</button><button type="button" class="tog" data-close>Close</button></nav></header>
        <div class="pr-dg">
          ${list('What they care about', 'c', D.cares)}
          ${list(D.draft ? 'What we think hurts (to test)' : 'What hurts today', 'h', D.hurts)}
          ${list('What wins them over', 'w', D.wins)}
          ${list('What would lose them', 'l', D.loses)}
        </div>
        <div class="pr-ask"><small>Our first question</small><p>“${esc(D.ask)}”</p></div>
        <div class="pr-reach"><span><small>How we reach them</small>${esc(D.reach)}</span><span><small>Next step</small>${esc(r.step || r.next || '')}</span></div>
        <p class="pr-foot">A fictional archetype of a real job, built from public job postings and company material. Not a real person.</p>`;
      if (!d.open) d.showModal();
      d.scrollTop = 0;
    }
    function rules() {
      let d = $('#poDlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'poDlg'; d.className = 'pr-dlg pr-rules'; d.setAttribute('aria-labelledby', 'poDlgH');
        d.innerHTML = `<header><div class="pr-dh"><small>Who we will interview</small><h3 id="poDlgH">How we reach out, and how we interview</h3></div><nav><button type="button" class="tog" data-close>Close</button></nav></header>
          <div class="pr-dg"><section class="c"><h4>Reaching out</h4><ul>${PIPELINE.rules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
          <section class="w"><h4>In the interview</h4><ul>${PLAN.rules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      d.showModal();
    }
    function play() {
      const box = $('#plBody');
      if (!box || EXPORT) return;
      box.classList.remove('go');
      void box.offsetWidth;
      box.classList.add('go');
    }
    V16.push(() => {
      const box = $('#plBody');
      if (!box) return;
      const rows = PIPELINE.rows, F = PIPELINE.found;
      const sec = $('#s-pipeline');
      $('.title', sec).textContent = 'Seven personas to interview first, starting with our sponsor contacts';
      $('.sub', sec).textContent = 'Fictional archetypes of real jobs, in the order we will contact them. Click a card to see what we will ask.';
      const maxC = Math.max(...PIPELINE.convs.map((c) => c[1]));
      const card = (r, i) => {
        const D = (window.PERSONA_DETAIL || {})[r.p] || {};
        const top = i % 2 === 0, slot = top ? i / 2 : (i - 1) / 2;
        const k = KIND[r.kind] || KIND.Independent;
        const st = D.hold ? ' hold' : D.draft ? ' draft' : '';
        return `<button type="button" class="pr-c ${top ? 'up' : 'dn'}${st}" data-i="${i}" style="--slot:${slot};--t:${(i + 1) / 8};--pc:${CO[r.p] || '#818cf8'}" aria-label="${i + 1}. ${esc(r.role)} ${esc(r.at)}. Open the profile">
          <span class="pr-stem" aria-hidden="true"></span>
          ${avatar(r.p, D.av, i + 1)}
          <span class="pr-tx"><b class="pr-role">${esc(r.role)}</b><span class="pr-at">${esc(SHORT_AT[r.p] || r.at)}</span></span>
          <span class="pr-ft"><em class="k-${k[0]}">${esc(k[1])}</em>${D.hold ? '<em class="pr-hold">On hold</em>' : ''}${D.draft ? '<em class="pr-draft">Draft</em>' : ''}<span class="pr-ws">${wchips(r.w)}</span></span>
        </button>`;
      };
      box.className = 'pr' + (EXPORT ? ' done' : '');
      box.innerHTML = `
        <div class="pr-road" aria-hidden="true"><i class="pr-lane"></i>
          ${rows.map((r, i) => `<span class="pr-stop" style="--t:${(i + 1) / 8}" data-i="${i}">${i + 1}</span>`).join('')}
          <span class="pr-flag">Start</span><span class="pr-car">${CAR}</span><span class="pr-fin" aria-hidden="true"></span></div>
        ${rows.map(card).join('')}
        <div class="pr-start"><small>So far</small><b>${F.people}</b><span>real people found for ${F.personas} personas</span><em>names private</em></div>
        <div class="pr-goal"><small>Goal</small><b>~10</b><span>interviews</span>
          <div class="pr-bars">${PIPELINE.convs.map(([id, n]) => { const w = WEDGES.list.find((x) => x.id === id); return `<span style="--k:var(--${w.colour}-m);--h:${(n / maxC) * 100}%"><i></i><em>${w.code} ${n}</em></span>`; }).join('')}</div></div>
        <div class="pr-strip">
          <span class="pr-key"><em class="k-sp">Sponsor</em><span>start via a sponsor contact</span><em class="k-bo">Both</em><span>either route</span><em class="k-in">Independent</em><span>our own outreach</span></span>
          <button type="button" class="tog" id="prRules">How we reach out and interview</button>
        </div>`;
      box.addEventListener('click', (e) => { const b = e.target.closest('.pr-c'); if (b) dialog(+b.dataset.i); });
      box.addEventListener('mouseover', (e) => { const b = e.target.closest('.pr-c'); $$('.pr-stop', box).forEach((s) => s.classList.toggle('hot', !!b && s.dataset.i === b.dataset.i)); });
      box.addEventListener('mouseleave', () => $$('.pr-stop', box).forEach((s) => s.classList.remove('hot')));
      $('#prRules', box).addEventListener('click', rules);
      hookOn('s-pipeline', { enter() { play(); } });
    });
  })();
  /* v17:people end */
  /* v17:narrow start */
  // How we narrowed: the check band grows with its text, and the idea rows always start below it
  (() => {
    const fitBand = () => {
      const band = $('#s-evolve .nw-band'), flow = $('#s-evolve .nw-flow');
      if (!band || !flow) return;
      flow.style.top = Math.ceil(band.offsetTop + band.offsetHeight + 16) + 'px';
    };
    V16.push(() => {
      fitBand();
      addEventListener('resize', () => requestAnimationFrame(fitBand));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBand);
      hookOn('s-evolve', { enter() { fitBand(); requestAnimationFrame(fitBand); } });
    });
  })();
  /* v17:narrow end */
  /* v18:asks start */
  // The last slide is our ask: four roadblocks we hit, each with how the organizers could help.
  // Also: the WMU EcoCAR logo on the cover, no as-of line, and a PDF download in reading mode.
  (() => {
    const RB = () => window.ROADBLOCKS || [];
    const nxName = (id) => { const e = document.getElementById(id); return e ? e.dataset.title : id; };
    V16.push(() => {
      const sec = $('#s-asks');
      const al = $('#askList');
      if (sec && al) {
        $('.kicker', sec).textContent = 'Roadblocks and asks';
        $('.title', sec).textContent = 'Four roadblocks we hit, and how you could help';
        $('.sub', sec).textContent = 'Our asks for this coaching session: what is in our way, then what would unblock it';
        al.className = 'rb18';
        if (!al.dataset.rb) { al.dataset.rb = '1'; al.addEventListener('click', (e) => { const b = e.target.closest('[data-gs]'); if (b) goId(b.dataset.gs); }); }
        if (!window.ICONS.key) window.ICONS.key = 'M12.65 10A6 6 0 0 0 7 6a6 6 0 1 0 5.65 8H17v4h4v-4h2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z';
        al.innerHTML = `<li class="rb18-hd" aria-hidden="true"><span></span><small>Roadblock we hit</small><span></span><small>How you could help</small></li>` + RB().map((r, k) => `<li style="--i:${k}">
            <div class="rb18-h"><span class="rb18-top"><span class="rb18-ic">${icon(r.icon)}</span><b>${k + 1}</b></span><em>${esc(r.k)}</em>
              <button type="button" class="rb18-go" data-gs="${r.go}">${esc(nxName(r.go))} →</button></div>
            <p class="rb18-hit">${esc(r.hit)}</p>
            <span class="rb18-arr" aria-hidden="true">→</span>
            <p class="rb18-ask">${esc(r.ask)}</p>
          </li>`).join('');
      }
      // cover: the team's logo beside the program line, and no as-of date
      const copy = $('#s-cover .cover-copy');
      if (copy && !$('.cover-id', copy)) {
        const k = $('#coverKicker'), tl = $('#teamLine');
        const box = document.createElement('div');
        box.className = 'cover-id rv';
        box.innerHTML = '<span class="cover-logo"><img src="assets/logos/wmu-ecocar.jpg" alt="EcoCAR Innovation Challenge and Western Michigan University logos"></span><div class="cover-idt"></div>';
        copy.insertBefore(box, k);
        $('.cover-idt', box).append(k, tl);
      }
      const asof = $('#coverAsOf');
      if (asof) { asof.textContent = ''; asof.hidden = true; }
      // the slide PDF keeps its 1600x900 pages (the stylesheet now prints the reading mode on Letter)
      if (EXPORT) { const st = document.createElement('style'); st.textContent = '@media print { @page { size: 1600px 900px; margin: 0; } }'; document.head.appendChild(st); }
    });
    // reading mode: retired numbers out of the cover, the as-of line gone, and a download button
    reader18 = () => {
      const root = $('#reader');
      if (!root || root.dataset.v18) return;
      const st = $('.r-cover .r-stats', root);
      if (st) st.innerHTML = '<div><b>8</b>value-chain layers mapped</div><div><b>7</b>open pockets screened for team fit</div><div class="hl"><b>3</b>wedges to test in Studio 2</div>';
      const cov = $('.r-cover', root);
      if (cov && !$('.r-logo', cov)) cov.insertAdjacentHTML('afterbegin', '<img class="r-logo" src="assets/logos/wmu-ecocar.jpg" alt="EcoCAR Innovation Challenge and Western Michigan University logos">');
      const asof = $('.r-asof', root);
      if (asof) {
        const pres = $('.r-present', asof);
        asof.innerHTML = `${esc(TEAM.submission)} <a class="r-dl" href="downloads/portfolio-document.pdf" download>Download PDF ↓</a>`;
        if (pres) asof.appendChild(pres);
      }
      const toc = $('.r-toc', root);
      if (toc && !$('.r-dl', toc)) toc.insertAdjacentHTML('beforeend', '<a class="r-dl" href="downloads/portfolio-document.pdf" download>Download PDF ↓</a>');
      const asks = $('#r-asks', root);
      if (asks) {
        $('h2', asks).textContent = 'Four roadblocks we hit, and how you could help';
        const old = $('ol', asks);
        if (old) old.outerHTML = `<ol class="r-rb">${RB().map((r) => `<li><b>${esc(r.k)}.</b> ${esc(r.hit)}<br><span class="r-rb-ask">How you could help: ${esc(r.ask)}</span></li>`).join('')}</ol>`;
      }
      const tl = $$('.r-toc a', root).find((a) => a.dataset.r === 'r-asks');
      if (tl) tl.textContent = 'Our asks';
      root.dataset.v18 = '1';
    };
  })();
  /* v18:asks end */
  /* v20:vc3d start */
  // Value chain as a 3D car. An x-ray car turns slowly on a test platform; each of the eight
  // layers is a glowing part where it really lives (chips, software, sensors, antenna, TCU, the
  // cloud above, a security shield around it, the test rig underneath). Callouts follow the parts.
  // Lenses sit in a dock on the left; picking one slides its panel in on the right and re-tints the
  // car. Drag to turn, hover to isolate a layer, click for the deep dive. Falls back to the 2D
  // slide when WebGL or three.js is missing.
  (() => {
    const T = window.THREE;
    if (!T || !T.WebGLRenderer) return;
    try { const c = document.createElement('canvas'); if (!(c.getContext('webgl2') || c.getContext('webgl'))) return; } catch (e) { return; }
    const Ly = (id) => LAYERS.find((l) => l.id === id);
    const cssv = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const COMP_C = { 3: '#f87171', 2: '#fbbf24', 1: '#34d399' };
    const COMP_N = { 3: 'Crowded', 2: 'Contested', 1: 'Fragmented' };
    const CAP = { once: ['One-time, per vehicle', '#93c5fd'], mixed: ['Per vehicle, plus paid upgrades', '#67e8f9'], recurring: ['Recurring, after the sale', '#4ade80'], spans: ['Spans every layer', '#c4b5fd'] };
    const ORDER = [1, 2, 3, 4, 5, 6, 7, 8];
    const LENSES = [
      ['layers', 'Layers', 'Where each one lives', 'layers'],
      ['competition', 'Competition', 'How crowded it is', 'people'],
      ['capture', 'Value capture', 'How it gets paid', 'cash'],
      ['pockets', 'Open pockets', 'Where our wedges sit', 'star'],
    ];
    const pocketTag = (l) => {
      const p = l.pocket || {}, d = (window.LAYER_DIVE || {})[l.id] || {};
      if (p.target === 'lead') return ['W1', 'w'];
      if (p.target) return ['W2', 'w'];
      if (p.none) return ['No open space', 'n'];
      if (d.tag) return [d.tag[0].toUpperCase() + d.tag.slice(1), d.tag === 'dropped' ? 'x' : 'i'];
      if (p.screened) return [p.label === 'dropped' ? 'Dropped' : 'Screened out', 'x'];
      return ['Open', 'i'];
    };

    let built = false, active = false, raf = 0, last = 0, time = 0;
    let R, scene, cam, composer, bloom, car, root, shellMats = [], picks = [], partsByLayer = {};
    const st = { yaw: -0.62, yawT: -0.62, pitch: 0.2, pitchT: 0.2, dist: 14.8, distT: 14.8, ty: 1.15, tyT: 1.15, shift: 0, shiftT: 0,
      hot: null, lens: null, explode: 0, explodeT: 0, drag: null, idle: 0, intro: 1, tour: null };
    let box, cv, svg, lbBox, panel, cap, dockBtns = {};
    const labels = {};

    // ---------------------------------------------------------------- materials
    const fres = (color, o = {}) => new T.ShaderMaterial({
      uniforms: { uC: { value: new T.Color(color) }, uO: { value: o.op ?? 1 }, uBase: { value: o.base ?? 0.06 }, uP: { value: o.pow ?? 2.2 }, uK: { value: o.k ?? 1.3 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'uniform vec3 uC; uniform float uO; uniform float uBase; uniform float uP; uniform float uK; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uP); gl_FragColor = vec4(uC*(uBase + f*uK), clamp((uBase + f)*uO, 0., 1.)); }',
      transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending,
    });
    const glow = (color, op = 1) => new T.MeshBasicMaterial({ color, transparent: true, opacity: op, toneMapped: false, depthWrite: false, blending: T.AdditiveBlending });
    const solid = (color, op = 1) => new T.MeshBasicMaterial({ color, transparent: true, opacity: op, toneMapped: false });
    const lineM = (color, op = 0.6) => new T.LineBasicMaterial({ color, transparent: true, opacity: op, toneMapped: false, depthWrite: false });
    const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();

    // a part belongs to one layer: remember its materials (for fading and tinting) and pick meshes
    function part(id, obj) {
      const P = partsByLayer[id] || (partsByLayer[id] = { id, group: new T.Group(), mats: [], home: new T.Vector3(), anchor: new T.Vector3(), fade: 1, ign: 1 });
      P.group.add(obj);
      obj.traverse((o) => {
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => { if (!P.mats.includes(m)) { m.userData.base = { op: m.uniforms ? m.uniforms.uO.value : m.opacity, col: (m.uniforms ? m.uniforms.uC.value : m.color).clone() }; P.mats.push(m); } });
        }
        if (o.isMesh) { o.userData.layer = id; picks.push(o); }
      });
      return obj;
    }
    const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
    const mesh = (g, m) => new T.Mesh(g, m);
    const edges = (g, color, op) => new T.LineSegments(new T.EdgesGeometry(g, 20), lineM(color, op));

    // ---------------------------------------------------------------- the car
    function buildCar() {
      const s = new T.Shape();
      s.moveTo(-2.28, 0.34);
      s.lineTo(-1.82, 0.34); s.absarc(-1.42, 0.40, 0.44, Math.PI, 0, true); s.lineTo(1.03, 0.34);
      s.absarc(1.43, 0.40, 0.44, Math.PI, 0, true); s.lineTo(2.26, 0.34);
      s.bezierCurveTo(2.36, 0.40, 2.38, 0.62, 2.30, 0.70);
      s.bezierCurveTo(2.15, 0.82, 1.65, 0.88, 1.18, 0.98);
      s.bezierCurveTo(0.85, 1.20, 0.55, 1.38, 0.15, 1.42);
      s.bezierCurveTo(-0.45, 1.45, -0.95, 1.40, -1.35, 1.18);
      s.bezierCurveTo(-1.70, 1.05, -2.05, 1.02, -2.25, 0.92);
      s.bezierCurveTo(-2.36, 0.80, -2.36, 0.50, -2.28, 0.34);
      const opt = { depth: 1.42, bevelEnabled: true, bevelThickness: 0.24, bevelSize: 0.16, bevelSegments: 8, curveSegments: 40 };
      const bg = new T.ExtrudeGeometry(s, opt); bg.translate(0, 0, -0.71);
      const shell = fres('#7ea2ff', { op: 0.85, base: 0.03, pow: 2.3, k: 1.0 });
      const body = mesh(bg, shell); shellMats.push(shell);
      const bodyEdges = edges(bg, '#b9ccff', 0.55);
      const fill = new T.MeshBasicMaterial({ color: '#0a1230', transparent: true, opacity: 0.42, depthWrite: false, side: T.FrontSide }); shellMats.push(fill);
      const bodyFill = mesh(bg, fill); bodyFill.renderOrder = -1; shellMats.push(bodyEdges.material);
      // glass house
      const gsh = new T.Shape();
      gsh.moveTo(-1.30, 1.16); gsh.bezierCurveTo(-0.9, 1.36, -0.45, 1.41, 0.12, 1.39);
      gsh.bezierCurveTo(0.5, 1.36, 0.8, 1.2, 1.12, 1.0); gsh.lineTo(-1.2, 1.0); gsh.lineTo(-1.30, 1.16);
      const gg = new T.ExtrudeGeometry(gsh, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.06, bevelSegments: 4, curveSegments: 24 });
      gg.translate(0, 0.012, -0.75);
      const glass = fres('#b9d7ff', { op: 0.55, base: 0.04, pow: 1.8, k: 0.7 }); shellMats.push(glass);
      const house = mesh(gg, glass);
      const houseEdges = edges(gg, '#d6e6ff', 0.7); shellMats.push(houseEdges.material);
      // lights
      const head = solid('#eaf2ff'), tail = solid('#ff4d6d');
      const hl = (z) => at(mesh(new T.BoxGeometry(0.06, 0.06, 0.38), head), 2.33, 0.68, z);
      const tl = at(mesh(new T.BoxGeometry(0.05, 0.05, 1.5), tail), -2.42, 0.88, 0);
      const lights = new T.Group(); lights.add(hl(0.58), hl(-0.58), tl); shellMats.push(head, tail);
      // wheels
      const wheels = [];
      const tireM = new T.MeshStandardMaterial({ color: '#1a2348', roughness: 0.45, metalness: 0.5, transparent: true });
      const rimM = glow('#9fb6ff', 0.55); shellMats.push(tireM, rimM);
      [[1.43, 0.86], [1.43, -0.86], [-1.42, 0.86], [-1.42, -0.86]].forEach(([x, z]) => {
        const w = new T.Group();
        w.add(mesh(new T.TorusGeometry(0.29, 0.11, 18, 48), tireM));
        w.add(mesh(new T.TorusGeometry(0.205, 0.012, 8, 48), rimM));
        for (let k = 0; k < 5; k++) { const sp = mesh(new T.BoxGeometry(0.014, 0.36, 0.01), rimM); sp.rotation.z = (k / 5) * Math.PI * 2; w.add(sp); }
        w.add(mesh(new T.CylinderGeometry(0.05, 0.05, 0.04, 20).rotateX(Math.PI / 2), rimM));
        at(w, x, 0.40, z * 0.98); wheels.push(w);
      });
      const g = new T.Group(); g.add(bodyFill, body, bodyEdges, house, houseEdges, lights, ...wheels);
      g.userData.wheels = wheels;
      return g;
    }

    // ---------------------------------------------------------------- the eight layers
    function buildLayers() {
      const C = {}; ORDER.forEach((id) => { C[id] = cssv(`--${Ly(id).colour}-m`) || '#818cf8'; });
      const anim = [];
      // 01 compute & E/E: central computer, four zone controllers, harness with data pulses
      {
        const g = new T.Group();
        const cg = new T.BoxGeometry(0.62, 0.14, 0.46);
        g.add(at(mesh(cg, solid(C[1], 0.85)), 0.1, 0.56, 0), at(edges(cg, '#e0e7ff', 0.9), 0.1, 0.56, 0));
        const zs = [[1.55, 0.6], [1.55, -0.6], [-1.65, 0.6], [-1.65, -0.6]];
        const harnM = glow(C[1], 0.55), pulseM = glow('#e0e7ff', 1);
        zs.forEach(([x, z]) => {
          const zg = new T.BoxGeometry(0.24, 0.09, 0.18);
          g.add(at(mesh(zg, solid(C[1], 0.8)), x, 0.55, z), at(edges(zg, '#c7d2fe', 0.9), x, 0.55, z));
          const curve = new T.CatmullRomCurve3([new T.Vector3(0.1, 0.52, 0), new T.Vector3(x * 0.5, 0.47, z * 0.75), new T.Vector3(x, 0.53, z)]);
          g.add(mesh(new T.TubeGeometry(curve, 30, 0.012, 6), harnM));
          for (let k = 0; k < 2; k++) { const p = mesh(new T.SphereGeometry(0.03, 10, 8), pulseM); g.add(p); anim.push((t) => p.position.copy(curve.getPointAt((((t * 0.45 + k * 0.5 + x * 0.1) % 1) + 1) % 1))); }
        });
        part(1, g); partsByLayer[1].anchor.set(0.1, 0.62, 0);
      }
      // 02 software platforms: stacked plates over the central computer
      {
        const g = new T.Group();
        for (let k = 0; k < 3; k++) {
          const pg = new T.BoxGeometry(0.7, 0.014, 0.52);
          const pl = new T.Group(); pl.add(mesh(pg, glow(C[2], 0.3)), edges(pg, C[2], 0.95)); at(pl, 0.1, 0.74 + k * 0.085, 0);
          g.add(pl); anim.push((t) => { pl.position.y = 0.74 + k * 0.085 + Math.sin(t * 1.6 + k) * 0.012; pl.rotation.y = Math.sin(t * 0.5 + k * 0.7) * 0.08; });
        }
        part(2, g); partsByLayer[2].anchor.set(0.1, 0.92, 0);
      }
      // 03 ADAS & AD: roof lidar, windshield camera, front radar and a sensing fan ahead
      {
        const g = new T.Group();
        const lid = new T.Group();
        lid.add(mesh(new T.CylinderGeometry(0.13, 0.15, 0.11, 28), solid(C[3], 0.9)));
        lid.add(at(mesh(new T.TorusGeometry(0.15, 0.012, 8, 40).rotateX(Math.PI / 2), glow('#cffafe', 1)), 0, 0.02, 0));
        const beam = mesh(new T.BoxGeometry(0.9, 0.006, 0.02), glow(C[3], 0.7)); at(beam, 0.45, 0.02, 0); lid.add(beam);
        at(lid, 0.15, 1.5, 0); g.add(lid); anim.push((t) => { lid.rotation.y = t * 3.2; });
        g.add(at(mesh(new T.BoxGeometry(0.08, 0.06, 0.14), solid(C[3], 1)), 1.0, 1.06, 0));
        g.add(at(mesh(new T.BoxGeometry(0.03, 0.16, 0.42), solid(C[3], 0.95)), 2.36, 0.52, 0));
        const fanM = new T.ShaderMaterial({ uniforms: { uC: { value: new T.Color(C[3]) }, uT: { value: 0 }, uO: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
          vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
          fragmentShader: 'uniform vec3 uC; uniform float uT; uniform float uO; varying vec2 vP; void main(){ float r = length(vP); float a = (1.0 - smoothstep(0.4, 3.6, r)) * 0.12; float w = fract(r*1.6 - uT*1.2); a += smoothstep(0.92, 1.0, w) * (1.0 - r/3.8) * 0.55; gl_FragColor = vec4(uC, a*uO); }' });
        fanM.userData.isFan = true;
        const fan = mesh(new T.RingGeometry(0.05, 2.9, 64, 1, -0.42, 0.84), fanM); fan.rotation.x = -Math.PI / 2; at(fan, 2.38, 0.5, 0); g.add(fan);
        anim.push((t) => { fanM.uniforms.uT.value = t; });
        part(3, g); partsByLayer[3].anchor.set(0.15, 1.6, 0);
      }
      // 04 OTA & lifecycle: shark-fin antenna, update packets coming down from the cloud
      {
        const g = new T.Group();
        const fs = new T.Shape(); fs.moveTo(0, 0); fs.lineTo(0.46, 0); fs.bezierCurveTo(0.3, 0.06, 0.12, 0.16, 0.02, 0.2); fs.lineTo(0, 0);
        const fg = new T.ExtrudeGeometry(fs, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }); fg.translate(0, 0, -0.035);
        g.add(at(mesh(fg, solid(C[4], 0.95)), -1.18, 1.38, 0));
        const pk = new T.Points(new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(new Float32Array(18 * 3), 3)), new T.PointsMaterial({ color: C[4], size: 0.16, map: dotTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
        g.add(pk);
        anim.push((t) => { const a = pk.geometry.attributes.position.array; for (let k = 0; k < 18; k++) { const f = (t * 0.32 + k / 18) % 1; a[k * 3] = -0.3 + (-0.95 + 0.3) * f + Math.sin(k * 3.1) * 0.05; a[k * 3 + 1] = 2.5 - f * 0.95; a[k * 3 + 2] = Math.cos(k * 2.3) * 0.06; } pk.geometry.attributes.position.needsUpdate = true; });
        part(4, g); partsByLayer[4].anchor.set(-0.98, 1.6, 0);
      }
      // 05 telematics: the connectivity unit, radiating signal rings
      {
        const g = new T.Group();
        const tg = new T.BoxGeometry(0.3, 0.12, 0.24);
        g.add(at(mesh(tg, solid(C[5], 0.9)), -1.85, 0.92, 0), at(edges(tg, '#fde68a', 0.9), -1.85, 0.92, 0));
        for (let k = 0; k < 3; k++) {
          const m = glow(C[5], 0.8); m.userData.ring = true;
          const r = mesh(new T.TorusGeometry(1, 0.01, 6, 72).rotateX(Math.PI / 2), m); at(r, -1.85, 0.98, 0); g.add(r);
          anim.push((t) => { const f = (t * 0.35 + k / 3) % 1; r.scale.setScalar(0.25 + f * 2.6); m.userData.pulse = 1 - f; });
        }
        part(5, g); partsByLayer[5].anchor.set(-1.85, 1.0, 0);
      }
      // 06 data & cloud: a cloud above the car, with data streaming up to it
      {
        const g = new T.Group();
        const cm = fres(C[6], { op: 0.8, base: 0.06, pow: 2.0, k: 1.0 });
        [[0, 0, 0, 0.5], [0.5, -0.08, 0.05, 0.38], [-0.48, -0.1, 0, 0.36], [0.22, 0.22, -0.05, 0.36], [-0.25, 0.18, 0.08, 0.32]].forEach(([x, y, z, r]) => g.add(at(mesh(new T.SphereGeometry(r * 0.8, 28, 18), cm), -0.3 + x * 0.8, 2.75 + y * 0.8, z)));
        const N = 46, up = new T.Points(new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(new Float32Array(N * 3), 3)), new T.PointsMaterial({ color: C[6], size: 0.11, map: dotTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
        g.add(up);
        anim.push((t) => { const a = up.geometry.attributes.position.array; for (let k = 0; k < N; k++) { const f = (t * 0.22 + k / N) % 1, sx = Math.sin(k * 12.9898) * 1.1, sz = Math.cos(k * 78.233) * 0.5; a[k * 3] = sx * (1 - f) + (-0.3) * f; a[k * 3 + 1] = 1.42 + f * 1.25; a[k * 3 + 2] = sz * (1 - f); } up.geometry.attributes.position.needsUpdate = true; g.children[0].parent.rotation.y = 0; });
        part(6, g); partsByLayer[6].anchor.set(-0.3, 2.75, 0);
      }
      // 07 cybersecurity: a mesh shield around the whole car
      {
        const sm = new T.ShaderMaterial({ uniforms: { uC: { value: new T.Color(C[7]) }, uT: { value: 0 }, uO: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
          vertexShader: 'varying vec2 vU; varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vU = uv; vP = position; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
          fragmentShader: 'uniform vec3 uC; uniform float uT; uniform float uO; varying vec2 vU; varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vec2 p = vU*vec2(54.0, 18.0); p.x += step(1.0, mod(floor(p.y), 2.0))*0.5; vec2 g = abs(fract(p) - 0.5); float l = smoothstep(0.465, 0.5, max(g.x, g.y)); float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0); float band = smoothstep(0.08, 0.0, abs(fract(vP.x*0.18 - uT*0.12) - 0.5) - 0.42); gl_FragColor = vec4(uC, (l*0.035*f*2.5 + f*0.06 + band*l*0.18)*uO); }' });
        const sh = mesh(new T.SphereGeometry(1, 72, 36), sm); sh.scale.set(3.05, 1.42, 1.62); at(sh, 0, 0.62, 0);
        anim.push((t) => { sm.uniforms.uT.value = t; });
        part(7, sh); partsByLayer[7].anchor.set(1.85, 1.55, 0.95);
      }
      // 08 integration, V&V: the test platform, a scanning beam and a hardware test bench
      {
        const g = new T.Group();
        const pm = new T.ShaderMaterial({ uniforms: { uC: { value: new T.Color(C[8]) }, uT: { value: 0 }, uO: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
          vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
          fragmentShader: 'uniform vec3 uC; uniform float uT; uniform float uO; varying vec2 vU; void main(){ vec2 q = vU - 0.5; float r = length(q)*2.0; float f = fract(r*7.0 - uT*0.12); float d = min(f, 1.0 - f); float ring = 1.0 - smoothstep(0.0, 0.035, d); float an = atan(q.y, q.x); float sp = 1.0 - smoothstep(0.0, 0.02, abs(fract(an*6.0/3.14159) - 0.5) - 0.47); float edge = smoothstep(0.93, 0.97, r) * (1.0 - smoothstep(0.97, 1.0, r)); float fade = 1.0 - smoothstep(0.55, 1.0, r); gl_FragColor = vec4(uC, ((ring*0.2 + sp*0.07)*fade + edge*0.55 + 0.03*fade)*uO); }' });
        const plat = mesh(new T.CircleGeometry(3.7, 96), pm); plat.rotation.x = -Math.PI / 2; plat.position.y = 0.005; g.add(plat);
        const scanM = new T.ShaderMaterial({ uniforms: { uC: { value: new T.Color(C[8]) }, uO: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
          vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
          fragmentShader: 'uniform vec3 uC; uniform float uO; varying vec2 vU; void main(){ float c = 1.0 - abs(vU.x - 0.5)*2.0; float a = pow(c, 6.0)*0.3*(1.0 - vU.y*0.75) + smoothstep(0.985, 1.0, c)*0.45; gl_FragColor = vec4(uC, a*uO); }' });
        const scan = mesh(new T.PlaneGeometry(0.6, 1.9), scanM); scan.rotation.y = Math.PI / 2; scan.scale.set(1, 1, 1); at(scan, 0, 0.95, 0); scan.scale.x = 4.4; g.add(scan);
        anim.push((t) => { pm.uniforms.uT.value = t; scan.position.x = Math.sin(t * 0.55) * 2.45; });
        const rack = new T.Group(); const rg = new T.BoxGeometry(0.46, 1.05, 0.4);
        rack.add(at(mesh(rg, solid('#1c1030', 0.85)), 0, 0.53, 0), at(edges(rg, C[8], 0.95), 0, 0.53, 0));
        for (let k = 0; k < 5; k++) { const sl = mesh(new T.BoxGeometry(0.3, 0.03, 0.02), glow(C[8], 0.9)); at(sl, 0, 0.2 + k * 0.17, 0.205); rack.add(sl); anim.push((t) => { sl.material.userData.pulse = 0.55 + 0.45 * Math.sin(t * 4 + k); }); }
        at(rack, -3.0, 0, 1.55); rack.rotation.y = 0.5; g.add(rack);
        const cab = new T.CatmullRomCurve3([new T.Vector3(-2.85, 0.25, 1.4), new T.Vector3(-2.6, 0.03, 1.0), new T.Vector3(-2.1, 0.12, 0.5)]);
        g.add(mesh(new T.TubeGeometry(cab, 24, 0.015, 6), glow(C[8], 0.8)));
        part(8, g); partsByLayer[8].anchor.set(-3.0, 1.15, 1.55);
      }
      return anim;
    }

    // ---------------------------------------------------------------- DOM
    function buildDom() {
      const sec = $('#s-vc'), stage = $('.stage', sec);
      box = document.createElement('div'); box.className = 'v3'; box.id = 'v3';
      box.innerHTML = `<canvas class="v3-cv" aria-label="A 3D car that turns slowly. Each value-chain layer glows where it lives; drag to turn it."></canvas>
        <svg class="v3-ln" aria-hidden="true"></svg><div class="v3-lbs"></div>
        <nav class="v3-dock rv" style="--d:3" aria-label="Lenses"><small>Lens</small>
          ${LENSES.map(([k, n, d, ic]) => `<button type="button" class="v3-ls" data-lens="${k}"><i>${icon(ic)}</i><span><b>${n}</b><em>${d}</em></span></button>`).join('')}
          <span class="v3-sep"></span>
          <button type="button" class="v3-tl" data-act="explode"><i>${icon('layers')}</i><b>Explode</b></button>
          <button type="button" class="v3-tl" data-act="tour"><i><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></i><b>Tour the car</b></button>
          <button type="button" class="v3-tl" data-act="reset"><i><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></i><b>Reset view</b></button>
        </nav>
        <aside class="v3-pn" aria-live="polite"></aside>
        <div class="v3-cap" aria-live="polite"></div>
        <div class="v3-key rv" style="--d:5">${[3, 2, 1].map((n) => `<span><i class="m">${[1, 2, 3].map((k) => `<u class="${k <= n ? 'on' : ''}" style="--mc:${COMP_C[n]}"></u>`).join('')}</i><b>${COMP_N[n]}</b><em>${esc((window.COMP_PLAIN || {})[n] || '')}</em></span>`).join('')}</div>
        <p class="v3-hint">Drag to turn the car · hover a layer to isolate it · click it for the deep dive</p>`;
      stage.appendChild(box);
      sec.classList.add('v3-on');
      cv = $('.v3-cv', box); svg = $('.v3-ln', box); lbBox = $('.v3-lbs', box); panel = $('.v3-pn', box); cap = $('.v3-cap', box);
      ORDER.forEach((id) => {
        const l = Ly(id), c = cssv(`--${l.colour}-m`), [tag, tk] = pocketTag(l);
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'v3-lb'; b.dataset.id = id; b.style.setProperty('--c', c);
        b.setAttribute('aria-label', `${l.name}: ${COMP_N[l.comp]}. Open the deep dive`);
        b.innerHTML = `<i class="n">${l.num}</i><span class="t"><b>${esc(l.short)}${tk === 'w' ? `<u class="st">★ ${tag}</u>` : ''}</b><em class="xv"></em></span>`;
        b.addEventListener('mouseenter', () => setHot(id)); b.addEventListener('mouseleave', () => setHot(null));
        b.addEventListener('focus', () => setHot(id)); b.addEventListener('blur', () => setHot(null));
        b.addEventListener('click', () => { stopTour(); dive.open(id); });
        lbBox.appendChild(b); labels[id] = { el: b, x: 0, y: 0, side: 1 };
      });
      $$('.v3-ls', box).forEach((b) => { dockBtns[b.dataset.lens] = b; b.addEventListener('click', () => setLens(st.lens === b.dataset.lens ? null : b.dataset.lens)); });
      $$('.v3-tl', box).forEach((b) => b.addEventListener('click', () => {
        const a = b.dataset.act;
        if (a === 'explode') { st.explodeT = st.explodeT ? 0 : 1; b.classList.toggle('on', !!st.explodeT); stopTour(); }
        if (a === 'tour') { if (st.tour) stopTour(); else startTour(); }
        if (a === 'reset') { stopTour(); setLens(null); st.explodeT = 0; $('[data-act="explode"]', box).classList.remove('on'); st.yawT = -0.62; st.pitchT = 0.2; st.idle = 0; }
      }));
      // drag to turn, hover to isolate, click to open
      const ray = new T.Raycaster(), pt = new T.Vector2();
      const pickAt = (e) => {
        const r = cv.getBoundingClientRect(); pt.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(pt, cam);
        const hit = ray.intersectObjects(picks.filter((m) => m.userData.layer !== 7 && m.userData.layer !== 8), false)[0] || ray.intersectObjects(picks.filter((m) => m.userData.layer === 8 && m.geometry.type !== 'CircleGeometry'), false)[0];
        return hit ? hit.object.userData.layer : null;
      };
      cv.addEventListener('pointerdown', (e) => { st.drag = { x: e.clientX, y: e.clientY, yaw: st.yawT, pitch: st.pitchT, moved: 0 }; cv.setPointerCapture(e.pointerId); stopTour(); });
      cv.addEventListener('pointermove', (e) => {
        if (st.drag) {
          const dx = e.clientX - st.drag.x, dy = e.clientY - st.drag.y; st.drag.moved = Math.max(st.drag.moved, Math.abs(dx) + Math.abs(dy));
          st.yawT = st.drag.yaw + dx * 0.009; st.pitchT = Math.max(0.04, Math.min(0.72, st.drag.pitch + dy * 0.004)); st.idle = 0;
          return;
        }
        const id = pickAt(e); cv.style.cursor = id ? 'pointer' : 'grab'; if (id !== st.hot) setHot(id);
      });
      cv.addEventListener('pointerup', (e) => { const d = st.drag; st.drag = null; if (d && d.moved < 6) { const id = pickAt(e); if (id) dive.open(id); } });
      cv.addEventListener('pointerleave', () => { if (!st.drag) setHot(null); });
    }

    // ---------------------------------------------------------------- lenses
    function lensExtra(l) {
      if (st.lens === 'capture') return esc(CAP[l.capture][0]);
      if (st.lens === 'pockets') { const [t] = pocketTag(l); return esc(l.pocket && l.pocket.text ? `${l.pocket.text} · ${t}` : t); }
      return `<i class="m">${[1, 2, 3].map((k) => `<u class="${k <= l.comp ? 'on' : ''}" style="--mc:${COMP_C[l.comp]}"></u>`).join('')}</i>${st.lens === 'competition' ? esc(COMP_N[l.comp]) : ''}`;
    }
    function panelHtml(k) {
      const row = (l, inner) => `<button type="button" class="v3-pr" data-id="${l.id}" style="--c:${cssv(`--${l.colour}-m`)}"><i class="n">${l.num}</i>${inner}</button>`;
      if (k === 'layers') return `<header><small>Lens · Layers</small><h3>Eight layers, where each one lives</h3></header><div class="v3-pl">${ORDER.map((id) => { const l = Ly(id); return row(l, `<span><b>${esc(l.name)}</b><em>${rich(l.callStat)}</em></span>`); }).join('')}</div>`;
      if (k === 'competition') {
        const ls = ORDER.map(Ly).sort((a, b) => a.comp - b.comp);
        return `<header><small>Lens · Competition (team rating)</small><h3>Only Integration, V&V has no clear leader</h3></header><div class="v3-pl">${ls.map((l) => row(l, `<span><b>${esc(l.short)}</b><em><i class="m">${[1, 2, 3].map((n) => `<u class="${n <= l.comp ? 'on' : ''}" style="--mc:${COMP_C[l.comp]}"></u>`).join('')}</i><strong style="color:${COMP_C[l.comp]}">${COMP_N[l.comp]}</strong></em></span>`)).join('')}</div>`;
      }
      if (k === 'capture') {
        return `<header><small>Lens · Value capture</small><h3>Software keeps paying after the sale</h3></header><div class="v3-pg">${Object.keys(CAP).map((c) => { const ls = ORDER.map(Ly).filter((l) => l.capture === c); return ls.length ? `<section style="--g:${CAP[c][1]}"><h4>${CAP[c][0]}</h4><div>${ls.map((l) => `<button type="button" class="v3-pc" data-id="${l.id}" style="--c:${cssv(`--${l.colour}-m`)}"><i></i>${esc(l.short)}</button>`).join('')}</div></section>` : ''; }).join('')}</div>`;
      }
      return `<header><small>Lens · Open pockets</small><h3>W1 and W2 sit where engineers still struggle</h3></header><div class="v3-pl">${ORDER.map(Ly).map((l) => { const [t, tk] = pocketTag(l); return row(l, `<span><b>${esc((l.pocket && l.pocket.text) || '')}</b><em>${esc(l.short)} <u class="tg tg-${tk}">${esc(t)}</u></em></span>`); }).join('')}</div>`;
    }
    function setLens(k) {
      st.lens = k;
      Object.entries(dockBtns).forEach(([n, b]) => b.classList.toggle('on', n === k));
      box.classList.toggle('pn-open', !!k);
      if (k) {
        panel.innerHTML = panelHtml(k) + '<button type="button" class="v3-px" aria-label="Close the lens panel">×</button>';
        $('.v3-px', panel).addEventListener('click', () => setLens(null));
        $$('[data-id]', panel).forEach((b) => {
          const id = +b.dataset.id;
          b.addEventListener('mouseenter', () => setHot(id)); b.addEventListener('mouseleave', () => setHot(null));
          b.addEventListener('click', () => dive.open(id));
        });
        panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
      }
      ORDER.forEach((id) => { $('.xv', labels[id].el).innerHTML = lensExtra(Ly(id)); });
      st.shiftT = k ? -1 : 0;
    }
    function lensTint(id) {
      const l = Ly(id);
      if (st.lens === 'competition') return [COMP_C[l.comp], 1];
      if (st.lens === 'capture') return [CAP[l.capture][1], l.capture === 'recurring' ? 1 : 0.75];
      if (st.lens === 'pockets') { const [, tk] = pocketTag(l); return tk === 'w' ? ['#fcd34d', 1] : [null, tk === 'x' ? 0.25 : 0.45]; }
      return [null, 1];
    }
    function setHot(id) {
      st.hot = id;
      ORDER.forEach((k) => labels[k] && labels[k].el.classList.toggle('hot', k === id));
      ORDER.forEach((k) => labels[k] && labels[k].el.classList.toggle('dim', id != null && k !== id));
      $$('[data-id]', panel).forEach((b) => b.classList.toggle('hot', +b.dataset.id === id));
    }

    // ---------------------------------------------------------------- tour
    const TOUR = { 1: [-0.2, 0.42, 12.5], 2: [-0.35, 0.5, 12.5], 3: [-0.9, 0.3, 13], 4: [0.9, 0.34, 13], 5: [1.1, 0.3, 13], 6: [-0.6, 0.12, 15.5], 7: [-0.6, 0.3, 15], 8: [0.55, 0.42, 14] };
    function startTour() {
      let i = 0; $('[data-act="tour"]', box).classList.add('on'); box.classList.add('touring');
      const step = () => {
        if (i >= ORDER.length) { stopTour(); return; }
        const id = ORDER[i++], l = Ly(id), [y, p, d] = TOUR[id];
        st.yawT = y; st.pitchT = p; st.distT = d; setHot(id);
        cap.innerHTML = `<span class="n" style="--c:${cssv(`--${l.colour}-m`)}">${l.num}</span><div><b>${esc(l.name)}</b><p>${rich(l.callStat)}</p><em style="color:${COMP_C[l.comp]}">${COMP_N[l.comp]}</em></div>`;
        cap.classList.add('on');
        st.tour = setTimeout(step, 2900);
      };
      step();
    }
    function stopTour() {
      if (!st.tour) return;
      clearTimeout(st.tour); st.tour = null; cap.classList.remove('on'); box.classList.remove('touring'); setHot(null); st.distT = 14.8;
      const b = $('[data-act="tour"]', box); if (b) b.classList.remove('on');
    }

    // ---------------------------------------------------------------- render
    let anims = [];
    const EXP = { 8: 0, 1: 0.55, 2: 1.25, 3: 1.75, 5: 2.25, 4: 2.85, 7: 0.9, 6: 3.6 };
    const v = new T.Vector3();
    function size() {
      const W = stageW, H = STAGE_H, pr = Math.min(2.2, Math.max(1, scale * (window.devicePixelRatio || 1)));
      R.setPixelRatio(EXPORT ? 1.5 : pr); R.setSize(W, H, false);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.width = W + 'px'; svg.style.height = H + 'px';
      if (composer) { composer.setPixelRatio(EXPORT ? 1.5 : pr); composer.setSize(W, H); }
      cam.aspect = W / H; cam.updateProjectionMatrix();
    }
    function build() {
      if (built) return; built = true;
      buildDom();
      R = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: !!EXPORT, powerPreference: 'high-performance' });
      R.setClearColor('#060a18', 1);
      scene = new T.Scene();
      const bgc = document.createElement('canvas'); bgc.width = 1024; bgc.height = 512;
      { const g = bgc.getContext('2d'); const r = g.createRadialGradient(560, 330, 20, 560, 330, 620); r.addColorStop(0, '#1d2558'); r.addColorStop(0.45, '#0f1536'); r.addColorStop(1, '#060a18'); g.fillStyle = r; g.fillRect(0, 0, 1024, 512); }
      scene.background = new T.CanvasTexture(bgc);
      scene.fog = new T.Fog('#070b1c', 18, 34);
      cam = new T.PerspectiveCamera(26, 16 / 9, 0.1, 100);
      scene.add(new T.HemisphereLight('#9fb4ff', '#0a0f26', 0.9));
      const key = new T.DirectionalLight('#ffffff', 1.1); key.position.set(4, 8, 6); scene.add(key);
      const rim = new T.DirectionalLight('#7c9cff', 1.2); rim.position.set(-6, 3, -6); scene.add(rim);
      root = new T.Group(); scene.add(root);
      car = buildCar(); root.add(car);
      anims = buildLayers();
      ORDER.forEach((id) => { const P = partsByLayer[id]; root.add(P.group); P.home.copy(P.group.position); });
      // contact shadow
      const shc = document.createElement('canvas'); shc.width = shc.height = 128; { const g = shc.getContext('2d'); const r = g.createRadialGradient(64, 64, 4, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,.75)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); }
      const shadow = mesh(new T.PlaneGeometry(5.6, 2.6), new T.MeshBasicMaterial({ map: new T.CanvasTexture(shc), transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; root.add(shadow);
      if (T.EffectComposer && T.UnrealBloomPass) {
        composer = new T.EffectComposer(R);
        composer.addPass(new T.RenderPass(scene, cam));
        bloom = new T.UnrealBloomPass(new T.Vector2(stageW, STAGE_H), 0.42, 0.45, 0.62); composer.addPass(bloom);
      }
      size();
      addEventListener('resize', () => requestAnimationFrame(() => { if (built) size(); }));
      // the old 2D slide stays built underneath (and is the fallback); this one takes over its hooks
      const i = slideIndex('s-vc');
      if (i >= 0) hooks[i] = { enter, leave };
      setLens(null);
      if (EXPORT) { st.intro = 0; frame(performance.now()); }
    }
    function frame(now) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; time += dt;
      const k = (r) => 1 - Math.pow(r, dt * 60);
      if (st.intro > 0 && !EXPORT && !REDUCE) st.intro = Math.max(0, st.intro - dt / 2.6); else if (EXPORT || REDUCE) st.intro = 0;
      const intro = st.intro, io = 1 - Math.pow(intro, 2);
      // idle auto-turn, unless dragging, touring or isolating a layer
      st.idle += dt;
      if (!st.drag && !st.tour && st.hot == null && st.idle > 2.5 && !REDUCE && !EXPORT) st.yawT += dt * 0.16;
      st.yaw += (st.yawT - st.yaw) * k(0.9); st.pitch += (st.pitchT - st.pitch) * k(0.9);
      st.dist += (st.distT + st.explode * 5.5 + Math.abs(st.shift) * 2.6 - st.dist) * k(0.92);
      st.ty += (1.15 + st.explode * 1.6 - st.ty) * k(0.92);
      st.shift += (st.shiftT - st.shift) * k(0.9);
      st.explode += (st.explodeT - st.explode) * k(0.93);
      const yaw = st.yaw - intro * 1.4, pitch = st.pitch + intro * 0.35, dist = st.dist + intro * 9;
      root.rotation.y = yaw;
      cam.position.set(0, st.ty + Math.sin(pitch) * dist, Math.cos(pitch) * dist);
      cam.lookAt(0, st.ty, 0);
      // move the car out of the panel's way, and a little right of centre so the left dock breathes
      const W = stageW, H = STAGE_H, panelW = Math.min(620, W * 0.34);
      const openOff = (312 + W - 60 - panelW) / 2 - W / 2;
      const off = 70 - st.shift * (openOff - 70);
      cam.setViewOffset(W, H, -off, -18, W, H);
      // wheels roll with the turn
      car.userData.wheels.forEach((w) => { w.rotation.z = -time * 1.2; });
      anims.forEach((f) => f(time));
      // ignition order on entry, fading and lens tints
      ORDER.forEach((id, n) => {
        const P = partsByLayer[id];
        const ign = Math.min(1, Math.max(0, (io * 1.35 - n * 0.09) * 2.2));
        const [tint, lensOp] = lensTint(id);
        const target = (st.hot == null || st.hot === id ? 1 : 0.14) * lensOp;
        P.fade += (target - P.fade) * k(0.85);
        const lift = (EXP[id] || 0) * st.explode;
        P.group.position.set(P.home.x, P.home.y + lift + (1 - ign) * -0.4, P.home.z);
        if (id === 7) P.group.scale.setScalar(1 + st.explode * 0.25);
        const tcol = tint ? new T.Color(tint) : null;
        const pulse = st.lens === 'capture' && Ly(id).capture === 'recurring' ? 0.75 + 0.25 * Math.sin(time * 4) : 1;
        P.mats.forEach((m) => {
          const b = m.userData.base; const extra = m.userData.pulse ?? 1;
          const op = b.op * P.fade * ign * extra * pulse * (st.hot === id ? 1.25 : 1);
          if (m.uniforms) { m.uniforms.uO.value = op; m.uniforms.uC.value.copy(b.col); if (tcol) m.uniforms.uC.value.lerp(tcol, 0.85); }
          else { m.opacity = Math.min(1, op); m.color.copy(b.col); if (tcol) m.color.lerp(tcol, 0.85); }
        });
      });
      const shellF = (st.hot != null ? 0.45 : 1) * (1 - st.explode * 0.7) * Math.min(1, io * 1.6);
      shellMats.forEach((m) => { const b = m.userData.base || (m.userData.base = { op: m.uniforms ? m.uniforms.uO.value : m.opacity }); if (m.uniforms) m.uniforms.uO.value = b.op * shellF; else m.opacity = b.op * shellF; });
      if (composer) composer.render(); else R.render(scene, cam);
      placeLabels(io);
      if (active && !EXPORT) raf = requestAnimationFrame(frame);
    }
    // callouts: two columns either side of the car, sorted by height, with leader lines to each part
    function placeLabels(io) {
      const W = stageW, H = STAGE_H;
      const c0 = v.set(0, 1.0, 0); root.localToWorld(c0); c0.project(cam);
      const cx = (c0.x + 1) / 2 * W;
      const compact = !!st.lens;
      const gap = Math.max(380, Math.min(520, W * 0.215)) + st.explode * 60;
      const cols = { L: [], R: [] };
      ORDER.forEach((id) => {
        const P = partsByLayer[id], lb = labels[id];
        const a = P.anchor.clone(); a.y += (EXP[id] || 0) * st.explode;
        if (id === 7) a.multiplyScalar(1 + st.explode * 0.25);
        root.localToWorld(a); a.project(cam);
        lb.px = (a.x + 1) / 2 * W; lb.py = (1 - a.y) / 2 * H;
        lb.side = lb.px < cx ? 'L' : 'R';
        cols[lb.side].push(lb);
      });
      let lines = '';
      if (compact) {
        ORDER.forEach((id) => { const lb = labels[id]; lb.el.classList.add('cp'); lb.el.style.transform = `translate(${lb.px - 21}px, ${lb.py - 21}px)`; });
      } else {
        const top = 238, bot = 812, hgt = 66;
        Object.entries(cols).forEach(([s, arr]) => {
          arr.sort((p, q) => p.py - q.py);
          arr.forEach((lb, n) => { lb.y = Math.max(top + (s === 'L' ? 30 : 0), lb.py - hgt / 2); if (n) lb.y = Math.max(lb.y, arr[n - 1].y + hgt); });
          for (let n = arr.length - 1; n >= 0; n--) { const lim = n === arr.length - 1 ? bot - hgt : arr[n + 1].y - hgt; arr[n].y = Math.min(arr[n].y, lim); }
          arr.forEach((lb) => {
            lb.el.classList.remove('cp');
            const w = lb.el.offsetWidth || 240;
            lb.x = s === 'L' ? Math.max(340, cx - gap - w) : Math.min(W - 60 - w, cx + gap);
            lb.el.style.transform = `translate(${lb.x}px, ${lb.y}px)`;
            const ex = s === 'L' ? lb.x + w + 6 : lb.x - 6, ey = lb.y + 27;
            const kx = s === 'L' ? ex + 26 : ex - 26;
            const c = lb.el.style.getPropertyValue('--c');
            const on = st.hot == null || st.hot === +lb.el.dataset.id;
            lines += `<path d="M${ex} ${ey} H${kx} L${lb.px} ${lb.py}" stroke="${c}" stroke-opacity="${on ? 0.75 : 0.15}"/><circle cx="${lb.px}" cy="${lb.py}" r="${on ? 6 : 4}" fill="#0b1228" stroke="${c}" stroke-width="2.5" stroke-opacity="${on ? 1 : 0.3}"/>`;
          });
        });
      }
      svg.innerHTML = lines;
      box.style.setProperty('--io', Math.min(1, Math.max(0, io * 1.4 - 0.4)).toFixed(3));
    }
    function enter() {
      if (!built) return;
      active = true; last = 0; size();
      st.intro = REDUCE || EXPORT ? 0 : 1; st.idle = 0;
      if (EXPORT) { st.yaw = st.yawT; frame(performance.now()); frame(performance.now() + 16); return; }
      cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    }
    function leave() { active = false; cancelAnimationFrame(raf); stopTour(); setHot(null); }
    if (/[?&]v3test/.test(location.search)) window.__v3 = st;
    V16.push(build);
  })();
  /* v20:vc3d end */
  /* v21:intro start */
  // Slides 2-4 redesigned. Exec summary: the bottom line as three beats, a growth gauge, a
  // narrowing strip (8 layers, 7 pockets, 3 wedges) feeding the wedge cards. Contents: five
  // chapter cards with the brief deliverable each one answers, over a band that narrows from the
  // whole market to three wedges and then to action. Why SDVs: flip cards (see index.html).
  (() => {
    const CH_COL = { market: '#22d3ee', incumbents: '#fbbf24', fit: '#34d399', wedges: '#a78bfa', next: '#f472b6' };
    const DELIV = {
      market: 'Ecosystem and value chain map',
      incumbents: 'Business model canvases for two companies at different stages',
      fit: 'Feasibility screen and engineer personas',
      wedges: 'Two to three wedge hypotheses, each with a market size and a test plan',
      next: 'Outreach pipeline, risks and our asks',
    };
    const W_SHORT = {
      w1: 'Evidence for the everyday cases statistical tests never sampled',
      w2: 'Which tests can safely move off the hardware bench',
      w3: 'What to re-test when a driver-assist AI model changes',
    };
    const BEATS = [
      ['trend', 'The shift', 'Software moves a car’s value into a few central computers, and lets automakers keep earning after the sale.'],
      ['castle', 'Where the money sits', 'The largest pools (chips, operating systems, driving stacks) belong to well-funded incumbents.'],
      ['target', 'Our opening', 'The evidence every automaker must finish before launch: can a model, a test or an update be trusted? That is integration, verification and validation (V&V).'],
    ];
    const arc = (r, frac, cls) => `<circle class="${cls}" cx="110" cy="110" r="${r}" pathLength="100" stroke-dasharray="${(75 * frac).toFixed(2)} 100" transform="rotate(135 110 110)"/>`;
    V16.push(() => {
      // ---- slide 2: executive summary
      const body = $('#s-exec .x16-body');
      if (body) {
        body.className = 'x16-body e21';
        body.innerHTML = `
          <div class="e21-top">
            <div class="e21-story"><small class="e21-k">Bottom line</small>
              <ol class="e21-beats">${BEATS.map(([ic, h, p], k) => `<li class="${k === 2 ? 'hl' : ''}" style="--i:${k}"><i>${icon(ic)}</i><div><b>${h}</b><p>${esc(p)}</p></div></li>`).join('')}</ol></div>
            <div class="e21-gauge">
              <div class="e21-dial"><svg viewBox="0 0 220 220" aria-hidden="true">${arc(92, 1, 'trk')}${arc(70, 1, 'trk')}${arc(92, 11.4 / 12, 'a1')}${arc(70, 4.5 / 12, 'a2')}</svg>
              <div class="e21-gv"><b><span data-count="11.4" data-dec="1" data-suffix="%">11.4%</span></b><small>a year</small></div></div>
              <ul><li class="g1"><i></i><span><b>11.4%</b> integration and V&amp;V services, the fastest-growing of McKinsey’s auto software segments${citeHtml('mck')}</span></li>
                <li class="g2"><i></i><span><b>4.5%</b> the whole auto software and electronics market</span></li></ul>
            </div>
          </div>
          <div class="e21-flow" aria-label="How we narrowed">
            <span class="f1"><b data-count="8">8</b>value-chain layers mapped</span><i></i>
            <span class="f2"><b data-count="7">7</b>open pockets screened</span><i></i>
            <span class="f3"><b data-count="3">3</b>wedges to test in Studio 2</span>
            <button type="button" class="ext-link" data-gs="s-evolve">How we narrowed →</button>
          </div>
          <div class="e21-cards">${WEDGES.list.map((w, k) => `<button type="button" class="e21-w${w.id === 'w2' ? ' weak' : ''}" style="${cv(w.colour)};--i:${k}" data-wedge="${w.id}">
              <span class="e21-wt"><em>${esc(w.code)}</em><u>${esc(w.id === 'w2' ? 'Weakest' : w.tag)}</u><span aria-hidden="true">→</span></span>
              <b>${esc(w.name)}</b><span class="e21-wp">${esc(W_SHORT[w.id] || w.plain)}</span></button>`).join('')}</div>
          <div class="x16-risk e21-risk"><span class="x16-risk-k">Biggest risk</span><p>${esc(EXEC.risk)}</p><button type="button" class="ext-link" data-gs="s-gaps">Our risks and what we do →</button></div>`;
        $$('[data-wedge]', body).forEach((b) => b.addEventListener('click', () => wedgeSlide.show(b.dataset.wedge)));
        body.addEventListener('click', (e) => { const b = e.target.closest('[data-gs]'); if (b) goId(b.dataset.gs); });
      }
      // ---- slide 3: contents
      const grid = $('#mpGrid');
      if (grid) {
        const all = () => [...document.querySelectorAll('#deck > .slide')];
        const no = (id) => all().findIndex((s) => s.id === id) + 1;
        const inCh = (cid) => all().filter((s) => s.dataset.ch === cid);
        const chs = CHAPTERS.filter((c) => typeof c.n === 'number');
        const ck = (cid) => CHECKIN.filter((x) => x.ch.includes(cid)).map((x) => `<em>Check-In ${esc(x.code)}</em>`).join('');
        grid.className = 'c21';
        grid.innerHTML = `<div class="c21-cards">${chs.map((c, k) => `<article class="c21-ch" style="--i:${k};--cc:${CH_COL[c.id]}">
            <div class="c21-hd"><span class="c21-n">${c.n}</span><div class="c21-codes">${c.code && !/Check-In/.test(c.code) ? `<em class="br">Brief ${esc(c.code)}</em>` : ''}${ck(c.id)}</div></div>
            <h3>${esc(c.name)}</h3>
            <p class="c21-q">${esc(c.q)}</p>
            <div class="c21-dl"><small>Deliverable</small><b>${esc(DELIV[c.id] || '')}</b></div>
            <ol class="c21-sl">${inCh(c.id).map((s) => `<li><button type="button" data-gs="${s.id}"><em>${no(s.id)}</em>${esc(s.dataset.title)}</button></li>`).join('')}</ol>
          </article>`).join('')}</div>
          <div class="c21-band" aria-hidden="true">
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none"><defs><linearGradient id="c21g" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".25" stop-color="#fbbf24"/><stop offset=".5" stop-color="#34d399"/><stop offset=".75" stop-color="#a78bfa"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>
              <polygon points="0,2 1000,22 1000,38 0,58" fill="url(#c21g)" fill-opacity=".22"/><path class="c21-flow" d="M0 30 H1000" stroke="url(#c21g)"/></svg>
            ${chs.map((c, k) => `<i style="--x:${10 + k * 20}%;--cc:${CH_COL[c.id]};--i:${k}"></i>`).join('')}
            <span class="l">The whole market</span><span class="r">Three wedges, then action</span>
          </div>`;
      }
      // ---- slide 4: flip cards
      $$('#s-why .wf').forEach((c) => {
        const flip = () => { const on = !c.classList.contains('flip'); $$('#s-why .wf.flip').forEach((o) => { o.classList.remove('flip'); o.setAttribute('aria-pressed', 'false'); }); c.classList.toggle('flip', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); };
        c.addEventListener('click', (e) => { if (e.target.closest('.cite a, a')) return; flip(); });
        c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
      });
      hookOn('s-why', { leave() { $$('#s-why .wf.flip').forEach((o) => o.classList.remove('flip')); } });
    });
  })();
  /* v21:intro end */
  /* v26:narrow start */
  // How we narrowed, made simple: seven pockets on the left, one gate (team fit and three real
  // companies) in the middle, what survived on the right. On entry each pocket's line runs to the
  // gate: four stop there with a cross, three pass with a tick and land on W1 or W2; W3 joins last.
  // Big counters on top tell the story. Click a pocket for what we learned; a wedge to open it.
  V16.push(() => {
    const sec = $('#s-evolve'), stage = sec && $('.stage', sec), N = window.NARROW;
    if (!stage || !N) return;
    const WC = { w1: 'Lthree', w2: 'Lvv', w3: 'Lone' };
    const wd = (id) => WEDGES.list.find((w) => w.id === id) || {};
    const WSUB = { w1: 'First to test · built from two pockets', w2: 'Narrowed from HIL to one open question', w3: 'Added after the check · same focus area' };
    const nOut = N.rows.filter((r) => !r.to).length, nW = new Set(N.rows.filter((r) => r.to).map((r) => r.to)).size;
    const box = document.createElement('div'); box.className = 'n26'; box.id = 'n26';
    box.innerHTML = `
      <div class="n26-h l"><b>${N.rows.length}</b><span>open pockets<small>from our value chain map</small></span></div>
      <div class="n26-h g"><b>${nOut}</b><span>dropped<small>at the two checks</small></span></div>
      <div class="n26-h r"><b>${nW}</b><span>survived<small>+ W3 added after</small></span></div>
      <ol class="n26-rows" aria-label="Seven pockets and what happened to each">${N.rows.map((r, i) => `<li><button type="button" class="n26-p ${r.to ? 'in' : 'out'}" data-id="${r.id}" style="--c:var(--${r.colour}-m);--i:${i}" aria-label="${esc(r.name)}: ${esc(r.fate)}. Open what we learned">
        <i aria-hidden="true"></i><b>${esc(r.name)}</b><em>${r.to ? esc(r.fate.replace('→', '→')) : 'Dropped'}</em></button></li>`).join('')}</ol>
      <div class="n26-gate" aria-hidden="true"><i></i></div>
      <div class="n26-gl"><span><b>①</b> Team fit</span><span><b>②</b> Real companies: dSPACE · Applied Intuition · Mobileye</span></div>
      <div class="n26-ws">${['w1', 'w2', 'w3'].map((id) => { const w = wd(id); return `<button type="button" class="n26-w${id === 'w3' ? ' later' : ''}" data-w="${id}" style="--c:var(--${WC[id]}-m)" aria-label="${esc(w.code)}: ${esc(w.name)}. Open it">
        <i>${esc(w.code)}</i><span><b>${esc(w.name)}</b><small>${esc(WSUB[id])}</small></span></button>`; }).join('')}</div>
      <svg class="n26-ln" aria-hidden="true"></svg>
      <div class="n26-mks" aria-hidden="true"></div>
      <p class="n26-tip">Click any pocket for what we learned</p>
      <button type="button" class="n26-re">↻ Replay</button>`;
    stage.appendChild(box);
    sec.classList.add('n26-on');

    function dialog(r) {
      let d = $('#n26Dlg');
      if (!d) {
        d = document.createElement('dialog');
        d.id = 'n26Dlg'; d.className = 'nw-dlg n26d'; d.setAttribute('aria-labelledby', 'n26DlgH');
        document.body.appendChild(d);
        d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
      }
      const out = !r.to;
      d.style.cssText = cv(r.colour);
      d.innerHTML = `<header><div><small class="${out ? 'out' : 'in'}">${esc(r.fate)}</small><h3 id="n26DlgH">${esc(r.name)}</h3></div><button type="button" class="tog" data-close>Close</button></header>
        <div class="nw-dlg-b"><section><h5>What we thought at first</h5><p>${esc(r.thought)}</p></section>
        <section><h5>What we learned</h5><p>${esc(r.learned)}</p></section>
        <section class="nw-now"><h5>What we do now</h5><p>${esc(r.now)}</p></section>
        <p class="more"><b>${out ? 'What would reopen it' : 'Note'}</b> ${esc(r.more)}</p></div>`;
      d.showModal();
    }
    // positions inside the box from layout offsets (not screen rects), so the stage scale doesn't matter
    const pos = (el) => { let l = 0, t = 0, e = el; while (e && e !== box) { l += e.offsetLeft; t += e.offsetTop; e = e.offsetParent; } return { l, t, w: el.offsetWidth, h: el.offsetHeight }; };
    function layout() {
      if (!box.offsetWidth) return;
      const W = box.offsetWidth, H = box.offsetHeight, g = pos($('.n26-gate', box)), gx = g.l + g.w / 2;
      const svg = $('.n26-ln', box); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
      const cards = {}; $$('.n26-w', box).forEach((c) => { cards[c.dataset.w] = pos(c); });
      let paths = '', mks = '', arrive = {};
      N.rows.forEach((r, i) => {
        const p = pos($(`.n26-p[data-id="${r.id}"]`, box)), x1 = p.l + p.w + 6, y = p.t + p.h / 2, d = 0.35 + i * 0.26;
        if (r.to) {
          const c = cards[r.to], x2 = c.l - 8, y2 = c.t + c.h / 2, mx = gx + (x2 - gx) * 0.55;
          const len1 = gx - x1, len = len1 + Math.hypot(x2 - gx, y2 - y), dur = 1.15;
          paths += `<path class="in" data-id="${r.id}" pathLength="1" style="--c:var(--${r.colour}-m);--d:${d}s;--dur:${dur}s" d="M${x1},${y} L${gx},${y} C${mx},${y} ${mx},${y2} ${x2},${y2}"/>`;
          mks += `<span class="n26-mk ok" style="left:${gx}px;top:${y}px;--d2:${(d + dur * (len1 / len)).toFixed(2)}s">✓</span>`;
          arrive[r.to] = Math.min(arrive[r.to] ?? 99, d + dur);
        } else {
          paths += `<path class="out" data-id="${r.id}" pathLength="1" style="--c:var(--${r.colour}-m);--d:${d}s;--dur:.65s" d="M${x1},${y} L${gx - 20},${y}"/>`;
          mks += `<span class="n26-mk no" style="left:${gx}px;top:${y}px;--d2:${(d + 0.6).toFixed(2)}s">✕</span>`;
          $(`.n26-p[data-id="${r.id}"]`, box).style.setProperty('--d2', `${(d + 0.6).toFixed(2)}s`);
        }
      });
      const end = 0.35 + N.rows.length * 0.26 + 0.5;
      $$('.n26-w', box).forEach((c) => c.style.setProperty('--d', `${(arrive[c.dataset.w] ?? end).toFixed(2)}s`));
      svg.innerHTML = paths; $('.n26-mks', box).innerHTML = mks;
    }
    function play(instant) {
      box.classList.remove('go'); box.classList.add('now');
      void box.offsetWidth;
      if (!instant) box.classList.remove('now');
      box.classList.add('go');
    }
    box.addEventListener('click', (e) => {
      const p = e.target.closest('.n26-p'); if (p) { dialog(N.rows.find((r) => r.id === p.dataset.id)); return; }
      const w = e.target.closest('.n26-w'); if (w) { goId('s-wedges'); setTimeout(() => wedgeSlide.pop(w.dataset.w), 450); return; }
      if (e.target.closest('.n26-re')) { layout(); play(false); }
    });
    const hot = (id) => { box.classList.toggle('hl', !!id); $$('.n26-ln path, .n26-p', box).forEach((el) => el.classList.toggle('on', el.dataset.id === id)); };
    box.addEventListener('mouseover', (e) => { const p = e.target.closest('.n26-p'); hot(p ? p.dataset.id : null); });
    box.addEventListener('mouseleave', () => hot(null));
    addEventListener('resize', () => requestAnimationFrame(layout));
    const i = slideIndex('s-evolve');
    if (i >= 0) hooks[i] = { enter() { layout(); play(EXPORT || REDUCE); requestAnimationFrame(layout); }, leave() {} };
  });
  /* v26:narrow end */
  /* v26:people start */
  // Who we will interview: "So far" and "Goal" move out of the bottom corners into one tracker
  // under the title, so the progress reads first.
  V16.push(() => {
    const box = $('#plBody');
    if (!box || !box.classList.contains('pr')) return;
    const F = PIPELINE.found, n = F.of || PIPELINE.rows.length;
    $$('.pr-start, .pr-goal', box).forEach((el) => el.remove());
    const t = document.createElement('div'); t.className = 'pr-track';
    t.innerHTML = `<div class="pt-a"><small>So far</small><b>${F.people}</b><span>real people found</span></div>
      <div class="pt-m"><span class="pt-seg" aria-label="${F.personas} of ${n} personas have real people found">${Array.from({ length: n }, (_, k) => `<i class="${k < F.personas ? 'on' : ''}" style="--k:${k}"></i>`).join('')}</span>
        <span class="pt-l"><b>${F.personas} of ${n}</b> personas matched to real people · nobody contacted yet</span></div>
      <div class="pt-b"><small>Goal</small><b>~10</b><span>interviews<em><u>per wedge</u>${PIPELINE.convs.map(([id, c]) => { const w = WEDGES.list.find((x) => x.id === id); return `<i style="--k:var(--${w.colour}-m)">${w.code} ${c}</i>`; }).join('')}</em></span></div>`;
    box.prepend(t);
  });
  /* v26:people end */
  /* v27:gaps start */
  // Risks & gaps: four cards on one shared grid (subgrid rows), so the headline, the risk and
  // "what we do" line up across all four; each card says when the plan happens. The smaller gaps
  // become a checklist with the studio each closes in.
  V16.push(() => {
    const rc = $('#riskCards'), gp = $('#gpBody');
    if (!rc || !window.RISKS) return;
    const RC = ['#f87171', '#fbbf24', '#22d3ee', '#a78bfa'];
    const SVG = (p) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg>`;
    const WARN = 'M12 3 2 21h20L12 3zm0 6v6m0 3v.5', OK = 'M5 12.5l4.5 4.5L19 7';
    const ICON = { people: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 21v-2c0-3 4-5 8-5s8 2 8 5v2zm17 0v-2c0-1.6-.6-2.9-1.7-3.9C19.6 15.4 23 16.8 23 19v2z',
      car: 'M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11a2 2 0 0 1 2 2v4h-2v2h-3v-2H8v2H5v-2H3v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1-3H8.2zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
      key: 'M12.65 10A6 6 0 0 0 7 6a6 6 0 1 0 5.65 8H17v4h4v-4h2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
      tools: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z' };
    rc.className = 'rk27';
    rc.innerHTML = RISKS.map((r, k) => `<article class="rk27-c" style="--i:${k};--rc:${RC[k % 4]}">
        <header><span class="rk27-i"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[r.icon] || ICON.key}"/></svg></span><span class="rk27-k">${esc(r.k)}</span></header>
        <div class="rk27-h"><h4>${esc(r.n)}</h4>${k === 0 ? `<div class="rk27-m" role="img" aria-label="No wedge pain confirmed yet">${WEDGES.list.map((w, j) => `<i style="--j:${j}">${esc(w.code)}</i>`).join('')}<span>none confirmed yet</span></div>` : ''}</div>
        <div class="rk27-r"><small class="warn">${SVG(WARN)}Risk</small><p>${esc(r.t)}</p></div>
        <div class="rk27-l" aria-hidden="true"><i></i></div>
        <div class="rk27-do"><small>${SVG(OK)}What we do${r.by ? `<em>${esc(r.by)}</em>` : ''}</small><p>${esc(r.act)}</p></div></article>`).join('');
    if (gp && window.GAPS) {
      gp.className = 'rk27-more';
      gp.innerHTML = `<h5>Smaller gaps we are closing</h5><ul>${GAPS.map((g, k) => `<li style="--i:${k}" title="${esc(g[1])} → ${esc(g[2])}"><i aria-hidden="true"></i><span>${esc(g[4] || g[2])}</span><em>${esc(g[3])}</em></li>`).join('')}</ul>`;
    }
  });
  /* v27:gaps end */

  /* v30:r1story start */
  // The Dossiers slide is cut, so a Round 1 pick (on the Round 1 map) opens its story here:
  // what happened, what we thought at first, what we learned.
  function r1Story(id) {
    const N = window.NARROW || { rows: [] }, FATE = window.CAND_FATE || {};
    const r = N.rows.find((x) => x.id === id) || {}, f = FATE[id] || {}, c = (window.CANDIDATES || []).find((x) => x.id === id) || {};
    let d = $('#r1Dlg');
    if (!d) {
      d = document.createElement('dialog'); d.id = 'r1Dlg'; d.className = 'nw-dlg n26d'; d.setAttribute('aria-labelledby', 'r1DlgH');
      document.body.appendChild(d);
      d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    }
    const out = f.k !== 'narrowed';
    d.style.cssText = cv(c.colour || r.colour || 'blue');
    d.innerHTML = `<header><div><small class="${out ? 'out' : 'in'}">${esc(f.tag || r.fate || '')}</small><h3 id="r1DlgH">${esc(r.name || c.title || '')}</h3></div><button type="button" class="tog" data-close>Close</button></header>
      <div class="nw-dlg-b"><section class="nw-now"><h5>What happened</h5><p>${esc(f.why || r.why || c.now || '')}</p></section>
      ${r.thought ? `<section><h5>What we thought at first</h5><p>${esc(r.thought)}</p></section>` : ''}
      ${r.learned ? `<section><h5>What we learned</h5><p>${esc(r.learned)}</p></section>` : ''}
      ${r.more ? `<p class="more"><b>${out ? 'What would reopen it' : 'Note'}</b> ${esc(r.more)}</p>` : ''}</div>`;
    if (!d.open) d.showModal();
  }
  /* v30:r1story end */
  // v16-modules-end

  // ------------------------------------------------------------------ INIT
  hydrateIcons();
  eco.build();
  vc.build();
  pools.build();
  ws.build();
  fc.build();
  execSlide.build();
  screen.build();
  dossier.build();
  bmcSlide.build();
  round2.build();
  evolve.build();
  personaSlide.build();
  wedgeSlide.build();
  extra.build();
  v13.build();
  v14.build();
  v15.build();
  V16.forEach((f) => f());
  coverText();
  finder.build();
  buildChrome();
  hydrateCites();
  bindTilt();
  fit();
  const start = parseInt(location.hash.slice(1), 10);
  go(isNaN(start) ? 0 : start);
  mode.init();
  dock.init();

  // ?dive=N opens a layer deep dive on load
  const qd = new URLSearchParams(location.search).get('dive');
  if (qd) setTimeout(() => dive.open(+qd), 300);
})();

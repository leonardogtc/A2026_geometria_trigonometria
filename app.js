/**
 * app.js - Lógica interativa de desenho no Canvas e exportação SVG
 */

// Elementos de UI
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const canvasBadge = document.getElementById('canvas-badge');
const btnDownloadSvg = document.getElementById('btn-download-svg');

// Estado da Aplicação
let currentTab = 'circle';
let animationFrameId = null;

// Estados específicos de cada modo
const state = {
  circle: {
    angle: 45, // em graus
    animating: false,
    speed: 0.8
  },
  polygons: {
    sides: 5,
    innerRatio: 0.45,
    rotation: 0,
    showGrid: true
  },
  rose: {
    n: 4,
    d: 1
  },
  lissajous: {
    a: 3,
    b: 4,
    delta: Math.PI / 2, // 90 graus
    animating: false,
    t: 0
  }
};

// ==========================================
// 1. Inicialização de Eventos
// ==========================================

function init() {
  setupTabs();
  setupCircleControls();
  setupPolygonControls();
  setupRoseControls();
  setupLissajousControls();
  setupSvgExport();
  setupCanvasInteraction();

  render();
}

// Navegação entre Abas
function setupTabs() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      document.getElementById(`controls-${currentTab}`).classList.add('active');

      // Parar animações de outras abas se necessário
      if (currentTab !== 'circle') state.circle.animating = false;
      if (currentTab !== 'lissajous') state.lissajous.animating = false;

      updateBadge();
      render();
    });
  });
}

function updateBadge() {
  const titles = {
    circle: 'Círculo Trigonométrico & Onda Senoidal',
    polygons: 'Polígonos & Estrelas em Coordenadas Polares',
    rose: 'Rosas Polares (Curvas de Rhodonea)',
    lissajous: 'Curvas Harmônicas de Lissajous'
  };
  canvasBadge.textContent = titles[currentTab];
}

// ==========================================
// 2. Controles Específicos
// ==========================================

function setupCircleControls() {
  const angleSlider = document.getElementById('circle-angle');
  const angleVal = document.getElementById('circle-angle-val');
  const btnAnimate = document.getElementById('btn-animate-circle');
  const btnReset = document.getElementById('btn-reset-circle');

  angleSlider.addEventListener('input', (e) => {
    state.circle.angle = parseFloat(e.target.value);
    updateCircleMetrics();
    render();
  });

  btnAnimate.addEventListener('click', () => {
    state.circle.animating = !state.circle.animating;
    btnAnimate.textContent = state.circle.animating ? '⏸ Pausar' : '▶ Animar Rotação';
    if (state.circle.animating) loopAnimation();
  });

  btnReset.addEventListener('click', () => {
    state.circle.angle = 45;
    angleSlider.value = 45;
    updateCircleMetrics();
    render();
  });

  updateCircleMetrics();
}

function updateCircleMetrics() {
  const angleRad = (state.circle.angle * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const tan = Math.tan(angleRad);

  document.getElementById('circle-angle-val').textContent = 
    `${Math.round(state.circle.angle)}° (${angleRad.toFixed(2)} rad)`;
  document.getElementById('metric-cos').textContent = cos.toFixed(3);
  document.getElementById('metric-sin').textContent = sin.toFixed(3);
  document.getElementById('metric-tan').textContent = Math.abs(tan) > 999 ? '∞' : tan.toFixed(3);
}

function setupPolygonControls() {
  const sidesSlider = document.getElementById('poly-sides');
  const innerSlider = document.getElementById('poly-inner-ratio');
  const rotSlider = document.getElementById('poly-rotation');
  const gridCheck = document.getElementById('poly-show-grid');

  sidesSlider.addEventListener('input', (e) => {
    state.polygons.sides = parseInt(e.target.value, 10);
    document.getElementById('poly-sides-val').textContent = state.polygons.sides;
    render();
  });

  innerSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.polygons.innerRatio = val / 100;
    document.getElementById('poly-inner-val').textContent = 
      val === 100 ? '100% (Polígono Convexo)' : `${val}% (Estrela)`;
    render();
  });

  rotSlider.addEventListener('input', (e) => {
    state.polygons.rotation = parseInt(e.target.value, 10);
    document.getElementById('poly-rot-val').textContent = `${state.polygons.rotation}°`;
    render();
  });

  gridCheck.addEventListener('change', (e) => {
    state.polygons.showGrid = e.target.checked;
    render();
  });
}

function setupRoseControls() {
  const nSlider = document.getElementById('rose-n');
  const dSlider = document.getElementById('rose-d');

  function updateRose() {
    state.rose.n = parseInt(nSlider.value, 10);
    state.rose.d = parseInt(dSlider.value, 10);
    document.getElementById('rose-n-val').textContent = state.rose.n;
    document.getElementById('rose-d-val').textContent = state.rose.d;

    const k = state.rose.n / state.rose.d;
    document.getElementById('rose-k-val').textContent = k.toFixed(2);

    let petals = '';
    if (state.rose.d === 1) {
      petals = state.rose.n % 2 === 0 ? `${2 * state.rose.n} pétalas` : `${state.rose.n} pétalas`;
    } else {
      petals = `${(state.rose.n * state.rose.d) % 2 === 0 ? 2 * state.rose.n : state.rose.n} laços aproximados`;
    }
    document.getElementById('rose-petals-val').textContent = petals;
    render();
  }

  nSlider.addEventListener('input', updateRose);
  dSlider.addEventListener('input', updateRose);
}

function setupLissajousControls() {
  const aSlider = document.getElementById('liss-a');
  const bSlider = document.getElementById('liss-b');
  const deltaSlider = document.getElementById('liss-delta');
  const btnAnimate = document.getElementById('btn-animate-lissajous');

  aSlider.addEventListener('input', (e) => {
    state.lissajous.a = parseInt(e.target.value, 10);
    document.getElementById('liss-a-val').textContent = state.lissajous.a;
    render();
  });

  bSlider.addEventListener('input', (e) => {
    state.lissajous.b = parseInt(e.target.value, 10);
    document.getElementById('liss-b-val').textContent = state.lissajous.b;
    render();
  });

  deltaSlider.addEventListener('input', (e) => {
    const deg = parseInt(e.target.value, 10);
    state.lissajous.delta = (deg * Math.PI) / 180;
    document.getElementById('liss-delta-val').textContent = `${(state.lissajous.delta / Math.PI).toFixed(2)}π rad (${deg}°)`;
    render();
  });

  btnAnimate.addEventListener('click', () => {
    state.lissajous.animating = !state.lissajous.animating;
    btnAnimate.textContent = state.lissajous.animating ? '⏸ Pausar' : '▶ Animar Traçador';
    if (state.lissajous.animating) loopAnimation();
  });
}

// Permite arrastar o ângulo no canvas na aba do círculo
function setupCanvasInteraction() {
  let isDragging = false;

  canvas.addEventListener('mousedown', (e) => {
    if (currentTab !== 'circle') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Centro do círculo é (220, 300)
    const cx = 220;
    const cy = 300;
    const dist = Math.hypot(x - cx, y - cy);

    if (dist < 220) {
      isDragging = true;
      updateAngleFromMouse(x, y, cx, cy);
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || currentTab !== 'circle') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateAngleFromMouse(x, y, 220, 300);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function updateAngleFromMouse(x, y, cx, cy) {
  // Coordenadas de tela: dy = cy - y para que o ângulo cresça no sentido anti-horário
  const dx = x - cx;
  const dy = cy - y;
  let rad = Math.atan2(dy, dx);
  if (rad < 0) rad += 2 * Math.PI;

  const deg = (rad * 180) / Math.PI;
  state.circle.angle = deg;
  document.getElementById('circle-angle').value = deg;
  updateCircleMetrics();
  render();
}

// Loop de animação contínua para abas com animação ativada
function loopAnimation() {
  if (currentTab === 'circle' && state.circle.animating) {
    state.circle.angle = (state.circle.angle + state.circle.speed) % 360;
    document.getElementById('circle-angle').value = state.circle.angle;
    updateCircleMetrics();
    render();
    animationFrameId = requestAnimationFrame(loopAnimation);
  } else if (currentTab === 'lissajous' && state.lissajous.animating) {
    state.lissajous.t += 0.03;
    render();
    animationFrameId = requestAnimationFrame(loopAnimation);
  }
}

// ==========================================
// 3. Renderização Principal no Canvas
// ==========================================

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (currentTab) {
    case 'circle':
      drawCircleScene();
      break;
    case 'polygons':
      drawPolygonScene();
      break;
    case 'rose':
      drawRoseScene();
      break;
    case 'lissajous':
      drawLissajousScene();
      break;
  }
}

// --- MODO 1: Círculo Trigonométrico & Projeções ---
function drawCircleScene() {
  const cx = 220;
  const cy = 300;
  const r = 150;
  const angRad = (state.circle.angle * Math.PI) / 180;

  // Eixos do Círculo
  ctx.strokeStyle = '#232f48';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - r - 40, cy); ctx.lineTo(cx + r + 40, cy);
  ctx.moveTo(cx, cy - r - 40); ctx.lineTo(cx, cy + r + 40);
  ctx.stroke();

  // Rótulos dos eixos
  ctx.fillStyle = '#64748b';
  ctx.font = '12px monospace';
  ctx.fillText('+X (Cosseno)', cx + r + 10, cy + 16);
  ctx.fillText('+Y (Seno)', cx - 65, cy - r - 15);

  // Círculo Trigonométrico
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Ponto na circunferência
  const px = cx + r * Math.cos(angRad);
  const py = cy - r * Math.sin(angRad);

  // Reta da Tangente (x = cx + r)
  ctx.strokeStyle = '#334155';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(cx + r, 40);
  ctx.lineTo(cx + r, canvas.height - 40);
  ctx.stroke();
  ctx.setLineDash([]);

  // Projeção Cosseno (Base Azul)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, cy);
  ctx.stroke();

  // Projeção Seno (Altura Verde)
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(px, cy);
  ctx.lineTo(px, py);
  ctx.stroke();

  // Hipotenusa (Raio)
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, py);
  ctx.stroke();

  // Ponto P
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();

  // Arco do Ângulo
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, -angRad, true);
  ctx.stroke();
  ctx.fillStyle = '#eab308';
  ctx.font = '12px monospace';
  ctx.fillText(`${Math.round(state.circle.angle)}°`, cx + 42 * Math.cos(angRad / 2), cy - 42 * Math.sin(angRad / 2));

  // --- Gráfico da Onda Senoidal e Cossenoide ao lado ---
  const waveStartX = 460;
  const waveWidth = 300;
  const waveEndX = waveStartX + waveWidth;

  // Eixo da onda
  ctx.strokeStyle = '#232f48';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(waveStartX, cy);
  ctx.lineTo(waveEndX, cy);
  ctx.stroke();

  // Linha guia conectando P(x, y) à onda senoidal
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(waveStartX, py);
  ctx.stroke();
  ctx.setLineDash([]);

  // Desenhar a curva Senoidal
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= waveWidth; x++) {
    const t = (x / waveWidth) * Math.PI * 2;
    const waveY = cy - r * Math.sin(angRad - t);
    if (x === 0) ctx.moveTo(waveStartX + x, waveY);
    else ctx.lineTo(waveStartX + x, waveY);
  }
  ctx.stroke();

  // Ponto atual na onda senoidal
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(waveStartX, py, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Onda Senoidal y = sin(θ - t)', waveStartX, cy - r - 15);
  ctx.fillText('0', waveStartX, cy + 15);
  ctx.fillText('2π', waveEndX - 15, cy + 15);
}

// --- MODO 2: Polígonos & Estrelas ---
function drawPolygonScene() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const R = 210;
  const r = R * state.polygons.innerRatio;
  const sides = state.polygons.sides;
  const rotRad = (state.polygons.rotation * Math.PI) / 180;
  const totalPoints = sides * 2;
  const points = [];

  for (let i = 0; i < totalPoints; i++) {
    const isOuter = i % 2 === 0;
    const radius = isOuter ? R : r;
    const angle = (i * Math.PI) / sides + rotRad - Math.PI / 2;

    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push({ x, y, isOuter, angle });
  }

  // Linhas-guia se habilitadas
  if (state.polygons.showGrid) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Círculos circunscrito e inscrito
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Raios
    points.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Polígono/Estrela
  const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  grad.addColorStop(0, '#ec4899');
  grad.addColorStop(1, '#8b5cf6');

  ctx.beginPath();
  points.forEach((p, idx) => {
    if (idx === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();

  ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Marcadores de vértice
  points.forEach(p => {
    ctx.fillStyle = p.isOuter ? '#38bdf8' : '#f43f5e';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- MODO 3: Rosas Polares ---
function drawRoseScene() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxR = 220;
  const { n, d } = state.rose;
  const k = n / d;

  // Grade polar
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  [0.33, 0.66, 1].forEach(frac => {
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * frac, 0, Math.PI * 2);
    ctx.stroke();
  });

  const steps = 1200;
  // Período completo depende se n*d é par ou ímpar
  const maxTheta = (n * d) % 2 === 0 ? 2 * Math.PI * d : Math.PI * d;

  const grad = ctx.createLinearGradient(cx - maxR, cy, cx + maxR, cy);
  grad.addColorStop(0, '#06b6d4');
  grad.addColorStop(0.5, '#3b82f6');
  grad.addColorStop(1, '#d946ef');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta;
    const r = maxR * Math.cos(k * theta);

    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// --- MODO 4: Curvas de Lissajous ---
function drawLissajousScene() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const A = 240;
  const B = 200;
  const { a, b, delta, t } = state.lissajous;

  // Caixa de limites
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - A, cy - B, 2 * A, 2 * B);

  // Eixos centrais
  ctx.beginPath();
  ctx.moveTo(cx - A, cy); ctx.lineTo(cx + A, cy);
  ctx.moveTo(cx, cy - B); ctx.lineTo(cx, cy + B);
  ctx.stroke();

  // Curva de Lissajous Completa
  const steps = 1000;
  const grad = ctx.createLinearGradient(cx - A, cy - B, cx + A, cy + B);
  grad.addColorStop(0, '#10b981');
  grad.addColorStop(0.5, '#06b6d4');
  grad.addColorStop(1, '#f59e0b');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {
    const curT = (i / steps) * 2 * Math.PI;
    const x = cx + A * Math.sin(a * curT + delta);
    const y = cy + B * Math.sin(b * curT);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Ponto oscilante se a animação estiver ativa
  if (state.lissajous.animating) {
    const currentX = cx + A * Math.sin(a * t + delta);
    const currentY = cy + B * Math.sin(b * t);

    // Linhas de projeção do ponto até os eixos
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(currentX, cy - B); ctx.lineTo(currentX, cy + B);
    ctx.moveTo(cx - A, currentY); ctx.lineTo(cx + A, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ponto rastreador com brilho
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }
}

// ==========================================
// 4. Exportação Dinâmica em SVG no Navegador
// ==========================================

function setupSvgExport() {
  btnDownloadSvg.addEventListener('click', () => {
    let svgContent = '';
    const w = 800;
    const h = 600;
    const filename = `${currentTab}_geometrico.svg`;

    if (currentTab === 'circle') {
      const cx = 300, cy = 300, r = 180;
      const rad = (state.circle.angle * Math.PI) / 180;
      const px = cx + r * Math.cos(rad);
      const py = cy - r * Math.sin(rad);

      svgContent = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:sans-serif;">
  <line x1="50" y1="${cy}" x2="550" y2="${cy}" stroke="#232f48" stroke-width="1.5" />
  <line x1="${cx}" y1="50" x2="${cx}" y2="550" stroke="#232f48" stroke-width="1.5" />
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#475569" stroke-width="2" />
  <line x1="${cx}" y1="${cy}" x2="${px}" y2="${cy}" stroke="#38bdf8" stroke-width="4" />
  <line x1="${px}" y1="${cy}" x2="${px}" y2="${py}" stroke="#34d399" stroke-width="4" />
  <line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="#f8fafc" stroke-width="2" />
  <circle cx="${px}" cy="${py}" r="6" fill="#f43f5e" />
  <text x="30" y="40" fill="#f8fafc" font-size="16" font-weight="bold">Círculo Trigonométrico (θ = ${state.circle.angle}°)</text>
  <text x="30" y="70" fill="#38bdf8" font-size="14">Cosseno = ${Math.cos(rad).toFixed(3)}</text>
  <text x="30" y="95" fill="#34d399" font-size="14">Seno = ${Math.sin(rad).toFixed(3)}</text>
</svg>`;
    } else if (currentTab === 'polygons') {
      const cx = 400, cy = 300, R = 200, r = R * state.polygons.innerRatio;
      const sides = state.polygons.sides;
      const rot = (state.polygons.rotation * Math.PI) / 180;
      const points = [];
      for (let i = 0; i < sides * 2; i++) {
        const radius = i % 2 === 0 ? R : r;
        const ang = (i * Math.PI) / sides + rot - Math.PI / 2;
        points.push(`${(cx + radius * Math.cos(ang)).toFixed(1)},${(cy + radius * Math.sin(ang)).toFixed(1)}`);
      }
      svgContent = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">
  <polygon points="${points.join(' ')}" fill="#8b5cf6" fill-opacity="0.3" stroke="#ec4899" stroke-width="3" />
</svg>`;
    } else if (currentTab === 'rose') {
      const cx = 400, cy = 300, maxR = 220;
      const { n, d } = state.rose;
      const k = n / d;
      const maxTheta = (n * d) % 2 === 0 ? 2 * Math.PI * d : Math.PI * d;
      const pts = [];
      for (let i = 0; i <= 1000; i++) {
        const theta = (i / 1000) * maxTheta;
        const r = maxR * Math.cos(k * theta);
        pts.push(`${(cx + r * Math.cos(theta)).toFixed(1)},${(cy + r * Math.sin(theta)).toFixed(1)}`);
      }
      svgContent = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">
  <polyline points="${pts.join(' ')}" fill="none" stroke="#38bdf8" stroke-width="2.5" />
</svg>`;
    } else if (currentTab === 'lissajous') {
      const cx = 400, cy = 300, A = 240, B = 200;
      const { a, b, delta } = state.lissajous;
      const pts = [];
      for (let i = 0; i <= 1000; i++) {
        const t = (i / 1000) * 2 * Math.PI;
        const x = cx + A * Math.sin(a * t + delta);
        const y = cy + B * Math.sin(b * t);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      svgContent = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">
  <polyline points="${pts.join(' ')}" fill="none" stroke="#10b981" stroke-width="2.5" />
</svg>`;
    }

    // Criar download no navegador
    const blob = new Blob([svgContent.trim()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Inicializa a aplicação
init();

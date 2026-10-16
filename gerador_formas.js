/**
 * gerador_formas.js
 * 
 * Script Node.js para demonstrar a geração de formas geométricas vetoriais (SVG)
 * a partir de relações trigonométricas fundamentais:
 * 
 * 1. Círculo Trigonométrico (Seno, Cosseno e Tangente)
 * 2. Polígonos Regulares e Estrelas (Coordenadas Polares -> Cartesianas)
 * 3. Rosas Polares de Rhodonea (r = a * cos(k * θ))
 * 4. Curvas de Lissajous (Sistemas Harmônicos x(t) e y(t))
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output_svg');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * 1. Círculo Trigonométrico Interativo com Seno, Cosseno e Tangente
 */
function gerarCirculoTrigonometrico(anguloGraus = 45) {
  const width = 600;
  const height = 600;
  const cx = 300;
  const cy = 300;
  const raio = 180;

  const anguloRad = (anguloGraus * Math.PI) / 180;
  
  // Em coordenadas de tela, o eixo Y aponta para baixo, portanto subtraímos sin(θ)
  const px = cx + raio * Math.cos(anguloRad);
  const py = cy - raio * Math.sin(anguloRad);

  const cosVal = Math.cos(anguloRad);
  const sinVal = Math.sin(anguloRad);
  const tanVal = Math.tan(anguloRad);

  // Ponto da reta tangente na reta x = 1 (ou seja, cx + raio)
  const tanY = cy - raio * tanVal;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; font-family:sans-serif;">
  <defs>
    <!-- Marcadores de seta -->
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
    </marker>
  </defs>

  <!-- Grade de fundo sutil -->
  <line x1="0" y1="${cy}" x2="${width}" y2="${cy}" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="${cx}" y1="${height}" x2="${cx}" y2="0" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Rótulos dos eixos -->
  <text x="${width - 25}" y="${cy - 10}" fill="#94a3b8" font-size="14">X</text>
  <text x="${cx + 10}" y="25" fill="#94a3b8" font-size="14">Y</text>

  <!-- Círculo Unitário -->
  <circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="4 4" />

  <!-- Linha da Tangente (x = raio) -->
  <line x1="${cx + raio}" y1="30" x2="${cx + raio}" y2="${height - 30}" stroke="#475569" stroke-width="1" stroke-dasharray="2 2"/>

  <!-- Segmento Cosseno (Azul Claro) -->
  <line x1="${cx}" y1="${cy}" x2="${px}" y2="${cy}" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Segmento Seno (Verde Esmeralda) -->
  <line x1="${px}" y1="${cy}" x2="${px}" y2="${py}" stroke="#34d399" stroke-width="4" stroke-linecap="round"/>

  <!-- Raio / Hipotenusa (Branco / Ângulo) -->
  <line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="#f8fafc" stroke-width="2.5" />

  <!-- Segmento Tangente (Laranja) se estiver dentro de limites visíveis -->
  ${Math.abs(tanVal) < 2.5 ? `
    <line x1="${cx}" y1="${cy}" x2="${cx + raio}" y2="${tanY}" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="4 2"/>
    <line x1="${cx + raio}" y1="${cy}" x2="${cx + raio}" y2="${tanY}" stroke="#fb923c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx + raio}" cy="${tanY}" r="4" fill="#fb923c" />
    <text x="${cx + raio + 10}" y="${(cy + tanY) / 2}" fill="#fb923c" font-size="13" font-weight="bold">tan(θ) = ${tanVal.toFixed(2)}</text>
  ` : ''}

  <!-- Ponto P(cos θ, sin θ) -->
  <circle cx="${px}" cy="${py}" r="6" fill="#f43f5e" />

  <!-- Arco do Ângulo θ -->
  <path d="M ${cx + 40} ${cy} A 40 40 0 0 0 ${cx + 40 * Math.cos(anguloRad)} ${cy - 40 * Math.sin(anguloRad)}" fill="none" stroke="#eab308" stroke-width="2.5" />
  <text x="${cx + 50}" y="${cy - 15}" fill="#eab308" font-size="14" font-weight="bold">θ = ${anguloGraus}°</text>

  <!-- Legendas e Valores -->
  <rect x="20" y="20" width="220" height="130" rx="8" fill="#1e293b" opacity="0.9" />
  <text x="35" y="45" fill="#f8fafc" font-size="14" font-weight="bold">Relações Trigonométricas</text>
  <text x="35" y="70" fill="#38bdf8" font-size="13">• cos(θ) = ${cosVal.toFixed(3)} (base x)</text>
  <text x="35" y="95" fill="#34d399" font-size="13">• sin(θ) = ${sinVal.toFixed(3)} (altura y)</text>
  <text x="35" y="120" fill="#fb923c" font-size="13">• tan(θ) = ${tanVal.toFixed(3)} (sin / cos)</text>
  <text x="35" y="140" fill="#94a3b8" font-size="11">cos²(θ) + sin²(θ) = 1.000</text>
</svg>`;

  const filePath = path.join(OUTPUT_DIR, 'circulo_trigonometrico.svg');
  fs.writeFileSync(filePath, svg.trim());
  console.log(`[✓] Gerado: ${filePath} (Ângulo: ${anguloGraus}°)`);
}

/**
 * 2. Polígonos Regulares e Estrelas Polares
 */
function gerarEstrelaEPoligono(pontas = 5, raioExterno = 180, raioInterno = 80) {
  const width = 500;
  const height = 500;
  const cx = 250;
  const cy = 250;

  const vertices = pontas * 2;
  const pontos = [];

  for (let i = 0; i < vertices; i++) {
    // Alterna raio interno e raio externo para formar a estrela
    const r = i % 2 === 0 ? raioExterno : raioInterno;
    // - Math.PI / 2 faz o polígono começar apontado para cima
    const angulo = (i * 2 * Math.PI) / vertices - Math.PI / 2;

    const x = cx + r * Math.cos(angulo);
    const y = cy + r * Math.sin(angulo);
    pontos.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:sans-serif;">
  <defs>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>

  <!-- Círculos de referência trigonométrica (Raio Externo e Interno) -->
  <circle cx="${cx}" cy="${cy}" r="${raioExterno}" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="${cx}" cy="${cy}" r="${raioInterno}" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Linhas radiais até os vértices -->
  ${pontos.map(pt => `<line x1="${cx}" y1="${cy}" x2="${pt.split(',')[0]}" y2="${pt.split(',')[1]}" stroke="#1e293b" stroke-width="1" />`).join('\n  ')}

  <!-- Estrela Gerada -->
  <polygon points="${pontos.join(' ')}" fill="url(#starGrad)" fill-opacity="0.25" stroke="url(#starGrad)" stroke-width="3" stroke-linejoin="round"/>

  <!-- Vértices -->
  ${pontos.map(pt => `<circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="4" fill="#38bdf8"/>`).join('\n  ')}

  <!-- Título -->
  <text x="20" y="35" fill="#f8fafc" font-size="15" font-weight="bold">Estrela Regular (${pontas} pontas)</text>
  <text x="20" y="55" fill="#94a3b8" font-size="12">x = cx + r · cos(θ), y = cy + r · sin(θ)</text>
</svg>`;

  const filePath = path.join(OUTPUT_DIR, 'poligono_estrela.svg');
  fs.writeFileSync(filePath, svg.trim());
  console.log(`[✓] Gerado: ${filePath} (${pontas} pontas)`);
}

/**
 * 3. Rosa Polar de Rhodonea (r = a * cos(k * θ))
 */
function gerarRosaPolar(k = 4, raioMax = 180) {
  const width = 500;
  const height = 500;
  const cx = 250;
  const cy = 250;

  // Passos de discretização para suavidade
  const passos = 800;
  const voltasMax = Number.isInteger(k) ? (k % 2 === 1 ? Math.PI : 2 * Math.PI) : 4 * Math.PI;
  const pontos = [];

  for (let i = 0; i <= passos; i++) {
    const theta = (i / passos) * voltasMax;
    // Relação da rosa polar: r varia com o cosseno do múltiplo do ângulo
    const r = raioMax * Math.cos(k * theta);

    // Transformação polar -> cartesiano
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pontos.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#020617; font-family:sans-serif;">
  <defs>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#d946ef" />
    </linearGradient>
  </defs>

  <!-- Curva Polar da Rosa -->
  <polyline points="${pontos.join(' ')}" fill="none" stroke="url(#roseGrad)" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Título e Fórmula -->
  <text x="20" y="35" fill="#f8fafc" font-size="15" font-weight="bold">Rosa Polar de Rhodonea</text>
  <text x="20" y="55" fill="#38bdf8" font-size="13">Equação: r(θ) = R · cos(${k}θ)</text>
  <text x="20" y="75" fill="#94a3b8" font-size="12">Pétalas: ${k % 2 === 0 ? 2 * k : k}</text>
</svg>`;

  const filePath = path.join(OUTPUT_DIR, 'rosa_polar.svg');
  fs.writeFileSync(filePath, svg.trim());
  console.log(`[✓] Gerado: ${filePath} (k = ${k})`);
}

/**
 * 4. Curva de Lissajous (Superposição de dois movimentos harmônicos simples)
 * x(t) = A * sin(a * t + δ)
 * y(t) = B * sin(b * t)
 */
function gerarCurvaLissajous(a = 3, b = 4, delta = Math.PI / 4) {
  const width = 500;
  const height = 500;
  const cx = 250;
  const cy = 250;
  const A = 180;
  const B = 180;

  const passos = 1000;
  const tMax = 2 * Math.PI;
  const pontos = [];

  for (let i = 0; i <= passos; i++) {
    const t = (i / passos) * tMax;
    // Relações harmônicas senoidais
    const x = cx + A * Math.sin(a * t + delta);
    const y = cy + B * Math.sin(b * t);
    pontos.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:sans-serif;">
  <defs>
    <linearGradient id="lissajousGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <!-- Caixa delimitadora -->
  <rect x="${cx - A}" y="${cy - B}" width="${2 * A}" height="${2 * B}" fill="none" stroke="#1e293b" stroke-dasharray="3 3"/>

  <!-- Curva Harmônica de Lissajous -->
  <polyline points="${pontos.join(' ')}" fill="none" stroke="url(#lissajousGrad)" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Título e Parâmetros -->
  <text x="20" y="35" fill="#f8fafc" font-size="15" font-weight="bold">Curva de Lissajous</text>
  <text x="20" y="55" fill="#10b981" font-size="13">x(t) = A · sin(${a}t + ${(delta / Math.PI).toFixed(2)}π)</text>
  <text x="20" y="75" fill="#06b6d4" font-size="13">y(t) = B · sin(${b}t)</text>
</svg>`;

  const filePath = path.join(OUTPUT_DIR, 'lissajous.svg');
  fs.writeFileSync(filePath, svg.trim());
  console.log(`[✓] Gerado: ${filePath} (Razão a:b = ${a}:${b})`);
}

// Execução de exemplo de todas as formas
console.log('--- Iniciando Geração de Formas Trigonométricas em SVG ---');
gerarCirculoTrigonometrico(50);
gerarEstrelaEPoligono(6, 170, 70);
gerarRosaPolar(5, 180);
gerarCurvaLissajous(3, 4, Math.PI / 4);
console.log('--- Concluído! Arquivos disponíveis na pasta output_svg/ ---');

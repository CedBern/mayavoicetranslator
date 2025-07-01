// Génère un graphique SVG d’historique du taux de succès à partir des rapports Markdown
const fs = require('fs');
const path = require('path');

function extractSuccessRate(md) {
  const match = md.match(/\*?\*?Taux de succès\*?\*?\s*:\s*(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
}

function main() {
  const files = fs.readdirSync('.')
    .filter(f => f.startsWith('diagnostic_summary_') && f.endsWith('.md'))
    .sort();
  const data = files.map(f => {
    const content = fs.readFileSync(f, 'utf8');
    const rate = extractSuccessRate(content);
    const date = f.match(/diagnostic_summary_(\d{8}_\d{6})/)[1];
    return { date, rate };
  }).filter(d => d.rate !== null);

  // SVG simple (400x100)
  const w = 400, h = 100, margin = 30;
  const max = 100, min = 0;
  const points = data.map((d, i) => {
    const x = margin + i * ((w - 2 * margin) / (data.length - 1 || 1));
    const y = h - margin - ((d.rate - min) / (max - min)) * (h - 2 * margin);
    return `${x},${y}`;
  }).join(' ');
  const svg = `<?xml version="1.0"?><svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#fff"/>
  <polyline fill="none" stroke="#4c1" stroke-width="2" points="${points}"/>
  <g font-size="10" font-family="Verdana">
    <text x="5" y="15">Taux de succès (%)</text>
    <text x="${w-60}" y="${h-5}">${data[data.length-1]?.date || ''}</text>
    <text x="5" y="${h-5}">${data[0]?.date || ''}</text>
    <text x="5" y="${margin}">100</text>
    <text x="5" y="${h-margin}">0</text>
  </g>
</svg>`;
  fs.writeFileSync('success_history.svg', svg);
  console.log('Graphique historique généré : success_history.svg');
}

if (require.main === module) main();

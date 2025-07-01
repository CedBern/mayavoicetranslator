// Génère un badge SVG dynamique pour la supervision
const fs = require('fs');
const path = require('path');

function getStatusColor(successRate) {
  if (successRate >= 99) return '#4c1'; // vert
  if (successRate >= 80) return '#dfb317'; // orange
  return '#e05d44'; // rouge
}

function generateBadge(successRate) {
  const color = getStatusColor(successRate);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-opacity=".7"/></linearGradient><mask id="a"><rect width="180" height="20" rx="3" fill="#fff"/></mask><g mask="url(#a)"><rect width="120" height="20" fill="#555"/><rect x="120" width="60" height="20" fill="${color}"/><rect width="180" height="20" fill="url(#b)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11"><text x="60" y="15" fill="#010101" fill-opacity=".3">Supervision</text><text x="60" y="14">Supervision</text><text x="150" y="15" fill="#010101" fill-opacity=".3">${successRate}%</text><text x="150" y="14">${successRate}%</text></g></svg>`;
}

function main() {
  // Lecture du dernier rapport de synthèse
  const files = fs.readdirSync('.').filter(f => f.startsWith('diagnostic_summary_') && f.endsWith('.md'));
  if (!files.length) throw new Error('Aucun rapport de synthèse trouvé');
  files.sort();
  const last = files[files.length - 1];
  const content = fs.readFileSync(last, 'utf8');
  const match = content.match(/Taux de succès\s*:\s*(\d+(?:\.\d+)?)\s*%/);
  if (!match) throw new Error('Taux de succès introuvable');
  const rate = parseFloat(match[1]);
  const svg = generateBadge(rate);
  fs.writeFileSync('supervision_badge.svg', svg);
  console.log('Badge supervision généré : supervision_badge.svg');
}

if (require.main === module) main();

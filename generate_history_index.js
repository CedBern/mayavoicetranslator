// Génère un index HTML des archives de rapports dans docs/history/
const fs = require('fs');
const path = require('path');

const histRoot = path.join(__dirname, 'docs', 'history');
if (!fs.existsSync(histRoot)) {
  console.log('Aucune archive trouvée.');
  process.exit(0);
}
const dirs = fs.readdirSync(histRoot).filter(d => fs.statSync(path.join(histRoot, d)).isDirectory()).sort().reverse();
let html = `<!DOCTYPE html><html lang='fr'><head><meta charset='utf-8'><title>Archives Rapports – MayaVoiceTranslator</title><style>body{font-family:sans-serif;margin:2em;}table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}</style></head><body><h1>Archives des rapports de sprint</h1><table><tr><th>Date</th><th>Dashboard</th><th>Rapport HTML</th><th>Rapport PDF</th><th>Markdown</th><th>JSON</th></tr>`;
dirs.forEach(dir => {
  html += `<tr><td>${dir}</td>`;
  ['dashboard.html','rapport_sprint.html','dashboard.pdf','rapport_sprint.md','rapport_sprint.json'].forEach(f => {
    const p = path.join(dir, f);
    html += `<td>${fs.existsSync(path.join(histRoot, p)) ? `<a href='${p}'>${f}</a>` : '-'}</td>`;
  });
  html += '</tr>';
});
html += '</table>';

let chartHtml = '';
try {
  const chartPath = path.join(histRoot, 'history_charts.html');
  if (fs.existsSync(chartPath)) chartHtml = fs.readFileSync(chartPath, 'utf8');
} catch {}
html += chartHtml;

html += '</body></html>';
fs.writeFileSync(path.join(histRoot, 'index.html'), html, 'utf8');
console.log('Index des archives généré :', path.join(histRoot, 'index.html'));

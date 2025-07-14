// Script Node.js pour générer un rapport HTML interactif à partir du sprint planning
// Usage : node generate_report_html.js sprint_planning.csv rapport_sprint.html

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputHtml] = process.argv;
if (!inputCsv || !outputHtml) {
  console.error('Usage: node generate_report_html.js sprint_planning.csv rapport_sprint.html');
  process.exit(1);
}

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (cols[i] || '').trim());
    return obj;
  });
}

const csv = fs.readFileSync(path.resolve(inputCsv), 'utf8');
const sprints = parseCsv(csv);
const stats = { total: 0, done: 0, todo: 0, blocked: 0 };
sprints.forEach(s => {
  stats.total++;
  const statut = (s['Statut'] || '').toLowerCase();
  if (statut.includes('fait') || statut.includes('done')) stats.done++;
  else if (statut.includes('bloqué') || statut.includes('blocked')) stats.blocked++;
  else stats.todo++;
});

const html = `<!DOCTYPE html>
<html lang='fr'>
<head>
  <meta charset='utf-8'>
  <title>Rapport Sprint – MayaVoiceTranslator</title>
  <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
  <style>body{font-family:sans-serif;margin:2em;}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}tr.done{background:#e0ffe0}tr.todo{background:#fffbe0}tr.blocked{background:#ffe0e0}</style>
</head>
<body>
  <h1>Rapport Sprint – MayaVoiceTranslator</h1>
  <h2>Statistiques d’avancement</h2>
  <canvas id='chart' width='320' height='160'></canvas>
  <ul>
    <li>Total : <b>${stats.total}</b></li>
    <li>Fait : <b>${stats.done}</b></li>
    <li>À faire : <b>${stats.todo}</b></li>
    <li>Bloqué : <b>${stats.blocked}</b></li>
  </ul>
  <h2>Tâches</h2>
  <table><tr><th>Sprint</th><th>Dates</th><th>Objectif principal</th><th>Tâches / Issues clés</th><th>Dépendances/Blocages</th><th>Statut</th></tr>
  ${sprints.map(s => `<tr class='${(s['Statut']||'').toLowerCase().includes('fait')?'done':(s['Statut']||'').toLowerCase().includes('bloqué')?'blocked':'todo'}'><td>${s['Sprint']}</td><td>${s['Dates']}</td><td>${s['Objectif principal']}</td><td>${s['Tâches / Issues clés'].split(' | ').join('<br>')}</td><td>${s['Dépendances/Blocages']||''}</td><td>${s['Statut']}</td></tr>`).join('')}
  </table>
  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Fait', 'À faire', 'Bloqué'],
        datasets: [{
          data: [${stats.done}, ${stats.todo}, ${stats.blocked}],
          backgroundColor: ['#4caf50','#ffeb3b','#f44336']
        }]
      },
      options: {responsive:false,plugins:{legend:{position:'bottom'}}}
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve(outputHtml), html, 'utf8');
try {
  if (fs.existsSync('docs')) {
    fs.writeFileSync(path.join('docs', path.basename(outputHtml)), html, 'utf8');
    console.log('Rapport HTML exporté dans docs/ :', path.join('docs', path.basename(outputHtml)));
  }
} catch {}
console.log('Rapport HTML généré :', outputHtml);

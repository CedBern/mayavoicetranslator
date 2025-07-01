// Génère des graphiques d’évolution à partir de l’historique des rapports (docs/history/)
const fs = require('fs');
const path = require('path');

const histRoot = path.join(__dirname, 'docs', 'history');
if (!fs.existsSync(histRoot)) {
  console.log('Aucune archive trouvée.');
  process.exit(0);
}
const dirs = fs.readdirSync(histRoot).filter(d => fs.statSync(path.join(histRoot, d)).isDirectory()).sort();
const data = [];
dirs.forEach(dir => {
  const jsonPath = path.join(histRoot, dir, 'rapport_sprint.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      data.push({
        date: dir,
        done: report.stats ? report.stats.done : 0,
        todo: report.stats ? report.stats.todo : 0,
        blocked: report.stats ? report.stats.blocked : 0,
        total: report.stats ? report.stats.total : 0
      });
    } catch {}
  }
});
// Génération du code Chart.js à intégrer dans l’index
const chartJs = `
<canvas id='historyChart' width='600' height='300'></canvas>
<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
<script>
const ctx = document.getElementById('historyChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ${JSON.stringify(data.map(d=>d.date))},
    datasets: [
      { label: 'Fait', data: ${JSON.stringify(data.map(d=>d.done))}, borderColor: '#4caf50', fill: false },
      { label: 'À faire', data: ${JSON.stringify(data.map(d=>d.todo))}, borderColor: '#ffeb3b', fill: false },
      { label: 'Bloqué', data: ${JSON.stringify(data.map(d=>d.blocked))}, borderColor: '#f44336', fill: false }
    ]
  },
  options: { responsive: false, plugins: { legend: { position: 'bottom' } } }
});
</script>
`;
fs.writeFileSync(path.join(histRoot, 'history_charts.html'), chartJs, 'utf8');
console.log('Graphique d’évolution généré :', path.join(histRoot, 'history_charts.html'));

// scripts/aggregate-logs.js
// Script d'agrégation des logs et feedbacks pour audit et reporting
// Usage : node scripts/aggregate-logs.js [logs.json]

const fs = require('fs');
const path = process.argv[2] || 'logs.json';

if (!fs.existsSync(path)) {
  console.error('Fichier de logs introuvable :', path);
  process.exit(1);
}

const logs = fs.readFileSync(path, 'utf-8').split('\n').filter(Boolean).map(line => {
  try { return JSON.parse(line); } catch { return null; }
}).filter(Boolean);

const feedbacks = logs.filter(l => l.type === 'feedback');
const byPlugin = feedbacks.reduce((acc, f) => {
  acc[f.plugin] = (acc[f.plugin] || 0) + 1;
  return acc;
}, {});

console.log('Feedbacks par plugin :', byPlugin);
console.log('Nombre total de feedbacks :', feedbacks.length);

// Export CSV (optionnel)
const csv = feedbacks.map(f => `${f.timestamp},${f.plugin},${JSON.stringify(f.data).replace(/,/g,';')},${f.userId||''}`).join('\n');
fs.writeFileSync('feedbacks.csv', 'timestamp,plugin,data,userId\n' + csv);
console.log('Export CSV : feedbacks.csv');

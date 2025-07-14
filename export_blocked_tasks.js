// Script Node.js pour exporter les tâches bloquées ou à valider dans un CSV dédié
// Usage : node export_blocked_tasks.js sprint_planning.csv tasks_blocked.csv

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputCsv] = process.argv;
if (!inputCsv || !outputCsv) {
  console.error('Usage: node export_blocked_tasks.js sprint_planning.csv tasks_blocked.csv');
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
const tasks = parseCsv(csv);
const blocked = tasks.filter(t => (t['Dépendances/Blocages']||'').length || (t['Statut']||'').toLowerCase().includes('valider'));
const headers = Object.keys(tasks[0]||{});
const lines = [headers.join(',')].concat(blocked.map(t => headers.map(h => t[h]).join(',')));
fs.writeFileSync(path.resolve(outputCsv), lines.join('\n'), 'utf8');
console.log('Export tâches bloquées :', outputCsv);

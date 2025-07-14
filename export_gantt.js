// Script Node.js pour exporter le planning de sprint au format GanttProject CSV
// Usage : node export_gantt.js sprint_planning.csv gantt_tasks.csv
// Le format CSV généré est compatible avec GanttProject, Notion Timeline, Google Sheets Gantt, etc.

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputCsv] = process.argv;
if (!inputCsv || !outputCsv) {
  console.error('Usage: node export_gantt.js sprint_planning.csv gantt_tasks.csv');
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

function toGanttCsv(tasks) {
  // En-têtes GanttProject/Notion/Google Sheets : Task,Start,End,Dependencies,Status,Comment
  const headers = ['Task','Start','End','Dependencies','Status','Comment'];
  const lines = [headers.join(',')];
  tasks.forEach((t, i) => {
    lines.push([
      t['Objectif principal'] || t['Sprint'],
      (t['Dates']||'').split(' au ')[0],
      (t['Dates']||'').split(' au ')[1],
      '', // Dépendances manuelles à compléter si besoin
      t['Statut'],
      (t['Commentaire/Blocage']||'') + (t['Dépendances/Blocages'] ? ' | ' + t['Dépendances/Blocages'] : '')
    ].map(x => '"'+(x||'').replace(/"/g,'')+'"').join(','));
  });
  return lines.join('\n');
}

const csv = fs.readFileSync(path.resolve(inputCsv), 'utf8');
const tasks = parseCsv(csv);
const ganttCsv = toGanttCsv(tasks);
fs.writeFileSync(path.resolve(outputCsv), ganttCsv, 'utf8');
console.log('Export Gantt terminé :', outputCsv);

// Script Node.js pour exporter le planning de sprint en JSON (pour intégration API externe)
// Usage : node export_planning_json.js sprint_planning.csv sprint_planning.json

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputJson] = process.argv;
if (!inputCsv || !outputJson) {
  console.error('Usage: node export_planning_json.js sprint_planning.csv sprint_planning.json');
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
fs.writeFileSync(path.resolve(outputJson), JSON.stringify(sprints, null, 2), 'utf8');
console.log('Export JSON généré :', outputJson);

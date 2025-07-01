// Script Node.js pour générer un changelog automatique à partir des issues/PR fermées depuis le dernier sprint
// Usage : node generate_changelog.js github_feedback.csv changelog_auto.md

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputMd] = process.argv;
if (!inputCsv || !outputMd) {
  console.error('Usage: node generate_changelog.js github_feedback.csv changelog_auto.md');
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
const items = parseCsv(csv);
const closed = items.filter(i => i['Statut'] && i['Statut'].toLowerCase().includes('fermé'));
let md = '# Changelog automatique\n\n';
closed.forEach(i => {
  md += `- [${i['Type']}] ${i['Titre/Description courte']} (${i['Détail/URL/Discussion']})\n`;
});
fs.writeFileSync(path.resolve(outputMd), md, 'utf8');
console.log('Changelog généré :', outputMd);

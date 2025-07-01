// Script Node.js pour générer un rapport Markdown synthétique à partir du sprint planning
// Usage : node generate_report.js sprint_planning.csv rapport_sprint.md

const fs = require('fs');
const path = require('path');

const [,, inputCsv, outputMd] = process.argv;
if (!inputCsv || !outputMd) {
  console.error('Usage: node generate_report.js sprint_planning.csv rapport_sprint.md');
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

function computeStats(sprints) {
  const stats = { total: 0, done: 0, todo: 0, blocked: 0 };
  sprints.forEach(s => {
    stats.total++;
    const statut = (s['Statut'] || '').toLowerCase();
    if (statut.includes('fait') || statut.includes('done')) stats.done++;
    else if (statut.includes('bloqué') || statut.includes('blocked')) stats.blocked++;
    else stats.todo++;
  });
  return stats;
}

function generateSVG(stats) {
  // Simple camembert SVG (done/todo/blocked)
  const total = stats.total || 1;
  const done = Math.round((stats.done / total) * 100);
  const todo = Math.round((stats.todo / total) * 100);
  const blocked = 100 - done - todo;
  // Angles
  const doneAngle = (done / 100) * 360;
  const todoAngle = (todo / 100) * 360;
  // SVG paths (simplifié)
  return `<svg width='120' height='120' viewBox='0 0 32 32'><circle r='16' cx='16' cy='16' fill='#eee'/><path d='M16 16 L16 0 A16 16 0 ${done>50?1:0} 1 ${16+16*Math.sin(doneAngle*Math.PI/180)} ${16-16*Math.cos(doneAngle*Math.PI/180)} Z' fill='#4caf50'/><path d='M16 16 L${16+16*Math.sin(doneAngle*Math.PI/180)} ${16-16*Math.cos(doneAngle*Math.PI/180)} A16 16 0 ${todo>50?1:0} 1 ${16+16*Math.sin((doneAngle+todoAngle)*Math.PI/180)} ${16-16*Math.cos((doneAngle+todoAngle)*Math.PI/180)} Z' fill='#ffeb3b'/><path d='M16 16 L${16+16*Math.sin((doneAngle+todoAngle)*Math.PI/180)} ${16-16*Math.cos((doneAngle+todoAngle)*Math.PI/180)} A16 16 0 ${blocked>50?1:0} 1 16 0 Z' fill='#f44336'/></svg>`;
}

function toMarkdown(sprints) {
  let md = '# Rapport Sprint – MayaVoiceTranslator\n\n';
  const stats = computeStats(sprints);
  md += `**Statistiques d’avancement** :\n- Total : ${stats.total}\n- Fait : ${stats.done}\n- À faire : ${stats.todo}\n- Bloqué : ${stats.blocked}\n`;
  md += '\n<img src="data:image/svg+xml;utf8,' + encodeURIComponent(generateSVG(stats)) + '" width="120" height="120" alt="Avancement" />\n';
  // Section alertes
  const blocked = sprints.filter(s => (s['Statut']||'').toLowerCase().includes('bloqué'));
  if (blocked.length) {
    md += '\n## 🚨 Tâches bloquées\n';
    blocked.forEach(s => {
      md += `- ${s['Tâches / Issues clés']} (${s['Sprint']})\n`;
    });
  }
  sprints.forEach(s => {
    md += `\n## ${s['Sprint']} (${s['Dates']})\n`;
    md += `**Objectif principal** : ${s['Objectif principal']}\n\n`;
    md += `**Tâches / Issues clés** :\n- ` + s['Tâches / Issues clés'].split(' | ').join('\n- ') + '\n';
    if (s['Dépendances/Blocages']) {
      md += `\n**Dépendances/Blocages** : ${s['Dépendances/Blocages']}\n`;
    }
    md += `**Statut** : ${s['Statut']}\n\n---\n`;
  });
  return md;
}

const csv = fs.readFileSync(path.resolve(inputCsv), 'utf8');
const sprints = parseCsv(csv);
const md = toMarkdown(sprints);
fs.writeFileSync(path.resolve(outputMd), md, 'utf8');
// Export automatique dans docs/ si possible
try {
  if (fs.existsSync('docs')) {
    fs.writeFileSync(path.join('docs', path.basename(outputMd)), md, 'utf8');
    console.log('Rapport Markdown exporté dans docs/ :', path.join('docs', path.basename(outputMd)));
  }
} catch {}
// Export JSON du rapport pour interopérabilité
const jsonReport = { sprints, stats: computeStats(sprints) };
const jsonPath = path.resolve(outputMd).replace(/\.md$/, '.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2), 'utf8');
try {
  if (fs.existsSync('docs')) {
    fs.writeFileSync(path.join('docs', path.basename(jsonPath)), JSON.stringify(jsonReport, null, 2), 'utf8');
    console.log('Rapport JSON exporté dans docs/ :', path.join('docs', path.basename(jsonPath)));
  }
} catch {}
console.log('Rapport Markdown généré :', outputMd);

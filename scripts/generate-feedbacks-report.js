// Script Node.js pour générer un rapport Markdown des feedbacks par plugin
const fs = require('fs');
const logs = fs.readFileSync('logs.json', 'utf-8').split('\n').filter(Boolean).map(JSON.parse);
const feedbacks = logs.filter(l => l.type === 'feedback');
const byPlugin = feedbacks.reduce((acc, f) => {
  acc[f.plugin] = (acc[f.plugin] || 0) + 1;
  return acc;
}, {});

let md = '# Rapport Feedbacks par plugin\n\n| Plugin | Nombre de feedbacks |\n|---|---:|\n';
for (const [plugin, count] of Object.entries(byPlugin)) {
  md += `| ${plugin} | ${count} |\n`;
}
md += `\n_Total feedbacks_: ${feedbacks.length}\n`;

fs.writeFileSync('feedbacks_report.md', md);
console.log('Feedbacks report generated: feedbacks_report.md');

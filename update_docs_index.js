// Met à jour automatiquement l’index des scripts et automatisations dans le README
const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !f.startsWith('.')); // scripts JS principaux
const autoSection = '\n## 🔄 Scripts et automatisations disponibles (auto-généré)\n\n' + files.map(f=>`- \`${f}\``).join('\n') + '\n';

let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(/## 🔄 Scripts et automatisations disponibles \(auto-généré\)[\s\S]*?(?=^#|\Z)/m, '') + autoSection;
fs.writeFileSync(readmePath, readme, 'utf8');
console.log('Index des scripts/automatisations mis à jour dans le README.');

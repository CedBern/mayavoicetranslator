// Génère un badge SVG dynamique selon le statut du workflow (succès/échec)
const fs = require('fs');
const statusFile = 'docs/workflow_status.json';
const badgeFile = 'docs/workflow_status_badge.svg';
let status = 'unknown', color = 'lightgrey';
try {
  if (fs.existsSync(statusFile)) {
    const s = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    if (s.status === 'success') { status = 'success'; color = 'green'; }
    else if (s.status === 'error') { status = 'error'; color = 'red'; }
  }
} catch {}
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='20'><rect rx='3' width='120' height='20' fill='#555'/><rect rx='3' x='60' width='60' height='20' fill='${color}'/><text x='30' y='14' fill='#fff' font-family='Verdana' font-size='12'>workflow</text><text x='90' y='14' fill='#fff' font-family='Verdana' font-size='12'>${status}</text></svg>`;
fs.writeFileSync(badgeFile, svg, 'utf8');
console.log('Badge workflow généré :', badgeFile);

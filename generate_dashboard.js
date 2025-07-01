// Script Node.js pour générer un tableau de bord HTML à partir du sprint planning
// Usage : node generate_dashboard.js sprint_planning.csv dashboard.html

import fs from 'fs';
import path from 'path';

const [,, inputCsv, outputHtml] = process.argv;
if (!inputCsv || !outputHtml) {
  console.error('Usage: node generate_dashboard.js sprint_planning.csv dashboard.html');
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

function getProgress(sprints) {
  const total = sprints.length;
  const done = sprints.filter(s => (s['Statut']||'').toLowerCase().includes('terminé')).length;
  return total ? Math.round((done/total)*100) : 0;
}

function toHtml(sprints) {
  const progress = getProgress(sprints);
  let html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Dashboard MayaVoiceTranslator</title><style>body{font-family:sans-serif}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}tr.done{background:#e0ffe0}tr.todo{background:#fffbe0}tr.blocked{background:#ffe0e0}</style></head><body>`;
  html += `<h1>Dashboard – MayaVoiceTranslator</h1><p>Progression globale : <b>${progress}%</b></p>`;
  html += `<table><tr><th>Sprint</th><th>Dates</th><th>Objectif</th><th>Tâches</th><th>Statut</th><th>Blocages</th></tr>`;
  sprints.forEach(s => {
    let rowClass = '';
    if ((s['Statut']||'').toLowerCase().includes('terminé')) rowClass = 'done';
    else if ((s['Dépendances/Blocages']||'').length) rowClass = 'blocked';
    else rowClass = 'todo';
    html += `<tr class='${rowClass}'><td>${s['Sprint']}</td><td>${s['Dates']}</td><td>${s['Objectif principal']}</td><td>${s['Tâches / Issues clés'].split(' | ').join('<br>')}</td><td>${s['Statut']}</td><td>${s['Dépendances/Blocages']||''}</td></tr>`;
  });
  html += `</table>`;
  html += `<script>
    // Détection automatique de la langue du navigateur
    const supported = ['fr','en','es','de','pt','it','nl','zh','ar','ru'];
    function getGuideLang() {
      const lang = (navigator.language || navigator.userLanguage || 'en').slice(0,2);
      return supported.includes(lang) ? lang : 'en';
    }
    function showGuide(lang) {
      window.open('./docs/ONBOARDING_' + lang + '.html', '_blank');
    }
    window.addEventListener('DOMContentLoaded', function() {
      let guideLang = getGuideLang();
      const div = document.createElement('div');
      div.innerHTML = \`📘 <b>Guide d'onboarding :</b> <button id="onbBtn">Ouvrir dans ma langue (\${guideLang})</button> <select id='langsel'>\${supported.map(l=>\`<option value='\${l}' \${l===guideLang?'selected':''}>\${l}</option>\`).join('')}</select>\`;
      document.body.insertBefore(div, document.body.firstChild);
      document.getElementById('onbBtn').addEventListener('click', function() {
        showGuide(document.getElementById('langsel').value);
      });
      document.getElementById('langsel').addEventListener('change', function(e) {
        showGuide(e.target.value);
      });
    });
  </script>`;
  html += `</body></html>`;
  return html;
}

const csv = fs.readFileSync(path.resolve(inputCsv), 'utf8');
const sprints = parseCsv(csv);
const html = toHtml(sprints);
fs.writeFileSync(path.resolve(outputHtml), html, 'utf8');
console.log('Dashboard HTML généré :', outputHtml);

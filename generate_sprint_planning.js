// Script Node.js pour générer un sprint planning à partir d'un CSV de feedbacks (issues/PR), en priorisant par priorité/labels et ajoutant une colonne Dépendances/Blocages
// Usage : node generate_sprint_planning.js github_feedback.csv sprint_planning.csv

import fs from 'fs';
import path from 'path';

const [,, inputCsv, outputCsv] = process.argv;
if (!inputCsv || !outputCsv) {
  console.error('Usage: node generate_sprint_planning.js github_feedback.csv sprint_planning.csv');
  process.exit(1);
}

// Paramètres de sprint (modifiable)
const sprintLengthDays = 14;
const firstSprintStart = new Date('2025-07-01');

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

function priorityScore(feedback) {
  // Priorité explicite > label critique/bug > suggestion > le reste
  const p = (feedback['Priorité'] || '').toLowerCase();
  const l = (feedback['Labels'] || '').toLowerCase();
  if (p.includes('haute') || l.includes('critical') || l.includes('bug')) return 1;
  if (p.includes('moyenne') || l.includes('enhancement') || l.includes('feature')) return 2;
  if (p.includes('basse') || l.includes('suggestion') || l.includes('question')) return 3;
  return 4;
}

function extractBlocage(feedback) {
  // Recherche de mots-clés dans le titre ou commentaire pour détecter un blocage/dépendance
  const titre = (feedback['Titre/Description courte'] || '').toLowerCase();
  const commentaire = (feedback['Commentaire/Action'] || '').toLowerCase();
  if (titre.includes('accès') || commentaire.includes('accès')) return 'Accès requis';
  if (titre.includes('validation') || commentaire.includes('validation')) return 'Validation nécessaire';
  if (titre.includes('partenaire') || commentaire.includes('partenaire')) return 'Partenaire à contacter';
  if (titre.includes('ressource') || commentaire.includes('ressource')) return 'Ressource indisponible';
  return '';
}

function groupBySprint(feedbacks) {
  // Trie par priorité, puis par date de signalement
  const sorted = feedbacks.slice().sort((a, b) => {
    const pa = priorityScore(a), pb = priorityScore(b);
    if (pa !== pb) return pa - pb;
    return (a['Date signalement'] || '').localeCompare(b['Date signalement'] || '');
  });
  // Répartition par lots de 5
  const sprints = [];
  let sprintNum = 1;
  let idx = 0;
  let date = new Date(firstSprintStart);
  while (idx < sorted.length) {
    const sprintTasks = sorted.slice(idx, idx + 5);
    const sprintStart = new Date(date);
    const sprintEnd = new Date(date); sprintEnd.setDate(sprintEnd.getDate() + sprintLengthDays - 1);
    sprints.push({
      sprint: `Sprint ${sprintNum}`,
      dates: `${sprintStart.toISOString().slice(0,10)} au ${sprintEnd.toISOString().slice(0,10)}`,
      objectifs: sprintTasks.map(t => t['Titre/Description courte']).join(' | '),
      taches: sprintTasks.map(t => t['Détail/URL/Discussion']).join(' | '),
      responsable: '',
      statut: 'À planifier',
      commentaire: '',
      blocages: sprintTasks.map(extractBlocage).filter(Boolean).join(' | ')
    });
    idx += 5;
    date.setDate(date.getDate() + sprintLengthDays);
    sprintNum++;
  }
  return sprints;
}

function toCsv(rows) {
  const headers = ['Sprint','Dates','Objectif principal','Tâches / Issues clés','Responsable','Statut','Commentaire/Blocage','Dépendances/Blocages'];
  const lines = [headers.join(',')];
  rows.forEach(r => {
    lines.push([
      r.sprint,
      r.dates,
      r.objectifs,
      r.taches,
      r.responsable,
      r.statut,
      r.commentaire,
      r.blocages
    ].map(x => '"'+x.replace(/"/g,'')+'"').join(','));
  });
  return lines.join('\n');
}

// Ajout d'un résumé automatique du sprint courant pour notification
function getSprintSummary() {
  const fs = require('fs');
  if (!fs.existsSync('sprint_planning.csv')) return '';
  const csv = fs.readFileSync('sprint_planning.csv', 'utf8');
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  const sprints = lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (cols[i] || '').trim());
    return obj;
  });
  if (!sprints.length) return '';
  const current = sprints[0];
  let summary = `Sprint : ${current['Sprint']} (${current['Dates']})\nObjectif : ${current['Objectif principal']}\nTâches :\n- ` + (current['Tâches / Issues clés']||'').split(' | ').join('\n- ');
  if (current['Dépendances/Blocages']) summary += `\nBlocages : ${current['Dépendances/Blocages']}`;
  summary += `\nStatut : ${current['Statut']}`;
  return summary;
}

const csv = fs.readFileSync(path.resolve(inputCsv), 'utf8');
const feedbacks = parseCsv(csv);
const sprints = groupBySprint(feedbacks);
fs.writeFileSync(path.resolve(outputCsv), toCsv(sprints), 'utf8');
console.log('Sprint planning généré (priorisé + blocages) :', outputCsv);

// À la fin du script, si utilisé en tant que module
if (require.main === module) {
  const summary = getSprintSummary();
  if (summary) {
    fs.writeFileSync('sprint_summary.txt', summary, 'utf8');
    console.log('Résumé sprint généré : sprint_summary.txt');
  }
}

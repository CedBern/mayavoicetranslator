// Script Node.js pour exporter les issues et PR GitHub vers un CSV de suivi avec labels
// Usage : node export_github_feedback.js <owner> <repo> <github_token>
// Exemple : node export_github_feedback.js cedbe MayaVoiceTranslator ghp_xxx

import fs from 'fs';
import https from 'https';

const [,, owner, repo, token] = process.argv;
if (!owner || !repo || !token) {
  console.error('Usage: node export_github_feedback.js <owner> <repo> <github_token>');
  process.exit(1);
}

const headers = {
  'User-Agent': 'MayaVoiceTranslator-Feedback-Export',
  'Authorization': `token ${token}`
};

function fetchGitHub(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      headers
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function labelsToString(labels) {
  if (!labels || !labels.length) return '';
  return labels.map(l => l.name).join('|');
}

async function main() {
  const issues = await fetchGitHub(`/repos/${owner}/${repo}/issues?state=all&per_page=100`);
  const prs = await fetchGitHub(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`);

  const rows = [
    'ID,Type,Source,Titre/Description courte,Détail/URL/Discussion,Labels,Priorité,Statut,Assigné à,Date signalement,Date résolution,Commentaire/Action'
  ];

  issues.forEach(issue => {
    if (issue.pull_request) return; // skip PRs here
    rows.push([
      issue.number,
      'Bug',
      'GitHub',
      issue.title.replace(/,/g, ' '),
      issue.html_url,
      labelsToString(issue.labels),
      '',
      issue.state === 'open' ? 'Ouvert' : 'Fermé',
      issue.assignee ? issue.assignee.login : '',
      issue.created_at.split('T')[0],
      issue.closed_at ? issue.closed_at.split('T')[0] : '',
      ''
    ].join(','));
  });

  prs.forEach(pr => {
    rows.push([
      pr.number,
      'Amélioration',
      'GitHub PR',
      pr.title.replace(/,/g, ' '),
      pr.html_url,
      labelsToString(pr.labels),
      '',
      pr.state === 'open' ? 'Ouvert' : 'Fermé',
      pr.assignee ? pr.assignee.login : '',
      pr.created_at.split('T')[0],
      pr.closed_at ? pr.closed_at.split('T')[0] : '',
      ''
    ].join(','));
  });

  fs.writeFileSync('github_feedback.csv', rows.join('\n'), 'utf8');
  console.log('Export terminé : github_feedback.csv');
}

main().catch(err => console.error('Erreur export :', err));

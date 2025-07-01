// Génère une archive ZIP "Sprint Review Pack" avec tous les livrables du sprint courant
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const now = new Date();
const pad = n => n.toString().padStart(2, '0');
const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
const histDir = path.join('docs', 'history', stamp);
if (!fs.existsSync(histDir)) {
  console.error('Dossier d’archive du sprint non trouvé:', histDir);
  process.exit(1);
}
const files = ['dashboard.html','dashboard.pdf','rapport_sprint.md','rapport_sprint.html','rapport_sprint.json'];
const output = fs.createWriteStream(path.join(histDir, 'sprint_review_pack.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
files.forEach(f => {
  const filePath = path.join(histDir, f);
  if (fs.existsSync(filePath)) archive.file(filePath, { name: f });
});
archive.finalize();
output.on('close', () => {
  console.log('Sprint Review Pack généré :', path.join(histDir, 'sprint_review_pack.zip'));
  // Génération d’un résumé prêt à envoyer
  const summary = `Sprint Review Pack généré pour ${stamp}\n\nContenu :\n${files.map(f=>'- '+f).join('\n')}\n\nArchive ZIP : sprint_review_pack.zip\nAccès public : ./docs/history/${stamp}/sprint_review_pack.zip`;
  fs.writeFileSync(path.join(histDir, 'sprint_review_summary.txt'), summary, 'utf8');
  console.log('Résumé de revue généré :', path.join(histDir, 'sprint_review_summary.txt'));
});

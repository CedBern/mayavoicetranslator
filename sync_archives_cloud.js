// Script Node.js pour synchroniser les archives sur Google Drive via rclone
// Prérequis : installer et configurer rclone (https://rclone.org/)
// Usage : node sync_archives_cloud.js
// Par défaut, synchronise 'archives/' vers 'gdrive:maya-archives'

const { execSync } = require('child_process');

const remote = process.env.RCLONE_REMOTE || 'gdrive:maya-archives';
try {
  execSync(`rclone sync archives "${remote}"`, { stdio: 'inherit' });
  console.log('Synchronisation cloud terminée.');
} catch (e) {
  console.error('Erreur lors de la synchronisation cloud :', e.message);
}

const remoteDocs = process.env.RCLONE_REMOTE_DOCS;
if (remoteDocs) {
  try {
    execSync(`rclone sync docs "${remoteDocs}"`, { stdio: 'inherit' });
    console.log('Synchronisation cloud (docs/) terminée.');
  } catch (e) {
    console.error('Erreur lors de la synchronisation cloud (docs/) :', e.message);
  }
}

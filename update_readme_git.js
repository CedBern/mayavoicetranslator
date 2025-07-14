// Script Node.js pour commit et push automatiquement le README et le badge SVG sur GitHub
// Usage : node update_readme_git.js
// Prérequis : git configuré avec accès push sur le dépôt

const { execSync } = require('child_process');

try {
  execSync('git add README.md progress_badge.svg', { stdio: 'inherit' });
  execSync('git commit -m "Mise à jour automatique du badge de progression [ci skip]"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('README et badge SVG poussés sur GitHub.');
} catch (e) {
  console.error('Erreur lors du commit/push automatique :', e.message);
}

// gamification.js
// Module de gamification avancée pour MayaVoiceTranslator
// Badges, niveaux, défis, récompenses, leaderboard, notifications

const fs = require('fs');

const BADGES = [
  { id: 'starter', label: 'Premier essai', condition: stats => stats.sessions >= 1 },
  { id: 'progress', label: 'Progression', condition: stats => stats.progression > 0.5 },
  { id: 'polyglot', label: 'Multilingue', condition: stats => stats.langues && stats.langues.length > 1 },
  { id: 'helper', label: 'Aide la communauté', condition: stats => stats.aide >= 1 },
  { id: 'perfectionist', label: '100% réussite', condition: stats => stats.reussite === 1 },
  { id: 'feedbacker', label: 'Donne du feedback', condition: stats => stats.feedbacks >= 3 }
];

function attribuerBadges(stats) {
  return BADGES.filter(b => b.condition(stats)).map(b => b.id);
}

function calculerNiveau(stats) {
  // Simple : 1 point par session, 2 par badge, 5 par défi réussi
  return Math.floor(stats.sessions + 2 * attribuerBadges(stats).length + 5 * (stats.defis || 0));
}

function defisDuJour(profile) {
  // Exemples de défis adaptatifs
  if (profile === 'enfant') return ['Trouve 3 mots en jouant', 'Gagne 2 badges aujourd’hui'];
  if (profile === 'senior') return ['Participe à une conversation', 'Teste la fonction audio'];
  if (profile === 'non-lecteur') return ['Associe 2 sons à des images', 'Utilise la navigation audio'];
  if (profile === 'multilingue') return ['Change de langue 2 fois', 'Traduis un mot dans 2 langues'];
  return ['Complète une activité', 'Donne un feedback'];
}

function leaderboard(usersStats) {
  // Classement par niveau décroissant
  return usersStats.map(u => ({ user: u.id, niveau: calculerNiveau(u) }))
    .sort((a, b) => b.niveau - a.niveau);
}

function notifier(userId, message) {
  fs.appendFileSync('logs/notifications.log', `[${new Date().toISOString()}] ${userId}: ${message}\n`);
}

module.exports = { attribuerBadges, calculerNiveau, defisDuJour, leaderboard, notifier };

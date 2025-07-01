// ux_inclusive.js
// Module d’UX adaptative et inclusive pour MayaVoiceTranslator
// Détecte le profil utilisateur et adapte automatiquement l’UI (taille, couleurs, consignes, navigation, multimodalité)

function detectProfile(userData) {
  if (userData.age < 12) return 'enfant';
  if (userData.age > 65) return 'senior';
  if (userData.readingLevel === 'none') return 'non-lecteur';
  if (userData.languages && userData.languages.length > 1) return 'multilingue';
  return 'standard';
}

function adaptUI(profile) {
  switch (profile) {
    case 'enfant':
      return { fontSize: 'large', colorScheme: 'vif', icons: true, audioHelp: true };
    case 'senior':
      return { fontSize: 'x-large', colorScheme: 'contraste', audioHelp: true, navigation: 'simple' };
    case 'non-lecteur':
      return { fontSize: 'xx-large', colorScheme: 'pictos', icons: true, audioHelp: true, navigation: 'ultra-simple' };
    case 'multilingue':
      return { fontSize: 'medium', colorScheme: 'neutre', switchLang: true };
    default:
      return { fontSize: 'medium', colorScheme: 'standard' };
  }
}

module.exports = { detectProfile, adaptUI };

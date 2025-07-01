// scenarios_adaptatifs.js
// Génère des scénarios d’apprentissage adaptatifs et gamifiés selon le profil utilisateur

const profils = [
  'enfant', 'senior', 'non-lecteur', 'multilingue', 'standard'
];

function getScenario(profile, niveau) {
  // Exemples de scénarios adaptatifs
  if (profile === 'enfant') {
    return {
      type: 'jeu',
      objectif: 'Trouver le bon mot en écoutant un son',
      feedback: 'Bravo ! Essaie encore pour gagner un badge.',
      gamification: true
    };
  }
  if (profile === 'senior') {
    return {
      type: 'conversation',
      objectif: 'Simuler une discussion quotidienne',
      feedback: 'Votre prononciation est claire. Voulez-vous ralentir le rythme ?',
      accessibilite: 'texte agrandi, consignes audio'
    };
  }
  if (profile === 'non-lecteur') {
    return {
      type: 'image-son',
      objectif: 'Associer un son à une image',
      feedback: 'Écoute et touche l’image correspondante.',
      accessibilite: 'icônes, audio, navigation simplifiée'
    };
  }
  if (profile === 'multilingue') {
    return {
      type: 'switch-langue',
      objectif: 'Changer de langue en contexte',
      feedback: 'Bravo, tu as reconnu le mot dans deux langues !',
      gamification: true
    };
  }
  // Standard ou inconnu
  return {
    type: 'texte',
    objectif: 'Répondre à une question ou compléter une phrase',
    feedback: 'Bonne réponse !',
    gamification: false
  };
}

module.exports = { getScenario };

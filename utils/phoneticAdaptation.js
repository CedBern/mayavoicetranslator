// utils/phoneticAdaptation.js

/**
 * Applique les adaptations phonétiques pour la synthèse vocale.
 * Pour éviter les recouvrements, trie les clés par longueur décroissante.
 * @param {string} text - Le texte à adapter.
 * @param {object} adaptations - Un objet {original: remplacement}.
 * @returns {string} Le texte adapté.
 */
function adaptTextForTTS(text, adaptations) {
  let adaptedText = text;
  // Trier les clés par longueur décroissante pour éviter les recouvrements
  const sortedKeys = Object.keys(adaptations).sort((a, b) => b.length - a.length);
  for (const original of sortedKeys) {
    const replacement = adaptations[original];
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    adaptedText = adaptedText.replace(regex, replacement);
  }
  return adaptedText;
}

module.exports = { adaptTextForTTS };

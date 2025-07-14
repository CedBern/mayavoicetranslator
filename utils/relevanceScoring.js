// Logiciel de scoring de pertinence pour Maya Voice Translator (Talk Kin)
// Extraction de la logique métier pour testabilité et robustesse

/**
 * Calcule un score de pertinence pondéré pour un résultat de recherche sémantique.
 * Inspiré de la logique de SemanticSearchService et IntelligentCorpusManagementService.
 * @param {number} similarity - Similarité cosinus (0-1) entre la requête et le document.
 * @param {object} document - Objet document (doit contenir au moins text, language, category, translation).
 * @param {string} query - Texte de la requête utilisateur.
 * @param {string} [targetLanguage] - Langue cible (optionnelle).
 * @returns {number} Score de pertinence (0-1, >1 possible si bonus cumulés)
 */
export function calculateRelevanceScore(similarity, document, query, targetLanguage) {
  let score = similarity;

  // Bonus pour correspondance exacte de langue
  if (document.language && targetLanguage && document.language === targetLanguage) {
    score += 0.1;
  }

  // Bonus pour longueur similaire
  if (document.text && query) {
    const lengthRatio = Math.min(query.length, document.text.length) / Math.max(query.length, document.text.length);
    score += lengthRatio * 0.1;
  }

  // Bonus pour catégorie pertinente
  if (document.category && document.category !== 'general') {
    score += 0.05;
  }

  // Bonus si traduction disponible dans la langue cible
  if (document.translation && targetLanguage && document.translation[targetLanguage]) {
    score += 0.05;
  }

  // Bonus pour correspondance exacte du texte
  if (document.text && query && document.text.toLowerCase() === query.toLowerCase()) {
    score += 0.15;
  }

  // Clamp entre 0 et 1.2 (bonus cumulés)
  return Math.max(0, Math.min(score, 1.2));
}

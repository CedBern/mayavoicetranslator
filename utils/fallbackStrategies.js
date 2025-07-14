// Logique de fallback multi-niveaux pour Maya Voice Translator (Talk Kin)
// Exécute une liste de stratégies asynchrones jusqu'à succès ou épuisement

/**
 * Exécute en cascade une liste de stratégies asynchrones (promesses).
 * S'arrête au premier résultat jugé "valide" (selon le validateur fourni).
 * @param {Array<Function>} strategies - Fonctions asynchrones retournant un résultat ou null/undefined
 * @param {Function} [isValid] - Fonction de validation du résultat (par défaut: résultat non nul)
 * @returns {Promise<any>} Premier résultat valide ou null si aucun
 */
export async function fallbackCascade(strategies, isValid = r => r != null) {
  for (const strategy of strategies) {
    try {
      const result = await strategy();
      if (isValid(result)) {
        return result;
      }
    } catch (e) {
      // Ignore l'erreur et passe à la stratégie suivante
    }
  }
  return null;
}

// Utilitaire de traduction avec fallback automatique
// Nécessite une fonction externe callExternalTranslationService(phrase, langCode)
import { ENRICHED_DICTIONARY } from './EnrichedDictionary.js';

/**
 * Retourne la traduction fiable si disponible, sinon tente un fallback automatique.
 * @param {string} phrase - La phrase à traduire (clé du dictionnaire)
 * @param {string} langCode - Le code langue cible
 * @param {function} callExternalTranslationService - Fonction async (phrase, langCode) => string
 * @returns {Promise<string>} Traduction fiable ou automatique (signalée)
 */
export async function getTranslationWithFallback(phrase, langCode, callExternalTranslationService) {
  const entry = ENRICHED_DICTIONARY[phrase];
  if (!entry) return '[clé inconnue]';
  const value = entry[langCode];
  if (value && value !== '???') {
    return value;
  }
  // Fallback automatique
  const auto = await callExternalTranslationService(phrase, langCode);
  return `[auto] ${auto}`;
}

// Exemple d’utilisation :
// const trad = await getTranslationWithFallback('bonjour', 'yua', myTranslateAPI)

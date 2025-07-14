// services/logger.js
// Logger centralisé pour plugins et orchestrateur

/**
 * Log un événement structuré (audit, debug, feedback, décision, etc.)
 * @param {Object} params
 * @param {'info'|'error'|'decision'|'feedback'} params.type
 * @param {string} params.plugin - Nom du plugin ou 'orchestrator'
 * @param {string} params.message - Message principal (i18n si affiché)
 * @param {Object} [params.data] - Données additionnelles (résultat, score, etc.)
 * @param {string|null} [params.userId] - Optionnel, anonyme ou authentifié
 * @param {string} [params.locale] - Pour i18n, ex: 'fr', 'en'
 */
export function logEvent({
  type,
  plugin,
  message,
  data = {},
  userId = null,
  locale = 'fr',
}) {
  // Ici, on peut écrire dans un fichier, une base, ou un service externe
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    type,
    plugin,
    message,
    data,
    userId,
    locale,
  }));
}

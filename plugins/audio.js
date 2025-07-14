// plugins/audio.js
const { logEvent } = require('../services/logger');

module.exports = {
  name: 'audio',
  priority: 2,
  enabled: true,
  minConfidence: 0.5,
  /**
   * Reconnaissance audio (exemple minimal, à adapter)
   * @param {Object} params
   * @param {Buffer|string} params.audioInput
   * @param {Object} params.options
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async recognize({ audioInput, options = {} }) {
    logEvent({
      type: 'info',
      plugin: 'audio',
      message: 'Début reconnaissance audio',
      data: { audioInput: !!audioInput },
      locale: options.locale || 'fr',
    });
    // Simulation d'un résultat (à remplacer par la vraie logique)
    const result = {
      text: 'Texte reconnu',
      confidence: 0.85
    };
    logEvent({
      type: 'info',
      plugin: 'audio',
      message: 'Résultat reconnaissance audio',
      data: result,
      locale: options.locale || 'fr',
    });
    return result;
  }
};

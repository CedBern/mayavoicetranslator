// plugins/ocr.js
const { logEvent } = require('../services/logger');

module.exports = {
  name: 'ocr',
  priority: 1,
  enabled: true,
  minConfidence: 0.5,
  /**
   * Reconnaissance OCR (exemple minimal, à adapter)
   * @param {Object} params
   * @param {Buffer|string} params.imageInput
   * @param {Object} params.options
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async recognize({ imageInput, options = {} }) {
    logEvent({
      type: 'info',
      plugin: 'ocr',
      message: 'Début reconnaissance OCR',
      data: { imageInput: !!imageInput },
      locale: options.locale || 'fr',
    });
    // Simulation d'un résultat (à remplacer par la vraie logique OCR)
    const result = {
      text: 'Texte extrait de l’image',
      confidence: 0.9
    };
    logEvent({
      type: 'info',
      plugin: 'ocr',
      message: 'Résultat OCR',
      data: result,
      locale: options.locale || 'fr',
    });
    return result;
  }
};

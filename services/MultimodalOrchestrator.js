// MultimodalOrchestrator : orchestrateur pluggable pour toutes les modalités (audio, labial, signes, etc.)
// Permet d'ajouter, retirer, prioriser ou pondérer dynamiquement chaque modalité
// Usage : centraliser la logique de sélection, de fusion, de logs et de configuration

const { logEvent } = require('./logger');
const audioPlugin = require('../plugins/audio');
const ocrPlugin = require('../plugins/ocr');

class MultimodalOrchestrator {
  constructor({ plugins = [], config = {} } = {}) {
    // plugins : [{ name, recognize, priority, enabled }]
    this.plugins = plugins;
    this.config = config;
  }

  // Ajoute un plugin (modalité)
  addPlugin(plugin) {
    this.plugins.push(plugin);
  }

  // Active/désactive une modalité dynamiquement
  setPluginEnabled(name, enabled) {
    const p = this.plugins.find(p => p.name === name);
    if (p) p.enabled = enabled;
  }

  // Ordonne les plugins selon la priorité
  getOrderedPlugins() {
    return this.plugins.filter(p => p.enabled !== false).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  // Pipeline principal : exécute les modalités selon la config et fusionne les résultats
  async recognize({ audioInput, videoInput, options = {} }) {
    const logs = [];
    const results = [];
    for (const plugin of this.getOrderedPlugins()) {
      try {
        const res = await plugin.recognize({ audioInput, videoInput, options });
        logs.push({ plugin: plugin.name, result: res });
        logEvent({
          type: 'info',
          plugin: plugin.name,
          message: 'Recognition result',
          data: res,
          locale: options.locale || 'fr',
        });
        if (res && res.confidence > (plugin.minConfidence || 0.5)) {
          results.push({ ...res, plugin: plugin.name });
          if (this.config.stopOnFirstSuccess) break;
        }
      } catch (e) {
        logs.push({ plugin: plugin.name, error: e.message });
        logEvent({
          type: 'error',
          plugin: plugin.name,
          message: e.message,
          data: {},
          locale: options.locale || 'fr',
        });
      }
    }
    // Fusion intelligente (pondération, vote, etc.)
    const fused = this.fuseResults(results);
    logEvent({
      type: 'decision',
      plugin: 'orchestrator',
      message: 'Fusion des résultats',
      data: { fused, results },
      locale: options.locale || 'fr',
    });
    return { fused, results, logs };
  }

  // Fusion des résultats (exemple simple : meilleur score)
  fuseResults(results) {
    if (results.length === 0) return { error: 'Aucun résultat exploitable' };
    // Pondération/vote possible ici
    return results.reduce((a, b) => (a.confidence > b.confidence ? a : b));
  }
}

// Exemple d'utilisation :
// const orchestrator = new MultimodalOrchestrator({
//   plugins: [
//     { name: 'audio', recognize: speechRecognitionService.recognize, priority: 2 },
//     { name: 'labial', recognize: lipReadingService.recognize, priority: 1 },
//     { name: 'signes', recognize: signLanguageService.recognize, priority: 1 }
//   ],
//   config: { stopOnFirstSuccess: false }
// });
// const result = await orchestrator.recognize({ audioInput, videoInput, options });

// Exemple d'utilisation avec intégration des plugins audio et ocr :
const orchestrator = new MultimodalOrchestrator({
  plugins: [audioPlugin, ocrPlugin],
  config: { stopOnFirstSuccess: false }
});
// Pour utiliser : orchestrator.recognize({ audioInput, videoInput, imageInput, options })

module.exports = MultimodalOrchestrator;

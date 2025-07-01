// dashboard.js
// Tableaux de bord dynamiques – MayaVoiceTranslator
// Génère des tableaux de bord de suivi pour :
// - Performance (précision, rapidité, taux d’erreur)
// - Biais/démographie (équité, diversité des données)
// - Accessibilité (usage, retours, conformité WCAG)
// - Satisfaction utilisateur (feedback, NPS, taux de correction)
// - Conformité éthique (scores d’audit, alertes, recommandations)

const fs = require('fs');

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function generateDashboard() {
  const perf = loadJSON('stats/performance.json');
  const bias = loadJSON('stats/biais.json');
  const access = loadJSON('stats/accessibilite.json');
  const feedback = loadJSON('stats/feedback.json');
  const audit = loadJSON('stats/audit_ethique.json');
  return {
    performance: perf,
    biais: bias,
    accessibilite: access,
    satisfaction: feedback,
    ethique: audit
  };
}

function exportDashboard(dashboard, outPath) {
  fs.writeFileSync(outPath, JSON.stringify(dashboard, null, 2));
}

// Exemple d’utilisation :
// const dash = generateDashboard();
// exportDashboard(dash, 'dashboard_global.json');

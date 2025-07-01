// Script de vérification i18n et accessibilité

// Ce script Node.js vérifie la couverture i18n (chaînes non traduites) et génère un rapport d’accessibilité (axe-core)

const fs = require('fs');
const path = require('path');
const { configureAxe, runAxe } = require('axe-core');

// Vérification i18n (exemple simplifié)
function checkI18nCoverage() {
  // À adapter selon la structure réelle des fichiers de traduction
  const localesDir = path.join(__dirname, '../web/locales');
  const baseLang = 'fr';
  const langs = ['es-mx', 'en', 'maya'];
  let missing = [];
  langs.forEach(lang => {
    const base = require(path.join(localesDir, baseLang + '.json'));
    const target = require(path.join(localesDir, lang + '.json'));
    Object.keys(base).forEach(key => {
      if (!target[key]) missing.push({ lang, key });
    });
  });
  return missing;
}

// Audit accessibilité (exemple simplifié)
async function runAccessibilityAudit() {
  // À adapter pour lancer sur l’URL locale de l’app
  const axe = configureAxe({});
  const results = await runAxe('http://localhost:3000');
  return results.violations;
}

async function main() {
  const i18nMissing = checkI18nCoverage();
  let accessViolations = [];
  try {
    accessViolations = await runAccessibilityAudit();
  } catch (e) {
    accessViolations = ['Erreur audit axe/Lighthouse (vérifiez que l’app est lancée)'];
  }
  const report = {
    date: new Date().toISOString(),
    i18nMissing,
    accessViolations
  };
  fs.writeFileSync(path.join(__dirname, '../docs/AUDIT_ACCESSIBILITE_I18N.json'), JSON.stringify(report, null, 2));
}

main();

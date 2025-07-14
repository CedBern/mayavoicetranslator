// Script de monitoring de couverture et recommandation d'activation/désactivation des sources
const fs = require('fs');
const path = require('path');
const sources = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../corpus-sources.json'), 'utf8'));

// Simule la couverture réelle par langue (à remplacer par des stats réelles)
const coverageStats = {
  'fr': { local: true, external: true },
  'crg': { local: true, external: false },
  'en': { local: false, external: true },
  // ...
};

function recommendSourceActivation(lang) {
  const relevant = sources.filter(r => r.languages.includes(lang));
  const hasLocal = coverageStats[lang]?.local;
  const recommendations = relevant.map(r => {
    if (r.cost > 0 && hasLocal) {
      return { name: r.name, action: 'disable', reason: 'Corpus local suffisant' };
    }
    if (r.cost > 0 && !hasLocal) {
      return { name: r.name, action: 'enable', reason: 'Pas de corpus local, API payante nécessaire' };
    }
    return { name: r.name, action: r.enabled ? 'keep' : 'enable', reason: r.cost === 0 ? 'Gratuit' : 'Payant' };
  });
  return recommendations;
}

// Exemple d'usage
const lang = process.argv[2] || 'fr';
console.log(`Recommandations pour la langue : ${lang}`);
console.table(recommendSourceActivation(lang));

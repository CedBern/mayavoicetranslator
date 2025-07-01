// ab_testing.js
// Script d’A/B testing automatisé pour UI/UX
// Teste différentes variantes d’UI, collecte les résultats, sélectionne la plus efficace

const fs = require('fs');

function runABTest(variants, users, metricFn) {
  // variants : [{id, config}], users : [{id, profile}], metricFn : (user, variant) => score
  let results = variants.map(variant => ({
    id: variant.id,
    scores: users.map(user => metricFn(user, variant)),
    avg: 0
  }));
  results.forEach(r => {
    r.avg = r.scores.reduce((a, b) => a + b, 0) / r.scores.length;
  });
  const best = results.reduce((a, b) => (a.avg > b.avg ? a : b));
  fs.appendFileSync('logs/ab_testing.log', `[${new Date().toISOString()}] Résultats : ${JSON.stringify(results)}\nBest : ${best.id}\n`);
  return best.id;
}

module.exports = { runABTest };

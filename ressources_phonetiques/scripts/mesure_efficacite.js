// mesure_efficacite.js
// Mesure l’efficacité pédagogique et l’appropriation communautaire
// Agrège : progression, taux de réussite, feedback, NPS, taux de correction, participation communautaire

const fs = require('fs');

function calculerEfficacite(stats) {
  // stats : { progression, reussite, feedback, nps, corrections, participation }
  const score = (
    0.3 * stats.progression +
    0.2 * stats.reussite +
    0.2 * stats.nps +
    0.1 * stats.feedback +
    0.1 * stats.corrections +
    0.1 * stats.participation
  );
  return Math.round(score * 100) / 100;
}

function genererRapport(stats, outPath) {
  const score = calculerEfficacite(stats);
  const rapport = {
    date: new Date().toISOString(),
    stats,
    score,
    interpretation: score > 0.8 ? 'Très efficace' : score > 0.6 ? 'Efficace' : 'À améliorer'
  };
  fs.writeFileSync(outPath, JSON.stringify(rapport, null, 2));
  return rapport;
}

module.exports = { calculerEfficacite, genererRapport };

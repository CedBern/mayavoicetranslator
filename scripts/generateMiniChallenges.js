// scripts/generateMiniChallenges.js
// Génère des mini-défis à partir des erreurs loggées

const fs = require('fs');
const path = require('path');
const { LOG_PATH } = require('../services/ErrorTracker');

const OUTPUT_PATH = path.join(__dirname, '../.data/mini-challenges.json');

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'autre';
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});
}

function generateMiniChallenges() {
  if (!fs.existsSync(LOG_PATH)) {
    console.log('Aucune erreur loggée.');
    return;
  }
  const log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  const byType = groupBy(log, 'type');
  const challenges = [];
  Object.entries(byType).forEach(([type, entries]) => {
    // Pour chaque type d’erreur, générer un mini-défi
    const mostRecent = entries[entries.length - 1];
    challenges.push({
      type,
      prompt: `Corrige cette erreur fréquente (${type}) : ${mostRecent.detail}`,
      context: mostRecent.context,
      example: mostRecent.detail
    });
  });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(challenges, null, 2));
  console.log(`Mini-défis générés dans ${OUTPUT_PATH}`);
}

generateMiniChallenges();

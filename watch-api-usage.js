// Script de stats temps réel (à lancer en mode watch ou via API)
const fs = require('fs');
const path = require('path');
const usageLogPath = path.resolve(__dirname, '../api-usage.log.json');
let usageLog = {};
try { usageLog = JSON.parse(fs.readFileSync(usageLogPath, 'utf8')); } catch { usageLog = {}; }

function printStats() {
  console.clear();
  console.log('--- Statistiques d’usage des APIs (temps réel) ---');
  for (const [api, stats] of Object.entries(usageLog)) {
    console.log(`API: ${api}`);
    console.log(`  Requêtes: ${stats.requests || 0}`);
    console.log(`  Temps moyen de réponse: ${stats.avgResponseTime || '-'} ms`);
    console.log(`  Taux de fallback: ${stats.fallbackRate || '-'}%`);
    console.log('');
  }
}

setInterval(() => {
  try { usageLog = JSON.parse(fs.readFileSync(usageLogPath, 'utf8')); } catch { usageLog = {}; }
  printStats();
}, 5000);

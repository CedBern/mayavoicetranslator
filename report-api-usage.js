// Script de génération de statistiques d'usage et de performance
const fs = require('fs');
const path = require('path');
const usageLogPath = path.resolve(__dirname, '../api-usage.log.json');
let usageLog = {};
try { usageLog = JSON.parse(fs.readFileSync(usageLogPath, 'utf8')); } catch { usageLog = {}; }

console.log('--- Statistiques d’usage des APIs ---');
for (const [api, stats] of Object.entries(usageLog)) {
  console.log(`API: ${api}`);
  console.log(`  Requêtes: ${stats.requests || 0}`);
  console.log(`  Temps moyen de réponse: ${stats.avgResponseTime || '-'} ms`);
  console.log(`  Taux de fallback: ${stats.fallbackRate || '-'}%`);
  console.log('');
}

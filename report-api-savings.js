// Script de rapport d'économie réalisée grâce à la désactivation des API payantes
const fs = require('fs');
const path = require('path');
const sources = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../corpus-sources.json'), 'utf8'));
const usageLogPath = path.resolve(__dirname, '../api-usage.log.json');
let usageLog = {};
try { usageLog = JSON.parse(fs.readFileSync(usageLogPath, 'utf8')); } catch { usageLog = {}; }

let totalSaved = 0;
let details = [];
for (const src of sources) {
  if (src.cost > 0 && src.enabled === false) {
    // Simule le nombre de requêtes évitées (à remplacer par stats réelles)
    const avoided = usageLog[src.name] || 0;
    const saved = avoided * (src.unitCost || (src.cost / 1000)); // coût par 1000 requêtes par défaut
    totalSaved += saved;
    details.push({
      name: src.name,
      avoided,
      unitCost: src.unitCost || (src.cost / 1000),
      saved: Math.round(saved * 100) / 100
    });
  }
}
console.log('--- Rapport d’économie sur les API payantes ---');
console.table(details);
console.log(`Total économisé estimé : ${Math.round(totalSaved * 100) / 100} €`);

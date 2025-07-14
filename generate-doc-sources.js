// Script de génération automatique de documentation des sources
const fs = require('fs');
const path = require('path');
const sources = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../corpus-sources.json'), 'utf8'));

let doc = '# Documentation des sources linguistiques\n\n';
doc += '| Source | Type | Langues | Coût | Statut | Licence | URL |\n';
doc += '|--------|------|---------|------|--------|---------|-----|\n';
for (const src of sources) {
  doc += `| ${src.name} | ${src.type} | ${(src.languages || []).join(', ')} | ${src.cost || 0} | ${src.enabled === false ? 'Désactivée' : 'Active'} | ${src.licence || '-'} | ${src.url || '-'} |\n`;
}
fs.writeFileSync(path.resolve(__dirname, '../DOC_SOURCES.md'), doc);
console.log('DOC_SOURCES.md généré.');

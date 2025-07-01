// Script d’import de corpus pour LivingLanguageLab (exemple de CLI)
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.log('Usage: node import_corpus.js <corpus.json> <output.json>');
  process.exit(1);
}

const input = process.argv[2];
const output = process.argv[3];

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
// Ici, on pourrait valider, normaliser, enrichir...
fs.writeFileSync(output, JSON.stringify(data, null, 2));
console.log(`Corpus importé et sauvegardé dans ${output}`);

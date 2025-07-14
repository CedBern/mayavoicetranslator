// scripts/initRemixHack.js
// Initialise les dossiers et fichiers nécessaires au hack "Remix ton parcours"

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../.data');
const files = [
  'error-log.json',
  'mini-challenges.json',
  'hack-journal.json'
];

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Dossier .data créé.');
}

files.forEach(f => {
  const filePath = path.join(dataDir, f);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    console.log(`Fichier ${f} initialisé.`);
  }
});

console.log('Hack Remix ton parcours prêt à l’emploi.');

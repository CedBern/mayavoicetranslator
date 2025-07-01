// Script Node.js pour purger les archives de plus de 90 jours
// Usage : node purge_archives.js

const fs = require('fs');
const path = require('path');

const archiveRoot = 'archives';
const retentionDays = 90;
const now = new Date();

if (!fs.existsSync(archiveRoot)) process.exit(0);

fs.readdirSync(archiveRoot).forEach(dir => {
  const dirPath = path.join(archiveRoot, dir);
  if (fs.statSync(dirPath).isDirectory()) {
    const dirDate = new Date(dir);
    if (!isNaN(dirDate)) {
      const age = (now - dirDate) / (1000 * 60 * 60 * 24);
      if (age > retentionDays) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Archive supprimée : ${dirPath}`);
      }
    }
  }
});
console.log('Purge des archives terminée.');

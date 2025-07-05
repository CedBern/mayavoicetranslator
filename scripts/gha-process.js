// 1. Importer les outils de traitement
const { pipeline } = require('stream/promises');
const fs = require('fs');
const { Transform } = require('stream');

// 2. Fonction pour traiter les gros fichiers
async function processLargeData() {
  await pipeline(
    // Lire le fichier par morceaux
    fs.createReadStream('big-data.json'),
    
    // Transformer chaque morceau
    new Transform({
      objectMode: true,
      transform(chunk, enc, cb) {
        try {
          // 3. Traiter un petit morceau à la fois
          const data = JSON.parse(chunk);
          const result = processDataChunk(data);
          cb(null, JSON.stringify(result));
        } catch (err) {
          cb(err);
        }
      }
    }),
    
    // Écrire le résultat
    fs.createWriteStream('processed-data.json')
  );
}

// 4. Fonction à personnaliser
function processDataChunk(data) {
  // EXEMPLE SIMPLE : Compter les éléments
  return {
    count: data.length,
    firstItem: data[0]
  };
}

// 5. Démarrer le traitement
(async () => {
  console.time('Processing');
  await processLargeData();
  console.timeEnd('Processing');
})();
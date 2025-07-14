// Watcher automatique pour l'ingestion continue de nouveaux documents CECR
// Dépendance : npm install chokidar
import { exec } from 'child_process';
import chokidar from 'chokidar';
import path from 'path';

const PDF_DIR = path.join(process.cwd(), 'docs/cecr/pdf');

console.log('Watcher CECR démarré. Surveillance de :', PDF_DIR);

const watcher = chokidar.watch(PDF_DIR, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: true,
  depth: 5
});

function runExtractionPipeline() {
  console.log('Nouveau document détecté. Extraction/conversion en cours...');
  exec('npm run extract-cecr-docs && npm run convert-cecr-json && npm run generate-metadata', (err, stdout, stderr) => {
    if (err) {
      console.error('Erreur pipeline extraction/conversion:', err.message);
      return;
    }
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('Pipeline extraction/conversion/métadonnées terminé.');
  });
}

watcher.on('add', runExtractionPipeline);
watcher.on('change', runExtractionPipeline);

// Optionnel : watcher.on('unlink', ...)

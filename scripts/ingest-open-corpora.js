// scripts/ingest-open-corpora.js
// Téléchargement et ingestion automatique de corpus OpenSubtitles2016 et Common Voice
// Usage : node scripts/ingest-open-corpora.js

import fs from 'fs';
import path from 'path';
import https from 'https';
import { pipeline } from 'stream';
import { createGunzip } from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs des dumps open source (exemples)
const CORPORA = [
  {
    name: 'OpenSubtitles2016',
    url: 'https://opus.nlpl.eu/download.php?f=OpenSubtitles2016/en-fr.txt.gz',
    out: path.join(__dirname, '../data/OpenSubtitles2016-en-fr.txt'),
    format: 'txt',
  },
  {
    name: 'CommonVoice',
    url: 'https://voice.mozilla.org/en/datasets', // Lien landing, à adapter pour version directe
    out: path.join(__dirname, '../data/CommonVoice/'),
    format: 'tar',
    note: 'Téléchargement manuel recommandé pour Common Voice (licence)',
  },
];

function downloadAndExtractGz(url, outPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const dest = fs.createWriteStream(outPath.replace(/\.gz$/, ''));
      pipeline(res, createGunzip(), dest, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

async function ingestOpenSubtitles() {
  const corpus = CORPORA[0];
  const gzPath = corpus.out + '.gz';
  if (!fs.existsSync(corpus.out)) {
    console.log(`Téléchargement de ${corpus.name}...`);
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(gzPath);
      https.get(corpus.url, (res) => {
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      });
    });
    console.log('Décompression...');
    await downloadAndExtractGz(corpus.url, gzPath);
    fs.unlinkSync(gzPath);
    console.log('Ingestion terminée:', corpus.out);
  } else {
    console.log(`${corpus.name} déjà présent.`);
  }
}

async function main() {
  await ingestOpenSubtitles();
  // Pour Common Voice, recommander le téléchargement manuel (licence)
  console.log('Pour Common Voice, téléchargez le dump depuis https://voice.mozilla.org/en/datasets et placez-le dans data/CommonVoice/');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Script d'extraction récursive de tous les PDF (et autres formats) dans docs/cecr/pdf et sous-dossiers
// Gère PDF, DOCX, PPTX, TXT, MD, etc. et extrait le texte pour chaque fichier
// Place les extraits dans docs/cecr/extraits/ avec un nom unique
// Nécessite : pdf-parse, fs-extra, path, glob, (optionnel : mammoth, pptx-parser)

import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { extract as extractDOCX } from './extractors/docx.js';
import { extract as extractMD } from './extractors/md.js';
import { extract as extractPDF } from './extractors/pdf.js';
import { extract as extractPPTX } from './extractors/pptx.js';
import { extract as extractTXT } from './extractors/txt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.join(__dirname, '../docs/cecr/pdf');
const OUTPUT_DIR = path.join(__dirname, '../docs/cecr/extraits');

// Ajout du coréen à la liste des langues supportées
const supportedLanguages = [
  'fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'ru', 'zh', 'ar', 'tr', 'pl', 'uk', 'ja', 'th', 'vi', 'id', 'ms', 'hi', 'fa', 'he', 'el', 'sv', 'no', 'da', 'fi', 'hu', 'cs', 'ro', 'bg', 'hr', 'sr', 'sk', 'sl', 'et', 'lv', 'lt', 'ka', 'hy', 'az', 'kk', 'uz', 'mn', 'ko' // 'ko' pour le coréen
];

async function processAllDocs() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = await glob(PDF_DIR + '/**/*.{pdf,txt,md,docx,pptx}', { nocase: true, absolute: true });
  for (const file of files) {
    if (!file.startsWith(PDF_DIR)) {
      console.warn(`Fichier ignoré (hors docs/cecr/pdf) : ${file}`);
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    const rel = path.relative(PDF_DIR, file).replace(/\\|\//g, '_');
    let text = '';
    try {
      if (ext === '.pdf') text = await extractPDF(file);
      else if (ext === '.txt') text = await extractTXT(file);
      else if (ext === '.md') text = await extractMD(file);
      else if (ext === '.docx') text = await extractDOCX(file);
      else if (ext === '.pptx') text = await extractPPTX(file);
      else continue;
      const outPath = path.join(OUTPUT_DIR, rel.replace(ext, '.md'));
      await fs.writeFile(outPath, `# Extrait : ${rel}\n\n` + text);
      console.log(`Extrait : ${file} -> ${outPath}`);
    } catch (e) {
      console.warn(`Erreur sur ${file}:`, e.message);
    }
  }
  console.log('Extraction terminée.');
}

processAllDocs().catch(console.error);

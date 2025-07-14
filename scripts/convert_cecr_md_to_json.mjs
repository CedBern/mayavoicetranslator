// Script Node.js pour convertir tous les extraits Markdown CECR en fichiers JSON structurés pour usage applicatif/API
// Placez ce script dans scripts/ et lancez-le après extraction des PDF
// Dépendances : fs-extra, path

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTRACTS_DIR = path.join(__dirname, '../docs/cecr/extraits');
const OUTPUT_DIR = path.join(__dirname, '../docs/cecr/json');

function markdownToJson(md) {
  // Simple conversion : chaque ligne non vide devient un élément, titre = title, reste = content[]
  const lines = md.split(/\r?\n/).filter(Boolean);
  const title = lines[0].replace(/^# /, '').trim();
  const content = lines.slice(1);
  return { title, content };
}

async function processAllMarkdown() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = await fs.readdir(EXTRACTS_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const mdPath = path.join(EXTRACTS_DIR, file);
      const jsonPath = path.join(OUTPUT_DIR, file.replace('.md', '.json'));
      const md = await fs.readFile(mdPath, 'utf8');
      const json = markdownToJson(md);
      await fs.writeJson(jsonPath, json, { spaces: 2 });
      console.log(`Converti : ${file} -> ${jsonPath}`);
    }
  }
  console.log('Conversion Markdown -> JSON terminée.');
}

processAllMarkdown().catch(console.error);

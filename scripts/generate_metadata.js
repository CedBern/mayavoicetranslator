// Script Node.js pour générer les métadonnées en filtrant les documents confidentiels
import fs from 'fs-extra';
import path from 'path';

const EXTRACTS_DIR = path.join('docs', 'cecr', 'extraits');
const METADATA_DIR = path.join('docs', 'cecr', 'metadata');
const CONFIDENTIAL_LIST = path.join('confidential_docs.json');

async function main() {
  await fs.ensureDir(METADATA_DIR);
  const confidentialDocs = new Set(JSON.parse(await fs.readFile(CONFIDENTIAL_LIST, 'utf8')));
  const files = await fs.readdir(EXTRACTS_DIR);

  for (const file of files) {
    const ext = path.extname(file).slice(1);
    const base = path.basename(file);
    const isConfidential = confidentialDocs.has(base);
    if (isConfidential) continue;
    const filePath = path.join(EXTRACTS_DIR, file);
    const text = await fs.readFile(filePath, 'utf8');
    const metadata = {
      title: base,
      author: '',
      language: '',
      date: '',
      source: '',
      type: ext,
      rights: '',
      description: '',
      keywords: [],
      confidentiality: 'public',
      extractedTextSample: text.slice(0, 500)
    };
    await fs.writeJson(path.join(METADATA_DIR, base + '.metadata.json'), metadata, { spaces: 2 });
  }
  console.log('Génération des métadonnées terminée.');
}

main().catch(e => { console.error(e); process.exit(1); });

// Script d'automatisation pour extraire, convertir et indexer la documentation CECR (PDF/textes)
// Placez vos PDF dans le dossier 'docs/cecr/pdf/'
// Dépendances : pdf-parse, fs-extra, path, tesseract.js (pour OCR si besoin)

const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
// const Tesseract = require('tesseract.js'); // Décommentez si OCR nécessaire

const PDF_DIR = path.join(__dirname, 'docs', 'cecr', 'pdf');
const OUTPUT_DIR = path.join(__dirname, 'docs', 'cecr', 'extraits');
const INDEX_FILE = path.join(__dirname, 'docs', 'cecr', 'index-cecr.md');

async function extractTextFromPDF(pdfPath) {
  const dataBuffer = await fs.readFile(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Pour OCR sur images ou PDF scannés :
// async function extractTextWithOCR(imagePath) {
//   const { data: { text } } = await Tesseract.recognize(imagePath, 'fra');
//   return text;
// }

async function processAllPDFs() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = await fs.readdir(PDF_DIR);
  const indexEntries = [];

  for (const file of files) {
    if (file.endsWith('.pdf')) {
      const pdfPath = path.join(PDF_DIR, file);
      const baseName = path.basename(file, '.pdf');
      const outPath = path.join(OUTPUT_DIR, baseName + '.md');
      const text = await extractTextFromPDF(pdfPath);
      await fs.writeFile(outPath, `# Extrait CECR : ${baseName}\n\n` + text);
      indexEntries.push(`- [${baseName}](extraits/${baseName}.md)`);
      console.log(`Extrait : ${file} -> ${outPath}`);
    }
  }

  // Génération de l'index global
  const indexContent = '# Index CECR\n\n' + indexEntries.join('\n') + '\n';
  await fs.writeFile(INDEX_FILE, indexContent);
  console.log('Index généré :', INDEX_FILE);
}

processAllPDFs().catch(console.error);

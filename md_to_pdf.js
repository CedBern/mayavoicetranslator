// Script Node.js pour convertir un rapport Markdown en PDF (nécessite markdown-pdf)
// Usage : node md_to_pdf.js rapport_sprint.md rapport_sprint.pdf
// Installer la dépendance : npm install -g markdown-pdf

const { execSync } = require('child_process');
const [,, inputMd, outputPdf] = process.argv;
if (!inputMd || !outputPdf) {
  console.error('Usage: node md_to_pdf.js rapport_sprint.md rapport_sprint.pdf');
  process.exit(1);
}
try {
  execSync(`markdown-pdf "${inputMd}" -o "${outputPdf}"`, { stdio: 'inherit' });
  console.log('PDF généré :', outputPdf);
} catch (e) {
  console.error('Erreur lors de la génération du PDF :', e.message);
  process.exit(1);
}

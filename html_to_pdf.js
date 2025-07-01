// Script Node.js pour convertir dashboard.html en PDF (nécessite puppeteer)
// Usage : node html_to_pdf.js dashboard.html dashboard.pdf
// Installer puppeteer : npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const [,, inputHtml, outputPdf] = process.argv;
if (!inputHtml || !outputPdf) {
  console.error('Usage: node html_to_pdf.js dashboard.html dashboard.pdf');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(inputHtml), { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPdf, format: 'A4', printBackground: true });
  await browser.close();
  console.log('Dashboard PDF généré :', outputPdf);
})();

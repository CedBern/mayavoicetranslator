// Service d'intégration Tesseract OCR
// Usage : OCR multilingue, documents historiques
const Tesseract = require('tesseract.js');

async function ocrImage(imagePath, lang = 'fra') {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, lang);
    return text;
  } catch (err) {
    throw new Error('Erreur Tesseract: ' + err.message);
  }
}

module.exports = { ocrImage };

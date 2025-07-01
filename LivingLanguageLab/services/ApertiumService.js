// Service d'intégration Apertium
// Usage : traduction open source, langues minoritaires
const axios = require('axios');

async function translateApertium(text, langpair = 'fra-cat') {
  const url = `https://apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  try {
    const res = await axios.get(url);
    return res.data.responseData.translatedText;
  } catch (err) {
    throw new Error('Erreur Apertium: ' + err.message);
  }
}

module.exports = { translateApertium };

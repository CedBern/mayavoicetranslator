// Service d'intégration Wiktionary
// Usage : définitions, étymologie, multilingue
const axios = require('axios');

async function getWiktionaryDefinition(word, lang = 'fr') {
  const url = `https://${lang}.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&prop=extracts&format=json&origin=*`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur Wiktionary: ' + err.message);
  }
}

module.exports = { getWiktionaryDefinition };

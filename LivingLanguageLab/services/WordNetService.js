// Service d'intégration WordNet/Open Multilingual Wordnet
// Usage : synonymes, relations lexicales, multilingue
const axios = require('axios');

async function getWordNetSynonyms(word, lang = 'eng') {
  // Exemple d'appel à l'API Open Multilingual Wordnet (via http://compling.hss.ntu.edu.sg/omw/api/)
  const url = `https://compling.hss.ntu.edu.sg/omw/api/word/${lang}/${encodeURIComponent(word)}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur WordNet: ' + err.message);
  }
}

module.exports = { getWordNetSynonyms };

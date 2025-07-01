// Service d'intégration Tatoeba
// Usage : exemples de phrases, corpus d’entraînement
const axios = require('axios');

async function getTatoebaExamples(query, lang = 'fra') {
  const url = `https://tatoeba.org/eng/api_v0/search?from=${lang}&query=${encodeURIComponent(query)}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur Tatoeba: ' + err.message);
  }
}

module.exports = { getTatoebaExamples };

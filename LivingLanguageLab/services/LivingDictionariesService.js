// Service d'intégration Living Dictionaries
// Usage : dictionnaires multimédia pour langues en danger
const axios = require('axios');

async function getLivingDictionary(langCode) {
  const url = `https://api.livingdictionaries.app/api/v1/dictionaries/${langCode}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur Living Dictionaries: ' + err.message);
  }
}

module.exports = { getLivingDictionary };

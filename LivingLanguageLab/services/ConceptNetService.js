// Service d'intégration ConceptNet
// Usage : enrichissement sémantique, suggestions, synonymes
const axios = require('axios');

async function getConceptNetData(term, lang = 'fr') {
  const url = `https://api.conceptnet.io/c/${lang}/${encodeURIComponent(term)}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur ConceptNet: ' + err.message);
  }
}

module.exports = { getConceptNetData };

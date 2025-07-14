// Service d'intégration Mozilla Common Voice
// Usage : données vocales crowdsourcées, ASR multilingue
const axios = require('axios');

async function getCommonVoiceData(lang = 'fr') {
  const url = `https://commonvoice.mozilla.org/api/v1/${lang}/clips`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur Common Voice: ' + err.message);
  }
}

module.exports = { getCommonVoiceData };

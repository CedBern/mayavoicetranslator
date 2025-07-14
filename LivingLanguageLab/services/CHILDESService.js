// Service d'intégration CHILDES TalkBank
// Usage : corpus d’acquisition enfantine, analyse développementale
const axios = require('axios');

async function getChildesCorpus(lang = 'FRENCH') {
  const url = `https://childes.talkbank.org/access/${lang}/`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error('Erreur CHILDES: ' + err.message);
  }
}

module.exports = { getChildesCorpus };

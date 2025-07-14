// Service d'intégration Universal Dependencies
// Usage : annotation syntaxique automatique
// (Exemple : appel à un service local ou distant UDpipe, à adapter selon déploiement)
const axios = require('axios');

async function parseWithUDpipe(text, model = 'french-gsd') {
  // Remplacer par l'URL de votre instance UDPipe ou d'un service public
  const url = `http://localhost:8000/udpipe?model=${model}`;
  try {
    const res = await axios.post(url, { text });
    return res.data;
  } catch (err) {
    throw new Error('Erreur UDpipe: ' + err.message);
  }
}

module.exports = { parseWithUDpipe };

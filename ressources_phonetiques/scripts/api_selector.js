// api_selector.js
// Sélection dynamique et automatisée de l’API externe la plus adaptée selon le contexte

const apis = {
  speech: [
    { name: 'Deepgram', url: 'https://api.deepgram.com', langue: 'all', cout: 1, rgpd: true },
    { name: 'GoogleSpeech', url: 'https://speech.googleapis.com', langue: 'all', cout: 2, rgpd: false },
    { name: 'WhisperLocal', url: 'local', langue: 'all', cout: 0, rgpd: true }
  ],
  translate: [
    { name: 'DeepL', url: 'https://api.deepl.com', langue: 'eu', cout: 1, rgpd: true },
    { name: 'GoogleTranslate', url: 'https://translation.googleapis.com', langue: 'all', cout: 2, rgpd: false },
    { name: 'LibreTranslate', url: 'local', langue: 'all', cout: 0, rgpd: true }
  ]
  // ...autres catégories
};

function selectAPI(type, langue, maxCout = 2, rgpdRequired = true) {
  const candidates = apis[type].filter(api =>
    (api.langue === 'all' || (api.langue === 'eu' && langue === 'fr')) &&
    api.cout <= maxCout &&
    (!rgpdRequired || api.rgpd)
  );
  return candidates.length ? candidates[0] : null;
}

module.exports = { selectAPI };

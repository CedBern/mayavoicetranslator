// Exemple d'appel à getSmartSuggestions dans un script Node.js
const semanticSearchService = require('./services/SemanticSearchService').default;

(async () => {
  await semanticSearchService.initialize();
  const query = 'bonjour';
  const targetLanguage = 'en';
  const suggestions = await semanticSearchService.getSmartSuggestions(query, targetLanguage, 7);
  console.log('Suggestions multilingues enrichies :');
  suggestions.forEach(s => {
    console.log(`- [${s.source || s.method || 'local'}] ${s.text} (score: ${s.relevanceScore})`);
  });
})();

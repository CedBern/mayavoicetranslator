import { fetchLocalCorpusSuggestions } from '../services/ExternalSourcesService.js';

(async () => {
  const query = 'Merci beaucoup';
  const sourceLang = 'fr';
  const targetLang = 'br';
  const results = await fetchLocalCorpusSuggestions(query, sourceLang, targetLang);
  console.log('Résultats pour "Merci beaucoup" (fr→br):', results);
})();

// Logique de suggestions sémantiques intelligentes (fusion, déduplication, tri)
// Extraction pour testabilité et robustesse

/**
 * Fusionne, déduplique et trie des suggestions sémantiques/textuelles.
 * @param {Array} semanticResults - Suggestions issues de la recherche sémantique (doivent avoir .text et .relevanceScore)
 * @param {Array} textualMatches - Suggestions issues de la recherche textuelle (doivent avoir .text et .relevanceScore)
 * @param {number} [maxSuggestions=5] - Nombre maximum de suggestions à retourner
 * @returns {Array} Suggestions uniques triées par pertinence
 */
export function getSmartSuggestions(semanticResults, textualMatches, maxSuggestions = 5) {
  const allResults = [...semanticResults, ...textualMatches];
  const uniqueResults = [];
  const seen = new Set();

  for (const result of allResults) {
    if (result && result.text && !seen.has(result.text)) {
      seen.add(result.text);
      uniqueResults.push(result);
    }
  }

  uniqueResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return uniqueResults.slice(0, maxSuggestions);
}

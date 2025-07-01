// Tests unitaires pour la logique de suggestions sémantiques intelligentes
const { getSmartSuggestions } = require('./semanticSuggestions');

describe('getSmartSuggestions', () => {
  it('fusionne et trie les suggestions par pertinence', () => {
    const semantic = [
      { text: 'A', relevanceScore: 0.9 },
      { text: 'B', relevanceScore: 0.7 }
    ];
    const textual = [
      { text: 'C', relevanceScore: 0.8 },
      { text: 'D', relevanceScore: 0.6 }
    ];
    const result = getSmartSuggestions(semantic, textual, 4);
    expect(result.map(r => r.text)).toEqual(['A', 'C', 'B', 'D']);
  });

  it('déduplique les suggestions sur le texte', () => {
    const semantic = [
      { text: 'A', relevanceScore: 0.9 },
      { text: 'B', relevanceScore: 0.7 }
    ];
    const textual = [
      { text: 'A', relevanceScore: 0.8 },
      { text: 'C', relevanceScore: 0.6 }
    ];
    const result = getSmartSuggestions(semantic, textual, 5);
    expect(result.map(r => r.text)).toEqual(['A', 'B', 'C']);
  });

  it('limite le nombre de suggestions à maxSuggestions', () => {
    const semantic = [
      { text: 'A', relevanceScore: 0.9 },
      { text: 'B', relevanceScore: 0.8 },
      { text: 'C', relevanceScore: 0.7 }
    ];
    const textual = [
      { text: 'D', relevanceScore: 0.6 },
      { text: 'E', relevanceScore: 0.5 }
    ];
    const result = getSmartSuggestions(semantic, textual, 3);
    expect(result.length).toBe(3);
    expect(result.map(r => r.text)).toEqual(['A', 'B', 'C']);
  });

  it('gère les entrées vides ou nulles', () => {
    const semantic = [null, { text: 'A', relevanceScore: 0.9 }];
    const textual = [undefined, { text: 'B', relevanceScore: 0.8 }];
    const result = getSmartSuggestions(semantic, textual, 2);
    expect(result.map(r => r.text)).toEqual(['A', 'B']);
  });
});

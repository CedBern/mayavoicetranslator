// Tests unitaires pour la logique de scoring de pertinence
const { calculateRelevanceScore } = require('./relevanceScoring');

describe('calculateRelevanceScore', () => {
  it('donne un score de base égal à la similarité + bonus longueur', () => {
    const doc = { text: 'bonjour', language: 'fr', category: 'general', translation: { es: 'hola' } };
    // longueur query = 5, doc.text = 7 => ratio = 5/7 ≈ 0.714, bonus = 0.0714
    const expected = 0.7 + (5/7)*0.1;
    expect(calculateRelevanceScore(0.7, doc, 'salut', 'en')).toBeCloseTo(expected, 2);
  });

  it('ajoute un bonus pour langue exacte', () => {
    const doc = { text: 'bonjour', language: 'fr', category: 'general', translation: { fr: 'bonjour' } };
    expect(calculateRelevanceScore(0.6, doc, 'bonjour', 'fr')).toBeGreaterThan(0.6);
  });

  it('ajoute un bonus pour longueur similaire', () => {
    const doc = { text: 'salut', language: 'fr', category: 'general', translation: { fr: 'salut' } };
    // longueur query = 5, doc.text = 5 => ratio = 1
    expect(calculateRelevanceScore(0.5, doc, 'salut', 'fr')).toBeGreaterThan(0.5);
  });

  it('ajoute un bonus pour catégorie pertinente', () => {
    const doc = { text: 'hola', language: 'es', category: 'greeting', translation: { fr: 'bonjour' } };
    expect(calculateRelevanceScore(0.5, doc, 'bonjour', 'fr')).toBeGreaterThan(0.5);
  });

  it('ajoute un bonus si traduction dans la langue cible', () => {
    const doc = { text: 'hello', language: 'en', category: 'general', translation: { fr: 'bonjour' } };
    expect(calculateRelevanceScore(0.4, doc, 'bonjour', 'fr')).toBeGreaterThan(0.4);
  });

  it('ajoute un bonus pour correspondance exacte du texte', () => {
    const doc = { text: 'salut', language: 'fr', category: 'general', translation: { es: 'hola' } };
    expect(calculateRelevanceScore(0.3, doc, 'salut', 'fr')).toBeGreaterThan(0.3);
  });

  it('clamp le score à 1.2 max', () => {
    const doc = { text: 'test', language: 'fr', category: 'special', translation: { fr: 'test' } };
    // Simule tous les bonus cumulés
    expect(calculateRelevanceScore(1.1, doc, 'test', 'fr')).toBeLessThanOrEqual(1.2);
  });

  it('ne descend jamais sous 0', () => {
    const doc = { text: 'irrelevant', language: 'en', category: 'general', translation: {} };
    expect(calculateRelevanceScore(-0.5, doc, 'foo', 'fr')).toBeGreaterThanOrEqual(0);
  });
});

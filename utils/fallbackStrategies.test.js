// Tests unitaires pour la logique de fallback multi-niveaux
const { fallbackCascade } = require('./fallbackStrategies');

describe('fallbackCascade', () => {
  it('retourne le premier résultat valide', async () => {
    const strategies = [
      async () => null,
      async () => undefined,
      async () => 'ok',
      async () => 'should not be called'
    ];
    const result = await fallbackCascade(strategies);
    expect(result).toBe('ok');
  });

  it('retourne null si aucune stratégie ne réussit', async () => {
    const strategies = [
      async () => null,
      async () => undefined
    ];
    const result = await fallbackCascade(strategies);
    expect(result).toBeNull();
  });

  it('ignore les erreurs et continue', async () => {
    const strategies = [
      async () => { throw new Error('fail'); },
      async () => 'success'
    ];
    const result = await fallbackCascade(strategies);
    expect(result).toBe('success');
  });

  it('utilise un validateur personnalisé', async () => {
    const strategies = [
      async () => 0,
      async () => 1,
      async () => 2
    ];
    const isValid = r => r > 1;
    const result = await fallbackCascade(strategies, isValid);
    expect(result).toBe(2);
  });
});

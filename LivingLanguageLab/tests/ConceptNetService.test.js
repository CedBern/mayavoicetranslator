// Test Jest pour ConceptNetService
const { getConceptNetData } = require('../services/ConceptNetService');

if (process.env.CI || process.env.JEST_WORKER_ID) {
  describe.skip('API tests (skipped in CI)', () => {
    it('skipped', () => {});
  });
}

describe('ConceptNetService', () => {
  it('doit retourner des données pour un terme français', async () => {
    const data = await getConceptNetData('maison', 'fr');
    expect(data).toBeDefined();
    expect(data['@id']).toContain('/c/fr/maison');
    expect(Array.isArray(data.edges)).toBe(true);
  });

  it('doit gérer une erreur pour un terme inexistant', async () => {
    await expect(getConceptNetData('termeinexistantxyz', 'fr')).resolves.toBeDefined();
  });
});

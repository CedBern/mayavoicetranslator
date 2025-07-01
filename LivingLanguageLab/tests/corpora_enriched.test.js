// Tests Jest/Supertest pour les endpoints enrichis de corpus
const request = require('supertest');
const express = require('express');
const corporaRouter = require('../endpoints/corpora');

const app = express();
app.use(express.json());
app.use('/corpora', corporaRouter);

if (process.env.CI || process.env.JEST_WORKER_ID) {
  describe.skip('API tests (skipped in CI)', () => {
    it('skipped', () => {});
  });
}

describe('LivingLanguageLab - Endpoints corpus enrichis', () => {
  it('recherche avancée par langue', async () => {
    const res = await request(app).get('/corpora/search?lang=fr');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].languages).toContain('fr');
  });

  it('recherche avancée par taille minimale', async () => {
    const res = await request(app).get('/corpora/search?minSize=100');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].size).toBeGreaterThanOrEqual(100);
  });

  it('recherche avancée par mot-clé', async () => {
    const res = await request(app).get('/corpora/search?keyword=collaboratif');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].description).toMatch(/collaboratif/i);
  });

  it('récupère les métadonnées enrichies', async () => {
    const res = await request(app).get('/corpora/tatoeba/metadata');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('contributors');
    expect(res.body).toHaveProperty('validationStatus');
    expect(res.body).toHaveProperty('ethicalReview', true);
  });
});

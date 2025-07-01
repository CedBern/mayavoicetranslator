// Test basique du handler LivingLanguageLab/corpora (Jest + supertest)
const request = require('supertest');
const express = require('express');
const corporaRouter = require('../endpoints/corpora');

if (process.env.CI || process.env.JEST_WORKER_ID) {
  describe.skip('API tests (skipped in CI)', () => {
    it('skipped', () => {});
  });
}

describe('LivingLanguageLab API - /corpora', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/corpora', corporaRouter);
  });

  it('GET /corpora should return array', async () => {
    const res = await request(app).get('/corpora');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /corpora should add a corpus', async () => {
    const res = await request(app).post('/corpora').send({
      id: 'testcorpus',
      name: 'Test Corpus',
      description: 'Corpus de test',
      languages: ['fr'],
      size: 123
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe('testcorpus');
  });
});

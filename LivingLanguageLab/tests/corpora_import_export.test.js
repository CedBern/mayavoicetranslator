// Tests Jest/Supertest pour les endpoints d'import/export de corpus
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

describe('LivingLanguageLab - Import/Export corpus', () => {
  const testCorpus = {
    id: 'importtest',
    name: 'Corpus Import Test',
    description: 'Corpus importé pour test',
    languages: ['fr', 'oc'],
    size: 42
  };

  it('importe un nouveau corpus', async () => {
    const res = await request(app)
      .post('/corpora/import')
      .send({ corpus: testCorpus });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('exporte le corpus importé', async () => {
    const res = await request(app).get('/corpora/export/importtest');
    expect(res.statusCode).toBe(200);
    expect(res.body.corpus).toHaveProperty('id', 'importtest');
    expect(res.body.corpus.name).toBe('Corpus Import Test');
  });
});

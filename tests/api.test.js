// tests/api.test.js
// Squelette de tests pour l'API MayaVoiceTranslator

const request = require('supertest');
const app = require('../api-server'); // Adapter si le point d'entrée diffère

describe('API MayaVoiceTranslator', () => {
  it('GET /health doit répondre 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/auth/login doit refuser credentials invalides', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@user.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  // Ajouter d'autres tests selon les endpoints critiques
});

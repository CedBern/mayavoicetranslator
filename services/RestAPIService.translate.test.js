import request from 'supertest';
import { RestAPIService } from './RestAPIService.js';

// JWT premium valide pour l'utilisateur 'admin' (premium)
const premiumToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicHJlbWl1bSI6dHJ1ZSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMDY2MzkyLCJleHAiOjE3NTEwNjk5OTJ9.mQBFHwLbGVVt1vovMnHEi0Tg-9-Sdj6UVu9Bo8UH0bRQ';

describe('RestAPIService - /api/translate', () => {
    let app;
    let server;

    beforeAll(async () => {
        const api = new RestAPIService();
        app = api.app;
        server = app.listen(0);
    });

    afterAll(async () => {
        if (server) server.close();
    });

    it('POST /api/translate should reject unauthenticated', async () => {
        const res = await request(app)
            .post('/api/translate')
            .send({ text: 'Bonjour', fromLang: 'fr', toLang: 'en' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /api/translate should reject missing params', async () => {
        const res = await request(app)
            .post('/api/translate')
            .set('Authorization', 'Bearer ' + premiumToken)
            .send({ text: 'Bonjour', fromLang: 'fr' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /api/translate should return clarification for short/ambiguous input', async () => {
        const res = await request(app)
            .post('/api/translate')
            .set('Authorization', 'Bearer ' + premiumToken)
            .send({ text: 'ok', fromLang: 'fr', toLang: 'en' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('message');
    });
});

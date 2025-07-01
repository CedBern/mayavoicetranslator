import request from 'supertest';
import { RestAPIService } from './RestAPIService.js';

// JWT premium valide pour l'utilisateur 'admin' (premium)
const premiumToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicHJlbWl1bSI6dHJ1ZSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMDY2MzkyLCJleHAiOjE3NTEwNjk5OTJ9.mQBFHwLbGVVt1vovMnHEi0Tg-9-Sdj6UVu9Bo8UH0bRQ';

describe('RestAPIService - /api/suggestions', () => {
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

    it('GET /api/suggestions should reject unauthenticated', async () => {
        const res = await request(app)
            .get('/api/suggestions?text=Bonjour&language=fr')
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /api/suggestions should return suggestions for valid request', async () => {
        const res = await request(app)
            .get('/api/suggestions?text=Bonjour&language=fr')
            .set('Authorization', 'Bearer ' + premiumToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('suggestions');
        expect(Array.isArray(res.body.suggestions)).toBe(true);
    });

    it('GET /api/suggestions should return clarification for short/ambiguous input', async () => {
        const res = await request(app)
            .get('/api/suggestions?text=ok&language=fr')
            .set('Authorization', 'Bearer ' + premiumToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.suggestions[0]).toMatch(/incomplète|exemple/i);
    });
});

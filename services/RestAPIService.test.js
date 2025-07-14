import request from 'supertest';
import { RestAPIService } from './RestAPIService.js';

// JWT premium valide pour l'utilisateur 'admin' (premium)
const premiumToken = '<FAKE_JWT_TOKEN>';

describe('RestAPIService', () => {
    let app;
    let server;

    beforeAll(async () => {
        const api = new RestAPIService();
        app = api.app;
        server = app.listen(0); // port aléatoire
    });

    afterAll(async () => {
        if (server) server.close();
    });

    it('GET /api/status should return status 200 and expected fields', async () => {
        // Utilise un JWT premium valide
        const res = await request(app)
            .get('/api/status')
            .set('Authorization', 'Bearer ' + premiumToken)
            .expect(200);
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('uptime');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('memory');
        expect(res.body).toHaveProperty('quotas');
    });
    it('GET /api/usage/paid should return usage summary (even if log is empty)', async () => {
        const res = await request(app)
            .get('/api/usage/paid')
            .set('Authorization', 'Bearer ' + premiumToken)
            .expect(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('usage');
        expect(res.body).toHaveProperty('summary');
        // Optionally: check structure of summary
        expect(typeof res.body.summary).toBe('object');
    });
});

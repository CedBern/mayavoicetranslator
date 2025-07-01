// Tests Jest/Supertest pour les endpoints enrichis enfants (recherche avancée, feedback communautaire)
const request = require('supertest');
const express = require('express');
const childrenRoutes = require('../endpoints/children');

const app = express();
app.use(express.json());
app.use('/children', childrenRoutes);

if (process.env.CI || process.env.JEST_WORKER_ID) {
  describe.skip('API tests (skipped in CI)', () => {
    it('skipped', () => {});
  });
}

describe('LivingLanguageLab - Endpoints enfants enrichis', () => {
  it('recherche avancée d’activités par intérêt', async () => {
    const res = await request(app).get('/children/activities/search?interest=sonore');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toMatch(/sonore/i);
  });

  it('recherche avancée d’activités par âge', async () => {
    const res = await request(app).get('/children/activities/search?age=6');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].recommendedAge).toBe('child');
  });

  it('feedback communautaire sur une activité', async () => {
    const res = await request(app)
      .post('/children/activities/act1/community-feedback')
      .send({
        childId: 'child_test',
        feedback: 'Activité très appréciée',
        validated: true,
        contributor: 'parent'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.activityId).toBe('act1');
    expect(res.body.validated).toBe(true);
    expect(res.body.contributor).toBe('parent');
  });
});

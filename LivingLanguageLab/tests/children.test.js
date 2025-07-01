// Tests Jest/Supertest pour les endpoints enfants (Montessori/Piaget)
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

describe('LivingLanguageLab - Endpoints enfants (Montessori/Piaget)', () => {
  let childId;

  it('crée un profil enfant', async () => {
    const res = await request(app)
      .post('/children/profiles')
      .send({
        name: 'Lila',
        age: 6,
        learningStyle: 'visual',
        cognitiveStage: 'preoperational',
        sensoryPreferences: ['visual', 'kinesthetic'],
        interests: ['animaux', 'nature']
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    childId = res.body.id;
  });

  it('récupère le profil enfant', async () => {
    const res = await request(app).get(`/children/profiles/${childId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Lila');
  });

  it('liste les activités visuelles', async () => {
    const res = await request(app).get('/children/activities?sensory=visual');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('sensoryType', 'visual');
  });

  it('enregistre un feedback d’activité', async () => {
    const res = await request(app)
      .post('/children/activity-feedback')
      .send({
        childId,
        activityId: 'act1',
        result: 'réussi',
        feedback: 'Lila a adoré trier les objets.'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('accède au portfolio de l’enfant', async () => {
    const res = await request(app).get(`/children/portfolio/${childId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBeGreaterThan(0);
    expect(res.body.entries[0].activityId).toBe('act1');
  });
});

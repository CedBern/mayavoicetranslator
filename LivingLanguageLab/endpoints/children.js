// Handlers Express.js pour les endpoints enfants (Montessori/Piaget)
const express = require('express');
const router = express.Router();

// Stockage en mémoire (à remplacer par une base de données réelle)
const childProfiles = {};
const activities = [
  {
    id: 'act1',
    title: 'Tri sensoriel',
    description: 'Classer des objets par couleur, forme ou texture',
    sensoryType: 'visual',
    cognitiveStage: 'preoperational',
    recommendedAge: 'child',
    materials: ['objets colorés', 'boîtes']
  },
  {
    id: 'act2',
    title: 'Jeu d’association sonore',
    description: 'Associer des sons à des images',
    sensoryType: 'auditory',
    cognitiveStage: 'concrete',
    recommendedAge: 'child',
    materials: ['cartes images', 'enregistrements audio']
  }
];
const portfolios = {};

// POST /children/profiles
router.post('/profiles', (req, res) => {
  const id = `child_${Date.now()}`;
  const profile = { id, ...req.body, createdAt: new Date().toISOString() };
  childProfiles[id] = profile;
  res.status(201).json(profile);
});

// GET /children/profiles/:id
router.get('/profiles/:id', (req, res) => {
  const profile = childProfiles[req.params.id];
  if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });
  res.json(profile);
});

// GET /children/activities
router.get('/activities', (req, res) => {
  const { sensory, stage } = req.query;
  let filtered = activities;
  if (sensory) filtered = filtered.filter(a => a.sensoryType === sensory);
  if (stage) filtered = filtered.filter(a => a.cognitiveStage === stage);
  res.json(filtered);
});

// GET /children/portfolio/:id
router.get('/portfolio/:id', (req, res) => {
  const portfolio = portfolios[req.params.id];
  if (!portfolio) return res.status(404).json({ error: 'Portfolio non trouvé' });
  res.json(portfolio);
});

// POST /children/activity-feedback
router.post('/activity-feedback', (req, res) => {
  const { childId, activityId, result, feedback } = req.body;
  if (!portfolios[childId]) {
    portfolios[childId] = { id: `portfolio_${childId}`, childId, entries: [] };
  }
  portfolios[childId].entries.push({
    date: new Date().toISOString(),
    activityId,
    result,
    feedback
  });
  res.status(201).json({ success: true });
});

// Recherche avancée d’activités par intérêt ou âge
// GET /activities/search?interest=animaux&age=6
router.get('/activities/search', (req, res) => {
  let filtered = activities;
  if (req.query.interest) {
    const kw = req.query.interest.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title && a.title.toLowerCase().includes(kw)) ||
      (a.description && a.description.toLowerCase().includes(kw))
    );
  }
  if (req.query.age) {
    // Ex : filtrage simple par recommendedAge (à adapter selon logique réelle)
    if (req.query.age < 8) filtered = filtered.filter(a => a.recommendedAge === 'child');
    if (req.query.age >= 8) filtered = filtered.filter(a => a.recommendedAge !== 'child');
  }
  res.json(filtered);
});

// Endpoint de feedback communautaire/validation
// POST /activities/:id/community-feedback
router.post('/activities/:id/community-feedback', (req, res) => {
  const { childId, feedback, validated, contributor } = req.body;
  // Stockage simplifié (à remplacer par une vraie base)
  if (!activities.find(a => a.id === req.params.id)) return res.status(404).json({ error: 'Activité non trouvée' });
  // Ici, on pourrait stocker le feedback dans un tableau global ou l’activité
  // Pour la démo, on retourne juste l’objet
  res.status(201).json({
    activityId: req.params.id,
    childId,
    feedback,
    validated: !!validated,
    contributor: contributor || 'anonyme',
    date: new Date().toISOString()
  });
});

module.exports = router;

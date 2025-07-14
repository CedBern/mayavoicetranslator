// Express.js handler pour LivingLanguageLab - gestion des corpus
const express = require('express');
const router = express.Router();

// Mock temporaire (à remplacer par une vraie base ou un fichier)
let corpora = [
  {
    id: 'tatoeba',
    name: 'Tatoeba',
    description: 'Corpus multilingue collaboratif',
    languages: ['fr', 'en', 'es', 'oc'],
    size: 1000000,
    updatedAt: new Date().toISOString()
  }
];

// GET /corpora - liste des corpus
router.get('/', (req, res) => {
  res.json(corpora);
});

// GET /corpora/:id - détail d’un corpus
router.get('/:id', (req, res) => {
  const corpus = corpora.find(c => c.id === req.params.id);
  if (!corpus) return res.status(404).json({ error: 'Corpus not found' });
  res.json(corpus);
});

// POST /corpora - ajout d’un corpus
router.post('/', (req, res) => {
  const { id, name, description, languages, size } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'Missing id or name' });
  if (corpora.find(c => c.id === id)) return res.status(409).json({ error: 'Corpus already exists' });
  const corpus = { id, name, description, languages, size, updatedAt: new Date().toISOString() };
  corpora.push(corpus);
  res.status(201).json(corpus);
});

// PUT /corpora/:id - mise à jour d’un corpus
router.put('/:id', (req, res) => {
  const corpus = corpora.find(c => c.id === req.params.id);
  if (!corpus) return res.status(404).json({ error: 'Corpus not found' });
  Object.assign(corpus, req.body, { updatedAt: new Date().toISOString() });
  res.json(corpus);
});

// DELETE /corpora/:id - suppression d’un corpus
router.delete('/:id', (req, res) => {
  const idx = corpora.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Corpus not found' });
  corpora.splice(idx, 1);
  res.status(204).end();
});

// Recherche avancée, filtrage et métadonnées enrichies
// GET /corpora/search?lang=xx&minSize=1000&keyword=mot
router.get('/search', (req, res) => {
  let results = corpora;
  if (req.query.lang) {
    results = results.filter(c => c.languages.includes(req.query.lang));
  }
  if (req.query.minSize) {
    results = results.filter(c => c.size >= parseInt(req.query.minSize));
  }
  if (req.query.keyword) {
    const kw = req.query.keyword.toLowerCase();
    results = results.filter(c =>
      (c.name && c.name.toLowerCase().includes(kw)) ||
      (c.description && c.description.toLowerCase().includes(kw))
    );
  }
  res.json(results);
});

// Ajout d’un endpoint pour métadonnées détaillées
// GET /corpora/:id/metadata
router.get('/:id/metadata', (req, res) => {
  const corpus = corpora.find(c => c.id === req.params.id);
  if (!corpus) return res.status(404).json({ error: 'Corpus not found' });
  // Exemple de métadonnées enrichies
  const metadata = {
    ...corpus,
    contributors: [
      { name: 'Alice', role: 'linguist', validated: true },
      { name: 'Bob', role: 'native speaker', validated: false }
    ],
    validationStatus: 'in_review',
    tags: ['multilingue', 'collaboratif'],
    sources: ['Tatoeba', 'Wiktionary'],
    ethicalReview: true
  };
  res.json(metadata);
});

// Endpoint d’import/export de corpus (simplifié)
// POST /corpora/import
router.post('/import', (req, res) => {
  const { corpus } = req.body;
  if (!corpus || !corpus.id) return res.status(400).json({ error: 'Corpus invalide' });
  if (corpora.find(c => c.id === corpus.id)) return res.status(409).json({ error: 'Corpus déjà existant' });
  corpora.push({ ...corpus, updatedAt: new Date().toISOString() });
  res.status(201).json({ success: true });
});

// GET /corpora/export/:id
router.get('/export/:id', (req, res) => {
  const corpus = corpora.find(c => c.id === req.params.id);
  if (!corpus) return res.status(404).json({ error: 'Corpus not found' });
  res.json({ corpus });
});

module.exports = router;

// api-router.js
// Routeur principal pour centraliser toutes les APIs du projet MayaVoiceTranslator
// Permet la mutualisation, l’interopérabilité et la documentation future

const express = require('express');
const router = express.Router();

// Exemple d’import de modules (à adapter selon vos services)
// const corpusModule = require('./services/CorpusService');
// const annotationModule = require('./services/AnnotationService');
// const suggestionsModule = require('./services/SuggestionsService');
// const analyticsModule = require('./services/AnalyticsService');

// --- Corpus ---
router.get('/corpus', (req, res) => {
  // TODO: Récupérer la liste des corpus depuis la base ou un service
  res.json({ status: 'ok', data: [/* ... */] });
});
router.post('/corpus', (req, res) => {
  // TODO: Ajouter un corpus
  res.json({ status: 'ok', message: 'Corpus ajouté' });
});

// --- Annotation ---
router.get('/annotations', (req, res) => {
  // TODO: Récupérer les annotations
  res.json({ status: 'ok', data: [/* ... */] });
});
router.post('/annotations', (req, res) => {
  // TODO: Enregistrer une annotation
  res.json({ status: 'ok', message: 'Annotation enregistrée' });
});

// --- Suggestions ---
router.get('/suggestions', (req, res) => {
  // TODO: Récupérer suggestions
  res.json({ status: 'ok', data: [/* ... */] });
});

// --- Analytics ---
router.get('/analytics', (req, res) => {
  // TODO: Statistiques globales
  res.json({ status: 'ok', data: { /* ... */ } });
});

// --- Extension facile ---
// Ajoutez ici d’autres modules (TTS, utilisateurs, gouvernance, etc.)

module.exports = router;

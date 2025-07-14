// Endpoints REST pour l'orchestration des APIs scientifiques et linguistiques
const express = require('express');
const router = express.Router();

const ConceptNet = require('../services/ConceptNetService');
const WordNet = require('../services/WordNetService');
const Tatoeba = require('../services/TatoebaService');
const Apertium = require('../services/ApertiumService');
const Wiktionary = require('../services/WiktionaryService');
const CLIPSPhonology = require('../services/CLIPSPhonologyService');
const UniversalDependencies = require('../services/UniversalDependenciesService');
const TextStat = require('../services/TextStatService');
const Tesseract = require('../services/TesseractService');
const HuggingFace = require('../services/HuggingFaceService');
const ElasticSearch = require('../services/ElasticSearchService');
const CHILDES = require('../services/CHILDESService');
const LivingDictionaries = require('../services/LivingDictionariesService');
const MozillaCommonVoice = require('../services/MozillaCommonVoiceService');

// Exemple de middleware d'authentification (à adapter)
function requireAuth(req, res, next) {
  // if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  next();
}

// ConceptNet
router.get('/semantics/conceptnet', requireAuth, async (req, res) => {
  try {
    const { term, lang } = req.query;
    const data = await ConceptNet.getConceptNetData(term, lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WordNet
router.get('/lexicon/wordnet', requireAuth, async (req, res) => {
  try {
    const { word, lang } = req.query;
    const data = await WordNet.getWordNetSynonyms(word, lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tatoeba
router.get('/examples/tatoeba', requireAuth, async (req, res) => {
  try {
    const { query, lang } = req.query;
    const data = await Tatoeba.getTatoebaExamples(query, lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apertium
router.get('/translate/apertium', requireAuth, async (req, res) => {
  try {
    const { text, langpair } = req.query;
    const data = await Apertium.translateApertium(text, langpair);
    res.json({ translated: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Wiktionary
router.get('/lexicon/wiktionary', requireAuth, async (req, res) => {
  try {
    const { word, lang } = req.query;
    const data = await Wiktionary.getWiktionaryDefinition(word, lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLIPS Phonology
router.get('/phonology/clips', requireAuth, async (req, res) => {
  try {
    const { text, lang } = req.query;
    const data = await CLIPSPhonology.phonemizeText(text, lang);
    res.json({ phonemes: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Universal Dependencies
router.post('/syntax/udpipe', requireAuth, async (req, res) => {
  try {
    const { text, model } = req.body;
    const data = await UniversalDependencies.parseWithUDpipe(text, model);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TextStat
router.post('/readability/textstat', requireAuth, (req, res) => {
  try {
    const { text } = req.body;
    const data = TextStat.getReadabilityMetrics(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tesseract OCR
router.post('/ocr/tesseract', requireAuth, async (req, res) => {
  try {
    const { imagePath, lang } = req.body;
    const data = await Tesseract.ocrImage(imagePath, lang);
    res.json({ text: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hugging Face
router.post('/inference/huggingface', requireAuth, async (req, res) => {
  try {
    const { model, inputs, apiKey } = req.body;
    const data = await HuggingFace.queryHuggingFace(model, inputs, apiKey);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ElasticSearch
router.post('/search/elasticsearch', requireAuth, async (req, res) => {
  try {
    const { index, query } = req.body;
    const data = await ElasticSearch.searchIndex(index, query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHILDES
router.get('/corpus/childes', requireAuth, async (req, res) => {
  try {
    const { lang } = req.query;
    const data = await CHILDES.getChildesCorpus(lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Living Dictionaries
router.get('/lexicon/livingdictionaries', requireAuth, async (req, res) => {
  try {
    const { langCode } = req.query;
    const data = await LivingDictionaries.getLivingDictionary(langCode);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mozilla Common Voice
router.get('/asr/commonvoice', requireAuth, async (req, res) => {
  try {
    const { lang } = req.query;
    const data = await MozillaCommonVoice.getCommonVoiceData(lang);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

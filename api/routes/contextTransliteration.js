// routes/contextTransliteration.js
// Endpoints API pour analyse contextuelle et translittération

import express from 'express';
import { analyzeContext, transliterateText } from '../services/contextTransliterationService.js';

const router = express.Router();

// POST /api/context/analyze
router.post('/analyze', async (req, res) => {
  try {
    const input = req.body;
    const context = await analyzeContext(input);
    res.json({ context });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/context/transliterate
router.post('/transliterate', async (req, res) => {
  try {
    const { text, context } = req.body;
    const result = await transliterateText(text, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

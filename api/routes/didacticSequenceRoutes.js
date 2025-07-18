const express = require('express');
const router = express.Router();
const { createDidacticSequence, getDidacticSequences, getDidacticSequenceById, updateDidacticSequence, deleteDidacticSequence } = require('../controllers/didacticSequenceController');
const { protect, hasRole } = require('../middleware/authMiddleware');

// CRUD Séquences didactiques
router.post('/', protect, createDidacticSequence);
router.get('/', getDidacticSequences);
router.get('/:id', getDidacticSequenceById);
router.put('/:id', protect, hasRole(['admin', 'owner']), updateDidacticSequence);
router.delete('/:id', protect, hasRole(['admin', 'owner']), deleteDidacticSequence);

module.exports = router;

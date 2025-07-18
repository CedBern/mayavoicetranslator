const DidacticSequence = require('../models/DidacticSequence');

// Créer une séquence didactique
exports.createDidacticSequence = async (req, res) => {
  try {
    const { title, description, culturalElements, learningObjectives, activities } = req.body;
    const ownerId = req.user.id;
    const sequence = await DidacticSequence.create({
      title, description, culturalElements, learningObjectives, activities, ownerId
    });
    res.status(201).json(sequence);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer toutes les séquences didactiques
exports.getDidacticSequences = async (req, res) => {
  try {
    const sequences = await DidacticSequence.findAll();
    res.json(sequences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer une séquence didactique par ID
exports.getDidacticSequenceById = async (req, res) => {
  try {
    const sequence = await DidacticSequence.findByPk(req.params.id);
    if (!sequence) return res.status(404).json({ error: 'Not found' });
    res.json(sequence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une séquence didactique
exports.updateDidacticSequence = async (req, res) => {
  try {
    const sequence = await DidacticSequence.findByPk(req.params.id);
    if (!sequence) return res.status(404).json({ error: 'Not found' });
    await sequence.update(req.body);
    res.json(sequence);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une séquence didactique
exports.deleteDidacticSequence = async (req, res) => {
  try {
    const sequence = await DidacticSequence.findByPk(req.params.id);
    if (!sequence) return res.status(404).json({ error: 'Not found' });
    await sequence.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

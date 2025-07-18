// Modèle DidacticSequence pour la gestion des séquences didactiques
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Chargement des variables d'environnement
const RESOURCES_PATH = process.env.RESOURCES_PATH || './resources';
const ANALYSIS_API_URL = process.env.ANALYSIS_API_URL || '';
const LAB_ACCESS_KEY = process.env.LAB_ACCESS_KEY || '';

const DidacticSequence = sequelize.define('DidacticSequence', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  culturalElements: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  learningObjectives: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  activities: { type: DataTypes.JSONB, allowNull: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  // Exemple d'intégration d'un champ pour stocker le chemin vers une ressource pédagogique
  resourcePath: { type: DataTypes.STRING, allowNull: true, defaultValue: RESOURCES_PATH },
}, {
  timestamps: true
});

// Exemple de fonction pour utiliser l'API d'analyse du laboratoire
DidacticSequence.analyzeSequence = async function(sequenceId) {
  if (!ANALYSIS_API_URL || !LAB_ACCESS_KEY) return null;
  // ... ici vous pouvez ajouter la logique pour appeler l'API d'analyse avec la clé du laboratoire ...
  // fetch(`${ANALYSIS_API_URL}/analyze`, { ... })
  return { status: 'not implemented', sequenceId };
};

module.exports = DidacticSequence;

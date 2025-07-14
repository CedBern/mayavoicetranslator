
import mongoose from 'mongoose';

const { Schema } = mongoose;

const CorrectionSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  // Ajout : évaluation dynamique (feedback graduel, médiation, progression)
  evaluationDynamique: {
    type: String, // ex: "feedback graduel, médiation, progression"
    default: null,
  },
  // Ajout : portfolio multimodal (liens ou objets évalués)
  portfolio: [
    {
      type: { type: String, enum: ['texte', 'audio', 'video', 'image', 'autre'], required: true },
      titre: { type: String },
      url: { type: String },
      date: { type: Date },
      description: { type: String }
    }
  ],
  // Ajout : rubriques ancrées culturellement (critères, indexicalité culturelle, etc.)
  rubriqueCulturelle: {
    type: String, // ex: "indexicalité culturelle, narration, etc."
    default: null,
  },
  // Ajout : feedback communautaire (plusieurs évaluateurs)
  feedbackCommunautaire: [
    {
      evaluateur: { type: Schema.Types.ObjectId, ref: 'User' },
      commentaire: { type: String },
      date: { type: Date }
    }
  ],
  // Ajout : dimensions de la triade MCMY
  meyaj: { type: String },
  winikil: { type: String },
  nojchNaAt: { type: String },
  competenceEcologique: { type: String },
  competenceRelationnelle: { type: String },
  competencePerformative: { type: String },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  feedback: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Correction = mongoose.model('Correction', CorrectionSchema);

export default Correction;

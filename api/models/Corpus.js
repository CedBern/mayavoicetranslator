import mongoose from 'mongoose';

const { Schema } = mongoose;

// Sous-schémas pour la gouvernance, le consentement, les annotations, etc.
const ConsentementSchema = new Schema({
  participantId: { type: Schema.Types.ObjectId, ref: 'User' },
  langue: { type: String, enum: ['maya', 'espagnol', 'francais'] },
  date: { type: Date, default: Date.now },
  usageAutorise: [String], // ex: ['recherche', 'IA', 'exercices', 'publication']
  retraitPossible: { type: Boolean, default: true },
  smartContractRef: { type: String }, // Pour blockchain
});

const AnnotationSchema = new Schema({
  type: { type: String, enum: ['linguistique', 'semantique', 'cosmovisionnelle', 'MCMY', 'autre'] },
  auteur: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  contenu: Schema.Types.Mixed, // Structure flexible
});

const MediaSchema = new Schema({
  type: { type: String, enum: ['texte', 'audio', 'video', 'eeg', 'xr', 'autre'] },
  url: { type: String },
  description: { type: String },
  langue: { type: String },
  metadonnees: Schema.Types.Mixed, // ex: durée, format, etc.
});

const CorpusEntrySchema = new Schema({
  titre: { type: String },
  description: { type: String },
  date: { type: Date, default: Date.now },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  contexte: { type: String }, // ex: cérémonie, atelier, etc.
  lieu: { type: String },
  gouvernance: {
    conseilValidation: { type: Boolean, default: false },
    auditRefs: [String], // Pour audit algorithmique
    tkLabels: [String], // Traditional Knowledge Labels
  },
  consentements: [ConsentementSchema],
  medias: [MediaSchema],
  annotations: [AnnotationSchema],
  ontologie: {
    meyaj: { type: Boolean, default: false },
    winikil: { type: Boolean, default: false },
    nojochNaat: { type: Boolean, default: false },
    autres: [String],
  },
  droits: {
    acces: { type: String, enum: ['public', 'communautaire', 'restreint'], default: 'communautaire' },
    revenusPartages: { type: Boolean, default: false },
  },
  blockchainRef: { type: String },
  retroaction: {
    type: String, // ex: "epigenetique", "feedback communautaire"
    details: Schema.Types.Mixed,
  },
});

const CorpusSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  languePrincipale: { type: String, default: 'maya' },
  languesSecondaires: [String],
  entries: [CorpusEntrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Corpus', CorpusSchema);

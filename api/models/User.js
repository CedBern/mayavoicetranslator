
import mongoose from 'mongoose';

const { Schema } = mongoose;


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // We will store a hashed password, not the plain text
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['apprenant', 'professeur', 'chercheur', 'contributeur', 'annotateur', 'referent', 'validator', 'admin'],
    default: ['apprenant'],
    required: true,
  },
  profileType: {
    type: String,
    enum: ['debutant', 'apprenant_regulier', 'locuteur_natif', 'annotateur', 'referent_communautaire', 'enseignant', 'chercheur', 'autre'],
    default: 'debutant',
    required: true,
  },
  // Ajout : choix du parcours pédagogique (MCMY, CECRL, articulation)
  parcoursCadre: {
    type: String,
    enum: ['MCMY', 'CECRL', 'articulation'],
    default: 'articulation',
    required: true,
  },
  // Ajout : profil de trajectoire (héritage, allié, professionnel, etc.)
  profilTrajectoire: {
    type: String,
    enum: ['heritage', 'allie', 'professionnel', 'nouvel_apprenant', 'autre'],
    default: 'nouvel_apprenant',
    required: true,
  },
  // Ajout : portfolio multimodal (liens ou objets)
  portfolio: [
    {
      type: { type: String, enum: ['texte', 'audio', 'video', 'image', 'autre'], required: true },
      titre: { type: String },
      url: { type: String },
      date: { type: Date },
      description: { type: String }
    }
  ],
  // Ajout : descripteurs augmentés (Meyaj, Winikil, Nojoch Na'at)
  descripteursAugmentes: [
    {
      competence: { type: String }, // ex: "interaction", "mediation", etc.
      niveau: { type: String }, // ex: "B1", "B2", "C1"
      meyaj: { type: String },
      winikil: { type: String },
      nojchNaAt: { type: String }
    }
  ],
  competences: [
    {
      nom: { type: String, required: true }, // ex: comprehension_orale
      niveau: { type: Number, min: 1, max: 4, required: true },
      badge: { type: String }, // ex: "Badge Initiation"
      dateObtention: { type: Date },
      // Extension : dimensions de la triade et compétences holistiques
      meyaj: { type: String },
      winikil: { type: String },
      nojchNaAt: { type: String },
      competenceEcologique: { type: String },
      competenceRelationnelle: { type: String },
      competencePerformative: { type: String }
    }
  ],
  parcours: [
    {
      module: { type: String }, // ex: "annotation_niveau_1"
      dateDebut: { type: Date },
      dateFin: { type: Date },
      statut: { type: String, enum: ['en_cours', 'termine', 'abandonne'], default: 'en_cours' }
    }
  ],
  certifications: [
    {
      nom: { type: String }, // ex: "Badge Référent communautaire"
      date: { type: Date },
      niveau: { type: Number, min: 1, max: 4 },
      validePar: { type: String } // id ou nom du référent
    }
  ],
  // For OAuth integration
  googleId: { type: String },
  githubId: { type: String },

}, { timestamps: true });


// TODO: Add pre-save hook to hash password before saving

const User = mongoose.model('User', UserSchema);

export default User;

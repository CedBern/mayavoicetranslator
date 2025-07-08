
# Roadmap du Projet MayaVoiceTranslator

## Phase 1: Consolidation et Infrastructure (Terminée)

- **Objectif:** Moderniser l'infrastructure, intégrer les services de base et préparer le terrain pour l'IA et la communauté.
- **Statut:** ✅ Terminé

- **Réalisations clés:**
  - ✅ Migration du backend vers ES Modules (`server-moderne.js`).
  - ✅ Mise en place de l'authentification OAuth2 et JWT (`RestAPIService.js`).
  - ✅ Dockerisation de l'application pour un déploiement unifié (`Dockerfile`).
  - ✅ Migration des grands fichiers de Git LFS vers un stockage objet MinIO.
  - ✅ Intégration d'un service de TTS neural via Hugging Face (`NeuralTTSService.js`).
  - ✅ Création d'un framework pour l'entraînement de modèles personnalisés (`CustomMayaModelTrainer.js`, `training_worker.js`).
  - ✅ Mise en place d'un service d'analyse linguistique avancée avec Stanza (`LinguisticAnalysisService.js`).
  - ✅ Développement d'un service pour les contributions communautaires (`CommunityService.js`).
  - ✅ Exposition de toutes les fonctionnalités via une API REST documentée (`RestAPIService.js`, `SWAGGER_API.md`).

---

## Phase 2: Entraînement des Modèles et Amélioration des Données

- **Objectif:** Entraîner les premiers modèles de traduction, TTS et ASR spécifiques aux langues mayas en utilisant les corpus collectés et les contributions communautaires.
- **Statut:** ⏳ À faire

- **Prochaines étapes:**
  - **1. Pipeline de Données Complet:**
    - Mettre en place un pipeline automatisé pour nettoyer, normaliser et préparer les données textuelles et audio (Apertium, MayanV, contributions communautaires).
    - Intégrer un système de validation des contributions (relecture par les pairs, validation par des experts).
  - **2. Entraînement du Modèle de Traduction (NMT):**
    - Utiliser le `CustomMayaModelTrainer.js` pour entraîner un modèle Transformer (type MarianMT) sur les paires de langues prioritaires (ex: Espagnol-Yucatèque).
    - Évaluer le modèle en utilisant des métriques standards (BLEU, TER) et des retours qualitatifs de la communauté.
    - Déployer le modèle entraîné pour qu'il soit accessible via `TranslationService.js`.
  - **3. Entraînement du Modèle TTS:**
    - Collecter et préparer un corpus audio aligné (texte + voix) à partir des contributions.
    - Entraîner un modèle TTS (type Tacotron2 ou VITS) pour une première voix maya.
    - Intégrer le modèle dans `NeuralTTSService.js` pour remplacer ou compléter l'API Hugging Face.
  - **4. Entraînement du Modèle ASR (Reconnaissance Vocale):**
    - Utiliser les données audio pour entraîner un modèle ASR (type Wav2Vec2).
    - Intégrer le modèle dans un `SpeechRecognitionService.js` et l'exposer via l'API.

---

## Phase 3: Plateforme Communautaire et Éducative

- **Objectif:** Construire une interface utilisateur riche et des outils pour que la communauté puisse interagir avec la technologie, contribuer facilement et l'utiliser à des fins éducatives.
- **Statut:** ⏳ À faire

- **Prochaines étapes:**
  - **1. Portail de Contribution Amélioré:**
    - Développer une interface web (React) où les utilisateurs peuvent soumettre du texte/audio, mais aussi valider les contributions des autres.
    - Mettre en place un tableau de bord pour que les utilisateurs suivent leurs contributions et leur impact.
  - **2. Outils d'Apprentissage Intéractifs:**
    - Créer des exercices de prononciation utilisant le modèle ASR pour donner un feedback en temps réel.
    - Développer des leçons de vocabulaire et de grammaire basées sur l'analyse linguistique de Stanza.
    - Intégrer un "chatbot" de pratique linguistique qui utilise les modèles de traduction et de TTS.
  - **3. Gouvernance Communautaire:**
    - Mettre en place un conseil linguistique composé de membres de la communauté pour superviser la qualité et l'orientation culturelle des modèles.
    - Définir une licence ouverte et éthique pour les données et les modèles créés par le projet.

---

## Phase 4: Recherche et Innovation Continue

- **Objectif:** Repousser les limites de la technologie pour les langues sous-dotées et explorer de nouvelles applications.
- **Statut:** ⏳ À faire

- **Idées à explorer:**
  - **Traduction Dialectale:** Modèles capables de comprendre et de traduire les variations régionales d'une même langue.
  - **Analyse de la Poésie et des Chants:** Adapter les modèles pour comprendre les formes linguistiques artistiques.
  - **Apprentissage par Renforcement avec Feedback Humain (RLHF):** Utiliser les corrections des utilisateurs pour affiner continuellement les modèles.
  - **Déploiement sur Appareils Mobiles:** Optimiser les modèles pour qu'ils puissent fonctionner hors ligne sur des téléphones.

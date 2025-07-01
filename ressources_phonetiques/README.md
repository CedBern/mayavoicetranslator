# README – Organisation des ressources phonétiques/articulatoires

## Structure des dossiers

- `/bases_de_donnees/` : Bases de données articulatoires (UltraSuite, USC-TIMIT, etc.)
- `/outils_open_source/` : Outils logiciels open source (AAA, MIRTK, TensorFlow-IO, etc.)
- `/tutoriels/` : Tutoriels, articles, guides techniques (PDF, HTML, Markdown)
- `/docs_institutionnelles/` : Documents institutionnels (Inserm, etc.)
- `/scripts/` : Scripts d’automatisation, de traitement ou d’analyse

## Conseils d’utilisation

- Place chaque ressource téléchargée dans le sous-dossier approprié.
- Pour les ressources nécessitant une licence ou un accès académique, conserve les justificatifs dans `/bases_de_donnees/` ou `/docs_institutionnelles/`.
- Documente ici la source, la licence et l’usage prévu de chaque ressource.

## Exemple d’entrée

- `/bases_de_donnees/UltraSuite/` : Données échographie + audio, accès académique, [https://github.com/UltraSuite](https://github.com/UltraSuite)
- `/outils_open_source/MIRTK/` : Outil de reconstruction IRM, open source, [https://github.com/BioMedIA/MIRTK](https://github.com/BioMedIA/MIRTK)
- `/tutoriels/Audio_Deep_Learning/` : Série d’articles, accès libre, [https://towardsdatascience.com/audio-deep-learning-made-simple-part-1-state-of-the-art-techniques-da1d3dff2504/](https://towardsdatascience.com/audio-deep-learning-made-simple-part-1-state-of-the-art-techniques-da1d3dff2504/)

## UltraSuite (bases_de_donnees/ultrasuite)

- **Source** : [ultrasuite/ultrasuite sur GitHub](https://github.com/ultrasuite/ultrasuite)
- **Description** : Corpus articulatoire (ultrasons, audio, annotations) pour l’analyse phonétique avancée.
- **Langues** : anglais (principalement)
- **Licence** : Voir le repo d’origine
- **Utilisation** : Extraction de données articulatoires, entraînement de modèles, analyse phonétique/phonologique.
- **Scripts utiles** : extraction, conversion, visualisation (voir dossier scripts/ du repo)

---

## 📚 Principes pragmatiques du langage comme action (Holtgraves et al.)

- **Synthèse structurée** : Voir [`pragmatique_langage_action.md`](./pragmatique_langage_action.md)
- **Utilité** : Ces principes guident l’analyse, l’annotation, la conception d’activités pédagogiques et l’UX dans MayaVoiceTranslator.
- **Applications** : Feedback conversationnel, annotation pragmatique, scénarios de jeux de rôle, suivi des compétences, interopérabilité (LEXINFO++, ELAN, xAPI), accessibilité.
- **Interopérabilité** : Structuration des annotations et activités selon les standards internationaux.

---

# 🚀 Automatisation globale de l’import des ressources phonétiques

Pour simplifier la gestion des bases de données et documentations (UltraSuite, autres corpus…), un script PowerShell global permet d’importer ou de mettre à jour toutes les ressources d’un coup :

- **Script global** : `scripts/import_all_phonetic_resources.ps1`
  - Gère chaque ressource (corpus, documentation…) via Git ou ZIP.
  - Ajoutez facilement une nouvelle ressource en dupliquant une ligne et en adaptant les paramètres.

## ▶️ Utilisation rapide (Windows/PowerShell)

1. Ouvrez un terminal PowerShell à la racine du projet.
2. Exécutez :
   ```powershell
   .\ressources_phonetiques\scripts\import_all_phonetic_resources.ps1
   ```
3. Toutes les ressources seront importées ou mises à jour automatiquement.

> **Astuce** : Pour ajouter une ressource, éditez le script et ajoutez un appel à `Import-Resource` avec le nom, l’URL Git et/ou le nom du ZIP.

## Ressources automatisées par défaut
- Documentation UltraSuite (`docs_institutionnelles/ultrasuite_github_io/`)
- (Exemple prêt à activer) Corpus UltraSuite (`bases_de_donnees/ultrasuite/`)
- Autres corpus ou outils : ajoutez-les selon vos besoins.

---

# 📋 Tableau récapitulatif des fiches d’intégration des ressources

| Ressource                | Type         | Fiche d’intégration                                      |
|--------------------------|--------------|----------------------------------------------------------|
| UltraSuite Doc           | Documentation| [UltraSuite Doc](docs_institutionnelles/ultrasuite_github_io/INTEGRATION.md) |
| UltraSuite Corpus        | Corpus       | [UltraSuite Corpus](bases_de_donnees/ultrasuite/INTEGRATION.md)                |
| (À compléter)            | ...          | ...                                                      |

> Pour chaque nouvelle ressource, dupliquez le modèle `MODELE_FICHE_INTEGRATION.md` dans le dossier de la ressource, remplissez-le, puis ajoutez une ligne ici.

---

Mets à jour ce fichier à chaque ajout de ressource pour garder une traçabilité claire.

- [Sémantique computationnelle avancée](semantique_computationnelle.md) : Approches, outils, défis et tendances pour l’analyse sémantique adaptée aux langues minoritaires.
- [Pragmatique et analyse du discours](pragmatique_analyse_discours.md) : Enjeux, méthodes, corpus et innovations pour l’analyse pragmatique et discursive.
- [Linguistique de corpus et annotation multimodale](linguistique_corpus_annotation_multimodale.md) : Outils, standards, workflows, défis et innovations pour l’annotation et l’analyse de corpus multimodaux.
- [Éthique, justice cognitive et gouvernance inclusive](ethique_gouvernance_inclusive.md) : Modèles, chartes, indicateurs, outils et tendances pour une gouvernance responsable et équitable.
- [IA générative responsable et Explainable AI (XAI)](ia_generative_xai.md) : Méthodes, outils, protocoles, défis et tendances pour l’explicabilité et la responsabilité de l’IA.
- [Interopérabilité sémantique et web des données](interop_web_semantique.md) : Standards, outils, infrastructures, défis et tendances pour l’intégration linguistique dans le web sémantique et les LOD.
- [Innovation pédagogique et UX inclusive](innovation_pedagogique_ux_inclusive.md) : Modèles, outils, indicateurs, défis et tendances pour l’apprentissage adaptatif, la gamification et l’accessibilité universelle.
- [Decolonizing Methodologies (L.T. Smith) – Synthèse et enjeux pour les langues autochtones](decolonizing_methodologies_smith.md) : Principes, apports pédagogiques, stratégies de revitalisation, idées concrètes pour la classe, bibliographie, ressources.
- [The Rosetta Project (Long Now Foundation) – Synthèse et enjeux pour la préservation linguistique](rosetta_project_longnow.md) : Archivage très long terme, corpus multilingue, open access, inspiration pour la documentation et la transmission des langues.
- [Living Dictionaries (Living Tongues Institute) – Synthèse et enjeux pour la revitalisation linguistique](living_dictionaries_living_tongues.md) : Plateforme collaborative, multimédia, gouvernance communautaire, interopérabilité, documentation et transmission des langues.
- [Mukurtu CMS & Hubs – Synthèse et enjeux pour la préservation communautaire](mukurtu_cms_hubs.md) : Plateforme open source, gouvernance locale, transmission intergénérationnelle, accompagnement technique et humain.

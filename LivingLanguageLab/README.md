# LivingLanguageLab

[![Supervision](https://cedbe.github.io/MayaVoiceTranslator/supervision_badge.svg)](https://cedbe.github.io/MayaVoiceTranslator/diagnostic_summary_20250626_171124.md)
[![CI LivingLanguageLab](https://github.com/<votre-org>/<votre-repo>/actions/workflows/livinglab-ci.yml/badge.svg)](../../actions/workflows/livinglab-ci.yml)
[![Coverage Status](https://codecov.io/gh/cedbe/MayaVoiceTranslator/branch/main/graph/badge.svg?flag=LivingLanguageLab)](https://codecov.io/gh/cedbe/MayaVoiceTranslator?flag=LivingLanguageLab)
[![Security Policy](https://img.shields.io/badge/Security-Policy-important)](../SECURITY.md)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-✔️-brightgreen)](./CODE_OF_CONDUCT.md)
[![Contributing](https://img.shields.io/badge/Contributing-Guide-blue)](./CONTRIBUTING.md)
[![Twitter](https://img.shields.io/badge/Twitter-@LivingLangLab-1da1f2?logo=twitter)](https://twitter.com/LivingLangLab)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-LivingLanguageLab-blue?logo=linkedin)](https://linkedin.com/company/livinglanguagelab)
[![Mastodon](https://img.shields.io/badge/Mastodon-@LivingLangLab-6364ff?logo=mastodon)](https://mastodon.social/@LivingLangLab)
[![Good First Issue](https://img.shields.io/github/issues/cedbe/MayaVoiceTranslator/good%20first%20issue?label=Good%20First%20Issue%20LivingLanguageLab&logo=github)](https://github.com/cedbe/MayaVoiceTranslator/labels/good%20first%20issue)
[![APIs externes](./docs/external_apis_status.svg)](./docs/external_apis_status.svg)

[← Retour au projet principal](../README.md)

Documentation OpenAPI (CI) | [Documentation publique (GitHub Pages)](https://<votre-org>.github.io/<votre-repo>/)

API et outils pour l’expérimentation, l’enrichissement et la supervision de corpus multilingues (langues régionales, peu dotées, indigènes).

## Objectifs
- Intégration, validation et documentation automatisées des corpus dans Maya Voice Translator
- Interface/API ouverte pour la contribution, la supervision et l’analyse
- Expérimentation de nouveaux modèles, pipelines ou outils linguistiques
- Éthique, traçabilité et valorisation équitable des contributions

## Structure
- `openapi.yaml` : Spécification OpenAPI/Swagger de l’API
- `endpoints/` : Handlers/routes de l’API
- `models/` : Schémas de données
- `tests/` : Tests unitaires et d’intégration
- `scripts/` : Outils d’import, validation, reporting

## Démarrage rapide
1. Lire la spécification dans `openapi.yaml`
2. Ajouter/éditer des endpoints dans `endpoints/`
3. Ajouter des schémas dans `models/`
4. Ajouter des tests dans `tests/`
5. Utiliser les scripts d’import/validation

## À faire
- Compléter la spec OpenAPI
- Ajouter les premiers endpoints
- Rédiger des exemples d’utilisation
- Intégrer à la CI/CD

## Accès et politique tarifaire

| Offre/API                | Accès API principale | Accès LivingLanguageLab | Fonctions LLLab incluses         | Prix/mois |
|--------------------------|---------------------|------------------------|----------------------------------|-----------|
| Gratuit / Découverte     | Limité              | Non                    | -                                | 0 €       |
| Standard                 | Oui (quotas)        | Limité (lecture seule) | Consultation corpus validés      | 29 €      |
| Pro / Premium            | Oui (quotas élevés) | Oui (CRUD complet)     | Import/export, validation, stats | 99 €      |
| Entreprise / Sur-mesure  | Oui (illimité)      | Oui (avancé)           | Collaboration, reporting, API+   | Sur devis |

### Conditions d’accès
- **Standard** : lecture seule sur LivingLanguageLab (corpus validés)
- **Pro/Premium** : accès complet (CRUD, import/export, validation collaborative, reporting)
- **Entreprise** : fonctionnalités avancées (dashboards, connecteurs SaaS, support dédié)

> L’accès à LivingLanguageLab est inclus à partir de l’offre Pro. Un contrôle d’accès par API key ou JWT est recommandé pour appliquer ces règles.

## Exemple de contrôle d’accès (Express.js)

```js
const allowedPlans = ['pro', 'premium', 'enterprise'];
function checkAccess(req, res, next) {
  const userPlan = req.user?.plan; // À adapter selon votre auth
  if (!allowedPlans.includes(userPlan)) {
    return res.status(403).json({ error: 'Accès réservé à l’offre Pro ou supérieure.' });
  }
  next();
}
// À utiliser sur les routes sensibles :
// router.post('/corpora', checkAccess, ...)
```

## 🌱 Approches pédagogiques et respect des langues

L’intégration d’activités inspirées de Montessori et Piaget vise à favoriser l’autonomie, l’expérimentation et l’adaptation au rythme de chaque enfant, sans altérer l’authenticité des langues régionales, peu dotées ou indigènes.

- Toutes les activités et contenus pédagogiques sont validés ou adaptables par des locuteurs natifs, enseignants ou experts culturels.
- Les activités sont conçues pour respecter les contextes culturels et linguistiques propres à chaque langue.
- La plateforme encourage la contribution et la validation communautaire pour garantir l’éthique, la pertinence et la valorisation des langues.

> Un mécanisme de validation communautaire peut être activé pour chaque activité ou contenu proposé, afin d’assurer la qualité et le respect des spécificités locales.

## 🤝 Contribution & validation communautaire

- Toute suggestion, correction ou validation d’activité/corpus est la bienvenue.
- Les locuteurs natifs, enseignants, familles et experts peuvent annoter, commenter ou valider chaque activité via l’API ou la plateforme.
- Les contributions sont tracées et valorisées dans les rapports et la documentation.

## 🚀 Guide contributeur rapide

1. Forkez le projet et clonez-le
2. Installez les dépendances : `npm install --prefix LivingLanguageLab`
3. Lancez le serveur : `node LivingLanguageLab/server.js`
4. Accédez à la doc interactive : [http://localhost:4000/api/livinglab/docs](http://localhost:4000/api/livinglab/docs)
5. Proposez vos améliorations via pull request ou via l’API

Pour toute question, ouvrez une issue ou contactez l’équipe.

## 🛡️ Qualité, sécurité et supervision

- **Tests automatisés** (Jest/Supertest) sur tous les endpoints
- **Couverture de code** suivie (badge Codecov)
- **CI/CD** avec validation OpenAPI, artefacts, doc, dashboard, PDF, alertes mail
- **Rapports multi-format** (JSON, CSV, Markdown, PDF, dashboard HTML)
- **Badge de statut global** dans chaque rapport de synthèse
- **Supervision automatisée** (diagnostic_all.ps1)
- **Politique de sécurité et code de conduite**

Pour toute question de sécurité, consultez la [politique de sécurité](./SECURITY.md) ou contactez l’équipe.

## 📈 Tableau de bord et reporting

- [Dashboard HTML historique](./diagnostic_dashboard.html) (statuts, taux de succès, graphique, artefacts)
- [Rapport de synthèse compact](./diagnostic_summary_*.md)
- [Export PDF automatique](./diagnostic_dashboard.pdf)

## 🛡️ Supervision & Valorisation

- Suivi temps réel : [Dashboard supervision global](https://cedbe.github.io/MayaVoiceTranslator/) — Statut, historique, rapports détaillés, badges dynamiques.
- Les badges affichent la robustesse et la qualité des intégrations multilingues (taux de succès, historique, alertes).
- Toute contribution à la supervision, à l’automatisation ou à la valorisation scientifique est encouragée !
- Voir le [README principal](../README.md) pour plus de détails et de liens.

---

# Ouverture à la contribution externe

LivingLanguageLab s’ouvre à la communauté ! Vous pouvez :
- Proposer des idées ou signaler des bugs via [issues](https://github.com/<votre-org>/<votre-repo>/issues)
- Démarrer ou rejoindre une [discussion](https://github.com/<votre-org>/<votre-repo>/discussions)
- Consulter le [site vitrine](../docs/index.md) pour les actualités et ressources
- Suivre et partager sur les réseaux sociaux (Twitter, LinkedIn, Mastodon…)
- Contribuer via pull request, annotation, validation ou feedback

Pour toute question, ouvrez une issue ou participez aux discussions publiques.

---
Pour toute contribution, voir le README principal du projet Maya Voice Translator.

Pour toute question de comportement ou d’inclusion, consultez le [Code de Conduite](./CODE_OF_CONDUCT.md) ou contactez l’équipe.

Pour contribuer, suivez le [guide du contributeur](./CONTRIBUTING.md).

---

## ❓ Questions fréquentes & Support

- [Documentation complète](../README.md)
- [Dashboard supervision temps réel](https://cedbe.github.io/MayaVoiceTranslator/)
- [Ouvrir une issue ou une discussion](https://github.com/cedbe/MayaVoiceTranslator/issues)

Pour toute question, suggestion ou problème lié à la supervision ou à l’intégration multilingue, ouvrez une issue ou participez aux discussions : la communauté et l’équipe vous répondront rapidement.

- [Voir les issues LivingLanguageLab](https://github.com/cedbe/MayaVoiceTranslator/issues?q=label%3ALivingLanguageLab)
- [Voir les Pull Requests LivingLanguageLab](https://github.com/cedbe/MayaVoiceTranslator/pulls?q=label%3ALivingLanguageLab)

## Table des matières
- [🛡️ Supervision & Valorisation](#supervision--valorisation)
- [Contribuer à LivingLanguageLab](#contribuer-à-livinglanguagelab)
- [Exemple d’utilisation rapide](#exemple-dutilisation-rapide)
- [Questions fréquentes & Support](#questions-fréquentes--support)

## Contribuer à LivingLanguageLab

Vous souhaitez :
- Proposer un nouveau corpus ou une langue ?
- Améliorer l’intégration pédagogique (Montessori, Piaget, etc.) ?
- Ajouter des tests, des endpoints, ou enrichir la supervision ?

Consultez le [guide du contributeur](../CONTRIBUTING.md) et ouvrez une [issue dédiée](https://github.com/cedbe/MayaVoiceTranslator/issues/new/choose?labels=LivingLanguageLab).

## Exemple d’utilisation rapide

```bash
# Importer un corpus de test (API locale)
curl -X POST http://localhost:4000/api/livinglab/corpora/import \
  -H "Content-Type: application/json" \
  -d '{"corpus": {"id": "diagimport", "name": "DiagImport", "description": "Corpus importé diag", "languages": ["fr","oc"], "size": 7}}'
```

---

## 🌍 Internationalisation & Accessibilité

- LivingLanguageLab vise l’inclusion de toutes les langues et variantes, y compris les langues minoritaires et les besoins spécifiques (enfants, pédagogies adaptées).
- Vous souhaitez proposer une traduction, une adaptation pédagogique ou signaler un besoin d’accessibilité ? Ouvrez une [issue dédiée](https://github.com/cedbe/MayaVoiceTranslator/issues/new/choose?labels=accessibilite%2Cinternationalisation).
- Toute contribution pour améliorer l’accessibilité ou l’internationalisation est la bienvenue !

## 🔑 Gestion des rôles utilisateur (plan) et accès différencié

- L’interface utilisateur (UI) adapte dynamiquement l’accès aux fonctionnalités selon le rôle/plan utilisateur : `standard`, `pro`, `premium`, `enterprise`.
- Certaines fonctions (ex : import/export corpus, reporting avancé) sont réservées aux plans Pro/Premium/Entreprise.
- Le plan est transmis lors de l’authentification et stocké dans le contexte global de l’application.
- L’affichage conditionnel est généralisé dans la navigation et les pages : par exemple, le bouton “Corpus Demo” n’apparaît que pour les plans autorisés, et un bandeau spécial s’affiche pour les utilisateurs Entreprise.
- Voir la documentation UI pour les détails d’implémentation : [`docs/UI_README.md`](../docs/UI_README.md)

## 🔗 Intégration des API externes (modèle recommandé)

Pour garantir la sécurité, la supervision, la gestion des quotas et l’enrichissement des résultats :

- **Toutes les API externes (traduction, TTS, STT, dictionnaire, etc.) sont intégrées côté backend** (dans vos endpoints `/api/translate`, `/api/tts`, `/api/stt`, etc.).
- L’UI et les clients n’appellent que vos endpoints sécurisés : ils n’ont jamais accès directement aux clés ou secrets des API externes.
- Le backend choisit dynamiquement la meilleure API externe selon la langue, le plan, la stratégie, la disponibilité, etc.
- Les résultats peuvent être enrichis, validés, croisés ou filtrés avant d’être renvoyés au client.
- Ce modèle permet aussi la mutualisation des quotas, la gestion centralisée des logs, la rotation des clés, le fallback multi-API, etc.

**Exemple de flux** :
1. L’UI appelle `/api/translate` (avec token et plan).
2. Le backend orchestre l’appel à l’API externe la plus adaptée (OpenAI, Google, DeepL, etc.), gère la clé/API, et retourne le résultat enrichi.
3. L’UI reçoit un résultat sécurisé, validé, et potentiellement enrichi (conseils, alternatives, explications, etc.).

> Pour contribuer à l’intégration d’une nouvelle API externe, voir la documentation technique et les services d’orchestration (`services/TranslationEnhancementService.js`, `services/SecureAPIKeyManager.js`, etc.).

## 🧠 APIs externes gratuites/scientifiques recommandées (sciences cognitives, linguistique, etc.)

Pour enrichir LivingLanguageLab, voici une sélection d’APIs gratuites, ouvertes ou académiques pertinentes :

| API / Ressource                | Domaine(s)                | Lien / Doc                                      | Usage possible dans LLLab                                  | Priorité |
|-------------------------------|---------------------------|-------------------------------------------------|------------------------------------------------------------|----------|
| ConceptNet                    | Sémantique, relations     | https://conceptnet.io/                           | Enrichissement sémantique, suggestions, synonymes          | ★★★      |
| WordNet/Open Multilingual Wordnet | Lexique, synonymie      | https://wordnet.princeton.edu/                   | Synonymes, relations lexicales, multilingue                | ★★★      |
| Tatoeba API                   | Corpus multilingue        | https://tatoeba.org/eng/api                      | Exemples de phrases, corpus d’entraînement                 | ★★★      |
| PanLex API                    | Traduction, lexique       | https://panlex.org/tools/api/                    | Traduction, exploration lexicale, langues peu dotées        | ★★☆      |
| Glosbe API                    | Traduction, exemples      | https://glosbe.com/a-api                         | Traduction, exemples contextuels                           | ★★☆      |
| Wiktionary API                | Dictionnaire, définitions | https://en.wiktionary.org/w/api.php              | Définitions, étymologie, multilingue                       | ★★☆      |
| Apertium API                  | Traduction automatique    | https://www.apertium.org/                         | Traduction open source, langues minoritaires               | ★★☆      |
| CLIPS Phonology API           | Phonologie, phonétique    | https://github.com/CLIPS/phonemizer              | Transcription phonétique, analyse phonologique             | ★★☆      |
| SyntagNet                     | Sémantique, syntaxe       | http://syntagnet.org/                             | Relations syntaxiques et sémantiques                       | ★☆☆      |
| DBpedia Spotlight             | Annotation sémantique     | https://www.dbpedia-spotlight.org/api             | Annotation, enrichissement sémantique                      | ★☆☆      |
| WALS (World Atlas of Language Structures) | Typologie linguistique | https://wals.info/                              | Métadonnées linguistiques, typologie                       | ★☆☆      |
| CHILDES TalkBank              | Corpus enfant, linguistique| https://childes.talkbank.org/                    | Corpus d’acquisition du langage, analyse développementale  | ★☆☆      |
| Neurosynth                    | Neurosciences, cognition  | https://neurosynth.org/                           | Métadonnées neuroscientifiques, analyse cognitive          | ★☆☆      |

**Légende priorité** : ★★★ = très pertinent, ★★☆ = recommandé, ★☆☆ = optionnel/avancé

### Exemples d’intégration/usage
- Enrichir les endpoints `/api/lexicon`, `/api/semantics`, `/api/phonology` avec ConceptNet, WordNet, CLIPS Phonology…
- Proposer des suggestions, synonymes, définitions, exemples contextuels lors de l’import ou la validation de corpus.
- Ajouter des métadonnées linguistiques ou typologiques (WALS, PanLex).
- Permettre l’analyse phonétique ou syntaxique automatisée.
- Offrir des corpus d’exemples pour l’entraînement ou la validation (Tatoeba, CHILDES).

### Contribution à l’intégration d’APIs avancées
- Voir la documentation technique (`docs/UI_README.md`, `docs/UI_ARCHITECTURE.md`) et les services d’orchestration backend.
- Proposer une nouvelle API : ouvrir une issue ou une pull request avec une fiche API (domaine, lien, exemple d’appel, usage envisagé).
- Prioriser les APIs ouvertes, gratuites, académiques ou respectueuses de la vie privée.
- Toute contribution (code, documentation, tests, exemples) est la bienvenue !

## 🏆 Priorisation détaillée des APIs scientifiques et linguistiques (gratuites/open source)

Pour maximiser la valeur scientifique, pédagogique et technologique de LivingLanguageLab tout en maîtrisant les coûts, voici une priorisation détaillée des APIs à intégrer :

| Priorité | API / Ressource         | Plus-value pour LivingLanguageLab                                                                 | Usage recommandé dans LLLab                                  |
|----------|------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| 🥇 1     | **spaCy**              | Analyse linguistique robuste, rapide, multilingue, open source, facile à intégrer                 | Pipeline principal d’analyse, validation automatique         |
| 🥇 1     | **Stanford CoreNLP**   | Analyse syntaxique/sémantique avancée, coréférence, parsing profond, open source                  | Annotation fine, recherche avancée, validation scientifique  |
| 🥇 1     | **OpenNMT**            | Traduction neuronale personnalisée, support langues rares, open source                            | Traduction/adaptation corpus minoritaires                    |
| 🥇 1     | **Living Dictionaries**| Dictionnaires multimédia pour langues en danger, audio/culture, gratuit académique                | Enrichissement culturel, documentation corpus                |
| 🥇 1     | **Mozilla Common Voice**| Données vocales crowdsourcées, 100+ langues, open data                                           | ASR multilingue, import corpus audio                         |
| 🥇 1     | **Universal Dependencies**| Corpus annotés syntaxiquement, 100+ langues, standard unifié, open data                        | Annotation automatique, validation syntaxique                |
| 🥇 1     | **Tesseract**          | OCR multilingue, open source, traitement documents historiques                                    | Numérisation/import de corpus, accessibilité                 |
| 🥇 1     | **TextStat**           | Métriques de lisibilité, complexité syntaxique, open source                                      | Validation automatique, reporting                            |
| 🥇 1     | **Hugging Face**       | 200,000+ modèles linguistiques, pipeline unifié, freemium                                        | Prototypage, expérimentation, fallback                       |
| 🥇 1     | **ElasticSearch**      | Recherche sémantique multilingue, open source, scalabilité                                        | Moteur de recherche interne, dashboard                       |
| 🥇 1     | **ArXiv, PubMed, DOAJ, Glossa, LangSciPress, S&P** | Accès à la littérature scientifique, open access                   | Documentation, veille, valorisation scientifique             |
| 🥇 1     | **CHILDES**            | Corpus d’acquisition enfantine, open data                                                        | Analyse développementale, validation linguistique            |
| 🥇 1     | **WordNet/Open Multilingual Wordnet** | Lexique, synonymie, multilingue, open data                                         | Synonymes, relations lexicales, enrichissement corpus        |
| 🥇 1     | **ConceptNet**         | Sémantique, relations, suggestions, open data                                                    | Enrichissement sémantique, suggestions, synonymes            |
| 🥇 1     | **Wiktionary**         | Définitions, étymologie, multilingue, open data                                                  | Définition, enrichissement lexical                           |
| 🥇 1     | **Apertium**           | Traduction automatique open source, langues minoritaires                                         | Traduction, exploration lexicale                             |
| 🥇 1     | **CLIPS Phonology**    | Transcription phonétique, analyse phonologique, open source                                      | Analyse phonétique, enrichissement corpus                    |
| 🥇 1     | **Tatoeba**            | Corpus multilingue, exemples de phrases, open data                                               | Exemples, corpus d’entraînement                              |
| 🥈 2     | **WebAnno**            | Annotation collaborative, scoring automatique, open source                                        | Annotation massive, projets collaboratifs                    |
| 🥈 2     | **MegaStudy, Wordbank**| Données psycholinguistiques, normes développementales, open data                                  | Validation scientifique, analyse fine                        |
| 🥈 2     | **PanLex, Glosbe**     | Traduction, exploration lexicale, langues peu dotées, open data                                   | Traduction, exploration lexicale                             |
| 🥈 2     | **SyntagNet, DBpedia Spotlight, WALS, Neurosynth** | Sémantique, annotation, typologie, neurosciences, open data                        | Enrichissement avancé, annotation, métadonnées               |

## ✅ Checklist d’intégration multi-API open source/scientifiques

Pour chaque API prioritaire à intégrer dans LivingLanguageLab :

- [ ] **Analyse des besoins** : Définir le(s) usage(s) cible(s) (ex : enrichissement sémantique, validation, annotation, traduction, etc.)
- [ ] **Étude de la documentation** : Lire la doc officielle, identifier les endpoints, formats, limites d’usage
- [ ] **Prototype d’appel backend** : Créer un service Node.js (ou script) pour interroger l’API (ex : `services/ConceptNetService.js`)
- [ ] **Gestion des erreurs et fallback** : Prévoir la gestion des erreurs réseau, quotas, et fallback vers une autre API si besoin
- [ ] **Sécurisation** : Ne jamais exposer de clé/API token côté client, centraliser la gestion dans le backend
- [ ] **Endpoint d’orchestration** : Ajouter un endpoint REST sécurisé (ex : `/api/semantics`, `/api/lexicon`, `/api/phonology`)
- [ ] **Enrichissement des résultats** : Croiser, filtrer ou enrichir les données API avant retour au client
- [ ] **Tests automatisés** : Ajouter des tests unitaires et d’intégration pour chaque service/API
- [ ] **Documentation technique** : Documenter l’intégration (README, doc technique, exemples d’appel, limitations)
- [ ] **Exemple d’usage UI** : Ajouter un composant de démo ou une page d’exemple dans l’UI (si pertinent)
- [ ] **Reporting et supervision** : Intégrer l’API dans les dashboards, logs, alertes et rapports multi-format
- [ ] **Respect des licences et éthique** : Vérifier la licence, citer la source, respecter la vie privée et la conformité RGPD

> Cette checklist doit être suivie pour chaque nouvelle API intégrée. Toute contribution ou suggestion d’amélioration est la bienvenue !

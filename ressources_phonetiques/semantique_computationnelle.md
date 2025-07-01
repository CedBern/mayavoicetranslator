# 🌐 Sémantique computationnelle avancée : Synthèse des approches et outils

## I. Extraction automatique de relations sémantiques

### Méthodes innovantes
- **Ontologies dynamiques**
  - **OLGA (Ontology Learning from Grammar-based Analysis)** : Algorithme exploitant les grammaires formelles pour construire des ontologies dans les langues agglutinantes (ex. langues ouraliennes).
  - **REBEL** : Modèle transformer extraisant des triplets (sujet-relation-objet) via un *text-to-text approach* (SOTA sur ACE2005).
- **Alignement cross-lingue**
  - **mBERT/XLM-R** : Projection d'espaces sémantiques entre langues via des ancres conceptuelles.
  - **TALISMAN** : Framework pour l'alignement de réseaux lexicaux faiblement supervisé (projet ANR).

### Outils open source
- **TextBlob** + **SpaCy** : Extraction de relations via des règles syntaxiques (dépendances *nsubj*, *obj*).
- **OntoLex-Lemon** : Standard W3C pour lier lexiques et ontologies (utilisé dans BNF pour aligner 500M+ triplets RDF).

---

## II. Désambiguïsation contextuelle (WSD) et polysémie

### Approches pour langues peu dotées
- **Méthodes non supervisées**
  - **BEST (Bi-Encoder for Sense disambiguation)** : Clustering des vecteurs de contexte (implémenté dans gensim).
  - **Transfert cross-lingue** : Utilisation de BabelNet comme ressource pivot (ex. : désambiguïsation du quechua via l'espagnol).
- **Réseaux neuronaux adaptatifs**
  - **LSTM-CRF** avec plongements contextuels (ELMo) pour langues flexionnelles.
  - **TinyBERT** : Version compressée pour dispositifs edge (communautés isolées).

### Bases de données clés
- **Unified Sense Inventory** : Inventaire ouvert regroupant WordNet, Wiktionary, et OmegaWiki.
- **UD-WSD** : Corpus universel de 30 langues minoritaires annotées (dont le basque et le tamoul).

---

## III. Modèles sémantiques pour langues autochtones

### Initiatives structurantes
- **LEXINFO++**
  - Extension du standard ISO 24613 pour supporter :
    - Morphologie polysynthétique (ex. : inuktitut).
    - Relations sémantiques culturelles (parenté, écologie traditionnelle).
  - Utilisé dans Atikamekw WordNet (5 000+ entrées liées à OntoLex).
- **FrameNet localisés**
  - **Yupik FrameNet** (Alaska) : Cadres sémantiques pour rituels de chasse ("Ritual_hunting" avec slots tool, animal, taboo).
  - **Projet Nahuatl** : Annotation de récits oraux via ELAN + export SEMAFORMAT.

### Innovations techniques
- **FOMA** : Bibliothèque pour grammaires à états finis (découpage morphologique en langues finno-ougriennes).
- **Syntax-semantic pipelining** : Intégration de spaCy avec FrameNet Builder pour l'analyse de corpus oraux.

---

## Outils pratiques

| Outil               | Fonction                                    | Langues cibles                |
|---------------------|----------------------------------------------|-------------------------------|
| UDpipe              | Traitement de dépendances universelles       | 100+ (dont 15 minoritaires)   |
| FrameNet Builder    | Création de cadres sémantiques localisés     | Personnalisable               |
| LEXINFO Editor      | Édition d'ontologies lexicales ISO-compliantes | Toutes                        |
| PyWSD               | Désambiguïsation contextuelle (Lesk+)        | Multilingue                   |

---

## Défis critiques & solutions

1. **Pénurie de données**
   - Solution : Génération de corpus synthétiques via GPT-4 éthique (consentement communautaire + validation par aînés).
   - Projet FLORA : Collecte de récits oraux avec alignement audio-transcription (outil ELAN).
2. **Complexité morphologique**
   - Solution : Intégration de découpeurs à base de règles (HFST) dans les pipelines NLP.
3. **Interopérabilité**
   - Standard émergent : OntoLex-Lemon pour lier WordNets locaux à des ontologies globales (ex. : DBpedia).

---

## Tendances futures (2025-2030)
- **IA frugale** : Modèles légers (<100MB) pour analyse sémantique hors-ligne (projet SemAI-Light INRIA).
- **Ontologies vivantes** : Mise à jour en temps réel via l'analyse des réseaux sociaux (ActivityPub).
- **Nouvelle norme ISO** : Cadre pour l'alignement cross-lingue des FrameNets (groupe ISO/TC 37).

> "Une langue autochtone n'est pas un algorithme, mais un écosystème – sa modélisation doit épouser sa biologie." — Adapté de E. Hovy.

### Ressources opérationnelles
- [LEXINFO++ Documentation](https://lexinfo.net/)
- [UDpipe Models](https://ufal.mff.cuni.cz/udpipe)
- [FrameNet Builder](https://framenetbuilder.icsi.berkeley.edu/)
- [Projet FLORA (GitHub)](https://github.com/FLORA-org)

---

Cette synthèse intègre les dernières avancées en sémantique computationnelle adaptée aux défis des langues minoritaires, combinant rigueur technique et respect des contextes culturels.

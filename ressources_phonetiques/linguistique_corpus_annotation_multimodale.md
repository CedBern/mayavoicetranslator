# 📚 Linguistique de corpus et annotation multimodale : Synthèse technique

## I. Outils et standards pour l'annotation fine

### Écosystème d'annotation multimodale
- **Phonétique/Prosodie**
  - **Praat** : Analyse acoustique (formants, pitch, intensité), scripts Python (`parselmouth`). Format : TextGrid.
  - **EXMARaLDA** : Transcription de corpus oraux complexes, export TEI/XML.
- **Gestes et contexte visuel**
  - **ELAN** : Annotation hiérarchisée (gestes, regard, expressions faciales). Standard : EAF.
  - **ANVIL** : Templates pour analyse kinésique (iconic gestures, deictic points).
- **Standards d'interopérabilité**
  - **ISO 24624 (LAF)** : Format pivot XML pour fusionner annotations ELAN/Praat/ANVIL.
  - **TEI-Spoken** : Module TEI pour corpus oraux.

### Innovations récentes
- **Deep Learning multimodal**
  - **OpenPose** + **MediaPipe** : Détection automatique des postures et gestes vidéo.
  - **ProsodyLab-Aligner** : Alignement forcé audio-texte par IA (Kaldi).

---

## II. Extraction automatique de patrons linguistiques

### Méthodes quantitatives avancées
- **Analyse distributionnelle**
  - **Collostructional Analysis** : Détection de collocations syntaxico-sémantiques via R (`collostructions`).
  - **CorpusExplorer** : Extraction de n-grams, motifs morphosyntaxiques, réseaux de cooccurrence.
- **Modélisation statistique**
  | Outil            | Fonction                                 | Cas d'usage                  |
  |------------------|------------------------------------------|------------------------------|
  | Sketch Engine    | Profils lexicaux (sketches)              | Étude des verbes de mouvement|
  | AntConc          | Concordances, analyse de mots-clés        | Comparaison de registres     |
  | TXM              | Analyse cooccurrences, cartes heuristiques| Variation dialectale         |
- **Librairies Python**
  - `spaCy` + `textacy` : Extraction de patrons (`VERB + DET + NOUN`).
  - `gensim` : Topic modeling (LDA) sur corpus transcrits.

---

## III. Interopérabilité et plateformes collaboratives

### Chaînes de traitement intégrées
- **Workflow ELAN → Praat** : Conversion des Tiers ELAN en TextGrid via `elan2trs`, synchronisation annotations gestuelles/prosodiques.
- **Solutions cloud**
  - **CLARIN-D** : Plateforme unifiée pour corpus multimodaux (WebMAUS, EXMARaLDA Online).
  - **DORIS** : Annotation collaborative (intègre ELAN, Praat, outils IA).
- **Problèmes résolus**
  - Conversion de formats : `media2x` (MPI) pour transcoder EAF ↔ TextGrid ↔ EXB.
  - Alignement automatique : Gentle (Kaldi), Montreal Forced Aligner.

---

## IV. Défis critiques et solutions émergentes

1. **Hétérogénéité des données**
   - Solution : Métadonnées structurées en RDF (ontologie OLiA).
2. **Échelle des corpus**
   - Solution : Traitement distribué avec Apache Spark (CorpusExplorer++).
3. **Annotation subjective**
   - Solution : Active Learning pour segments ambigus (outil Prodigy).

---

## V. Tendances futures (2025-2030)
- **IA générative** : Modèles multimodaux (MM-LLMs) pour annotation semi-automatique des gestes.
- **Réalité virtuelle** : Plateformes d’immersion (VR-CorpusLab) pour annotation 3D.
- **Blockchain** : Traçabilité des contributions (AnnotChain).

> "Un corpus sans annotation est comme une bibliothèque sans catalogue – riche en potentiel, mais inaccessible à l'analyse." – Adapté de T. McEnery.

### Ressources opérationnelles
- [ELAN](https://archive.mpi.nl/tla/elan)
- [CLARIN Tools](https://www.clarin.eu/content/tools-services)
- [CorpusExplorer](https://www.corpustoolkit.org/)
- [Ontologie OLiA](https://academic.oup.com/dsh/article/33/1/184/4107873)

---

Cette synthèse intègre les standards actuels (ISO, TEI), outils open source (ELAN, Praat), et innovations IA, offrant un cadre méthodologique robuste pour la recherche en linguistique de corpus. La convergence entre annotation manuelle et automation ouvre la voie à des analyses multimodales à grande échelle.

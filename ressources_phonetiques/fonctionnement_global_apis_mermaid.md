```mermaid
graph TD
  subgraph Utilisateur
    U1(Utilisateur final)
    U2(Contributeur/Dev)
  end

  subgraph UI_Mobile_Web
    UI(App mobile/web)
  end

  subgraph API_Manager
    APIM(API Manager / Orchestrateur central)
    AUDIT(Audit éthique & monitoring)
    FEEDBACK(Feedback explicable / XAI)
    AUTOAMELIO(Auto-amélioration / Documentation vivante)
  end

  subgraph API_MayaVoiceTranslator
    API1(API principale REST)
    API2(API multimodale)
    API3(API corpus/ressources)
  end

  subgraph Services_Backend
    S1(Analyse phonétique)
    S2(Analyse articulatoire)
    S3(Orchestrateur multimodal)
    S4(Accès corpus/ressources)
    S5(Authentification & gestion utilisateurs)
  end

  subgraph Ressources
    R1(Corpus UltraSuite)
    R2(Doc UltraSuite)
    R3(Autres corpus/docs)
  end

  U1 --> UI
  UI -->|Appels HTTP/REST| APIM
  APIM -->|Orchestration| API1
  APIM -->|Orchestration| API2
  APIM -->|Orchestration| API3
  APIM --> AUDIT
  APIM --> FEEDBACK
  APIM --> AUTOAMELIO
  AUDIT -->|Audit, logs| APIM
  FEEDBACK -->|Explications| APIM
  AUTOAMELIO -->|Suggestions| APIM

  API1 --> S1
  API1 --> S5
  API2 --> S2
  API2 --> S3
  API3 --> S4
  API3 --> S1

  S1 --> R1
  S2 --> R1
  S4 --> R1
  S4 --> R2
  S4 --> R3

  U2 -->|Ajout/MAJ ressources| R1
  U2 -->|Ajout/MAJ docs| R2
  U2 -->|Ajout/MAJ corpus| R3

  S3 --> S1
  S3 --> S2
  S3 --> S4

  API1 <--> API2
  API1 <--> API3
  API2 <--> API3

  S1 -->|Résultats, logs| API1
  S2 -->|Résultats, logs| API2
  S4 -->|Données, docs| API3

  API1 -->|Réponses JSON| APIM
  API2 -->|Réponses JSON| APIM
  API3 -->|Réponses JSON| APIM
  APIM -->|Réponses JSON| UI
```

> Ce diagramme enrichi montre l’ajout d’un **API Manager (APIM)** centralisé, orchestrant tous les appels API, intégrant l’audit éthique, le feedback explicable, le monitoring et l’auto-amélioration. Cela garantit modularité, traçabilité, conformité, et innovation continue. Les modules d’audit, feedback, et auto-amélioration sont connectés à l’APIM pour une gouvernance responsable et une amélioration continue.

---

## ⚖️ Principes éthiques de l’IA (Floridi, 2023)

- **Résumé structuré** : Voir `../ethique_ia_floridi.md` (synthèse détaillée des principes, enjeux et recommandations de Floridi)
- **Principes fondamentaux** :
  1. Bienfaisance (promouvoir le bien-être, la dignité, la planète)
  2. Non-malfaisance (ne pas nuire, respect de la vie privée, précaution)
  3. Autonomie (préserver la capacité de décision humaine)
  4. Justice (équité, solidarité, lutte contre les discriminations)
  5. Explicabilité (transparence, responsabilité, traçabilité)
- **Applications dans MayaVoiceTranslator** :
  - Gouvernance éthique des API et services (audit, reporting, conformité)
  - Intégration des principes dans l’UX, l’annotation, l’accessibilité, l’API
  - Outils d’audit, de traçabilité et de feedback explicable
  - Alignement sur les ODD et la transition écologique (empreinte carbone, AI4SG)
- **Interopérabilité** : Structuration des audits et annotations selon les standards (xAI, XAI, LTI, xAPI, etc.)

---

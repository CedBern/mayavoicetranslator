```mermaid
graph TD
  subgraph Utilisateur_Communauté
    U1[Ajout/MAJ ressources]
    U2[Fiche d'intégration]
    U3[Contribution code/scripts/UI]
  end

  subgraph Automatisation_Indexation
    S1[Scripts d'import]
    S2[Index global (ressources_index.js)]
    S3[Tableau récapitulatif (README)]
  end

  subgraph Exploitation_Systeme
    M1[Modules d'analyse]
    M2[UI/UX]
    M3[API & Endpoints]
    M4[Documentation générée]
    M5[Tests & pipelines CI/CD]
  end

  U1 --> S1
  S1 -->|Importe/MAJ| S2
  U2 --> S2
  S2 -->|Découverte| M1
  S2 -->|Découverte| M2
  S2 -->|Découverte| M3
  S2 -->|Référence| M4
  S2 -->|Alimente| M5
  U3 --> M1
  U3 --> M2
  U3 --> M3
  S2 --> S3
  S3 -->|Lisibilité/Doc| U1

  M1 -->|Feedback| U1
  M2 -->|Guides| U1
  M3 -->|Données| U1
  M4 -->|Onboarding| U1
  M5 -->|Qualité| U1
```

> Ce diagramme Mermaid est simplifié (pas d'espaces, noms de sous-graphes sans espaces) pour une compatibilité maximale avec les outils Mermaid en ligne ou VS Code.

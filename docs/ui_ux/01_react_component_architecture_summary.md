## Architecture des Composants React pour le Tableau de Bord de Validation

Ce document synthétise la proposition de l'IA experte en UI/UX (GPT-4o) pour l'architecture de l'interface de validation et de contribution.

### 1. Philosophie Générale

- **Interface Unique et Unifiée** : Un seul tableau de bord centralisé pour toutes les tâches (transcription, dictionnaire, etc.).
- **Composants Modulaires** : Chaque élément de l'interface (lecteur média, éditeur, liste de tâches) est un composant React indépendant et réutilisable.
- **Gestion d'État Globale** : Utilisation de React Context ou d'un store (Redux/Zustand) pour gérer l'état de l'utilisateur (authentification, rôle).
- **Accès par Rôles (RBAC)** : Des hooks personnalisés (`useAuth`, `useRole`) contrôleront l'accès aux fonctionnalités de validation et d'édition.

### 2. Structure des Dossiers et Composants

```
client/
└── src/
    ├── components/
    │   ├── dashboard/         # Composants spécifiques au tableau de bord
    │   │   ├── Dashboard.js
    │   │   ├── TaskFilter.js
    │   │   └── TaskList.js
    │   │   └── TaskItem.js
    │   ├── tasks/             # Outils de validation spécifiques
    │   │   ├── TranscriptionTool.js
    │   │   └── DictionaryTool.js
    │   └── shared/            # Composants réutilisables
    │       ├── Header.js
    │       ├── NavBar.js
    │       ├── MediaPlayer.js
    │       ├── AudioWaveform.js
    │       └── ImageSnippet.js
    ├── pages/
    │   ├── DashboardPage.js   # Page principale du tableau de bord
    │   ├── TaskDetailPage.js  # Page affichant un outil de validation
    │   ├── LoginPage.js
    │   └── ProfilePage.js
    ├── hooks/
    │   ├── useAuth.js         # Gère l'authentification et les rôles
    │   └── useApi.js          # Hook pour les appels à notre backend
    ├── contexts/
    │   └── AuthContext.js     # Fournit les informations utilisateur à l'app
    └── App.js                 # Point d'entrée, gère le routage
```

### 3. Maquette Conceptuelle et Flux de Travail

#### a. Le Tableau de Bord (`DashboardPage`)

- **Vue Principale** : Un en-tête avec le profil utilisateur et une barre d'onglets/filtres (`TaskFilter`) pour basculer entre "Transcriptions", "Dictionnaire", "Soumissions".
- **Liste des Tâches (`TaskList`)** : Affiche les tâches sous forme de cartes. Chaque carte (`TaskItem`) montre :
    - Le titre (ex: "Leçon 5 - Segment 3").
    - Le type (icône vidéo ou livre).
    - Le statut ("En attente", "Validé").
    - Un bouton "Ouvrir".

#### b. Le Flux de Validation de Transcription (`TranscriptionTool`)

1.  **Sélection** : L'utilisateur clique sur une tâche de transcription dans le tableau de bord.
2.  **Interface de l'Outil** : La page `TaskDetailPage` charge le `TranscriptionTool`.
    - À gauche : Le `MediaPlayer` avec la vidéo/audio et une `AudioWaveform` cliquable.
    - À droite : L'`TranscriptEditor`, un formulaire avec des champs de texte pour la transcription maya et la traduction française, synchronisés avec le lecteur.
3.  **Interaction** : L'utilisateur écoute le segment, peut cliquer sur la forme d'onde pour naviguer précisément, et corrige le texte directement dans les champs.
4.  **Action** : Des boutons "Sauvegarder", "Valider" (pour les réviseurs) ou "Soumettre pour révision" (pour les contributeurs) permettent de finaliser le travail.
5.  **Contexte** : Un bouton "Voir le contexte complet" permet de jouer la vidéo source en entier sans quitter l'interface.

#### c. Le Flux de Validation de Dictionnaire (`DictionaryTool`)

1.  **Sélection** : L'utilisateur clique sur une tâche de dictionnaire.
2.  **Interface de l'Outil** : La page `TaskDetailPage` charge le `DictionaryTool`.
    - À gauche : L'`ImageSnippet` affiche l'image de la section de la page du dictionnaire scanné correspondant à l'entrée.
    - À droite : Un formulaire avec les champs pré-remplis par l'IA (mot, traduction, exemple, etc.) à partir du JSON.
3.  **Interaction** : L'utilisateur compare le texte des champs avec l'image et corrige les erreurs.
4.  **Action** : Boutons "Valider", "Corriger", "Rejeter".

### 4. Prochaines Étapes

1.  **Claude 3 Opus** : Définir l'API REST et les modèles de données pour supporter ce frontend.
2.  **DeepSeek Coder** : Développer un prototype du composant `TranscriptValidator`.
3.  **Intégration** : Créer les fichiers de base des composants React décrits ci-dessus.

Ce plan, basé sur la consultation de GPT-4o, fournit une base solide et professionnelle pour construire une interface de validation à la fois puissante et facile à utiliser.

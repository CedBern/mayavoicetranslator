# Hack pédagogique : Remix ton parcours

## Objectif
Créer un système où chaque utilisateur peut voir ses erreurs fréquentes, générer automatiquement des mini-défis personnalisés, et remixer son parcours d'apprentissage (ajouter, déplacer, supprimer, forker des modules).

## Pourquoi ?
- Sortir du parcours linéaire classique.
- Transformer l’erreur en moteur d’innovation pédagogique.
- Favoriser l’autonomie, la créativité et la collaboration (esprit hacker).
- Créer une base de données vivante de solutions et de modules remixables.

## Fonctionnement
1. **Tracking des erreurs** :
   - Chaque exercice logge les erreurs fréquentes (ex : conjugaison, vocabulaire).
2. **Générateur de mini-défis** :
   - Un script lit les logs et génère des exercices ciblés.
3. **Remix du parcours** :
   - L’utilisateur peut glisser-déposer, dupliquer, supprimer ou éditer les mini-défis dans son parcours.
   - Il peut forker ou partager ses parcours/défis.
4. **Journal des hacks** :
   - Un module documente les parcours remixés, les hacks pédagogiques, les astuces de la communauté.

## Feuille de route technique
- [x] Documenter le concept (ce fichier)
- [ ] Créer un module de tracking des erreurs (`services/ErrorTracker.js`)
- [ ] Créer un générateur de mini-défis (`scripts/generateMiniChallenges.js`)
- [ ] Spécifier l’interface remix drag & drop (dans ce README)
- [ ] Prototyper l’interface remix
- [ ] Créer le journal des hacks

## Inspirations
- Hackschooling, Montessori, pensée "hacker"
- Plateformes de code (GitHub : fork, remix, pull request)
- Jeux vidéo (parcours personnalisés, défis communautaires)

## Spécification de l’interface remix (MVP)

- Liste des mini-défis générés automatiquement (chargés depuis `.data/mini-challenges.json`).
- L’utilisateur peut :
  - Glisser-déposer pour réordonner les défis dans son parcours.
  - Supprimer ou dupliquer un défi.
  - Éditer le contenu d’un défi (prompt, exemple).
  - Ajouter un défi personnalisé.
  - Sauvegarder/partager son parcours (export JSON).
  - Forker un parcours existant (import JSON).
- Historique des remix : chaque modification est loggée dans le « journal des hacks ».

---

## Exemple de workflow (prototype)

1. L’utilisateur fait une erreur dans un exercice (ex : conjugaison).
2. `ErrorTracker.logError` enregistre l’erreur dans `.data/error-log.json`.
3. Le script `generateMiniChallenges.js` génère un mini-défi ciblé dans `.data/mini-challenges.json`.
4. L’utilisateur retrouve ce défi dans l’interface remix, peut le déplacer, l’éditer, le forker.
5. Chaque action de remix est logguée par `HackJournal.logRemix` dans `.data/hack-journal.json`.
6. Le parcours remixé peut être exporté, partagé, ou enrichi par la communauté.

---

*Ce hack est évolutif : toute contribution, idée ou fork est la bienvenue !*

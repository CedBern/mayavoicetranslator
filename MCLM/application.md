# Application du MCLM à la structure du projet

Ce document synthétise comment chaque principe, grille, workflow et profil du MCLM est intégré concrètement dans chaque module du projet MayaVoiceTranslator.

## API & Backend
- Endpoints structurés selon les workflows MCLM (ex : POST /api/annotate = annotation collaborative)
- Gestion des rôles (débutant, apprenant, annotateur, référent, admin)
- Sécurisation et traçabilité des actions

## Annotation collaborative
- Interface dédiée, conforme aux grilles et workflows MCLM
- Affichage des niveaux, statuts, badges, historique
- Correction collaborative et validation communautaire

## Certification & feedback
- Processus de certification intégré (demande, suivi, badge)
- Tableau de bord des certifications et compétences
- Feedback utilisateur intégré dans la validation

## Interface utilisateur (site/app)
- Affichage des statuts, badges, niveaux, historique
- Accès différencié selon le profil
- Visualisation de la progression et des certifications

## Gouvernance & traçabilité
- Tableau de bord de suivi des contributions, décisions, certifications
- Historique complet des validations, corrections, votes
- Processus de décision collectif intégré (vote, annotation croisée)

## Sécurité, souveraineté, gouvernance
- Gestion des droits (RBAC/ABAC)
- Exclusion des secrets, audit, sauvegardes
- Gouvernance ouverte, validation collective, processus de décision

---

Chaque fichier du dossier MCLM est à relier à la documentation technique, aux modules de code, et à l’interface, pour garantir la cohérence et l’application réelle du guide dans tout le projet.

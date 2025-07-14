# MayaVoiceTranslator – Guide de workflow automatisé

## 1. Prérequis
- Node.js installé (v16+)
- Un token GitHub personnel (scope repo)
- Accès à un serveur SMTP (pour email) et/ou un webhook Slack (pour notifications)
- Outil markdown-pdf installé (pour génération de rapport PDF)
- Outil open source gratuit `rclone` installé (pour synchronisation cloud des archives)

## 2. Variables d’environnement à configurer
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAILS (pour email)
- SLACK_WEBHOOK_URL (pour Slack)
- RCLONE_REMOTE (destination de synchronisation cloud, par défaut `gdrive:maya-archives`)

## 3. Lancer la pipeline projet (tout-en-un)
```bash
node project_pipeline.js <github_owner> <github_repo> <github_token>
```
- Génère automatiquement : `github_feedback.csv`, `sprint_planning.csv`, `gantt_tasks.csv`, `rapport_sprint.pdf`

## 4. Notifier l’équipe
```bash
node notify_team.js "Planning généré !" "Voir les fichiers à jour dans le dossier projet."
```
- Envoie un email et/ou un message Slack à l’équipe

## 5. Exploiter les fichiers générés
- `github_feedback.csv` : suivi des feedbacks, bugs, suggestions
- `sprint_planning.csv` : planning de sprints priorisé, avec blocages
- `gantt_tasks.csv` : importable dans GanttProject, Notion Timeline, Google Sheets (diagramme de Gantt)
- `rapport_sprint.pdf` : rapport détaillé du sprint, avec statistiques et graphiques

## 6. Importer dans Notion ou Google Sheets
- Ouvre Notion ou Google Sheets, crée un tableau, puis importe le CSV
- Utilise la vue Timeline/Gantt pour visualiser les sprints et dépendances

## 7. Bonnes pratiques
- Relance la pipeline à chaque évolution majeure ou nouvelle vague de feedbacks
- Complète manuellement les assignations, statuts, blocages spécifiques si besoin
- Partage le planning visuel avec l’équipe et les partenaires
- Génère et partage le rapport PDF avec les parties prenantes intéressées

## 8. FAQ
- **Erreur d’authentification GitHub** : vérifie le token et les droits
- **Email non reçu** : vérifie la config SMTP et les spams
- **Slack non reçu** : vérifie le webhook Slack
- **Problème d’import CSV** : vérifie l’encodage UTF-8 et les séparateurs
- **Problème de génération PDF** : vérifie l’installation de markdown-pdf et les permissions

## 9. Archivage automatique
- À chaque exécution de la pipeline, tous les fichiers générés sont archivés dans un dossier daté : `archives/YYYY-MM-DD/`
- Permet de retrouver l’historique des feedbacks, plannings, rapports et Gantt
- Utile pour la traçabilité, les audits, ou revenir à un état antérieur

## 10. Purge automatique des archives anciennes
- À chaque exécution de la pipeline, les dossiers d’archives de plus de 90 jours sont supprimés automatiquement
- Permet de garder le système léger et d’éviter l’encombrement disque
- La durée de rétention peut être ajustée dans `purge_archives.js` (variable `retentionDays`)

## 11. Synchronisation cloud (optionnelle)
- Les archives sont automatiquement synchronisées sur Google Drive (ou autre cloud) via l’outil open source gratuit `rclone`
- Prérequis : installer et configurer rclone (`https://rclone.org/`)
- Par défaut, synchronise `archives/` vers `gdrive:maya-archives` (modifiable dans `sync_archives_cloud.js` ou via la variable d’environnement `RCLONE_REMOTE`)
- Permet de sécuriser les données, faciliter le partage et la récupération en cas de problème local

## 12. Tableau de bord HTML automatique
- Un tableau de bord HTML (`dashboard.html`) est généré à chaque exécution de la pipeline
- Affiche la progression globale, les sprints, tâches, statuts et blocages
- Peut être ouvert localement ou partagé via Google Drive/Dropbox
- Permet un suivi visuel simple et rapide de l’avancement du projet

## 13. Export PDF du dashboard
- Un PDF du tableau de bord HTML (`dashboard.pdf`) est généré automatiquement (nécessite puppeteer)
- Prêt à être partagé ou archivé

## 14. Export JSON du planning
- Un export JSON du planning de sprint (`sprint_planning.json`) est généré automatiquement
- Permet l’intégration facile avec Notion, Jira, Trello, ou tout autre outil via API

## 15. Rapport d’anomalies
- Un rapport d’anomalies (`anomalies_report.csv`) est généré, listant les écarts majeurs détectés
- Utile pour les revues de qualité et les actions correctives

## 16. Changelog automatique
- Un changelog Markdown (`changelog_auto.md`) est généré à partir des issues/PR fermées depuis le dernier sprint
- Prêt à être partagé ou intégré à la documentation/release notes

## 17. Export des tâches bloquées
- Un fichier CSV (`tasks_blocked.csv`) liste toutes les tâches bloquées ou à valider
- Permet de cibler rapidement les points critiques à lever

## 18. Badge de progression
- Un badge SVG d’avancement projet (`progress_badge.svg`) est généré automatiquement à partir du dashboard
- Peut être inclus dans le README ou le site du projet pour afficher la progression en temps réel

---
Ce workflow est conçu pour être simple, reproductible et à coût minimal. Pour toute amélioration, ouvre une issue ou contacte l’équipe technique.

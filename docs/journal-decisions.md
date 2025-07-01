# Journal des décisions et pivots – MayaVoiceTranslator

Ce document centralise l’historique des décisions stratégiques, techniques et organisationnelles du projet. Il permet de reprendre le fil à tout moment, d’expliquer les choix passés, et de faciliter l’onboarding de nouveaux contributeurs.

---

## Table des matières
- [1. Vision et objectifs](#1-vision-et-objectifs)
- [2. Décisions majeures](#2-décisions-majeures)
- [3. Pivots et alternatives](#3-pivots-et-alternatives)
- [4. Historique des conversations IA/consultant](#4-historique-des-conversations-iaconsultant)
- [5. Prochaines étapes](#5-prochaines-étapes)

---

## 1. Vision et objectifs
- Préserver et revitaliser les langues mayas via une API open source, IA, et plateforme communautaire.
- Modèle économique éthique : open core, consulting, sponsors, réinvestissement local.
- Gouvernance participative, souveraineté des données, impact social mesurable.

## 2. Décisions majeures
- **Stack technique** : Node.js 20 LTS + TypeScript + Fastify + Awilix (validé pour MVP)
- **Architecture** : Monolithique modulaire pour MVP, migration microservices possible à l’échelle
- **Dashboard** : Docusaurus + Strapi CMS (documentation + gestion dynamique)
- **Modèle économique** : Freemium, consulting, sponsors, offres institutionnelles
- **Gouvernance** : Conseil des anciens, validation communautaire, principes CARE
- **Sécurité plugins** : isolated-vm (MVP), Docker (prod)

## 3. Pivots et alternatives
- **vm2 → isolated-vm** : Changement suite à vulnérabilités critiques
- **Dashboard** : Évaluation MkDocs/Backstage, choix Docusaurus pour i18n et simplicité
- **Gestion tâches** : GitHub Projects natif, migration possible vers OpenProject/Notion si besoin
- **API** : Démarrage REST, possibilité d’ajouter GraphQL selon besoins futurs

## 4. Historique des conversations IA/consultant
- **2025-06-30** : Validation architecture Node.js + Fastify, recommandations sur la modularité et la gouvernance
- **2025-07-01** : Analyse dashboard : Docusaurus + Strapi recommandé, feuille de route détaillée, priorisation multilingue et analytics
- **2025-07-01** : Stratégie de monétisation : segmentation CTA, automatisation sponsors, offres institutionnelles, plan d’expansion multi-régions
- **2025-07-01** : Conseils sur la gestion des pivots, documentation des décisions, importance d’un fil d’Ariane pour la continuité
- ...

## 5. Prochaines étapes
- Mettre à jour ce journal à chaque décision ou pivot majeur
- Lier ce fichier dans le README et la documentation principale
- Créer un guide “Reprendre le projet en 1h” pour onboarding express

---

> Ce journal est la mémoire vivante du projet. Toute nouvelle décision, analyse IA ou retour stratégique doit y être consignée pour garantir la résilience et la continuité de MayaVoiceTranslator.

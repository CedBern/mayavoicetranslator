# Guide détaillé pour déployer MayaVoiceTranslator sur OVH Public Cloud (niveau débutant)

## ✨ Objectif du guide

Ce guide vous accompagne pas à pas pour déployer et faire fonctionner votre application web MayaVoiceTranslator sur l'infrastructure OVH Public Cloud, en utilisant des conteneurs Docker et Kubernetes, avec CI/CD, monitoring, alertes Slack, PagerDuty et Teams.

---

## 🔧 Partie 1 : Comprendre les concepts de base

### 1.1 Qu'est-ce qu'un conteneur Docker ?

Un conteneur Docker permet d'emballer votre application (code, dépendances, environnement) dans une "boîte" que vous pouvez déployer partout. C'est léger, rapide et portable.

### 1.2 Qu'est-ce que Kubernetes ?

Kubernetes (ou K8s) est un outil pour gérer plusieurs conteneurs sur un cluster de machines. Il automatise le déploiement, la mise à l'échelle, la résilience et la supervision de vos conteneurs.

### 1.3 Différence entre VM et Kubernetes sur OVH

- **VM (machine virtuelle)** : vous gérez tout à la main, avec Docker installé localement.
- **Kubernetes OVH** : OVH gère le cluster, vous ne vous occupez que de vos conteneurs. Recommandé pour des applications modernes et scalables.

---

## 💪 Partie 2 : Architecture technique de MayaVoiceTranslator

### 2.1 Composants de l'application

- **Frontend** : Next.js (React 18), Tailwind CSS
- **Backend** : Node.js (Express), FastAPI (Python)
- **Base de données** : PostgreSQL
- **Conteneurisation** : Docker Compose (ou Kubernetes)
- **CI/CD** : GitHub Actions
- **Monitoring** : Kibana + Elasticsearch

---

## 🚀 Partie 3 : Préparer le déploiement sur OVH Kubernetes

### 3.1 Prérequis

- Un compte OVH Public Cloud
- Créer un cluster Kubernetes dans OVH (2 à 3 nœuds)
- Installer `kubectl` sur votre machine locale
- Créer un projet GitHub avec votre code + Dockerfiles

### 3.2 Créer une registry Docker privée sur OVH

- Utilisez l'offre OVH Container Registry pour stocker vos images Docker

---

## 🔁 Partie 4 : CI/CD et synchronisation des dashboards Kibana

### 4.1 Script de synchronisation : `sync_dashboard.sh`

```bash
#!/usr/bin/env bash
curl -X POST "$KIBANA_SRC/api/saved_objects/_export" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' \
  -d '{"objects":[{"type":"dashboard","id":"<DASH_ID>"}],"includeReferencesDeep": true}' > dashboard.ndjson

curl -X POST "$KIBANA_DST/api/saved_objects/_import?overwrite=true" \
  -H 'kbn-xsrf: true' \
  --form file=@dashboard.ndjson
```

### 4.2 Workflow GitHub Actions : `.github/workflows/sync-dashboard.yaml`

```yaml
on:
  push:
    paths: ['dashboards/**']

jobs:
  sync-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run sync script
        env:
          KIBANA_SRC: ${{ secrets.KIBANA_SRC }}
          KIBANA_DST: ${{ secrets.KIBANA_DST }}
          DASH_ID: ${{ secrets.DASH_ID }}
        run: |
          chmod +x scripts/sync_dashboard.sh
          ./scripts/sync_dashboard.sh
```

---

## 🚨 Partie 5 : Alertes de sécurité

### 5.1 Alerte Slack via Watcher Kibana

Ajoutez le webhook Slack au keystore :

```bash
bin/elasticsearch-keystore add xpack.notification.slack.account.monitoring.secure_url
```

Installez ce Watcher via Dev Tools :

```json
PUT _watcher/watch/kibana_auth_failure_slack
{ ... (voir contenu complet dans le guide original) }
```

### 5.2 Alerte PagerDuty

Ajoutez la clé API PagerDuty :

```bash
bin/elasticsearch-keystore add xpack.notification.pagerduty.account.pd_account.secure_service_api_key
```

Et utilisez le Watcher JSON spécifique.

### 5.3 Alerte Microsoft Teams

- Créez un connector dans Kibana
- Utilisez une règle visuelle via Stack Management → Rules

---

## 📃 Partie 6 : README pour l'équipe technique

Fichier `README.md` incluant :

- Explication de l'architecture
- Prérequis
- Installation
- Alerting
- Automatisation
- FAQ sur les erreurs courantes

---

## 🎉 Conclusion

Avec ce guide, vous êtes maintenant capable de :

- Déployer votre application MayaVoiceTranslator sur OVH Kubernetes
- Mettre en place un monitoring avancé
- Recevoir des alertes critiques sur Slack, Teams, PagerDuty
- Assurer la continuité via CI/CD

Besoin du package ZIP avec tous les fichiers prêts à l'emploi ? Je peux vous le générer sur demande !


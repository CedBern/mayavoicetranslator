Guide détaillé pour déployer MayaVoiceTranslator sur OVH Public Cloud (niveau débutant)
✨ Objectif du guide
Ce guide vous accompagne pas à pas pour déployer et faire fonctionner votre application web MayaVoiceTranslator sur l'infrastructure OVH Public Cloud, en utilisant des conteneurs Docker et Kubernetes, avec CI/CD, monitoring, alertes Slack, PagerDuty et Teams.
🔧 Partie 1 : Comprendre les concepts de base
1.1 Qu'est-ce qu'un conteneur Docker ?
Un conteneur Docker permet d'emballer votre application (code, dépendances, environnement) dans une "boîte" que vous pouvez déployer partout. C'est léger, rapide et portable.
1.2 Qu'est-ce que Kubernetes ?
Kubernetes (ou K8s) est un outil pour gérer plusieurs conteneurs sur un cluster de machines. Il automatise le déploiement, la mise à l'échelle, la résilience et la supervision de vos conteneurs.

1.3 Différence entre VM et Kubernetes sur OVH
VM (machine virtuelle) : vous gérez tout à la main, avec Docker installé localement.
Kubernetes OVH : OVH gère le cluster, vous ne vous occupez que de vos conteneurs. Recommandé pour des applications modernes et scalables.
💪 Partie 2 : Architecture technique de MayaVoiceTranslator
2.1 Composants de l'application
Frontend : Next.js (React 18), Tailwind CSS
Backend : Node.js (Express), FastAPI (Python)
Base de données : PostgreSQL
Conteneurisation : Docker Compose (ou Kubernetes)
CI/CD : GitHub Actions
Monitoring : Kibana + Elasticsearch
2.2 Schéma d'architecture
[ Utilisateur ]
      |
   [ OVH Load Balancer ]
      |
  -----------------------------
  |           |              |
[web]      [backend]      [db]
  |           |              |
[Monitoring, Alerting, CI/CD]

---
## 🔒 Sécurité des secrets et checklist sécurité (à lire avant tout déploiement)
<!-- trigger:ci4 | test Slack webhook après vérification exhaustive -->

### 1. Gestion des secrets (obligatoire)
- **Aucun secret (mot de passe, clé API, token, webhook, etc.) ne doit jamais être committé dans le code, les scripts ou les fichiers de configuration.**
- Tous les secrets doivent être injectés via :
  - GitHub Secrets pour la CI/CD
  - Kubernetes Secrets pour la production
  - `.env.local` (non committé) pour le développement local
- **Supprimez toutes les valeurs par défaut faibles ou génériques dans le code** (ex : `|| 'maya-translator-secret-key'`).
- **En cas de fuite ou de doute, changez immédiatement le secret concerné (rotation).**

### 1.1 Configuration des alertes Slack CI/CD (IMPORTANT)
Utilisez **l'ID du channel Slack** (ex : `<SLACK_CHANNEL_ID>`) et non le nom, dans la configuration GitHub Actions.
- Le token du bot Slack (`SLACK_BOT_TOKEN`) doit être stocké dans GitHub Secrets, jamais en clair.
- Exemple d'intégration dans `.github/workflows/ci-cd.yml` :
  ```yaml
  - name: Slack Notification
    uses: slackapi/slack-github-action@v1.25.0
    env:
      SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
      SLACK_CHANNEL: "<SLACK_CHANNEL_ID>" # Remplacez par l'ID de votre channel
  ```
- **Ne jamais committer d'ID, de token ou de webhook Slack dans le code.**
- En cas de doute ou de problème d'alerte, vérifiez que l'ID du channel est bien utilisé et que le bot a accès au channel.

### 2. Checklist sécurité avant chaque déploiement
- [ ] Tous les secrets nécessaires sont présents dans GitHub Secrets et dans OVH Kubernetes
- [ ] Aucun secret n’est présent dans le code, les logs, ou les fichiers de config/scripts
- [ ] Les images Docker ne contiennent aucun secret en build-time (seulement runtime)
- [ ] Les accès aux secrets se font uniquement via variables d’environnement
- [ ] Les logs ne contiennent jamais de secrets ou de données sensibles
- [ ] Les accès aux plateformes (GitHub, OVH, Slack, etc.) sont limités et régulièrement revus
- [ ] Une procédure de rotation des secrets est connue de l’équipe

### 3. Bonnes pratiques post-déploiement
- Surveillez l’état du cluster et des pods
- Configurez les alertes et dashboards comme décrit plus haut
- Sauvegardez régulièrement vos données (PostgreSQL)
- Faites un scan régulier du repo pour détecter toute fuite de secrets (ex : truffleHog, gitleaks)

---
🚀 Partie 3 : Préparer le déploiement sur OVH Kubernetes
3.1 Prérequis
Un compte OVH Public Cloud
Créer un cluster Kubernetes dans OVH (2 à 3 nœuds)
Installer kubectl sur votre machine locale
Créer un projet GitHub avec votre code + Dockerfiles
3.2 Créer une registry Docker privée sur OVH
Utilisez l'offre OVH Container Registry pour stocker vos images Docker
3.3 Gérer les variables d'environnement et secrets
Utilisez les Secrets Kubernetes pour stocker les variables sensibles (API keys, DB password, etc.)
Exemple :
apiVersion: v1
kind: Secret
metadata:
  name: mayavoice-secrets
stringData:
  POSTGRES_PASSWORD: "<A_REMPLACER_PAR_VOTRE_MOT_DE_PASSE>"
  API_KEY: "<A_REMPLACER_PAR_VOTRE_API_KEY>"
🛠️ Partie 4 : Déployer avec Kubernetes (exemples de manifests)
4.1 Déploiement du backend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: <votre-registry>/mayavoice-backend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: mayavoice-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
4.2 Déploiement du frontend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: <votre-registry>/mayavoice-web:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: mayavoice-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: LoadBalancer
4.3 Déploiement de la base de données PostgreSQL avec volume persistant
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pgdata
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: postgres:15
        envFrom:
        - secretRef:
            name: mayavoice-secrets
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: pgdata
      volumes:
      - name: pgdata
        persistentVolumeClaim:
          claimName: pgdata
---
apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  selector:
    app: db
  ports:
    - protocol: TCP
      port: 5432
      targetPort: 5432
🔁 Partie 5 : CI/CD et synchronisation des dashboards Kibana
5.1 Script de synchronisation : sync_dashboard.sh
#!/usr/bin/env bash
curl -X POST "$KIBANA_SRC/api/saved_objects/_export" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' \
  -d '{"objects":[{"type":"dashboard","id":"<DASH_ID>"}],"includeReferencesDeep": true}' > dashboard.ndjson
curl -X POST "$KIBANA_DST/api/saved_objects/_import?overwrite=true" \
  -H 'kbn-xsrf: true' \
  --form file=@dashboard.ndjson
5.2 Workflow GitHub Actions : .github/workflows/sync-dashboard.yaml
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
🚨 Partie 6 : Alertes de sécurité
6.1 Alerte Slack via Watcher Kibana
Ajoutez le webhook Slack au keystore :
bin/elasticsearch-keystore add xpack.notification.slack.account.monitoring.secure_url
Installez ce Watcher via Dev Tools :

PUT _watcher/watch/kibana_auth_failure_slack
{ ... (voir contenu complet dans le guide original) }
6.2 Alerte PagerDuty
Ajoutez la clé API PagerDuty :
bin/elasticsearch-keystore add xpack.notification.pagerduty.account.pd_account.secure_service_api_key
Et utilisez le Watcher JSON spécifique.

6.3 Alerte Microsoft Teams
Créez un connector dans Kibana
Utilisez une règle visuelle via Stack Management → Rules
📃 Partie 7 : README pour l'équipe technique
Fichier README.md incluant :

Explication de l'architecture
Prérequis
Installation
Alerting
Automatisation
FAQ sur les erreurs courantes
🎉 Conclusion
Avec ce guide, vous êtes maintenant capable de :

Déployer votre application MayaVoiceTranslator sur OVH Kubernetes
Mettre en place un monitoring avancé
Recevoir des alertes critiques sur Slack, Teams, PagerDuty
Assurer la continuité via CI/CD
Besoin du package ZIP avec tous les fichiers prêts à l'emploi ? Je peux vous le générer sur demande !

🚦 Partie 8 : Déploiement réel sur OVH Kubernetes (étape par étape)
8.1 Récupérer l'accès au cluster
Connectez-vous à l’espace client OVHcloud.
Allez dans "Public Cloud" > "Kubernetes" > sélectionnez votre cluster.
Téléchargez le fichier kubeconfig pour ce cluster (ID : 22b88c10-695a-4d9e-a744-8999c5373261).
Configurez kubectl :
export KUBECONFIG=/chemin/vers/kubeconfig.yaml
kubectl get nodes
8.2 Appliquer les manifests Kubernetes
Placez tous vos fichiers manifests (.yaml) dans un dossier (ex : k8s/).

Déployez tout d’un coup :
kubectl apply -f k8s/
Vérifiez les pods :

kubectl get pods
8.3 Vérifier l’exposition du service frontend
Récupérez l’IP publique attribuée par le LoadBalancer :

kubectl get svc web
Accédez à l’URL affichée pour tester l’application.

8.4 Automatiser le déploiement (optionnel)
Intégrez ces commandes dans votre pipeline CI/CD (GitHub Actions, GitLab CI, etc.) pour automatiser le déploiement à chaque push.

8.5 Bonnes pratiques post-déploiement
Surveillez l’état du cluster :
kubectl get nodes
kubectl get pods -A
Configurez les alertes et dashboards comme décrit plus haut.
Pensez à sauvegarder vos données (PostgreSQL) régulièrement.
Votre cluster est maintenant prêt à l’emploi, automatisé, et optimisé pour la production sur OVH Public Cloud !
Guide détaillé pour déployer MayaVoiceTranslator sur OVH Public Cloud (niveau débutant)
✨ Objectif du guide
Ce guide vous accompagne pas à pas pour déployer et faire fonctionner votre application web MayaVoiceTranslator sur l'infrastructure OVH Public Cloud, en utilisant des conteneurs Docker et Kubernetes, avec CI/CD, monitoring, alertes Slack, PagerDuty et Teams.

🔧 Partie 1 : Comprendre les concepts de base
1.1 Qu'est-ce qu'un conteneur Docker ?
Un conteneur Docker permet d'emballer votre application (code, dépendances, environnement) dans une "boîte" que vous pouvez déployer partout. C'est léger, rapide et portable.

1.2 Qu'est-ce que Kubernetes ?
Kubernetes (ou K8s) est un outil pour gérer plusieurs conteneurs sur un cluster de machines. Il automatise le déploiement, la mise à l'échelle, la résilience et la supervision de vos conteneurs.

1.3 Différence entre VM et Kubernetes sur OVH
VM (machine virtuelle) : vous gérez tout à la main, avec Docker installé localement.
Kubernetes OVH : OVH gère le cluster, vous ne vous occupez que de vos conteneurs. Recommandé pour des applications modernes et scalables.
💪 Partie 2 : Architecture technique de MayaVoiceTranslator
2.1 Composants de l'application
Frontend : Next.js (React 18), Tailwind CSS
Backend : Node.js (Express), FastAPI (Python)
Base de données : PostgreSQL
Conteneurisation : Docker Compose (ou Kubernetes)
CI/CD : GitHub Actions
Monitoring : Kibana + Elasticsearch
2.2 Schéma d'architecture
[ Utilisateur ]
      |
   [ OVH Load Balancer ]
      |
  -----------------------------
  |           |              |
[web]      [backend]      [db]
  |           |              |
[Monitoring, Alerting, CI/CD]
🚀 Partie 3 : Préparer le déploiement sur OVH Kubernetes
3.1 Prérequis
Un compte OVH Public Cloud
Créer un cluster Kubernetes dans OVH (2 à 3 nœuds)
Installer kubectl sur votre machine locale
Créer un projet GitHub avec votre code + Dockerfiles
3.2 Créer une registry Docker privée sur OVH
Utilisez l'offre OVH Container Registry pour stocker vos images Docker
3.3 Gérer les variables d'environnement et secrets
Utilisez les Secrets Kubernetes pour stocker les variables sensibles (API keys, DB password, etc.)
Exemple :
apiVersion: v1
kind: Secret
metadata:
  name: mayavoice-secrets
stringData:
  POSTGRES_PASSWORD: "<A_REMPLACER_PAR_VOTRE_MOT_DE_PASSE>"
  API_KEY: "<A_REMPLACER_PAR_VOTRE_API_KEY>"
🛠️ Partie 4 : Déployer avec Kubernetes (exemples de manifests)
4.1 Déploiement du backend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: <votre-registry>/mayavoice-backend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: mayavoice-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
4.2 Déploiement du frontend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: <votre-registry>/mayavoice-web:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: mayavoice-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: LoadBalancer
4.3 Déploiement de la base de données PostgreSQL avec volume persistant
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pgdata
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: postgres:15
        envFrom:
        - secretRef:
            name: mayavoice-secrets
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: pgdata
      volumes:
      - name: pgdata
        persistentVolumeClaim:
          claimName: pgdata
---
apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  selector:
    app: db
  ports:
    - protocol: TCP
      port: 5432
      targetPort: 5432
🔁 Partie 5 : CI/CD et synchronisation des dashboards Kibana
5.1 Script de synchronisation : sync_dashboard.sh
#!/usr/bin/env bash
curl -X POST "$KIBANA_SRC/api/saved_objects/_export" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' \
  -d '{"objects":[{"type":"dashboard","id":"<DASH_ID>"}],"includeReferencesDeep": true}' > dashboard.ndjson

curl -X POST "$KIBANA_DST/api/saved_objects/_import?overwrite=true" \
  -H 'kbn-xsrf: true' \
  --form file=@dashboard.ndjson
5.2 Workflow GitHub Actions : .github/workflows/sync-dashboard.yaml
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
🚨 Partie 6 : Alertes de sécurité
6.1 Alerte Slack via Watcher Kibana
Ajoutez le webhook Slack au keystore :

bin/elasticsearch-keystore add xpack.notification.slack.account.monitoring.secure_url
Installez ce Watcher via Dev Tools :

PUT _watcher/watch/kibana_auth_failure_slack
{ ... (voir contenu complet dans le guide original) }
6.2 Alerte PagerDuty
Ajoutez la clé API PagerDuty :

bin/elasticsearch-keystore add xpack.notification.pagerduty.account.pd_account.secure_service_api_key
Et utilisez le Watcher JSON spécifique.

6.3 Alerte Microsoft Teams
Créez un connector dans Kibana
Utilisez une règle visuelle via Stack Management → Rules
📃 Partie 7 : README pour l'équipe technique
Fichier README.md incluant :

Explication de l'architecture
Prérequis
Installation
Alerting
Automatisation
FAQ sur les erreurs courantes
🎉 Conclusion
Avec ce guide, vous êtes maintenant capable de :

Déployer votre application MayaVoiceTranslator sur OVH Kubernetes
Mettre en place un monitoring avancé
Recevoir des alertes critiques sur Slack, Teams, PagerDuty
Assurer la continuité via CI/CD
Besoin du package ZIP avec tous les fichiers prêts à l'emploi ? Je peux vous le générer sur demande !

🚦 Partie 8 : Déploiement réel sur OVH Kubernetes (étape par étape)
8.1 Récupérer l'accès au cluster
Connectez-vous à l’espace client OVHcloud.
Allez dans "Public Cloud" > "Kubernetes" > sélectionnez votre cluster.
Téléchargez le fichier kubeconfig pour ce cluster (ID : 22b88c10-695a-4d9e-a744-8999c5373261).
Configurez kubectl :
export KUBECONFIG=/chemin/vers/kubeconfig.yaml
kubectl get nodes
8.2 Appliquer les manifests Kubernetes
Placez tous vos fichiers manifests (.yaml) dans un dossier (ex : k8s/).

Déployez tout d’un coup :

kubectl apply -f k8s/
Vérifiez les pods :

kubectl get pods
8.3 Vérifier l’exposition du service frontend
Récupérez l’IP publique attribuée par le LoadBalancer :

kubectl get svc web
Accédez à l’URL affichée pour tester l’application.

8.4 Automatiser le déploiement (optionnel)
Intégrez ces commandes dans votre pipeline CI/CD (GitHub Actions, GitLab CI, etc.) pour automatiser le déploiement à chaque push.

8.5 Bonnes pratiques post-déploiement
Surveillez l’état du cluster :
kubectl get nodes
kubectl get pods -A
Configurez les alertes et dashboards comme décrit plus haut.
Pensez à sauvegarder vos données (PostgreSQL) régulièrement.

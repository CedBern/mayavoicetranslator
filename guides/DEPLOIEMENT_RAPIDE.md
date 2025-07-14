# Guide de déploiement rapide (FR)

## Prérequis
- Docker & Docker Compose
- Node.js, Python 3.9+, pip

## Lancer tous les services (dev)
```bash
docker-compose up --build
```

## Accès aux services
- NMT/LLM: http://localhost:4001
- Annotation: http://localhost:5001
- Feedback: http://localhost:4002
- RAG: http://localhost:5002
- Selector: http://localhost:4003
- Cache: http://localhost:5003
- Gouvernance: http://localhost:4004
- Traçabilité: http://localhost:6001
- Métriques: http://localhost:6002

## Personnalisation
- Modifier `.env` pour les variables d’environnement
- Ajouter vos modèles, scripts, corpus dans les dossiers dédiés

## Production
- Adapter les ports, la sécurité, et les volumes selon vos besoins
- Intégrer CI/CD, monitoring, backups

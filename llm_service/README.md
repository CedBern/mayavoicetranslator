# Microservice d'orchestration LLM pour la traduction Maya

Ce dossier contient un microservice Python (FastAPI) qui orchestre l'ensemble de modèles LLM pour la traduction automatique du maya yucatèque.

## Lancer le service localement

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

- Endpoint principal : `POST /translate`
- Endpoint de santé : `GET /health`

## Exemple de requête

```json
POST /translate
{
  "source_text": "Ba'ax ka wa'alik?",
  "source_language": "maya",
  "target_language": "spanish",
  "dialect": "eastern_yucatan"
}
```

## Intégration avec Node.js

Le backend Node.js peut appeler ce service via HTTP (fetch, axios, etc.) pour obtenir les traductions.

---

Pour personnaliser le pipeline, modifiez `main.py` (ajout des appels LLM, vote, etc.).

# MayaVoiceTranslator – Guide de déploiement rapide

## 1. Prérequis

- **Docker Desktop** (Windows/Mac/Linux) : https://www.docker.com/products/docker-desktop/
- **Node.js** (si besoin de build local hors Docker)
- **MongoDB** (local ou via Docker, selon configuration)

## 2. Sécurité & bonnes pratiques

- Les fichiers `.env`, `.env.*` sont exclus du dépôt (`.gitignore`, `.dockerignore`).
- **Ne jamais** versionner de secrets, mots de passe, clés API, etc.
- Pour réinitialiser l’index Git si un secret a déjà été commité :
  ```sh
  git rm --cached .env
  git commit -m "Retire .env de l’index"
  ```

## 3. Lancement rapide avec Docker

1. Place ton fichier `.env` à la racine du projet (jamais dans le dépôt !)
2. Démarre Docker Desktop
3. Lance :
   ```sh
   docker-compose up --build
   ```
   ou, si pas de `docker-compose.yml` :
   ```sh
   docker build -t mayavoicetranslator .
   docker run --env-file .env -p 3000:3000 mayavoicetranslator
   ```

## 4. Accès

- API : http://localhost:3000
- Frontend : http://localhost:5173 (ou selon config)

## 5. Dépannage

- Si Docker ne démarre pas, vérifie que tu es dans le groupe `docker-users` et que Docker Desktop est lancé.
- Pour voir les logs :
  ```sh
  docker logs <nom_du_conteneur>
  ```
- Pour arrêter :
  ```sh
  docker-compose down
  ```

## 6. Structure des fichiers sensibles

```
.env           # Variables d’environnement backend
.env.local     # Variables locales (jamais versionnées)
```

## 7. Contact & support

Pour toute question technique, voir la documentation interne ou contacter l’admin du projet.

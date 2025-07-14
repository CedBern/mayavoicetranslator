# Guide de déploiement OVH – MayaVoiceTranslator

## 1. Préparation de l’instance
- Créez une instance B2-15 (ou B2-7) sur OVH Public Cloud (Ubuntu 22.04 recommandé).
- Ajoutez votre clé SSH.

## 2. Installation automatisée
- Connectez-vous en SSH :
  ```sh
  ssh ubuntu@<IP_INSTANCE>
  ```
- Lancez le script d’installation :
  ```sh
  sudo bash setup_ovh_instance.sh
  ```
- Redémarrez la session pour appliquer les droits Docker.

## 3. Déploiement du projet
- Clonez le dépôt :
  ```sh
  git clone <votre-repo> maya-voice-translator
  cd maya-voice-translator
  ```
- Placez votre fichier `.env` à la racine (jamais versionné).
- Lancez les services Docker :
  ```sh
  docker compose -f .devcontainer/docker-compose.yml up --build -d
  ```
- Vérifiez le statut :
  ```sh
  docker compose -f .devcontainer/docker-compose.yml ps
  docker compose -f .devcontainer/docker-compose.yml logs -f
  ```

## 4. Validation
- Accédez à http://<IP>:3001 (web) et http://<IP>:3000 (API).
- Exécutez les scripts de validation (`go_nogo_check.sh`, etc.).

## 5. Conseils production
- Utilisez un reverse proxy (Caddy/NGINX) pour HTTPS.
- Sauvegardez régulièrement vos données (DB, corpus, configs).
- Surveillez l’utilisation CPU/RAM/disque (`htop`, `docker stats`).
- Mettez à jour Docker et vos images régulièrement.

---

Pour toute question, consultez la documentation ou contactez l’équipe projet.

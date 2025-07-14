# DEPLOYMENT_QUICKSTART.md

## Démarrage rapide MayaVoiceTranslator (Docker/Codespaces)

### 1. Lancer l'environnement Docker

```sh
docker-compose -f .devcontainer/docker-compose.yml up --build
```

- **Backend** : http://localhost:3000
- **Web (frontend)** : http://localhost:3001

### 2. Accès rapide
- Backend API : http://localhost:3000
- Interface web : http://localhost:3001

### 3. Bonnes pratiques
- Modifiez le code sur votre machine, les changements sont synchronisés dans les conteneurs.
- Les dépendances sont isolées dans chaque conteneur (`node_modules` non partagés).
- Pour ajouter une base de données, décommentez la section `db` dans `docker-compose.yml`.

### 4. Tests rapides
- Vérifiez que les deux URLs ci-dessus répondent.
- Utilisez les scripts de test ou l'interface web pour valider les fonctionnalités principales.
- Exécutez le script PowerShell `check_deploy_ready.ps1` pour une validation automatisée :

```powershell
./check_deploy_ready.ps1
```
Ce script vérifie : accessibilité des services, variables d'environnement, dépendances.

### 5. Lancement production

Pour lancer tous les services en mode production (détaché) :

```powershell
./start_production.ps1
```

Pour suivre les logs :

```powershell
docker-compose -f .devcontainer/docker-compose.yml logs -f
```

### 5. Migration Codespaces
- L'environnement est prêt pour GitHub Codespaces (voir `.devcontainer/`).
- Après le premier déploiement, suivez la documentation pour la migration complète.

---

Pour plus de détails, consultez le README principal et la documentation avancée.

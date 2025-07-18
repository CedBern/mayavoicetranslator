# API Séquences Didactiques Maya

Ce projet est une API Flask en Python permettant de créer, gérer et rechercher des séquences didactiques pour le maya, conforme au Marco de Competencias de la Lengua Maya (MCMY).

## Fonctionnalités principales
- Création, récupération, mise à jour et suppression de séquences didactiques
- Recherche et récupération de documents dans la bibliothèque
- Recherche et récupération de ressources sur internet
- Gestion des utilisateurs, ressources et activités
- Authentification JWT (à implémenter)

## Démarrage rapide
1. Installez les dépendances :
   ```bash
   pip install flask
   ```
2. Lancez l'API :
   ```bash
   python app.py
   ```

## Intégration dans le projet mayavoicetranslator

Le dossier `genseqdid` contient l'API Flask pour la gestion des séquences didactiques. Pour l'utiliser dans le projet principal :

- Assurez-vous que le dossier `genseqdid` est bien dans la racine du projet `mayavoicetranslator`.
- Lancez l'API avec :
  ```bash
  cd genseqdid
  python app.py
  ```
- Vous pouvez interagir avec l'API via HTTP depuis n'importe quel module Python du projet principal, par exemple avec la bibliothèque `requests` :
  ```python
  import requests
  response = requests.get('http://localhost:5000/api/sequences')
  print(response.json())
  ```

### Exemple d'intégration avancée

Vous pouvez importer l'application Flask dans un autre module Python du projet principal pour l'utiliser ou l'étendre :

Dans le fichier `genseqdid/app.py`, assurez-vous que l'application Flask est accessible :
```python
app = Flask(__name__)
# ...existing code...
```

Dans un autre fichier Python du projet principal :
```python
from genseqdid.app import app

# Démarrer l'application Flask (par exemple, pour des tests ou une extension)
if __name__ == "__main__":
    app.run(debug=True)
```

Cela permet d'intégrer l'API dans des workflows plus complexes ou d'utiliser des outils comme `pytest` pour les tests automatisés.

## Structure des endpoints
Voir le code source pour la liste complète des endpoints et exemples d'utilisation.

## Sécurisation de l'API : Authentification JWT et gestion des rôles

### 1. Authentification JWT avec Flask-JWT-Extended
- Utilisation de la bibliothèque open-source `Flask-JWT-Extended` pour générer, vérifier et gérer les tokens JWT.
- Stockage sécurisé de la clé secrète (`JWT_SECRET_KEY`) via variables d'environnement.
- Durée de vie courte des tokens d'accès, support du rafraîchissement et de la mise sur liste noire.
- Utilisation obligatoire de HTTPS pour toutes les communications.

### 2. Gestion fine des rôles et permissions
- Modélisation des rôles (enseignant, chercheur, admin, etc.) et des permissions en base de données.
- Inclusion des rôles dans le payload JWT pour un contrôle d'accès rapide et granulaire.
- Décorateurs personnalisés pour restreindre l'accès aux endpoints selon le rôle ou la permission.

### 3. Intégration OAuth 2.0 pour applications tierces
- Utilisation de `Authlib` ou `Flask-Dance` pour la délégation d'accès sécurisée.
- Gestion des scopes et validation stricte des redirections.

### 4. Bonnes pratiques de sécurité
- Validation rigoureuse des entrées utilisateur, hachage des mots de passe (bcrypt/Argon2).
- Configuration sécurisée des cookies et des sessions.
- Journalisation et audit des accès sensibles.
- Maintenance proactive et mises à jour régulières des dépendances.

### 5. Déploiement et gestion des clés
- Hébergement économique (Heroku, alternatives), configuration par variables d'environnement.
- Rotation régulière des clés et gestion stricte des accès internes.

## Prochaines étapes
- Ajouter l'authentification JWT avec gestion des rôles
- Intégrer une base de données relationnelle
- Ajouter des validations, tests et endpoints sécurisés

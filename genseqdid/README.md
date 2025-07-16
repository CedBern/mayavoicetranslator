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

## Prochaines étapes
- Ajouter l'authentification JWT
- Intégrer une base de données réelle
- Ajouter des validations et des tests

# Plan CI/CD minimal Cortex

- Lint automatique (eslint, prettier)
- Tests unitaires (jest)
- Build et vérification des dépendances
- Génération de documentation
- Déploiement sur GitHub Actions (à configurer)

Exemple de workflow `.github/workflows/ci.yml` :

name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build

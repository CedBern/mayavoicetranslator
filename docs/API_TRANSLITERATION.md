# Documentation API : Translittération Maya intelligente

## Endpoints Node.js

- `POST /api/context/analyze` : Analyse contextuelle (texte, métadonnées)
- `POST /api/context/transliterate` : Translittération adaptative (texte, contexte)

## Microservice Python (FastAPI)

- `POST /analyze-context` : Analyse contextuelle (texte, métadonnées)
- `POST /transliterate` : Translittération adaptative (texte, contexte)

## Frontend React

- Composant : `frontend/components/ContextTransliterationWidget.jsx`
- Usage : Interface pour saisir un texte maya, analyser le contexte, translittérer, et afficher les résultats enrichis

## Intégration

- Le backend Node.js délègue l’IA au microservice Python via HTTP (axios)
- Le frontend interroge le backend via fetch (API REST)
- Prêt pour extension validation communautaire, gamification, blockchain, etc.

---

Pour toute évolution (ajout IA réelle, validation, etc.), étendre les endpoints Python et adapter le service Node.js.

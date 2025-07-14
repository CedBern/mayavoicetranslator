# UI/UX Internationalization Automation Guide

## Goal
Make it easy for all contributors (including non-coders) to internationalize any user-facing data or text in MayaVoiceTranslator.

## Pattern: i18n Utility Functions

1. **Move user-facing data to a utility file** (e.g., `utils/i18nVoices.js`).
2. **Export a function** that takes the translation function `t` as an argument and returns the data with all strings wrapped in `t()`.
3. **In your component**, import the utility and call it with `t` from `useTranslation()`.

### Example

**utils/i18nVoices.js**
```js
export function getVoicesData(t) {
  return [
    { language: t('Maya Yucatèque'), ... }
    // ...
  ];
}
```

**In your component:**
```js
import { getVoicesData } from '../utils/i18nVoices';
const { t } = useTranslation();
const voices = getVoicesData(t);
```

## Checklist for i18n Automation
- [ ] Move all user-facing arrays/objects to a utility file.
- [ ] Wrap all visible strings in `t()`.
- [ ] For static text in JSX, use `{t('Your text')}`.
- [ ] For dynamic data, use a utility function as above.
- [ ] Add new languages in `i18n.js` resources.

## Optional: Script for i18n Coverage
- Use a code search for hardcoded French/English strings in `.tsx`/`.js` files.
- Suggest wrapping with `t()` or moving to a utility.

---

## Architecture Multimodale “Pluggable” et Orchestration

### 1. Système de plugins pour les modalités
- Chaque modalité (audio, labial, signes, OCR, etc.) est un module/plugin indépendant.
- L’orchestrateur charge, active ou désactive dynamiquement chaque plugin selon la requête ou la configuration.
- Ajouter une modalité = créer un nouveau module conforme à l’interface plugin, puis l’enregistrer dans l’orchestrateur.

**Exemple d’interface minimale d’un plugin :**
```js
// plugins/audio.js
export default {
  name: 'audio',
  recognize: async (input, options) => { /* ... */ },
  // Optionnel : logs, scores, etc.
};
```

### 2. Centralisation des logs et traçabilité
- Tous les plugins et l’orchestrateur envoient leurs logs, scores de confiance, et décisions à un logger central.
- Chaque résultat inclut la trace des plugins utilisés, leurs sorties, et la logique de fusion/décision de l’orchestrateur.

### 3. API multimodale unifiée
- Un seul endpoint pour toutes les modalités : `/api/multimodal`.
- Le client peut spécifier les modalités à utiliser :
```json
{
  "input": "...",
  "modalities": ["audio", "labial"]
}
```
- L’orchestrateur peut aussi décider dynamiquement des modalités à activer.

### 4. Feedback utilisateur et apprentissage continu
- L’UI propose un feedback direct (ex : validation, correction, commentaire) pour chaque résultat.
- Ce feedback est centralisé et peut servir à ajuster dynamiquement les pondérations/priorités dans l’orchestrateur.

### 5. Scalabilité et microservices
- Chaque modalité peut devenir un microservice indépendant, orchestré par une API Gateway ou l’orchestrateur central.
- Permet de faire évoluer le système sans toucher au cœur du pipeline.

---

## Module de feedback utilisateur (UI & API)

### 1. Composant React de feedback (exemple minimal)
```jsx
// components/FeedbackWidget.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FeedbackWidget({ onSubmit }) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(value); setValue(''); }}>
      <label htmlFor="feedback">{t('Your feedback')}</label>
      <input
        id="feedback"
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label={t('Your feedback')}
      />
      <button type="submit">{t('Send')}</button>
    </form>
  );
}
```
- Accessible, internationalisé, simple à intégrer sous chaque résultat.

### 2. API centralisée pour les retours
- Endpoint dédié, ex : `POST /api/feedback`
- Payload :
```json
{
  "resultId": "...", // identifiant du résultat ou de la session
  "feedback": "...", // texte ou code
  "userId": "..." // optionnel, anonyme ou authentifié
}
```
- Les retours sont stockés pour analyse, audit, et amélioration continue.

### 3. Exploitation des feedbacks dans l’orchestrateur
- Les feedbacks peuvent ajuster dynamiquement les pondérations/priorités des plugins/modalités.
- Permet l’apprentissage continu, la validation communautaire, et la transparence.

**Bonnes pratiques :**
- Toujours internationaliser les messages et labels de feedback.
- Rendre le feedback accessible (clavier, lecteurs d’écran, etc.).
- Documenter le traitement des feedbacks côté API et orchestrateur.

---

## Logger centralisé et traçabilité (logs)

### 1. Exemple de logger centralisé (Node.js)
```js
// services/logger.js
export function logEvent({
  type, // 'info', 'error', 'decision', etc.
  plugin, // nom du plugin ou 'orchestrator'
  message,
  data = {},
  userId = null, // optionnel
  locale = 'fr', // pour i18n
}) {
  // Ici, on peut écrire dans un fichier, une base, ou un service externe
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    type,
    plugin,
    message,
    data,
    userId,
    locale,
  }));
}
```
- Tous les plugins et l’orchestrateur doivent utiliser ce logger pour chaque action importante (démarrage, résultat, erreur, décision, feedback reçu, etc.).

### 2. Bonnes pratiques
- Les messages de logs doivent être internationalisés si affichés à l’utilisateur ou à la communauté.
- Les logs doivent être accessibles (format structuré, consultable par tous les profils, y compris non-codeurs).
- Respecter la vie privée et l’éthique (pas de données sensibles, anonymisation si besoin).

### 3. Exploitation des logs
- Les logs servent à : l’audit, le debug, l’amélioration continue, la transparence vis-à-vis des utilisateurs et contributeurs.
- Possibilité de générer des rapports ou dashboards à partir des logs pour suivre la qualité, l’usage, et les incidents.

---

## Exploitation des logs et feedbacks (rapports, dashboards)

### 1. Extraction et agrégation des logs/feedbacks
- Les logs structurés (JSON) peuvent être extraits du système (fichier, base, etc.)
- Exemple de script Node.js pour agréger les feedbacks par plugin ou par type d’événement :
```js
// scripts/aggregate-logs.js
const fs = require('fs');
const logs = fs.readFileSync('logs.json', 'utf-8').split('\n').filter(Boolean).map(JSON.parse);
const feedbacks = logs.filter(l => l.type === 'feedback');
const byPlugin = feedbacks.reduce((acc, f) => {
  acc[f.plugin] = (acc[f.plugin] || 0) + 1;
  return acc;
}, {});
console.log('Feedbacks par plugin :', byPlugin);
```

### 2. Visualisation et restitution
- Les données peuvent être exportées en CSV, visualisées dans un tableur, ou intégrées à un dashboard open source (ex : Metabase, Grafana, Superset).
- Possibilité de publier des rapports périodiques pour la communauté (transparence, amélioration continue).

### 3. Bonnes pratiques
- Anonymiser les données sensibles avant toute restitution publique.
- Documenter les scripts et outils pour que tout contributeur puisse les utiliser ou les adapter.
- Favoriser les formats ouverts et accessibles.

---

## Tests automatisés
- [ ] Lancer `npm test` pour les tests unitaires (Jest).
- [ ] Lancer `npx playwright test` pour les tests e2e (si Playwright installé).
- [ ] Vérifier la CI sur GitHub Actions.

## Génération de rapports
- [ ] Générer le rapport feedbacks : `node scripts/generate-feedbacks-report.js`.
- [ ] Anonymiser les logs avant publication : `node scripts/anonymize-logs.js`.

---

**Note contributeurs :**
- Tous les modules/plugins doivent suivre les patterns d’i18n et d’accessibilité décrits plus haut.
- Les logs et feedbacks doivent être internationalisés et accessibles à tous les contributeurs, y compris non-codeurs.

---
This pattern keeps i18n logic clean, reusable, and accessible for all contributors.

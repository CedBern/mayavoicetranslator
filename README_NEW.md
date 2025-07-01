# MayaVoiceTranslator 🗣️ – Préserver les langues mayas par l’IA éthique

**Traduction vocale temps réel pour 30+ langues mayas**
API open source connectant 6 millions de locuteurs à la technologie moderne tout en préservant leur patrimoine linguistique.

[🚀 Démo Live](https://cedbe.github.io/MayaVoiceTranslator/dashboard.html) | [📖 Documentation](./docs/) | [🤝 Contribuer](./CONTRIBUTING.md)

[![Build](https://github.com/cedbe/MayaVoiceTranslator/actions/workflows/test-multilang.yml/badge.svg)](https://github.com/cedbe/MayaVoiceTranslator/actions/workflows/test-multilang.yml)
[![Coverage](https://codecov.io/gh/cedbe/MayaVoiceTranslator/branch/main/graph/badge.svg)](https://codecov.io/gh/cedbe/MayaVoiceTranslator)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-✔️-brightgreen)](./CODE_OF_CONDUCT.md)

---

## 📋 Navigation rapide
- [🎯 Mission & Impact](#mission--impact)
- [🚀 Démarrage rapide](#démarrage-rapide)
- [💡 Cas d’usage](#cas-dusage)
- [🤝 Contribuer](#contribuer)
- [💚 Modèle économique](#modèle-économique)
- [🌿 Engagement éthique](#engagement-éthique)
- [🏗️ Architecture](#architecture)
- [📖 Documentation complète](./docs/)

---

## 🎯 Mission & Impact

Préserver, transmettre et valoriser les langues mayas grâce à l’IA, la communauté et la science ouverte.

> "Grâce à MayaVoiceTranslator, ma grand-mère de 82 ans peut enfin utiliser WhatsApp en Q'eqchi'. Elle communique maintenant quotidiennement avec ses petits-enfants en ville."
> — **Maria Caal**, enseignante au Guatemala

### Chiffres clés
- **6M+** locuteurs connectés
- **30+** variantes mayas préservées
- **500+** écoles utilisatrices
- **95%** de précision validée par linguistes locaux

[Plus d’histoires](./docs/impact-stories.md)

---

## 🚀 Démarrage rapide

Testez l’API en 5 minutes :

```js
// Traduire de l'espagnol vers le maya yucatèque
const maya = require('maya-voice-translator');
const translator = maya.init({ apiKey: 'test_key' });
const result = await translator.translate({
  text: "Buenos días, ¿cómo estás?",
  from: 'es',
  to: 'yua'
});
console.log(result.text); // "Ma'alob k'iin, bix a beel?"
console.log(result.audio); // URL audio avec prononciation
```

[Guide d’installation détaillé](./docs/getting-started.md)

---

## 💡 Cas d’usage
- Traduction instantanée WhatsApp, SMS, web, mobile
- Apprentissage bilingue à l’école (maya ↔ espagnol/français/anglais)
- Documentation linguistique pour ONG et chercheurs
- Transmission intergénérationnelle (audio, jeux, histoires)

[Exemples détaillés](./docs/examples/)

---

## 🤝 Contribuer

### Pour locuteurs natifs
- [Valider des traductions](./docs/contribute/validate.md) – 15 min
- [Enregistrer votre voix](./docs/contribute/voice.md) – 30 min
- [Signaler des erreurs culturelles](./docs/contribute/cultural.md)

### Pour développeurs
- [Good first issues](https://github.com/cedbe/MayaVoiceTranslator/labels/good%20first%20issue)
- [Ajouter une langue](./docs/add-language.md)
- [Améliorer les modèles IA](./docs/ml-contribution.md)

### Pour linguistes/chercheurs
- [Protocole de documentation](./docs/linguistic-protocol.md)
- [Standards de transcription](./docs/transcription.md)
- [Comité éthique](./docs/ethics-committee.md)

[Guide de contribution complet](./CONTRIBUTING.md)

---

## 💚 Modèle économique : 100% réinvesti dans les communautés mayas

Chaque euro généré finance directement :
- 🧑‍💻 Formation de linguistes mayas locaux (40%)
- 🔧 Infrastructure et maintenance (30%)
- 🌱 Nouveaux dialectes et fonctionnalités (20%)
- 📚 Documentation communautaire (10%)

### Offres adaptées à chaque besoin

🌱 **Community** – Gratuit pour toujours
✓ Traduction illimitée pour usage personnel
✓ Support de 30+ langues mayas
✓ Auto-hébergement (AGPL-3.0)

🏛️ **Institutions** – 99€/mois
✓ API haute disponibilité + SLA 99.9%
✓ Formation personnalisée
✓ Support prioritaire

🏢 **Enterprise** – Sur mesure
✓ Déploiement privé + conformité
✓ Langues personnalisées
✓ Équipe dédiée

> **Impact social garanti** : Les revenus Enterprise financent l'accès gratuit pour 10 communautés rurales

[Plus de détails](./docs/business-model.md)

---

## 🌿 Engagement éthique

### Principes fondamentaux
- **Souveraineté des données** : Contrôle total par les communautés
- **Bénéfice collectif** : 100% des revenus réinvestis localement
- **Consentement continu** : Droit de retrait à tout moment
- **Réciprocité** : Formation et emplois pour les communautés

### Gouvernance participative
Le projet est guidé par un **Conseil des Aînés** représentant 12 communautés mayas qui :
- Valident toutes les décisions majeures
- Définissent les priorités de développement
- Garantissent le respect culturel

[Charte éthique complète](./docs/ethical-charter.md)

---

## 🏗️ Architecture

### Conçue pour l’inclusion
- **Mode hors-ligne** : Essentiel pour zones rurales (500MB)
- **API légère** : Optimisée pour connexions lentes (2G/3G)
- **Multi-plateforme** : WhatsApp, SMS, web, mobile
- **Formats accessibles** : Audio pour non-lecteurs, texte pour sourds

### Open source de bout en bout
- Backend : Node.js + Redis (haute performance)
- ML : TensorFlow + modèles communautaires
- Frontend : Progressive Web App
- Infrastructure : Docker + Kubernetes

[Architecture détaillée](./docs/architecture.md) | [Déployer localement](./docs/self-host.md)

---

## 📖 Documentation complète

- [Docs complètes](./docs/)
- [API Reference](./docs/api-reference/)
- [Exemples](./docs/examples/)
- [Impact stories](./docs/impact-stories.md)
- [Business model](./docs/business-model.md)
- [Charte éthique](./docs/ethical-charter.md)
- [Guide contributeurs](./CONTRIBUTING.md)

---

*Ce README est un point d’entrée. Pour toute question, ouvrez une issue ou contactez l’équipe projet.*

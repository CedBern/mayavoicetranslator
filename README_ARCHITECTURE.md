# Architecture modulaire Cortex (Node.js/TypeScript)

- **src/modules/audio/** : gestion du corpus audio, endpoints audio, pipeline transcription
- **src/modules/languages/** : ressources linguistiques, endpoints phonologie/grammaire
- **src/modules/transcription/** : pipeline transcription hybride (Whisper, validation communautaire)
- **src/modules/plugins/** : intégration plugins NMT, sécurité, sandboxing
- **src/shared/auth/** : authentification, gestion des droits
- **src/shared/sovereignty/** : gouvernance, gestion des dialectes, principes CARE

**Stack** : Node.js 20 LTS, Fastify 4.x, Awilix, TypeScript, monolithe modulaire, plugins, sécurité avancée.

Voir docs/API_GUIDE.md et API_PHONOLOGY.md pour la documentation API.

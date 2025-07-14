# Checklist de conformité – Architecture OVH MayaVoiceTranslator

Cette checklist permet de vérifier la conformité de l’installation et de la configuration selon les recommandations DeepSeek et les bonnes pratiques de souveraineté, sécurité et gouvernance communautaire.

## Sécurité & Souveraineté
- [ ] Chiffrement des colonnes sensibles PostgreSQL (`pgcrypto`)
- [ ] RLS (Row Level Security) activé sur toutes les tables sensibles
- [ ] RBAC (contrôle d’accès par rôle) configuré
- [ ] Secrets et clés API hors du dépôt Git (`.env` non versionné)
- [ ] Pare-feu activé, ports ouverts strictement nécessaires (22, 3000, etc.)
- [ ] Snapshots OVH activés
- [ ] Sauvegardes régulières PostgreSQL (rclone/borg/Backblaze)
- [ ] Audit de sécurité hebdomadaire (`npm audit`, `trivy`, `pgAudit`)

## Gouvernance & Consentement
- [ ] Protocoles Mukurtu actifs (accès granulaire, labels TK)
- [ ] Journalisation des consentements FPIC (Hyperledger ou équivalent)
- [ ] Comité communautaire constitué et informé
- [ ] Outils Loomio ou équivalent pour décisions collaboratives

## Documentation & Accessibilité
- [ ] Documentation technique à jour (français, espagnol, maya)
- [ ] Checklist OWASP adaptée et traduite
- [ ] Guides d’onboarding et d’utilisation accessibles

---

*À compléter à chaque déploiement ou évolution majeure du projet.*

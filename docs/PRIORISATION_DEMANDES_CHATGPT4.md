# Priorisation des demandes techniques à ChatGPT 4.1 – MayaVoiceTranslator

Ce document propose un ordre de priorité pour les demandes à adresser à ChatGPT 4.1, afin d’optimiser la sécurité, l’automatisation et la documentation du projet.

## Ordre de priorité recommandé

1. **Configuration complète de RLS et RBAC PostgreSQL par communauté**
2. **Script de sauvegarde PostgreSQL chiffrée vers Backblaze B2 ou IPFS (bash ou Node.js)**
3. **Audit de sécurité automatisé sur VPS Ubuntu (npm audit, trivy, pgaudit)**
4. **docker-compose avec Mukurtu et IPFS + persistance/logs**
5. **.env sécurisé pour Node.js (helmet, CORS, etc.)**
6. **GitHub Actions pour déploiement Node.js sur VPS OVH**
7. **Tests post-déploiement (ports, firewall, backups)**
8. **Outils open source de monitoring VPS OVH**
9. **Limitation d’upload audio (Node.js + nginx)**
10. **Politique PostgreSQL anti-accès non authentifié**
11. **Template de checklist OWASP**
12. **README multilingue FR/ES/EN**
13. **Traduction d’un guide technique (à fournir)**

---

*Ce plan peut être adapté selon l’avancement du projet ou les besoins urgents. À transmettre à ChatGPT pour traitement séquentiel ou par lots.*

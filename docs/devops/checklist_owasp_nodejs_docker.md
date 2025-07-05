# Checklist de sécurité OWASP – Node.js + PostgreSQL + Docker

## Contrôle d’accès
- [ ] API et routes sensibles protégées (auth, autorisation)
- [ ] Gestion des droits par rôle (RBAC)
- [ ] Pas d’accès direct aux ressources sensibles (IDOR)
- [ ] Désactivation des comptes inactifs

## Injection
- [ ] Requêtes SQL paramétrées ou ORM sécurisé
- [ ] Validation stricte des entrées (Joi, express-validator)
- [ ] Échappement des sorties (XSS)
- [ ] Pas de concaténation dangereuse
- [ ] Pas de raw query non protégée

## Configuration et déploiement
- [ ] Configs par défaut changées (pas de mot de passe/admin par défaut)
- [ ] Fichiers sensibles non exposés (.env, Dockerfile)
- [ ] PostgreSQL sécurisé (pg_hba.conf, listen_addresses)
- [ ] En-têtes HTTP de sécurité (CSP, X-Content-Type-Options, etc.)
- [ ] Docker non root, ports limités, secrets hors image
- [ ] Permissions minimales sur le système

## Authentification/session
- [ ] Mots de passe hachés (bcrypt, Argon2)
- [ ] Politique de mot de passe robuste
- [ ] JWT/session sécurisés (HttpOnly, Secure, SameSite)
- [ ] Fonctions sensibles protégées (2FA, re-auth)
- [ ] Protection CSRF
- [ ] Gestion du cycle de vie des comptes (reset, suppression)

## Données sensibles
- [ ] Chiffrement en transit (TLS/SSL)
- [ ] Chiffrement au repos (pgcrypto, backups)
- [ ] Clés/certificats gérés et stockés en sécurité
- [ ] Pas de secrets en clair dans les logs

## Journalisation et surveillance
- [ ] Logs des actions sensibles
- [ ] Logs protégés et conservés
- [ ] Monitoring/alerting en place
- [ ] Scans de vulnérabilité réguliers (OWASP ZAP, npm audit)
- [ ] Politique de réponse aux incidents

## Dépendances et intégrité
- [ ] Dépendances Node à jour (`npm audit`, Snyk)
- [ ] Images Docker et OS à jour (`docker scan`, Trivy)
- [ ] Suppression des modules inutiles
- [ ] CI/CD sécurisé (hash, secrets protégés)
- [ ] Monitoring de l’intégrité des fichiers

## SSRF et interactions externes
- [ ] Validation des URL externes
- [ ] Timeout et restrictions sur les appels sortants
- [ ] Pas de clés dans les URLs
- [ ] Isolation réseau Docker

---

Adaptez cette checklist à chaque release. Inspirez-vous du Top 10 OWASP et des outils recommandés pour chaque point.

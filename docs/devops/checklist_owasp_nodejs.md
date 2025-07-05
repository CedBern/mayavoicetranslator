# Checklist OWASP adaptée – Projet Node.js communautaire

Cette checklist synthétise les principaux points de contrôle OWASP pour sécuriser une application Node.js communautaire.

## 1. Authentification et gestion des accès
- [ ] Utilisation de mots de passe forts et stockage hashé (bcrypt, argon2)
- [ ] Authentification multi-facteurs (MFA) si possible
- [ ] Expiration et rotation des tokens JWT
- [ ] Limitation des tentatives de connexion (brute force)

## 2. Gestion des entrées utilisateur
- [ ] Validation et sanitation de toutes les entrées (express-validator, joi)
- [ ] Protection contre l’injection (SQL, NoSQL, Commande)
- [ ] Limitation de la taille des payloads (voir guide uploads)

## 3. Sécurité des API et des routes
- [ ] Utilisation de HTTPS partout (SSL/TLS)
- [ ] Contrôle d’accès par rôle (RBAC)
- [ ] Désactivation des routes non utilisées
- [ ] Limitation du CORS aux domaines de confiance

## 4. Sécurité des données
- [ ] Chiffrement des données sensibles en base (at rest)
- [ ] Chiffrement des secrets en transit (env, .env, vault)
- [ ] Sauvegardes chiffrées et testées

## 5. Sécurité des dépendances
- [ ] Utilisation de `npm audit` et `npm outdated`
- [ ] Vérification régulière des vulnérabilités (Snyk, GitHub Dependabot)
- [ ] Suppression des dépendances inutilisées

## 6. Sécurité du serveur et de l’infrastructure
- [ ] Pare-feu actif (UFW/iptables)
- [ ] Mises à jour automatiques de sécurité
- [ ] Accès SSH restreint (clé, fail2ban)
- [ ] Monitoring et alerting actifs

## 7. Journalisation et audit
- [ ] Logs d’accès et d’erreur centralisés
- [ ] Surveillance des actions sensibles (modification, suppression)
- [ ] Conservation des logs selon la politique RGPD/OCAP

## 8. Confidentialité et conformité
- [ ] Politique de confidentialité claire
- [ ] Consentement explicite pour la collecte de données
- [ ] Respect des principes FPIC, OCAP, CARE

---

**Ressources :**
- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

Adaptez cette checklist à chaque release et conservez-la versionnée dans le repo.

# Configuration de l’API Manager (APIM)

Ce fichier définit les politiques d’accès, de monétisation et de confidentialité appliquées par l’API Manager centralisé de MayaVoiceTranslator.

---

## 1. Accès et rôles

```json
{
  "roles": [
    { "name": "user", "description": "Utilisateur final", "quota": 1000, "access": ["API1", "API2"] },
    { "name": "dev", "description": "Développeur/Contributeur", "quota": 5000, "access": ["API1", "API2", "API3"] },
    { "name": "admin", "description": "Administrateur", "quota": "unlimited", "access": ["API1", "API2", "API3"] },
    { "name": "partner", "description": "Partenaire externe", "quota": 2000, "access": ["API1", "API2"] }
  ]
}
```

---

## 2. Monétisation

- **Freemium** : 1000 requêtes/mois gratuites, puis 0,01€/requête supplémentaire.
- **Premium** : 10 000 requêtes/mois incluses, support prioritaire, accès à toutes les APIs.
- **Institutionnel** : Sur devis, accès illimité, reporting dédié.
- **Partenaires** : Accès négocié, partage de revenus possible.

---

## 3. Confidentialité et conformité

- Toutes les requêtes sont journalisées (logs horodatés, pseudonymisés).
- Les données personnelles sont chiffrées au repos et en transit.
- Consentement utilisateur requis pour tout traitement sensible.
- Endpoints dédiés pour suppression/export des données (conformité RGPD).
- Auditabilité complète : chaque action est traçable et auditable.

---

## 4. Exemples de configuration technique

```json
{
  "api_keys": {
    "API1": "env:API1_KEY",
    "API2": "env:API2_KEY",
    "API3": "env:API3_KEY"
  },
  "rate_limiting": {
    "user": 1000,
    "dev": 5000,
    "admin": "unlimited",
    "partner": 2000
  },
  "logging": {
    "level": "info",
    "anonymize": true,
    "retention_days": 90
  },
  "security": {
    "encryption": "AES-256",
    "tls": true
  }
}
```

---

## 5. Documentation utilisateur/partenaire

- Chaque utilisateur reçoit une documentation personnalisée sur ses droits, quotas, et procédures de gestion des données.
- Les partenaires disposent d’un reporting d’usage et d’un support dédié.

---

*Pour toute question ou adaptation, contacter l’équipe gouvernance/technique.*

# Documentation développeur – MayaVoiceTranslator (API Manager)

Ce guide s’adresse aux développeurs et contributeurs souhaitant intégrer ou étendre les APIs de MayaVoiceTranslator via l’API Manager (APIM).

---

## 1. Accès développeur

- **Rôle** : Développeur/Contributeur
- **APIs accessibles** : API principale REST, API multimodale, API corpus/ressources
- **Quota mensuel** : 5000 requêtes gratuites
- **Clé API** : Gérée via l’espace développeur sécurisé

---

## 2. Bonnes pratiques d’intégration

- Utilisez toujours l’endpoint APIM pour vos appels (ne jamais accéder directement aux APIs internes).
- Respectez les quotas : une erreur 429 est renvoyée en cas de dépassement.
- Les logs d’usage sont accessibles dans votre dashboard développeur.
- Pour des besoins spécifiques (batch, accès corpus, tests), contactez l’équipe technique.

---

## 3. Sécurité et confidentialité

- Ne partagez jamais votre clé API.
- Les données sensibles doivent être anonymisées côté client si possible.
- Toute extraction massive de données doit être justifiée et auditée.

---

## 4. Support technique

- Documentation API OpenAPI/Swagger : [lien interne]
- FAQ développeur : [lien interne]
- Contact technique : dev-support@mayavoicetranslator.org

---

*Merci de contribuer à un écosystème ouvert, éthique et sécurisé.*

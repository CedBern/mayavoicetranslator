# Politique de sécurité PostgreSQL pour schémas sensibles

## 1. Révoquer les droits par défaut
```sql
REVOKE CONNECT ON DATABASE mydb FROM PUBLIC;
REVOKE TEMPORARY ON DATABASE mydb FROM PUBLIC;
REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC;
```

## 2. Accorder l’accès uniquement aux rôles autorisés
```sql
GRANT CONNECT ON DATABASE mydb TO role_app;
GRANT USAGE ON SCHEMA private_schema TO role_app;
GRANT CREATE ON SCHEMA private_schema TO role_app;
```

## 3. Restreindre les droits sur les tables
```sql
REVOKE ALL ON ALL TABLES IN SCHEMA private_schema FROM PUBLIC;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA private_schema TO role_app;
```

## 4. Privilèges par défaut pour les nouveaux objets
```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA private_schema 
    REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA private_schema 
    GRANT SELECT, INSERT ON TABLES TO role_app;
```

## 5. Sécuriser pg_hba.conf
- Utiliser `scram-sha-256` pour l’authentification.
- Restreindre les IP autorisées.

## 6. Bonnes pratiques
- Ne jamais utiliser la méthode `trust` en production.
- Utiliser des mots de passe forts et des rôles non superutilisateurs pour l’application.
- Activer la journalisation des connexions et échecs.
- Tester les droits avec un rôle non autorisé.

---

Adaptez ces commandes à votre base et schémas. Consultez la documentation officielle PostgreSQL pour plus de détails.

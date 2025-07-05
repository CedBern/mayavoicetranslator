# Exemple de politique PostgreSQL : protection des schémas sensibles

Pour empêcher tout accès non authentifié aux schémas sensibles, appliquez une politique restrictive par défaut et n’accordez l’accès qu’aux utilisateurs explicitement autorisés.

## 1. Révoquer les droits par défaut
```sql
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
```

## 2. Accorder l’accès uniquement à l’utilisateur applicatif
```sql
GRANT USAGE ON SCHEMA public TO mayauser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mayauser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mayauser;
```

## 3. Appliquer la même logique à d’autres schémas sensibles
```sql
REVOKE ALL ON SCHEMA schema_sensible FROM PUBLIC;
GRANT USAGE ON SCHEMA schema_sensible TO mayauser;
-- Adapter les droits selon le besoin
```

## 4. Désactiver l’accès aux utilisateurs anonymes
- Ne créez pas d’utilisateur sans mot de passe.
- Vérifiez le fichier `pg_hba.conf` : privilégiez `md5` ou `scram-sha-256` pour l’authentification.

Exemple :
```
host    all             all             0.0.0.0/0               scram-sha-256
```

---

**Bonnes pratiques :**
- Toujours révoquer les droits par défaut sur les schémas et tables sensibles.
- N’accorder que les droits strictement nécessaires à chaque utilisateur.
- Utiliser l’authentification forte (jamais trust ou ident en production).
- Documenter et versionner vos scripts de gestion des droits.

# Guide RBAC/Casbin - Gestion des droits d’accès

## Rôles proposés
- admin
- annotateur
- enseignant
- développeur
- utilisateur

## Exemples de règles (Casbin)
- admin : accès total
- annotateur : accès annotation, lecture corpus
- enseignant : lecture corpus, génération ressources
- développeur : accès technique, logs
- utilisateur : accès limité, consultation

## À faire
- Implémenter Casbin dans les microservices Node.js (voir https://casbin.org/)
- Documenter les règles dans ce fichier

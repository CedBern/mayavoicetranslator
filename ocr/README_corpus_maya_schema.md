# Gestion de corpus OCR et bilingues maya-espagnol

Ce schéma SQL (`corpus_maya_schema.sql`) permet d’organiser :
- Les corpus OCR (images + texte maya)
- Les corpus bilingues (maya-espagnol)
- Le suivi de validation, d’annotation et de gouvernance collaborative

## Tables principales
- **corpus** : métadonnées sur chaque corpus (nom, langues, type, statut, description)
- **line** : paires de phrases (ou lignes OCR), avec chemin image, annotateur, statut, validateur
- **user** : gestion des annotateurs/validateurs (optionnel)

## Utilisation recommandée
- Utilisez la table `corpus` pour référencer chaque dataset (OCR, bilingue, etc.)
- Stockez chaque ligne annotée (texte, image, traduction) dans `line`, en liant à un corpus
- Suivez le statut de validation pour chaque ligne et corpus
- Exportez facilement les données validées pour l’entraînement OCR ou la traduction

## Exemple d’intégration
- Peut être utilisé avec SQLite, MySQL ou PostgreSQL
- Compatible avec un workflow d’annotation collaborative (Label Studio, scripts Python, etc.)
- Permet de générer des exports filtrés (ex : toutes les lignes validées d’un corpus OCR)

N’hésitez pas à adapter ce schéma selon vos besoins spécifiques (ajout de champs, contraintes, etc.).

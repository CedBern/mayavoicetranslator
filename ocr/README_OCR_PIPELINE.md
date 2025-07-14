# OCR Pipeline & Gouvernance communautaire – MayaVoiceTranslator

Ce guide centralise les bonnes pratiques, scripts et processus pour un pipeline OCR performant, éthique et collaboratif pour le maya yucateco.

## 1. Génération et annotation des données
- Générer des images synthétiques : `generate_synthetic_data.py`
- Importer dans la base collaborative : `import_lines_from_csv.py`
- Annoter/valider en équipe : `validate_lines_cli.py`

## 2. Gouvernance et traçabilité
- Statut de chaque ligne : non_traite, valide, rejete
- Traçabilité des annotateurs et validateurs (champ `annotator`, `validated_by`)
- Possibilité d’exporter à tout moment les données validées

## 3. Export pour l’entraînement OCR
- Export CSV : `export_validated_lines.py`
- Export dataset images+labels.txt : `export_ocr_training_set.py`

## 4. Bonnes pratiques
- Documenter chaque étape (README, scripts)
- Impliquer la communauté pour annotation/validation
- Respecter les principes CARE (souveraineté, accès, responsabilité, éthique)
- Versionner les corpus et garder l’historique des validations

## 5. Extension possible
- Ajout d’une interface web légère (Flask, Streamlit) pour annotation collaborative
- Intégration avec Label Studio ou outils d’annotation open-source
- Automatisation du reporting (statistiques d’avancement, taux de validation, etc.)

---
Pour toute question, voir les scripts dans `ocr/` ou contacter l’équipe technique.

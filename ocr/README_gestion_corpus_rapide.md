# Guide rapide – Gestion collaborative de corpus OCR maya

## 1. Initialiser la base de données
```bash
python ocr/init_corpus_db.py
```

## 2. Importer des lignes OCR (ex : images synthétiques)
```bash
python ocr/import_lines_from_csv.py
# (adapter le chemin et le nom du corpus si besoin)
```

## 3. Valider/rejeter les lignes OCR (annotation communautaire)
```bash
python ocr/validate_lines_cli.py
```

## 4. Exporter les lignes validées pour l’entraînement
```bash
python ocr/export_validated_lines.py
```

## 5. Structure de la base
- **corpus** : chaque dataset (OCR, bilingue, etc.)
- **line** : chaque ligne annotée (texte, image, statut, annotateur, validateur)
- **user** : gestion des annotateurs/validateurs (optionnel)

## 6. Bonnes pratiques
- Documenter chaque étape (import, validation, export)
- Travailler en équipe sur la validation (traçabilité des validateurs)
- Exporter régulièrement les données validées pour l’entraînement OCR

---
Pour toute question, voir les scripts dans `ocr/` ou contacter l’équipe technique.

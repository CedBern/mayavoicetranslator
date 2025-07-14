# Intégration Label Studio – OCR MayaVoiceTranslator

## Objectif
Permettre l’annotation collaborative des images OCR via Label Studio, puis l’import automatique des résultats dans la base collaborative.

## 1. Installation rapide
```bash
pip install label-studio
```

## 2. Lancer Label Studio sur le dossier d’images OCR
```bash
label-studio start --init --input-path ocr/dataset/images_synthetiques/ --output-path ocr/labelstudio_export/
```

## 3. Exporter les annotations Label Studio
- Depuis l’interface web, exporter au format JSON (Label Studio JSON ou COCO).
- Placer le fichier exporté dans `ocr/labelstudio_export/`.

## 4. Conversion et import dans la base collaborative
- Utiliser le script existant : `convert_labelstudio_to_easyocr.py` pour convertir les annotations.
- Puis importer dans la base avec `import_lines_from_csv.py` (adapter le format si besoin).

## 5. Bonnes pratiques
- Utiliser des templates OCR dans Label Studio (texte sur image).
- Documenter les conventions d’annotation (ex : un seul champ texte par image).
- Garder la traçabilité des annotateurs (champ annotator).

---
Pour toute question, voir les scripts dans `ocr/` ou contacter l’équipe technique.

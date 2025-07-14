# Génération de données synthétiques pour l'OCR maya yucateco

Ce script permet de générer automatiquement des images de texte maya yucateco à partir d'un fichier de phrases et d'un dossier de polices, pour entraîner et augmenter les modèles OCR.

## Utilisation

1. Placez vos phrases en maya yucateco dans `dataset/texts_maya.txt` (une phrase par ligne).
2. Ajoutez des fichiers de polices `.ttf` compatibles dans le dossier `fonts/`.
3. Exécutez le script :

```bash
python generate_synthetic_data.py
```

Les images générées seront placées dans `dataset/images_synthetiques/` avec un fichier `metadata.json` listant les correspondances image/texte/police.

## Exemple de contenu pour `texts_maya.txt`

```
In k'áate', k'uchul u yóok'ot.
Ba'ax ka wa'alik?
U yáax k'iinil le nojoch k'áax.
Tuméen u yáax k'iin, u páajtal u k'uchul.
Kuxa'an u yóok'ot le máako'.
```

## Remarques
- Utilisez des polices prenant en charge les caractères spéciaux du maya yucateco.
- Vous pouvez ajuster le nombre de variantes, la taille d'image, etc. dans le script.

# Script d'entraînement automatique d'un modèle EasyOCR sur un dataset local
# Nécessite: easyocr, torch
import easyocr
import os

# Dossier contenant les images et les labels (format: image.png, image.txt)
DATASET_DIR = './dataset/images/'
LABELS_DIR = './dataset/annotations/'

# Liste des images et labels
images = [f for f in os.listdir(DATASET_DIR) if f.endswith('.png') or f.endswith('.jpg')]

# Préparation des données (format: [(image_path, [texte attendu])])
data = []
for img in images:
    label_file = os.path.join(LABELS_DIR, img.replace('.png', '.txt').replace('.jpg', '.txt'))
    if os.path.exists(label_file):
        with open(label_file, 'r', encoding='utf-8') as f:
            label = f.read().strip()
        data.append((os.path.join(DATASET_DIR, img), [label]))

# Entraînement (exemple simplifié, EasyOCR n'a pas d'API d'entraînement custom complet, mais on peut fine-tuner via PyTorch)
# Ici, on montre comment utiliser EasyOCR pour prédire sur le dataset (pour l'entraînement custom, voir PaddleOCR ou Tesseract)
reader = easyocr.Reader(['es', 'en'], gpu=False)

for img_path, expected in data:
    result = reader.readtext(img_path, detail=0)
    print(f"Image: {img_path}")
    print(f"Attendu: {expected}")
    print(f"Reconnu: {result}")
    print('---')

print("Traitement terminé. Pour un entraînement custom, voir PaddleOCR ou Tesseract avec tesstrain.")

# Script avancé d'entraînement PaddleOCR pour la langue maya yucateca
# Nécessite: paddlepaddle, paddleocr
# Voir la doc officielle pour la personnalisation: https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.7/doc/doc_en/recognition_en.md

import os
from paddleocr import PaddleOCR, draw_ocr

# Paramètres personnalisés pour la langue maya
data_dir = './dataset/images/'
label_dir = './dataset/annotations/'
output_dir = './output_paddleocr/'
os.makedirs(output_dir, exist_ok=True)

# Exemple de configuration (à adapter selon la structure de ton dataset)
ocr = PaddleOCR(
    use_angle_cls=True,
    lang='en',  # Utiliser 'en' comme base, mais tu peux entraîner un modèle custom
    rec_model_dir=None,  # Pour charger un modèle custom si disponible
    det_model_dir=None,
    use_gpu=False
)

# Traitement de toutes les images du dataset
images = [f for f in os.listdir(data_dir) if f.endswith('.png') or f.endswith('.jpg')]
for img in images:
    img_path = os.path.join(data_dir, img)
    result = ocr.ocr(img_path, cls=True)
    # Affichage des résultats (texte reconnu)
    print(f"Image: {img}")
    for line in result[0]:
        print(f"Texte: {line[1][0]}, Score: {line[1][1]}")
    # Optionnel: sauvegarder l'image annotée
    # from PIL import Image
    # image = Image.open(img_path).convert('RGB')
    # boxes = [line[0] for line in result[0]]
    # txts = [line[1][0] for line in result[0]]
    # scores = [line[1][1] for line in result[0]]
    # im_show = draw_ocr(image, boxes, txts, scores, font_path='path/to/font.ttf')
    # im_show.save(os.path.join(output_dir, f'annotated_{img}'))

print("Traitement terminé. Pour l'entraînement custom, voir la doc PaddleOCR pour créer un dataset spécifique à la langue maya.")

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
import json

# Configuración
TEXTS_PATH = "dataset/texts_maya.txt"  # Un fichier texte avec une phrase maya par ligne
FONTS_DIR = "fonts/"  # Dossier avec des polices .ttf adaptées au maya
OUTPUT_DIR = "dataset/images_synthetiques/"
IMG_SIZE = (320, 64)
N_VARIANTS = 5  # Nombre d'images par phrase

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Charger les phrases
with open(TEXTS_PATH, encoding="utf-8") as f:
    lines = [l.strip() for l in f if l.strip()]

# Charger les polices
fonts = [os.path.join(FONTS_DIR, f) for f in os.listdir(FONTS_DIR) if f.endswith(".ttf")]

meta = []
for idx, text in enumerate(lines):
    for v in range(N_VARIANTS):
        font_path = random.choice(fonts)
        font_size = random.randint(28, 40)
        font = ImageFont.truetype(font_path, font_size)
        img = Image.new("L", IMG_SIZE, color=255)
        draw = ImageDraw.Draw(img)
        w, h = draw.textsize(text, font=font)
        x = (IMG_SIZE[0] - w) // 2
        y = (IMG_SIZE[1] - h) // 2
        draw.text((x, y), text, font=font, fill=0)
        # Bruit et distorsion
        if random.random() < 0.5:
            img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))
        if random.random() < 0.3:
            angle = random.uniform(-8, 8)
            img = img.rotate(angle, expand=0, fillcolor=255)
        # Sauvegarde
        fname = f"maya_{idx}_{v}.png"
        img.save(os.path.join(OUTPUT_DIR, fname))
        meta.append({"file": fname, "text": text, "font": os.path.basename(font_path)})

# Sauvegarder les métadonnées
with open(os.path.join(OUTPUT_DIR, "metadata.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

print(f"Génération terminée. {len(meta)} images créées dans {OUTPUT_DIR}")

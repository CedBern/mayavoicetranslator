# Script para convertir anotaciones de Label Studio a formato EasyOCR
# Uso: python convert_labelstudio_to_easyocr.py <input.json> <output_dir>
import json
import sys
import os

if len(sys.argv) != 3:
    print("Uso: python convert_labelstudio_to_easyocr.py <input.json> <output_dir>")
    sys.exit(1)

input_file = sys.argv[1]
output_dir = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, item in enumerate(data):
    image_name = item.get('data', {}).get('image', f'image_{i}.png')
    annotations = item.get('annotations', [])
    for ann in annotations:
        for result in ann.get('result', []):
            if result['type'] == 'rectanglelabels':
                # Extraer bounding box y label
                bbox = result['value']
                label = result['value'].get('rectanglelabels', [''])[0]
                # Guardar en formato simple (puedes adaptar según EasyOCR)
                with open(os.path.join(output_dir, f'{image_name}.txt'), 'a', encoding='utf-8') as out:
                    out.write(f"{bbox} | {label}\n")
print("Conversión terminada.")

import os
import csv
import json

# Dossiers
AUDIO_DIR = "doreco_yuca1254_audiofiles_v2.0"
META_CSV = os.path.join(AUDIO_DIR, "doreco_yuca1254_metadata.csv")

# Indexation des fichiers audio
files = [f for f in os.listdir(AUDIO_DIR) if f.lower().endswith('.wav')]

# Extraction des métadonnées
metadata = {}
if os.path.exists(META_CSV):
    with open(META_CSV, encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            metadata[row.get('filename') or row.get('file_name') or row.get('FileName')] = row

# Construction de l’index
index = []
for f in files:
    entry = {"filename": f}
    if f in metadata:
        entry.update(metadata[f])
    index.append(entry)

# Sauvegarde de l’index
with open("doreco_yuca1254_audio_index.json", "w", encoding="utf-8") as out:
    json.dump(index, out, ensure_ascii=False, indent=2)

print(f"Index créé avec {len(index)} fichiers audio.")

"""
Script Python pour indexer automatiquement les corpus audio+texte (Common Voice, TEDx, etc.)
Génère un index JSON des paires audio/transcription pour exploitation ASR, recherche, supervision.
Usage :
    python scripts/index_audio_text_corpora.py
"""
import os
import csv
import json

CORPORA = [
    {
        'name': 'CommonVoice',
        'dir': 'data/CommonVoice/',
        'audio_col': 'path',
        'text_col': 'sentence',
        'tsv_pattern': '.tsv',
        'audio_base': 'clips/'
    },
    # Ajoutez ici d'autres corpus audio+texte (TEDx, MLS, VoxPopuli...)
]

index = []

for corpus in CORPORA:
    tsv_dir = corpus['dir']
    for file in os.listdir(tsv_dir):
        if file.endswith(corpus['tsv_pattern']):
            with open(os.path.join(tsv_dir, file), encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    audio_path = os.path.join(tsv_dir, corpus['audio_base'], row[corpus['audio_col']])
                    if os.path.exists(audio_path):
                        index.append({
                            'corpus': corpus['name'],
                            'lang': file.split('.')[0],
                            'audio': audio_path,
                            'text': row[corpus['text_col']],
                            'meta': {k: row[k] for k in row if k not in [corpus['audio_col'], corpus['text_col']]}
                        })

with open('data/audio_text_index.json', 'w', encoding='utf-8') as out:
    json.dump(index, out, ensure_ascii=False, indent=2)

print(f"Index audio+texte généré : {len(index)} paires dans data/audio_text_index.json")

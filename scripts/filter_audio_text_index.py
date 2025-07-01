"""
Script Python pour filtrer et lister les paires audio+texte intéressantes (langues indigènes, rares, régionales, anciennes)
Recherche dans l'index généré (data/audio_text_index.json) et produit un rapport filtré.
Usage :
    python scripts/filter_audio_text_index.py
"""
import json
import re

# Liste indicative de langues cibles (à compléter selon vos besoins)
TARGET_LANGS = [
    # Langues indigènes, régionales, rares, anciennes (codes ISO ou noms)
    'yua', 'quc', 'cak', 'nah', 'gn', 'qu', 'ay', 'tz', 'ota', 'fro', 'grc', 'cop', 'got', 'non', 'ang', 'egy', 'arc', 'sux', 'akk', 'hbo', 'peo', 'lat', 'grc', 'san', 'pi', 'pal', 'av', 'cu', 'sga', 'gle', 'cy', 'br', 'eu', 'oc', 'gsw', 'rm', 'lb', 'frp', 'lld', 'scn', 'co', 'vec', 'fur', 'sc', 'wa', 'bret', 'gaul', 'gaulois', 'gaulish', 'old', 'ancient', 'indigenous', 'native', 'minority', 'regional'
]

with open('data/audio_text_index.json', encoding='utf-8') as f:
    index = json.load(f)

results = []
for entry in index:
    lang = entry.get('lang', '').lower()
    # Recherche par code ou nom de langue, ou mots-clés dans meta
    if any(l in lang for l in TARGET_LANGS):
        results.append(entry)
    elif any(l in (entry.get('meta', {}).get('locale', '')).lower() for l in TARGET_LANGS):
        results.append(entry)
    elif any(re.search(l, entry.get('text', '').lower()) for l in TARGET_LANGS if len(l) > 2):
        results.append(entry)

with open('data/audio_text_index_filtered.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print(f"{len(results)} paires audio+texte filtrées (langues indigènes, rares, anciennes) dans data/audio_text_index_filtered.json")

"""
Script Python pour récupérer la liste des langues téléchargeables Common Voice via le fichier d'index officiel (releases)
Usage :
    python scripts/get_commonvoice_langs_from_index.py
"""
import requests
import csv
import io

# URL du fichier d'index des langues (exemple pour la v16)
INDEX_URL = 'https://commonvoice.mozilla.org/api/v1/metadata/cv-corpus-16.0-2023-12-06/metadata.csv'

resp = requests.get(INDEX_URL)
resp.raise_for_status()

langs = set()
reader = csv.DictReader(io.StringIO(resp.text))
for row in reader:
    if row.get('download') == 'true':
        langs.add(row['language'])

print('Langues Common Voice téléchargeables (codes ISO) :')
for l in sorted(langs):
    print(l)

with open('data/commonvoice_downloadable_langs_from_index.txt', 'w', encoding='utf-8') as f:
    for l in sorted(langs):
        f.write(f"{l}\n")

print(f"\nListe enregistrée dans data/commonvoice_downloadable_langs_from_index.txt ({len(langs)} langues)")

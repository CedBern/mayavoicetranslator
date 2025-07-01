"""
Script Python pour télécharger automatiquement les dumps Common Voice pour une liste de langues cibles (hors grandes langues)
Usage :
    python scripts/download_commonvoice_langs.py
"""
import os
import urllib.request

# Langues prioritaires (codes ISO) - Amériques, Europe régionales, Asie régionales, Afrique
LANGS = [
    # Amériques indigènes
    'yua', 'quc', 'nah', 'gn', 'qu', 'ay',
    # Europe régionales
    'br', 'eu', 'oc', 'cy', 'rm', 'sc', 'wa', 'lld', 'frp', 'co', 'vec', 'fur', 'scn', 'lb', 'gsw',
    # Asie régionales
    'hani', 'tib', 'uig', 'kaz', 'kir', 'mya', 'ne', 'lo', 'mn',
    # Afrique
    'sw', 'yo', 'ig', 'am', 'ha', 'wo', 'ff', 'ee', 'lg', 'nso', 'xh', 'zu', 'tn', 'so', 'ln', 'bm', 'ak', 'fon', 'sn', 'ny', 'rn', 'rw', 'lu', 'luo', 'dyo', 'swh', 'mos', 'ts', 'ss', 'st', 've', 'ts', 'tn', 'kg', 'tw', 'kr', 'sg', 'umb', 'yo', 'tiv', 'ibo', 'kam', 'kik', 'kin', 'lug', 'sna', 'nya', 'run', 'fon', 'bam', 'aka', 'ewe', 'wol', 'ful', 'hau', 'som', 'lin', 'bam', 'aka', 'ewe', 'fon', 'sna', 'nya', 'run', 'kin', 'lug', 'luo', 'dyo', 'swh'
]

BASE_URL = 'https://commonvoice.mozilla.org/api/v1/dataset/'
VERSION = 'latest'  # ou 'cv-corpus-16.0-2023-12-06' si version figée

def download_lang(lang):
    zip_url = f'https://commonvoice.mozilla.org/api/v1/dataset/{lang}/{VERSION}'
    out_dir = f'data/CommonVoice/{lang}/'
    os.makedirs(out_dir, exist_ok=True)
    out_zip = os.path.join(out_dir, f'{lang}.zip')
    print(f'Téléchargement {lang}...')
    try:
        urllib.request.urlretrieve(zip_url, out_zip)
        print(f'OK : {out_zip}')
    except Exception as e:
        print(f'Erreur {lang}: {e}')

for lang in sorted(set(LANGS)):
    download_lang(lang)

print('Téléchargements Common Voice terminés. Décompressez les fichiers pour indexation.')

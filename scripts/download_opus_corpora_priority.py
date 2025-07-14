"""
Script Python pour télécharger automatiquement JW300, Tatoeba, Bible-uedin (OPUS) pour les langues peu dotées
Utilise opustools-pkg pour chaque paire de langues pertinente.
Usage :
    pip install opustools-pkg
    python scripts/download_opus_corpora_priority.py
"""
import os
from opustools_pkg.opus_read import OpusRead

CORPORA = [
    'JW300',
    'Tatoeba',
    'Bible-uedin'
]
# Liste indicative de langues prioritaires (codes ISO)
LANGS = [
    'sw', 'yo', 'ig', 'am', 'ha', 'wo', 'ff', 'lg', 'xh', 'zu', 'tn', 'so', 'ln', 'bm', 'ak', 'fon', 'sn', 'ny', 'rn', 'rw', 'lu', 'dyo',
    'yua', 'quc', 'nah', 'gn', 'qu', 'ay', 'cak', 'tz',
    'br', 'eu', 'oc', 'cy', 'rm', 'sc', 'wa', 'lld', 'frp', 'co', 'vec', 'fur', 'scn', 'lb', 'gsw',
    'hani', 'tib', 'uig', 'kaz', 'kir', 'mya', 'ne', 'lo', 'mn'
]

os.makedirs('data/OPUS', exist_ok=True)

for corpus in CORPORA:
    for src in LANGS:
        for tgt in LANGS:
            if src != tgt:
                out_file = f'data/OPUS/{corpus}-{src}-{tgt}.txt'
                print(f'Téléchargement {corpus} {src}-{tgt}...')
                try:
                    OpusRead(
                        corpus,
                        src,
                        tgt,
                        write=out_file,
                        suppress_prompts=True,
                        download_dir='opus_downloads',
                    )
                    print(f'OK : {out_file}')
                except Exception as e:
                    print(f'Erreur {corpus} {src}-{tgt}: {e}')

print('Téléchargements OPUS prioritaires terminés.')

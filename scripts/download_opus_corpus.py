"""
Script Python pour télécharger automatiquement plusieurs paires de langues d'un corpus OPUS (ex: OpenSubtitles2016) avec OpusTools
Usage :
    pip install opustools-pkg
    python scripts/download_opus_corpus.py --corpus OpenSubtitles2016 --langs en,fr,es,de,it,pt --output_dir data/OpenSubtitles2016/

Ce script télécharge et extrait tous les corpus bilingues possibles entre les langues listées.
"""
import argparse
import os
from itertools import combinations
from opustools_pkg.opus_read import OpusRead

parser = argparse.ArgumentParser(description='Télécharge plusieurs corpus OPUS bilingues avec OpusTools')
parser.add_argument('--corpus', required=True, help='Nom du corpus OPUS (ex: OpenSubtitles2016)')
parser.add_argument('--langs', required=True, help='Liste de langues séparées par des virgules (ex: en,fr,es)')
parser.add_argument('--output_dir', required=True, help='Répertoire de sortie')
args = parser.parse_args()

langs = [l.strip() for l in args.langs.split(',') if l.strip()]
os.makedirs(args.output_dir, exist_ok=True)

for src, tgt in combinations(langs, 2):
    out_file = os.path.join(args.output_dir, f'{args.corpus}-{src}-{tgt}.txt')
    print(f'Téléchargement {src}-{tgt}...')
    try:
        OpusRead(
            args.corpus,
            src,
            tgt,
            write=out_file,
            suppress_prompts=True,
            download_dir='opus_downloads',
        )
        print(f'OK : {out_file}')
    except Exception as e:
        print(f'Erreur {src}-{tgt}: {e}')

print('Téléchargements terminés.')

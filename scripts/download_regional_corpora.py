import os
from opustools_pkg.opus_read import OpusRead

# Langues régionales à couvrir
REGIONAL_LANGS = ['br', 'ca', 'co', 'eu', 'pcd']
CORPORA = ['JW300', 'Tatoeba', 'OpenSubtitles2016']

# Utilisation d'un chemin absolu pour garantir l'écriture au bon endroit
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, '../data/OPUS/'))

print(f"[DEBUG] Chemin courant: {os.getcwd()}")
print(f"[DEBUG] OUTPUT_DIR absolu: {OUTPUT_DIR}")
os.makedirs(OUTPUT_DIR, exist_ok=True)

for corpus in CORPORA:
    for lang in REGIONAL_LANGS:
        for src, tgt in [('fr', lang), (lang, 'fr')]:
            out_file = os.path.join(OUTPUT_DIR, f'{corpus}-{src}-{tgt}.txt')
            print(f'Téléchargement {corpus} {src}-{tgt}...')
            try:
                OpusRead(
                    corpus,
                    src,
                    tgt,
                    write=out_file,
                    suppress_prompts=True,
                    download_dir=os.path.join(BASE_DIR, 'opus_downloads'),
                )
                print(f'OK : {out_file}')
                # Vérification immédiate de la présence du fichier
                if os.path.exists(out_file):
                    print(f'[DEBUG] Fichier écrit: {out_file} (taille: {os.path.getsize(out_file)} octets)')
                else:
                    print(f'[ERREUR] Fichier NON trouvé après écriture: {out_file}')
            except Exception as e:
                print(f'Erreur {corpus} {src}-{tgt}: {e}')

print('Téléchargements terminés. Relancez l’indexation pour prise en compte.')

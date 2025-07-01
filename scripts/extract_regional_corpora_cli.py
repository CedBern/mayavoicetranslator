import os
import subprocess
import sys

# Couples de langues régionales à couvrir
REGIONAL_LANGS = ['br', 'ca', 'co', 'eu', 'pcd']
CORPORA = ['JW300', 'Tatoeba', 'OpenSubtitles2016']
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, '../data/OPUS/'))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Chemin de l'exécutable opus_read (directement, sans python.exe)
if sys.platform.startswith('win'):
    OPUS_READ_EXEC = os.path.abspath(os.path.join(BASE_DIR, '../.venv/Scripts/opus_read'))
else:
    OPUS_READ_EXEC = 'opus_read'

for corpus in CORPORA:
    for lang in REGIONAL_LANGS:
        for src, tgt in [('fr', lang), (lang, 'fr')]:
            out_file = os.path.join(OUTPUT_DIR, f'{corpus}-{src}-{tgt}.txt')
            cmd = [
                OPUS_READ_EXEC,
                '-d', corpus,
                '-s', src,
                '-t', tgt,
                '-w', out_file,
                '--max', '1000000',  # Limite raisonnable
                '--suppress_prompts'
            ]
            print(f"[INFO] Extraction {corpus} {src}-{tgt}...")
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, check=True)
                print(f"[OK] {out_file}")
                if os.path.exists(out_file):
                    print(f"[DEBUG] Fichier généré: {out_file} (taille: {os.path.getsize(out_file)} octets)")
                else:
                    print(f"[ERREUR] Fichier NON trouvé après extraction: {out_file}")
            except subprocess.CalledProcessError as e:
                print(f"[ERREUR] Extraction échouée pour {corpus} {src}-{tgt}: {e.stderr}")
            except FileNotFoundError as e:
                print(f"[ERREUR] opus_read introuvable à {OPUS_READ_EXEC}: {e}")

print('Extraction terminée. Vérifiez les fichiers dans data/OPUS/.')

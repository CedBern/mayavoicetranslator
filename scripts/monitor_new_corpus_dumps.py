"""
Script Python pour veille automatique sur les nouveaux dumps OPUS (nouvelles URLs)
Vérifie régulièrement les pages/dépôts de corpus et alerte si un nouveau dump est disponible.
Usage :
    python scripts/monitor_new_corpus_dumps.py
"""
import requests
import re
import os
from datetime import datetime

# Nouvelles URLs à surveiller (pages corpus OPUS)
WATCH_URLS = [
    'https://opus.nlpl.eu/JW300/',
    'https://opus.nlpl.eu/Tatoeba/',
    'https://opus.nlpl.eu/Bible-uedin/',
    'https://opus.nlpl.eu/OpenSubtitles2016/',
    # Ajoutez d'autres pages corpus ici
]

LOG_FILE = 'data/corpus_dumps_watch.log'

os.makedirs('data', exist_ok=True)

for url in WATCH_URLS:
    print(f'Verification de {url}...')
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        # Cherche les liens vers des dumps .zip, .gz, .tar, etc.
        dumps = re.findall(r'href=["\'](.*?\.(zip|gz|tar|tgz|7z|txt|json))["\']', resp.text)
        found = set([d[0] for d in dumps])
        # Charge l'historique
        history = set()
        if os.path.exists(LOG_FILE):
            with open(LOG_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith(url):
                        history.add(line.strip().split(' ', 2)[-1])
        # Compare et alerte
        new_dumps = found - history
        for dump in new_dumps:
            print(f'🆕 Nouveau dump détecté sur {url}: {dump}')
        # Log l'état actuel
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            for dump in new_dumps:
                f.write(f"{url} {datetime.now().isoformat()} {dump}\n")
    except Exception as e:
        print(f'Erreur sur {url}: {e}')

print('Veille terminée. Consultez data/corpus_dumps_watch.log pour l’historique.')

"""
Script Python pour veille automatique sur la page d'accueil OPUS (https://opus.nlpl.eu/)
Détecte les nouveaux liens de corpus (zip, gz, tar, etc.) et alerte si nouveauté.
Usage :
    python scripts/monitor_opus_homepage.py
"""
import requests
import re
import os
from datetime import datetime

URL = 'https://opus.nlpl.eu/'
LOG_FILE = 'data/opus_homepage_watch.log'

os.makedirs('data', exist_ok=True)

print(f'Verification de {URL}...')
try:
    resp = requests.get(URL, timeout=15)
    resp.raise_for_status()
    # Cherche tous les liens vers des dumps .zip, .gz, .tar, etc.
    dumps = re.findall(r'href=["\'](.*?\.(zip|gz|tar|tgz|7z|txt|json))["\']', resp.text)
    found = set([d[0] for d in dumps])
    # Charge l'historique
    history = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                history.add(line.strip().split(' ', 2)[-1])
    # Compare et alerte
    new_dumps = found - history
    for dump in new_dumps:
        print(f'🆕 Nouveau dump détecté sur OPUS: {dump}')
    # Log l'état actuel
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        for dump in new_dumps:
            f.write(f"{URL} {datetime.now().isoformat()} {dump}\n")
except Exception as e:
    print(f'Erreur sur {URL}: {e}')

print('Veille OPUS terminée. Consultez data/opus_homepage_watch.log pour l’historique.')

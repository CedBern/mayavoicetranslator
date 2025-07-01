"""
Script Python pour extraire automatiquement la liste des langues téléchargeables sur Common Voice
Usage :
    python scripts/get_commonvoice_downloadable_langs.py
"""
import requests
import re
from bs4 import BeautifulSoup

URL = 'https://commonvoice.mozilla.org/en/languages'

resp = requests.get(URL)
soup = BeautifulSoup(resp.text, 'html.parser')

langs = []
for row in soup.find_all('tr'):
    cells = row.find_all('td')
    if len(cells) >= 3:
        code = cells[0].get_text(strip=True)
        name = cells[1].get_text(strip=True)
        status = cells[2].get_text(strip=True).lower()
        if 'download' in status:
            langs.append({'code': code, 'name': name, 'status': status})

print('Langues Common Voice téléchargeables :')
for l in langs:
    print(f"{l['code']} - {l['name']} ({l['status']})")

with open('data/commonvoice_downloadable_langs.txt', 'w', encoding='utf-8') as f:
    for l in langs:
        f.write(f"{l['code']}\t{l['name']}\t{l['status']}\n")

print(f"\nListe enregistrée dans data/commonvoice_downloadable_langs.txt ({len(langs)} langues)")

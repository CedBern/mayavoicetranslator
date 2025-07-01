"""
Script Python pour veille OPUS avec alerte email en cas de nouveau dump détecté
Nécessite la configuration d'un SMTP (voir variables en haut du script)
Usage :
    python scripts/monitor_opus_homepage_alert.py
"""
import requests
import re
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

URL = 'https://opus.nlpl.eu/'
LOG_FILE = 'data/opus_homepage_watch.log'

# Configuration email (à adapter)
SMTP_SERVER = 'smtp.example.com'
SMTP_PORT = 587
SMTP_USER = 'alert@example.com'
SMTP_PASS = 'password'
EMAIL_FROM = 'alert@example.com'
EMAIL_TO = 'votre.email@exemple.com'

os.makedirs('data', exist_ok=True)

print(f'Verification de {URL}...')
try:
    resp = requests.get(URL, timeout=15)
    resp.raise_for_status()
    dumps = re.findall(r'href=["\'](.*?\.(zip|gz|tar|tgz|7z|txt|json))["\']', resp.text)
    found = set([d[0] for d in dumps])
    history = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                history.add(line.strip().split(' ', 2)[-1])
    new_dumps = found - history
    for dump in new_dumps:
        print(f'🆕 Nouveau dump détecté sur OPUS: {dump}')
        # Envoi d'une alerte email
        msg = MIMEText(f'Nouveau dump détecté sur OPUS : {dump}\nURL : {URL}{dump}')
        msg['Subject'] = f'[OPUS] Nouveau dump détecté : {dump}'
        msg['From'] = EMAIL_FROM
        msg['To'] = EMAIL_TO
        try:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(EMAIL_FROM, [EMAIL_TO], msg.as_string())
            print('Alerte email envoyée.')
        except Exception as e:
            print(f'Erreur envoi email : {e}')
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        for dump in new_dumps:
            f.write(f"{URL} {datetime.now().isoformat()} {dump}\n")
except Exception as e:
    print(f'Erreur sur {URL}: {e}')

print('Veille OPUS terminée. Consultez data/opus_homepage_watch.log pour l’historique.')

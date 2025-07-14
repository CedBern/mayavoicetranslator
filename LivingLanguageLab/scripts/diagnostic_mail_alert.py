import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
import json

# Config (à adapter)
SMTP_SERVER = 'smtp.example.com'
SMTP_PORT = 587
SMTP_USER = 'alert@example.com'
SMTP_PASS = 'password'
MAIL_TO = ['admin@example.com', 'team@example.com', 'contrib@example.com']  # Multi-destinataires
ALERT_LOG = 'diagnostic_mail_alert.log'

# Templates de mail
TEMPLATES = {
    'critique': {
        'subject': 'ALERTE : Diagnostic Maya Voice Translator - ÉCHEC CRITIQUE',
        'body': lambda results: '<h2>Diagnostic : ÉCHEC CRITIQUE</h2><ul>' + ''.join(
            f'<li><b>{k}</b> : <span style="color:red;">{v}</span></li>' for k, v in results.items() if v == 'ERREUR') + '</ul>'
    },
    'succes': {
        'subject': 'Diagnostic Maya Voice Translator - Succès',
        'body': lambda results: '<h2>Diagnostic : Succès</h2><p>Tous les tests sont passés avec succès.</p>'
    },
    'rapport': {
        'subject': 'Rapport quotidien - Diagnostic Maya Voice Translator',
        'body': lambda results: '<h2>Rapport quotidien</h2><ul>' + ''.join(
            f'<li><b>{k}</b> : {v}</li>' for k, v in results.items()) + '</ul>'
    }
}

# Recherche du dernier rapport JSON
files = sorted(Path('.').glob('diagnostic_results_*.json'), reverse=True)
if not files:
    print('Aucun rapport JSON trouvé.')
    exit(1)

with open(files[0], encoding='utf-8') as f:
    results = json.load(f)

# Détection d'échec critique
critical_failed = any(v == 'ERREUR' for v in results.values())

# Choix du template
if critical_failed:
    template = TEMPLATES['critique']
elif all(v == 'OK' for v in results.values()):
    template = TEMPLATES['succes']
else:
    template = TEMPLATES['rapport']

# Préparation du mail
msg = MIMEMultipart()
msg['From'] = SMTP_USER
msg['To'] = ', '.join(MAIL_TO)
msg['Subject'] = template['subject']
body = template['body'](results)
msg.attach(MIMEText(body, 'html'))

# Journalisation
from datetime import datetime

def log_alert(subject, recipients, status):
    with open(ALERT_LOG, 'a', encoding='utf-8') as logf:
        logf.write(f"[{datetime.now().isoformat()}] {subject} -> {recipients} : {status}\n")

try:
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
    print('Alerte mail envoyée.')
    log_alert(msg['Subject'], MAIL_TO, 'envoyée')
except Exception as e:
    print(f'Erreur envoi mail : {e}')
    log_alert(msg['Subject'], MAIL_TO, f'erreur: {e}')

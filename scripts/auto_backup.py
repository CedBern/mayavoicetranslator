# Script de backup automatique (exemple, à planifier via cron ou tâche planifiée)
import os
import shutil
from datetime import datetime

def backup():
    now = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = f'backups/backup_{now}'
    os.makedirs(backup_dir, exist_ok=True)
    # Backup corpus
    if os.path.exists('corpus'):
        shutil.copytree('corpus', f'{backup_dir}/corpus')
    # Backup base de données (exemple MongoDB dump)
    os.system(f"mongodump --uri $MONGO_URI --out {backup_dir}/mongo_dump")
    # Backup logs
    if os.path.exists('logs'):
        shutil.copytree('logs', f'{backup_dir}/logs')
    print(f"Backup terminé dans {backup_dir}")

if __name__ == '__main__':
    backup()

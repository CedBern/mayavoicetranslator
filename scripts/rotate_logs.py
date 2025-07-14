# Script de rotation des logs (exemple, à planifier)
import os
from datetime import datetime

def rotate_logs():
    now = datetime.now().strftime('%Y%m%d_%H%M%S')
    if os.path.exists('logs'):
        os.rename('logs', f'logs_{now}')
        os.makedirs('logs')
        print(f"Logs archivés dans logs_{now}")

if __name__ == '__main__':
    rotate_logs()

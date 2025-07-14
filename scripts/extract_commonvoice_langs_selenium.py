"""
Script Python Selenium pour extraire dynamiquement la liste des langues téléchargeables Common Voice (compatible Selenium 4)
Usage :
    pip install selenium webdriver-manager
    python scripts/extract_commonvoice_langs_selenium.py
"""
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import os

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
driver.get('https://commonvoice.mozilla.org/en/languages')

time.sleep(5)  # Laisse le temps au JS de charger la page

langs = set()
rows = driver.find_elements('css selector', 'tr')
for row in rows:
    cells = row.find_elements('tag name', 'td')
    if len(cells) >= 3:
        code = cells[0].text.strip()
        status = cells[2].text.lower()
        if 'download' in status:
            langs.add(code)

driver.quit()

os.makedirs('data', exist_ok=True)
with open('data/commonvoice_downloadable_langs_selenium.txt', 'w', encoding='utf-8') as f:
    for l in sorted(langs):
        f.write(f"{l}\n")

print(f"Langues téléchargeables extraites : {len(langs)} (voir data/commonvoice_downloadable_langs_selenium.txt)")

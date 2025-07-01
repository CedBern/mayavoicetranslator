# Script de veille automatisée – Financements & Bourses Cortex

"""
Ce script (exemple Python) automatise la veille sur les bourses, financements et appels à projets pertinents pour un projet de thèse interdisciplinaire (France, Europe, Amérique latine, international).

Fonctionnalités :
- Recherche sur des portails (Campus France, EURAXESS, CONACYT, DAAD, Marie Curie, etc.)
- Extraction des critères, montants, échéances
- Génération d’un rapport synthétique (Markdown/CSV)
- Notification par email ou log

À personnaliser selon les besoins et les accès API.
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Exemples de portails à surveiller
PORTALS = [
    'https://www.campusfrance.org/fr/bourses-doctorat',
    'https://euraxess.ec.europa.eu/jobs/search',
    'https://www.conacyt.mx/becas-y-posgrados/',
    'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    'https://marie-sklodowska-curie-actions.ec.europa.eu/calls',
]

def fetch_opportunities():
    results = []
    for url in PORTALS:
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                # Extraction simple (à adapter selon le portail)
                title = soup.title.string if soup.title else url
                results.append({'url': url, 'title': title, 'date': datetime.now().isoformat()})
        except Exception as e:
            results.append({'url': url, 'title': f'Erreur: {e}', 'date': datetime.now().isoformat()})
    return results

def save_report(results, filename='rapport_veille_financements.md'):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('# Rapport de veille – Financements & Bourses\n\n')
        for res in results:
            f.write(f"- [{res['title']}]({res['url']}) – {res['date']}\n")

if __name__ == '__main__':
    data = fetch_opportunities()
    save_report(data)
    print('✅ Rapport de veille généré.')

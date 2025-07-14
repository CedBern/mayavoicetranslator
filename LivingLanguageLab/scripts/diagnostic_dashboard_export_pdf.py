import pdfkit
from pathlib import Path

# Génère un PDF à partir du dashboard HTML
html_file = Path('diagnostic_dashboard.html')
pdf_file = Path('diagnostic_dashboard.pdf')

if not html_file.exists():
    print('Dashboard HTML non trouvé.')
    exit(1)

try:
    pdfkit.from_file(str(html_file), str(pdf_file))
    print(f'PDF généré : {pdf_file}')
except Exception as e:
    print(f'Erreur génération PDF : {e}')

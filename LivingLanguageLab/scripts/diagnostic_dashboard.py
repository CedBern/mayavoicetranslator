import json
from pathlib import Path
from datetime import datetime

# Recherche automatique des 20 derniers rapports JSON
files = sorted(Path('.').glob('diagnostic_results_*.json'), reverse=True)[:20]
if not files:
    print('Aucun rapport JSON trouvé.')
    exit(1)

history = []
for fpath in files:
    with open(fpath, encoding='utf-8') as f:
        results = json.load(f)
    date = fpath.stem.replace('diagnostic_results_', '')
    history.append((date, results))

def color(status):
    if status == 'OK': return '🟢'
    if status == 'ERREUR': return '🔴'
    return '🟡'

# Détection d'échec critique
last_results = history[0][1]
critical_failed = any(v == 'ERREUR' for v in last_results.values())

# Calcul du taux de succès global
total = sum(len(r) for _, r in history)
success = sum(1 for _, r in history for v in r.values() if v == 'OK')
success_rate = round(100 * success / total, 1) if total else 0

# Génération du tableau historique
html = "<html><head><title>Diagnostic Dashboard - Maya Voice Translator</title>"
html += '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
html += '</head><body>'

# Badge dernière exécution et taux de succès
last_date = history[0][0]
html += f'<div style="float:right;padding:8px 16px;background:#222;color:#fff;border-radius:8px;">Dernier diagnostic : {last_date}<br>Taux de succès global : <b>{success_rate}%</b></div>'

# Alerte si échec critique
if critical_failed:
    html += '<div style="background:#c00;color:#fff;padding:10px 20px;border-radius:6px;margin-bottom:16px;font-weight:bold;">⚠️ Un ou plusieurs tests critiques ont échoué. Vérifiez les logs et corrigez avant déploiement.</div>'

html += f"<h1>Diagnostic Dashboard - {datetime.now().strftime('%Y-%m-%d %H:%M')}</h1>"

# Table des statuts pour chaque rapport
html += '<table border="1" style="border-collapse:collapse;text-align:center;"><tr><th>Date</th>'
all_keys = set()
for _, res in history:
    all_keys.update(res.keys())
all_keys = sorted(all_keys)
for k in all_keys:
    html += f'<th>{k}</th>'
html += '</tr>'
for date, res in history:
    html += f'<tr><td>{date}</td>'
    for k in all_keys:
        v = res.get(k, '-')
        html += f'<td>{color(v)} {v}</td>'
    html += '</tr>'
html += '</table>'

# Graphique d'évolution (succès/échecs)
labels = [d for d, _ in reversed(history)]
data_ok = [sum(1 for v in r.values() if v == 'OK') for _, r in reversed(history)]
data_err = [sum(1 for v in r.values() if v == 'ERREUR') for _, r in reversed(history)]
html += '''
<canvas id="diagChart" width="700" height="240"></canvas>
<script>
const ctx = document.getElementById('diagChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: %s,
    datasets: [
      { label: 'Succès', data: %s, backgroundColor: 'rgba(40,180,99,0.7)' },
      { label: 'Échecs', data: %s, backgroundColor: 'rgba(231,76,60,0.7)' }
    ]
  },
  options: { scales: { y: { beginAtZero: true } } }
});
</script>
''' % (labels, data_ok, data_err)

# Liens vers artefacts
html += '''<p>Artefacts :
<a href="diagnostic_results_%s.json">JSON</a> |
<a href="diagnostic_results_%s.csv">CSV</a> |
<a href="diagnostic_results_%s.md">Markdown</a>
</p>''' % (last_date, last_date, last_date)

html += '<p>Rapports générés automatiquement. Voir aussi les fichiers CSV/Markdown pour d\'autres formats.</p>'
html += '</body></html>'

with open('diagnostic_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Dashboard HTML historique généré : diagnostic_dashboard.html')

"""
Script Python pour générer un rapport de couverture linguistique et de diversité des corpus écrits intégrés
Analyse les fichiers dans data/OPUS/, data/OpenSubtitles2016/, data/AutresCorpus/ et produit un rapport global.
Usage :
    python scripts/report_corpus_coverage.py
"""
import os
import re
from collections import defaultdict

folders = [
    ('OPUS', 'data/OPUS/'),
    ('OpenSubtitles2016', 'data/OpenSubtitles2016/'),
    ('AutresCorpus', 'data/AutresCorpus/')
]

coverage = defaultdict(lambda: defaultdict(int))

for label, folder in folders:
    if not os.path.exists(folder):
        continue
    for file in os.listdir(folder):
        if file.endswith('.txt') or file.endswith('.json') or file.endswith('.gz') or file.endswith('.zip'):
            # Extraction des langues depuis le nom du fichier (ex: JW300-sw-yo.txt)
            m = re.findall(r'-([a-z]{2,4})-([a-z]{2,4})', file)
            if m:
                src, tgt = m[0]
                coverage[label][(src, tgt)] += 1
            else:
                # Pour les corpus mono-langue ou non structurés
                coverage[label][('unknown', 'unknown')] += 1

# Génération du rapport
with open('data/corpus_coverage_report.txt', 'w', encoding='utf-8') as f:
    for label in coverage:
        f.write(f"=== {label} ===\n")
        for (src, tgt), count in sorted(coverage[label].items()):
            f.write(f"{src}-{tgt}: {count} fichier(s)\n")
        f.write("\n")

print("Rapport de couverture généré : data/corpus_coverage_report.txt")

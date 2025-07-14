#!/bin/bash
# Orchestrateur de diagnostics Maya Voice Translator (Linux/macOS)

set -e

echo "==> Vérification santé API locale..."
if curl -sf http://localhost:3000/health > /dev/null; then
  echo "[OK] API santé : accessible"
else
  echo "[ERREUR] API locale injoignable sur /health"
fi

echo "==> Diagnostic corpus (console)"
python3 scripts/diagnostic_corpus_vs_tests.py

echo "==> Diagnostic corpus (HTML)"
python3 scripts/diagnostic_corpus_vs_tests_html.py
if [ -f diagnostic_corpus_report.html ]; then
  echo "[OK] Rapport HTML généré : diagnostic_corpus_report.html"
fi

echo "==> Tests end-to-end multi-langues"
npm run test:multilang

echo "==> Tous les diagnostics sont terminés. Vérifiez les rapports générés."

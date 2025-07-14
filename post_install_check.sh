#!/bin/bash
# Script de post-installation pour vérifier le stack MayaVoiceTranslator
# Usage : ./post_install_check.sh

set -e

echo "--- Vérification des ports ouverts ---"
for port in 22 80 443 3000 3001; do
  if ss -tuln | grep -q ":$port "; then
    echo "[OK] Port $port ouvert"
  else
    echo "[ERREUR] Port $port fermé ou service non démarré"; fi
done

echo "--- Vérification des services Docker ---"
docker compose -f .devcontainer/docker-compose.yml ps

echo "--- Vérification des logs récents ---"
docker compose -f .devcontainer/docker-compose.yml logs --tail=20

echo "--- Vérification terminée ---"

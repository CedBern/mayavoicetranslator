#!/bin/bash
# Script multiplateforme de validation "go/no-go" pour MayaVoiceTranslator
# Usage : ./go_nogo_check.sh

set -e

function check_port() {
  local port=$1
  if nc -z localhost $port; then
    echo "[OK] Port $port ouvert (service accessible)"
  else
    echo "[ERREUR] Port $port fermé ou service injoignable"; exit 1
  fi
}

function check_env() {
  local var=$1
  if [ -z "${!var}" ]; then
    echo "[ERREUR] Variable $var absente"; exit 1
  else
    echo "[OK] $var=${!var}"
  fi
}

check_port 3000
check_port 3001
check_env NODE_ENV

if [ -d "node_modules" ]; then
  echo "[OK] Backend node_modules présent"
else
  echo "[ERREUR] Backend node_modules absent"; exit 1
fi
if [ -d "web/node_modules" ]; then
  echo "[OK] Web node_modules présent"
else
  echo "[ERREUR] Web node_modules absent"; exit 1
fi

echo "--- Vérification terminée : GO ---"

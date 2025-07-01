#!/bin/bash
# Script pour cloner ou mettre à jour UltraSuite dans le dossier approprié
set -e
TARGET_DIR="$(dirname "$0")/../bases_de_donnees/ultrasuite"
REPO_URL="https://github.com/ultrasuite/ultrasuite.git"
if [ -d "$TARGET_DIR/.git" ]; then
  echo "Mise à jour d'UltraSuite..."
  git -C "$TARGET_DIR" pull
else
  echo "Clonage d'UltraSuite..."
  git clone "$REPO_URL" "$TARGET_DIR"
fi

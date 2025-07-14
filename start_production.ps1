# Lancement production MayaVoiceTranslator
# Ce script lance les services Docker en mode détaché (production)

Write-Host "--- Lancement des services en mode production (détaché) ---"
docker-compose -f .devcontainer/docker-compose.yml up --build -d
Write-Host "--- Services lancés. Vérifiez les logs avec : docker-compose -f .devcontainer/docker-compose.yml logs -f ---"

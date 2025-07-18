# Script PowerShell pour corriger les problèmes de PyJWT et relancer le serveur Flask
# À exécuter dans PowerShell à la racine du projet

Write-Host "--- Désinstallation de toutes les versions de PyJWT ---"
pip uninstall PyJWT -y
python -m pip uninstall PyJWT -y

Write-Host "--- Réinstallation de PyJWT 2.10.1 pour l'utilisateur courant ---"
pip install --user "PyJWT==2.10.1"

Write-Host "--- Vérification de la version et du chemin PyJWT ---"
python -c "import jwt; print('PyJWT version:', jwt.__version__, 'Path:', jwt.__file__)"

Write-Host "--- Arrêt des processus Flask existants (si possible) ---"
Get-Process python | Where-Object { $_.Path -like '*python*' } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "--- Démarrage du serveur Flask (app.py) ---"
Start-Process -NoNewWindow -FilePath python -ArgumentList 'app.py'

Write-Host "--- Script terminé ---"

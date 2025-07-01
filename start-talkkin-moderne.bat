@echo off
title TalkKin - Serveur de Développement
color 0A

echo.
echo  ====================================
echo  🚀 TalkKin - Interface Moderne
echo  ====================================
echo.
echo  Démarrage du serveur...
echo.

cd /d "%~dp0"

if not exist "server-moderne.js" (
    echo ❌ Fichier server-moderne.js non trouvé!
    pause
    exit /b 1
)

echo ✅ Lancement du serveur moderne...
echo.
echo 🌐 L'interface sera disponible sur:
echo    http://localhost:3000
echo.
echo 📱 Interface optimisée avec:
echo    • WebSocket temps réel
echo    • Theme sombre/clair
echo    • API REST complète
echo    • Monitoring intégré
echo.
echo ⚠️  Appuyez sur Ctrl+C pour arrêter
echo.

node server-moderne.js

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du démarrage du serveur
    echo.
    pause
)

echo.
echo ✅ Serveur arrêté proprement
pause

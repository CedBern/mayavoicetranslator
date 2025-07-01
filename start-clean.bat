@echo off
echo 🚀 Démarrage de TalkKin Global avec les nouvelles fonctionnalités
echo.
echo 📋 Vérification des dépendances...
npm list i18n-js > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Dépendance i18n-js manquante, installation...
    npm install i18n-js
)

echo.
echo 🔧 Nettoyage du cache...
npx expo start --clear
pause

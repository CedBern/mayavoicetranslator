@echo off
chcp 65001 >nul
title TalkKin Global - Gestionnaire Rapide

:MENU
cls
echo.
echo 🚀 TalkKin Global - Démarrage Rapide
echo ══════════════════════════════════════════════════
echo.
echo 📱 DÉVELOPPEMENT
echo   1. Démarrer App (Expo)
echo   2. Démarrer API
echo   3. Test Traductions
echo   4. Diagnostic Complet
echo.
echo 🛠️ OUTILS AVANCÉS  
echo   5. Gestionnaire Complet
echo   6. Tests Intégration
echo   7. Documentation
echo.
echo 🐳 DÉPLOIEMENT
echo   8. Build Docker
echo   9. Monitoring
echo.
echo   0. Quitter
echo.
echo ══════════════════════════════════════════════════
set /p choice="Votre choix: "

if "%choice%"=="1" goto START_EXPO
if "%choice%"=="2" goto START_API
if "%choice%"=="3" goto TEST_TRANSLATIONS
if "%choice%"=="4" goto DIAGNOSTIC
if "%choice%"=="5" goto FULL_MANAGER
if "%choice%"=="6" goto TEST_INTEGRATION
if "%choice%"=="7" goto DOCS
if "%choice%"=="8" goto DOCKER_BUILD
if "%choice%"=="9" goto MONITORING
if "%choice%"=="0" goto EXIT

echo Choix invalide!
pause
goto MENU

:START_EXPO
echo.
echo 🚀 Démarrage de l'application Expo...
npx expo start --clear
pause
goto MENU

:START_API
echo.
echo 🔧 Démarrage du serveur API...
npm run start:api
pause
goto MENU

:TEST_TRANSLATIONS
echo.
echo 🔄 Test des traductions bidirectionnelles...
node test-bidirectional-translation.js
pause
goto MENU

:DIAGNOSTIC
echo.
echo 🔍 Diagnostic système complet...
node diagnostic.js
pause
goto MENU

:FULL_MANAGER
echo.
echo 📋 Lancement du gestionnaire complet...
node talkkin-manager.js
pause
goto MENU

:TEST_INTEGRATION
echo.
echo 🧪 Tests d'intégration...
npm run test:integration
pause
goto MENU

:DOCS
echo.
echo 📚 Génération documentation...
npm run docs
echo.
echo 📖 Ouverture des guides...
if exist "ANALYSE_COMPLETE_PROJET.md" start notepad "ANALYSE_COMPLETE_PROJET.md"
if exist "GUIDE-TEST-V2.md" start notepad "GUIDE-TEST-V2.md"
pause
goto MENU

:DOCKER_BUILD
echo.
echo 🐳 Build Docker...
npm run docker:build
pause
goto MENU

:MONITORING
echo.
echo 📊 Monitoring système...
npm run monitor
pause
goto MENU

:EXIT
echo.
echo 👋 Au revoir ! Merci d'utiliser TalkKin Global
pause
exit

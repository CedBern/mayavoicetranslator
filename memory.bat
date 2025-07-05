@echo off
echo Configuration de la m?moire Node.js...
set NODE_OPTIONS=--max-old-space-size=6144
echo M?moire ?tendue ? 6GB
echo Lancement du traitement de donn?es...
npm run process-data
pause

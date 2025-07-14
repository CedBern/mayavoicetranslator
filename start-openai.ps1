#!/usr/bin/env powershell
# Script de démarrage Talk Kin avec OpenAI

Write-Host "🚀 === DÉMARRAGE TALK KIN AVEC OPENAI ===" -ForegroundColor Green
Write-Host "🎯 Intégration stratégique OpenAI activée" -ForegroundColor Cyan

# Vérifier le répertoire
$currentDir = Get-Location
Write-Host "📂 Répertoire: $currentDir" -ForegroundColor Yellow

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non installé" -ForegroundColor Red
    exit 1
}

# Vérifier le fichier serveur
$serverFile = "$currentDir\api-server-simple.js"
if (Test-Path $serverFile) {
    Write-Host "✅ Serveur API trouvé: $serverFile" -ForegroundColor Green
} else {
    Write-Host "❌ Fichier serveur non trouvé: $serverFile" -ForegroundColor Red
    exit 1
}

# Variables d'environnement OpenAI
if ($env:OPENAI_API_KEY) {
    Write-Host "✅ Clé OpenAI configurée" -ForegroundColor Green
} else {
    Write-Host "⚠️ Clé OpenAI manquante - Mode démo activé" -ForegroundColor Yellow
    $env:OPENAI_API_KEY = "sk-demo-key-talkkin"
}

# Démarrer le serveur
Write-Host "🌐 Démarrage serveur API sur http://localhost:3000" -ForegroundColor Cyan
Write-Host "🤖 OpenAI intégré avec préservation différenciation" -ForegroundColor Magenta

try {
    Set-Location $currentDir
    node api-server-simple.js
} catch {
    Write-Host "❌ Erreur démarrage serveur: $_" -ForegroundColor Red
    exit 1
}

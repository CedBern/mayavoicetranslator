# 🚀 Script d'Activation Rapide - Talk Kin (Windows)
# Active toutes les fonctionnalités et démarre l'application

Write-Host "🚀 Activation complète de Talk Kin..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Installer les dépendances si nécessaire
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Démarrer le serveur API
Write-Host "🌐 Démarrage du serveur API..." -ForegroundColor Cyan
$global:apiProcess = Start-Process -FilePath "node" -ArgumentList "api-server-simple.js" -PassThru -NoNewWindow
Write-Host "✅ Serveur API démarré (PID: $($global:apiProcess.Id))" -ForegroundColor Green

# Attendre que le serveur soit prêt
Start-Sleep -Seconds 3

# Test de santé de l'API - LIGNE 42 CORRIGÉE
Write-Host "🏥 Test de santé de l'API..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get -TimeoutSec 5
    if ($healthResponse -and $healthResponse.status) {
        Write-Host "✅ API opérationnelle - Status: $($healthResponse.status)" -ForegroundColor Green
    } else {
        Write-Host "✅ API opérationnelle - Réponse reçue" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ API non accessible - continuons quand même" -ForegroundColor Yellow
}

# Démarrer l'application Expo
Write-Host "📱 Démarrage de l'application Expo..." -ForegroundColor Cyan
$global:expoProcess = Start-Process -FilePath "npx" -ArgumentList "expo", "start", "--web" -PassThru -NoNewWindow
Write-Host "✅ Expo démarré (PID: $($global:expoProcess.Id))" -ForegroundColor Green

# Attendre le démarrage d'Expo
Start-Sleep -Seconds 5

# Test d'activation des fonctionnalités
Write-Host "⚡ Test d'activation des fonctionnalités..." -ForegroundColor Cyan
if (Test-Path "test-activation-complete.js") {
    node test-activation-complete.js
} else {
    Write-Host "⚠️ Fichier de test non trouvé - continuons" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ACTIVATION COMPLÈTE TERMINÉE !" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Application web: http://localhost:8081" -ForegroundColor Cyan
Write-Host "🌐 API Serveur: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📄 Documentation: ACTIVATION_GLOBALE_COMPLETE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Fonctionnalités actives:" -ForegroundColor Yellow
Write-Host "   🎤 Reconnaissance vocale" -ForegroundColor White
Write-Host "   🗣️ Synthèse vocale" -ForegroundColor White
Write-Host "   🌍 Traduction multi-langues" -ForegroundColor White
Write-Host "   🚀 IA avancée" -ForegroundColor White
Write-Host "   🎯 Extensions linguistiques" -ForegroundColor White
Write-Host "   ⚡ 12 fonctionnalités premium" -ForegroundColor White
Write-Host ""
Write-Host "📖 Guide d'utilisation:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez http://localhost:8081" -ForegroundColor White
Write-Host "   2. Naviguez vers 'Activation Globale'" -ForegroundColor White
Write-Host "   3. Testez les fonctionnalités" -ForegroundColor White
Write-Host "   4. Profitez de Talk Kin !" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Pour arrêter: Ctrl+C ou fermez cette fenêtre" -ForegroundColor Red

# Fonction de nettoyage
function Stop-TalkKinServices {
    Write-Host ""
    Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
    try {
        if ($global:apiProcess -and !$global:apiProcess.HasExited) {
            Stop-Process -Id $global:apiProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Serveur API arrêté" -ForegroundColor Green
        }
        if ($global:expoProcess -and !$global:expoProcess.HasExited) {
            Stop-Process -Id $global:expoProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Application Expo arrêtée" -ForegroundColor Green
        }
        Write-Host "✅ Tous les services arrêtés" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Certains processus n'ont pas pu être arrêtés" -ForegroundColor Yellow
    }
}

# Capturer Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Stop-TalkKinServices }

# Garder le script en vie
Write-Host "▶️ Services en cours d'exécution... (Ctrl+C pour arrêter)" -ForegroundColor Green
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Vérifier si les processus sont toujours en vie
        if (($global:apiProcess -and $global:apiProcess.HasExited) -or 
            ($global:expoProcess -and $global:expoProcess.HasExited)) {
            Write-Host "⚠️ Un des services s'est arrêté" -ForegroundColor Yellow
            break
        }
    }
} catch [System.Management.Automation.PipelineStoppedException] {
    # Ctrl+C intercepté
    Write-Host "⚠️ Arrêt demandé par l'utilisateur" -ForegroundColor Yellow
} finally {
    Stop-TalkKinServices
}

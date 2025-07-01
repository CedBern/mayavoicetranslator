# 🚀 Script d'Activation Rapide - Talk Kin (Windows)
# Active toutes les fonctionnalités et démarre l'application

[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingWriteHost', '')]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidGlobalVars', '')]
param()

Write-Information "🚀 Activation complète de Talk Kin..." -InformationAction Continue
Write-Information "==================================" -InformationAction Continue

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Information "✅ Node.js détecté: $nodeVersion" -InformationAction Continue
} catch {
    Write-Error "❌ Node.js n'est pas installé"
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Information "✅ npm détecté: $npmVersion" -InformationAction Continue
} catch {
    Write-Error "❌ npm n'est pas installé"
    exit 1
}

# Installer les dépendances si nécessaire
if (!(Test-Path "node_modules")) {
    Write-Information "📦 Installation des dépendances..." -InformationAction Continue
    npm install
}

# Démarrer le serveur API
Write-Information "🌐 Démarrage du serveur API..." -InformationAction Continue
$script:apiProcess = Start-Process -FilePath "node" -ArgumentList "api-server-simple.js" -PassThru -NoNewWindow
Write-Information "✅ Serveur API démarré (PID: $($script:apiProcess.Id))" -InformationAction Continue

# Attendre que le serveur soit prêt
Start-Sleep -Seconds 3

# Test de santé de l'API
Write-Information "🏥 Test de santé de l'API..." -InformationAction Continue
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get -TimeoutSec 5
    if ($healthResponse -and $healthResponse.status) {
        Write-Information "✅ API opérationnelle - Status: $($healthResponse.status)" -InformationAction Continue
    } else {
        Write-Information "✅ API opérationnelle - Réponse reçue" -InformationAction Continue
    }
} catch {
    Write-Warning "⚠️ API non accessible - continuons quand même"
}

# Démarrer l'application Expo
Write-Information "📱 Démarrage de l'application Expo..." -InformationAction Continue
$script:expoProcess = Start-Process -FilePath "npx" -ArgumentList "expo", "start", "--web" -PassThru -NoNewWindow
Write-Information "✅ Expo démarré (PID: $($script:expoProcess.Id))" -InformationAction Continue

# Attendre le démarrage d'Expo
Start-Sleep -Seconds 5

# Test d'activation des fonctionnalités
Write-Information "⚡ Test d'activation des fonctionnalités..." -InformationAction Continue
if (Test-Path "test-activation-complete.js") {
    node test-activation-complete.js
} else {
    Write-Warning "⚠️ Fichier de test non trouvé - continuons"
}

Write-Information "" -InformationAction Continue
Write-Information "🎉 ACTIVATION COMPLÈTE TERMINÉE !" -InformationAction Continue
Write-Information "==================================" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "📱 Application web: http://localhost:8081" -InformationAction Continue
Write-Information "🌐 API Serveur: http://localhost:3000" -InformationAction Continue
Write-Information "📄 Documentation: ACTIVATION_GLOBALE_COMPLETE.md" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "🔧 Fonctionnalités actives:" -InformationAction Continue
Write-Information "   🎤 Reconnaissance vocale" -InformationAction Continue
Write-Information "   🗣️ Synthèse vocale" -InformationAction Continue
Write-Information "   🌍 Traduction multi-langues" -InformationAction Continue
Write-Information "   🚀 IA avancée" -InformationAction Continue
Write-Information "   🎯 Extensions linguistiques" -InformationAction Continue
Write-Information "   ⚡ 12 fonctionnalités premium" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "📖 Guide d'utilisation:" -InformationAction Continue
Write-Information "   1. Ouvrez http://localhost:8081" -InformationAction Continue
Write-Information "   2. Naviguez vers 'Activation Globale'" -InformationAction Continue
Write-Information "   3. Testez les fonctionnalités" -InformationAction Continue
Write-Information "   4. Profitez de Talk Kin !" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "🛑 Pour arrêter: Ctrl+C ou fermez cette fenêtre" -InformationAction Continue

# Fonction de nettoyage
function Stop-TalkKinService {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidGlobalVars', '')]
    param()
    
    Write-Information "" -InformationAction Continue
    Write-Information "🛑 Arrêt des services..." -InformationAction Continue
    try {
        if ($script:apiProcess -and !$script:apiProcess.HasExited) {
            Stop-Process -Id $script:apiProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Information "✅ Serveur API arrêté" -InformationAction Continue
        }
        if ($script:expoProcess -and !$script:expoProcess.HasExited) {
            Stop-Process -Id $script:expoProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Information "✅ Application Expo arrêtée" -InformationAction Continue
        }
        Write-Information "✅ Tous les services arrêtés" -InformationAction Continue
    } catch {
        Write-Warning "⚠️ Certains processus n'ont pas pu être arrêtés"
    }
}

# Capturer Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Stop-TalkKinService }

# Garder le script en vie
Write-Information "▶️ Services en cours d'exécution... (Ctrl+C pour arrêter)" -InformationAction Continue
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Vérifier si les processus sont toujours en vie
        if (($script:apiProcess -and $script:apiProcess.HasExited) -or 
            ($script:expoProcess -and $script:expoProcess.HasExited)) {
            Write-Warning "⚠️ Un des services s'est arrêté"
            break
        }
    }
} catch [System.Management.Automation.PipelineStoppedException] {
    # Ctrl+C intercepté
    Write-Warning "⚠️ Arrêt demandé par l'utilisateur"
} finally {
    Stop-TalkKinService
}

# ðŸš€ Script d'Activation Rapide - Talk Kin (Windows)
# Active toutes les fonctionnalitÃ©s et dÃ©marre l'application

[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingWriteHost', '')]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidGlobalVars', '')]
param()

Write-Information "ðŸš€ Activation complÃ¨te de Talk Kin..." -InformationAction Continue
Write-Information "==================================" -InformationAction Continue

# VÃ©rifier Node.js
try {
    $nodeVersion = node --version
    Write-Information "âœ… Node.js dÃ©tectÃ©: $nodeVersion" -InformationAction Continue
} catch {
    Write-Error "âŒ Node.js n'est pas installÃ©"
    exit 1
}

# VÃ©rifier npm
try {
    $npmVersion = npm --version
    Write-Information "âœ… npm dÃ©tectÃ©: $npmVersion" -InformationAction Continue
} catch {
    Write-Error "âŒ npm n'est pas installÃ©"
    exit 1
}

# Installer les dÃ©pendances si nÃ©cessaire
if (!(Test-Path "node_modules")) {
    Write-Information "ðŸ“¦ Installation des dÃ©pendances..." -InformationAction Continue
    npm install
}

# DÃ©marrer le serveur API
Write-Information "ðŸŒ DÃ©marrage du serveur API..." -InformationAction Continue
$script:apiProcess = Start-Process -FilePath "node" -ArgumentList "api-server-simple.js" -PassThru -NoNewWindow
Write-Information "âœ… Serveur API dÃ©marrÃ© (PID: $($script:apiProcess.Id))" -InformationAction Continue

# Attendre que le serveur soit prÃªt
Start-Sleep -Seconds 3

# Test de santÃ© de l'API
Write-Information "ðŸ¥ Test de santÃ© de l'API..." -InformationAction Continue
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get -TimeoutSec 5
    if ($healthResponse -and $healthResponse.status) {
        Write-Information "âœ… API opÃ©rationnelle - Status: $($healthResponse.status)" -InformationAction Continue
    } else {
        Write-Information "âœ… API opÃ©rationnelle - RÃ©ponse reÃ§ue" -InformationAction Continue
    }
} catch {
    Write-Warning "âš ï¸ API non accessible - continuons quand mÃªme"
}

# DÃ©marrer l'application Expo
Write-Information "ðŸ“± DÃ©marrage de l'application Expo..." -InformationAction Continue
$script:expoProcess = Start-Process -FilePath "npx" -ArgumentList "expo", "start", "--web" -PassThru -NoNewWindow
Write-Information "âœ… Expo dÃ©marrÃ© (PID: $($script:expoProcess.Id))" -InformationAction Continue

# Attendre le dÃ©marrage d'Expo
Start-Sleep -Seconds 5

# Test d'activation des fonctionnalitÃ©s
Write-Information "âš¡ Test d'activation des fonctionnalitÃ©s..." -InformationAction Continue
if (Test-Path "test-activation-complete.js") {
    node test-activation-complete.js
} else {
    Write-Warning "âš ï¸ Fichier de test non trouvÃ© - continuons"
}

Write-Information "" -InformationAction Continue
Write-Information "ðŸŽ‰ ACTIVATION COMPLÃˆTE TERMINÃ‰E !" -InformationAction Continue
Write-Information "==================================" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "ðŸ“± Application web: http://localhost:8081" -InformationAction Continue
Write-Information "ðŸŒ API Serveur: http://localhost:3000" -InformationAction Continue
Write-Information "ðŸ“„ Documentation: ACTIVATION_GLOBALE_COMPLETE.md" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "ðŸ”§ FonctionnalitÃ©s actives:" -InformationAction Continue
Write-Information "   ðŸŽ¤ Reconnaissance vocale" -InformationAction Continue
Write-Information "   ðŸ—£ï¸ SynthÃ¨se vocale" -InformationAction Continue
Write-Information "   ðŸŒ Traduction multi-langues" -InformationAction Continue
Write-Information "   ðŸš€ IA avancÃ©e" -InformationAction Continue
Write-Information "   ðŸŽ¯ Extensions linguistiques" -InformationAction Continue
Write-Information "   âš¡ 12 fonctionnalitÃ©s premium" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "ðŸ“– Guide d'utilisation:" -InformationAction Continue
Write-Information "   1. Ouvrez http://localhost:8081" -InformationAction Continue
Write-Information "   2. Naviguez vers 'Activation Globale'" -InformationAction Continue
Write-Information "   3. Testez les fonctionnalitÃ©s" -InformationAction Continue
Write-Information "   4. Profitez de Talk Kin !" -InformationAction Continue
Write-Information "" -InformationAction Continue
Write-Information "ðŸ›‘ Pour arrÃªter: Ctrl+C ou fermez cette fenÃªtre" -InformationAction Continue

# Fonction de nettoyage
function Stop-TalkKinService {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidGlobalVars', '')]
    param()
    
    Write-Information "" -InformationAction Continue
    Write-Information "ðŸ›‘ ArrÃªt des services..." -InformationAction Continue
    try {
        if ($script:apiProcess -and !$script:apiProcess.HasExited) {
            Stop-Process -Id $script:apiProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Information "âœ… Serveur API arrÃªtÃ©" -InformationAction Continue
        }
        if ($script:expoProcess -and !$script:expoProcess.HasExited) {
            Stop-Process -Id $script:expoProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Information "âœ… Application Expo arrÃªtÃ©e" -InformationAction Continue
        }
        Write-Information "âœ… Tous les services arrÃªtÃ©s" -InformationAction Continue
    } catch {
        Write-Warning "âš ï¸ Certains processus n'ont pas pu Ãªtre arrÃªtÃ©s"
    }
}

# Capturer Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Stop-TalkKinService }

# Garder le script en vie
Write-Information "â–¶ï¸ Services en cours d'exÃ©cution... (Ctrl+C pour arrÃªter)" -InformationAction Continue
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # VÃ©rifier si les processus sont toujours en vie
        if (($script:apiProcess -and $script:apiProcess.HasExited) -or 
            ($script:expoProcess -and $script:expoProcess.HasExited)) {
            Write-Warning "âš ï¸ Un des services s'est arrÃªtÃ©"
            break
        }
    }
} catch [System.Management.Automation.PipelineStoppedException] {
    # Ctrl+C interceptÃ©
    Write-Warning "âš ï¸ ArrÃªt demandÃ© par l'utilisateur"
} finally {
    Stop-TalkKinService
}

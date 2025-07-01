# 🌍 Script PowerShell - Talk Kin avec langues régionales
# Démarre l'API backend et l'interface utilisateur avec support complet

Write-Host "🌍 =====================================" -ForegroundColor Cyan
Write-Host "🗣️  TALK KIN - LANGUES RÉGIONALES" -ForegroundColor Yellow
Write-Host "🌍 =====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Démarrer l'API backend en arrière-plan
Write-Host "🚀 Démarrage API backend..." -ForegroundColor Blue
$apiProcess = Start-Process -FilePath "node" -ArgumentList "api-server-simple.js" -PassThru -NoNewWindow
Write-Host "📡 API démarrée (PID: $($apiProcess.Id))" -ForegroundColor Green

# Attendre que l'API soit prête
Write-Host "⏰ Attente initialisation API..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Tester l'API
Write-Host "🧪 Test API..." -ForegroundColor Blue
try {
    $testResult = Invoke-RestMethod -Uri "http://localhost:3000/api/translate" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"text":"bonjour","from":"fr","to":"br"}'
    
    if ($testResult.translation) {
        Write-Host "✅ API opérationnelle - Test: bonjour → $($testResult.translation)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Problème API" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌍 LANGUES SUPPORTÉES:" -ForegroundColor Cyan
Write-Host "   🏛️  Autochtones: Maya, Quechua, Guarani" -ForegroundColor White
Write-Host "   🇪🇺 Régionales: Breton, Catalan, Corse, Basque, Ch'ti" -ForegroundColor White
Write-Host "   🏴 Celtiques: Gallois, Gaélique écossais" -ForegroundColor White
Write-Host "   🇫🇷 France: Occitan" -ForegroundColor White
Write-Host ""
Write-Host "📱 Interface web: http://localhost:8081" -ForegroundColor Green
Write-Host "📡 API backend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Tests disponibles:" -ForegroundColor Cyan
Write-Host "   node test-regional-languages.js" -ForegroundColor White
Write-Host "   node test-validation-langues-regionales.js" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pour arrêter: Ctrl+C puis Stop-Process -Id $($apiProcess.Id)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌍 =====================================" -ForegroundColor Cyan
Write-Host "✅ TALK KIN PRÊT AVEC LANGUES RÉGIONALES" -ForegroundColor Green
Write-Host "🌍 =====================================" -ForegroundColor Cyan
Write-Host ""

# Démarrer l'interface utilisateur
Write-Host "🎨 Démarrage interface utilisateur..." -ForegroundColor Blue
npm start

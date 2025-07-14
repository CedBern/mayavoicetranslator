# Vérification automatisée du déploiement MayaVoiceTranslator
# Usage : Exécutez ce script après le démarrage des conteneurs Docker

Write-Host "--- Vérification des services Docker ---"

# Vérifier que les ports 3000 (backend) et 3001 (web) sont ouverts
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $tcp = Test-NetConnection -ComputerName localhost -Port $port
    if ($tcp.TcpTestSucceeded) {
        Write-Host "[OK] Port $port ouvert (service accessible)" -ForegroundColor Green
    } else {
        Write-Host "[ERREUR] Port $port fermé ou service injoignable" -ForegroundColor Red
    }
}

Write-Host "--- Vérification des variables d'environnement critiques ---"
$envVars = @("NODE_ENV")
foreach ($var in $envVars) {
    $value = $env:${var}
    if ($null -ne $value -and $value -ne "") {
        Write-Host "[OK] $var=$value" -ForegroundColor Green
    } else {
        Write-Host "[ERREUR] Variable $var absente" -ForegroundColor Red
    }
}

Write-Host "--- Vérification des volumes node_modules ---"
$backendNodeModules = ".\\node_modules"
$webNodeModules = ".\\web\\node_modules"
if (Test-Path $backendNodeModules) {
    Write-Host "[OK] Backend node_modules présent" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] Backend node_modules absent" -ForegroundColor Red
}
if (Test-Path $webNodeModules) {
    Write-Host "[OK] Web node_modules présent" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] Web node_modules absent" -ForegroundColor Red
}

Write-Host "--- Vérification terminée ---"

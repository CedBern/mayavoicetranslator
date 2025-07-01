# Orchestrateur de diagnostics Maya Voice Translator (Windows PowerShell)

param(
    [switch]$quick,
    [switch]$debug,
    [switch]$silent
)

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = 'INFO'
    )
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    switch ($Level) {
        'OK'     { $color = 'Green' }
        'ERREUR' { $color = 'Red' }
        'INFO'   { $color = 'Cyan' }
        default  { $color = 'White' }
    }
    Write-Host "[$timestamp][$Level] $Message" -ForegroundColor $color
}

$results = @{}

# Gestion des modes rapide (quick), debug et silent

if ($debug) {
    $DebugPreference = 'Continue'
    if (-not $silent) { Write-Host "[DEBUG] Mode debug activé : affichage détaillé des commandes et erreurs." -ForegroundColor Magenta }
} else {
    $DebugPreference = 'SilentlyContinue'
}

# Redéfinir Write-Host et Write-Log si mode silent
if ($silent) {
    function Write-Host { param([string]$msg, [object[]]$rest) }
    function Write-Log { param([string]$Message, [string]$Level = 'INFO') }
}

# En-tête dynamique pour traçabilité
if (-not $silent) {
    $user = [System.Environment]::UserName
    $machine = [System.Environment]::MachineName
    $cwd = Get-Location
    $psver = $PSVersionTable.PSVersion.ToString()
    $modes = @()
    if ($quick) { $modes += 'quick' }
    if ($debug) { $modes += 'debug' }
    if ($silent) { $modes += 'silent' }
    $modesStr = if ($modes.Count -gt 0) { $modes -join ', ' } else { 'complet' }
    Write-Host "================= DIAGNOSTIC MAYA VOICE TRANSLATOR =================" -ForegroundColor Yellow
    Write-Host ("Date         : {0}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
    Write-Host ("Utilisateur  : {0}" -f $user)
    Write-Host ("Machine      : {0}" -f $machine)
    Write-Host ("Répertoire   : {0}" -f $cwd)
    Write-Host ("PowerShell   : {0}" -f $psver)
    Write-Host ("Mode         : {0}" -f $modesStr)
    Write-Host "===============================================================" -ForegroundColor Yellow
}

# Redirection automatique de la sortie console dans un fichier log horodaté
$logTimestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$logFile = "diagnostic_log_$logTimestamp.txt"
if (-not $silent) {
    Write-Host "(Toute la sortie console sera aussi enregistrée dans $logFile)" -ForegroundColor Gray
}
Start-Transcript -Path $logFile -Append | Out-Null

# Contrôle préliminaire des dépendances critiques
function Test-Dependency {
    param([string]$cmd, [string]$name)
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "[ERREUR] Dépendance manquante : $name ($cmd introuvable)" -ForegroundColor Red
        Write-Host "Conseil : Installez $name et vérifiez votre PATH, puis relancez le script." -ForegroundColor Yellow
        exit 127
    }
}

Test-Dependency 'python' 'Python'
Test-Dependency 'npm' 'Node.js/npm'
Test-Dependency 'Invoke-RestMethod' 'PowerShell Invoke-RestMethod'

# Contrôle des versions minimales requises
function Test-Version {
    param(
        [string]$cmd,
        [string]$name,
        [string]$minVersion,
        [string]$regex,
        [int[]]$minParts
    )
    $ver = & $cmd --version 2>&1 | Select-Object -First 1 | Select-String -Pattern $regex | ForEach-Object { $_.Matches[0].Groups[1].Value }
    if (-not $ver) {
        Write-Host "[ERREUR] Impossible de détecter la version de $name." -ForegroundColor Red
        Write-Host "Conseil : Vérifiez l’installation de $name et relancez le script." -ForegroundColor Yellow
        exit 128
    }
    $verParts = $ver -split '\.' | ForEach-Object { [int]$_ }
    for ($i=0; $i -lt $minParts.Length; $i++) {
        if ($verParts[$i] -lt $minParts[$i]) {
            Write-Host "[ERREUR] $name $minVersion ou supérieur requis (trouvé $ver)." -ForegroundColor Red
            Write-Host "Conseil : Mettez à jour $name à la version $minVersion ou supérieure." -ForegroundColor Yellow
            exit 129
        } elseif ($verParts[$i] -gt $minParts[$i]) {
            break
        }
    }
}

Test-Version 'python' 'Python' '3.8.0' '([0-9]+\.[0-9]+\.[0-9]+)' @(3,8,0)
Test-Version 'node' 'Node.js' '16.0.0' '([0-9]+\.[0-9]+\.[0-9]+)' @(16,0,0)

# Vérifie la santé de l’API locale
Write-Log 'Vérification santé API locale...' 'INFO'
try {
    Write-Debug "Appel healthcheck : Invoke-RestMethod -Uri http://localhost:3000/health -TimeoutSec 5"
    $health = Invoke-RestMethod -Uri http://localhost:3000/health -TimeoutSec 5
    Write-Log "API santé : $($health.status) ($($health.timestamp))" 'OK'
    $results['API'] = 'OK'
} catch {
    Write-Log 'API locale injoignable sur /health' 'ERREUR'
    Write-Host "Conseil : Vérifiez que l’API est bien démarrée sur http://localhost:3000/health." -ForegroundColor Yellow
    $results['API'] = 'ERREUR'
    [console]::beep(1000,400)
}

# Vérification santé LivingLanguageLab
Write-Log 'Vérification santé LivingLanguageLab...' 'INFO'
try {
    Write-Debug "Appel healthcheck : Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/health -TimeoutSec 5"
    $livinglab = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/health -TimeoutSec 5
    Write-Log "LivingLanguageLab santé : $($livinglab.status) ($($livinglab.timestamp))" 'OK'
    $results['LivingLanguageLab'] = 'OK'
} catch {
    Write-Log 'LivingLanguageLab injoignable sur /api/livinglab/health' 'ERREUR'
    Write-Host "Conseil : Vérifiez que LivingLanguageLab est bien démarré sur http://localhost:4000/api/livinglab/health." -ForegroundColor Yellow
    $results['LivingLanguageLab'] = 'ERREUR'
    [console]::beep(1000,400)
}

# Test LivingLanguageLab endpoints (GET/POST /corpora)
Write-Log 'Test LivingLanguageLab GET /corpora...' 'INFO'
try {
    $corpora = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/corpora -TimeoutSec 5
    if ($corpora -is [System.Collections.IEnumerable]) {
        Write-Log "GET /corpora OK : $($corpora.Count) corpus trouvés" 'OK'
        $results['LivingLabCorporaGET'] = 'OK'
    } else {
        throw
    }
} catch {
    Write-Log 'Erreur GET /corpora LivingLanguageLab' 'ERREUR'
    $results['LivingLabCorporaGET'] = 'ERREUR'
    [console]::beep(1000,400)
}

Write-Log 'Test LivingLanguageLab POST /corpora...' 'INFO'
try {
    $testCorpus = @{ id = 'diagtest'; name = 'DiagTest'; description = 'Corpus de test diag'; languages = @('fr'); size = 1 }
    $response = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/corpora -Method Post -Body ($testCorpus | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 5
    if ($response.id -eq 'diagtest') {
        Write-Log "POST /corpora OK : corpus diagtest ajouté" 'OK'
        $results['LivingLabCorporaPOST'] = 'OK'
    } else {
        throw
    }
} catch {
    $status = $_.Exception.Response.StatusCode.Value__
    $content = $null
    if ($_.Exception.Response) {
        try { $content = $_.Exception.Response.Content | ConvertFrom-Json } catch { $content = $_.Exception.Response.Content }
    }
    if ($status -eq 409 -or ($content -and $content.error -match 'already exists|déjà existant')) {
        Write-Log 'POST /corpora déjà existant (OK)' 'OK'
        $results['LivingLabCorporaPOST'] = 'OK'
    } else {
        Write-Log ("Erreur POST /corpora LivingLanguageLab: " + ($content.error ?? $content ?? $_.Exception.Message)) 'ERREUR'
        $results['LivingLabCorporaPOST'] = 'ERREUR'
        [console]::beep(1000,400)
    }
}

# Test import/export corpus LivingLanguageLab
Write-Log 'Test LivingLanguageLab import/export corpus...' 'INFO'

# Import d’un corpus de test
Write-Output "[DIAG] Import corpus..."
$importCorpus = @{ id = 'diagimport'; name = 'DiagImport'; description = 'Corpus importé diag'; languages = @('fr','oc'); size = 7 }
try {
    $importRes = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/corpora/import -Method Post -Body (@{ corpus = $importCorpus } | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 5
    if ($importRes.success) {
        Write-Log 'Import corpus OK' 'OK'
        $results['LLLabCorpusImportPOST'] = 'OK'
    } else { throw }
} catch {
    $status = $_.Exception.Response.StatusCode.Value__
    $content = $null
    if ($_.Exception.Response) {
        try { $content = $_.Exception.Response.Content | ConvertFrom-Json } catch { $content = $_.Exception.Response.Content }
    }
    if ($status -eq 409 -or ($content -and $content.error -match 'déjà existant|already exists')) {
        Write-Log 'Import corpus déjà existant (OK)' 'OK'
        $results['LLLabCorpusImportPOST'] = 'OK'
    } else {
        Write-Log ("Erreur import corpus: " + ($content.error ?? $content ?? $_.Exception.Message)) 'ERREUR'
        $results['LLLabCorpusImportPOST'] = 'ERREUR'
        [console]::beep(1000,400)
    }
}

# Export du corpus importé
Write-Output "[DIAG] Export corpus..."
try {
    $exportRes = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/corpora/export/diagimport -TimeoutSec 5
    if ($exportRes.corpus.id -eq 'diagimport') {
        Write-Log 'Export corpus OK' 'OK'
        $results['LLLabCorpusExportGET'] = 'OK'
    } else { throw }
} catch {
    Write-Log 'Erreur export corpus' 'ERREUR'
    $results['LLLabCorpusExportGET'] = 'ERREUR'
    [console]::beep(1000,400)
}

if (-not $quick) {
    Write-Debug "Appel : python scripts/diagnostic_corpus_vs_tests.py"
    # Diagnostic corpus (console)
    Write-Log 'Diagnostic corpus (console)' 'INFO'
    try {
        python scripts/diagnostic_corpus_vs_tests.py
        if ($LASTEXITCODE -eq 0) {
            Write-Log 'Diagnostic corpus console terminé' 'OK'
            $results['CorpusConsole'] = 'OK'
        } else {
            throw
        }
    } catch {
        Write-Log 'Erreur diagnostic corpus console' 'ERREUR'
        $results['CorpusConsole'] = 'ERREUR'
        [console]::beep(1000,400)
    }

    Write-Debug "Appel : python scripts/diagnostic_corpus_vs_tests_html.py"
    # Diagnostic corpus (rapport HTML)
    Write-Log 'Diagnostic corpus (HTML)' 'INFO'
    try {
        python scripts/diagnostic_corpus_vs_tests_html.py
        if (Test-Path diagnostic_corpus_report.html) {
            Write-Log 'Rapport HTML généré : diagnostic_corpus_report.html' 'OK'
            $results['CorpusHTML'] = 'OK'
        } else {
            throw
        }
    } catch {
        Write-Log 'Erreur diagnostic corpus HTML' 'ERREUR'
        $results['CorpusHTML'] = 'ERREUR'
        [console]::beep(1000,400)
    }
} # <-- Correction : fermeture du bloc if (-not $quick)

Write-Debug "Appel : npm run test:multilang"
# Tests multi-langues
Write-Log 'Tests end-to-end multi-langues' 'INFO'
try {
    npm run test:multilang
    if ($LASTEXITCODE -eq 0) {
        Write-Log 'Tests multi-langues terminés' 'OK'
        $results['TestsMultilang'] = 'OK'
    } else {
        throw
    }
} catch {
    Write-Log 'Erreur tests multi-langues' 'ERREUR'
    $results['TestsMultilang'] = 'ERREUR'
    [console]::beep(1000,400)
}

# Tests endpoints enfants (Montessori/Piaget) LivingLanguageLab
Write-Log 'Test LivingLanguageLab enfants (Montessori/Piaget)...' 'INFO'

# Création profil enfant
Write-Output "[DIAG] Création profil enfant..."
$childProfile = @{
    name = 'DiagLila'
    age = 6
    learningStyle = 'visual'
    cognitiveStage = 'preoperational'
    sensoryPreferences = @('visual','kinesthetic')
    interests = @('animaux','nature')
}
try {
    $childRes = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/children/profiles -Method Post -Body ($childProfile | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 5
    if ($childRes.id) {
        Write-Log "Profil enfant créé : $($childRes.id)" 'OK'
        $results['LLLabChildProfilePOST'] = 'OK'
    } else { throw }
} catch {
    Write-Log 'Erreur création profil enfant' 'ERREUR'
    $results['LLLabChildProfilePOST'] = 'ERREUR'
    [console]::beep(1000,400)
}

# Récupération profil enfant
if ($childRes.id) {
    try {
        $childGet = Invoke-RestMethod -Uri "http://localhost:4000/api/livinglab/children/profiles/$($childRes.id)" -TimeoutSec 5
        if ($childGet.name -eq 'DiagLila') {
            Write-Log 'Récupération profil enfant OK' 'OK'
            $results['LLLabChildProfileGET'] = 'OK'
        } else { throw }
    } catch {
        Write-Log 'Erreur récupération profil enfant' 'ERREUR'
        $results['LLLabChildProfileGET'] = 'ERREUR'
        [console]::beep(1000,400)
    }
}

# Liste activités visuelles
try {
    $acts = Invoke-RestMethod -Uri "http://localhost:4000/api/livinglab/children/activities?sensory=visual" -TimeoutSec 5
    if ($acts.Count -ge 1 -and $acts[0].sensoryType -eq 'visual') {
        Write-Log 'GET activités visuelles OK' 'OK'
        $results['LLLabChildActivitiesGET'] = 'OK'
    } else { throw }
} catch {
    Write-Log 'Erreur GET activités visuelles' 'ERREUR'
    $results['LLLabChildActivitiesGET'] = 'ERREUR'
    [console]::beep(1000,400)
}

# Enregistrement feedback activité
if ($childRes.id) {
    $feedback = @{
        childId = $childRes.id
        activityId = 'act1'
        result = 'réussi'
        feedback = 'Test diag : activité réussie.'
    }
    try {
        $fbRes = Invoke-RestMethod -Uri http://localhost:4000/api/livinglab/children/activity-feedback -Method Post -Body ($feedback | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 5
        if ($fbRes.success) {
            Write-Log 'POST feedback activité OK' 'OK'
            $results['LLLabChildFeedbackPOST'] = 'OK'
        } else { throw }
    } catch {
        Write-Log 'Erreur POST feedback activité' 'ERREUR'
        $results['LLLabChildFeedbackPOST'] = 'ERREUR'
        [console]::beep(1000,400)
    }
}

# Accès portfolio enfant
Write-Output "[DIAG] Accès portfolio enfant..."
if ($childRes.id) {
    try {
        $portfolio = Invoke-RestMethod -Uri "http://localhost:4000/api/livinglab/children/portfolio/$($childRes.id)" -TimeoutSec 5
        if ($portfolio.entries.Count -ge 1 -and $portfolio.entries[0].activityId -eq 'act1') {
            Write-Log 'GET portfolio enfant OK' 'OK'
            $results['LLLabChildPortfolioGET'] = 'OK'
        } else { throw }
    } catch {
        Write-Log 'Erreur GET portfolio enfant' 'ERREUR'
        $results['LLLabChildPortfolioGET'] = 'ERREUR'
        [console]::beep(1000,400)
    }
}

Write-Host "\n================= RÉSUMÉ DIAGNOSTIC =================" -ForegroundColor Yellow
$summaryLines = @()
foreach ($key in $results.Keys) {
    $color = if ($results[$key] -eq 'OK') { 'Green' } else { 'Red' }
    $line = ("{0,-20}: {1}" -f $key, $results[$key])
    Write-Host $line -ForegroundColor $color
    $summaryLines += $line
}
Write-Host "====================================================\n" -ForegroundColor Yellow
Write-Host "Vérifiez les rapports générés (diagnostic_corpus_report.html, logs, artefacts CI)." -ForegroundColor Cyan
Write-Host "Documentation : https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières" -ForegroundColor Cyan

# Calcul du taux de succès (juste après la collecte des résultats)
$taux = 0
if ($results.Count -gt 0) {
    $oks = ($results.Values | Where-Object { $_ -eq 'OK' }).Count
    $taux = [math]::Round(100 * $oks / $results.Count, 1)
}
Write-Host "[DEBUG] Taux de succès calculé : $taux %" -ForegroundColor Magenta

# Préparation de l'en-tête d'exécution pour les fichiers de résumé
$user = [System.Environment]::UserName
$machine = [System.Environment]::MachineName
$cwd = Get-Location
$psver = $PSVersionTable.PSVersion.ToString()
$modes = @()
if ($quick) { $modes += 'quick' }
if ($debug) { $modes += 'debug' }
if ($silent) { $modes += 'silent' }
$modesStr = if ($modes.Count -gt 0) { $modes -join ', ' } else { 'complet' }
$headerText = @(
    "================= DIAGNOSTIC MAYA VOICE TRANSLATOR =================",
    "Date         : $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    "Utilisateur  : $user",
    "Machine      : $machine",
    "Répertoire   : $cwd",
    "PowerShell   : $psver",
    "Mode         : $modesStr",
    "===============================================================",
    ""
) -join "`r`n"

$headerHtml = @(
    '<div style="font-family:sans-serif;margin-bottom:1em">',
    '<b>Diagnostic Maya Voice Translator</b><br>',
    "<b>Date</b> : $(Get-Date -Format 'yyyy-MM-dd HH:mm')<br>",
    "<b>Utilisateur</b> : $user<br>",
    "<b>Machine</b> : $machine<br>",
    "<b>Répertoire</b> : $cwd<br>",
    "<b>PowerShell</b> : $psver<br>",
    "<b>Mode</b> : $modesStr<br>",
    '</div>'
) -join ""

# Génération d'un timestamp pour les fichiers de résumé
$timestampFile = Get-Date -Format 'yyyyMMdd_HHmmss'
$summaryFile = "diagnostic_summary_$timestampFile.txt"
$summaryHtmlFile = "diagnostic_summary_$timestampFile.html"
$summaryPrintHtmlFile = "diagnostic_summary_${timestampFile}_print.html"

# Export du résumé texte avec en-tête
$headerText | Out-File $summaryFile -Encoding utf8
$summaryLines | Out-File $summaryFile -Encoding utf8 -Append
Write-Host "Résumé exporté dans $summaryFile" -ForegroundColor Green

# Export du résumé HTML avec en-tête
$summaryHtml = @()
$summaryHtml += '<!DOCTYPE html>'
$summaryHtml += '<html lang="fr"><head><meta charset="utf-8"><title>Résumé Diagnostic Maya Voice Translator</title>'
$summaryHtml += '<style>body{font-family:sans-serif;}table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#eee;} .ok{color:green;} .err{color:red;}</style>'
$summaryHtml += '</head><body>'
$summaryHtml += $headerHtml
$summaryHtml += "<h2>Résumé diagnostic</h2>"
$summaryHtml += '<table><tr><th>Étape</th><th>Statut</th></tr>'
foreach ($key in $results.Keys) {
    $status = $results[$key]
    $class = if ($status -eq 'OK') { 'ok' } else { 'err' }
    $summaryHtml += "<tr><td>$key</td><td class='$class'>$status</td></tr>"
}
$summaryHtml += '</table>'
$summaryHtml += '<p>Voir aussi : <a href="diagnostic_corpus_report.html">diagnostic_corpus_report.html</a></p>'
$summaryHtml += '<p><a href="https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières">Documentation complète</a></p>'
$summaryHtml += '</body></html>'
$summaryHtml | Out-File $summaryHtmlFile -Encoding utf8
Write-Host "Résumé exporté dans $summaryHtmlFile" -ForegroundColor Green

# Export du résumé au format HTML imprimable (A4)
$summaryPrintHtmlFile = "diagnostic_summary_${timestampFile}_print.html"
$printHtml = @()
$printHtml += '<!DOCTYPE html>'
$printHtml += '<html lang="fr"><head><meta charset="utf-8"><title>Résumé Diagnostic Maya Voice Translator (Impression)</title>'
$printHtml += '<style>@media print { body { font-size:12pt; } table { page-break-inside:avoid; } } body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;margin-bottom:2em;}th,td{border:1px solid #ccc;padding:8px;}th{background:#eee;} .ok{color:green;} .err{color:red;} .meta{margin-bottom:1em;}</style>'
$printHtml += '</head><body>'
$printHtml += '<div class="meta">'
$printHtml += '<h1>Diagnostic Maya Voice Translator</h1>'
$printHtml += "<b>Date</b> : $(Get-Date -Format 'yyyy-MM-dd HH:mm')<br>"
$printHtml += "<b>Utilisateur</b> : $user<br>"
$printHtml += "<b>Machine</b> : $machine<br>"
$printHtml += "<b>Répertoire</b> : $cwd<br>"
$printHtml += "<b>PowerShell</b> : $psver<br>"
$printHtml += "<b>Mode</b> : $modesStr<br>"
$printHtml += '</div>'
$printHtml += "<h2>Résumé diagnostic</h2>"
$printHtml += '<table><tr><th>Étape</th><th>Statut</th></tr>'
foreach ($key in $results.Keys) {
    $status = $results[$key]
    $class = if ($status -eq 'OK') { 'ok' } else { 'err' }
    $printHtml += "<tr><td>$key</td><td class='$class'>$status</td></tr>"
}
$printHtml += '</table>'
$printHtml += '<h3>Artefacts générés</h3><ul>'
$printHtml += "<li>Résumé TXT : $summaryFile</li>"
$printHtml += "<li>Résumé HTML : $summaryHtmlFile</li>"
$printHtml += "<li>Résumé Markdown : $summaryMdFile</li>"
$printHtml += "<li>Résumé CSV : $summaryCsvFile</li>"
$printHtml += "<li>Résumé JSON : $summaryJsonFile</li>"
$printHtml += "<li>Résumé PDF : $summaryPdfFile</li>"
$printHtml += "<li>Badge SVG : $badgeFile</li>"
$printHtml += "<li>Historique : $historyFile</li>"
$printHtml += '</ul>'
$printHtml += '<p>Documentation : <a href="https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières">README</a></p>'
$printHtml += '</body></html>'
$printHtml | Out-File $summaryPrintHtmlFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryPrintHtmlFile" -ForegroundColor Green }
# Export du résumé au format Markdown
$summaryMdFile = "diagnostic_summary_${timestampFile}.md"
$md = @()
$md += "# Diagnostic Maya Voice Translator"
$md += ""
$md += "- **Date** : $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$md += "- **Utilisateur** : $user"
$md += "- **Machine** : $machine"
$md += "- **Répertoire** : $cwd"
$md += "- **PowerShell** : $psver"
$md += "- **Mode** : $modesStr"
$md += "- **Taux de succès** : $($taux) %"
$md += ""
$md += "## Statut des étapes"
$md += "| Étape            | Statut   |"
$md += "|------------------|----------|"
foreach ($key in $results.Keys) {
    $status = $results[$key]
    $emoji = if ($status -eq 'OK') { '✅' } else { '❌' }
    $md += "| $key | $emoji $status |"
}
$md += ""
$md += "## Artefacts générés"
$md += "- [Résumé TXT]($summaryFile)"
$md += "- [Résumé HTML]($summaryHtmlFile)"
$md += "- [Statut JSON]($summaryJsonFile)"
if (Test-Path diagnostic_corpus_report.html) {
    $md += "- [Rapport corpus HTML](diagnostic_corpus_report.html)"
}
$md += ""
$md += "## Conseils en cas d’échec"
$md += "- Vérifiez les conseils affichés dans la console ou le log."
$md += "- Consultez la documentation : [README](https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières)"
$md += "- Contactez le support si besoin."
$md -join "`r`n" | Out-File $summaryMdFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryMdFile" -ForegroundColor Green }

# Export du statut machine-parseable (JSON)
$summaryJsonFile = "diagnostic_status_$timestampFile.json"
$statusObj = [PSCustomObject]@{
    date = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
    utilisateur = $user
    machine = $machine
    repertoire = $cwd.Path
    powershell = $psver
    mode = $modesStr
    resultats = $results
    code_retour = if ($results.Values -contains 'ERREUR') { 1 } else { 0 }
}
$statusObj | ConvertTo-Json -Depth 4 | Out-File $summaryJsonFile -Encoding utf8
if (-not $silent) { Write-Host "Statut exporté dans $summaryJsonFile" -ForegroundColor Green }

# Export du résumé au format XML
$summaryXmlFile = "diagnostic_summary_${timestampFile}.xml"
$xml = @()
$xml += "<?xml version='1.0' encoding='UTF-8'?>"
$xml += "<diagnostic>"
$xml += "  <date>$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</date>"
$xml += "  <utilisateur>$user</utilisateur>"
$xml += "  <machine>$machine</machine>"
$xml += "  <mode>$modesStr</mode>"
$xml += "  <statut>$(if ($results.Values -contains 'ERREUR') { 'failing' } else { 'passing' })</statut>"
$xml += "  <artefact>"
$xml += "    <txt>$summaryFile</txt>"
$xml += "    <html>$summaryHtmlFile</html>"
$xml += "    <md>$summaryMdFile</md>"
$xml += "    <csv>$summaryCsvFile</csv>"
$xml += "    <json>$summaryJsonFile</json>"
$xml += "    <pdf>$summaryPdfFile</pdf>"
$xml += "    <badge>$badgeFile</badge>"
$xml += "    <history>$historyFile</history>"
$xml += "  </artefact>"
$xml += "  <resultats>"
foreach ($k in $results.Keys) {
    $xml += "    <etape nom='$k'>$($results[$k])</etape>"
}
$xml += "  </resultats>"
$xml += "</diagnostic>"
$xml | Out-File $summaryXmlFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryXmlFile" -ForegroundColor Green }

# Export du résumé au format YAML
$summaryYamlFile = "diagnostic_summary_${timestampFile}.yaml"
$yamlObj = [ordered]@{
    date = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
    utilisateur = $user
    machine = $machine
    mode = $modesStr
    statut = if ($results.Values -contains 'ERREUR') { 'failing' } else { 'passing' }
    artefact = [ordered]@{
        txt = $summaryFile
        html = $summaryHtmlFile
        md = $summaryMdFile
        csv = $summaryCsvFile
        json = $summaryJsonFile
        pdf = $summaryPdfFile
        badge = $badgeFile
        history = $historyFile
    }
    resultats = $results
}
# Conversion manuelle en YAML (correction syntaxe)
$yamlLines = @()
foreach ($k in $yamlObj.Keys) {
    if ($yamlObj[$k] -is [hashtable] -or $yamlObj[$k] -is [ordered]) {
        $yamlLines += "${k}:"
        foreach ($kk in $yamlObj[$k].Keys) {
            $yamlLines += "  ${kk}: $($yamlObj[$k][$kk])"
        }
    } else {
        $yamlLines += "${k}: $($yamlObj[$k])"
    }
}
$yamlLines | Out-File $summaryYamlFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryYamlFile" -ForegroundColor Green }

# Export du résumé au format TOML
$summaryTomlFile = "diagnostic_summary_${timestampFile}.toml"
$tomlLines = @()
$tomlLines += "date = '$(Get-Date -Format 'yyyy-MM-dd HH:mm')'"
$tomlLines += "utilisateur = '$user'"
$tomlLines += "machine = '$machine'"
$tomlLines += "mode = '$modesStr'"
$tomlLines += "statut = '$(if ($results.Values -contains 'ERREUR') { 'failing' } else { 'passing' })'"
$tomlLines += "[artefact]"
$tomlLines += "txt = '$summaryFile'"
$tomlLines += "html = '$summaryHtmlFile'"
$tomlLines += "md = '$summaryMdFile'"
$tomlLines += "csv = '$summaryCsvFile'"
$tomlLines += "json = '$summaryJsonFile'"
$tomlLines += "pdf = '$summaryPdfFile'"
$tomlLines += "badge = '$badgeFile'"
$tomlLines += "history = '$historyFile'"
$tomlLines += "[resultats]"
foreach ($k in $results.Keys) {
    $tomlLines += "$k = '$($results[$k])'"
}
$tomlLines | Out-File $summaryTomlFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryTomlFile" -ForegroundColor Green }

# Export du résumé au format INI
$summaryIniFile = "diagnostic_summary_${timestampFile}.ini"
$iniLines = @()
$iniLines += "[meta]"
$iniLines += "date=$(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$iniLines += "utilisateur=$user"
$iniLines += "machine=$machine"
$iniLines += "mode=$modesStr"
$iniLines += "statut=$(if ($results.Values -contains 'ERREUR') { 'failing' } else { 'passing' })"
$iniLines += ""
$iniLines += "[artefact]"
$iniLines += "txt=$summaryFile"
$iniLines += "html=$summaryHtmlFile"
$iniLines += "md=$summaryMdFile"
$iniLines += "csv=$summaryCsvFile"
$iniLines += "json=$summaryJsonFile"
$iniLines += "pdf=$summaryPdfFile"
$iniLines += "badge=$badgeFile"
$iniLines += "history=$historyFile"
$iniLines += ""
$iniLines += "[resultats]"
foreach ($k in $results.Keys) {
    $iniLines += "$k=$($results[$k])"
}
$iniLines | Out-File $summaryIniFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryIniFile" -ForegroundColor Green }

# Envoi automatique du résumé HTML par email (optionnel, décommentez et configurez si besoin)
<#
# Paramètres à personnaliser
$smtpServer = "smtp.example.com"
$smtpPort = 587
$smtpUser = "user@example.com"
$smtpPass = "votre_mot_de_passe"
$to = "destinataire@example.com"
$from = "maya-voice-translator@example.com"
$subject = "[MayaVoiceTranslator] Résumé diagnostic $timestampFile"
$body = "Veuillez trouver en pièce jointe le résumé du diagnostic Maya Voice Translator."

Send-MailMessage -From $from -To $to -Subject $subject -Body $body -SmtpServer $smtpServer -Port $smtpPort -Credential (New-Object System.Management.Automation.PSCredential($smtpUser,(ConvertTo-SecureString $smtpPass -AsPlainText -Force))) -UseSsl -Attachments $summaryHtmlFile -BodyAsHtml:$false
#>

# Nettoyage automatique : ne garder que les 10 derniers fichiers de résumé (txt et html)
$maxFiles = 10
Get-ChildItem -Path . -Filter 'diagnostic_summary_*.txt' | Sort-Object LastWriteTime -Descending | Select-Object -Skip $maxFiles | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path . -Filter 'diagnostic_summary_*.html' | Sort-Object LastWriteTime -Descending | Select-Object -Skip $maxFiles | Remove-Item -Force -ErrorAction SilentlyContinue

# Fin du script : arrêt de la transcription
Stop-Transcript | Out-Null

# Code de retour global pour CI/automatisation
if ($results.Values -contains 'ERREUR') {
    exit 1
} else {
    exit 0
}

# Génération d’un QR code ASCII pointant vers le résumé HTML (console)
if (-not $silent) {
    $qrUrl = $summaryHtmlFile
    try {
        if (Get-Command ConvertTo-QRCode -ErrorAction SilentlyContinue) {
            # Si le module QRCodeGenerator est installé
            ConvertTo-QRCode $qrUrl | Write-Host
        } else {
            # Fallback ASCII simple
            Write-Host "[QR] Accès rapide au résumé HTML : $qrUrl" -ForegroundColor Cyan
            Write-Host "(Installez le module QRCodeGenerator pour un QR code graphique)"
        }
    } catch {
        Write-Host "[QR] Accès rapide au résumé HTML : $qrUrl" -ForegroundColor Cyan
    }
}

# Récapitulatif des artefacts générés (sauf mode silent)
if (-not $silent) {
    Write-Host "\n--- ARTEFACTS GÉNÉRÉS ---" -ForegroundColor Yellow
    Write-Host ("Résumé TXT   : {0}" -f $summaryFile) -ForegroundColor Cyan
    Write-Host ("Résumé HTML  : {0}" -f $summaryHtmlFile) -ForegroundColor Cyan
    Write-Host ("Statut JSON  : {0}" -f $summaryJsonFile) -ForegroundColor Cyan
    if (Test-Path diagnostic_corpus_report.html) {
        Write-Host ("Rapport corpus HTML : diagnostic_corpus_report.html") -ForegroundColor Cyan
    }
    Write-Host "(Voir aussi les logs, artefacts CI, et QR code ci-dessus si affiché)" -ForegroundColor Gray
}

# Contrôle de l’espace disque disponible (min 200 Mo)
$minFreeMB = 200
$drive = (Get-Location).Path.Substring(0,2)
$freeMB = (Get-PSDrive -Name $drive[0]).Free/1MB
if ($freeMB -lt $minFreeMB) {
    Write-Host "[ERREUR] Espace disque insuffisant : $([math]::Round($freeMB,1)) Mo libres (minimum $minFreeMB Mo requis)." -ForegroundColor Red
    Write-Host "Conseil : Libérez de l’espace disque avant de relancer le script." -ForegroundColor Yellow
    exit 130
}

# Contrôle de la connectivité réseau (ping d’une URL clé)
$testUrl = 'https://www.google.com'
try {
    $null = Invoke-WebRequest -Uri $testUrl -UseBasicParsing -TimeoutSec 5
} catch {
    Write-Host "[ERREUR] Connectivité réseau absente ou $testUrl injoignable." -ForegroundColor Red
    Write-Host "Conseil : Vérifiez votre connexion internet ou le proxy réseau." -ForegroundColor Yellow
    exit 131
}

# Ajout du hash SHA256 à la fin des rapports TXT, HTML, MD
function Add-FileHash {
    param([string]$file)
    $hash = (Get-FileHash $file -Algorithm SHA256).Hash
    Add-Content $file "`r`n---`r`nSHA256: $hash"
}
Add-FileHash $summaryFile
Add-FileHash $summaryHtmlFile
Add-FileHash $summaryMdFile

# Export du résumé au format CSV
$summaryCsvFile = "diagnostic_summary_${timestampFile}.csv"
$csvHeader = "date,utilisateur,machine,mode," + ($results.Keys -join ",") + ",code_retour"
$csvLine = (
    (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),
    $user,
    $machine,
    $modesStr
) + ($results.Values) + @(if ($results.Values -contains 'ERREUR') {1} else {0})
$csvLineStr = $csvLine -join ","
$csvContent = $csvHeader + "`r`n" + $csvLineStr
$csvContent | Out-File $summaryCsvFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryCsvFile" -ForegroundColor Green }

# Génération d’un badge SVG de statut du dernier diagnostic
$badgeFile = "diagnostic_status_badge.svg"
$badgeColor = if ($results.Values -contains 'ERREUR') { '#e05d44' } else { '#4c1' }
$badgeText = if ($results.Values -contains 'ERREUR') { 'failing' } else { 'passing' }
$svg = @"
<svg xmlns='http://www.w3.org/2000/svg' width='120' height='20'>
  <linearGradient id='b' x2='0' y2='100%'>
    <stop offset='0' stop-color='#bbb' stop-opacity='.1'/>
    <stop offset='1' stop-opacity='.1'/>
  </linearGradient>
  <rect rx='3' width='120' height='20' fill='#555'/>
  <rect rx='3' x='60' width='60' height='20' fill='$badgeColor'/>
  <path fill='$badgeColor' d='M60 0h4v20h-4z'/>
  <rect rx='3' width='120' height='20' fill='url(#b)'/>
  <g fill='#fff' text-anchor='middle' font-family='Verdana,Geneva,DejaVu Sans,sans-serif' font-size='11'>
    <text x='30' y='15' fill='#010101' fill-opacity='.3'>diagnostic</text>
    <text x='30' y='14'>diagnostic</text>
    <text x='90' y='15' fill='#010101' fill-opacity='.3'>$badgeText</text>
    <text x='90' y='14'>$badgeText</text>
  </g>
</svg>
"@
$svg | Out-File $badgeFile -Encoding utf8
if (-not $silent) { Write-Host "Badge exporté dans $badgeFile" -ForegroundColor Green }

# Ajout/append d’une entrée dans le changelog local
$changelogFile = "diagnostic_changelog.md"
$changelogEntry = @()
$changelogEntry += "---"
$changelogEntry += "**Date** : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  |  **Utilisateur** : $user  |  **Machine** : $machine  |  **Mode** : $modesStr  |  **Statut** : $badgeText"
$changelogEntry += "- [Résumé TXT]($summaryFile) | [Résumé HTML]($summaryHtmlFile) | [Markdown]($summaryMdFile) | [CSV]($summaryCsvFile) | [JSON]($summaryJsonFile) | [Badge]($badgeFile)"
if (Test-Path diagnostic_corpus_report.html) {
    $changelogEntry += "- [Rapport corpus HTML](diagnostic_corpus_report.html)"
}
$changelogEntry = $changelogEntry -join "`r`n"
Add-Content $changelogFile $changelogEntry
if (-not $silent) { Write-Host "Entrée ajoutée au changelog $changelogFile" -ForegroundColor Green }

# Détection des échecs récurrents (alerte si même étape échoue 3 fois de suite)
$alert = $false
$alertMsg = ""
if (Test-Path $changelogFile) {
    $lines = Get-Content $changelogFile | Select-String '^\*\*Date\*\*' | Select-Object -Last 3
    if ($lines.Count -eq 3) {
        $fails = $lines | Where-Object { $_ -match 'Statut\s*:\s*failing' }
        if ($fails.Count -eq 3) {
            $alert = $true
            $alertMsg = "[ALERTE] 3 diagnostics consécutifs en échec. Problème persistant détecté !"
            if (-not $silent) { Write-Host $alertMsg -ForegroundColor Red }
            Add-Content $changelogFile "`r`n$alertMsg`r`n"
        }
    }
}

# Génération d’un tableau de bord HTML à la fin du diagnostic
$historyFile = "diagnostic_history.html"
$historyLines = @()
if (Test-Path $changelogFile) {
    $entries = Get-Content $changelogFile | Select-String '^\*\*Date\*\*' | Select-Object -Last 20
    $full = Get-Content $changelogFile
    $rows = @()
    foreach ($entry in $entries) {
        $date = ($entry -split '\|')[0] -replace '\*\*Date\*\*\s*:\s*','' -replace '\s+$',''
        $user = ($entry -split '\|')[1] -replace '\*\*Utilisateur\*\*\s*:\s*','' -replace '\s+$',''
        $machine = ($entry -split '\|')[2] -replace '\*\*Machine\*\*\s*:\s*','' -replace '\s+$',''
        $mode = ($entry -split '\|')[3] -replace '\*\*Mode\*\*\s*:\s*','' -replace '\s+$',''
        $statut = ($entry -split '\|')[4] -replace '\*\*Statut\*\*\s*:\s*','' -replace '\s+$',''
        $idx = [array]::IndexOf($full, $entry.ToString())
        $artifacts = $full[$idx+1]
        $corpus = if ($full.Count -gt $idx+2 -and $full[$idx+2] -like '*Rapport corpus HTML*') { $full[$idx+2] } else { '' }
        $rows += "<tr><td>$date</td><td>$user</td><td>$machine</td><td>$mode</td><td>$statut</td><td>$artifacts<br/>$corpus</td></tr>"
    }
    $historyLines += @(
        '<!DOCTYPE html>',
        '<html lang="fr"><head><meta charset="utf-8"><title>Historique Diagnostics Maya Voice Translator</title>',
        '<style>body{font-family:sans-serif;}table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:6px;}th{background:#eee;} .failing{color:red;} .passing{color:green;}</style>',
        '</head><body>',
        '<h2>Historique des 20 derniers diagnostics</h2>',
        '<table><tr><th>Date</th><th>Utilisateur</th><th>Machine</th><th>Mode</th><th>Statut</th><th>Artefacts</th></tr>',
        ($rows -join "`n"),
        '</table>',
        '<p><a href="https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières">Documentation complète</a></p>',
        '</body></html>'
    )
    $historyLines -join "`n" | Out-File $historyFile -Encoding utf8
    if (-not $silent) { Write-Host "Historique exporté dans $historyFile" -ForegroundColor Green }
}

# Export du résumé au format PDF (si wkhtmltopdf disponible)
$summaryPdfFile = "diagnostic_summary_${timestampFile}.pdf"
if (Get-Command wkhtmltopdf -ErrorAction SilentlyContinue) {
    wkhtmltopdf $summaryHtmlFile $summaryPdfFile
    if (-not $silent) { Write-Host "Résumé exporté dans $summaryPdfFile" -ForegroundColor Green }
} else {
    if (-not $silent) {
        Write-Host "[INFO] wkhtmltopdf non trouvé : installez-le pour générer le PDF du diagnostic automatiquement." -ForegroundColor Yellow
    }
}

# Export du résumé au format texte brut ANSI (ASCII, sans accents ni caractères spéciaux)
$summaryAnsiFile = "diagnostic_summary_${timestampFile}_ansi.txt"
function Remove-Accents {
    param([string]$text)
    $normalized = $text.Normalize([Text.NormalizationForm]::FormD)
    -join ($normalized.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne 'NonSpacingMark' })
}
$ansiLines = @()
$ansiLines += "================= DIAGNOSTIC MAYA VOICE TRANSLATOR ================="
$ansiLines += "Date         : $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$ansiLines += "Utilisateur  : $user"
$ansiLines += "Machine      : $machine"
$ansiLines += "Repertoire   : $cwd"
$ansiLines += "PowerShell   : $psver"
$ansiLines += "Mode         : $modesStr"
$ansiLines += "==============================================================="
$ansiLines += ""
$ansiLines += "STATUTS :"
foreach ($key in $results.Keys) {
    $status = $results[$key]
    $ansiLines += ("{0,-20}: {1}" -f $key, $status)
}
$ansiLines += ""
$ansiLines += "ARTEFACTS :"
$ansiLines += "TXT   : $summaryFile"
$ansiLines += "HTML  : $summaryHtmlFile"
$ansiLines += "MD    : $summaryMdFile"
$ansiLines += "CSV   : $summaryCsvFile"
$ansiLines += "JSON  : $summaryJsonFile"
$ansiLines += "PDF   : $summaryPdfFile"
$ansiLines += "SVG   : $badgeFile"
$ansiLines += "HISTO : $historyFile"
$ansiLines += ""
$ansiLines += "Conseils : voir README ou support."
$ansiLines = $ansiLines | ForEach-Object { Remove-Accents $_ }
$ansiLines | Out-File $summaryAnsiFile -Encoding ascii
if (-not $silent) { Write-Host "Résumé exporté dans $summaryAnsiFile" -ForegroundColor Green }

# Export du résumé au format Markdown compact (une ligne)
$summaryCompactMdFile = "diagnostic_summary_${timestampFile}_compact.md"
$compactLine = "- $(Get-Date -Format 'yyyy-MM-dd HH:mm') | **$($results.Values -contains 'ERREUR' ? '❌ failing' : '✅ passing')** | [TXT]($summaryFile) [HTML]($summaryHtmlFile) [MD]($summaryMdFile) [CSV]($summaryCsvFile) [JSON]($summaryJsonFile) [PDF]($summaryPdfFile) [SVG]($badgeFile) [HISTO]($historyFile)"
$compactLine | Out-File $summaryCompactMdFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryCompactMdFile" -ForegroundColor Green }

# Export du résumé au format JUnit XML
$summaryJUnitFile = "diagnostic_summary_${timestampFile}_junit.xml"
$junit = @()
$junit += "<?xml version='1.0' encoding='UTF-8'?>"
$junit += "<testsuite name='MayaVoiceTranslatorDiagnostic' tests='$($results.Count)' failures='$($results.Values | Where-Object {$_ -eq 'ERREUR'} | Measure-Object).Count' time='0'>"
foreach ($key in $results.Keys) {
    $status = $results[$key]
    $junit += "  <testcase classname='Diagnostic' name='$key'>"
    if ($status -eq 'ERREUR') {
        $junit += "    <failure message='Echec de l\'étape $key'/>"
    }
    $junit += "  </testcase>"
}
$junit += "</testsuite>"
$junit | Out-File $summaryJUnitFile -Encoding utf8
if (-not $silent) { Write-Host "Résumé exporté dans $summaryJUnitFile" -ForegroundColor Green }

# Export cumulatif d’un tableau Markdown (diagnostic_table.md)
$tableFile = "diagnostic_table.md"
if (-not (Test-Path $tableFile)) {
    "| Date | Utilisateur | Statut | TXT | HTML | MD | CSV | JSON | PDF | SVG | HISTO |" | Out-File $tableFile -Encoding utf8
    "|------|-------------|--------|-----|------|----|-----|------|-----|-----|-------|" | Add-Content $tableFile
}
$tableLine = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | $user | $($results.Values -contains 'ERREUR' ? '❌ failing' : '✅ passing') | [TXT]($summaryFile) | [HTML]($summaryHtmlFile) | [MD]($summaryMdFile) | [CSV]($summaryCsvFile) | [JSON]($summaryJsonFile) | [PDF]($summaryPdfFile) | [SVG]($badgeFile) | [HISTO]($historyFile) |"
$tableLine | Add-Content $tableFile
if (-not $silent) { Write-Host "Tableau cumulatif exporté dans $tableFile" -ForegroundColor Green }

# Export ZIP de tous les artefacts générés
$zipFile = "diagnostic_report_${timestampFile}.zip"
$toZip = @(
    $summaryFile, $summaryHtmlFile, $summaryMdFile, $summaryCsvFile, $summaryJsonFile, $summaryPdfFile, $badgeFile, $historyFile, $summaryJsonLdFile, $summaryYamlFile, $summaryTomlFile, $summaryIniFile, $summaryXmlFile, $summaryPrintHtmlFile, $summaryAnsiFile, $summaryCompactMdFile, $summaryJUnitFile, $tableFile
) | Where-Object { Test-Path $_ }
if ($toZip.Count -gt 0) {
    Compress-Archive -Path $toZip -DestinationPath $zipFile -Force
    if (-not $silent) { Write-Host "Archive ZIP exportée dans $zipFile" -ForegroundColor Green }
}

# Génération automatique du dashboard HTML à la fin du diagnostic
Write-Log 'Génération du dashboard HTML...' 'INFO'
try {
    python LivingLanguageLab/scripts/diagnostic_dashboard.py
    Write-Log 'Dashboard HTML généré : diagnostic_dashboard.html' 'OK'
} catch {
    Write-Log 'Erreur génération dashboard HTML' 'ERREUR'
    [console]::beep(1000,400)
}

# Génération automatique du PDF du dashboard à la fin du diagnostic
Write-Log 'Export du dashboard en PDF...' 'INFO'
try {
    python LivingLanguageLab/scripts/diagnostic_dashboard_export_pdf.py
    Write-Log 'Dashboard PDF généré : diagnostic_dashboard.pdf' 'OK'
} catch {
    Write-Log 'Erreur export PDF dashboard' 'ERREUR'
    [console]::beep(1000,400)
}

# Envoi automatique d'une alerte mail en cas d'échec critique
Write-Log 'Vérification des erreurs critiques et envoi d’alerte mail si besoin...' 'INFO'
try {
    python LivingLanguageLab/scripts/diagnostic_mail_alert.py
    Write-Log 'Alerte mail traitée (envoyée si erreur critique)' 'OK'
} catch {
    Write-Log 'Erreur lors de l’envoi de l’alerte mail' 'ERREUR'
    [console]::beep(1000,400)
}

# Génération d’un rapport de synthèse compact (executive summary)
Write-Log 'Génération du rapport de synthèse (executive summary)...' 'INFO'
$summaryFile = "diagnostic_summary_$logTimestamp.md"
# Calcul du taux de succès (juste avant le résumé)
$taux = 0
if ($results.Count -gt 0) {
    $oks = ($results.Values | Where-Object { $_ -eq 'OK' }).Count
    $taux = [math]::Round(100 * $oks / $results.Count, 1)
}
Write-Host "[DEBUG] Taux de succès calculé : $taux %" -ForegroundColor Magenta
$critiques = $results.GetEnumerator() | Where-Object { $_.Value -eq 'ERREUR' } | ForEach-Object { $_.Name }
$badge = if ($critiques.Count -eq 0) { '🟢 **Succès global**' } else { '🔴 **Échec critique**' }
$summary = @"
# Diagnostic Maya Voice Translator

- **Date** : $(Get-Date -Format 'yyyy-MM-dd HH:mm')
- **Utilisateur** : $user
- **Machine** : $machine
- **Répertoire** : $cwd
- **PowerShell** : $psver
- **Mode** : $modesStr
- **Taux de succès** : $($taux) %

## Statut des étapes
| Étape            | Statut   |
|------------------|----------|
"@
foreach ($k in $results.Keys) { $summary += "| $k | $($results[$k]) |`n" }
$summary += ""
$summary += "## Artefacts générés"
$summary += "- [Résumé TXT]($summaryFile)"
$summary += "- [Résumé HTML]($summaryHtmlFile)"
$summary += "- [Statut JSON]($summaryJsonFile)"
if (Test-Path diagnostic_corpus_report.html) {
    $summary += "- [Rapport corpus HTML](diagnostic_corpus_report.html)"
}
$summary += ""
$summary += "## Conseils en cas d’échec"
$summary += "- Vérifiez les conseils affichés dans la console ou le log."
$summary += "- Consultez la documentation : [README](https://github.com/TaanLabs/MayaVoiceTranslator#table-des-matières)"
$summary += "- Contactez le support si besoin."
$summary -join "`r`n" | Out-File $summaryFile -Encoding utf8
Write-Log "Rapport de synthèse généré : $summaryFile" 'OK'

# Export PDF automatique du rapport de synthèse (si Pandoc disponible)
$summaryPdfFile = $summaryFile -replace '\.md$', '.pdf'
try {
    if (Get-Command pandoc -ErrorAction SilentlyContinue) {
        pandoc $summaryFile -o $summaryPdfFile --pdf-engine=xelatex
        Write-Log "Rapport de synthèse PDF généré : $summaryPdfFile" 'OK'
    } else {
        Write-Log 'Pandoc non trouvé, export PDF du résumé non effectué.' 'INFO'
    }
} catch {
    Write-Log 'Erreur export PDF du rapport de synthèse' 'ERREUR'
}

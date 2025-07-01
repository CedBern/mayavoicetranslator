# Script PowerShell pour cloner ou mettre à jour UltraSuite dans le dossier approprié
$TargetDir = Join-Path $PSScriptRoot '..\bases_de_donnees\ultrasuite'
$RepoUrl = 'https://github.com/ultrasuite/ultrasuite.git'
if (Test-Path (Join-Path $TargetDir '.git')) {
    Write-Host 'Mise à jour d\'UltraSuite...'
    git -C $TargetDir pull
} else {
    Write-Host 'Clonage d\'UltraSuite...'
    git clone $RepoUrl $TargetDir
}

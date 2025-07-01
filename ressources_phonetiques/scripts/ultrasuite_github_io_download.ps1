# Script PowerShell générique pour importer une ressource (ZIP ou Git)
# Usage : Appelez Import-Resource pour chaque ressource à gérer

function Import-Resource {
    param(
        [string]$Name,
        [string]$RepoUrl,
        [string]$TargetDir,
        [string]$ZipName
    )
    $zipPath = "$TargetDir/$ZipName"
    if (Test-Path $zipPath) {
        Write-Host "[$Name] Décompression de l'archive ZIP..."
        if (!(Test-Path $TargetDir)) {
            New-Item -ItemType Directory -Path $TargetDir | Out-Null
        }
        Expand-Archive -Path $zipPath -DestinationPath $TargetDir -Force
        Write-Host "[$Name] Archive ZIP décompressée dans $TargetDir"
    }
    elseif (Test-Path "$TargetDir/.git") {
        Write-Host "[$Name] Mise à jour via Git..."
        git -C $TargetDir pull
        Write-Host "[$Name] Documentation à jour dans $TargetDir"
    }
    else {
        Write-Host "[$Name] Clonage via Git..."
        git clone $RepoUrl $TargetDir
        Write-Host "[$Name] Documentation clonée dans $TargetDir"
    }
}

# UltraSuite documentation officielle
Import-Resource -Name "UltraSuite Doc" -RepoUrl "https://github.com/ultrasuite/ultrasuite.github.io.git" -TargetDir "../docs_institutionnelles/ultrasuite_github_io" -ZipName "ultrasuite_github_io.zip"

# Exemple pour ajouter une autre ressource (décommentez et adaptez)
# Import-Resource -Name "UltraSuite Corpus" -RepoUrl "https://github.com/ultrasuite/ultrasuite-data.git" -TargetDir "../bases_de_donnees/ultrasuite" -ZipName "ultrasuite_data.zip"

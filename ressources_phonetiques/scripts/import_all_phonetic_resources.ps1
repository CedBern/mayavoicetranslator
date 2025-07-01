# Script PowerShell global pour importer toutes les ressources phonétiques (ZIP ou Git)
# Usage : Exécutez ce script pour automatiser l'import/mise à jour de toutes les ressources clés

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
        Write-Host "[$Name] Ressource à jour dans $TargetDir"
    }
    else {
        Write-Host "[$Name] Clonage via Git..."
        git clone $RepoUrl $TargetDir
        Write-Host "[$Name] Ressource clonée dans $TargetDir"
    }
}

# UltraSuite documentation officielle
Import-Resource -Name "UltraSuite Doc" -RepoUrl "https://github.com/ultrasuite/ultrasuite.github.io.git" -TargetDir "../docs_institutionnelles/ultrasuite_github_io" -ZipName "ultrasuite_github_io.zip"

# UltraSuite corpus articulatoire (décommentez si besoin)
# Import-Resource -Name "UltraSuite Corpus" -RepoUrl "https://github.com/ultrasuite/ultrasuite-data.git" -TargetDir "../bases_de_donnees/ultrasuite" -ZipName "ultrasuite_data.zip"

# Ajoutez ici d'autres ressources à automatiser selon le même modèle
# Exemple :
# Import-Resource -Name "Autre Base" -RepoUrl "https://github.com/monorg/monrepo.git" -TargetDir "../bases_de_donnees/autre_base" -ZipName "autre_base.zip"

Write-Host "---\nToutes les ressources phonétiques sont à jour !"

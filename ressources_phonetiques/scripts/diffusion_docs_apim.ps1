# Script d’automatisation – Diffusion des documentations APIM

Ce script PowerShell automatise la diffusion des documentations (utilisateur, développeur, partenaire, administrateur) générées pour l’API Manager de MayaVoiceTranslator.

---

# Paramètres
$docs = @(
  "APIM_doc_utilisateur_exemple.md",
  "APIM_doc_developpeur_exemple.md",
  "APIM_doc_partenaire_exemple.md",
  "APIM_doc_admin_exemple.md"
)
$source = "c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator\ressources_phonetiques"
$target = "c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator\docs_diffusion"

# Création du dossier de diffusion si besoin
if (!(Test-Path $target)) {
    New-Item -ItemType Directory -Path $target | Out-Null
}

# Copie des fichiers
foreach ($doc in $docs) {
    $srcFile = Join-Path $source $doc
    $dstFile = Join-Path $target $doc
    Copy-Item $srcFile $dstFile -Force
}

Write-Host "Diffusion des documentations APIM terminée dans $target."

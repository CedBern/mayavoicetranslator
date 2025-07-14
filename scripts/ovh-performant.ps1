# ===================================================================
# SCRIPT POWERSHELL - OVH PERFORMANT : SSH, SFTP, UPLOAD AUTOMATIQUE
# Compatible Windows 10/11 avec OpenSSH natif
# ===================================================================

param(
    [string]$Action = "upload", # "ssh", "sftp", "upload"
    [string]$LocalPath = "./web", # Dossier ou fichier à uploader
    [string]$RemotePath = "/home/talkkij/web" # Dossier distant OVH
)

# Configuration OVH
$OVH_HOST = "ssh.cluster100.hosting.ovh.net"
$OVH_USER = "talkkij"
$OVH_PORT = 22

function Test-SSH {
    Write-Host "`n[TEST] Test de connexion SSH..." -ForegroundColor Green
    Start-Process -NoNewWindow -Wait -FilePath "ssh.exe" -ArgumentList "-p $OVH_PORT $OVH_USER@$OVH_HOST 'echo SSH_OK'"
}

function Start-SSH {
    Write-Host "`n[SSH] Ouverture de la session SSH..." -ForegroundColor Green
    Start-Process -NoNewWindow -FilePath "ssh.exe" -ArgumentList "-p $OVH_PORT $OVH_USER@$OVH_HOST"
}

function Start-SFTP {
    Write-Host "`n[SFTP] Ouverture de la session SFTP..." -ForegroundColor Green
    Start-Process -NoNewWindow -FilePath "sftp.exe" -ArgumentList "-P $OVH_PORT $OVH_USER@$OVH_HOST"
}

function Send-OvhContent {
    param (
        [string]$LocalPath,
        [string]$RemotePath
    )

    Write-Host "`n[UPLOAD] Envoi du contenu vers OVH..." -ForegroundColor Green
    # Commande pour envoyer les fichiers (exemple avec SCP)
    Start-Process -NoNewWindow -FilePath "scp.exe" -ArgumentList "-P", $OVH_PORT, "-r", $LocalPath, "$OVH_USER@${OVH_HOST}:${RemotePath}"
}

# === Fonction d'accès FTP simple ===
function Start-FTP {
    param(
        [string]$FtpServer = "ftp.cluster100.hosting.ovh.net",
        [string]$FtpUser = $OVH_USER,
        [string]$FtpRemotePath = "/web",
        [string]$FtpLocalFile = "./web/index.html"
    )
    $FtpPassword = Read-Host -AsSecureString "Entrez le mot de passe FTP (rien ne s'affichera)"
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($FtpPassword)
    $PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

    $uri = "ftp://$FtpServer$FtpRemotePath/$(Split-Path $FtpLocalFile -Leaf)"
    $webclient = New-Object System.Net.WebClient
    $webclient.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $PlainPassword)
    Write-Host "[FTP] Upload de $FtpLocalFile vers $uri ..." -ForegroundColor Cyan
    $webclient.UploadFile($uri, $FtpLocalFile)
    Write-Host "[FTP] Upload terminé." -ForegroundColor Green
}

# Execution de l'action demandée
switch ($Action) {
    "ssh" { Start-SSH }
    "sftp" { Start-SFTP }
    "ftp" { Start-FTP }
    "upload" { Send-OvhContent }
    default { Write-Host "Action inconnue. Utilisez 'ssh', 'sftp', 'ftp' ou 'upload'." -ForegroundColor Red }
}
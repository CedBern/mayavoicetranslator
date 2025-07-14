# ===================================================================
# SCRIPT POWERSHELL - CONNEXION SSH & SFTP OVH TALKKIN AVEC MOT DE PASSE ET 2FA
# Compatible Windows 10/11 avec OpenSSH
# ===================================================================

param(
    [string]$Action = "ssh" # "ssh" ou "sftp"
)

# Configuration OVH
$OVH_HOST = "ssh.cluster100.hosting.ovh.net"
$OVH_USER = "talkkij"
$OVH_PORT = 22

# Demande du mot de passe de façon sécurisée
$SecurePassword = Read-Host -AsSecureString "Entrez le mot de passe OVH (rien ne s'affichera)"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

Write-Host "\n[INFO] Connexion à $OVH_HOST avec l'utilisateur $OVH_USER sur le port $OVH_PORT" -ForegroundColor Cyan
Write-Host "[INFO] Après le mot de passe, saisissez le code 2FA Google Authenticator dans le terminal SSH/SFTP." -ForegroundColor Yellow

if ($Action -eq "ssh") {
    Write-Host "\n[SSH] Ouverture de la session SSH..." -ForegroundColor Green
    Start-Process -NoNewWindow -Wait -FilePath "ssh.exe" -ArgumentList "-p $OVH_PORT $OVH_USER@$OVH_HOST"
}
elseif ($Action -eq "sftp") {
    Write-Host "\n[SFTP] Ouverture de la session SFTP..." -ForegroundColor Green
    Start-Process -NoNewWindow -Wait -FilePath "sftp.exe" -ArgumentList "-P $OVH_PORT $OVH_USER@$OVH_HOST"
}
else {
    Write-Host "Action inconnue. Utilisez 'ssh' ou 'sftp'." -ForegroundColor Red
}

Write-Host "\n[INFO] Session terminée." -ForegroundColor Cyan

# ===================================================================
# SCRIPT POWERSHELL - CONNEXION SSH OVH TALKKIN
# Compatible Windows 10/11 avec OpenSSH
# ===================================================================

param(
    [string]$Action = "test",
    [switch]$Upload,
    [switch]$Deploy
)

# Configuration OVH
$OVH_HOST = "ssh.cluster100.hosting.ovh.net"
$OVH_USER = "talkkij"
$OVH_PORT = 22

# Couleurs pour output
function Write-Info { 
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green 
}

function Write-Warn { 
    param($Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow 
}

function Write-Error { 
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red 
}

function Write-Step { 
    param($Message)
    Write-Host "`n🔧 $Message" -ForegroundColor Cyan 
}

# Fonction de test connexion SSH
function Test-SSHConnection {
    Write-Step "Test de connexion SSH vers OVH..."
    Write-Info "Serveur: $OVH_HOST"
    Write-Info "Utilisateur: $OVH_USER"
    Write-Info "Port: $OVH_PORT"
    Write-Warn "Préparez votre code 2FA Google Authenticator"
    
    # Test de connexion simple
    Write-Info "Tentative de connexion..."
    & ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "echo 'SSH OK' && whoami && pwd && ls -la"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Info "✅ Connexion SSH réussie !"
        return $true
    } else {
        Write-Error "❌ Échec de la connexion SSH (Code: $LASTEXITCODE)"
        return $false
    }
}

# Fonction d'upload du script de setup
function Send-SetupScript {
    Write-Step "Upload du script de configuration..."
    
    $LOCAL_SCRIPT = "c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator\scripts\setup-talkkin-ovh.sh"
    $REMOTE_DIR = "/home/talkkij/setup"
    $REMOTE_SCRIPT = "$REMOTE_DIR/setup-talkkin-ovh.sh"
    
    # Vérification du fichier local
    if (!(Test-Path $LOCAL_SCRIPT)) {
        Write-Error "Script local non trouvé: $LOCAL_SCRIPT"
        return $false
    }
    
    Write-Info "📁 Création du dossier remote..."
    & ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "mkdir -p $REMOTE_DIR"
    
    Write-Info "📤 Upload du script..."
    & scp -P $OVH_PORT $LOCAL_SCRIPT "${OVH_USER}@${OVH_HOST}:${REMOTE_SCRIPT}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Info "✅ Script uploadé avec succès"
        
        Write-Info "🔧 Configuration des permissions..."
        & ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "chmod +x $REMOTE_SCRIPT"
        
        Write-Info "✅ Prêt pour le déploiement"
        return $true
    } else {
        Write-Error "❌ Échec de l'upload"
        return $false
    }
}

# Fonction de déploiement
function Start-Deployment {
    Write-Step "Démarrage du déploiement automatique..."
    
    $REMOTE_SCRIPT = "/home/talkkij/setup/setup-talkkin-ovh.sh"
    
    Write-Info "🚀 Exécution du script de setup..."
    & ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "cd /home/talkkij && bash $REMOTE_SCRIPT"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Info "✅ Déploiement terminé avec succès !"
    } else {
        Write-Error "❌ Erreur pendant le déploiement (Code: $LASTEXITCODE)"
    }
}

# Fonction de connexion interactive
function Start-InteractiveSession {
    Write-Step "Ouverture d'une session SSH interactive..."
    Write-Info "Vous serez connecté au serveur OVH"
    Write-Warn "Tapez 'exit' pour quitter la session"
    
    & ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}"
}

# ===================================================================
# PROGRAMME PRINCIPAL
# ===================================================================

Write-Host @"
🌐 CONNEXION SSH OVH TALKKIN
================================
Serveur: $OVH_HOST
Utilisateur: $OVH_USER
Action: $Action
"@ -ForegroundColor Cyan

# Avertissement sécurité
Write-Warn "⚠️  SÉCURITÉ: Changez le mot de passe immédiatement après connexion !"
Write-Warn "⚠️  Préparez votre code 2FA Google Authenticator"

switch ($Action) {
    "test" {
        Test-SSHConnection
    }
    "upload" {
        if (Test-SSHConnection) {
            Send-SetupScript
        }
    }
    "deploy" {
        if (Test-SSHConnection) {
            if (Send-SetupScript) {
                Start-Deployment
            }
        }
    }
    "interactive" {
        Start-InteractiveSession
    }
    "full" {
        if (Test-SSHConnection) {
            if (Send-SetupScript) {
                Start-Deployment
                Write-Info "🎉 Déploiement complet terminé !"
                Write-Info "🌐 Votre site devrait être accessible sur: https://talkkin.shop"
            }
        }
    }
    default {
        Write-Info @"
Usage:
  .\ssh-connect-ovh.ps1 -Action test        # Test connexion
  .\ssh-connect-ovh.ps1 -Action upload      # Upload script
  .\ssh-connect-ovh.ps1 -Action deploy      # Déploiement complet
  .\ssh-connect-ovh.ps1 -Action interactive # Session SSH
  .\ssh-connect-ovh.ps1 -Action full        # Tout en une fois
"@
    }
}

Write-Host "`n✨ Script terminé" -ForegroundColor Green

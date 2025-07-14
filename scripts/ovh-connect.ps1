# ===================================================================
# SCRIPT POWERSHELL - CONNEXION ET CONFIGURATION OVH TALKKIN
# Compatible Windows 10/11 avec OpenSSH
# ===================================================================

param(
    [string]$Action = "connect",
    [string]$Domain = "talkkin.shop"
)

# Couleurs pour output
function Write-ColorOutput {
    param($ForegroundColor, $Message)
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Info {
    param($Message)
    Write-ColorOutput -ForegroundColor Green -Message "[INFO] $Message"
}

function Write-Warn {
    param($Message)
    Write-ColorOutput -ForegroundColor Yellow -Message "[WARN] $Message"
}

function Write-Error {
    param($Message)
    Write-ColorOutput -ForegroundColor Red -Message "[ERROR] $Message"
}

function Write-Step {
    param($Message)
    Write-ColorOutput -ForegroundColor Cyan -Message "[STEP] $Message"
}

# Configuration OVH
$OVH_HOST = "ssh.cluster100.hosting.ovh.net"
$OVH_USER = "talkkij"
$OVH_PORT = "22"
$LOCAL_SCRIPT_PATH = ".\scripts\setup-talkkin-ovh.sh"
$REMOTE_SCRIPT_PATH = "/home/talkkij/setup/setup-talkkin.sh"

function Test-SSHConnection {
    Write-Info "🔍 Test de connectivité vers $OVH_HOST..."
    
    try {
        $result = Test-NetConnection -ComputerName $OVH_HOST -Port $OVH_PORT -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Info "✅ Connexion réseau OK vers ${OVH_HOST}:${OVH_PORT}"
            return $true
        } else {
            Write-Error "❌ Impossible de joindre ${OVH_HOST}:${OVH_PORT}"
            return $false
        }
    } catch {
        Write-Error "❌ Erreur réseau: $($_.Exception.Message)"
        return $false
    }
}

function Test-OpenSSH {
    Write-Info "🔍 Vérification OpenSSH..."
    
    try {
        $sshVersion = ssh -V 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Info "✅ OpenSSH disponible: $sshVersion"
            return $true
        }
    } catch {
        Write-Error "❌ OpenSSH non installé"
        Write-Info "💡 Installation recommandée:"
        Write-Info "   - Windows 10/11: Paramètres > Applications > Fonctionnalités optionnelles > OpenSSH"
        Write-Info "   - Ou: winget install Microsoft.OpenSSH.Beta"
        return $false
    }
}

function Connect-OVH {
    Write-Step "🔐 Connexion SSH vers OVH avec 2FA"
    Write-Info "📱 Préparez votre app d'authentification (Google Authenticator, Authy, etc.)"
    Write-Warn "⏰ Vous aurez 30 secondes pour saisir le code 2FA"
    
    Write-Info "🚀 Connexion vers ${OVH_USER}@${OVH_HOST}..."
    Write-Info "🔑 Étapes:"
    Write-Info "   1. Saisir votre mot de passe SSH"
    Write-Info "   2. Saisir le code 2FA à 6 chiffres"
    Write-Info "   3. Valider rapidement"
    
    # Connexion SSH interactive
    ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}"
}

function Send-SetupScript {
    Write-Step "📤 Upload du script de configuration"
    
    if (-not (Test-Path $LOCAL_SCRIPT_PATH)) {
        Write-Error "❌ Script local non trouvé: $LOCAL_SCRIPT_PATH"
        return $false
    }
    
    Write-Info "📁 Création du dossier remote..."
    ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "mkdir -p /home/talkkij/setup"
    
    Write-Info "📤 Upload du script..."
    scp -P $OVH_PORT $LOCAL_SCRIPT_PATH "${OVH_USER}@${OVH_HOST}:${REMOTE_SCRIPT_PATH}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Info "✅ Script uploadé avec succès"
        
        Write-Info "🔧 Configuration des permissions..."
        ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "chmod +x $REMOTE_SCRIPT_PATH"
        
        return $true
    } else {
        Write-Error "❌ Erreur lors de l'upload"
        return $false
    }
}

function Start-RemoteSetup {
    Write-Step "🚀 Lancement de la configuration automatique"
    Write-Warn "⚠️ Cette opération va installer et configurer:"
    Write-Info "   - Node.js 18.x LTS"
    Write-Info "   - PostgreSQL + Redis"
    Write-Info "   - Nginx + SSL"
    Write-Info "   - PM2 + Monitoring"
    Write-Info "   - Firewall + Sécurité"
    
    $confirm = Read-Host "Continuer? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Info "🎯 Exécution du script de configuration..."
        ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" "cd /home/talkkij/setup && ./setup-talkkin.sh"
    } else {
        Write-Warn "❌ Configuration annulée"
    }
}

function Show-OVHInfo {
    Write-Step "📋 Informations de connexion OVH"
    Write-Info "🌐 Serveur: $OVH_HOST"
    Write-Info "👤 Utilisateur: $OVH_USER"
    Write-Info "🔌 Port SSH: $OVH_PORT"
    Write-Info "🌍 Domaine: $Domain"
    Write-Info "📁 Projet remote: /home/talkkij/projects/talkkin"
    Write-Info ""
    Write-Info "🔑 Commandes utiles:"
    Write-Info "   ssh -p $OVH_PORT `"${OVH_USER}@${OVH_HOST}`""
    Write-Info "   scp -P $OVH_PORT fichier.txt `"${OVH_USER}@${OVH_HOST}:/home/talkkij/`""
    Write-Info ""
    Write-Info "📱 2FA: Préparez votre app d'authentification"
    Write-Info "🔐 Codes secours: Gardez vos codes de backup OVH"
}

function Show-PostInstallSteps {
    Write-Step "🎯 Étapes post-installation"
    Write-Info "Après la configuration automatique, exécuter manuellement:"
    Write-Info ""
    Write-Info "1. 🔒 Configuration SSL:"
    Write-Info "   sudo certbot --nginx -d $Domain"
    Write-Info ""
    Write-Info "2. 🗝️ Configuration variables d'environnement:"
    Write-Info "   nano /home/talkkij/projects/talkkin/.env.production"
    Write-Info "   # Ajouter vos clés API OpenAI, Google, etc."
    Write-Info ""
    Write-Info "3. 📥 Déploiement du code TalkKin:"
    Write-Info "   cd /home/talkkij/projects/talkkin"
    Write-Info "   # Copier ou cloner votre code source"
    Write-Info "   ./scripts/deploy.sh"
    Write-Info ""
    Write-Info "4. 🔍 Vérification:"
    Write-Info "   ./scripts/status.sh"
    Write-Info "   # Puis tester: https://$Domain"
}

function Test-RemoteServices {
    Write-Step "🔍 Test des services remotess"
    Write-Info "📊 Vérification de l'état des services..."
    
    ssh -p $OVH_PORT "${OVH_USER}@${OVH_HOST}" @"
echo '=== STATUS SERVICES ==='
echo ''
echo '🔄 PM2:'
pm2 status 2>/dev/null || echo 'PM2 non configuré'
echo ''
echo '🐘 PostgreSQL:'
sudo systemctl is-active postgresql 2>/dev/null || echo 'PostgreSQL non configuré'
echo ''
echo '🔴 Redis:'
sudo systemctl is-active redis-server 2>/dev/null || echo 'Redis non configuré'
echo ''
echo '🌐 Nginx:'
sudo systemctl is-active nginx 2>/dev/null || echo 'Nginx non configuré'
echo ''
echo '🛡️ Firewall:'
sudo ufw status 2>/dev/null || echo 'UFW non configuré'
echo ''
echo '💾 Espace disque:'
df -h / 2>/dev/null || echo 'Erreur df'
echo ''
echo '🧠 Mémoire:'
free -h 2>/dev/null || echo 'Erreur free'
"@
}

function Show-Help {
    Write-Info "🚀 Script de Configuration TalkKin OVH"
    Write-Info ""
    Write-Info "Usage: .\ovh-connect.ps1 [Action] [Options]"
    Write-Info ""
    Write-Info "Actions disponibles:"
    Write-Info "  connect      - Connexion SSH interactive"
    Write-Info "  upload       - Upload du script de configuration"
    Write-Info "  setup        - Lancement configuration automatique"
    Write-Info "  test         - Test connectivité et services"
    Write-Info "  info         - Affichage informations connexion"
    Write-Info "  post         - Affichage étapes post-installation"
    Write-Info "  full         - Processus complet (upload + setup)"
    Write-Info "  help         - Cette aide"
    Write-Info ""
    Write-Info "Exemples:"
    Write-Info "  .\ovh-connect.ps1 connect"
    Write-Info "  .\ovh-connect.ps1 upload"
    Write-Info "  .\ovh-connect.ps1 full"
    Write-Info "  .\ovh-connect.ps1 test"
}

# ===================================================================
# MAIN SCRIPT LOGIC
# ===================================================================

Clear-Host
Write-Host "=================================================================="
Write-Host "🚀 TALKKIN OVH - SCRIPT DE CONNEXION ET CONFIGURATION"
Write-Host "=================================================================="
Write-Host ""

# Vérifications préliminaires
if (-not (Test-OpenSSH)) {
    exit 1
}

if (-not (Test-SSHConnection)) {
    Write-Warn "⚠️ Problème de connectivité - vérifiez votre connexion internet"
    exit 1
}

# Exécution selon l'action demandée
switch ($Action.ToLower()) {
    "connect" {
        Show-OVHInfo
        Write-Host ""
        Connect-OVH
    }
    
    "upload" {
        if (Send-SetupScript) {
            Write-Info "✅ Script uploadé avec succès"
            Write-Info "💡 Prochaine étape: .\ovh-connect.ps1 setup"
        }
    }
    
    "setup" {
        Start-RemoteSetup
    }
    
    "test" {
        Test-RemoteServices
    }
    
    "info" {
        Show-OVHInfo
    }
    
    "post" {
        Show-PostInstallSteps
    }
    
    "full" {
        Write-Step "🎯 Configuration complète TalkKin OVH"
        
        if (Send-SetupScript) {
            Write-Host ""
            Start-RemoteSetup
            Write-Host ""
            Show-PostInstallSteps
        }
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-Error "❌ Action inconnue: $Action"
        Show-Help
        exit 1
    }
}

Write-Host ""
Write-Info "🎯 Script terminé. Utilisez 'help' pour voir toutes les options."

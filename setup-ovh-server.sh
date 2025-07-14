#!/bin/bash

# 🚀 SCRIPT CONFIGURATION SERVEUR OVH TALKKIN - SÉCURISÉ 2FA
# Configuration pour talkkij.cluster100.hosting.ovh.net

echo "🔐 Configuration Serveur OVH TalkKin avec Sécurité 2FA"
echo "================================================="

# Variables de configuration
SERVER_HOST="ssh.cluster100.hosting.ovh.net"
SSH_USER="talkkij"
SSH_PORT="22"
DOMAIN="talkkin.shop"
PROJECT_NAME="talkkin"

echo "📋 Informations de connexion:"
echo "Serveur: $SERVER_HOST"
echo "Utilisateur: $SSH_USER"
echo "Port: $SSH_PORT"
echo "Domaine: $DOMAIN"
echo ""

# Étape 1: Connexion SSH avec 2FA
echo "🔑 ÉTAPE 1: Connexion SSH (2FA requis)"
echo "========================================"
echo "IMPORTANT: Votre téléphone/app d'authentification doit être prêt"
echo "Commande de connexion:"
echo "ssh $SSH_USER@$SERVER_HOST -p $SSH_PORT"
echo ""
echo "Après connexion, exécutez les commandes suivantes:"
echo ""

# Étape 2: Mise à jour système
echo "📦 ÉTAPE 2: Mise à jour système"
echo "=============================="
cat << 'EOF'
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
EOF
echo ""

# Étape 3: Installation Node.js 18.x
echo "🟢 ÉTAPE 3: Installation Node.js"
echo "==============================="
cat << 'EOF'
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
EOF
echo ""

# Étape 4: Installation PostgreSQL
echo "🐘 ÉTAPE 4: Installation PostgreSQL"
echo "=================================="
cat << 'EOF'
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configuration base PostgreSQL
sudo -u postgres createuser --interactive
# Répondre: talkkij, y, y, y
sudo -u postgres createdb talkkin_db
EOF
echo ""

# Étape 5: Installation Redis
echo "🔴 ÉTAPE 5: Installation Redis"
echo "============================="
cat << 'EOF'
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
redis-cli ping
EOF
echo ""

# Étape 6: Configuration Nginx
echo "🌐 ÉTAPE 6: Configuration Nginx"
echo "=============================="
cat << 'EOF'
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configuration SSL Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d talkkin.shop
EOF
echo ""

# Étape 7: Installation PM2
echo "⚡ ÉTAPE 7: Installation PM2"
echo "=========================="
cat << 'EOF'
sudo npm install -g pm2
pm2 startup
# Suivre les instructions affichées
EOF
echo ""

# Étape 8: Sécurisation serveur
echo "🛡️ ÉTAPE 8: Sécurisation"
echo "======================="
cat << 'EOF'
sudo apt install -y ufw fail2ban

# Configuration firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Configuration fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
EOF
echo ""

# Étape 9: Clonage projet
echo "📁 ÉTAPE 9: Préparation projet"
echo "============================="
cat << 'EOF'
cd /home/talkkij
mkdir -p projects
cd projects
git clone https://github.com/votre-username/talkkin.git
cd talkkin

# Si pas encore de repo, créer la structure
mkdir -p {api,frontend,scripts,data,docs}
EOF
echo ""

# Étape 10: Configuration environnement
echo "🔧 ÉTAPE 10: Variables d'environnement"
echo "====================================="
cat << 'EOF'
# Créer fichier .env
cat > .env << EOL
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://talkkij:your_password@localhost:5432/talkkin_db
REDIS_URL=redis://localhost:6379
DOMAIN=talkkin.shop
API_KEY_OPENAI=your_openai_key
API_KEY_GOOGLE=your_google_key
JWT_SECRET=your_jwt_secret_here
EOL

chmod 600 .env
EOF
echo ""

echo "✅ CONFIGURATION TERMINÉE!"
echo "========================="
echo ""
echo "🔐 GESTION 2FA OVH:"
echo "- Gardez votre téléphone à portée"
echo "- App recommandée: Google Authenticator ou Authy"
echo "- Codes de secours: Notez-les en lieu sûr"
echo ""
echo "🚀 PROCHAINES ÉTAPES:"
echo "1. Connectez-vous en SSH avec 2FA"
echo "2. Exécutez chaque section du script"
echo "3. Testez chaque service après installation"
echo "4. Configurez votre projet TalkKin"
echo ""
echo "📞 SUPPORT:"
echo "- Documentation OVH: https://docs.ovh.com/"
echo "- Support 2FA: https://docs.ovh.com/fr/customer/securiser-son-compte-avec-une-2fa/"

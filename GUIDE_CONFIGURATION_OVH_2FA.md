# 🔐 GUIDE CONFIGURATION OVH AVEC DOUBLE AUTHENTIFICATION

## 🎯 GESTION 2FA OVH - ÉTAPES DÉTAILLÉES

### **1. Préparation Avant Connexion**
```yaml
Applications 2FA Recommandées:
  ✅ Google Authenticator (iOS/Android)
  ✅ Authy (iOS/Android/Desktop)
  ✅ Microsoft Authenticator
  ✅ 1Password (si abonnement)

Codes de Secours:
  ⚠️ CRITIQUE: Notez vos codes de backup OVH
  ⚠️ Stockage sécurisé (coffre-fort digital)
  ⚠️ Ne jamais perdre ces codes !
```

### **2. Connexion SSH avec 2FA**
```bash
# Commande de base
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22

# Processus 2FA:
# 1. Saisir mot de passe SSH
# 2. Attendre prompt code 2FA
# 3. Ouvrir app authentification
# 4. Saisir code à 6 chiffres
# 5. Valider rapidement (30s timeout)
```

### **3. Première Connexion Sécurisée**
```bash
# Une fois connecté, vérifier l'environnement
pwd
# /home/talkkij

ls -la
# Vérifier les permissions

whoami
# talkkij

# Tester les privilèges sudo
sudo whoami
# root (si configuré)
```

---

## 🛠️ CONFIGURATION STEP-BY-STEP

### **Étape 1: Système de Base**
```bash
# Mise à jour complète
sudo apt update && sudo apt upgrade -y

# Outils essentiels
sudo apt install -y \
  curl wget git unzip \
  software-properties-common \
  build-essential \
  htop nano vim

# Vérification
echo "✅ Système mis à jour"
```

### **Étape 2: Node.js 18.x LTS**
```bash
# Repository NodeSource officiel
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Installation
sudo apt-get install -y nodejs

# Vérification versions
node --version
# v18.x.x
npm --version
# 9.x.x

echo "✅ Node.js installé"
```

### **Étape 3: PostgreSQL**
```bash
# Installation PostgreSQL 14+
sudo apt install -y postgresql postgresql-contrib

# Démarrage services
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configuration utilisateur
sudo -u postgres psql

# Dans psql:
CREATE USER talkkij WITH PASSWORD 'motdepasse_securise';
CREATE DATABASE talkkin_db OWNER talkkij;
GRANT ALL PRIVILEGES ON DATABASE talkkin_db TO talkkij;
\q

echo "✅ PostgreSQL configuré"
```

### **Étape 4: Redis Cache**
```bash
# Installation Redis
sudo apt install -y redis-server

# Configuration sécurisée
sudo nano /etc/redis/redis.conf
# Modifier: bind 127.0.0.1
# Modifier: requirepass votre_mot_de_passe_redis

# Redémarrage
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test
redis-cli ping
# PONG

echo "✅ Redis installé"
```

### **Étape 5: Nginx + SSL**
```bash
# Installation Nginx
sudo apt install -y nginx

# Configuration firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# SSL Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Configuration SSL pour talkkin.shop
sudo certbot --nginx -d talkkin.shop

# Auto-renouvellement
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet

echo "✅ Nginx + SSL configuré"
```

### **Étape 6: PM2 Process Manager**
```bash
# Installation globale PM2
sudo npm install -g pm2

# Configuration auto-start
pm2 startup
# Suivre les instructions affichées

# Sauvegarde config
pm2 save

echo "✅ PM2 installé"
```

---

## 🔧 CONFIGURATION PROJET TALKKIN

### **Structure Projet**
```bash
# Création structure
cd /home/talkkij
mkdir -p projects/talkkin
cd projects/talkkin

# Structure recommandée
mkdir -p {
  api,
  frontend,
  shared,
  scripts,
  data/{training,collection},
  logs,
  backups,
  docs
}

echo "✅ Structure créée"
```

### **Variables d'Environnement**
```bash
# Fichier .env principal
cat > .env << EOF
# === CONFIGURATION PRODUCTION ===
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# === BASE DE DONNÉES ===
DATABASE_URL=postgresql://talkkij:MOTDEPASSE@localhost:5432/talkkin_db
REDIS_URL=redis://:MOTDEPASSE@localhost:6379

# === DOMAINE ===
DOMAIN=talkkin.shop
API_BASE_URL=https://talkkin.shop/api

# === SÉCURITÉ ===
JWT_SECRET=$(openssl rand -base64 32)
API_RATE_LIMIT=1000
CORS_ORIGIN=https://talkkin.shop

# === APIs IA ===
OPENAI_API_KEY=your_openai_key_here
GOOGLE_CLOUD_KEY=your_google_key_here
ASSEMBLY_AI_KEY=your_assembly_key_here

# === MONITORING ===
LOG_LEVEL=info
MONITORING_ENABLED=true

# === COLLECTE DONNÉES ===
MAX_UPLOAD_SIZE=50MB
AUDIO_FORMATS=wav,mp3,ogg
TEXT_MAX_LENGTH=10000
EOF

# Sécurisation
chmod 600 .env
chown talkkij:talkkij .env

echo "✅ Variables d'environnement configurées"
```

---

## 🚀 DÉPLOIEMENT API BACKEND

### **Configuration Nginx**
```bash
# Configuration site TalkKin
sudo nano /etc/nginx/sites-available/talkkin.shop

# Contenu configuration:
server {
    listen 80;
    server_name talkkin.shop www.talkkin.shop;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name talkkin.shop www.talkkin.shop;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/talkkin.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/talkkin.shop/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Static Files
    location / {
        root /home/talkkij/projects/talkkin/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
    
    # Upload Endpoint
    location /api/upload {
        proxy_pass http://localhost:3000/upload;
        client_max_body_size 50M;
        proxy_request_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
    
    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/talkkin.shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx configuré pour talkkin.shop"
```

---

## 📦 SCRIPT DE DÉPLOIEMENT AUTOMATISÉ

### **Script de Configuration Complète**
```bash
#!/bin/bash
# === SCRIPT CONFIGURATION TALKKIN OVH ===

# Couleurs pour logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification privilèges
if [[ $EUID -ne 0 ]]; then
   log_error "Ce script doit être exécuté en tant que root"
   exit 1
fi

log_info "🚀 Démarrage configuration TalkKin sur OVH..."

# 1. Mise à jour système
log_info "📦 Mise à jour du système..."
apt update && apt upgrade -y

# 2. Installation dépendances
log_info "🔧 Installation des dépendances..."
apt install -y curl wget git unzip software-properties-common build-essential htop nano vim ufw fail2ban

# 3. Node.js 18.x
log_info "📜 Installation Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 4. PostgreSQL
log_info "🐘 Configuration PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# 5. Redis
log_info "🔴 Installation Redis..."
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server

# 6. Nginx
log_info "🌐 Configuration Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 7. SSL Certbot
log_info "🔒 Installation Certbot..."
apt install -y certbot python3-certbot-nginx

# 8. PM2 Global
log_info "⚡ Installation PM2..."
npm install -g pm2

# 9. Firewall
log_info "🛡️ Configuration Firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

# 10. Fail2Ban
log_info "🔐 Configuration Fail2Ban..."
systemctl start fail2ban
systemctl enable fail2ban

log_info "✅ Configuration de base terminée!"
log_warn "⚠️ Prochaines étapes manuelles:"
echo "1. Configurer PostgreSQL avec vos credentials"
echo "2. Obtenir certificat SSL: sudo certbot --nginx -d talkkin.shop"
echo "3. Configurer les variables d'environnement"
echo "4. Déployer l'application TalkKin"
```

### **Script de Déploiement Application**
```bash
#!/bin/bash
# === DÉPLOIEMENT TALKKIN ===

PROJECT_DIR="/home/talkkij/projects/talkkin"
GIT_REPO="https://github.com/votre-repo/talkkin.git"

log_info() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

# Création structure projet
log_info "📁 Création structure projet..."
mkdir -p $PROJECT_DIR/{api,frontend,shared,scripts,data,logs,backups}
cd $PROJECT_DIR

# Configuration Git (si repository)
if [ ! -d ".git" ]; then
    log_info "📥 Clonage repository..."
    git clone $GIT_REPO .
else
    log_info "🔄 Mise à jour repository..."
    git pull origin main
fi

# Installation dépendances API
log_info "📦 Installation dépendances API..."
cd $PROJECT_DIR/api
npm install --production

# Build Frontend
log_info "🏗️ Build Frontend..."
cd $PROJECT_DIR/frontend
npm install
npm run build

# Configuration PM2
log_info "⚡ Configuration PM2..."
cd $PROJECT_DIR
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'talkkin-api',
    script: './api/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/api-err.log',
    out_file: './logs/api-out.log',
    log_file: './logs/api-combined.log',
    time: true
  }]
};
EOF

# Démarrage avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

log_info "✅ Déploiement terminé!"
log_info "🌐 Application disponible sur: https://talkkin.shop"
```

---

## 🔑 GESTION SÉCURISÉE DES CLÉS API

### **Configuration Sécurisée des Secrets**
```bash
# Création fichier secrets sécurisé
cd /home/talkkij/projects/talkkin
touch .env.production

# Configuration permissions strictes
chmod 600 .env.production
chown talkkij:talkkij .env.production

# Contenu type .env.production:
cat > .env.production << 'EOF'
# === PRODUCTION TALKKIN ===
NODE_ENV=production
PORT=3000
DOMAIN=talkkin.shop

# === DATABASE ===
DATABASE_URL=postgresql://talkkij:CHANGEME@localhost:5432/talkkin_db
REDIS_URL=redis://:CHANGEME@localhost:6379

# === SECURITY ===
JWT_SECRET=CHANGEME_LONG_SECRET_HERE
API_RATE_LIMIT=1000
CORS_ORIGIN=https://talkkin.shop

# === AI APIS ===
OPENAI_API_KEY=sk-CHANGEME
GOOGLE_CLOUD_KEY=CHANGEME
ASSEMBLY_AI_KEY=CHANGEME

# === MONITORING ===
LOG_LEVEL=info
SENTRY_DSN=https://CHANGEME@sentry.io/CHANGEME
EOF

echo "⚠️ IMPORTANT: Modifier les valeurs CHANGEME dans .env.production"
```

### **Script de Backup Automatisé**
```bash
#!/bin/bash
# === BACKUP AUTOMATISÉ TALKKIN ===

BACKUP_DIR="/home/talkkij/backups"
PROJECT_DIR="/home/talkkij/projects/talkkin"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="talkkin_backup_$DATE"

mkdir -p $BACKUP_DIR

log_info() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1"
}

# 1. Backup Base de Données
log_info "🗄️ Backup PostgreSQL..."
sudo -u postgres pg_dump talkkin_db > $BACKUP_DIR/${BACKUP_NAME}_db.sql

# 2. Backup Fichiers Projet
log_info "📁 Backup Fichiers..."
tar -czf $BACKUP_DIR/${BACKUP_NAME}_files.tar.gz -C $PROJECT_DIR .

# 3. Backup Configuration
log_info "⚙️ Backup Configuration..."
cp /etc/nginx/sites-available/talkkin.shop $BACKUP_DIR/${BACKUP_NAME}_nginx.conf
cp $PROJECT_DIR/.env.production $BACKUP_DIR/${BACKUP_NAME}_env

# 4. Nettoyage anciens backups (garde 30 jours)
log_info "🧹 Nettoyage anciens backups..."
find $BACKUP_DIR -name "talkkin_backup_*" -mtime +30 -delete

# 5. Upload cloud (optionnel)
# rclone copy $BACKUP_DIR remote:backups/talkkin/

log_info "✅ Backup terminé: $BACKUP_NAME"

# Cron job recommandé:
# 0 2 * * * /home/talkkij/scripts/backup.sh >> /home/talkkij/logs/backup.log 2>&1
```

---

## 🚀 DÉMARRAGE RAPIDE - CHECKLIST

### **Phase 1: Connexion Sécurisée (15 min)**
```yaml
☐ 1. Préparer app 2FA (Google Authenticator)
☐ 2. Récupérer codes de secours OVH
☐ 3. Tester connexion SSH avec 2FA
☐ 4. Vérifier accès sudo
☐ 5. Changer mot de passe par défaut
```

### **Phase 2: Configuration Système (30 min)**
```yaml
☐ 1. Exécuter script configuration système
☐ 2. Installer Node.js 18.x
☐ 3. Configurer PostgreSQL + Redis
☐ 4. Installer Nginx + SSL
☐ 5. Configurer Firewall + Fail2Ban
```

### **Phase 3: Déploiement TalkKin (45 min)**
```yaml
☐ 1. Créer structure projet
☐ 2. Configurer variables d'environnement
☐ 3. Installer dépendances
☐ 4. Configurer Nginx pour talkkin.shop
☐ 5. Démarrer avec PM2
☐ 6. Tester l'application
```

### **Phase 4: Sécurisation (20 min)**
```yaml
☐ 1. Configurer SSL Let's Encrypt
☐ 2. Sécuriser .env.production
☐ 3. Configurer backups automatiques
☐ 4. Installer monitoring
☐ 5. Tester restauration backup
```

---

## 🆘 DÉPANNAGE COURANT

### **Problèmes 2FA**
```yaml
Code 2FA refusé:
  ✅ Vérifier synchronisation horloge
  ✅ Utiliser code de secours si nécessaire
  ✅ Réinitialiser 2FA depuis panel OVH
  ✅ Contacter support OVH si bloqué

Timeout connexion:
  ✅ Saisir code rapidement (<30s)
  ✅ Utiliser connexion réseau stable
  ✅ Éviter VPN si problèmes
```

### **Problèmes Permissions**
```yaml
Accès sudo refusé:
  ✅ Vérifier user dans groupe sudo
  ✅ Contacter support OVH
  ✅ Utiliser compte root temporaire

Erreurs fichiers:
  ✅ Vérifier propriétaire: chown talkkij:talkkij
  ✅ Vérifier permissions: chmod 755
  ✅ Vérifier chemins absolus
```

### **Problèmes SSL/Nginx**
```yaml
Certificat SSL échec:
  ✅ Vérifier DNS talkkin.shop pointe vers IP
  ✅ Arrêter Apache si présent: sudo service apache2 stop
  ✅ Vérifier port 80/443 libres: sudo netstat -tlnp

Erreur 502 Bad Gateway:
  ✅ Vérifier API démarre: pm2 status
  ✅ Vérifier logs: pm2 logs
  ✅ Vérifier configuration Nginx
```

---

## 📞 SUPPORT ET RESSOURCES

### **Contacts Utiles**
```yaml
Support OVH:
  📞 1007 (depuis ligne fixe France)
  📞 +33 972 101 007 (international)
  💬 Chat: manager.ovh.com
  📧 Support ticket manager

Documentation:
  🌐 docs.ovh.com
  🌐 help.ovh.com
  🐙 github.com/ovh
```

### **Monitoring Recommandé**
```yaml
Uptime Robot (gratuit):
  ✅ Monitoring 24/7 talkkin.shop
  ✅ Alertes email/SMS
  ✅ Dashboard public

Logs Centralisés:
  ✅ PM2 logs: pm2 logs --lines 1000
  ✅ Nginx logs: tail -f /var/log/nginx/access.log
  ✅ System logs: journalctl -f
```

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

### **Aujourd'hui (2-3h)**
1. ✅ Configurer 2FA et tester connexion SSH
2. ✅ Exécuter script configuration système
3. ✅ Obtenir certificat SSL pour talkkin.shop
4. ✅ Déployer version basique TalkKin

### **Cette Semaine**
1. 🔄 Optimiser performance Nginx/PostgreSQL
2. 🔄 Configurer monitoring complet
3. 🔄 Implémenter API de collecte données
4. 🔄 Tester charge avec simulations

### **Ce Mois**
1. 🚀 Lancer collecte communautaire Maya
2. 🚀 Intégrer APIs IA (OpenAI, Google)
3. 🚀 Développer interface contribution
4. 🚀 Établir premiers partenariats

**Prêt pour le décollage ! 🚀**

#!/bin/bash
# ===================================================================
# SCRIPT CONFIGURATION AUTOMATISÉE TALKKIN OVH
# Compatible avec double authentification OVH
# ===================================================================

# Couleurs pour logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] INFO${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARN${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR${NC} $1"
}

log_step() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')] STEP${NC} $1"
}

# Vérifications préliminaires
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "❌ Ne pas exécuter ce script en tant que root"
        log_info "💡 Utilisez: bash setup-talkkin.sh"
        exit 1
    fi
}

check_sudo() {
    if ! sudo -v; then
        log_error "❌ Accès sudo requis"
        exit 1
    fi
}

check_connection() {
    log_info "🌐 Vérification connexion internet..."
    if ! ping -c 1 google.com &> /dev/null; then
        log_error "❌ Pas de connexion internet"
        exit 1
    fi
    log_info "✅ Connexion OK"
}

# Fonction principale
main() {
    clear
    echo "=================================================================="
    echo "🚀 CONFIGURATION AUTOMATISÉE TALKKIN SUR OVH"
    echo "=================================================================="
    echo ""
    
    # Vérifications
    check_root
    check_sudo
    check_connection
    
    log_step "📋 Collecte des informations..."
    
    # Collecte informations utilisateur
    read -p "🔑 Mot de passe PostgreSQL pour utilisateur 'talkkij': " -s PG_PASSWORD
    echo ""
    read -p "🔴 Mot de passe Redis: " -s REDIS_PASSWORD
    echo ""
    read -p "🔐 Clé API OpenAI (optionnel): " OPENAI_KEY
    read -p "🌍 Domaine (défaut: talkkin.shop): " DOMAIN
    DOMAIN=${DOMAIN:-talkkin.shop}
    
    echo ""
    log_info "📊 Configuration:"
    log_info "   - Domaine: $DOMAIN"
    log_info "   - Utilisateur: $(whoami)"
    log_info "   - Répertoire: $(pwd)"
    echo ""
    
    read -p "🚀 Continuer avec cette configuration? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warn "❌ Configuration annulée"
        exit 1
    fi
    
    # ============ PHASE 1: SYSTÈME ============
    log_step "🔧 PHASE 1: Configuration système de base"
    
    log_info "📦 Mise à jour du système..."
    sudo apt update && sudo apt upgrade -y
    
    log_info "🛠️ Installation des outils essentiels..."
    sudo apt install -y \
        curl wget git unzip \
        software-properties-common \
        build-essential \
        htop nano vim \
        ufw fail2ban \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    # ============ PHASE 2: NODE.JS ============
    log_step "📜 PHASE 2: Installation Node.js 18.x LTS"
    
    log_info "📥 Ajout repository NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    
    log_info "📦 Installation Node.js..."
    sudo apt-get install -y nodejs
    
    log_info "📊 Versions installées:"
    node --version
    npm --version
    
    # ============ PHASE 3: POSTGRESQL ============
    log_step "🐘 PHASE 3: Configuration PostgreSQL"
    
    log_info "📦 Installation PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    
    log_info "🚀 Démarrage services..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    log_info "👤 Configuration utilisateur et base de données..."
    sudo -u postgres psql -c "CREATE USER talkkij WITH PASSWORD '$PG_PASSWORD';" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE talkkin_db OWNER talkkij;" 2>/dev/null || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE talkkin_db TO talkkij;" 2>/dev/null || true
    
    # ============ PHASE 4: REDIS ============
    log_step "🔴 PHASE 4: Configuration Redis"
    
    log_info "📦 Installation Redis..."
    sudo apt install -y redis-server
    
    log_info "⚙️ Configuration sécurisée..."
    sudo cp /etc/redis/redis.conf /etc/redis/redis.conf.backup
    
    # Configuration Redis
    sudo tee /etc/redis/redis.conf > /dev/null <<EOF
# Configuration Redis TalkKin
bind 127.0.0.1
port 6379
requirepass $REDIS_PASSWORD
timeout 300
tcp-keepalive 300
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log
databases 16
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
    
    sudo systemctl restart redis-server
    sudo systemctl enable redis-server
    
    # ============ PHASE 5: NGINX ============
    log_step "🌐 PHASE 5: Configuration Nginx"
    
    log_info "📦 Installation Nginx..."
    sudo apt install -y nginx
    
    log_info "🚀 Démarrage Nginx..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # ============ PHASE 6: SSL/CERTBOT ============
    log_step "🔒 PHASE 6: Configuration SSL"
    
    log_info "📦 Installation Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    # ============ PHASE 7: PM2 ============
    log_step "⚡ PHASE 7: Installation PM2"
    
    log_info "📦 Installation PM2 globalement..."
    sudo npm install -g pm2
    
    log_info "🔄 Configuration auto-start PM2..."
    pm2 startup | tail -1 | sudo bash
    
    # ============ PHASE 8: FIREWALL ============
    log_step "🛡️ PHASE 8: Configuration Firewall"
    
    log_info "🔥 Configuration UFW..."
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 5432  # PostgreSQL (local seulement)
    sudo ufw allow 6379  # Redis (local seulement)
    
    log_info "🔐 Configuration Fail2Ban..."
    sudo systemctl start fail2ban
    sudo systemctl enable fail2ban
    
    # ============ PHASE 9: STRUCTURE PROJET ============
    log_step "📁 PHASE 9: Structure projet TalkKin"
    
    PROJECT_DIR="/home/$(whoami)/projects/talkkin"
    log_info "📂 Création structure dans $PROJECT_DIR..."
    
    mkdir -p $PROJECT_DIR/{api,frontend,shared,scripts,data/{training,collection},logs,backups,docs}
    
    # ============ PHASE 10: VARIABLES ENVIRONNEMENT ============
    log_step "⚙️ PHASE 10: Configuration environnement"
    
    log_info "📝 Création fichier .env.production..."
    cat > $PROJECT_DIR/.env.production <<EOF
# === CONFIGURATION PRODUCTION TALKKIN ===
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# === DOMAINE ===
DOMAIN=$DOMAIN
API_BASE_URL=https://$DOMAIN/api
FRONTEND_URL=https://$DOMAIN

# === BASE DE DONNÉES ===
DATABASE_URL=postgresql://talkkij:$PG_PASSWORD@localhost:5432/talkkin_db
REDIS_URL=redis://:$REDIS_PASSWORD@localhost:6379

# === SÉCURITÉ ===
JWT_SECRET=$(openssl rand -base64 32)
API_RATE_LIMIT=1000
CORS_ORIGIN=https://$DOMAIN

# === APIs IA ===
OPENAI_API_KEY=$OPENAI_KEY
GOOGLE_CLOUD_KEY=
ASSEMBLY_AI_KEY=

# === MONITORING ===
LOG_LEVEL=info
MONITORING_ENABLED=true

# === COLLECTE DONNÉES ===
MAX_UPLOAD_SIZE=50MB
AUDIO_FORMATS=wav,mp3,ogg,m4a
TEXT_MAX_LENGTH=10000

# === CACHE ===
CACHE_TTL=3600
CACHE_PREFIX=talkkin:

# === EMAIL (optionnel) ===
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EOF

    # Sécurisation
    chmod 600 $PROJECT_DIR/.env.production
    chown $(whoami):$(whoami) $PROJECT_DIR/.env.production
    
    # ============ PHASE 11: NGINX SITE CONFIG ============
    log_step "🌐 PHASE 11: Configuration site Nginx"
    
    sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
# Configuration Nginx pour TalkKin
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (sera configuré par Certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Root directory
    root $PROJECT_DIR/frontend/dist;
    index index.html;
    
    # Static Files
    location / {
        try_files \$uri \$uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }
    
    # Upload Endpoint (gros fichiers)
    location /api/upload {
        proxy_pass http://localhost:3000/upload;
        client_max_body_size 50M;
        proxy_request_buffering off;
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
    }
    
    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Assets statiques avec cache long
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }
    
    # Sécurité - bloquer accès fichiers sensibles
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|conf|config)$ {
        deny all;
    }
}
EOF
    
    # Activer le site
    sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # ============ PHASE 12: SCRIPTS UTILITAIRES ============
    log_step "📜 PHASE 12: Scripts utilitaires"
    
    # Script de déploiement
    cat > $PROJECT_DIR/scripts/deploy.sh <<'EOFSCRIPT'
#!/bin/bash
# Script de déploiement TalkKin

PROJECT_DIR="/home/$(whoami)/projects/talkkin"
cd $PROJECT_DIR

echo "🚀 Déploiement TalkKin..."

# Pull dernières modifications
if [ -d ".git" ]; then
    echo "📥 Mise à jour code..."
    git pull origin main
fi

# Installation/mise à jour dépendances API
if [ -d "api" ]; then
    echo "📦 Installation dépendances API..."
    cd api && npm install --production && cd ..
fi

# Build frontend
if [ -d "frontend" ]; then
    echo "🏗️ Build frontend..."
    cd frontend && npm install && npm run build && cd ..
fi

# Redémarrage services
echo "🔄 Redémarrage services..."
pm2 restart all

echo "✅ Déploiement terminé!"
echo "🌐 Application: https://$(grep DOMAIN .env.production | cut -d'=' -f2)"
EOFSCRIPT
    
    # Script de backup
    cat > $PROJECT_DIR/scripts/backup.sh <<'EOFSCRIPT'
#!/bin/bash
# Script de backup automatisé TalkKin

BACKUP_DIR="/home/$(whoami)/backups"
PROJECT_DIR="/home/$(whoami)/projects/talkkin"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="talkkin_backup_$DATE"

mkdir -p $BACKUP_DIR

echo "🗄️ Backup base de données..."
pg_dump talkkin_db > $BACKUP_DIR/${BACKUP_NAME}_db.sql

echo "📁 Backup fichiers projet..."
tar -czf $BACKUP_DIR/${BACKUP_NAME}_files.tar.gz -C $PROJECT_DIR .

echo "⚙️ Backup configuration..."
sudo cp /etc/nginx/sites-available/talkkin.shop $BACKUP_DIR/${BACKUP_NAME}_nginx.conf 2>/dev/null || true

echo "🧹 Nettoyage anciens backups (>30 jours)..."
find $BACKUP_DIR -name "talkkin_backup_*" -mtime +30 -delete

echo "✅ Backup terminé: $BACKUP_NAME"
EOFSCRIPT
    
    # Script de monitoring
    cat > $PROJECT_DIR/scripts/status.sh <<'EOFSCRIPT'
#!/bin/bash
# Script de monitoring TalkKin

echo "=== STATUS TALKKIN ==="
echo ""

echo "🔄 Services PM2:"
pm2 status

echo ""
echo "🐘 PostgreSQL:"
sudo systemctl is-active postgresql

echo ""
echo "🔴 Redis:"
sudo systemctl is-active redis-server

echo ""
echo "🌐 Nginx:"
sudo systemctl is-active nginx

echo ""
echo "🛡️ Firewall:"
sudo ufw status

echo ""
echo "💾 Espace disque:"
df -h /

echo ""
echo "🧠 Mémoire:"
free -h

echo ""
echo "⚡ Charge système:"
uptime
EOFSCRIPT
    
    # Rendre les scripts exécutables
    chmod +x $PROJECT_DIR/scripts/*.sh
    
    # ============ FINALISATION ============
    log_step "🎯 FINALISATION"
    
    log_info "📊 Création du rapport de configuration..."
    cat > $PROJECT_DIR/INSTALLATION_REPORT.md <<EOF
# 📊 RAPPORT D'INSTALLATION TALKKIN

## ✅ Configuration Terminée le $(date)

### 🔧 Services Installés
- ✅ Node.js $(node --version)
- ✅ npm $(npm --version)
- ✅ PostgreSQL (utilisateur: talkkij, db: talkkin_db)
- ✅ Redis (avec mot de passe)
- ✅ Nginx (site: $DOMAIN)
- ✅ PM2 (process manager)
- ✅ Certbot (SSL)
- ✅ UFW Firewall
- ✅ Fail2Ban

### 📂 Structure Projet
\`\`\`
$PROJECT_DIR/
├── api/              # Backend Node.js
├── frontend/         # Frontend React
├── shared/           # Code partagé
├── scripts/          # Scripts utilitaires
├── data/             # Données et corpus
├── logs/             # Logs application
├── backups/          # Sauvegardes
└── .env.production   # Variables d'environnement
\`\`\`

### 🔧 Scripts Disponibles
- \`./scripts/deploy.sh\` - Déploiement automatisé
- \`./scripts/backup.sh\` - Backup complet
- \`./scripts/status.sh\` - Monitoring services

### 🌐 URLs
- **Production**: https://$DOMAIN
- **API**: https://$DOMAIN/api

### 🔑 Étapes Suivantes Manuelles
1. **SSL Certificate**: \`sudo certbot --nginx -d $DOMAIN\`
2. **Variables .env**: Compléter les clés API dans .env.production
3. **Code Source**: Cloner ou copier votre code TalkKin
4. **Premier Déploiement**: \`cd $PROJECT_DIR && ./scripts/deploy.sh\`

### 🆘 Support
- Logs: \`pm2 logs\`
- Status: \`./scripts/status.sh\`
- Nginx: \`sudo nginx -t && sudo systemctl reload nginx\`
- Firewall: \`sudo ufw status\`

**Configuration par**: $(whoami)@$(hostname) le $(date)
EOF
    
    # ============ PHASE 11: CONFIGURATION SSL LET'S ENCRYPT ============
    log_step "🔒 PHASE 11: Configuration SSL Let's Encrypt"
    
    log_info "📦 Installation Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    log_info "🌐 Vérification DNS pour $DOMAIN..."
    if nslookup $DOMAIN | grep -q "Address:"; then
        log_info "✅ DNS configuré pour $DOMAIN"
        
        log_info "🔐 Génération certificat SSL Let's Encrypt..."
        # Arrêt temporaire de Nginx pour certbot standalone
        sudo systemctl stop nginx
        
        # Génération du certificat
        sudo certbot certonly --standalone --non-interactive --agree-tos \
            --email admin@$DOMAIN -d $DOMAIN
        
        if [ $? -eq 0 ]; then
            log_info "✅ Certificat SSL généré avec succès"
            
            # Configuration Nginx avec SSL
            log_info "🔧 Configuration Nginx avec HTTPS..."
            sudo tee /etc/nginx/sites-available/talkkin-ssl <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
            
            # Activation du site SSL
            sudo ln -sf /etc/nginx/sites-available/talkkin-ssl /etc/nginx/sites-enabled/
            sudo rm -f /etc/nginx/sites-enabled/default
            
            # Test et redémarrage Nginx
            sudo nginx -t && sudo systemctl start nginx
            
            # Configuration renouvellement automatique
            log_info "⏰ Configuration renouvellement automatique..."
            sudo crontab -l | grep -v certbot | sudo crontab -
            echo "0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx" | sudo crontab -
            
            log_info "✅ SSL Let's Encrypt configuré avec succès"
        else
            log_error "❌ Échec génération certificat SSL"
            log_warn "⚠️ Vous devrez configurer SSL manuellement"
            sudo systemctl start nginx
        fi
    else
        log_warn "⚠️ DNS non configuré pour $DOMAIN"
        log_warn "   Configurez d'abord le DNS puis lancez:"
        log_warn "   sudo certbot --nginx -d $DOMAIN"
        sudo systemctl start nginx
    fi
    
    # ============ RÉCAPITULATIF ============
    clear
    echo "=================================================================="
    echo "🎉 CONFIGURATION TALKKIN TERMINÉE AVEC SUCCÈS!"
    echo "=================================================================="
    echo ""
    log_info "📍 Projet installé dans: $PROJECT_DIR"
    log_info "🌐 Domaine configuré: $DOMAIN"
    log_info "📊 Rapport détaillé: $PROJECT_DIR/INSTALLATION_REPORT.md"
    echo ""
    echo "🔑 ÉTAPES SUIVANTES IMPORTANTES:"
    echo ""
    echo "1. 🔒 Configurer SSL:"
    echo "   sudo certbot --nginx -d $DOMAIN"
    echo ""
    echo "2. 🗝️ Compléter les clés API dans:"
    echo "   nano $PROJECT_DIR/.env.production"
    echo ""
    echo "3. 📥 Déployer votre code TalkKin:"
    echo "   cd $PROJECT_DIR"
    echo "   # Copier ou cloner votre code"
    echo "   ./scripts/deploy.sh"
    echo ""
    echo "4. 🔍 Vérifier le status:"
    echo "   ./scripts/status.sh"
    echo ""
    log_warn "⚠️ N'oubliez pas de:"
    log_warn "   - Sauvegarder vos mots de passe"
    log_warn "   - Configurer les clés API"
    log_warn "   - Tester la sauvegarde"
    echo ""
    log_info "🚀 Votre serveur TalkKin est prêt!"
    echo ""
}

# Exécution du script
main "$@"

# 📁 STRUCTURE DOSSIERS OVH TALKKIN

## 🎯 ARBORESCENCE COMPLÈTE OVH

### **📂 DOSSIER RACINE UTILISATEUR**
```
/home/talkkij/                    ← Dossier HOME de l'utilisateur
├── www/                          ← DOSSIER WEB PUBLIC (important!)
│   ├── index.html               ← Page d'accueil talkkin.shop
│   ├── static/                  ← Fichiers CSS, JS, images
│   └── api/                     ← API endpoints (si nécessaire)
├── projects/                    ← Nos projets Node.js
│   └── talkkin/                 ← Application TalkKin principale
│       ├── api/                 ← Backend Node.js
│       ├── frontend/            ← Frontend React
│       ├── scripts/             ← Scripts de gestion
│       ├── data/                ← Données IA
│       ├── logs/                ← Logs applicatifs
│       └── .env.production      ← Variables d'environnement
├── setup/                       ← Scripts de configuration
│   └── setup-talkkin.sh         ← Notre script d'installation
├── backups/                     ← Sauvegardes
└── logs/                        ← Logs système
```

---

## 🌐 DOMAINES ET DOSSIERS

### **Mapping des domaines OVH :**
```
talkkin.shop → /home/talkkij/www/
```

### **URLs finales :**
```
https://talkkin.shop/           → /home/talkkij/www/index.html
https://talkkin.shop/api/       → Proxy vers localhost:3000/api/
https://talkkin.shop/app/       → Application React build
```

---

## 🔧 CONFIGURATION NGINX (notre script configure ça)

### **Nginx configurera automatiquement :**
```nginx
server {
    listen 443 ssl http2;
    server_name talkkin.shop;
    
    root /home/talkkij/www;
    index index.html;
    
    # Fichiers statiques depuis www/
    location / {
        try_files $uri $uri/ @backend;
    }
    
    # API proxy vers Node.js
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        # ... headers proxy
    }
    
    # App React
    location /app/ {
        alias /home/talkkij/www/app/;
        try_files $uri $uri/ /app/index.html;
    }
    
    @backend {
        proxy_pass http://localhost:3000;
        # ... headers proxy
    }
}
```

---

## 📋 PLAN DE DÉPLOIEMENT

### **PHASE 1: Connexion et Setup**
```bash
# 1. Connexion SSH
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22

# 2. Vérification environnement
whoami                           # → talkkij
pwd                             # → /home/talkkij
ls -la                          # → Voir structure existante
```

### **PHASE 2: Upload Script**
```bash
# 3. Création dossier setup
mkdir -p /home/talkkij/setup
cd /home/talkkij/setup

# 4. Upload du script via nano/SFTP
nano setup-talkkin.sh
# Copier-coller notre script setup-talkkin-ovh.sh
```

### **PHASE 3: Exécution Automatique**
```bash
# 5. Permissions et exécution
chmod +x setup-talkkin.sh
./setup-talkkin.sh talkkin.shop

# Le script créera automatiquement TOUTE la structure !
```

---

## 🎯 CE QUE NOTRE SCRIPT FERA AUTOMATIQUEMENT

### **Structure créée par le script :**
```bash
# Le script setup-talkkin-ovh.sh créera :
/home/talkkij/projects/talkkin/          ← App principale
/home/talkkij/projects/talkkin/api/      ← Backend
/home/talkkij/projects/talkkin/frontend/ ← Frontend
/home/talkkij/projects/talkkin/scripts/  ← Scripts gestion
/home/talkkij/projects/talkkin/data/     ← Données IA
/home/talkkij/www/                       ← Dossier web public
/home/talkkij/www/index.html             ← Page d'accueil
```

### **Services configurés :**
- ✅ **Node.js 20** (dernière version LTS)
- ✅ **PostgreSQL** avec base `talkkin_db`
- ✅ **Redis** pour cache et sessions
- ✅ **Nginx** avec SSL Let's Encrypt
- ✅ **PM2** pour process management
- ✅ **Firewall UFW** configuré
- ✅ **Fail2Ban** pour sécurité

---

## 🔑 TEST RAPIDE MOT DE PASSE

### **Méthode 1: SFTP (plus tolérant)**
```powershell
# Test SFTP avant SSH
sftp talkkij@ssh.cluster100.hosting.ovh.net
# Si SFTP fonctionne, le mot de passe est bon
```

### **Méthode 2: SSH avec verbose**
```powershell
# SSH avec debug pour voir l'erreur exacte
ssh -v talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### **Méthode 3: Test depuis Manager OVH**
- Manager OVH → **Hébergements** → **Gestionnaire de fichiers**
- Test de connexion direct via interface web

---

## 📝 FICHIERS FINAUX DANS /www/

### **Page d'accueil minimale :**
```html
<!-- /home/talkkij/www/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>TalkKin - Translation Platform</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>🌍 TalkKin</h1>
    <p>Plateforme de traduction IA</p>
    <a href="/app/">Accéder à l'application</a>
</body>
</html>
```

### **API endpoint test :**
```html
<!-- /home/talkkij/www/api/test.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>API TalkKin</h1>
    <p>API accessible via proxy Nginx</p>
</body>
</html>
```

---

## 🚀 PROCHAINES ÉTAPES

### **1. Connexion SSH réussie**
```bash
# Dès que connexion SSH fonctionne :
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### **2. Upload et exécution script**
```bash
# Setup automatique complet :
mkdir -p /home/talkkij/setup
cd /home/talkkij/setup
nano setup-talkkin.sh
# (coller le script)
chmod +x setup-talkkin.sh
./setup-talkkin.sh talkkin.shop
```

### **3. Résultat final**
```
✅ https://talkkin.shop/ → Fonctionne
✅ Infrastructure complète → Opérationnelle
✅ Base de données → Configurée
✅ SSL → Actif
✅ Prêt pour déploiement code TalkKin
```

**🎯 L'objectif : Une fois SSH connecté, 30 minutes pour avoir tout configuré automatiquement !**

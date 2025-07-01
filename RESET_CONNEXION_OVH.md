# 🔄 RESET COMPLET - CONNEXION OVH SIMPLIFIÉE

## 🎯 NOUVELLE APPROCHE SIMPLE

### **Étape 1: Script de Connexion Simplifié**
```bash
# Dans Git Bash (plus fiable que PowerShell pour SSH)
cd "c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator"

# Lancer le script de connexion simple
bash scripts/connect-ovh-simple.sh
```

### **Étape 2: Alternative - Connexion Directe**
```bash
# Si le script ne marche pas, connexion manuelle dans Git Bash
ssh -o "StrictHostKeyChecking=no" talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### **Étape 3: Récupérer Mot de Passe SSH**
**🔗 Lien direct:** https://www.ovh.com/manager/secret/#?id=458272b3-3e3a-47a3-aee6-038f0181be5b

**Ou Manager OVH:**
1. Aller sur manager.ovh.com
2. Hébergements → hosting-performance-1  
3. FTP-SSH → "Mot de passe SSH"

### **Étape 4: Process de Connexion**
```
1. 🔑 Tapez votre mot de passe SSH (INVISIBLE = NORMAL)
2. 📱 Saisissez code 2FA de votre app
3. ✅ Vous devriez voir: talkkij@ssh:~$
```

---

## 🆘 ALTERNATIVES SI PROBLÈME PERSISTE

### **Option A: Git Bash (RECOMMANDÉ)**
```bash
# Ouvrir Git Bash (plus compatible SSH que PowerShell)
# Naviguer vers le dossier
cd /c/Users/cedbe/Documents/Taan/MayaVoiceTranslator

# Connexion directe
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### **Option B: PuTTY (Alternative)**
1. **Télécharger PuTTY:** https://www.putty.org/
2. **Configuration:**
   - Host: ssh.cluster100.hosting.ovh.net
   - Port: 22
   - User: talkkij
3. **Connexion avec 2FA**

### **Option C: WSL (Windows Subsystem Linux)**
```powershell
# Installer WSL si pas encore fait
wsl --install

# Dans WSL
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

---

## 🔧 VÉRIFICATION PRÉALABLE

### **Test Connectivité**
```powershell
# Vérifier que le serveur répond
Test-NetConnection ssh.cluster100.hosting.ovh.net -Port 22
```

### **Vérifier 2FA**
- ✅ App d'authentification installée ?
- ✅ Code OVH configuré dans l'app ?
- ✅ Codes de secours OVH sauvegardés ?

---

## 🚀 PLAN B: CONFIGURATION ALTERNATIVE

Si SSH continue de poser problème, nous pouvons:

### **1. Utiliser l'Interface Web OVH**
- File Manager dans manager.ovh.com
- Upload de fichiers via interface web
- Configuration basique sans SSH

### **2. Déploiement via FTP**
- Connexion FTP classique
- Upload des fichiers TalkKin
- Configuration manuelle

### **3. Support OVH**
- **Tel:** 1007 ou +33 972 101 007
- **Chat:** manager.ovh.com
- Vérifier activation SSH + 2FA

---

## 🎯 ACTION IMMÉDIATE RECOMMANDÉE

### **Essayer Git Bash MAINTENANT:**
```bash
# 1. Ouvrir Git Bash (Clic droit → Git Bash Here)
cd /c/Users/cedbe/Documents/Taan/MayaVoiceTranslator

# 2. Lancer script simple
bash scripts/connect-ovh-simple.sh

# 3. Ou connexion directe
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

**Git Bash est généralement plus fiable que PowerShell pour SSH !**

---

## ✅ UNE FOIS CONNECTÉ

```bash
# Tests rapides
whoami              # doit afficher: talkkij
pwd                 # doit afficher: /home/talkkij
sudo whoami         # doit afficher: root

# Créer structure
mkdir -p setup
cd setup

# On continuera ensuite avec la configuration TalkKin
```

**🔥 Essayez Git Bash maintenant - c'est souvent la solution ! 🚀**

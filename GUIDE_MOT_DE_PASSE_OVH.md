# 🔑 GUIDE RÉCUPÉRATION MOT DE PASSE SSH/SFTP OVH

## 🎯 PROBLÈME: Mot de passe SSH/SFTP incorrect

**Symptôme :** `Permission denied` lors de la connexion SSH/SFTP

---

## 📍 SOLUTION 1: Localiser le mot de passe existant

### **Manager OVH - Emplacements possibles:**

1. **📧 Email de bienvenue OVH**
   - Cherchez dans vos emails un message "Votre hébergement est installé"
   - Sujet type: "Installation de votre hébergement talkkij.cluster100.hosting.ovh.net"

2. **Manager OVH → Hébergements**
   - https://manager.ovh.com/
   - **Hébergements Web** → **hosting-performance-1**
   - **Onglet "Informations générales"**
   - Section **"Connexion"** ou **"Serveur"**

3. **Manager OVH → FTP-SSH**
   - **Onglet "FTP-SSH"**
   - **Utilisateur "talkkij"**
   - **Clic sur icône "👁️" (Afficher)** ou **"🔑" (Modifier)**

4. **Manager OVH → Mes services**
   - **Mes services** → **hosting-performance-1**
   - **Détails du service**
   - **Informations de connexion**

---

## 🔧 SOLUTION 2: Définir un nouveau mot de passe

### **Si aucun mot de passe visible, créons-en un:**

1. **Manager OVH** → **Hébergements Web**
2. **Sélectionner votre hébergement**
3. **Onglet "FTP-SSH"**
4. **Ligne utilisateur "talkkij"**
5. **Clic sur "⚙️" ou "Modifier"**
6. **"Changer le mot de passe"**
7. **Saisir nouveau mot de passe** (8+ caractères, majuscule, chiffre, symbole)
8. **Confirmer**
9. **⏱️ Attendre 5-10 minutes** pour propagation

---

## 📝 TEMPLATE MOT DE PASSE SÉCURISÉ

### **Exemple de mot de passe fort:**
```
TalkKin2025!
Motd3Pass3Fort!
SecurePass123#
MonSite2025$
```

### **Critères OVH:**
- ✅ **8 caractères minimum**
- ✅ **1 majuscule minimum**
- ✅ **1 chiffre minimum**
- ✅ **1 caractère spécial** (!, @, #, $, %, etc.)

---

## 🕐 SOLUTION 3: Vérifier statut activation SSH

### **Timeframe d'activation SSH:**
- **SFTP** : ✅ Immédiat (déjà activé)
- **SSH** : ⏱️ 5-15 minutes après demande
- **2FA** : ⏱️ Peut nécessiter configuration

### **Vérification activation SSH:**
```powershell
# Test SSH (doit fonctionner quand activé)
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22

# Si erreur "Connection refused" = SSH pas encore activé
# Si erreur "Permission denied" = Problème mot de passe
# Si demande 2FA = SSH activé !
```

---

## 🚀 ACTIONS IMMÉDIATES RECOMMANDÉES

### **📋 ÉTAPE 1: Récupérer/Définir mot de passe**
1. Vérifiez vos **emails OVH**
2. Consultez **Manager OVH → FTP-SSH**
3. Si rien trouvé, **définissez nouveau mot de passe**
4. **Notez-le précieusement**

### **📋 ÉTAPE 2: Test connexion SFTP**
```powershell
# Test SFTP avec nouveau mot de passe
sftp talkkij@ssh.cluster100.hosting.ovh.net

# Si succès, nous pourrons uploader les scripts
```

### **📋 ÉTAPE 3: Attendre activation SSH**
```powershell
# Test SSH toutes les 2-3 minutes
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22

# Dès que SSH fonctionne, on lance le setup automatique
```

---

## 🔄 ALTERNATIVES SI PROBLÈME PERSISTANT

### **Option A: Support OVH**
- **📞 Téléphone :** 1007 (gratuit depuis ligne fixe)
- **💬 Chat :** manager.ovh.com
- **Demande :** "Activation SSH + récupération mot de passe pour talkkij"

### **Option B: FTP Web Manager**
- Manager OVH → **Hébergements** → **Gestionnaire de fichiers**
- Upload direct via interface web
- Plus lent mais fonctionne toujours

### **Option C: Reset complet**
- Manager OVH → **Réinitialiser l'hébergement**
- ⚠️ **ATTENTION :** Efface tout le contenu existant
- Recréer utilisateur avec nouveau mot de passe

---

## 📞 CONTACTS SUPPORT DIRECT

### **Support Technique OVH**
- **📞 France :** 1007 (ligne fixe) ou +33 972 101 007
- **🌐 International :** +33 972 101 007
- **💬 Chat :** manager.ovh.com (bouton aide en bas à droite)
- **📧 Ticket :** Manager OVH → "Créer un ticket"

### **Phrase magique pour le support:**
*"Bonjour, j'ai besoin d'activer SSH et récupérer le mot de passe pour l'utilisateur talkkij sur l'hébergement hosting-performance-1. SFTP fonctionne mais SSH/mot de passe ne fonctionnent pas."*

---

## 🎯 PROCHAINES ÉTAPES

### **Une fois le mot de passe récupéré:**

1. **✅ Test SFTP** pour upload script
2. **✅ Attente activation SSH** (5-15 min)
3. **✅ Connexion SSH avec 2FA**
4. **✅ Exécution script setup automatique**
5. **✅ Déploiement TalkKin complet**

**🔥 Objectif : SSH + Script setup = 30 minutes pour tout configurer !**

---

## 💡 NOTE IMPORTANTE

**Le mot de passe SSH/SFTP est IDENTIQUE.**

Si SFTP fonctionne avec un mot de passe, SSH fonctionnera avec le même mot de passe une fois activé.

**Prochaine action recommandée : Récupérer le bon mot de passe depuis Manager OVH**

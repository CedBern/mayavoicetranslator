# 🔄 TENTATIVE DE CONNEXION SSH - GUIDE ÉTAPE PAR ÉTAPE

## 🎯 PROCESSUS COMPLET DE CONNEXION

### **📋 Prérequis AVANT de commencer**

1. **Récupérer le mot de passe SSH :**
   - 🔗 **Lien direct :** https://www.ovh.com/manager/secret/#?id=458272b3-3e3a-47a3-aee6-038f0181be5b
   - **Ou Manager OVH :** manager.ovh.com → Hébergements → hosting-performance-1 → FTP-SSH → "Mot de passe SSH"

2. **Préparer l'app 2FA :**
   - Ouvrir Google Authenticator / Authy
   - Localiser l'entrée OVH
   - Avoir les codes de secours à portée

### **🚀 CONNEXION ÉTAPE PAR ÉTAPE**

#### **Étape 1: Lancement de la connexion**
```bash
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

#### **Étape 2: Accepter l'empreinte (si demandé)**
```
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
**→ Tapez : `yes`**

#### **Étape 3: Saisie mot de passe SSH**
```
talkkij@ssh.cluster100.hosting.ovh.net's password:
```
**→ Tapez votre mot de passe SSH (INVISIBLE - normal !)**

#### **Étape 4: Code 2FA**
```
Verification code:
```
**→ Tapez le code 6 chiffres de votre app**

#### **Étape 5: Succès**
```
talkkij@ssh:~$
```
**→ Vous êtes connecté !**

---

## 🔧 SI PROBLÈME À L'ÉTAPE 3 (MOT DE PASSE)

### **Problèmes courants :**
- Mot de passe incorrect
- Expiration du mot de passe
- Compte pas encore activé

### **Solutions :**
1. **Réinitialiser le mot de passe SSH :**
   - Manager OVH → Hébergements → FTP-SSH → "Changer le mot de passe"
   
2. **Vérifier l'activation SSH :**
   - Manager OVH → Hébergements → FTP-SSH → Vérifier que SSH est "Actif"
   
3. **Contacter support OVH :** 1007

---

## 🔧 SI PROBLÈME À L'ÉTAPE 4 (2FA)

### **Problèmes courants :**
- Code expiré (30s timeout)
- App non synchronisée
- Mauvais code

### **Solutions :**
1. **Codes de secours :** Utiliser un code de backup OVH
2. **Resynchroniser l'app :** Vérifier l'heure système
3. **Réinitialiser 2FA :** Manager OVH → Sécurité

---

## 🎯 ACTIONS APRÈS CONNEXION

Une fois connecté avec succès :

```bash
# 1. Vérifier l'environnement
whoami
# Résultat attendu: talkkij

pwd
# Résultat attendu: /home/talkkij

# 2. Tester les privilèges
sudo whoami
# Résultat attendu: root

# 3. Créer structure pour TalkKin
mkdir -p setup projects
cd setup

# 4. Vérifier espace disque
df -h

# 5. Vérifier services actifs
systemctl --type=service --state=active
```

---

## 🚀 PRÊT ? LANCEZ LA CONNEXION !

**Ouvrez un nouveau terminal et exécutez :**

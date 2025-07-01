# 🔑 Guide de Saisie Mot de Passe SSH OVH

## 🎯 Processus de Connexion SSH avec Mot de Passe

### Étape 1: Commande de Connexion
```bash
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### Étape 2: Saisie du Mot de Passe SSH

#### Ce qui va se passer :
1. **Vous tapez la commande SSH** et appuyez sur Entrée
2. **Le terminal affiche :** `talkkij@ssh.cluster100.hosting.ovh.net's password:`
3. **Vous tapez votre mot de passe** (rien ne s'affiche - c'est normal !)
4. **Vous appuyez sur Entrée**

#### ⚠️ IMPORTANT : 
- **Le mot de passe ne s'affiche PAS** pendant que vous tapez (sécurité)
- **Aucun caractère, ni *, ni point** ne s'affiche
- **L'écran reste vide** mais le mot de passe est bien enregistré

### Étape 3: Authentification 2FA (si activée)

Après le mot de passe, le système peut demander :
```
Enter your authentication code:
```

Vous devez alors saisir le **code à 6 chiffres** de votre application 2FA (Google Authenticator, Authy, etc.)

## 📝 Exemple Complet de Session

```bash
# Vous tapez ceci
C:\> ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22

# Le système répond
talkkij@ssh.cluster100.hosting.ovh.net's password: 

# Vous tapez votre mot de passe (rien ne s'affiche)
[vous tapez le mot de passe mais rien n'apparaît]

# Vous appuyez sur Entrée, puis le système peut demander
Enter your authentication code: 

# Si tout est correct, vous obtenez
Last login: Wed Jun 25 20:00:00 2025 from xxx.xxx.xxx.xxx
talkkij@cluster100:~$ 
```

## 🔐 Format du Mot de Passe OVH

### Récupération du Mot de Passe
1. **Connectez-vous sur manager.ovh.com**
2. **Allez dans** "Hébergements" → "cluster100"
3. **Onglet "FTP-SSH"**
4. **Cliquez sur "Modifier le mot de passe"** pour le réinitialiser
5. **Notez le nouveau mot de passe** généré

### Caractéristiques du Mot de Passe OVH
- **Longueur :** Généralement 8-16 caractères
- **Format :** Mélange de lettres, chiffres, parfois symboles
- **Exemple type :** `Kp9mB3xQ` ou `Auth2024!`
- **Sensible à la casse :** Respecter majuscules/minuscules

## 🛠️ Script de Test Connexion

Créons un script pour tester la connexion étape par étape :

```bash
# Test 1: Ping du serveur
ping ssh.cluster100.hosting.ovh.net

# Test 2: Test de port SSH
telnet ssh.cluster100.hosting.ovh.net 22

# Test 3: Connexion SSH complète
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

## 🚨 Problèmes Courants et Solutions

### Problème 1: "Permission denied"
**Cause :** Mot de passe incorrect
**Solution :** Réinitialiser le mot de passe sur manager.ovh.com

### Problème 2: "Connection timeout"
**Cause :** Problème réseau ou firewall
**Solution :** Vérifier connexion internet, tester sans VPN

### Problème 3: "Host key verification failed"
**Cause :** Changement de clé serveur
**Solution :** 
```bash
ssh-keygen -R ssh.cluster100.hosting.ovh.net
```

## 🔄 Alternatives si SSH Échoue

### Option 1: SFTP (recommandée)
```bash
sftp talkkij@ssh.cluster100.hosting.ovh.net
```

### Option 2: FTP Classic
```bash
ftp talkkij.cluster100.hosting.ovh.net
```

### Option 3: Interface Web OVH
- Manager.ovh.com → Hébergement → Explorateur de fichiers

## 📋 Checklist de Connexion

### Avant de Commencer
- [ ] Connexion internet stable
- [ ] Pas de VPN actif (peut causer des problèmes)
- [ ] Terminal/PowerShell ouvert
- [ ] Mot de passe OVH à jour (récupéré du manager)

### Pendant la Connexion
- [ ] Tapez la commande SSH complète
- [ ] Attendez l'invite "password:"
- [ ] Tapez le mot de passe (même si rien ne s'affiche)
- [ ] Appuyez sur Entrée fermement

### Après Connexion Réussie
- [ ] Vous voyez `talkkij@cluster100:~$`
- [ ] Test rapide : `whoami` (doit afficher "talkkij")
- [ ] Test sudo : `sudo whoami` (doit afficher "root")

## 🎯 Action Immédiate Recommandée

### Étape 1: Récupérer le Nouveau Mot de Passe
1. Allez sur **manager.ovh.com**
2. **Hébergements** → cluster100
3. **Onglet FTP-SSH**
4. **"Modifier le mot de passe"**
5. **Notez le nouveau mot de passe** généré

### Étape 2: Test de Connexion
```bash
ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
```

### Étape 3: Si Connexion Réussie
```bash
# Tester l'environnement
whoami
pwd
ls -la
sudo whoami
```

Voulez-vous que je vous guide pour récupérer le nouveau mot de passe depuis le manager OVH d'abord ?

c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator\scripts\ovh-performant.ps1

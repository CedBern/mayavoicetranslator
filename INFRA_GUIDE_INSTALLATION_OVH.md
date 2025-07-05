

# Guide d’installation détaillé – VPS OVH Canada pour MayaVoiceTranslator

> **À lire avant de commencer**
>
> Ce projet s’appuie sur une gouvernance communautaire forte : chaque décision technique ou de partage de données doit respecter le consentement libre, préalable et éclairé (FPIC), les principes CARE/OCAP®, et s’appuyer sur des outils comme Loomio ou Hyperledger pour la traçabilité et la co-décision. L’architecture (voir [GOUVERNANCE_COMMUNAUTAIRE.md](./docs/GOUVERNANCE_COMMUNAUTAIRE.md)) garantit que la souveraineté, la sécurité et l’accessibilité sont au cœur du dispositif.


## 0. Résumé de l’architecture et de la souveraineté communautaire


Ce projet s’appuie sur une architecture optimisée pour la souveraineté, la sécurité et l’évolutivité, validée par DeepSeek (2025) et enrichie par les meilleures pratiques internationales :

- **Frontend** : PWA statique (hébergée sur Vercel/Netlify)
- **Backend** : VPS OVH Canada (Node.js, Mukurtu CMS, PostgreSQL, IPFS)
- **Stockage distribué** : IPFS Cluster + Backblaze B2 (sauvegardes)
- **Sécurité** : Chiffrement PostgreSQL, RLS, audit, protocoles Mukurtu, consentement FPIC

> "Le stockage traditionnel, c’est comme garder tous vos documents dans une seule bibliothèque. Si elle ferme, tout est perdu. IPFS, c’est comme avoir des copies dans plusieurs bibliothèques communautaires : même si certaines ferment, vos savoirs restent accessibles. Mukurtu permet à chaque communauté de décider qui peut voir quoi, selon ses propres règles."

Le schéma détaillé, les points de vigilance et les coûts sont présentés dans le fichier [ARCHITECTURE_OVH_MAYA.md](./ARCHITECTURE_OVH_MAYA.md).

Une version espagnole de l’architecture est disponible : [ARQUITECTURA_OVH_MAYA_ES.md](./docs/translations/es/ARQUITECTURA_OVH_MAYA_ES.md)

Consultez la [checklist de conformité](./docs/CHECKLIST_CONFORMITE_OVH.md) (et sa version espagnole : [CHECKLIST_CONFORMIDAD_OVH_ES.md](./docs/translations/es/CHECKLIST_CONFORMIDAD_OVH_ES.md)) pour valider chaque étape de sécurité, souveraineté et gouvernance.

Pour la gouvernance, la souveraineté et l’inclusion, voir aussi [GOUVERNANCE_COMMUNAUTAIRE.md](./docs/GOUVERNANCE_COMMUNAUTAIRE.md) et sa version espagnole [GOBERNANZA_COMUNITARIA_ES.md](./docs/translations/es/GOBERNANZA_COMUNITARIA_ES.md).

---

## 1. Création et configuration du VPS

1. Rendez-vous sur https://www.ovhcloud.com/fr-ca/vps/ et choisissez l’offre “VPS Value” (2 vCPU, 8 Go RAM, 160 Go SSD).
2. Sélectionnez le datacenter “Canada” (Beauharnois) pour la proximité avec le Mexique.
3. Choisissez l’OS Ubuntu 22.04 LTS (recommandé pour la stabilité et la documentation).
4. Finalisez la commande et créez votre compte OVH si besoin.
5. Une fois le VPS prêt, notez l’adresse IP et les identifiants reçus par email.

## 2. Connexion à votre VPS

1. Téléchargez et installez un client SSH (ex : PuTTY sur Windows, Terminal sur Mac/Linux).
2. Connectez-vous avec la commande :
   ```
   ssh root@ADRESSE_IP_DU_VPS
   ```
   (remplacez ADRESSE_IP_DU_VPS par l’IP reçue)
3. Entrez le mot de passe fourni par OVH (vous pouvez le changer ensuite avec `passwd`).

## 3. Sécurisation de base

1. Mettez à jour le système :
   ```
   apt update && apt upgrade -y
   ```
2. Créez un nouvel utilisateur (ex : mayaadmin) :
   ```
   adduser mayaadmin
   usermod -aG sudo mayaadmin
   ```
3. Activez le pare-feu :
   ```
   ufw allow OpenSSH
   ufw enable
   ```

## 4. Installation des composants principaux

### a) Node.js et npm
```
apt install -y nodejs npm
```

### b) PostgreSQL
```
apt install -y postgresql postgresql-contrib
```

### c) Git
```
apt install -y git
```

### d) (Optionnel) Docker (pour Mukurtu ou IPFS)
```
apt install -y docker.io docker-compose
usermod -aG docker mayaadmin
```

## 5. Déploiement de MayaVoiceTranslator

1. Clonez votre dépôt :
   ```
   git clone https://github.com/ton-utilisateur/MayaVoiceTranslator.git
   cd MayaVoiceTranslator
   ```
2. Installez les dépendances Node.js :
   ```
   npm install
   ```
3. Configurez la base PostgreSQL :
   - Connectez-vous à PostgreSQL :
     ```
     sudo -u postgres psql
     ```
   - Créez une base et un utilisateur :
     ```
     CREATE DATABASE mayavoice;
     CREATE USER mayauser WITH ENCRYPTED PASSWORD 'motdepassefort';
     GRANT ALL PRIVILEGES ON DATABASE mayavoice TO mayauser;
     \q
     ```
   - Mettez à jour le fichier `.env` du projet avec ces infos.
4. Lancez l’application :
   ```
   npm run start
   ```

## 6. (Optionnel) Installation de Mukurtu CMS
- Suivez la documentation officielle : https://mukurtu.org/documentation/
- Privilégiez l’installation via Docker pour simplifier la gestion des dépendances.

## 7. (Optionnel) Installation d’IPFS
```
wget https://dist.ipfs.tech/go-ipfs/v0.24.0/go-ipfs_v0.24.0_linux-amd64.tar.gz
 tar -xvzf go-ipfs_v0.24.0_linux-amd64.tar.gz
 cd go-ipfs
 sudo bash install.sh
 ipfs init
 ipfs daemon &
```

## 8. Sauvegardes et monitoring
- Activez les snapshots OVH dans l’interface client.
- Configurez des sauvegardes régulières de la base PostgreSQL et des fichiers importants.
- Installez `htop`, `fail2ban`, et surveillez les logs pour la sécurité.

## 9. Accès à l’application
- Par défaut, l’app Node.js écoute sur le port 3000. Ouvrez ce port dans le pare-feu :
  ```
  ufw allow 3000
  ```
- Accédez à l’app via http://ADRESSE_IP_DU_VPS:3000

---

**En cas de problème, consulte la documentation OVH ou demande de l’aide à la communauté.**

Ce guide est à conserver et à enrichir selon l’évolution du projet.

#!/bin/bash
# Script d'installation automatisée pour instance OVH (Ubuntu 22.04+)
# Usage : sudo bash setup_ovh_instance.sh

set -e

# 1. Mises à jour système
apt update && apt upgrade -y

# 2. Installation des dépendances de base
apt install -y curl git ufw

# 3. Installation de Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $SUDO_USER || true

# 4. Installation de Docker Compose plugin
apt install -y docker-compose-plugin

# 5. Sécurisation minimale (pare-feu)
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 3001
ufw --force enable

# 6. Affichage des infos
echo "--- Docker et Docker Compose installés ---"
docker --version
docker compose version

# 7. Conseils post-install
cat <<EOF

---
Redémarrez la session pour appliquer les droits Docker.
Clonez ensuite votre dépôt et lancez :
  docker compose -f .devcontainer/docker-compose.yml up --build -d
---
EOF

#!/bin/bash
# =================================================================
# SCRIPT SETUP TALKKIN OVH - VERSION SIMPLIFIÉE
# Pour upload via gestionnaire web en attendant SSH
# =================================================================

echo "🚀 TalkKin Setup - Version Web Upload"
echo "===================================="

# Vérification environnement
echo "📍 Utilisateur : $(whoami)"
echo "📍 Répertoire : $(pwd)"
echo "📍 Date : $(date)"

# Création structure de base
echo "📁 Création structure dossiers..."
mkdir -p ~/projects/talkkin/{api,frontend,scripts,data,logs}
mkdir -p ~/setup ~/backups ~/logs

# Test permissions
echo "🔑 Test permissions..."
touch ~/test_permissions.txt
if [ -f ~/test_permissions.txt ]; then
    echo "✅ Permissions OK"
    rm ~/test_permissions.txt
else
    echo "❌ Problème permissions"
fi

# Information système
echo ""
echo "📊 INFORMATIONS SYSTÈME:"
echo "========================"
echo "🖥️  Système : $(uname -a)"
echo "💾 Espace disque :"
df -h ~
echo ""
echo "📁 Structure créée :"
ls -la ~

echo ""
echo "✅ Setup de base terminé !"
echo "🔄 SSH sera disponible sous peu pour setup complet"
echo ""
echo "📋 Prochaines étapes quand SSH sera actif :"
echo "1. Connexion SSH"
echo "2. Lancement setup complet"
echo "3. Configuration services"
echo "4. SSL Let's Encrypt"
echo ""

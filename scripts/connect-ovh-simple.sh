#!/bin/bash
# ===================================================================
# SCRIPT DE CONNEXION SSH OVH SIMPLIFIÉ
# ===================================================================

echo "=================================================================="
echo "🚀 CONNEXION SSH OVH - VERSION SIMPLIFIÉE"
echo "=================================================================="
echo ""

# Variables OVH
OVH_HOST="ssh.cluster100.hosting.ovh.net"
OVH_USER="talkkij"
OVH_PORT="22"

echo "📋 Informations de connexion:"
echo "   🌐 Serveur: $OVH_HOST"
echo "   👤 Utilisateur: $OVH_USER"
echo "   🔌 Port: $OVH_PORT"
echo ""

echo "🔑 INSTRUCTIONS:"
echo "1. Votre mot de passe sera INVISIBLE quand vous le tapez (normal !)"
echo "2. Tapez-le normalement puis appuyez sur ENTRÉE"
echo "3. Ensuite saisissez votre code 2FA (6 chiffres)"
echo ""

echo "📱 Préparez votre app 2FA maintenant..."
echo "   (Google Authenticator, Authy, etc.)"
echo ""

read -p "🚀 Appuyez sur ENTRÉE pour vous connecter..."

echo ""
echo "🔐 Connexion en cours..."
echo ""

# Connexion SSH avec options de debug réduites
ssh -o "StrictHostKeyChecking=no" -p $OVH_PORT $OVH_USER@$OVH_HOST

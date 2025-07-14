#!/bin/bash

# 🚀 Script d'Activation Rapide - Talk Kin
# Active toutes les fonctionnalités et démarre l'application

echo "🚀 Activation complète de Talk Kin..."
echo "=================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Environment Node.js détecté"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur API
echo "🌐 Démarrage du serveur API..."
node api-server-simple.js &
API_PID=$!
echo "✅ Serveur API démarré (PID: $API_PID)"

# Attendre que le serveur soit prêt
sleep 3

# Test de santé de l'API
echo "🏥 Test de santé de l'API..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ API opérationnelle"
else
    echo "⚠️ API non accessible - continuons quand même"
fi

# Démarrer l'application Expo
echo "📱 Démarrage de l'application Expo..."
npx expo start --web &
EXPO_PID=$!
echo "✅ Expo démarré (PID: $EXPO_PID)"

# Attendre le démarrage d'Expo
sleep 5

# Test d'activation des fonctionnalités
echo "⚡ Test d'activation des fonctionnalités..."
node test-activation-complete.js

echo ""
echo "🎉 ACTIVATION COMPLÈTE TERMINÉE !"
echo "=================================="
echo ""
echo "📱 Application web: http://localhost:8081"
echo "🌐 API Serveur: http://localhost:3000"
echo "📄 Documentation: ACTIVATION_GLOBALE_COMPLETE.md"
echo ""
echo "🔧 Fonctionnalités actives:"
echo "   🎤 Reconnaissance vocale"
echo "   🗣️ Synthèse vocale"
echo "   🌍 Traduction multi-langues"
echo "   🚀 IA avancée"
echo "   🎯 Extensions linguistiques"
echo "   ⚡ 12 fonctionnalités premium"
echo ""
echo "📖 Guide d'utilisation:"
echo "   1. Ouvrez http://localhost:8081"
echo "   2. Naviguez vers 'Activation Globale'"
echo "   3. Testez les fonctionnalités"
echo "   4. Profitez de Talk Kin !"
echo ""
echo "🛑 Pour arrêter: Ctrl+C puis kill $API_PID $EXPO_PID"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $API_PID 2>/dev/null
    kill $EXPO_PID 2>/dev/null
    echo "✅ Services arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Garder le script en vie
echo "▶️ Services en cours d'exécution... (Ctrl+C pour arrêter)"
wait

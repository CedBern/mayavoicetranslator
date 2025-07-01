#!/bin/bash

# 🌍 Script de démarrage Talk Kin avec langues régionales
# Démarre l'API backend et l'interface utilisateur avec support complet

echo "🌍 ====================================="
echo "🗣️  TALK KIN - LANGUES RÉGIONALES"
echo "🌍 ====================================="
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"
echo ""

# Démarrer l'API backend en arrière-plan
echo "🚀 Démarrage API backend..."
node api-server-simple.js &
API_PID=$!
echo "📡 API démarrée (PID: $API_PID)"

# Attendre que l'API soit prête
echo "⏰ Attente initialisation API..."
sleep 3

# Tester l'API
echo "🧪 Test API..."
curl -s -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"bonjour","from":"fr","to":"br"}' | \
  jq -r '.translation // "Erreur"'

if [ $? -eq 0 ]; then
    echo "✅ API opérationnelle"
else
    echo "❌ Problème API"
fi

echo ""
echo "🌍 LANGUES SUPPORTÉES:"
echo "   🏛️  Autochtones: Maya, Quechua, Guarani"
echo "   🇪🇺 Régionales: Breton, Catalan, Corse, Basque, Ch'ti"
echo "   🏴󠁧󠁢󠁷󠁬󠁳󠁿  Celtiques: Gallois, Gaélique écossais"
echo "   🇫🇷 France: Occitan"
echo ""
echo "📱 Interface web: http://localhost:8081"
echo "📡 API backend: http://localhost:3000"
echo ""
echo "🎯 Tests disponibles:"
echo "   node test-regional-languages.js"
echo "   node test-validation-langues-regionales.js"
echo ""
echo "💡 Pour arrêter: Ctrl+C puis kill $API_PID"
echo ""
echo "🌍 ====================================="
echo "✅ TALK KIN PRÊT AVEC LANGUES RÉGIONALES"
echo "🌍 ====================================="

# Démarrer l'interface utilisateur
echo "🎨 Démarrage interface utilisateur..."
npm start

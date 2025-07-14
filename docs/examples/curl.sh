#!/bin/bash

# Maya Translator API - Exemples cURL

API_BASE="http://localhost:3000/api"

echo "🔐 Authentification..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
    echo "✅ Token obtenu"
    
    echo "🌐 Traduction..."
    curl -X POST "$API_BASE/translate" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"text": "Bonjour le monde", "fromLang": "french", "toLang": "maya-yucateco"}' | jq '.'
    
    echo "🔍 Recherche..."
    curl -X GET "$API_BASE/search?query=eau&limit=3" \
      -H "Authorization: Bearer $TOKEN" | jq '.'
    
    echo "🌍 Langues supportées..."
    curl -X GET "$API_BASE/languages" | jq '.languages[:5]'
    
else
    echo "❌ Échec de l'authentification"
    echo $TOKEN_RESPONSE | jq '.'
fi

echo "❤️  Vérification de santé..."
curl -X GET "http://localhost:3000/health" | jq '.'
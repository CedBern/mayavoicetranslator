# Exemple d'appel à l'API suggestions multilingues enrichies (curl)

POST /api/suggestions HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer VOTRE_JWT_OPTIONNEL

{
  "query": "merci",
  "targetLanguage": "en",
  "maxSuggestions": 7
}

# Commande curl équivalente :
curl -X POST http://localhost:3000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{"query": "merci", "targetLanguage": "en", "maxSuggestions": 7}'

# Réponse attendue (exemple)
{
  "success": true,
  "count": 7,
  "suggestions": [
    { "text": "thank you", "relevanceScore": 0.98, "source": "MyMemory" },
    { "text": "thanks", "relevanceScore": 0.95, "source": "Linguee" },
    { "text": "thank you very much", "relevanceScore": 0.92, "source": "LibreTranslate" },
    { "text": "thanks a lot", "relevanceScore": 0.91, "source": "OPUS-MT" },
    { "text": "thank you!", "relevanceScore": 0.9, "source": "Apertium" },
    { "text": "thank you", "relevanceScore": 0.88, "source": "OpenSubtitles" },
    { "text": "thank you", "relevanceScore": 0.85, "source": "Wiktionary" }
  ]
}

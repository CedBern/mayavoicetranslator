# Exemple d'appel à l'API /api/suggestions depuis Python

import requests

API_URL = 'http://localhost:3000/api/suggestions'
HEADERS = {
    'Content-Type': 'application/json',
    # 'Authorization': 'Bearer VOTRE_JWT_OPTIONNEL',  # Décommentez si besoin
}
DATA = {
    'query': 'merci',
    'targetLanguage': 'en',
    'maxSuggestions': 7
}

response = requests.post(API_URL, json=DATA, headers=HEADERS)

if response.ok:
    result = response.json()
    print('Suggestions:')
    for s in result.get('suggestions', []):
        print(f"- [{s.get('source', 'local')}] {s['text']} (score: {s['relevanceScore']})")
else:
    print('Erreur:', response.status_code, response.text)

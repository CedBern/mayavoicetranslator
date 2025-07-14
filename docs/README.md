# Maya Voice Translator API Documentation

API REST complète pour la traduction des langues Maya et indigènes

**Version:** 1.0.0  
**Contact:** support@mayatranslator.com  
**License:** MIT

## Serveurs

- **Serveur de développement:** `http://localhost:3000/api`
- **Serveur de production:** `https://api.mayatranslator.com/api`

## Authentification

Cette API utilise OAuth2 avec les flow suivants :

### Authorization Code Flow
Pour les applications web et mobiles avec interface utilisateur.

```
GET /oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=translate%20voice
```

### Client Credentials Flow
Pour les applications serveur-à-serveur.

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=translate
```

## Scopes disponibles

- **translate** : Accès aux fonctions de traduction
- **voice** : Accès aux fonctions vocales (TTS/STT)
- **dictionary** : Accès au dictionnaire
- **search** : Accès à la recherche
- **offline** : Accès au mode hors ligne

## Endpoints principaux

### Traduction

#### POST /translate
Traduit un texte d'une langue vers une autre.

**Authentification requise :** Oui (scope: translate)

**Exemple de requête :**
```json
{
  "text": "Bonjour",
  "fromLang": "french",
  "toLang": "maya-yucateco",
  "options": {
    "enableCache": true,
    "fallbackToOffline": true
  }
}
```

**Exemple de réponse :**
```json
{
  "success": true,
  "translation": {
    "translatedText": "Ba'ax ka wa'alik",
    "confidence": 0.95,
    "alternatives": ["Hola", "Saludos"]
  },
  "metadata": {
    "fromLang": "french",
    "toLang": "maya-yucateco",
    "originalText": "Bonjour",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Langues supportées

#### GET /languages
Retourne la liste de toutes les langues supportées.

**Authentification requise :** Non

**Exemple de réponse :**
```json
{
  "success": true,
  "languages": [
    {
      "code": "maya-yucateco",
      "name": "Maya Yucatèque",
      "family": "maya",
      "nativeName": "Yucatec Maya",
      "direction": "ltr"
    }
  ],
  "total": 150
}
```

### Recherche

#### GET /search
Recherche des termes dans le dictionnaire.

**Authentification requise :** Oui (scope: search)

**Paramètres :**
- `query` (required): Terme à rechercher
- `fromLang` (optional): Langue source
- `toLang` (optional): Langue cible
- `limit` (optional): Nombre de résultats (défaut: 10)

## Codes d'erreur

- **400** : Paramètres invalides
- **401** : Non autorisé (token manquant ou invalide)
- **403** : Accès interdit (scope insuffisant)
- **404** : Ressource non trouvée
- **429** : Trop de requêtes (rate limiting)
- **500** : Erreur interne du serveur

## Limites de taux

- **100 requêtes par heure** par IP
- **1000 requêtes par jour** par utilisateur authentifié
- **10000 requêtes par jour** pour les clients premium

## SDK et exemples

### JavaScript/TypeScript
```bash
npm install maya-translator-sdk
```

```javascript
import { MayaTranslatorSDK } from 'maya-translator-sdk';

const sdk = new MayaTranslatorSDK({
  apiBaseUrl: 'https://api.mayatranslator.com/api'
});

await sdk.authenticate('username', 'password');
const result = await sdk.translate('Bonjour', 'french', 'maya-yucateco');
```

### Python
```bash
pip install maya-translator-sdk
```

```python
from maya_translator_sdk import MayaTranslatorSDK

sdk = MayaTranslatorSDK(api_base_url='https://api.mayatranslator.com/api')
sdk.authenticate('username', 'password')
result = sdk.translate('Bonjour', 'french', 'maya-yucateco')
```

### cURL
```bash
# Authentification
curl -X POST "https://api.mayatranslator.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "<YOUR_PASSWORD_HERE>"}'

# Traduction
curl -X POST "https://api.mayatranslator.com/api/translate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{"text": "Bonjour", "fromLang": "french", "toLang": "maya-yucateco"}'
```

## Support

- **Email :** support@mayatranslator.com
- **Documentation :** https://docs.mayatranslator.com
- **GitHub :** https://github.com/mayatranslator/api
- **Status :** https://status.mayatranslator.com


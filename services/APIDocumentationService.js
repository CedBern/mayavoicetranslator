/**
 * 📚 Service de documentation automatique API
 * Génère automatiquement la documentation OpenAPI/Swagger et les tests
 */

import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';

export class APIDocumentationService {
    constructor() {
        this.apiSpec = {
            openapi: '3.0.0',
            info: {
                title: 'Maya Voice Translator API',
                version: '1.0.0',
                description: 'API REST complète pour la traduction des langues Maya et indigènes',
                contact: {
                    name: 'Maya Translator Support',
                    email: 'support@mayatranslator.com',
                    url: 'https://mayatranslator.com/support'
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT'
                }
            },
            servers: [
                {
                    url: 'http://localhost:3000/api',
                    description: 'Serveur de développement'
                },
                {
                    url: 'https://api.mayatranslator.com/api',
                    description: 'Serveur de production'
                }
            ],
            components: {
                securitySchemes: {
                    OAuth2: {
                        type: 'oauth2',
                        flows: {
                            authorizationCode: {
                                authorizationUrl: '/oauth/authorize',
                                tokenUrl: '/oauth/token',
                                scopes: {
                                    translate: 'Accès aux fonctions de traduction',
                                    voice: 'Accès aux fonctions vocales',
                                    dictionary: 'Accès au dictionnaire',
                                    search: 'Accès à la recherche',
                                    offline: 'Accès au mode hors ligne'
                                }
                            },
                            clientCredentials: {
                                tokenUrl: '/oauth/token',
                                scopes: {
                                    translate: 'Accès aux fonctions de traduction',
                                    dictionary: 'Accès au dictionnaire',
                                    search: 'Accès à la recherche'
                                }
                            }
                        }
                    },
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                },
                schemas: this.generateSchemas()
            },
            paths: this.generatePaths(),
            tags: [
                {
                    name: 'Authentication',
                    description: 'Authentification et autorisation OAuth2'
                },
                {
                    name: 'Translation',
                    description: 'Services de traduction'
                },
                {
                    name: 'Voice',
                    description: 'Services vocaux (TTS/STT)'
                },
                {
                    name: 'Dictionary',
                    description: 'Accès au dictionnaire'
                },
                {
                    name: 'Search',
                    description: 'Recherche et suggestions'
                },
                {
                    name: 'Semantic',
                    description: 'Recherche sémantique avancée'
                },
                {
                    name: 'Ingestion',
                    description: 'Data ingestion for corpus building'
                },
                {
                    name: 'Admin',
                    description: 'Administrative tasks'
                }
            ]
        };
    }

    /**
     * Génère les schémas de données
     */
    generateSchemas() {
        return {
            Language: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                        example: 'maya-yucateco',
                        description: 'Code de la langue'
                    },
                    name: {
                        type: 'string',
                        example: 'Maya Yucatèque',
                        description: 'Nom de la langue'
                    },
                    family: {
                        type: 'string',
                        example: 'maya',
                        description: 'Famille linguistique'
                    },
                    nativeName: {
                        type: 'string',
                        example: 'Yucatec Maya',
                        description: 'Nom natif de la langue'
                    },
                    direction: {
                        type: 'string',
                        enum: ['ltr', 'rtl'],
                        example: 'ltr',
                        description: 'Direction d\'écriture'
                    }
                }
            },
            TranslationRequest: {
                type: 'object',
                required: ['text', 'fromLang', 'toLang'],
                properties: {
                    text: {
                        type: 'string',
                        example: 'Bonjour',
                        description: 'Texte à traduire'
                    },
                    fromLang: {
                        type: 'string',
                        example: 'french',
                        description: 'Langue source'
                    },
                    toLang: {
                        type: 'string',
                        example: 'maya-yucateco',
                        description: 'Langue cible'
                    },
                    options: {
                        type: 'object',
                        properties: {
                            enableCache: {
                                type: 'boolean',
                                default: true,
                                description: 'Activer le cache'
                            },
                            fallbackToOffline: {
                                type: 'boolean',
                                default: true,
                                description: 'Fallback hors ligne'
                            },
                            useSemanticSearch: {
                                type: 'boolean',
                                default: true,
                                description: 'Utiliser la recherche sémantique'
                            }
                        }
                    }
                }
            },
            TranslationResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    translation: {
                        type: 'object',
                        properties: {
                            translatedText: {
                                type: 'string',
                                example: 'Ba\'ax ka wa\'alik',
                                description: 'Texte traduit'
                            },
                            confidence: {
                                type: 'number',
                                example: 0.95,
                                description: 'Score de confiance (0-1)'
                            },
                            alternatives: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                },
                                example: ['Hola', 'Saludos'],
                                description: 'Traductions alternatives'
                            }
                        }
                    },
                    metadata: {
                        type: 'object',
                        properties: {
                            fromLang: {
                                type: 'string',
                                example: 'french'
                            },
                            toLang: {
                                type: 'string',
                                example: 'maya-yucateco'
                            },
                            originalText: {
                                type: 'string',
                                example: 'Bonjour'
                            },
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                example: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Paramètres requis: text, fromLang, toLang',
                        description: 'Message d\'erreur'
                    },
                    details: {
                        type: 'string',
                        description: 'Détails supplémentaires'
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T10:30:00Z'
                    }
                }
            },
            AuthRequest: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: {
                        type: 'string',
                        example: 'demo',
                        description: 'Nom d\'utilisateur'
                    },
                    password: {
                        type: 'string',
                        example: 'demo123',
                        description: 'Mot de passe'
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        description: 'Token JWT d\'accès'
                    },
                    expiresIn: {
                        type: 'string',
                        example: '24h',
                        description: 'Durée de validité du token'
                    },
                    user: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                                example: 'demo'
                            },
                            role: {
                                type: 'string',
                                example: 'user'
                            }
                        }
                    }
                }
            }
        };
    }

    /**
     * Génère les chemins d'API
     */
    generatePaths() {
        return {
            '/health': {
                get: {
                    tags: ['Health'],
                    summary: 'Vérification de l\'état du service',
                    description: 'Endpoint pour vérifier si l\'API est opérationnelle',
                    responses: {
                        '200': {
                            description: 'Service opérationnel',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: {
                                                type: 'string',
                                                example: 'ok'
                                            },
                                            timestamp: {
                                                type: 'string',
                                                format: 'date-time'
                                            },
                                            version: {
                                                type: 'string',
                                                example: '1.0.0'
                                            },
                                            services: {
                                                type: 'object',
                                                properties: {
                                                    translation: {
                                                        type: 'string',
                                                        example: 'active'
                                                    },
                                                    voice: {
                                                        type: 'string',
                                                        example: 'active'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Connexion utilisateur',
                    description: 'Authentifie un utilisateur et retourne un token JWT',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    '$ref': '#/components/schemas/AuthRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Connexion réussie',
                            content: {
                                'application/json': {
                                    schema: {
                                        '$ref': '#/components/schemas/AuthResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Identifiants invalides',
                            content: {
                                'application/json': {
                                    schema: {
                                        '$ref': '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/translate': {
                post: {
                    tags: ['Translation'],
                    summary: 'Traduire du texte',
                    description: 'Traduit un texte d\'une langue vers une autre',
                    security: [
                        { 'BearerAuth': [] },
                        { 'OAuth2': ['translate'] }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    '$ref': '#/components/schemas/TranslationRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Traduction réussie',
                            content: {
                                'application/json': {
                                    schema: {
                                        '$ref': '#/components/schemas/TranslationResponse'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Paramètres invalides',
                            content: {
                                'application/json': {
                                    schema: {
                                        '$ref': '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Non autorisé',
                            content: {
                                'application/json': {
                                    schema: {
                                        '$ref': '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/languages': {
                get: {
                    tags: ['Translation'],
                    summary: 'Obtenir les langues supportées',
                    description: 'Retourne la liste de toutes les langues supportées par l\'API',
                    responses: {
                        '200': {
                            description: 'Liste des langues',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            languages: {
                                                type: 'array',
                                                items: {
                                                    '$ref': '#/components/schemas/Language'
                                                }
                                            },
                                            total: {
                                                type: 'integer',
                                                example: 150
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/search': {
                get: {
                    tags: ['Search'],
                    summary: 'Rechercher dans le dictionnaire',
                    description: 'Recherche des termes dans le dictionnaire',
                    security: [
                        { 'BearerAuth': [] },
                        { 'OAuth2': ['search'] }
                    ],
                    parameters: [
                        {
                            name: 'query',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                                example: 'eau'
                            },
                            description: 'Terme à rechercher'
                        },
                        {
                            name: 'fromLang',
                            in: 'query',
                            schema: {
                                type: 'string',
                                example: 'french'
                            },
                            description: 'Langue source'
                        },
                        {
                            name: 'toLang',
                            in: 'query',
                            schema: {
                                type: 'string',
                                example: 'maya-yucateco'
                            },
                            description: 'Langue cible'
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            schema: {
                                type: 'integer',
                                default: 10,
                                minimum: 1,
                                maximum: 100
                            },
                            description: 'Nombre maximum de résultats'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Résultats de recherche',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            results: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        term: {
                                                            type: 'string',
                                                            example: 'eau'
                                                        },
                                                        translation: {
                                                            type: 'string',
                                                            example: 'ha\''
                                                        },
                                                        context: {
                                                            type: 'string',
                                                            example: 'liquide vital'
                                                        }
                                                    }
                                                }
                                            },
                                            total: {
                                                type: 'integer',
                                                example: 5
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    /**
     * Génère la documentation complète en JSON
     */
    generateJSON() {
        return JSON.stringify(this.apiSpec, null, 2);
    }

    /**
     * Génère la documentation complète en YAML
     */
    generateYAML() {
        return yaml.dump(this.apiSpec, {
            indent: 2,
            lineWidth: 120,
            noRefs: true
        });
    }

    /**
     * Génère la documentation Markdown
     */
    generateMarkdown() {
        let markdown = `# Maya Voice Translator API Documentation

${this.apiSpec.info.description}

**Version:** ${this.apiSpec.info.version}  
**Contact:** ${this.apiSpec.info.contact.email}  
**License:** ${this.apiSpec.info.license.name}

## Serveurs

`;

        this.apiSpec.servers.forEach(server => {
            markdown += `- **${server.description}:** \`${server.url}\`\n`;
        });

        markdown += `\n## Authentification

Cette API utilise OAuth2 avec les flow suivants :

### Authorization Code Flow
Pour les applications web et mobiles avec interface utilisateur.

\`\`\`
GET /oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=translate%20voice
\`\`\`

### Client Credentials Flow
Pour les applications serveur-à-serveur.

\`\`\`
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=translate
\`\`\`

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
\`\`\`json
{
  "text": "Bonjour",
  "fromLang": "french",
  "toLang": "maya-yucateco",
  "options": {
    "enableCache": true,
    "fallbackToOffline": true
  }
}
\`\`\`

**Exemple de réponse :**
\`\`\`json
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
\`\`\`

### Langues supportées

#### GET /languages
Retourne la liste de toutes les langues supportées.

**Authentification requise :** Non

**Exemple de réponse :**
\`\`\`json
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
\`\`\`

### Recherche

#### GET /search
Recherche des termes dans le dictionnaire.

**Authentification requise :** Oui (scope: search)

**Paramètres :**
- \`query\` (required): Terme à rechercher
- \`fromLang\` (optional): Langue source
- \`toLang\` (optional): Langue cible
- \`limit\` (optional): Nombre de résultats (défaut: 10)

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
\`\`\`bash
npm install maya-translator-sdk
\`\`\`

\`\`\`javascript
import { MayaTranslatorSDK } from 'maya-translator-sdk';

const sdk = new MayaTranslatorSDK({
  apiBaseUrl: 'https://api.mayatranslator.com/api'
});

await sdk.authenticate('username', 'password');
const result = await sdk.translate('Bonjour', 'french', 'maya-yucateco');
\`\`\`

### Python
\`\`\`bash
pip install maya-translator-sdk
\`\`\`

\`\`\`python
from maya_translator_sdk import MayaTranslatorSDK

sdk = MayaTranslatorSDK(api_base_url='https://api.mayatranslator.com/api')
sdk.authenticate('username', 'password')
result = sdk.translate('Bonjour', 'french', 'maya-yucateco')
\`\`\`

### cURL
\`\`\`bash
# Authentification
curl -X POST "https://api.mayatranslator.com/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username": "demo", "password": "demo123"}'

# Traduction
curl -X POST "https://api.mayatranslator.com/api/translate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"text": "Bonjour", "fromLang": "french", "toLang": "maya-yucateco"}'
\`\`\`

## Support

- **Email :** ${this.apiSpec.info.contact.email}
- **Documentation :** https://docs.mayatranslator.com
- **GitHub :** https://github.com/mayatranslator/api
- **Status :** https://status.mayatranslator.com

`;

        return markdown;
    }

    /**
     * Génère des tests automatiques pour l'API
     */
    generateAPITests() {
        return `/**
 * 🧪 Tests automatiques pour l'API Maya Translator
 * Tests complets pour tous les endpoints
 */

const API_BASE_URL = 'http://localhost:3000/api';
let authToken = null;

async function runAPITests() {
    console.log('🧪 Démarrage des tests API Maya Translator');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        errors: []
    };

    // Tests d'authentification
    await testAuthentication(results);
    
    // Tests de traduction
    await testTranslation(results);
    
    // Tests de recherche
    await testSearch(results);
    
    // Tests des langues
    await testLanguages(results);
    
    // Tests de santé
    await testHealth(results);
    
    // Rapport final
    console.log(\`\\n📊 Résultats des tests :\`);
    console.log(\`✅ Réussis : \${results.passed}/\${results.total}\`);
    console.log(\`❌ Échoués : \${results.failed}/\${results.total}\`);
    
    if (results.errors.length > 0) {
        console.log(\`\\n🔍 Erreurs détectées :\`);
        results.errors.forEach((error, index) => {
            console.log(\`\${index + 1}. \${error}\`);
        });
    }
    
    return results;
}

async function testAuthentication(results) {
    console.log('\\n🔐 Tests d\\'authentification');
    
    // Test de connexion valide
    await runTest('POST /auth/login (valide)', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/auth/login\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'demo',
                password: 'demo123'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.token) {
            authToken = data.token;
            return { success: true };
        }
        
        throw new Error(\`Authentification échouée: \${data.error || 'Unknown error'}\`);
    });
    
    // Test de connexion invalide
    await runTest('POST /auth/login (invalide)', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/auth/login\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'invalid',
                password: 'invalid'
            })
        });
        
        if (response.status === 401) {
            return { success: true };
        }
        
        throw new Error('Devrait retourner 401 pour des identifiants invalides');
    });
}

async function testTranslation(results) {
    console.log('\\n🌐 Tests de traduction');
    
    if (!authToken) {
        console.log('⚠️  Token manquant, skip des tests de traduction');
        return;
    }
    
    // Test de traduction basique
    await runTest('POST /translate (basique)', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/translate\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({
                text: 'Bonjour',
                fromLang: 'french',
                toLang: 'maya-yucateco'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.translation) {
            return { success: true, data };
        }
        
        throw new Error(\`Traduction échouée: \${data.error || 'Unknown error'}\`);
    });
    
    // Test de traduction sans token
    await runTest('POST /translate (sans auth)', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/translate\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Hello',
                fromLang: 'english',
                toLang: 'spanish'
            })
        });
        
        if (response.status === 401) {
            return { success: true };
        }
        
        throw new Error('Devrait retourner 401 sans authentification');
    });
    
    // Test de paramètres manquants
    await runTest('POST /translate (paramètres manquants)', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/translate\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({
                text: 'Hello'
                // fromLang et toLang manquants
            })
        });
        
        if (response.status === 400) {
            return { success: true };
        }
        
        throw new Error('Devrait retourner 400 pour des paramètres manquants');
    });
}

async function testSearch(results) {
    console.log('\\n🔍 Tests de recherche');
    
    if (!authToken) {
        console.log('⚠️  Token manquant, skip des tests de recherche');
        return;
    }
    
    // Test de recherche basique
    await runTest('GET /search', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/search?query=eau&limit=5\`, {
            headers: {
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && Array.isArray(data.results)) {
            return { success: true, data };
        }
        
        throw new Error(\`Recherche échouée: \${data.error || 'Unknown error'}\`);
    });
}

async function testLanguages(results) {
    console.log('\\n🌍 Tests des langues');
    
    // Test de récupération des langues
    await runTest('GET /languages', results, async () => {
        const response = await fetch(\`\${API_BASE_URL}/languages\`);
        const data = await response.json();
        
        if (response.ok && data.success && Array.isArray(data.languages)) {
            return { success: true, data };
        }
        
        throw new Error(\`Récupération des langues échouée: \${data.error || 'Unknown error'}\`);
    });
}

async function testHealth(results) {
    console.log('\\n❤️  Tests de santé');
    
    // Test du endpoint de santé
    await runTest('GET /health', results, async () => {
        const response = await fetch(\`\${API_BASE_URL.replace('/api', '')}/health\`);
        const data = await response.json();
        
        if (response.ok && data.status === 'ok') {
            return { success: true, data };
        }
        
        throw new Error(\`Health check échoué: \${data.error || 'Unknown error'}\`);
    });
}

async function runTest(testName, results, testFunction) {
    results.total++;
    
    try {
        const result = await testFunction();
        console.log(\`✅ \${testName}\`);
        results.passed++;
        return result;
    } catch (error) {
        console.log(\`❌ \${testName}: \${error.message}\`);
        results.failed++;
        results.errors.push(\`\${testName}: \${error.message}\`);
        return { success: false, error: error.message };
    }
}

// Exécution des tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAPITests };
} else {
    runAPITests().catch(console.error);
}
`;
    }

    /**
     * Génère des exemples d'utilisation pour différents langages
     */
    generateLanguageExamples() {
        return {
            javascript: this.generateJavaScriptExample(),
            python: this.generatePythonExample(),
            curl: this.generateCurlExample(),
            postman: this.generatePostmanCollection()
        };
    }

    generateJavaScriptExample() {
        return `/**
 * Exemple d'utilisation JavaScript/Node.js
 */

const fetch = require('node-fetch');

class MayaTranslatorClient {
    constructor(apiBaseUrl = 'http://localhost:3000/api') {
        this.apiBaseUrl = apiBaseUrl;
        this.token = null;
    }

    async authenticate(username, password) {
        const response = await fetch(\`\${this.apiBaseUrl}/auth/login\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            this.token = data.token;
            return data;
        }
        throw new Error(data.error);
    }

    async translate(text, fromLang, toLang) {
        const response = await fetch(\`\${this.apiBaseUrl}/translate\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${this.token}\`
            },
            body: JSON.stringify({ text, fromLang, toLang })
        });

        const data = await response.json();
        if (data.success) {
            return data.translation;
        }
        throw new Error(data.error);
    }

    async getSupportedLanguages() {
        const response = await fetch(\`\${this.apiBaseUrl}/languages\`);
        const data = await response.json();
        return data.languages;
    }
}

// Utilisation
async function example() {
    const client = new MayaTranslatorClient();
    
    try {
        await client.authenticate('demo', 'demo123');
        
        const translation = await client.translate(
            'Bonjour le monde',
            'french',
            'maya-yucateco'
        );
        
        console.log('Traduction:', translation.translatedText);
        
        const languages = await client.getSupportedLanguages();
        console.log(\`Langues supportées: \${languages.length}\`);
        
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}

example();`;
    }

    generatePythonExample() {
        return `"""
Exemple d'utilisation Python
"""

import requests
import json

class MayaTranslatorClient:
    def __init__(self, api_base_url='http://localhost:3000/api'):
        self.api_base_url = api_base_url
        self.token = None

    def authenticate(self, username, password):
        response = requests.post(
            f'{self.api_base_url}/auth/login',
            json={'username': username, 'password': password}
        )
        
        data = response.json()
        if data.get('success'):
            self.token = data['token']
            return data
        raise Exception(data.get('error', 'Authentication failed'))

    def translate(self, text, from_lang, to_lang):
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f'{self.api_base_url}/translate',
            json={'text': text, 'fromLang': from_lang, 'toLang': to_lang},
            headers=headers
        )
        
        data = response.json();
        if data.get('success'):
            return data['translation']
        raise Exception(data.get('error', 'Translation failed'))

    def get_supported_languages(self):
        response = requests.get(f'{self.api_base_url}/languages')
        data = response.json()
        return data.get('languages', [])

# Utilisation
def example():
    client = MayaTranslatorClient()
    
    try:
        client.authenticate('demo', 'demo123')
        
        translation = client.translate(
            'Bonjour le monde',
            'french',
            'maya-yucateco'
        )
        
        print(f"Traduction: {translation['translatedText']}")
        
        languages = client.get_supported_languages()
        print(f"Langues supportées: {len(languages)}")
        
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == '__main__':
    example()`;
    }    generateCurlExample() {
        return `#!/bin/bash

# Maya Translator API - Exemples cURL

API_BASE="http://localhost:3000/api"

echo "🔐 Authentification..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username": "demo", "password": "demo123"}')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
    echo "✅ Token obtenu"
    
    echo "🌐 Traduction..."
    curl -X POST "$API_BASE/translate" \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer $TOKEN" \\
      -d '{"text": "Bonjour le monde", "fromLang": "french", "toLang": "maya-yucateco"}' | jq '.'
    
    echo "🔍 Recherche..."
    curl -X GET "$API_BASE/search?query=eau&limit=3" \\
      -H "Authorization: Bearer $TOKEN" | jq '.'
    
    echo "🌍 Langues supportées..."
    curl -X GET "$API_BASE/languages" | jq '.languages[:5]'
    
else
    echo "❌ Échec de l'authentification"
    echo $TOKEN_RESPONSE | jq '.'
fi

echo "❤️  Vérification de santé..."
curl -X GET "http://localhost:3000/health" | jq '.'`;
    }

    generatePostmanCollection() {
        return JSON.stringify({
            info: {
                name: "Maya Voice Translator API",
                description: "Collection Postman pour l'API Maya Translator",
                version: "1.0.0"
            },
            variable: [
                {
                    key: "baseUrl",
                    value: "http://localhost:3000/api",
                    type: "string"
                },
                {
                    key: "token",
                    value: "",
                    type: "string"
                }
            ],
            item: [
                {
                    name: "Authentication",
                    item: [
                        {
                            name: "Login",
                            request: {
                                method: "POST",
                                header: [
                                    {
                                        key: "Content-Type",
                                        value: "application/json"
                                    }
                                ],
                                body: {
                                    mode: "raw",
                                    raw: JSON.stringify({
                                        username: "demo",
                                        password: "demo123"
                                    })
                                },
                                url: {
                                    raw: "{{baseUrl}}/auth/login",
                                    host: ["{{baseUrl}}"],
                                    path: ["auth", "login"]
                                }
                            },
                            event: [
                                {
                                    listen: "test",
                                    script: {
                                        exec: [
                                            "if (pm.response.code === 200) {",
                                            "    const data = pm.response.json();",
                                            "    if (data.success && data.token) {",
                                            "        pm.collectionVariables.set('token', data.token);",
                                            "        pm.test('Token obtenu avec succès', () => {",
                                            "            pm.expect(data.token).to.be.a('string');",
                                            "        });",
                                            "    }",
                                            "}"
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Translation",
                    item: [
                        {
                            name: "Translate Text",
                            request: {
                                method: "POST",
                                header: [
                                    {
                                        key: "Content-Type",
                                        value: "application/json"
                                    },
                                    {
                                        key: "Authorization",
                                        value: "Bearer {{token}}"
                                    }
                                ],
                                body: {
                                    mode: "raw",
                                    raw: JSON.stringify({
                                        text: "Bonjour le monde",
                                        fromLang: "french",
                                        toLang: "maya-yucateco"
                                    })
                                },
                                url: {
                                    raw: "{{baseUrl}}/translate",
                                    host: ["{{baseUrl}}"],
                                    path: ["translate"]
                                }
                            }
                        },
                        {
                            name: "Get Supported Languages",
                            request: {
                                method: "GET",
                                url: {
                                    raw: "{{baseUrl}}/languages",
                                    host: ["{{baseUrl}}"],
                                    path: ["languages"]
                                }
                            }
                        }
                    ]
                },
                {
                    name: "Search",
                    item: [
                        {
                            name: "Search Dictionary",
                            request: {
                                method: "GET",
                                header: [
                                    {
                                        key: "Authorization",
                                        value: "Bearer {{token}}"
                                    }
                                ],
                                url: {
                                    raw: "{{baseUrl}}/search?query=eau&limit=5",
                                    host: ["{{baseUrl}}"],
                                    path: ["search"],
                                    query: [
                                        {
                                            key: "query",
                                            value: "eau"
                                        },
                                        {
                                            key: "limit",
                                            value: "5"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        }, null, 2);
    }

    /**
     * Sauvegarde tous les fichiers de documentation
     */
    async saveDocumentation(outputDir = './docs') {
        try {
            // Création du dossier de documentation
            await fs.mkdir(outputDir, { recursive: true });

            // Documentation OpenAPI en JSON
            await fs.writeFile(
                path.join(outputDir, 'openapi.json'),
                this.generateJSON()
            );

            // Documentation OpenAPI en YAML
            await fs.writeFile(
                path.join(outputDir, 'openapi.yaml'),
                this.generateYAML()
            );

            // Documentation Markdown
            await fs.writeFile(
                path.join(outputDir, 'README.md'),
                this.generateMarkdown()
            );

            // Tests automatiques
            await fs.writeFile(
                path.join(outputDir, 'api-tests.js'),
                this.generateAPITests()
            );

            // Exemples de code
            const examples = this.generateLanguageExamples();
            
            await fs.mkdir(path.join(outputDir, 'examples'), { recursive: true });
            
            await fs.writeFile(
                path.join(outputDir, 'examples', 'javascript.js'),
                examples.javascript
            );

            await fs.writeFile(
                path.join(outputDir, 'examples', 'python.py'),
                examples.python
            );

            await fs.writeFile(
                path.join(outputDir, 'examples', 'curl.sh'),
                examples.curl
            );

            await fs.writeFile(
                path.join(outputDir, 'examples', 'postman.json'),
                examples.postman
            );

            console.log(`📚 Documentation générée dans ${outputDir}`);
            return {
                success: true,
                outputDir,
                files: [
                    'openapi.json',
                    'openapi.yaml',
                    'README.md',
                    'api-tests.js',
                    'examples/javascript.js',
                    'examples/python.py',
                    'examples/curl.sh',
                    'examples/postman.json'
                ]
            };

        } catch (error) {
            console.error('Erreur lors de la génération de la documentation:', error);
            throw error;
        }
    }
}

export default APIDocumentationService;

/**
 * 🛠️ SDK Maya Translator pour développeurs externes
 * Kit de développement logiciel pour intégrer facilement les fonctionnalités de traduction Maya
 * Support JavaScript/TypeScript, Python, curl et webhooks
 */

export class MayaTranslatorSDK {
    constructor(options = {}) {
        this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:3000/api';
        this.apiKey = options.apiKey || null;
        this.timeout = options.timeout || 30000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        
        // Token d'authentification
        this.authToken = null;
        this.tokenExpiry = null;
        
        // Configuration par défaut
        this.defaultOptions = {
            enableCache: true,
            fallbackToOffline: true,
            useSemanticSearch: true,
            voiceQuality: 'high',
            ...options.defaults
        };
    }

    /**
     * Authentification avec l'API
     */
    async authenticate(username, password) {
        try {
            const response = await this.makeRequest('POST', '/auth/login', {
                username,
                password
            }, false);

            if (response.success) {
                this.authToken = response.token;
                this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
                return {
                    success: true,
                    token: response.token,
                    expiresIn: response.expiresIn
                };
            }

            throw new Error(response.error || 'Échec de l\'authentification');

        } catch (error) {
            throw new Error(`Erreur d'authentification: ${error.message}`);
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    async register(username, password, email) {
        try {
            return await this.makeRequest('POST', '/auth/register', {
                username,
                password,
                email
            }, false);
        } catch (error) {
            throw new Error(`Erreur d'inscription: ${error.message}`);
        }
    }

    /**
     * Traduction de texte
     */
    async translate(text, fromLang, toLang, options = {}) {
        const requestOptions = { ...this.defaultOptions, ...options };
        
        try {
            const response = await this.makeRequest('POST', '/translate', {
                text,
                fromLang,
                toLang,
                options: requestOptions
            });

            return {
                success: true,
                originalText: text,
                translatedText: response.translation?.translatedText || response.translation,
                fromLanguage: fromLang,
                toLanguage: toLang,
                confidence: response.translation?.confidence || 0.9,
                alternatives: response.translation?.alternatives || [],
                metadata: response.metadata
            };

        } catch (error) {
            // Fallback hors ligne si activé
            if (requestOptions.fallbackToOffline) {
                console.warn('API indisponible, tentative de traduction hors ligne...');
                return await this.translateOffline(text, fromLang, toLang);
            }
            throw error;
        }
    }

    /**
     * Traduction hors ligne (fallback)
     */
    async translateOffline(text, fromLang, toLang) {
        // Simulation d'une traduction hors ligne basique
        return {
            success: true,
            originalText: text,
            translatedText: `[OFFLINE] ${text}`,
            fromLanguage: fromLang,
            toLanguage: toLang,
            confidence: 0.6,
            alternatives: [],
            isOffline: true,
            metadata: {
                source: 'offline-dictionary',
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Détection automatique de langue
     */
    async detectLanguage(text) {
        try {
            return await this.makeRequest('POST', '/detect', { text });
        } catch (error) {
            throw new Error(`Erreur de détection de langue: ${error.message}`);
        }
    }

    /**
     * Obtenir les langues supportées
     */
    async getSupportedLanguages() {
        try {
            return await this.makeRequest('GET', '/languages', null, false);
        } catch (error) {
            // Retourner une liste basique en cas d'erreur
            return {
                success: true,
                languages: [
                    { code: 'maya-yucateco', name: 'Maya Yucatèque', family: 'maya' },
                    { code: 'maya-quiche', name: 'Maya K\'iche\'', family: 'maya' },
                    { code: 'nahuatl', name: 'Nahuatl', family: 'uto-aztecan' },
                    { code: 'quechua', name: 'Quechua', family: 'quechuan' },
                    { code: 'french', name: 'Français', family: 'romance' },
                    { code: 'spanish', name: 'Español', family: 'romance' },
                    { code: 'english', name: 'English', family: 'germanic' }
                ]
            };
        }
    }

    /**
     * Recherche dans le dictionnaire
     */
    async searchDictionary(query, fromLang = null, toLang = null, limit = 10) {
        try {
            const params = new URLSearchParams({
                query,
                limit: limit.toString()
            });
            
            if (fromLang) params.append('fromLang', fromLang);
            if (toLang) params.append('toLang', toLang);

            return await this.makeRequest('GET', `/search?${params.toString()}`);
        } catch (error) {
            throw new Error(`Erreur de recherche: ${error.message}`);
        }
    }

    /**
     * Obtenir des suggestions
     */
    async getSuggestions(text, language = null, limit = 5) {
        try {
            const params = new URLSearchParams({
                text,
                limit: limit.toString()
            });
            
            if (language) params.append('language', language);

            return await this.makeRequest('GET', `/suggestions?${params.toString()}`);
        } catch (error) {
            throw new Error(`Erreur de suggestions: ${error.message}`);
        }
    }

    /**
     * Synthèse vocale (Text-to-Speech)
     */
    async textToSpeech(text, language, voice = 'default') {
        try {
            return await this.makeRequest('POST', '/tts', {
                text,
                language,
                voice
            });
        } catch (error) {
            throw new Error(`Erreur de synthèse vocale: ${error.message}`);
        }
    }

    /**
     * Reconnaissance vocale (Speech-to-Text)
     */
    async speechToText(audioData, language = null) {
        try {
            return await this.makeRequest('POST', '/stt', {
                audioData,
                language
            });
        } catch (error) {
            throw new Error(`Erreur de reconnaissance vocale: ${error.message}`);
        }
    }

    /**
     * Recherche sémantique avancée
     */
    async semanticSearch(query, language = null, limit = 10) {
        try {
            return await this.makeRequest('POST', '/semantic/search', {
                query,
                language,
                limit
            });
        } catch (error) {
            throw new Error(`Erreur de recherche sémantique: ${error.message}`);
        }
    }

    /**
     * Trouver des phrases similaires
     */
    async findSimilarPhrases(text, language = null, threshold = 0.8, limit = 5) {
        try {
            return await this.makeRequest('POST', '/semantic/similar', {
                text,
                language,
                threshold,
                limit
            });
        } catch (error) {
            throw new Error(`Erreur de recherche de phrases similaires: ${error.message}`);
        }
    }

    /**
     * Obtenir le dictionnaire d'une langue
     */
    async getDictionary(language, category = null, limit = 100) {
        try {
            const params = new URLSearchParams({
                limit: limit.toString()
            });
            
            if (category) params.append('category', category);

            return await this.makeRequest('GET', `/dictionary/${language}?${params.toString()}`);
        } catch (error) {
            throw new Error(`Erreur de récupération du dictionnaire: ${error.message}`);
        }
    }

    /**
     * Obtenir des exemples de phrases
     */
    async getExamples(language, count = 10) {
        try {
            const params = new URLSearchParams({
                count: count.toString()
            });

            return await this.makeRequest('GET', `/examples/${language}?${params.toString()}`);
        } catch (error) {
            throw new Error(`Erreur de récupération des exemples: ${error.message}`);
        }
    }

    /**
     * Obtenir les conseils de prononciation
     */
    async getPronunciationTips(language) {
        try {
            return await this.makeRequest('GET', `/pronunciation/${language}`);
        } catch (error) {
            throw new Error(`Erreur de récupération des conseils de prononciation: ${error.message}`);
        }
    }

    /**
     * Traduction en lot (batch)
     */
    async batchTranslate(translations, options = {}) {
        const results = [];
        const concurrent = options.concurrent || 3;
        
        // Traitement par groupes pour éviter la surcharge
        for (let i = 0; i < translations.length; i += concurrent) {
            const batch = translations.slice(i, i + concurrent);
            const promises = batch.map(t => 
                this.translate(t.text, t.fromLang, t.toLang, options)
                    .catch(error => ({ error: error.message, ...t }))
            );
            
            const batchResults = await Promise.all(promises);
            results.push(...batchResults);
            
            // Délai entre les lots pour respecter les limites de taux
            if (i + concurrent < translations.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        return {
            success: true,
            results,
            total: translations.length,
            successCount: results.filter(r => !r.error).length,
            errorCount: results.filter(r => r.error).length
        };
    }

    /**
     * Configuration de webhooks pour les notifications
     */
    async configureWebhook(url, events = ['translation_complete', 'batch_complete']) {
        try {
            return await this.makeRequest('POST', '/webhooks', {
                url,
                events,
                active: true
            });
        } catch (error) {
            throw new Error(`Erreur de configuration webhook: ${error.message}`);
        }
    }

    /**
     * Gestion du cache local
     */
    enableCache() {
        this.cache = new Map();
        this.cacheEnabled = true;
        console.log('Cache local activé');
    }

    disableCache() {
        this.cache = null;
        this.cacheEnabled = false;
        console.log('Cache local désactivé');
    }

    clearCache() {
        if (this.cache) {
            this.cache.clear();
            console.log('Cache local vidé');
        }
    }

    /**
     * Requête HTTP avec gestion d'erreurs et retry
     */
    async makeRequest(method, endpoint, data = null, requireAuth = true) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        
        // Vérification du token d'authentification
        if (requireAuth && (!this.authToken || this.isTokenExpired())) {
            throw new Error('Token d\'authentification requis ou expiré');
        }

        // Vérification du cache
        if (method === 'GET' && this.cacheEnabled && this.cache) {
            const cacheKey = `${method}:${url}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MayaTranslatorSDK/1.0.0'
            }
        };

        if (requireAuth && this.authToken) {
            options.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                options.signal = controller.signal;
                
                const response = await fetch(url, options);
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Erreur de réponse' }));
                    throw new Error(errorData.error || `HTTP ${response.status}`);
                }
                
                const result = await response.json();
                
                // Mise en cache pour les requêtes GET
                if (method === 'GET' && this.cacheEnabled && this.cache) {
                    const cacheKey = `${method}:${url}`;
                    this.cache.set(cacheKey, result);
                }
                
                return result;
                
            } catch (error) {
                lastError = error;
                
                if (attempt < this.retryAttempts) {
                    console.warn(`Tentative ${attempt} échouée, retry dans ${this.retryDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                }
            }
        }
        
        throw new Error(`Échec après ${this.retryAttempts} tentatives: ${lastError.message}`);
    }

    /**
     * Vérifie si le token est expiré
     */
    isTokenExpired() {
        return !this.tokenExpiry || new Date() >= this.tokenExpiry;
    }

    /**
     * Obtenir des statistiques d'utilisation
     */
    getUsageStats() {
        return {
            apiBaseUrl: this.apiBaseUrl,
            isAuthenticated: !!this.authToken && !this.isTokenExpired(),
            cacheEnabled: this.cacheEnabled,
            cacheSize: this.cache ? this.cache.size : 0,
            defaultOptions: this.defaultOptions
        };
    }

    /**
     * Générer du code d'exemple pour différents langages
     */
    static generateExamples() {
        return {
            javascript: `
// Installation: npm install maya-translator-sdk

import { MayaTranslatorSDK } from 'maya-translator-sdk';

const sdk = new MayaTranslatorSDK({
    apiBaseUrl: 'https://api.mayatranslator.com/api',
    timeout: 30000,
    retryAttempts: 3
});

// Authentification
await sdk.authenticate('username', 'password');

// Traduction simple
const result = await sdk.translate('Bonjour', 'french', 'maya-yucateco');
console.log(result.translatedText);

// Traduction en lot
const translations = [
    { text: 'Bonjour', fromLang: 'french', toLang: 'maya-yucateco' },
    { text: 'Au revoir', fromLang: 'french', toLang: 'maya-yucateco' }
];
const batchResult = await sdk.batchTranslate(translations);
`,
            python: `
# Installation: pip install maya-translator-sdk

from maya_translator_sdk import MayaTranslatorSDK

sdk = MayaTranslatorSDK(
    api_base_url='https://api.mayatranslator.com/api',
    timeout=30,
    retry_attempts=3
)

# Authentification
sdk.authenticate('username', 'password')

# Traduction simple
result = sdk.translate('Bonjour', 'french', 'maya-yucateco')
print(result['translatedText'])

# Recherche dans le dictionnaire
search_result = sdk.search_dictionary('eau', 'french', 'maya-yucateco')
`,
            curl: `
# Authentification
curl -X POST "https://api.mayatranslator.com/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username": "your_username", "password": "your_password"}'

# Traduction
curl -X POST "https://api.mayatranslator.com/api/translate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"text": "Bonjour", "fromLang": "french", "toLang": "maya-yucateco"}'

# Langues supportées
curl -X GET "https://api.mayatranslator.com/api/languages"
`,
            webhook: `
// Configuration d'un webhook pour les notifications
await sdk.configureWebhook('https://your-app.com/webhook', [
    'translation_complete',
    'batch_complete',
    'error_occurred'
]);

// Votre endpoint recevra des POSTs avec cette structure:
{
    "event": "translation_complete",
    "data": {
        "originalText": "Bonjour",
        "translatedText": "Ba'ax ka wa'alik",
        "fromLang": "french",
        "toLang": "maya-yucateco"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
`
        };
    }
}

/**
 * Fonction helper pour créer une instance SDK rapidement
 */
export function createMayaSDK(options = {}) {
    return new MayaTranslatorSDK(options);
}

/**
 * Types TypeScript pour une meilleure intégration
 */
export const SDKTypes = `
interface TranslationOptions {
    enableCache?: boolean;
    fallbackToOffline?: boolean;
    useSemanticSearch?: boolean;
    voiceQuality?: 'low' | 'medium' | 'high';
}

interface TranslationResult {
    success: boolean;
    originalText: string;
    translatedText: string;
    fromLanguage: string;
    toLanguage: string;
    confidence: number;
    alternatives: string[];
    metadata: any;
    isOffline?: boolean;
}

interface Language {
    code: string;
    name: string;
    family: string;
    nativeName?: string;
    direction?: 'ltr' | 'rtl';
}

interface SearchResult {
    term: string;
    translation: string;
    context: string;
    frequency: number;
    category: string;
}
`;

export default MayaTranslatorSDK;

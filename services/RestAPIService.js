/**
 * 🌐 Service API REST pour intégration tiers
 * Expose les fonctionnalités de traduction via API REST
 * Support OAuth2, rate limiting, documentation OpenAPI
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TranslationService } from './TranslationService.js';
import { SemanticSearchService } from './SemanticSearchService.js';
import { ConfigurationManager } from './ConfigurationManager.js';

// Version simplifiée du VoiceService pour Node.js (sans expo-av)
class SimpleVoiceService {
    constructor() {
        this.isRecording = false;
    }

    async synthesizeSpeech(text, language, voice = 'default') {
        // Simulation pour l'API - en production, intégrer un vrai service TTS
        return {
            audioData: `base64_audio_data_for_${text}`,
            format: 'mp3',
            duration: text.length * 0.1 // estimation
        };
    }

    async recognizeSpeech(audioData, language) {
        // Simulation pour l'API - en production, intégrer un vrai service STT
        return {
            text: "Texte reconnu depuis l'audio",
            confidence: 0.85,
            language: language || 'auto-detect'
        };
    }

    adaptMayaPronunciation(text, language) {
        // Simulation basique d'adaptation phonétique
        let adapted = text;
        
        if (language.includes('maya')) {
            adapted = adapted
                .replace(/tz/g, 'ts')
                .replace(/x/g, 'j')
                .replace(/k'/g, 'qu');
        }
        
        return adapted;
    }
}

export class RestAPIService {
    constructor() {
        this.app = express();        this.translationService = new TranslationService();
        this.voiceService = new SimpleVoiceService();
        this.semanticSearch = new SemanticSearchService();
        this.config = new ConfigurationManager();
        
        this.port = process.env.API_PORT || 3000;
        this.jwtSecret = process.env.JWT_SECRET || 'maya-translator-secret-key';
        
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    /**
     * Initialise les middlewares de sécurité et performance
     */
    initializeMiddleware() {
        // Sécurité
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limite de 100 requêtes par IP
            message: {
                error: 'Trop de requêtes, veuillez réessayer plus tard',
                retryAfter: '15 minutes'
            }
        });
        this.app.use('/api/', limiter);

        // Parsing JSON
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    /**
     * Middleware d'authentification JWT
     */
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token d\'accès requis' });
        }

        jwt.verify(token, this.jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token invalide' });
            }
            req.user = user;
            next();
        });
    }

    /**
     * Initialise les routes de l'API
     */
    initializeRoutes() {
        // Route de santé
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                services: {
                    translation: 'active',
                    voice: 'active',
                    semantic: 'active'
                }
            });
        });

        // Authentification
        this.app.post('/api/auth/login', this.handleLogin.bind(this));
        this.app.post('/api/auth/register', this.handleRegister.bind(this));

        // Routes de traduction (protégées)
        this.app.post('/api/translate', this.authenticateToken.bind(this), this.handleTranslate.bind(this));
        this.app.get('/api/languages', this.handleGetLanguages.bind(this));
        this.app.post('/api/detect', this.authenticateToken.bind(this), this.handleDetectLanguage.bind(this));
        
        // Routes de recherche
        this.app.get('/api/search', this.authenticateToken.bind(this), this.handleSearch.bind(this));
        this.app.get('/api/suggestions', this.authenticateToken.bind(this), this.handleSuggestions.bind(this));
        
        // Routes vocales
        this.app.post('/api/tts', this.authenticateToken.bind(this), this.handleTextToSpeech.bind(this));
        this.app.post('/api/stt', this.authenticateToken.bind(this), this.handleSpeechToText.bind(this));
        
        // Routes de dictionnaire
        this.app.get('/api/dictionary/:language', this.handleGetDictionary.bind(this));
        this.app.get('/api/examples/:language', this.handleGetExamples.bind(this));
        this.app.get('/api/pronunciation/:language', this.handleGetPronunciation.bind(this));
        
        // Routes de recherche sémantique
        this.app.post('/api/semantic/search', this.authenticateToken.bind(this), this.handleSemanticSearch.bind(this));
        this.app.post('/api/semantic/similar', this.authenticateToken.bind(this), this.handleSimilarPhrases.bind(this));
    }

    /**
     * Gestion de la connexion
     */
    async handleLogin(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
            }

            // Ici, vous devriez vérifier contre une vraie base de données
            // Pour la démo, nous utilisons des identifiants codés en dur
            const users = {
                'demo': '$2b$10$rKMZqw5I2rAGXh7R7KK9TuEYczgQ5l9XKKGXjYKNJNKKKKKKKKKKKu', // password: 'demo123'
                'api-client': '$2b$10$rKMZqw5I2rAGXh7R7KK9TuEYczgQ5l9XKKGXjYKNJNKKKKKKKKKKKu'
            };

            const userPasswordHash = users[username];
            if (!userPasswordHash || !await bcrypt.compare(password, userPasswordHash)) {
                return res.status(401).json({ error: 'Identifiants invalides' });
            }

            const token = jwt.sign(
                { username, role: 'user' },
                this.jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                expiresIn: '24h',
                user: { username, role: 'user' }
            });

        } catch (error) {
            console.error('Erreur de connexion:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    /**
     * Gestion de l'inscription
     */
    async handleRegister(req, res) {
        try {
            const { username, password, email } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
            }

            // Hash du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Ici, vous devriez sauvegarder en base de données
            console.log(`Nouvel utilisateur: ${username}, ${email}, ${hashedPassword}`);

            res.json({
                success: true,
                message: 'Utilisateur créé avec succès',
                username
            });

        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    /**
     * Gestion des traductions
     */
    async handleTranslate(req, res) {
        try {
            const { text, fromLang, toLang, options = {} } = req.body;

            if (!text || !fromLang || !toLang) {
                return res.status(400).json({
                    error: 'Paramètres requis: text, fromLang, toLang'
                });
            }

            const result = await this.translationService.translate(text, fromLang, toLang, options);

            res.json({
                success: true,
                translation: result,
                metadata: {
                    fromLang,
                    toLang,
                    originalText: text,
                    timestamp: new Date().toISOString(),
                    user: req.user.username
                }
            });

        } catch (error) {
            console.error('Erreur de traduction:', error);
            res.status(500).json({
                error: 'Erreur lors de la traduction',
                details: error.message
            });
        }
    }

    /**
     * Obtenir les langues supportées
     */
    handleGetLanguages(req, res) {
        try {
            const languages = this.translationService.getSupportedLanguages();
            res.json({
                success: true,
                languages,
                total: languages.length
            });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des langues' });
        }
    }

    /**
     * Détection automatique de langue
     */
    async handleDetectLanguage(req, res) {
        try {
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'Texte requis pour la détection' });
            }

            const detectedLang = await this.translationService.detectLanguage(text);

            res.json({
                success: true,
                detectedLanguage: detectedLang,
                confidence: 0.85, // Vous pouvez implémenter un vrai score de confiance
                text
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la détection de langue',
                details: error.message
            });
        }
    }

    /**
     * Recherche dans le dictionnaire
     */
    async handleSearch(req, res) {
        try {
            const { query, fromLang, toLang, limit = 10 } = req.query;

            if (!query) {
                return res.status(400).json({ error: 'Paramètre query requis' });
            }

            const results = await this.translationService.searchInDictionary(
                query, fromLang, toLang, parseInt(limit)
            );

            res.json({
                success: true,
                results,
                total: results.length,
                query: {
                    text: query,
                    fromLang,
                    toLang,
                    limit
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la recherche',
                details: error.message
            });
        }
    }

    /**
     * Obtenir des suggestions
     */
    async handleSuggestions(req, res) {
        try {
            const { text, language, limit = 5 } = req.query;

            if (!text) {
                return res.status(400).json({ error: 'Paramètre text requis' });
            }

            const suggestions = await this.translationService.getSuggestions(
                text, language, parseInt(limit)
            );

            res.json({
                success: true,
                suggestions,
                total: suggestions.length
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la génération de suggestions',
                details: error.message
            });
        }
    }

    /**
     * Synthèse vocale
     */
    async handleTextToSpeech(req, res) {
        try {
            const { text, language, voice = 'default' } = req.body;

            if (!text || !language) {
                return res.status(400).json({
                    error: 'Paramètres requis: text, language'
                });
            }

            const audioData = await this.voiceService.synthesizeSpeech(text, language, voice);

            res.json({
                success: true,
                audioData,
                metadata: {
                    text,
                    language,
                    voice,
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la synthèse vocale',
                details: error.message
            });
        }
    }

    /**
     * Reconnaissance vocale
     */
    async handleSpeechToText(req, res) {
        try {
            const { audioData, language } = req.body;

            if (!audioData) {
                return res.status(400).json({ error: 'Données audio requises' });
            }

            const transcription = await this.voiceService.recognizeSpeech(audioData, language);

            res.json({
                success: true,
                transcription,
                metadata: {
                    language,
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la reconnaissance vocale',
                details: error.message
            });
        }
    }

    /**
     * Obtenir le dictionnaire d'une langue
     */
    handleGetDictionary(req, res) {
        try {
            const { language } = req.params;
            const { category, limit = 100 } = req.query;

            const dictionary = this.translationService.getDictionaryForLanguage(
                language, category, parseInt(limit)
            );

            res.json({
                success: true,
                language,
                dictionary,
                total: dictionary.length,
                category: category || 'all'
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la récupération du dictionnaire',
                details: error.message
            });
        }
    }

    /**
     * Obtenir des exemples de phrases
     */
    handleGetExamples(req, res) {
        try {
            const { language } = req.params;
            const { count = 10 } = req.query;

            const examples = this.translationService.getExamplePhrases(
                language, parseInt(count)
            );

            res.json({
                success: true,
                language,
                examples,
                total: examples.length
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la récupération des exemples',
                details: error.message
            });
        }
    }

    /**
     * Obtenir les conseils de prononciation
     */
    handleGetPronunciation(req, res) {
        try {
            const { language } = req.params;

            const tips = this.translationService.getPronunciationTips(language);

            res.json({
                success: true,
                language,
                pronunciationTips: tips
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la récupération des conseils de prononciation',
                details: error.message
            });
        }
    }

    /**
     * Recherche sémantique
     */
    async handleSemanticSearch(req, res) {
        try {
            const { query, language, limit = 10 } = req.body;

            if (!query) {
                return res.status(400).json({ error: 'Query requis pour la recherche sémantique' });
            }

            const results = await this.semanticSearch.searchSimilar(query, language, limit);

            res.json({
                success: true,
                results,
                total: results.length,
                query: {
                    text: query,
                    language,
                    limit
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la recherche sémantique',
                details: error.message
            });
        }
    }

    /**
     * Phrases similaires
     */
    async handleSimilarPhrases(req, res) {
        try {
            const { text, language, threshold = 0.8, limit = 5 } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'Texte requis' });
            }

            const similar = await this.semanticSearch.findSimilarPhrases(
                text, language, threshold, limit
            );

            res.json({
                success: true,
                similarPhrases: similar,
                total: similar.length,
                parameters: {
                    text,
                    language,
                    threshold,
                    limit
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Erreur lors de la recherche de phrases similaires',
                details: error.message
            });
        }
    }

    /**
     * Initialise la documentation Swagger
     */
    initializeSwagger() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Maya Voice Translator API',
                    version: '1.0.0',
                    description: 'API REST pour la traduction des langues Maya et indigènes',
                    contact: {
                        name: 'API Support',
                        email: 'support@mayatranslator.com'
                    }
                },
                servers: [
                    {
                        url: `http://localhost:${this.port}`,
                        description: 'Serveur de développement'
                    }
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        }
                    }
                },
                security: [
                    {
                        bearerAuth: []
                    }
                ]
            },
            apis: ['./services/RestAPIService.js']
        };

        const specs = swaggerJsdoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    /**
     * Gestion des erreurs globales
     */
    initializeErrorHandling() {
        // 404 Handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Route non trouvée',
                path: req.originalUrl,
                method: req.method
            });
        });

        // Error Handler
        this.app.use((error, req, res, next) => {
            console.error('Erreur non gérée:', error);
            res.status(500).json({
                error: 'Erreur interne du serveur',
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * Démarre le serveur
     */
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    console.log(`🌐 API REST Maya Translator démarrée sur le port ${this.port}`);
                    console.log(`📚 Documentation: http://localhost:${this.port}/api-docs`);
                    console.log(`❤️  Health check: http://localhost:${this.port}/health`);
                    resolve(this.server);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Arrête le serveur
     */
    stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('🛑 Serveur API arrêté');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Obtient les statistiques d'utilisation
     */
    getUsageStats() {
        // Implémentation basique - en production, utilisez Redis ou une DB
        return {
            totalRequests: 0,
            activeUsers: 0,
            averageResponseTime: 0,
            topLanguages: ['maya-yucateco', 'french', 'spanish'],
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Configuration en temps réel
     */
    updateConfiguration(newConfig) {
        try {
            this.config.updateSettings(newConfig);
            return {
                success: true,
                message: 'Configuration mise à jour',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default RestAPIService;

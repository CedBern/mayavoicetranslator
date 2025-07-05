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
import fs from 'fs';
import { TranslationService } from './TranslationService.js';
import { SemanticSearchService } from './SemanticSearchService.js';
import { ConfigurationManager } from './ConfigurationManager.js';
import { SecurePaymentService } from './SecurePaymentService.js';
import { AutonomousLearningService } from './AutonomousLearningService.js';
import { PlatformAnalyticsService } from './TalkKinIntegratedPlatformService.js';

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
        this.paymentService = new SecurePaymentService();
        this.learningService = new AutonomousLearningService();
        this.analyticsService = new PlatformAnalyticsService();
        
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
     * Middleware d'authentification JWT ou API key premium
     */
    authenticatePremium(req, res, next) {
        // Vérification par API key (header x-api-key)
        const apiKey = req.headers['x-api-key'];
        if (apiKey) {
            try {
                const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
                const user = users.find(u => u.apiKey === apiKey);
                if (user && user.premium) {
                    req.user = user;
                    return next();
                }
            } catch (e) {}
            return res.status(403).json({ error: 'API key invalide ou accès non premium.' });
        }
        // Vérification par JWT (header Authorization: Bearer ...)
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const payload = jwt.verify(token, this.jwtSecret);
                const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
                const user = users.find(u => u.username === payload.username);
                    return next();
                }
            } catch (e) {
                return res.status(403).json({ error: 'Token JWT invalide ou expiré.' });
            }
        }
        return res.status(401).json({ error: 'Authentification premium requise.' });
    }

    /**
     * Middleware de logging des appels premium
     */
    logPremiumUsage(req, res, next) {
        const fs = require('fs');
        const logEntry = {
            timestamp: new Date().toISOString(),
            endpoint: req.originalUrl,
            method: req.method,
            user: req.user?.username || null,
            apiKey: req.headers['x-api-key'] || null,
            ip: req.ip
        };
        fs.appendFile('premium_usage.log', JSON.stringify(logEntry) + '\n', err => {});
        next();
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
        this.app.post('/api/translate', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleTranslate.bind(this));
        this.app.get('/api/languages', this.handleGetLanguages.bind(this));
        this.app.post('/api/detect', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleDetectLanguage.bind(this));
        
        // Routes de recherche
        this.app.get('/api/search', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleSearch.bind(this));
        this.app.get('/api/suggestions', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleSuggestions.bind(this));
        
        // Routes vocales
        this.app.post('/api/tts', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleTextToSpeech.bind(this));
        this.app.post('/api/stt', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleSpeechToText.bind(this));
        
        // Routes de dictionnaire
        this.app.get('/api/dictionary/:language', this.handleGetDictionary.bind(this));
        this.app.get('/api/examples/:language', this.handleGetExamples.bind(this));
        this.app.get('/api/pronunciation/:language', this.handleGetPronunciation.bind(this));
        
        // Routes de recherche sémantique
        this.app.post('/api/semantic/search', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleSemanticSearch.bind(this));
        this.app.post('/api/semantic/similar', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleSimilarPhrases.bind(this));
        
        // Endpoints AI & Semantic (migration)
        this.app.post('/api/ai/train-model', this.authenticatePremium.bind(this), this.handleAITrainModel.bind(this));
        this.app.post('/api/ai/vector-search', this.authenticatePremium.bind(this), this.handleAIVectorSearch.bind(this));
        this.app.get('/api/ai/orchestrator/status', this.authenticatePremium.bind(this), this.handleAIOrchestratorStatus.bind(this));
        this.app.post('/api/ai/audio-corpus', this.authenticatePremium.bind(this), this.handleAIAudioCorpus.bind(this));
        
        // Import de corpus personnel/partagé
        const importCorpusRouter = require('../api_import_corpus');
        this.app.use('/api', importCorpusRouter);

        // --- ROUTES PAIEMENT (migration/fusion) ---
        this.app.get('/api/payment/methods', this.authenticatePremium.bind(this), this.handleGetPaymentMethods.bind(this));
        this.app.post('/api/payment/intent', this.authenticatePremium.bind(this), this.handleCreatePaymentIntent.bind(this));
        this.app.post('/api/payment/confirm', this.authenticatePremium.bind(this), this.handleConfirmPayment.bind(this));
        this.app.post('/api/payment/subscribe', this.authenticatePremium.bind(this), this.handleCreateSubscription.bind(this));
        this.app.get('/api/payment/subscriptions', this.authenticatePremium.bind(this), this.handleGetSubscriptions.bind(this));
        this.app.post('/api/payment/subscription/:subscriptionId/cancel', this.authenticatePremium.bind(this), this.handleCancelSubscription.bind(this));
        this.app.post('/api/payment/refund', this.authenticatePremium.bind(this), this.handleCreateRefund.bind(this));
        this.app.get('/api/payment/stats', this.authenticatePremium.bind(this), this.handleGetPaymentStats.bind(this));
        this.app.get('/api/payment/currencies', this.authenticatePremium.bind(this), this.handleGetPaymentCurrencies.bind(this));
        this.app.post('/api/payment/convert', this.authenticatePremium.bind(this), this.handleConvertCurrency.bind(this));

        // --- ROUTES LEARNING (migration/fusion) ---
        this.app.get('/api/learning/teachers', this.authenticatePremium.bind(this), this.handleGetTeachers.bind(this));
        this.app.post('/api/learning/enroll', this.authenticatePremium.bind(this), this.handleEnrollLearning.bind(this));
        this.app.post('/api/learning/session/start', this.authenticatePremium.bind(this), this.handleStartLearningSession.bind(this));
        this.app.get('/api/learning/session/active/:classroomId', this.authenticatePremium.bind(this), this.handleGetActiveSession.bind(this));
        this.app.post('/api/learning/session/join', this.authenticatePremium.bind(this), this.handleJoinSession.bind(this));
        this.app.post('/api/learning/assignment/create', this.authenticatePremium.bind(this), this.handleCreateAssignment.bind(this));
        this.app.get('/api/learning/progress/:studentId/:classroomId', this.authenticatePremium.bind(this), this.handleGetLearningProgress.bind(this));
        this.app.get('/api/learning/stats/:classroomId', this.authenticatePremium.bind(this), this.handleGetLearningStats.bind(this));

        // --- ROUTES ANALYTICS (placeholder) ---
        this.app.get('/api/analytics/usage', this.authenticatePremium.bind(this), this.handleGetAnalyticsUsage.bind(this));
        this.app.get('/api/analytics/payments', this.authenticatePremium.bind(this), this.handleGetAnalyticsPayments.bind(this));
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
     * Migration: Entraînement de modèle IA
     */
    async handleAITrainModel(req, res) {
        // TODO: Connecter à la logique d'entraînement réelle
        res.json({ success: true, message: 'Modèle IA entraîné (simulation)' });
    }

    /**
     * Migration: Recherche vectorielle IA
     */
    async handleAIVectorSearch(req, res) {
        // TODO: Connecter à la logique de recherche vectorielle réelle
        res.json({ success: true, results: [], message: 'Recherche vectorielle IA (simulation)' });
    }

    /**
     * Migration: Statut orchestrateur IA
     */
    async handleAIOrchestratorStatus(req, res) {
        // TODO: Connecter à la logique d'orchestration réelle
        res.json({ success: true, status: 'ok', message: 'Orchestrateur IA actif (simulation)' });
    }

    /**
     * Migration: Import audio corpus IA
     */
    async handleAIAudioCorpus(req, res) {
        // TODO: Connecter à la logique d'import audio corpus réelle
        res.json({ success: true, message: 'Audio corpus importé (simulation)' });
    }

    // --- HANDLERS PAIEMENT (placeholders à connecter aux services réels) ---
    async handleGetPaymentMethods(req, res) {
        try {
            const { currency = 'EUR', country = 'FR' } = req.query;
            const methods = this.paymentService.getAvailablePaymentMethods(currency, country);
            res.json({ success: true, methods, currency, country });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des méthodes de paiement', details: error.message });
        }
    }
    async handleCreatePaymentIntent(req, res) {
        try {
            const result = await this.paymentService.createPaymentIntent(req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création de l\'intention de paiement', details: error.message });
        }
    }
    async handleConfirmPayment(req, res) {
        try {
            const { paymentIntentId, securityToken, paymentMethod } = req.body;
            const result = await this.paymentService.confirmPayment(paymentIntentId, { securityToken, paymentMethod });
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la confirmation du paiement', details: error.message });
        }
    }
    async handleCreateSubscription(req, res) {
        try {
            const result = await this.paymentService.createSubscription(req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création de l\'abonnement', details: error.message });
        }
    }
    async handleGetSubscriptions(req, res) {
        try {
            const { userId = req.user?.username || 'current-user' } = req.query;
            const subscriptions = this.paymentService.getSubscriptionsForUser ? this.paymentService.getSubscriptionsForUser(userId) : [];
            res.json({ success: true, subscriptions, total: subscriptions.length });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des abonnements', details: error.message });
        }
    }
    async handleCancelSubscription(req, res) {
        try {
            const { subscriptionId } = req.params;
            const { reason } = req.body;
            const result = await this.paymentService.cancelSubscription(subscriptionId, reason);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de l\'annulation de l\'abonnement', details: error.message });
        }
    }
    async handleCreateRefund(req, res) {
        try {
            const { transactionId, amount, reason } = req.body;
            const result = await this.paymentService.createRefund(transactionId, amount, reason);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création du remboursement', details: error.message });
        }
    }
    async handleGetPaymentStats(req, res) {
        try {
            const { userId = req.user?.username || 'current-user' } = req.query;
            const stats = await this.paymentService.getPaymentStats(userId);
            res.json({ success: true, stats });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des statistiques', details: error.message });
        }
    }
    async handleGetPaymentCurrencies(req, res) {
        try {
            res.json({ success: true, currencies: this.paymentService.currencies });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des devises', details: error.message });
        }
    }
    async handleConvertCurrency(req, res) {
        try {
            const { amount, fromCurrency, toCurrency } = req.body;
            const conversion = this.paymentService.convertCurrency(amount, fromCurrency, toCurrency);
            res.json({ success: true, conversion });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la conversion de devise', details: error.message });
        }
    }

    // --- HANDLERS LEARNING (placeholders à connecter aux services réels) ---
    async handleGetTeachers(req, res) {
        try {
            const teachers = this.learningService.getTeachers ? this.learningService.getTeachers() : [];
            res.json({ success: true, teachers });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des enseignants', details: error.message });
        }
    }
    async handleEnrollLearning(req, res) {
        try {
            const { classroomId, studentId, paymentInfo } = req.body;
            const enrollment = this.learningService.enrollStudent ? await this.learningService.enrollStudent(classroomId, studentId, paymentInfo) : {};
            res.json({ success: true, enrollment });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
        }
    }
    async handleStartLearningSession(req, res) {
        try {
            const { classroomId, studentId } = req.body;
            const session = this.learningService.startSession ? await this.learningService.startSession(classroomId, studentId) : {};
            res.json({ success: true, session });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors du démarrage de la session', details: error.message });
        }
    }
    async handleGetActiveSession(req, res) {
        try {
            const { classroomId } = req.params;
            const session = this.learningService.getActiveSession ? await this.learningService.getActiveSession(classroomId) : {};
            res.json({ success: true, session });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la récupération de la session active', details: error.message });
        }
    }
    async handleJoinSession(req, res) {
        try {
            const { classroomId, studentId } = req.body;
            const joined = this.learningService.joinSession ? await this.learningService.joinSession(classroomId, studentId) : true;
            res.json({ success: true, joined });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la jonction à la session', details: error.message });
        }
    }
    async handleCreateAssignment(req, res) {
        try {
            const { classroomId, assignment } = req.body;
            const created = this.learningService.createAssignment ? await this.learningService.createAssignment(classroomId, assignment) : {};
            res.json({ success: true, assignment: created });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création du devoir', details: error.message });
        }
    }
    async handleGetLearningProgress(req, res) {
        try {
            const { studentId, classroomId } = req.params;
            const progress = this.learningService.getProgress ? await this.learningService.getProgress(studentId, classroomId) : {};
            res.json({ success: true, progress });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la récupération de la progression', details: error.message });
        }
    }
    async handleGetLearningStats(req, res) {
        try {
            const { classroomId } = req.params;
            const stats = this.learningService.getClassroomStats ? await this.learningService.getClassroomStats(classroomId) : {};
            res.json({ success: true, stats });
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la récupération des statistiques', details: error.message });
        }
    }

    // --- HANDLERS ANALYTICS (placeholders) ---
    async handleGetAnalyticsUsage(req, res) {
        res.json({ success: true, usage: {}, message: 'Usage analytics (placeholder)' });
    }
    async handleGetAnalyticsPayments(req, res) {
        res.json({ success: true, payments: {}, message: 'Paiements analytics (placeholder)' });
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

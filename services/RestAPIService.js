/**
 * 🌐 Service API REST pour intégration tiers
 * Expose les fonctionnalités de traduction via API REST
 * Support OAuth2, rate limiting, documentation OpenAPI
 */

import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import User from '../api/models/User.js';
import { VideoCorpusService } from '../LivingLanguageLab/services/VideoCorpusService.js';
import { AutonomousLearningService } from './AutonomousLearningService.js';
import CommunityService from './CommunityService.js'; // Importation du service communautaire
import { ConfigurationManager } from './ConfigurationManager.js';
import LinguisticAnalysisService from './LinguisticAnalysisService.js';
import SecurePaymentService from './SecurePaymentService.js';
import { SemanticSearchService } from './SemanticSearchService.js';
import { PlatformAnalyticsService } from './TalkKinIntegratedPlatformService.js';
import { TranslationService } from './TranslationService.js';

// Import validation dashboard routes
import adminRoutes from '../api/routes/adminRoutes.js';
import contextTransliterationRoutes from '../api/routes/contextTransliteration.js';
import correctionRoutes from '../api/routes/correctionRoutes.js';
import ingestionRoutes from '../api/routes/ingestionRoutes.js';
import taskRoutes from '../api/routes/taskRoutes.js';

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
        this.app = express();
        this.videoCorpusService = new VideoCorpusService();
        this.translationService = new TranslationService();
        console.log('TranslationService initialized.');
        this.voiceService = new SimpleVoiceService();
        console.log('SimpleVoiceService initialized.');
        this.semanticSearch = new SemanticSearchService();
        console.log('SemanticSearchService initialized.');
        this.config = new ConfigurationManager();
        console.log('ConfigurationManager initialized.');
        this.paymentService = SecurePaymentService;
        console.log('SecurePaymentService initialized.');
        this.learningService = new AutonomousLearningService();
        console.log('AutonomousLearningService initialized.');
        this.analyticsService = new PlatformAnalyticsService();
        console.log('PlatformAnalyticsService initialized.');
        
        this.port = process.env.API_PORT || 3000;
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET doit être défini dans les variables d\'environnement.');
        }
        this.jwtSecret = process.env.JWT_SECRET;
        // Idioma por defecto para mensajes
        this.defaultLang = 'es';
        
        console.log('Initializing middleware...');
        this.initializeMiddleware();
        console.log('Middleware initialized.');

        console.log('Initializing routes...');
        this.initializeRoutes();
        console.log('Routes initialized.');

        this.initializeSwagger(); // Swagger activé avec dépendances non dépréciées
        // Handler 404 à la toute fin, après Swagger
        this.app.use((req, res, next) => {
            if (req.originalUrl.startsWith('/api-docs')) {
                // Permitir que swagger-ui-express maneje /api-docs y archivos estáticos
                return next();
            }
            res.status(404).json({
                error: 'Ruta no encontrada',
                path: req.originalUrl,
                method: req.method
            });
        });
        console.log('Initializing error handling...');
        this.initializeErrorHandling();
        console.log('Error handling initialized.');
        console.log('RestAPIService constructor finished.');
    }

    /**
     * Initialise les middlewares de sécurité et performance
     */
    initializeMiddleware() {
        // Seguridad
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true
        }));

        // Limitación de tasa
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100, // límite de 100 peticiones por IP
            message: {
                error: 'Demasiadas solicitudes, por favor intente más tarde',
                retryAfter: '15 minutos'
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
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        jwt.verify(token, this.jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido' });
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
            } catch (e) {
                 console.error("Error reading or parsing users.json for API Key auth:", e);
            }
            return res.status(403).json({ error: 'API key inválida o acceso no premium.' });
        }
        // Verificación por JWT (header Authorization: Bearer ...)
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const payload = jwt.verify(token, this.jwtSecret);
                const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
                const user = users.find(u => u.username === payload.username);
                if (user) {
                    req.user = user;
                    return next();
                }
            } catch (e) {
                return res.status(403).json({ error: 'Token JWT inválido o expirado.' });
            }
        }
        return res.status(401).json({ error: 'Autenticación premium requerida.' });
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
                version: '1.0.0' 
            });
        });

        // Validation Dashboard API v1 Routes
        this.app.use('/v1/admin', adminRoutes);
        this.app.use('/v1/tasks', taskRoutes);
        this.app.use('/v1/corrections', correctionRoutes);
        this.app.use('/api/admin', adminRoutes);
        this.app.use('/api/ingestion', ingestionRoutes);

        /**
         * @swagger
         * /api/auth/register:
         *   post:
         *     summary: Inscription d'un nouvel utilisateur
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *                 description: Nom d'utilisateur
         *               password:
         *                 type: string
         *                 description: Mot de passe
         *               email:
         *                 type: string
         *                 format: email
         *                 description: Adresse e-mail
         *     responses:
         *       201:
         *         description: Utilisateur créé avec succès
         *       400:
         *         description: Données d'inscription invalides
         *       500:
         *         description: Erreur interne du serveur
         */
        this.app.post('/api/auth/register', this.handleRegister.bind(this));

        /**
         * @swagger
         * /api/auth/login:
         *   post:
         *     summary: Connexion d'un utilisateur
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *                 description: Nom d'utilisateur
         *               password:
         *                 type: string
         *                 description: Mot de passe
         *     responses:
         *       200:
         *         description: Connexion réussie
         *       401:
         *         description: Identifiants invalides
         *       500:
         *         description: Erreur interne du serveur
         */
        this.app.post('/api/auth/login', this.handleLogin.bind(this));

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
        // const importCorpusRouter = require('../api_import_corpus'); - remplacé par import ES6
        // this.app.use('/api', importCorpusRouter);

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

        // --- ROUTES ANALYSE LINGUISTIQUE ---
        this.app.post('/api/linguistic/analyze', this.authenticatePremium.bind(this), this.logPremiumUsage, this.handleLinguisticAnalysis.bind(this));

        // --- ROUTES COMMUNAUTAIRES ---
        this.app.post('/api/community/submit/sentence', this.authenticateToken.bind(this), this.handleCommunitySubmitSentence.bind(this));
        this.app.post('/api/community/submit/audio', this.authenticateToken.bind(this), this.handleCommunitySubmitAudio.bind(this));
        this.app.get('/api/community/contributions', this.authenticateToken.bind(this), this.handleGetCommunityContributions.bind(this));
        
        /**
         * @swagger
         * /api/corpus/video:
         *   post:
         *     summary: Process a video from a URL to enrich the corpus
         *     tags: [Corpus]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               url:
         *                 type: string
         *                 format: uri
         *                 description: The URL of the video to process.
         *     responses:
         *       202:
         *         description: Video processing started.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Video processing initiated for {url}"
         *       400:
         *         description: Invalid URL provided.
         *       500:
         *         description: Error initiating video processing.
         */
        this.app.post('/api/corpus/video', this.authenticateToken, async (req, res) => {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: 'Video URL is required' });
            }

            try {
                // Do not wait for the promise to resolve. This is a fire-and-forget operation.
                // The service will handle the download and extraction in the background.
                this.videoCorpusService.processVideoForCorpus(url);
                
                res.status(202).json({ message: `Video processing initiated for ${url}` });
            } catch (error) {
                console.error(`[RestAPIService] Failed to initiate video processing for ${url}:`, error);
                res.status(500).json({ error: 'Failed to start video processing' });
            }
        });

        // --- ROUTES CONTEXT TRANSLITERATION ---
        this.app.use('/api/context', contextTransliterationRoutes);
    }

    /**
     * Gestion de la connexion
     */
    async handleLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
            }

            // Buscar usuario por correo
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Crear JWT
            const token = jwt.sign(
                { id: user._id, roles: user.roles },
                this.jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                exito: true,
                token,
                expiraEn: '24h',
                usuario: {
                    id: user._id,
                    nombre: user.username,
                    correo: user.email,
                    roles: user.roles
                }
            });

        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    /**
     * Gestion de l'inscription
     */
    async handleRegister(req, res) {
        try {
            const { username, password, email } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Aquí deberías guardar en la base de datos
            console.log(`Nuevo usuario: ${username}, ${email}, ${hashedPassword}`);

            res.json({
                exito: true,
                mensaje: 'Usuario creado exitosamente',
                usuario: username
            });

        } catch (error) {
            console.error('Error de registro:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
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
                    error: 'Parámetros requeridos: text, fromLang, toLang'
                });
            }

            const result = await this.translationService.translate(text, fromLang, toLang, options);

            res.json({
                exito: true,
                traduccion: result,
                metadatos: {
                    de: fromLang,
                    a: toLang,
                    textoOriginal: text,
                    fecha: new Date().toISOString(),
                    usuario: req.user?.username || null
                }
            });

        } catch (error) {
            console.error('Error de traducción:', error);
            res.status(500).json({
                error: 'Error al traducir',
                detalles: error.message
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
                exito: true,
                idiomas: languages,
                total: languages.length
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los idiomas' });
        }
    }

    /**
     * Détection automatique de langue
     */
    async handleDetectLanguage(req, res) {
        try {
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'Texto requerido para la detección' });
            }

            const detectedLang = await this.translationService.detectLanguage(text);

            res.json({
                exito: true,
                idiomaDetectado: detectedLang,
                confianza: 0.85, // Puedes implementar un score real
                texto: text
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al detectar el idioma',
                detalles: error.message
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
                return res.status(400).json({ error: 'Parámetro query requerido' });
            }

            const results = await this.translationService.searchInDictionary(
                query, fromLang, toLang, parseInt(limit)
            );

            res.json({
                exito: true,
                resultados: results,
                total: results.length,
                consulta: {
                    texto: query,
                    de: fromLang,
                    a: toLang,
                    limite: limit
                }
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error en la búsqueda',
                detalles: error.message
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
                return res.status(400).json({ error: 'Parámetro text requerido' });
            }

            const suggestions = await this.translationService.getSuggestions(
                text, language, parseInt(limit)
            );

            res.json({
                exito: true,
                sugerencias: suggestions,
                total: suggestions.length
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al generar sugerencias',
                detalles: error.message
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
     * Analyse linguistique avancée
     */
    async handleLinguisticAnalysis(req, res) {
        try {
            const { text, language } = req.body;

            if (!text || !language) {
                return res.status(400).json({
                    error: 'Paramètres requis: text, language'
                });
            }

            const analysis = await LinguisticAnalysisService.analyzeWithStanza(text, language);

            res.json({
                success: true,
                analysis,
                metadata: {
                    language,
                    timestamp: new Date().toISOString(),
                    user: req.user.username
                }
            });

        } catch (error) {
            console.error('Erreur d\'analyse linguistique:', error);
            res.status(500).json({
                error: 'Erreur lors de l\'analyse linguistique',
                details: error.message
            });
        }
    }

    /**
     * Soumission de phrase par la communauté
     */
    async handleCommunitySubmitSentence(req, res) {
        try {
            const { language, text, translationLanguage, translationText } = req.body;
            const userId = req.user.username;

            if (!language || !text || !translationLanguage || !translationText) {
                return res.status(400).json({ error: 'Paramètres requis: language, text, translationLanguage, translationText' });
            }

            const submission = await CommunityService.submitSentence({ userId, language, text, translationLanguage, translationText });
            res.status(201).json({ success: true, submission });

        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la soumission de la phrase', details: error.message });
        }
    }

    /**
     * Soumission audio par la communauté
     */
    async handleCommunitySubmitAudio(req, res) {
        try {
            const { sentenceId, language, audioData } = req.body;
            const userId = req.user.username;

            if (!sentenceId || !language || !audioData) {
                return res.status(400).json({ error: 'Paramètres requis: sentenceId, language, audioData' });
            }

            const submission = await CommunityService.submitAudio({ userId, sentenceId, language, audioData });
            res.status(201).json({ success: true, submission });

        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la soumission audio', details: error.message });
        }
    }

    /**
     * Récupération des contributions d'un utilisateur
     */
    async handleGetCommunityContributions(req, res) {
        try {
            const userId = req.user.username;
            const contributions = await CommunityService.getContributions(userId);
            res.json({ success: true, contributions, total: contributions.length });

        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des contributions', details: error.message });
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
                    title: 'API de Traducción Maya',
                    version: '1.0.0',
                    description: 'API REST pour la traduction de lenguas mayas e indígenas',
                    contact: {
                        name: 'Soporte API',
                        email: 'soporte@mayatranslator.com'
                    }
                },
                servers: [
                    {
                        url: `http://localhost:${this.port}`,
                        description: 'Servidor de desarrollo'
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
        // Le 404 handler est déjà dans initializeRoutes, celui-ci est redondant.
        // this.app.use('*', (req, res) => {
        //     res.status(404).json({
        //         error: 'Route non trouvée',
        //         path: req.originalUrl,
        //         method: req.method
        //     });
        // });

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

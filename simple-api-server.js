/**
 * 🚀 Serveur API Simple Talk Kin
 * Serveur Express simple pour les traductions et fonctionnalités de base
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TalkKinAPIServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.isRunning = false;
        
        // Dictionnaire de traduction (même que dans l'app)
        this.translations = {
            'fr_yua': {
                'bonjour': 'ba\'ax ka wa\'alik',
                'merci': 'níib óolal',
                'au revoir': 'háach winikech',
                'comment allez-vous': 'bix a beel',
                'oui': 'héen',
                'non': 'ma\'',
                'famille': 'otoch',
                'eau': 'ja\'',
                'nourriture': 'janal',
                'maison': 'naj',
                'amour': 'yakunaj',
                'bonjour comment allez-vous': 'ba\'ax ka wa\'alik, bix a beel',
                'merci beaucoup': 'níib óolal tech'
            },
            'yua_fr': {
                'ba\'ax ka wa\'alik': 'bonjour',
                'níib óolal': 'merci',
                'háach winikech': 'au revoir',
                'bix a beel': 'comment allez-vous',
                'héen': 'oui',
                'ma\'': 'non',
                'otoch': 'famille',
                'ja\'': 'eau',
                'janal': 'nourriture',
                'naj': 'maison',
                'yakunaj': 'amour'
            },
            'fr_qu': {
                'bonjour': 'rimaykullayki',
                'merci': 'añay',
                'au revoir': 'tupananchiskama',
                'oui': 'arí',
                'non': 'mana',
                'famille': 'ayllu',
                'eau': 'unu',
                'maison': 'wasi',
                'amour': 'kuyay'
            },
            'fr_gn': {
                'bonjour': 'mba\'éichapa',
                'merci': 'aguyje',
                'au revoir': 'jajoecha peve',
                'oui': 'heẽ',
                'non': 'nahániri',
                'famille': 'téta',
                'eau': 'y',
                'maison': 'óga',
                'amour': 'mborayhu'
            },
            'fr_nah': {
                'bonjour': 'niltze',
                'merci': 'tlazocamati',
                'au revoir': 'cualli tonalli',
                'oui': 'quema',
                'non': 'amo',
                'famille': 'cencalli',
                'eau': 'atl',
                'maison': 'calli',
                'amour': 'tlazohtlaliztli'
            }
        };
    }

    setupMiddlewares() {
        // CORS pour permettre les requêtes depuis l'app Expo
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Parser JSON
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Logger simple
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // Route de santé
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                service: 'Talk Kin API',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // Route de traduction principale
        this.app.post('/api/translate', (req, res) => {
            try {
                const { text, from, to } = req.body;
                
                if (!text || !from || !to) {
                    return res.status(400).json({
                        error: 'Paramètres manquants',
                        required: ['text', 'from', 'to']
                    });
                }

                const translationKey = `${from}_${to}`;
                const normalizedText = text.toLowerCase().trim();
                
                console.log(`🔄 Traduction: "${text}" (${from} → ${to})`);

                // Recherche exacte
                if (this.translations[translationKey] && this.translations[translationKey][normalizedText]) {
                    const translation = this.translations[translationKey][normalizedText];
                    console.log(`✅ Trouvé: "${translation}"`);
                    
                    return res.json({
                        success: true,
                        translated: translation,
                        original: text,
                        from: from,
                        to: to,
                        method: 'dictionary_exact'
                    });
                }

                // Recherche partielle (mots contenus)
                const partialMatches = Object.entries(this.translations[translationKey] || {})
                    .filter(([key]) => key.includes(normalizedText) || normalizedText.includes(key))
                    .sort((a, b) => b[0].length - a[0].length); // Préférer les matchs plus longs

                if (partialMatches.length > 0) {
                    const [, translation] = partialMatches[0];
                    console.log(`🔍 Match partiel: "${translation}"`);
                    
                    return res.json({
                        success: true,
                        translated: translation,
                        original: text,
                        from: from,
                        to: to,
                        method: 'dictionary_partial',
                        confidence: 0.7
                    });
                }

                // Pas de traduction trouvée
                console.log(`❌ Aucune traduction trouvée`);
                return res.json({
                    success: false,
                    error: 'Traduction non trouvée',
                    original: text,
                    from: from,
                    to: to,
                    suggestions: this.getSuggestions(translationKey)
                });

            } catch (error) {
                console.error('❌ Erreur traduction:', error);
                res.status(500).json({
                    error: 'Erreur serveur',
                    message: error.message
                });
            }
        });

        // Route pour obtenir les langues supportées
        this.app.get('/api/languages', (req, res) => {
            const languages = [
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
                { code: 'es', name: 'Español', flag: '🇪🇸' },
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'yua', name: 'Maya Yucatèque', flag: '🇲🇽' },
                { code: 'qu', name: 'Quechua', flag: '🇵🇪' },
                { code: 'gn', name: 'Guarani', flag: '🇵🇾' },
                { code: 'nah', name: 'Nahuatl', flag: '🇲🇽' },
                { code: 'ay', name: 'Aymara', flag: '🇧🇴' }
            ];

            res.json({
                success: true,
                languages: languages,
                supportedPairs: Object.keys(this.translations)
            });
        });

        // Route pour le dictionnaire
        this.app.get('/api/dictionary/:from/:to', (req, res) => {
            const { from, to } = req.params;
            const translationKey = `${from}_${to}`;
            
            const dictionary = this.translations[translationKey] || {};
            
            res.json({
                success: true,
                from: from,
                to: to,
                entries: Object.keys(dictionary).length,
                dictionary: dictionary
            });
        });

        // Route pour les exemples
        this.app.get('/api/examples/:language', (req, res) => {
            const { language } = req.params;
            
            const examples = {
                'yua': [
                    { text: 'Bix a beel?', translation: 'Comment ça va ?' },
                    { text: 'Níib óolal', translation: 'Merci' },
                    { text: 'Háach winikech', translation: 'Au revoir' }
                ],
                'qu': [
                    { text: 'Imaynalla kashkanki?', translation: 'Comment ça va ?' },
                    { text: 'Añay', translation: 'Merci' },
                    { text: 'Tupananchiskama', translation: 'Au revoir' }
                ],
                'gn': [
                    { text: 'Mbaéichapa reiko?', translation: 'Comment ça va ?' },
                    { text: 'Aguyje', translation: 'Merci' },
                    { text: 'Jajoecha peve', translation: 'Au revoir' }
                ]
            };

            res.json({
                success: true,
                language: language,
                examples: examples[language] || []
            });
        });

        // Route statique pour servir la documentation
        this.app.get('/', (req, res) => {
            res.json({
                service: 'Talk Kin API',
                version: '1.0.0',
                description: 'API de traduction pour langues autochtones',
                endpoints: {
                    'GET /health': 'Vérification de santé',
                    'POST /api/translate': 'Traduction de texte',
                    'GET /api/languages': 'Langues supportées',
                    'GET /api/dictionary/:from/:to': 'Dictionnaire bilingue',
                    'GET /api/examples/:language': 'Exemples par langue'
                },
                status: 'running'
            });
        });

        // Gestion des erreurs 404
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint non trouvé',
                path: req.originalUrl,
                availableEndpoints: ['/', '/health', '/api/translate', '/api/languages']
            });
        });
    }

    getSuggestions(translationKey) {
        const dictionary = this.translations[translationKey] || {};
        const availableWords = Object.keys(dictionary);
        
        // Retourner quelques mots aléatoires comme suggestions
        return availableWords.slice(0, 5);
    }

    async start() {
        try {
            console.log('🚀 Démarrage Talk Kin API Server...\n');

            this.setupMiddlewares();
            this.setupRoutes();

            return new Promise((resolve, reject) => {
                this.server = this.app.listen(this.port, () => {
                    this.isRunning = true;
                    console.log(`✅ Serveur démarré avec succès !`);
                    console.log(`🌐 URL: http://localhost:${this.port}`);
                    console.log(`📚 Documentation: http://localhost:${this.port}/`);
                    console.log(`🔍 Santé: http://localhost:${this.port}/health`);
                    console.log(`🗣️ Traduction: POST http://localhost:${this.port}/api/translate`);
                    console.log(`\n📊 Statistiques:`);
                    console.log(`   - ${Object.keys(this.translations).length} paires de langues`);
                    console.log(`   - ${Object.values(this.translations).reduce((total, dict) => total + Object.keys(dict).length, 0)} entrées de dictionnaire`);
                    console.log('\n🎯 Serveur prêt pour les requêtes de traduction !');
                    resolve();
                });

                this.server.on('error', (error) => {
                    console.error('❌ Erreur serveur:', error);
                    reject(error);
                });
            });

        } catch (error) {
            console.error('❌ Erreur démarrage:', error);
            throw error;
        }
    }

    async stop() {
        if (this.server && this.isRunning) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    this.isRunning = false;
                    console.log('🛑 Serveur arrêté');
                    resolve();
                });
            });
        }
    }

    getStats() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            languagePairs: Object.keys(this.translations).length,
            totalEntries: Object.values(this.translations).reduce((total, dict) => total + Object.keys(dict).length, 0)
        };
    }
}

// Démarrage automatique si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
    const server = new TalkKinAPIServer();
    
    server.start().catch(error => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });

    // Arrêt propre
    process.on('SIGINT', async () => {
        console.log('\n🛑 Arrêt du serveur...');
        await server.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await server.stop();
        process.exit(0);
    });
}

export { TalkKinAPIServer };

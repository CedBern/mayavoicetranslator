/**
 * 🚀 Serveur de démarrage API Maya Translator
 * Démarre l'API REST complète avec tous les services
 */

import { RestAPIService } from './services/RestAPIService.js';
import { OAuth2Service } from './services/OAuth2Service.js';
import { APIDocumentationService } from './services/APIDocumentationService.js';

class MayaAPIServer {
    constructor() {
        this.restAPI = new RestAPIService();
        this.oauth2 = new OAuth2Service();
        this.docService = new APIDocumentationService();
        this.isRunning = false;
    }

    async start() {
        try {
            console.log('🚀 Démarrage du serveur Maya Translator API...\n');

            // Démarrage du nettoyage automatique OAuth2
            this.oauth2.startAutomaticCleanup();

            // Démarrage du serveur REST
            await this.restAPI.start();
            this.isRunning = true;

            console.log('\n✅ Serveur démarré avec succès !');
            console.log(`📊 OAuth2 Stats: ${this.oauth2.getOAuthStats().totalClients} clients configurés`);
            
            this.displayStartupInfo();
            this.setupGracefulShutdown();

        } catch (error) {
            console.error('❌ Erreur lors du démarrage:', error);
            process.exit(1);
        }
    }

    displayStartupInfo() {
        const port = this.restAPI.port;
        
        console.log('\n' + '='.repeat(60));
        console.log('🌐 MAYA TRANSLATOR API - SERVEUR ACTIF');
        console.log('='.repeat(60));
        console.log(`🔗 API Base URL: http://localhost:${port}/api`);
        console.log(`📚 Documentation: http://localhost:${port}/api-docs`);
        console.log(`❤️  Health Check: http://localhost:${port}/health`);
        console.log('\n🔐 CLIENTS OAUTH2 DISPONIBLES:');
        console.log('   • maya-sdk-js (SDK JavaScript)');
        console.log('   • maya-mobile-app (Application mobile)');
        console.log('   • maya-api-client (Client API)');
        console.log('\n🛠️ ENDPOINTS PRINCIPAUX:');
        console.log('   • POST /api/auth/login - Authentification');
        console.log('   • POST /api/translate - Traduction');
        console.log('   • GET  /api/languages - Langues supportées');
        console.log('   • GET  /api/search - Recherche dictionnaire');
        console.log('   • POST /api/tts - Synthèse vocale');
        console.log('   • POST /api/stt - Reconnaissance vocale');
        console.log('\n📋 EXEMPLE DE TEST RAPIDE:');
        console.log(`curl -X POST "http://localhost:${port}/api/auth/login" \\`);
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"username": "demo", "password": "demo123"}\'');
        console.log('='.repeat(60));
    }

    setupGracefulShutdown() {
        process.on('SIGTERM', () => this.shutdown('SIGTERM'));
        process.on('SIGINT', () => this.shutdown('SIGINT'));
    }

    async shutdown(signal) {
        console.log(`\n🛑 Signal ${signal} reçu, arrêt du serveur...`);
        
        if (this.isRunning) {
            // Arrêt du nettoyage automatique OAuth2
            this.oauth2.stopAutomaticCleanup();
            
            // Arrêt du serveur REST
            await this.restAPI.stop();
            
            console.log('✅ Serveur arrêté proprement');
            this.isRunning = false;
        }
        
        process.exit(0);
    }

    async generateDocumentation() {
        try {
            console.log('📚 Génération de la documentation...');
            const result = await this.docService.saveDocumentation('./docs');
            
            console.log(`✅ Documentation générée dans ${result.outputDir}`);
            console.log('📄 Fichiers créés:');
            result.files.forEach(file => console.log(`   • ${file}`));
            
            return result;
        } catch (error) {
            console.error('❌ Erreur lors de la génération de documentation:', error);
            throw error;
        }
    }

    getServerStats() {
        return {
            isRunning: this.isRunning,
            port: this.restAPI.port,
            oauthStats: this.oauth2.getOAuthStats(),
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString()
        };
    }
}

// Commandes CLI
const command = process.argv[2];

async function main() {
    const server = new MayaAPIServer();

    switch (command) {
        case 'start':
        case undefined:
            await server.start();
            break;

        case 'docs':
            await server.generateDocumentation();
            break;

        case 'test':
            console.log('🧪 Lancement des tests API...');
            const { runAPITests } = await import('./docs/api-tests.js');
            await runAPITests();
            break;

        case 'help':
            console.log('🔧 Maya Translator API Server');
            console.log('\nCommandes disponibles:');
            console.log('  node api-server.js start  - Démarre le serveur (défaut)');
            console.log('  node api-server.js docs   - Génère la documentation');
            console.log('  node api-server.js test   - Lance les tests API');
            console.log('  node api-server.js help   - Affiche cette aide');
            break;

        default:
            console.error(`❌ Commande inconnue: ${command}`);
            console.log('Utilisez "node api-server.js help" pour voir les commandes disponibles');
            process.exit(1);
    }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Rejection non gérée:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('💥 Exception non capturée:', error);
    process.exit(1);
});

// Point d'entrée
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    });
}

export { MayaAPIServer };
export default MayaAPIServer;

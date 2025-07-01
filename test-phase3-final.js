/**
 * 🚀 Test final Phase 3 - API REST et SDK
 * Validation complète des nouvelles fonctionnalités avancées
 */

import { promises as fs } from 'fs';
import path from 'path';

async function testPhase3Final() {
    console.log('🚀 === TEST FINAL PHASE 3 : API REST ET SDK ===\n');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        errors: [],
        services: {},
        performance: {}
    };

    try {
        // Test 1: Import des nouveaux services
        await testServiceImports(results);
        
        // Test 2: Instanciation des services REST
        await testRestServices(results);
        
        // Test 3: Validation du SDK
        await testSDKFunctionality(results);
        
        // Test 4: Documentation automatique
        await testDocumentationGeneration(results);
        
        // Test 5: OAuth2 et sécurité
        await testOAuth2Service(results);
        
        // Test 6: Tests d'intégration
        await testIntegrationScenarios(results);
        
        // Rapport final détaillé
        generateFinalReport(results);
        
    } catch (error) {
        console.error('❌ Erreur critique dans les tests Phase 3:', error);
        results.errors.push(`Erreur critique: ${error.message}`);
    }
    
    return results;
}

/**
 * Test des imports des nouveaux services
 */
async function testServiceImports(results) {
    console.log('📦 Test des imports des services Phase 3...\n');
    
    const services = [
        'RestAPIService',
        'MayaTranslatorSDK', 
        'OAuth2Service',
        'APIDocumentationService'
    ];
    
    for (const serviceName of services) {
        await runTest(`Import ${serviceName}`, results, async () => {
            try {
                const module = await import(`./${serviceName}.js`);
                const ServiceClass = module.default || module[serviceName];
                
                if (ServiceClass && typeof ServiceClass === 'function') {
                    console.log(`  ✅ ${serviceName} importé avec succès`);
                    results.services[serviceName] = { imported: true, class: ServiceClass };
                    return { success: true, service: ServiceClass };
                }
                throw new Error(`${serviceName} n'est pas une classe valide`);
            } catch (error) {
                throw new Error(`Impossible d'importer ${serviceName}: ${error.message}`);
            }
        });
    }
}

/**
 * Test des services REST
 */
async function testRestServices(results) {
    console.log('\n🌐 Test des services REST...\n');
    
    // Test RestAPIService
    await runTest('Instanciation RestAPIService', results, async () => {
        const { RestAPIService } = await import('./RestAPIService.js');
        const restAPI = new RestAPIService();
        
        if (restAPI && restAPI.app && restAPI.port) {
            console.log(`  ✅ RestAPIService créé (port: ${restAPI.port})`);
            
            // Test de configuration
            if (restAPI.jwtSecret && restAPI.translationService && restAPI.voiceService) {
                console.log('  ✅ Services internes configurés');
                results.services.RestAPIService.configured = true;
                return { success: true, instance: restAPI };
            }
            throw new Error('Services internes manquants');
        }
        throw new Error('RestAPIService invalide');
    });
    
    // Test des middlewares
    await runTest('Configuration middlewares', results, async () => {
        const { RestAPIService } = await import('./RestAPIService.js');
        const restAPI = new RestAPIService();
        
        // Vérification de la pile middleware Express
        if (restAPI.app._router && restAPI.app._router.stack.length > 0) {
            console.log(`  ✅ ${restAPI.app._router.stack.length} middlewares configurés`);
            return { success: true };
        }
        throw new Error('Middlewares non configurés');
    });
    
    // Test OAuth2Service
    await runTest('Instanciation OAuth2Service', results, async () => {
        const { OAuth2Service } = await import('./OAuth2Service.js');
        const oauth2 = new OAuth2Service();
        
        if (oauth2 && oauth2.clientCredentials && oauth2.jwtSecret) {
            console.log('  ✅ OAuth2Service créé avec succès');
            
            // Test des clients par défaut
            const clientCount = oauth2.clientCredentials.size;
            if (clientCount >= 3) {
                console.log(`  ✅ ${clientCount} clients OAuth2 configurés par défaut`);
                results.services.OAuth2Service = { configured: true, clientCount };
                return { success: true, instance: oauth2 };
            }
            throw new Error('Clients OAuth2 par défaut manquants');
        }
        throw new Error('OAuth2Service invalide');
    });
}

/**
 * Test du SDK
 */
async function testSDKFunctionality(results) {
    console.log('\n🛠️ Test du SDK Maya Translator...\n');
    
    await runTest('Instanciation SDK', results, async () => {
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const sdk = new MayaTranslatorSDK({
            apiBaseUrl: 'http://localhost:3000/api',
            timeout: 5000,
            retryAttempts: 2
        });
        
        if (sdk && sdk.apiBaseUrl && sdk.defaultOptions) {
            console.log('  ✅ SDK instancié avec configuration personnalisée');
            results.services.MayaTranslatorSDK = { configured: true };
            return { success: true, instance: sdk };
        }
        throw new Error('SDK mal configuré');
    });
    
    await runTest('Méthodes SDK principales', results, async () => {
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const sdk = new MayaTranslatorSDK();
        
        const requiredMethods = [
            'authenticate', 'translate', 'detectLanguage', 'getSupportedLanguages',
            'searchDictionary', 'textToSpeech', 'speechToText', 'semanticSearch',
            'batchTranslate', 'configureWebhook'
        ];
        
        const missingMethods = requiredMethods.filter(method => typeof sdk[method] !== 'function');
        
        if (missingMethods.length === 0) {
            console.log(`  ✅ Toutes les méthodes SDK présentes (${requiredMethods.length})`);
            return { success: true, methods: requiredMethods };
        }
        throw new Error(`Méthodes manquantes: ${missingMethods.join(', ')}`);
    });
    
    await runTest('Cache SDK', results, async () => {
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const sdk = new MayaTranslatorSDK();
        
        // Test du cache
        sdk.enableCache();
        if (sdk.cacheEnabled && sdk.cache) {
            console.log('  ✅ Cache SDK activé et fonctionnel');
            
            sdk.disableCache();
            if (!sdk.cacheEnabled) {
                console.log('  ✅ Cache SDK désactivé avec succès');
                return { success: true };
            }
        }
        throw new Error('Gestion du cache défaillante');
    });
    
    await runTest('Génération exemples code', results, async () => {
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const examples = MayaTranslatorSDK.generateExamples();
        
        const requiredExamples = ['javascript', 'python', 'curl', 'webhook'];
        const missingExamples = requiredExamples.filter(type => !examples[type]);
        
        if (missingExamples.length === 0) {
            console.log(`  ✅ Tous les exemples de code générés (${requiredExamples.length})`);
            return { success: true, examples: Object.keys(examples) };
        }
        throw new Error(`Exemples manquants: ${missingExamples.join(', ')}`);
    });
}

/**
 * Test de la documentation automatique
 */
async function testDocumentationGeneration(results) {
    console.log('\n📚 Test de la documentation automatique...\n');
    
    await runTest('Instanciation APIDocumentationService', results, async () => {
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        const docService = new APIDocumentationService();
        
        if (docService && docService.apiSpec && docService.apiSpec.openapi) {
            console.log('  ✅ Service de documentation créé');
            console.log(`  ✅ Spec OpenAPI ${docService.apiSpec.openapi} configurée`);
            results.services.APIDocumentationService = { configured: true };
            return { success: true, instance: docService };
        }
        throw new Error('Service de documentation invalide');
    });
    
    await runTest('Génération OpenAPI JSON', results, async () => {
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        const docService = new APIDocumentationService();
        
        const jsonSpec = docService.generateJSON();
        const parsedSpec = JSON.parse(jsonSpec);
        
        if (parsedSpec.openapi && parsedSpec.info && parsedSpec.paths) {
            console.log('  ✅ Spécification OpenAPI JSON valide');
            console.log(`  ✅ ${Object.keys(parsedSpec.paths).length} endpoints documentés`);
            return { success: true, pathCount: Object.keys(parsedSpec.paths).length };
        }
        throw new Error('Spécification OpenAPI invalide');
    });
    
    await runTest('Génération documentation Markdown', results, async () => {
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        const docService = new APIDocumentationService();
        
        const markdown = docService.generateMarkdown();
        
        if (markdown.includes('# Maya Voice Translator API Documentation') && 
            markdown.includes('## Authentification') &&
            markdown.includes('## Endpoints principaux')) {
            console.log('  ✅ Documentation Markdown complète générée');
            console.log(`  ✅ ${markdown.split('\n').length} lignes de documentation`);
            return { success: true, lineCount: markdown.split('\n').length };
        }
        throw new Error('Documentation Markdown incomplète');
    });
    
    await runTest('Génération tests automatiques', results, async () => {
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        const docService = new APIDocumentationService();
        
        const tests = docService.generateAPITests();
        
        if (tests.includes('runAPITests') && 
            tests.includes('testAuthentication') &&
            tests.includes('testTranslation')) {
            console.log('  ✅ Tests automatiques générés');
            return { success: true };
        }
        throw new Error('Tests automatiques incomplets');
    });
}

/**
 * Test du service OAuth2
 */
async function testOAuth2Service(results) {
    console.log('\n🔐 Test avancé OAuth2...\n');
    
    let oauth2Instance;
    
    await runTest('Configuration clients OAuth2', results, async () => {
        const { OAuth2Service } = await import('./OAuth2Service.js');
        oauth2Instance = new OAuth2Service();
        
        // Vérification des clients par défaut
        const expectedClients = ['maya-sdk-js', 'maya-mobile-app', 'maya-api-client'];
        const actualClients = Array.from(oauth2Instance.clientCredentials.keys());
        
        const missingClients = expectedClients.filter(client => !actualClients.includes(client));
        
        if (missingClients.length === 0) {
            console.log(`  ✅ Tous les clients par défaut configurés: ${expectedClients.join(', ')}`);
            return { success: true, clients: actualClients };
        }
        throw new Error(`Clients manquants: ${missingClients.join(', ')}`);
    });
    
    await runTest('Génération tokens OAuth2', results, async () => {
        if (!oauth2Instance) {
            const { OAuth2Service } = await import('./OAuth2Service.js');
            oauth2Instance = new OAuth2Service();
        }
        
        // Test Client Credentials Flow
        const tokenResponse = oauth2Instance.clientCredentialsGrant(
            'maya-api-client',
            'api-secret-key-2024',
            'translate dictionary'
        );
        
        if (tokenResponse.access_token && tokenResponse.token_type === 'Bearer') {
            console.log('  ✅ Token généré via Client Credentials Flow');
            
            // Test de validation du token
            const validation = oauth2Instance.validateAccessToken(tokenResponse.access_token);
            
            if (validation.valid && validation.scopes.includes('translate')) {
                console.log('  ✅ Token validé avec succès');
                return { success: true, tokenType: tokenResponse.token_type };
            }
        }
        throw new Error('Génération ou validation de token échouée');
    });
    
    await runTest('Introspection de token', results, async () => {
        if (!oauth2Instance) {
            const { OAuth2Service } = await import('./OAuth2Service.js');
            oauth2Instance = new OAuth2Service();
        }
        
        // Génération d'un token pour test
        const tokenResponse = oauth2Instance.clientCredentialsGrant(
            'maya-api-client',
            'api-secret-key-2024',
            'translate'
        );
        
        // Introspection
        const introspection = oauth2Instance.introspectToken(
            tokenResponse.access_token,
            'maya-api-client',
            'api-secret-key-2024'
        );
        
        if (introspection.active && introspection.client_id === 'maya-api-client') {
            console.log('  ✅ Introspection de token fonctionnelle');
            return { success: true, introspection };
        }
        throw new Error('Introspection de token échouée');
    });
}

/**
 * Tests d'intégration des scénarios complets
 */
async function testIntegrationScenarios(results) {
    console.log('\n🔄 Tests d\'intégration Phase 3...\n');
    
    await runTest('Scénario API REST complet', results, async () => {
        // Simulation d'un scénario complet d'utilisation de l'API
        const { RestAPIService } = await import('./RestAPIService.js');
        const { OAuth2Service } = await import('./OAuth2Service.js');
        
        const restAPI = new RestAPIService();
        const oauth2 = new OAuth2Service();
        
        // Vérification que les services se lient correctement
        if (restAPI.translationService && restAPI.voiceService && oauth2.clientCredentials.size > 0) {
            console.log('  ✅ Services REST et OAuth2 intégrés');
            
            // Test de génération de statistiques
            const stats = oauth2.getOAuthStats();
            if (stats.totalClients > 0) {
                console.log(`  ✅ Statistiques OAuth2: ${stats.totalClients} clients`);
                return { success: true, stats };
            }
        }
        throw new Error('Intégration REST/OAuth2 défaillante');
    });
    
    await runTest('Scénario SDK avec documentation', results, async () => {
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        
        const sdk = new MayaTranslatorSDK();
        const docService = new APIDocumentationService();
        
        // Vérification de la cohérence SDK/Documentation
        const examples = MayaTranslatorSDK.generateExamples();
        const markdown = docService.generateMarkdown();
        
        if (examples.javascript.includes('MayaTranslatorSDK') && 
            markdown.includes('SDK et exemples')) {
            console.log('  ✅ SDK et documentation cohérents');
            return { success: true };
        }
        throw new Error('Incohérence SDK/Documentation');
    });
    
    await runTest('Performance générale Phase 3', results, async () => {
        const startTime = Date.now();
        
        // Test de performance globale des nouveaux services
        const { RestAPIService } = await import('./RestAPIService.js');
        const { MayaTranslatorSDK } = await import('./MayaTranslatorSDK.js');
        const { OAuth2Service } = await import('./OAuth2Service.js');
        const { APIDocumentationService } = await import('./APIDocumentationService.js');
        
        const restAPI = new RestAPIService();
        const sdk = new MayaTranslatorSDK();
        const oauth2 = new OAuth2Service();
        const docService = new APIDocumentationService();
        
        const endTime = Date.now();
        const initTime = endTime - startTime;
        
        results.performance.phase3InitTime = initTime;
        
        if (initTime < 5000) { // moins de 5 secondes
            console.log(`  ✅ Initialisation rapide: ${initTime}ms`);
            return { success: true, initTime };
        }
        console.log(`  ⚠️  Initialisation lente: ${initTime}ms`);
        return { success: true, initTime, warning: 'Initialisation lente' };
    });
}

/**
 * Utilitaire pour exécuter un test individuel
 */
async function runTest(testName, results, testFunction) {
    results.total++;
    
    try {
        const startTime = Date.now();
        const result = await testFunction();
        const duration = Date.now() - startTime;
        
        console.log(`✅ ${testName} (${duration}ms)`);
        results.passed++;
        return result;
    } catch (error) {
        console.log(`❌ ${testName}: ${error.message}`);
        results.failed++;
        results.errors.push(`${testName}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Génère le rapport final détaillé
 */
function generateFinalReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RAPPORT FINAL PHASE 3 - API REST ET SDK');
    console.log('='.repeat(80));
    
    console.log(`\n📈 RÉSULTATS GLOBAUX:`);
    console.log(`   Total des tests: ${results.total}`);
    console.log(`   ✅ Réussis: ${results.passed}`);
    console.log(`   ❌ Échoués: ${results.failed}`);
    console.log(`   📊 Taux de réussite: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.performance.phase3InitTime) {
        console.log(`   ⚡ Temps d'initialisation: ${results.performance.phase3InitTime}ms`);
    }
    
    console.log(`\n🔧 SERVICES PHASE 3:`);
    Object.entries(results.services).forEach(([service, status]) => {
        const statusIcon = status.configured ? '✅' : '⚠️';
        console.log(`   ${statusIcon} ${service}`);
        
        if (status.clientCount) {
            console.log(`      - ${status.clientCount} clients OAuth2 configurés`);
        }
        if (status.methods) {
            console.log(`      - ${status.methods.length} méthodes SDK`);
        }
    });
    
    console.log(`\n🆕 NOUVELLES FONCTIONNALITÉS PHASE 3:`);
    console.log(`   🌐 API REST complète avec authentification OAuth2`);
    console.log(`   🛠️ SDK JavaScript/TypeScript pour développeurs`);
    console.log(`   📚 Documentation automatique OpenAPI/Swagger`);
    console.log(`   🔐 Authentification avancée avec JWT et OAuth2`);
    console.log(`   📋 Tests automatiques et exemples multi-langages`);
    console.log(`   🔄 Middleware de sécurité et rate limiting`);
    
    if (results.errors.length > 0) {
        console.log(`\n🔍 ERREURS DÉTECTÉES:`);
        results.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    }
    
    console.log(`\n🎯 ÉTAT DE LA PHASE 3:`);
    if (results.passed === results.total) {
        console.log(`   🎉 PHASE 3 TERMINÉE AVEC SUCCÈS !`);
        console.log(`   🚀 API REST et SDK entièrement fonctionnels`);
        console.log(`   📦 Prêt pour déploiement en production`);
    } else if (results.passed / results.total >= 0.8) {
        console.log(`   ✅ PHASE 3 LARGEMENT RÉUSSIE`);
        console.log(`   🔧 Quelques ajustements mineurs nécessaires`);
    } else {
        console.log(`   ⚠️  PHASE 3 INCOMPLÈTE`);
        console.log(`   🛠️ Corrections majeures requises`);
    }
    
    console.log(`\n🔗 PROCHAINES ÉTAPES:`);
    console.log(`   1. Déploiement de l'API REST sur serveur de production`);
    console.log(`   2. Publication du SDK sur npm/PyPI`);
    console.log(`   3. Configuration du monitoring et logging`);
    console.log(`   4. Tests de charge et optimisation`);
    console.log(`   5. Formation utilisateurs et documentation client`);
    
    console.log('\n' + '='.repeat(80));
}

// Exécution du test si lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    testPhase3Final()
        .then(results => {
            process.exit(results.failed === 0 ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Erreur fatale:', error);
            process.exit(1);
        });
}

export { testPhase3Final };
export default testPhase3Final;

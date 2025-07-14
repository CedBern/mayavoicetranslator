/**
 * 🧪 Test simplifié Phase 3 - Validation rapide des services
 */

console.log('🚀 Test rapide Phase 3 - API REST et SDK\n');

let passed = 0;
let failed = 0;

async function testImports() {
    console.log('📦 Test des imports...');
    
    try {
        const { RestAPIService } = await import('./services/RestAPIService.js');
        console.log('  ✅ RestAPIService importé');
        passed++;
    } catch (error) {
        console.log('  ❌ RestAPIService:', error.message);
        failed++;
    }
    
    try {
        const { MayaTranslatorSDK } = await import('./services/MayaTranslatorSDK.js');
        console.log('  ✅ MayaTranslatorSDK importé');
        passed++;
    } catch (error) {
        console.log('  ❌ MayaTranslatorSDK:', error.message);
        failed++;
    }
    
    try {
        const { OAuth2Service } = await import('./services/OAuth2Service.js');
        console.log('  ✅ OAuth2Service importé');
        passed++;
    } catch (error) {
        console.log('  ❌ OAuth2Service:', error.message);
        failed++;
    }
    
    try {
        const { APIDocumentationService } = await import('./services/APIDocumentationService.js');
        console.log('  ✅ APIDocumentationService importé');
        passed++;
    } catch (error) {
        console.log('  ❌ APIDocumentationService:', error.message);
        failed++;
    }
}

async function testInstantiations() {
    console.log('\n🔧 Test des instanciations...');
    
    try {
        const { RestAPIService } = await import('./services/RestAPIService.js');
        const restAPI = new RestAPIService();
        if (restAPI && restAPI.app) {
            console.log('  ✅ RestAPIService instancié');
            passed++;
        } else {
            throw new Error('Instance invalide');
        }
    } catch (error) {
        console.log('  ❌ RestAPIService instanciation:', error.message);
        failed++;
    }
    
    try {
        const { MayaTranslatorSDK } = await import('./services/MayaTranslatorSDK.js');
        const sdk = new MayaTranslatorSDK();
        if (sdk && sdk.apiBaseUrl) {
            console.log('  ✅ MayaTranslatorSDK instancié');
            passed++;
        } else {
            throw new Error('Instance invalide');
        }
    } catch (error) {
        console.log('  ❌ MayaTranslatorSDK instanciation:', error.message);
        failed++;
    }
    
    try {
        const { OAuth2Service } = await import('./services/OAuth2Service.js');
        const oauth2 = new OAuth2Service();
        if (oauth2 && oauth2.clientCredentials) {
            console.log('  ✅ OAuth2Service instancié');
            passed++;
        } else {
            throw new Error('Instance invalide');
        }
    } catch (error) {
        console.log('  ❌ OAuth2Service instanciation:', error.message);
        failed++;
    }
    
    try {
        const { APIDocumentationService } = await import('./services/APIDocumentationService.js');
        const docs = new APIDocumentationService();
        if (docs && docs.apiSpec) {
            console.log('  ✅ APIDocumentationService instancié');
            passed++;
        } else {
            throw new Error('Instance invalide');
        }
    } catch (error) {
        console.log('  ❌ APIDocumentationService instanciation:', error.message);
        failed++;
    }
}

async function runTests() {
    try {
        await testImports();
        await testInstantiations();
        
        console.log('\n📊 RÉSULTATS:');
        console.log(`   ✅ Réussis: ${passed}`);
        console.log(`   ❌ Échoués: ${failed}`);
        console.log(`   📈 Taux: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
        
        if (failed === 0) {
            console.log('\n🎉 PHASE 3 - TOUS LES SERVICES OPÉRATIONNELS !');
            console.log('🚀 API REST et SDK prêts pour utilisation');
        } else {
            console.log('\n⚠️  Certains services nécessitent des corrections');
        }
        
        process.exit(failed === 0 ? 0 : 1);
        
    } catch (error) {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    }
}

runTests();

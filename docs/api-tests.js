/**
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
    console.log(`\n📊 Résultats des tests :`);
    console.log(`✅ Réussis : ${results.passed}/${results.total}`);
    console.log(`❌ Échoués : ${results.failed}/${results.total}`);
    
    if (results.errors.length > 0) {
        console.log(`\n🔍 Erreurs détectées :`);
        results.errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error}`);
        });
    }
    
    return results;
}

async function testAuthentication(results) {
    console.log('\n🔐 Tests d\'authentification');
    
    // Test de connexion valide
    await runTest('POST /auth/login (valide)', results, async () => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
        
        throw new Error(`Authentification échouée: ${data.error || 'Unknown error'}`);
    });
    
    // Test de connexion invalide
    await runTest('POST /auth/login (invalide)', results, async () => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    console.log('\n🌐 Tests de traduction');
    
    if (!authToken) {
        console.log('⚠️  Token manquant, skip des tests de traduction');
        return;
    }
    
    // Test de traduction basique
    await runTest('POST /translate (basique)', results, async () => {
        const response = await fetch(`${API_BASE_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
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
        
        throw new Error(`Traduction échouée: ${data.error || 'Unknown error'}`);
    });
    
    // Test de traduction sans token
    await runTest('POST /translate (sans auth)', results, async () => {
        const response = await fetch(`${API_BASE_URL}/translate`, {
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
        const response = await fetch(`${API_BASE_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
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
    console.log('\n🔍 Tests de recherche');
    
    if (!authToken) {
        console.log('⚠️  Token manquant, skip des tests de recherche');
        return;
    }
    
    // Test de recherche basique
    await runTest('GET /search', results, async () => {
        const response = await fetch(`${API_BASE_URL}/search?query=eau&limit=5`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && Array.isArray(data.results)) {
            return { success: true, data };
        }
        
        throw new Error(`Recherche échouée: ${data.error || 'Unknown error'}`);
    });
}

async function testLanguages(results) {
    console.log('\n🌍 Tests des langues');
    
    // Test de récupération des langues
    await runTest('GET /languages', results, async () => {
        const response = await fetch(`${API_BASE_URL}/languages`);
        const data = await response.json();
        
        if (response.ok && data.success && Array.isArray(data.languages)) {
            return { success: true, data };
        }
        
        throw new Error(`Récupération des langues échouée: ${data.error || 'Unknown error'}`);
    });
}

async function testHealth(results) {
    console.log('\n❤️  Tests de santé');
    
    // Test du endpoint de santé
    await runTest('GET /health', results, async () => {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        const data = await response.json();
        
        if (response.ok && data.status === 'ok') {
            return { success: true, data };
        }
        
        throw new Error(`Health check échoué: ${data.error || 'Unknown error'}`);
    });
}

async function runTest(testName, results, testFunction) {
    results.total++;
    
    try {
        const result = await testFunction();
        console.log(`✅ ${testName}`);
        results.passed++;
        return result;
    } catch (error) {
        console.log(`❌ ${testName}: ${error.message}`);
        results.failed++;
        results.errors.push(`${testName}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Exécution des tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAPITests };
} else {
    runAPITests().catch(console.error);
}

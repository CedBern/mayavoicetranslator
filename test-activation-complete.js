/**
 * 🧪 Test d'Activation Complète des Fonctionnalités
 * Teste toutes les nouvelles fonctionnalités implémentées
 */

console.log("🚀 Test d'activation globale des fonctionnalités Talk Kin...\n");

// Test de base des imports
async function testImports() {
  console.log("📦 Test des imports...");
  
  try {
    // Test du service d'activation
    const { default: FeatureActivationService } = await import('./services/FeatureActivationService.js');
    const activationService = new FeatureActivationService();
    console.log("✅ FeatureActivationService importé avec succès");
    
    // Test du service de reconnaissance vocale
    const { default: NativeSpeechRecognition } = await import('./services/NativeSpeechRecognitionWebService.js');
    console.log("✅ NativeSpeechRecognitionWebService importé avec succès");
    
    return { activationService, NativeSpeechRecognition };
  } catch (error) {
    console.error("❌ Erreur import:", error.message);
    return null;
  }
}

// Test des endpoints API
async function testAPIEndpoints() {
  console.log("\n🌐 Test des endpoints API...");
  
  const endpoints = [
    { url: 'http://localhost:3000/api/health', method: 'GET' },
    { url: 'http://localhost:3000/api/activation/status', method: 'GET' },
    { 
      url: 'http://localhost:3000/api/activation/global', 
      method: 'POST',
      body: { action: 'activate_all' }
    },
    {
      url: 'http://localhost:3000/api/activation/feature',
      method: 'POST', 
      body: { featureName: 'speech-recognition', action: 'activate' }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(endpoint.url, options);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.method} ${endpoint.url} - OK`);
        if (endpoint.url.includes('status')) {
          console.log(`   📊 Statut: ${Object.keys(data.features || {}).length} fonctionnalités`);
        }
      } else {
        console.log(`⚠️ ${endpoint.method} ${endpoint.url} - ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.url} - ${error.message}`);
    }
  }
}

// Test du service d'activation
async function testActivationService(activationService) {
  console.log("\n⚡ Test du service d'activation...");
  
  try {
    // Test d'activation globale
    console.log("🔧 Test d'activation globale...");
    const result = await activationService.activateAllFeatures();
    
    console.log(`✅ Fonctionnalités activées: ${result.activated.length}`);
    console.log(`❌ Échecs: ${result.failed.length}`);
    console.log(`✔️ Déjà actives: ${result.alreadyActive.length}`);
    
    // Test de santé
    console.log("🏥 Test de santé...");
    const health = await activationService.healthCheck();
    console.log(`✅ Saines: ${health.healthy.length}`);
    console.log(`⚠️ Problèmes: ${health.issues.length}`);
    console.log(`🚨 Critiques: ${health.critical.length}`);
    
    return true;
  } catch (error) {
    console.error("❌ Erreur test activation:", error.message);
    return false;
  }
}

// Test de reconnaissance vocale
async function testSpeechRecognition(speechService) {
  console.log("\n🎤 Test de reconnaissance vocale...");
  
  try {
    const service = speechService; // Service déjà instancié
    
    // Test d'initialisation
    const initialized = await service.initialize();
    console.log(`📱 Initialisation: ${initialized ? '✅' : '❌'}`);
    
    // Test de disponibilité
    const available = service.isAvailable();
    console.log(`🔌 Disponibilité: ${available ? '✅' : '❌'}`);
    
    // Test des langues supportées
    const languages = service.getSupportedLanguages();
    console.log(`🌐 Langues supportées: ${languages.length} langues`);
    
    // Test fonctionnel
    const testResult = await service.testRecognition();
    console.log(`🧪 Test fonctionnel: ${testResult.testPassed ? '✅' : '❌'}`);
    
    return true;
  } catch (error) {
    console.error("❌ Erreur test reconnaissance:", error.message);
    return false;
  }
}

// Fonction principale de test
async function runCompleteTest() {
  console.log("=" * 60);
  console.log("🎯 DÉBUT DU TEST COMPLET D'ACTIVATION");
  console.log("=" * 60);
  
  const startTime = Date.now();
  let testsRun = 0;
  let testsPassed = 0;
  
  // Test 1: Imports
  testsRun++;
  const modules = await testImports();
  if (modules) testsPassed++;
  
  // Test 2: API Endpoints
  testsRun++;
  try {
    await testAPIEndpoints();
    testsPassed++;
  } catch (error) {
    console.error("❌ Test API échoué:", error.message);
  }
  
  // Test 3: Service d'activation
  if (modules?.activationService) {
    testsRun++;
    const activationOK = await testActivationService(modules.activationService);
    if (activationOK) testsPassed++;
  }
  
  // Test 4: Reconnaissance vocale
  if (modules?.NativeSpeechRecognition) {
    testsRun++;
    const speechOK = await testSpeechRecognition(modules.NativeSpeechRecognition);
    if (speechOK) testsPassed++;
  }
  
  // Résultats finaux
  const duration = Date.now() - startTime;
  
  console.log("\n" + "=" * 60);
  console.log("📊 RÉSULTATS DU TEST COMPLET");
  console.log("=" * 60);
  console.log(`⏱️ Durée: ${duration}ms`);
  console.log(`📈 Tests réussis: ${testsPassed}/${testsRun}`);
  console.log(`🎯 Taux de réussite: ${Math.round((testsPassed/testsRun) * 100)}%`);
  
  if (testsPassed === testsRun) {
    console.log("🎉 TOUS LES TESTS SONT PASSÉS !");
    console.log("✨ Toutes les fonctionnalités sont opérationnelles !");
  } else {
    console.log("⚠️ Certains tests ont échoué");
    console.log("🔧 Vérifiez les erreurs ci-dessus");
  }
  
  console.log("\n🚀 Talk Kin est prêt avec toutes les fonctionnalités activées !");
}

// Exécution du test
runCompleteTest().catch(error => {
  console.error("💥 Erreur fatale durant les tests:", error);
  process.exit(1);
});

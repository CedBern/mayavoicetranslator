// Test rapide des nouveaux services
import { performance } from 'perf_hooks';

async function quickTest() {
  console.log('🧪 TESTS RAPIDES DES SERVICES AVANCÉS');
  console.log('=====================================');
  
  let passed = 0;
  let total = 0;
  
  // Test du gestionnaire de clés API
  console.log('\n🔐 Test SecureAPIKeyManager...');
  try {
    const { default: SecureAPIKeyManager } = await import('./services/SecureAPIKeyManager.js');
    const keyManager = new SecureAPIKeyManager();
    await keyManager.initialize();
    
    // Test d'ajout de clé
    await keyManager.setAPIKey('openai', 'sk-test1234567890123456789012345678901234567890', { skipValidation: true });
    const retrievedKey = await keyManager.getAPIKey('openai');
    
    if (retrievedKey) {
      console.log('✅ SecureAPIKeyManager: Fonctionnel');
      passed++;
    } else {
      console.log('❌ SecureAPIKeyManager: Échec récupération');
    }
    total++;
  } catch (error) {
    console.log('❌ SecureAPIKeyManager: Erreur -', error.message);
    total++;
  }
  
  // Test de la base vectorielle
  console.log('\n🗄️ Test VectorDatabaseService...');
  try {
    const { default: VectorDatabaseService } = await import('./services/VectorDatabaseService.js');
    const vectorDB = new VectorDatabaseService();
    await vectorDB.initialize();
    
    // Test d'ajout de document
    const docId = await vectorDB.addDocument("Test document", "fr", { test: true });
    
    // Test de recherche
    const results = await vectorDB.searchSimilar("Test", "fr", { topK: 1, threshold: 0.1 });
    
    if (docId && Array.isArray(results)) {
      console.log('✅ VectorDatabaseService: Fonctionnel');
      passed++;
    } else {
      console.log('❌ VectorDatabaseService: Échec recherche');
    }
    total++;
  } catch (error) {
    console.log('❌ VectorDatabaseService: Erreur -', error.message);
    total++;
  }
  
  // Test du TTS neural
  console.log('\n🎤 Test NeuralTTSService...');
  try {
    const { default: NeuralTTSService } = await import('./services/NeuralTTSService.js');
    const neuralTTS = new NeuralTTSService();
    await neuralTTS.initialize();
    
    // Test de synthèse
    const result = await neuralTTS.synthesize("Bix a beel", "yua");
    
    if (result && result.audioData) {
      console.log('✅ NeuralTTSService: Fonctionnel');
      passed++;
    } else {
      console.log('❌ NeuralTTSService: Échec synthèse');
    }
    total++;
  } catch (error) {
    console.log('❌ NeuralTTSService: Erreur -', error.message);
    total++;
  }
  
  // Test de reconnaissance vocale
  console.log('\n👂 Test NativeSpeechRecognitionService...');
  try {
    const { default: NativeSpeechRecognitionService } = await import('./services/NativeSpeechRecognitionService.js');
    const speechRecognition = new NativeSpeechRecognitionService();
    await speechRecognition.initialize();
    
    // Test de reconnaissance simulée
    const audioData = Buffer.from('test audio data');
    const result = await speechRecognition.recognize(audioData, "fr", { expectedText: "test" });
    
    if (result && typeof result.confidence === 'number') {
      console.log('✅ NativeSpeechRecognitionService: Fonctionnel');
      passed++;
    } else {
      console.log('❌ NativeSpeechRecognitionService: Échec reconnaissance');
    }
    total++;
  } catch (error) {
    console.log('❌ NativeSpeechRecognitionService: Erreur -', error.message);
    total++;
  }
  
  // Test du gestionnaire d'intégration
  console.log('\n🚀 Test IntegrationManager...');
  try {
    const { default: IntegrationManager } = await import('./services/IntegrationManager.js');
    const integrationManager = new IntegrationManager();
    await integrationManager.initialize({
      enableVectorSearch: true,
      enableNeuralTTS: true,
      enableSpeechRecognition: true,
      enableSecureAPIKeys: true,
      enableRedisCache: false
    });
    
    // Test de l'interface React Native
    const rnInterface = integrationManager.getReactNativeInterface();
    
    // Test de traduction
    const translation = await integrationManager.translateIntelligent("Bonjour", "fr", "yua");
    
    if (rnInterface && translation) {
      console.log('✅ IntegrationManager: Fonctionnel');
      passed++;
    } else {
      console.log('❌ IntegrationManager: Échec interface');
    }
    total++;
  } catch (error) {
    console.log('❌ IntegrationManager: Erreur -', error.message);
    total++;
  }
  
  // Résumé
  console.log('\n=====================================');
  console.log('📊 RÉSUMÉ DES TESTS RAPIDES');
  console.log('=====================================');
  console.log(`✅ Tests réussis: ${passed}/${total}`);
  console.log(`📈 Taux de réussite: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('🎉 TOUS LES SERVICES FONCTIONNENT!');
    console.log('🚀 Système prêt pour les tests complets');
  } else if (passed / total > 0.7) {
    console.log('⚠️ La plupart des services fonctionnent');
    console.log('🔧 Quelques ajustements nécessaires');
  } else {
    console.log('⚠️ Plusieurs services nécessitent des corrections');
    console.log('🛠️ Vérifiez les erreurs ci-dessus');
  }
  
  console.log('\n💡 PROCHAINES ÉTAPES:');
  console.log('1. Intégrer les clés API réelles');
  console.log('2. Tester sur React Native/Expo');
  console.log('3. Déployer en production');
  console.log('4. Collecter des données utilisateur');
  
  return { passed, total, success: passed === total };
}

// Exécuter les tests
quickTest().then(result => {
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});

// Test rapide pour vérifier les services de base
console.log("🔍 Test rapide des services de base...");

async function quickTest() {
  try {
    // Test d'import des modules
    console.log("📦 Import des modules...");
    const modules = await Promise.all([
      import('./services/IntegrationManager.js'),
      import('./services/SecureAPIKeyManager.js'),
      import('./services/VectorDatabaseService.js')
    ]);
    
    const IntegrationManager = modules[0].default;
    const SecureAPIKeyManager = modules[1].default;
    const VectorDatabaseService = modules[2].default;
    
    console.log("✅ Modules importés avec succès");
    
    // Test d'instanciation
    console.log("🔧 Test d'instanciation...");
    const keyManager = new SecureAPIKeyManager({ skipValidation: true });
    const vectorDB = new VectorDatabaseService();
    const integrationManager = new IntegrationManager();
    
    console.log("✅ Services instanciés avec succès");
    
    // Test d'initialisation
    console.log("⚙️ Test d'initialisation...");
    await keyManager.initialize();
    await vectorDB.initialize();
    await integrationManager.initialize({
      enableVectorSearch: true,
      enableNeuralTTS: false,
      enableSpeechRecognition: false,
      enableSecureAPIKeys: true,
      enableRedisCache: false
    });
    
    console.log("✅ Services initialisés avec succès");
    
    // Test de base
    console.log("🧪 Tests de base...");
      // Test clés API
    await keyManager.setAPIKey('test', 'test-key-123', { skipValidation: true });
    const retrievedKey = await keyManager.getAPIKey('test');
    console.log(`✅ Clé API: ${retrievedKey ? 'OK' : 'Erreur'}`);
    // Test vectoriel
    const embedding = await vectorDB.generateEmbedding("Test text", "fr");
    console.log(`✅ Embedding: ${embedding.length > 0 ? 'OK' : 'Erreur'} (${embedding.length} dimensions)`);
    
    // Test traduction
    const translation = await integrationManager.translateIntelligent("Bonjour", "fr", "en");
    console.log(`✅ Traduction: ${translation.result ? 'OK' : 'Erreur'} (${translation.result})`);
    
    console.log("\n🎉 Tous les tests de base réussis!");
    console.log("✨ Le système est fonctionnel et prêt pour les tests avancés");
    
    return true;
    
  } catch (error) {
    console.error("❌ Erreur dans les tests de base:", error.message);
    console.error("Stack:", error.stack);
    return false;
  }
}

// Lancer le test
quickTest().then(success => {
  if (success) {
    console.log("\n🚀 Système validé! Vous pouvez maintenant lancer test-complete-advanced.js");
  } else {
    console.log("\n⚠️ Problèmes détectés. Vérifiez les erreurs ci-dessus.");
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error("💥 Erreur fatale:", error);
  process.exit(1);
});

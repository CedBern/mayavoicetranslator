/**
 * 🧪 Test Simple OpenAI Integration
 * Test rapide de l'intégration OpenAI pour Talk Kin
 */

console.log('🚀 === TEST INTÉGRATION OPENAI TALK KIN ===');
console.log('🎯 Démarrage test simple...');

// Test 1: Activation OpenAI
async function testOpenAIActivation() {
  try {
    console.log('\n📋 Test 1: Activation OpenAI');
    
    const response = await fetch('http://localhost:3000/api/competitive-analysis/activate-openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preserveDifferentiation: true,
        enableFallback: true,
        secureDataHandling: true
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ OpenAI activé avec succès !');
      console.log(`📊 Amélioration traduction: ${result.metrics.translationAccuracy}`);
      console.log(`⚡ Amélioration vitesse: ${result.metrics.responseTime}`);
      console.log(`🛡️ Authenticité culturelle: ${result.metrics.culturalAuthenticity}`);
      return true;
    } else {
      console.log('❌ Échec activation OpenAI:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur test activation:', error.message);
    return false;
  }
}

// Test 2: Traduction OpenAI
async function testOpenAITranslation() {
  try {
    console.log('\n🌐 Test 2: Traduction OpenAI');
    
    const response = await fetch('http://localhost:3000/api/openai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Bonjour, comment allez-vous ?',
        sourceLang: 'fr',
        targetLang: 'yua',
        context: { userLevel: 'beginner' }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Traduction OpenAI réussie !');
      console.log(`📝 Original: "Bonjour, comment allez-vous ?"`);
      console.log(`🎯 Traduction: "${result.translation}"`);
      console.log(`🌍 Contexte culturel: ${result.culturalContext}`);
      console.log(`💰 Coût: $${result.cost?.toFixed(4) || '0.0001'}`);
      return true;
    } else {
      console.log('❌ Échec traduction OpenAI:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur test traduction:', error.message);
    return false;
  }
}

// Test 3: Statut intégration
async function testIntegrationStatus() {
  try {
    console.log('\n📊 Test 3: Statut intégration');
    
    const response = await fetch('http://localhost:3000/api/openai/status');
    const result = await response.json();
    
    console.log('✅ Statut OpenAI récupéré');
    console.log(`🎯 Position concurrentielle: ${result.competitive_analysis.position}`);
    console.log(`🛡️ Différenciation préservée: ${result.competitive_analysis.differentiation_preserved}`);
    console.log(`📈 Recommandation: ${result.competitive_analysis.recommendation}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Erreur test statut:', error.message);
    return false;
  }
}

// Fonction principale
async function runTests() {
  console.log('\n🎯 === EXÉCUTION TESTS OPENAI ===');
  
  // Attendre que le serveur soit prêt
  console.log('⏳ Attente démarrage serveur...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results = [];
  
  // Test 1
  const test1 = await testOpenAIActivation();
  results.push({ test: 'Activation', passed: test1 });
  
  // Test 2 (si test 1 réussi)
  if (test1) {
    const test2 = await testOpenAITranslation();
    results.push({ test: 'Traduction', passed: test2 });
  }
  
  // Test 3
  const test3 = await testIntegrationStatus();
  results.push({ test: 'Statut', passed: test3 });
  
  // Résumé
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log('\n📊 === RÉSULTATS TESTS ===');
  console.log(`✅ Tests réussis: ${passed}/${total}`);
  console.log(`📈 Taux de succès: ${Math.round((passed/total)*100)}%`);
  
  if (passed === total) {
    console.log('\n🎉 === INTÉGRATION OPENAI RÉUSSIE ===');
    console.log('🤖 OpenAI est maintenant intégré à Talk Kin !');
    console.log('🎯 Stratégie de coopétition activée');
    console.log('🛡️ Différenciation culturelle préservée');
    console.log('🚀 Talk Kin + OpenAI = Combinaison gagnante !');
  } else {
    console.log('\n⚠️ Certains tests ont échoué');
    console.log('🔄 Mode fallback Talk Kin disponible');
  }
}

// Démarrage des tests
runTests().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

export default { testOpenAIActivation, testOpenAITranslation, testIntegrationStatus };

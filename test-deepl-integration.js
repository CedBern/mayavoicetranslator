/**
 * 🧪 Test DeepL Integration - Talk Kin
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

async function testDeepLIntegration() {
  console.log('🧪 === TEST INTÉGRATION DEEPL ===\n');
  
  const tests = [
    { text: 'hello', from: 'en', to: 'fr', expected: 'Bonjour' },
    { text: 'thank you', from: 'en', to: 'es', expected: 'Muchas gracias' },
    { text: 'good morning', from: 'en', to: 'de', expected: 'Guten Morgen' },
    { text: 'beautiful', from: 'en', to: 'fr', expected: 'Belle' }
  ];
  
  let passed = 0;
  
  for (const test of tests) {
    try {
      console.log(`🔄 Test: "${test.text}" (${test.from} → ${test.to})`);
      
      const response = await axios.post(`${API_BASE}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });
      
      if (response.data.success) {
        console.log(`   ✅ Traduction: "${response.data.translation}"`);
        console.log(`   📊 Confiance: ${(response.data.confidence * 100).toFixed(1)}%`);
        console.log(`   🤖 API: ${response.data.api_used}`);
        
        if (response.data.premium_quality) {
          console.log(`   ⭐ Qualité premium détectée`);
        }
        
        if (response.data.translation.includes(test.expected)) {
          console.log(`   ✅ Test réussi`);
          passed++;
        } else {
          console.log(`   ⚠️ Traduction différente d'attendue`);
        }
      } else {
        console.log(`   ❌ Échec: ${response.data.error}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log(`📊 Résultats: ${passed}/${tests.length} tests réussis`);
  
  if (passed === tests.length) {
    console.log('🎉 INTÉGRATION DEEPL VALIDÉE !');
  } else {
    console.log('⚠️ Quelques ajustements nécessaires');
  }
}

testDeepLIntegration()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });

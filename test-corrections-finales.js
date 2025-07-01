/**
 * 🧪 TEST DE VALIDATION DES CORRECTIONS FINALES
 * Validation de toutes les corrections apportées au système de traduction
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Tests de validation complète
const VALIDATION_TESTS = [
  // === TESTS DEEPL (PRIORITÉ) ===
  {
    category: "DeepL Priority",
    tests: [
      { text: "hello", from: "en", to: "fr", expected_api: "deepl", expected_confidence: 0.95 },
      { text: "thank you", from: "en", to: "es", expected_api: "deepl", expected_confidence: 0.95 },
      { text: "good morning", from: "en", to: "de", expected_api: "deepl", expected_confidence: 0.95 }
    ]
  },
  
  // === TESTS OPENAI CULTUREL (LANGUES INDIGÈNES) ===
  {
    category: "OpenAI Cultural Context",
    tests: [
      { text: "hello", from: "en", to: "yua", expected_api: "openai", expected_cultural: true },
      { text: "thank you", from: "en", to: "qu", expected_api: "openai", expected_cultural: true },
      { text: "family", from: "en", to: "gn", expected_api: "openai", expected_cultural: true }
    ]
  },
  
  // === TESTS GOOGLE FALLBACK ===
  {
    category: "Google Translate Fallback", 
    tests: [
      { text: "computer", from: "en", to: "fr", expected_api: "google", min_confidence: 0.8 },
      { text: "beautiful", from: "en", to: "es", expected_api: "google", min_confidence: 0.8 }
    ]
  },
  
  // === TESTS DICTIONNAIRE (SANS DOUBLONS) ===
  {
    category: "Dictionary (No Duplicates)",
    tests: [
      { text: "hello", from: "en", to: "yue", expected_translation: "你好", expected_api: "dictionary" },
      { text: "water", from: "en", to: "fr", expected_translation: "eau", expected_api: "dictionary" },
      { text: "bonjour", from: "fr", to: "yua", expected_translation: "ba'ax ka wa'alik", expected_api: "dictionary" }
    ]
  },
  
  // === TESTS GESTION ERREURS ===
  {
    category: "Error Handling",
    tests: [
      { text: "nonexistent_word_xyz", from: "en", to: "yua", expected_success: false, expected_method: "not_found" },
      { text: "hello", from: "invalid", to: "fr", expected_error: true },
      { text: "", from: "en", to: "fr", expected_error: true }
    ]
  }
];

// Fonction de test de traduction
async function testTranslation(testCase) {
  try {
    const response = await axios.post(`${API_BASE}/api/translate`, {
      text: testCase.text,
      from: testCase.from,
      to: testCase.to
    }, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 600; // Accepter même les erreurs 4xx et 5xx
      }
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 0
    };
  }
}

// Fonction principale de validation
async function runValidationTests() {
  console.log('🧪 === VALIDATION DES CORRECTIONS FINALES ===');
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  console.log('');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];
  
  for (const category of VALIDATION_TESTS) {
    console.log(`📊 CATÉGORIE: ${category.category}`);
    console.log('──────────────────────────────────────────────────');
    
    for (const test of category.tests) {
      totalTests++;
      console.log(`🔄 Test: "${test.text}" (${test.from} → ${test.to})`);
      
      const result = await testTranslation(test);
      
      if (!result.success) {
        console.log(`   ❌ Échec réseau: ${result.error}`);
        failedTests.push({ test, error: result.error, category: category.category });
        continue;
      }
      
      // Vérification des attentes
      let testPassed = true;
      let errorMessages = [];
      
      // Test d'erreur attendue
      if (test.expected_error) {
        if (result.status === 200 && result.data.success !== false) {
          testPassed = false;
          errorMessages.push("Erreur attendue mais non reçue");
        } else {
          console.log(`   ✅ Erreur correctement gérée (${result.status})`);
        }
      } else {
        // Tests normaux
        if (result.status !== 200) {
          testPassed = false;
          errorMessages.push(`Status HTTP incorrect: ${result.status}`);
        }
        
        if (test.expected_success === false) {
          if (result.data.success !== false) {
            testPassed = false;
            errorMessages.push("Échec attendu mais succès reçu");
          }
        } else {
          if (result.data.success !== true) {
            testPassed = false;
            errorMessages.push("Succès attendu mais échec reçu");
          }
        }
        
        // Vérification API utilisée
        if (test.expected_api && result.data.api !== test.expected_api) {
          testPassed = false;
          errorMessages.push(`API attendue: ${test.expected_api}, reçue: ${result.data.api}`);
        }
        
        // Vérification confiance
        if (test.expected_confidence && result.data.confidence !== test.expected_confidence) {
          testPassed = false;
          errorMessages.push(`Confiance attendue: ${test.expected_confidence}, reçue: ${result.data.confidence}`);
        }
        
        if (test.min_confidence && result.data.confidence < test.min_confidence) {
          testPassed = false;
          errorMessages.push(`Confiance minimale: ${test.min_confidence}, reçue: ${result.data.confidence}`);
        }
        
        // Vérification contexte culturel
        if (test.expected_cultural && !result.data.cultural_context) {
          testPassed = false;
          errorMessages.push("Contexte culturel attendu mais absent");
        }
        
        // Vérification traduction exacte
        if (test.expected_translation && result.data.translation !== test.expected_translation) {
          testPassed = false;
          errorMessages.push(`Traduction attendue: "${test.expected_translation}", reçue: "${result.data.translation}"`);
        }
        
        // Vérification méthode
        if (test.expected_method && result.data.method !== test.expected_method) {
          testPassed = false;
          errorMessages.push(`Méthode attendue: ${test.expected_method}, reçue: ${result.data.method}`);
        }
      }
      
      if (testPassed) {
        passedTests++;
        console.log(`   ✅ Test réussi`);
        if (result.data.translation) {
          console.log(`   → Traduction: "${result.data.translation}"`);
        }
        if (result.data.api) {
          console.log(`   🤖 API: ${result.data.api} (confiance: ${result.data.confidence})`);
        }
        if (result.data.cultural_context) {
          console.log(`   🎭 Contexte culturel appliqué`);
        }
      } else {
        console.log(`   ❌ Test échoué:`);
        errorMessages.forEach(msg => console.log(`      • ${msg}`));
        failedTests.push({ test, errorMessages, category: category.category, result: result.data });
      }
      
      console.log('');
    }
  }
  
  // Rapport final
  console.log('📊 RAPPORT DE VALIDATION FINALE');
  console.log('══════════════════════════════════════════════════');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ Tests échoués: ${failedTests.length}/${totalTests}`);
  
  if (failedTests.length > 0) {
    console.log('');
    console.log('💔 DÉTAILS DES ÉCHECS');
    console.log('══════════════════════════════════════════════════');
    failedTests.forEach((failure, index) => {
      console.log(`${index + 1}. [${failure.category}] "${failure.test.text}" (${failure.test.from} → ${failure.test.to})`);
      if (failure.errorMessages) {
        failure.errorMessages.forEach(msg => console.log(`   • ${msg}`));
      } else {
        console.log(`   • ${failure.error}`);
      }
    });
  }
  
  console.log('');
  console.log('💡 CORRECTIONS APPORTÉES');
  console.log('══════════════════════════════════════════════════');
  console.log('✅ 1. Logique multi-API implémentée (DeepL → Google → OpenAI → Dictionnaire)');
  console.log('✅ 2. Doublons dictionnaires supprimés (en_yue canonisé avec caractères chinois)');
  console.log('✅ 3. Contexte culturel pour langues indigènes (OpenAI)');
  console.log('✅ 4. Gestion d\'erreurs améliorée');
  console.log('✅ 5. Validation des langues supportées');
  console.log('✅ 6. Logs détaillés pour debugging');
  
  console.log('');
  const status = passedTests === totalTests ? 'COMPLET' : 'PARTIEL';
  const emoji = passedTests === totalTests ? '🎉' : '⚠️';
  console.log(`🏁 Validation terminée: ${status} ${emoji}`);
  
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests.length,
    success_rate: (passedTests/totalTests)*100,
    status: status
  };
}

// Tests de santé du serveur
async function testServerHealth() {
  try {
    const response = await axios.get(`${API_BASE}/api/health`, { timeout: 2000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Point d'entrée principal
async function main() {
  console.log('🔍 Vérification de l\'état du serveur...');
  
  const serverHealthy = await testServerHealth();
  if (!serverHealthy) {
    console.log('❌ Serveur non disponible sur http://localhost:3001');
    console.log('💡 Assurez-vous que le serveur est démarré avec: node api-server-enhanced.js');
    process.exit(1);
  }
  
  console.log('✅ Serveur opérationnel');
  console.log('');
  
  await runValidationTests();
}

// Exécution si appelé directement
main().catch(error => {
  console.error('❌ Erreur lors des tests:', error);
  process.exit(1);
});

export { runValidationTests, testTranslation };

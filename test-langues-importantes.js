/**
 * 🌍 TEST DES LANGUES IMPORTANTES MANQUANTES
 * Validation des langues majeures ajoutées : Portugais, Russe, Ourdou, Swahili, etc.
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Tests pour les langues importantes ajoutées
const NOUVELLES_LANGUES_TESTS = [
  // === LANGUES CRITIQUES MANQUANTES ===
  {
    category: "🚨 Langues Critiques (Portugais, Russe)",
    tests: [
      { text: "hello", from: "en", to: "pt", expected_success: true, note: "Portugais - 260M locuteurs" },
      { text: "hello", from: "en", to: "ru", expected_success: true, note: "Russe - 258M locuteurs" },
      { text: "computer", from: "en", to: "pt", expected_api: "google", note: "Test Google Portugais" },
      { text: "computer", from: "en", to: "ru", expected_api: "google", note: "Test Google Russe" },
      { text: "thank you", from: "en", to: "pt", expected_api: "deepl", note: "Test DeepL Portugais" },
      { text: "thank you", from: "en", to: "ru", expected_api: "deepl", note: "Test DeepL Russe" }
    ]
  },
  
  // === LANGUES IMPORTANTES SUPPLÉMENTAIRES ===
  {
    category: "🌍 Langues Importantes (Ourdou, Swahili, etc.)",
    tests: [
      { text: "hello", from: "en", to: "ur", expected_success: true, note: "Ourdou - 170M locuteurs (Pakistan)" },
      { text: "hello", from: "en", to: "sw", expected_success: true, note: "Swahili - 150M locuteurs (Afrique Est)" },
      { text: "hello", from: "en", to: "vi", expected_success: true, note: "Vietnamien - 85M locuteurs" },
      { text: "hello", from: "en", to: "th", expected_success: true, note: "Thaï - 60M locuteurs" },
      { text: "hello", from: "en", to: "tl", expected_success: true, note: "Tagalog - 45M locuteurs (Philippines)" },
      { text: "hello", from: "en", to: "he", expected_success: true, note: "Hébreu - 9M locuteurs (Israël)" }
    ]
  },
  
  // === TESTS COUVERTURE GOOGLE ===
  {
    category: "🌐 Couverture Google Translate Étendue",
    tests: [
      { text: "computer", from: "en", to: "ur", expected_api: "google", note: "Google Ourdou" },
      { text: "computer", from: "en", to: "sw", expected_api: "google", note: "Google Swahili" },
      { text: "computer", from: "en", to: "vi", expected_api: "google", note: "Google Vietnamien" },
      { text: "computer", from: "en", to: "th", expected_api: "google", note: "Google Thaï" },
      { text: "computer", from: "en", to: "tl", expected_api: "google", note: "Google Tagalog" },
      { text: "computer", from: "en", to: "he", expected_api: "google", note: "Google Hébreu" }
    ]
  },
  
  // === TESTS COUVERTURE DEEPL ===
  {
    category: "🏆 Couverture DeepL Premium",
    tests: [
      { text: "good morning", from: "en", to: "pt", expected_api: "deepl", note: "DeepL Portugais" },
      { text: "good morning", from: "en", to: "ru", expected_api: "deepl", note: "DeepL Russe" },
      { text: "good morning", from: "en", to: "id", expected_api: "deepl", note: "DeepL Indonésien" },
      { text: "good morning", from: "en", to: "tr", expected_api: "deepl", note: "DeepL Turc" }
    ]
  },
  
  // === TESTS IMPACT GÉOGRAPHIQUE ===
  {
    category: "🌍 Impact Géographique Global",
    tests: [
      // Brésil
      { text: "family", from: "en", to: "pt", expected_success: true, note: "Brésil - 215M (5ème économie)" },
      // Russie/Ex-URSS
      { text: "family", from: "en", to: "ru", expected_success: true, note: "Russie/Ex-URSS - Immense territoire" },
      // Pakistan
      { text: "family", from: "en", to: "ur", expected_success: true, note: "Pakistan - 220M habitants" },
      // Afrique de l'Est
      { text: "family", from: "en", to: "sw", expected_success: true, note: "Kenya/Tanzanie - Croissance rapide" },
      // Asie du Sud-Est
      { text: "family", from: "en", to: "vi", expected_success: true, note: "Vietnam - Économie émergente" },
      { text: "family", from: "en", to: "th", expected_success: true, note: "Thaïlande - Hub ASEAN" },
      { text: "family", from: "en", to: "tl", expected_success: true, note: "Philippines - 110M habitants" }
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
        return status < 600;
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
async function runLanguageExpansionTests() {
  console.log('🌍 === VALIDATION DES LANGUES IMPORTANTES AJOUTÉES ===');
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  console.log('');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];
  let criticalFailures = 0;
  
  for (const category of NOUVELLES_LANGUES_TESTS) {
    console.log(`📊 CATÉGORIE: ${category.category}`);
    console.log('──────────────────────────────────────────────────');
    
    for (const test of category.tests) {
      totalTests++;
      console.log(`🔄 Test: "${test.text}" (${test.from} → ${test.to})`);
      if (test.note) {
        console.log(`   💡 ${test.note}`);
      }
      
      const result = await testTranslation(test);
      
      if (!result.success) {
        console.log(`   ❌ Échec réseau: ${result.error}`);
        failedTests.push({ test, error: result.error, category: category.category });
        if (category.category.includes('🚨')) criticalFailures++;
        continue;
      }
      
      // Vérification des attentes
      let testPassed = true;
      let errorMessages = [];
      
      if (result.status !== 200) {
        testPassed = false;
        errorMessages.push(`Status HTTP incorrect: ${result.status}`);
      }
      
      if (test.expected_success !== false && result.data.success !== true) {
        testPassed = false;
        errorMessages.push("Traduction échouée");
      }
      
      // Vérification API utilisée
      if (test.expected_api && result.data.api !== test.expected_api) {
        testPassed = false;
        errorMessages.push(`API attendue: ${test.expected_api}, reçue: ${result.data.api}`);
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
        if (category.category.includes('🚨')) {
          console.log(`   🔥 SUCCÈS CRITIQUE !`);
        }
      } else {
        console.log(`   ❌ Test échoué:`);
        errorMessages.forEach(msg => console.log(`      • ${msg}`));
        failedTests.push({ test, errorMessages, category: category.category, result: result.data });
        if (category.category.includes('🚨')) criticalFailures++;
      }
      
      console.log('');
    }
  }
  
  // Rapport final
  console.log('📊 RAPPORT DE VALIDATION DES LANGUES IMPORTANTES');
  console.log('══════════════════════════════════════════════════');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ Tests échoués: ${failedTests.length}/${totalTests}`);
  console.log(`🚨 Échecs critiques: ${criticalFailures}/${totalTests}`);
  
  // Analyse de l'impact
  console.log('');
  console.log('🌍 NOUVELLES LANGUES AJOUTÉES');
  console.log('══════════════════════════════════════════════════');
  console.log('✅ 🇧🇷🇵🇹 Portugais (pt) → 260M locuteurs (Brésil, Portugal, Afrique)');
  console.log('✅ 🇷🇺 Russe (ru) → 258M locuteurs (Russie, Ex-URSS)');
  console.log('✅ 🇵🇰 Ourdou (ur) → 170M locuteurs (Pakistan, Inde)');
  console.log('✅ 🇰🇪🇹🇿 Swahili (sw) → 150M locuteurs (Afrique de l\'Est)');
  console.log('✅ 🇻🇳 Vietnamien (vi) → 85M locuteurs (Vietnam)');
  console.log('✅ 🇹🇭 Thaï (th) → 60M locuteurs (Thaïlande)');
  console.log('✅ 🇵🇭 Tagalog (tl) → 45M locuteurs (Philippines)');
  console.log('✅ 🇮🇱 Hébreu (he) → 9M locuteurs (Israël)');
  
  console.log('');
  console.log('📈 IMPACT ESTIMÉ');
  console.log('══════════════════════════════════════════════════');
  console.log('📊 Nouvelles langues: +8 langues importantes');
  console.log('👥 Nouveaux utilisateurs potentiels: +1.037 MILLIARD');
  console.log('🌍 Couverture géographique: +7 régions majeures');
  console.log('🏆 APIs supportées: DeepL (pt, ru) + Google (toutes)');
  
  if (failedTests.length > 0) {
    console.log('');
    console.log('💔 DÉTAILS DES ÉCHECS');
    console.log('══════════════════════════════════════════════════');
    failedTests.forEach((failure, index) => {
      console.log(`${index + 1}. [${failure.category}] "${failure.test.text}" (${failure.test.from} → ${failure.test.to})`);
      if (failure.test.note) {
        console.log(`   💡 ${failure.test.note}`);
      }
      if (failure.errorMessages) {
        failure.errorMessages.forEach(msg => console.log(`   • ${msg}`));
      } else {
        console.log(`   • ${failure.error}`);
      }
    });
  }
  
  console.log('');
  const status = criticalFailures === 0 ? 'SUCCÈS CRITIQUE' : 'ÉCHECS CRITIQUES DÉTECTÉS';
  const emoji = criticalFailures === 0 ? '🎉' : '🚨';
  console.log(`🏁 Validation terminée: ${status} ${emoji}`);
  
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests.length,
    critical_failures: criticalFailures,
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
  
  await runLanguageExpansionTests();
}

// Exécution
main().catch(error => {
  console.error('❌ Erreur lors des tests:', error);
  process.exit(1);
});

export { runLanguageExpansionTests, testTranslation };

/**
 * 🧪 TEST DE VALIDATION DES LANGUES NATIONALES CRITIQUES
 * Validation de l'ajout des langues nationales manquantes
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Tests de validation des langues nationales
const NATIONAL_LANGUAGES_TESTS = [
  // === INDONÉSIEN (CRITIQUE POUR JAVANAIS) ===
  {
    category: "Indonésien → Support Javanais",
    tests: [
      { text: "hello", from: "en", to: "id", expected_translation: "halo" },
      { text: "family", from: "en", to: "id", expected_translation: "keluarga" },
      { text: "terima kasih", from: "id", to: "jv", expected_translation: "matur nuwun" },
      { text: "keluarga", from: "id", to: "jv", expected_translation: "kulawarga" },
      { text: "computer", from: "en", to: "id", expected_api: "google" }
    ]
  },
  
  // === HINDI (CRITIQUE POUR LANGUES INDIENNES) ===
  {
    category: "Hindi → Support Langues Indiennes",
    tests: [
      { text: "hello", from: "en", to: "hi", expected_translation: "नमस्ते" },
      { text: "family", from: "en", to: "hi", expected_translation: "परिवार" },
      { text: "computer", from: "en", to: "hi", expected_api: "google" },
      // Test critiques des liaisons régionales
      { text: "नमस्ते", from: "hi", to: "mr", expected_translation: "नमस्कार" },
      { text: "परिवार", from: "hi", to: "ta", expected_translation: "குடும்பம்" }
    ]
  },
  
  // === NÉERLANDAIS (EXPANSION EUROPÉENNE) ===
  {
    category: "Néerlandais → Expansion Européenne",
    tests: [
      { text: "hello", from: "en", to: "nl", expected_translation: "hallo" },
      { text: "family", from: "en", to: "nl", expected_translation: "familie" },
      { text: "computer", from: "en", to: "nl", expected_api: "google" }
    ]
  },
  
  // === TURC (PONT ASIE-EUROPE) ===
  {
    category: "Turc → Pont Asie-Europe",
    tests: [
      { text: "hello", from: "en", to: "tr", expected_translation: "merhaba" },
      { text: "family", from: "en", to: "tr", expected_translation: "aile" },
      { text: "computer", from: "en", to: "tr", expected_api: "google" }
    ]
  },
  
  // === TESTS DE DÉCOUVRABILITÉ (PAIRES COMPLÈTES) ===
  {
    category: "Découvrabilité Langues Régionales",
    tests: [
      // Utilisateur indonésien cherche traduction javanaise
      { text: "selamat pagi", from: "id", to: "jv", expected_translation: "sugeng enjing" },
      { text: "budaya", from: "id", to: "jv", expected_translation: "budaya" },
      
      // Utilisateur indien cherche traduction marathi
      { text: "नमस्ते", from: "hi", to: "mr", expected_translation: "नमस्कार" },
      { text: "दोस्त", from: "hi", to: "mr", expected_translation: "मित्र" },
      
      // Cas d'usage mixtes (anglais → langue régionale via nationale)
      { text: "hello", from: "en", to: "jv", expected_success: true },
      { text: "hello", from: "en", to: "mr", expected_success: true }
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
async function runNationalLanguagesValidation() {
  console.log('🌍 === VALIDATION DES LANGUES NATIONALES CRITIQUES ===');
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  console.log('');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];
  let criticalFailures = [];
  
  for (const category of NATIONAL_LANGUAGES_TESTS) {
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
      
      // Test de succès
      if (test.expected_success !== undefined) {
        if (result.data.success !== test.expected_success) {
          testPassed = false;
          errorMessages.push(`Succès attendu: ${test.expected_success}, reçu: ${result.data.success}`);
        }
      }
      
      // Test de traduction exacte
      if (test.expected_translation && result.data.translation !== test.expected_translation) {
        testPassed = false;
        errorMessages.push(`Traduction attendue: "${test.expected_translation}", reçue: "${result.data.translation}"`);
      }
      
      // Test d'API utilisée
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
        
        // Marquer les succès critiques
        if (category.category.includes("Indonésien") || category.category.includes("Hindi")) {
          console.log(`   🔥 SUCCÈS CRITIQUE !`);
        }
      } else {
        console.log(`   ❌ Test échoué:`);
        errorMessages.forEach(msg => console.log(`      • ${msg}`));
        failedTests.push({ test, errorMessages, category: category.category, result: result.data });
        
        // Marquer les échecs critiques
        if (category.category.includes("Indonésien") || category.category.includes("Hindi")) {
          criticalFailures.push({ test, errorMessages, category: category.category });
          console.log(`   🚨 ÉCHEC CRITIQUE !`);
        }
      }
      
      console.log('');
    }
  }
  
  // Rapport final
  console.log('📊 RAPPORT DE VALIDATION DES LANGUES NATIONALES');
  console.log('══════════════════════════════════════════════════');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ Tests échoués: ${failedTests.length}/${totalTests}`);
  console.log(`🚨 Échecs critiques: ${criticalFailures.length}/${totalTests}`);
  
  // Analyse des nouvelles langues ajoutées
  console.log('');
  console.log('🌍 NOUVELLES LANGUES NATIONALES AJOUTÉES');
  console.log('══════════════════════════════════════════════════');
  console.log('✅ 🇮🇩 Indonésien (id) → Support Javanais');
  console.log('✅ 🇮🇳 Hindi (hi) → Support Marathi, Telugu, Tamil, Bengali');
  console.log('✅ 🇳🇱 Néerlandais (nl) → Expansion européenne');
  console.log('✅ 🇹🇷 Turc (tr) → Pont Asie-Europe');
  
  // Impact estimé
  console.log('');
  console.log('📈 IMPACT UTILISATEUR ESTIMÉ');
  console.log('══════════════════════════════════════════════════');
  console.log('🇮🇩 +270M utilisateurs potentiels (Indonésie)');
  console.log('🇮🇳 +600M utilisateurs potentiels (Inde)');
  console.log('🇳🇱 +25M utilisateurs potentiels (Pays-Bas)');
  console.log('🇹🇷 +80M utilisateurs potentiels (Turquie)');
  console.log('📊 TOTAL: +975M utilisateurs potentiels');
  
  // Échecs critiques détaillés
  if (criticalFailures.length > 0) {
    console.log('');
    console.log('🚨 ÉCHECS CRITIQUES À RÉSOUDRE');
    console.log('══════════════════════════════════════════════════');
    criticalFailures.forEach((failure, index) => {
      console.log(`${index + 1}. [${failure.category}] "${failure.test.text}" (${failure.test.from} → ${failure.test.to})`);
      failure.errorMessages.forEach(msg => console.log(`   • ${msg}`));
    });
  }
  
  console.log('');
  const status = criticalFailures.length === 0 ? 'SUCCÈS CRITIQUE' : 'ATTENTION REQUISE';
  const emoji = criticalFailures.length === 0 ? '🎉' : '⚠️';
  console.log(`🏁 Validation terminée: ${status} ${emoji}`);
  
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests.length,
    critical_failures: criticalFailures.length,
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
  
  await runNationalLanguagesValidation();
}

// Exécution
main().catch(error => {
  console.error('❌ Erreur lors des tests:', error);
  process.exit(1);
});

export { runNationalLanguagesValidation };

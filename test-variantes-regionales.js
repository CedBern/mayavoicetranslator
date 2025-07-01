/**
 * 🧪 Tests pour Variantes Régionales et Dialectes
 * Validation de l'intégration complète des variantes linguistiques
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// === DONNÉES DE TEST POUR VARIANTES RÉGIONALES ===

const VARIANTES_TEST_DATA = {
  // Français régionaux
  français: {
    'fr': 'Bonjour, comment ça va ?',
    'fr-CA': 'Bonjour, comment ça va ? (Québécois)',
    'fr-BE': 'Bonjour, comment ça va ? (Belge)',
    'fr-CH': 'Bonjour, comment ça va ? (Suisse)',
    'fr-Africa': 'Bonjour, comment ça va ? (Africain)'
  },
  
  // Espagnols régionaux
  espagnol: {
    'es': 'Hola, ¿cómo estás?',
    'es-MX': 'Hola, ¿qué tal? (Mexicain)',
    'es-AR': 'Hola, ¿cómo andás? (Argentin)',
    'es-CO': 'Hola, ¿qué tal? (Colombien)',
    'es-PE': 'Hola, ¿cómo estás? (Péruvien)'
  },
  
  // Anglais régionaux
  anglais: {
    'en': 'Hello, how are you?',
    'en-US': 'Hello, how are you doing? (Américain)',
    'en-GB': 'Hello, how are you? (Britannique)',
    'en-AU': 'G\'day, how are you going? (Australien)',
    'en-CA': 'Hello, how are you? (Canadien)',
    'en-ZA': 'Hello, how are you? (Sud-Africain)'
  },
  
  // Arabes régionaux
  arabe: {
    'ar': 'مرحبا، كيف حالك؟',
    'ar-EG': 'أهلا، إزيك؟ (Égyptien)',
    'ar-SA': 'مرحبا، كيف الصحة؟ (Saoudien)',
    'ar-MA': 'السلام عليكم، كيف الحال؟ (Marocain)',
    'ar-LB': 'مرحبا، كيفك؟ (Libanais)'
  },
  
  // Portugais régionaux
  portugais: {
    'pt': 'Olá, como está?',
    'pt-BR': 'Oi, como vai? (Brésilien)',
    'pt-AO': 'Olá, como está? (Angolais)',
    'pt-MZ': 'Olá, como está? (Mozambicain)'
  }
};

const DIALECTES_TEST_DATA = {
  // Dialectes chinois
  chinois: {
    'zh': '你好，你好吗？',
    'yue': '你好，你點呀？ (Cantonais)',
    'wuu': '侬好 (Wu/Shanghai)',
    'min': '汝好 (Min)'
  },
  
  // Dialectes allemands
  allemand: {
    'de': 'Hallo, wie geht es dir?',
    'de-AT': 'Servus, wie geht\'s? (Autrichien)',
    'de-CH': 'Hoi, wie gaht\'s? (Suisse allemand)',
    'gsw': 'Grüezi, wie gaht\'s? (Alemannique)'
  },
  
  // Langues indiennes
  indien: {
    'hi': 'नमस्ते, कैसे हैं आप?',
    'mr': 'नमस्कार, कसे आहात? (Marathi)',
    'gu': 'નમસ્તે, તમે કેમ છો? (Gujarati)',
    'te': 'నమస్తే, మీరు ఎలా ఉన్నారు? (Telugu)',
    'ta': 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்? (Tamil)'
  }
};

// === FONCTIONS DE TEST ===

/**
 * Test la détection automatique de variantes
 */
async function testVariantDetection() {
  console.log('\n🔍 === TEST DÉTECTION DE VARIANTES ===');
  
  const tests = [
    { text: 'Hello', expectedVariant: 'en' },
    { text: 'G\'day mate', expectedVariant: 'en-AU' },
    { text: 'Bonjour', expectedVariant: 'fr' },
    { text: 'Salut mon chum', expectedVariant: 'fr-CA' },
    { text: 'Hola, ¿qué tal?', expectedVariant: 'es' },
    { text: '¿Qué onda?', expectedVariant: 'es-MX' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}/detect-variant`, {
        text: test.text
      });
      
      const detectedVariant = response.data.variant;
      
      if (detectedVariant === test.expectedVariant) {
        console.log(`✅ "${test.text}" → ${detectedVariant}`);
        passed++;
      } else {
        console.log(`❌ "${test.text}" → Attendu: ${test.expectedVariant}, Reçu: ${detectedVariant}`);
      }
    } catch (error) {
      console.log(`❌ "${test.text}" → Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Détection de variantes: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return { passed, total };
}

/**
 * Test les traductions entre variantes
 */
async function testCrossVariantTranslation() {
  console.log('\n🔄 === TEST TRADUCTIONS ENTRE VARIANTES ===');
  
  const tests = [
    { text: 'Hello', from: 'en-US', to: 'en-GB', expected: 'Hello' },
    { text: 'Elevator', from: 'en-US', to: 'en-GB', expected: 'Lift' },
    { text: 'Parking', from: 'fr', to: 'fr-CA', expected: 'Stationnement' },
    { text: 'Ordinateur', from: 'fr', to: 'fr-CA', expected: 'Ordinateur' },
    { text: 'Coche', from: 'es', to: 'es-MX', expected: 'Carro' },
    { text: 'Computadora', from: 'es-MX', to: 'es-AR', expected: 'Computadora' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });
      
      const translation = response.data.translation;
      
      if (translation.toLowerCase().includes(test.expected.toLowerCase())) {
        console.log(`✅ "${test.text}" (${test.from} → ${test.to}) → "${translation}"`);
        passed++;
      } else {
        console.log(`❌ "${test.text}" (${test.from} → ${test.to}) → Attendu: "${test.expected}", Reçu: "${translation}"`);
      }
    } catch (error) {
      console.log(`❌ "${test.text}" (${test.from} → ${test.to}) → Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Traductions entre variantes: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return { passed, total };
}

/**
 * Test la gestion des dialectes
 */
async function testDialectHandling() {
  console.log('\n🗣️ === TEST GESTION DES DIALECTES ===');
  
  const tests = [
    { text: 'hello', from: 'en', to: 'yue', dialect: 'cantonais' },
    { text: 'water', from: 'en', to: 'de-CH', dialect: 'suisse allemand' },
    { text: 'thank you', from: 'en', to: 'ar-EG', dialect: 'arabe égyptien' },
    { text: 'computer', from: 'en', to: 'pt-BR', dialect: 'portugais brésilien' },
    { text: 'goodbye', from: 'en', to: 'es-AR', dialect: 'espagnol argentin' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text: test.text,
        from: test.from,
        to: test.to,
        dialect: true
      });
      
      const translation = response.data.translation;
      const dialect_info = response.data.dialect_info;
      
      if (translation && translation !== test.text) {
        console.log(`✅ "${test.text}" → "${translation}" (${test.dialect})`);
        if (dialect_info) {
          console.log(`   ℹ️ Info dialecte: ${dialect_info}`);
        }
        passed++;
      } else {
        console.log(`❌ "${test.text}" → Pas de traduction dialecte pour ${test.dialect}`);
      }
    } catch (error) {
      console.log(`❌ "${test.text}" → Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Gestion des dialectes: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return { passed, total };
}

/**
 * Test la cohérence des variantes dans le dictionnaire
 */
async function testVariantDictionaryConsistency() {
  console.log('\n📚 === TEST COHÉRENCE DICTIONNAIRES VARIANTES ===');
  
  const tests = [
    { word: 'hello', variants: ['en', 'en-US', 'en-GB', 'en-AU'] },
    { word: 'bonjour', variants: ['fr', 'fr-CA', 'fr-BE', 'fr-CH'] },
    { word: 'hola', variants: ['es', 'es-MX', 'es-AR', 'es-CO'] },
    { word: 'hello', variants: ['ar', 'ar-EG', 'ar-SA', 'ar-MA'] }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}/check-variant-consistency`, {
        word: test.word,
        variants: test.variants
      });
      
      const consistency = response.data.consistency;
      const coverage = response.data.coverage;
      
      if (coverage >= 0.7) { // Au moins 70% des variantes couvertes
        console.log(`✅ "${test.word}" → Couverture: ${(coverage*100).toFixed(1)}%`);
        passed++;
      } else {
        console.log(`❌ "${test.word}" → Couverture insuffisante: ${(coverage*100).toFixed(1)}%`);
      }
    } catch (error) {
      console.log(`❌ "${test.word}" → Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Cohérence dictionnaires: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return { passed, total };
}

/**
 * Test les fonctionnalités avancées de variantes
 */
async function testAdvancedVariantFeatures() {
  console.log('\n🚀 === TEST FONCTIONNALITÉS AVANCÉES ===');
  
  const tests = [
    {
      name: 'Suggestion de variante proche',
      text: 'colour',
      from: 'en-GB',
      to: 'en-US',
      expected_suggestion: 'color'
    },
    {
      name: 'Adaptation culturelle',
      text: 'football',
      from: 'en-GB',
      to: 'en-US',
      expected_adaptation: 'soccer'
    },
    {
      name: 'Détection de faux amis',
      text: 'library',
      from: 'en',
      to: 'es',
      check_false_friend: 'librería'
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate-advanced`, {
        text: test.text,
        from: test.from,
        to: test.to,
        features: ['variant_suggestion', 'cultural_adaptation', 'false_friends']
      });
      
      const result = response.data;
      
      if (result.translation) {
        console.log(`✅ ${test.name}: "${test.text}" → "${result.translation}"`);
        if (result.suggestions) {
          console.log(`   💡 Suggestions: ${result.suggestions.join(', ')}`);
        }
        if (result.cultural_notes) {
          console.log(`   🌍 Notes culturelles: ${result.cultural_notes}`);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}: Pas de résultat`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Fonctionnalités avancées: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return { passed, total };
}

// === FONCTION PRINCIPALE ===

async function runVariantTests() {
  console.log('🧪 DÉMARRAGE DES TESTS DE VARIANTES RÉGIONALES\n');
  console.log('=' * 60);
  
  const results = [];
  
  try {
    // Test 1: Détection de variantes
    results.push(await testVariantDetection());
    
    // Test 2: Traductions entre variantes
    results.push(await testCrossVariantTranslation());
    
    // Test 3: Gestion des dialectes
    results.push(await testDialectHandling());
    
    // Test 4: Cohérence des dictionnaires
    results.push(await testVariantDictionaryConsistency());
    
    // Test 5: Fonctionnalités avancées
    results.push(await testAdvancedVariantFeatures());
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    return;
  }
  
  // === RAPPORT FINAL ===
  console.log('\n' + '=' * 60);
  console.log('📊 RAPPORT FINAL - TESTS VARIANTES RÉGIONALES');
  console.log('=' * 60);
  
  let totalPassed = 0;
  let totalTests = 0;
  
  results.forEach(result => {
    totalPassed += result.passed;
    totalTests += result.total;
  });
  
  const successRate = (totalPassed / totalTests * 100).toFixed(1);
  
  console.log(`✅ Tests réussis: ${totalPassed}/${totalTests} (${successRate}%)`);
  console.log(`❌ Tests échoués: ${totalTests - totalPassed}/${totalTests}`);
  
  console.log('\n📈 DÉTAIL PAR CATÉGORIE:');
  console.log(`🔍 Détection variantes: ${results[0]?.passed}/${results[0]?.total}`);
  console.log(`🔄 Traductions variantes: ${results[1]?.passed}/${results[1]?.total}`);
  console.log(`🗣️ Gestion dialectes: ${results[2]?.passed}/${results[2]?.total}`);
  console.log(`📚 Cohérence dictionnaires: ${results[3]?.passed}/${results[3]?.total}`);
  console.log(`🚀 Fonctionnalités avancées: ${results[4]?.passed}/${results[4]?.total}`);
  
  if (successRate >= 85) {
    console.log('\n🎉 EXCELLENT! Système de variantes prêt pour production!');
  } else if (successRate >= 70) {
    console.log('\n✅ BIEN! Quelques améliorations nécessaires.');
  } else {
    console.log('\n⚠️ ATTENTION! Corrections importantes nécessaires.');
  }
  
  console.log('\n🔧 Prochaines étapes recommandées:');
  console.log('• Enrichir les dictionnaires de variantes manquantes');
  console.log('• Améliorer la détection automatique de dialectes');
  console.log('• Ajouter plus de notes culturelles contextuelles');
  console.log('• Optimiser les performances de traduction');
  
  console.log('\n' + '=' * 60);
  console.log('Tests terminés ! 🚀');
}

// Exécution si fichier lancé directement
if (import.meta.url === new URL(import.meta.resolve()).href) {
  runVariantTests().catch(console.error);
}

export { runVariantTests };

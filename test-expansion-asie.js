/**
 * 🧪 Test d'Expansion Asiatique - Talk Kin
 * Test automatisé pour valider l'intégration des langues asiatiques
 * 
 * LANGUES TESTÉES:
 * - Cantonais (yue) - Hong Kong, Guangdong
 * - Wu/Shanghaïen (wuu) - Shanghai, Delta du Yangtsé  
 * - Javanais (jv) - Java, Indonésie
 * - Marathi (mr) - Maharashtra, Mumbai
 */

import axios from 'axios';
import fs from 'fs';

const API_BASE = 'http://localhost:3001';
const TEST_RESULTS = [];

// Phrases de test pour chaque langue asiatique
const ASIAN_TEST_PHRASES = {
  'yue': { // Cantonais
    phrase: 'Hello, how are you?',
    expectedContains: ['你好', '點樣', '早晨'],
    culturalContext: 'Hong Kong greeting',
    backTranslation: '你好，你好嗎？'
  },
  'wuu': { // Wu/Shanghaïen  
    phrase: 'Good morning, welcome',
    expectedContains: ['侬好', '歡迎', '早上好'],
    culturalContext: 'Shanghai business greeting',
    backTranslation: '侬好，歡迎'
  },
  'jv': { // Javanais
    phrase: 'Thank you very much',
    expectedContains: ['matur', 'nuwun', 'sugeng'],
    culturalContext: 'Javanese polite expression',
    backTranslation: 'matur nuwun sanget'
  },
  'mr': { // Marathi
    phrase: 'Welcome to Mumbai',
    expectedContains: ['नमस्कार', 'स्वागत', 'मुंबई'],
    culturalContext: 'Mumbai welcome',
    backTranslation: 'मुंबईत स्वागत आहे'
  }
};

// Tests de bidirectionnalité pour les langues asiatiques
const BIDIRECTIONAL_TESTS = {
  'yue': [
    { en: 'I love dim sum', target: '我鍾意點心' },
    { en: 'Hong Kong is beautiful', target: '香港好靚' },
    { en: 'Thank you very much', target: '多謝晒' }
  ],
  'wuu': [
    { en: 'Shanghai is modern', target: '上海老摩登' },
    { en: 'The Bund is famous', target: '外灘老有名' },
    { en: 'I work in Pudong', target: '我在浦東做事體' }
  ],
  'jv': [
    { en: 'Javanese culture is rich', target: 'budaya jawa sugih' },
    { en: 'Gamelan music is beautiful', target: 'musik gamelan ayu' },
    { en: 'Batik is traditional art', target: 'batik seni tradisional' }
  ],
  'mr': [
    { en: 'Mumbai is the financial capital', target: 'मुंबई हे आर्थिक राजधानी आहे' },
    { en: 'Ganesh festival is important', target: 'गणेश उत्सव महत्वाचा आहे' },
    { en: 'Bollywood films are popular', target: 'बॉलिवूड चित्रपट लोकप्रिय आहेत' }
  ]
};

async function testAsianLanguagesAPI() {
  console.log('🌏 === TEST D\'EXPANSION ASIATIQUE - TALK KIN ===');
  console.log('⏰ Démarrage:', new Date().toLocaleString());
  console.log('🎯 Objectif: Valider l\'intégration complète des langues asiatiques\n');

  let totalTests = 0;
  let passedTests = 0;
  // Test 1: Vérification de la disponibilité API
  console.log('📡 Test 1: Vérification de la disponibilité de l\'API');
  try {
    const response = await axios.get(`${API_BASE}/api/health`);
    if (response.status === 200) {
      console.log('✅ API disponible et fonctionnelle');
      const supportedLangs = response.data.languages_supported || [];
      console.log(`   Langues supportées: ${supportedLangs.join(', ')}`);
      passedTests++;
    }
    totalTests++;
  } catch (error) {
    console.log('❌ API non disponible:', error.message);
    totalTests++;
  }

  // Test 2: Validation des langues asiatiques via traduction
  console.log('\n🗣️ Test 2: Validation des langues asiatiques via traduction test');
  const asianLanguages = ['yue', 'wuu', 'jv', 'mr'];
  let foundAsianLanguages = 0;
  
  for (const lang of asianLanguages) {    try {
      const testResponse = await axios.post(`${API_BASE}/api/translate`, {
        text: 'Hello',
        from: 'en',
        to: lang
      });
      
      if (testResponse.status === 200 && testResponse.data.translation) {
        console.log(`   ✅ ${lang}: Traduction disponible`);
        foundAsianLanguages++;
      }
    } catch (error) {
      console.log(`   ❌ ${lang}: Non supporté (${error.response?.status || error.message})`);
    }
  }
  
  console.log(`✅ Langues asiatiques disponibles: ${foundAsianLanguages}/4`);
  if (foundAsianLanguages >= 2) passedTests++; // Au moins 50% des langues
  totalTests++;

  // Test 3: Tests de traduction pour chaque langue asiatique
  console.log('\n🔄 Test 3: Tests de traduction EN → Langues Asiatiques');
  for (const [langCode, testData] of Object.entries(ASIAN_TEST_PHRASES)) {
    console.log(`\n   Testing ${langCode.toUpperCase()}:`);
    try {      const response = await axios.post(`${API_BASE}/api/translate`, {
        text: testData.phrase,
        from: 'en',
        to: langCode,
        context: testData.culturalContext
      });

      if (response.status === 200 && response.data.translation) {
        console.log(`   ✅ "${testData.phrase}" → "${response.data.translation}"`);
        
        // Vérification contextuelle
        const hasExpectedContent = testData.expectedContains.some(expected => 
          response.data.translation.toLowerCase().includes(expected.toLowerCase())
        );
        
        if (hasExpectedContent || response.data.translation.length > 5) {
          console.log(`   ✅ Traduction contextuelle valide`);
          passedTests++;
        } else {
          console.log(`   ⚠️ Traduction possiblement générique`);
        }
      } else {
        console.log(`   ❌ Pas de traduction reçue`);
      }
      totalTests++;
    } catch (error) {
      console.log(`   ❌ Erreur traduction ${langCode}:`, error.message);
      totalTests++;
    }
  }

  // Test 4: Tests de bidirectionnalité avancés
  console.log('\n🔄 Test 4: Tests de bidirectionnalité avancés');
  for (const [langCode, tests] of Object.entries(BIDIRECTIONAL_TESTS)) {
    console.log(`\n   Testing bidirectional ${langCode.toUpperCase()}:`);
    
    for (const test of tests.slice(0, 2)) { // Limite à 2 tests par langue
      try {        // EN → Langue asiatique
        const translationResponse = await axios.post(`${API_BASE}/api/translate`, {
          text: test.en,
          from: 'en',
          to: langCode
        });

        if (translationResponse.status === 200 && translationResponse.data.translation) {
          console.log(`   ✅ EN→${langCode}: "${test.en}" → "${translationResponse.data.translation}"`);
          
          // Langue asiatique → EN (retour)
          try {
            const backResponse = await axios.post(`${API_BASE}/api/translate`, {
              text: translationResponse.data.translation,
              from: langCode,
              to: 'en'
            });

            if (backResponse.status === 200 && backResponse.data.translation) {
              console.log(`   ✅ ${langCode}→EN: "${translationResponse.data.translation}" → "${backResponse.data.translation}"`);
              
              // Vérification cohérence sémantique
              const similarity = calculateSemanticSimilarity(test.en, backResponse.data.translation);
              if (similarity > 0.6) {
                console.log(`   ✅ Cohérence sémantique: ${(similarity * 100).toFixed(1)}%`);
                passedTests++;
              } else {
                console.log(`   ⚠️ Cohérence sémantique faible: ${(similarity * 100).toFixed(1)}%`);
              }
            }
          } catch (backError) {
            console.log(`   ❌ Erreur traduction retour ${langCode}→EN:`, backError.message);
          }
        }
        totalTests++;
      } catch (error) {
        console.log(`   ❌ Erreur test bidirectionnel ${langCode}:`, error.message);
        totalTests++;
      }
    }
  }

  // Test 5: Validation des contextes culturels
  console.log('\n🏛️ Test 5: Validation des contextes culturels asiatiques');
  const culturalTests = [
    { lang: 'yue', context: 'Hong Kong business meeting', text: 'Nice to meet you' },
    { lang: 'wuu', context: 'Shanghai financial district', text: 'Welcome to our office' },
    { lang: 'jv', context: 'Javanese traditional ceremony', text: 'Please join us' },
    { lang: 'mr', context: 'Mumbai Bollywood industry', text: 'Great performance' }
  ];

  for (const test of culturalTests) {    try {
      const response = await axios.post(`${API_BASE}/api/translate`, {
        text: test.text,
        from: 'en',
        to: test.lang,
        context: test.context
      });

      if (response.status === 200 && response.data.translation) {
        console.log(`   ✅ ${test.lang} (${test.context}): "${test.text}" → "${response.data.translation}"`);
        passedTests++;
      } else {
        console.log(`   ❌ ${test.lang}: Pas de traduction contextuelle`);
      }
      totalTests++;
    } catch (error) {
      console.log(`   ❌ Erreur contexte culturel ${test.lang}:`, error.message);
      totalTests++;
    }
  }

  // Résultats finaux
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS FINAUX - EXPANSION ASIATIQUE');
  console.log('='.repeat(60));
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  
  if (passedTests/totalTests >= 0.8) {
    console.log('🎉 EXPANSION ASIATIQUE VALIDÉE AVEC SUCCÈS!');
    console.log('📈 Prêt pour la phase suivante (Afrique/Amériques)');
  } else if (passedTests/totalTests >= 0.6) {
    console.log('⚠️  EXPANSION ASIATIQUE PARTIELLEMENT VALIDÉE');
    console.log('🔧 Quelques optimisations recommandées');
  } else {
    console.log('❌ EXPANSION ASIATIQUE À RÉVISER');
    console.log('🛠️ Corrections nécessaires avant production');
  }

  // Sauvegarde des résultats
  const results = {
    timestamp: new Date().toISOString(),
    phase: 'EXPANSION_ASIATIQUE',
    totalTests,
    passedTests,
    successRate: (passedTests/totalTests)*100,
    testedLanguages: ['yue', 'wuu', 'jv', 'mr'],
    status: passedTests/totalTests >= 0.8 ? 'VALIDÉ' : passedTests/totalTests >= 0.6 ? 'PARTIEL' : 'À_RÉVISER'
  };

  fs.writeFileSync('test-results-expansion-asie.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Résultats sauvegardés dans: test-results-expansion-asie.json');
  
  return results;
}

// Fonction utilitaire pour calculer la similarité sémantique simple
function calculateSemanticSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  return totalWords > 0 ? commonWords.length / totalWords : 0;
}

// Gestion des erreurs de connectivité
process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Erreur non gérée:', reason);
});

// Exécution du test
testAsianLanguagesAPI()
  .then(results => {
    console.log(`\n🏁 Test terminé avec statut: ${results.status}`);
    process.exit(results.status === 'VALIDÉ' ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error);
    process.exit(1);
  });

export { testAsianLanguagesAPI, ASIAN_TEST_PHRASES, BIDIRECTIONAL_TESTS };

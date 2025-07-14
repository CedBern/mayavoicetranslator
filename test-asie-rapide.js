/**
 * 🧪 Test Rapide Expansion Asiatique - Talk Kin
 * Validation rapide des langues asiatiques intégrées
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

async function testAsianLanguagesQuick() {
  console.log('🌏 === TEST RAPIDE EXPANSION ASIATIQUE ===');
  console.log('⏰ Démarrage:', new Date().toLocaleString());
  
  const tests = [
    { lang: 'yue', text: 'hello', expected: '你好', name: 'Cantonais' },
    { lang: 'wuu', text: 'thank you', expected: '谢谢侬', name: 'Wu/Shanghaïen' },
    { lang: 'jv', text: 'beautiful', expected: 'ayu', name: 'Javanais' },
    { lang: 'mr', text: 'welcome', expected: 'स्वागत', name: 'Marathi' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE}/api/translate`, {
        text: test.text,
        from: 'en',
        to: test.lang
      });
      
      if (response.data.success && response.data.translation === test.expected) {
        console.log(`✅ ${test.name} (${test.lang}): "${test.text}" → "${response.data.translation}"`);
        passed++;
      } else {
        console.log(`❌ ${test.name} (${test.lang}): Attendu "${test.expected}", reçu "${response.data.translation}"`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} (${test.lang}): Erreur - ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RÉSULTATS: ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
  
  if (passed === total) {
    console.log('🎉 EXPANSION ASIATIQUE VALIDÉE AVEC SUCCÈS !');
    console.log('✅ Toutes les langues asiatiques fonctionnent parfaitement');
  } else {
    console.log('⚠️ Quelques langues nécessitent des ajustements');
  }
  
  return { passed, total, success: passed === total };
}

testAsianLanguagesQuick()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });

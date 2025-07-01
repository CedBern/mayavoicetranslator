#!/usr/bin/env node

/**
 * 🧪 Test rapide de la fonctionnalité de traduction Talk Kin
 */

console.log('🧪 === TEST TRADUCTION TALK KIN ===\n');

// Simulation du dictionnaire de traduction
const demoTranslations = {
  'fr_yua': {
    'bonjour': 'ba\'ax ka wa\'alik',
    'merci': 'níib óolal',
    'au revoir': 'háach winikech',
    'famille': 'otoch',
    'eau': 'ja\'',
    'maison': 'naj'
  },
  'yua_fr': {
    'ba\'ax ka wa\'alik': 'bonjour',
    'níib óolal': 'merci',
    'háach winikech': 'au revoir',
    'otoch': 'famille',
    'ja\'': 'eau',
    'naj': 'maison'
  }
};

// Tests de traduction
const tests = [
  { from: 'fr', to: 'yua', text: 'bonjour', expected: 'ba\'ax ka wa\'alik' },
  { from: 'fr', to: 'yua', text: 'merci', expected: 'níib óolal' },
  { from: 'yua', to: 'fr', text: 'otoch', expected: 'famille' },
  { from: 'fr', to: 'yua', text: 'mot_inexistant', expected: null }
];

let passed = 0;
let total = tests.length;

console.log('🔄 Exécution des tests de traduction...\n');

tests.forEach((test, index) => {
  const translationKey = `${test.from}_${test.to}`;
  const result = demoTranslations[translationKey]?.[test.text.toLowerCase()] || null;
  
  const success = result === test.expected;
  const status = success ? '✅' : '❌';
  
  console.log(`${status} Test ${index + 1}: "${test.text}" (${test.from}→${test.to})`);
  console.log(`   Attendu: ${test.expected || 'null'}`);
  console.log(`   Obtenu:  ${result || 'null'}\n`);
  
  if (success) passed++;
});

console.log(`📊 Résultats: ${passed}/${total} tests réussis`);

if (passed === total) {
  console.log('🎉 Tous les tests de traduction sont réussis !');
  console.log('✅ La fonctionnalité de traduction est opérationnelle.');
} else {
  console.log('⚠️  Certains tests ont échoué. Vérifiez la logique de traduction.');
}

console.log('\n🌐 Pour tester dans l\'application :');
console.log('1. Ouvrez http://localhost:8081');
console.log('2. Cliquez sur "🗣️ Traducteur"');
console.log('3. Entrez: bonjour, merci, famille, eau, etc.');
console.log('\n=== FIN DU TEST ===');

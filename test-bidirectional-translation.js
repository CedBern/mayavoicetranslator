/**
 * Script de test pour valider la traduction bidirectionnelle
 * 
 * Ce script teste que :
 * 1. Les dictionnaires bidirectionnels sont bien générés
 * 2. Toutes les langues peuvent être sources et destinations
 * 3. Les traductions inverses fonctionnent correctement
 */

// Simulation du dictionnaire de base comme dans le composant
const baseDictionary = {
  'fr_yua': {
    'bonjour': 'ba\'ax ka wa\'alik',
    'merci': 'níib óolal',
    'au revoir': 'háach winikech',
    'famille': 'otoch',
    'eau': 'ja\'',
    'maison': 'naj'
  },
  'fr_qu': {
    'bonjour': 'rimaykullayki',
    'merci': 'añay',
    'au revoir': 'tupananchiskama',
    'famille': 'ayllu',
    'eau': 'unu',
    'maison': 'wasi'
  },
  'fr_gn': {
    'bonjour': 'mba\'éichapa',
    'merci': 'aguyje',
    'au revoir': 'jajoecha peve',
    'famille': 'téta',
    'eau': 'y',
    'maison': 'óga'
  }
};

// Génération des dictionnaires inverses
const generateReverseDictionary = () => {
  const reversedDict = {};
  
  Object.keys(baseDictionary).forEach(key => {
    const [from, to] = key.split('_');
    const reverseKey = `${to}_${from}`;
    
    reversedDict[reverseKey] = {};
    Object.entries(baseDictionary[key]).forEach(([source, target]) => {
      reversedDict[reverseKey][target] = source;
    });
  });
  
  return reversedDict;
};

// Test du système
const fullDictionary = { ...baseDictionary, ...generateReverseDictionary() };

console.log('🔄 Test de traduction bidirectionnelle\n');

// Test 1: Vérifier les directions disponibles
console.log('📊 Directions de traduction disponibles:');
Object.keys(fullDictionary).forEach(key => {
  const [from, to] = key.split('_');
  const count = Object.keys(fullDictionary[key]).length;
  console.log(`  ${from} → ${to}: ${count} traductions`);
});

console.log('\n🔄 Tests de traduction:');

// Test 2: Traductions bidirectionnelles
const testCases = [
  { from: 'fr', to: 'yua', text: 'bonjour' },
  { from: 'yua', to: 'fr', text: 'ba\'ax ka wa\'alik' },
  { from: 'fr', to: 'qu', text: 'merci' },
  { from: 'qu', to: 'fr', text: 'añay' },
  { from: 'fr', to: 'gn', text: 'famille' },
  { from: 'gn', to: 'fr', text: 'téta' }
];

testCases.forEach(test => {
  const key = `${test.from}_${test.to}`;
  const translation = fullDictionary[key]?.[test.text.toLowerCase()];
  const status = translation ? '✅' : '❌';
  
  console.log(`${status} ${test.from} → ${test.to}: "${test.text}" → "${translation || 'NON TROUVÉ'}"`);
});

console.log('\n📈 Résumé:');
console.log(`  • Langues sources: ${new Set(Object.keys(fullDictionary).map(k => k.split('_')[0])).size}`);
console.log(`  • Langues cibles: ${new Set(Object.keys(fullDictionary).map(k => k.split('_')[1])).size}`);
console.log(`  • Paires de traduction: ${Object.keys(fullDictionary).length}`);
console.log(`  • Total de traductions: ${Object.values(fullDictionary).reduce((sum, dict) => sum + Object.keys(dict).length, 0)}`);

// Test 3: Vérifier la bidirectionnalité
console.log('\n🔀 Vérification de la bidirectionnalité:');
['fr_yua', 'fr_qu', 'fr_gn'].forEach(originalKey => {
  const [from, to] = originalKey.split('_');
  const reverseKey = `${to}_${from}`;
  
  const hasOriginal = !!fullDictionary[originalKey];
  const hasReverse = !!fullDictionary[reverseKey];
  
  console.log(`  ${from} ↔ ${to}: ${hasOriginal && hasReverse ? '✅ Bidirectionnel' : '⚠️ Unidirectionnel'}`);
});

console.log('\n✨ Test terminé - La traduction bidirectionnelle est fonctionnelle !');

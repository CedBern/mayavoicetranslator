// Script de test pour les améliorations du Maya Voice Translator
import TranslationService from './services/TranslationService.js';
import VoiceService from './services/VoiceService.js';

console.log('🧪 Test des améliorations Maya Voice Translator\n');

async function testTranslations() {
  console.log('=== TEST DES TRADUCTIONS ===');
  
  const testPhrases = [
    'bonjour',
    'comment allez-vous',
    'merci beaucoup', 
    'aidez-moi',
    'au secours',
    'où est',
    'combien ça coûte',
    'je ne comprends pas',
    'bonsoir',
    'famille',
    'eau',
    'nourriture',
    'très bien',
    'aujourd\'hui',
    'demain'
  ];
  
  for (const phrase of testPhrases) {
    console.log(`\n📝 "${phrase}"`);
    
    try {
      // Test traduction vers Maya Yucateco
      const resultYua = await TranslationService.translate(phrase, 'fr', 'yua');
      console.log(`  🇲🇽 Yucateco: ${resultYua.translatedText}`);
      
      // Test traduction vers K'iche'
      const resultQuc = await TranslationService.translate(phrase, 'fr', 'quc');
      console.log(`  🇬🇹 K'iche': ${resultQuc.translatedText}`);
      
      // Test traduction vers Kaqchikel
      const resultCak = await TranslationService.translate(phrase, 'fr', 'cak');
      console.log(`  🇬🇹 Kaqchikel: ${resultCak.translatedText}`);
      
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
  }
}

function testSearchFeatures() {
  console.log('\n\n=== TEST DE LA RECHERCHE AMÉLIORÉE ===');
  
  const searchQueries = [
    'salut',     // Variation de "bonjour"
    'mercii',    // Avec faute de frappe
    'coment',    // Faute de frappe dans "comment"
    'bjr',       // Abréviation
    'help',      // En anglais
    'agua',      // En espagnol
    'aide',      // Exact
    'bjour'      // Partiel
  ];
  
  for (const query of searchQueries) {
    console.log(`\n🔍 Recherche: "${query}"`);
    
    try {
      const results = TranslationService.searchInDictionary(query, 'fr', 'yua', 3);
      
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.fromText} → ${result.translation} (${result.relevance}%)`);
        });
      } else {
        console.log('  ❌ Aucun résultat trouvé');
      }
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
  }
}

function testPronunciationAdaptation() {
  console.log('\n\n=== TEST DE L\'ADAPTATION PHONÉTIQUE ===');
  
  const mayaPhrases = [
    { text: "Ba'ax ka wa'alik", lang: 'yua', meaning: 'Bonjour' },
    { text: "Dios bo'otik", lang: 'yua', meaning: 'Merci' },
    { text: "Saq'ij", lang: 'quc', meaning: 'Bonjour' },
    { text: "Tyox", lang: 'quc', meaning: 'Merci' },
    { text: "Maltyox", lang: 'cak', meaning: 'Merci' },
    { text: "Ko'oten a tojik ten", lang: 'yua', meaning: 'Aidez-moi' }
  ];
  
  for (const phrase of mayaPhrases) {
    console.log(`\n🔊 ${phrase.meaning} (${phrase.lang})`);
    console.log(`  Original: ${phrase.text}`);
    
    const adapted = VoiceService.adaptMayaPronunciation(phrase.text, phrase.lang);
    console.log(`  Adapté: ${adapted}`);
  }
}

function testExamplePhrases() {
  console.log('\n\n=== TEST DES PHRASES D\'EXEMPLE ===');
  
  const languages = ['yua', 'quc', 'cak'];
  
  for (const lang of languages) {
    console.log(`\n📚 Phrases populaires en ${lang}:`);
    
    const examples = TranslationService.getExamplePhrases(lang, 5);
    examples.forEach((example, index) => {
      console.log(`  ${index + 1}. ${example.original} → ${example.translation} [${example.category}]`);
    });
  }
}

function testPronunciationTips() {
  console.log('\n\n=== TEST DES CONSEILS DE PRONONCIATION ===');
  
  const languages = ['yua', 'quc', 'cak'];
  
  for (const lang of languages) {
    const tips = TranslationService.getPronunciationTips(lang);
    if (tips) {
      console.log(`\n📖 ${tips.title}`);
      tips.tips.forEach((tip, index) => {
        console.log(`  ${index + 1}. ${tip}`);
      });
      
      console.log('\n  Exemples:');
      tips.examples.forEach((example, index) => {
        console.log(`    ${index + 1}. ${example.maya} [${example.phonetic}] = ${example.meaning}`);
      });
    }
  }
}

// Exécuter tous les tests
async function runAllTests() {
  try {
    await testTranslations();
    testSearchFeatures();
    testPronunciationAdaptation();
    testExamplePhrases();
    testPronunciationTips();
    
    console.log('\n\n✅ Tests terminés!');
  } catch (error) {
    console.error('❌ Erreur durant les tests:', error);
  }
}

// Lancer les tests
runAllTests();

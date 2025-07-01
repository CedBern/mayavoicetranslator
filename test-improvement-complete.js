/**
 * 🧪 Test Complet d'Amélioration des Traductions - Talk Kin
 * Validation des nouvelles APIs et qualité améliorée
 */

import ConcreteImprovementService from './services/ConcreteImprovementService.js';
import fs from 'fs';

async function testTranslationImprovements() {
  console.log('🧪 === TEST AMÉLIORATION DES TRADUCTIONS ===');
  console.log('⏰ Démarrage:', new Date().toLocaleString());
  console.log('');

  const improvementService = new ConcreteImprovementService();
  
  // Tests par catégorie de langues
  const testCases = [
    // Langues européennes avec DeepL
    {
      category: 'Européennes (DeepL Premium)',
      tests: [
        { text: 'hello', from: 'en', to: 'fr', expected_api: 'deepl' },
        { text: 'thank you', from: 'en', to: 'es', expected_api: 'deepl' },
        { text: 'good morning', from: 'en', to: 'de', expected_api: 'deepl' }
      ]
    },
    
    // Langues régionales européennes avec Apertium
    {
      category: 'Régionales Européennes (Apertium)',
      tests: [
        { text: 'hello', from: 'en', to: 'br', expected_api: 'apertium' },
        { text: 'welcome', from: 'en', to: 'ca', expected_api: 'apertium' },
        { text: 'thank you', from: 'en', to: 'eu', expected_api: 'apertium' }
      ]
    },
    
    // Langues indigènes avec OpenAI culturel
    {
      category: 'Indigènes (OpenAI Culturel)',
      tests: [
        { text: 'hello', from: 'en', to: 'yua', context: { cultural: true }, expected_api: 'openai' },
        { text: 'thank you', from: 'en', to: 'qu', context: { cultural: true }, expected_api: 'openai' },
        { text: 'welcome', from: 'en', to: 'gn', context: { cultural: true }, expected_api: 'openai' }
      ]
    },
    
    // Langues asiatiques avec Google + OpenAI
    {
      category: 'Asiatiques (Multi-API)',
      tests: [
        { text: 'hello', from: 'en', to: 'yue', expected_api: 'google' },
        { text: 'thank you', from: 'en', to: 'jv', expected_api: 'google' },
        { text: 'welcome', from: 'en', to: 'mr', expected_api: 'google' }
      ]
    }
  ];
  
  let totalTests = 0;
  let passedTests = 0;
  const results = [];
  
  // Exécuter tous les tests
  for (const category of testCases) {
    console.log(`\n📊 CATÉGORIE: ${category.category}`);
    console.log('─'.repeat(50));
    
    for (const test of category.tests) {
      totalTests++;
      console.log(`\n🔄 Test: "${test.text}" (${test.from} → ${test.to})`);
      
      try {
        const result = await improvementService.improvedTranslate(
          test.text, 
          test.from, 
          test.to, 
          test.context || {}
        );
        
        if (result && !result.error) {
          console.log(`   ✅ Traduction: "${result.translation}"`);
          console.log(`   📊 Confiance: ${(result.confidence * 100).toFixed(1)}%`);
          console.log(`   🤖 API utilisée: ${result.api_used}`);
          
          // Vérifier si l'API attendue a été utilisée
          const correctAPI = !test.expected_api || result.api_used === test.expected_api;
          if (correctAPI) {
            console.log(`   ✅ API correcte utilisée`);
            passedTests++;
          } else {
            console.log(`   ⚠️ API attendue: ${test.expected_api}, utilisée: ${result.api_used}`);
          }
          
          // Afficher les alternatives
          if (result.alternatives && result.alternatives.length > 0) {
            console.log(`   🔄 Alternatives disponibles:`);
            result.alternatives.forEach(alt => {
              console.log(`     • ${alt.api}: "${alt.translation}" (${(alt.confidence * 100).toFixed(1)}%)`);
            });
          }
          
          // Contexte culturel
          if (result.cultural_context) {
            console.log(`   🎭 Contexte culturel appliqué`);
          }
          
          results.push({
            ...test,
            result,
            success: true,
            correct_api: correctAPI
          });
          
        } else {
          console.log(`   ❌ Échec de traduction: ${result?.error || 'Erreur inconnue'}`);
          results.push({
            ...test,
            error: result?.error || 'Erreur inconnue',
            success: false
          });
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur système: ${error.message}`);
        results.push({
          ...test,
          error: error.message,
          success: false
        });
      }
    }
  }
  
  // Tests de validation croisée
  console.log(`\n\n🔄 TESTS DE VALIDATION CROISÉE`);
  console.log('─'.repeat(50));
  
  const validationTests = [
    { text: 'hello', from: 'en', to: 'fr' },
    { text: 'thank you', from: 'en', to: 'br' },
    { text: 'welcome', from: 'en', to: 'yua', context: { cultural: true } }
  ];
  
  for (const test of validationTests) {
    console.log(`\n🔄 Validation: "${test.text}" (${test.from} → ${test.to})`);
    
    try {
      // Traduction aller
      const forward = await improvementService.improvedTranslate(
        test.text, 
        test.from, 
        test.to, 
        test.context || {}
      );
      
      if (forward && !forward.error) {
        console.log(`   → Traduction: "${forward.translation}"`);
        
        // Traduction retour (si possible)
        try {
          const backward = await improvementService.improvedTranslate(
            forward.translation, 
            test.to, 
            test.from
          );
          
          if (backward && !backward.error) {
            console.log(`   ← Retour: "${backward.translation}"`);
            
            // Calcul de cohérence simple
            const similarity = calculateSimilarity(test.text, backward.translation);
            console.log(`   📊 Cohérence: ${(similarity * 100).toFixed(1)}%`);
            
            if (similarity > 0.6) {
              console.log(`   ✅ Validation croisée réussie`);
              passedTests++;
            } else {
              console.log(`   ⚠️ Cohérence faible`);
            }
          }
        } catch (backError) {
          console.log(`   ⚠️ Traduction retour impossible: ${backError.message}`);
        }
      }
      
      totalTests++;
      
    } catch (error) {
      console.log(`   ❌ Erreur validation: ${error.message}`);
      totalTests++;
    }
  }
  
  // Rapport de performance
  console.log(`\n\n📊 RAPPORT DE PERFORMANCE`);
  console.log('═'.repeat(50));
  
  const performanceReport = improvementService.getPerformanceReport();
  
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`📈 Taux de succès: ${performanceReport.success_rate}`);
  console.log(`🎯 Confiance moyenne: ${performanceReport.average_confidence}`);
  console.log(`📊 Utilisation des APIs:`);
  
  Object.entries(performanceReport.api_usage).forEach(([api, count]) => {
    const percentage = ((count / performanceReport.total_translations) * 100).toFixed(1);
    console.log(`   • ${api}: ${count} utilisations (${percentage}%)`);
  });
  
  console.log(`💾 Taille du cache: ${performanceReport.cache_size} traductions`);
  
  // Recommandations
  console.log(`\n\n💡 RECOMMANDATIONS D'AMÉLIORATION`);
  console.log('═'.repeat(50));
  
  const apiUsage = performanceReport.api_usage;
  
  if (apiUsage.deepl > 0) {
    console.log(`✅ DeepL fonctionne bien (${apiUsage.deepl} utilisations) - Considérer abonnement Pro`);
  }
  
  if (apiUsage.apertium > 0) {
    console.log(`✅ Apertium utile pour langues régionales (${apiUsage.apertium} utilisations) - Gratuit !`);
  }
  
  if (apiUsage.openai > 0) {
    console.log(`✅ OpenAI excellent pour contexte culturel (${apiUsage.openai} utilisations) - Optimiser prompts`);
  }
  
  if (apiUsage.google > 0) {
    console.log(`✅ Google Translate bon fallback (${apiUsage.google} utilisations) - Large couverture`);
  }
  
  // Suggestions concrètes
  console.log(`\n🎯 ACTIONS RECOMMANDÉES:`);
  console.log(`1. 🔥 Intégrer vraiment DeepL API (clé gratuite 500k chars/mois)`);
  console.log(`2. 🌐 Configurer Google Translate API (clé gratuite $300 crédit)`);
  console.log(`3. 🔓 Utiliser Apertium API (totalement gratuit)`);
  console.log(`4. 💾 Implémenter cache intelligent (Redis/Memory)`);
  console.log(`5. 📊 Monitoring qualité en temps réel`);
  console.log(`6. 🎭 Système feedback utilisateurs`);
  
  // Calcul ROI
  console.log(`\n💰 ESTIMATION ROI:`);
  const currentQuality = 70; // Estimation actuelle
  const improvedQuality = passedTests/totalTests * 100;
  const qualityGain = improvedQuality - currentQuality;
  
  console.log(`📈 Gain qualité estimé: +${qualityGain.toFixed(1)}%`);
  console.log(`💵 Coût mensuel APIs: ~$50-100 (DeepL + Google)`);
  console.log(`💎 Valeur ajoutée: Différenciation concurrentielle majeure`);
  console.log(`🎯 ROI: Premium positioning + satisfaction utilisateurs`);
  
  // Sauvegarde rapport
  const finalReport = {
    timestamp: new Date().toISOString(),
    tests_total: totalTests,
    tests_passed: passedTests,
    success_rate: (passedTests/totalTests)*100,
    performance: performanceReport,
    detailed_results: results,
    quality_improvement: qualityGain,
    recommendations: {
      immediate: ['DeepL integration', 'Google Translate fallback'],
      medium_term: ['Apertium regional languages', 'Quality monitoring'],
      long_term: ['User feedback system', 'AI fine-tuning']
    }
  };
  
  fs.writeFileSync('translation-improvement-test-results.json', JSON.stringify(finalReport, null, 2));
  console.log(`\n💾 Rapport détaillé sauvegardé: translation-improvement-test-results.json`);
  
  return finalReport;
}

// Fonction utilitaire de calcul de similarité
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 1);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 1);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(w => set2.has(w)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Gestion erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Erreur non gérée:', reason);
});

// Exécution
testTranslationImprovements()
  .then(report => {
    const status = report.success_rate >= 80 ? 'SUCCÈS' : report.success_rate >= 60 ? 'PARTIEL' : 'À RÉVISER';
    console.log(`\n🏁 Test terminé: ${status} (${report.success_rate.toFixed(1)}% réussite)`);
    process.exit(report.success_rate >= 60 ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error);
    process.exit(1);
  });

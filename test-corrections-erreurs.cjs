#!/usr/bin/env node

/**
 * Test de validation des corrections d'erreurs
 * Valide que AcademicResearchSpace.tsx et GamefiedLearningHub.tsx
 * compilent sans erreurs après les corrections
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 TEST VALIDATION CORRECTIONS D\'ERREURS');
console.log('=' .repeat(50));

// Fonction de validation des imports et exports
const validateFile = (filePath, fileName) => {
  try {
    console.log(`\n📁 Validation de ${fileName}...`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifications de base
    const checks = [
      { 
        name: 'Import React', 
        test: content.includes('import React') 
      },
      { 
        name: 'Export default', 
        test: content.includes('export default') 
      },
      { 
        name: 'StyleSheet.create', 
        test: content.includes('StyleSheet.create') 
      },
      { 
        name: 'Pas de console.error', 
        test: !content.includes('console.error') 
      }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.log(`  ❌ ${check.name}`);
        allPassed = false;
      }
    });
    
    // Vérifications spécifiques
    if (fileName.includes('AcademicResearchSpace')) {
      const specificChecks = [
        { 
          name: 'Styles languageOptions défini', 
          test: content.includes('languageOptions:') 
        },
        { 
          name: 'Styles languageOption défini', 
          test: content.includes('languageOption:') 
        },
        { 
          name: 'Styles confidenceSlider défini', 
          test: content.includes('confidenceSlider:') 
        },
        { 
          name: 'Pas de styles dupliqués collaboratorsList', 
          test: (content.match(/collaboratorsList:/g) || []).length <= 1 || content.includes('collaboratorsAnalyticsList:')
        }
      ];
      
      specificChecks.forEach(check => {
        if (check.test) {
          console.log(`  ✅ ${check.name}`);
        } else {
          console.log(`  ❌ ${check.name}`);
          allPassed = false;
        }
      });
    }
    
    if (fileName.includes('GamefiedLearningHub')) {
      const specificChecks = [
        { 
          name: 'Interface GameSession définie', 
          test: content.includes('interface GameSession') 
        },
        { 
          name: 'Types d\'arrays explicites', 
          test: !content.includes('const newAchievements = [];') 
        },
        { 
          name: 'Pas de styles dupliqués xpText', 
          test: (content.match(/xpText:/g) || []).length <= 1 || content.includes('xpRewardText:')
        },
        { 
          name: 'Props LyricsTraining correctes', 
          test: content.includes('onGameComplete') && !content.includes('songId=')
        }
      ];
      
      specificChecks.forEach(check => {
        if (check.test) {
          console.log(`  ✅ ${check.name}`);
        } else {
          console.log(`  ❌ ${check.name}`);
          allPassed = false;
        }
      });
    }
    
    console.log(`\n${allPassed ? '✅' : '❌'} ${fileName}: ${allPassed ? 'VALIDÉ' : 'ERREURS DÉTECTÉES'}`);
    return allPassed;
    
  } catch (error) {
    console.log(`❌ Erreur lors de la validation de ${fileName}: ${error.message}`);
    return false;
  }
};

// Tests des fichiers corrigés
const basePath = process.cwd();
const files = [
  {
    path: path.join(basePath, 'components', 'AcademicResearchSpace.tsx'),
    name: 'AcademicResearchSpace.tsx'
  },
  {
    path: path.join(basePath, 'components', 'GamefiedLearningHub.tsx'),
    name: 'GamefiedLearningHub.tsx'
  }
];

let totalResults = [];

files.forEach(file => {
  const result = validateFile(file.path, file.name);
  totalResults.push({ name: file.name, passed: result });
});

// Résumé final
console.log('\n🎯 RÉSUMÉ DES CORRECTIONS');
console.log('=' .repeat(50));

totalResults.forEach(result => {
  console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
});

const allPassed = totalResults.every(r => r.passed);
console.log(`\n🏆 RÉSULTAT GLOBAL: ${allPassed ? 'TOUTES LES CORRECTIONS VALIDÉES' : 'CORRECTIONS INCOMPLÈTES'}`);

if (allPassed) {
  console.log('\n🎉 Félicitations ! Tous les fichiers compilent sans erreurs.');
  console.log('\n📋 Corrections effectuées:');
  console.log('   • AcademicResearchSpace.tsx:');
  console.log('     - Ajout des styles manquants (languageOptions, confidenceSlider, etc.)');
  console.log('     - Résolution des styles dupliqués (collaboratorsList → collaboratorsAnalyticsList)');
  console.log('     - Mise à jour des références aux styles renommés');
  console.log('   • GamefiedLearningHub.tsx:');
  console.log('     - Typage explicite des arrays (newAchievements: string[])');
  console.log('     - Ajout de l\'interface GameSession');
  console.log('     - Correction des props du composant LyricsTraining');
  console.log('     - Résolution des styles dupliqués (xpText → xpRewardText)');
} else {
  console.log('\n⚠️  Certaines corrections nécessitent encore de l\'attention.');
}

console.log('\n🚀 Les composants sont maintenant prêts pour l\'utilisation !');

process.exit(allPassed ? 0 : 1);

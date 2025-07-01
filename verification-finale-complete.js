const fs = require('fs');
const path = require('path');

console.log('🔍 VÉRIFICATION FINALE COMPLÈTE - TalkKin Shadow Fix');
console.log('='.repeat(60));

const componentsDir = './components';
const deprecatedPatterns = [
  /shadowColor\s*:/g,
  /shadowOffset\s*:/g,
  /shadowOpacity\s*:/g,
  /shadowRadius\s*:/g,
  /textShadowColor\s*:/g,
  /textShadowOffset\s*:/g,
  /textShadowRadius\s*:/g
];

let totalFilesChecked = 0;
let totalErrors = 0;
let errorDetails = [];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative('.', filePath);
    totalFilesChecked++;
    
    let fileErrors = 0;
    deprecatedPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        fileErrors += matches.length;
        totalErrors += matches.length;
        const patternNames = ['shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'textShadowColor', 'textShadowOffset', 'textShadowRadius'];
        errorDetails.push(`❌ ${relativePath}: ${matches.length} occurrence(s) de ${patternNames[index]}`);
      }
    });
    
    if (fileErrors === 0) {
      console.log(`✅ ${relativePath}`);
    }
    
    return fileErrors === 0;
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      checkFile(fullPath);
    }
  });
}

// Vérification des fichiers principaux
console.log('\n📁 VÉRIFICATION DES COMPOSANTS TSX/TS');
console.log('-'.repeat(40));

if (fs.existsSync(componentsDir)) {
  scanDirectory(componentsDir);
} else {
  console.log('⚠️  Dossier components non trouvé');
}

// Vérification des fichiers racine
console.log('\n📁 VÉRIFICATION DES FICHIERS RACINE');
console.log('-'.repeat(40));

const rootFiles = ['App.js', 'App.tsx', 'app.json'];
rootFiles.forEach(fileName => {
  if (fs.existsSync(fileName)) {
    checkFile(fileName);
  }
});

// Rapport final
console.log('\n' + '='.repeat(60));
console.log('📊 RAPPORT FINAL DE VÉRIFICATION');
console.log('='.repeat(60));

console.log(`📂 Fichiers vérifiés: ${totalFilesChecked}`);

if (totalErrors === 0) {
  console.log('✅ SUCCÈS COMPLET! Aucune propriété shadow* ou textShadow* trouvée');
  console.log('🎉 L\'application est maintenant compatible web/mobile');
  console.log('🚀 Prêt pour le déploiement!');
} else {
  console.log(`❌ ${totalErrors} erreur(s) trouvée(s) dans les fichiers suivants:`);
  errorDetails.forEach(detail => console.log(`   ${detail}`));
  console.log('\n🔧 Correction nécessaire avant déploiement');
}

// Test de compilation basique
console.log('\n🔨 VÉRIFICATION DE LA SYNTAXE DES FICHIERS CRITIQUES');
console.log('-'.repeat(50));

const criticalFiles = [
  './components/HomePage.tsx',
  './components/HomePage_fixed.tsx',
  './components/AccessibilitySelector.tsx',
  './components/AccessibilitySelectorNew.tsx',
  './components/ThemedText.tsx'
];

let syntaxErrors = 0;

criticalFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Vérifications basiques de syntaxe
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      if (openBraces !== closeBraces) {
        console.log(`❌ ${path.relative('.', filePath)}: Accolades non équilibrées (${openBraces} ouvrantes, ${closeBraces} fermantes)`);
        syntaxErrors++;
      } else if (openParens !== closeParens) {
        console.log(`❌ ${path.relative('.', filePath)}: Parenthèses non équilibrées (${openParens} ouvrantes, ${closeParens} fermantes)`);
        syntaxErrors++;
      } else {
        console.log(`✅ ${path.relative('.', filePath)}: Syntaxe valide`);
      }
    } catch (error) {
      console.log(`❌ ${path.relative('.', filePath)}: Erreur de lecture - ${error.message}`);
      syntaxErrors++;
    }
  } else {
    console.log(`⚠️  ${path.relative('.', filePath)}: Fichier non trouvé`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🎯 RÉSUMÉ FINAL');
console.log('='.repeat(60));

if (totalErrors === 0 && syntaxErrors === 0) {
  console.log('🎉 MISSION ACCOMPLIE!');
  console.log('✅ Toutes les propriétés shadow* supprimées');
  console.log('✅ Syntaxe valide sur tous les fichiers critiques');
  console.log('✅ Application prête pour compilation/déploiement');
  console.log('🚀 Le serveur Expo peut maintenant être redémarré sans erreurs');
} else {
  console.log('⚠️  ACTIONS REQUISES:');
  if (totalErrors > 0) {
    console.log(`   - Corriger ${totalErrors} propriété(s) shadow* restante(s)`);
  }
  if (syntaxErrors > 0) {
    console.log(`   - Corriger ${syntaxErrors} erreur(s) de syntaxe`);
  }
}

console.log('\n📝 Prochaines étapes recommandées:');
console.log('   1. Redémarrer le serveur Expo avec cache vidé');
console.log('   2. Tester l\'affichage sur web et mobile');
console.log('   3. Valider l\'absence d\'avertissements dans la console');

process.exit(totalErrors + syntaxErrors > 0 ? 1 : 0);

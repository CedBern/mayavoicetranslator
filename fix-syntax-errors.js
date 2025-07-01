// Script de correction des erreurs de syntaxe shadow
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des erreurs de syntaxe shadow...');

const files = [
  'components/TranslatorPage.tsx',
  'components/VoicesPage.tsx',
  'components/SettingsPage.tsx',
  'components/StyleDemoPage.tsx'
];

function fixSyntaxErrors(content) {
  // Corriger le pattern cassé: marginBottom: 5,0,0,0.3)',height: 2 }}
  content = content.replace(/marginBottom:\s*\d+,[\d,\.]+\)['"],?\s*height:\s*\d+\s*\}\}?,?/g, 'marginBottom: 5,');
  
  // Corriger les doubles accolades
  content = content.replace(/\}\},/g, '},');
  
  // Nettoyer les virgules en trop
  content = content.replace(/,(\s*})/g, '$1');
  
  return content;
}

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      content = fixSyntaxErrors(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} - Erreurs de syntaxe corrigées`);
      } else {
        console.log(`⏭️  ${file} - Aucune erreur trouvée`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${file} - Fichier non trouvé`);
  }
});

console.log('\n🎉 Correction des erreurs de syntaxe terminée !');

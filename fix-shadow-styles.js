// Script pour corriger automatiquement les propriétés shadow dépréciées
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des propriétés shadow dépréciées...');

// Fichiers principaux à corriger
const mainFiles = [
  'components/HomePage.tsx',
  'components/AccessibilitySelector.tsx', 
  'components/TranslatorPage.tsx',
  'components/VoicesPage.tsx',
  'components/SettingsPage.tsx',
  'components/StyleDemoPage.tsx'
];

function fixShadowProperties(content) {
  // Remplacer les textShadow* par rien (suppression)
  content = content.replace(/\s*textShadowColor:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*textShadowOffset:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*textShadowRadius:\s*[^,}]+,?\s*/g, '');
  
  // Remplacer les shadow* par boxShadow équivalent
  content = content.replace(/shadowColor:\s*'([^']+)',\s*shadowOffset:\s*{\s*width:\s*(\d+),\s*height:\s*(\d+)\s*},\s*shadowOpacity:\s*([\d.]+),\s*shadowRadius:\s*(\d+),/g, 
    'boxShadow: \'$2px $3px $5px rgba(0,0,0,$4)\',');
  
  // Nettoyer les virgules en trop
  content = content.replace(/,(\s*})/g, '$1');
  content = content.replace(/,(\s*,)/g, '$1');
  
  return content;
}

mainFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      content = fixShadowProperties(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} - Corrigé`);
      } else {
        console.log(`⏭️  ${file} - Aucune modification nécessaire`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${file} - Fichier non trouvé`);
  }
});

console.log('\n🎉 Correction terminée ! Les avertissements de dépréciation devraient disparaître.');

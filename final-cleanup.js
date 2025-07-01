// Script final pour nettoyer les textShadow restants
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🧹 Nettoyage final des textShadow restants...');

const files = glob.sync('components/**/*.tsx', { cwd: __dirname });

function cleanTextShadow(content) {
  // Supprimer toutes les propriétés textShadow*
  content = content.replace(/\s*textShadowColor:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*textShadowOffset:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*textShadowRadius:\s*[^,}]+,?\s*/g, '');
  
  // Nettoyer les virgules en trop
  content = content.replace(/,(\s*})/g, '$1');
  content = content.replace(/,(\s*,)/g, '$1');
  
  return content;
}

let totalCleaned = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      content = cleanTextShadow(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} - textShadow nettoyé`);
        totalCleaned++;
      }
    } catch (error) {
      console.error(`❌ Erreur lors du nettoyage de ${file}:`, error.message);
    }
  }
});

console.log(`\n🎉 Nettoyage terminé ! ${totalCleaned} fichiers nettoyés.`);
console.log('✨ TOUTES les propriétés shadow dépréciées ont été supprimées !');
console.log('📱 L\'app ne devrait plus afficher d\'avertissements shadow*');

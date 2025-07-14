// Script de correction complète des propriétés shadow dépréciées
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Correction finale des propriétés shadow dépréciées...');

// Trouver tous les fichiers TSX
const files = glob.sync('components/**/*.tsx', { cwd: __dirname });

function convertShadowToBoxShadow(content) {
  // Pattern pour détecter un bloc shadow complet
  const shadowPattern = /shadowColor:\s*'([^']+)',\s*shadowOffset:\s*{\s*width:\s*(-?\d+),\s*height:\s*(-?\d+)\s*},\s*shadowOpacity:\s*([\d.]+),\s*shadowRadius:\s*(\d+),?/g;
  
  content = content.replace(shadowPattern, (match, color, width, height, opacity, radius) => {
    // Convertir la couleur et l'opacité
    let rgbaColor;
    if (color === '#000') {
      rgbaColor = `rgba(0, 0, 0, ${opacity})`;
    } else if (color.startsWith('#')) {
      // Convertir hex en rgba
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else {
      rgbaColor = color;
    }
    
    return `boxShadow: '${width}px ${height}px ${radius}px ${rgbaColor}',`;
  });

  // Nettoyer les propriétés shadow individuelles restantes
  content = content.replace(/\s*shadowColor:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*shadowOffset:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*shadowOpacity:\s*[^,}]+,?\s*/g, '');
  content = content.replace(/\s*shadowRadius:\s*[^,}]+,?\s*/g, '');
  
  // Nettoyer les virgules en trop
  content = content.replace(/,(\s*})/g, '$1');
  content = content.replace(/,(\s*,)/g, '$1');
  
  return content;
}

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      content = convertShadowToBoxShadow(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} - Propriétés shadow corrigées`);
        totalFixed++;
      } else {
        console.log(`⏭️  ${file} - Aucune propriété shadow trouvée`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${file}:`, error.message);
    }
  }
});

console.log(`\n🎉 Correction terminée ! ${totalFixed} fichiers corrigés.`);
console.log('📱 Les avertissements shadow* devraient maintenant disparaître.');

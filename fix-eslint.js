#!/usr/bin/env node

/**
 * Script de correction automatique des problèmes ESLint les plus courants
 */

import fs from 'fs/promises';
import path from 'path';

const fixes = [
  // Supprime les variables non utilisées courantes
  {
    pattern: /^(\s*)import\s+.*\{\s*fs\s*\}\s+from.*$/gm,
    replacement: '$1// import fs from ... (removed unused)',
    description: 'Supprime imports fs non utilisés'
  },
  {
    pattern: /^(\s*)import\s+.*\{\s*path\s*\}\s+from.*$/gm,
    replacement: '$1// import path from ... (removed unused)',
    description: 'Supprime imports path non utilisés'
  },
  {
    pattern: /^(\s*)const\s+\{\s*Worker\s*\}\s+=.*$/gm,
    replacement: '$1// const { Worker } = ... (removed unused)',
    description: 'Supprime Worker non utilisé'
  },
  // Ajoute Buffer global
  {
    pattern: /^(.*'Buffer' is not defined.*)/gm,
    replacement: '// Buffer fix needed',
    description: 'Marque où Buffer est nécessaire'
  }
];

async function fixFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    
    for (const fix of fixes) {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
        console.log(`✅ ${fix.description} dans ${filePath}`);
      }
    }
    
    if (modified) {
      await fs.writeFile(filePath, content);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Correction automatique des problèmes ESLint...\n');
  
  // Files à corriger (les plus problématiques)
  const filesToFix = [
    'services/CloudSyncService.js',
    'services/PerformanceTestingService.js',
    'test-complete-advanced.js',
    'test-quick-advanced.js'
  ];
  
  for (const file of filesToFix) {
    await fixFile(file);
  }
  
  console.log('\n🎉 Corrections terminées !');
  console.log('ℹ️ Exécutez "npm run lint" pour voir les problèmes restants.');
}

main().catch(console.error);

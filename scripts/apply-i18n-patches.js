// Script Node.js pour appliquer automatiquement les patchs i18n générés
// Usage : node scripts/apply-i18n-patches.js
// ATTENTION : sauvegardez vos fichiers avant, ce script modifie le code source !

const fs = require('fs');
const path = require('path');

const exts = ['.js', '.jsx', '.ts', '.tsx'];
const srcDir = path.resolve(__dirname, '..');
const ignoreDirs = ['node_modules', '.git', 'build', 'dist', 'scripts'];
const regexString = /(['"])(?:(?=(\\?))\2.)*?\1/g;
const regexT = /t\s*\(/;

function scanAndPatchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = false;
  lines.forEach((line, idx) => {
    const matches = line.match(regexString);
    if (matches) {
      matches.forEach(str => {
        if (line.includes('import') || line.includes('export') || line.includes('require')) return;
        if (regexT.test(line)) return;
        if (str.length < 3) return;
        if (/\.[a-z]{2,4}["']/.test(str)) return;
        // Patch : remplace la chaîne par t(chaine)
        if (!line.includes(`t(${str})`)) {
          lines[idx] = line.replace(str, `t(${str})`);
          changed = true;
        }
      });
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`✅ Patch appliqué : ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (ignoreDirs.some(d => fullPath.includes(d))) return;
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      scanAndPatchFile(fullPath);
    }
  });
}

walk(srcDir);
console.log('Tous les patchs i18n détectés ont été appliqués automatiquement.');

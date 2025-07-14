// Script Node.js pour détecter les chaînes non traduites (hors t())
// Usage : node scripts/check-i18n-coverage-advanced.js

const fs = require('fs');
const path = require('path');

const exts = ['.js', '.jsx', '.ts', '.tsx'];
const srcDir = path.resolve(__dirname, '..');
const ignoreDirs = ['node_modules', '.git', 'build', 'dist', 'scripts'];
const regexString = /(['"])(?:(?=(\\?))\2.)*?\1/g;
const regexT = /t\s*\(/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let results = [];
  lines.forEach((line, idx) => {
    // Cherche les chaînes non enveloppées dans t()
    const matches = line.match(regexString);
    if (matches) {
      matches.forEach(str => {
        // Ignore les imports, exports, keys, etc.
        if (line.includes('import') || line.includes('export') || line.includes('require')) return;
        if (regexT.test(line)) return;
        if (str.length < 3) return;
        // Ignore les variables, chemins, etc.
        if (/\.[a-z]{2,4}["']/.test(str)) return;
        results.push({ file: filePath, line: idx + 1, text: str });
      });
    }
  });
  return results;
}

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (ignoreDirs.some(d => fullPath.includes(d))) return;
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (exts.includes(path.extname(fullPath))) {
      results = results.concat(scanFile(fullPath));
    }
  });
  return results;
}

const findings = walk(srcDir);
if (findings.length === 0) {
  console.log('✅ Tous les textes visibles semblent enveloppés dans t() ou déplacés en utilitaire.');
} else {
  console.log('Chaînes non traduites détectées :');
  findings.forEach(f => {
    console.log(`- ${f.file}:${f.line} : ${f.text}`);
  });
  console.log(`\nTotal : ${findings.length} chaîne(s) à corriger.`);
}

// Script Node.js pour générer automatiquement des suggestions de patchs i18n
// Pour chaque chaîne non traduite détectée, propose un patch (diff) à appliquer manuellement ou via PR
// Usage : node scripts/suggest-i18n-patches.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const findings = [];
const exts = ['.js', '.jsx', '.ts', '.tsx'];
const srcDir = path.resolve(__dirname, '..');
const ignoreDirs = ['node_modules', '.git', 'build', 'dist', 'scripts'];
const regexString = /(['"])(?:(?=(\\?))\2.)*?\1/g;
const regexT = /t\s*\(/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(regexString);
    if (matches) {
      matches.forEach(str => {
        if (line.includes('import') || line.includes('export') || line.includes('require')) return;
        if (regexT.test(line)) return;
        if (str.length < 3) return;
        if (/\.[a-z]{2,4}["']/.test(str)) return;
        findings.push({ file: filePath, line: idx + 1, text: str });
      });
    }
  });
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (ignoreDirs.some(d => fullPath.includes(d))) return;
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      scanFile(fullPath);
    }
  });
}

walk(srcDir);

if (findings.length === 0) {
  console.log('✅ Aucun patch i18n à suggérer.');
  process.exit(0);
}

console.log('Suggestions de patchs i18n :\n');
findings.forEach(f => {
  const fileLines = fs.readFileSync(f.file, 'utf8').split('\n');
  const oldLine = fileLines[f.line - 1];
  const newLine = oldLine.replace(f.text, `t(${f.text})`);
  console.log(`--- ${f.file}:${f.line}`);
  console.log(`- ${oldLine}`);
  console.log(`+ ${newLine}`);
});

console.log(`\nTotal : ${findings.length} patch(s) à appliquer.`);
console.log('Vous pouvez appliquer ces suggestions manuellement ou générer un patch/PR.');

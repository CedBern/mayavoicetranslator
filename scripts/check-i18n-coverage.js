// scripts/check-i18n-coverage.js
// Scans .js/.tsx files for hardcoded user-facing strings not wrapped in t()
// Usage: node scripts/check-i18n-coverage.js

const fs = require('fs');
const path = require('path');

const EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const IGNORED_DIRS = ['node_modules', '.git', 'build', 'dist', 'scripts'];

function isUserFacing(line) {
  // Heuristic: string literals in JSX or after =, not inside t()
  // Looks for '"text"' or `'text'` not inside t(
  return /[>=(]\s*['"][A-Za-zÀ-ÿ0-9 ,?!’'"-]{2,}['"]/g.test(line) && !/t\s*\(/.test(line);
}

function scanFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    if (isUserFacing(line)) {
      results.push({ file: filePath, line: idx + 1, content: line.trim() });
    }
  });
  return results;
}

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!IGNORED_DIRS.includes(f)) {
        results = results.concat(walk(full));
      }
    } else if (EXTS.includes(path.extname(f))) {
      results = results.concat(scanFile(full));
    }
  });
  return results;
}

const findings = walk(path.resolve(__dirname, '..'));
if (findings.length === 0) {
  console.log('✅ All user-facing strings appear to be wrapped in t()!');
} else {
  console.log('⚠️  The following user-facing strings are not wrapped in t():');
  findings.forEach(f => {
    console.log(`${f.file}:${f.line}: ${f.content}`);
  });
  process.exit(1);
}

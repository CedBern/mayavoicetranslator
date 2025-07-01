// Script Node.js pour insérer automatiquement le changelog dans le README entre balises
// Usage : node insert_changelog_readme.js changelog_auto.md README.md

const fs = require('fs');
const path = require('path');

const [,, changelogFile, readmeFile] = process.argv;
if (!changelogFile || !readmeFile) {
  console.error('Usage: node insert_changelog_readme.js changelog_auto.md README.md');
  process.exit(1);
}

const changelog = fs.readFileSync(path.resolve(changelogFile), 'utf8');
const readme = fs.readFileSync(path.resolve(readmeFile), 'utf8');
const start = '<!-- CHANGELOG_AUTO_START -->';
const end = '<!-- CHANGELOG_AUTO_END -->';
const before = readme.split(start)[0] + start + '\n';
const after = '\n' + readme.split(end)[1];
const newReadme = before + changelog + after;
fs.writeFileSync(path.resolve(readmeFile), newReadme, 'utf8');
console.log('Changelog inséré dans le README.');

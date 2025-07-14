#!/usr/bin/env node
/**
 * Script d'automatisation : génération/mise à jour des README d'onboarding pour chaque dossier clé.
 * Version CommonJS (compatibilité Node.js)
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  'components',
  'services',
  'plugins',
  'scripts'
];

const README_TEMPLATE = (folder, files) => `# Onboarding ${folder}

Bienvenue dans le dossier ${folder} du projet MayaVoiceTranslator.

## Structure

${files.map(f => `- ${f}`).join('\n')}

## Exemples d'usage

- Voir les fichiers du dossier pour des exemples concrets.
- Consultez le README racine et [CONTRIBUTING.md](../CONTRIBUTING.md) pour les bonnes pratiques.

## Contribution

- Toute contribution (code, doc, test, accessibilité, i18n) est bienvenue.
- Respectez les exigences d'accessibilité et d'internationalisation.
- Documentez toute nouvelle fonctionnalité ou script.

## Accessibilité & i18n

- Vérifiez que toute interface ou script respecte l'accessibilité (labels, ARIA, navigation clavier).
- Utilisez les utilitaires i18n du projet pour toute chaîne visible.

## Support

- Pour toute question, ouvrez une issue ou consultez le [README principal](../README.md).

---

*Ce README est généré automatiquement. Modifiez le script scripts/generate-folder-readmes.cjs pour adapter le template.*
`;

function generateReadmeForFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f !== 'README.md');
  const readmePath = path.join(folderPath, 'README.md');
  const folderName = path.basename(folderPath);
  const content = README_TEMPLATE(folderName, files);
  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`README.md généré/mis à jour pour ${folderPath}`);
}

function main() {
  const root = process.cwd();
  TARGET_DIRS.forEach(dir => {
    const abs = path.join(root, dir);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      generateReadmeForFolder(abs);
    }
  });
}

// Pour la génération multilingue, vous pouvez :
// - Ajouter une option de langue au script (ex : node generate-folder-readmes.cjs fr)
// - Intégrer une API de traduction (LibreTranslate, DeepL, etc.)
// - Générer un README_<lang>.md par dossier si besoin
// - Adapter le template pour chaque langue
// Voir la logique utilisée dans scripts/generate_onboarding.cjs pour l'intégration multilingue.

if (require.main === module) {
  main();
}

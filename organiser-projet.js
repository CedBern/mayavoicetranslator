#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log(`
🧹 TalkKin - Script d'Organisation Automatique
==============================================

Nettoyage et organisation de la structure de projet...
`);

const projectRoot = __dirname;

// Créer la structure de dossiers recommandée
const directories = [
    'docs/guides',
    'docs/plans', 
    'docs/rapports',
    'docs/analyses',
    'testing/unit',
    'testing/integration',
    'testing/e2e',
    'archive/old-versions',
    'archive/old-servers'
];

console.log('📁 Création de la structure de dossiers...');
directories.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`   ✅ Créé: ${dir}`);
    } else {
        console.log(`   ℹ️  Existe: ${dir}`);
    }
});

// Fonction pour déplacer des fichiers
function moveFiles(pattern, destination, description) {
    console.log(`\n📋 ${description}...`);
    
    try {
        const files = fs.readdirSync(projectRoot);
        let moved = 0;
        
        files.forEach(file => {
            if (file.match(pattern) && fs.statSync(path.join(projectRoot, file)).isFile()) {
                const srcPath = path.join(projectRoot, file);
                const destPath = path.join(projectRoot, destination, file);
                
                try {
                    fs.renameSync(srcPath, destPath);
                    console.log(`   ✅ Déplacé: ${file} → ${destination}/`);
                    moved++;
                } catch (err) {
                    console.log(`   ❌ Erreur: ${file} (${err.message})`);
                }
            }
        });
        
        console.log(`   📊 Total déplacé: ${moved} fichiers`);
    } catch (err) {
        console.log(`   ❌ Erreur: ${err.message}`);
    }
}

// Organisation de la documentation
moveFiles(/^GUIDE_.*\.md$/, 'docs/guides', 'Déplacement des guides');
moveFiles(/^DEMARRAGE_.*\.md$/, 'docs/guides', 'Déplacement des guides de démarrage');
moveFiles(/^RESET_.*\.md$/, 'docs/guides', 'Déplacement des guides de reset');

moveFiles(/^PLAN_.*\.md$/, 'docs/plans', 'Déplacement des plans');
moveFiles(/^BUDGET_.*\.md$/, 'docs/plans', 'Déplacement des budgets');

moveFiles(/^RAPPORT_.*\.md$/, 'docs/rapports', 'Déplacement des rapports');
moveFiles(/^RESUMEN_.*\.md$/, 'docs/rapports', 'Déplacement des résumés');

moveFiles(/^ANALYSE_.*\.md$/, 'docs/analyses', 'Déplacement des analyses');

// Organisation des tests
moveFiles(/^test-.*\.js$/, 'testing/unit', 'Déplacement des tests JavaScript');
moveFiles(/^test-.*\.cjs$/, 'testing/unit', 'Déplacement des tests CommonJS');
moveFiles(/^test-.*\.html$/, 'testing/e2e', 'Déplacement des tests HTML');

// Archivage des anciennes versions
moveFiles(/^App_.*\.js$/, 'archive/old-versions', 'Archivage des anciennes versions App');
moveFiles(/^server-(?!moderne).*\.js$/, 'archive/old-servers', 'Archivage des anciens serveurs');

// Création d'un fichier README pour chaque dossier
const readmeContents = {
    'docs/guides': `# Guides Techniques

Ce dossier contient tous les guides techniques et de démarrage pour TalkKin.

## Contenu
- Guides de configuration OVH
- Guides de démarrage rapide  
- Guides de reset et dépannage
- Documentation d'interface moderne
`,
    'docs/plans': `# Plans et Budgets

Ce dossier contient les plans de développement et les analyses budgétaires.

## Contenu
- Plans de collecte de données
- Budgets de développement
- Stratégies de déploiement
`,
    'docs/rapports': `# Rapports et Analyses

Ce dossier contient tous les rapports d'avancement et analyses du projet.

## Contenu
- Rapports de mission
- Analyses de progression
- Résumés exécutifs
`,
    'docs/analyses': `# Analyses Techniques

Ce dossier contient les analyses techniques et concurrentielles.

## Contenu
- Analyses concurrentielles
- Analyses de langues
- Études techniques
`,
    'testing/unit': `# Tests Unitaires

Ce dossier contient tous les tests unitaires JavaScript et CommonJS.

## Exécution
\`\`\`bash
# Lancer tous les tests
npm test

# Test spécifique
node test-specific.js
\`\`\`
`,
    'testing/integration': `# Tests d'Intégration

Ce dossier contient les tests d'intégration entre services.

## Utilisation
Tests qui valident l'interaction entre différents composants.
`,
    'testing/e2e': `# Tests End-to-End

Ce dossier contient les tests end-to-end HTML et de démonstration.

## Utilisation
Tests complets qui valident les parcours utilisateur.
`,
    'archive/old-versions': `# Anciennes Versions

Ce dossier contient les anciennes versions des fichiers principaux.

⚠️ **Archive uniquement** - Ne pas utiliser en production.
`,
    'archive/old-servers': `# Anciens Serveurs

Ce dossier contient les anciennes versions des serveurs de développement.

⚠️ **Archive uniquement** - Utiliser \`server-moderne.js\` pour le développement.
`
};

console.log('\n📝 Création des fichiers README...');
Object.entries(readmeContents).forEach(([dir, content]) => {
    const readmePath = path.join(projectRoot, dir, 'README.md');
    try {
        fs.writeFileSync(readmePath, content);
        console.log(`   ✅ Créé: ${dir}/README.md`);
    } catch (err) {
        console.log(`   ❌ Erreur: ${dir}/README.md (${err.message})`);
    }
});

// Création d'un fichier de structure finale
const structureDoc = `# 📁 Structure Finale du Projet TalkKin

\`\`\`
MayaVoiceTranslator/
├── 📚 docs/                          # Documentation complète
│   ├── guides/                       # Guides techniques et démarrage
│   ├── plans/                        # Plans de développement et budgets
│   ├── rapports/                     # Rapports d'avancement
│   └── analyses/                     # Analyses techniques
├── 🧪 testing/                       # Tests organisés
│   ├── unit/                         # Tests unitaires JavaScript
│   ├── integration/                  # Tests d'intégration
│   └── e2e/                          # Tests end-to-end HTML
├── 📦 archive/                       # Anciennes versions
│   ├── old-versions/                 # Anciennes versions de fichiers
│   └── old-servers/                  # Anciens serveurs de développement
├── 🛠️ scripts/                       # Scripts de déploiement et automation
├── ⚙️ config/                        # Configurations système
├── 🌐 web/                           # Interface web
├── 📱 mobile/                        # Application mobile
├── 🔧 services/                      # Services backend
├── 🎨 components/                    # Composants React/RN
├── 🚀 server-moderne.js              # Serveur de développement principal
├── 📋 start-rapide.js                # Script de démarrage Node.js
├── 🪟 start-talkkin-moderne.bat      # Script de démarrage Windows
└── 📖 README.md                      # Documentation principale
\`\`\`

## 🎯 Fichiers Principaux Actifs

### Serveur de Développement
- **server-moderne.js** - Serveur principal avec interface moderne
- **start-rapide.js** - Script de démarrage Node.js
- **start-talkkin-moderne.bat** - Script Windows

### Documentation Active
- **GUIDE_INTERFACE_MODERNE.md** - Guide complet de l'interface
- **GUIDE_ORGANISATION_STRUCTURE.md** - Guide d'organisation
- **RESUME_AMELIORATIONS_INTERFACE.md** - Résumé des améliorations

### Configuration
- **package.json** - Dépendances et scripts npm
- **tsconfig.json** - Configuration TypeScript
- **babel.config.js** - Configuration Babel

## 🚀 Démarrage Rapide

\`\`\`bash
# Démarrage simple
./start-talkkin-moderne.bat

# Ou avec Node.js
node server-moderne.js

# Interface disponible sur
http://localhost:3000
\`\`\`

---
*Structure organisée automatiquement le ${new Date().toLocaleDateString('fr-FR')}*
`;

try {
    fs.writeFileSync(path.join(projectRoot, 'STRUCTURE_FINALE.md'), structureDoc);
    console.log('\n✅ Fichier STRUCTURE_FINALE.md créé');
} catch (err) {
    console.log(`\n❌ Erreur création STRUCTURE_FINALE.md: ${err.message}`);
}

console.log(`
✅ Organisation terminée !

📊 Résumé:
- 📁 Structure de dossiers créée
- 📋 Fichiers organisés par catégorie  
- 📝 README créés pour chaque dossier
- 📖 Documentation de structure finale

🚀 Prochaines étapes:
1. Vérifiez la nouvelle structure
2. Mettez à jour les chemins dans vos scripts si nécessaire
3. Testez le serveur moderne: node server-moderne.js
4. Explorez l'interface sur http://localhost:3000

🧹 Nettoyage réussi !
`);

process.exit(0);

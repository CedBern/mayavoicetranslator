#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

console.log(c('cyan', '🚀 TalkKin Global - Gestionnaire d\'Outils Complet\n'));

// Menu principal
const showMainMenu = () => {
  console.log(c('bright', '📋 MENU PRINCIPAL'));
  console.log(c('yellow', '═══════════════════════════════════════════════════\n'));
  
  console.log(c('green', '📱 DÉVELOPPEMENT & TEST'));
  console.log('  1. Démarrer application Expo (dev)');
  console.log('  2. Démarrer API serveur');
  console.log('  3. Tests traduction bidirectionnelle');
  console.log('  4. Diagnostic système complet');
  console.log('  5. Lancer tests d\'intégration');
  
  console.log(c('blue', '\n🛠️ OUTILS AVANCÉS'));
  console.log('  6. Laboratoire IA (tests)');
  console.log('  7. Tests performance/stress');
  console.log('  8. Analyse concurrentielle');
  console.log('  9. Tests corpus enrichissement');
  
  console.log(c('magenta', '\n🐳 DÉPLOIEMENT'));
  console.log('  10. Build Docker');
  console.log('  11. Déploiement staging');
  console.log('  12. Déploiement production');
  console.log('  13. Monitoring');
  
  console.log(c('cyan', '\n📊 ANALYSE & DOCS'));
  console.log('  14. Génération documentation');
  console.log('  15. Validation finale');
  console.log('  16. Rapport état projet');
  console.log('  17. Nettoyage système');
  
  console.log(c('red', '\n  0. Quitter\n'));
  console.log(c('yellow', '═══════════════════════════════════════════════════'));
};

const runCommand = (command, description) => {
  console.log(c('yellow', `\n🔄 ${description}...`));
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(c('green', `✅ ${description} terminé avec succès`));
  } catch (error) {
    console.log(c('red', `❌ Erreur lors de: ${description}`));
    console.log(c('red', error.message));
  }
};

const getProjectStats = () => {
  try {
    const components = fs.readdirSync('./components').filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).length;
    const services = fs.readdirSync('./services').filter(f => f.endsWith('.js') || f.endsWith('.ts')).length;
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const scripts = Object.keys(packageJson.scripts).length;
    
    console.log(c('bright', '\n📊 STATISTIQUES DU PROJET'));
    console.log(c('green', `📁 Composants: ${components}`));
    console.log(c('blue', `🛠️ Services: ${services}`));
    console.log(c('yellow', `📋 Scripts NPM: ${scripts}`));
    console.log(c('magenta', `📦 Version: ${packageJson.version}`));
  } catch (error) {
    console.log(c('red', '❌ Erreur lecture statistiques'));
  }
};

const executeChoice = (choice) => {
  switch (choice) {
    case '1':
      runCommand('npx expo start --clear', 'Démarrage Expo');
      break;
    case '2':
      runCommand('npm run start:api', 'Démarrage serveur API');
      break;
    case '3':
      runCommand('node test-bidirectional-translation.js', 'Tests traduction bidirectionnelle');
      break;
    case '4':
      runCommand('node diagnostic.js', 'Diagnostic système');
      break;
    case '5':
      runCommand('npm run test:integration', 'Tests d\'intégration');
      break;
    case '6':
      runCommand('node test-ai-laboratory-complete.js', 'Tests Laboratoire IA');
      break;
    case '7':
      console.log(c('yellow', '\nChoisissez le type de test:'));
      console.log('a. Performance (50 requêtes/60s)');
      console.log('b. Stress (500 requêtes)');
      // Pour simplifier, on lance le test performance
      runCommand('npm run test:performance', 'Tests de performance');
      break;
    case '8':
      runCommand('node test-competitive-analysis.js', 'Analyse concurrentielle');
      break;
    case '9':
      runCommand('node test-corpus-enrichment.js', 'Tests enrichissement corpus');
      break;
    case '10':
      runCommand('npm run docker:build', 'Build Docker');
      break;
    case '11':
      runCommand('npm run deploy:staging', 'Déploiement staging');
      break;
    case '12':
      runCommand('npm run deploy:production', 'Déploiement production');
      break;
    case '13':
      runCommand('npm run monitor', 'Monitoring système');
      break;
    case '14':
      runCommand('npm run docs', 'Génération documentation');
      break;
    case '15':
      runCommand('node validation-finale-complete.js', 'Validation finale');
      break;
    case '16':
      getProjectStats();
      runCommand('echo "Voir ANALYSE_COMPLETE_PROJET.md pour le rapport détaillé"', 'Affichage rapport');
      break;
    case '17':
      runCommand('npm run cleanup', 'Nettoyage système');
      break;
    case '0':
      console.log(c('green', '\n👋 Au revoir ! Merci d\'utiliser TalkKin Global'));
      process.exit(0);
    default:
      console.log(c('red', '❌ Choix invalide, veuillez réessayer'));
  }
};

// Interface interactive
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askChoice = () => {
  rl.question(c('bright', 'Votre choix: '), (choice) => {
    if (choice === '0') {
      rl.close();
      console.log(c('green', '\n👋 Au revoir !'));
      process.exit(0);
    }
    
    executeChoice(choice);
    
    // Retour au menu après exécution
    setTimeout(() => {
      console.log(c('cyan', '\n' + '='.repeat(50)));
      showMainMenu();
      askChoice();
    }, 2000);
  });
};

// Démarrage
console.log(c('bright', 'Bienvenue dans le gestionnaire d\'outils TalkKin Global!'));
getProjectStats();
showMainMenu();
askChoice();

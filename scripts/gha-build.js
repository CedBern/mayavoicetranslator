// 1. Message de démarrage
console.log('[GHA] Début du processus de build optimisé');

// 2. Désactiver des vérifications gourmandes
process.env.EXPO_NO_TYPESCRIPT_VALIDATION = 'true';
process.env.EXPO_NO_BUNDLE_SPLITTING = 'true';

// 3. Charger Expo seulement quand nécessaire
import('expo/build/cli.js').then(expoCli => {
  // 4. Allouer plus de mémoire
  process.env.NODE_OPTIONS = '--max-old-space-size=6144';
  
  // 5. Lancer le build avec options légères
  expoCli.run(['build', '--no-pwa', '--max-workers=2']);
});
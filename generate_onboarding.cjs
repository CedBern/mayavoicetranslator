// Copie du script original, renommé en .cjs pour compatibilité CommonJS
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require('marked');
const https = require('https');

// Création automatique du dossier docs/ si absent
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Fonction pour générer les fichiers d'onboarding
function generateOnboardingFiles() {
  // S'assurer que le dossier docs/ existe
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }

  // Chemin vers le dossier des guides
  const guidesDir = path.join(__dirname, 'docs', 'guides');

  // S'assurer que le dossier des guides existe
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  // Commande pour générer les fichiers d'onboarding
  const command = 'node generate_onboarding.js';

  try {
    // Exécution de la commande
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Erreur lors de la génération des fichiers d\'onboarding :', error);
  }

  // Exemple de contenu Markdown pour le guide d'onboarding
  const md = `# Guide d'Onboarding

Bienvenue dans le guide d'onboarding pour MayaVoiceTranslator !

## Étapes suivantes

1. **Installation des dépendances** : Assurez-vous d'avoir toutes les dépendances nécessaires installées.
2. **Configuration** : Configurez votre environnement comme indiqué dans la documentation.
3. **Premiers pas** : Suivez les instructions pour effectuer votre première traduction.

Pour plus de détails, référez-vous à la documentation complète.

`;

  // Écriture du fichier Markdown dans docs/
  fs.writeFileSync(path.join(docsDir, 'ONBOARDING.md'), md, 'utf8');
  console.log('Guide ONBOARDING.md généré dans docs/');

  // Modèles de contenu pour les guides multilingues
  const templates = {
    fr: md,
    en: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Welcome to the onboarding guide for MayaVoiceTranslator!'),
    es: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', '¡Bienvenido a la guía de incorporación de MayaVoiceTranslator!'),
    de: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Willkommen zum Onboarding-Leitfaden für MayaVoiceTranslator!'),
    pt: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Bem-vindo ao guia de integração do MayaVoiceTranslator!'),
    it: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Benvenuto nella guida all\'onboarding di MayaVoiceTranslator!'),
    nl: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Welkom bij de onboardinggids voor MayaVoiceTranslator!'),
    zh: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', '欢迎使用 MayaVoiceTranslator 的入门指南！'),
    ar: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'مرحبًا بكم في دليل الانطلاق لـ MayaVoiceTranslator!'),
    ru: md.replace('Bienvenue dans le guide d\'onboarding pour MayaVoiceTranslator !', 'Добро пожаловать в руководство по адаптации для MayaVoiceTranslator!')
  };

  // Génération des fichiers pour chaque langue
  for (const [lang, content] of Object.entries(templates)) {
    fs.writeFileSync(path.join(docsDir, `ONBOARDING_${lang}.md`), content, 'utf8');
    // Génération HTML à partir du Markdown
    // Ajout d'un script analytics d'usage anonyme (RGPD-friendly)
    const analyticsScript = `<script>\n(function(){\n  try {\n    fetch('/api/track_guide?lang=${lang}&ts=' + Date.now(), {method:'POST', keepalive:true});\n  } catch(e){}\n})();\n</script>`;
    const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Onboarding MayaVoiceTranslator (${lang})</title><style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:2em;}h1{color:#2a5d9f}pre,code{background:#f4f4f4;padding:2px 4px;border-radius:3px;}a{color:#2a5d9f;text-decoration:underline;}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}</style></head><body>` + marked.parse(content) + analyticsScript + `</body></html>`;
    fs.writeFileSync(path.join(docsDir, `ONBOARDING_${lang}.html`), html, 'utf8');
  }
  console.log('Guides ONBOARDING multilingues générés dans docs/ (fr, en, es, de, pt, it, nl, zh, ar, ru)');
}

async function translateText(text, targetLang) {
  // Utilise l’API LibreTranslate (gratuite, open source)
  return new Promise((resolve) => {
    const data = JSON.stringify({
      q: text,
      source: 'fr',
      target: targetLang,
      format: 'text'
    });
    const options = {
      hostname: 'libretranslate.de',
      path: '/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result.translatedText || text);
        } catch {
          resolve(text); // fallback si erreur
        }
      });
    });
    req.on('error', () => resolve(text));
    req.write(data);
    req.end();
  });
}

async function generateAllOnboarding() {
  // Exemple de contenu Markdown pour le guide d'onboarding
  const md = `# Guide d'Onboarding

Bienvenue dans le guide d'onboarding pour MayaVoiceTranslator !

## Étapes suivantes

1. **Installation des dépendances** : Assurez-vous d'avoir toutes les dépendances nécessaires installées.
2. **Configuration** : Configurez votre environnement comme indiqué dans la documentation.
3. **Premiers pas** : Suivez les instructions pour effectuer votre première traduction.

Pour plus de détails, référez-vous à la documentation complète.

`;
  const langs = ['en','es','de','pt','it','nl','zh','ar','ru'];
  for (const lang of langs) {
    let content;
    if (lang === 'en') {
      content = await translateText(md, 'en');
    } else if (lang === 'zh') {
      content = await translateText(md, 'zh');
    } else if (lang === 'ar') {
      content = await translateText(md, 'ar');
    } else if (lang === 'ru') {
      content = await translateText(md, 'ru');
    } else {
      content = await translateText(md, lang);
    }
    fs.writeFileSync(path.join(docsDir, `ONBOARDING_${lang}.md`), content, 'utf8');
    const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Onboarding MayaVoiceTranslator (${lang})</title><style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:2em;}h1{color:#2a5d9f}pre,code{background:#f4f4f4;padding:2px 4px;border-radius:3px;}a{color:#2a5d9f;text-decoration:underline;}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}</style></head><body>` + marked.parse(content) + `</body></html>`;
    fs.writeFileSync(path.join(docsDir, `ONBOARDING_${lang}.html`), html, 'utf8');
  }
  // Version FR déjà générée plus haut
  console.log('Guides ONBOARDING multilingues traduits générés dans docs/ (fr, en, es, de, pt, it, nl, zh, ar, ru)');
}

// Appel principal
(async () => {
  // Génération du contenu principal FR
  const md = `# Guide d'Onboarding

Bienvenue dans le guide d'onboarding pour MayaVoiceTranslator !

## Étapes suivantes

1. **Installation des dépendances** : Assurez-vous d'avoir toutes les dépendances nécessaires installées.
2. **Configuration** : Configurez votre environnement comme indiqué dans la documentation.
3. **Premiers pas** : Suivez les instructions pour effectuer votre première traduction.

Pour plus de détails, référez-vous à la documentation complète.

`;
  fs.writeFileSync(path.join(docsDir, 'ONBOARDING.md'), md, 'utf8');
  console.log('Guide ONBOARDING.md généré dans docs/');
  await generateAllOnboarding();
})();

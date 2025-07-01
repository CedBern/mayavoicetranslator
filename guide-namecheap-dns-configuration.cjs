#!/usr/bin/env node

/**
 * GUIDE CONFIGURATION DNS NAMECHEAP - TALKKIN.AI
 * Optimisation complète de votre configuration actuelle
 */

console.log('🎯 CONFIGURATION DNS NAMECHEAP - TALKKIN.AI');
console.log('=' .repeat(50));

// Analyse de votre configuration actuelle
const currentConfig = {
  registrar: 'Namecheap',
  domain: 'talkkin.ai',
  currentRecords: [
    {
      type: 'CNAME',
      host: 'www',
      value: 'parkingpage.namecheap.com.',
      ttl: '30 min',
      status: '⚠️ PARKING PAGE - À changer'
    },
    {
      type: 'URL Redirect',
      host: '@',
      value: 'http://www.talkkin.ai/',
      mask: 'Unmasked',
      status: '⚠️ REDIRECTION CIRCULAIRE - À corriger'
    }
  ],
  services: {
    premiumDns: 'Non activé',
    dnssec: 'Disponible mais non activé',
    privateEmail: 'AutoM (disponible)',
    mailSettings: 'Non configuré'
  }
};

console.log('\n📊 ANALYSE CONFIGURATION ACTUELLE');
console.log('-'.repeat(45));

console.log(`\n🌐 Domaine: ${currentConfig.domain}`);
console.log(`📍 Registrar: ${currentConfig.registrar}`);

console.log('\n📝 ENREGISTREMENTS ACTUELS:');
currentConfig.currentRecords.forEach((record, index) => {
  console.log(`\n${index + 1}. ${record.type} Record`);
  console.log(`   Host: ${record.host}`);
  console.log(`   Value: ${record.value}`);
  console.log(`   TTL: ${record.ttl || 'N/A'}`);
  console.log(`   ${record.status}`);
});

console.log('\n⚙️  SERVICES DISPONIBLES:');
Object.entries(currentConfig.services).forEach(([service, status]) => {
  const emoji = status.includes('Non') ? '❌' : status.includes('disponible') ? '🟡' : '✅';
  console.log(`   ${emoji} ${service}: ${status}`);
});

// Problèmes identifiés
const issues = [
  {
    severity: 'CRITIQUE',
    issue: 'Redirection circulaire',
    description: '@ redirige vers www.talkkin.ai qui pointe vers parking page',
    solution: 'Configurer enregistrement A vers votre serveur web'
  },
  {
    severity: 'CRITIQUE',
    issue: 'Site en parking page',
    description: 'www.talkkin.ai pointe vers parkingpage.namecheap.com',
    solution: 'Pointer vers votre serveur ou service d\'hébergement'
  },
  {
    severity: 'IMPORTANT',
    issue: 'Premium DNS non activé',
    description: 'DNS basique sans protection ni performance optimisée',
    solution: 'Activer Premium DNS Namecheap (gratuit souvent)'
  },
  {
    severity: 'IMPORTANT',
    issue: 'Emails non configurés',
    description: 'Pas d\'enregistrements MX pour hello@, cedric@, support@',
    solution: 'Configurer Private Email ou redirection email'
  },
  {
    severity: 'SÉCURITÉ',
    issue: 'DNSSEC non activé',
    description: 'Domaine vulnérable aux attaques DNS',
    solution: 'Activer DNSSEC immédiatement'
  }
];

console.log('\n🚨 PROBLÈMES IDENTIFIÉS');
console.log('-'.repeat(30));

issues.forEach((issue, index) => {
  const emoji = issue.severity === 'CRITIQUE' ? '🔴' : 
                issue.severity === 'IMPORTANT' ? '🟡' : '🔶';
  console.log(`\n${index + 1}. ${emoji} ${issue.severity}: ${issue.issue}`);
  console.log(`   📝 ${issue.description}`);
  console.log(`   ✅ Solution: ${issue.solution}`);
});

// Plan d'action immédiat Namecheap
const namecheapActionPlan = [
  {
    step: 1,
    title: 'ACTIVER PREMIUM DNS',
    time: '3 min',
    location: 'Dashboard → Domain List → talkkin.ai → Advanced DNS',
    actions: [
      'Cliquez sur "Upgrade to PremiumDNS"',
      'Confirmez upgrade (souvent gratuit 1ère année)',
      'Attendez activation (2-5 minutes)',
      'Vérifiez nouveau panel "Premium DNS"'
    ],
    benefit: 'Performance +50%, Protection DDoS'
  },
  {
    step: 2,
    title: 'SUPPRIMER REDIRECTIONS PROBLÉMATIQUES',
    time: '2 min',
    location: 'Advanced DNS → Host Records',
    actions: [
      'Supprimez "URL Redirect Record @"',
      'Supprimez "CNAME www → parkingpage.namecheap.com"',
      'Confirmez suppressions'
    ],
    benefit: 'Élimine boucles de redirection'
  },
  {
    step: 3,
    title: 'CONFIGURER ENREGISTREMENTS DE BASE',
    time: '5 min',
    location: 'Advanced DNS → Add New Record',
    actions: [
      'Ajoutez A Record: @ → IP-de-votre-serveur',
      'Ajoutez A Record: www → IP-de-votre-serveur',
      'Ou CNAME: www → @',
      'TTL: 5 minutes pour tests'
    ],
    benefit: 'Site accessible via talkkin.ai et www.talkkin.ai'
  },
  {
    step: 4,
    title: 'CONFIGURER EMAILS',
    time: '5 min',
    location: 'Advanced DNS → Add New Record',
    actions: [
      'Ajoutez MX Record: @ → mail.votre-hebergeur.com',
      'Ou activez Private Email Namecheap',
      'Configurez redirections email',
      'Testez envoi/réception'
    ],
    benefit: 'hello@, cedric@, support@ fonctionnels'
  },
  {
    step: 5,
    title: 'ACTIVER DNSSEC',
    time: '2 min',
    location: 'Advanced DNS → DNSSEC',
    actions: [
      'Cliquez "Enable DNSSEC"',
      'Confirmez activation',
      'Notez les clés générées',
      'Vérifiez statut activé'
    ],
    benefit: 'Protection contre attaques DNS'
  }
];

console.log('\n🚀 PLAN D\'ACTION NAMECHEAP - 17 MINUTES');
console.log('-'.repeat(50));

namecheapActionPlan.forEach(step => {
  console.log(`\n🔸 ÉTAPE ${step.step}: ${step.title} (${step.time})`);
  console.log(`   📍 Localisation: ${step.location}`);
  console.log(`   📋 Actions:`);
  step.actions.forEach((action, index) => {
    console.log(`      ${index + 1}. ${action}`);
  });
  console.log(`   💡 Bénéfice: ${step.benefit}`);
});

// Configuration DNS optimale recommandée
const optimalDnsConfig = {
  'A Records': [
    {
      host: '@',
      value: 'IP-DE-VOTRE-SERVEUR',
      ttl: '5 min (test) → 1h (prod)',
      purpose: 'Site principal talkkin.ai'
    },
    {
      host: 'www',
      value: 'IP-DE-VOTRE-SERVEUR',
      ttl: '5 min (test) → 1h (prod)',
      purpose: 'www.talkkin.ai'
    }
  ],
  'CNAME Records': [
    {
      host: 'api',
      value: '@',
      ttl: '1 hour',
      purpose: 'api.talkkin.ai'
    },
    {
      host: 'app',
      value: '@',
      ttl: '1 hour', 
      purpose: 'app.talkkin.ai'
    },
    {
      host: 'admin',
      value: '@',
      ttl: '1 hour',
      purpose: 'admin.talkkin.ai'
    }
  ],
  'MX Records': [
    {
      host: '@',
      value: 'mail.votre-hebergeur.com',
      priority: '10',
      purpose: 'Emails @talkkin.ai'
    }
  ],
  'TXT Records': [
    {
      host: '@',
      value: 'v=spf1 include:_spf.votre-hebergeur.com ~all',
      purpose: 'SPF pour authentification email'
    },
    {
      host: '_dmarc',
      value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@talkkin.ai',
      purpose: 'Protection email DMARC'
    }
  ]
};

console.log('\n⚙️  CONFIGURATION OPTIMALE RECOMMANDÉE');
console.log('-'.repeat(45));

Object.entries(optimalDnsConfig).forEach(([recordType, records]) => {
  console.log(`\n📝 ${recordType}:`);
  records.forEach((record, index) => {
    console.log(`   ${index + 1}. ${record.host} → ${record.value}`);
    console.log(`      TTL: ${record.ttl || record.priority || 'Default'}`);
    console.log(`      Usage: ${record.purpose}`);
  });
});

// Alternatives pour l'hébergement
const hostingOptions = [
  {
    option: 'GITHUB PAGES (GRATUIT)',
    setup: 'Pages GitHub + Custom Domain',
    records: [
      'A @ → 185.199.108.153',
      'A @ → 185.199.109.153', 
      'A @ → 185.199.110.153',
      'A @ → 185.199.111.153',
      'CNAME www → votre-username.github.io'
    ],
    pros: ['Gratuit', 'SSL automatique', 'CDN global'],
    cons: ['Sites statiques seulement']
  },
  {
    option: 'VERCEL (GRATUIT)',
    setup: 'Deploy sur Vercel + Custom Domain',
    records: [
      'A @ → 76.76.19.61',
      'CNAME www → cname.vercel-dns.com'
    ],
    pros: ['Gratuit', 'Next.js optimisé', 'Edge functions'],
    cons: ['Limites bandwidth']
  },
  {
    option: 'NETLIFY (GRATUIT)', 
    setup: 'Deploy sur Netlify + Custom Domain',
    records: [
      'A @ → 75.2.60.5',
      'CNAME www → votre-site.netlify.app'
    ],
    pros: ['Gratuit', 'Forms intégrées', 'Functions'],
    cons: ['Limites bandwidth']
  },
  {
    option: 'HÉBERGEUR TRADITIONNEL',
    setup: 'Panel hébergeur → Custom Domain',
    records: [
      'A @ → IP fournie par hébergeur',
      'CNAME www → @'
    ],
    pros: ['Full control', 'Base de données', 'Email inclus'],
    cons: ['Coût mensuel']
  }
];

console.log('\n🌐 OPTIONS HÉBERGEMENT POUR VOTRE SITE');
console.log('-'.repeat(45));

hostingOptions.forEach((option, index) => {
  console.log(`\n${index + 1}. ${option.option}`);
  console.log(`   🔧 Setup: ${option.setup}`);
  console.log(`   📝 DNS Records:`);
  option.records.forEach(record => {
    console.log(`      • ${record}`);
  });
  console.log(`   ✅ Avantages: ${option.pros.join(', ')}`);
  console.log(`   ⚠️  Inconvénients: ${option.cons.join(', ')}`);
});

// Instructions spécifiques Namecheap Premium DNS
console.log('\n🎯 INSTRUCTIONS SPÉCIFIQUES NAMECHEAP');
console.log('-'.repeat(40));

const namecheapSpecific = [
  {
    feature: 'Premium DNS',
    location: 'Dashboard → Domain List → Manage → Advanced DNS',
    button: '"Upgrade to PremiumDNS"',
    cost: 'Souvent gratuit 1ère année, puis $2/mois',
    benefit: 'DNS 5x plus rapide + protection DDoS'
  },
  {
    feature: 'Private Email',
    location: 'Dashboard → Email → Private Email',
    button: '"Get Private Email"',
    cost: '$1.16/mois pour 3 boîtes email',
    benefit: 'hello@, cedric@, support@ avec webmail'
  },
  {
    feature: 'DNSSEC',
    location: 'Advanced DNS → DNSSEC section',
    button: '"Enable DNSSEC"',
    cost: 'Gratuit avec Premium DNS',
    benefit: 'Protection contre DNS spoofing'
  }
];

namecheapSpecific.forEach((item, index) => {
  console.log(`\n${index + 1}. ${item.feature}`);
  console.log(`   📍 Où: ${item.location}`);
  console.log(`   🔘 Bouton: ${item.button}`);
  console.log(`   💰 Coût: ${item.cost}`);
  console.log(`   💡 Bénéfice: ${item.benefit}`);
});

// Étapes de test et validation
const testingSteps = [
  {
    test: 'Test propagation DNS',
    command: 'nslookup talkkin.ai',
    expected: 'Votre IP serveur (pas parkingpage)',
    timing: '5-30 minutes après changements'
  },
  {
    test: 'Test site web',
    command: 'Ouvrir https://talkkin.ai',
    expected: 'Votre site (pas parking page)',
    timing: 'Immédiat après propagation'
  },
  {
    test: 'Test www',
    command: 'Ouvrir https://www.talkkin.ai',
    expected: 'Même site que talkkin.ai',
    timing: 'Immédiat après propagation'
  },
  {
    test: 'Test email',
    command: 'Envoyer à hello@talkkin.ai',
    expected: 'Email reçu dans votre boîte',
    timing: '1-4h après config MX'
  }
];

console.log('\n🧪 TESTS DE VALIDATION');
console.log('-'.repeat(25));

testingSteps.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.test}`);
  console.log(`   🔧 Comment: ${test.command}`);
  console.log(`   🎯 Attendu: ${test.expected}`);
  console.log(`   ⏱️  Délai: ${test.timing}`);
});

// Recommandation finale
console.log('\n🏆 RECOMMANDATION FINALE');
console.log('='.repeat(40));

console.log('\n🚀 ACTION IMMÉDIATE (17 MINUTES):');
console.log('   1. ✅ Activez Premium DNS (3 min)');
console.log('   2. 🗑️  Supprimez redirections actuelles (2 min)');
console.log('   3. 🌐 Configurez hébergement temporaire (5 min)');
console.log('   4. 📧 Setup emails de base (5 min)');
console.log('   5. 🔒 Activez DNSSEC (2 min)');

console.log('\n💡 ORDRE DE PRIORITÉ:');
console.log('   🥇 Premium DNS + DNSSEC (sécurité)');
console.log('   🥈 Hébergement site basic (visibilité)');
console.log('   🥉 Configuration emails (business)');

console.log('\n🎯 RÉSULTAT FINAL:');
console.log('   • talkkin.ai fonctionnel et sécurisé');
console.log('   • Emails @talkkin.ai opérationnels');
console.log('   • Protection contre attaques DNS');
console.log('   • Base solide pour le développement');

console.log('\n❓ VOUS AVEZ L\'IP DE VOTRE SERVEUR WEB?');
console.log('   Si oui → Configuration A records immédiate');
console.log('   Si non → Je recommande GitHub Pages gratuit');

process.exit(0);

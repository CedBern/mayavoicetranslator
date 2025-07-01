// validate-all-final.js
// Script de validation finale pour Maya Voice Translator (Talk Kin)
// Exécute les tests critiques, vérifie les services et génère un rapport synthétique

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tests = [
  'test-final-integration.js',
  'test-complete-advanced.js',
  'test-integration-finale.js',
  'test-quick-validation.js',
  'test-ai-priority2.js',
  'test-corrections-finales.js',
  'validate-final.js',
  'validation-finale.js',
  'validation-talk-kin.js',
];

const results = [];

function runTest(script) {
  try {
    execSync(`node ${script}`, { stdio: 'inherit' });
    results.push({ script, status: 'OK' });
  } catch (e) {
    results.push({ script, status: 'FAIL', error: e.message });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const healthPaths = ['/', '/health', '/api/health', '/status'];

async function checkServiceWithRetryMultiPaths(baseUrl, retries = 5, delay = 2000) {
  for (const path of healthPaths) {
    const url = baseUrl + path;
    for (let i = 0; i < retries; i++) {
      try {
        const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`).toString().trim();
        if (res === '200') return { status: 'OK', url };
        else if (i === retries - 1) return { status: `HTTP ${res}`, url };
      } catch {
        if (i === retries - 1) return { status: 'DOWN', url };
      }
      await sleep(delay);
    }
  }
  return { status: 'DOWN', url: baseUrl };
}

async function main() {
  console.log('--- VALIDATION FINALE TALK KIN ---');
  // 1. Exécution des tests critiques
  tests.forEach(test => {
    const testPath = path.join(__dirname, '..', test);
    if (fs.existsSync(testPath)) {
      console.log(`\n[TEST] ${test}`);
      runTest(testPath);
    } else {
      results.push({ script: test, status: 'NOT FOUND' });
    }
  });

  // 2. Vérification des services principaux (multi-ports et multi-paths)
  const services = [
    { name: 'API (3001)', baseUrl: 'http://localhost:3001' },
    { name: 'API (3000)', baseUrl: 'http://localhost:3000' },
    { name: 'TTS (3001)', baseUrl: 'http://localhost:3001/tts' },
    { name: 'Web (3000)', baseUrl: 'http://localhost:3000' },
    { name: 'Web (8080)', baseUrl: 'http://localhost:8080' },
    { name: 'Web (8081)', baseUrl: 'http://localhost:8081' },
  ];
  const serviceResults = [];
  for (const s of services) {
    const result = await checkServiceWithRetryMultiPaths(s.baseUrl);
    serviceResults.push({ name: s.name, url: result.url, status: result.status });
  }

  // 3. Rapport synthétique
  const report = {
    date: new Date().toISOString(),
    testResults: results,
    serviceResults,
  };
  fs.writeFileSync(path.join(__dirname, 'validation-report-final.json'), JSON.stringify(report, null, 2));
  console.log('\n--- RAPPORT DE VALIDATION GÉNÉRÉ : scripts/validation-report-final.json ---');
  console.log(JSON.stringify(report, null, 2));
}

main();

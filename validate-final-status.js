#!/usr/bin/env node
/**
 * 🎯 Validation Finale Talk Kin
 * Script de validation rapide pour confirmer que tout fonctionne
 */

console.log("🎯 VALIDATION FINALE TALK KIN");
console.log("================================\n");

async function validateFinalSetup() {
  const startTime = Date.now();
  let passedTests = 0;
  let totalTests = 6;
  
  console.log("🔍 Vérification des services...\n");
  
  // 1. Test API Health
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log("✅ 1. API Server: ACTIF");
    console.log(`   📡 Status: ${data.status}`);
    console.log(`   ⏰ Uptime: ${data.uptime}`);
    passedTests++;
  } catch (error) {
    console.log("❌ 1. API Server: ÉCHEC");
    console.log(`   ⚠️ Erreur: ${error.message}`);
  }
  
  // 2. Test Activation Status
  try {
    const response = await fetch('http://localhost:3000/api/activation/status');
    const data = await response.json();
    console.log("✅ 2. Activation Status: ACTIF");
    console.log(`   📊 Fonctionnalités: ${data.stats.active}/${data.stats.total}`);
    console.log(`   🌟 Status: ${data.globalStatus}`);
    passedTests++;
  } catch (error) {
    console.log("❌ 2. Activation Status: ÉCHEC");
  }
  
  // 3. Test Translation API
  try {
    const response = await fetch('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'bonjour',
        sourceLang: 'fr',
        targetLang: 'yua'
      })
    });
    const data = await response.json();
    console.log("✅ 3. Translation API: ACTIF");
    console.log(`   🔄 Traduction: "${data.original}" → "${data.translation}"`);
    passedTests++;
  } catch (error) {
    console.log("❌ 3. Translation API: ÉCHEC");
  }
  
  // 4. Test TTS API
  try {
    const response = await fetch('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'ba\'ax ka wa\'alik',
        language: 'yua',
        voice: 'default'
      })
    });
    const data = await response.json();
    console.log("✅ 4. TTS API: ACTIF");
    console.log(`   🔊 Voice: ${data.voice}, Duration: ${data.duration}ms`);
    passedTests++;
  } catch (error) {
    console.log("❌ 4. TTS API: ÉCHEC");
  }
  
  // 5. Test Crowdsourcing API
  try {
    const response = await fetch('http://localhost:3000/api/crowdsourcing/stats');
    const data = await response.json();
    console.log("✅ 5. Crowdsourcing API: ACTIF");
    console.log(`   🤝 Contributeurs: ${data.stats.contributors}`);
    console.log(`   📝 Traductions: ${data.stats.translations}`);
    passedTests++;
  } catch (error) {
    console.log("❌ 5. Crowdsourcing API: ÉCHEC");
  }
  
  // 6. Test Web Interface
  try {
    const response = await fetch('http://localhost:8083/status');
    if (response.ok) {
      console.log("✅ 6. Web Interface: ACTIF");
      console.log(`   🌐 URL: http://localhost:8083`);
      passedTests++;
    } else {
      console.log("⚠️ 6. Web Interface: Peut-être inactif");
    }
  } catch (error) {
    console.log("⚠️ 6. Web Interface: Non accessible");
    console.log("   💡 Lancez: node web-server.js");
  }
  
  const duration = Date.now() - startTime;
  
  console.log("\n" + "=".repeat(40));
  console.log("📊 RÉSULTATS DE VALIDATION");
  console.log("=".repeat(40));
  console.log(`⏱️ Durée: ${duration}ms`);
  console.log(`📈 Tests passés: ${passedTests}/${totalTests}`);
  console.log(`🎯 Taux de réussite: ${Math.round((passedTests/totalTests)*100)}%`);
  
  if (passedTests === totalTests) {
    console.log("\n🎉 VALIDATION RÉUSSIE !");
    console.log("✨ Talk Kin est 100% opérationnel !");
    console.log("🚀 Prêt pour la production !");
  } else if (passedTests >= 4) {
    console.log("\n✅ VALIDATION PARTIELLEMENT RÉUSSIE");
    console.log("⚠️ Quelques services peuvent nécessiter un redémarrage");
    console.log("🔧 Vérifiez les services marqués comme échoués");
  } else {
    console.log("\n❌ VALIDATION ÉCHOUÉE");
    console.log("🔧 Redémarrez les services requis");
    console.log("📋 Consultez TALK_KIN_COMPLETION_FINAL.md pour aide");
  }
  
  console.log("\n🔗 Liens Utiles:");
  console.log("   🌐 Web App: http://localhost:8083");
  console.log("   📡 API: http://localhost:3000");
  console.log("   🏥 Health: http://localhost:3000/api/health");
  console.log("   📚 Docs: TALK_KIN_COMPLETION_FINAL.md");
}

validateFinalSetup().catch(console.error);

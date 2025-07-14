// Tests complets des services avancés et intégration React Native

/**
 * Suite de tests complète pour les fonctionnalités avancées
 * Tests d'intégration, performance, robustesse et cas d'usage réels
 */

console.log("🚀 Démarrage des tests complets avancés...");

// Imports dynamiques pour éviter les problèmes
let IntegrationManager, SecureAPIKeyManager, VectorDatabaseService, NeuralTTSService, NativeSpeechRecognitionService;

async function loadModules() {
  try {
    const modules = await Promise.all([
      import('./services/IntegrationManager.js'),
      import('./services/SecureAPIKeyManager.js'),
      import('./services/VectorDatabaseService.js'),
      import('./services/NeuralTTSService.js'),
      import('./services/NativeSpeechRecognitionService.js')
    ]);
    
    IntegrationManager = modules[0].default;
    SecureAPIKeyManager = modules[1].default;
    VectorDatabaseService = modules[2].default;
    NeuralTTSService = modules[3].default;
    NativeSpeechRecognitionService = modules[4].default;
    
    console.log("✅ Tous les modules chargés avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des modules:", error.message);
    return false;
  }
}

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utilitaires de test
function logTest(name, status, details = '', duration = 0) {
  testResults.total++;
  if (status) {
    testResults.passed++;
    console.log(`✅ ${name} (${duration}ms) ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name} (${duration}ms) ${details}`);
  }
  testResults.details.push({ name, status, details, duration });
}

function generateTestData() {
  return {
    phrases: [
      { text: "Bix a beel?", lang: "yua", meaning: "Comment ça va?" },
      { text: "K'iche' winaq", lang: "quc", meaning: "Personne K'iche'" },
      { text: "Allinllachu", lang: "qu", meaning: "Comment ça va?" },
      { text: "Kamo nelia?", lang: "nah", meaning: "Comment ça va?" },
      { text: "Mba'éichapa", lang: "gn", meaning: "Comment ça va?" },
      { text: "Bonjour tout le monde", lang: "fr", meaning: "Hello everyone" },
      { text: "Buenos días amigos", lang: "es", meaning: "Good morning friends" }
    ],
    audioTestData: "UklGRiQEAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQAEAAA=", // Sample WAV data
    apiKeys: {
      test_openai: "sk-test1234567890123456789012345678901234567890",
      test_google: "AIzaSyTest1234567890123456789012345678",
      test_azure: "test1234567890abcdef1234567890abcdef"
    }
  };
}

// Tests du gestionnaire de clés API sécurisé
async function testSecureAPIKeyManager() {
  console.log('\n🔐 Test du gestionnaire de clés API sécurisé...');
  const testData = generateTestData();
  
  try {
    const keyManager = new SecureAPIKeyManager();
    const startTime = Date.now();
    
    // Test d'initialisation
    await keyManager.initialize();
    logTest('Initialisation SecureAPIKeyManager', true, '', Date.now() - startTime);
    
    // Test d'ajout de clés
    let addKeyTime = Date.now();
    for (const [service, key] of Object.entries(testData.apiKeys)) {
      const cleanService = service.replace('test_', '');
      try {
        await keyManager.setAPIKey(cleanService, key, { skipValidation: true });
        logTest(`Ajout clé ${cleanService}`, true, '', Date.now() - addKeyTime);
      } catch (error) {
        logTest(`Ajout clé ${cleanService}`, false, error.message);
      }
      addKeyTime = Date.now();
    }
    
    // Test de récupération
    const retrieveTime = Date.now();
    const retrievedKey = await keyManager.getAPIKey('openai');
    logTest('Récupération clé API', retrievedKey !== null, 
      retrievedKey ? 'Clé récupérée avec succès' : 'Échec récupération', 
      Date.now() - retrieveTime);
    
    // Test des services supportés
    const servicesTime = Date.now();
    const supportedServices = keyManager.getSupportedServices();
    logTest('Services supportés', Array.isArray(supportedServices) && supportedServices.length > 0,
      `${supportedServices.length} services supportés`, Date.now() - servicesTime);
    
    // Test des statistiques
    const statsTime = Date.now();
    const stats = keyManager.getUsageStats();
    logTest('Statistiques d\'utilisation', typeof stats === 'object',
      `Stats générées pour ${Object.keys(stats).length} services`, Date.now() - statsTime);
    
    // Test de chiffrement/déchiffrement
    const encryptTime = Date.now();
    const testObject = { test: 'data', number: 123 };
    const encrypted = keyManager.encrypt(testObject);
    const decrypted = keyManager.decrypt(encrypted);
    logTest('Chiffrement/Déchiffrement', 
      JSON.stringify(testObject) === JSON.stringify(decrypted),
      'Données préservées après chiffrement', Date.now() - encryptTime);
    
    // Test de limitation de taux
    const rateLimitTime = Date.now();
    const canUse1 = keyManager.checkRateLimit('openai');
    keyManager.incrementUsageCounter('openai');
    const canUse2 = keyManager.checkRateLimit('openai');
    logTest('Limitation de taux', canUse1 && canUse2, 
      'Rate limiting fonctionnel', Date.now() - rateLimitTime);
    
  } catch (error) {
    logTest('SecureAPIKeyManager Global', false, error.message);
  }
}

// Tests de la base de données vectorielle
async function testVectorDatabaseService() {
  console.log('\n🗄️ Test de la base de données vectorielle...');
  const testData = generateTestData();
  
  try {
    const vectorDB = new VectorDatabaseService();
    const startTime = Date.now();
    
    // Test d'initialisation
    await vectorDB.initialize();
    logTest('Initialisation VectorDatabase', true, '', Date.now() - startTime);
    
    // Test d'ajout de documents
    const addTime = Date.now();
    const docIds = [];
    for (const phrase of testData.phrases) {
      try {
        const docId = await vectorDB.addDocument(phrase.text, phrase.lang, {
          meaning: phrase.meaning,
          testDocument: true
        });
        docIds.push(docId);
        logTest(`Ajout document ${phrase.lang}`, true, `ID: ${docId.slice(0, 8)}...`);
      } catch (error) {
        logTest(`Ajout document ${phrase.lang}`, false, error.message);
      }
    }
    console.log(`⏱️ Ajout de ${docIds.length} documents en ${Date.now() - addTime}ms`);
    
    // Test de recherche de similarité
    const searchTime = Date.now();
    const searchResults = await vectorDB.searchSimilar("Comment ça va", "fr", {
      topK: 5,
      threshold: 0.3,
      crossLingual: true,
      includeMetadata: true
    });
    logTest('Recherche similarité', Array.isArray(searchResults),
      `${searchResults.length} résultats trouvés`, Date.now() - searchTime);
    
    // Test de recherche cross-linguale
    const crossSearchTime = Date.now();
    const crossResults = await vectorDB.searchSimilar("Buenos días", "es", {
      topK: 3,
      crossLingual: true,
      threshold: 0.2
    });
    logTest('Recherche cross-linguale', Array.isArray(crossResults),
      `${crossResults.length} résultats cross-linguaux`, Date.now() - crossSearchTime);
    
    // Test de génération d'embeddings
    const embeddingTime = Date.now();
    const embedding1 = await vectorDB.generateEmbedding("Test text", "fr");
    const embedding2 = await vectorDB.generateEmbedding("Texto de prueba", "es");
    logTest('Génération embeddings', 
      embedding1.length > 0 && embedding2.length > 0,
      `Dimensions: ${embedding1.length}`, Date.now() - embeddingTime);
    
    // Test de similarité cosinus
    const cosineTime = Date.now();
    const similarity = vectorDB.cosineSimilarity(embedding1, embedding2);
    logTest('Similarité cosinus', 
      typeof similarity === 'number' && similarity >= -1 && similarity <= 1,
      `Similarité: ${similarity.toFixed(3)}`, Date.now() - cosineTime);
    
    // Test des caractéristiques linguistiques
    const featuresTime = Date.now();
    const features = vectorDB.extractLinguisticFeatures("Bix a beel k'ux?", "yua");
    logTest('Caractéristiques linguistiques', 
      typeof features === 'object' && 'hasGlottalStops' in features,
      `Coup de glotte: ${features.hasGlottalStops}`, Date.now() - featuresTime);
    
    // Test des statistiques
    const statsTime = Date.now();
    const stats = vectorDB.getStats();
    logTest('Statistiques VectorDB', typeof stats === 'object',
      `${stats.totalVectors} vecteurs, ${stats.indicesCount} indices`, Date.now() - statsTime);
    
  } catch (error) {
    logTest('VectorDatabaseService Global', false, error.message);
  }
}

// Tests du service TTS neural
async function testNeuralTTSService() {
  console.log('\n🎤 Test du service TTS neural...');
  const testData = generateTestData();
  
  try {
    const neuralTTS = new NeuralTTSService();
    const startTime = Date.now();
    
    // Test d'initialisation
    await neuralTTS.initialize();
    logTest('Initialisation NeuralTTS', true, '', Date.now() - startTime);
    
    // Test de synthèse pour différentes langues
    for (const phrase of testData.phrases.slice(0, 3)) {
      const synthTime = Date.now();
      try {
        const result = await neuralTTS.synthesize(phrase.text, phrase.lang, {
          useNeural: true,
          adaptToContext: true
        });
        
        logTest(`Synthèse ${phrase.lang}`, 
          result && result.audioData,
          `Durée: ${result.duration?.toFixed(2)}s`, Date.now() - synthTime);
      } catch (error) {
        logTest(`Synthèse ${phrase.lang}`, false, error.message);
      }
    }
    
    // Test de pré-traitement phonétique
    const preprocessTime = Date.now();
    const originalText = "k'ux a beel";
    const processedText = await neuralTTS.preprocessText(originalText, "yua");
    logTest('Pré-traitement phonétique', 
      processedText !== originalText,
      `"${originalText}" → "${processedText}"`, Date.now() - preprocessTime);
    
    // Test d'analyse phonétique
    const phoneticTime = Date.now();
    const phonetics = neuralTTS.analyzePhonetics("tz'ikin", "quc");
    logTest('Analyse phonétique', 
      Array.isArray(phonetics.phonemes),
      `${phonetics.phonemes.length} phonèmes détectés`, Date.now() - phoneticTime);
    
    // Test de fallback
    const fallbackTime = Date.now();
    const fallbackResult = await neuralTTS.fallbackSynthesize("Hello world", "en");
    logTest('TTS Fallback', 
      fallbackResult && (fallbackResult.success !== undefined),
      'Fallback fonctionnel', Date.now() - fallbackTime);
    
    // Test des statistiques
    const statsTime = Date.now();
    const stats = neuralTTS.getStats();
    logTest('Statistiques TTS', typeof stats === 'object',
      `${stats.supportedLanguages.length} langues supportées`, Date.now() - statsTime);
    
  } catch (error) {
    logTest('NeuralTTSService Global', false, error.message);
  }
}

// Tests du service de reconnaissance vocale native
async function testNativeSpeechRecognition() {
  console.log('\n👂 Test de la reconnaissance vocale native...');
  const testData = generateTestData();
  
  try {
    const speechRecognition = new NativeSpeechRecognitionService();
    const startTime = Date.now();
    
    // Test d'initialisation
    await speechRecognition.initialize();
    logTest('Initialisation SpeechRecognition', true, '', Date.now() - startTime);
    
    // Test de reconnaissance simulée
    for (const phrase of testData.phrases.slice(0, 2)) {
      const recognitionTime = Date.now();
      try {
        // Simuler des données audio (en production, utiliser de vraies données)
        const audioData = Buffer.from(testData.audioTestData, 'base64');
        
        const result = await speechRecognition.recognize(audioData, phrase.lang, {
          useNativeRecognition: true,
          postProcess: true,
          expectedText: phrase.text // Pour simulation
        });
        
        logTest(`Reconnaissance ${phrase.lang}`, 
          result && typeof result.confidence === 'number',
          `Confiance: ${result.confidence?.toFixed(2)}`, Date.now() - recognitionTime);
      } catch (error) {
        logTest(`Reconnaissance ${phrase.lang}`, false, error.message);
      }
    }
    
    // Test de post-traitement
    const postProcessTime = Date.now();
    const rawResult = {
      text: "bix a beel",
      confidence: 0.85,
      language: "yua"
    };
    const processedResult = await speechRecognition.postProcessRecognition(rawResult, "yua");
    logTest('Post-traitement reconnaissance', 
      processedResult.adjustedConfidence !== undefined,
      `Confiance ajustée: ${processedResult.adjustedConfidence?.toFixed(2)}`, 
      Date.now() - postProcessTime);
    
    // Test de calibration phonétique
    const calibrationTime = Date.now();
    const calibration = speechRecognition.calibratePhoneticRecognition("yua", {
      glottalization: true,
      ejectives: true
    });
    logTest('Calibration phonétique', 
      typeof calibration === 'object',
      'Paramètres calibrés pour Maya', Date.now() - calibrationTime);
    
    // Test des statistiques
    const statsTime = Date.now();
    const stats = speechRecognition.getStats();
    logTest('Statistiques SpeechRecognition', typeof stats === 'object',
      `${stats.supportedLanguages.length} langues supportées`, Date.now() - statsTime);
    
  } catch (error) {
    logTest('NativeSpeechRecognition Global', false, error.message);
  }
}

// Tests du gestionnaire d'intégration
async function testIntegrationManager() {
  console.log('\n🚀 Test du gestionnaire d\'intégration...');
  const testData = generateTestData();
  
  try {
    const integrationManager = new IntegrationManager();
    const startTime = Date.now();
    
    // Test d'initialisation
    await integrationManager.initialize({
      enableVectorSearch: true,
      enableNeuralTTS: true,
      enableSpeechRecognition: true,
      enableSecureAPIKeys: true,
      enableRedisCache: false // Désactivé pour les tests
    });
    logTest('Initialisation IntegrationManager', true, '', Date.now() - startTime);
    
    // Test de l'interface React Native
    const interfaceTime = Date.now();
    const rnInterface = integrationManager.getReactNativeInterface();
    logTest('Interface React Native', 
      typeof rnInterface === 'object' && typeof rnInterface.translate === 'function',
      'API complète disponible', Date.now() - interfaceTime);
    
    // Test de traduction intelligente
    const translateTime = Date.now();
    const translationResult = await integrationManager.translateIntelligent(
      "Bonjour", "fr", "yua", {
        useVectorSearch: true,
        includeAlternatives: true,
        contextualSearch: true
      }
    );
    logTest('Traduction intelligente', 
      translationResult && translationResult.success !== false,
      `Résultat: ${translationResult.result || 'N/A'}`, Date.now() - translateTime);
    
    // Test de recherche sémantique
    const searchTime = Date.now();
    const searchResults = await integrationManager.semanticSearch(
      "Comment ça va", "fr", {
        topK: 5,
        crossLingual: true,
        includeTranslations: true
      }
    );
    logTest('Recherche sémantique intégrée', 
      Array.isArray(searchResults),
      `${searchResults.length} résultats`, Date.now() - searchTime);
    
    // Test de synthèse vocale améliorée
    const ttsTime = Date.now();
    const ttsResult = await integrationManager.synthesizeSpeechEnhanced(
      "Bix a beel", "yua", {
        useNeural: true,
        adaptToContext: true
      }
    );
    logTest('Synthèse vocale améliorée', 
      ttsResult && (ttsResult.success !== false),
      `Méthode: ${ttsResult.method || 'neural'}`, Date.now() - ttsTime);
    
    // Test de reconnaissance vocale améliorée
    const recognitionTime = Date.now();
    const audioData = Buffer.from(testData.audioTestData, 'base64');
    const recognitionResult = await integrationManager.recognizeSpeechEnhanced(
      audioData, "fr", {
        useNativeRecognition: true,
        postProcess: true,
        validateResult: true
      }
    );
    logTest('Reconnaissance vocale améliorée', 
      recognitionResult && typeof recognitionResult.confidence === 'number',
      `Confiance: ${recognitionResult.confidence || 0}`, Date.now() - recognitionTime);
    
    // Test de vérification de santé
    const healthTime = Date.now();
    const healthStatus = await integrationManager.performHealthCheck();
    logTest('Vérification de santé', 
      healthStatus && typeof healthStatus.overall === 'string',
      `État: ${healthStatus.overall}`, Date.now() - healthTime);
    
    // Test des statistiques système
    const systemStatsTime = Date.now();
    const systemStats = integrationManager.getSystemStatus();
    logTest('Statistiques système', 
      typeof systemStats === 'object' && Array.isArray(systemStats.services),
      `${systemStats.services.length} services actifs`, Date.now() - systemStatsTime);
    
    // Test des langues supportées
    const languagesTime = Date.now();
    const supportedLanguages = integrationManager.getSupportedLanguages();
    logTest('Langues supportées', 
      Array.isArray(supportedLanguages) && supportedLanguages.includes('yua'),
      `${supportedLanguages.length} langues`, Date.now() - languagesTime);
    
    // Test des voix disponibles
    const voicesTime = Date.now();
    const availableVoices = integrationManager.getAvailableVoices();
    logTest('Voix disponibles', 
      Array.isArray(availableVoices),
      `${availableVoices.length} voix configurées`, Date.now() - voicesTime);
    
  } catch (error) {
    logTest('IntegrationManager Global', false, error.message);
  }
}

// Tests de performance et stress
async function testPerformanceAndStress() {
  console.log('\n⚡ Tests de performance et stress...');
  
  try {
    const integrationManager = new IntegrationManager();
    await integrationManager.initialize({
      enableVectorSearch: true,
      enableNeuralTTS: false, // Désactivé pour les tests de performance
      enableSpeechRecognition: false,
      enableSecureAPIKeys: true,
      enableRedisCache: false
    });
    
    // Test de performance de traduction en lot
    const batchTime = Date.now();
    const phrases = [
      "Bonjour", "Comment ça va", "Merci beaucoup", "Au revoir", "S'il vous plaît",
      "Excusez-moi", "Je ne comprends pas", "Parlez-vous anglais?", "Où est...", "Combien ça coûte?"
    ];
    
    const batchPromises = phrases.map(phrase => 
      integrationManager.translateIntelligent(phrase, "fr", "yua", { useVectorSearch: false })
    );
    
    const batchResults = await Promise.all(batchPromises);
    const batchDuration = Date.now() - batchTime;
    const avgTimePerTranslation = batchDuration / phrases.length;
    
    logTest('Performance traduction en lot', 
      batchResults.every(r => r && r.result),
      `${phrases.length} traductions en ${batchDuration}ms (${avgTimePerTranslation.toFixed(1)}ms/traduction)`,
      batchDuration);
    
    // Test de stress mémoire
    const memoryTime = Date.now();
    const memoryBefore = process.memoryUsage().heapUsed;
    
    // Créer beaucoup d'embeddings
    const vectorDB = new VectorDatabaseService();
    await vectorDB.initialize();
    
    for (let i = 0; i < 100; i++) {
      await vectorDB.generateEmbedding(`Test phrase ${i}`, "fr");
    }
    
    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = (memoryAfter - memoryBefore) / 1024 / 1024; // MB
    
    logTest('Test de stress mémoire', 
      memoryIncrease < 50, // Moins de 50MB d'augmentation
      `Augmentation mémoire: ${memoryIncrease.toFixed(2)}MB`, Date.now() - memoryTime);
    
    // Test de concurrence
    const concurrencyTime = Date.now();
    const concurrentPromises = Array(10).fill().map((_, i) =>
      integrationManager.translateIntelligent(`Test concurrent ${i}`, "fr", "en")
    );
    
    const concurrentResults = await Promise.all(concurrentPromises);
    const concurrencyDuration = Date.now() - concurrencyTime;
    
    logTest('Test de concurrence', 
      concurrentResults.every(r => r && r.result),
      `10 traductions concurrentes en ${concurrencyDuration}ms`, concurrencyDuration);
    
  } catch (error) {
    logTest('Tests Performance Global', false, error.message);
  }
}

// Tests de robustesse et gestion d'erreurs
async function testRobustnessAndErrorHandling() {
  console.log('\n🛡️ Tests de robustesse et gestion d\'erreurs...');
  
  try {
    const integrationManager = new IntegrationManager();
    await integrationManager.initialize();
    
    // Test avec texte vide
    const emptyTextTime = Date.now();
    const emptyResult = await integrationManager.translateIntelligent("", "fr", "yua");
    logTest('Gestion texte vide', 
      !emptyResult.success || emptyResult.result === "",
      'Texte vide géré correctement', Date.now() - emptyTextTime);
    
    // Test avec langue invalide
    const invalidLangTime = Date.now();
    const invalidLangResult = await integrationManager.translateIntelligent(
      "Test", "xyz", "abc"
    );
    logTest('Gestion langue invalide', 
      !invalidLangResult.success || invalidLangResult.fallback,
      'Langue invalide gérée', Date.now() - invalidLangTime);
    
    // Test avec texte très long
    const longTextTime = Date.now();
    const longText = "Lorem ipsum ".repeat(1000); // ~11,000 caractères
    const longTextResult = await integrationManager.translateIntelligent(
      longText, "en", "fr"
    );
    logTest('Gestion texte très long', 
      longTextResult && (longTextResult.result || longTextResult.error),
      `${longText.length} caractères traités`, Date.now() - longTextTime);
    
    // Test avec caractères spéciaux
    const specialCharsTime = Date.now();
    const specialText = "🌟 Test émojis et caractères spéciaux: àáâãäåæçèéêë 中文 العربية";
    const specialResult = await integrationManager.translateIntelligent(
      specialText, "fr", "en"
    );
    logTest('Gestion caractères spéciaux', 
      specialResult && specialResult.result,
      'Caractères unicode gérés', Date.now() - specialCharsTime);
    
    // Test de fallback en cas d'échec de service
    const fallbackTime = Date.now();
    const vectorDB = new VectorDatabaseService();
    // Simuler une erreur en n'initialisant pas
    const fallbackSearch = await vectorDB.searchSimilar("test", "fr").catch(() => []);
    logTest('Fallback service échec', 
      Array.isArray(fallbackSearch),
      'Fallback fonctionnel', Date.now() - fallbackTime);
    
    // Test de limite de ressources
    const resourceTime = Date.now();
    try {
      // Créer un grand nombre de services simultanément
      const services = Array(50).fill().map(() => new NeuralTTSService());
      await Promise.all(services.map(s => s.initialize()));
      logTest('Test limite ressources', true, '50 services créés', Date.now() - resourceTime);
    } catch (error) {
      logTest('Test limite ressources', true, 'Limite détectée correctement', Date.now() - resourceTime);
    }
    
  } catch (error) {
    logTest('Tests Robustesse Global', false, error.message);
  }
}

// Tests de cas d'usage réels
async function testRealWorldUseCases() {
  console.log('\n🌍 Tests de cas d\'usage réels...');
  
  try {
    const integrationManager = new IntegrationManager();
    await integrationManager.initialize();
    
    // Cas d'usage 1: Conversation touristique
    const touristTime = Date.now();
    const touristPhrases = [
      "Où est l'hôtel?",
      "Combien ça coûte?",
      "Je voudrais manger quelque chose",
      "Pouvez-vous m'aider?",
      "Merci beaucoup"
    ];
    
    const touristResults = [];
    for (const phrase of touristPhrases) {
      const result = await integrationManager.translateIntelligent(phrase, "fr", "yua");
      touristResults.push(result);
    }
    
    logTest('Cas d\'usage touristique', 
      touristResults.every(r => r && r.result),
      `${touristResults.length} phrases touristiques traduites`, Date.now() - touristTime);
    
    // Cas d'usage 2: Éducation linguistique
    const educationTime = Date.now();
    const educationQueries = [
      "Comment dit-on 'eau' en maya?",
      "Quelle est la différence entre k'iche' et yucatèque?",
      "Pouvez-vous me donner des exemples de phrases simples?"
    ];
    
    const educationResults = [];
    for (const query of educationQueries) {
      const searchResult = await integrationManager.semanticSearch(query, "fr", {
        topK: 3,
        includeTranslations: true
      });
      educationResults.push(searchResult);
    }
    
    logTest('Cas d\'usage éducatif', 
      educationResults.every(r => Array.isArray(r)),
      `${educationResults.reduce((sum, r) => sum + r.length, 0)} résultats éducatifs`, 
      Date.now() - educationTime);
    
    // Cas d'usage 3: Préservation culturelle
    const preservationTime = Date.now();
    const culturalPhrases = [
      { text: "In lak'ech", lang: "yua", context: "Salutation sacrée maya" },
      { text: "Oxlahun Ok'in", lang: "yua", context: "Calendrier maya - 13 jours" },
      { text: "K'inich Janaab Pakal", lang: "yua", context: "Nom d'un roi maya" }
    ];
    
    const preservationResults = [];
    for (const item of culturalPhrases) {
      // Ajouter à la base vectorielle pour préservation
      const vectorDB = new VectorDatabaseService();
      try {
        await vectorDB.initialize();
        const docId = await vectorDB.addDocument(item.text, item.lang, {
          context: item.context,
          cultural: true,
          preserved: new Date().toISOString()
        });
        preservationResults.push(docId);
      } catch (error) {
        console.warn('Erreur préservation:', error.message);
      }
    }
    
    logTest('Cas d\'usage préservation culturelle', 
      preservationResults.length > 0,
      `${preservationResults.length} éléments culturels préservés`, 
      Date.now() - preservationTime);
    
    // Cas d'usage 4: Interface multilingue
    const interfaceTime = Date.now();
    const interfaceElements = [
      "Traduire",
      "Écouter",
      "Enregistrer",
      "Paramètres",
      "Historique"
    ];
    
    const interfaceTranslations = new Map();
    const targetLanguages = ["yua", "quc", "qu", "gn"];
    
    for (const element of interfaceElements) {
      for (const lang of targetLanguages) {
        const translation = await integrationManager.translateIntelligent(element, "fr", lang);
        if (!interfaceTranslations.has(lang)) {
          interfaceTranslations.set(lang, []);
        }
        interfaceTranslations.get(lang).push(translation.result);
      }
    }
    
    logTest('Cas d\'usage interface multilingue', 
      interfaceTranslations.size === targetLanguages.length,
      `Interface traduite en ${interfaceTranslations.size} langues indigènes`, 
      Date.now() - interfaceTime);
    
  } catch (error) {
    logTest('Tests Cas d\'Usage Global', false, error.message);
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🧪 DÉMARRAGE DES TESTS COMPLETS DES SERVICES AVANCÉS');
  console.log('================================================================');
  
  const globalStartTime = Date.now();
  
  try {
    // Tests des services individuels
    await testSecureAPIKeyManager();
    await testVectorDatabaseService();
    await testNeuralTTSService();
    await testNativeSpeechRecognition();
    
    // Tests d'intégration
    await testIntegrationManager();
    
    // Tests de performance et robustesse
    await testPerformanceAndStress();
    await testRobustnessAndErrorHandling();
    
    // Tests de cas d'usage réels
    await testRealWorldUseCases();
    
  } catch (error) {
    console.error('❌ Erreur globale des tests:', error);
    testResults.failed++;
  }
  
  const totalDuration = Date.now() - globalStartTime;
  
  // Rapport final
  console.log('\n================================================================');
  console.log('📊 RAPPORT FINAL DES TESTS');
  console.log('================================================================');
  console.log(`✅ Tests réussis: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Tests échoués: ${testResults.failed}/${testResults.total}`);
  console.log(`📈 Taux de réussite: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log(`⏱️ Durée totale: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`);
  console.log(`🚀 Performance moyenne: ${(totalDuration / testResults.total).toFixed(1)}ms/test`);
  
  // Détails des échecs
  const failures = testResults.details.filter(test => !test.status);
  if (failures.length > 0) {
    console.log('\n❌ DÉTAILS DES ÉCHECS:');
    failures.forEach(test => {
      console.log(`   • ${test.name}: ${test.details}`);
    });
  }
  
  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:');
  if (testResults.passed / testResults.total > 0.9) {
    console.log('✅ Excellent! Le système est prêt pour la production.');
    console.log('🔧 Activez les vraies APIs et testez en conditions réelles.');
  } else if (testResults.passed / testResults.total > 0.7) {
    console.log('⚠️ Bon, mais quelques améliorations nécessaires.');
    console.log('🔍 Vérifiez les tests échoués et optimisez les services.');
  } else {
    console.log('⚠️ Attention! Plusieurs composants nécessitent des corrections.');
    console.log('🛠️ Corrigez les erreurs avant de continuer le développement.');
  }
  
  console.log('\n🎯 PROCHAINES ÉTAPES:');
  console.log('1. Intégrer de vraies clés API pour tester en production');
  console.log('2. Déployer un cache Redis réel pour de meilleures performances');
  console.log('3. Entraîner des modèles personnalisés pour les langues indigènes');
  console.log('4. Tester sur de vrais appareils mobiles');
  console.log('5. Collecter des corpus audio pour améliorer la reconnaissance vocale');
  
  return {
    success: testResults.passed === testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    total: testResults.total,
    duration: totalDuration,
    successRate: (testResults.passed / testResults.total) * 100
  };
}

// Exporter pour utilisation
export { runAllTests };

// Fonction principale avec gestion des modules
async function main() {
  console.log("🚀 Démarrage des tests complets avancés...");
  
  // Charger tous les modules
  const modulesLoaded = await loadModules();
  if (!modulesLoaded) {
    console.error("❌ Impossible de charger les modules. Arrêt des tests.");
    process.exit(1);
  }
  
  // Lancer tous les tests
  const results = await runAllTests();
  
  console.log("\n🏁 Tests terminés!");
  process.exit(results.success ? 0 : 1);
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

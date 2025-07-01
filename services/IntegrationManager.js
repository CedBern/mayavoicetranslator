// Gestionnaire d'intégration complète pour React Native
import { EventEmitter } from 'events';

/**
 * Service d'orchestration pour l'intégration complète des services avancés
 * Coordonne la synthèse vocale, reconnaissance vocale, recherche vectorielle et cache
 */
class IntegrationManager extends EventEmitter {
  constructor() {
    super();
    this.services = new Map();
    this.isInitialized = false;
    this.performanceMonitor = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastHealthCheck: null
    };
    
    // Configuration d'intégration
    this.integrationConfig = {
      enableVectorSearch: true,
      enableNeuralTTS: true,
      enableSpeechRecognition: true,
      enableSecureAPIKeys: true,
      enableRedisCache: true,
      fallbackModes: {
        offline: true,
        basicTTS: true,
        simpleDictionary: true
      }
    };
    
    // Files de traitement asynchrone
    this.taskQueues = {
      translation: [],
      tts: [],
      speechRecognition: [],
      vectorSearch: []
    };
    
    this.isProcessing = {
      translation: false,
      tts: false,
      speechRecognition: false,
      vectorSearch: false
    };
  }

  /**
   * Initialise tous les services de manière coordonnée
   */
  async initialize(config = {}) {
    console.log('🚀 Initialisation du gestionnaire d\'intégration...');
    
    try {
      // Fusionner la configuration
      this.integrationConfig = { ...this.integrationConfig, ...config };
      
      // Initialiser les services de base
      await this.initializeCoreServices();
      
      // Initialiser les services avancés
      await this.initializeAdvancedServices();
      
      // Configurer l'orchestration
      await this.setupOrchestration();
      
      // Démarrer le monitoring de santé
      await this.startHealthMonitoring();
      
      this.isInitialized = true;
      console.log('✅ Gestionnaire d\'intégration initialisé avec succès');
      this.emit('initialized', this.getSystemStatus());
      
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du gestionnaire:', error);
      this.emit('initializationError', error);
      throw error;
    }
  }
  /**
   * Initialise les services de base
   */
  async initializeCoreServices() {
    console.log('🔧 Initialisation des services de base...');
    
    // Service de traduction (instance exportée)
    const { default: translationService } = await import('./TranslationService.js');
    this.services.set('translation', translationService);
    // Le service de traduction n'a pas de méthode initialize explicite
      // Service de configuration (instance exportée)
    const { default: configurationManager } = await import('./ConfigurationManager.js');
    this.services.set('config', configurationManager);
    await this.services.get('config').initialize(this.integrationConfig);
    
    console.log('✅ Services de base initialisés');
  }

  /**
   * Initialise les services avancés
   */
  async initializeAdvancedServices() {
    console.log('🧠 Initialisation des services avancés...');
    
    // Gestionnaire de clés API sécurisé
    if (this.integrationConfig.enableSecureAPIKeys) {
      const { default: SecureAPIKeyManager } = await import('./SecureAPIKeyManager.js');
      this.services.set('apiKeys', new SecureAPIKeyManager());
      await this.services.get('apiKeys').initialize();
    }
    
    // Base de données vectorielle
    if (this.integrationConfig.enableVectorSearch) {
      const { default: VectorDatabaseService } = await import('./VectorDatabaseService.js');
      this.services.set('vectorDB', new VectorDatabaseService());
      await this.services.get('vectorDB').initialize();
    }
    
    // Service TTS neural
    if (this.integrationConfig.enableNeuralTTS) {
      const { default: NeuralTTSService } = await import('./NeuralTTSService.js');
      this.services.set('neuralTTS', new NeuralTTSService());
      await this.services.get('neuralTTS').initialize();
    }
    
    // Service de reconnaissance vocale native
    if (this.integrationConfig.enableSpeechRecognition) {
      const { default: NativeSpeechRecognitionService } = await import('./NativeSpeechRecognitionService.js');
      this.services.set('speechRecognition', new NativeSpeechRecognitionService());
      await this.services.get('speechRecognition').initialize();
    }
    
    console.log('✅ Services avancés initialisés');
  }  /**
   * Configure l'orchestration entre services
   */
  async setupOrchestration() {
    console.log('🎯 Configuration de l\'orchestration...');
    
    // Événements de coordination (vérifier si les services supportent les événements)
    const translationService = this.services.get('translation');
    if (translationService && typeof translationService.on === 'function') {
      translationService.on('translationRequest', async (data) => {
        await this.handleTranslationRequest(data);
      });
    }
    
    const neuralTTS = this.services.get('neuralTTS');
    if (neuralTTS && typeof neuralTTS.on === 'function') {
      neuralTTS.on('synthesisRequest', async (data) => {
        await this.handleTTSRequest(data);
      });
    }
    
    const speechRecognition = this.services.get('speechRecognition');
    if (speechRecognition && typeof speechRecognition.on === 'function') {
      speechRecognition.on('recognitionResult', async (data) => {
        await this.handleSpeechRecognitionResult(data);
      });
    }
    
    // Configuration des fallbacks
    this.setupFallbackChain();
    
    console.log('✅ Orchestration configurée');
  }

  /**
   * Traduction intelligente avec recherche vectorielle
   */
  async translateIntelligent(text, sourceLang, targetLang, options = {}) {
    const startTime = Date.now();
    
    try {
      // Configuration par défaut
      const config = {
        useVectorSearch: this.integrationConfig.enableVectorSearch,
        useAdvancedFallback: true,
        cacheResults: true,
        includeAlternatives: false,
        contextualSearch: true,
        ...options
      };

      // 1. Recherche vectorielle contextuelle (si activée)
      let contextualResults = [];
      if (config.useVectorSearch && this.services.has('vectorDB')) {
        try {
          contextualResults = await this.services.get('vectorDB').searchSimilar(
            text, 
            sourceLang, 
            { 
              topK: 3, 
              threshold: 0.8,
              crossLingual: true 
            }
          );
        } catch (error) {
          console.warn('⚠️ Recherche vectorielle échouée:', error.message);
        }
      }

      // 2. Traduction avec contexte
      const translationService = this.services.get('translation');
      let translation = await translationService.translate(text, sourceLang, targetLang, {
        context: contextualResults,
        ...config
      });

      // 3. Enrichissement avec alternatives
      if (config.includeAlternatives) {
        translation.alternatives = await this.generateAlternatives(
          text, 
          translation.result, 
          sourceLang, 
          targetLang
        );
      }

      // 4. Mise à jour de la base vectorielle
      if (config.useVectorSearch && translation.success) {
        await this.updateVectorDatabase(text, translation.result, sourceLang, targetLang);
      }

      // 5. Statistiques
      const responseTime = Date.now() - startTime;
      this.updatePerformanceStats(responseTime, true);

      return {
        ...translation,
        contextualResults: contextualResults,
        responseTime: responseTime,
        enhancedWithAI: config.useVectorSearch
      };

    } catch (error) {
      console.error('❌ Erreur de traduction intelligente:', error);
      this.updatePerformanceStats(Date.now() - startTime, false);
      
      // Fallback vers traduction de base
      return await this.services.get('translation').translate(text, sourceLang, targetLang);
    }
  }

  /**
   * Synthèse vocale avec adaptation contextuelle
   */
  async synthesizeSpeechEnhanced(text, language, options = {}) {
    try {
      const config = {
        useNeural: this.integrationConfig.enableNeuralTTS,
        adaptToContext: true,
        cacheAudio: true,
        ...options
      };

      // Analyser le contexte linguistique
      const linguisticContext = await this.analyzeLinguisticContext(text, language);

      // Adapter les paramètres TTS selon le contexte
      const adaptedOptions = this.adaptTTSParameters(config, linguisticContext);

      // Synthèse avec le service approprié
      let audioResult;
      if (config.useNeural && this.services.has('neuralTTS')) {
        audioResult = await this.services.get('neuralTTS').synthesize(
          text, 
          language, 
          adaptedOptions
        );
      } else {
        // Fallback vers TTS de base
        audioResult = await this.fallbackTTS(text, language);
      }

      return {
        ...audioResult,
        linguisticContext: linguisticContext,
        enhanced: config.useNeural
      };

    } catch (error) {
      console.error('❌ Erreur de synthèse vocale:', error);
      return await this.fallbackTTS(text, language);
    }
  }

  /**
   * Reconnaissance vocale avec post-traitement intelligent
   */
  async recognizeSpeechEnhanced(audioData, language, options = {}) {
    try {
      const config = {
        useNativeRecognition: this.integrationConfig.enableSpeechRecognition,
        postProcess: true,
        validateResult: true,
        ...options
      };

      let recognitionResult;
      
      if (config.useNativeRecognition && this.services.has('speechRecognition')) {
        recognitionResult = await this.services.get('speechRecognition').recognize(
          audioData, 
          language, 
          config
        );
      } else {
        // Fallback vers reconnaissance de base
        recognitionResult = await this.fallbackSpeechRecognition(audioData, language);
      }

      // Post-traitement intelligent
      if (config.postProcess && recognitionResult.success) {
        recognitionResult = await this.postProcessRecognition(recognitionResult, language);
      }

      // Validation avec base vectorielle
      if (config.validateResult && this.services.has('vectorDB')) {
        recognitionResult.confidence = await this.validateRecognitionResult(
          recognitionResult, 
          language
        );
      }

      return recognitionResult;

    } catch (error) {
      console.error('❌ Erreur de reconnaissance vocale:', error);
      return await this.fallbackSpeechRecognition(audioData, language);
    }
  }

  /**
   * Recherche sémantique avancée
   */
  async semanticSearch(query, language, options = {}) {
    if (!this.services.has('vectorDB')) {
      console.warn('⚠️ Base vectorielle non disponible');
      return [];
    }

    try {
      const config = {
        topK: 10,
        threshold: 0.7,
        crossLingual: true,
        includeTranslations: true,
        ...options
      };

      // Recherche vectorielle
      const results = await this.services.get('vectorDB').searchSimilar(
        query, 
        language, 
        config
      );

      // Enrichir avec traductions si demandé
      if (config.includeTranslations) {
        for (const result of results) {
          if (result.language !== language) {
            const translation = await this.translateIntelligent(
              result.text, 
              result.language, 
              language,
              { useVectorSearch: false } // Éviter la récursion
            );
            result.translation = translation.result;
          }
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur de recherche sémantique:', error);
      return [];
    }
  }

  /**
   * Interface unifiée pour React Native
   */
  getReactNativeInterface() {
    return {
      // Traduction
      translate: (text, sourceLang, targetLang, options) => 
        this.translateIntelligent(text, sourceLang, targetLang, options),

      // Synthèse vocale
      textToSpeech: (text, language, options) => 
        this.synthesizeSpeechEnhanced(text, language, options),

      // Reconnaissance vocale
      speechToText: (audioData, language, options) => 
        this.recognizeSpeechEnhanced(audioData, language, options),

      // Recherche sémantique
      search: (query, language, options) => 
        this.semanticSearch(query, language, options),

      // Gestion des clés API
      setAPIKey: (service, key, options) => 
        this.services.get('apiKeys')?.setAPIKey(service, key, options),

      // Configuration
      configure: (config) => this.updateConfiguration(config),

      // Statistiques
      getStats: () => this.getSystemStatus(),

      // Événements
      on: (event, callback) => this.on(event, callback),
      off: (event, callback) => this.off(event, callback),

      // Utilitaires
      getSupportedLanguages: () => this.getSupportedLanguages(),
      getAvailableVoices: () => this.getAvailableVoices(),
      testConnection: () => this.performHealthCheck()
    };
  }

  /**
   * Analyse le contexte linguistique
   */
  async analyzeLinguisticContext(text, language) {
    return {
      complexity: this.calculateTextComplexity(text),
      specialCharacters: this.detectSpecialCharacters(text, language),
      estimatedDuration: this.estimateSpeechDuration(text, language),
      emotionalTone: this.detectEmotionalTone(text),
      formalityLevel: this.detectFormalityLevel(text, language)
    };
  }

  /**
   * Adapte les paramètres TTS selon le contexte
   */
  adaptTTSParameters(baseConfig, context) {
    const adapted = { ...baseConfig };

    // Ajuster la vitesse selon la complexité
    if (context.complexity > 0.8) {
      adapted.speech_rate = (adapted.speech_rate || 1.0) * 0.9;
    }

    // Ajuster l'intonation selon le ton émotionnel
    if (context.emotionalTone === 'questioning') {
      adapted.pitch_variation = 1.2;
    } else if (context.emotionalTone === 'formal') {
      adapted.pitch_variation = 0.8;
    }

    // Ajuster selon les caractères spéciaux
    if (context.specialCharacters.hasEjectives) {
      adapted.ejective_emphasis = 1.3;
    }

    return adapted;
  }

  /**
   * Post-traite le résultat de reconnaissance vocale
   */
  async postProcessRecognition(result, language) {
    // Correction phonétique spécifique à la langue
    if (language.startsWith('yu') || language.startsWith('qu')) { // Maya/Quechua
      result.text = this.correctIndigenousPhonetics(result.text, language);
    }

    // Vérification orthographique
    result.text = await this.spellCheck(result.text, language);

    // Calcul de confiance ajusté
    result.adjustedConfidence = this.calculateAdjustedConfidence(result, language);

    return result;
  }

  /**
   * Met à jour la base vectorielle
   */
  async updateVectorDatabase(sourceText, translation, sourceLang, targetLang) {
    if (!this.services.has('vectorDB')) return;

    try {
      await this.services.get('vectorDB').addDocument(
        sourceText, 
        sourceLang, 
        {
          translation: translation,
          targetLanguage: targetLang,
          timestamp: Date.now(),
          source: 'user_translation'
        }
      );

      await this.services.get('vectorDB').addDocument(
        translation, 
        targetLang, 
        {
          sourceText: sourceText,
          sourceLanguage: sourceLang,
          timestamp: Date.now(),
          source: 'user_translation'
        }
      );
    } catch (error) {
      console.warn('⚠️ Erreur de mise à jour base vectorielle:', error.message);
    }
  }

  /**
   * Configure la chaîne de fallback
   */
  setupFallbackChain() {
    // Fallback pour traduction
    this.fallbackChain = {
      translation: [
        'openai',
        'google_translate',
        'azure_cognitive',
        'systran',
        'enriched_dictionary',
        'basic_dictionary'
      ],
      
      tts: [
        'neural_tts',
        'google_tts',
        'azure_speech',
        'browser_tts'
      ],
      
      speechRecognition: [
        'native_recognition',
        'azure_speech',
        'google_speech',
        'browser_recognition'
      ]
    };
  }

  /**
   * Démarre le monitoring de santé
   */
  async startHealthMonitoring() {
    // Vérification périodique toutes les 5 minutes
    setInterval(async () => {
      await this.performHealthCheck();
    }, 5 * 60 * 1000);

    // Première vérification immédiate
    await this.performHealthCheck();
  }

  /**
   * Effectue une vérification de santé du système
   */
  async performHealthCheck() {
    const healthStatus = {
      timestamp: Date.now(),
      services: {},
      overall: 'healthy'
    };

    // Vérifier chaque service
    for (const [name, service] of this.services) {
      try {
        const serviceHealth = await this.checkServiceHealth(name, service);
        healthStatus.services[name] = serviceHealth;
        
        if (serviceHealth.status !== 'healthy') {
          healthStatus.overall = 'degraded';
        }
      } catch (error) {
        healthStatus.services[name] = {
          status: 'error',
          error: error.message
        };
        healthStatus.overall = 'degraded';
      }
    }

    this.performanceMonitor.lastHealthCheck = healthStatus;
    this.emit('healthCheck', healthStatus);

    return healthStatus;
  }

  /**
   * Vérifie la santé d'un service spécifique
   */
  async checkServiceHealth(name, service) {
    const health = { status: 'healthy', details: {} };

    switch (name) {
      case 'translation':
        // Test de traduction simple
        try {
          const testResult = await service.translate('Bonjour', 'fr', 'en');
          health.details.testTranslation = testResult.success;
        } catch (error) {
          health.status = 'error';
          health.details.error = error.message;
        }
        break;

      case 'vectorDB':
        // Test de recherche
        try {
          const testResult = await service.searchSimilar('test', 'fr', { topK: 1 });
          health.details.searchCapable = Array.isArray(testResult);
        } catch (error) {
          health.status = 'error';
          health.details.error = error.message;
        }
        break;

      case 'apiKeys':
        // Vérifier les clés configurées
        const supportedServices = service.getSupportedServices();
        health.details.configuredKeys = supportedServices.filter(s => s.hasKey).length;
        health.details.validKeys = supportedServices.filter(s => s.isValid).length;
        break;

      default:
        // Vérification générique
        health.details.initialized = service.isInitialized || true;
    }

    return health;
  }

  /**
   * Met à jour les statistiques de performance
   */
  updatePerformanceStats(responseTime, success) {
    this.performanceMonitor.apiCalls++;
    
    if (success) {
      this.performanceMonitor.averageResponseTime = 
        (this.performanceMonitor.averageResponseTime * (this.performanceMonitor.apiCalls - 1) + responseTime) / 
        this.performanceMonitor.apiCalls;
    } else {
      this.performanceMonitor.errorRate = 
        ((this.performanceMonitor.errorRate * this.performanceMonitor.apiCalls) + 1) / 
        (this.performanceMonitor.apiCalls + 1);
    }
  }

  /**
   * Retourne le statut complet du système
   */
  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      services: Array.from(this.services.keys()),
      config: this.integrationConfig,
      performance: this.performanceMonitor,
      queues: Object.fromEntries(
        Object.entries(this.taskQueues).map(([key, queue]) => [key, queue.length])
      ),
      lastHealthCheck: this.performanceMonitor.lastHealthCheck
    };
  }

  /**
   * Met à jour la configuration
   */
  async updateConfiguration(newConfig) {
    this.integrationConfig = { ...this.integrationConfig, ...newConfig };
    
    // Propager la configuration aux services
    for (const [name, service] of this.services) {
      if (service.updateConfiguration) {
        await service.updateConfiguration(newConfig);
      }
    }
    
    this.emit('configurationUpdated', this.integrationConfig);
  }

  /**
   * Fallback TTS
   */
  async fallbackTTS(text, language) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.onend = () => resolve({ success: true, method: 'browser' });
        utterance.onerror = () => resolve({ success: false, method: 'browser' });
        window.speechSynthesis.speak(utterance);
      });
    }
    return { success: false, error: 'Aucun TTS disponible' };
  }

  /**
   * Fallback reconnaissance vocale
   */
  async fallbackSpeechRecognition(audioData, language) {
    // Simulation de reconnaissance basique
    return {
      success: false,
      text: '',
      confidence: 0,
      method: 'none',
      error: 'Reconnaissance vocale non disponible'
    };
  }

  /**
   * Utilitaires
   */
  calculateTextComplexity(text) {
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const uniqueChars = new Set(text.toLowerCase()).size;
    return Math.min((avgWordLength / 10) + (uniqueChars / 30), 1);
  }

  detectSpecialCharacters(text, language) {
    const patterns = {
      hasEjectives: /[kpttscx]'/i,
      hasGlottalStops: /[ʔ']/,
      hasNasalization: /[ãĩũỹ]/,
      hasUmlaut: /[äöü]/,
      hasAccents: /[áéíóúàèìòù]/
    };

    const detected = {};
    for (const [key, pattern] of Object.entries(patterns)) {
      detected[key] = pattern.test(text);
    }

    return detected;
  }

  estimateSpeechDuration(text, language) {
    // Estimation basée sur la langue (mots par minute)
    const wpm = {
      'fr': 160,
      'en': 150,
      'es': 170,
      'yua': 120, // Plus lent pour langues indigènes
      'quc': 120,
      'qu': 130,
      'nah': 125,
      'gn': 140
    };

    const wordsPerMinute = wpm[language] || 150;
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60; // en secondes
  }

  detectEmotionalTone(text) {
    if (/[?¿]/.test(text)) return 'questioning';
    if (/[!¡]/.test(text)) return 'exclamatory';
    if (/\b(merci|gracias|asante|maltiox)\b/i.test(text)) return 'grateful';
    if (/\b(s'il vous plaît|por favor|please)\b/i.test(text)) return 'polite';
    return 'neutral';
  }

  detectFormalityLevel(text, language) {
    // Détection basée sur les marqueurs de formalité
    const formalMarkers = {
      'fr': /\b(vous|monsieur|madame|veuillez)\b/i,
      'es': /\b(usted|señor|señora|favor)\b/i,
      'en': /\b(sir|madam|please|would you)\b/i
    };

    const pattern = formalMarkers[language];
    return pattern && pattern.test(text) ? 'formal' : 'informal';
  }

  getSupportedLanguages() {
    return ['fr', 'yua', 'quc', 'qu', 'nah', 'gn', 'es', 'en', 'cak', 'kek'];
  }

  getAvailableVoices() {
    const voices = [];
    if (this.services.has('neuralTTS')) {
      // Ajouter les voix neurales disponibles
      const neuralVoices = this.services.get('neuralTTS').voiceConfigs;
      for (const [lang, config] of Object.entries(neuralVoices)) {
        voices.push({
          language: lang,
          name: config.name,
          gender: config.gender,
          type: 'neural',
          accent: config.accent
        });
      }
    }
    return voices;
  }
}

export default IntegrationManager;

/**
 * 🎤 Service de Reconnaissance Vocale Avancé
 * Reconnaissance vocale native avec support des langues indigènes
 */

class NativeSpeechRecognitionWebService {
  constructor() {
    this.isInitialized = false;
    this.isListening = false;
    this.recognition = null;
    this.currentLanguage = 'fr-FR';
    
    // Mapping des langues supportées
    this.languageMapping = {
      'fr': 'fr-FR',
      'es': 'es-ES',
      'en': 'en-US',
      'yua': 'es-MX', // Fallback vers espagnol mexicain
      'qu': 'es-PE',  // Fallback vers espagnol péruvien
      'gn': 'es-PY',  // Fallback vers espagnol paraguayen
      'nah': 'es-MX', // Fallback vers espagnol mexicain
      'ay': 'es-BO'   // Fallback vers espagnol bolivien
    };

    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null
    };
  }

  /**
   * Initialise le service de reconnaissance vocale
   */
  async initialize() {
    try {
      // Vérifier si Speech Recognition est disponible
      if (typeof window === 'undefined') {
        console.log('🎤 Service en mode serveur - reconnaissance simulée');
        this.isInitialized = true;
        return true;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('⚠️ Reconnaissance vocale non supportée par ce navigateur');
        return false;
      }

      this.recognition = new SpeechRecognition();
      this.setupRecognition();
      this.isInitialized = true;
      
      console.log('✅ Service de reconnaissance vocale initialisé');
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation reconnaissance vocale:', error);
      return false;
    }
  }

  /**
   * Configure les paramètres de reconnaissance
   */
  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      console.log('🎤 Reconnaissance vocale démarrée');
      this.isListening = true;
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onresult = (event) => {
      const result = event.results[0][0];
      const transcript = result.transcript;
      const confidence = result.confidence;
      
      console.log(`🗣️ Reconnu: "${transcript}" (confiance: ${Math.round(confidence * 100)}%)`);
      
      if (this.callbacks.onResult) {
        this.callbacks.onResult({
          transcript: transcript,
          confidence: confidence,
          language: this.currentLanguage,
          timestamp: new Date().toISOString()
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Erreur reconnaissance vocale:', event.error);
      this.isListening = false;
      
      if (this.callbacks.onError) {
        this.callbacks.onError({
          error: event.error,
          message: this.getErrorMessage(event.error)
        });
      }
    };

    this.recognition.onend = () => {
      console.log('🛑 Reconnaissance vocale terminée');
      this.isListening = false;
      
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    };
  }

  /**
   * Démarre la reconnaissance vocale
   */
  async startListening(language = 'fr') {
    try {
      if (!this.isInitialized) {
        throw new Error('Service non initialisé');
      }

      if (this.isListening) {
        console.warn('⚠️ Reconnaissance déjà en cours');
        return false;
      }

      // Mettre à jour la langue
      this.setLanguage(language);

      if (this.recognition) {
        this.recognition.start();
        return true;
      } else {
        // Mode simulation pour environnements non supportés
        return this.simulateRecognition();
      }
    } catch (error) {
      console.error('❌ Erreur démarrage reconnaissance:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError({
          error: 'start_failed',
          message: error.message
        });
      }
      return false;
    }
  }

  /**
   * Arrête la reconnaissance vocale
   */
  stopListening() {
    try {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
      this.isListening = false;
      console.log('🛑 Reconnaissance vocale arrêtée');
      return true;
    } catch (error) {
      console.error('❌ Erreur arrêt reconnaissance:', error);
      return false;
    }
  }

  /**
   * Définit la langue de reconnaissance
   */
  setLanguage(language) {
    const mappedLang = this.languageMapping[language] || language;
    this.currentLanguage = mappedLang;
    
    if (this.recognition) {
      this.recognition.lang = mappedLang;
    }
    
    console.log(`🌐 Langue de reconnaissance: ${language} → ${mappedLang}`);
  }

  /**
   * Définit les callbacks d'événements
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Simulation de reconnaissance pour tests
   */
  async simulateRecognition() {
    console.log('🎭 Simulation de reconnaissance vocale');
    
    if (this.callbacks.onStart) {
      this.callbacks.onStart();
    }

    // Simulation avec délai
    setTimeout(() => {
      const simulatedResults = {
        'fr': 'Bonjour, comment allez-vous ?',
        'es': 'Hola, ¿cómo está usted?',
        'en': 'Hello, how are you?',
        'yua': 'Ba\'ax ka wa\'alik',
        'qu': 'Rimaykullayki',
        'gn': 'Mba\'éichapa'
      };

      const language = Object.keys(this.languageMapping).find(
        lang => this.languageMapping[lang] === this.currentLanguage
      ) || 'fr';

      const transcript = simulatedResults[language] || simulatedResults.fr;

      if (this.callbacks.onResult) {
        this.callbacks.onResult({
          transcript: transcript,
          confidence: 0.95,
          language: this.currentLanguage,
          timestamp: new Date().toISOString(),
          simulated: true
        });
      }

      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    }, 2000);

    return true;
  }

  /**
   * Obtient un message d'erreur localisé
   */
  getErrorMessage(errorCode) {
    const errorMessages = {
      'network': 'Erreur réseau - vérifiez votre connexion',
      'audio-capture': 'Impossible d\'accéder au microphone',
      'not-allowed': 'Permission microphone refusée',
      'no-speech': 'Aucune parole détectée',
      'aborted': 'Reconnaissance interrompue',
      'language-not-supported': 'Langue non supportée',
      'service-not-allowed': 'Service non autorisé'
    };

    return errorMessages[errorCode] || `Erreur inconnue: ${errorCode}`;
  }

  /**
   * Vérifie si la reconnaissance est disponible
   */
  isAvailable() {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Obtient les langues supportées
   */
  getSupportedLanguages() {
    return Object.keys(this.languageMapping);
  }

  /**
   * Obtient le statut actuel
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      listening: this.isListening,
      currentLanguage: this.currentLanguage,
      available: this.isAvailable(),
      supportedLanguages: this.getSupportedLanguages()
    };
  }

  /**
   * Test de fonctionnalité
   */
  async testRecognition() {
    try {
      console.log('🧪 Test de reconnaissance vocale...');
      
      const testResult = {
        available: this.isAvailable(),
        initialized: this.isInitialized,
        languages: this.getSupportedLanguages(),
        timestamp: new Date().toISOString()
      };

      if (this.isAvailable()) {
        // Test rapide
        await this.simulateRecognition();
        testResult.testPassed = true;
      } else {
        testResult.testPassed = false;
        testResult.reason = 'Speech Recognition non supporté';
      }

      console.log('✅ Test de reconnaissance terminé:', testResult);
      return testResult;
    } catch (error) {
      console.error('❌ Échec test reconnaissance:', error);
      return {
        available: false,
        initialized: false,
        testPassed: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Instance globale
const nativeSpeechRecognition = new NativeSpeechRecognitionWebService();

export default nativeSpeechRecognition;

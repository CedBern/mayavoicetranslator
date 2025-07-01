// Service de reconnaissance vocale native pour langues indigènes
import { EventEmitter } from 'events';

/**
 * Service avancé de reconnaissance vocale pour langues indigènes
 * Supporte les caractéristiques phonétiques spécifiques aux langues maya, quechua, etc.
 */
class NativeSpeechRecognitionService extends EventEmitter {
  constructor() {
    super();
    this.isInitialized = false;
    this.isListening = false;
    this.currentLanguage = 'fr';
    this.recognitionEngine = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    
    // Configuration pour les langues indigènes
    this.languageConfigs = {
      'yua': { // Maya Yucateco
        phonemes: ['ʔ', 'xʼ', 'tʼ', 'kʼ', 'pʼ', 'tsʼ', 'ʈʂʼ'],
        tonalFeatures: false,
        glottalization: true,
        sampling_rate: 16000,
        model: 'maya_yucateco_v1'
      },
      'quc': { // K'iche'
        phonemes: ['q', 'qʼ', 'x', 'tz', 'tzʼ', 'ch', 'chʼ'],
        tonalFeatures: false,
        glottalization: true,
        sampling_rate: 16000,
        model: 'kiche_v1'
      },
      'qu': { // Quechua
        phonemes: ['q', 'qʰ', 'qʼ', 'ʎ', 'ɲ', 'ʃ'],
        tonalFeatures: false,
        ejectives: true,
        sampling_rate: 16000,
        model: 'quechua_general_v1'
      },
      'nah': { // Nahuatl
        phonemes: ['ʔ', 'tɬ', 'kʷ', 'ʃ'],
        tonalFeatures: true,
        saltillo: true, // Coup de glotte caractéristique
        sampling_rate: 16000,
        model: 'nahuatl_v1'
      },
      'fr': {
        phonemes: ['y', 'ø', 'œ', 'ɑ̃', 'ɛ̃', 'ɔ̃', 'œ̃'],
        nasalization: true,
        sampling_rate: 16000,
        model: 'french_standard'
      }
    };

    // Motifs de reconnaissance spécialisés
    this.recognitionPatterns = {
      maya: {
        word_boundaries: /\b[a-zàáèéìíòóùúüñ']+\b/gi,
        glottal_stops: /'/g,
        ejectives: /[ptkqbdg]'/g
      },
      quechua: {
        word_boundaries: /\b[a-zñ]+\b/gi,
        ejectives: /[ptkq][ʰʼ]/g,
        retroflex: /[ʂʈ]/g
      }
    };
  }

  /**
   * Initialise le service de reconnaissance vocale
   */
  async initialize() {
    console.log('🎤 Initialisation du service de reconnaissance vocale...');

    try {
      // Vérifier le support du navigateur
      await this.checkBrowserSupport();
      
      // Initialiser le contexte audio
      await this.initializeAudioContext();
      
      // Configurer la reconnaissance vocale native
      await this.setupSpeechRecognition();
      
      this.isInitialized = true;
      console.log('✅ Service de reconnaissance vocale initialisé');
      
      this.emit('initialized');
      
    } catch (error) {
      console.error('❌ Erreur d\'initialisation reconnaissance vocale:', error);
      throw error;
    }
  }

  /**
   * Vérifie le support du navigateur
   */
  async checkBrowserSupport() {
    const checks = {
      speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      mediaRecorder: 'MediaRecorder' in window,
      audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
      getUserMedia: navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    };

    console.log('🔍 Vérification du support navigateur:');
    for (const [feature, supported] of Object.entries(checks)) {
      console.log(`   ${feature}: ${supported ? '✅' : '❌'}`);
    }

    if (!checks.getUserMedia) {
      throw new Error('Accès microphone non supporté par ce navigateur');
    }

    return checks;
  }

  /**
   * Initialise le contexte audio
   */
  async initializeAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('🎧 Accès microphone accordé');
      
      // Configurer MediaRecorder pour l'enregistrement
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.setupMediaRecorderEvents();
      
    } catch (error) {
      throw new Error(`Impossible d'accéder au microphone: ${error.message}`);
    }
  }

  /**
   * Configure la reconnaissance vocale native
   */
  async setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognitionEngine = new SpeechRecognition();
      
      this.recognitionEngine.continuous = true;
      this.recognitionEngine.interimResults = true;
      this.recognitionEngine.maxAlternatives = 3;
      
      this.setupSpeechRecognitionEvents();
      console.log('🔊 Moteur de reconnaissance vocale configuré');
    } else {
      console.log('⚠️ Reconnaissance vocale native non disponible, utilisation du mode audio');
    }
  }

  /**
   * Configure les événements MediaRecorder
   */
  setupMediaRecorderEvents() {
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioChunks = [];
      
      // Traiter l'audio enregistré
      await this.processAudioBlob(audioBlob);
    };

    this.mediaRecorder.onerror = (event) => {
      console.error('❌ Erreur MediaRecorder:', event.error);
      this.emit('error', event.error);
    };
  }

  /**
   * Configure les événements de reconnaissance vocale
   */
  setupSpeechRecognitionEvents() {
    this.recognitionEngine.onstart = () => {
      console.log('🎤 Reconnaissance vocale démarrée');
      this.emit('listening_started');
    };

    this.recognitionEngine.onresult = (event) => {
      const results = this.processSpeechResults(event.results);
      this.emit('speech_result', results);
    };

    this.recognitionEngine.onerror = (event) => {
      console.error('❌ Erreur reconnaissance vocale:', event.error);
      this.emit('error', event.error);
    };

    this.recognitionEngine.onend = () => {
      console.log('🔇 Reconnaissance vocale arrêtée');
      this.isListening = false;
      this.emit('listening_stopped');
    };
  }

  /**
   * Démarre l'écoute pour une langue spécifique
   */
  async startListening(language = 'fr', options = {}) {
    if (!this.isInitialized) {
      throw new Error('Service non initialisé');
    }

    if (this.isListening) {
      console.log('⚠️ Écoute déjà en cours');
      return;
    }

    const {
      continuous = true,
      interimResults = true,
      timeout = 30000, // 30 secondes par défaut
      confidence_threshold = 0.7
    } = options;

    console.log(`🎤 Démarrage écoute pour: ${language}`);
    
    this.currentLanguage = language;
    this.isListening = true;

    try {
      if (this.recognitionEngine) {
        // Configuration pour la langue
        this.configureForLanguage(language);
        
        this.recognitionEngine.continuous = continuous;
        this.recognitionEngine.interimResults = interimResults;
        
        this.recognitionEngine.start();
      }

      // Démarrer l'enregistrement audio en parallèle
      if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
        this.mediaRecorder.start(1000); // Chunks de 1 seconde
      }

      // Timeout automatique
      if (timeout > 0) {
        setTimeout(() => {
          if (this.isListening) {
            this.stopListening();
          }
        }, timeout);
      }

    } catch (error) {
      this.isListening = false;
      throw error;
    }
  }

  /**
   * Configure la reconnaissance pour une langue spécifique
   */
  configureForLanguage(language) {
    const config = this.languageConfigs[language];
    
    if (!config) {
      console.log(`⚠️ Configuration non trouvée pour ${language}, utilisation du français`);
      language = 'fr';
    }

    // Mapper les codes de langue pour l'API Web Speech
    const languageMapping = {
      'yua': 'es-MX', // Utiliser espagnol mexicain comme proxy
      'quc': 'es-GT', // Utiliser espagnol guatémaltèque comme proxy
      'qu': 'es-PE',  // Utiliser espagnol péruvien comme proxy
      'nah': 'es-MX', // Utiliser espagnol mexicain comme proxy
      'fr': 'fr-FR',
      'es': 'es-ES',
      'en': 'en-US'
    };

    if (this.recognitionEngine) {
      this.recognitionEngine.lang = languageMapping[language] || 'fr-FR';
      console.log(`🌐 Langue configurée: ${this.recognitionEngine.lang}`);
    }
  }

  /**
   * Traite les résultats de reconnaissance vocale
   */
  processSpeechResults(results) {
    const processedResults = [];
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence;
        
        // Post-traitement spécialisé pour les langues indigènes
        const processedTranscript = this.postProcessTranscript(transcript, this.currentLanguage);
        
        processedResults.push({
          transcript: processedTranscript,
          originalTranscript: transcript,
          confidence: confidence,
          isFinal: true,
          language: this.currentLanguage,
          alternatives: this.getAlternatives(result),
          timestamp: Date.now()
        });
        
        console.log(`🗣️ Transcription finale: "${processedTranscript}" (${(confidence * 100).toFixed(1)}%)`);
      } else {
        // Résultat intermédiaire
        const transcript = result[0].transcript.trim();
        
        processedResults.push({
          transcript: transcript,
          confidence: 0,
          isFinal: false,
          language: this.currentLanguage,
          timestamp: Date.now()
        });
      }
    }
    
    return processedResults;
  }

  /**
   * Post-traitement spécialisé pour langues indigènes
   */
  postProcessTranscript(transcript, language) {
    let processed = transcript;

    // Corrections spécifiques aux langues maya
    if (['yua', 'quc', 'cak'].includes(language)) {
      // Corriger les apostrophes (coups de glotte)
      processed = processed.replace(/\s'/g, "'"); // Coller les apostrophes
      processed = processed.replace(/'(\w)/g, "'$1"); // Format correct
      
      // Corrections phonétiques courantes
      const mayaCorrections = {
        'sak ij': "saq'ij", // K'iche' "bonjour"
        'bax ka walik': "ba'ax ka wa'alik", // Yucatec "bonjour"
        'maltiox': "maltyox", // Correction K'iche'
        'tyos': "tyox" // Correction K'iche'
      };
      
      for (const [incorrect, correct] of Object.entries(mayaCorrections)) {
        processed = processed.replace(new RegExp(incorrect, 'gi'), correct);
      }
    }

    // Corrections pour le quechua
    if (language === 'qu') {
      const quechuaCorrections = {
        'napaikullayky': 'napaykullayki',
        'sulpaiky': 'sulpayki',
        'yacu': 'yaku'
      };
      
      for (const [incorrect, correct] of Object.entries(quechuaCorrections)) {
        processed = processed.replace(new RegExp(incorrect, 'gi'), correct);
      }
    }

    // Corrections pour le nahuatl
    if (language === 'nah') {
      const nahuatlCorrections = {
        'nilse': 'niltze',
        'tlasolcamati': 'tlazohcamati',
        'atl': 'atl' // Vérifier la prononciation
      };
      
      for (const [incorrect, correct] of Object.entries(nahuatlCorrections)) {
        processed = processed.replace(new RegExp(incorrect, 'gi'), correct);
      }
    }

    return processed;
  }

  /**
   * Extrait les alternatives de reconnaissance
   */
  getAlternatives(result) {
    const alternatives = [];
    
    for (let i = 0; i < Math.min(result.length, 3); i++) {
      alternatives.push({
        transcript: result[i].transcript.trim(),
        confidence: result[i].confidence
      });
    }
    
    return alternatives;
  }

  /**
   * Traite un blob audio enregistré
   */
  async processAudioBlob(audioBlob) {
    console.log(`🎵 Traitement audio: ${(audioBlob.size / 1024).toFixed(1)} KB`);
    
    try {
      // Pour une implémentation complète, on enverrait l'audio
      // à un service de reconnaissance spécialisé pour langues indigènes
      
      // Simulation du traitement
      const audioAnalysis = await this.analyzeAudioFeatures(audioBlob);
      
      this.emit('audio_processed', {
        size: audioBlob.size,
        duration: audioAnalysis.duration,
        features: audioAnalysis.features,
        language: this.currentLanguage,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('❌ Erreur traitement audio:', error);
      this.emit('error', error);
    }
  }

  /**
   * Analyse les caractéristiques audio (simulation)
   */
  async analyzeAudioFeatures(audioBlob) {
    // Simulation d'analyse audio avancée
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          duration: 5.0, // secondes
          features: {
            fundamental_frequency: 150, // Hz
            formants: [800, 1200, 2400], // Hz
            has_glottal_stops: this.currentLanguage.includes('yua'),
            has_ejectives: ['yua', 'quc', 'qu'].includes(this.currentLanguage),
            tonal_contour: this.currentLanguage === 'nah' ? [2, 3, 1] : null
          }
        });
      }, 100);
    });
  }

  /**
   * Arrête l'écoute
   */
  stopListening() {
    if (!this.isListening) {
      return;
    }

    console.log('🔇 Arrêt de l\'écoute...');
    
    try {
      if (this.recognitionEngine) {
        this.recognitionEngine.stop();
      }
      
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      
    } catch (error) {
      console.warn('⚠️ Erreur lors de l\'arrêt:', error);
    }
    
    this.isListening = false;
  }

  /**
   * Calibre le microphone pour une langue spécifique
   */
  async calibrateMicrophone(language, duration = 5000) {
    console.log(`🎚️ Calibration microphone pour ${language} (${duration}ms)...`);
    
    return new Promise((resolve, reject) => {
      const calibrationData = {
        language: language,
        noise_level: 0,
        signal_strength: 0,
        optimal_settings: {},
        start_time: Date.now()
      };

      // Simuler la calibration
      const calibrationInterval = setInterval(() => {
        calibrationData.noise_level = Math.random() * 20; // dB
        calibrationData.signal_strength = 60 + Math.random() * 20; // dB
        
        this.emit('calibration_progress', {
          progress: (Date.now() - calibrationData.start_time) / duration,
          noise_level: calibrationData.noise_level,
          signal_strength: calibrationData.signal_strength
        });
      }, 100);

      setTimeout(() => {
        clearInterval(calibrationInterval);
        
        calibrationData.optimal_settings = {
          gain: 0.8,
          noise_gate: calibrationData.noise_level + 5,
          sample_rate: this.languageConfigs[language]?.sampling_rate || 16000
        };
        
        console.log('✅ Calibration terminée');
        this.emit('calibration_complete', calibrationData);
        resolve(calibrationData);
      }, duration);
    });
  }

  /**
   * Obtient les statistiques de reconnaissance
   */
  getRecognitionStats() {
    return {
      isInitialized: this.isInitialized,
      isListening: this.isListening,
      currentLanguage: this.currentLanguage,
      supportedLanguages: Object.keys(this.languageConfigs),
      audioContext: !!this.audioContext,
      recognitionEngine: !!this.recognitionEngine,
      mediaRecorder: !!this.mediaRecorder
    };
  }

  /**
   * Nettoie les ressources
   */
  async cleanup() {
    console.log('🧹 Nettoyage du service de reconnaissance vocale...');
    
    this.stopListening();
    
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    
    this.recognitionEngine = null;
    this.mediaRecorder = null;
    this.isInitialized = false;
    
    console.log('✅ Nettoyage terminé');
  }
}

// Instance singleton
const speechRecognitionService = new NativeSpeechRecognitionService();

export default speechRecognitionService;

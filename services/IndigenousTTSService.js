/**
 * 🎤 Service de Synthèse Vocale pour Langues Autochtones
 * Adapte la Web Speech API pour une prononciation correcte des langues indigènes
 */

class IndigenousTTSService {
  constructor() {
    this.isSupported = false;
    this.synth = null;
    this.voices = [];
    this.currentUtterance = null;
    
    // Configuration pour l'adaptation phonétique
    this.phoneticAdaptations = {
      'yua': { // Maya Yucatèque
        baseLanguage: 'es-MX', // Espagnol mexicain comme base
        adaptations: {
          // Coups de glotte
          "'": ' ',
          // Phonèmes spéciaux
          'x': 'sh',
          'j': 'h',
          // Voyelles longues
          'aa': 'a:',
          'ee': 'e:',
          'ii': 'i:',
          'oo': 'o:',
          'uu': 'u:'
        },
        prosody: {
          rate: 0.8,
          pitch: 1.0,
          volume: 0.9
        }
      },
      'qu': { // Quechua
        baseLanguage: 'es-PE', // Espagnol péruvien
        adaptations: {
          'q': 'k',
          'ñ': 'ny',
          'ch': 'tch',
          'sh': 'ch',
          'y': 'j'
        },
        prosody: {
          rate: 0.85,
          pitch: 0.9,
          volume: 0.9
        }
      },
      'gn': { // Guarani
        baseLanguage: 'es-PY', // Espagnol paraguayen
        adaptations: {
          'ỹ': 'in',
          'g̃': 'ng',
          'j': 'y',
          'x': 'sh'
        },
        prosody: {
          rate: 0.8,
          pitch: 1.1,
          volume: 0.9
        }
      },
      'nah': { // Nahuatl
        baseLanguage: 'es-MX',
        adaptations: {
          'tl': 'tla',
          'x': 'sh',
          'tz': 'ts',
          'qu': 'kw'
        },
        prosody: {
          rate: 0.75,
          pitch: 0.95,
          volume: 0.9
        }
      }
    };
  }

  /**
   * Initialise le service TTS
   */
  async initialize() {
    if (typeof window === 'undefined') {
      console.warn('TTS: Environnement non supporté (pas de window)');
      return false;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('TTS: Web Speech API non supportée');
      return false;
    }

    this.synth = window.speechSynthesis;
    this.isSupported = true;

    // Charger les voix disponibles
    await this.loadVoices();
    
    console.log('✅ Service TTS initialisé avec', this.voices.length, 'voix');
    return true;
  }

  /**
   * Charge les voix disponibles
   */
  async loadVoices() {
    return new Promise((resolve) => {
      const loadVoicesCallback = () => {
        this.voices = this.synth.getVoices();
        if (this.voices.length > 0) {
          resolve(this.voices);
        }
      };

      // Les voix peuvent être chargées de manière asynchrone
      if (this.voices.length === 0) {
        this.synth.addEventListener('voiceschanged', loadVoicesCallback);
        // Fallback si l'événement ne se déclenche pas
        setTimeout(loadVoicesCallback, 100);
      } else {
        loadVoicesCallback();
      }
    });
  }

  /**
   * Trouve la meilleure voix pour une langue
   */
  findBestVoice(languageCode) {
    const config = this.phoneticAdaptations[languageCode];
    if (!config) {
      console.warn(`Langue ${languageCode} non configurée, utilisation voix par défaut`);
      return this.voices[0] || null;
    }

    const baseLanguage = config.baseLanguage;
    
    // Chercher une voix correspondant exactement
    let voice = this.voices.find(v => v.lang === baseLanguage);
    
    if (!voice) {
      // Chercher par langue principale (ex: 'es' pour 'es-MX')
      const mainLang = baseLanguage.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(mainLang));
    }
    
    if (!voice) {
      // Fallback vers voix par défaut
      voice = this.voices.find(v => v.default) || this.voices[0];
    }

    console.log(`Voix sélectionnée pour ${languageCode}:`, voice?.name || 'Aucune');
    return voice;
  }

  /**
   * Adapte le texte pour une meilleure prononciation
   */
  adaptTextForTTS(text, languageCode) {
    const config = this.phoneticAdaptations[languageCode];
    if (!config) return text;

    let adaptedText = text;
    
    // Appliquer les adaptations phonétiques
    for (const [original, replacement] of Object.entries(config.adaptations)) {
      // Utiliser une regex globale pour remplacer toutes les occurrences
      const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      adaptedText = adaptedText.replace(regex, replacement);
    }

    console.log(`Adaptation ${languageCode}: "${text}" → "${adaptedText}"`);
    return adaptedText;
  }

  /**
   * Synthétise le texte en parole
   */
  async speak(text, languageCode = 'yua', options = {}) {
    if (!this.isSupported) {
      console.warn('TTS non supporté');
      return false;
    }

    // Arrêter toute synthèse en cours
    this.stop();

    try {
      // Adapter le texte pour la langue
      const adaptedText = this.adaptTextForTTS(text, languageCode);
      
      // Créer l'utterance
      this.currentUtterance = new SpeechSynthesisUtterance(adaptedText);
      
      // Sélectionner la voix appropriée
      const voice = this.findBestVoice(languageCode);
      if (voice) {
        this.currentUtterance.voice = voice;
      }

      // Appliquer les paramètres de prosodie
      const config = this.phoneticAdaptations[languageCode];
      if (config) {
        this.currentUtterance.rate = options.rate || config.prosody.rate;
        this.currentUtterance.pitch = options.pitch || config.prosody.pitch;
        this.currentUtterance.volume = options.volume || config.prosody.volume;
      }

      // Événements
      return new Promise((resolve, reject) => {
        this.currentUtterance.onend = () => {
          console.log('✅ Synthèse terminée');
          resolve(true);
        };

        this.currentUtterance.onerror = (event) => {
          console.error('❌ Erreur synthèse:', event.error);
          reject(new Error(`Erreur TTS: ${event.error}`));
        };

        this.currentUtterance.onstart = () => {
          console.log('🎤 Début synthèse:', adaptedText);
        };

        // Démarrer la synthèse
        this.synth.speak(this.currentUtterance);
      });

    } catch (error) {
      console.error('❌ Erreur lors de la synthèse:', error);
      return false;
    }
  }

  /**
   * Arrête la synthèse en cours
   */
  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      console.log('🛑 Synthèse arrêtée');
    }
  }

  /**
   * Met en pause la synthèse
   */
  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      console.log('⏸️ Synthèse en pause');
    }
  }

  /**
   * Reprend la synthèse
   */
  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      console.log('▶️ Synthèse reprise');
    }
  }

  /**
   * Vérifie si une synthèse est en cours
   */
  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Obtient les voix disponibles par langue
   */
  getAvailableVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService,
      default: voice.default
    }));
  }

  /**
   * Test de la synthèse vocale
   */
  async testVoice(languageCode = 'yua') {
    const testPhrases = {
      'yua': 'Bix a beel?',
      'qu': 'Imaynalla kashkanki?',
      'gn': 'Mbaéichapa reiko?',
      'nah': 'Quen titlakati?'
    };

    const text = testPhrases[languageCode] || 'Test de synthèse vocale';
    console.log(`🧪 Test de synthèse pour ${languageCode}: "${text}"`);
    
    return await this.speak(text, languageCode);
  }
}

// Instance singleton
const indigenousTTS = new IndigenousTTSService();

export default indigenousTTS;

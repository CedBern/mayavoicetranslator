// Service de reconnaissance vocale compatible web
import { Platform } from 'react-native';

class VoiceService {
  constructor() {
    this.recording = null;
    this.isRecording = false;
    this.isWebPlatform = Platform.OS === 'web';
  }

  async startRecording(language = 'fr-FR') {
    if (this.isWebPlatform) {
      return this.startWebRecording(language);
    }
    // Version mobile native ici si nécessaire
    throw new Error('Reconnaissance vocale non disponible sur cette plateforme');
  }

  async startWebRecording(language = 'fr-FR') {
    try {
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        throw new Error('Reconnaissance vocale non supportée par ce navigateur');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = language;

      return new Promise((resolve, reject) => {
        this.recognition.onresult = (event) => {
          const result = event.results[0][0];
          resolve({
            text: result.transcript,
            confidence: result.confidence,
            language: language
          });
        };

        this.recognition.onerror = (event) => {
          reject(new Error(`Erreur de reconnaissance: ${event.error}`));
        };

        this.recognition.start();
        this.isRecording = true;
      });
    } catch (error) {
      console.error('Erreur de reconnaissance vocale:', error);
      throw error;
    }
  }

  async stopRecording() {
    if (this.isWebPlatform && this.recognition) {
      this.recognition.stop();
      this.isRecording = false;
      return true;
    }
    return false;
  }

  async speak(text, language = 'fr') {
    if (this.isWebPlatform) {
      return this.speakWeb(text, language);
    }
    throw new Error('Synthèse vocale non disponible sur cette plateforme');
  }

  speakWeb(text, language = 'fr') {
    try {
      if (!window.speechSynthesis) {
        throw new Error('Synthèse vocale non supportée par ce navigateur');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getWebLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
      
      return new Promise((resolve) => {
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Erreur de synthèse vocale:', error);
      return false;
    }
  }

  getWebLanguageCode(language) {
    const mapping = {
      'fr': 'fr-FR',
      'en': 'en-US',
      'es': 'es-ES',
      'yua': 'es-MX', // Approximation pour maya yucatèque
      'quc': 'es-GT', // Approximation pour quiché
      'qu': 'es-PE',  // Approximation pour quechua
      'nah': 'es-MX', // Approximation pour nahuatl
      'gn': 'es-PY'   // Approximation pour guarani
    };
    return mapping[language] || 'fr-FR';
  }

  isRecordingAvailable() {
    if (this.isWebPlatform) {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    return false;
  }

  isSpeechAvailable() {
    if (this.isWebPlatform) {
      return !!window.speechSynthesis;
    }
    return false;
  }
}

export default VoiceService;

import { I18n } from 'i18n-js';
import { Platform, NativeModules } from 'react-native';

// Fonction simple pour détecter la langue du système
const getDeviceLanguage = () => {
  try {
    const locale = Platform.OS === 'ios' 
      ? NativeModules.SettingsManager?.settings?.AppleLocale || 'en'
      : NativeModules.I18nManager?.localeIdentifier || 'en';
    return locale.substring(0, 2).toLowerCase();
  } catch {
    return 'fr'; // Français par défaut
  }
};

// Traductions pour l'interface utilisateur
const translations = {
  // Français
  fr: {
    // Interface générale
    welcome: 'Bienvenue',
    home: 'Accueil',
    translator: 'Traducteur',
    settings: 'Paramètres',
    voices: 'Voix',
    back: 'Retour',
    next: 'Suivant',
    continue: 'Continuer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    
    // Page d'accueil
    appTitle: 'TalkKin Global',
    appSubtitle: 'Traducteur de Langues Autochtones',
    appDescription: 'Connectez les langues autochtones avec le monde moderne. Préservez, apprenez et communiquez avec TalkKin Global.',
    startTranslating: 'Commencer à traduire',
    exploreFeatures: 'Explorer les fonctionnalités',
    
    // Sélecteur d\'accessibilité
    accessibility: {
      title: 'Paramètres d\'Accessibilité',
      subtitle: 'Configurez votre expérience pour une utilisation optimale',
      fontSizeLabel: 'Taille du texte',
      fontSizeSmall: 'Petit',
      fontSizeMedium: 'Moyen',
      fontSizeLarge: 'Grand',
      themeLabel: 'Thème',
      lightTheme: 'Clair',
      darkTheme: 'Sombre',
      languageLabel: 'Langue de l\'interface',
      autoLanguage: 'Détection automatique',
      continueButton: 'Continuer avec ces paramètres'
    },
    
    // Traducteur
    translation: {
      title: 'Traducteur',
      subtitle: 'Langues Autochtones ↔ Modernes',
      from: 'De :',
      to: 'Vers :',
      translate: 'Traduire',
      translating: 'Traduction...',
      placeholder: 'Tapez votre texte ici...',
      resultPlaceholder: 'La traduction apparaîtra ici...',
      examples: 'Exemples pour',
      statusBidirectional: 'Traduction bidirectionnelle disponible',
      statusUnidirectional: 'Traduction dans un sens disponible',
      statusReverseOnly: 'Traduction inverse disponible (utilisez ⇄)',
      statusLimited: 'Traduction limitée - Essayez d\'autres langues',
      offlineMode: 'Mode hors ligne - Connectez-vous pour plus de traductions',
      serverNeeded: 'Démarrez le serveur API pour plus de traductions'
    },
    
    // Langues
    languages: {
      fr: 'Français',
      es: 'Espagnol',
      en: 'Anglais',
      yua: 'Maya Yucatèque',
      qu: 'Quechua',
      gn: 'Guarani',
      nah: 'Nahuatl',
      ay: 'Aymara'
    }
  },
  
  // Español
  es: {
    welcome: 'Bienvenido',
    home: 'Inicio',
    translator: 'Traductor',
    settings: 'Configuración',
    voices: 'Voces',
    back: 'Volver',
    next: 'Siguiente',
    continue: 'Continuar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    
    appTitle: 'TalkKin Global',
    appSubtitle: 'Traductor de Lenguas Indígenas',
    appDescription: 'Conecta las lenguas indígenas con el mundo moderno. Preserva, aprende y comunícate con TalkKin Global.',
    startTranslating: 'Comenzar a traducir',
    exploreFeatures: 'Explorar funciones',
    
    accessibility: {
      title: 'Configuración de Accesibilidad',
      subtitle: 'Configura tu experiencia para un uso óptimo',
      fontSizeLabel: 'Tamaño del texto',
      fontSizeSmall: 'Pequeño',
      fontSizeMedium: 'Mediano',
      fontSizeLarge: 'Grande',
      themeLabel: 'Tema',
      lightTheme: 'Claro',
      darkTheme: 'Oscuro',
      languageLabel: 'Idioma de la interfaz',
      autoLanguage: 'Detección automática',
      continueButton: 'Continuar con esta configuración'
    },
    
    translation: {
      title: 'Traductor',
      subtitle: 'Lenguas Indígenas ↔ Modernas',
      from: 'De:',
      to: 'A:',
      translate: 'Traducir',
      translating: 'Traduciendo...',
      placeholder: 'Escribe tu texto aquí...',
      resultPlaceholder: 'La traducción aparecerá aquí...',
      examples: 'Ejemplos para',
      statusBidirectional: 'Traducción bidireccional disponible',
      statusUnidirectional: 'Traducción en un sentido disponible',
      statusReverseOnly: 'Traducción inversa disponible (usa ⇄)',
      statusLimited: 'Traducción limitada - Prueba otros idiomas',
      offlineMode: 'Modo sin conexión - Conéctate para más traducciones',
      serverNeeded: 'Inicia el servidor API para más traducciones'
    },
    
    languages: {
      fr: 'Francés',
      es: 'Español',
      en: 'Inglés',
      yua: 'Maya Yucateco',
      qu: 'Quechua',
      gn: 'Guaraní',
      nah: 'Náhuatl',
      ay: 'Aymara'
    }
  },
  
  // English
  en: {
    welcome: 'Welcome',
    home: 'Home',
    translator: 'Translator',
    settings: 'Settings',
    voices: 'Voices',
    back: 'Back',
    next: 'Next',
    continue: 'Continue',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    
    appTitle: 'TalkKin Global',
    appSubtitle: 'Indigenous Language Translator',
    appDescription: 'Connect indigenous languages with the modern world. Preserve, learn and communicate with TalkKin Global.',
    startTranslating: 'Start translating',
    exploreFeatures: 'Explore features',
    
    accessibility: {
      title: 'Accessibility Settings',
      subtitle: 'Configure your experience for optimal use',
      fontSizeLabel: 'Text size',
      fontSizeSmall: 'Small',
      fontSizeMedium: 'Medium',
      fontSizeLarge: 'Large',
      themeLabel: 'Theme',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      languageLabel: 'Interface language',
      autoLanguage: 'Auto-detect',
      continueButton: 'Continue with these settings'
    },
    
    translation: {
      title: 'Translator',
      subtitle: 'Indigenous ↔ Modern Languages',
      from: 'From:',
      to: 'To:',
      translate: 'Translate',
      translating: 'Translating...',
      placeholder: 'Type your text here...',
      resultPlaceholder: 'Translation will appear here...',
      examples: 'Examples for',
      statusBidirectional: 'Bidirectional translation available',
      statusUnidirectional: 'One-way translation available',
      statusReverseOnly: 'Reverse translation available (use ⇄)',
      statusLimited: 'Limited translation - Try other languages',
      offlineMode: 'Offline mode - Connect for more translations',
      serverNeeded: 'Start API server for more translations'
    },
    
    languages: {
      fr: 'French',
      es: 'Spanish',
      en: 'English',
      yua: 'Yucatec Maya',
      qu: 'Quechua',
      gn: 'Guarani',
      nah: 'Nahuatl',
      ay: 'Aymara'
    }
  }
};

// Configuration I18n
const i18n = new I18n(translations);

// Définir la langue par défaut
i18n.defaultLocale = 'fr';
i18n.enableFallback = true;

// Service de localisation
export class LocalizationService {
  private static instance: LocalizationService;
  private currentLocale: string = 'fr';
  
  static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }
  
  // Initialiser avec détection automatique
  initialize(): string {
    // Détecter la langue du système
    const systemLocale = getDeviceLanguage();
    console.log('🌍 Langue système détectée:', systemLocale);
    
    // Vérifier si la langue est supportée
    const supportedLanguages = Object.keys(translations);
    const detectedLanguage = supportedLanguages.includes(systemLocale) ? systemLocale : 'fr';
    
    console.log('🔧 Langue sélectionnée:', detectedLanguage);
    
    this.setLocale(detectedLanguage);
    return detectedLanguage;
  }
  
  // Définir la langue
  setLocale(locale: string): void {
    this.currentLocale = locale;
    i18n.locale = locale;
    console.log('🌐 Langue interface mise à jour:', locale);
  }
  
  // Obtenir la langue actuelle
  getCurrentLocale(): string {
    return this.currentLocale;
  }
  
  // Obtenir la liste des langues supportées
  getSupportedLanguages(): Array<{code: string, name: string, flag: string}> {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }
  
  // Traduire un texte
  t(key: string, options?: any): string {
    return i18n.t(key, options);
  }
  
  // Vérifier si une langue est supportée
  isLanguageSupported(languageCode: string): boolean {
    return Object.keys(translations).includes(languageCode);
  }
}

// Instance singleton
export const localizationService = LocalizationService.getInstance();

// Export du service de traduction pour un accès direct
export const t = (key: string, options?: any): string => {
  return localizationService.t(key, options);
};

export default localizationService;

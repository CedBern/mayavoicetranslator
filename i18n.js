import * as Localization from 'expo-localization';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      'Voix Ancestrales': 'Voix Ancestrales',
      'Écoutez les langues autochtones': 'Écoutez les langues autochtones',
      'Synthèse Vocale Authentique': 'Synthèse Vocale Authentique',
      'Découvrez la beauté sonore des langues autochtones grâce à notre technologie de synthèse vocale développée en collaboration avec les communautés natives.': 'Découvrez la beauté sonore des langues autochtones grâce à notre technologie de synthèse vocale développée en collaboration avec les communautés natives.',
      'Fonctionnalités à venir': 'Fonctionnalités à venir',
      'Enregistrement Personnel': 'Enregistrement Personnel',
      'Enregistrez votre propre voix pour contribuer à l\'amélioration du modèle': 'Enregistrez votre propre voix pour contribuer à l\'amélioration du modèle',
      'Qualité Audio HD': 'Qualité Audio HD',
      'Synthèse vocale haute définition avec intonations naturelles': 'Synthèse vocale haute définition avec intonations naturelles',
      'Bibliothèque Étendue': 'Bibliothèque Étendue',
      'Plus de 50 langues autochtones des Amériques bientôt disponibles': 'Plus de 50 langues autochtones des Amériques bientôt disponibles',
      'Développé avec les Communautés': 'Développé avec les Communautés',
      'Notre technologie de synthèse vocale est développée en étroite collaboration avec les locuteurs natifs et les institutions culturelles autochtones pour assurer l\'authenticité et le respect des traditions orales.': 'Notre technologie de synthèse vocale est développée en étroite collaboration avec les locuteurs natifs et les institutions culturelles autochtones pour assurer l\'authenticité et le respect des traditions orales.',
      'Votre feedback': 'Votre feedback',
      'Envoyer': 'Envoyer',
      'Augmenter la taille du texte': 'Augmenter la taille du texte',
      'Diminuer la taille du texte': 'Diminuer la taille du texte',
      'Contraste élevé': 'Contraste élevé',
    }
  },
  en: {
    translation: {
      'Voix Ancestrales': 'Ancestral Voices',
      'Écoutez les langues autochtones': 'Listen to Indigenous Languages',
      'Synthèse Vocale Authentique': 'Authentic Voice Synthesis',
      'Découvrez la beauté sonore des langues autochtones grâce à notre technologie de synthèse vocale développée en collaboration avec les communautés natives.': 'Discover the sound beauty of indigenous languages with our voice synthesis technology developed in collaboration with native communities.',
      'Fonctionnalités à venir': 'Upcoming Features',
      'Enregistrement Personnel': 'Personal Recording',
      'Enregistrez votre propre voix pour contribuer à l\'amélioration du modèle': 'Record your own voice to help improve the model',
      'Qualité Audio HD': 'HD Audio Quality',
      'Synthèse vocale haute définition avec intonations naturelles': 'High-definition voice synthesis with natural intonations',
      'Bibliothèque Étendue': 'Extended Library',
      'Plus de 50 langues autochtones des Amériques bientôt disponibles': 'Over 50 indigenous languages of the Americas coming soon',
      'Développé avec les Communautés': 'Developed with Communities',
      'Notre technologie de synthèse vocale est développée en étroite collaboration avec les locuteurs natifs et les institutions culturelles autochtones pour assurer l\'authenticité et le respect des traditions orales.': 'Our voice synthesis technology is developed in close collaboration with native speakers and indigenous cultural institutions to ensure authenticity and respect for oral traditions.',
      'Votre feedback': 'Your feedback',
      'Envoyer': 'Send',
      'Augmenter la taille du texte': 'Increase text size',
      'Diminuer la taille du texte': 'Decrease text size',
      'Contraste élevé': 'High contrast',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    compatibilityJSON: 'v3',
    lng: Localization.locale.split('-')[0],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

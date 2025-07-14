// Utilitaire de test pour vérifier la configuration OpenAI
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranslationService from './TranslationService';

class OpenAITester {
  
  /**
   * Teste si la clé OpenAI est configurée et fonctionne
   */
  async testOpenAIConfiguration() {
    try {
      // Récupérer la clé depuis le stockage
      const apiKey = await AsyncStorage.getItem('openai_api_key');
      
      if (!apiKey) {
        return {
          success: false,
          message: 'Aucune clé API OpenAI configurée',
          step: 'Allez dans Paramètres pour ajouter votre clé'
        };
      }

      if (!apiKey.startsWith('sk-')) {
        return {
          success: false,
          message: 'Format de clé invalide',
          step: 'La clé doit commencer par "sk-"'
        };
      }      // Test de traduction simple
      const testResult = await TranslationService.translate(
        'Bonjour', 
        'fr', 
        'yua', 
        { openaiApiKey: apiKey }
      );

      if (testResult.provider === 'OpenAI') {
        return {
          success: true,
          message: 'Configuration OpenAI réussie !',
          translation: testResult.translatedText,
          step: 'Votre app peut maintenant traduire en Maya'
        };
      } else {
        return {
          success: false,
          message: 'OpenAI non utilisé pour la traduction',
          step: 'Vérifiez votre clé API et votre crédit'
        };
      }

    } catch (error) {
      if (error.message.includes('401')) {
        return {
          success: false,
          message: 'Clé API invalide ou expirée',
          step: 'Vérifiez votre clé sur platform.openai.com'
        };
      } else if (error.message.includes('429')) {
        return {
          success: false,
          message: 'Quota dépassé',
          step: 'Vérifiez votre crédit sur platform.openai.com'
        };
      } else {
        return {
          success: false,
          message: 'Erreur de connexion',
          step: 'Vérifiez votre connexion internet'
        };
      }
    }
  }

  /**
   * Affiche les instructions détaillées
   */
  getDetailedInstructions() {
    return {
      steps: [
        '1. Aller sur platform.openai.com',
        '2. Se connecter ou créer un compte',
        '3. Aller dans "API Keys"',
        '4. Cliquer "Create new secret key"',
        '5. Copier la clé (sk-...)',
        '6. Coller dans Paramètres de l\'app',
        '7. Activer "traduction avancée"',
        '8. Sauvegarder'
      ],
      tips: [
        '💡 Gardez votre clé secrète',
        '💰 Surveillez votre usage sur OpenAI',
        '🔒 La clé est stockée localement',
        '🌐 Fonctionne hors ligne en mode fallback'
      ]
    };
  }
}

export default new OpenAITester();

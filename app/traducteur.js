import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import TranslationService, { SUPPORTED_LANGUAGES } from '../services/TranslationService';
import VoiceService from '../services/VoiceService';

export default function Traducteur() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');  const [fromLanguage, setFromLanguage] = useState('fr');
  const [toLanguage, setToLanguage] = useState('yua');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);  const translateText = async () => {
    if (!inputText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte à traduire');
      return;
    }

    setIsTranslating(true);
    try {
      console.log(`🔄 Début traduction: "${inputText}" (${fromLanguage} → ${toLanguage})`);
      
      // Récupérer les paramètres sauvegardés
      const openaiApiKey = await AsyncStorage.getItem('openai_api_key');
      const useAdvanced = await AsyncStorage.getItem('use_advanced_translation');
      
      console.log(`🔑 Clé API: ${openaiApiKey ? 'Présente' : 'Absente'}`);
      console.log(`⚙️ Mode avancé: ${useAdvanced}`);
      
      const options = {};
      if (openaiApiKey && JSON.parse(useAdvanced || 'false')) {
        options.openaiApiKey = openaiApiKey;
        console.log('✅ OpenAI sera utilisé si nécessaire');
      } else {
        console.log('ℹ️ Traduction standard uniquement');
      }

      const result = await TranslationService.translate(
        inputText, 
        fromLanguage, 
        toLanguage,
        options
      );
      
      console.log(`✅ Traduction reçue: "${result.translatedText}"`);
      console.log(`📊 Provider: ${result.provider || 'Non spécifié'}`);
      console.log(`📈 Confiance: ${result.confidence}`);
      
      setTranslatedText(result.translatedText);
      
      // Afficher des informations selon le type de traduction
      if (result.warning) {
        Alert.alert('Information', result.warning);
      } else if (result.error) {
        Alert.alert('Avertissement', result.error);
      } else if (result.provider === 'OpenAI') {
        Alert.alert('✅ Succès', 'Traduction Maya avancée utilisée !');
      } else if (result.provider === 'Hors ligne') {
        Alert.alert('📚 Traduction de base', 'Traduction hors ligne utilisée. Pour une meilleure qualité, ajoutez une clé OpenAI.');
      }
      
    } catch (error) {
      console.error('❌ Erreur traduction:', error);
      Alert.alert('Erreur', 'Impossible de traduire le texte: ' + error.message);
    } finally {
      setIsTranslating(false);
    }
  };
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        // Arrêter la reconnaissance vocale
        setIsRecording(false);
        
        Alert.alert('Information', 'Reconnaissance vocale arrêtée');
      } else {
        // Démarrer la reconnaissance vocale
        setIsRecording(true);
        
        try {
          const speechResult = await VoiceService.startSpeechRecognition(fromLanguage);
          setInputText(speechResult.transcript);
          
          Alert.alert(
            'Reconnaissance vocale réussie', 
            `Texte reconnu: "${speechResult.transcript}"\nConfiance: ${Math.round(speechResult.confidence * 100)}%`
          );
        } catch (speechError) {
          Alert.alert(
            'Erreur reconnaissance vocale', 
            speechError.message + '\n\nVérifiez que votre microphone est autorisé.'
          );
        } finally {
          setIsRecording(false);
        }
      }
    } catch (error) {
      setIsRecording(false);
      Alert.alert('Erreur', 'Problème avec la reconnaissance vocale: ' + error.message);
    }
  };  const speakTranslation = async () => {
    if (!translatedText) {
      Alert.alert('Erreur', 'Aucune traduction à lire');
      return;
    }

    try {
      setIsSpeaking(true);
      console.log(`🔊 Lecture de "${translatedText}" en ${toLanguage}`);
      
      // Avertissement pour les langues Maya
      if (['yua', 'quc', 'cak'].includes(toLanguage)) {
        Alert.alert(
          '🔊 Lecture Maya',
          'La synthèse vocale utilise une approximation espagnole pour prononcer le maya. La prononciation peut ne pas être parfaite.',
          [
            { text: 'Annuler', style: 'cancel', onPress: () => setIsSpeaking(false) },
            { 
              text: 'Continuer', 
              onPress: async () => {
                try {
                  await VoiceService.speakText(translatedText, toLanguage);
                } catch (error) {
                  Alert.alert('Erreur', 'Impossible de lire le texte: ' + error.message);
                } finally {
                  setIsSpeaking(false);
                }
              }
            }
          ]
        );
      } else {
        await VoiceService.speakText(translatedText, toLanguage);
        setIsSpeaking(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire le texte: ' + error.message);
      setIsSpeaking(false);
    }
  };const testMayaTranslation = () => {
    const testPhrases = {
      'fr': [
        'Bonjour',
        'Comment allez-vous ?',
        'Merci beaucoup',
        'Je ne comprends pas',
        'Aidez-moi',
        'Au revoir',
        'Pardon',
        'Où êtes-vous ?',
        'Comment vous appelez-vous ?',
        'Je vais bien'
      ],
      'es': [
        'Hola',
        '¿Cómo está usted?',
        'Muchas gracias', 
        'No entiendo',
        'Ayúdeme',
        'Adiós',
        'Perdón',
        '¿Dónde está?',
        '¿Cómo se llama?',
        'Estoy bien'
      ],
      'en': [
        'Hello',
        'How are you?',
        'Thank you very much',
        'I don\'t understand',
        'Help me',
        'Goodbye',
        'Sorry',
        'Where are you?',
        'What is your name?',
        'I am fine'
      ]
    };
    
    const phrases = testPhrases[fromLanguage] || testPhrases['fr'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setInputText(randomPhrase);
    Alert.alert('🧪 Phrase de test', `Phrase ajoutée: "${randomPhrase}"\n\nCette phrase est disponible dans le dictionnaire hors ligne.`);
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          🗣️ Traducteur Maya
        </ThemedText>

        {/* Sélecteurs de langue */}
        <View style={styles.languageSelector}>
          <View style={styles.languageContainer}>
            <ThemedText style={styles.languageLabel}>De:</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fromLanguage}
                onValueChange={setFromLanguage}
                style={styles.picker}
              >
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                  <Picker.Item key={code} label={name} value={code} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity onPress={swapLanguages} style={styles.swapButton}>
            <ThemedText style={styles.swapIcon}>⇄</ThemedText>
          </TouchableOpacity>

          <View style={styles.languageContainer}>
            <ThemedText style={styles.languageLabel}>Vers:</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={toLanguage}
                onValueChange={setToLanguage}
                style={styles.picker}
              >
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                  <Picker.Item key={code} label={name} value={code} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Zone de saisie */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.sectionTitle}>Texte à traduire:</ThemedText>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre texte ici..."
            multiline
            numberOfLines={4}
          />
            <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testMayaTranslation}
            >
              <ThemedText style={styles.buttonText}>🧪 Test</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.voiceButton, isRecording && styles.recording]}
              onPress={toggleRecording}
              disabled={isTranslating}
            >
              <ThemedText style={styles.buttonText}>
                {isRecording ? '⏹️ Arrêter' : '🎤 Dicter'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.translateButton]}
              onPress={translateText}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.buttonText}>🔄 Traduire</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Zone de traduction */}
        <View style={styles.outputSection}>
          <ThemedText style={styles.sectionTitle}>Traduction:</ThemedText>
          <View style={styles.translationContainer}>
            <ThemedText style={styles.translatedText}>
              {translatedText || 'La traduction apparaîtra ici...'}
            </ThemedText>
          </View>
          
          {translatedText && (
            <TouchableOpacity
              style={[styles.button, styles.speakButton]}
              onPress={speakTranslation}
              disabled={isSpeaking}
            >
              <ThemedText style={styles.buttonText}>
                {isSpeaking ? '🔊 Lecture...' : '🔊 Écouter'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            💡 Astuce: Utilisez le microphone pour la saisie vocale ou tapez directement votre texte.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageContainer: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40,
  },
  swapButton: {
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  swapIcon: {
    fontSize: 20,
    color: 'white',
  },
  inputSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#6C757D',
  },
  voiceButton: {
    backgroundColor: '#FF6B6B',
  },
  recording: {
    backgroundColor: '#FF3333',
  },
  translateButton: {
    backgroundColor: '#007AFF',
  },
  speakButton: {
    backgroundColor: '#28A745',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  outputSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  translationContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
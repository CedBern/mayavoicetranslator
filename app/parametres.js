import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Switch 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import OpenAITester from '../services/OpenAITester';

export default function Parametres() {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [useAdvancedTranslation, setUseAdvancedTranslation] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState('0.8');
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedKey = await AsyncStorage.getItem('openai_api_key');
      const savedAdvanced = await AsyncStorage.getItem('use_advanced_translation');
      const savedAutoSpeak = await AsyncStorage.getItem('auto_speak');
      const savedSpeechRate = await AsyncStorage.getItem('speech_rate');

      if (savedKey) setOpenaiApiKey(savedKey);
      if (savedAdvanced) setUseAdvancedTranslation(JSON.parse(savedAdvanced));
      if (savedAutoSpeak) setAutoSpeak(JSON.parse(savedAutoSpeak));
      if (savedSpeechRate) setSpeechRate(savedSpeechRate);
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('openai_api_key', openaiApiKey);
      await AsyncStorage.setItem('use_advanced_translation', JSON.stringify(useAdvancedTranslation));
      await AsyncStorage.setItem('auto_speak', JSON.stringify(autoSpeak));
      await AsyncStorage.setItem('speech_rate', speechRate);
      
      Alert.alert('Succès', 'Paramètres sauvegardés !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const clearSettings = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir effacer tous les paramètres ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Effacer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'openai_api_key',
                'use_advanced_translation',
                'auto_speak',
                'speech_rate'
              ]);
              setOpenaiApiKey('');
              setUseAdvancedTranslation(false);
              setAutoSpeak(true);
              setSpeechRate('0.8');
              Alert.alert('Succès', 'Paramètres effacés !');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'effacer les paramètres');
            }
          }
        }
      ]
    );
  };

  const testOpenAIConfiguration = async () => {
    setIsTestingAPI(true);
    try {
      const result = await OpenAITester.testOpenAIConfiguration();
      
      if (result.success) {
        Alert.alert(
          '✅ Test réussi !',
          `${result.message}\n\nTraduction test: "${result.translation}"`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '❌ Test échoué',
          `${result.message}\n\n📝 ${result.step}`,
          [
            { text: 'Aide', onPress: showDetailedHelp },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de tester la configuration');
    } finally {
      setIsTestingAPI(false);
    }
  };

  const showDetailedHelp = () => {
    const instructions = OpenAITester.getDetailedInstructions();
    
    Alert.alert(
      '📚 Guide détaillé OpenAI',
      `${instructions.steps.join('\n')}\n\n${instructions.tips.join('\n')}`,
      [
        { 
          text: 'Ouvrir OpenAI', 
          onPress: () => {
            // Dans une vraie app mobile, vous utiliseriez Linking.openURL
            console.log('Ouverture de platform.openai.com');
          }
        },
        { text: 'Fermer' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          ⚙️ Paramètres
        </ThemedText>

        {/* Section API */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔑 Configuration API</ThemedText>
          
          <View style={styles.settingItem}>
            <ThemedText style={styles.label}>Clé API OpenAI (pour traduction Maya avancée)</ThemedText>            <TextInput
              style={styles.textInput}
              value={openaiApiKey}
              onChangeText={setOpenaiApiKey}
              placeholder="sk-proj-..."
              secureTextEntry
              autoCapitalize="none"
            />
            <ThemedText style={styles.hint}>
              💡 Optionnel: Pour une meilleure traduction des langues maya
            </ThemedText>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.switchRow}>
              <ThemedText style={styles.label}>Utiliser la traduction avancée</ThemedText>
              <Switch
                value={useAdvancedTranslation}
                onValueChange={setUseAdvancedTranslation}
              />
            </View>
            <ThemedText style={styles.hint}>
              Utilise OpenAI si la clé est configurée
            </ThemedText>
          </View>

          {/* Bouton de test OpenAI */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testOpenAIConfiguration}
            disabled={isTestingAPI || !openaiApiKey}
          >
            <ThemedText style={styles.testButtonText}>
              {isTestingAPI ? '🔄 Test en cours...' : '🧪 Tester la configuration OpenAI'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpButton} 
            onPress={showDetailedHelp}
          >
            <ThemedText style={styles.helpButtonText}>
              📚 Guide détaillé OpenAI
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Section Audio */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔊 Paramètres Audio</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.switchRow}>
              <ThemedText style={styles.label}>Lecture automatique des traductions</ThemedText>
              <Switch
                value={autoSpeak}
                onValueChange={setAutoSpeak}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <ThemedText style={styles.label}>Vitesse de lecture (0.5 - 2.0)</ThemedText>
            <TextInput
              style={styles.textInput}
              value={speechRate}
              onChangeText={setSpeechRate}
              placeholder="0.8"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Section Informations */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ℹ️ Informations</ThemedText>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Version de l'application:</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Langues supportées:</ThemedText>
            <ThemedText style={styles.infoValue}>
              Français, Espagnol, Anglais, Maya Yucateco, K'iche', Kaqchikel
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Services de traduction:</ThemedText>
            <ThemedText style={styles.infoValue}>
              Google Translate (gratuit), OpenAI GPT-4 (clé requise)
            </ThemedText>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <ThemedText style={styles.buttonText}>💾 Sauvegarder</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearSettings}>
            <ThemedText style={styles.buttonText}>🗑️ Réinitialiser</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Test Configuration OpenAI */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🧪 Test Configuration OpenAI</ThemedText>
          
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testOpenAIConfiguration}
            disabled={isTestingAPI}
          >
            <ThemedText style={styles.buttonText}>
              {isTestingAPI ? '🔄 Test en cours...' : '✅ Tester la configuration'}
            </ThemedText>
          </TouchableOpacity>
        </View>        {/* Guide d'utilisation */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📖 Guide d'utilisation</ThemedText>
          <ThemedText style={styles.guideText}>
            1. Pour une traduction basique (français ↔ espagnol), aucune configuration n'est nécessaire.{'\n\n'}
            2. Pour les langues maya (K'iche', Kaqchikel, Maya Yucateco), il est recommandé d'obtenir une clé API OpenAI sur platform.openai.com.{'\n\n'}
            3. Activez le microphone pour la saisie vocale et les haut-parleurs pour écouter les traductions.{'\n\n'}
            4. L'application fonctionne hors ligne avec des traductions basiques de secours.
          </ThemedText>
        </View>

        {/* Phrases disponibles hors ligne */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📚 Phrases disponibles hors ligne</ThemedText>
          <ThemedText style={styles.guideText}>
            <ThemedText style={styles.categoryTitle}>Salutations :</ThemedText>{'\n'}
            • Bonjour / Bonsoir / Salut{'\n'}
            • Au revoir / À bientôt{'\n\n'}
            
            <ThemedText style={styles.categoryTitle}>Politesse :</ThemedText>{'\n'}
            • Merci / Merci beaucoup{'\n'}
            • S'il vous plaît / Excusez-moi{'\n'}
            • Oui / Non / Peut-être{'\n\n'}
            
            <ThemedText style={styles.categoryTitle}>Questions courantes :</ThemedText>{'\n'}
            • Comment allez-vous ?{'\n'}
            • Comment vous appelez-vous ?{'\n'}
            • Quel âge avez-vous ?{'\n\n'}
            
            <ThemedText style={styles.categoryTitle}>Besoins essentiels :</ThemedText>{'\n'}
            • Eau / Nourriture / Aide{'\n'}
            • Où / Quoi / Quand / Pourquoi{'\n\n'}
            
            <ThemedText style={styles.categoryTitle}>Expressions utiles :</ThemedText>{'\n'}
            • Je ne comprends pas{'\n'}
            • Parlez-vous français ?{'\n'}
            • Je suis français{'\n\n'}
            
            💡 <ThemedText style={styles.highlight}>Astuce :</ThemedText> Utilisez le bouton "🧪 Test" dans le traducteur pour essayer ces phrases !
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#007AFF',
  },
  settingItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#17A2B8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  guideText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  helpButton: {
    backgroundColor: '#6C757D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  helpButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
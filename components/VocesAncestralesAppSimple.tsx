import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert
} from 'react-native';

// Version simplifiée pour debug - pas d'imports Expo problématiques
export default function VocesAncestralesAppSimple() {  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang] = useState('fr');
  const [toLang] = useState('yua');

  const translateText = async () => {
    if (!sourceText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte à traduire');
      return;
    }
    
    setIsTranslating(true);
    try {
      const response = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: fromLang,
          to: toLang        })
      });

      if (response.ok) {
        const data = await response.json();
        setTargetText(data.translated);
      } else {
        setTargetText('Erreur de traduction - Vérifiez la connexion API');
        Alert.alert('Erreur', 'Problème de connexion à l\'API');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setTargetText('Erreur de connexion au serveur');
      Alert.alert('Erreur', 'Impossible de se connecter au serveur de traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const testVoice = () => {
    if (Platform.OS === 'web' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(targetText || 'Test de synthèse vocale');
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('Info', 'Synthèse vocale non disponible sur cette plateforme');
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTargetText('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maya Voice Translator</Text>
        <Text style={styles.subtitle}>Voces Ancestrales</Text>
      </View>      <View style={styles.inputSection}>
        <Text style={styles.label}>Texte à traduire:</Text>
        <TextInput
          style={styles.input}
          value={sourceText}
          onChangeText={setSourceText}
          placeholder="Entrez votre texte..."
          multiline
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.button, isTranslating && styles.buttonDisabled]}
          onPress={translateText}
          disabled={isTranslating}
        >
          <Text style={styles.buttonText}>
            {isTranslating ? 'Traduction...' : `Traduire ${fromLang} → ${toLang}`}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonSecondary} onPress={testVoice}>
            <Text style={styles.buttonSecondaryText}>🔊 Test Vocal</Text>          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={clearAll}>
            <Text style={styles.buttonSecondaryText}>🗑️ Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.outputSection}>
        <Text style={styles.label}>Traduction (Maya Yucatèque):</Text>
        <View style={styles.output}>
          <Text style={styles.outputText}>{targetText}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Maya Voice Translator v1.0{'\n'}
          Préservation des langues ancestrales
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  outputSection: {
    marginBottom: 30,
  },
  output: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    minHeight: 100,
  },
  outputText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

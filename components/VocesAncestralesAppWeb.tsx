import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';

// Version spécialement optimisée pour le web
export default function VocesAncestralesAppWeb() {  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang] = useState('fr');
  const [toLang] = useState('yua');

  const translateText = async () => {
    if (!sourceText.trim()) {
      alert('Veuillez entrer du texte à traduire');
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
          to: toLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTargetText(data.translated);
      } else {
        setTargetText('Erreur de traduction - Vérifiez la connexion API');
        alert('Problème de connexion à l\'API');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setTargetText('Erreur de connexion au serveur');
      alert('Impossible de se connecter au serveur de traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const testVoice = () => {
    if (targetText.trim()) {
      // Utiliser Web Speech API pour le web
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(targetText);
        utterance.lang = toLang === 'yua' ? 'es-MX' : toLang;
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Synthèse vocale non disponible dans ce navigateur');
      }
    } else {
      alert('Aucun texte à prononcer');
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTargetText('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏛️ Voces Ancestrales</Text>
        <Text style={styles.subtitle}>Traducteur Maya Moderne</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Texte source ({fromLang}):</Text>
        <TextInput
          style={styles.textInput}
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
            <Text style={styles.buttonSecondaryText}>🔊 Test Vocal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={clearAll}>
            <Text style={styles.buttonSecondaryText}>🗑️ Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.outputContainer}>
        <Text style={styles.label}>Traduction ({toLang}):</Text>
        <View style={styles.outputBox}>
          <Text style={styles.outputText}>
            {targetText || 'La traduction apparaîtra ici...'}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ℹ️ Application de traduction pour les langues maya
        </Text>
        <Text style={styles.infoSubText}>
          Version web optimisée • {Platform.OS}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  inputContainer: {
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  controlsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonSecondary: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  outputContainer: {
    margin: 20,
  },
  outputBox: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  outputText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 5,
  },
  infoSubText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

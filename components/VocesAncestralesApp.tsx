import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  Dimensions,
  Share,
  Vibration
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

// Services avancés
import IntegrationManager from '../services/IntegrationManager';

const { width, height } = Dimensions.get('window');

interface TranslationResult {
  text: string;
  language: string;
  confidence?: number;
  alternatives?: string[];
  method?: string;
  enhanced?: boolean;
  contextualResults?: any[];
}

interface VoiceRecognitionResult {
  text: string;
  confidence: number;
  language: string;
  enhanced?: boolean;
}

export default function VocesAncestralesApp() {
  // États principaux
  const [sourceText, setSourceText] = useState<string>('');
  const [targetText, setTargetText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('fr');
  const [targetLang, setTargetLang] = useState<string>('yua');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // États avancés
  const [systemReady, setSystemReady] = useState<boolean>(false);
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [translationHistory, setTranslationHistory] = useState<TranslationResult[]>([]);
  const [voiceRecognitionResult, setVoiceRecognitionResult] = useState<VoiceRecognitionResult | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [showSemanticSearch, setShowSemanticSearch] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [systemStats, setSystemStats] = useState<any>({});
  
  // Configuration
  const [useEnhancedFeatures, setUseEnhancedFeatures] = useState<boolean>(true);
  const [useVectorSearch, setUseVectorSearch] = useState<boolean>(true);
  const [useNeuralTTS, setUseNeuralTTS] = useState<boolean>(true);
  const [useNativeSpeechRecognition, setUseNativeSpeechRecognition] = useState<boolean>(true);
  
  // Références
  const integrationManager = useRef<IntegrationManager | null>(null);
  const audioRecording = useRef<Audio.Recording | null>(null);
  const translationAPI = useRef<any>(null);

  // Langues supportées avec détails
  const supportedLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', family: 'Indo-European' },
    { code: 'yua', name: 'Maya Yucateco', flag: '🇲🇽', family: 'Mayan' },
    { code: 'quc', name: 'K\'iche\'', flag: '🇬🇹', family: 'Mayan' },
    { code: 'qu', name: 'Quechua', flag: '🇵🇪', family: 'Quechuan' },
    { code: 'nah', name: 'Nahuatl', flag: '🇲🇽', family: 'Uto-Aztecan' },
    { code: 'gn', name: 'Guaraní', flag: '🇵🇾', family: 'Tupian' },
    { code: 'es', name: 'Español', flag: '🇪🇸', family: 'Indo-European' },
    { code: 'en', name: 'English', flag: '🇺🇸', family: 'Indo-European' },
    { code: 'cak', name: 'Kaqchikel', flag: '🇬🇹', family: 'Mayan' },
    { code: 'kek', name: 'Q\'eqchi\'', flag: '🇬🇹', family: 'Mayan' }
  ];

  // Initialisation du système
  useEffect(() => {
    initializeSystem();
    return () => {
      cleanup();
    };
  }, []);

  const initializeSystem = async () => {
    try {
      console.log('🚀 Initialisation du système avancé...');
      
      // Initialiser le gestionnaire d'intégration
      integrationManager.current = new IntegrationManager();
      
      // Configuration des services
      const config = {
        enableVectorSearch: useVectorSearch,
        enableNeuralTTS: useNeuralTTS,
        enableSpeechRecognition: useNativeSpeechRecognition,
        enableSecureAPIKeys: true,
        enableRedisCache: false, // Désactivé pour mobile
        fallbackModes: {
          offline: true,
          basicTTS: true,
          simpleDictionary: true
        }
      };

      await integrationManager.current.initialize(config);
      
      // Obtenir l'interface React Native
      translationAPI.current = integrationManager.current.getReactNativeInterface();
      
      // Écouter les événements système
      setupEventListeners();
      
      // Charger l'historique des traductions
      await loadTranslationHistory();
      
      // Mettre à jour les statistiques
      await updateSystemStats();
      
      setSystemReady(true);
      console.log('✅ Système initialisé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur d\'initialisation:', error);
      Alert.alert(
        'Erreur d\'initialisation',
        'Certaines fonctionnalités avancées peuvent ne pas être disponibles.',
        [{ text: 'Continuer', onPress: () => setSystemReady(true) }]
      );
    }
  };

  const setupEventListeners = () => {
    if (!integrationManager.current) return;

    integrationManager.current.on('translationCompleted', (result) => {
      console.log('📝 Traduction terminée:', result);
    });

    integrationManager.current.on('speechRecognitionResult', (result) => {
      console.log('🎤 Reconnaissance vocale:', result);
      setVoiceRecognitionResult(result);
    });

    integrationManager.current.on('ttsCompleted', (result) => {
      console.log('🔊 Synthèse vocale terminée:', result);
      setIsSpeaking(false);
    });

    integrationManager.current.on('healthCheck', (status) => {
      console.log('🏥 Vérification de santé:', status);
      updateSystemStats();
    });
  };

  // Traduction intelligente
  const translateText = async () => {
    if (!sourceText.trim() || !translationAPI.current) {
      Alert.alert('Erreur', 'Veuillez saisir du texte à traduire');
      return;
    }

    setIsTranslating(true);
    Vibration.vibrate(50);

    try {
      const startTime = Date.now();
      
      const result = await translationAPI.current.translate(
        sourceText,
        sourceLang,
        targetLang,
        {
          useVectorSearch: useVectorSearch,
          includeAlternatives: true,
          contextualSearch: true,
          cacheResults: true
        }
      );

      const translationTime = Date.now() - startTime;

      if (result.success) {
        setTargetText(result.result);
        
        // Ajouter à l'historique
        const historyEntry: TranslationResult = {
          text: result.result,
          language: targetLang,
          confidence: result.confidence,
          alternatives: result.alternatives,
          method: result.method,
          enhanced: result.enhancedWithAI
        };
        
        addToHistory(historyEntry);
        
        // Afficher les résultats contextuels si disponibles
        if (result.contextualResults && result.contextualResults.length > 0) {
          setSemanticResults(result.contextualResults);
        }
        
        console.log(`✅ Traduction réussie en ${translationTime}ms`);
        
      } else {
        Alert.alert('Erreur de traduction', result.error || 'Traduction échouée');
      }

    } catch (error) {
      console.error('❌ Erreur de traduction:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  // Reconnaissance vocale avancée
  const startVoiceRecognition = async () => {
    try {
      setIsRecording(true);
      
      // Demander les permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès au microphone est nécessaire');
        return;
      }

      // Configurer l'enregistrement
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      
      audioRecording.current = recording;
      
      console.log('🎤 Enregistrement démarré...');
      
    } catch (error) {
      console.error('❌ Erreur de reconnaissance vocale:', error);
      setIsRecording(false);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      if (!audioRecording.current) return;

      await audioRecording.current.stopAndUnloadAsync();
      const uri = audioRecording.current.getURI();
      
      setIsRecording(false);
      console.log('🎤 Enregistrement arrêté');

      if (uri && translationAPI.current) {
        // Lire les données audio
        const audioData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Reconnaissance avec le service avancé
        const result = await translationAPI.current.speechToText(
          audioData,
          sourceLang,
          {
            useNativeRecognition: useNativeSpeechRecognition,
            postProcess: true,
            validateResult: true
          }
        );

        if (result.success) {
          setSourceText(result.text);
          setVoiceRecognitionResult(result);
          
          // Traduire automatiquement si activé
          if (result.text.trim()) {
            setTimeout(() => translateText(), 500);
          }
        } else {
          Alert.alert('Erreur de reconnaissance', result.error || 'Reconnaissance échouée');
        }
      }

    } catch (error) {
      console.error('❌ Erreur d\'arrêt d\'enregistrement:', error);
      setIsRecording(false);
    } finally {
      audioRecording.current = null;
    }
  };

  // Synthèse vocale neurale
  const speakText = async (text: string, language: string) => {
    if (!text.trim()) return;

    try {
      setIsSpeaking(true);
      
      if (useNeuralTTS && translationAPI.current) {
        // Utiliser le service TTS neural
        const result = await translationAPI.current.textToSpeech(
          text,
          language,
          {
            useNeural: true,
            adaptToContext: true,
            cacheAudio: true
          }
        );

        if (result.success) {
          console.log('🔊 Synthèse vocale neurale réussie');
        } else {
          // Fallback vers TTS système
          await fallbackTTS(text, language);
        }
      } else {
        // TTS système direct
        await fallbackTTS(text, language);
      }

    } catch (error) {
      console.error('❌ Erreur de synthèse vocale:', error);
      await fallbackTTS(text, language);
    }
  };

  const fallbackTTS = async (text: string, language: string) => {
    try {
      const options = {
        language: language,
        pitch: 1.0,
        rate: 0.8, // Plus lent pour les langues indigènes
        quality: Speech.QUALITY_MAX,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.error('❌ Erreur TTS fallback:', error);
      setIsSpeaking(false);
    }
  };

  // Recherche sémantique
  const performSemanticSearch = async (query: string) => {
    if (!query.trim() || !translationAPI.current) return;

    try {
      const results = await translationAPI.current.search(
        query,
        sourceLang,
        {
          topK: 10,
          threshold: 0.7,
          crossLingual: true,
          includeTranslations: true
        }
      );

      setSemanticResults(results);
      setShowSemanticSearch(true);
      
    } catch (error) {
      console.error('❌ Erreur de recherche sémantique:', error);
    }
  };

  // Gestion de l'historique
  const addToHistory = async (translation: TranslationResult) => {
    const newHistory = [translation, ...translationHistory].slice(0, 100);
    setTranslationHistory(newHistory);
    
    try {
      await AsyncStorage.setItem('translation_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('❌ Erreur de sauvegarde historique:', error);
    }
  };

  const loadTranslationHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('translation_history');
      if (savedHistory) {
        setTranslationHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('❌ Erreur de chargement historique:', error);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Effacer l\'historique',
      'Êtes-vous sûr de vouloir effacer tout l\'historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            setTranslationHistory([]);
            await AsyncStorage.removeItem('translation_history');
          }
        }
      ]
    );
  };

  // Mise à jour des statistiques
  const updateSystemStats = async () => {
    if (translationAPI.current) {
      const stats = translationAPI.current.getStats();
      setSystemStats(stats);
    }
  };

  // Partage
  const shareTranslation = async () => {
    if (!targetText) return;

    const shareContent = {
      message: `${sourceText} (${getLanguageName(sourceLang)}) → ${targetText} (${getLanguageName(targetLang)})\n\nTraduit avec Maya Voice Translator`,
      title: 'Traduction Maya'
    };

    try {
      await Share.share(shareContent);
    } catch (error) {
      console.error('❌ Erreur de partage:', error);
    }
  };

  // Utilitaires
  const getLanguageName = (code: string): string => {
    return supportedLanguages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string): string => {
    return supportedLanguages.find(lang => lang.code === code)?.flag || '🌐';
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    const tempText = sourceText;
    
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(targetText);
    setTargetText(tempText);
    
    Vibration.vibrate(30);
  };

  const cleanup = () => {
    if (audioRecording.current) {
      audioRecording.current.stopAndUnloadAsync();
    }
    if (integrationManager.current) {
      // Cleanup des services
    }
  };

  if (!systemReady) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>
          Initialisation du système avancé...
        </ThemedText>
        <ThemedText style={styles.loadingSubtext}>
          Chargement des services IA, reconnaissance vocale et synthèse neurale
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🗣️ Maya Voice Translator
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Voces Ancestrales - IA Avancée
        </ThemedText>
        
        {/* Indicateurs de statut */}
        <View style={styles.statusIndicators}>
          <View style={[styles.indicator, useVectorSearch && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>🧠</Text>
          </View>
          <View style={[styles.indicator, useNeuralTTS && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>🎤</Text>
          </View>
          <View style={[styles.indicator, useNativeSpeechRecognition && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>👂</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sélection de langues */}
        <View style={styles.languageSelector}>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => {/* Ouvrir sélecteur */}}
          >
            <Text style={styles.languageFlag}>{getLanguageFlag(sourceLang)}</Text>
            <ThemedText style={styles.languageName}>{getLanguageName(sourceLang)}</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => {/* Ouvrir sélecteur */}}
          >
            <Text style={styles.languageFlag}>{getLanguageFlag(targetLang)}</Text>
            <ThemedText style={styles.languageName}>{getLanguageName(targetLang)}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Zone de saisie source */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <ThemedText style={styles.inputLabel}>Texte à traduire</ThemedText>
            <TouchableOpacity 
              style={styles.micButton}
              onPress={isRecording ? stopVoiceRecognition : startVoiceRecognition}
            >
              <Text style={[styles.micIcon, isRecording && styles.micActive]}>
                {isRecording ? '⏹️' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.textInput}
            multiline
            value={sourceText}
            onChangeText={setSourceText}
            placeholder="Saisissez votre texte ici ou utilisez la reconnaissance vocale..."
            placeholderTextColor="#999"
          />
          
          {voiceRecognitionResult && (
            <View style={styles.recognitionResult}>
              <ThemedText style={styles.recognitionText}>
                🎤 Reconnu: {voiceRecognitionResult.confidence.toFixed(2)} confiance
              </ThemedText>
            </View>
          )}
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.translateButton, isTranslating && styles.translateButtonDisabled]}
            onPress={translateText}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ThemedText style={styles.translateButtonText}>🔄 Traduire</ThemedText>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => performSemanticSearch(sourceText)}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Zone de résultat */}
        {targetText ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <ThemedText style={styles.resultLabel}>Traduction</ThemedText>
              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.speakButton}
                  onPress={() => speakText(targetText, targetLang)}
                  disabled={isSpeaking}
                >
                  <Text style={styles.speakIcon}>{isSpeaking ? '⏸️' : '🔊'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={shareTranslation}>
                  <Text style={styles.shareIcon}>📤</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.resultText}>
              <ThemedText style={styles.translatedText}>{targetText}</ThemedText>
            </View>
          </View>
        ) : null}

        {/* Résultats contextuels */}
        {semanticResults.length > 0 && (
          <View style={styles.contextualResults}>
            <ThemedText style={styles.contextualTitle}>🧠 Résultats contextuels</ThemedText>
            {semanticResults.slice(0, 3).map((result, index) => (
              <TouchableOpacity key={index} style={styles.contextualItem}>
                <ThemedText style={styles.contextualText}>{result.text}</ThemedText>
                <ThemedText style={styles.contextualLang}>
                  {getLanguageFlag(result.language)} {result.similarity?.toFixed(2)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Options avancées */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <ThemedText style={styles.advancedToggleText}>
            ⚙️ Options avancées {showAdvancedOptions ? '▼' : '▶'}
          </ThemedText>
        </TouchableOpacity>

        {showAdvancedOptions && (
          <View style={styles.advancedOptions}>
            <View style={styles.optionRow}>
              <ThemedText style={styles.optionLabel}>🧠 Recherche vectorielle</ThemedText>
              <TouchableOpacity
                style={[styles.toggle, useVectorSearch && styles.toggleActive]}
                onPress={() => setUseVectorSearch(!useVectorSearch)}
              >
                <ThemedText style={styles.toggleText}>
                  {useVectorSearch ? 'ON' : 'OFF'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionRow}>
              <ThemedText style={styles.optionLabel}>🎤 TTS Neural</ThemedText>
              <TouchableOpacity
                style={[styles.toggle, useNeuralTTS && styles.toggleActive]}
                onPress={() => setUseNeuralTTS(!useNeuralTTS)}
              >
                <ThemedText style={styles.toggleText}>
                  {useNeuralTTS ? 'ON' : 'OFF'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionRow}>
              <ThemedText style={styles.optionLabel}>👂 Reconnaissance native</ThemedText>
              <TouchableOpacity
                style={[styles.toggle, useNativeSpeechRecognition && styles.toggleActive]}
                onPress={() => setUseNativeSpeechRecognition(!useNativeSpeechRecognition)}
              >
                <ThemedText style={styles.toggleText}>
                  {useNativeSpeechRecognition ? 'ON' : 'OFF'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Statistiques système */}
        {Object.keys(systemStats).length > 0 && (
          <View style={styles.systemStats}>
            <ThemedText style={styles.statsTitle}>📊 Statistiques système</ThemedText>
            <ThemedText style={styles.statsText}>
              Services: {systemStats.services?.length || 0} • 
              Performance: {systemStats.performance?.averageResponseTime?.toFixed(0) || 0}ms
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <Modal visible={showHistory} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">📚 Historique</ThemedText>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.historyList}>
            {translationHistory.map((item, index) => (
              <TouchableOpacity key={index} style={styles.historyItem}>
                <ThemedText style={styles.historyText}>{item.text}</ThemedText>
                <ThemedText style={styles.historyLang}>
                  {getLanguageFlag(item.language)} {item.confidence?.toFixed(2)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {translationHistory.length > 0 && (
            <TouchableOpacity style={styles.clearHistoryButton} onPress={clearHistory}>
              <Text style={styles.clearHistoryText}>🗑️ Effacer l'historique</Text>
            </TouchableOpacity>
          )}
        </ThemedView>
      </Modal>

      <Modal visible={showSemanticSearch} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">🔍 Recherche sémantique</ThemedText>
            <TouchableOpacity onPress={() => setShowSemanticSearch(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.searchResults}>
            {semanticResults.map((result, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.searchResultItem}
                onPress={() => {
                  setSourceText(result.text);
                  setShowSemanticSearch(false);
                }}
              >
                <ThemedText style={styles.searchResultText}>{result.text}</ThemedText>
                <View style={styles.searchResultMeta}>
                  <ThemedText style={styles.searchResultLang}>
                    {getLanguageFlag(result.language)} {getLanguageName(result.language)}
                  </ThemedText>
                  <ThemedText style={styles.searchResultScore}>
                    {(result.similarity * 100).toFixed(0)}%
                  </ThemedText>
                </View>
                {result.translation && (
                  <ThemedText style={styles.searchResultTranslation}>
                    → {result.translation}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      </Modal>

      {/* Barre d'état en bas */}
      <View style={styles.statusBar}>
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={() => setShowHistory(true)}
        >
          <Text style={styles.statusIcon}>📚</Text>
          <ThemedText style={styles.statusText}>{translationHistory.length}</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={updateSystemStats}
        >
          <Text style={styles.statusIcon}>📊</Text>
          <ThemedText style={styles.statusText}>Stats</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={() => performSemanticSearch(sourceText)}
        >
          <Text style={styles.statusIcon}>🔍</Text>
          <ThemedText style={styles.statusText}>Recherche</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Conteneurs principaux
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // En-tête
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E6F3FF',
    marginBottom: 12,
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  indicatorText: {
    fontSize: 16,
  },

  // Textes de chargement
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Sélecteur de langues
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  languageName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  swapButton: {
    marginHorizontal: 12,
    padding: 8,
  },
  swapIcon: {
    fontSize: 24,
    color: '#007AFF',
  },

  // Section de saisie
  inputSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  micButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  micIcon: {
    fontSize: 20,
  },
  micActive: {
    color: '#FF3B30',
  },
  textInput: {
    minHeight: 80,
    maxHeight: 150,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
    color: '#333',
  },
  recognitionResult: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E6F3FF',
    borderRadius: 8,
  },
  recognitionText: {
    fontSize: 12,
    color: '#007AFF',
  },

  // Boutons d'action
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  translateButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  translateButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  translateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#28A745',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },

  // Section de résultat
  resultSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  speakButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  speakIcon: {
    fontSize: 20,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  shareIcon: {
    fontSize: 20,
  },
  resultText: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },

  // Résultats contextuels
  contextualResults: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contextualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contextualItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  contextualText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  contextualLang: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },

  // Options avancées
  advancedToggle: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  advancedOptions: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    minWidth: 50,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Statistiques système
  systemStats: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },

  // Modals
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#007AFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Historique
  historyList: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  historyLang: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  clearHistoryButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearHistoryText: {
    color: '#FFF',
    fontWeight: '600',
  },

  // Résultats de recherche
  searchResults: {
    flex: 1,
    padding: 16,
  },
  searchResultItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  searchResultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchResultLang: {
    fontSize: 12,
    color: '#666',
  },
  searchResultScore: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  searchResultTranslation: {
    fontSize: 12,
    color: '#28A745',
    fontStyle: 'italic',
  },

  // Barre d'état
  statusBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 34 : 8,
  },
  statusButton: {
    flex: 1,    alignItems: 'center',
    padding: 8,
  },
  statusIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
});

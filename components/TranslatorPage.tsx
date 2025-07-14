import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import indigenousTTS from '../services/IndigenousTTSService';
import nativeSpeechRecognition from '../services/NativeSpeechRecognitionWebService';
import { localizationService, t } from '../services/LocalizationService';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation, useResponsive, usePerformance } from '../hooks';
import SemanticSuggestions from './SemanticSuggestions';

interface TranslatorPageProps {
  onNavigate: (page: string) => void;
}

// Optimized languages data with useMemo
const getLanguages = () => [
  { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' },
  { code: 'es', name: t('languages.es'), flag: '🇪🇸' },
  { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
  { code: 'yua', name: t('languages.yua'), flag: '🇲🇽' },
  { code: 'qu', name: t('languages.qu'), flag: '🇵🇪' },
  { code: 'gn', name: t('languages.gn'), flag: '🇵🇾' },
  { code: 'nah', name: t('languages.nah'), flag: '🇲🇽' },
  { code: 'ay', name: t('languages.ay'), flag: '🇧🇴' }
];

const TranslatorPage = memo(function TranslatorPage({ onNavigate }: TranslatorPageProps) {
  // Context integration
  const { state, dispatch } = useAppContext();
  
  // Custom hooks
  const { dimensions, breakpoints } = useResponsive();
  const { isTablet, isDesktop } = breakpoints;
  const { measureOperation, logPerformanceWarning } = usePerformance();
  
  // Memoized languages
  const languages = useMemo(() => getLanguages(), []);
  
  // Local state (optimized)
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang, setFromLang] = useState('fr');
  const [toLang, setToLang] = useState('yua');
  const [ttsReady, setTtsReady] = useState(false);
  const [isPlayingSource, setIsPlayingSource] = useState(false);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [speechRecognitionReady, setSpeechRecognitionReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');

  // Initialiser les services TTS et reconnaissance vocale
  useEffect(() => {
    const initializeServices = async () => {
      const ttsSuccess = await indigenousTTS.initialize();
      setTtsReady(ttsSuccess);
      
      const speechSuccess = await nativeSpeechRecognition.initialize();
      setSpeechRecognitionReady(speechSuccess);
        // Configurer les callbacks de reconnaissance vocale
      nativeSpeechRecognition.setCallbacks({
        onResult: (result: any) => {
          console.log('🎤 Résultat reconnaissance:', result);
          setSourceText(result.transcript);
          setIsListening(false);
          
          // Auto-traduction après reconnaissance
          if (result.transcript.trim().length > 0) {
            setTimeout(() => translateText(), 500);
          }
        },
        onError: (error: any) => {
          console.error('❌ Erreur reconnaissance:', error);
          setIsListening(false);
          Alert.alert('Erreur de reconnaissance', error.message);
        },
        onStart: () => {
          console.log('🎤 Reconnaissance démarrée');
          setIsListening(true);
        },
        onEnd: () => {
          console.log('🎤 Reconnaissance terminée');
          setIsListening(false);
        }
      });
    };
    initializeServices();
  }, []);
  // Dictionnaire de démonstration pour la traduction (bidirectionnel)
  const baseDictionary: { [key: string]: { [key: string]: string } } = {
    // Français vers Maya Yucatèque
    'fr_yua': {
      'bonjour': 'ba\'ax ka wa\'alik',
      'merci': 'níib óolal',
      'au revoir': 'háach winikech',
      'comment allez-vous': 'bix a beel',
      'oui': 'héen',
      'non': 'ma\'',
      'famille': 'otoch',
      'eau': 'ja\'',
      'nourriture': 'janal',
      'maison': 'naj',
      'amour': 'yaakunaj',
      'enfant': 'paal',
      'mère': 'naa',
      'père': 'taata',
      'ami': 'ich',
      'paix': 'jets\'ool'
    },
    // Français vers Quechua
    'fr_qu': {
      'bonjour': 'rimaykullayki',
      'merci': 'añay',
      'au revoir': 'tupananchiskama',
      'oui': 'arí',
      'non': 'mana',
      'famille': 'ayllu',
      'eau': 'unu',
      'maison': 'wasi',
      'amour': 'kuyay',
      'enfant': 'wawa',
      'mère': 'mama',
      'père': 'tayta',
      'ami': 'amiku',
      'paix': 'hawka'
    },
    // Français vers Guarani
    'fr_gn': {
      'bonjour': 'mba\'éichapa',
      'merci': 'aguyje',
      'au revoir': 'jajoecha peve',
      'oui': 'heẽ',
      'non': 'nahániri',
      'famille': 'téta',
      'eau': 'y',
      'maison': 'óga',
      'amour': 'mborayhu',
      'enfant': 'mitã',
      'mère': 'sy',
      'père': 'ru',
      'ami': 'angirũ',
      'paix': 'py\'aguapy'
    },
    // Français vers Nahuatl
    'fr_nah': {
      'bonjour': 'niltze',
      'merci': 'tlazocamati',
      'au revoir': 'oc ceppa',
      'oui': 'quema',
      'non': 'ahmo',
      'famille': 'tepozhuatl',
      'eau': 'atl',
      'maison': 'calli',
      'amour': 'tlazohtlaliztli',
      'enfant': 'pilli',
      'mère': 'nantli',
      'père': 'tahtli'
    },
    // Français vers Aymara
    'fr_ay': {
      'bonjour': 'kamisaki',
      'merci': 'yuspagara',
      'au revoir': 'jakañkama',
      'oui': 'jïsa',
      'non': 'janiwa',
      'famille': 'familia',
      'eau': 'uma',
      'maison': 'uta',
      'amour': 'munaña',
      'enfant': 'wawa',
      'mère': 'tayka',
      'père': 'awki'
    }
  };

  // Générer automatiquement les traductions inverses
  const generateReverseDictionary = () => {
    const reversedDict: { [key: string]: { [key: string]: string } } = {};
    
    Object.keys(baseDictionary).forEach(key => {
      const [from, to] = key.split('_');
      const reverseKey = `${to}_${from}`;
      
      reversedDict[reverseKey] = {};
      Object.entries(baseDictionary[key]).forEach(([source, target]) => {
        reversedDict[reverseKey][target] = source;
      });
    });
    
    return reversedDict;
  };

  // Dictionnaire complet avec directions inverses
  // Demo translations dictionary (memoized)
  const demoTranslations = useMemo(() => ({ ...baseDictionary, ...generateReverseDictionary() }), []);
  
  // Optimized translation function with useCallback
  const translateText = useCallback(async () => {
    if (!sourceText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte à traduire');
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Essayer d'abord l'API serveur
      console.log('🔄 Tentative de traduction via API...');
      
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
        
        if (data.success) {
          console.log('✅ Traduction API réussie:', data.translation);
          setTargetText(data.translation);
          
          // Afficher des informations supplémentaires si disponibles
          if (data.method === 'dictionary_partial' && data.original_match) {
            setTargetText(`${data.translation}\n\n💡 Correspondance trouvée pour: "${data.original_match}"`);
          }
        } else {
          // API n'a pas trouvé de traduction, afficher suggestions
          console.log('📝 Aucune traduction trouvée, suggestions:', data.suggestions);
          const suggestionsText = data.suggestions ? 
            `\n\n💡 Essayez: ${data.suggestions.slice(0, 3).join(', ')}` : '';
          setTargetText(`${data.translation}${suggestionsText}`);
        }
      } else {
        throw new Error('Erreur de réponse API');
      }
        } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.warn('⚠️ API non disponible, utilisation du dictionnaire local:', errorMessage);
      
      // Fallback vers le dictionnaire local amélioré
      const translationKey = `${fromLang}_${toLang}`;
      const text = sourceText.toLowerCase().trim();
      
      // Dictionnaire de secours étendu avec toutes les directions
      const localDictionary: { [key: string]: { [key: string]: string } } = {};
      
      // Copier le dictionnaire principal pour le fallback
      Object.keys(demoTranslations).forEach(key => {
        localDictionary[key] = { ...demoTranslations[key] };
      });
      
      if (localDictionary[translationKey] && localDictionary[translationKey][text]) {
        setTargetText(`${localDictionary[translationKey][text]}\n\n📡 Mode hors ligne - Connectez-vous pour plus de traductions`);
      } else {
        // Recherche partielle dans le dictionnaire
        const possibleMatches = Object.keys(localDictionary[translationKey] || {}).filter(key => 
          key.includes(text) || text.includes(key)
        );
        
        if (possibleMatches.length > 0) {
          const bestMatch = possibleMatches[0];
          const translation = localDictionary[translationKey][bestMatch];
          setTargetText(`${translation}\n\n� Correspondance partielle pour: "${bestMatch}"\n📡 Mode hors ligne`);
        } else {
          const langNames = {
            'fr': 'français', 'es': 'espagnol', 'en': 'anglais',
            'yua': 'maya yucatèque', 'qu': 'quechua', 'gn': 'guarani',
            'nah': 'nahuatl', 'ay': 'aymara'
          };
          
          const fromLangName = langNames[fromLang as keyof typeof langNames] || fromLang;
          const toLangName = langNames[toLang as keyof typeof langNames] || toLang;
          
          // Suggestion de mots disponibles pour cette direction
          const availableWords = Object.keys(localDictionary[translationKey] || {}).slice(0, 5);
          const wordsText = availableWords.length > 0 ? 
            `\n💡 Mots disponibles: ${availableWords.join(', ')}` : 
            '\n💡 Essayez: bonjour, merci, famille, eau, maison';
          
          setTargetText(`[Traduction ${fromLangName} → ${toLangName}]\n"${sourceText}"\n\n📱 Mode hors ligne limité${wordsText}\n\n🌐 Démarrez le serveur API pour plus de traductions`);
        }
      }
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, fromLang, toLang, demoTranslations]);

  // Audio playback functions (optimized with useCallback)
  const playSourceText = useCallback(async () => {
    if (!ttsReady || !sourceText.trim()) return;
    
    if (isPlayingSource) {
      indigenousTTS.stop();
      setIsPlayingSource(false);
      return;
    }

    setIsPlayingSource(true);
    try {
      await measureOperation(
        async () => indigenousTTS.speak(sourceText, fromLang),
        'source_text_tts'
      );
    } catch (error) {
      console.error('Erreur synthèse source:', error);
    } finally {
      setIsPlayingSource(false);
    }
  }, [ttsReady, sourceText, isPlayingSource, fromLang, measureOperation]);

  const playTargetText = useCallback(async () => {
    if (!ttsReady || !targetText.trim()) return;
    
    if (isPlayingTarget) {
      indigenousTTS.stop();
      setIsPlayingTarget(false);
      return;
    }

    setIsPlayingTarget(true);
    try {
      await measureOperation(
        async () => indigenousTTS.speak(targetText, toLang),
        'target_text_tts'
      );
    } catch (error) {
      console.error('Erreur synthèse cible:', error);
    } finally {
      setIsPlayingTarget(false);
    }
  }, [ttsReady, targetText, isPlayingTarget, toLang, measureOperation]);

  // Language swap function (optimized)
  const swapLanguages = useCallback(() => {
    const tempLang = fromLang;
    setFromLang(toLang);
    setToLang(tempLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  }, [fromLang, toLang, targetText, sourceText]);

  // Language display function (memoized)
  const getLanguageDisplay = useCallback((code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  }, [languages]);

  // Translation availability functions (memoized)
  const isTranslationAvailable = useCallback((from: string, to: string) => {
    const translationKey = `${from}_${to}`;
    return demoTranslations[translationKey] && Object.keys(demoTranslations[translationKey]).length > 0;
  }, [demoTranslations]);

  // Get translation status (memoized)
  const getTranslationStatus = useCallback(() => {
    const available = isTranslationAvailable(fromLang, toLang);
    const reverseAvailable = isTranslationAvailable(toLang, fromLang);
    
    if (available && reverseAvailable) {
      return { status: 'bidirectional', icon: '↔️', color: '#22c55e' };
    } else if (available) {
      return { status: 'unidirectional', icon: '→', color: '#f59e0b' };
    } else if (reverseAvailable) {
      return { status: 'reverse-only', icon: '←', color: '#f59e0b' };
    } else {
      return { status: 'unavailable', icon: '❌', color: '#ef4444' };
    }
  }, [fromLang, toLang, isTranslationAvailable]);

  // Speech recognition function (optimized)
  const startSpeechRecognition = useCallback(async () => {
    try {
      if (!speechRecognitionReady) {
        Alert.alert(
          'Reconnaissance vocale indisponible',
          'Le service de reconnaissance vocale n\'est pas disponible sur cet appareil.'
        );
        return;
      }

      if (isListening) {
        // Arrêter la reconnaissance
        nativeSpeechRecognition.stopListening();
        setIsListening(false);
      } else {
        // Démarrer la reconnaissance
        Alert.alert(
          '🎤 Reconnaissance Vocale',
          `Prêt à écouter en ${getLanguageDisplay(fromLang)}.\n\nAppuyez sur OK puis parlez clairement.`,
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Démarrer',
              onPress: async () => {
                const success = await nativeSpeechRecognition.startListening(fromLang);
                if (!success) {
                  Alert.alert('Erreur', 'Impossible de démarrer la reconnaissance vocale');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Erreur reconnaissance vocale:', error);
      Alert.alert('Erreur', 'Problème avec la reconnaissance vocale');
    }
  }, [speechRecognitionReady, isListening, fromLang]);

  // Responsive styles (memoized)
  const responsiveStyles = useMemo(() => {
    const isLargeScreen = isTablet || isDesktop;
    return {
      container: isLargeScreen ? { maxWidth: 800, alignSelf: 'center' as const } : {},
      textInput: { fontSize: isLargeScreen ? 18 : 16 },
      button: { 
        paddingHorizontal: isLargeScreen ? 24 : 20,
        paddingVertical: isLargeScreen ? 16 : 12 
      }
    };
  }, [isTablet, isDesktop]);

  return (
    <ScrollView 
      style={[styles.container, responsiveStyles.container]} 
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.backButtonText}>← {t('home')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('translation.title')}</Text>
        <Text style={styles.subtitle}>{t('translation.subtitle')}</Text>
      </View>

      {/* Language Selector */}
      <View style={styles.languageSection}>
        {/* Indicateur de statut de traduction */}
        <View style={styles.translationStatus}>
          <Text style={[styles.statusText, { color: getTranslationStatus().color }]}>
            {getTranslationStatus().icon} {
              getTranslationStatus().status === 'bidirectional' ? 'Traduction bidirectionnelle disponible' :
              getTranslationStatus().status === 'unidirectional' ? 'Traduction dans un sens disponible' :
              getTranslationStatus().status === 'reverse-only' ? 'Traduction inverse disponible (utilisez ⇄)' :
              'Traduction limitée - Essayez d\'autres langues'
            }
          </Text>
        </View>
        
        <View style={styles.languageContainer}>
          {/* Source Language */}
          <View style={styles.languageColumn}>
            <Text style={styles.languageLabel}>De :</Text>
            <View style={styles.languageGrid}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    fromLang === lang.code && styles.selectedLanguage
                  ]}
                  onPress={() => setFromLang(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageText,
                    fromLang === lang.code && styles.selectedLanguageText
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          {/* Target Language */}
          <View style={styles.languageColumn}>
            <Text style={styles.languageLabel}>Vers :</Text>
            <View style={styles.languageGrid}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    toLang === lang.code && styles.selectedLanguage
                  ]}
                  onPress={() => setToLang(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageText,
                    toLang === lang.code && styles.selectedLanguageText
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Translation Interface */}
      <View style={styles.translationSection}>        <View style={styles.inputSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {getLanguageDisplay(fromLang)}
            </Text>
            <View style={styles.inputActions}>
              {speechRecognitionReady && (
                <TouchableOpacity
                  style={[styles.micButton, isListening && styles.micButtonActive]}
                  onPress={startSpeechRecognition}
                >
                  <Text style={styles.micButtonText}>
                    {isListening ? '🛑' : '🎤'}
                  </Text>
                </TouchableOpacity>
              )}
              {ttsReady && sourceText.trim() && (
                <TouchableOpacity
                  style={[styles.speakerButton, isPlayingSource && styles.speakerButtonActive]}
                  onPress={playSourceText}
                >
                  <Text style={styles.speakerButtonText}>
                    {isPlayingSource ? '⏸️' : '🔊'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={sourceText}
            onChangeText={setSourceText}
            placeholder="Tapez votre texte ici..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.translateButton, isTranslating && styles.translatingButton]}
          onPress={translateText}
          disabled={isTranslating}
        >
          <Text style={styles.translateButtonText}>
            {isTranslating ? `🔄 ${t('translation.translating')}` : `🗣️ ${t('translation.translate')}`}
          </Text>
        </TouchableOpacity>        <View style={styles.outputSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {getLanguageDisplay(toLang)}
            </Text>
            {ttsReady && targetText.trim() && !targetText.includes('[Traduction') && (
              <TouchableOpacity
                style={[styles.speakerButton, isPlayingTarget && styles.speakerButtonActive]}
                onPress={playTargetText}
              >
                <Text style={styles.speakerButtonText}>
                  {isPlayingTarget ? '⏸️' : '🔊'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {targetText || 'La traduction apparaîtra ici...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Examples */}
      <View style={styles.examplesSection}>
        <Text style={styles.examplesTitle}>💡 Exemples pour {getLanguageDisplay(fromLang)}</Text>
        <View style={styles.examplesList}>
          {(() => {
            const translationKey = `${fromLang}_${toLang}`;
            const availableWords = demoTranslations[translationKey] ? 
              Object.keys(demoTranslations[translationKey]).slice(0, 4) : 
              ['Bonjour', 'Merci', 'Au revoir', 'Famille'];
            
            return availableWords.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleButton}
                onPress={() => setSourceText(example)}
              >
                <Text style={styles.exampleText}>{example}</Text>
                {demoTranslations[translationKey] && demoTranslations[translationKey][example.toLowerCase()] && (
                  <Text style={styles.exampleTranslation}>
                    → {demoTranslations[translationKey][example.toLowerCase()]}
                  </Text>
                )}
              </TouchableOpacity>
            ));
          })()}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8'
  },
  contentContainer: {
    paddingBottom: 40
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
    elevation: 8
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
    padding: 10
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#f0f8ff',
    opacity: 0.9
  },
  languageSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)'
  },
  translationStatus: {
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15
  },
  languageColumn: {
    flex: 1
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  languageRow: {
    gap: 15
  },
  languageSelector: {
    flex: 1
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 10
  },
  languageScroll: {
    maxHeight: 50
  },
  languageButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 65,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)'
  },
  selectedLanguage: {
    backgroundColor: '#667eea',
    borderColor: '#667eea'
  },
  languageFlag: {
    fontSize: 20,
    marginBottom: 4
  },
  languageText: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12
  },
  selectedLanguageText: {
    color: '#ffffff'
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#fb923c',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
    elevation: 6
  },
  swapIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  translationSection: {
    margin: 15,
    gap: 15
  },
  inputSection: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3
  },
  outputSection: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 10
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    color: '#333'
  },
  translateButton: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    boxShadow: '0px 6px 12px rgba(0,0,0,0.3)',
    elevation: 8
  },
  translatingButton: {
    backgroundColor: '#a0aec0'
  },
  translateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  resultContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)'
  },
  resultText: {
    fontSize: 16,
    color: '#22543d',
    lineHeight: 24
  },
  examplesSection: {
    margin: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15
  },
  examplesList: {
    gap: 10
  },
  exampleButton: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2c5aa0'
  },  exampleText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4
  },
  exampleTranslation: {
    fontSize: 12,
    color: '#667eea',
    fontStyle: 'italic'
  },  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8
  },
  micButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
    marginRight: 8
  },
  micButtonActive: {
    backgroundColor: '#c0392b',
    transform: [{ scale: 1.1 }]
  },
  micButtonText: {
    fontSize: 16,
    color: '#ffffff'
  },
  speakerButton: {
    backgroundColor: '#2c5aa0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center'
  },
  speakerButtonActive: {
    backgroundColor: '#e74c3c'
  },
  speakerButtonText: {
    fontSize: 16,
    color: '#ffffff'
  }
});

export default TranslatorPage;
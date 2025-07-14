import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import indigenousTTS from '../services/IndigenousTTSService';

interface VoicesPageProps {
  onNavigate: (page: string) => void;
}

const voices = [
  {
    language: 'Maya Yucatèque',
    flag: '🇲🇽',
    code: 'yua',
    samples: [
      { text: 'Bix a beel?', translation: 'Comment ça va ?' },
      { text: 'Yum bóotik', translation: 'Merci beaucoup' },
      { text: 'Mixba\'al', translation: 'Au revoir' }
    ]
  },
  {
    language: 'Quechua',
    flag: '🇵🇪',
    code: 'qu',
    samples: [
      { text: 'Imaynalla kashkanki?', translation: 'Comment ça va ?' },
      { text: 'Añay', translation: 'Merci' },
      { text: 'Ripukusaq', translation: 'Au revoir' }
    ]
  },
  {
    language: 'Guarani',
    flag: '🇵🇾',
    code: 'gn',
    samples: [
      { text: 'Mbaéichapa reiko?', translation: 'Comment ça va ?' },
      { text: 'Aguyjé', translation: 'Merci' },
      { text: 'Jajoecha peve', translation: 'Au revoir' }
    ]
  },
  {
    language: 'Nahuatl',
    flag: '🇲🇽',
    code: 'nah',
    samples: [
      { text: 'Quen tinemi?', translation: 'Comment ça va ?' },
      { text: 'Tlazocamati', translation: 'Merci' },
      { text: 'Moztla', translation: 'À demain' }
    ]
  }
];

export default function VoicesPage({ onNavigate }: VoicesPageProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [ttsReady, setTtsReady] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initialiser le service TTS au chargement du composant
  useEffect(() => {
    const initializeTTS = async () => {
      try {
        const success = await indigenousTTS.initialize();
        setTtsReady(success);
        
        if (!success) {
          Alert.alert(
            'Synthèse Vocale',
            'La synthèse vocale n\'est pas disponible sur ce appareil ou navigateur. Vous pouvez toujours voir les traductions.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Erreur initialisation TTS:', error);
        setTtsReady(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeTTS();

    // Cleanup au démontage du composant
    return () => {
      if (indigenousTTS.isSpeaking()) {
        indigenousTTS.stop();
      }
    };
  }, []);

  const playAudio = async (text: string, languageCode: string, languageName: string) => {
    if (!ttsReady) {
      Alert.alert(
        'Synthèse Vocale Indisponible',
        'La synthèse vocale n\'est pas supportée sur cet appareil.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Arrêter toute lecture en cours
    if (playingAudio) {
      indigenousTTS.stop();
      setPlayingAudio(null);
      return;
    }

    setPlayingAudio(text);
    
    try {
      console.log(`🎤 Lecture de "${text}" en ${languageName} (${languageCode})`);
      
      const success = await indigenousTTS.speak(text, languageCode);
      
      if (!success) {
        Alert.alert(
          'Erreur Audio',
          'Impossible de synthétiser la voix pour cette langue.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Erreur synthèse vocale:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la synthèse vocale.',
        [{ text: 'OK' }]
      );
    } finally {
      setPlayingAudio(null);
    }
  };

  const stopAudio = () => {
    indigenousTTS.stop();
    setPlayingAudio(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.backButtonText}>← Accueil</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Voces Ancestrales</Text>
        <Text style={styles.subtitle}>Écoutez les langues autochtones</Text>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🎵 Synthèse Vocale Authentique</Text>
        <Text style={styles.infoText}>
          Découvrez la beauté sonore des langues autochtones grâce à notre 
          technologie de synthèse vocale développée en collaboration avec 
          les communautés natives.
        </Text>
      </View>

      {/* Voices Grid */}
      <View style={styles.voicesSection}>
        {voices.map((voice, index) => (
          <View key={index} style={styles.voiceCard}>
            <View style={styles.voiceHeader}>
              <Text style={styles.voiceFlag}>{voice.flag}</Text>
              <Text style={styles.voiceLanguage}>{voice.language}</Text>
            </View>

            <View style={styles.samplesContainer}>
              {voice.samples.map((sample, sampleIndex) => (
                <View key={sampleIndex} style={styles.sampleItem}>
                  <View style={styles.sampleTextContainer}>
                    <Text style={styles.sampleText}>{sample.text}</Text>
                    <Text style={styles.sampleTranslation}>"{sample.translation}"</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.playButton,
                      playingAudio === sample.text && styles.playingButton
                    ]}
                    onPress={() => playAudio(sample.text, voice.code, voice.language)}
                    disabled={playingAudio === sample.text}
                  >
                    <Text style={styles.playButtonText}>
                      {playingAudio === sample.text ? '⏸️' : '▶️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>✨ Fonctionnalités à venir</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎤</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Enregistrement Personnel</Text>
              <Text style={styles.featureDescription}>
                Enregistrez votre propre voix pour contribuer à l'amélioration du modèle
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Qualité Audio HD</Text>
              <Text style={styles.featureDescription}>
                Synthèse vocale haute définition avec intonations naturelles
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📚</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Bibliothèque Étendue</Text>
              <Text style={styles.featureDescription}>
                Plus de 50 langues autochtones des Amériques bientôt disponibles
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Community Section */}
      <View style={styles.communitySection}>
        <Text style={styles.communityTitle}>🤝 Développé avec les Communautés</Text>
        <Text style={styles.communityText}>
          Notre technologie de synthèse vocale est développée en étroite 
          collaboration avec les locuteurs natifs et les institutions 
          culturelles autochtones pour assurer l'authenticité et le respect 
          des traditions orales.
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
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#e91e63',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fce4ec',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  voicesSection: {
    margin: 15,
    gap: 15,
  },
  voiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  voiceFlag: {
    fontSize: 24,
    marginRight: 10,
  },
  voiceLanguage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  samplesContainer: {
    gap: 12,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
  },
  sampleTextContainer: {
    flex: 1,
  },
  sampleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sampleTranslation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  playButton: {
    backgroundColor: '#e91e63',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playingButton: {
    backgroundColor: '#666',
  },
  playButtonText: {
    fontSize: 16,
  },
  featuresSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 15,
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  communitySection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 10,
    textAlign: 'center',
  },
  communityText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
});

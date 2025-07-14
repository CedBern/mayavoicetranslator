import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useResponsive, usePerformance, usePersistentState } from '../hooks';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

const SettingsPage = memo(function SettingsPage({ onNavigate }: SettingsPageProps) {
  // Context integration
  const { state, dispatch } = useAppContext();
  
  // Custom hooks
  const { breakpoints } = useResponsive();
  const { measureOperation } = usePerformance();
  
  // Persistent settings state
  const [audioQuality, setAudioQuality] = usePersistentState('audioQuality', 'high');
  const [autoPlay, setAutoPlay] = usePersistentState('autoPlay', true);
  const [offlineMode, setOfflineMode] = usePersistentState('offlineMode', false);
  const [notifications, setNotifications] = usePersistentState('notifications', true);
  const [darkMode, setDarkMode] = usePersistentState('darkMode', false);
  const [apiServerUrl, setApiServerUrl] = usePersistentState('apiServerUrl', 'http://localhost:3000');
  
  // Section IA/OpenAI
  const [openaiApiKey, setOpenaiApiKey] = usePersistentState('openaiApiKey', '');
  const [useAdvancedTranslation, setUseAdvancedTranslation] = usePersistentState('useAdvancedTranslation', true);
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);

  // Local state
  const [apiConnected, setApiConnected] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // API connection test function (optimized)
  const testApiConnection = useCallback(async () => {
    setIsTestingApi(true);
    try {
      const response = await measureOperation(
        async () => fetch(`${apiServerUrl}/api/health`, { method: 'GET' }),
        'api_health_check'
      );
      
      if (response.ok) {
        const data = await response.json();
        setApiConnected(data.status === 'OK');
        console.log('✅ API connectée:', data);
      } else {
        setApiConnected(false);
      }
    } catch (error) {
      setApiConnected(false);
      console.log('❌ API non accessible:', error);
    } finally {
      setIsTestingApi(false);
    }
  }, [apiServerUrl, measureOperation]);

  // Test de connexion API au chargement
  useEffect(() => {
    testApiConnection();
  }, [testApiConnection]);

  // API test handler (optimized)
  const handleTestApi = useCallback(async () => {
    await testApiConnection();
    
    Alert.alert(
      apiConnected ? '✅ Connexion réussie' : '❌ Connexion échouée',
      apiConnected ? 
        'Le serveur API Talk Kin est accessible et fonctionnel.' :
        'Impossible de se connecter au serveur API. Vérifiez que le serveur est démarré sur le port correct.',
      [{ text: 'OK' }]
    );
  }, [testApiConnection, apiConnected]);

  // OpenAI configuration test function
  const testOpenAIConfiguration = useCallback(async () => {
    setIsTestingOpenAI(true);
    try {
      // Appel du service de test OpenAI (à adapter selon ton backend)
      const response = await fetch(`${apiServerUrl}/api/openai/status`, {
        headers: { 'Authorization': `Bearer ${openaiApiKey}` }
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('✅ Test réussi !', result.message || 'Connexion OpenAI OK');
      } else {
        Alert.alert('❌ Test échoué', result.message || 'Erreur de connexion OpenAI');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de tester la configuration OpenAI');
    } finally {
      setIsTestingOpenAI(false);
    }
  }, [apiServerUrl, openaiApiKey]);

  // Settings reset function (optimized)
  const resetSettings = useCallback(() => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Êtes-vous sûr de vouloir remettre tous les paramètres par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setAudioQuality('high');
            setAutoPlay(true);
            setOfflineMode(false);
            setNotifications(true);
            setDarkMode(false);
            setApiServerUrl('http://localhost:3000');
            setOpenaiApiKey('');
            setUseAdvancedTranslation(true);
            Alert.alert('Succès', 'Paramètres réinitialisés');
          }
        }
      ]
    );
  }, [setAudioQuality, setAutoPlay, setOfflineMode, setNotifications, setDarkMode, setApiServerUrl, setOpenaiApiKey, setUseAdvancedTranslation]);

  const settingSections = [
    {
      title: '🎵 Audio & Voix',
      items: [
        {
          label: 'Qualité audio',
          value: audioQuality,
          type: 'select',
          options: [
            { value: 'low', label: 'Basse (économique)' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'high', label: 'Haute (recommandé)' }
          ],
          onChange: setAudioQuality
        },
        {
          label: 'Lecture automatique',
          value: autoPlay,
          type: 'toggle',
          description: 'Jouer automatiquement après traduction',
          onChange: setAutoPlay
        }
      ]
    },
    {
      title: '🌐 Langues & Traduction',
      items: [
        {
          label: 'Mode hors ligne',
          value: offlineMode,
          type: 'toggle',
          description: 'Utiliser les modèles téléchargés localement',
          onChange: setOfflineMode
        }
      ]
    },
    {
      title: '📱 Application',
      items: [
        {
          label: 'Notifications',
          value: notifications,
          type: 'toggle',
          description: 'Recevoir des notifications sur les nouvelles langues',
          onChange: setNotifications
        },
        {
          label: 'Mode sombre',
          value: darkMode,
          type: 'toggle',
          description: 'Interface sombre (bientôt disponible)',
          onChange: setDarkMode
        }
      ]
    },
    {
      title: '🤖 Intelligence Artificielle (OpenAI)',
      items: [
        {
          label: 'Clé API OpenAI',
          value: openaiApiKey,
          type: 'text',
          placeholder: 'sk-proj-...',
          secureTextEntry: true,
          onChange: setOpenaiApiKey
        },
        {
          label: 'Utiliser la traduction avancée',
          value: useAdvancedTranslation,
          type: 'toggle',
          description: 'Active la traduction IA si la clé est configurée',
          onChange: setUseAdvancedTranslation
        }
      ]
    }
  ];

  const renderSelectItem = (item: any) => (
    <View style={styles.selectContainer}>
      <Text style={styles.selectLabel}>{item.label}</Text>
      <View style={styles.selectOptions}>
        {item.options.map((option: any) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectOption,
              item.value === option.value && styles.selectedOption
            ]}
            onPress={() => item.onChange(option.value)}
          >
            <Text style={[
              styles.selectOptionText,
              item.value === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderToggleItem = (item: any) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleContent}>
        <Text style={styles.toggleLabel}>{item.label}</Text>
        {item.description && (
          <Text style={styles.toggleDescription}>{item.description}</Text>
        )}
      </View>
      <Switch
        value={item.value}
        onValueChange={item.onChange}
        trackColor={{ false: '#d0d0d0', true: '#ff6b9d' }}
        thumbColor={item.value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

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
        <Text style={styles.title}>Paramètres</Text>
        <Text style={styles.subtitle}>Personnalisez votre expérience</Text>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                {item.type === 'select' ? renderSelectItem(item) : renderToggleItem(item)}
                {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ À propos de Talk Kin</Text>
        <View style={styles.infoItems}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version :</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Langues supportées :</Text>
            <Text style={styles.infoValue}>8 langues</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Développé avec :</Text>
            <Text style={styles.infoValue}>React Native & Expo</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📚 Guide d'utilisation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🤝 Contribuer au projet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.contactButton]}>
          <Text style={[styles.actionButtonText, styles.contactButtonText]}>
            📧 Nous contacter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Talk Kin - Préservation des langues autochtones{'\n'}
          Développé avec ❤️ pour les communautés natives
        </Text>
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
    color: '#fff3e0'
  },
  section: {
    margin: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9800',
    padding: 20,
    paddingBottom: 10
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  settingItem: {
    paddingVertical: 5
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15
  },
  selectContainer: {
    marginVertical: 5
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  selectOptions: {
    gap: 8
  },
  selectOption: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedOption: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800'
  },
  selectOptionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center'
  },
  selectedOptionText: {
    color: '#ff9800',
    fontWeight: '600'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  toggleContent: {
    flex: 1,
    marginRight: 15
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  toggleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 15
  },
  infoItems: {
    gap: 10
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 14,
    color: '#666'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  actionsSection: {
    margin: 15,
    gap: 10
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
    elevation: 2
  },
  contactButton: {
    backgroundColor: '#ff9800'
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff9800'
  },
  contactButtonText: {
    color: '#ffffff'
  },
  footer: {
    padding: 20,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#333',
    marginBottom: 10
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  testButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff'
  }
});

export default SettingsPage;

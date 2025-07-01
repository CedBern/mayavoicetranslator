import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import SemanticSuggestions from './SemanticSuggestions';
import { useAppContext } from '../contexts/AppContext';

interface CrowdsourcingPageProps {
  onNavigate: (page: string) => void;
}

interface Contributor {
  id: string;
  name: string;
  level: string;
  points: number;
  badges: string[];
  contributions: {
    translations: number;
    reviews: number;
    audio: number;
  };
}

interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  reviews: any[];
}

export function CrowdsourcingPage({ onNavigate }: CrowdsourcingPageProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [pendingTranslations, setPendingTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  
  // États pour les formulaires
  const [newTranslation, setNewTranslation] = useState({
    sourceText: '',
    targetText: '',
    sourceLanguage: 'fr',
    targetLanguage: 'yua',
    culturalContext: 'daily',
    culturalNotes: ''
  });

  const [communityStats, setCommunityStats] = useState({
    contributors: { total: 347, active: 289 },
    translations: { validated: 12450, pending: 89 },
    languages: { yua: 4200, qu: 3800, gn: 2100, nah: 1850, ay: 500 }
  });

  const { state } = useAppContext();

  useEffect(() => {
    initializeCrowdsourcing();
  }, []);

  const initializeCrowdsourcing = async () => {
    setLoading(true);
    try {
      // Simulation de données utilisateur
      const mockContributor: Contributor = {
        id: 'contrib_12345',
        name: 'Expert Maya',
        level: 'expert',
        points: 1250,
        badges: ['first_translation', 'audio_contributor', 'cultural_expert'],
        contributions: {
          translations: 47,
          reviews: 23,
          audio: 12
        }
      };
      
      setContributor(mockContributor);
      
      // Charger les traductions en attente de révision
      const mockPendingTranslations: Translation[] = [
        {
          id: 'trans_001',
          sourceText: 'Comment allez-vous ce matin ?',
          targetText: 'Bix a beel sáamal ?',
          sourceLanguage: 'fr',
          targetLanguage: 'yua',
          status: 'pending_review',
          reviews: []
        },
        {
          id: 'trans_002',
          sourceText: 'La famille se réunit pour le repas',
          targetText: 'Le otoche u múul ti\' le janale\'',
          sourceLanguage: 'fr',
          targetLanguage: 'yua',
          status: 'pending_review',
          reviews: []
        }
      ];
      
      setPendingTranslations(mockPendingTranslations);
      
    } catch (error) {
      console.error('Erreur initialisation crowdsourcing:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitTranslation = async () => {
    if (!newTranslation.sourceText || !newTranslation.targetText) {
      Alert.alert('Erreur', 'Veuillez remplir le texte source et la traduction');
      return;
    }

    try {
      setLoading(true);
      
      // Simulation d'envoi à l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        '✅ Traduction Soumise',
        `Votre traduction "${newTranslation.sourceText}" → "${newTranslation.targetText}" a été soumise pour révision.\n\n+10 points de réputation !`,
        [{ text: 'OK', onPress: () => {
          setNewTranslation({
            sourceText: '',
            targetText: '',
            sourceLanguage: 'fr',
            targetLanguage: 'yua',
            culturalContext: 'daily',
            culturalNotes: ''
          });
          
          // Mettre à jour les points du contributeur
          if (contributor) {
            setContributor({
              ...contributor,
              points: contributor.points + 10,
              contributions: {
                ...contributor.contributions,
                translations: contributor.contributions.translations + 1
              }
            });
          }
        }}]
      );
      
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de soumettre la traduction');
    } finally {
      setLoading(false);
    }
  };

  const reviewTranslation = async (translationId: string, approved: boolean) => {
    try {
      setLoading(true);
      
      const action = approved ? 'approuvée' : 'rejetée';
      const points = approved ? 5 : 2;
      
      // Simulation d'envoi de révision
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Alert.alert(
        `✅ Révision ${action}`,
        `Votre révision a été enregistrée.\n\n+${points} points de réputation !`
      );
      
      // Retirer la traduction de la liste
      setPendingTranslations(prev => prev.filter(t => t.id !== translationId));
      
      // Mettre à jour les points
      if (contributor) {
        setContributor({
          ...contributor,
          points: contributor.points + points,
          contributions: {
            ...contributor.contributions,
            reviews: contributor.contributions.reviews + 1
          }
        });
      }
      
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la révision');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'novice': return '#95a5a6';
      case 'apprentice': return '#3498db';
      case 'expert': return '#e74c3c';
      case 'master': return '#9b59b6';
      case 'elder': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getBadgeEmoji = (badge: string) => {
    switch (badge) {
      case 'first_translation': return '🎯';
      case 'audio_contributor': return '🎤';
      case 'cultural_expert': return '📚';
      case 'community_leader': return '👑';
      case 'language_master': return '🌟';
      default: return '🏆';
    }
  };

  const renderDashboard = () => (
    <View style={styles.tabContent}>
      {/* Profil utilisateur */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{contributor?.name.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{contributor?.name || 'Utilisateur'}</ThemedText>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(contributor?.level || 'novice') }]}>
              <Text style={styles.levelText}>{contributor?.level?.toUpperCase() || 'NOVICE'}</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsNumber}>{contributor?.points || 0}</Text>
            <Text style={styles.pointsLabel}>points</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <ThemedText style={styles.badgesTitle}>Badges Obtenus</ThemedText>
          <View style={styles.badgesContainer}>
            {contributor?.badges.map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{getBadgeEmoji(badge)}</Text>
              </View>
            )) || []}
          </View>
        </View>

        {/* Statistiques contributions */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.statsTitle}>Mes Contributions</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributor?.contributions.translations || 0}</Text>
              <Text style={styles.statLabel}>Traductions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributor?.contributions.reviews || 0}</Text>
              <Text style={styles.statLabel}>Révisions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributor?.contributions.audio || 0}</Text>
              <Text style={styles.statLabel}>Audio</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Statistiques communauté */}
      <View style={styles.communityCard}>
        <ThemedText style={styles.cardTitle}>🌍 Impact Communautaire</ThemedText>
        <View style={styles.communityStats}>
          <View style={styles.communityStatItem}>
            <Text style={styles.communityStatNumber}>{communityStats.contributors.total}</Text>
            <Text style={styles.communityStatLabel}>Contributeurs</Text>
          </View>
          <View style={styles.communityStatItem}>
            <Text style={styles.communityStatNumber}>{communityStats.translations.validated}</Text>
            <Text style={styles.communityStatLabel}>Traductions Validées</Text>
          </View>
        </View>
        
        <ThemedText style={styles.languagesTitle}>Langues Actives</ThemedText>
        <View style={styles.languagesGrid}>
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>🇲🇽</Text>
            <Text style={styles.languageName}>Maya</Text>
            <Text style={styles.languageCount}>{communityStats.languages.yua}</Text>
          </View>
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>🇵🇪</Text>
            <Text style={styles.languageName}>Quechua</Text>
            <Text style={styles.languageCount}>{communityStats.languages.qu}</Text>
          </View>
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>🇵🇾</Text>
            <Text style={styles.languageName}>Guarani</Text>
            <Text style={styles.languageCount}>{communityStats.languages.gn}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTranslate = () => (
    <View style={styles.tabContent}>
      <View style={styles.formCard}>
        <ThemedText style={styles.cardTitle}>📝 Nouvelle Traduction</ThemedText>
        
        {/* Sélection des langues */}
        <View style={styles.languageSelector}>
          <View style={styles.languageOption}>
            <Text style={styles.languageLabel}>De :</Text>
            <Text style={styles.selectedLanguage}>🇫🇷 Français</Text>
          </View>
          <Text style={styles.arrowIcon}>→</Text>
          <View style={styles.languageOption}>
            <Text style={styles.languageLabel}>Vers :</Text>
            <Text style={styles.selectedLanguage}>🇲🇽 Maya Yucatèque</Text>
          </View>
        </View>

        {/* Texte source */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Texte à traduire</ThemedText>
          <TextInput
            style={styles.textInput}
            value={newTranslation.sourceText}
            onChangeText={(text) => setNewTranslation(prev => ({ ...prev, sourceText: text }))}
            placeholder="Entrez le texte en français..."
            multiline
          />
          {/* Suggestions sémantiques contextuelles */}
          <SemanticSuggestions
            query={newTranslation.sourceText}
            language={newTranslation.sourceLanguage}
            jwtToken={state.user?.token || ''}
            apiServerUrl={process.env.API_SERVER_URL || 'http://localhost:3000'}
            onSuggestionSelect={(suggestion) => setNewTranslation(prev => ({ ...prev, sourceText: suggestion }))}
          />
        </View>

        {/* Traduction */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Votre traduction</ThemedText>
          <TextInput
            style={styles.textInput}
            value={newTranslation.targetText}
            onChangeText={(text) => setNewTranslation(prev => ({ ...prev, targetText: text }))}
            placeholder="Entrez la traduction en maya yucatèque..."
            multiline
          />
        </View>

        {/* Notes culturelles */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Notes culturelles (optionnel)</ThemedText>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={newTranslation.culturalNotes}
            onChangeText={(text) => setNewTranslation(prev => ({ ...prev, culturalNotes: text }))}
            placeholder="Contexte culturel, usage spécifique, nuances..."
            multiline
          />
        </View>

        {/* Bouton de soumission */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={submitTranslation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Soumettre la Traduction</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.rewardText}>💰 +10 points de réputation</Text>
      </View>
    </View>
  );

  const renderReview = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewCard}>
        <ThemedText style={styles.cardTitle}>👁️ Révisions en Attente</ThemedText>
        <Text style={styles.reviewSubtitle}>
          Aidez la communauté en révisant les traductions soumises
        </Text>

        {pendingTranslations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Toutes les révisions sont à jour !</Text>
            <Text style={styles.emptySubtext}>Revenez plus tard ou soumettez une nouvelle traduction.</Text>
          </View>
        ) : (
          pendingTranslations.map((translation, index) => (
            <View key={translation.id} style={styles.reviewItem}>
              <View style={styles.translationContent}>
                <View style={styles.translationTexts}>
                  <Text style={styles.sourceText}>📝 {translation.sourceText}</Text>
                  <Text style={styles.targetText}>🎯 {translation.targetText}</Text>
                  <Text style={styles.languagePair}>
                    {translation.sourceLanguage.toUpperCase()} → {translation.targetLanguage.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    style={[styles.reviewButton, styles.approveButton]}
                    onPress={() => reviewTranslation(translation.id, true)}
                    disabled={loading}
                  >
                    <Text style={styles.reviewButtonText}>✅ Approuver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.reviewButton, styles.rejectButton]}
                    onPress={() => reviewTranslation(translation.id, false)}
                    disabled={loading}
                  >
                    <Text style={styles.reviewButtonText}>❌ Rejeter</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.reviewReward}>💰 +5 points pour approbation, +2 pour rejet</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );

  if (loading && !contributor) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Chargement du crowdsourcing...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => onNavigate('home')}
          >
            <Text style={styles.backButtonText}>← Accueil</Text>
          </TouchableOpacity>
          <ThemedText style={styles.title}>🌟 Crowdsourcing</ThemedText>
          <ThemedText style={styles.subtitle}>
            Traduction Collaborative et Communautaire
          </ThemedText>
        </View>

        {/* Onglets */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
              📊 Tableau de Bord
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'translate' && styles.activeTab]}
            onPress={() => setActiveTab('translate')}
          >
            <Text style={[styles.tabText, activeTab === 'translate' && styles.activeTabText]}>
              📝 Traduire
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'review' && styles.activeTab]}
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.activeTabText]}>
              👁️ Réviser ({pendingTranslations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenu des onglets */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'translate' && renderTranslate()}
        {activeTab === 'review' && renderReview()}

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            🤝 Ensemble, préservons les langues autochtones
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollView: {
    flex: 1
  },
  header: {
    backgroundColor: '#2c5aa0',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center'
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#2c5aa0'
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  activeTabText: {
    color: '#2c5aa0',
    fontWeight: 'bold'
  },
  tabContent: {
    padding: 20
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 4
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2c5aa0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  pointsContainer: {
    alignItems: 'center'
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0'
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666'
  },
  badgesSection: {
    marginBottom: 20
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  badgeItem: {
    backgroundColor: '#f0f7ff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10
  },
  badgeEmoji: {
    fontSize: 24
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  communityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 4
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  communityStatItem: {
    alignItems: 'center'
  },
  communityStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c'
  },
  communityStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  languagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  languagesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  languageItem: {
    alignItems: 'center'
  },
  languageFlag: {
    fontSize: 20,
    marginBottom: 4
  },
  languageName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  languageCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5aa0'
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 4
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12
  },
  languageOption: {
    alignItems: 'center'
  },
  languageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  selectedLanguage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5aa0'
  },
  arrowIcon: {
    fontSize: 20,
    color: '#2c5aa0',
    fontWeight: 'bold'
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top'
  },
  notesInput: {
    minHeight: 80
  },
  submitButton: {
    backgroundColor: '#2c5aa0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  submitButtonDisabled: {
    backgroundColor: '#999'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  rewardText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 4
  },
  reviewSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  reviewItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  translationContent: {
    marginBottom: 12
  },
  translationTexts: {
    marginBottom: 16
  },
  sourceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333'
  },
  targetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 8
  },
  languagePair: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  reviewButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center'
  },
  approveButton: {
    backgroundColor: '#27ae60'
  },
  rejectButton: {
    backgroundColor: '#e74c3c'
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  reviewReward: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  footer: {
    padding: 20,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

export default CrowdsourcingPage;

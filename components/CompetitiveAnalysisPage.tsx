/**
 * 🎯 Page d'Analyse Concurrentielle - Talk Kin vs OpenAI
 * Stratégie de coopétition et positionnement unique
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';

const CompetitiveAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [openaiIntegration, setOpenaiIntegration] = useState(false);
  const [competitiveMetrics, setCompetitiveMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Données d'analyse concurrentielle
  const competitiveData = {
    talkKinAdvantages: [
      { 
        category: 'Niche Spécialisée',
        score: 95,
        description: 'Langues indigènes exclusives',
        icon: '🎯'
      },
      {
        category: 'Authenticité Culturelle',
        score: 98,
        description: 'Locuteurs natifs authentiques',
        icon: '🌍'
      },
      {
        category: 'Communauté Engagée',
        score: 92,
        description: 'Professeurs natifs actifs',
        icon: '👥'
      },
      {
        category: 'Impact Social',
        score: 96,
        description: 'Préservation culturelle mesurable',
        icon: '💝'
      }
    ],
    openaiAdvantages: [
      {
        category: 'Ressources Techniques',
        score: 99,
        description: 'Infrastructure massive',
        icon: '🏗️'
      },
      {
        category: 'Capacités IA',
        score: 97,
        description: 'Modèles de pointe',
        icon: '🧠'
      },
      {
        category: 'Reconnaissance Marché',
        score: 95,
        description: 'Leader mondial établi',
        icon: '🏆'
      },
      {
        category: 'Échelle Globale',
        score: 98,
        description: 'Portée internationale',
        icon: '🌐'
      }
    ]
  };

  const integrationBenefits = [
    {
      title: 'Traduction Avancée',
      description: 'GPT-4 pour contextes culturels complexes',
      impact: 'Haute',
      cost: 'Modéré'
    },
    {
      title: 'Reconnaissance Vocale',
      description: 'Whisper pour langues indigènes',
      impact: 'Haute',
      cost: 'Faible'
    },
    {
      title: 'Génération de Contenu',
      description: 'Création automatique de leçons',
      impact: 'Moyenne',
      cost: 'Modéré'
    },
    {
      title: 'Fine-tuning Spécialisé',
      description: 'Modèles sur notre corpus unique',
      impact: 'Très Haute',
      cost: 'Élevé'
    }
  ];

  const strategicRecommendations = [
    {
      priority: 'Critique',
      action: 'Sécuriser la différenciation',
      description: 'Protéger notre corpus et communauté uniques',
      timeline: 'Immédiat'
    },
    {
      priority: 'Haute',
      action: 'Intégrer APIs OpenAI',
      description: 'Boost technique pour traduction et TTS',
      timeline: '1-2 mois'
    },
    {
      priority: 'Moyenne',
      action: 'Fine-tuning spécialisé',
      description: 'Modèles personnalisés sur nos données',
      timeline: '3-6 mois'
    },
    {
      priority: 'Faible',
      action: 'Alternatives de sécurité',
      description: 'Plans B sans dépendance OpenAI',
      timeline: '6-12 mois'
    }
  ];

  useEffect(() => {
    checkOpenAIIntegration();
  }, []);

  const checkOpenAIIntegration = async () => {
    try {
      const response = await fetch('/api/competitive-analysis/integration-status');
      const data = await response.json();
      setOpenaiIntegration(data.integrated);
      setCompetitiveMetrics(data.metrics);
    } catch (error) {
      console.error('Erreur vérification intégration:', error);
    }
  };

  const performCompetitiveAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/competitive-analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: 'full',
          includeMetrics: true,
          generateRecommendations: true
        })
      });

      const result = await response.json();
      Alert.alert(
        '📊 Analyse Complétée',
        `Position concurrentielle: ${result.competitivePosition}\n` +
        `Recommandation: ${result.recommendation}`,
        [{ text: 'Voir Détails', onPress: () => setModalVisible(true) }]
      );
      
      setCompetitiveMetrics(result.detailedMetrics);
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de l\'analyse concurrentielle');
    } finally {
      setLoading(false);
    }
  };

  const activateOpenAIIntegration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/competitive-analysis/activate-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preserveDifferentiation: true,
          enableFallback: true,
          secureDataHandling: true
        })
      });

      const result = await response.json();
      if (result.success) {
        setOpenaiIntegration(true);
        Alert.alert('✅ Intégration Activée', 'OpenAI intégré avec succès dans Talk Kin');
      } else {
        Alert.alert('❌ Erreur', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de l\'activation OpenAI');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🎯 Analyse Concurrentielle</Text>
      
      <View style={styles.comparisonContainer}>
        <View style={styles.competitorColumn}>
          <Text style={styles.columnTitle}>🏆 Forces Talk Kin</Text>
          {competitiveData.talkKinAdvantages.map((advantage, index) => (
            <View key={index} style={styles.advantageCard}>
              <Text style={styles.advantageIcon}>{advantage.icon}</Text>
              <View style={styles.advantageContent}>
                <Text style={styles.advantageCategory}>{advantage.category}</Text>
                <Text style={styles.advantageDescription}>{advantage.description}</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreProgress, { width: `${advantage.score}%` }]} />
                  <Text style={styles.scoreText}>{advantage.score}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.competitorColumn}>
          <Text style={styles.columnTitle}>🤖 Forces OpenAI</Text>
          {competitiveData.openaiAdvantages.map((advantage, index) => (
            <View key={index} style={[styles.advantageCard, styles.openaiCard]}>
              <Text style={styles.advantageIcon}>{advantage.icon}</Text>
              <View style={styles.advantageContent}>
                <Text style={styles.advantageCategory}>{advantage.category}</Text>
                <Text style={styles.advantageDescription}>{advantage.description}</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreProgress, styles.openaiProgress, { width: `${advantage.score}%` }]} />
                  <Text style={styles.scoreText}>{advantage.score}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.analysisButton} 
        onPress={performCompetitiveAnalysis}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>📊 Analyser Position Concurrentielle</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderIntegrationTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🤝 Intégration OpenAI</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Statut d'intégration:</Text>
        <View style={[styles.statusIndicator, openaiIntegration ? styles.integrated : styles.notIntegrated]}>
          <Text style={styles.statusText}>
            {openaiIntegration ? '✅ Intégré' : '❌ Non intégré'}
          </Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>💡 Bénéfices de l'Intégration</Text>
      {integrationBenefits.map((benefit, index) => (
        <View key={index} style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>
          <Text style={styles.benefitDescription}>{benefit.description}</Text>
          <View style={styles.benefitMetrics}>
            <Text style={[styles.benefitMetric, styles.impactMetric]}>
              Impact: {benefit.impact}
            </Text>
            <Text style={[styles.benefitMetric, styles.costMetric]}>
              Coût: {benefit.cost}
            </Text>
          </View>
        </View>
      ))}

      {!openaiIntegration && (
        <TouchableOpacity 
          style={styles.integrationButton} 
          onPress={activateOpenAIIntegration}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>🚀 Activer Intégration OpenAI</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStrategyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>📋 Stratégie Recommandée</Text>
      
      <View style={styles.conclusionBox}>
        <Text style={styles.conclusionTitle}>🎯 CONCLUSION STRATÉGIQUE</Text>
        <Text style={styles.conclusionText}>
          <Text style={styles.boldText}>❌ Concurrence directe:</Text> Non viable{'\n'}
          <Text style={styles.boldText}>✅ Position unique:</Text> Totalement défendable{'\n'}
          <Text style={styles.boldText}>🤝 Intégration OpenAI:</Text> Recommandée avec précautions
        </Text>
      </View>

      <Text style={styles.subsectionTitle}>🎯 Plan d'Action Prioritaire</Text>
      {strategicRecommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>            <Text style={[styles.priorityBadge, 
              rec.priority === 'Critique' ? styles.priorityCritique :
              rec.priority === 'Haute' ? styles.priorityHaute :
              rec.priority === 'Moyenne' ? styles.priorityMoyenne :
              styles.priorityFaible
            ]}>
              {rec.priority}
            </Text>
            <Text style={styles.timelineText}>{rec.timeline}</Text>
          </View>
          <Text style={styles.recommendationAction}>{rec.action}</Text>
          <Text style={styles.recommendationDescription}>{rec.description}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Talk Kin vs OpenAI</Text>
        <Text style={styles.subtitle}>Analyse Concurrentielle & Stratégie</Text>
      </View>

      <View style={styles.tabBar}>
        {[
          { key: 'analysis', label: '📊 Analyse', icon: '📊' },
          { key: 'integration', label: '🤝 Intégration', icon: '🤝' },
          { key: 'strategy', label: '📋 Stratégie', icon: '📋' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'integration' && renderIntegrationTab()}
        {activeTab === 'strategy' && renderStrategyTab()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📊 Détails de l'Analyse</Text>
            {competitiveMetrics && (
              <View>
                <Text style={styles.modalText}>
                  Position concurrentielle: {competitiveMetrics.position}
                </Text>
                <Text style={styles.modalText}>
                  Score différenciation: {competitiveMetrics.differentiationScore}%
                </Text>
                <Text style={styles.modalText}>
                  Recommandation: {competitiveMetrics.recommendation}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E8'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#2E7D32'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  content: {
    flex: 1
  },
  tabContent: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center'
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30
  },
  competitorColumn: {
    flex: 1
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333'
  },
  advantageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50'
  },
  openaiCard: {
    borderLeftColor: '#FF9800'
  },
  advantageIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  advantageContent: {
    flex: 1
  },
  advantageCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  advantageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  scoreBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center'
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0
  },
  openaiProgress: {
    backgroundColor: '#FF9800'
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  analysisButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  integrated: {
    backgroundColor: '#E8F5E8'
  },
  notIntegrated: {
    backgroundColor: '#FFEBEE'
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  benefitCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  benefitMetrics: {
    flexDirection: 'row',
    gap: 15
  },
  benefitMetric: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  impactMetric: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2'
  },
  costMetric: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00'
  },
  integrationButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  conclusionBox: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32'
  },
  conclusionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10
  },
  conclusionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333'
  },
  boldText: {
    fontWeight: 'bold'
  },
  recommendationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF'
  },
  priorityCritique: {
    backgroundColor: '#F44336'
  },
  priorityHaute: {
    backgroundColor: '#FF9800'
  },
  priorityMoyenne: {
    backgroundColor: '#2196F3'
  },
  priorityFaible: {
    backgroundColor: '#4CAF50'
  },
  timelineText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  recommendationAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32'
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center'
  },
  modalButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20
  }
});

export default CompetitiveAnalysisPage;

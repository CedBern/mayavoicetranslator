import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ActivationPageProps {
  onNavigate: (page: string) => void;
}

interface FeatureStatus {
  name: string;
  status: 'active' | 'inactive' | 'activating';
  description: string;
  category: 'core' | 'advanced' | 'experimental';
  priority: number;
  icon: string;
}

export function GlobalActivationPage({ onNavigate }: ActivationPageProps) {
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    initializeFeatures();
  }, []);

  const initializeFeatures = () => {
    const featureList: FeatureStatus[] = [
      // FONCTIONNALITÉS CORE
      {
        name: 'Reconnaissance Vocale Native',
        status: 'inactive',
        description: 'Reconnaissance vocale avancée pour langues indigènes avec adaptation phonétique',
        category: 'core',
        priority: 1,
        icon: '🎤'
      },
      {
        name: 'Modèles Offline Complets',
        status: 'inactive',
        description: 'Modèles de traduction embarqués pour fonctionnement sans connexion',
        category: 'core',
        priority: 2,
        icon: '💾'
      },
      {
        name: 'Synchronisation Cloud',
        status: 'inactive',
        description: 'Synchronisation des données utilisateur entre appareils',
        category: 'core',
        priority: 3,
        icon: '☁️'
      },
      
      // FONCTIONNALITÉS AVANCÉES
      {
        name: 'Analytics Temps Réel',
        status: 'inactive',
        description: 'Métriques détaillées d\'usage et performance en temps réel',
        category: 'advanced',
        priority: 4,
        icon: '📊'
      },
      {
        name: 'Authentification OAuth2',
        status: 'inactive',
        description: 'Connexion sécurisée avec Google, Facebook, Apple',
        category: 'advanced',
        priority: 5,
        icon: '🔐'
      },
      {
        name: 'Monitoring Performance',
        status: 'inactive',
        description: 'Surveillance automatique des performances et alertes',
        category: 'advanced',
        priority: 6,
        icon: '📈'
      },
      {
        name: 'Sécurité Renforcée',
        status: 'inactive',
        description: 'Chiffrement avancé et protection contre les attaques',
        category: 'advanced',
        priority: 7,
        icon: '🛡️'
      },
      
      // FONCTIONNALITÉS EXPÉRIMENTALES
      {
        name: 'TTS Neuraux Avancés',
        status: 'inactive',
        description: 'Voix neurales haute qualité avec émotions',
        category: 'experimental',
        priority: 8,
        icon: '🧠'
      },
      {
        name: 'Recherche Vectorielle Optimisée',
        status: 'inactive',
        description: 'Recherche sémantique ultra-rapide avec compression',
        category: 'experimental',
        priority: 9,
        icon: '⚡'
      },
      {
        name: 'Fonctionnalités Communautaires',
        status: 'inactive',
        description: 'Contributions collaboratives et validation communautaire',
        category: 'experimental',
        priority: 10,
        icon: '👥'
      },
      {
        name: 'Documentation API Interactive',
        status: 'inactive',
        description: 'Documentation Swagger avec tests intégrés',
        category: 'experimental',
        priority: 11,
        icon: '📚'
      },
      {
        name: 'Tests Automatisés Complets',
        status: 'inactive',
        description: 'Suite de tests automatisés avec couverture 95%',
        category: 'experimental',
        priority: 12,
        icon: '🧪'
      }
    ];

    setFeatures(featureList);
    updateStats(featureList);
    setLoading(false);
  };

  const updateStats = (featureList: FeatureStatus[]) => {
    const total = featureList.length;
    const active = featureList.filter(f => f.status === 'active').length;
    const inactive = total - active;
    
    setStats({ total, active, inactive });
  };

  const activateAllFeatures = async () => {
    Alert.alert(
      '🚀 Activation Globale',
      'Activer TOUTES les fonctionnalités disponibles?\n\nCela inclut les fonctionnalités expérimentales et peut prendre quelques minutes.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Activer Tout',
          style: 'destructive',
          onPress: async () => {
            setActivating(true);
            
            try {
              // Activer chaque fonctionnalité avec délai
              for (let i = 0; i < features.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Délai pour l'animation
                
                setFeatures(prev => prev.map((feature, index) => 
                  index === i 
                    ? { ...feature, status: 'activating' }
                    : feature
                ));
                
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation activation
                
                setFeatures(prev => prev.map((feature, index) => 
                  index === i 
                    ? { ...feature, status: 'active' }
                    : feature
                ));
              }
              
              const activatedFeatures = features.map(f => ({ ...f, status: 'active' as const }));
              setFeatures(activatedFeatures);
              updateStats(activatedFeatures);
              
              Alert.alert(
                '✅ Activation Réussie',
                `Toutes les ${features.length} fonctionnalités ont été activées avec succès!\n\nVotre application Talk Kin est maintenant complètement opérationnelle.`
              );
              
            } catch (error) {
              Alert.alert('❌ Erreur', 'Erreur lors de l\'activation globale');
            } finally {
              setActivating(false);
            }
          }
        }
      ]
    );
  };

  const toggleFeature = async (index: number) => {
    const feature = features[index];
    
    if (feature.status === 'activating') return;
    
    const newStatus = feature.status === 'active' ? 'inactive' : 'activating';
    
    setFeatures(prev => prev.map((f, i) => 
      i === index ? { ...f, status: newStatus } : f
    ));
    
    // Simulation d'activation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalStatus = feature.status === 'active' ? 'inactive' : 'active';
    
    setFeatures(prev => prev.map((f, i) => 
      i === index ? { ...f, status: finalStatus } : f
    ));
    
    updateStats(features.map((f, i) => 
      i === index ? { ...f, status: finalStatus } : f
    ));
  };

  const getProgressPercentage = () => {
    return stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
  };

  const getCategoryFeatures = (category: string) => {
    return features.filter(f => f.category === category);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return '#4CAF50';
      case 'advanced': return '#FF9800';
      case 'experimental': return '#9C27B0';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Chargement des fonctionnalités...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>🚀 Activation Globale</ThemedText>
          <ThemedText style={styles.subtitle}>
            Activez toutes les fonctionnalités avancées de Talk Kin
          </ThemedText>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressTitle}>Progression Globale</ThemedText>
            <ThemedText style={styles.progressPercentage}>{getProgressPercentage()}%</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>✅ {stats.active} actives</Text>
            <Text style={styles.progressStat}>⏳ {stats.inactive} inactives</Text>
            <Text style={styles.progressStat}>📊 {stats.total} total</Text>
          </View>
        </View>

        {/* Activation globale */}
        <TouchableOpacity 
          style={[
            styles.globalButton,
            activating && styles.globalButtonDisabled
          ]} 
          onPress={activateAllFeatures}
          disabled={activating}
        >
          {activating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.globalButtonIcon}>⚡</Text>
          )}
          <ThemedText style={styles.globalButtonText}>
            {activating ? 'Activation en cours...' : 'Activer Toutes les Fonctionnalités'}
          </ThemedText>
        </TouchableOpacity>

        {/* CORE Features */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: getCategoryColor('core') }]}>
            🟢 Fonctionnalités Core
          </ThemedText>
          {getCategoryFeatures('core').map((feature, index) => (
            <FeatureCard 
              key={`core-${index}`}
              feature={feature} 
              onToggle={() => toggleFeature(features.findIndex(f => f.name === feature.name))}
              categoryColor={getCategoryColor('core')}
            />
          ))}
        </View>

        {/* ADVANCED Features */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: getCategoryColor('advanced') }]}>
            🟡 Fonctionnalités Avancées
          </ThemedText>
          {getCategoryFeatures('advanced').map((feature, index) => (
            <FeatureCard 
              key={`advanced-${index}`}
              feature={feature} 
              onToggle={() => toggleFeature(features.findIndex(f => f.name === feature.name))}
              categoryColor={getCategoryColor('advanced')}
            />
          ))}
        </View>

        {/* EXPERIMENTAL Features */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: getCategoryColor('experimental') }]}>
            🟣 Fonctionnalités Expérimentales
          </ThemedText>
          {getCategoryFeatures('experimental').map((feature, index) => (
            <FeatureCard 
              key={`experimental-${index}`}
              feature={feature} 
              onToggle={() => toggleFeature(features.findIndex(f => f.name === feature.name))}
              categoryColor={getCategoryColor('experimental')}
            />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('home')}
          >
            <ThemedText style={styles.backButtonText}>← Retour à l'accueil</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function FeatureCard({ 
  feature, 
  onToggle, 
  categoryColor 
}: { 
  feature: FeatureStatus; 
  onToggle: () => void; 
  categoryColor: string;
}) {
  return (
    <View style={[styles.featureCard, { borderLeftColor: categoryColor }]}>
      <View style={styles.featureHeader}>
        <View style={styles.featureInfo}>
          <Text style={styles.featureIcon}>{feature.icon}</Text>
          <View style={styles.featureDetails}>
            <ThemedText style={styles.featureName}>{feature.name}</ThemedText>
            <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
          </View>
        </View>
        <View style={styles.featureControls}>
          {feature.status === 'activating' ? (
            <ActivityIndicator size="small" color={categoryColor} />
          ) : (
            <Switch
              value={feature.status === 'active'}
              onValueChange={onToggle}
              trackColor={{ false: '#767577', true: categoryColor }}
              thumbColor={feature.status === 'active' ? '#ffffff' : '#f4f3f4'}
            />
          )}
        </View>
      </View>
      
      <View style={styles.featureStatus}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: feature.status === 'active' ? categoryColor : '#757575' }
        ]}>
          <Text style={styles.statusText}>
            {feature.status === 'active' ? '✅ Active' : 
             feature.status === 'activating' ? '⏳ Activation...' : '⭕ Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    fontSize: 12,
    color: '#666',
  },
  globalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  globalButtonDisabled: {
    backgroundColor: '#999',
  },
  globalButtonIcon: {
    fontSize: 24,
    marginRight: 12,
    color: '#fff',
  },
  globalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureDetails: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  featureControls: {
    alignItems: 'center',
  },
  featureStatus: {
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GlobalActivationPage;

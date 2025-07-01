import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {  const features = [
    {
      title: '🗣️ Traducteur',
      subtitle: 'Traduisez entre langues autochtones',
      description: 'Français ↔ Maya Yucatèque, Quechua, Guarani et plus',
      action: () => onNavigate('translator')
    },
    {
      title: '🎵 Voces Ancestrales',
      subtitle: 'Écoutez les langues autochtones',
      description: 'Synthèse vocale authentique des langues natives',
      action: () => onNavigate('voices')
    },
    {
      title: '🎓 Plateforme d\'Apprentissage',
      subtitle: 'Cours en ligne et salles virtuelles',
      description: 'Apprenez avec des professeurs natifs, sessions live, exercices interactifs',
      action: () => onNavigate('learning'),
      special: true
    },
    {
      title: '� Paiements & Abonnements',
      subtitle: 'Gestion sécurisée des paiements',
      description: 'Plans d\'abonnement, paiements sécurisés, devises multiples',
      action: () => onNavigate('payment')
    },
    {
      title: '�🚀 IA Avancée',
      subtitle: 'Intelligence Artificielle Priorité 2',
      description: 'Modèles neuraux, recherche vectorielle, corpus audio',
      action: () => onNavigate('ai-features')
    },
    {
      title: '🎯 Fonctionnalités Avancées',
      subtitle: 'Priorité 3 - Extensions Spécialisées',
      description: 'Nahuatl, Aymara, recherche sémantique, corpus communautaire',
      action: () => onNavigate('priority3')
    },
    {
      title: '👥 Crowdsourcing & Traduction Humaine',
      subtitle: 'Traduisons ensemble',
      description: 'Contribuez, révisez et validez les traductions communautaires',
      action: () => onNavigate('crowdsourcing')
    },
    {
      title: '⚡ Activation Globale',
      subtitle: 'Activez TOUT en une fois',
      description: 'Reconnaissance vocale, modèles offline, cloud sync et plus',
      action: () => onNavigate('global-activation'),
      special: true    },    {
      title: '💰 Système de Paiement',
      subtitle: 'Abonnements et Cours Premium',
      description: 'Accès aux cours avancés et fonctionnalités premium',
      action: () => onNavigate('payment')
    },
    {
      title: '🎯 Analyse Concurrentielle vs OpenAI',
      subtitle: 'Position Stratégique',
      description: 'Notre avantage unique face aux géants tech',
      action: () => onNavigate('competitive-analysis'),
      special: true
    },
    {
      title: '⚙️ Paramètres',
      subtitle: 'Configurez votre expérience',
      description: 'Langues préférées, qualité audio, préférences',
      action: () => onNavigate('settings')
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Talk Kin</Text>        <Text style={styles.subtitle}>Préservons les langues autochtones et régionales</Text>
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Découvrez, apprenez et préservez{'\n'}
            les trésors linguistiques ancestraux et régionaux
          </Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>🌍 Langues Supportées</Text>
          
          {/* Langues indigènes */}
          <Text style={styles.languageCategory}>🏛️ Langues Indigènes</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇲🇽</Text>
              <Text style={styles.languageName}>Maya Yucatèque</Text>
              <Text style={styles.languageSpeakers}>800k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇵🇪</Text>
              <Text style={styles.languageName}>Quechua</Text>
              <Text style={styles.languageSpeakers}>8M locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇵🇾</Text>
              <Text style={styles.languageName}>Guarani</Text>
              <Text style={styles.languageSpeakers}>6M locuteurs</Text>
            </View>
          </View>

          {/* Langues régionales européennes */}
          <Text style={styles.languageCategory}>🏰 Langues Régionales Européennes</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Breton</Text>
              <Text style={styles.languageSpeakers}>200k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇪🇸</Text>
              <Text style={styles.languageName}>Catalan</Text>
              <Text style={styles.languageSpeakers}>10M locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Corse</Text>
              <Text style={styles.languageSpeakers}>100k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Basque</Text>
              <Text style={styles.languageSpeakers}>750k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Ch'ti/Picard</Text>
              <Text style={styles.languageSpeakers}>300k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Gallois</Text>
              <Text style={styles.languageSpeakers}>600k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Gaélique</Text>
              <Text style={styles.languageSpeakers}>60k locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Occitan</Text>
              <Text style={styles.languageSpeakers}>200k locuteurs</Text>
            </View>
          </View>          
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>🌎</Text>
            <Text style={styles.languageName}>+ Autres à venir</Text>
            <Text style={styles.languageSpeakers}>Expansion continue</Text>
          </View>
        </View>
      </View>
      
      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.featureCard,
              feature.special && styles.specialFeatureCard
            ]}
            onPress={feature.action}
            activeOpacity={0.7}
          >
            <View style={styles.featureHeader}>
              <Text style={[
                styles.featureTitle,
                feature.special && styles.specialFeatureTitle
              ]}>{feature.title}</Text>
              <Text style={[
                styles.featureArrow,
                feature.special && styles.specialFeatureArrow
              ]}>→</Text>
            </View>
            <Text style={[
              styles.featureSubtitle,
              feature.special && styles.specialFeatureSubtitle
            ]}>{feature.subtitle}</Text>
            <Text style={[
              styles.featureDescription,
              feature.special && styles.specialFeatureDescription
            ]}>{feature.description}</Text>
            {feature.special && (
              <View style={styles.specialBadge}>
                <Text style={styles.specialBadgeText}>NOUVEAU</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>      {/* Langues Supportées */}
      <View style={styles.languagesSection}>
        <Text style={styles.sectionTitle}>Langues Supportées</Text>
        
        {/* Langues Autochtones */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🏛️ Langues Autochtones</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇲🇽</Text>
              <Text style={styles.languageName}>Maya Yucatèque</Text>
              <Text style={styles.languageSpeakers}>800,000 locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇵🇪</Text>
              <Text style={styles.languageName}>Quechua</Text>
              <Text style={styles.languageSpeakers}>8M locuteurs</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇵🇾</Text>
              <Text style={styles.languageName}>Guarani</Text>
              <Text style={styles.languageSpeakers}>6M locuteurs</Text>
            </View>
          </View>
        </View>

        {/* Langues Régionales Européennes */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🇪🇺 Langues Régionales Européennes</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Breton</Text>
              <Text style={styles.languageSpeakers}>200,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Bretagne</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇪🇸</Text>
              <Text style={styles.languageName}>Catalan</Text>
              <Text style={styles.languageSpeakers}>10M locuteurs</Text>
              <Text style={styles.languageCategory}>Catalogne</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Corse</Text>
              <Text style={styles.languageSpeakers}>100,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Corse</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇪🇸</Text>
              <Text style={styles.languageName}>Basque</Text>
              <Text style={styles.languageSpeakers}>750,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Euskadi</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Ch'ti/Picard</Text>
              <Text style={styles.languageSpeakers}>300,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Nord France</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Gallois</Text>
              <Text style={styles.languageSpeakers}>600,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Pays de Galles</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🏴</Text>
              <Text style={styles.languageName}>Gaélique</Text>
              <Text style={styles.languageSpeakers}>60,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Écosse</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageName}>Occitan</Text>
              <Text style={styles.languageSpeakers}>200,000 locuteurs</Text>
              <Text style={styles.languageCategory}>Sud France</Text>
            </View>
          </View>
        </View>

        {/* Nouvelles Langues Européennes - Extension 2025 */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🚀 Extension Européenne 2025</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇹</Text>
              <Text style={styles.languageName}>Sicilien</Text>
              <Text style={styles.languageSpeakers}>4.7M locuteurs</Text>
              <Text style={styles.languageCategory}>Sicile</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇩🇪</Text>
              <Text style={styles.languageName}>Bavarois</Text>
              <Text style={styles.languageSpeakers}>14M locuteurs</Text>
              <Text style={styles.languageCategory}>Bavière</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇳🇱</Text>
              <Text style={styles.languageName}>Frison</Text>
              <Text style={styles.languageSpeakers}>470K locuteurs</Text>
              <Text style={styles.languageCategory}>Frise</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇨🇭</Text>
              <Text style={styles.languageName}>Romanche</Text>
              <Text style={styles.languageSpeakers}>60K locuteurs</Text>
              <Text style={styles.languageCategory}>Grisons</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇹</Text>
              <Text style={styles.languageName}>Vénitien</Text>
              <Text style={styles.languageSpeakers}>4M locuteurs</Text>
              <Text style={styles.languageCategory}>Vénétie</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇹</Text>
              <Text style={styles.languageName}>Lombard</Text>
              <Text style={styles.languageSpeakers}>3.5M locuteurs</Text>
              <Text style={styles.languageCategory}>Lombardie</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇹</Text>
              <Text style={styles.languageName}>Napolitain</Text>
              <Text style={styles.languageSpeakers}>3M locuteurs</Text>
              <Text style={styles.languageCategory}>Campanie</Text>
            </View>
          </View>
        </View>

        {/* EXPANSION ASIATIQUE - Phase 1 */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🌏 Expansion Asiatique 2025</Text>
          <View style={styles.languageGrid}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇭🇰</Text>
              <Text style={styles.languageName}>Cantonais</Text>
              <Text style={styles.languageSpeakers}>80M locuteurs</Text>
              <Text style={styles.languageCategory}>Hong Kong</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇨🇳</Text>
              <Text style={styles.languageName}>Wu/Shanghaïen</Text>
              <Text style={styles.languageSpeakers}>77M locuteurs</Text>
              <Text style={styles.languageCategory}>Shanghai</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇩</Text>
              <Text style={styles.languageName}>Javanais</Text>
              <Text style={styles.languageSpeakers}>84M locuteurs</Text>
              <Text style={styles.languageCategory}>Java</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇮🇳</Text>
              <Text style={styles.languageName}>Marathi</Text>
              <Text style={styles.languageSpeakers}>83M locuteurs</Text>
              <Text style={styles.languageCategory}>Maharashtra</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mission Statement */}
      <View style={styles.missionSection}>
        <Text style={styles.missionTitle}>Notre Mission</Text>
        <Text style={styles.missionText}>
          Talk Kin est une plateforme dédiée à la préservation et à la revitalisation 
          des langues autochtones et régionales. Nous utilisons la technologie moderne pour maintenir 
          vivants ces trésors culturels ancestraux et faciliter leur transmission aux 
          nouvelles générations.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Fait avec ❤️ pour les communautés autochtones
        </Text>
        <Text style={styles.versionText}>Talk Kin v1.0</Text>
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
    backgroundColor: '#2c5aa0',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    marginBottom: 20,
  },
  taglineContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
  heroSection: {
    padding: 20,
    marginTop: -20,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 15,
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: 5,
  },
  languageName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5aa0',
  },
  featureArrow: {
    fontSize: 18,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  featureSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },  featureDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  specialFeatureCard: {
    backgroundColor: '#fff3e0',
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  specialFeatureTitle: {
    color: '#e65100',
  },
  specialFeatureArrow: {
    color: '#e65100',
  },
  specialFeatureSubtitle: {
    color: '#f57c00',
  },
  specialFeatureDescription: {
    color: '#bf360c',
  },
  specialBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  missionSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0',
    textAlign: 'center',
    marginBottom: 15,
  },
  missionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },  versionText: {
    fontSize: 10,
    color: '#bbb',
    textAlign: 'center',
  },
  languagesSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageSpeakers: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
  },
  languageCategory: {
    fontSize: 10,
    color: '#2c5aa0',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
  },
});

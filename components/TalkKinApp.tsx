import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native';
import HomePage from './HomePage';
import TranslatorPage from './TranslatorPage';
import VoicesPage from './VoicesPage';
import SettingsPage from './SettingsPage';
import { AIFeaturesPage } from './AIFeaturesPage';
import { Priority3Page } from './Priority3Page';
import GlobalActivationPage from './GlobalActivationPage';
import CrowdsourcingPage from './CrowdsourcingPage';
import { LearningPlatformPage } from './LearningPlatformPage';
import { PaymentPage } from './PaymentPage';
import CompetitiveAnalysisPage from './CompetitiveAnalysisPage';

export default function TalkKinApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateToPage} />;
      case 'translator':
        return <TranslatorPage onNavigate={navigateToPage} />;
      case 'voices':
        return <VoicesPage onNavigate={navigateToPage} />;
      case 'settings':
        return <SettingsPage onNavigate={navigateToPage} />;
      case 'ai-features':
        return <AIFeaturesPage />;
      case 'priority3':
        return <Priority3Page />;
      case 'global-activation':
        return <GlobalActivationPage onNavigate={navigateToPage} />;
      case 'crowdsourcing':
        return <CrowdsourcingPage onNavigate={navigateToPage} />;      case 'learning':
        return <LearningPlatformPage />;
      case 'payment':
        return <PaymentPage />;
      case 'competitive-analysis':
        return <CompetitiveAnalysisPage />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentPage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

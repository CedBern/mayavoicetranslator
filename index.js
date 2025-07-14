import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry, Platform } from 'react-native';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import TalkKinAppOptimized from './components/TalkKinAppOptimized';
import { ApiService } from './services/ApiService';
import { PWAService } from './services/PWAService';
import { PerformanceMonitoringService } from './services/PerformanceMonitoringService';

console.log("=== INDEX.JS CHARGÉ - TALKKIN VERSION OPTIMISÉE ===");

// Initialisation des services
const initializeServices = async () => {
  try {
    console.log("🔧 Initialisation des services...");
    
    // Initialisation PWA
    if (Platform.OS === 'web') {
      await PWAService.initialize();
      console.log("✅ PWA Service initialisé");
    }
    
    // Initialisation du monitoring de performance
    PerformanceMonitoringService.initialize();
    console.log("✅ Performance Monitoring initialisé");
    
    // Test de l'API
    const apiService = ApiService.getInstance();
    console.log("✅ API Service initialisé");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des services:", error);
  }
};

// Application principale pour le web
function App() {
  console.log("=== APP FUNCTION APPELÉE - TALKKIN OPTIMISÉ ===");
  
  React.useEffect(() => {
    initializeServices();
  }, []);
  
  return React.createElement(
    ErrorBoundary,
    null,
    React.createElement(
      AppProvider,
      { 
        enableDevTools: process.env.NODE_ENV === 'development',
        enablePersistence: true 
      },
      React.createElement(TalkKinAppOptimized)
    )
  );
}

// Montage pour le web
if (Platform.OS === 'web') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log("=== DOM CHARGÉ, MONTAGE DE TALKKIN OPTIMISÉ ===");
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.log("=== ÉLÉMENT ROOT TROUVÉ ===");
      const root = createRoot(rootElement);
      root.render(React.createElement(App));
      console.log("=== TALKKIN OPTIMISÉ MONTÉ AVEC SERVICES AVANCÉS ===");
    } else {
      console.error("=== ÉLÉMENT ROOT NON TROUVÉ ===");
    }
  });
} else {
  // Enregistrement pour React Native
  AppRegistry.registerComponent('main', () => App);
}

export default App;

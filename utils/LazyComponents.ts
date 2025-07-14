/**
 * 🚀 LAZY COMPONENTS CONFIGURATION
 * 
 * Configuration centralisée pour le chargement paresseux des composants
 * principaux de l'application TalkKin.
 */

import { withLazyLoading, ComponentPreloader } from './LazyLoader';

// Configuration des composants lazy (composants avec export default)
export const LazyComponents = {
  // Pages principales avec default export
  TranslatorPage: withLazyLoading(
    () => import('../components/TranslatorPage'),
    { errorBoundary: true }
  ),
  
  SettingsPage: withLazyLoading(
    () => import('../components/SettingsPage'),
    { errorBoundary: true }
  ),

  // Composants simples
  HomePage: withLazyLoading(
    () => import('../components/HomePage_fixed'),
    { errorBoundary: true }
  ),
};

// Fonction de préchargement des composants critiques
export function preloadCriticalComponents() {
  return ComponentPreloader.preloadMultiple([
    {
      key: 'translator',
      importFunc: () => import('../components/TranslatorPage'),
    },
    {
      key: 'settings',
      importFunc: () => import('../components/SettingsPage'),
    },
    {
      key: 'home',
      importFunc: () => import('../components/HomePage_fixed'),
    },
  ]);
}

// Fonction de préchargement conditionnel
export function preloadOnDemandComponents() {
  // Précharger les composants selon l'usage utilisateur
  const componentsToPreload = [
    {
      key: 'home-page',
      importFunc: () => import('../components/HomePage_fixed'),
    },
  ];

  // Précharger avec un délai pour ne pas impacter les performances initiales
  setTimeout(() => {
    ComponentPreloader.preloadMultiple(componentsToPreload);
  }, 2000);
}

// Types pour l'utilisation
export type LazyComponentName = keyof typeof LazyComponents;

// Helper pour obtenir un composant lazy par nom
export function getLazyComponent(name: LazyComponentName) {
  return LazyComponents[name];
}

// Stratégie de chargement intelligent
export class SmartLoadingStrategy {
  private static loadingQueue: Set<string> = new Set();
  private static loadedComponents: Set<string> = new Set();

  static shouldLoad(componentName: string, priority: 'high' | 'medium' | 'low' = 'medium'): boolean {
    // Ne pas recharger si déjà chargé
    if (this.loadedComponents.has(componentName)) {
      return false;
    }

    // Ne pas charger si déjà en cours
    if (this.loadingQueue.has(componentName)) {
      return false;
    }

    // Logique de priorité
    switch (priority) {
      case 'high':
        return true;
      case 'medium':
        // Charger si moins de 3 composants en cours de chargement
        return this.loadingQueue.size < 3;
      case 'low':
        // Charger seulement si aucun autre chargement en cours
        return this.loadingQueue.size === 0;
      default:
        return true;
    }
  }

  static markAsLoading(componentName: string) {
    this.loadingQueue.add(componentName);
  }

  static markAsLoaded(componentName: string) {
    this.loadingQueue.delete(componentName);
    this.loadedComponents.add(componentName);
  }

  static getLoadingStats() {
    return {
      loading: Array.from(this.loadingQueue),
      loaded: Array.from(this.loadedComponents),
      loadingCount: this.loadingQueue.size,
      loadedCount: this.loadedComponents.size,
    };
  }
}

export default LazyComponents;

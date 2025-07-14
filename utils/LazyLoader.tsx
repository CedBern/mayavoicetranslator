/**
 * 🔄 LAZY LOADING UTILITIES
 * 
 * Utilitaires pour le chargement paresseux des composants
 * et l'optimisation des performances.
 */

import React, { Suspense, ComponentType, lazy } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Interface pour les options de lazy loading
interface LazyLoadOptions {
  fallback?: React.ComponentType;
  delay?: number;
  errorBoundary?: boolean;
}

// Composant de fallback par défaut
const DefaultFallback = () => (
  <View style={styles.fallbackContainer}>
    <ActivityIndicator size="large" color="#667eea" />
    <Text style={styles.fallbackText}>Chargement...</Text>
  </View>
);

// Composant d'erreur
const ErrorFallback = ({ error }: { error: Error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Erreur de chargement</Text>
    <Text style={styles.errorText}>{error.message}</Text>
  </View>
);

/**
 * Wrapper pour le chargement paresseux avec Suspense
 */
export function withLazyLoading<P extends Record<string, any> = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFunc);
  const FallbackComponent = options.fallback || DefaultFallback;

  return function LazyWrapper(props: P) {
    if (options.errorBoundary) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<FallbackComponent />}>
            <LazyComponent {...(props as any)} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

/**
 * Hook pour le chargement conditionnel de composants
 */
export function useConditionalLazyLoad<P extends Record<string, any> = Record<string, any>>(
  condition: boolean,
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = React.useMemo(() => {
    if (!condition) return null;
    return withLazyLoading(importFunc as any, options);
  }, [condition, importFunc, options]);

  return LazyComponent;
}

/**
 * Boundary d'erreur simple pour les composants lazy
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Preloader pour les composants critiques
 */
export class ComponentPreloader {
  private static preloadCache = new Map<string, Promise<any>>();

  static preload(key: string, importFunc: () => Promise<any>) {
    if (!this.preloadCache.has(key)) {
      this.preloadCache.set(key, importFunc());
    }
    return this.preloadCache.get(key);
  }

  static preloadMultiple(components: Array<{ key: string; importFunc: () => Promise<any> }>) {
    return Promise.all(
      components.map(({ key, importFunc }) => this.preload(key, importFunc))
    );
  }

  static clear(key?: string) {
    if (key) {
      this.preloadCache.delete(key);
    } else {
      this.preloadCache.clear();
    }
  }
}

// Styles
const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    minHeight: 200,
  },
  fallbackText: {
    marginTop: 16,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20,
    minHeight: 200,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#7f1d1d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

// Exportations par défaut
export default {
  withLazyLoading,
  useConditionalLazyLoad,
  ComponentPreloader,
  ErrorBoundary,
};

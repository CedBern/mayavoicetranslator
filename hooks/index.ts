/**
 * 🎣 HOOKS OPTIMISÉS TALKKIN
 * 
 * Collection de hooks personnalisés pour optimiser les performances
 * et la réutilisabilité du code dans l'application TalkKin.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Dimensions, Platform } from 'react-native';
import ApiService from '../services/ApiService';
import CacheService from '../services/CacheService';

// Types
interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: number;
  confidence: number;
  audioUrl?: string;
}

interface UseTranslationOptions {
  cacheEnabled?: boolean;
  autoTranslate?: boolean;
  debounceMs?: number;
}

interface UsePerformanceOptions {
  enableMemoryTracking?: boolean;
  enableRenderTracking?: boolean;
  sampleInterval?: number;
}

/**
 * 🌐 Hook pour la traduction avec cache et optimisations
 */
export function useTranslation(options: UseTranslationOptions = {}) {
  const {
    cacheEnabled = true,
    autoTranslate = false,
    debounceMs = 500
  } = options;

  const [text, setText] = useState<string>('');
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromLanguage, setFromLanguage] = useState('maya');
  const [toLanguage, setToLanguage] = useState('fr');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de traduction optimisée avec cache
  const translate = useCallback(async (inputText?: string) => {
    const textToTranslate = inputText || text;
    if (!textToTranslate.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.translateText({
        text: textToTranslate,
        fromLanguage,
        toLanguage,
      });

      if (response.success) {
        const newTranslation: Translation = {
          id: `${Date.now()}-${Math.random()}`,
          originalText: textToTranslate,
          translatedText: response.data.translatedText,
          fromLanguage,
          toLanguage,
          timestamp: Date.now(),
          confidence: response.data.confidence,
          audioUrl: response.data.audioUrl,
        };

        setTranslation(newTranslation);

        // Mettre en cache si activé
        if (cacheEnabled) {
          await CacheService.set(
            `translation_${fromLanguage}_${toLanguage}_${textToTranslate}`,
            newTranslation,
            { ttl: 24 * 60 * 60 * 1000 } // 24h
          );
        }
      } else {
        setError(response.error || 'Erreur de traduction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [text, fromLanguage, toLanguage, cacheEnabled]);

  // Auto-traduction avec debounce
  useEffect(() => {
    if (autoTranslate && text.trim()) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        translate();
      }, debounceMs);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [text, translate, autoTranslate, debounceMs]);

  // Fonction pour échanger les langues
  const swapLanguages = useCallback(() => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    if (translation) {
      setText(translation.translatedText);
      setTranslation(null);
    }
  }, [fromLanguage, toLanguage, translation]);

  // Fonction pour effacer
  const clear = useCallback(() => {
    setText('');
    setTranslation(null);
    setError(null);
  }, []);

  return {
    text,
    setText,
    translation,
    isLoading,
    error,
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    translate,
    swapLanguages,
    clear,
  };
}

/**
 * 📱 Hook pour la gestion responsive
 */
export function useResponsive() {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const breakpoints = useMemo(() => ({
    isSmall: dimensions.width < 768,
    isMedium: dimensions.width >= 768 && dimensions.width < 1024,
    isLarge: dimensions.width >= 1024,
    isTablet: dimensions.width >= 768,
    isDesktop: dimensions.width >= 1024,
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,
  }), [dimensions.width, dimensions.height]);

  const getResponsiveValue = useCallback((values: {
    small?: any;
    medium?: any;
    large?: any;
    default: any;
  }) => {
    if (breakpoints.isLarge && values.large !== undefined) return values.large;
    if (breakpoints.isMedium && values.medium !== undefined) return values.medium;
    if (breakpoints.isSmall && values.small !== undefined) return values.small;
    return values.default;
  }, [breakpoints]);

  return {
    dimensions,
    breakpoints,
    getResponsiveValue,
    platform: {
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
      isWeb: Platform.OS === 'web',
    },
  };
}

/**
 * ⚡ Hook pour la surveillance des performances
 */
export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableMemoryTracking = true,
    enableRenderTracking = true,
    sampleInterval = 1000,
  } = options;

  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
  });

  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const componentMountTime = useRef<number>(Date.now());

  // Tracking des renders
  useEffect(() => {
    if (enableRenderTracking) {
      renderCountRef.current++;
      const renderTime = Date.now() - componentMountTime.current;
      renderTimesRef.current.push(renderTime);

      // Garder seulement les 10 derniers renders pour la moyenne
      if (renderTimesRef.current.length > 10) {
        renderTimesRef.current = renderTimesRef.current.slice(-10);
      }

      const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;

      setMetrics(prev => ({
        ...prev,
        renderCount: renderCountRef.current,
        lastRenderTime: renderTime,
        averageRenderTime,
      }));
    }
  });

  // Tracking de la mémoire
  useEffect(() => {
    if (!enableMemoryTracking) return;

    const interval = setInterval(() => {
      // Simulation du monitoring mémoire (en production, utiliser une vraie API)
      const memoryUsage = Math.random() * 100; // Mock pour la démo
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
      }));
    }, sampleInterval);

    return () => clearInterval(interval);
  }, [enableMemoryTracking, sampleInterval]);

  const logPerformanceWarning = useCallback((message: string, threshold: number, value: number) => {
    if (value > threshold) {
      console.warn(`⚠️ Performance Warning: ${message} (${value}ms > ${threshold}ms)`);
    }
  }, []);

  const measureOperation = useCallback(async <T>(
    operation: () => Promise<T> | T,
    operationName: string = 'Operation'
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log si l'opération est lente
      logPerformanceWarning(`${operationName} slow`, 100, duration);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, [logPerformanceWarning]);

  return {
    metrics,
    measureOperation,
    logPerformanceWarning,
  };
}

/**
 * 🔄 Hook pour les opérations asynchrones avec état
 */
export function useAsyncOperation<T, E = Error>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * 💾 Hook pour la persistence locale
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger depuis le cache au mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        const cached = await CacheService.get<T>(key);
        if (cached !== null) {
          setValue(cached);
        }
      } catch (error) {
        console.warn(`⚠️ Erreur chargement state persisté ${key}:`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadValue();
  }, [key]);

  // Sauvegarder quand la valeur change
  const setPersistentValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    const finalValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    setValue(finalValue);
    
    try {
      await CacheService.set(key, finalValue, { ttl: 30 * 24 * 60 * 60 * 1000 }); // 30 jours
    } catch (error) {
      console.warn(`⚠️ Erreur sauvegarde state persisté ${key}:`, error);
    }
  }, [key, value]);

  return [value, setPersistentValue, isLoaded] as const;
}

/**
 * 🎯 Hook pour la gestion du focus et de l'accessibilité
 */
export function useAccessibility() {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev.slice(-4), message]); // Garder les 5 derniers
    
    // Auto-effacer après 5 secondes
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 5000);
  }, []);

  const setFocus = useCallback((elementId: string) => {
    setFocusedElement(elementId);
    announce(`Focus sur ${elementId}`);
  }, [announce]);

  return {
    focusedElement,
    announcements,
    announce,
    setFocus,
  };
}

export default {
  useTranslation,
  useResponsive,
  usePerformance,
  useAsyncOperation,
  usePersistentState,
  useAccessibility,
};

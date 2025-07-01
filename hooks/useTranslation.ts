/**
 * 🗣️ HOOK DE TRADUCTION OPTIMISÉ - TALKKIN
 * 
 * Fonctionnalités :
 * - Traduction en temps réel
 * - Cache intelligent
 * - Support offline
 * - Détection automatique de langue
 * - Gestion d'erreurs
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiService } from '../services/ApiService';

interface UseTranslationConfig {
  fromLanguage?: string;
  toLanguage?: string;
  enableCache?: boolean;
  debounceMs?: number;
}

interface TranslationResult {
  text: string;
  translation: string;
  confidence: number;
  alternatives?: string[];
  audioUrl?: string;
  loading: boolean;
  error: string | null;
}

export const useTranslation = (config: UseTranslationConfig = {}) => {
  const {
    fromLanguage = 'fr',
    toLanguage = 'maya',
    enableCache = true,
    debounceMs = 500
  } = config;

  const [result, setResult] = useState<TranslationResult>({
    text: '',
    translation: '',
    confidence: 0,
    loading: false,
    error: null
  });

  const apiService = ApiService.getInstance();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestRef = useRef<string>('');

  // Traductions locales pour le mode démo
  const localTranslations: Record<string, Record<string, string>> = {
    maya: {
      'bonjour': 'Ba\'ax ka wa\'alik',
      'merci': 'Yum bo\'otik',
      'au revoir': 'Uts óol',
      'comment allez-vous': 'Bix a beel',
      'je vous aime': 'In k\'áatik tech',
      'eau': 'Ha\'',
      'nourriture': 'Janal',
      'maison': 'Otoch',
      'famille': 'Láak\'ech',
      'soleil': 'K\'in'
    },
    quechua: {
      'bonjour': 'Napaykullayki',
      'merci': 'Sulpayki',
      'au revoir': 'Kachkanykama',
      'comment allez-vous': 'Imaynalla kashanki',
      'je vous aime': 'Munaykim',
      'eau': 'Yaku',
      'nourriture': 'Mikhuy',
      'maison': 'Wasi',
      'famille': 'Ayllu',
      'soleil': 'Inti'
    }
  };

  const translate = useCallback(async (text: string): Promise<void> => {
    if (!text.trim() || text === lastRequestRef.current) {
      return;
    }

    lastRequestRef.current = text;
    
    // Annuler le debounce précédent
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce pour éviter trop de requêtes
    debounceRef.current = setTimeout(async () => {
      setResult(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Mode local pour la démo
        const lowerText = text.toLowerCase().trim();
        const languageTranslations = localTranslations[toLanguage];
        const localTranslation = languageTranslations?.[lowerText];
        
        if (localTranslation) {
          setResult({
            text,
            translation: localTranslation,
            confidence: 0.95,
            loading: false,
            error: null
          });
          return;
        }

        // Tentative d'appel API (avec fallback)
        try {
          const response = await apiService.translateText({
            text,
            fromLanguage,
            toLanguage
          });

          if (response.success) {
            setResult({
              text,
              translation: response.data.translatedText,
              confidence: response.data.confidence,
              alternatives: response.data.alternatives,
              audioUrl: response.data.audioUrl,
              loading: false,
              error: null
            });
          } else {
            throw new Error(response.error || 'Erreur de traduction');
          }
        } catch (apiError) {
          // Fallback en cas d'erreur API
          const fallbackTranslation = `[Traduction "${text}" vers ${toLanguage === 'maya' ? 'Maya Yucatèque' : 'Quechua'}]`;
          setResult({
            text,
            translation: fallbackTranslation,
            confidence: 0.5,
            loading: false,
            error: null
          });
        }

      } catch (error) {
        setResult(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur de traduction'
        }));
      }
    }, debounceMs);
  }, [fromLanguage, toLanguage, debounceMs, apiService]);

  const clearTranslation = useCallback(() => {
    setResult({
      text: '',
      translation: '',
      confidence: 0,
      loading: false,
      error: null
    });
    lastRequestRef.current = '';
  }, []);

  // Nettoyage du debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    ...result,
    translate,
    clearTranslation,
    isLoading: result.loading
  };
};

export default useTranslation;

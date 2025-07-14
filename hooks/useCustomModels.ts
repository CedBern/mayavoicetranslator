/**
 * 🤖 HOOK POUR MODÈLES IA PERSONNALISÉS - TALKKIN
 * 
 * Fonctionnalités :
 * - Interface simple pour modèles personnalisés
 * - Gestion d'état des traductions avancées
 * - Métrique de performance des modèles
 * - Contribution de données d'entraînement
 */

import { useState, useCallback, useEffect } from 'react';
import { CustomModelService, TranslationResult, ASRResult, ModelMetrics } from '../services/CustomModelService';

interface UseCustomModelsOptions {
  language: 'maya' | 'quechua';
  enableAdvancedFeatures?: boolean;
  autoLoadMetrics?: boolean;
}

interface CustomModelsState {
  // Translation
  translationResult: TranslationResult | null;
  isTranslating: boolean;
  translationError: string | null;
  
  // ASR
  asrResult: ASRResult | null;
  isRecognizing: boolean;
  asrError: string | null;
  
  // Metrics
  modelMetrics: ModelMetrics | null;
  metricsLoading: boolean;
  
  // Training
  contributionStatus: 'idle' | 'contributing' | 'success' | 'error';
  retrainingStatus: 'idle' | 'pending' | 'running' | 'completed' | 'failed';
}

export const useCustomModels = (options: UseCustomModelsOptions) => {
  const { language, enableAdvancedFeatures = true, autoLoadMetrics = true } = options;
  
  const [state, setState] = useState<CustomModelsState>({
    translationResult: null,
    isTranslating: false,
    translationError: null,
    asrResult: null,
    isRecognizing: false,
    asrError: null,
    modelMetrics: null,
    metricsLoading: false,
    contributionStatus: 'idle',
    retrainingStatus: 'idle'
  });

  const customModelService = CustomModelService.getInstance();

  // Initialize service
  useEffect(() => {
    customModelService.initialize().catch(console.error);
  }, []);

  // Load metrics automatically
  useEffect(() => {
    if (autoLoadMetrics && enableAdvancedFeatures) {
      loadModelMetrics();
    }
  }, [language, autoLoadMetrics, enableAdvancedFeatures]);

  /**
   * Traduction avec modèle personnalisé
   */
  const translateWithAI = useCallback(async (
    text: string,
    options: {
      includeAlternatives?: boolean;
      includeCulturalNotes?: boolean;
      includePronunciation?: boolean;
    } = {}
  ) => {
    setState(prev => ({ ...prev, isTranslating: true, translationError: null }));
    
    try {
      const result = await customModelService.translateWithCustomModel(
        text, 
        language, 
        {
          includeAlternatives: enableAdvancedFeatures && options.includeAlternatives,
          includeCulturalNotes: enableAdvancedFeatures && options.includeCulturalNotes,
          includePronunciation: enableAdvancedFeatures && options.includePronunciation
        }
      );
      
      setState(prev => ({
        ...prev,
        translationResult: result,
        isTranslating: false
      }));
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de traduction IA';
      setState(prev => ({
        ...prev,
        translationError: errorMessage,
        isTranslating: false
      }));
      throw error;
    }
  }, [language, enableAdvancedFeatures, customModelService]);

  /**
   * Reconnaissance vocale avec modèle personnalisé
   */
  const recognizeSpeechWithAI = useCallback(async (
    audioData: ArrayBuffer,
    options: {
      realTime?: boolean;
      includeSegments?: boolean;
      includeAlternatives?: boolean;
    } = {}
  ) => {
    setState(prev => ({ ...prev, isRecognizing: true, asrError: null }));
    
    try {
      const result = await customModelService.recognizeSpeechWithCustomModel(
        audioData,
        language,
        {
          realTime: options.realTime,
          includeSegments: enableAdvancedFeatures && options.includeSegments,
          includeAlternatives: enableAdvancedFeatures && options.includeAlternatives
        }
      );
      
      setState(prev => ({
        ...prev,
        asrResult: result,
        isRecognizing: false
      }));
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de reconnaissance vocale IA';
      setState(prev => ({
        ...prev,
        asrError: errorMessage,
        isRecognizing: false
      }));
      throw error;
    }
  }, [language, enableAdvancedFeatures, customModelService]);

  /**
   * Charger les métriques du modèle
   */
  const loadModelMetrics = useCallback(async () => {
    setState(prev => ({ ...prev, metricsLoading: true }));
    
    try {
      const translationModelId = `talkkin-${language}-translation-v1`;
      const metrics = await customModelService.getModelMetrics(translationModelId);
      
      setState(prev => ({
        ...prev,
        modelMetrics: metrics,
        metricsLoading: false
      }));
      
      return metrics;
      
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
      setState(prev => ({ ...prev, metricsLoading: false }));
    }
  }, [language, customModelService]);

  /**
   * Contribuer des données d'entraînement
   */
  const contributeTrainingData = useCallback(async (data: {
    sourceText?: string;
    targetText?: string;
    audioData?: ArrayBuffer;
    transcription?: string;
    metadata?: {
      speaker_id?: string;
      dialect?: string;
      quality_score?: number;
      cultural_context?: string;
    };
  }) => {
    setState(prev => ({ ...prev, contributionStatus: 'contributing' }));
    
    try {
      const success = await customModelService.contributeTrainingData(
        {
          source_text: data.sourceText,
          target_text: data.targetText,
          audio_data: data.audioData,
          transcription: data.transcription,
          metadata: data.metadata || {}
        },
        language
      );
      
      setState(prev => ({
        ...prev,
        contributionStatus: success ? 'success' : 'error'
      }));
      
      return success;
      
    } catch (error) {
      console.error('Erreur lors de la contribution:', error);
      setState(prev => ({ ...prev, contributionStatus: 'error' }));
      return false;
    }
  }, [language, customModelService]);

  /**
   * Déclencher un réentraînement
   */
  const triggerRetraining = useCallback(async (modelType: 'translation' | 'asr') => {
    setState(prev => ({ ...prev, retrainingStatus: 'pending' }));
    
    try {
      const jobId = await customModelService.triggerModelRetraining(language, modelType);
      setState(prev => ({ ...prev, retrainingStatus: 'running' }));
      
      // Polling du statut (simplifié pour la démo)
      const checkStatus = async () => {
        try {
          const status = await customModelService.getTrainingStatus(jobId);
          setState(prev => ({ ...prev, retrainingStatus: status.status }));
          
          if (status.status === 'running' || status.status === 'pending') {
            setTimeout(checkStatus, 5000); // Check every 5 seconds
          } else if (status.status === 'completed') {
            // Recharger les métriques
            await loadModelMetrics();
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut:', error);
          setState(prev => ({ ...prev, retrainingStatus: 'failed' }));
        }
      };
      
      setTimeout(checkStatus, 2000); // Initial check after 2 seconds
      return jobId;
      
    } catch (error) {
      console.error('Erreur lors du déclenchement:', error);
      setState(prev => ({ ...prev, retrainingStatus: 'failed' }));
      throw error;
    }
  }, [language, customModelService, loadModelMetrics]);

  /**
   * Effacer les résultats
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      translationResult: null,
      translationError: null,
      asrResult: null,
      asrError: null
    }));
  }, []);

  /**
   * Reset du statut de contribution
   */
  const resetContributionStatus = useCallback(() => {
    setState(prev => ({ ...prev, contributionStatus: 'idle' }));
  }, []);

  /**
   * Obtenir un score de qualité global
   */
  const getQualityScore = useCallback((): number => {
    if (!state.modelMetrics) return 0;
    
    const { accuracy, bleu_score, wer } = state.modelMetrics;
    let score = 0;
    let factors = 0;
    
    if (accuracy !== undefined) {
      score += accuracy * 100;
      factors++;
    }
    
    if (bleu_score !== undefined) {
      score += bleu_score * 100;
      factors++;
    }
    
    if (wer !== undefined) {
      score += (1 - wer) * 100; // WER is error rate, so invert
      factors++;
    }
    
    return factors > 0 ? Math.round(score / factors) : 0;
  }, [state.modelMetrics]);

  return {
    // State
    ...state,
    
    // Actions
    translateWithAI,
    recognizeSpeechWithAI,
    loadModelMetrics,
    contributeTrainingData,
    triggerRetraining,
    clearResults,
    resetContributionStatus,
    
    // Computed
    qualityScore: getQualityScore(),
    isReady: !state.metricsLoading,
    hasAdvancedFeatures: enableAdvancedFeatures,
    
    // Helpers
    getConfidenceLevel: (confidence: number) => {
      if (confidence >= 0.9) return 'excellent';
      if (confidence >= 0.8) return 'good';
      if (confidence >= 0.7) return 'fair';
      return 'poor';
    },
    
    formatExecutionTime: (time: number) => {
      return time < 1000 ? `${Math.round(time)}ms` : `${(time / 1000).toFixed(1)}s`;
    }
  };
};

export default useCustomModels;

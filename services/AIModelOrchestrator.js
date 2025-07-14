// Orchestrateur principal pour les services IA avancés (Priorité 2)
import { CustomMayaModelTrainer } from './CustomMayaModelTrainer.js';
import { RealVectorDatabaseService } from './RealVectorDatabaseService.js';
import { AdvancedAudioCorpusService } from './AdvancedAudioCorpusService.js';
import { NativeTTSModelDeveloper } from './NativeTTSModelDeveloper.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Orchestrateur central pour coordonner tous les services IA avancés
 * Gère l'entraînement, la synchronisation et l'optimisation des modèles
 */
class AIModelOrchestrator {
  constructor() {
    this.services = {
      modelTrainer: new CustomMayaModelTrainer(),
      vectorDB: new RealVectorDatabaseService(),
      audioCorpus: new AdvancedAudioCorpusService(),
      ttsModels: new NativeTTSModelDeveloper()
    };
    
    this.orchestrationConfig = {
      training_pipeline: {
        stages: [
          'corpus_preparation',
          'vector_indexing',
          'model_training',
          'tts_development',
          'evaluation',
          'deployment'
        ],
        parallel_processing: true,
        max_concurrent_jobs: 4,
        resource_monitoring: true
      },
      
      synchronization: {
        model_versions: new Map(),
        data_consistency_checks: true,
        cross_service_validation: true,
        backup_strategy: 'incremental'
      },
      
      optimization: {
        auto_tuning: true,
        performance_monitoring: true,
        resource_allocation: 'dynamic',
        scaling_strategy: 'horizontal'
      }
    };
    
    this.trainingPipeline = new Map();
    this.activeJobs = new Map();
    this.performanceMetrics = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialise l'orchestrateur et tous les services IA
   */
  async initialize() {
    try {
      console.log('🚀 Initialisation de l\'orchestrateur IA...');
      
      // Initialisation des services en parallèle
      const initPromises = [
        this.services.modelTrainer.initialize(),
        this.services.vectorDB.initialize(),
        this.services.audioCorpus.initialize(),
        this.services.ttsModels.initialize()
      ];
      
      await Promise.all(initPromises);
      
      // Configuration de la synchronisation inter-services
      await this.setupServiceSynchronization();
      
      // Vérification de la cohérence des données
      await this.performConsistencyCheck();
      
      this.isInitialized = true;
      console.log('✅ Orchestrateur IA initialisé avec succès');
      
      return {
        success: true,
        services_ready: Object.keys(this.services).length,
        pipeline_stages: this.orchestrationConfig.training_pipeline.stages.length
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      throw error;
    }
  }

  /**
   * Lance un pipeline d'entraînement complet pour une langue
   */
  async startTrainingPipeline(language, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const pipelineId = this.generatePipelineId(language);
    const config = {
      language,
      stages: options.stages || this.orchestrationConfig.training_pipeline.stages,
      parallel: options.parallel !== false,
      ...options
    };
    
    try {
      console.log(`🎯 Démarrage du pipeline d'entraînement pour ${language}`);
      
      this.trainingPipeline.set(pipelineId, {
        id: pipelineId,
        language,
        status: 'started',
        startTime: Date.now(),
        stages: new Map(),
        progress: 0
      });
      
      // Étape 1: Préparation du corpus
      await this.executeStage(pipelineId, 'corpus_preparation', async () => {
        return await this.services.audioCorpus.prepareCorpusForLanguage(language);
      });
      
      // Étape 2: Indexation vectorielle
      await this.executeStage(pipelineId, 'vector_indexing', async () => {
        const corpusData = await this.services.audioCorpus.getLanguageCorpus(language);
        return await this.services.vectorDB.indexLanguageData(language, corpusData);
      });
      
      // Étape 3: Entraînement du modèle (parallèle)
      if (config.parallel) {
        await Promise.all([
          this.executeStage(pipelineId, 'model_training', async () => {
            return await this.services.modelTrainer.trainLanguageModel(language);
          }),
          this.executeStage(pipelineId, 'tts_development', async () => {
            return await this.services.ttsModels.trainVoiceModel(language);
          })
        ]);
      } else {
        await this.executeStage(pipelineId, 'model_training', async () => {
          return await this.services.modelTrainer.trainLanguageModel(language);
        });
        
        await this.executeStage(pipelineId, 'tts_development', async () => {
          return await this.services.ttsModels.trainVoiceModel(language);
        });
      }
      
      // Étape 4: Évaluation
      await this.executeStage(pipelineId, 'evaluation', async () => {
        return await this.evaluateModels(language);
      });
      
      // Étape 5: Déploiement
      await this.executeStage(pipelineId, 'deployment', async () => {
        return await this.deployModels(language);
      });
      
      const pipeline = this.trainingPipeline.get(pipelineId);
      pipeline.status = 'completed';
      pipeline.endTime = Date.now();
      pipeline.duration = pipeline.endTime - pipeline.startTime;
      
      console.log(`✅ Pipeline d'entraînement complété pour ${language}`);
      return pipeline;
      
    } catch (error) {
      console.error(`❌ Erreur dans le pipeline pour ${language}:`, error);
      const pipeline = this.trainingPipeline.get(pipelineId);
      if (pipeline) {
        pipeline.status = 'failed';
        pipeline.error = error.message;
      }
      throw error;
    }
  }

  /**
   * Exécute une étape du pipeline avec monitoring
   */
  async executeStage(pipelineId, stageName, stageFunction) {
    const pipeline = this.trainingPipeline.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline ${pipelineId} non trouvé`);
    
    console.log(`📋 Exécution de l'étape: ${stageName}`);
    
    const stageStart = Date.now();
    pipeline.stages.set(stageName, {
      status: 'running',
      startTime: stageStart,
      progress: 0
    });
    
    try {
      const result = await stageFunction();
      
      pipeline.stages.set(stageName, {
        status: 'completed',
        startTime: stageStart,
        endTime: Date.now(),
        duration: Date.now() - stageStart,
        result
      });
      
      // Mise à jour du progrès global
      const completedStages = Array.from(pipeline.stages.values())
        .filter(stage => stage.status === 'completed').length;
      pipeline.progress = (completedStages / this.orchestrationConfig.training_pipeline.stages.length) * 100;
      
      console.log(`✅ Étape ${stageName} complétée (${pipeline.progress.toFixed(1)}%)`);
      return result;
      
    } catch (error) {
      pipeline.stages.set(stageName, {
        status: 'failed',
        startTime: stageStart,
        endTime: Date.now(),
        error: error.message
      });
      
      console.error(`❌ Échec de l'étape ${stageName}:`, error);
      throw error;
    }
  }

  /**
   * Évalue la performance des modèles entraînés
   */
  async evaluateModels(language) {
    const evaluation = {
      language,
      timestamp: Date.now(),
      metrics: {}
    };
    
    try {
      // Évaluation du modèle de traduction
      const translationMetrics = await this.services.modelTrainer.evaluateModel(language);
      evaluation.metrics.translation = translationMetrics;
      
      // Évaluation de la base vectorielle
      const vectorMetrics = await this.services.vectorDB.evaluateIndex(language);
      evaluation.metrics.vector_search = vectorMetrics;
      
      // Évaluation de la reconnaissance vocale
      const asrMetrics = await this.services.audioCorpus.evaluateASRModel(language);
      evaluation.metrics.speech_recognition = asrMetrics;
      
      // Évaluation TTS
      const ttsMetrics = await this.services.ttsModels.evaluateVoiceModel(language);
      evaluation.metrics.text_to_speech = ttsMetrics;
      
      // Score global
      evaluation.overall_score = this.calculateOverallScore(evaluation.metrics);
      
      this.performanceMetrics.set(language, evaluation);
      
      return evaluation;
      
    } catch (error) {
      console.error(`Erreur lors de l'évaluation pour ${language}:`, error);
      throw error;
    }
  }

  /**
   * Déploie les modèles validés
   */
  async deployModels(language) {
    try {
      const deployment = {
        language,
        timestamp: Date.now(),
        status: 'deploying',
        services: {}
      };
      
      // Déploiement du modèle de traduction
      deployment.services.translation = await this.services.modelTrainer.deployModel(language);
      
      // Déploiement de l'index vectoriel
      deployment.services.vector_db = await this.services.vectorDB.deployIndex(language);
      
      // Déploiement du modèle ASR
      deployment.services.asr = await this.services.audioCorpus.deployASRModel(language);
      
      // Déploiement du modèle TTS
      deployment.services.tts = await this.services.ttsModels.deployVoiceModel(language);
      
      deployment.status = 'deployed';
      deployment.endTime = Date.now();
      
      console.log(`🚀 Modèles déployés avec succès pour ${language}`);
      return deployment;
      
    } catch (error) {
      console.error(`Erreur lors du déploiement pour ${language}:`, error);
      throw error;
    }
  }

  /**
   * Synchronise les données entre services
   */
  async setupServiceSynchronization() {
    // Configuration des callbacks de synchronisation
    this.services.audioCorpus.onCorpusUpdate = async (language, data) => {
      await this.services.vectorDB.updateLanguageIndex(language, data);
      await this.services.modelTrainer.updateTrainingData(language, data);
    };
    
    this.services.modelTrainer.onModelUpdate = async (language, model) => {
      await this.services.vectorDB.updateLanguageModel(language, model);
    };
    
    this.services.vectorDB.onIndexUpdate = async (language, index) => {
      await this.services.ttsModels.updateLanguageContext(language, index);
    };
  }

  /**
   * Vérifie la cohérence des données entre services
   */
  async performConsistencyCheck() {
    const issues = [];
    
    // Vérifier que les langues sont cohérentes entre services
    const languages = {
      trainer: await this.services.modelTrainer.getSupportedLanguages(),
      vector: await this.services.vectorDB.getIndexedLanguages(),
      audio: await this.services.audioCorpus.getAvailableLanguages(),
      tts: await this.services.ttsModels.getTrainedLanguages()
    };
    
    // Identifier les incohérences
    const allLanguages = new Set([
      ...languages.trainer,
      ...languages.vector,
      ...languages.audio,
      ...languages.tts
    ]);
    
    for (const lang of allLanguages) {
      const availability = {
        trainer: languages.trainer.includes(lang),
        vector: languages.vector.includes(lang),
        audio: languages.audio.includes(lang),
        tts: languages.tts.includes(lang)
      };
      
      const availableCount = Object.values(availability).filter(Boolean).length;
      if (availableCount < 4) {
        issues.push({
          type: 'language_inconsistency',
          language: lang,
          availability,
          severity: availableCount < 2 ? 'high' : 'medium'
        });
      }
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ Incohérences détectées:', issues);
    }
    
    return issues;
  }

  /**
   * Calcule le score global de performance
   */
  calculateOverallScore(metrics) {
    const weights = {
      translation: 0.3,
      vector_search: 0.2,
      speech_recognition: 0.25,
      text_to_speech: 0.25
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const [metric, weight] of Object.entries(weights)) {
      if (metrics[metric] && metrics[metric].score !== undefined) {
        weightedSum += metrics[metric].score * weight;
        totalWeight += weight;
      }
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Génère un ID unique pour le pipeline
   */
  generatePipelineId(language) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${language}_pipeline_${timestamp}_${random}`;
  }

  /**
   * Obtient le statut de tous les pipelines actifs
   */
  getActivePipelines() {
    return Array.from(this.trainingPipeline.values())
      .filter(pipeline => ['started', 'running'].includes(pipeline.status));
  }

  /**
   * Obtient les métriques de performance
   */
  getPerformanceMetrics() {
    return Object.fromEntries(this.performanceMetrics);
  }

  /**
   * Nettoie les ressources et arrête tous les processus
   */
  async shutdown() {
    console.log('🛑 Arrêt de l\'orchestrateur IA...');
    
    // Arrêter tous les services
    const shutdownPromises = [
      this.services.modelTrainer.shutdown(),
      this.services.vectorDB.shutdown(),
      this.services.audioCorpus.shutdown(),
      this.services.ttsModels.shutdown()
    ];
    
    await Promise.allSettled(shutdownPromises);
    
    this.trainingPipeline.clear();
    this.activeJobs.clear();
    this.performanceMetrics.clear();
    this.isInitialized = false;
    
    console.log('✅ Orchestrateur IA arrêté');
  }
}

export { AIModelOrchestrator };

// Script d'entraînement automatique des modèles IA
import { AIModelOrchestrator } from './services/AIModelOrchestrator.js';
import { AIModelCICD } from './services/AIModelCICD.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Gestionnaire d'entraînement automatique pour tous les modèles IA
 * Orchestre l'entraînement continu et le déploiement des modèles
 */
class AutoTrainingManager {
  constructor() {
    this.orchestrator = new AIModelOrchestrator();
    this.cicd = new AIModelCICD();
    this.trainingQueue = new Map();
    this.activeTraining = new Map();
    this.scheduledTasks = new Map();
    
    this.config = {
      training: {
        max_concurrent_languages: 2,
        auto_retry_failed: true,
        retry_delay: 300000, // 5 minutes
        max_retries: 3,
        resource_monitoring: true
      },
      
      scheduling: {
        enabled: true,
        daily_training_time: '02:00', // 2h du matin
        weekly_full_retrain: 'sunday',
        incremental_update_interval: 3600000, // 1 heure
        performance_check_interval: 1800000 // 30 minutes
      },
      
      deployment: {
        auto_deploy: true,
        min_accuracy_threshold: 0.85,
        staging_validation_required: true,
        production_approval_required: false, // Pour automatisation
        rollback_on_failure: true
      },
      
      monitoring: {
        enabled: true,
        alert_on_degradation: true,
        performance_trend_analysis: true,
        resource_usage_alerts: true
      }
    };
    
    this.languages = ['yua', 'quc', 'cak', 'mam', 'qu', 'nah', 'gn'];
    this.modelTypes = ['translation', 'tts', 'asr', 'vector_search'];
    
    this.isRunning = false;
    this.startTime = null;
    this.statistics = {
      total_trainings: 0,
      successful_trainings: 0,
      failed_trainings: 0,
      total_deployments: 0,
      successful_deployments: 0,
      failed_deployments: 0
    };
  }

  /**
   * Lance le gestionnaire d'entraînement automatique
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Le gestionnaire d\'entraînement est déjà en cours d\'exécution');
      return;
    }
    
    try {
      console.log('🚀 Démarrage du gestionnaire d\'entraînement automatique...');
      this.startTime = Date.now();
      this.isRunning = true;
      
      // Initialisation des services
      await this.orchestrator.initialize();
      await this.cicd.initialize();
      
      // Chargement de la configuration et des queues
      await this.loadConfiguration();
      await this.loadTrainingQueue();
      
      // Démarrage des tâches automatiques
      await this.startScheduledTasks();
      
      // Démarrage du monitoring
      this.startMonitoring();
      
      // Traitement initial de la queue
      await this.processTrainingQueue();
      
      console.log('✅ Gestionnaire d\'entraînement automatique démarré avec succès');
      
      // Maintien du processus actif
      this.keepAlive();
      
    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Ajoute une tâche d'entraînement à la queue
   */
  async scheduleTraining(language, modelType, options = {}) {
    const taskId = this.generateTaskId(language, modelType);
    const task = {
      id: taskId,
      language,
      modelType,
      priority: options.priority || 'normal',
      scheduled_time: options.scheduledTime || Date.now(),
      retries: 0,
      max_retries: options.maxRetries || this.config.training.max_retries,
      options: {
        architecture: options.architecture,
        epochs: options.epochs,
        batch_size: options.batchSize,
        learning_rate: options.learningRate,
        ...options
      },
      status: 'queued',
      created_at: Date.now()
    };
    
    this.trainingQueue.set(taskId, task);
    console.log(`📅 Tâche d'entraînement programmée: ${taskId} (${language}/${modelType})`);
    
    // Sauvegarde de la queue
    await this.saveTrainingQueue();
    
    // Traitement immédiat si possible
    if (this.isRunning) {
      await this.processTrainingQueue();
    }
    
    return taskId;
  }

  /**
   * Traite la queue d'entraînement
   */
  async processTrainingQueue() {
    if (!this.isRunning) return;
    
    const activeTasks = this.activeTraining.size;
    const maxConcurrent = this.config.training.max_concurrent_languages;
    
    if (activeTasks >= maxConcurrent) {
      console.log(`⏳ Limite de concurrence atteinte (${activeTasks}/${maxConcurrent})`);
      return;
    }
    
    // Récupération des tâches prêtes à être exécutées
    const readyTasks = Array.from(this.trainingQueue.values())
      .filter(task => 
        task.status === 'queued' && 
        task.scheduled_time <= Date.now()
      )
      .sort((a, b) => {
        // Tri par priorité puis par temps de création
        const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return priorityDiff !== 0 ? priorityDiff : a.created_at - b.created_at;
      });
    
    const availableSlots = maxConcurrent - activeTasks;
    const tasksToProcess = readyTasks.slice(0, availableSlots);
    
    for (const task of tasksToProcess) {
      await this.executeTrainingTask(task);
    }
  }

  /**
   * Exécute une tâche d'entraînement
   */
  async executeTrainingTask(task) {
    const { id, language, modelType } = task;
    
    try {
      console.log(`🎯 Début d'entraînement: ${id}`);
      
      // Mise à jour du statut
      task.status = 'running';
      task.start_time = Date.now();
      this.activeTraining.set(id, task);
      this.trainingQueue.delete(id);
      
      // Exécution de l'entraînement selon le type de modèle
      let result;
      switch (modelType) {
        case 'full_pipeline':
          result = await this.orchestrator.startTrainingPipeline(language, task.options);
          break;
        case 'translation':
          result = await this.orchestrator.services.modelTrainer.trainLanguageModel(language, task.options);
          break;
        case 'tts':
          result = await this.orchestrator.services.ttsModels.trainVoiceModel(language, task.options);
          break;
        case 'asr':
          result = await this.orchestrator.services.audioCorpus.trainASRModel(language, task.options);
          break;
        case 'vector_search':
          result = await this.orchestrator.services.vectorDB.reindexLanguage(language, task.options);
          break;
        default:
          throw new Error(`Type de modèle non supporté: ${modelType}`);
      }
      
      // Mise à jour du statut de réussite
      task.status = 'completed';
      task.end_time = Date.now();
      task.duration = task.end_time - task.start_time;
      task.result = result;
      
      this.statistics.total_trainings++;
      this.statistics.successful_trainings++;
      
      console.log(`✅ Entraînement complété: ${id} (${task.duration}ms)`);
      
      // Déploiement automatique si configuré
      if (this.config.deployment.auto_deploy) {
        await this.autoDeployModel(task);
      }
      
    } catch (error) {
      console.error(`❌ Erreur d'entraînement ${id}:`, error);
      
      task.status = 'failed';
      task.end_time = Date.now();
      task.error = error.message;
      task.retries++;
      
      this.statistics.total_trainings++;
      this.statistics.failed_trainings++;
      
      // Tentative de retry si configuré
      if (this.config.training.auto_retry_failed && task.retries < task.max_retries) {
        console.log(`🔄 Tentative de retry pour ${id} (${task.retries}/${task.max_retries})`);
        
        // Re-programmation avec délai
        task.status = 'queued';
        task.scheduled_time = Date.now() + this.config.training.retry_delay;
        this.trainingQueue.set(id, task);
      }
      
    } finally {
      // Nettoyage
      this.activeTraining.delete(id);
      await this.saveTrainingQueue();
      
      // Traitement de la queue suivante
      setTimeout(() => this.processTrainingQueue(), 1000);
    }
  }

  /**
   * Déploie automatiquement un modèle entraîné
   */
  async autoDeployModel(trainingTask) {
    const { language, modelType, result } = trainingTask;
    
    try {
      // Vérification des seuils de qualité
      if (result && result.metrics) {
        const accuracy = result.metrics.accuracy || result.overall_score || 0;
        if (accuracy < this.config.deployment.min_accuracy_threshold) {
          console.log(`⚠️ Modèle ${language}/${modelType} en dessous du seuil (${accuracy} < ${this.config.deployment.min_accuracy_threshold})`);
          return;
        }
      }
      
      console.log(`🚀 Déploiement automatique: ${language}/${modelType}`);
      
      // Déploiement via CI/CD
      const deploymentResult = await this.cicd.deployModel(language, modelType, {
        environment: 'staging',
        auto_promote: !this.config.deployment.production_approval_required
      });
      
      this.statistics.total_deployments++;
      
      if (deploymentResult.status === 'completed') {
        this.statistics.successful_deployments++;
        console.log(`✅ Déploiement réussi: ${language}/${modelType}`);
      } else {
        this.statistics.failed_deployments++;
        console.log(`❌ Échec du déploiement: ${language}/${modelType}`);
      }
      
    } catch (error) {
      console.error(`❌ Erreur de déploiement automatique:`, error);
      this.statistics.total_deployments++;
      this.statistics.failed_deployments++;
    }
  }

  /**
   * Démarre les tâches programmées
   */
  async startScheduledTasks() {
    if (!this.config.scheduling.enabled) return;
    
    console.log('📅 Démarrage des tâches programmées...');
    
    // Entraînement quotidien
    this.scheduleDailyTraining();
    
    // Mise à jour incrémentale
    this.scheduleIncrementalUpdates();
    
    // Vérifications de performance
    this.schedulePerformanceChecks();
    
    // Entraînement complet hebdomadaire
    this.scheduleWeeklyRetraining();
  }

  /**
   * Programme l'entraînement quotidien
   */
  scheduleDailyTraining() {
    const [hours, minutes] = this.config.scheduling.daily_training_time.split(':');
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Si l'heure est déjà passée aujourd'hui, programmer pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    const dailyTask = setTimeout(async () => {
      console.log('🌅 Début de l\'entraînement quotidien...');
      
      // Entraînement de tous les modèles principaux
      for (const language of this.languages.slice(0, 4)) { // Limiter pour les ressources
        await this.scheduleTraining(language, 'translation', {
          priority: 'normal',
          epochs: 5,
          incremental: true
        });
      }
      
      // Re-programmation pour le lendemain
      this.scheduleDailyTraining();
      
    }, delay);
    
    this.scheduledTasks.set('daily_training', dailyTask);
    console.log(`📅 Entraînement quotidien programmé pour ${scheduledTime.toLocaleString()}`);
  }

  /**
   * Programme les mises à jour incrémentales
   */
  scheduleIncrementalUpdates() {
    const incrementalTask = setInterval(async () => {
      console.log('🔄 Mise à jour incrémentale...');
      
      // Mise à jour des index vectoriels
      const randomLanguage = this.languages[Math.floor(Math.random() * this.languages.length)];
      await this.scheduleTraining(randomLanguage, 'vector_search', {
        priority: 'low',
        incremental: true
      });
      
    }, this.config.scheduling.incremental_update_interval);
    
    this.scheduledTasks.set('incremental_updates', incrementalTask);
  }

  /**
   * Programme les vérifications de performance
   */
  schedulePerformanceChecks() {
    const performanceTask = setInterval(async () => {
      console.log('📊 Vérification de performance...');
      
      try {
        const metrics = this.orchestrator.getPerformanceMetrics();
        
        // Analyse des tendances de performance
        for (const [language, languageMetrics] of Object.entries(metrics)) {
          for (const [modelType, modelMetrics] of Object.entries(languageMetrics.metrics || {})) {
            if (modelMetrics.score < this.config.deployment.min_accuracy_threshold) {
              console.log(`⚠️ Performance dégradée détectée: ${language}/${modelType} (${modelMetrics.score})`);
              
              // Re-entraînement automatique
              await this.scheduleTraining(language, modelType, {
                priority: 'high',
                reason: 'performance_degradation'
              });
            }
          }
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de performance:', error);
      }
      
    }, this.config.scheduling.performance_check_interval);
    
    this.scheduledTasks.set('performance_checks', performanceTask);
  }

  /**
   * Programme l'entraînement complet hebdomadaire
   */
  scheduleWeeklyRetraining() {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(1, 0, 0, 0); // 1h du matin le dimanche
    
    const delay = nextSunday.getTime() - now.getTime();
    
    const weeklyTask = setTimeout(async () => {
      console.log('📅 Début de l\'entraînement complet hebdomadaire...');
      
      // Entraînement complet de tous les modèles
      for (const language of this.languages) {
        for (const modelType of this.modelTypes) {
          await this.scheduleTraining(language, modelType, {
            priority: 'normal',
            full_retrain: true,
            epochs: 20
          });
        }
      }
      
      // Re-programmation pour la semaine suivante
      this.scheduleWeeklyRetraining();
      
    }, delay);
    
    this.scheduledTasks.set('weekly_retraining', weeklyTask);
    console.log(`📅 Entraînement hebdomadaire programmé pour ${nextSunday.toLocaleString()}`);
  }

  /**
   * Démarre le monitoring
   */
  startMonitoring() {
    if (!this.config.monitoring.enabled) return;
    
    console.log('📊 Démarrage du monitoring...');
    
    const monitoringTask = setInterval(() => {
      this.logStatus();
    }, 60000); // Toutes les minutes
    
    this.scheduledTasks.set('monitoring', monitoringTask);
  }

  /**
   * Affiche le statut actuel
   */
  logStatus() {
    const uptime = Date.now() - this.startTime;
    const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(1);
    
    console.log(`\n📊 STATUT DU GESTIONNAIRE D'ENTRAÎNEMENT`);
    console.log(`   ⏱️ Temps de fonctionnement: ${uptimeHours}h`);
    console.log(`   📝 Tâches en queue: ${this.trainingQueue.size}`);
    console.log(`   🏃 Tâches actives: ${this.activeTraining.size}`);
    console.log(`   ✅ Entraînements réussis: ${this.statistics.successful_trainings}/${this.statistics.total_trainings}`);
    console.log(`   🚀 Déploiements réussis: ${this.statistics.successful_deployments}/${this.statistics.total_deployments}`);
    
    if (this.activeTraining.size > 0) {
      console.log(`   🎯 Tâches en cours:`);
      for (const [id, task] of this.activeTraining.entries()) {
        const duration = Date.now() - task.start_time;
        console.log(`      - ${id}: ${(duration / 1000).toFixed(0)}s`);
      }
    }
    
    console.log('');
  }

  /**
   * Sauvegarde la queue d'entraînement
   */
  async saveTrainingQueue() {
    try {
      const queueData = {
        queue: Array.from(this.trainingQueue.entries()),
        statistics: this.statistics,
        timestamp: Date.now()
      };
      
      await fs.writeFile('./data/training_queue.json', JSON.stringify(queueData, null, 2));
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la queue:', error);
    }
  }

  /**
   * Charge la queue d'entraînement
   */
  async loadTrainingQueue() {
    try {
      const data = await fs.readFile('./data/training_queue.json', 'utf-8');
      const queueData = JSON.parse(data);
      
      this.trainingQueue = new Map(queueData.queue || []);
      this.statistics = { ...this.statistics, ...queueData.statistics };
      
      console.log(`📂 Queue chargée: ${this.trainingQueue.size} tâches`);
    } catch (error) {
      console.log('📂 Aucune queue sauvegardée trouvée, démarrage avec une queue vide');
    }
  }

  /**
   * Charge la configuration
   */
  async loadConfiguration() {
    try {
      const configPath = './config/auto_training.json';
      const configData = await fs.readFile(configPath, 'utf-8');
      const loadedConfig = JSON.parse(configData);
      
      // Fusion avec la configuration par défaut
      this.config = { ...this.config, ...loadedConfig };
      console.log('📂 Configuration chargée depuis le fichier');
    } catch (error) {
      console.log('📂 Utilisation de la configuration par défaut');
    }
  }

  /**
   * Maintient le processus actif
   */
  keepAlive() {
    // Gestion des signaux pour arrêt propre
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    
    // Maintien du processus actif
    const keepAliveTask = setInterval(() => {
      // Vérification périodique de la queue
      this.processTrainingQueue();
    }, 30000); // Toutes les 30 secondes
    
    this.scheduledTasks.set('keep_alive', keepAliveTask);
  }

  /**
   * Arrêt propre du gestionnaire
   */
  async shutdown(signal = 'manual') {
    console.log(`\n🛑 Arrêt du gestionnaire d'entraînement (${signal})...`);
    
    this.isRunning = false;
    
    // Arrêt des tâches programmées
    for (const [name, task] of this.scheduledTasks.entries()) {
      clearTimeout(task);
      clearInterval(task);
      console.log(`   Arrêt de la tâche: ${name}`);
    }
    
    // Sauvegarde finale
    await this.saveTrainingQueue();
    
    // Arrêt des services
    await this.orchestrator.shutdown();
    await this.cicd.shutdown();
    
    const uptime = Date.now() - this.startTime;
    console.log(`✅ Gestionnaire arrêté après ${(uptime / 1000 / 60).toFixed(1)} minutes`);
    
    process.exit(0);
  }

  /**
   * Génère un ID unique pour une tâche
   */
  generateTaskId(language, modelType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `${language}_${modelType}_${timestamp}_${random}`;
  }

  /**
   * API pour contrôle externe
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      queueSize: this.trainingQueue.size,
      activeTasks: this.activeTraining.size,
      statistics: this.statistics,
      config: this.config
    };
  }

  async pauseTraining() {
    this.isRunning = false;
    console.log('⏸️ Entraînement mis en pause');
  }

  async resumeTraining() {
    this.isRunning = true;
    console.log('▶️ Entraînement repris');
    await this.processTrainingQueue();
  }
}

// Exécution si le script est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new AutoTrainingManager();
  
  // Démarrage automatique
  manager.start().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { AutoTrainingManager };

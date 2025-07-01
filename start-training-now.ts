/**
 * 🚀 SCRIPT DE DÉMARRAGE IMMÉDIAT - ENTRAÎNEMENT IA TALKKIN
 * 
 * Ce script permet de commencer immédiatement l'entraînement des modèles
 * avec les données pilotes collectées.
 */

import { CustomModelService } from './services/CustomModelService';
import { ApiService } from './services/ApiService';
import * as fs from 'fs';
// @ts-ignore
import * as csv from 'csv-parser';

interface TrainingData {
  french: string;
  target: string;
  confidence: number;
  cultural_notes: string;
  pronunciation_guide: string;
}

class ImmediateTrainingManager {
  private customModelService: CustomModelService;
  private apiService: ApiService;

  constructor() {
    this.customModelService = CustomModelService.getInstance();
    this.apiService = ApiService.getInstance();
  }

  /**
   * 📊 Chargement des données d'entraînement pilotes
   */
  async loadTrainingData(language: 'maya' | 'quechua'): Promise<TrainingData[]> {
    const filePath = `./data/training/${language}/parallel_corpus.csv`;
    const data: TrainingData[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: any) => {
          data.push({
            french: row.french,
            target: row[language],
            confidence: parseFloat(row.confidence),
            cultural_notes: row.cultural_notes,
            pronunciation_guide: row.pronunciation_guide
          });
        })
        .on('end', () => {
          console.log(`✅ Chargé ${data.length} phrases pour ${language}`);
          resolve(data);
        })
        .on('error', reject);
    });
  }

  /**
   * 🧠 Démarrage immédiat de l'entraînement
   */
  async startImmediateTraining(language: 'maya' | 'quechua') {
    console.log(`🚀 Démarrage entraînement ${language.toUpperCase()}...`);

    try {
      // 1. Charger les données
      const trainingData = await this.loadTrainingData(language);
      
      if (trainingData.length < 10) {
        throw new Error(`Données insuffisantes : ${trainingData.length} phrases`);
      }

      // 2. Préparer la configuration d'entraînement
      const trainingConfig = {
        modelType: 'translation' as const,
        language: language,
        datasetPath: `./data/training/${language}/parallel_corpus.csv`,
        baseModel: 'facebook/mbart-large-50-many-to-many-mmt',
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: Math.min(16, trainingData.length),
          epochs: 10,
          warmupSteps: Math.floor(trainingData.length * 0.1),
          gradientAccumulation: 2
        }
      };

      console.log(`📋 Configuration:`, trainingConfig);

      // 3. Lancer l'entraînement (simulation pour le moment)
      const trainingJob = await this.customModelService.trainTranslationModel(trainingConfig);
      
      console.log(`🎯 Job d'entraînement créé:`, trainingJob.id);
      
      // 4. Surveiller le progrès
      await this.monitorTraining(trainingJob.id);

      return trainingJob;

    } catch (error) {
      console.error(`❌ Erreur entraînement ${language}:`, error);
      throw error;
    }
  }

  /**
   * 📊 Surveillance du progrès d'entraînement
   */
  async monitorTraining(jobId: string) {
    console.log(`👀 Surveillance entraînement: ${jobId}`);
    
    const checkInterval = setInterval(async () => {
      try {
        const metrics = await this.customModelService.getModelMetrics(jobId);
        
        console.log(`📊 Métriques actuelles:`, {
          accuracy: `${(metrics.accuracy * 100).toFixed(1)}%`,
          bleu_score: `${metrics.bleu_score ? (metrics.bleu_score * 100).toFixed(1) : 'N/A'}%`,
          training_time: metrics.training_time ? `${Math.floor(metrics.training_time / 60)}min ${metrics.training_time % 60}s` : 'N/A',
          cultural_accuracy: metrics.cultural_accuracy ? `${(metrics.cultural_accuracy * 100).toFixed(1)}%` : 'N/A'
        });

        // Arrêter la surveillance si l'entraînement est terminé
        if (metrics.status === 'completed') {
          clearInterval(checkInterval);
          console.log(`🎉 Entraînement terminé avec succès !`);
          await this.deployModel(jobId);
        }

      } catch (error) {
        console.error(`⚠️ Erreur surveillance:`, error);
      }
    }, 30000); // Vérifier toutes les 30 secondes
  }

  /**
   * 🚀 Déploiement du modèle entraîné
   */
  async deployModel(jobId: string) {
    console.log(`🚀 Déploiement du modèle: ${jobId}`);
    
    try {
      const deployment = await this.customModelService.deployModel(
        `./models/${jobId}`,
        'production'
      );
      
      if (deployment) {
        console.log(`✅ Modèle déployé avec succès !`);
        console.log(`🔗 Endpoint: /api/translate/custom/${jobId}`);
        
        // Test immédiat du modèle déployé
        await this.testDeployedModel(jobId);
      }

    } catch (error) {
      console.error(`❌ Erreur déploiement:`, error);
    }
  }

  /**
   * 🧪 Test immédiat du modèle déployé
   */
  async testDeployedModel(modelId: string) {
    console.log(`🧪 Test du modèle déployé...`);

    const testPhrases = [
      "Bonjour",
      "Comment allez-vous ?",
      "Merci beaucoup",
      "Au revoir"
    ];

    for (const phrase of testPhrases) {
      try {
        const result = await this.customModelService.getTranslation(
          phrase,
          modelId,
          true // with confidence
        );

        console.log(`🔍 Test: "${phrase}"`);
        console.log(`📝 Traduction: "${result.translation}"`);
        console.log(`🎯 Confiance: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`⏱️ Temps: ${result.executionTime}ms`);
        console.log(`---`);

      } catch (error) {
        console.error(`❌ Erreur test phrase "${phrase}":`, error);
      }
    }
  }

  /**
   * 📈 Rapport de performance immédiat
   */
  async generatePerformanceReport() {
    console.log(`📈 Génération rapport de performance...`);

    try {
      const metrics = await this.customModelService.getModelMetrics('talkkin-maya-translation-v1');
      
      const report = {
        timestamp: new Date().toISOString(),
        models_count: metrics.models_trained || 0,
        average_accuracy: `${(metrics.accuracy * 100).toFixed(1)}%`,
        average_bleu: `${metrics.bleu_score ? (metrics.bleu_score * 100).toFixed(1) : 'N/A'}%`,
        cultural_preservation: metrics.cultural_accuracy ? `${(metrics.cultural_accuracy * 100).toFixed(1)}%` : 'N/A',
        total_training_time: metrics.training_time ? `${Math.floor(metrics.training_time / 3600)}h ${Math.floor((metrics.training_time % 3600) / 60)}min` : 'N/A',
        status: 'En production',
        next_steps: [
          'Collecter plus de données (objectif: 1000 phrases)',
          'Optimiser les hyperparamètres',
          'Ajouter reconnaissance vocale',
          'Intégrer validation communautaire'
        ]
      };

      console.log(`📋 RAPPORT IMMÉDIAT:`, JSON.stringify(report, null, 2));
      
      // Sauvegarder le rapport
      fs.writeFileSync(
        `./reports/training-report-${Date.now()}.json`,
        JSON.stringify(report, null, 2)
      );

      return report;

    } catch (error) {
      console.error(`❌ Erreur génération rapport:`, error);
    }
  }
}

/**
 * 🎯 FONCTION PRINCIPALE D'EXÉCUTION IMMÉDIATE
 */
async function startTrainingNow() {
  console.log(`🚀 DÉMARRAGE IMMÉDIAT - ENTRAÎNEMENT IA TALKKIN`);
  console.log(`⏰ ${new Date().toLocaleString()}`);
  console.log(`===================================================`);

  const trainer = new ImmediateTrainingManager();

  try {
    // 1. Entraîner Maya
    console.log(`🏛️ Phase 1: Entraînement Maya Yucatèque`);
    await trainer.startImmediateTraining('maya');

    // 2. Entraîner Quechua
    console.log(`🏔️ Phase 2: Entraînement Quechua`);
    await trainer.startImmediateTraining('quechua');

    // 3. Générer rapport final
    console.log(`📊 Phase 3: Rapport de performance`);
    await trainer.generatePerformanceReport();

    console.log(`🎉 ENTRAÎNEMENT IMMÉDIAT TERMINÉ AVEC SUCCÈS !`);

  } catch (error) {
    console.error(`❌ ERREUR CRITIQUE:`, error);
    process.exit(1);
  }
}

// 🚀 LANCEMENT IMMÉDIAT SI EXÉCUTION DIRECTE
if (require.main === module) {
  startTrainingNow()
    .then(() => {
      console.log(`✅ Script terminé avec succès`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`💥 Échec du script:`, error);
      process.exit(1);
    });
}

export { ImmediateTrainingManager, startTrainingNow };

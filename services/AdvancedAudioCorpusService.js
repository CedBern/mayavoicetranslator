// Service de corpus audio avancé pour reconnaissance vocale Maya
import fs from 'fs/promises';
import path from 'path';
import { Worker } from 'worker_threads';

/**
 * Service de gestion de corpus audio pour améliorer la reconnaissance vocale
 * Spécialisé dans les langues indigènes avec collecte communautaire
 */
class AdvancedAudioCorpusService {
  constructor() {
    this.corpusPath = './audio_corpus';
    this.processedPath = './audio_processed';
    this.modelsPath = './asr_models';
    
    this.audioFormats = {
      supported: ['.wav', '.mp3', '.m4a', '.flac', '.ogg'],
      target: {
        format: 'wav',
        sample_rate: 16000,
        bit_depth: 16,
        channels: 1
      }
    };
    
    this.languageConfigs = {
      'yua': {
        name: 'Maya Yucateco',
        speakers: {
          target: 100,
          current: 0,
          regions: ['Yucatán', 'Campeche', 'Quintana Roo']
        },
        phonetic_focus: {
          glottal_stops: ['ʔ', "'"],
          ejectives: ["k'", "p'", "t'", "ts'", "ch'", "x'"],
          vowel_lengths: ['a:', 'e:', 'i:', 'o:', 'u:'],
          tones: false
        },
        training_goals: {
          hours_total: 500,
          hours_current: 0,
          accuracy_target: 0.95,
          wer_target: 0.05
        }
      },
      'quc': {
        name: 'K\'iche\'',
        speakers: {
          target: 80,
          current: 0,
          regions: ['Guatemala Central', 'Quetzaltenango', 'Totonicapán']
        },
        phonetic_focus: {
          uvulars: ['q', "q'"],
          ejectives: ["k'", "p'", "t'", "tz'", "ch'"],
          complex_clusters: ['tzk', 'ntz', 'chk'],
          tones: false
        },
        training_goals: {
          hours_total: 300,
          hours_current: 0,
          accuracy_target: 0.93,
          wer_target: 0.07
        }
      },
      'cak': {
        name: 'Kaqchikel',
        speakers: {
          target: 60,
          current: 0,
          regions: ['Sacatepéquez', 'Chimaltenango', 'Guatemala Sur']
        },
        phonetic_focus: {
          uvulars: ['q', "q'"],
          ejectives: ["k'", "p'", "t'", "tz'"],
          retroflex: ['r'],
          tones: false
        },
        training_goals: {
          hours_total: 200,
          hours_current: 0,
          accuracy_target: 0.90,
          wer_target: 0.10
        }
      },
      'qu': {
        name: 'Quechua',
        speakers: {
          target: 120,
          current: 0,
          regions: ['Cusco', 'Ayacucho', 'Ancash', 'Huancavelica']
        },
        phonetic_focus: {
          aspirated: ['ph', 'th', 'kh', 'qh'],
          ejectives: ["p'", "t'", "k'", "q'"],
          retroflex: ['tr', 'chr'],
          tones: false
        },
        training_goals: {
          hours_total: 400,
          hours_current: 0,
          accuracy_target: 0.92,
          wer_target: 0.08
        }
      }
    };
    
    this.collectionProtocols = {
      recording_guidelines: {
        environment: 'quiet_indoor',
        distance: '20-30cm from microphone',
        duration_per_session: '30-60 minutes',
        break_frequency: 'every 10 minutes',
        ambient_noise: '<40dB'
      },
      content_types: {
        read_speech: {
          weight: 0.4,
          description: 'Lecture de textes traditionnels et modernes',
          examples: ['stories', 'prayers', 'news', 'literature']
        },
        spontaneous_speech: {
          weight: 0.3,
          description: 'Conversation naturelle et narration libre',
          examples: ['conversations', 'storytelling', 'interviews']
        },
        prompted_speech: {
          weight: 0.2,
          description: 'Réponses à des questions spécifiques',
          examples: ['word_lists', 'minimal_pairs', 'sentence_completion']
        },
        ceremonial_speech: {
          weight: 0.1,
          description: 'Langage cérémoniel et traditionnel',
          examples: ['prayers', 'chants', 'rituals', 'blessings']
        }
      },
      quality_standards: {
        signal_to_noise_ratio: '>20dB',
        clipping_tolerance: '<1%',
        silence_padding: '0.5s before/after',
        transcription_accuracy: '>99%',
        phonetic_annotation: 'required for focus sounds'
      }
    };
    
    this.processingPipeline = {
      preprocessing: [
        'noise_reduction',
        'normalization',
        'silence_trimming',
        'resampling',
        'channel_conversion'
      ],
      segmentation: [
        'voice_activity_detection',
        'utterance_boundary_detection',
        'pause_analysis',
        'breath_removal'
      ],
      enhancement: [
        'spectral_subtraction',
        'wiener_filtering',
        'adaptive_filtering',
        'echo_cancellation'
      ],
      validation: [
        'quality_assessment',
        'transcription_validation',
        'phonetic_verification',
        'cultural_appropriateness_check'
      ]
    };
  }

  /**
   * Initialise le service de corpus audio
   */
  async initialize() {
    console.log('🎤 Initialisation du service de corpus audio avancé...');
    
    await this.createDirectories();
    await this.loadExistingCorpus();
    await this.initializeProcessingPipeline();
    await this.setupQualityMetrics();
    
    console.log('✅ Service de corpus audio initialisé');
    console.log(`📊 Langues configurées: ${Object.keys(this.languageConfigs).length}`);
  }

  /**
   * Crée les répertoires nécessaires
   */
  async createDirectories() {
    const dirs = [
      this.corpusPath,
      this.processedPath,
      this.modelsPath,
      `${this.corpusPath}/raw`,
      `${this.corpusPath}/validated`,
      `${this.processedPath}/training`,
      `${this.processedPath}/testing`,
      `${this.processedPath}/validation`
    ];
    
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
    
    // Créer des sous-répertoires par langue
    for (const lang of Object.keys(this.languageConfigs)) {
      for (const subdir of ['raw', 'validated', 'training', 'testing', 'validation']) {
        await fs.mkdir(`${this.corpusPath}/${subdir}/${lang}`, { recursive: true });
        await fs.mkdir(`${this.processedPath}/${subdir}/${lang}`, { recursive: true });
      }
    }
  }

  /**
   * Charge le corpus audio existant
   */
  async loadExistingCorpus() {
    console.log('📚 Chargement du corpus audio existant...');
    
    for (const [lang, config] of Object.entries(this.languageConfigs)) {
      const stats = await this.analyzeCorpusStats(lang);
      
      // Mettre à jour les statistiques
      config.speakers.current = stats.unique_speakers;
      config.training_goals.hours_current = stats.total_hours;
      
      console.log(`📈 ${config.name}: ${stats.total_files} fichiers, ${stats.total_hours.toFixed(1)}h, ${stats.unique_speakers} locuteurs`);
    }
  }

  /**
   * Analyse les statistiques d'un corpus
   */
  async analyzeCorpusStats(language) {
    const stats = {
      total_files: 0,
      total_hours: 0,
      unique_speakers: 0,
      quality_score: 0,
      phonetic_coverage: 0
    };
    
    try {
      const rawPath = path.join(this.corpusPath, 'raw', language);
      const files = await fs.readdir(rawPath);
      
      stats.total_files = files.filter(f => this.audioFormats.supported.includes(path.extname(f))).length;
      
      // Simulation des statistiques (en production, analyser les vrais fichiers)
      stats.total_hours = stats.total_files * 0.05; // ~3 minutes par fichier en moyenne
      stats.unique_speakers = Math.min(stats.total_files / 10, 50); // ~10 fichiers par locuteur
      stats.quality_score = Math.random() * 0.3 + 0.7; // Score 0.7-1.0
      stats.phonetic_coverage = Math.min(stats.total_files / 100, 1.0); // Coverage basée sur le nombre de fichiers
      
    } catch (error) {
      console.log(`📝 Aucun corpus existant pour ${language}`);
    }
    
    return stats;
  }

  /**
   * Initialise le pipeline de traitement
   */
  async initializeProcessingPipeline() {
    console.log('⚙️ Initialisation du pipeline de traitement audio...');
    
    // En production, initialiser les vrais modèles de traitement audio
    // Par exemple: noise reduction, VAD, etc.
    
    console.log('✅ Pipeline de traitement initialisé');
  }

  /**
   * Configure les métriques de qualité
   */
  async setupQualityMetrics() {
    this.qualityMetrics = {
      snr_threshold: 20, // dB
      duration_min: 1.0, // secondes
      duration_max: 30.0, // secondes
      silence_max: 0.3, // ratio de silence maximum
      clipping_max: 0.01, // ratio de clipping maximum
      transcription_confidence_min: 0.85
    };
    
    console.log('📊 Métriques de qualité configurées');
  }

  /**
   * Traite un nouveau fichier audio
   */
  async processAudioFile(filePath, language, metadata = {}) {
    console.log(`🎵 Traitement fichier audio: ${path.basename(filePath)}`);
    
    const startTime = Date.now();
    
    try {
      // 1. Validation initiale
      const validation = await this.validateAudioFile(filePath);
      if (!validation.valid) {
        throw new Error(`Validation échouée: ${validation.issues.join(', ')}`);
      }
      
      // 2. Preprocessing
      const preprocessed = await this.preprocessAudio(filePath, language);
      
      // 3. Segmentation
      const segments = await this.segmentAudio(preprocessed.path, language);
      
      // 4. Quality assessment
      const quality = await this.assessAudioQuality(preprocessed.path);
      
      // 5. Transcription automatique (si disponible)
      const transcription = await this.generateAutoTranscription(preprocessed.path, language);
      
      // 6. Phonetic analysis
      const phoneticAnalysis = await this.analyzePhonetics(preprocessed.path, language);
      
      // 7. Metadata enrichment
      const enrichedMetadata = {
        ...metadata,
        original_file: filePath,
        processed_file: preprocessed.path,
        language: language,
        duration: preprocessed.duration,
        sample_rate: this.audioFormats.target.sample_rate,
        quality_score: quality.overall_score,
        segments: segments.length,
        auto_transcription: transcription,
        phonetic_analysis: phoneticAnalysis,
        processed_at: new Date().toISOString(),
        processing_time: Date.now() - startTime
      };
      
      // 8. Sauvegarder les métadonnées
      await this.saveAudioMetadata(preprocessed.path, enrichedMetadata);
      
      console.log(`✅ Fichier traité en ${Date.now() - startTime}ms`);
      console.log(`📊 Qualité: ${(quality.overall_score * 100).toFixed(1)}%, Segments: ${segments.length}`);
      
      return {
        success: true,
        processed_file: preprocessed.path,
        metadata: enrichedMetadata,
        segments: segments
      };
      
    } catch (error) {
      console.error(`❌ Erreur traitement ${path.basename(filePath)}:`, error.message);
      return {
        success: false,
        error: error.message,
        file: filePath
      };
    }
  }

  /**
   * Valide un fichier audio
   */
  async validateAudioFile(filePath) {
    const validation = {
      valid: true,
      issues: []
    };
    
    try {
      // Vérifier l'existence
      await fs.access(filePath);
      
      // Vérifier l'extension
      const ext = path.extname(filePath).toLowerCase();
      if (!this.audioFormats.supported.includes(ext)) {
        validation.issues.push(`Format non supporté: ${ext}`);
      }
      
      // Vérifier la taille
      const stats = await fs.stat(filePath);
      if (stats.size < 1000) { // < 1KB
        validation.issues.push('Fichier trop petit');
      }
      if (stats.size > 100 * 1024 * 1024) { // > 100MB
        validation.issues.push('Fichier trop volumineux');
      }
      
      // En production, ajouter des validations audio réelles:
      // - Durée, sample rate, corruption, etc.
      
      validation.valid = validation.issues.length === 0;
      
    } catch (error) {
      validation.valid = false;
      validation.issues.push(error.message);
    }
    
    return validation;
  }

  /**
   * Préprocesse un fichier audio
   */
  async preprocessAudio(filePath, language) {
    const outputPath = path.join(
      this.processedPath, 
      'training', 
      language, 
      `processed_${Date.now()}_${path.basename(filePath, path.extname(filePath))}.wav`
    );
    
    // Simulation du préprocessing (en production, utiliser FFmpeg ou bibliotèque audio)
    const preprocessing = {
      noise_reduction: true,
      normalization: true,
      resampling: `${this.audioFormats.target.sample_rate}Hz`,
      channel_conversion: 'mono',
      format_conversion: 'wav'
    };
    
    // Simuler la copie du fichier traité
    await fs.copyFile(filePath, outputPath);
    
    // Métadonnées simulées
    const metadata = {
      path: outputPath,
      duration: Math.random() * 20 + 5, // 5-25 secondes
      original_duration: Math.random() * 25 + 5,
      preprocessing_applied: preprocessing
    };
    
    console.log(`🔧 Préprocessing appliqué: ${path.basename(outputPath)}`);
    
    return metadata;
  }

  /**
   * Segmente l'audio en utterances
   */
  async segmentAudio(filePath, language) {
    // Simulation de la segmentation
    const numSegments = Math.floor(Math.random() * 5) + 1; // 1-5 segments
    const segments = [];
    
    for (let i = 0; i < numSegments; i++) {
      const startTime = i * 3 + Math.random() * 2;
      const duration = Math.random() * 4 + 1; // 1-5 secondes
      
      segments.push({
        id: `seg_${i + 1}`,
        start_time: startTime,
        end_time: startTime + duration,
        duration: duration,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        speech_activity: Math.random() * 0.3 + 0.7, // Ratio de parole vs silence
        energy_level: Math.random() * 0.5 + 0.5
      });
    }
    
    console.log(`✂️ Segmentation: ${segments.length} segments identifiés`);
    
    return segments;
  }

  /**
   * Évalue la qualité audio
   */
  async assessAudioQuality(filePath) {
    // Simulation de l'évaluation qualité
    const quality = {
      snr: Math.random() * 20 + 15, // 15-35 dB
      thd: Math.random() * 0.05, // 0-5% distortion
      clipping_ratio: Math.random() * 0.02, // 0-2% clipping
      silence_ratio: Math.random() * 0.3 + 0.1, // 10-40% silence
      spectral_centroid: Math.random() * 2000 + 1000, // 1-3kHz
      spectral_rolloff: Math.random() * 5000 + 3000, // 3-8kHz
      zero_crossing_rate: Math.random() * 0.1 + 0.05 // 0.05-0.15
    };
    
    // Calcul du score global
    let score = 1.0;
    
    if (quality.snr < this.qualityMetrics.snr_threshold) {
      score -= (this.qualityMetrics.snr_threshold - quality.snr) / 100;
    }
    
    if (quality.clipping_ratio > this.qualityMetrics.clipping_max) {
      score -= quality.clipping_ratio * 10;
    }
    
    if (quality.silence_ratio > this.qualityMetrics.silence_max) {
      score -= (quality.silence_ratio - this.qualityMetrics.silence_max) * 2;
    }
    
    quality.overall_score = Math.max(0, Math.min(1, score));
    
    return quality;
  }

  /**
   * Génère une transcription automatique
   */
  async generateAutoTranscription(filePath, language) {
    // Simulation de transcription automatique
    const sampleTexts = {
      'yua': [
        "Bix a beel k'ux?",
        "Ma'alob k'iin tech",
        "In k'aaba' u Juan",
        "Tu'ux ka bin?",
        "K'abéet in wenel"
      ],
      'quc': [
        "Utz awach",
        "La utz awach chi rij",
        "Achike ab'i'?",
        "Jawije' at k'o wi?",
        "Maltyox chawe"
      ],
      'qu': [
        "Allinllachu",
        "Imaynalla kashanki?",
        "Ima sutiyki?",
        "Maymanta kanki?",
        "Yupaychani"
      ]
    };
    
    const texts = sampleTexts[language] || sampleTexts['yua'];
    const selectedText = texts[Math.floor(Math.random() * texts.length)];
    
    return {
      text: selectedText,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      word_confidences: selectedText.split(' ').map(() => Math.random() * 0.4 + 0.6),
      processing_time: Math.random() * 2000 + 500, // 0.5-2.5s
      model_used: `asr_${language}_v1.0`
    };
  }

  /**
   * Analyse phonétique spécialisée
   */
  async analyzePhonetics(filePath, language) {
    const config = this.languageConfigs[language];
    const analysis = {
      detected_phonemes: [],
      phonetic_features: {},
      cultural_markers: {},
      difficulty_score: 0
    };
    
    if (config?.phonetic_focus) {
      // Simulation de détection phonétique
      const focus = config.phonetic_focus;
      
      if (focus.glottal_stops) {
        analysis.detected_phonemes.push(...focus.glottal_stops);
        analysis.phonetic_features.glottal_stops = {
          count: Math.floor(Math.random() * 5),
          clarity: Math.random() * 0.5 + 0.5
        };
      }
      
      if (focus.ejectives) {
        const detected = focus.ejectives.slice(0, Math.floor(Math.random() * focus.ejectives.length));
        analysis.detected_phonemes.push(...detected);
        analysis.phonetic_features.ejectives = {
          types: detected,
          articulation_strength: Math.random() * 0.4 + 0.6
        };
      }
      
      if (focus.vowel_lengths) {
        analysis.phonetic_features.vowel_length_contrast = {
          short_vowels: Math.floor(Math.random() * 10),
          long_vowels: Math.floor(Math.random() * 5),
          contrast_clarity: Math.random() * 0.5 + 0.5
        };
      }
      
      // Score de difficulté pour ASR
      analysis.difficulty_score = analysis.detected_phonemes.length * 0.1 + 
                                Math.random() * 0.3;
    }
    
    // Marqueurs culturels
    analysis.cultural_markers = {
      register: Math.random() > 0.7 ? 'ceremonial' : 'conversational',
      emotion: ['neutral', 'formal', 'reverent'][Math.floor(Math.random() * 3)],
      speaking_rate: Math.random() * 100 + 120 // 120-220 WPM
    };
    
    return analysis;
  }

  /**
   * Sauvegarde les métadonnées audio
   */
  async saveAudioMetadata(filePath, metadata) {
    const metadataPath = filePath.replace('.wav', '_metadata.json');
    
    try {
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      console.log(`💾 Métadonnées sauvegardées: ${path.basename(metadataPath)}`);
    } catch (error) {
      console.error('❌ Erreur sauvegarde métadonnées:', error.message);
    }
  }

  /**
   * Entraîne un modèle ASR avec le corpus
   */
  async trainASRModel(language, options = {}) {
    console.log(`🧠 Entraînement modèle ASR pour ${language}...`);
    
    const config = this.languageConfigs[language];
    if (!config) {
      throw new Error(`Langue non supportée: ${language}`);
    }
    
    const trainingConfig = {
      language: language,
      corpus_path: path.join(this.processedPath, 'training', language),
      model_architecture: 'wav2vec2_maya',
      epochs: options.epochs || 100,
      batch_size: options.batch_size || 8,
      learning_rate: options.learning_rate || 0.0001,
      phonetic_focus: config.phonetic_focus,
      quality_threshold: 0.8,
      augmentation: {
        noise_injection: true,
        speed_perturbation: true,
        volume_perturbation: true,
        background_sounds: true
      }
    };
    
    // Simulation de l'entraînement
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = {
          model_path: path.join(this.modelsPath, `asr_${language}_${Date.now()}.pt`),
          training_stats: {
            final_loss: Math.random() * 0.5 + 0.1, // 0.1-0.6
            word_error_rate: Math.random() * 0.1 + 0.05, // 5-15%
            character_error_rate: Math.random() * 0.05 + 0.02, // 2-7%
            training_time: '4h 32m',
            data_used: {
              hours: config.training_goals.hours_current,
              speakers: config.speakers.current,
              utterances: Math.floor(config.training_goals.hours_current * 120) // ~2 min/utterance
            }
          },
          phonetic_performance: {
            glottal_stop_accuracy: Math.random() * 0.2 + 0.8, // 80-100%
            ejective_accuracy: Math.random() * 0.3 + 0.7, // 70-100%
            overall_phonetic_score: Math.random() * 0.2 + 0.8
          }
        };
        
        console.log(`✅ Modèle ASR ${language} entraîné`);
        console.log(`📊 WER: ${(results.training_stats.word_error_rate * 100).toFixed(1)}%`);
        console.log(`🎯 Phonétique: ${(results.phonetic_performance.overall_phonetic_score * 100).toFixed(1)}%`);
        
        resolve(results);
      }, 5000); // Simulation 5s
    });
  }

  /**
   * Collecte collaborative de données
   */
  async setupCommunityCollection(language) {
    console.log(`🤝 Configuration collecte communautaire pour ${language}...`);
    
    const collectionPlan = {
      language: language,
      target_config: this.languageConfigs[language],
      collection_phases: [
        {
          phase: 'bootstrap',
          duration: '2 weeks',
          target_speakers: 10,
          target_hours: 20,
          content_focus: 'read_speech',
          priority: 'high'
        },
        {
          phase: 'expansion',
          duration: '2 months',
          target_speakers: 50,
          target_hours: 150,
          content_focus: 'spontaneous_speech',
          priority: 'medium'
        },
        {
          phase: 'refinement',
          duration: '1 month',
          target_speakers: 20,
          target_hours: 50,
          content_focus: 'ceremonial_speech',
          priority: 'specialized'
        }
      ],
      community_guidelines: {
        speaker_consent: 'required',
        cultural_protocol: 'respect_traditional_knowledge',
        data_ownership: 'community_shared',
        attribution: 'speaker_choice',
        compensation: 'fair_exchange'
      },
      technical_requirements: {
        app_interface: 'mobile_first',
        recording_quality: 'automatic_validation',
        upload_mechanism: 'background_sync',
        offline_capability: 'essential'
      }
    };
    
    // Créer les répertoires de collecte
    const collectionPath = path.join(this.corpusPath, 'community_collection', language);
    await fs.mkdir(collectionPath, { recursive: true });
    
    // Sauvegarder le plan
    const planPath = path.join(collectionPath, 'collection_plan.json');
    await fs.writeFile(planPath, JSON.stringify(collectionPlan, null, 2));
    
    console.log(`✅ Plan de collecte communautaire créé`);
    console.log(`📊 Objectif: ${collectionPlan.target_config.speakers.target} locuteurs, ${collectionPlan.target_config.training_goals.hours_total}h`);
    
    return collectionPlan;
  }

  /**
   * Obtient les statistiques globales du corpus
   */
  getCorpusStatistics() {
    const stats = {
      languages: Object.keys(this.languageConfigs).length,
      total_speakers: 0,
      total_hours: 0,
      total_files: 0,
      completion_rate: 0,
      quality_metrics: {
        average_snr: 0,
        average_quality_score: 0,
        validation_pass_rate: 0
      },
      phonetic_coverage: {},
      cultural_coverage: {
        ceremonial_content: 0,
        conversational_content: 0,
        traditional_stories: 0,
        modern_content: 0
      }
    };
    
    // Calculer les statistiques
    for (const [lang, config] of Object.entries(this.languageConfigs)) {
      stats.total_speakers += config.speakers.current;
      stats.total_hours += config.training_goals.hours_current;
      
      // Simulation des métriques
      stats.total_files += Math.floor(config.training_goals.hours_current * 20); // ~3min/fichier
      
      if (config.phonetic_focus) {
        stats.phonetic_coverage[lang] = {
          glottal_stops: Math.random() * 0.3 + 0.7,
          ejectives: Math.random() * 0.4 + 0.6,
          complex_sounds: Math.random() * 0.5 + 0.5
        };
      }
    }
    
    stats.completion_rate = stats.total_hours / 
      Object.values(this.languageConfigs).reduce((sum, config) => 
        sum + config.training_goals.hours_total, 0);
    
    // Métriques de qualité simulées
    stats.quality_metrics.average_snr = Math.random() * 10 + 20; // 20-30 dB
    stats.quality_metrics.average_quality_score = Math.random() * 0.2 + 0.8; // 0.8-1.0
    stats.quality_metrics.validation_pass_rate = Math.random() * 0.1 + 0.9; // 90-100%
    
    return stats;
  }

  /**
   * Exporte le corpus pour l'entraînement
   */
  async exportTrainingData(language, format = 'standard') {
    console.log(`📦 Export données d'entraînement pour ${language}...`);
    
    const exportPath = path.join(this.processedPath, 'exports', language);
    await fs.mkdir(exportPath, { recursive: true });
    
    const exportManifest = {
      language: language,
      format: format,
      exported_at: new Date().toISOString(),
      data_splits: {
        train: 0.8,
        validation: 0.1,
        test: 0.1
      },
      statistics: await this.analyzeCorpusStats(language),
      phonetic_focus: this.languageConfigs[language]?.phonetic_focus,
      quality_standards: this.qualityMetrics,
      files: {
        audio_archive: `${language}_audio.tar.gz`,
        transcriptions: `${language}_transcriptions.json`,
        metadata: `${language}_metadata.json`,
        phonetic_annotations: `${language}_phonetics.json`
      }
    };
    
    // Sauvegarder le manifeste
    const manifestPath = path.join(exportPath, 'export_manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(exportManifest, null, 2));
    
    console.log(`✅ Export créé: ${exportPath}`);
    console.log(`📊 Données: ${exportManifest.statistics.total_files} fichiers, ${exportManifest.statistics.total_hours.toFixed(1)}h`);
    
    return exportManifest;
  }
}

export { AdvancedAudioCorpusService };

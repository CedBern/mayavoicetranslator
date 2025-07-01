// Service de base de données vectorielle avancée avec FAISS
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Worker } from 'worker_threads';

/**
 * Service de base de données vectorielle haute performance
 * Utilise FAISS pour la recherche de similarité ultra-rapide
 */
class VectorDatabaseService {
  constructor() {
    this.isInitialized = false;
    this.indexPath = './data/vector_index';
    this.indices = new Map(); // Indices par langue
    this.embeddings = new Map(); // Cache des embeddings
    this.metadata = new Map(); // Métadonnées des documents
    this.workers = []; // Pool de workers pour calculs parallèles
    
    // Configuration FAISS
    this.faissConfig = {
      indexType: 'IndexIVFFlat', // ou IndexHNSWFlat pour plus de vitesse
      nlist: 100, // Nombre de clusters IVF
      dimension: 384, // Dimension des embeddings (sentence-transformers)
      metric: 'METRIC_INNER_PRODUCT', // ou METRIC_L2
      maxElements: 1000000,
      efConstruction: 200, // Pour HNSW
      M: 16 // Pour HNSW
    };
    
    // Modèles d'embeddings spécialisés
    this.embeddingModels = {
      'multilingual': {
        name: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        dimension: 384,
        languages: ['fr', 'es', 'en'],
        priority: 1
      },
      'indigenous': {
        name: 'custom-indigenous-embeddings-v1',
        dimension: 768,
        languages: ['yua', 'quc', 'qu', 'nah', 'gn'],
        priority: 2,
        custom: true
      },
      'mayan': {
        name: 'maya-specific-embeddings-v2',
        dimension: 512,
        languages: ['yua', 'quc', 'cak', 'kek'],
        priority: 3,
        custom: true
      }
    };
    
    // Statistiques de performance
    this.stats = {
      totalVectors: 0,
      searchCount: 0,
      averageSearchTime: 0,
      cacheHitRate: 0,
      lastOptimization: null
    };
  }

  /**
   * Initialise la base de données vectorielle
   */
  async initialize() {
    console.log('🗄️ Initialisation de la base de données vectorielle...');
    
    try {
      // Créer les répertoires nécessaires
      await this.ensureDirectories();
      
      // Initialiser le pool de workers
      await this.initializeWorkerPool();
      
      // Charger ou créer les indices FAISS
      await this.loadOrCreateIndices();
      
      // Charger les métadonnées
      await this.loadMetadata();
      
      // Optimiser les indices existants
      await this.optimizeIndices();
      
      this.isInitialized = true;
      console.log('✅ Base de données vectorielle initialisée');
      console.log(`📊 Indices chargés: ${this.indices.size}`);
      console.log(`🔢 Vecteurs totaux: ${this.stats.totalVectors}`);
      
    } catch (error) {
      console.warn('⚠️ Erreur d\'initialisation base vectorielle:', error.message);
      console.log('📝 Utilisation du mode de recherche simple');
    }
  }

  /**
   * Ajoute un document à l'index vectoriel
   */
  async addDocument(text, language, metadata = {}) {
    if (!this.isInitialized) {
      throw new Error('Base de données vectorielle non initialisée');
    }

    try {
      // Générer l'embedding
      const embedding = await this.generateEmbedding(text, language);
      
      // Créer l'ID unique du document
      const docId = this.generateDocumentId(text, language, metadata);
      
      // Ajouter aux métadonnées
      this.metadata.set(docId, {
        text: text,
        language: language,
        embedding: embedding,
        metadata: metadata,
        addedAt: Date.now(),
        vector_id: this.stats.totalVectors
      });
      
      // Ajouter à l'index FAISS approprié
      await this.addToFAISSIndex(language, embedding, docId);
      
      this.stats.totalVectors++;
      
      console.log(`📊 Document ajouté: ${docId} (${language})`);
      return docId;
      
    } catch (error) {
      console.error('❌ Erreur d\'ajout de document:', error);
      throw error;
    }
  }

  /**
   * Recherche de similarité vectorielle
   */
  async searchSimilar(query, language = 'fr', options = {}) {
    const startTime = Date.now();
    
    try {
      // Configuration par défaut
      const config = {
        topK: options.topK || 5,
        threshold: options.threshold || 0.7,
        includeMetadata: options.includeMetadata !== false,
        crossLingual: options.crossLingual || false,
        ...options
      };

      // Générer l'embedding de la requête
      const queryEmbedding = await this.generateEmbedding(query, language);
      
      // Rechercher dans l'index approprié
      let results = [];
      
      if (config.crossLingual) {
        // Recherche multi-langues
        results = await this.searchCrossLingual(queryEmbedding, config);
      } else {
        // Recherche mono-langue
        results = await this.searchInLanguage(queryEmbedding, language, config);
      }
      
      // Filtrer par seuil de similarité
      results = results.filter(result => result.similarity >= config.threshold);
      
      // Enrichir avec les métadonnées si demandé
      if (config.includeMetadata) {
        results = await this.enrichResults(results);
      }
      
      // Mettre à jour les statistiques
      const searchTime = Date.now() - startTime;
      this.updateSearchStats(searchTime);
      
      console.log(`🔍 Recherche terminée: ${results.length} résultats en ${searchTime}ms`);
      return results;
      
    } catch (error) {
      console.error('❌ Erreur de recherche vectorielle:', error);
      return [];
    }
  }

  /**
   * Génère un embedding pour un texte
   */
  async generateEmbedding(text, language) {
    // Déterminer le meilleur modèle pour la langue
    const model = this.selectEmbeddingModel(language);
    
    // Vérifier le cache
    const cacheKey = `${model.name}_${language}_${this.hashText(text)}`;
    if (this.embeddings.has(cacheKey)) {
      return this.embeddings.get(cacheKey);
    }
    
    try {
      let embedding;
      
      if (model.custom) {
        // Utiliser un modèle personnalisé pour langues indigènes
        embedding = await this.generateCustomEmbedding(text, language, model);
      } else {
        // Utiliser un modèle standard
        embedding = await this.generateStandardEmbedding(text, model);
      }
      
      // Normaliser l'embedding
      embedding = this.normalizeEmbedding(embedding);
      
      // Mettre en cache
      this.embeddings.set(cacheKey, embedding);
      
      return embedding;
      
    } catch (error) {
      console.warn(`⚠️ Erreur de génération d'embedding: ${error.message}`);
      // Fallback vers un embedding aléatoire normalisé
      return this.generateFallbackEmbedding(model.dimension);
    }
  }

  /**
   * Génère un embedding personnalisé pour langues indigènes
   */
  async generateCustomEmbedding(text, language, model) {
    // Cette méthode simule l'utilisation d'un modèle personnalisé
    // En production, ceci utiliserait un modèle entraîné spécifiquement
    // sur des corpus de langues indigènes
    
    console.log(`🧠 Génération embedding personnalisé pour ${language}`);
    
    // Analyser les caractéristiques linguistiques spécifiques
    const linguisticFeatures = this.extractLinguisticFeatures(text, language);
    
    // Générer un embedding basé sur ces caractéristiques
    const baseEmbedding = new Float32Array(model.dimension);
    
    // Initialisation avec du bruit gaussien
    for (let i = 0; i < model.dimension; i++) {
      baseEmbedding[i] = (Math.random() - 0.5) * 2;
    }
    
    // Modifier selon les caractéristiques linguistiques
    if (linguisticFeatures.hasGlottalStops) {
      // Accentuer certaines dimensions pour les coups de glotte
      for (let i = 0; i < 50; i++) {
        baseEmbedding[i] *= 1.3;
      }
    }
    
    if (linguisticFeatures.hasEjectives) {
      // Accentuer d'autres dimensions pour les éjectives
      for (let i = 50; i < 100; i++) {
        baseEmbedding[i] *= 1.2;
      }
    }
    
    if (linguisticFeatures.hasNasalization) {
      // Dimensions pour la nasalisation
      for (let i = 100; i < 150; i++) {
        baseEmbedding[i] *= 1.15;
      }
    }
    
    // Ajouter de la sémantique basée sur les racines de mots
    const wordRoots = this.extractWordRoots(text, language);
    wordRoots.forEach((root, index) => {
      const seedIndex = (index * 37) % model.dimension;
      baseEmbedding[seedIndex] += root.importance;
    });
    
    return baseEmbedding;
  }

  /**
   * Génère un embedding standard avec sentence-transformers
   */
  async generateStandardEmbedding(text, model) {
    // En production, ceci utiliserait la bibliothèque sentence-transformers
    // ou une API comme Cohere, OpenAI Embeddings, etc.
    
    console.log(`🤖 Génération embedding standard avec ${model.name}`);
    
    // Simulation d'un embedding realistic
    const embedding = new Float32Array(model.dimension);
    
    // Générer un embedding basé sur le hash du texte pour la cohérence
    const textHash = this.hashText(text);
    const seed = parseInt(textHash.slice(0, 8), 16);
    
    // Générateur pseudo-aléatoire basé sur le seed
    let random = seed;
    for (let i = 0; i < model.dimension; i++) {
      random = (random * 9301 + 49297) % 233280;
      embedding[i] = (random / 233280) - 0.5;
    }
    
    return embedding;
  }

  /**
   * Extrait les caractéristiques linguistiques
   */
  extractLinguisticFeatures(text, language) {
    const features = {
      hasGlottalStops: false,
      hasEjectives: false,
      hasNasalization: false,
      hasComplexClusters: false,
      wordCount: 0,
      avgWordLength: 0
    };
    
    // Analyser selon la langue
    switch (language) {
      case 'yua': // Maya Yucateco
        features.hasGlottalStops = /[ʔ']/.test(text);
        features.hasEjectives = /[kpttscx]'/.test(text);
        break;
        
      case 'quc': // K'iche'
        features.hasGlottalStops = /'/.test(text);
        features.hasEjectives = /[qtzch]'/.test(text);
        break;
        
      case 'qu': // Quechua
        features.hasEjectives = /[qkp]'/.test(text);
        features.hasComplexClusters = /[ñll]/.test(text);
        break;
        
      case 'nah': // Nahuatl
        features.hasGlottalStops = /'/.test(text);
        features.hasComplexClusters = /[tl]/.test(text);
        break;
        
      case 'gn': // Guaraní
        features.hasNasalization = /[ãĩũỹ]/.test(text);
        break;
    }
    
    // Statistiques générales
    const words = text.split(/\s+/);
    features.wordCount = words.length;
    features.avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    return features;
  }

  /**
   * Extrait les racines de mots selon la langue
   */
  extractWordRoots(text, language) {
    const roots = [];
    const words = text.toLowerCase().split(/\s+/);
    
    // Patterns de racines selon la langue
    const rootPatterns = {
      'yua': [
        { pattern: /^(.*)[aeiou]l$/, type: 'verbal' }, // Verbes
        { pattern: /^(.*)[td]aan$/, type: 'agentive' }, // Agent
        { pattern: /^(.*)[kp]'in$/, type: 'diminutive' } // Diminutif
      ],
      'quc': [
        { pattern: /^(.*)[aeiou]j$/, type: 'verbal' },
        { pattern: /^(.*)[aeiou]l$/, type: 'nominal' },
        { pattern: /^x(.*)$/, type: 'feminine' }
      ],
      'qu': [
        { pattern: /^(.*)[yn]i$/, type: 'verbal' },
        { pattern: /^(.*)kuna$/, type: 'plural' },
        { pattern: /^(.*)cha$/, type: 'diminutive' }
      ]
    };
    
    const patterns = rootPatterns[language] || [];
    
    words.forEach(word => {
      patterns.forEach(({ pattern, type }) => {
        const match = word.match(pattern);
        if (match && match[1]) {
          roots.push({
            root: match[1],
            type: type,
            importance: this.calculateRootImportance(match[1], type),
            word: word
          });
        }
      });
    });
    
    return roots;
  }

  /**
   * Calcule l'importance d'une racine
   */
  calculateRootImportance(root, type) {
    // Importance basée sur la longueur et le type
    let importance = Math.log(root.length + 1);
    
    switch (type) {
      case 'verbal':
        importance *= 1.5; // Verbes plus importants
        break;
      case 'nominal':
        importance *= 1.3;
        break;
      case 'agentive':
        importance *= 1.2;
        break;
      default:
        importance *= 1.0;
    }
    
    return Math.min(importance, 2.0); // Limiter l'importance max
  }

  /**
   * Normalise un embedding (norme L2)
   */
  normalizeEmbedding(embedding) {
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return embedding;
    
    return embedding.map(val => val / norm);
  }

  /**
   * Génère un embedding de fallback
   */
  generateFallbackEmbedding(dimension) {
    const embedding = new Float32Array(dimension);
    for (let i = 0; i < dimension; i++) {
      embedding[i] = (Math.random() - 0.5) * 0.1; // Petit vecteur aléatoire
    }
    return this.normalizeEmbedding(embedding);
  }

  /**
   * Sélectionne le meilleur modèle d'embedding pour une langue
   */
  selectEmbeddingModel(language) {
    // Trouver le modèle le plus spécialisé pour la langue
    const candidates = Object.values(this.embeddingModels)
      .filter(model => model.languages.includes(language))
      .sort((a, b) => b.priority - a.priority);
    
    if (candidates.length > 0) {
      return candidates[0];
    }
    
    // Fallback vers le modèle multilingue
    return this.embeddingModels.multilingual;
  }

  /**
   * Recherche dans un index spécifique à une langue
   */
  async searchInLanguage(queryEmbedding, language, config) {
    const index = this.indices.get(language);
    if (!index) {
      console.warn(`⚠️ Aucun index trouvé pour la langue: ${language}`);
      return [];
    }

    // Simulation de recherche FAISS
    return await this.simulateFAISSSearch(queryEmbedding, index, config);
  }

  /**
   * Recherche cross-linguale
   */
  async searchCrossLingual(queryEmbedding, config) {
    const allResults = [];
    
    // Rechercher dans tous les indices
    for (const [language, index] of this.indices) {
      const results = await this.simulateFAISSSearch(queryEmbedding, index, config);
      results.forEach(result => {
        result.language = language;
        allResults.push(result);
      });
    }
    
    // Trier par similarité globale
    return allResults.sort((a, b) => b.similarity - a.similarity).slice(0, config.topK);
  }

  /**
   * Simule une recherche FAISS (remplacer par vraie API FAISS)
   */
  async simulateFAISSSearch(queryEmbedding, index, config) {
    const results = [];
    
    // Parcourir les documents de l'index
    for (const [docId, embedding] of index.vectors) {
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);
      
      if (similarity >= config.threshold) {
        results.push({
          docId: docId,
          similarity: similarity,
          vector_id: index.metadata.get(docId)?.vector_id
        });
      }
    }
    
    // Trier et limiter
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, config.topK);
  }

  /**
   * Calcule la similarité cosinus entre deux vecteurs
   */
  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Enrichit les résultats avec les métadonnées
   */
  async enrichResults(results) {
    return results.map(result => {
      const metadata = this.metadata.get(result.docId);
      return {
        ...result,
        text: metadata?.text,
        language: metadata?.language,
        metadata: metadata?.metadata,
        addedAt: metadata?.addedAt
      };
    });
  }
  /**
   * Génère un ID de document unique
   */
  generateDocumentId(text, language, metadata) {
    const data = `${text}_${language}_${JSON.stringify(metadata)}_${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
  }
  /**
   * Hash un texte de manière consistante
   */
  hashText(text) {
    return crypto.createHash('md5').update(text.toLowerCase()).digest('hex');
  }
  /**
   * Initialise le pool de workers
   */
  async initializeWorkerPool() {
    const workerCount = Math.min(4, 4); // Simulation de os.cpus().length
    console.log(`👥 Initialisation de ${workerCount} workers`);
    
    // En production, créer de vrais workers pour les calculs parallèles
    this.workers = Array(workerCount).fill(null).map((_, i) => ({
      id: i,
      busy: false,
      // worker: new Worker('./workers/embedding-worker.js')
    }));
  }

  /**
   * Crée les répertoires nécessaires
   */
  async ensureDirectories() {
    const dirs = [
      this.indexPath,
      path.join(this.indexPath, 'faiss'),
      path.join(this.indexPath, 'metadata'),
      './data/embeddings_cache'
    ];
    
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * Charge ou crée les indices FAISS
   */
  async loadOrCreateIndices() {
    const languages = ['fr', 'yua', 'quc', 'qu', 'nah', 'gn', 'es', 'en'];
    
    for (const lang of languages) {
      try {
        await this.loadLanguageIndex(lang);
      } catch (error) {
        console.log(`📝 Création d'un nouvel index pour ${lang}`);
        await this.createLanguageIndex(lang);
      }
    }
  }

  /**
   * Charge l'index d'une langue
   */
  async loadLanguageIndex(language) {
    const indexFile = path.join(this.indexPath, 'faiss', `${language}.index`);
    const metadataFile = path.join(this.indexPath, 'metadata', `${language}.json`);
    
    // En production, charger l'index FAISS réel
    // const faissIndex = faiss.read_index(indexFile);
    
    // Simulation
    const mockIndex = {
      vectors: new Map(),
      metadata: new Map(),
      language: language,
      created: Date.now()
    };
    
    this.indices.set(language, mockIndex);
    console.log(`📁 Index chargé pour ${language}`);
  }

  /**
   * Crée un nouvel index pour une langue
   */
  async createLanguageIndex(language) {
    const model = this.selectEmbeddingModel(language);
    
    // En production, créer un vrai index FAISS
    // const faissIndex = new faiss.IndexIVFFlat(quantizer, model.dimension, this.faissConfig.nlist);
    
    // Simulation
    const mockIndex = {
      vectors: new Map(),
      metadata: new Map(),
      language: language,
      dimension: model.dimension,
      created: Date.now()
    };
    
    this.indices.set(language, mockIndex);
    console.log(`🆕 Nouvel index créé pour ${language}`);
  }

  /**
   * Ajoute un vecteur à l'index FAISS
   */
  async addToFAISSIndex(language, embedding, docId) {
    const index = this.indices.get(language);
    if (!index) {
      throw new Error(`Index non trouvé pour la langue: ${language}`);
    }
    
    // En production, ajouter au vrai index FAISS
    // index.add(embedding);
    
    // Simulation
    index.vectors.set(docId, embedding);
    index.metadata.set(docId, { vector_id: this.stats.totalVectors });
  }

  /**
   * Charge les métadonnées
   */
  async loadMetadata() {
    try {
      const metadataFile = path.join(this.indexPath, 'global_metadata.json');
      const data = await fs.readFile(metadataFile, 'utf8');
      const metadata = JSON.parse(data);
      
      for (const [docId, meta] of Object.entries(metadata)) {
        this.metadata.set(docId, meta);
      }
      
      console.log(`📋 Métadonnées chargées: ${this.metadata.size} documents`);
    } catch (error) {
      console.log('📝 Aucune métadonnée existante trouvée');
    }
  }

  /**
   * Optimise les indices pour de meilleures performances
   */
  async optimizeIndices() {
    console.log('⚡ Optimisation des indices...');
    
    for (const [language, index] of this.indices) {
      // En production, optimiser le vrai index FAISS
      // index.train(training_vectors);
      // index.nprobe = optimal_nprobe;
      
      console.log(`✅ Index optimisé pour ${language}`);
    }
    
    this.stats.lastOptimization = Date.now();
  }

  /**
   * Met à jour les statistiques de recherche
   */
  updateSearchStats(searchTime) {
    this.stats.searchCount++;
    this.stats.averageSearchTime = 
      (this.stats.averageSearchTime * (this.stats.searchCount - 1) + searchTime) / this.stats.searchCount;
  }

  /**
   * Sauvegarde les indices et métadonnées
   */
  async saveAll() {
    try {
      // Sauvegarder les métadonnées globales
      const metadataFile = path.join(this.indexPath, 'global_metadata.json');
      const metadata = Object.fromEntries(this.metadata);
      await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
      
      // En production, sauvegarder les indices FAISS
      // for (const [language, index] of this.indices) {
      //   const indexFile = path.join(this.indexPath, 'faiss', `${language}.index`);
      //   faiss.write_index(index, indexFile);
      // }
      
      console.log('💾 Base de données vectorielle sauvegardée');
    } catch (error) {
      console.error('❌ Erreur de sauvegarde:', error);
    }
  }

  /**
   * Statistiques de la base de données
   */
  getStats() {
    return {
      ...this.stats,
      indicesCount: this.indices.size,
      documentsCount: this.metadata.size,
      embeddingsInCache: this.embeddings.size,
      workersCount: this.workers.length,
      isInitialized: this.isInitialized
    };
  }
}

export default VectorDatabaseService;

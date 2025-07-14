// Service de recherche sémantique avec base de données vectorielle
import { Worker } from 'worker_threads';
import fs from 'fs/promises';
import path from 'path';

/**
 * Gestionnaire de recherche sémantique avancée pour langues indigènes
 * Utilise des embeddings pour une recherche contextuelle intelligente
 */
class SemanticSearchService {
  constructor() {
    this.vectors = new Map();
    this.documentIndex = new Map();
    this.semanticCache = new Map();
    this.isInitialized = false;
    this.modelConfig = {
      dimensions: 384, // Dimension des embeddings
      maxTokens: 512,
      similarity_threshold: 0.7
    };
  }

  /**
   * Initialise le service de recherche sémantique
   */
  async initialize() {
    console.log('🧠 Initialisation du service de recherche sémantique...');
    
    try {
      // Charger les embeddings pré-calculés ou créer l'index
      await this.loadOrCreateVectorIndex();
      
      this.isInitialized = true;
      console.log('✅ Service de recherche sémantique initialisé');
      console.log(`📊 Vecteurs chargés: ${this.vectors.size}`);
      console.log(`📚 Documents indexés: ${this.documentIndex.size}`);
      
    } catch (error) {
      console.warn('⚠️ Erreur d\'initialisation recherche sémantique:', error.message);
      console.log('📝 Utilisation du mode de recherche textuelle simple');
    }
  }

  /**
   * Charge l'index vectoriel existant ou en crée un nouveau
   */
  async loadOrCreateVectorIndex() {
    const indexPath = './data/semantic_index.json';
    
    try {
      // Tenter de charger un index existant
      const indexData = await fs.readFile(indexPath, 'utf8');
      const { vectors, documents } = JSON.parse(indexData);
      
      // Reconstituer les Maps
      this.vectors = new Map(vectors);
      this.documentIndex = new Map(documents);
      
      console.log('📁 Index vectoriel existant chargé');
      
    } catch (error) {
      console.log('🔄 Création d\'un nouvel index vectoriel...');
      await this.createVectorIndex();
      await this.saveVectorIndex();
    }
  }

  /**
   * Crée l'index vectoriel pour toutes les langues
   */
  async createVectorIndex() {
    // Import dynamique du dictionnaire enrichi
    const { ENRICHED_DICTIONARY } = await import('./EnrichedDictionary.js');
    
    let processed = 0;
    const total = Object.keys(ENRICHED_DICTIONARY).length;
    
    for (const [phrase, translations] of Object.entries(ENRICHED_DICTIONARY)) {
      // Créer des embeddings pour la phrase source
      const sourceVector = await this.createEmbedding(phrase, 'fr');
      const docId = `fr_${phrase}`;
      
      this.vectors.set(docId, sourceVector);
      this.documentIndex.set(docId, {
        text: phrase,
        language: 'fr',
        translations: translations,
        category: this.categorizePhrase(phrase),
        createdAt: Date.now()
      });

      // Créer des embeddings pour les traductions importantes
      for (const [lang, translation] of Object.entries(translations)) {
        if (['yua', 'quc', 'cak', 'qu', 'nah', 'gn'].includes(lang)) {
          const translationVector = await this.createEmbedding(translation, lang);
          const translationDocId = `${lang}_${translation}`;
          
          this.vectors.set(translationDocId, translationVector);
          this.documentIndex.set(translationDocId, {
            text: translation,
            language: lang,
            sourcePhrase: phrase,
            category: this.categorizePhrase(phrase),
            createdAt: Date.now()
          });
        }
      }

      processed++;
      if (processed % 10 === 0) {
        console.log(`🔄 Indexation: ${processed}/${total} phrases traitées...`);
      }
    }

    console.log(`✅ Index vectoriel créé: ${this.vectors.size} vecteurs`);
  }

  /**
   * Crée un embedding vectoriel pour un texte donné
   */
  async createEmbedding(text, language = 'fr') {
    // Pour la simulation, on utilise un algorithme simple de hachage sémantique
    // En production, on utiliserait un modèle comme sentence-transformers
    
    const cleanText = this.preprocessText(text, language);
    const tokens = this.tokenize(cleanText);
    
    // Simuler un embedding avec des caractéristiques linguistiques
    const vector = new Array(this.modelConfig.dimensions).fill(0);
    
    // Caractéristiques basées sur la longueur
    vector[0] = Math.min(tokens.length / 10, 1);
    
    // Caractéristiques basées sur les caractères
    for (let i = 0; i < Math.min(cleanText.length, 100); i++) {
      const charCode = cleanText.charCodeAt(i);
      const index = (charCode % (this.modelConfig.dimensions - 10)) + 10;
      vector[index] += 0.1;
    }
    
    // Caractéristiques spécifiques aux langues indigènes
    if (['yua', 'quc', 'cak'].includes(language)) {
      // Marquer les caractéristiques maya (apostrophes, etc.)
      if (text.includes("'")) vector[1] = 0.8;
      if (text.includes('x')) vector[2] = 0.6;
      if (text.includes('tz')) vector[3] = 0.7;
    }
    
    if (language === 'qu') {
      // Marquer les caractéristiques quechua
      if (text.includes('y')) vector[4] = 0.8;
      if (text.includes('k')) vector[5] = 0.6;
    }
    
    // Normaliser le vecteur
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  /**
   * Préprocesse le texte pour l'embedding
   */
  preprocessText(text, language) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s']/g, '') // Garder apostrophes pour les langues maya
      .replace(/\s+/g, ' ');
  }

  /**
   * Tokenise le texte
   */
  tokenize(text) {
    return text.split(/\s+/).filter(token => token.length > 0);
  }

  /**
   * Catégorise automatiquement une phrase
   */
  categorizePhrase(phrase) {
    const categories = {
      greetings: /bonjour|salut|hello|bonsoir/i,
      politeness: /merci|s'il vous plaît|excusez|pardon/i,
      questions: /comment|où|quand|pourquoi|qui|quoi/i,
      basic_needs: /eau|nourriture|aide|médecin|hôpital/i,
      family: /famille|mère|père|enfant|frère|sœur/i,
      numbers: /un|deux|trois|quatre|cinq|zéro/i,
      time: /aujourd'hui|demain|hier|matin|soir/i,
      travel: /route|chemin|direction|transport/i
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(phrase)) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * Recherche sémantique avancée
   */
  async semanticSearch(query, targetLanguage, options = {}) {
    if (!this.isInitialized) {
      console.log('⚠️ Recherche sémantique non initialisée, utilisation de la recherche simple');
      return this.fallbackSearch(query, targetLanguage);
    }

    const {
      maxResults = 5,
      threshold = this.modelConfig.similarity_threshold,
      includeTranslations = true,
      categoryFilter = null
    } = options;

    console.log(`🔍 Recherche sémantique: "${query}" → ${targetLanguage}`);

    try {
      // Créer l'embedding pour la requête
      const queryVector = await this.createEmbedding(query, 'fr');
      
      // Calculer les similarités
      const similarities = [];
      
      for (const [docId, vector] of this.vectors.entries()) {
        const similarity = this.calculateCosineSimilarity(queryVector, vector);
        
        if (similarity >= threshold) {
          const document = this.documentIndex.get(docId);
          
          // Appliquer le filtre de catégorie si spécifié
          if (!categoryFilter || document.category === categoryFilter) {
            similarities.push({
              docId,
              document,
              similarity,
              relevanceScore: this.calculateRelevanceScore(similarity, document, query, targetLanguage)
            });
          }
        }
      }

      // Trier par score de pertinence
      similarities.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      // Retourner les meilleurs résultats
      const results = similarities.slice(0, maxResults).map(result => ({
        text: result.document.text,
        language: result.document.language,
        translation: this.getTranslationForLanguage(result.document, targetLanguage),
        similarity: result.similarity,
        relevanceScore: result.relevanceScore,
        category: result.document.category,
        sourcePhrase: result.document.sourcePhrase || result.document.text
      }));

      console.log(`✅ Trouvé ${results.length} résultats sémantiques`);
      return results;

    } catch (error) {
      console.warn('⚠️ Erreur recherche sémantique:', error.message);
      return this.fallbackSearch(query, targetLanguage);
    }
  }

  /**
   * Calcule la similarité cosinus entre deux vecteurs
   */
  calculateCosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Les vecteurs doivent avoir la même dimension');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Calcule un score de pertinence pondéré
   */
  calculateRelevanceScore(similarity, document, query, targetLanguage) {
    let score = similarity;

    // Bonus pour correspondance exacte de langue
    if (document.language === 'fr') {
      score += 0.1;
    }

    // Bonus pour longueur similaire
    const lengthRatio = Math.min(query.length, document.text.length) / 
                       Math.max(query.length, document.text.length);
    score += lengthRatio * 0.1;

    // Bonus pour catégorie pertinente
    if (document.category !== 'general') {
      score += 0.05;
    }

    // Bonus si traduction disponible dans la langue cible
    if (this.getTranslationForLanguage(document, targetLanguage)) {
      score += 0.15;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Récupère la traduction pour une langue donnée
   */
  getTranslationForLanguage(document, targetLanguage) {
    if (document.translations && document.translations[targetLanguage]) {
      return document.translations[targetLanguage];
    }
    
    if (document.sourcePhrase) {
      // Rechercher dans l'index inverse
      for (const [docId, doc] of this.documentIndex.entries()) {
        if (doc.text === document.sourcePhrase && doc.translations) {
          return doc.translations[targetLanguage];
        }
      }
    }
    
    return null;
  }

  /**
   * Recherche de fallback en cas d'échec sémantique
   */
  fallbackSearch(query, targetLanguage) {
    console.log('📝 Utilisation de la recherche textuelle simple');
    
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const [docId, document] of this.documentIndex.entries()) {
      if (document.language === 'fr' && 
          document.text.toLowerCase().includes(queryLower)) {
        
        const translation = this.getTranslationForLanguage(document, targetLanguage);
        if (translation) {
          results.push({
            text: document.text,
            language: document.language,
            translation: translation,
            similarity: 0.8, // Score fixe pour recherche textuelle
            relevanceScore: 0.8,
            category: document.category,
            sourcePhrase: document.text,
            method: 'textual_fallback'
          });
        }
      }
    }
    
    return results.slice(0, 5);
  }

  /**
   * Recherche par catégorie
   */
  async searchByCategory(category, targetLanguage, maxResults = 10) {
    console.log(`🏷️ Recherche par catégorie: ${category} → ${targetLanguage}`);
    
    const results = [];
    
    for (const [docId, document] of this.documentIndex.entries()) {
      if (document.category === category && document.language === 'fr') {
        const translation = this.getTranslationForLanguage(document, targetLanguage);
        if (translation) {
          results.push({
            text: document.text,
            language: document.language,
            translation: translation,
            category: document.category,
            sourcePhrase: document.text
          });
        }
      }
    }
    
    return results.slice(0, maxResults);
  }

  /**
   * Suggestions intelligentes basées sur le contexte
   */
  async getSmartSuggestions(partialQuery, targetLanguage, maxSuggestions = 5) {
    if (partialQuery.length < 2) {
      return [];
    }

    console.log(`💡 Suggestions intelligentes pour: "${partialQuery}"`);
    
    // Recherche sémantique avec seuil plus bas pour les suggestions
    const semanticResults = await this.semanticSearch(partialQuery, targetLanguage, {
      maxResults: maxSuggestions * 2,
      threshold: 0.3,
      includeTranslations: true
    });

    // Recherche textuelle complémentaire
    const partialLower = partialQuery.toLowerCase();
    const textualMatches = [];
    
    for (const [docId, document] of this.documentIndex.entries()) {
      if (document.language === 'fr' && 
          document.text.toLowerCase().includes(partialLower)) {
        
        const translation = this.getTranslationForLanguage(document, targetLanguage);
        if (translation) {
          textualMatches.push({
            text: document.text,
            translation: translation,
            relevanceScore: 0.6,
            method: 'textual'
          });
        }
      }
    }

    // Combiner et déduper les résultats
    const allResults = [...semanticResults, ...textualMatches];
    const uniqueResults = [];
    const seen = new Set();

    for (const result of allResults) {
      if (!seen.has(result.text)) {
        seen.add(result.text);
        uniqueResults.push(result);
      }
    }

    // Trier par pertinence et retourner les meilleures suggestions
    uniqueResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return uniqueResults.slice(0, maxSuggestions);
  }

  /**
   * Sauvegarde l'index vectoriel
   */
  async saveVectorIndex() {
    try {
      const indexData = {
        vectors: Array.from(this.vectors.entries()),
        documents: Array.from(this.documentIndex.entries()),
        metadata: {
          created: Date.now(),
          version: '1.0.0',
          dimensions: this.modelConfig.dimensions,
          documentCount: this.documentIndex.size
        }
      };

      // Créer le dossier data s'il n'existe pas
      await fs.mkdir('./data', { recursive: true });
      
      await fs.writeFile(
        './data/semantic_index.json', 
        JSON.stringify(indexData, null, 2)
      );
      
      console.log('💾 Index vectoriel sauvegardé');
      
    } catch (error) {
      console.warn('⚠️ Erreur de sauvegarde index:', error.message);
    }
  }

  /**
   * Obtient les statistiques du service
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      vectorCount: this.vectors.size,
      documentCount: this.documentIndex.size,
      cacheSize: this.semanticCache.size,
      dimensions: this.modelConfig.dimensions,
      categories: this.getCategoryStats()
    };
  }

  /**
   * Statistiques par catégorie
   */
  getCategoryStats() {
    const categoryCount = {};
    
    for (const document of this.documentIndex.values()) {
      categoryCount[document.category] = (categoryCount[document.category] || 0) + 1;
    }
    
    return categoryCount;
  }
}

// Instance singleton
const semanticSearchService = new SemanticSearchService();

export { SemanticSearchService };
export default semanticSearchService;

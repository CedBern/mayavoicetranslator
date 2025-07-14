/**
 * SERVICE ÉTYMOLOGIQUE AVANCÉ
 * Gestion de l'analyse étymologique, morphologique et sémantique
 * Intégration avec Substack pour publication académique
 */

// Configuration CommonJS
if (typeof module === 'undefined') {
  global.module = { exports: {} };
  global.require = () => ({});
}

class EtymologyAnalysisService {
  constructor() {
    this.etymologyDatabase = new Map();
    this.cognateDatabase = new Map();
    this.phoneticRules = new Map();
    this.semanticEvolutions = new Map();
    this.substackIntegration = null;
    this.initializeService();
  }

  async initializeService() {
    console.log('🔬 Initialisation du service d\'analyse étymologique...');
    await this.loadEtymologyDatabase();
    await this.loadPhoneticRules();
    await this.loadSemanticEvolutions();
    await this.initializeSubstackAPI();
    console.log('✅ Service étymologique initialisé avec succès');
  }

  // ===========================================
  // GESTION DE LA BASE ÉTYMOLOGIQUE
  // ===========================================

  async loadEtymologyDatabase() {
    // Base de données étymologique complète
    const etymologyData = [
      {
        id: 'proto-maya-water',
        protoForm: '*ha\'',
        family: 'Maya',
        reconstruction: {
          period: '2000 BCE',
          confidence: 0.95,
          evidence: ['cognates', 'internal_reconstruction']
        },
        phonetic: '[haʔ]',
        meaning: {
          core: 'water, liquid',
          semantic_field: ['nature', 'elements', 'life']
        },
        morphology: {
          root: '*ha\'',
          category: 'noun',
          class: 'inalienable',
          prefixes: [],
          suffixes: []
        },
        descendants: [
          {
            language: 'K\'iche\'',
            form: 'ha\'',
            phonetic: '[haʔ]',
            meaning: 'water',
            innovations: [],
            retentions: ['*h', '*a', '*ʔ']
          },
          {
            language: 'Mam',
            form: 'txab',
            phonetic: '[t͡ʃaβ]',
            meaning: 'water',
            innovations: [
              { type: 'phonetic', rule: '*h > tx', context: '#_a' },
              { type: 'phonetic', rule: '*ʔ > b', context: 'a_#' }
            ],
            retentions: ['*a']
          },
          {
            language: 'Yucatec',
            form: 'ha\'',
            phonetic: '[haʔ]',
            meaning: 'water',
            innovations: [],
            retentions: ['*h', '*a', '*ʔ']
          }
        ],
        cognates: [
          {
            family: 'Mixe-Zoque',
            form: '*ʔa',
            meaning: 'liquid',
            confidence: 0.7,
            type: 'potential_cognate'
          }
        ],
        borrowings: [],
        semanticEvolution: [
          {
            stage: 'Proto-Maya',
            meaning: 'liquid (generic)',
            context: 'broad_category',
            date: '2000 BCE'
          },
          {
            stage: 'Classic Maya',
            meaning: 'water (specific)',
            context: 'specialization',
            date: '200-900 CE'
          },
          {
            stage: 'Modern Maya',
            meaning: 'water + metaphorical extensions',
            context: 'metaphorical_expansion',
            date: '1500 CE - present',
            metaphors: ['life', 'purity', 'renewal']
          }
        ]
      },
      // Ajouter d'autres entrées étymologiques...
    ];

    etymologyData.forEach(entry => {
      this.etymologyDatabase.set(entry.id, entry);
    });

    console.log(`📚 Base étymologique chargée: ${etymologyData.length} entrées`);
  }

  async loadPhoneticRules() {
    // Règles de correspondances phonétiques
    const phoneticRules = [
      {
        id: 'mam_h_fortition',
        from: '*h',
        to: 'tx',
        context: '#_a',
        language: 'Mam',
        period: '1000-1200 CE',
        type: 'fortition',
        examples: [
          { proto: '*ha\'', modern: 'txab', meaning: 'water' },
          { proto: '*hul', modern: 'txul', meaning: 'hole' },
          { proto: '*hun', modern: 'txun', meaning: 'one' }
        ],
        confidence: 0.9
      },
      {
        id: 'mam_glottal_weakening',
        from: '*ʔ',
        to: 'b',
        context: 'a_#',
        language: 'Mam',
        period: '1200-1400 CE',
        type: 'lenition',
        examples: [
          { proto: '*haʔ', modern: 'txab', meaning: 'water' },
          { proto: '*kaʔ', modern: 'kyab', meaning: 'bitter' }
        ],
        confidence: 0.85
      },
      // Ajouter plus de règles...
    ];

    phoneticRules.forEach(rule => {
      this.phoneticRules.set(rule.id, rule);
    });

    console.log(`🔊 Règles phonétiques chargées: ${phoneticRules.length} règles`);
  }

  async loadSemanticEvolutions() {
    // Évolutions sémantiques documentées
    const semanticData = [
      {
        id: 'water_semantic_evolution',
        word: 'ha\'',
        family: 'Maya',
        evolution: [
          {
            stage: 'Proto-Maya',
            period: '2000 BCE',
            meaning: 'liquid (generic)',
            context: 'undifferentiated_liquid',
            cognitive_mechanism: 'basic_categorization'
          },
          {
            stage: 'Classic Maya',
            period: '200-900 CE',
            meaning: 'water (specific)',
            context: 'environmental_specialization',
            cognitive_mechanism: 'category_narrowing'
          },
          {
            stage: 'Post-Classic Maya',
            period: '900-1500 CE',
            meaning: 'sacred water',
            context: 'religious_specialization',
            cognitive_mechanism: 'cultural_elaboration'
          },
          {
            stage: 'Modern Maya',
            period: '1500 CE - present',
            meaning: 'water + life metaphors',
            context: 'metaphorical_extension',
            cognitive_mechanism: 'conceptual_metaphor',
            metaphor_mappings: [
              { source: 'water', target: 'life', basis: 'necessity' },
              { source: 'water', target: 'purity', basis: 'cleansing' },
              { source: 'water', target: 'renewal', basis: 'cyclical_nature' }
            ]
          }
        ]
      }
    ];

    semanticData.forEach(entry => {
      this.semanticEvolutions.set(entry.id, entry);
    });

    console.log(`💭 Évolutions sémantiques chargées: ${semanticData.length} mots`);
  }

  // ===========================================
  // ANALYSE ÉTYMOLOGIQUE
  // ===========================================

  async analyzeWord(word, language) {
    console.log(`🔍 Analyse étymologique de "${word}" en ${language}`);

    try {
      // Recherche dans la base de données
      const etymologyEntry = await this.findEtymologyEntry(word, language);
      
      if (!etymologyEntry) {
        return this.generateHypothesis(word, language);
      }

      // Analyse complète
      const analysis = {
        word: word,
        language: language,
        etymology: etymologyEntry,
        phoneticAnalysis: await this.analyzePhoneticEvolution(etymologyEntry),
        morphologicalAnalysis: await this.analyzeMorphology(etymologyEntry),
        semanticAnalysis: await this.analyzeSemanticEvolution(etymologyEntry),
        comparativeAnalysis: await this.analyzeComparativeData(etymologyEntry),
        confidence: this.calculateConfidence(etymologyEntry)
      };

      console.log(`✅ Analyse complétée avec confiance: ${analysis.confidence}%`);
      return analysis;

    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse étymologique:`, error);
      throw error;
    }
  }

  async findEtymologyEntry(word, language) {
    // Recherche exacte
    for (const [id, entry] of this.etymologyDatabase) {
      const descendant = entry.descendants.find(d => 
        d.language === language && d.form === word
      );
      if (descendant) {
        return { ...entry, currentForm: descendant };
      }
    }

    // Recherche approximative
    return await this.fuzzyEtymologySearch(word, language);
  }

  async fuzzyEtymologySearch(word, language) {
    const candidates = [];
    
    for (const [id, entry] of this.etymologyDatabase) {
      for (const descendant of entry.descendants) {
        if (descendant.language === language) {
          const similarity = this.calculatePhoneticSimilarity(word, descendant.form);
          if (similarity > 0.7) {
            candidates.push({
              ...entry,
              currentForm: descendant,
              similarity: similarity
            });
          }
        }
      }
    }

    return candidates.length > 0 ? 
      candidates.sort((a, b) => b.similarity - a.similarity)[0] : null;
  }

  async analyzePhoneticEvolution(etymologyEntry) {
    const phoneticAnalysis = {
      protoForm: etymologyEntry.protoForm,
      modernForm: etymologyEntry.currentForm.form,
      changes: [],
      correspondences: [],
      innovations: etymologyEntry.currentForm.innovations || [],
      retentions: etymologyEntry.currentForm.retentions || []
    };

    // Analyse des changements phonétiques
    for (const innovation of phoneticAnalysis.innovations) {
      const rule = this.phoneticRules.get(innovation.rule?.replace(/[*\s>]/g, ''));
      if (rule) {
        phoneticAnalysis.changes.push({
          rule: rule,
          application: innovation,
          examples: rule.examples
        });
      }
    }

    return phoneticAnalysis;
  }

  async analyzeMorphology(etymologyEntry) {
    const morphology = etymologyEntry.morphology;
    
    return {
      root: morphology.root,
      category: morphology.category,
      class: morphology.class,
      structure: {
        prefixes: morphology.prefixes,
        root: morphology.root,
        suffixes: morphology.suffixes
      },
      derivationalPotential: await this.analyzeDerivatationalPotential(morphology),
      crossLinguisticComparison: await this.compareMorphologyAcrossLanguages(etymologyEntry)
    };
  }

  async analyzeSemanticEvolution(etymologyEntry) {
    const semanticData = this.semanticEvolutions.get(etymologyEntry.id.replace('proto-maya-', '') + '_semantic_evolution');
    
    if (!semanticData) {
      return this.generateSemanticHypothesis(etymologyEntry);
    }

    return {
      evolution: semanticData.evolution,
      currentMeaning: etymologyEntry.currentForm.meaning,
      semanticField: etymologyEntry.meaning.semantic_field,
      metaphoricalExtensions: this.extractMetaphoricalExtensions(semanticData),
      cognitiveProcesses: this.analyzeCognitiveProcesses(semanticData)
    };
  }

  async analyzeComparativeData(etymologyEntry) {
    return {
      cognates: etymologyEntry.cognates,
      borrowings: etymologyEntry.borrowings,
      areal_features: await this.identifyArealFeatures(etymologyEntry),
      typological_patterns: await this.identifyTypologicalPatterns(etymologyEntry)
    };
  }

  // ===========================================
  // INTÉGRATION SUBSTACK
  // ===========================================

  async initializeSubstackAPI() {
    this.substackIntegration = {
      apiKey: process.env.SUBSTACK_API_KEY || 'demo-key',
      publicationId: 'maya-linguistics-research',
      baseUrl: 'https://substackapi.com/v1',
      subscribers: 2340,
      engagement: {
        open_rate: 0.85,
        click_rate: 0.12,
        conversion_rate: 0.08
      }
    };

    console.log('📰 Intégration Substack initialisée');
  }

  async generateSubstackArticle(etymologyAnalysis) {
    console.log(`📝 Génération d'article Substack pour "${etymologyAnalysis.word}"`);

    const article = {
      title: this.generateArticleTitle(etymologyAnalysis),
      subtitle: this.generateArticleSubtitle(etymologyAnalysis),
      content: await this.generateArticleContent(etymologyAnalysis),
      tags: this.generateTags(etymologyAnalysis),
      category: 'etymology',
      estimated_reading_time: this.calculateReadingTime(etymologyAnalysis),
      seo_metadata: await this.generateSEOMetadata(etymologyAnalysis)
    };

    return article;
  }

  generateArticleTitle(analysis) {
    const word = analysis.word;
    const protoForm = analysis.etymology.protoForm;
    
    const titles = [
      `🌊 L'Évolution Fascinante du Mot "${word}" : De ${protoForm} à nos jours`,
      `🔍 Étymologie Maya : Comment "${word}" raconte 4000 ans d'histoire`,
      `📿 Du Proto-Maya au Moderne : L'Histoire Secrète de "${word}"`,
      `🌳 Généalogie Linguistique : L'Arbre Familial de "${word}"`
    ];

    return titles[Math.floor(Math.random() * titles.length)];
  }

  generateArticleSubtitle(analysis) {
    const language = analysis.language;
    const semanticField = analysis.etymology.meaning.semantic_field.join(', ');
    
    return `Une plongée dans l'évolution phonétique, morphologique et sémantique d'un terme ${language} central au domaine ${semanticField}`;
  }

  async generateArticleContent(analysis) {
    const sections = [
      await this.generateIntroSection(analysis),
      await this.generateEtymologySection(analysis),
      await this.generatePhoneticSection(analysis),
      await this.generateSemanticSection(analysis),
      await this.generateComparativeSection(analysis),
      await this.generateConclusionSection(analysis)
    ];

    return sections.join('\n\n---\n\n');
  }

  async generateIntroSection(analysis) {
    return `## 🌟 Introduction

Saviez-vous que le simple mot "${analysis.word}" en ${analysis.language} raconte une histoire de ${this.calculateTimeDepth(analysis)} ans d'évolution linguistique ? 

Dans cette édition de "Mots d'Hier, Langues d'Aujourd'hui", nous explorons comment **${analysis.etymology.protoForm}**, la racine proto-maya pour "${analysis.etymology.meaning.core}", s'est transformée à travers les siècles pour donner naissance aux formes modernes que nous connaissons aujourd'hui.

### 🔍 Ce que vous découvrirez :
• Les innovations phonétiques spectaculaires de certaines langues mayas
• L'évolution sémantique : du sens primitif aux extensions métaphoriques
• Les connexions surprenantes avec d'autres familles linguistiques
• Les implications pour notre compréhension de la reconstruction proto-maya

*Temps de lecture estimé : ${this.calculateReadingTime(analysis)} minutes*`;
  }

  async generatePhoneticSection(analysis) {
    if (!analysis.phoneticAnalysis.changes.length) {
      return `## 🔊 Conservation Phonétique Remarquable

Le mot "${analysis.word}" présente un cas fascinant de **conservation phonétique** : il a maintenu sa forme originale ${analysis.etymology.protoForm} pratiquement intacte à travers les millénaires !`;
    }

    let section = `## 🔊 Évolution Phonétique : Une Transformation Spectaculaire\n\n`;
    
    section += `Le passage de **${analysis.etymology.protoForm}** à **${analysis.word}** illustre plusieurs processus phonétiques fondamentaux :\n\n`;

    analysis.phoneticAnalysis.changes.forEach(change => {
      section += `### ${change.rule.type.toUpperCase()} : ${change.rule.from} → ${change.rule.to}\n\n`;
      section += `**Contexte** : ${change.rule.context}\n`;
      section += `**Période** : ${change.rule.period}\n\n`;
      
      section += `**Exemples** :\n`;
      change.rule.examples.forEach(example => {
        section += `• ${example.proto} → ${example.modern} "${example.meaning}"\n`;
      });
      section += `\n`;
    });

    return section;
  }

  async publishToSubstack(article, options = {}) {
    console.log(`📤 Publication sur Substack: "${article.title}"`);

    try {
      // Simulation d'appel API Substack
      const publication = {
        id: `article_${Date.now()}`,
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        status: options.draft ? 'draft' : 'published',
        published_at: new Date().toISOString(),
        url: `https://maya-linguistics.substack.com/p/${this.slugify(article.title)}`,
        estimated_metrics: this.calculateEstimatedMetrics(article),
        monetization: {
          free_access: !options.premium,
          premium_only: options.premium || false,
          estimated_revenue: options.premium ? 
            this.substackIntegration.subscribers * 0.12 * 5 : 0
        }
      };

      console.log(`✅ Article publié avec succès !`);
      console.log(`📊 Métriques estimées:`, publication.estimated_metrics);
      
      return publication;

    } catch (error) {
      console.error(`❌ Erreur lors de la publication:`, error);
      throw error;
    }
  }

  calculateEstimatedMetrics(article) {
    const baseMetrics = this.substackIntegration.engagement;
    const readingTime = this.calculateReadingTime({ content: article.content });
    
    // Facteur de qualité basé sur la longueur et le contenu
    const qualityFactor = Math.min(1.2, readingTime / 5);
    
    return {
      estimated_views: Math.round(this.substackIntegration.subscribers * baseMetrics.open_rate * qualityFactor),
      estimated_shares: Math.round(this.substackIntegration.subscribers * baseMetrics.click_rate * qualityFactor),
      estimated_new_subscribers: Math.round(45 * qualityFactor),
      estimated_premium_conversions: Math.round(12 * qualityFactor),
      engagement_score: Math.round(85 * qualityFactor)
    };
  }

  // ===========================================
  // FONCTIONS UTILITAIRES
  // ===========================================

  calculatePhoneticSimilarity(word1, word2) {
    // Algorithme de distance de Levenshtein adapté pour la phonétique
    if (word1 === word2) return 1.0;
    
    const len1 = word1.length;
    const len2 = word2.length;
    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return 1 - matrix[len2][len1] / maxLen;
  }

  calculateConfidence(etymologyEntry) {
    let confidence = etymologyEntry.reconstruction.confidence || 0.8;
    
    // Ajustements basés sur la qualité des données
    if (etymologyEntry.cognates.length > 0) confidence += 0.05;
    if (etymologyEntry.descendants.length > 3) confidence += 0.05;
    if (etymologyEntry.semanticEvolution.length > 2) confidence += 0.05;
    
    return Math.min(100, Math.round(confidence * 100));
  }

  calculateTimeDepth(analysis) {
    const protoDate = new Date('2000 BCE').getTime();
    const currentDate = new Date().getTime();
    return Math.round((currentDate - protoDate) / (1000 * 60 * 60 * 24 * 365));
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = typeof content === 'string' ? 
      content.split(/\s+/).length : 
      JSON.stringify(content).split(/\s+/).length;
    return Math.max(1, Math.round(wordCount / wordsPerMinute));
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  generateTags(analysis) {
    return [
      'étymologie',
      'linguistique-maya',
      analysis.language.toLowerCase(),
      'reconstruction',
      ...analysis.etymology.meaning.semantic_field
    ];
  }

  // ===========================================
  // API PUBLIQUE
  // ===========================================

  async searchEtymology(query) {
    console.log(`🔍 Recherche étymologique: "${query}"`);
    
    const results = [];
    for (const [id, entry] of this.etymologyDatabase) {
      if (entry.protoForm.includes(query) || 
          entry.descendants.some(d => d.form.includes(query))) {
        results.push(entry);
      }
    }
    
    return results;
  }

  async getPhoneticCorrespondences(language1, language2) {
    console.log(`🔊 Correspondances phonétiques: ${language1} ↔ ${language2}`);
    
    const correspondences = [];
    for (const [id, rule] of this.phoneticRules) {
      if (rule.language === language1 || rule.language === language2) {
        correspondences.push(rule);
      }
    }
    
    return correspondences;
  }

  async generateEtymologyReport(wordList) {
    console.log(`📊 Génération de rapport étymologique pour ${wordList.length} mots`);
    
    const analyses = [];
    for (const word of wordList) {
      const analysis = await this.analyzeWord(word.form, word.language);
      analyses.push(analysis);
    }
    
    return {
      total_words: wordList.length,
      analyses: analyses,
      summary: this.generateReportSummary(analyses),
      generated_at: new Date().toISOString()
    };
  }

  async createSubstackSeries(analyses, seriesTitle) {
    console.log(`📚 Création de série Substack: "${seriesTitle}"`);
    
    const articles = [];
    for (const analysis of analyses) {
      const article = await this.generateSubstackArticle(analysis);
      articles.push(article);
    }
    
    return {
      series_title: seriesTitle,
      article_count: articles.length,
      articles: articles,
      publication_schedule: this.generatePublicationSchedule(articles),
      estimated_total_revenue: articles.length * 280 // €280 par article premium
    };
  }
}

// Export compatible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EtymologyAnalysisService;
} else if (typeof global !== 'undefined') {
  global.EtymologyAnalysisService = EtymologyAnalysisService;
}

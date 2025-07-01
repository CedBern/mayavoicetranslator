/**
 * 🚀 Service d'Amélioration des Traductions - Talk Kin
 * Intégration multi-API et enrichissement du corpus linguistique
 * 
 * OBJECTIFS:
 * - Améliorer la qualité des traductions pour toutes les langues
 * - Intégrer plusieurs APIs de traduction pour plus de robustesse
 * - Enrichir le corpus avec des sources authentiques
 * - Implémenter un système de validation croisée
 */

import axios from 'axios';
import fs from 'fs';

class TranslationEnhancementService {
  constructor() {
    this.apiConfigs = {
      // API principales de traduction
      openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        key: process.env.OPENAI_API_KEY,
        models: ['gpt-4o-mini', 'gpt-3.5-turbo'],
        speciality: 'Context-aware, cultural nuances',
        cost: 'Medium',
        quality: 'High'
      },
      
      // Google Translate API - Large coverage
      google: {
        url: 'https://translation.googleapis.com/language/translate/v2',
        key: process.env.GOOGLE_TRANSLATE_API_KEY,
        speciality: 'Large language coverage, fast',
        cost: 'Low',
        quality: 'Medium-High',
        supportedLanguages: 100
      },
      
      // DeepL API - Premium quality for European languages
      deepl: {
        url: 'https://api-free.deepl.com/v2/translate',
        key: process.env.DEEPL_API_KEY,
        speciality: 'European languages, high quality',
        cost: 'Medium',
        quality: 'Very High',
        strongLanguages: ['fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'zh']
      },
      
      // Microsoft Translator - Good for regional languages
      microsoft: {
        url: 'https://api.cognitive.microsofttranslator.com/translate',
        key: process.env.MICROSOFT_TRANSLATOR_KEY,
        speciality: 'Regional dialects, speech integration',
        cost: 'Low',
        quality: 'Medium-High'
      },
      
      // Specialized APIs for indigenous/regional languages
      specialized: {
        // Apertium - Open source, good for regional European languages
        apertium: {
          url: 'https://apertium.org/apy/translate',
          free: true,
          speciality: 'Regional European languages, open source',
          strongLanguages: ['ca', 'eu', 'br', 'oc', 'cy']
        },
        
        // Ethnologue API for language data
        ethnologue: {
          url: 'https://api.ethnologue.com/language',
          speciality: 'Language metadata, speaker statistics',
          purpose: 'Corpus enrichment'
        }
      }
    };
    
    // Stratégie de fallback par langue
    this.translationStrategy = {
      // Langues indigènes - OpenAI prioritaire
      'yua': ['openai', 'specialized'],
      'qu': ['openai', 'specialized'], 
      'gn': ['openai', 'specialized'],
      
      // Langues européennes - DeepL + Apertium
      'fr': ['deepl', 'google', 'microsoft'],
      'es': ['deepl', 'google', 'microsoft'],
      'ca': ['deepl', 'apertium', 'google'], 
      'eu': ['apertium', 'openai', 'google'],
      'br': ['apertium', 'openai'],
      'co': ['openai', 'google'],
      'cy': ['apertium', 'google', 'openai'],
      'gd': ['openai', 'google'],
      'oc': ['apertium', 'openai'],
      
      // Langues asiatiques - OpenAI + Google
      'yue': ['openai', 'google'],
      'wuu': ['openai', 'google'],
      'jv': ['openai', 'google'],
      'mr': ['google', 'openai', 'microsoft'],
      'zh': ['deepl', 'google', 'microsoft'],
      'ja': ['deepl', 'google', 'microsoft']
    };
    
    // Sources pour enrichir le corpus
    this.corpusSources = {
      wikipedia: {
        url: 'https://api.wikimedia.org/core/v1/wikipedia',
        purpose: 'Authentic texts in regional languages',
        languages: 'All supported languages'
      },
      
      omniglot: {
        url: 'https://omniglot.com',
        purpose: 'Language samples, phrases, cultural context',
        speciality: 'Minority languages'
      },
      
      tatoeba: {
        url: 'https://tatoeba.org/api',
        purpose: 'Sentence pairs, native speaker contributions',
        languages: 'Many regional languages'
      },
      
      commonvoice: {
        url: 'https://commonvoice.mozilla.org/api',
        purpose: 'Audio corpus, pronunciation',
        languages: 'Growing collection'
      },
      
      worldcat: {
        url: 'https://www.worldcat.org/api',
        purpose: 'Literature, authentic texts',
        speciality: 'Academic and cultural texts'
      }
    };
    
    this.qualityMetrics = {
      accuracy: 0,
      fluency: 0,
      cultural_appropriateness: 0,
      consistency: 0,
      coverage: 0
    };
  }
  
  /**
   * Amélioration des traductions avec stratégie multi-API
   */
  async enhancedTranslate(text, fromLang, toLang, context = {}) {
    console.log(`🔄 Traduction améliorée: "${text}" (${fromLang} → ${toLang})`);
    
    const strategy = this.translationStrategy[toLang] || ['openai', 'google'];
    const results = [];
    
    // Essayer plusieurs APIs selon la stratégie
    for (const apiName of strategy.slice(0, 3)) { // Max 3 APIs par traduction
      try {
        const result = await this.translateWithAPI(text, fromLang, toLang, apiName, context);
        if (result) {
          results.push({
            api: apiName,
            translation: result.translation,
            confidence: result.confidence || 0.5,
            metadata: result.metadata || {}
          });
        }
      } catch (error) {
        console.log(`⚠️ API ${apiName} failed: ${error.message}`);
      }
    }
    
    // Sélectionner la meilleure traduction
    return this.selectBestTranslation(results, context);
  }
  
  /**
   * Traduction avec une API spécifique
   */
  async translateWithAPI(text, fromLang, toLang, apiName, context) {
    switch (apiName) {
      case 'openai':
        return await this.translateWithOpenAI(text, fromLang, toLang, context);
      case 'google':
        return await this.translateWithGoogle(text, fromLang, toLang);
      case 'deepl':
        return await this.translateWithDeepL(text, fromLang, toLang);
      case 'microsoft':
        return await this.translateWithMicrosoft(text, fromLang, toLang);
      case 'apertium':
        return await this.translateWithApertium(text, fromLang, toLang);
      default:
        throw new Error(`Unknown API: ${apiName}`);
    }
  }
  
  /**
   * Traduction OpenAI avec contexte culturel
   */
  async translateWithOpenAI(text, fromLang, toLang, context) {
    const prompt = `Translate this text from ${fromLang} to ${toLang} with cultural sensitivity:
    
Text: "${text}"
Context: ${context.cultural || 'general'}
Region: ${context.region || 'standard'}

Requirements:
- Maintain cultural nuances
- Use appropriate formality level
- Consider regional variations
- Preserve emotional tone

Translation:`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiConfigs.openai.key}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        translation: response.data.choices[0].message.content.trim(),
        confidence: 0.8,
        metadata: { model: 'gpt-4o-mini', cultural_context: true }
      };
    } catch (error) {
      console.log(`❌ OpenAI translation failed: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Traduction Google Translate
   */
  async translateWithGoogle(text, fromLang, toLang) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiConfigs.google.key}`,
        {
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text'
        }
      );
      
      return {
        translation: response.data.data.translations[0].translatedText,
        confidence: 0.7,
        metadata: { api: 'google', fast: true }
      };
    } catch (error) {
      console.log(`❌ Google translation failed: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Traduction DeepL (pour langues supportées)
   */
  async translateWithDeepL(text, fromLang, toLang) {
    const supportedLangs = ['fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'zh'];
    
    if (!supportedLangs.includes(toLang)) {
      return null; // DeepL ne supporte pas cette langue
    }
    
    try {
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        new URLSearchParams({
          text: text,
          source_lang: fromLang.toUpperCase(),
          target_lang: toLang.toUpperCase(),
          auth_key: this.apiConfigs.deepl.key
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      
      return {
        translation: response.data.translations[0].text,
        confidence: 0.9, // DeepL est très précis
        metadata: { api: 'deepl', premium_quality: true }
      };
    } catch (error) {
      console.log(`❌ DeepL translation failed: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Traduction Apertium (open source)
   */
  async translateWithApertium(text, fromLang, toLang) {
    try {
      const response = await axios.get(
        `https://apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      );
      
      return {
        translation: response.data.responseData.translatedText,
        confidence: 0.6,
        metadata: { api: 'apertium', open_source: true }
      };
    } catch (error) {
      console.log(`❌ Apertium translation failed: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Sélection de la meilleure traduction
   */
  selectBestTranslation(results, context) {
    if (results.length === 0) {
      return { error: 'No translation available' };
    }
    
    if (results.length === 1) {
      return results[0];
    }
    
    // Scoring basé sur la confiance et la spécialité de l'API
    const scored = results.map(result => {
      let score = result.confidence;
      
      // Bonus pour APIs spécialisées selon le contexte
      if (result.metadata.cultural_context && context.cultural) {
        score += 0.2;
      }
      if (result.metadata.premium_quality) {
        score += 0.1;
      }
      if (result.api === 'deepl' && ['fr', 'es', 'de'].includes(context.toLang)) {
        score += 0.15;
      }
      
      return { ...result, score };
    });
    
    // Retourner la traduction avec le meilleur score
    const best = scored.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );
    
    return {
      translation: best.translation,
      confidence: best.score,
      api_used: best.api,
      alternatives: scored.filter(r => r.api !== best.api).map(r => ({
        translation: r.translation,
        api: r.api,
        score: r.score
      })),
      metadata: best.metadata
    };
  }
  
  /**
   * Enrichissement du corpus à partir de sources externes
   */
  async enrichCorpusFromSources(language, limit = 100) {
    console.log(`📚 Enrichissement du corpus pour: ${language}`);
    
    const enrichmentData = {
      wikipedia_articles: [],
      tatoeba_sentences: [],
      common_phrases: [],
      cultural_expressions: []
    };
    
    try {
      // Wikipedia articles in target language
      enrichmentData.wikipedia_articles = await this.fetchWikipediaContent(language, 10);
      
      // Tatoeba sentence pairs
      enrichmentData.tatoeba_sentences = await this.fetchTatoebaSentences(language, 50);
      
      // Common phrases from Omniglot-style sources
      enrichmentData.common_phrases = await this.fetchCommonPhrases(language);
      
      console.log(`✅ Corpus enrichi: ${JSON.stringify(Object.keys(enrichmentData).map(k => `${k}: ${enrichmentData[k].length}`))}`);
      
      return enrichmentData;
    } catch (error) {
      console.log(`❌ Erreur enrichissement corpus: ${error.message}`);
      return enrichmentData;
    }
  }
  
  /**
   * Récupération de contenu Wikipedia
   */
  async fetchWikipediaContent(language, limit) {
    // Simulation - en production, utiliser l'API Wikipedia
    return [
      `Article example in ${language}`,
      `Cultural context for ${language}`,
      `Historical background ${language}`
    ].slice(0, limit);
  }
  
  /**
   * Récupération de phrases Tatoeba
   */
  async fetchTatoebaSentences(language, limit) {
    // Simulation - en production, utiliser l'API Tatoeba
    return [
      { source: 'Hello', target: `Hello in ${language}` },
      { source: 'Thank you', target: `Thank you in ${language}` },
      { source: 'Good morning', target: `Good morning in ${language}` }
    ].slice(0, limit);
  }
  
  /**
   * Récupération d'expressions communes
   */
  async fetchCommonPhrases(language) {
    // Simulation - en production, scraper Omniglot ou sources similaires
    return [
      `Common greeting in ${language}`,
      `Polite expression in ${language}`,
      `Cultural phrase in ${language}`
    ];
  }
  
  /**
   * Test de qualité avec validation croisée
   */
  async validateTranslationQuality(text, fromLang, toLang) {
    console.log(`🧪 Test qualité: "${text}" (${fromLang} → ${toLang})`);
    
    // Traduction avec multiple APIs
    const translations = await this.enhancedTranslate(text, fromLang, toLang);
    
    // Validation par traduction retour
    const backTranslation = await this.enhancedTranslate(
      translations.translation, 
      toLang, 
      fromLang
    );
    
    // Calcul de la cohérence sémantique
    const consistency = this.calculateSemanticSimilarity(text, backTranslation.translation);
    
    return {
      original: text,
      translation: translations.translation,
      back_translation: backTranslation.translation,
      consistency_score: consistency,
      quality_rating: consistency > 0.7 ? 'High' : consistency > 0.5 ? 'Medium' : 'Low',
      api_used: translations.api_used,
      alternatives: translations.alternatives || []
    };
  }
  
  /**
   * Calcul de similarité sémantique simple
   */
  calculateSemanticSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }
}

export default TranslationEnhancementService;

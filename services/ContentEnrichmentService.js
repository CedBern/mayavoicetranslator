/**
 * 🎬 SERVICE D'ENRICHISSEMENT AUTOMATIQUE DES CORPUS
 * Extraction automatique de contenu audio/vidéo depuis YouTube et autres sources
 */

import { YouTubeTranscript } from 'youtube-transcript';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export class ContentEnrichmentService {
  constructor() {
    this.youtubeDL = null;
    this.transcriptionEngine = null;
    this.contentDatabase = new Map();
    this.extractionQueue = [];
    this.processingLimits = {
      dailyLimit: 100, // 100 vidéos par jour
      concurrentExtractions: 3,
      maxDurationMinutes: 60
    };
    this.regionalSources = this.initializeRegionalSources();
  }

  // === INITIALISATION DES SOURCES RÉGIONALES ===

  initializeRegionalSources() {
    return {
      maya_yucateco: {
        youtube_channels: [
          'Centro Cultural Maya',
          'Lengua Maya Península',
          'Tradiciones Mayas Vivas'
        ],
        websites: [
          'https://mayatan.org',
          'https://academia-maya.org.mx'
        ],
        radio_stations: [
          'Radio Xepet (Peto)',
          'La Voz de los Mayas'
        ]
      },

      quechua: {
        youtube_channels: [
          'Runasimi Peru',
          'Quechua Network',
          'Cultura Andina Viva'
        ],
        websites: [
          'https://quechua.org.pe',
          'https://runasimi.org'
        ],
        radio_stations: [
          'Radio Inca (Cusco)',
          'Radio Tawantinsuyu'
        ]
      },

      guarani: {
        youtube_channels: [
          'Guaraní Paraguay',
          'Cultura Guaraní',
          'Avañe\'ẽ Digital'
        ],
        websites: [
          'https://guarani.gov.py',
          'https://avaneê.org'
        ],
        radio_stations: [
          'Radio Ñandutí',
          'Radio Guaraní'
        ]
      }
    };
  }

  // === EXTRACTION AUTOMATIQUE DE CONTENU ===

  /**
   * Recherche intelligente de contenu authentique
   */
  async searchAuthenticContent(language, contentType = 'all') {
    const searchQueries = this.generateSearchQueries(language, contentType);
    const results = [];

    for (const query of searchQueries) {
      try {
        const searchResults = await this.executeYouTubeSearch(query, language);
        const filteredResults = await this.filterAuthenticContent(searchResults, language);
        results.push(...filteredResults);
      } catch (error) {
        console.warn(`⚠️ Erreur recherche ${query}:`, error.message);
      }
    }

    return this.prioritizeContent(results, language);
  }

  /**
   * Génère des requêtes de recherche intelligentes
   */
  generateSearchQueries(language, contentType) {
    const baseQueries = {
      maya_yucateco: [
        'maya yucateco conversación',
        'lengua maya península tradición',
        'maya yucateco abuelos historias',
        'cultura maya yucatán oral',
        'maya yucateco niños canciones'
      ],
      quechua: [
        'quechua conversación auténtica',
        'runasimi cusco tradición',
        'quechua abuelas historias',
        'cultura andina oral quechua',
        'quechua niños canciones'
      ],
      guarani: [
        'guaraní conversación paraguay',
        'avañe\'ẽ tradición oral',
        'guaraní abuelos historias',
        'cultura guaraní auténtica',
        'guaraní niños canciones'
      ]
    };

    const contentTypeModifiers = {
      conversations: ['conversación', 'diálogo', 'charla'],
      stories: ['cuento', 'historia', 'leyenda', 'mito'],
      songs: ['canción', 'música', 'himno'],
      educational: ['enseñanza', 'clase', 'aprender'],
      cultural: ['ceremonia', 'ritual', 'tradición', 'cultura']
    };

    return baseQueries[language] || [];
  }

  /**
   * Exécute une recherche YouTube avec filtrage intelligent
   */
  async executeYouTubeSearch(query, language) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
      await page.waitForSelector('#contents', { timeout: 10000 });

      const videos = await page.evaluate(() => {
        const videoElements = document.querySelectorAll('ytd-video-renderer');
        return Array.from(videoElements).slice(0, 20).map(video => {
          const title = video.querySelector('#video-title')?.textContent?.trim();
          const url = video.querySelector('#video-title')?.href;
          const duration = video.querySelector('.badge-style-type-simple')?.textContent?.trim();
          const channel = video.querySelector('#channel-name')?.textContent?.trim();
          const views = video.querySelector('#metadata-line span:first-child')?.textContent?.trim();

          return { title, url, duration, channel, views };
        }).filter(v => v.title && v.url);
      });

      await browser.close();
      return videos;

    } catch (error) {
      console.error('❌ Erreur recherche YouTube:', error);
      return [];
    }
  }

  /**
   * Filtre le contenu authentique vs contenu d'apprentissage
   */
  async filterAuthenticContent(videos, language) {
    const authenticityIndicators = {
      positive: [
        'conversación', 'abuelo', 'abuela', 'tradición', 'auténtico',
        'nativo', 'original', 'cultura', 'historia real', 'familia'
      ],
      negative: [
        'curso', 'lección', 'aprende', 'tutorial', 'clase',
        'beginner', 'lesson', 'learn', 'course', 'study'
      ]
    };

    return videos.filter(video => {
      const text = `${video.title} ${video.channel}`.toLowerCase();
      
      const positiveScore = authenticityIndicators.positive
        .reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
      
      const negativeScore = authenticityIndicators.negative
        .reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);

      // Filtrer les vidéos trop longues ou trop courtes
      const duration = this.parseDuration(video.duration);
      if (duration < 30 || duration > 3600) return false; // 30s à 1h

      return positiveScore > negativeScore && positiveScore >= 2;
    });
  }

  /**
   * Priorise le contenu par qualité et authenticité
   */
  prioritizeContent(videos, language) {
    return videos.map(video => {
      let score = 0;

      // Critères de qualité
      if (video.views?.includes('K') || video.views?.includes('M')) score += 2;
      if (video.duration && this.parseDuration(video.duration) > 60) score += 1;
      
      // Critères d'authenticité culturelle
      const culturalKeywords = {
        maya_yucateco: ['maya', 'yucatán', 'península', 'cultura maya'],
        quechua: ['quechua', 'runasimi', 'cusco', 'andes', 'peru'],
        guarani: ['guaraní', 'paraguay', 'avañe\'ẽ', 'cultura guaraní']
      };

      const keywords = culturalKeywords[language] || [];
      const text = `${video.title} ${video.channel}`.toLowerCase();
      score += keywords.reduce((s, word) => s + (text.includes(word) ? 1 : 0), 0);

      return { ...video, qualityScore: score };
    }).sort((a, b) => b.qualityScore - a.qualityScore);
  }

  // === EXTRACTION ET TRANSCRIPTION ===

  /**
   * Extrait et transcrit automatiquement le contenu
   */
  async extractAndTranscribe(videoUrl, language) {
    try {
      console.log(`🎬 Extraction de contenu: ${videoUrl}`);

      // 1. Obtenir les métadonnées
      const metadata = await this.getVideoMetadata(videoUrl);
      
      // 2. Extraire la transcription si disponible
      let transcript = await this.extractExistingTranscript(videoUrl, language);
      
      // 3. Si pas de transcription, utiliser la reconnaissance vocale
      if (!transcript) {
        transcript = await this.transcribeAudio(videoUrl, language);
      }

      // 4. Nettoyer et enrichir la transcription
      const enrichedTranscript = await this.enrichTranscript(transcript, language, metadata);

      // 5. Sauvegarder dans la base de corpus
      await this.saveToCorpus(enrichedTranscript, metadata, language);

      return {
        success: true,
        videoId: this.extractVideoId(videoUrl),
        transcript: enrichedTranscript,
        metadata: metadata,
        addedToCorpus: true
      };

    } catch (error) {
      console.error(`❌ Erreur extraction ${videoUrl}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Extrait une transcription existante de YouTube
   */
  async extractExistingTranscript(videoUrl, language) {
    try {
      const videoId = this.extractVideoId(videoUrl);
      const transcript = await YouTubeTranscript.fetchTranscript(videoId);
      
      if (transcript && transcript.length > 0) {
        return transcript.map(item => ({
          text: item.text,
          start: item.offset / 1000,
          duration: item.duration / 1000
        }));
      }
    } catch (error) {
      console.log(`📝 Pas de transcription automatique disponible pour ${videoUrl}`);
    }
    return null;
  }

  /**
   * Enrichit la transcription avec des métadonnées linguistiques
   */
  async enrichTranscript(transcript, language, metadata) {
    if (!transcript) return null;

    const enriched = {
      language: language,
      source: 'youtube',
      metadata: metadata,
      segments: [],
      linguisticFeatures: {},
      culturalContext: {}
    };

    for (const segment of transcript) {
      const enrichedSegment = {
        ...segment,
        words: this.extractWords(segment.text),
        phrases: this.extractPhrases(segment.text, language),
        culturalReferences: this.identifyCulturalReferences(segment.text, language),
        dialectFeatures: this.identifyDialectFeatures(segment.text, language)
      };

      enriched.segments.push(enrichedSegment);
    }

    // Analyse globale du contenu
    enriched.linguisticFeatures = this.analyzeLinguisticFeatures(enriched.segments, language);
    enriched.culturalContext = this.analyzeCulturalContext(enriched.segments, language);

    return enriched;
  }

  // === ANALYSE LINGUISTIQUE ET CULTURELLE ===

  /**
   * Identifie les références culturelles dans le texte
   */
  identifyCulturalReferences(text, language) {
    const culturalPatterns = {
      maya_yucateco: {
        ceremonies: ['ceremonia', 'ritual', 'ja\'atskab', 'ch\'a chaac'],
        deities: ['itzamná', 'kukulkán', 'chaac', 'ix chel'],
        places: ['chichén itzá', 'uxmal', 'palenque', 'cenote'],
        traditions: ['día de muertos', 'hanal pixán', 'jarana']
      },
      quechua: {
        ceremonies: ['inti raymi', 'pachamama', 'ayni', 'minga'],
        deities: ['inti', 'pachamama', 'mama quilla', 'apu'],
        places: ['cusco', 'machu picchu', 'sacsayhuamán', 'ollantaytambo'],
        traditions: ['reciprocidad', 'ayni', 'mit\'a']
      },
      guarani: {
        ceremonies: ['tembiú', 'mitã pepy', 'avatar ñe\'ẽ'],
        deities: ['tupã', 'jasy', 'kuarahy'],
        places: ['itaipu', 'yvytu marã eĩ', 'cerro corá'],
        traditions: ['tereré', 'polka paraguaya', 'artesanía ñandutí']
      }
    };

    const patterns = culturalPatterns[language] || {};
    const references = [];

    for (const [category, keywords] of Object.entries(patterns)) {
      for (const keyword of keywords) {
        if (text.toLowerCase().includes(keyword)) {
          references.push({ category, keyword, context: this.extractContext(text, keyword) });
        }
      }
    }

    return references;
  }

  /**
   * Identifie les caractéristiques dialectales
   */
  identifyDialectFeatures(text, language) {
    const dialectFeatures = {
      maya_yucateco: {
        phonetic: ['x', 'k\'', 'ch\'', 'ts\''],
        morphological: ['ich', 'ech', 'ach', 'och'],
        lexical: ['bix', 'ba\'ax', 'tu\'ux', 'buka\'aj']
      },
      quechua: {
        phonetic: ['q', 'qh', 'ch\'', 'k\'', 'p\'', 't\''],
        morphological: ['niyuq', 'sapa', 'kuna', 'manta'],
        lexical: ['ama', 'runa', 'warmi', 'tayta']
      },
      guarani: {
        phonetic: ['ñ', 'mb', 'nd', 'ng', 'nt'],
        morphological: ['katu', 'rei', 'ramo', 'gui'],
        lexical: ['che', 'nde', 'mba\'e', 'moõ']
      }
    };

    const features = dialectFeatures[language] || {};
    const identified = [];

    for (const [type, patterns] of Object.entries(features)) {
      for (const pattern of patterns) {
        if (text.includes(pattern)) {
          identified.push({ type, pattern, frequency: this.countOccurrences(text, pattern) });
        }
      }
    }

    return identified;
  }

  // === GESTION DU CORPUS ===

  /**
   * Sauvegarde le contenu enrichi dans le corpus
   */
  async saveToCorpus(enrichedTranscript, metadata, language) {
    const corpusPath = path.join('data', 'corpus', language);
    await fs.mkdir(corpusPath, { recursive: true });

    const filename = `${metadata.videoId}_${Date.now()}.json`;
    const filepath = path.join(corpusPath, filename);

    const corpusEntry = {
      id: `${language}_${metadata.videoId}`,
      language: language,
      source: 'youtube',
      url: metadata.url,
      title: metadata.title,
      channel: metadata.channel,
      duration: metadata.duration,
      extractedAt: new Date().toISOString(),
      transcript: enrichedTranscript,
      qualityMetrics: this.calculateQualityMetrics(enrichedTranscript),
      usageRights: 'fair_use_educational'
    };

    await fs.writeFile(filepath, JSON.stringify(corpusEntry, null, 2));

    // Mettre à jour l'index du corpus
    await this.updateCorpusIndex(language, corpusEntry);

    console.log(`✅ Contenu sauvegardé: ${filepath}`);
  }

  /**
   * Met à jour l'index principal du corpus
   */
  async updateCorpusIndex(language, entry) {
    const indexPath = path.join('data', 'corpus', `${language}_index.json`);
    
    let index = [];
    try {
      const indexData = await fs.readFile(indexPath, 'utf-8');
      index = JSON.parse(indexData);
    } catch (error) {
      // Fichier n'existe pas encore
    }

    index.push({
      id: entry.id,
      title: entry.title,
      duration: entry.duration,
      quality: entry.qualityMetrics.overall,
      addedAt: entry.extractedAt,
      segments: entry.transcript.segments?.length || 0,
      culturalReferences: entry.transcript.culturalContext?.references?.length || 0
    });

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  }

  // === AUTOMATISATION ET SCHEDULING ===

  /**
   * Lance l'enrichissement automatique quotidien
   */
  async startAutomaticEnrichment() {
    console.log('🔄 Démarrage de l\'enrichissement automatique des corpus...');

    const languages = ['maya_yucateco', 'quechua', 'guarani'];
    
    // Enrichissement quotidien
    setInterval(async () => {
      for (const language of languages) {
        try {
          await this.performDailyEnrichment(language);
        } catch (error) {
          console.error(`❌ Erreur enrichissement ${language}:`, error);
        }
      }
    }, 24 * 60 * 60 * 1000); // 24 heures

    // Premier enrichissement immédiat
    for (const language of languages) {
      setTimeout(() => this.performDailyEnrichment(language), Math.random() * 60000);
    }
  }

  /**
   * Effectue l'enrichissement quotidien pour une langue
   */
  async performDailyEnrichment(language) {
    console.log(`📚 Enrichissement quotidien pour ${language}...`);

    // 1. Rechercher nouveau contenu
    const content = await this.searchAuthenticContent(language);
    
    // 2. Sélectionner les meilleurs candidats
    const selectedContent = content.slice(0, 5); // 5 vidéos par jour max

    // 3. Extraire et enrichir
    for (const video of selectedContent) {
      try {
        const result = await this.extractAndTranscribe(video.url, language);
        if (result.success) {
          console.log(`✅ Contenu ajouté: ${video.title}`);
        }
      } catch (error) {
        console.warn(`⚠️ Échec extraction: ${video.title}`);
      }
    }

    // 4. Générer rapport quotidien
    await this.generateDailyReport(language, selectedContent);
  }

  // === MÉTRIQUES ET RAPPORTS ===

  /**
   * Calcule les métriques de qualité du contenu
   */
  calculateQualityMetrics(transcript) {
    if (!transcript || !transcript.segments) {
      return { overall: 0, details: 'No transcript available' };
    }

    const segments = transcript.segments;
    const totalWords = segments.reduce((count, seg) => count + (seg.words?.length || 0), 0);
    const culturalReferences = segments.reduce((count, seg) => count + (seg.culturalReferences?.length || 0), 0);
    const dialectFeatures = segments.reduce((count, seg) => count + (seg.dialectFeatures?.length || 0), 0);

    const lengthScore = Math.min(totalWords / 100, 1) * 30; // 30% pour la longueur
    const culturalScore = Math.min(culturalReferences / 5, 1) * 40; // 40% pour les références culturelles
    const dialectScore = Math.min(dialectFeatures / 10, 1) * 30; // 30% pour les caractéristiques dialectales

    const overall = Math.round(lengthScore + culturalScore + dialectScore);

    return {
      overall,
      length: lengthScore,
      cultural: culturalScore,
      dialect: dialectScore,
      totalWords,
      culturalReferences,
      dialectFeatures
    };
  }

  /**
   * Génère un rapport quotidien d'enrichissement
   */
  async generateDailyReport(language, processedContent) {
    const report = {
      date: new Date().toISOString().split('T')[0],
      language: language,
      processedVideos: processedContent.length,
      successfulExtractions: 0,
      totalWordsAdded: 0,
      culturalReferencesFound: 0,
      topSources: [],
      qualityDistribution: { high: 0, medium: 0, low: 0 }
    };

    // Analyser les résultats et sauvegarder le rapport
    const reportPath = path.join('data', 'reports', 'enrichment', `${language}_${report.date}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Rapport quotidien généré: ${reportPath}`);
  }

  // === UTILITAIRES ===

  parseDuration(durationStr) {
    if (!durationStr) return 0;
    
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }

  extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  extractWords(text) {
    return text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  }

  extractPhrases(text, language) {
    // Extraction basique de phrases - à améliorer avec NLP spécialisé
    return text.split(/[.!?]+/).filter(phrase => phrase.trim().length > 0);
  }

  extractContext(text, keyword) {
    const index = text.toLowerCase().indexOf(keyword);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + keyword.length + 50);
    return text.substring(start, end);
  }

  countOccurrences(text, pattern) {
    return (text.match(new RegExp(pattern, 'gi')) || []).length;
  }

  async getVideoMetadata(videoUrl) {
    const videoId = this.extractVideoId(videoUrl);
    return {
      videoId,
      url: videoUrl,
      title: 'Titre à extraire',
      channel: 'Canal à extraire',
      duration: 0,
      description: '',
      publishedAt: new Date().toISOString()
    };
  }
}

export default ContentEnrichmentService;

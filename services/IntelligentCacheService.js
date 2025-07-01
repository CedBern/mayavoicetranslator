/**
 * 📚 SERVICE CACHE INTELLIGENT MULTI-NIVEAUX - TALK KIN
 * Stratégies de cache adaptatives pour performance optimale
 * Gestion intelligente des ressources linguistiques
 */

class IntelligentCacheService {
    constructor() {
        this.cacheHierarchy = {
            L1: { // Cache mémoire ultra-rapide
                type: 'memory',
                capacity: '50MB',
                latency: '<1ms',
                content: ['active-models', 'current-session', 'ui-state']
            },
            L2: { // Cache navigateur persistant
                type: 'indexeddb',
                capacity: '200MB',
                latency: '<5ms',
                content: ['user-progress', 'frequent-translations', 'offline-models']
            },
            L3: { // Cache local avancé
                type: 'localstorage-enhanced',
                capacity: '100MB',
                latency: '<10ms',
                content: ['preferences', 'settings', 'quick-access']
            },
            L4: { // Cache réseau optimisé
                type: 'service-worker',
                capacity: '500MB',
                latency: '<50ms',
                content: ['audio-corpus', 'ml-models', 'static-resources']
            }
        };

        this.cacheStrategies = {
            'real-time-translation': {
                priority: 'immediate',
                location: ['L1', 'L2'],
                ttl: 300, // 5 minutes
                maxSize: '10MB'
            },
            'user-learning-progress': {
                priority: 'persistent',
                location: ['L2', 'L3'],
                ttl: 2592000, // 30 jours
                maxSize: '50MB'
            },
            'audio-models': {
                priority: 'performance',
                location: ['L1', 'L4'],
                ttl: 86400, // 24 heures
                maxSize: '100MB'
            },
            'translation-corpus': {
                priority: 'capacity',
                location: ['L4'],
                ttl: 604800, // 7 jours
                maxSize: '200MB'
            },
            'ancient-language-data': {
                priority: 'preservation',
                location: ['L2', 'L4'],
                ttl: 31536000, // 1 an
                maxSize: '150MB'
            }
        };

        this.adaptiveRules = {
            bandwidth: {
                'high': { prefetch: true, compression: 'minimal' },
                'medium': { prefetch: 'selective', compression: 'balanced' },
                'low': { prefetch: false, compression: 'aggressive' }
            },
            device: {
                'desktop': { capacity: 'generous', performance: 'high' },
                'mobile-modern': { capacity: 'moderate', performance: 'balanced' },
                'mobile-legacy': { capacity: 'conservative', performance: 'optimized' }
            },
            usage: {
                'frequent-user': { cache: 'aggressive', prediction: 'enabled' },
                'occasional-user': { cache: 'selective', prediction: 'limited' },
                'new-user': { cache: 'minimal', prediction: 'disabled' }
            }
        };

        this.intelligentPredictor = {
            enabled: true,
            confidence: 0.75,
            patterns: new Map(),
            learningRate: 0.1
        };

        this.init();
    }

    async init() {
        console.log('📚 Initialisation Cache Intelligent...');
        await this.setupCacheHierarchy();
        await this.initializeAdaptiveEngine();
        await this.startPredictiveEngine();
        await this.enablePerformanceMonitoring();
        console.log('✅ Cache Intelligent opérationnel');
    }

    /**
     * 🏗️ Configuration hiérarchie cache
     */
    async setupCacheHierarchy() {
        // L1: Cache mémoire
        this.memoryCache = new Map();
        this.memoryCacheSize = 0;
        this.memoryCacheLimit = 50 * 1024 * 1024; // 50MB

        // L2: IndexedDB
        await this.setupIndexedDBCache();

        // L3: LocalStorage Enhanced
        await this.setupEnhancedLocalStorage();

        // L4: Service Worker Cache
        await this.setupServiceWorkerCache();

        console.log('🏗️ Hiérarchie cache configurée');
    }

    async setupIndexedDBCache() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('TalkKinCache', 2);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.indexedDB = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store pour données utilisateur
                if (!db.objectStoreNames.contains('userProgress')) {
                    const userStore = db.createObjectStore('userProgress', { keyPath: 'id' });
                    userStore.createIndex('userId', 'userId', { unique: false });
                    userStore.createIndex('language', 'language', { unique: false });
                }
                
                // Store pour traductions fréquentes
                if (!db.objectStoreNames.contains('translations')) {
                    const translationStore = db.createObjectStore('translations', { keyPath: 'hash' });
                    translationStore.createIndex('frequency', 'frequency', { unique: false });
                    translationStore.createIndex('lastUsed', 'lastUsed', { unique: false });
                }
                
                // Store pour modèles ML
                if (!db.objectStoreNames.contains('mlModels')) {
                    const modelStore = db.createObjectStore('mlModels', { keyPath: 'modelId' });
                    modelStore.createIndex('language', 'language', { unique: false });
                    modelStore.createIndex('version', 'version', { unique: false });
                }
            };
        });
    }

    async setupServiceWorkerCache() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw-talkkin-cache.js');
                this.serviceWorker = registration;
                console.log('🔧 Service Worker cache configuré');
            } catch (error) {
                console.warn('⚠️ Service Worker non disponible:', error);
            }
        }
    }

    /**
     * 🎯 Cache intelligent avec prédiction
     */
    async get(key, options = {}) {
        const strategy = this.getStrategyForKey(key, options);
        
        // Recherche séquentielle dans hiérarchie
        for (const level of strategy.location) {
            const cached = await this.getFromLevel(key, level);
            if (cached && !this.isExpired(cached, strategy.ttl)) {
                // Promotion vers niveau supérieur si pertinent
                await this.promoteToHigherLevel(key, cached, level);
                
                // Enregistrement pattern d'usage
                this.recordUsagePattern(key, options);
                
                return cached.data;
            }
        }
        
        // Cache miss - prédiction pour prochaine fois
        this.predictAndPrefetch(key, options);
        
        return null;
    }

    async set(key, data, options = {}) {
        const strategy = this.getStrategyForKey(key, options);
        const cacheEntry = {
            data,
            timestamp: Date.now(),
            ttl: strategy.ttl,
            size: this.calculateSize(data),
            metadata: {
                accessCount: 1,
                lastAccess: Date.now(),
                priority: strategy.priority
            }
        };

        // Stockage selon stratégie
        const promises = strategy.location.map(level => 
            this.setToLevel(key, cacheEntry, level, strategy)
        );
        
        await Promise.all(promises);
        
        // Apprentissage pattern
        this.learnUsagePattern(key, options);
        
        return true;
    }

    async getFromLevel(key, level) {
        switch (level) {
            case 'L1':
                return this.memoryCache.get(key);
            
            case 'L2':
                return this.getFromIndexedDB(key);
            
            case 'L3':
                return this.getFromEnhancedLocalStorage(key);
            
            case 'L4':
                return this.getFromServiceWorker(key);
            
            default:
                return null;
        }
    }

    async setToLevel(key, cacheEntry, level, strategy) {
        // Vérification capacité avant stockage
        if (!(await this.hasCapacity(level, cacheEntry.size))) {
            await this.evictLeastUsed(level, cacheEntry.size);
        }

        switch (level) {
            case 'L1':
                return this.setToMemoryCache(key, cacheEntry, strategy);
            
            case 'L2':
                return this.setToIndexedDB(key, cacheEntry);
            
            case 'L3':
                return this.setToEnhancedLocalStorage(key, cacheEntry);
            
            case 'L4':
                return this.setToServiceWorker(key, cacheEntry);
        }
    }

    /**
     * 🧠 Moteur prédictif intelligent
     */
    async startPredictiveEngine() {
        this.predictionEngine = {
            patterns: new Map(),
            sequences: new Map(),
            userBehavior: new Map(),
            contextualRules: new Map()
        };

        // Analyse patterns toutes les 30 secondes
        setInterval(() => {
            this.analyzePatternsAndPredict();
        }, 30000);

        console.log('🧠 Moteur prédictif démarré');
    }

    recordUsagePattern(key, context) {
        const pattern = {
            key,
            timestamp: Date.now(),
            context: {
                timeOfDay: new Date().getHours(),
                dayOfWeek: new Date().getDay(),
                language: context.language,
                userType: context.userType,
                deviceType: context.deviceType
            }
        };

        if (!this.intelligentPredictor.patterns.has(key)) {
            this.intelligentPredictor.patterns.set(key, []);
        }
        
        this.intelligentPredictor.patterns.get(key).push(pattern);
        
        // Limite historique pour performance
        const patterns = this.intelligentPredictor.patterns.get(key);
        if (patterns.length > 100) {
            patterns.shift();
        }
    }

    async analyzePatternsAndPredict() {
        const currentContext = await this.getCurrentContext();
        const predictions = [];

        for (const [key, patterns] of this.intelligentPredictor.patterns) {
            const probability = this.calculateAccessProbability(patterns, currentContext);
            
            if (probability > this.intelligentPredictor.confidence) {
                predictions.push({
                    key,
                    probability,
                    priority: this.calculatePrefetchPriority(key, probability)
                });
            }
        }

        // Tri par priorité et préchargement
        predictions
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 5) // Limite à 5 prédictions
            .forEach(prediction => this.prefetchResource(prediction.key));
    }

    calculateAccessProbability(patterns, currentContext) {
        if (patterns.length === 0) return 0;

        let probability = 0;
        const recentPatterns = patterns.filter(p => 
            Date.now() - p.timestamp < 3600000 // Dernière heure
        );

        // Probabilité basée sur fréquence
        const frequency = recentPatterns.length / patterns.length;
        probability += frequency * 0.4;

        // Probabilité basée sur contexte temporel
        const timeMatches = recentPatterns.filter(p => 
            Math.abs(p.context.timeOfDay - currentContext.timeOfDay) <= 1
        ).length;
        probability += (timeMatches / recentPatterns.length) * 0.3;

        // Probabilité basée sur jour de semaine
        const dayMatches = recentPatterns.filter(p => 
            p.context.dayOfWeek === currentContext.dayOfWeek
        ).length;
        probability += (dayMatches / recentPatterns.length) * 0.2;

        // Probabilité basée sur langue
        const languageMatches = recentPatterns.filter(p => 
            p.context.language === currentContext.language
        ).length;
        probability += (languageMatches / recentPatterns.length) * 0.1;

        return Math.min(probability, 1);
    }

    /**
     * 🔄 Éviction intelligente
     */
    async evictLeastUsed(level, requiredSpace) {
        const candidates = await this.getEvictionCandidates(level);
        
        // Tri par score d'éviction (LFU + LRU + taille + priorité)
        candidates.sort((a, b) => {
            const scoreA = this.calculateEvictionScore(a);
            const scoreB = this.calculateEvictionScore(b);
            return scoreA - scoreB;
        });

        let freedSpace = 0;
        const toEvict = [];

        for (const candidate of candidates) {
            toEvict.push(candidate.key);
            freedSpace += candidate.size;
            
            if (freedSpace >= requiredSpace) break;
        }

        // Éviction effective
        await Promise.all(toEvict.map(key => this.deleteFromLevel(key, level)));
        
        console.log(`🗑️ Éviction ${toEvict.length} entrées (${this.formatSize(freedSpace)})`);
    }

    calculateEvictionScore(cacheEntry) {
        const now = Date.now();
        const age = (now - cacheEntry.timestamp) / 1000; // secondes
        const timeSinceLastAccess = (now - cacheEntry.metadata.lastAccess) / 1000;
        
        // Score basé sur: fréquence d'accès, récence, taille, priorité
        const frequencyScore = 1 / (cacheEntry.metadata.accessCount + 1);
        const recencyScore = timeSinceLastAccess / 3600; // heures
        const sizeScore = cacheEntry.size / (1024 * 1024); // MB
        const priorityScore = this.getPriorityScore(cacheEntry.metadata.priority);
        
        return frequencyScore + recencyScore + sizeScore - priorityScore;
    }

    /**
     * 📊 Optimisation adaptative
     */
    async optimizeCacheConfiguration() {
        const metrics = await this.collectCacheMetrics();
        
        // Ajustement capacités selon usage
        if (metrics.hitRatio < 0.8) {
            await this.increaseCacheCapacity();
        }
        
        // Ajustement TTL selon patterns
        if (metrics.averageItemLifetime > metrics.averageTTL * 2) {
            await this.increaseTTLs();
        }
        
        // Optimisation prédiction
        if (metrics.predictionAccuracy < 0.7) {
            await this.adjustPredictionAlgorithm();
        }
        
        console.log('🔧 Configuration cache optimisée');
    }

    async collectCacheMetrics() {
        const totalRequests = this.metrics.hits + this.metrics.misses;
        
        return {
            hitRatio: this.metrics.hits / totalRequests,
            missRatio: this.metrics.misses / totalRequests,
            averageResponseTime: this.metrics.totalResponseTime / totalRequests,
            memoryUsage: this.getMemoryUsage(),
            diskUsage: await this.getDiskUsage(),
            predictionAccuracy: this.getPredictionAccuracy(),
            averageItemLifetime: this.getAverageItemLifetime(),
            averageTTL: this.getAverageTTL()
        };
    }

    /**
     * 🎯 API publique optimisée
     */
    async cacheTranslation(sourceText, targetLanguage, translation, context = {}) {
        const key = this.generateTranslationKey(sourceText, targetLanguage);
        const cacheData = {
            translation,
            sourceText,
            targetLanguage,
            confidence: context.confidence || 1.0,
            metadata: {
                timestamp: Date.now(),
                userId: context.userId,
                model: context.model
            }
        };

        return this.set(key, cacheData, { 
            type: 'translation',
            language: targetLanguage,
            ...context 
        });
    }

    async getCachedTranslation(sourceText, targetLanguage, context = {}) {
        const key = this.generateTranslationKey(sourceText, targetLanguage);
        const cached = await this.get(key, { 
            type: 'translation',
            language: targetLanguage,
            ...context 
        });

        if (cached && this.isTranslationValid(cached, context)) {
            return cached.translation;
        }

        return null;
    }

    async cacheUserProgress(userId, progressData, context = {}) {
        const key = `user-progress:${userId}`;
        return this.set(key, progressData, { 
            type: 'user-progress',
            persistent: true,
            ...context 
        });
    }

    async preloadLanguageModels(languages, priority = 'normal') {
        const promises = languages.map(async (language) => {
            const modelKey = `model:${language}`;
            const existing = await this.get(modelKey);
            
            if (!existing) {
                // Préchargement modèle depuis serveur
                const model = await this.fetchLanguageModel(language);
                await this.set(modelKey, model, {
                    type: 'ml-model',
                    language,
                    priority
                });
            }
        });

        await Promise.all(promises);
        console.log(`📦 Modèles préchargés: ${languages.join(', ')}`);
    }

    // Méthodes utilitaires
    getStrategyForKey(key, options) {
        const type = options.type || 'default';
        return this.cacheStrategies[type] || this.cacheStrategies['real-time-translation'];
    }

    generateTranslationKey(sourceText, targetLanguage) {
        const hash = this.simpleHash(sourceText + targetLanguage);
        return `translation:${hash}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    calculateSize(data) {
        return new Blob([JSON.stringify(data)]).size;
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)}${units[unitIndex]}`;
    }

    isExpired(cacheEntry, ttl) {
        return Date.now() - cacheEntry.timestamp > ttl * 1000;
    }

    async getCurrentContext() {
        return {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            language: navigator.language,
            deviceType: this.detectDeviceType(),
            bandwidth: await this.detectBandwidth()
        };
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            return 'mobile';
        } else if (/Tablet|iPad/.test(userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }
}

// Service global singleton
window.IntelligentCacheService = new IntelligentCacheService();

export default IntelligentCacheService;

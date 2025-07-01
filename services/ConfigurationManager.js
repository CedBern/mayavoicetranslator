// Configuration centralisée des clés API et cache intelligent
import Redis from 'redis';
import crypto from 'crypto';

/**
 * Gestionnaire de configuration et cache pour Maya Voice Translator
 * Gère les clés API, le cache Redis et l'optimisation des performances
 */
class ConfigurationManager {
  constructor() {
    this.apiKeys = new Map();
    this.redisClient = null;
    this.cacheConfig = {
      ttl: 86400, // 24 heures par défaut
      maxSize: 10000, // Limite du cache en mémoire
      compressionThreshold: 1000 // Compresser si > 1KB
    };
    this.localCache = new Map();
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      totalRequests: 0
    };
  }

  /**
   * Initialise la connexion Redis et configure les clés API
   */
  async initialize(config = {}) {
    console.log('🔧 Initialisation du gestionnaire de configuration...');
    
    // Configuration des clés API depuis les variables d'environnement
    this.loadApiKeys(config.apiKeys || {});
    
    // Initialisation de Redis si disponible
    if (config.redis !== false) {
      await this.initializeRedis(config.redis || {});
    }
    
    console.log('✅ Configuration initialisée avec succès');
    console.log(`📊 APIs configurées: ${this.apiKeys.size}`);
    console.log(`🔄 Cache Redis: ${this.redisClient ? 'Activé' : 'Désactivé'}`);
  }

  /**
   * Charge les clés API depuis la configuration
   */
  loadApiKeys(apiKeys) {
    const defaultKeys = {
      openai: process.env.OPENAI_API_KEY || apiKeys.openai,
      google: process.env.GOOGLE_TRANSLATE_API_KEY || apiKeys.google,
      systran: process.env.SYSTRAN_API_KEY || apiKeys.systran,
      azure: process.env.AZURE_TRANSLATOR_KEY || apiKeys.azure,
      deepl: process.env.DEEPL_API_KEY || apiKeys.deepl,
      ibm: process.env.IBM_WATSON_API_KEY || apiKeys.ibm
    };

    for (const [service, key] of Object.entries(defaultKeys)) {
      if (key && key !== 'YOUR_API_KEY_HERE') {
        this.apiKeys.set(service, key);
        console.log(`🔑 Clé API configurée pour ${service}: ${key.substring(0, 8)}...`);
      } else {
        console.log(`⚠️ Clé API manquante pour ${service} - mode simulation`);
      }
    }
  }

  /**
   * Initialise la connexion Redis
   */
  async initializeRedis(redisConfig) {
    try {
      const config = {
        host: redisConfig.host || process.env.REDIS_HOST || 'localhost',
        port: redisConfig.port || process.env.REDIS_PORT || 6379,
        password: redisConfig.password || process.env.REDIS_PASSWORD,
        db: redisConfig.db || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3
      };

      this.redisClient = Redis.createClient(config);
      
      this.redisClient.on('error', (err) => {
        console.warn('⚠️ Erreur Redis:', err.message);
        console.log('📝 Passage en mode cache local uniquement');
        this.redisClient = null;
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Connexion Redis établie');
      });

      await this.redisClient.connect();
      
      // Test de fonctionnement
      await this.redisClient.ping();
      console.log('🏓 Test Redis: Succès');
      
    } catch (error) {
      console.warn('⚠️ Impossible de se connecter à Redis:', error.message);
      console.log('📝 Utilisation du cache local uniquement');
      this.redisClient = null;
    }
  }

  /**
   * Génère une clé de cache unique pour une traduction
   */
  generateCacheKey(text, fromLang, toLang, provider) {
    const data = `${text}|${fromLang}|${toLang}|${provider}`;
    return `translation:${crypto.createHash('md5').update(data).digest('hex')}`;
  }

  /**
   * Récupère une traduction depuis le cache
   */
  async getCachedTranslation(text, fromLang, toLang, provider) {
    const key = this.generateCacheKey(text, fromLang, toLang, provider);
    this.stats.totalRequests++;
    
    try {
      // Vérifier d'abord le cache local
      if (this.localCache.has(key)) {
        const cached = this.localCache.get(key);
        if (Date.now() - cached.timestamp < this.cacheConfig.ttl * 1000) {
          this.stats.cacheHits++;
          console.log(`🎯 Cache local hit pour: ${text.substring(0, 30)}...`);
          return cached.data;
        } else {
          this.localCache.delete(key);
        }
      }

      // Vérifier Redis si disponible
      if (this.redisClient) {
        const cached = await this.redisClient.get(key);
        if (cached) {
          const data = JSON.parse(cached);
          this.stats.cacheHits++;
          console.log(`🎯 Cache Redis hit pour: ${text.substring(0, 30)}...`);
          
          // Stocker aussi en local pour accès rapide
          this.localCache.set(key, {
            data: data,
            timestamp: Date.now()
          });
          
          return data;
        }
      }

      this.stats.cacheMisses++;
      return null;
      
    } catch (error) {
      console.warn('⚠️ Erreur de lecture cache:', error.message);
      this.stats.cacheMisses++;
      return null;
    }
  }

  /**
   * Stocke une traduction dans le cache
   */
  async setCachedTranslation(text, fromLang, toLang, provider, result) {
    const key = this.generateCacheKey(text, fromLang, toLang, provider);
    
    try {
      const cacheData = {
        ...result,
        cachedAt: Date.now(),
        cacheKey: key
      };

      // Stocker en local
      this.localCache.set(key, {
        data: cacheData,
        timestamp: Date.now()
      });

      // Gérer la taille du cache local
      if (this.localCache.size > this.cacheConfig.maxSize) {
        const oldestKey = this.localCache.keys().next().value;
        this.localCache.delete(oldestKey);
      }

      // Stocker dans Redis si disponible
      if (this.redisClient) {
        await this.redisClient.setEx(
          key, 
          this.cacheConfig.ttl, 
          JSON.stringify(cacheData)
        );
        console.log(`💾 Traduction mise en cache: ${text.substring(0, 30)}...`);
      }

    } catch (error) {
      console.warn('⚠️ Erreur de stockage cache:', error.message);
    }
  }

  /**
   * Récupère une clé API pour un service
   */
  getApiKey(service) {
    return this.apiKeys.get(service.toLowerCase());
  }

  /**
   * Vérifie si une clé API est disponible
   */
  hasApiKey(service) {
    return this.apiKeys.has(service.toLowerCase()) && 
           this.apiKeys.get(service.toLowerCase()) !== null;
  }

  /**
   * Incrémente le compteur d'appels API
   */
  recordApiCall(service) {
    this.stats.apiCalls++;
    console.log(`📡 Appel API ${service} (total: ${this.stats.apiCalls})`);
  }

  /**
   * Obtient les statistiques de performance
   */
  getStats() {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(1)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      localCacheSize: this.localCache.size,
      configuredApis: Array.from(this.apiKeys.keys()),
      redisConnected: !!this.redisClient
    };
  }

  /**
   * Nettoie le cache local des entrées expirées
   */
  cleanupLocalCache() {
    const now = Date.now();
    const ttlMs = this.cacheConfig.ttl * 1000;
    
    for (const [key, value] of this.localCache.entries()) {
      if (now - value.timestamp > ttlMs) {
        this.localCache.delete(key);
      }
    }
  }

  /**
   * Invalide le cache pour un motif spécifique
   */
  async invalidateCache(pattern = '*') {
    try {
      // Nettoyer le cache local
      if (pattern === '*') {
        this.localCache.clear();
        console.log('🧹 Cache local vidé');
      } else {
        for (const key of this.localCache.keys()) {
          if (key.includes(pattern)) {
            this.localCache.delete(key);
          }
        }
      }

      // Nettoyer Redis si disponible
      if (this.redisClient) {
        if (pattern === '*') {
          await this.redisClient.flushDb();
          console.log('🧹 Cache Redis vidé');
        } else {
          const keys = await this.redisClient.keys(`*${pattern}*`);
          if (keys.length > 0) {
            await this.redisClient.del(keys);
            console.log(`🧹 ${keys.length} entrées Redis supprimées pour: ${pattern}`);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors du nettoyage cache:', error.message);
    }
  }

  /**
   * Configuration des limites de taux par API
   */
  getRateLimit(service) {
    const limits = {
      openai: { calls: 60, period: 60 }, // 60 calls per minute
      google: { calls: 1000, period: 60 }, // 1000 calls per minute
      systran: { calls: 100, period: 60 }, // 100 calls per minute
      panlex: { calls: 1000, period: 86400 }, // 1000 calls per day
      tatoeba: { calls: 500, period: 60 }, // 500 calls per minute
      default: { calls: 100, period: 60 }
    };

    return limits[service] || limits.default;
  }

  /**
   * Ferme les connexions proprement
   */
  async shutdown() {
    console.log('🔄 Arrêt du gestionnaire de configuration...');
    
    if (this.redisClient) {
      await this.redisClient.quit();
      console.log('✅ Connexion Redis fermée');
    }
    
    this.localCache.clear();
    console.log('✅ Gestionnaire de configuration arrêté');
  }
}

// Instance singleton
const configManager = new ConfigurationManager();

export { ConfigurationManager };
export default configManager;

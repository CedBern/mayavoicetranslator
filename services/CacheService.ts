/**
 * 💾 SERVICE DE CACHE TALKKIN - GESTION INTELLIGENTE
 * 
 * Fonctionnalités :
 * - Cache multi-niveaux (mémoire + stockage)
 * - Gestion intelligente de l'expiration
 * - Compression des données
 * - Métriques de performance
 * - Nettoyage automatique
 * - Support offline
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
  size: number;
}

interface CacheOptions {
  ttl?: number;
  compress?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

interface CacheStats {
  memorySize: number;
  storageSize: number;
  hitRate: number;
  totalRequests: number;
  totalHits: number;
  entries: number;
  oldestEntry?: number;
  newestEntry?: number;
}

// Configuration
const CACHE_CONFIG = {
  MAX_MEMORY_SIZE: 50 * 1024 * 1024, // 50MB en mémoire
  MAX_STORAGE_SIZE: 100 * 1024 * 1024, // 100MB en stockage
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 minutes
  COMPRESSION_THRESHOLD: 1024, // 1KB
  STORAGE_KEY_PREFIX: 'talkkin_cache_',
};

class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    memorySize: 0,
    storageSize: 0,
    hitRate: 0,
    totalRequests: 0,
    totalHits: 0,
    entries: 0,
  };
  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    this.startCleanupTimer();
    this.loadStorageStats();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * 💾 Stocker des données dans le cache
   */
  async set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      const ttl = options.ttl || CACHE_CONFIG.DEFAULT_TTL;
      const timestamp = Date.now();
      const serialized = JSON.stringify(data);
      const size = new Blob([serialized]).size;

      const entry: CacheEntry<T> = {
        data,
        timestamp,
        ttl,
        accessCount: 0,
        lastAccess: timestamp,
        size,
      };

      // Stocker en mémoire
      this.memoryCache.set(key, entry);
      this.stats.memorySize += size;
      this.stats.entries++;

      // Stocker sur disque pour les données importantes
      if (options.priority === 'high' || size < CACHE_CONFIG.COMPRESSION_THRESHOLD) {
        await this.setInStorage(key, entry, options.compress);
      }

      // Nettoyer si nécessaire
      await this.cleanupIfNeeded();

      return true;
    } catch (error) {
      console.error('❌ Erreur cache set:', error);
      return false;
    }
  }

  /**
   * 📖 Récupérer des données du cache
   */
  async get<T>(key: string): Promise<T | null> {
    this.stats.totalRequests++;

    // Vérifier la mémoire d'abord
    let entry = this.memoryCache.get(key);
    
    // Si pas en mémoire, vérifier le stockage
    if (!entry) {
      const storageEntry = await this.getFromStorage<T>(key);
      if (storageEntry) {
        entry = storageEntry;
        // Remettre en mémoire si trouvé dans le stockage
        this.memoryCache.set(key, entry);
        this.stats.memorySize += entry.size;
      }
    }

    if (!entry) {
      return null;
    }

    // Vérifier l'expiration
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      await this.delete(key);
      return null;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.stats.totalHits++;
    this.stats.hitRate = (this.stats.totalHits / this.stats.totalRequests) * 100;

    return entry.data;
  }

  /**
   * 🗑️ Supprimer une entrée du cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const entry = this.memoryCache.get(key);
      if (entry) {
        this.memoryCache.delete(key);
        this.stats.memorySize -= entry.size;
        this.stats.entries--;
      }

      await AsyncStorage.removeItem(`${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur cache delete:', error);
      return false;
    }
  }

  /**
   * 🔍 Vérifier si une clé existe dans le cache
   */
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  /**
   * 🧹 Nettoyer le cache
   */
  async clear(): Promise<void> {
    try {
      // Nettoyer la mémoire
      this.memoryCache.clear();
      
      // Nettoyer le stockage
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.STORAGE_KEY_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);

      // Réinitialiser les stats
      this.stats = {
        memorySize: 0,
        storageSize: 0,
        hitRate: 0,
        totalRequests: 0,
        totalHits: 0,
        entries: 0,
      };

      console.log('🧹 Cache nettoyé');
    } catch (error) {
      console.error('❌ Erreur nettoyage cache:', error);
    }
  }

  /**
   * 📊 Obtenir les statistiques du cache
   */
  getStats(): CacheStats {
    const entries = Array.from(this.memoryCache.values());
    const timestamps = entries.map(e => e.timestamp);
    
    return {
      ...this.stats,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
    };
  }

  /**
   * 🗄️ Stockage persistant
   */
  private async setInStorage<T>(
    key: string, 
    entry: CacheEntry<T>, 
    compress = false
  ): Promise<void> {
    try {
      const storageKey = `${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`;
      let dataToStore = JSON.stringify(entry);

      // Compression simple si nécessaire
      if (compress && dataToStore.length > CACHE_CONFIG.COMPRESSION_THRESHOLD) {
        // En production, utiliser une vraie compression (ex: pako)
        dataToStore = btoa(dataToStore); // Base64 comme compression basique
      }

      await AsyncStorage.setItem(storageKey, dataToStore);
      this.stats.storageSize += new Blob([dataToStore]).size;
    } catch (error) {
      console.warn('⚠️ Erreur stockage cache:', error);
    }
  }

  private async getFromStorage<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const storageKey = `${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`;
      const stored = await AsyncStorage.getItem(storageKey);
      
      if (!stored) return null;

      // Décompression si nécessaire (détecter base64)
      let dataToParse = stored;
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(stored);
      if (isBase64) {
        try {
          const decompressed = atob(stored);
          return JSON.parse(decompressed);
        } catch {
          // Si la décompression échoue, essayer directement
        }
      }

      return JSON.parse(stored);
    } catch (error) {
      console.warn('⚠️ Erreur lecture stockage cache:', error);
      return null;
    }
  }

  /**
   * 🕒 Nettoyage automatique périodique
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, CACHE_CONFIG.CLEANUP_INTERVAL);
  }

  private async cleanupExpired(): Promise<void> {
    const now = Date.now();
    const expired: string[] = [];

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expired.push(key);
      }
    }

    for (const key of expired) {
      await this.delete(key);
    }

    if (expired.length > 0) {
      console.log(`🧹 Nettoyé ${expired.length} entrées expirées`);
    }
  }

  private async cleanupIfNeeded(): Promise<void> {
    // Nettoyer si la mémoire dépasse la limite
    if (this.stats.memorySize > CACHE_CONFIG.MAX_MEMORY_SIZE) {
      await this.cleanupLeastRecentlyUsed();
    }
  }

  private async cleanupLeastRecentlyUsed(): Promise<void> {
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.lastAccess - b.lastAccess);

    const toRemove = Math.ceil(entries.length * 0.2); // Supprimer 20%
    
    for (let i = 0; i < toRemove; i++) {
      const [key] = entries[i];
      await this.delete(key);
    }

    console.log(`🧹 Nettoyé ${toRemove} entrées LRU`);
  }

  private async loadStorageStats(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.STORAGE_KEY_PREFIX));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }
      
      this.stats.storageSize = totalSize;
    } catch (error) {
      console.warn('⚠️ Erreur calcul taille stockage:', error);
    }
  }

  /**
   * 🔧 Utilitaires
   */
  async prefetch(keys: string[], fetcher: (key: string) => Promise<any>): Promise<void> {
    const promises = keys.map(async (key) => {
      const cached = await this.get(key);
      if (!cached) {
        const data = await fetcher(key);
        await this.set(key, data, { priority: 'low' });
      }
    });

    await Promise.allSettled(promises);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.memoryCache.clear();
  }
}

// Export singleton
export default CacheService.getInstance();
export { CacheService };

/**
 * 🌐 SERVICE API TALKKIN - GESTION CENTRALISÉE
 * 
 * Fonctionnalités :
 * - Gestion centralisée des appels API
 * - Cache intelligent
 * - Retry automatique
 * - Gestion des erreurs
 * - Support offline
 * - Métriques de performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  cached?: boolean;
  timestamp?: number;
}

interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  voice?: string;
}

interface TranslationResponse {
  translatedText: string;
  audioUrl?: string;
  confidence: number;
  alternatives?: string[];
}

interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  force?: boolean; // Forcer le rafraîchissement
}

// Configuration
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.talkkin.app',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes par défaut
};

class ApiService {
  private static instance: ApiService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private requestQueue: Map<string, Promise<any>> = new Map();

  private constructor() {
    this.loadCacheFromStorage();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * 🔄 Requête HTTP générique avec retry et cache
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheOptions: CacheOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`;
    
    // Vérifier le cache
    if (!cacheOptions.force) {
      const cached = this.getFromCache<T>(cacheKey, cacheOptions.ttl);
      if (cached) {
        return { success: true, data: cached, cached: true };
      }
    }

    // Éviter les requêtes dupliquées
    if (this.requestQueue.has(cacheKey)) {
      const data = await this.requestQueue.get(cacheKey);
      return { success: true, data, cached: false };
    }

    const requestPromise = this.executeRequest<T>(url, options);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // Mettre en cache le résultat
      this.setCache(cacheKey, data, cacheOptions.ttl || API_CONFIG.CACHE_TTL);
      
      return { success: true, data, cached: false, timestamp: Date.now() };
    } catch (error) {
      console.error('❌ Erreur API:', error);
      return { 
        success: false, 
        data: null as T, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * 🚀 Exécution de la requête avec retry
   */
  private async executeRequest<T>(url: string, options: RequestInit, attempt = 1): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        console.warn(`⚠️ Tentative ${attempt} échouée, retry dans ${API_CONFIG.RETRY_DELAY}ms`);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
        return this.executeRequest<T>(url, options, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * 🗣️ Traduction vocale
   */
  async translateText(request: TranslationRequest): Promise<ApiResponse<TranslationResponse>> {
    console.log('🌐 Traduction:', request);
    
    // Simulation pour le développement
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: TranslationResponse = {
        translatedText: `[Traduit] ${request.text}`,
        confidence: 0.95,
        alternatives: [`[Alt1] ${request.text}`, `[Alt2] ${request.text}`],
        audioUrl: 'https://example.com/audio.mp3',
      };
      
      return { success: true, data: mockResponse };
    }

    return this.request<TranslationResponse>('/translate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * 🎙️ Obtenir les voix disponibles
   */
  async getAvailableVoices(languageCode: string): Promise<ApiResponse<any[]>> {
    // Simulation pour le développement
    if (__DEV__) {
      const mockVoices = [
        { id: 'voice1', name: 'Maria (Maya)', gender: 'female', quality: 'premium' },
        { id: 'voice2', name: 'Carlos (Maya)', gender: 'male', quality: 'standard' },
        { id: 'voice3', name: 'Ana (Maya)', gender: 'female', quality: 'premium' },
      ];
      
      return { success: true, data: mockVoices };
    }

    return this.request<any[]>(`/voices/${languageCode}`, {}, { ttl: 24 * 60 * 60 * 1000 }); // Cache 24h
  }

  /**
   * 📚 Obtenir les langues supportées
   */
  async getSupportedLanguages(): Promise<ApiResponse<any[]>> {
    // Simulation pour le développement
    if (__DEV__) {
      const mockLanguages = [
        { code: 'maya', name: 'Maya (K\'iche\')', flag: '🏛️', speakers: '6M', status: 'stable' },
        { code: 'quechua', name: 'Quechua', flag: '🏔️', speakers: '8M', status: 'stable' },
        { code: 'guarani', name: 'Guaraní', flag: '🌿', speakers: '5M', status: 'beta' },
        { code: 'nahuatl', name: 'Nahuatl', flag: '🌋', speakers: '2M', status: 'alpha' },
      ];
      
      return { success: true, data: mockLanguages };
    }

    return this.request<any[]>('/languages', {}, { ttl: 24 * 60 * 60 * 1000 }); // Cache 24h
  }

  /**
   * 💾 Gestion du cache
   */
  private getFromCache<T>(key: string, ttl?: number): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > (ttl || cached.ttl);
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Sauvegarder périodiquement dans AsyncStorage
    this.saveCacheToStorage();
  }

  /**
   * 🗄️ Persistence du cache
   */
  private async loadCacheFromStorage(): Promise<void> {
    try {
      const cached = await AsyncStorage.getItem('api_cache');
      if (cached) {
        const data = JSON.parse(cached);
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          this.cache.set(key, value);
        });
      }
    } catch (error) {
      console.warn('⚠️ Erreur chargement cache:', error);
    }
  }

  private async saveCacheToStorage(): Promise<void> {
    try {
      const data = Object.fromEntries(this.cache.entries());
      await AsyncStorage.setItem('api_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde cache:', error);
    }
  }

  /**
   * 🧹 Nettoyage du cache
   */
  clearCache(): void {
    this.cache.clear();
    AsyncStorage.removeItem('api_cache');
  }

  /**
   * 📊 Métriques du cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton
export default ApiService.getInstance();
export { ApiService };

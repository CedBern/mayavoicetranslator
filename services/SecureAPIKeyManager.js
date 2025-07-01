// Gestionnaire sécurisé des clés API avec chiffrement et rotation
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Gestionnaire sécurisé des clés API pour Maya Voice Translator
 * Supporte le chiffrement, la rotation et la validation des clés
 */
class SecureAPIKeyManager {
  constructor() {
    this.keys = new Map();
    this.encryptedStorage = './config/api_keys.enc';
    this.keyRotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 jours
    this.encryptionKey = null;
    this.isInitialized = false;
    
    // Configuration des services API supportés
    this.apiServices = {
      'openai': {
        name: 'OpenAI GPT API',
        baseUrl: 'https://api.openai.com/v1',
        keyFormat: /^sk-[A-Za-z0-9]{48}$/,
        testEndpoint: '/models',
        rateLimit: { requests: 1000, period: 60000 }, // 1000 req/min
        tier: 'premium'
      },
      'google_translate': {
        name: 'Google Cloud Translation API',
        baseUrl: 'https://translation.googleapis.com/language/translate/v2',
        keyFormat: /^AIza[0-9A-Za-z-_]{35}$/,
        testEndpoint: '/languages',
        rateLimit: { requests: 100, period: 60000 },
        tier: 'premium'
      },
      'azure_cognitive': {
        name: 'Azure Cognitive Services',
        baseUrl: 'https://api.cognitive.microsofttranslator.com',
        keyFormat: /^[0-9a-f]{32}$/,
        testEndpoint: '/languages',
        rateLimit: { requests: 2000, period: 60000 },
        tier: 'premium'
      },
      'systran': {
        name: 'SYSTRAN Translation API',
        baseUrl: 'https://api-platform.systran.net/translation',
        keyFormat: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        testEndpoint: '/supportedLanguages',
        rateLimit: { requests: 500, period: 60000 },
        tier: 'specialized'
      },
      'glosbe': {
        name: 'Glosbe Dictionary API',
        baseUrl: 'https://glosbe.com/gapi',
        keyFormat: /^[A-Za-z0-9]{40}$/,
        testEndpoint: '/translate',
        rateLimit: { requests: 1000, period: 3600000 }, // 1000 req/hour
        tier: 'free'
      },
      'panlex': {
        name: 'PanLex Translation API',
        baseUrl: 'https://api.panlex.org',
        keyFormat: /^[A-Za-z0-9]{32}$/,
        testEndpoint: '/v2/lv',
        rateLimit: { requests: 100, period: 60000 },
        tier: 'specialized'
      },
      'apertium': {
        name: 'Apertium Translation API',
        baseUrl: 'https://apertium.org/apy',
        keyFormat: null, // Service gratuit sans clé
        testEndpoint: '/listPairs',
        rateLimit: { requests: 120, period: 60000 },
        tier: 'free'
      },
      'tatoeba': {
        name: 'Tatoeba Corpus API',
        baseUrl: 'https://tatoeba.org/api_v0',
        keyFormat: /^[A-Za-z0-9]{20}$/,
        testEndpoint: '/search',
        rateLimit: { requests: 60, period: 60000 },
        tier: 'corpus'
      },
      'wiktionary': {
        name: 'Wiktionary API',
        baseUrl: 'https://en.wiktionary.org/api/rest_v1',
        keyFormat: null, // Service public sans clé
        testEndpoint: '/page',
        rateLimit: { requests: 200, period: 60000 },
        tier: 'free'
      },
      'google_tts': {
        name: 'Google Cloud Text-to-Speech',
        baseUrl: 'https://texttospeech.googleapis.com/v1',
        keyFormat: /^AIza[0-9A-Za-z-_]{35}$/,
        testEndpoint: '/voices',
        rateLimit: { requests: 1000, period: 60000 },
        tier: 'premium'
      },
      'azure_speech': {
        name: 'Azure Speech Services',
        baseUrl: 'https://eastus.tts.speech.microsoft.com',
        keyFormat: /^[0-9a-f]{32}$/,
        testEndpoint: '/voices/list',
        rateLimit: { requests: 200, period: 60000 },
        tier: 'premium'
      },      'ethnologue': {
        name: 'Ethnologue API',
        baseUrl: 'https://api.ethnologue.com',
        keyFormat: /^[A-Za-z0-9]{24}$/,
        testEndpoint: '/languages',
        rateLimit: { requests: 50, period: 60000 },
        tier: 'specialized'
      },
      'test': {
        name: 'Test Service',
        baseUrl: 'https://test.example.com',
        keyFormat: /^test-.+$/,
        testEndpoint: '/status',
        rateLimit: { requests: 100, period: 60000 },
        tier: 'test'
      }
    };

    // Compteurs d'utilisation pour rate limiting
    this.usageCounters = new Map();
    this.lastReset = new Map();
  }

  /**
   * Initialise le gestionnaire de clés API
   */
  async initialize(masterPassword = null) {
    console.log('🔐 Initialisation du gestionnaire de clés API sécurisé...');
    
    try {
      // Générer ou charger la clé de chiffrement
      this.encryptionKey = await this.deriveEncryptionKey(masterPassword);
      
      // Charger les clés existantes
      await this.loadEncryptedKeys();
      
      // Valider les clés chargées
      await this.validateStoredKeys();
      
      this.isInitialized = true;
      console.log('✅ Gestionnaire de clés API initialisé');
      console.log(`🔑 Clés chargées: ${this.keys.size}`);
      
    } catch (error) {
      console.warn('⚠️ Erreur d\'initialisation gestionnaire API:', error.message);
      console.log('📝 Utilisation du mode dégradé sans clés');
    }
  }

  /**
   * Ajoute ou met à jour une clé API avec validation
   */
  async setAPIKey(service, apiKey, options = {}) {
    if (!this.apiServices[service]) {
      throw new Error(`Service API non supporté: ${service}`);
    }

    const serviceConfig = this.apiServices[service];
      // Validation du format de clé
    if (serviceConfig.keyFormat && !serviceConfig.keyFormat.test(apiKey) && !options.skipValidation) {
      console.warn(`⚠️ Format de clé non standard pour ${service}, mais accepté avec skipValidation`);
    }

    // Test de validité de la clé
    const isValid = await this.testAPIKey(service, apiKey);
    if (!isValid && !options.skipValidation) {
      throw new Error(`Clé API invalide pour ${service}`);
    }

    // Stocker la clé avec métadonnées
    this.keys.set(service, {
      key: apiKey,
      service: service,
      addedAt: Date.now(),
      lastUsed: null,
      usageCount: 0,
      isValid: isValid,
      tier: serviceConfig.tier,
      lastValidated: Date.now(),
      options: options
    });

    // Sauvegarder de manière chiffrée
    await this.saveEncryptedKeys();
    
    console.log(`🔑 Clé API ajoutée pour ${serviceConfig.name}`);
    return true;
  }

  /**
   * Récupère une clé API valide
   */
  async getAPIKey(service) {
    if (!this.keys.has(service)) {
      return null;
    }

    const keyData = this.keys.get(service);
    
    // Vérifier les limites de taux
    if (!this.checkRateLimit(service)) {
      throw new Error(`Limite de taux atteinte pour ${service}`);
    }

    // Mettre à jour les statistiques d'utilisation
    keyData.lastUsed = Date.now();
    keyData.usageCount++;
    
    // Incrémenter le compteur de taux
    this.incrementUsageCounter(service);

    return keyData.key;
  }

  /**
   * Teste la validité d'une clé API
   */
  async testAPIKey(service, apiKey) {
    const serviceConfig = this.apiServices[service];
    if (!serviceConfig.testEndpoint) {
      return true; // Pas de test possible
    }

    try {
      const response = await fetch(
        `${serviceConfig.baseUrl}${serviceConfig.testEndpoint}`,
        {
          headers: this.buildAuthHeaders(service, apiKey),
          timeout: 10000
        }
      );

      return response.status < 400;
      
    } catch (error) {
      console.warn(`⚠️ Test de clé échoué pour ${service}:`, error.message);
      return false;
    }
  }

  /**
   * Construit les en-têtes d'authentification selon le service
   */
  buildAuthHeaders(service, apiKey) {
    const headers = { 'Content-Type': 'application/json' };

    switch (service) {
      case 'openai':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'google_translate':
      case 'google_tts':
        headers['X-API-Key'] = apiKey;
        break;
      case 'azure_cognitive':
      case 'azure_speech':
        headers['Ocp-Apim-Subscription-Key'] = apiKey;
        break;
      case 'systran':
        headers['Authorization'] = `Key ${apiKey}`;
        break;
      case 'glosbe':
      case 'panlex':
      case 'tatoeba':
      case 'ethnologue':
        headers['X-API-Key'] = apiKey;
        break;
      default:
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return headers;
  }

  /**
   * Vérifie les limites de taux d'utilisation
   */
  checkRateLimit(service) {
    const serviceConfig = this.apiServices[service];
    if (!serviceConfig.rateLimit) return true;

    const now = Date.now();
    const lastReset = this.lastReset.get(service) || 0;
    const period = serviceConfig.rateLimit.period;

    // Réinitialiser le compteur si la période est écoulée
    if (now - lastReset > period) {
      this.usageCounters.set(service, 0);
      this.lastReset.set(service, now);
      return true;
    }

    const currentCount = this.usageCounters.get(service) || 0;
    return currentCount < serviceConfig.rateLimit.requests;
  }

  /**
   * Incrémente le compteur d'utilisation
   */
  incrementUsageCounter(service) {
    const current = this.usageCounters.get(service) || 0;
    this.usageCounters.set(service, current + 1);
  }

  /**
   * Chiffrement et déchiffrement des clés
   */
  async deriveEncryptionKey(password) {
    if (!password) {
      // Générer une clé basée sur l'environnement système
      const systemInfo = process.platform + process.arch + (process.env.USERNAME || 'default');
      password = crypto.createHash('sha256').update(systemInfo).digest('hex');
    }

    // Dériver une clé de chiffrement robuste
    const salt = 'maya_voice_translator_salt_2024';
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
  }

  /**
   * Chiffre les données sensibles
   */
  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }

  /**
   * Déchiffre les données
   */
  decrypt(encryptedData) {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Échec du déchiffrement des clés API');
    }
  }

  /**
   * Sauvegarde chiffrée des clés
   */
  async saveEncryptedKeys() {
    try {
      const keyData = {};
      for (const [service, data] of this.keys) {
        keyData[service] = data;
      }

      const encrypted = this.encrypt(keyData);
      await fs.mkdir(path.dirname(this.encryptedStorage), { recursive: true });
      await fs.writeFile(this.encryptedStorage, JSON.stringify(encrypted));
      
    } catch (error) {
      console.error('❌ Erreur de sauvegarde des clés:', error.message);
    }
  }

  /**
   * Chargement des clés chiffrées
   */
  async loadEncryptedKeys() {
    try {
      const encryptedData = await fs.readFile(this.encryptedStorage, 'utf8');
      const keyData = this.decrypt(JSON.parse(encryptedData));
      
      for (const [service, data] of Object.entries(keyData)) {
        this.keys.set(service, data);
      }
      
    } catch (error) {
      console.log('📝 Aucune clé sauvegardée trouvée, initialisation vide');
    }
  }

  /**
   * Valide toutes les clés stockées
   */
  async validateStoredKeys() {
    const validationPromises = [];
    
    for (const [service, keyData] of this.keys) {
      // Re-valider les clés anciennes (> 7 jours)
      if (Date.now() - keyData.lastValidated > 7 * 24 * 60 * 60 * 1000) {
        validationPromises.push(
          this.testAPIKey(service, keyData.key).then(isValid => {
            keyData.isValid = isValid;
            keyData.lastValidated = Date.now();
          })
        );
      }
    }

    await Promise.all(validationPromises);
    console.log(`✅ Validation terminée pour ${validationPromises.length} clés`);
  }

  /**
   * Rotation automatique des clés (si supportée par l'API)
   */
  async rotateKey(service) {
    // Cette fonctionnalité dépend du support de rotation par l'API
    console.log(`🔄 Rotation de clé demandée pour ${service}`);
    // Implementation spécifique selon l'API
  }

  /**
   * Liste des services API supportés
   */
  getSupportedServices() {
    return Object.entries(this.apiServices).map(([key, config]) => ({
      service: key,
      name: config.name,
      tier: config.tier,
      hasKey: this.keys.has(key),
      isValid: this.keys.has(key) ? this.keys.get(key).isValid : false,
      rateLimit: config.rateLimit
    }));
  }

  /**
   * Statistiques d'utilisation
   */
  getUsageStats() {
    const stats = {};
    
    for (const [service, keyData] of this.keys) {
      const currentUsage = this.usageCounters.get(service) || 0;
      const limit = this.apiServices[service].rateLimit?.requests || 'Illimité';
      
      stats[service] = {
        totalUsage: keyData.usageCount,
        currentPeriodUsage: currentUsage,
        limit: limit,
        lastUsed: keyData.lastUsed,
        addedAt: keyData.addedAt,
        isValid: keyData.isValid
      };
    }
    
    return stats;
  }

  /**
   * Supprime une clé API
   */
  async removeAPIKey(service) {
    if (this.keys.delete(service)) {
      await this.saveEncryptedKeys();
      console.log(`🗑️ Clé supprimée pour ${service}`);
      return true;
    }
    return false;
  }

  /**
   * Exporte la configuration (sans les clés)
   */
  exportConfiguration() {
    const config = {
      services: this.getSupportedServices(),
      usage: this.getUsageStats(),
      exportedAt: Date.now()
    };
    
    return JSON.stringify(config, null, 2);
  }
}

export default SecureAPIKeyManager;

/**
 * 🌍 GESTIONNAIRE DES VARIANTES RÉGIONALES
 * Service pour la détection, gestion et optimisation des variantes linguistiques régionales
 */

import { 
  getVariantDictionary, 
  getCrossVariantTranslation,
  getSupportedVariants,
  isVariantSupported,
  getLanguageVariants,
  getBaseLanguage
} from '../data/regional-variant-dictionaries.js';

export class RegionalVariantManager {
  constructor() {
    this.variantCache = new Map();
    this.supportedVariants = getSupportedVariants();
    this.fallbackChains = this.buildFallbackChains();
  }

  /**
   * Détecte automatiquement la variante régionale appropriée
   */
  detectRegionalVariant(language, context = {}) {
    const cacheKey = `${language}-${JSON.stringify(context)}`;
    
    if (this.variantCache.has(cacheKey)) {
      return this.variantCache.get(cacheKey);
    }

    let detectedVariant = language;

    // 1. Détection par contexte utilisateur
    if (context.userRegion || context.userCountry) {
      const regionVariant = this.detectByRegion(language, context.userRegion || context.userCountry);
      if (regionVariant) {
        detectedVariant = regionVariant;
      }
    }

    // 2. Détection par préférences linguistiques navigateur
    if (context.acceptLanguage) {
      const langVariant = this.detectByAcceptLanguage(language, context.acceptLanguage);
      if (langVariant) {
        detectedVariant = langVariant;
      }
    }

    // 3. Fallback aux variantes par défaut
    if (!isVariantSupported(detectedVariant)) {
      detectedVariant = this.getDefaultVariant(language);
    }

    const result = {
      original: language,
      detected: detectedVariant,
      confidence: detectedVariant === language ? 0.5 : 0.8,
      method: 'regional_detection'
    };

    this.variantCache.set(cacheKey, result);
    return result;
  }

  /**
   * Obtient la variante par défaut pour une langue
   */
  getDefaultVariant(language) {
    const defaults = {
      'en': 'en-US',
      'fr': 'fr-FR', 
      'es': 'es-ES',
      'pt': 'pt-PT',
      'ar': 'ar-SA',
      'de': 'de-DE'
    };
    return defaults[language] || language;
  }

  /**
   * Détection par Accept-Language header
   */
  detectByAcceptLanguage(language, acceptLanguage) {
    // Parse Accept-Language header
    const languages = acceptLanguage.split(',').map(lang => {
      const [code, q] = lang.trim().split(';q=');
      return { code: code.trim(), quality: q ? parseFloat(q) : 1.0 };
    }).sort((a, b) => b.quality - a.quality);

    // Cherche variante exacte
    for (const langPref of languages) {
      if (langPref.code.startsWith(language + '-')) {
        const variant = langPref.code.toLowerCase();
        if (isVariantSupported(variant)) {
          return variant;
        }
      }
    }

    return null;
  }

  /**
   * Détection par région/pays
   */
  detectByRegion(language, region) {
    const regionUpper = region.toUpperCase();
    
    // Règles spéciales par langue
    const specialRules = {
      'pt': {
        'BR': 'pt-BR', 'PT': 'pt-PT', 'AO': 'pt-AO', 'MZ': 'pt-MZ'
      },
      'fr': {
        'CA': 'fr-CA', 'FR': 'fr-FR', 'BE': 'fr-BE', 'CH': 'fr-CH'
      },
      'es': {
        'MX': 'es-MX', 'ES': 'es-ES', 'AR': 'es-AR', 'CO': 'es-CO'
      },
      'en': {
        'US': 'en-US', 'GB': 'en-GB', 'CA': 'en-CA', 'AU': 'en-AU'
      },
      'ar': {
        'SA': 'ar-SA', 'EG': 'ar-EG', 'MA': 'ar-MA', 'LV': 'ar-LV'
      },
      'zh': {
        'CN': 'zh-CN', 'TW': 'zh-TW', 'HK': 'zh-HK', 'SG': 'zh-SG'
      }
    };

    if (specialRules[language] && specialRules[language][regionUpper]) {
      return specialRules[language][regionUpper];
    }

    return null;
  }

  /**
   * Construit les chaînes de fallback pour les variantes
   */
  buildFallbackChains() {
    const chains = {};
    
    // Chaînes de fallback par langue
    chains['pt-BR'] = ['pt-BR', 'pt-PT', 'pt'];
    chains['pt-PT'] = ['pt-PT', 'pt-BR', 'pt'];
    chains['fr-CA'] = ['fr-CA', 'fr-FR', 'fr'];
    chains['fr-FR'] = ['fr-FR', 'fr-CA', 'fr'];
    chains['es-MX'] = ['es-MX', 'es-ES', 'es'];
    chains['es-ES'] = ['es-ES', 'es-MX', 'es'];
    chains['en-US'] = ['en-US', 'en-GB', 'en'];
    chains['en-GB'] = ['en-GB', 'en-US', 'en'];
    chains['ar-SA'] = ['ar-SA', 'ar-EG', 'ar'];
    chains['ar-EG'] = ['ar-EG', 'ar-SA', 'ar'];

    return chains;
  }

  /**
   * Obtient la chaîne de fallback pour une variante
   */
  getFallbackChain(variant) {
    const baseLanguage = variant.split('-')[0];
    
    if (this.fallbackChains[variant]) {
      return this.fallbackChains[variant];
    }
    
    // Fallback générique : variante → langue de base
    return [variant, baseLanguage];
  }

  /**
   * Normalise une variante (gestion des alias)
   */
  normalizeVariant(variant) {
    const aliases = {
      // Aliases communs
      'pt-br': 'pt-BR',
      'pt-pt': 'pt-PT',
      'fr-ca': 'fr-CA',
      'fr-fr': 'fr-FR',
      'es-mx': 'es-MX',
      'es-es': 'es-ES',
      'en-us': 'en-US',
      'en-gb': 'en-GB',
      'zh-cn': 'zh-CN',
      'zh-tw': 'zh-TW'
    };

    return aliases[variant.toLowerCase()] || variant;
  }

  /**
   * Statistiques d'utilisation des variantes
   */
  getVariantStats() {
    const stats = {
      total_detections: this.variantCache.size,
      supported_variants: this.supportedVariants.length,
      cache_efficiency: this.variantCache.size > 0 ? 
        (this.variantCache.size / (this.variantCache.size + 100)) * 100 : 0
    };
    
    console.log('📊 Statistiques variantes régionales:', stats);
    return stats;
  }
}

// Instance singleton
export const regionalVariantManager = new RegionalVariantManager();

// Export par défaut aussi
export default regionalVariantManager;

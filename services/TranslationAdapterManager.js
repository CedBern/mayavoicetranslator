// --- TranslationAdapterManager ---
// Sélection dynamique, adaptative et économique de l'adaptateur de traduction
// Priorité : open source/gratuit (Apertium, Tatoeba, PanLex) > payant (DeepL, Google) uniquement si nécessaire
// Politique de coût :
//   - Par défaut, n'utilise JAMAIS les services payants sauf si explicitement demandé (premium ou quota dépassé)
//   - Journalisation stricte de tout appel payant
//   - Adaptatif : possibilité d'étendre la logique selon le profil utilisateur

// Sélection dynamique de l'adaptateur de traduction
import { ApertiumAdapter } from '../adapters/ApertiumAdapter.js';
import { DeepLAdapter } from '../adapters/DeepLAdapter.js';
import { GoogleTranslateAdapter } from '../adapters/GoogleTranslateAdapter.js';
import { PanLexAdapter } from '../adapters/PanLexAdapter.js';
import { TatoebaAdapter } from '../adapters/TatoebaAdapter.js';

export class TranslationAdapterManager {
    constructor(config) {
        this.config = config;
        this.adapters = [];
        this.costPolicy = config.costPolicy || 'min';
        this.allowPaid = config.allowPaid || false; // Ajout : contrôle explicite
        // Adaptateurs gratuits d'abord
        this.adapters.push({ name: 'Apertium', type: 'free', instance: new ApertiumAdapter() });
        this.adapters.push({ name: 'Tatoeba', type: 'free', instance: new TatoebaAdapter() });
        this.adapters.push({ name: 'PanLex', type: 'free', instance: new PanLexAdapter() });
        // Payants ensuite
        if (config.deeplApiKey) this.adapters.push({ name: 'DeepL', type: 'paid', instance: new DeepLAdapter(config.deeplApiKey) });
        if (config.googleApiKey) this.adapters.push({ name: 'Google', type: 'paid', instance: new GoogleTranslateAdapter(config.googleApiKey) });
    }

    async translate(text, fromLang, toLang, options = {}) {
        // 1. Privilégier le local/gratuit
        for (const adapter of this.adapters) {
            if ((this.costPolicy === 'min' || !this.allowPaid) && adapter.type === 'paid') continue;
            try {
                const result = await adapter.instance.translate(text, fromLang, toLang);
                // Journalisation si payant
                if (adapter.type === 'paid') {
                    this.logPaidUsage(adapter.name, text, fromLang, toLang);
                }
                return result;
            } catch (e) {
                console.warn(`[AdapterManager] Fallback (${adapter.name}): ${e.message}`);
            }
        }
        // Si costPolicy = 'min', tenter le payant en dernier recours UNIQUEMENT si autorisé
        if ((this.costPolicy === 'min' || !this.allowPaid) === false) {
            for (const adapter of this.adapters) {
                if (adapter.type !== 'paid') continue;
                try {
                    this.logPaidUsage(adapter.name, text, fromLang, toLang);
                    return await adapter.instance.translate(text, fromLang, toLang);
                } catch (e) {
                    console.warn(`[AdapterManager] Fallback (${adapter.name}): ${e.message}`);
                }
            }
        }
        throw new Error('Aucune API de traduction disponible ou toutes ont échoué.');
    }

    logPaidUsage(adapterName, text, fromLang, toLang) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            adapter: adapterName,
            fromLang,
            toLang,
            text: text.substring(0, 100)
        };
        const fs = require('fs');
        fs.appendFile('paid_translation_usage.log', JSON.stringify(logEntry) + '\n', err => {});
    }
}
// --- Fin TranslationAdapterManager ---

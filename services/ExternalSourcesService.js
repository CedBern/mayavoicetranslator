// ExternalSourcesService.js
// Centralise l'accès aux sources libres et APIs gratuites de traduction/suggestions
// Facilement extensible pour ajouter de nouveaux connecteurs

import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Appelle l'API MyMemory Translation (gratuite, 1000 requêtes/jour)
 * @param {string} query - Texte à traduire
 * @param {string} sourceLang - Langue source (ex: 'fr')
 * @param {string} targetLang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchMyMemory(query, sourceLang, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLang}|${targetLang}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.matches) {
      return data.matches.map(m => ({
        text: m.translation,
        relevanceScore: m.match || 0.7,
        source: 'MyMemory'
      }));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Appelle l'API Wiktionary (données libres via MediaWiki API)
 * @param {string} query - Mot à chercher
 * @param {string} lang - Langue (ex: 'fr')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchWiktionary(query, lang) {
  const url = `https://${lang}.wiktionary.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(query)}&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
    return pages.map(p => ({
      text: p.extract ? p.extract.replace(/<[^>]+>/g, '').trim() : '',
      relevanceScore: 0.5,
      source: 'Wiktionary'
    })).filter(e => e.text);
  } catch {
    return [];
  }
}

/**
 * Appelle l'API LibreTranslate (API open source, gratuite)
 * @param {string} query - Texte à traduire
 * @param {string} sourceLang - Langue source (ex: 'fr')
 * @param {string} targetLang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchLibreTranslate(query, sourceLang, targetLang) {
  const url = 'https://libretranslate.de/translate';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, source: sourceLang, target: targetLang, format: 'text' })
    });
    const data = await res.json();
    if (data && data.translatedText) {
      return [{
        text: data.translatedText,
        relevanceScore: 0.8,
        source: 'LibreTranslate'
      }];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Scraping simple de Linguee (toléré pour usage éducatif, attention au volume)
 * @param {string} query - Mot ou expression à traduire
 * @param {string} sourceLang - Langue source (ex: 'fr')
 * @param {string} targetLang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchLinguee(query, sourceLang, targetLang) {
  const url = `https://www.linguee.com/${sourceLang}-${targetLang}/search?source=auto&query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    // Extraction simple des traductions principales (pattern HTML)
    const matches = [...html.matchAll(/<a[^>]*class="dictLink"[^>]*>(.*?)<\/a>/g)];
    const suggestions = matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    // On limite à 5 suggestions pour éviter les doublons
    return suggestions.slice(0, 5).map(text => ({ text, relevanceScore: 0.6, source: 'Linguee' }));
  } catch {
    return [];
  }
}

/**
 * Exemple de récupération de traductions depuis OPUS (corpus parallèles, accès via API public Y) 
 * Ici, on utilise l'API OPUS-MT demo (Helsinki-NLP) pour la traduction automatique
 * @param {string} query - Texte à traduire
 * @param {string} sourceLang - Langue source (ex: 'fr')
 * @param {string} targetLang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchOpusMT(query, sourceLang, targetLang) {
  // API demo Helsinki-NLP (attention: usage limité, pour démo/éducation)
  const url = `https://opusmt-demo.universityofhelsinki.fi/translate?source_lang=${sourceLang}&target_lang=${targetLang}&text=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.translation) {
      return [{
        text: data.translation,
        relevanceScore: 0.7,
        source: 'OPUS-MT'
      }];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Exemple d'extraction de sous-titres multilingues depuis OpenSubtitles (API publique, nécessite clé gratuite)
 * @param {string} query - Mot ou phrase à chercher
 * @param {string} lang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchOpenSubtitles(query, lang) {
  // Pour la démo, on utilise l'API v1 (https://opensubtitles.stoplight.io/docs/opensubtitles-api/)
  // Remplacer 'YOUR_API_KEY' par une clé gratuite obtenue sur le site
  const apiKey = process.env.OPENSUBTITLES_API_KEY || 'YOUR_API_KEY';
  const url = `https://api.opensubtitles.com/api/v1/subtitles?query=${encodeURIComponent(query)}&languages=${lang}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'MayaVoiceTranslator/1.0'
      }
    });
    const data = await res.json();
    if (data && Array.isArray(data.data)) {
      // On extrait les lignes de sous-titres trouvées (extrait limité à 5)
      return data.data.slice(0, 5).map(s => ({
        text: s.attributes?.feature_details?.title || s.attributes?.files?.[0]?.file_name || '',
        relevanceScore: 0.5,
        source: 'OpenSubtitles'
      })).filter(e => e.text);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Exemple d'appel à l'API Apertium (traduction automatique open source)
 * @param {string} query - Texte à traduire
 * @param {string} sourceLang - Langue source (ex: 'fr')
 * @param {string} targetLang - Langue cible (ex: 'en')
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchApertium(query, sourceLang, targetLang) {
  // API publique Apertium (https://www.apertium.org/apy/)
  const url = `https://apertium.org/apy/translate?q=${encodeURIComponent(query)}&langpair=${sourceLang}|${targetLang}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return [{
        text: data.responseData.translatedText,
        relevanceScore: 0.7,
        source: 'Apertium'
      }];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Point d'extension pour le corpus local (à brancher dès qu'il est prêt)
 * @param {string} query
 * @param {string} sourceLang
 * @param {string} targetLang
 * @returns {Promise<Array<{text: string, relevanceScore: number, source: string}>>}
 */
async function fetchLocalCorpusSuggestions(query, sourceLang, targetLang) {
  const path = await import('path');
  const fsPromises = (await import('fs')).promises;
  const fs = await import('fs');
  let results = [];
  // Log file for debug
  const debugLogPath = path.resolve(__dirname, '../logs_fetchLocalCorpusSuggestions.txt');
  function logDebug(msg) {
    fs.appendFileSync(debugLogPath, `[${new Date().toISOString()}] ${msg}\n`);
  }
  logDebug(`fetchLocalCorpusSuggestions: query='${query}', sourceLang='${sourceLang}', targetLang='${targetLang}'`);

  // Normalisation de la requête (ponctuation, espaces, casse)
  function normalizeText(str) {
    return str
      .toLowerCase()
      .replace(/[’'`´‘’‛“”"\-]/g, " ") // guillemets, tirets, apostrophes diverses
      .replace(/[.,!?;:¿¡…]/g, "") // ponctuation
      .replace(/\s+/g, " ") // espaces multiples
      .trim();
  }
  const normalizedQuery = normalizeText(query);

  // Recherche dans les corpus locaux OpenSubtitles2016 téléchargés (format tabulé)
  try {
    const dataDir = path.resolve(__dirname, '../data/OpenSubtitles2016/');
    const files = await fsPromises.readdir(dataDir);
    logDebug(`Fichiers OpenSubtitles2016 trouvés: ${files.join(', ')}`);
    for (const file of files) {
      if (file.endsWith(`-${sourceLang}-${targetLang}.txt`)) {
        logDebug(`Lecture fichier: ${file}`);
        const filePath = path.join(dataDir, file);
        const lines = (await fsPromises.readFile(filePath, 'utf8')).split('\n');
        for (const line of lines) {
          const [src, tgt] = line.split('\t');
          if (src && normalizeText(src).includes(normalizedQuery)) {
            results.push({
              text: src,
              translation: tgt,
              relevanceScore: 0.8,
              source: 'OpenSubtitles2016-local'
            });
          }
        }
      }
    }
  } catch (e) {
    logDebug('Erreur lecture OpenSubtitles2016: ' + e.message);
  }

  // Recherche dans les corpus OPUS prioritaires (JW300, Tatoeba, Bible-uedin)
  try {
    const opusDir = path.resolve(__dirname, '../data/OPUS/');
    const opusFiles = await fsPromises.readdir(opusDir);
    logDebug(`Fichiers OPUS trouvés: ${opusFiles.join(', ')}`);
    for (const file of opusFiles) {
      if (file.endsWith(`-${sourceLang}-${targetLang}.txt`)) {
        logDebug(`Lecture fichier OPUS: ${file}`);
        const filePath = path.join(opusDir, file);
        const content = await fsPromises.readFile(filePath, 'utf8');
        if (file.startsWith('Tatoeba')) {
          // Parsing robuste du format OPUS Tatoeba
          const blocks = content.split('================================');
          logDebug(`Tatoeba: ${blocks.length} blocs trouvés dans ${file}`);
          let pairsExtracted = 0;
          for (const block of blocks) {
            const srcMatches = [...block.matchAll(/\(src\)="[^"]*">([^\n]+)/g)];
            const tgtMatches = [...block.matchAll(/\(trg\)="[^"]*">([^\n]+)/g)];
            if (srcMatches.length && tgtMatches.length) {
              for (let i = 0; i < Math.min(srcMatches.length, tgtMatches.length); i++) {
                const src = srcMatches[i][1].trim();
                const tgt = tgtMatches[i][1].trim();
                pairsExtracted++;
                if (src && normalizeText(src).includes(normalizedQuery)) {
                  results.push({
                    text: src,
                    translation: tgt,
                    relevanceScore: 0.8,
                    source: 'Tatoeba-local'
                  });
                }
              }
            }
          }
          logDebug(`Tatoeba: ${pairsExtracted} paires extraites pour ${file}`);
          if (results.length > 0) {
            logDebug(`Exemple suggestion Tatoeba: ${JSON.stringify(results[0])}`);
          }
        } else {
          // Format tabulé classique (JW300, autres)
          const lines = content.split('\n');
          for (const line of lines) {
            const [src, tgt] = line.split('\t');
            if (src && normalizeText(src).includes(normalizedQuery)) {
              results.push({
                text: src,
                translation: tgt,
                relevanceScore: 0.8,
                source: 'OPUS-local'
              });
            }
          }
        }
      }
    }
  } catch (e) {
    logDebug('Erreur lecture OPUS: ' + e.message);
  }
  logDebug(`Nombre de suggestions trouvées: ${results.length}`);
  return results;
}

// Chargement dynamique de la config pondérations/priorités
let SUGGESTION_CONFIG = {
  weights: {},
  priorities: {}
};
try {
  const configPath = path.resolve(__dirname, '../suggestion-sources.config.json');
  SUGGESTION_CONFIG = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('[Config] suggestion-sources.config.json chargé');
} catch (e) {
  console.warn('[Config] suggestion-sources.config.json introuvable ou invalide, valeurs par défaut utilisées');
}

function getSourceWeight(source) {
  return SUGGESTION_CONFIG.weights[source] || 0.5;
}
function getLangPriority(lang) {
  return SUGGESTION_CONFIG.priorities[lang] || SUGGESTION_CONFIG.priorities['default'] || [];
}

function applySourceWeight(suggestion) {
  const source = suggestion.source || suggestion.method || 'local';
  const weight = getSourceWeight(source);
  return { ...suggestion, relevanceScore: (suggestion.relevanceScore || 0.5) * weight };
}

function reorderSourcesForContext(allResults, targetLanguage) {
  const order = getLangPriority(targetLanguage);
  return allResults.sort((a, b) => {
    const aSource = (a[0] && (a[0].source || a[0].method || 'local')) || '';
    const bSource = (b[0] && (b[0].source || b[0].method || 'local')) || '';
    return order.indexOf(aSource) - order.indexOf(bSource);
  });
}

function mergeExternalSuggestions(resultsArrays, maxSuggestions = 7, targetLanguage = 'en') {
  // Fallback contextuel : réordonne les sources selon la langue cible
  const orderedResults = reorderSourcesForContext(resultsArrays, targetLanguage);
  const all = orderedResults.flat().map(applySourceWeight);
  const seen = new Set();
  const unique = [];
  for (const s of all) {
    if (s.text && !seen.has(s.text)) {
      seen.add(s.text);
      unique.push(s);
    }
  }
  unique.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return unique.slice(0, maxSuggestions);
}

// Simple cache en mémoire pour les résultats d'API externes
const externalApiCache = new Map();
function getCacheKey(fn, ...args) {
  return fn.name + ':' + args.map(a => JSON.stringify(a)).join(':');
}
async function withCache(fn, ...args) {
  const key = getCacheKey(fn, ...args);
  if (externalApiCache.has(key)) {
    return externalApiCache.get(key);
  }
  const result = await fn(...args);
  externalApiCache.set(key, result);
  return result;
}

// Wrapper pour gestion d'erreur/fallback/timeout
async function safeApiCall(fn, ...args) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500); // 3.5s timeout
    const res = await fn(...args, controller);
    clearTimeout(timeout);
    return res;
  } catch (e) {
    return [];
  }
}

// Logging des appels externes
function logExternalCall(source, query, duration, status, count = 0) {
  console.log(`[${new Date().toISOString()}] [${source}] Query: "${query}" | ${status} | ${duration}ms | ${count} résultats`);
}

// Adapter chaque connecteur pour utiliser le cache et la gestion d'erreur
async function fetchMyMemoryCached(query, sourceLang, targetLang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchMyMemory, query, sourceLang, targetLang);
    logExternalCall('MyMemory', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('MyMemory', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchWiktionaryCached(query, lang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchWiktionary, query, lang);
    logExternalCall('Wiktionary', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('Wiktionary', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchLibreTranslateCached(query, sourceLang, targetLang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchLibreTranslate, query, sourceLang, targetLang);
    logExternalCall('LibreTranslate', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('LibreTranslate', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchLingueeCached(query, sourceLang, targetLang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchLinguee, query, sourceLang, targetLang);
    logExternalCall('Linguee', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('Linguee', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchOpusMTCached(query, sourceLang, targetLang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchOpusMT, query, sourceLang, targetLang);
    logExternalCall('OPUS-MT', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('OPUS-MT', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchOpenSubtitlesCached(query, lang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchOpenSubtitles, query, lang);
    logExternalCall('OpenSubtitles', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('OpenSubtitles', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}
async function fetchApertiumCached(query, sourceLang, targetLang, controller) {
  const t0 = Date.now();
  try {
    const res = await withCache(fetchApertium, query, sourceLang, targetLang);
    logExternalCall('Apertium', query, Date.now() - t0, 'OK', res.length);
    return res;
  } catch (e) {
    logExternalCall('Apertium', query, Date.now() - t0, 'ERREUR');
    return [];
  }
}

export { fetchMyMemory, fetchWiktionary, fetchLibreTranslate, fetchLinguee, fetchOpusMT, fetchOpenSubtitles, fetchApertium, fetchLocalCorpusSuggestions, mergeExternalSuggestions, fetchMyMemoryCached, fetchWiktionaryCached, fetchLibreTranslateCached, fetchLingueeCached, fetchOpusMTCached, fetchOpenSubtitlesCached, fetchApertiumCached };

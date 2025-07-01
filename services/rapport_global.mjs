// Script de rapport global de cohérence du dictionnaire enrichi (ESM)
// Analyse toutes les phrases et signale les incohérences, doublons, valeurs manquantes ou suspectes

import { ENRICHED_DICTIONARY } from './EnrichedDictionary.js';

const globalReport = [];

for (const phrase of Object.keys(ENRICHED_DICTIONARY)) {
  const entry = ENRICHED_DICTIONARY[phrase];
  const seen = new Set();
  const valueToLangs = {};
  let missing = [];
  let duplicates = [];
  let suspicious = [];

  for (const [lang, value] of Object.entries(entry)) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      missing.push(lang);
      continue;
    }
    if (seen.has(lang)) {
      duplicates.push(lang);
    }
    seen.add(lang);
    if (!valueToLangs[value]) valueToLangs[value] = [];
    valueToLangs[value].push(lang);
  }

  for (const [val, langs] of Object.entries(valueToLangs)) {
    if (langs.length > 5 && val.length > 1) {
      suspicious.push({ value: val, langs });
    }
  }

  if (missing.length || duplicates.length || suspicious.length) {
    globalReport.push({
      phrase,
      missing,
      duplicates,
      suspicious
    });
  }
}

console.log('=== RAPPORT GLOBAL DE COHÉRENCE DU DICTIONNAIRE ===');
if (globalReport.length === 0) {
  console.log('Aucune anomalie détectée dans le dictionnaire.');
} else {
  for (const r of globalReport) {
    console.log(`\n--- ${r.phrase} ---`);
    if (r.missing.length) {
      console.log('Langues sans valeur :', r.missing);
    }
    if (r.duplicates.length) {
      console.log('Doublons de codes de langue :', r.duplicates);
    }
    if (r.suspicious.length) {
      console.log('Valeurs partagées par de nombreuses langues (à vérifier) :');
      r.suspicious.forEach(s => {
        console.log(`  "${s.value}" : ${s.langs.join(', ')}`);
      });
    }
  }
}

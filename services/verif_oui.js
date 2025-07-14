// Script de vérification automatique de cohérence du dictionnaire enrichi
// Analyse les entrées pour la phrase "oui" et signale les incohérences, doublons, valeurs manquantes ou suspectes

import { ENRICHED_DICTIONARY } from './EnrichedDictionary.js';

const phrase = 'oui';
const entry = ENRICHED_DICTIONARY[phrase];

if (!entry) {
  console.error('Entrée "oui" absente du dictionnaire.');
  process.exit(1);
}

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

// Détection de valeurs partagées par trop de langues différentes (suspicion)
for (const [val, langs] of Object.entries(valueToLangs)) {
  if (langs.length > 5 && val.length > 1) {
    suspicious.push({ value: val, langs });
  }
}

console.log('--- Rapport de cohérence pour "oui" ---');
if (missing.length) {
  console.log('Langues sans valeur :', missing);
}
if (duplicates.length) {
  console.log('Doublons de codes de langue :', duplicates);
}
if (suspicious.length) {
  console.log('Valeurs partagées par de nombreuses langues (à vérifier) :');
  suspicious.forEach(s => {
    console.log(`  "${s.value}" : ${s.langs.join(', ')}`);
  });
}
if (!missing.length && !duplicates.length && !suspicious.length) {
  console.log('Aucune anomalie détectée.');
}

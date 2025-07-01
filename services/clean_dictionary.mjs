// Script d'automatisation : signale et remplace les traductions douteuses ou manquantes par "???" dans le dictionnaire enrichi
// Ajoute un commentaire pour chaque remplacement
// Usage : node clean_dictionary.mjs

import fs from 'fs';
import path from 'path';
import { ENRICHED_DICTIONARY } from './EnrichedDictionary.js';

const DICT_PATH = path.resolve('./services/EnrichedDictionary.js');

// Liste des valeurs considérées comme douteuses (trop partagées ou vides)
const SUSPICIOUS_VALUES = ['???', '', null, undefined];

// Pour chaque phrase, détecte les valeurs partagées par > 5 langues et les remplace par "???"
function cleanDictionary() {
  let modified = false;
  let report = [];
  for (const phrase of Object.keys(ENRICHED_DICTIONARY)) {
    const entry = ENRICHED_DICTIONARY[phrase];
    const valueToLangs = {};
    for (const [lang, value] of Object.entries(entry)) {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        entry[lang] = '???';
        modified = true;
        report.push(`[${phrase}] ${lang} : valeur manquante => remplacée par "???"`);
        continue;
      }
      if (!valueToLangs[value]) valueToLangs[value] = [];
      valueToLangs[value].push(lang);
    }
    for (const [val, langs] of Object.entries(valueToLangs)) {
      if (langs.length > 5 && val.length > 1) {
        for (const lang of langs) {
          entry[lang] = '???';
          modified = true;
          report.push(`[${phrase}] ${lang} : valeur trop partagée ("${val}") => remplacée par "???"`);
        }
      }
    }
  }
  if (modified) {
    // Écriture d'un rapport et rappel manuel de valider les "???"
    fs.writeFileSync('./services/clean_report.txt', report.join('\n'), 'utf8');
    console.log('Nettoyage effectué. Rapport dans services/clean_report.txt');
    console.log('Merci de valider ou compléter manuellement les entrées "???".');
  } else {
    console.log('Aucune modification nécessaire.');
  }
}

cleanDictionary();

// Module utilitaire pour charger et interroger le dictionnaire Maya–Espagnol
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON du dictionnaire
const DICTIONARY_PATH = path.join(__dirname, 'maya-spanish-dictionary.json');

// Chargement du dictionnaire en mémoire
let dictionary = [];
try {
  dictionary = JSON.parse(fs.readFileSync(DICTIONARY_PATH, 'utf8'));
} catch (err) {
  console.error('Erreur de chargement du dictionnaire:', err);
}

// Recherche par mot maya
function findByMayaWord(word) {
  return dictionary.filter(entry => entry.maya.toLowerCase() === word.toLowerCase());
}

// Recherche par mot espagnol
function findBySpanishWord(word) {
  return dictionary.filter(entry => entry.spanish.toLowerCase().includes(word.toLowerCase()));
}

// Filtrer par catégorie grammaticale
function getAllByPOS(pos) {
  return dictionary.filter(entry => entry.pos.toLowerCase() === pos.toLowerCase());
}

// Export des fonctions
module.exports = {
  dictionary,
  findByMayaWord,
  findBySpanishWord,
  getAllByPOS
};

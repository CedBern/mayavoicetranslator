// Utilitaire pour charger le dictionnaire Maya–Espagnol
const fs = require('fs');
const config = require('../../config');

let dictionary = [];
try {
  dictionary = JSON.parse(fs.readFileSync(config.dictionaryPath, 'utf8'));
} catch (err) {
  console.error('Erreur de chargement du dictionnaire:', err);
}

function findByMayaWord(word) {
  return dictionary.filter(entry => entry.maya.toLowerCase() === word.toLowerCase());
}

function findBySpanishWord(word) {
  return dictionary.filter(entry => entry.spanish.toLowerCase().includes(word.toLowerCase()));
}

function getAllByPOS(pos) {
  return dictionary.filter(entry => entry.pos.toLowerCase() === pos.toLowerCase());
}

module.exports = {
  dictionary,
  findByMayaWord,
  findBySpanishWord,
  getAllByPOS
};

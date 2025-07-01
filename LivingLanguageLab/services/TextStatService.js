// Service d'intégration TextStat
// Usage : métriques de lisibilité, complexité syntaxique
const textstat = require('textstat');

function getReadabilityMetrics(text) {
  return {
    flesch: textstat.fleschReadingEase(text),
    fleschKincaid: textstat.fleschKincaidGrade(text),
    smog: textstat.smogIndex(text),
    colemanLiau: textstat.colemanLiauIndex(text),
    automated: textstat.automatedReadabilityIndex(text)
  };
}

module.exports = { getReadabilityMetrics };

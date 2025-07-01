// Module veilleur : ingestion automatisée de ressources (MVP)
// Activation/désactivation via config.json
// Journalisation dédiée dans logs/veilleur.log
// Extensible : scraping, RSS, API, IA, rotation agents

const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

const LOG_PATH = path.join(__dirname, '../../logs/veilleur.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, line);
}

function isActive() {
  return config.modules && config.modules.veilleur;
}

function ingestRSS() {
  // Placeholder: ingestion RSS (à compléter avec feedparser ou équivalent)
  log('Ingestion RSS démarrée (MVP, à compléter)');
}

function main() {
  if (!isActive()) {
    log('Module veilleur désactivé (config.modules.veilleur = false)');
    return;
  }
  log('Module veilleur activé');
  ingestRSS();
  // TODO: hooks pour scraping, API, IA, rotation agents
}

if (require.main === module) {
  main();
}

module.exports = { main, ingestRSS, log, isActive };

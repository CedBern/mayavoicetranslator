// services/ErrorTracker.js
// Module minimal pour logguer les erreurs utilisateur (prototype)

const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../.data/error-log.json');

function logError({ userId = 'anonymous', type, detail, context }) {
  const entry = {
    timestamp: new Date().toISOString(),
    userId,
    type, // ex: 'conjugaison', 'vocabulaire', 'syntaxe'
    detail, // ex: 'mauvais temps', 'mot inconnu', etc.
    context // ex: phrase, exercice, module
  };
  let log = [];
  if (fs.existsSync(LOG_PATH)) {
    try {
      log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
    } catch (e) {
      log = [];
    }
  }
  log.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

module.exports = { logError, LOG_PATH };

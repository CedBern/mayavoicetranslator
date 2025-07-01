// services/HackJournal.js
// Journal des hacks et remix de parcours (prototype)

const fs = require('fs');
const path = require('path');

const JOURNAL_PATH = path.join(__dirname, '../.data/hack-journal.json');

function logRemix({ userId = 'anonymous', action, detail, before, after }) {
  const entry = {
    timestamp: new Date().toISOString(),
    userId,
    action, // ex: 'add', 'remove', 'edit', 'fork', 'reorder'
    detail, // description libre
    before, // état avant (optionnel)
    after   // état après (optionnel)
  };
  let log = [];
  if (fs.existsSync(JOURNAL_PATH)) {
    try {
      log = JSON.parse(fs.readFileSync(JOURNAL_PATH, 'utf8'));
    } catch (e) {
      log = [];
    }
  }
  log.push(entry);
  fs.writeFileSync(JOURNAL_PATH, JSON.stringify(log, null, 2));
}

module.exports = { logRemix, JOURNAL_PATH };

// Script Node.js pour anonymiser les logs/feedbacks avant publication
const fs = require('fs');
const input = process.argv[2] || 'logs.json';
const output = process.argv[3] || 'logs.anonymized.json';

const lines = fs.readFileSync(input, 'utf-8').split('\n').filter(Boolean);
const anonymized = lines.map(line => {
  try {
    const log = JSON.parse(line);
    if (log.userId) log.userId = 'anon';
    if (log.data && log.data.email) log.data.email = 'anon@example.com';
    return JSON.stringify(log);
  } catch (e) { return null; }
}).filter(Boolean);

fs.writeFileSync(output, anonymized.join('\n'));
console.log(`Anonymized logs written to ${output}`);

// Squelette d'intégration API externe (Notion, Jira, Trello, etc.)
// Usage : node integrate_external_tools.js sprint_planning.json
// À adapter selon l'API cible (voir exemples en commentaires)

const fs = require('fs');
const https = require('https');

const [,, planningFile] = process.argv;
if (!planningFile || !fs.existsSync(planningFile)) {
  console.error('Usage: node integrate_external_tools.js sprint_planning.json');
  process.exit(1);
}

const planning = JSON.parse(fs.readFileSync(planningFile, 'utf8'));

// === Intégration Trello (API gratuite) ===
const trelloKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const trelloBoardId = process.env.TRELLO_BOARD_ID;
if (trelloKey && trelloToken && trelloBoardId) {
  function sendToTrello(task) {
    const data = new URLSearchParams({
      key: trelloKey,
      token: trelloToken,
      idList: trelloBoardId, // Pour simplifier, on suppose que BoardId = idList (à adapter si besoin)
      name: task.title || task.nom || 'Tâche',
      desc: task.description || task.details || JSON.stringify(task)
    }).toString();
    const options = {
      hostname: 'api.trello.com',
      path: `/1/cards?${data}`,
      method: 'POST'
    };
    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', () => console.log('Carte Trello créée:', task.title || task.nom));
    });
    req.on('error', e => console.error('Erreur Trello:', e));
    req.end();
  }
  planning.forEach(sendToTrello);
}

// === Exemple d'intégration Notion (à compléter) ===
// const notionApiKey = process.env.NOTION_API_KEY;
// const notionDatabaseId = process.env.NOTION_DATABASE_ID;
// function sendToNotion(task) { /* ... */ }
// planning.forEach(sendToNotion);

// === Exemple d'intégration Jira (à compléter) ===
// const jiraUser = process.env.JIRA_USER;
// const jiraToken = process.env.JIRA_TOKEN;
// const jiraUrl = process.env.JIRA_URL;
// function sendToJira(task) { /* ... */ }
// planning.forEach(sendToJira);

// === Intégration Notion (API gratuite) ===
const notionApiKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
if (notionApiKey && notionDatabaseId) {
  function sendToNotion(task) {
    const data = JSON.stringify({
      parent: { database_id: notionDatabaseId },
      properties: {
        Name: { title: [{ text: { content: task.title || task.nom || 'Tâche' } }] },
        Description: { rich_text: [{ text: { content: task.description || task.details || '' } }] },
        Statut: { select: { name: task.status || task.statut || 'À faire' } }
      }
    });
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/pages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Content-Length': data.length
      }
    };
    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', () => console.log('Tâche Notion créée:', task.title || task.nom));
    });
    req.on('error', e => console.error('Erreur Notion:', e));
    req.write(data);
    req.end();
  }
  planning.forEach(sendToNotion);
}

console.log('Intégration API externe : squelette prêt. À adapter selon vos besoins.');

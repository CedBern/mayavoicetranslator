// API REST ultra-légère pour exposer les rapports de pilotage projet en lecture seule
// Usage : node serve_report_api.js (par défaut sur http://localhost:3000)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DOCS_DIR = path.join(__dirname, 'docs');

app.get('/api/report', (req, res) => {
  const file = path.join(DOCS_DIR, 'rapport_sprint.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
  } else {
    res.status(404).json({ error: 'Rapport non trouvé' });
  }
});

app.get('/api/dashboard', (req, res) => {
  const file = path.join(DOCS_DIR, 'dashboard.html');
  if (fs.existsSync(file)) {
    res.type('html').send(fs.readFileSync(file, 'utf8'));
  } else {
    res.status(404).send('Dashboard non trouvé');
  }
});

app.use('/public', express.static(DOCS_DIR));

app.get('/', (req, res) => {
  res.send(`<h2>API de reporting MayaVoiceTranslator</h2><ul><li><a href='/api/report'>/api/report</a> (JSON)</li><li><a href='/api/dashboard'>/api/dashboard</a> (HTML)</li><li><a href='/public/rapport_sprint.html'>/public/rapport_sprint.html</a> (HTML interactif)</li></ul>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API de reporting disponible sur http://localhost:${port}`);
});

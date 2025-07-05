#!/usr/bin/env node

import express from 'express';
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

// Remplacement pour __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION POUR L'INTÉGRATION CO'OX MAYAB (API_GUIDELINES_V2.md)
const COOX_MAYAB_CONFIG = {
  clientId: process.env.COOX_MAYAB_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
  clientSecret: process.env.COOX_MAYAB_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE',
  tokenUrl: 'https://api.cooxmayab.org/v1/oauth/token'
};

let accessToken = null;

// Fonction pour obtenir et rafraîchir le token d'accès
async function getAccessToken() {
  // Pour l'instant, nous simulons l'obtention du token.
  // Dans une version réelle, nous utiliserions une librairie comme 'axios' ou 'node-fetch'
  // pour faire un appel POST à COOX_MAYAB_CONFIG.tokenUrl
  if (!accessToken) {
    console.log("Obtention d'un nouveau token d'accès de Co'ox Mayab...");
    accessToken = `simulated_token_${Date.now()}`;
  }
  return accessToken;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3000;

// Middleware pour servir les fichiers de contenu (audio, images)
app.use('/content', express.static(path.join(__dirname, 'content')));

app.use(express.json());

// --- API Endpoints ---

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    services: { api: 'active', websocket: 'active', mission_loader: 'active' }
  });
});

app.post('/api/translate', (req, res) => {
  const { text, from, to } = req.body;
  res.json({
    originalText: text,
    translatedText: `[Traduction simulée de '${text}' de ${from} vers ${to}]`,
  });
});

// Endpoint pour lister toutes les missions disponibles
app.get('/api/missions', async (req, res) => {
  const missionsDir = path.join(__dirname, 'content', 'missions');
  try {
    const files = await fs.readdir(missionsDir);
    const missionFiles = files.filter(file => file.endsWith('.json'));

    const missions = await Promise.all(missionFiles.map(async (file) => {
      const filePath = path.join(missionsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const missionData = JSON.parse(content);
      // On ne retourne que les métadonnées, pas le contenu complet
      return {
        id: missionData.id,
        title: missionData.title,
        description: missionData.description,
        cefr_level: missionData.cefr_level
      };
    }));

    res.json(missions);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des missions:", error);
    res.status(500).json({ error: "Impossible de lister les missions" });
  }
});


// Endpoint pour charger UNE mission pédagogique
app.get('/api/missions/:id', async (req, res) => {
  const missionId = req.params.id;
  const missionPath = path.join(__dirname, 'content', 'missions', `${missionId}.json`);

  try {
    const data = await fs.readFile(missionPath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    console.error(`Erreur: Mission ${missionId} non trouvée.`, err);
    return res.status(404).json({ error: 'Mission non trouvée' });
  }
});


// --- Logique WebSocket ---
wss.on('connection', ws => {
  console.log('Client WebSocket connecté');
  ws.send(JSON.stringify({ type: 'notification', message: 'Bienvenue sur le serveur TalkKin !' }));
});

// --- Servir l'application React en Production ---
if (process.env.NODE_ENV === 'production') {
  // Servir les fichiers statiques générés par le build de React
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Pour toutes les autres requêtes, renvoyer l'index.html de React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


// --- Démarrage du serveur ---
server.listen(port, () => {
  console.log(`🚀 TalkKin Modern Server running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`➡️  Frontend React (dev mode) is running separately (run 'npm start' in /client)`);
  } else {
    console.log(`➡️  Serving production build from 'client/build'`);
  }
});

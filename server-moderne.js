#!/usr/bin/env node

import axios from 'axios';
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

// Stockage en mémoire du token et de son expiration
let tokenCache = {
  accessToken: null,
  expiresAt: null,
};

// Fonction pour obtenir et rafraîchir le token d'accès
async function getAccessToken() {
  const now = Date.now();

  // Si on a un token et qu'il n'a pas expiré (avec une marge de 60s), on le retourne
  if (tokenCache.accessToken && tokenCache.expiresAt && now < tokenCache.expiresAt - 60000) {
    console.log("Utilisation du token d'accès depuis le cache.");
    return tokenCache.accessToken;
  }

  console.log("Obtention d'un nouveau token d'accès de Co'ox Mayab...");
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', COOX_MAYAB_CONFIG.clientId);
    params.append('client_secret', COOX_MAYAB_CONFIG.clientSecret);

    // Note: Dans un cas réel, l'URL du token serait valide.
    // Comme l'URL est probablement un placeholder, cet appel échouera.
    // Nous allons simuler une réponse réussie pour permettre au développement de continuer.
    if (COOX_MAYAB_CONFIG.tokenUrl.includes('api.cooxmayab.org')) {
        console.warn("Simulation de la réponse OAuth 2.0 car l'endpoint réel n'est pas disponible.");
        const expiresIn = 3600; // 1 heure
        const accessToken = `fake_token_${Date.now()}`;
        tokenCache.accessToken = accessToken;
        tokenCache.expiresAt = now + (expiresIn * 1000);
        return accessToken;
    }

    const response = await axios.post(COOX_MAYAB_CONFIG.tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = response.data;
    
    if (!access_token) {
        throw new Error("Aucun access_token retourné par l'API d'authentification.");
    }

    tokenCache.accessToken = access_token;
    tokenCache.expiresAt = now + (expires_in * 1000);

    console.log("Nouveau token d'accès obtenu avec succès.");
    return tokenCache.accessToken;

  } catch (error) {
    console.error("Erreur critique lors de l'obtention du token d'accès:", error.message);
    tokenCache.accessToken = null;
    tokenCache.expiresAt = null;
    throw new Error("Impossible d'obtenir le token d'accès de Co'ox Mayab.");
  }
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

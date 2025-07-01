/**
 * Serveur web simple pour Talk Kin
 * Application dédiée aux langues autochtones
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8083;

// Middlewares
app.use(cors());
app.use(express.static(__dirname));

// Route principale - Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Route pour le traducteur
app.get('/traducteur', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'traducteur.html'));
});

// Route de statut
app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Maya Voice Translator Web',
        timestamp: new Date().toISOString(),
        api_url: 'http://localhost:3000',
        features: {
            translation: true,
            speech_synthesis: true,
            cors_enabled: true
        }
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🌐 Maya Voice Translator Web Interface`);
    console.log(`📱 Interface: http://localhost:${PORT}`);
    console.log(`🔧 Status: http://localhost:${PORT}/status`);
    console.log(`🔗 API Backend: http://localhost:3000`);
    console.log(`\n✨ Application web prête à l'emploi!`);
});

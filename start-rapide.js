#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log(`
🚀 TalkKin - Démarrage Rapide
=============================

Démarrage du serveur de développement moderne...
`);

// Vérifier si le serveur moderne existe
const serverPath = path.join(__dirname, 'server-moderne.js');
if (!fs.existsSync(serverPath)) {
    console.error('❌ Fichier server-moderne.js non trouvé!');
    process.exit(1);
}

// Démarrer le serveur moderne
const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    cwd: __dirname
});

server.on('error', (err) => {
    console.error('❌ Erreur lors du démarrage du serveur:', err);
    process.exit(1);
});

server.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Serveur arrêté proprement');
    } else {
        console.error(`❌ Serveur arrêté avec le code ${code}`);
    }
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt en cours...');
    server.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt en cours...');
    server.kill('SIGTERM');
});

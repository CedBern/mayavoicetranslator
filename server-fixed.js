const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware pour traiter JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers pour éviter les problèmes de cache
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'web')));
app.use(express.static(__dirname));

// Route principale - Version simplifiée qui se charge rapidement
app.get('/', (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TalkKin - Langues Autochtones</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .status {
            background: rgba(80, 200, 120, 0.2);
            border: 2px solid #50C878;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .test-section {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        input, button {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            background: #50C878;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background: #45B56A;
        }
        .result {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            min-height: 20px;
        }
        .loading {
            display: none;
            color: #FFD700;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 TalkKin - Traducteur de Langues Autochtones</h1>
        
        <div class="status">
            <h2>✅ Serveur Local Actif</h2>
            <p>Port: ${PORT}</p>
            <p>Status: Opérationnel</p>
            <p>Mode: Développement</p>
        </div>

        <div class="test-section">
            <h3>🧪 Test de Traduction</h3>
            <input type="text" id="inputText" placeholder="Tapez votre texte ici..." value="Bonjour">
            <select id="targetLang">
                <option value="maya">Maya (Yucatèque)</option>
                <option value="quechua">Quechua</option>
                <option value="guarani">Guarani</option>
                <option value="inuktitut">Inuktitut</option>
            </select>
            <button onclick="translateText()">Traduire</button>
            
            <div id="loading" class="loading">⏳ Traduction en cours...</div>
            <div id="result" class="result">Résultat apparaîtra ici</div>
        </div>

        <div class="test-section">
            <h3>🔗 Liens de Test</h3>
            <p><a href="/test" style="color: #FFD700;">Interface de Test Avancée</a></p>
            <p><a href="/api/translate?text=bonjour&target=maya" style="color: #FFD700;">Test API Direct</a></p>
        </div>

        <div class="test-section">
            <h3>📊 Informations Système</h3>
            <p>Node.js: ${process.version}</p>
            <p>Plateforme: ${process.platform}</p>
            <p>Démarrage: ${new Date().toLocaleString()}</p>
        </div>
    </div>

    <script>
        async function translateText() {
            const text = document.getElementById('inputText').value;
            const target = document.getElementById('targetLang').value;
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            
            if (!text.trim()) {
                result.innerHTML = '❌ Veuillez saisir du texte';
                return;
            }
            
            loading.style.display = 'block';
            result.innerHTML = '';
            
            try {
                const response = await fetch(\`/api/translate?text=\${encodeURIComponent(text)}&target=\${target}\`);
                const data = await response.json();
                
                loading.style.display = 'none';
                
                if (data.success) {
                    result.innerHTML = \`
                        <strong>✅ Traduction réussie:</strong><br>
                        <strong>Original:</strong> \${data.original}<br>
                        <strong>Langue:</strong> \${data.targetLanguage}<br>
                        <strong>Traduction:</strong> \${data.translation}
                    \`;
                } else {
                    result.innerHTML = \`❌ Erreur: \${data.error}\`;
                }
            } catch (error) {
                loading.style.display = 'none';
                result.innerHTML = \`❌ Erreur de connexion: \${error.message}\`;
            }
        }
        
        // Test au chargement
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ TalkKin Interface chargée avec succès');
        });
    </script>
</body>
</html>`;
    
    res.send(htmlContent);
});

// API de traduction simplifiée
app.get('/api/translate', (req, res) => {
    const { text, target } = req.query;
    
    if (!text || !target) {
        return res.json({
            success: false,
            error: 'Paramètres manquants: text et target requis'
        });
    }
    
    // Simulation de traduction (remplacer par vraie API plus tard)
    const translations = {
        maya: {
            'bonjour': 'Ba\'ax ka wa\'alik',
            'merci': 'Dios bo\'otik',
            'au revoir': 'Túux ulel'
        },
        quechua: {
            'bonjour': 'Napaykullayki',
            'merci': 'Sulpayki',
            'au revoir': 'Tupananchiskama'
        },
        guarani: {
            'bonjour': 'Mba\'éichapa',
            'merci': 'Aguyje',
            'au revoir': 'Jajoecha peve'
        },
        inuktitut: {
            'bonjour': 'Atelihai',
            'merci': 'Nakurmiik',
            'au revoir': 'Tavvauvutit'
        }
    };
    
    const textLower = text.toLowerCase().trim();
    const translation = translations[target] && translations[target][textLower] 
        ? translations[target][textLower]
        : `[Traduction ${target}] ${text}`;
    
    res.json({
        success: true,
        original: text,
        translation: translation,
        targetLanguage: target,
        timestamp: new Date().toISOString()
    });
});

// Route de test
app.get('/test', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>TalkKin - Test Interface</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: #f0f0f0; 
        }
        .test-container { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>🧪 TalkKin - Interface de Test</h1>
        <h2>Status: ✅ Serveur Actif</h2>
        <p><a href="/">← Retour à l'accueil</a></p>
        <p><strong>Tests disponibles:</strong></p>
        <ul>
            <li><a href="/api/translate?text=bonjour&target=maya">Test API Maya</a></li>
            <li><a href="/api/translate?text=merci&target=quechua">Test API Quechua</a></li>
            <li><a href="/api/translate?text=au%20revoir&target=guarani">Test API Guarani</a></li>
        </ul>
    </div>
</body>
</html>
    `);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 TalkKin Server démarré sur http://localhost:${PORT}`);
    console.log(`📱 Interface principale: http://localhost:${PORT}`);
    console.log(`🧪 Interface de test: http://localhost:${PORT}/test`);
    console.log(`🔗 API de traduction: http://localhost:${PORT}/api/translate?text=bonjour&target=maya`);
    console.log(`✅ Serveur optimisé contre les problèmes de chargement`);
});

module.exports = app;

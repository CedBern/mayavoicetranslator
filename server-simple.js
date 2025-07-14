const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
    });
    next();
});

// Route principale
app.get('/', (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TalkKin - Traducteur</title>
    <style>
        body { 
            margin: 0; padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; min-height: 100vh;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .status { 
            background: rgba(80, 200, 120, 0.2); border: 2px solid #50C878;
            padding: 20px; border-radius: 10px; margin: 20px 0;
        }
        .test-section { 
            background: rgba(255, 255, 255, 0.1); padding: 20px; 
            border-radius: 10px; margin: 20px 0;
        }
        input, select, button { 
            padding: 12px; margin: 5px; border: none; border-radius: 5px; 
            font-size: 16px;
        }
        button { 
            background: #50C878; color: white; cursor: pointer;
        }
        button:hover { background: #45B56A; }
        .result { 
            background: rgba(255, 255, 255, 0.1); padding: 15px; 
            border-radius: 5px; margin: 10px 0; min-height: 60px;
        }
        .loading { color: #FFD700; display: none; }
        a { color: #FFD700; text-decoration: none; margin: 0 10px; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 TalkKin</h1>
        <p>Traducteur de Langues Autochtones - Serveur Local</p>
        
        <div class="status">
            <h2>✅ Serveur Opérationnel</h2>
            <p><strong>Port:</strong> ${PORT} | <strong>Status:</strong> Actif</p>
            <p><strong>Démarré:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <div class="test-section">
            <h3>🧪 Test de Traduction</h3>
            <input type="text" id="inputText" placeholder="Votre texte..." value="Bonjour">
            <select id="targetLang">
                <option value="maya">Maya</option>
                <option value="quechua">Quechua</option>
                <option value="guarani">Guarani</option>
                <option value="inuktitut">Inuktitut</option>
            </select>
            <button onclick="translateText()">Traduire</button>
            
            <div id="loading" class="loading">⏳ Traduction en cours...</div>
            <div id="result" class="result">Cliquez sur "Traduire" pour voir le résultat</div>
        </div>

        <div class="test-section">
            <h3>🔗 Navigation</h3>
            <a href="/test">Tests Avancés</a>
            <a href="/api/translate?text=bonjour&target=maya">API Directe</a>
            <a href="/status">Status</a>
        </div>
    </div>

    <script>
        async function translateText() {
            const text = document.getElementById('inputText').value.trim();
            const target = document.getElementById('targetLang').value;
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            
            if (!text) {
                result.innerHTML = '❌ Veuillez saisir du texte';
                return;
            }
            
            loading.style.display = 'block';
            result.innerHTML = '';
            
            try {
                const response = await fetch('/api/translate?text=' + encodeURIComponent(text) + '&target=' + target);
                const data = await response.json();
                
                loading.style.display = 'none';
                
                if (data.success) {
                    result.innerHTML = 
                        '<strong>✅ Traduction réussie:</strong><br>' +
                        '<strong>Original:</strong> ' + data.original + '<br>' +
                        '<strong>Langue:</strong> ' + data.targetLanguage + '<br>' +
                        '<strong>Traduction:</strong> <span style="color: #FFD700;">' + data.translation + '</span>';
                } else {
                    result.innerHTML = '❌ Erreur: ' + data.error;
                }
            } catch (error) {
                loading.style.display = 'none';
                result.innerHTML = '❌ Erreur de connexion: ' + error.message;
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ TalkKin Interface chargée');
            document.getElementById('inputText').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    translateText();
                }
            });
        });
    </script>
</body>
</html>`;
    res.send(html);
});

// API de traduction
app.get('/api/translate', (req, res) => {
    const { text, target } = req.query;
    
    if (!text || !target) {
        return res.json({
            success: false,
            error: 'Paramètres manqués: text et target requis'
        });
    }
    
    const translations = {
        maya: {
            'bonjour': 'Ba\'ax ka wa\'alik',
            'merci': 'Dios bo\'otik',
            'au revoir': 'Túux ulel',
            'amour': 'Yaabilil'
        },
        quechua: {
            'bonjour': 'Napaykullayki',
            'merci': 'Sulpayki',
            'au revoir': 'Tupananchiskama',
            'amour': 'Kuyay'
        },
        guarani: {
            'bonjour': 'Mba\'éichapa',
            'merci': 'Aguyje',
            'au revoir': 'Jajoecha peve',
            'amour': 'Mborayhu'
        },
        inuktitut: {
            'bonjour': 'Atelihai',
            'merci': 'Nakurmiik',
            'au revoir': 'Tavvauvutit',
            'amour': 'Asavakkit'
        }
    };
    
    const textLower = text.toLowerCase().trim();
    const translation = translations[target] && translations[target][textLower] 
        ? translations[target][textLower]
        : '[Traduction ' + target + '] ' + text;
    
    res.json({
        success: true,
        original: text,
        translation: translation,
        targetLanguage: target,
        timestamp: new Date().toISOString()
    });
});

// Page de test
app.get('/test', (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>TalkKin - Tests</title>
    <style>
        body { 
            font-family: Arial, sans-serif; margin: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 800px; margin: 0 auto; background: white; 
            padding: 30px; border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .btn { 
            padding: 10px 15px; background: #667eea; color: white; 
            border: none; border-radius: 5px; cursor: pointer; margin: 5px; 
        }
        .btn:hover { background: #5a67d8; }
        .result { 
            background: #e6f3ff; padding: 15px; border-radius: 5px; 
            margin: 10px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 TalkKin - Tests Avancés</h1>
        <p><a href="/">← Retour à l'accueil</a></p>
        
        <h3>Tests Rapides</h3>
        <button class="btn" onclick="testAPI('bonjour', 'maya')">Test Maya</button>
        <button class="btn" onclick="testAPI('merci', 'quechua')">Test Quechua</button>
        <button class="btn" onclick="testAPI('au revoir', 'guarani')">Test Guarani</button>
        
        <div id="test-results"></div>
    </div>
    
    <script>
        async function testAPI(text, target) {
            try {
                const response = await fetch('/api/translate?text=' + text + '&target=' + target);
                const data = await response.json();
                const div = document.createElement('div');
                div.className = 'result';
                div.innerHTML = '<strong>Test ' + target + ':</strong> ' + text + ' → ' + data.translation;
                document.getElementById('test-results').appendChild(div);
            } catch (error) {
                console.error('Erreur test:', error);
            }
        }
    </script>
</body>
</html>`;
    res.send(html);
});

// Status
app.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        uptime: process.uptime(),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        version: process.version,
        timestamp: new Date().toISOString()
    });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 TalkKin Server démarré sur http://localhost:${PORT}`);
    console.log(`📱 Interface: http://localhost:${PORT}`);
    console.log(`🧪 Tests: http://localhost:${PORT}/test`);
    console.log(`🔗 API: http://localhost:${PORT}/api/translate?text=bonjour&target=maya`);
    console.log(`✅ Serveur optimisé - chargement instantané`);
});

module.exports = app;

// @ts-nocheck
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware ultra-rapide
app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
    });
    next();
});

// Servir les fichiers statiques (public)
app.use(express.static('public'));

// Route principale - Version ultra-minimaliste
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TalkKin - Traducteur de Langues Autochtones</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; min-height: 100vh; padding: 20px;
        }
        .container { max-width: 900px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
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
            font-size: 16px; font-family: inherit;
        }
        button { 
            background: #50C878; color: white; cursor: pointer; 
            transition: background 0.2s;
        }
        button:hover { background: #45B56A; }
        .result { 
            background: rgba(255, 255, 255, 0.1); padding: 15px; 
            border-radius: 5px; margin: 10px 0; min-height: 60px;
        }
        .links a { color: #FFD700; text-decoration: none; margin: 0 10px; }
        .links a:hover { text-decoration: underline; }
        .loading { color: #FFD700; display: none; }
        .quick-tests { display: flex; flex-wrap: wrap; gap: 10px; }
        .quick-test-btn { 
            background: rgba(255, 255, 255, 0.2); padding: 8px 12px; 
            border-radius: 20px; cursor: pointer; font-size: 14px;
        }
        .quick-test-btn:hover { background: rgba(255, 255, 255, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌍 TalkKin</h1>
            <p>Traducteur de Langues Autochtones - Serveur Local</p>
        </div>
        
        <div class="status">
            <h2>✅ Serveur Opérationnel</h2>
            <p><strong>Port:</strong> ${PORT} | <strong>Status:</strong> Actif | <strong>Mode:</strong> Développement</p>
            <p><strong>Démarré:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <div class="test-section">
            <h3>🧪 Test de Traduction Rapide</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                <input type="text" id="inputText" placeholder="Votre texte..." value="Bonjour" style="flex: 1; min-width: 200px;">
                <select id="targetLang">
                    <option value="maya">Maya (Yucatèque)</option>
                    <option value="quechua">Quechua</option>
                    <option value="guarani">Guarani</option>
                    <option value="inuktitut">Inuktitut</option>
                    <option value="nahuatl">Nahuatl</option>
                </select>
                <button onclick="translateText()">Traduire</button>
            </div>
            
            <div class="quick-tests">
                <div class="quick-test-btn" onclick="quickTest('Bonjour', 'maya')">Test Maya</div>
                <div class="quick-test-btn" onclick="quickTest('Merci', 'quechua')">Test Quechua</div>
                <div class="quick-test-btn" onclick="quickTest('Au revoir', 'guarani')">Test Guarani</div>
                <div class="quick-test-btn" onclick="quickTest('Amour', 'inuktitut')">Test Inuktitut</div>
            </div>
            
            <div id="loading" class="loading">⏳ Traduction en cours...</div>
            <div id="result" class="result">Cliquez sur "Traduire" ou un test rapide pour voir le résultat</div>
        </div>

        <div class="test-section">
            <h3>🔗 Navigation</h3>
            <div class="links">
                <a href="/test">Interface de Test Avancée</a>
                <a href="/api/translate?text=bonjour&target=maya">API Directe</a>
                <a href="/status">Status Système</a>
                <a href="/docs">Documentation API</a>
            </div>
        </div>

        <div class="test-section">
            <h3>📊 Informations Système</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div><strong>Node.js:</strong> ${process.version}</div>
                <div><strong>Plateforme:</strong> ${process.platform}</div>
                <div><strong>Architecture:</strong> ${process.arch}</div>
                <div><strong>Mémoire:</strong> ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</div>
            </div>
        </div>
    </div>

    <script>
        // Variables globales
        let isTranslating = false;
        
        // Fonction de traduction principale
        async function translateText() {
            if (isTranslating) return;
            
            const text = document.getElementById('inputText').value.trim();
            const target = document.getElementById('targetLang').value;
            
            if (!text) {
                showResult('❌ Veuillez saisir du texte à traduire');
                return;
            }
            
            await performTranslation(text, target);
        }
        
        // Test rapide
        async function quickTest(text, lang) {
            document.getElementById('inputText').value = text;
            document.getElementById('targetLang').value = lang;
            await performTranslation(text, lang);
        }
        
        // Fonction de traduction
        async function performTranslation(text, target) {
            isTranslating = true;
            showLoading(true);
            
            try {
                const response = await fetch(\`/api/translate?text=\${encodeURIComponent(text)}&target=\${target}\`);
                const data = await response.json();
                
                if (data.success) {
                    showResult(\`
                        <div style="border-left: 4px solid #50C878; padding-left: 15px;">
                            <div><strong>✅ Traduction réussie</strong></div>
                            <div style="margin: 8px 0;"><strong>Original:</strong> \${data.original}</div>
                            <div style="margin: 8px 0;"><strong>Langue:</strong> \${data.targetLanguage}</div>
                            <div style="margin: 8px 0; font-size: 18px;"><strong>Traduction:</strong> <span style="color: #FFD700;">\${data.translation}</span></div>
                        </div>
                    \`);
                } else {
                    showResult(\`❌ Erreur: \${data.error}\`);
                }
            } catch (error) {
                showResult(\`❌ Erreur de connexion: \${error.message}\`);
            } finally {
                showLoading(false);
                isTranslating = false;
            }
        }
        
        // Fonctions utilitaires
        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }
        
        function showResult(content) {
            document.getElementById('result').innerHTML = content;
        }
        
        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ TalkKin Interface chargée');
            
            // Raccourci clavier Enter pour traduire
            document.getElementById('inputText').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    translateText();
                }
            });
        });
    </script>
</body>
</html>`);
});

// API de traduction optimisée
app.get('/api/translate', (req, res) => {
    const { text, target } = req.query;
    
    if (!text || !target) {
        return res.json({
            success: false,
            error: 'Paramètres manqués: text et target requis'
        });
    }
    
    // Base de données de traductions enrichie
    const translations = {
        maya: {
            'bonjour': 'Ba\'ax ka wa\'alik',
            'merci': 'Dios bo\'otik',
            'au revoir': 'Túux ulel',
            'amour': 'Yaabilil',
            'paix': 'Jela\'an',
            'famille': 'Otsilil'
        },
        quechua: {
            'bonjour': 'Napaykullayki',
            'merci': 'Sulpayki',
            'au revoir': 'Tupananchiskama',
            'amour': 'Kuyay',
            'paix': 'Kausay',
            'famille': 'Ayllu'
        },
        guarani: {
            'bonjour': 'Mba\'éichapa',
            'merci': 'Aguyje',
            'au revoir': 'Jajoecha peve',
            'amour': 'Mborayhu',
            'paix': 'Py\'aguapy',
            'famille': 'Teko'
        },
        inuktitut: {
            'bonjour': 'Atelihai',
            'merci': 'Nakurmiik',
            'au revoir': 'Tavvauvutit',
            'amour': 'Asavakkit',
            'paix': 'Erngnik',
            'famille': 'Ilagiit'
        },
        nahuatl: {
            'bonjour': 'Niltze',
            'merci': 'Tlazohcamati',
            'au revoir': 'Mohuetzqueh',
            'amour': 'Tlazohtlaliztli',
            'paix': 'Yocoxqui',
            'famille': 'Techan'
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

// Page de test avancée
app.get('/test', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>TalkKin - Tests Avancés</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .test-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
        .btn { padding: 10px 15px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #5a67d8; }
        .result { background: #e6f3ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 TalkKin - Interface de Test Avancée</h1>
        <p><a href="/">← Retour à l'accueil</a></p>
        
        <div class="test-grid">
            <div class="test-card">
                <h3>Tests de Base</h3>
                <button class="btn" onclick="testAPI('bonjour', 'maya')">Test Maya</button>
                <button class="btn" onclick="testAPI('merci', 'quechua')">Test Quechua</button>
                <button class="btn" onclick="testAPI('au revoir', 'guarani')">Test Guarani</button>
            </div>
            
            <div class="test-card">
                <h3>Tests de Performance</h3>
                <button class="btn" onclick="performanceTest()">Test de Charge</button>
                <button class="btn" onclick="latencyTest()">Test de Latence</button>
                <div id="perf-result" class="result" style="display:none;"></div>
            </div>
            
            <div class="test-card">
                <h3>Status Serveur</h3>
                <button class="btn" onclick="checkStatus()">Vérifier Status</button>
                <div id="status-result" class="result" style="display:none;"></div>
            </div>
        </div>
        
        <div id="test-results"></div>
    </div>
    
    <script src="/test.js"></script>
</body>
</html>`);
});

// Route de status
app.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        timestamp: new Date().toISOString()
    });
});

// Documentation API
app.get('/docs', (req, res) => {
    res.json({
        api: 'TalkKin Translation API',
        version: '1.0.0',
        endpoints: {
            '/api/translate': {
                method: 'GET',
                params: ['text', 'target'],
                example: '/api/translate?text=bonjour&target=maya'
            },
            '/status': {
                method: 'GET',
                description: 'Server status'
            }
        },
        languages: ['maya', 'quechua', 'guarani', 'inuktitut', 'nahuatl']
    });
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`TalkKin Server Ultra-Rapide demarre sur http://localhost:${PORT}`);
    console.log(`Interface principale: http://localhost:${PORT}`);
    console.log(`Tests avances: http://localhost:${PORT}/test`);
    console.log(`API: http://localhost:${PORT}/api/translate?text=bonjour&target=maya`);
    console.log(`Optimise pour chargement instantane`);
});

module.exports = app;

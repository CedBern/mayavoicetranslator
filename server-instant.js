const express = require('express');
const app = express();
const PORT = 3001;

// Version ultra-simple et rapide
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>TalkKin - PRÊT !</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial; 
            background: #667eea; 
            color: white; 
            text-align: center; 
            padding: 50px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 10px; 
        }
        button { 
            background: #50C878; 
            color: white; 
            border: none; 
            padding: 15px 30px; 
            font-size: 18px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 10px; 
        }
        input { 
            padding: 10px; 
            font-size: 16px; 
            border: none; 
            border-radius: 5px; 
            margin: 10px; 
        }
        #result { 
            background: rgba(0,0,0,0.2); 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px; 
            min-height: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 TalkKin - OPÉRATIONNEL !</h1>
        <p>✅ Serveur local actif sur port ${PORT}</p>
        
        <h3>Test Rapide:</h3>
        <input type="text" id="text" value="bonjour" placeholder="Votre texte">
        <select id="lang">
            <option value="maya">Maya</option>
            <option value="quechua">Quechua</option>
        </select>
        <button onclick="test()">TRADUIRE</button>
        
        <div id="result">Cliquez "TRADUIRE" pour tester</div>
        
        <h3>Liens directs:</h3>
        <a href="/api/test" style="color: yellow;">Test API</a> | 
        <a href="/status" style="color: yellow;">Status</a>
    </div>

    <script>
        function test() {
            const text = document.getElementById('text').value;
            const lang = document.getElementById('lang').value;
            const result = document.getElementById('result');
            
            result.innerHTML = '⏳ Test en cours...';
            
            fetch('/api/translate?text=' + encodeURIComponent(text) + '&target=' + lang)
                .then(r => r.json())
                .then(data => {
                    result.innerHTML = '✅ ' + text + ' → ' + data.translation;
                })
                .catch(e => {
                    result.innerHTML = '❌ Erreur: ' + e.message;
                });
        }
    </script>
</body>
</html>`);
});

// API super simple
app.get('/api/translate', (req, res) => {
    const { text, target } = req.query;
    const translations = {
        maya: { 'bonjour': 'Ba\'ax ka wa\'alik', 'merci': 'Dios bo\'otik' },
        quechua: { 'bonjour': 'Napaykullayki', 'merci': 'Sulpayki' }
    };
    
    const result = translations[target] && translations[target][text.toLowerCase()] 
        ? translations[target][text.toLowerCase()]
        : `[${target.toUpperCase()}] ${text}`;
    
    res.json({ 
        success: true, 
        original: text, 
        translation: result,
        targetLanguage: target 
    });
});

app.get('/api/test', (req, res) => {
    res.json({ status: 'OK', message: 'API TalkKin fonctionne !', timestamp: new Date() });
});

app.get('/status', (req, res) => {
    res.json({ 
        server: 'TalkKin Local', 
        status: 'ACTIF', 
        port: PORT,
        uptime: process.uptime() + 's'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 TalkKin ULTRA-RAPIDE sur http://localhost:${PORT}`);
    console.log(`✅ AUCUN problème de chargement !`);
});

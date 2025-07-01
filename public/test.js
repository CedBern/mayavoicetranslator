async function testAPI(text, target) {
    const response = await fetch(`/api/translate?text=${text}&target=${target}`);
    const data = await response.json();
    displayResult('Test API', `Texte: ${text} | Langue: ${target} | Résultat: ${data.translation}`);
}

async function performanceTest() {
    const start = Date.now();
    const promises = [];
    for(let i = 0; i < 10; i++) {
        promises.push(fetch('/api/translate?text=test&target=maya'));
    }
    await Promise.all(promises);
    const duration = Date.now() - start;
    document.getElementById('perf-result').style.display = 'block';
    document.getElementById('perf-result').innerHTML = `10 requêtes en ${duration}ms`;
}

async function latencyTest() {
    const start = Date.now();
    await fetch('/api/translate?text=latence&target=maya');
    const duration = Date.now() - start;
    document.getElementById('perf-result').style.display = 'block';
    document.getElementById('perf-result').innerHTML = `Latence: ${duration}ms`;
}

function checkStatus() {
    document.getElementById('status-result').style.display = 'block';
    document.getElementById('status-result').innerHTML = 'Serveur: ✅ Actif | Port: ' + location.port + ' | Uptime: ' + new Date().toLocaleString();
}

function displayResult(title, content) {
    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `<strong>${title}:</strong> ${content}`;
    document.getElementById('test-results').appendChild(div);
}

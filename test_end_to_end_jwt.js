// Test end-to-end : login puis traduction protégée avec JWT
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const loginBody = { username: 'demo', password: 'demo123' };

async function main() {
    // 1. Login pour obtenir le token
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginBody)
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
        console.error('Échec login:', loginData);
        return;
    }
    console.log('Token JWT obtenu:', loginData.token);

    // 2. Appel API protégée avec le token
    const translateRes = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({ fromLang: 'fr', toLang: 'br', text: 'Merci beaucoup' })
    });
    const translateData = await translateRes.json();
    console.log('Réponse /api/translate:', translateData);
}

main();

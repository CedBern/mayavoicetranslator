/**
 * Exemple d'utilisation JavaScript/Node.js
 */

const fetch = require('node-fetch');

class MayaTranslatorClient {
    constructor(apiBaseUrl = 'http://localhost:3000/api') {
        this.apiBaseUrl = apiBaseUrl;
        this.token = null;
    }

    async authenticate(username, password) {
        const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            this.token = data.token;
            return data;
        }
        throw new Error(data.error);
    }

    async translate(text, fromLang, toLang) {
        const response = await fetch(`${this.apiBaseUrl}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ text, fromLang, toLang })
        });

        const data = await response.json();
        if (data.success) {
            return data.translation;
        }
        throw new Error(data.error);
    }

    async getSupportedLanguages() {
        const response = await fetch(`${this.apiBaseUrl}/languages`);
        const data = await response.json();
        return data.languages;
    }
}

// Utilisation
async function example() {
    const client = new MayaTranslatorClient();
    
    try {
        await client.authenticate('demo', 'demo123');
        
        const translation = await client.translate(
            'Bonjour le monde',
            'french',
            'maya-yucateco'
        );
        
        console.log('Traduction:', translation.translatedText);
        
        const languages = await client.getSupportedLanguages();
        console.log(`Langues supportées: ${languages.length}`);
        
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}

example();
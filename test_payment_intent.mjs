// Test automatisé de l'endpoint /api/payment/intent (compatible ES module)
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payment/intent';
const API_KEY = 'VOTRE_API_KEY_PREMIUM'; // Remplacer par une clé premium valide

async function testCreatePaymentIntent() {
    try {
        const response = await axios.post(
            API_URL,
            {
                amount: 10.0,
                currency: 'EUR',
                description: 'Test paiement MayaVoiceTranslator',
                userId: 'premium-user',
                method: 'card'
            },
            {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Réponse:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Erreur API:', error.response.data);
        } else {
            console.error('Erreur réseau:', error.message);
        }
    }
}

testCreatePaymentIntent();

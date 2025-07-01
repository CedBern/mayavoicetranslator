// Test de génération et vérification JWT en ES modules
import jwt from 'jsonwebtoken';

const jwtSecret = 'maya-translator-secret-key';
const payload = { username: 'demo', role: 'user' };

// Génération du token
const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
console.log('Token généré:', token);

// Vérification du token
try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Décodage réussi:', decoded);
} catch (err) {
    console.error('Erreur de vérification JWT:', err);
}

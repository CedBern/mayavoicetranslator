// Génération d'un token JWT admin pour l'API d'administration
const jwt = require('jsonwebtoken');
const secret = process.env.ADMIN_JWT_SECRET || 'changeme';
const token = jwt.sign({ admin: true, name: 'superadmin' }, secret, { expiresIn: '7d' });
console.log('Token JWT admin :\n');
console.log(token);

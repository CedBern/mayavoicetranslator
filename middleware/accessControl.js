// Middleware d'accès culturel basé sur acces_culturels.yaml
// Lecture dynamique du YAML, vérification des rôles, niveaux, authentification

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const configPath = path.join(__dirname, '../config/acces_culturels.yaml');
let accessConfig = null;

function loadConfig() {
  try {
    const file = fs.readFileSync(configPath, 'utf8');
    accessConfig = yaml.load(file).niveaux_acces;
  } catch (e) {
    console.error('Erreur chargement acces_culturels.yaml:', e);
    accessConfig = null;
  }
}

// Charger la config au démarrage
loadConfig();

// Middleware principal
function accessControl(level) {
  return (req, res, next) => {
    if (!accessConfig) loadConfig();
    const niveau = accessConfig[level];
    if (!niveau) return res.status(403).json({ error: 'Niveau d\'accès inconnu.' });

    // Récupérer l'utilisateur (ex: req.user)
    const user = req.user || {};
    const userRole = user.role || 'visiteur';
    const userAuth = user.auth || {};

    // Vérifier le rôle
    if (!niveau.roles_autorises.includes(userRole)) {
      return res.status(403).json({ error: 'Rôle non autorisé.' });
    }

    // Vérifier l'authentification spécifique
    if (niveau.authentification && niveau.authentification.length > 0) {
      for (const authReq of niveau.authentification) {
        const [key, value] = Object.entries(authReq)[0];
        if (!userAuth[key] || userAuth[key] !== value) {
          return res.status(403).json({ error: `Authentification requise: ${key}` });
        }
      }
    }

    // Si tout est OK
    next();
  };
}

module.exports = { accessControl, loadConfig };

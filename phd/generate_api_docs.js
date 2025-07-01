# Script de génération automatique de documentation API

# Utilisation : node generate_api_docs.js

const fs = require('fs');
const yaml = require('js-yaml');

const openapi = yaml.load(fs.readFileSync('docs/openapi_phonology.yaml', 'utf8'));
fs.writeFileSync('docs/api_phonology.md', JSON.stringify(openapi, null, 2));
console.log('Documentation API générée dans docs/api_phonology.md');

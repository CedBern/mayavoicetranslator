
import { MayaAPIServer } from '../api-server.js';

/**
 * Script pour générer la documentation OpenAPI.
 */
async function generate() {
  console.log('Lancement de la génération de la documentation API...');
  const server = new MayaAPIServer();
  try {
    await server.generateDocumentation();
    console.log('\nDocumentation générée avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('\nErreur lors de la génération de la documentation:', error);
    process.exit(1);
  }
}

generate();

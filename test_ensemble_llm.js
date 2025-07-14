// Test d'appel direct au microservice Python d'ensemble LLM depuis Node.js
const axios = require('axios');

async function testEnsembleLLM() {
  try {
    const response = await axios.post('http://localhost:8001/translate', {
      source_text: "Ba'ax ka wa'alik?",
      source_language: "yua",
      target_language: "es",
      dialect: "eastern_yucatan"
    });
    console.log('Réponse du microservice Ensemble LLM :', response.data);
  } catch (error) {
    console.error('Erreur lors de l\'appel au microservice Ensemble LLM :', error.message);
  }
}

testEnsembleLLM();

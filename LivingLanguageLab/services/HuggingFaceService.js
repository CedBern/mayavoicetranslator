// Service d'intégration Hugging Face Inference API
// Usage : prototypage, expérimentation, fallback
const axios = require('axios');

async function queryHuggingFace(model, inputs, apiKey) {
  const url = `https://api-inference.huggingface.co/models/${model}`;
  try {
    const res = await axios.post(url, { inputs }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return res.data;
  } catch (err) {
    throw new Error('Erreur HuggingFace: ' + err.message);
  }
}

module.exports = { queryHuggingFace };

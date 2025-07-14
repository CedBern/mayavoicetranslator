// Ajout d'un client Python pour déléguer l'IA à FastAPI
import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8001';

export async function analyzeContextViaPython(input) {
  const res = await axios.post(`${PYTHON_API_URL}/analyze-context`, input);
  return res.data;
}

export async function transliterateTextViaPython(text, context) {
  const res = await axios.post(`${PYTHON_API_URL}/transliterate`, { text, context });
  return res.data;
}

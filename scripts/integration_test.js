// Script de test d’intégration (Node.js ES module)
import axios from 'axios';

const runTests = async () => {
  try {
    const res = await axios.post('http://localhost:4001/translate', { text: 'Bonjour', src: 'fr', tgt: 'en' });
    console.log('NMT/LLM:', res.data);
    const ann = await axios.post('http://localhost:5001/annotate', { text: 'Bonjour' });
    console.log('Annotation:', ann.data);
    const fb = await axios.post('http://localhost:4002/feedback', { feedback: 'Test' });
    console.log('Feedback:', fb.data);
    // ...autres tests pour chaque microservice
  } catch (e) {
    console.error('Test échoué:', e.message);
  }
};

runTests();

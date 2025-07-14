// Exemple d'appel au backend Node.js pour activer le mode ensemble LLM depuis un frontend (fetch)

async function translateWithEnsembleLLM(text, fromLang, toLang) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      fromLang,
      toLang,
      options: { ensembleLLM: true }
    })
  });
  const data = await response.json();
  return data;
}

// Exemple d'utilisation
translateWithEnsembleLLM("Ba'ax ka wa'alik?", 'yua', 'es')
  .then(result => console.log('Résultat API Node.js (ensemble LLM):', result))
  .catch(err => console.error('Erreur:', err));

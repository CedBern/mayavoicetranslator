// test/test_contextTransliteration.js
// Script Node.js pour tester les endpoints d'analyse contextuelle et translittération

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/context';

async function testAnalyzeContext() {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: "In k'áatech a k'áat chi'ob",
      metadata: { source: 'oral', region: 'Yucatán' }
    })
  });
  const data = await response.json();
  console.log('Analyse contextuelle:', data);
  return data.context;
}

async function testTransliterateText(context) {
  const response = await fetch(`${API_URL}/transliterate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: "In k'áatech a k'áat chi'ob",
      context
    })
  });
  const data = await response.json();
  console.log('Translittération:', data);
}

(async () => {
  const context = await testAnalyzeContext();
  await testTransliterateText(context);
})();

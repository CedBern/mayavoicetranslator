// Tests unitaires pour auto-multimodal-pipeline.js
// Vérifie chaque modalité et la logique d'orchestration/fusion

import { autoMultimodalRecognition } from './auto-multimodal-pipeline.js';

async function runTests() {
  const fakeAudioGood = { length: 60000 }; // Simule un audio de bonne qualité
  const fakeAudioBad = { length: 5000 };   // Simule un audio de mauvaise qualité
  const fakeVideo = { length: 100000 };    // Simule une vidéo
  const options = { language: 'yua', enableSignLanguage: true };

  // 1. Test audio seul (bonne qualité)
  const res1 = await autoMultimodalRecognition({ audioInput: fakeAudioGood, videoInput: null, options });
  console.log('Test audio seul (bon) :', res1);

  // 2. Test audio seul (mauvaise qualité)
  const res2 = await autoMultimodalRecognition({ audioInput: fakeAudioBad, videoInput: null, options });
  console.log('Test audio seul (mauvais) :', res2);

  // 3. Test audio + vidéo (audio mauvais)
  const res3 = await autoMultimodalRecognition({ audioInput: fakeAudioBad, videoInput: fakeVideo, options });
  console.log('Test audio+vidéo (audio mauvais) :', res3);

  // 4. Test vidéo seule
  const res4 = await autoMultimodalRecognition({ audioInput: null, videoInput: fakeVideo, options });
  console.log('Test vidéo seule :', res4);

  // 5. Test vidéo seule avec langue des signes activée
  const res5 = await autoMultimodalRecognition({ audioInput: null, videoInput: fakeVideo, options: { ...options, enableSignLanguage: true } });
  console.log('Test vidéo seule (signes) :', res5);

  // 6. Test fallback (aucune entrée)
  const res6 = await autoMultimodalRecognition({ audioInput: null, videoInput: null, options });
  console.log('Test fallback :', res6);
}

runTests();

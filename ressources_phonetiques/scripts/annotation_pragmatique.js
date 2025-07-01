// annotation_pragmatique.js
// Annotation pragmatique automatisée – MayaVoiceTranslator
// Annoter chaque segment (texte ou audio) avec :
// - Acte de langage (demande, promesse, question, etc.)
// - Politesse (direct, indirect, atténué)
// - Contexte (formel, informel, interculturel)
// - Intention (explicite, implicite)
// - Niveau d’adaptation (registre, face, variation)

const fs = require('fs');

function detectSpeechAct(text) {
  // Heuristique simple, à remplacer par modèle ML/IA
  if (/\b(pouvez[- ]?vous|peux[- ]?tu|est[- ]?ce que)\b/i.test(text)) return 'question';
  if (/\b(promets|je vais|nous allons)\b/i.test(text)) return 'promesse';
  if (/\b(merci|je vous prie|s’il vous plaît)\b/i.test(text)) return 'politesse';
  if (/\b(ferme la porte|donne-moi|fais-le)\b/i.test(text)) return 'ordre';
  return 'autre';
}

function detectPoliteness(text) {
  if (/s’il vous plaît|je vous prie|pourriez-vous|auriez-vous/i.test(text)) return 'atténué';
  if (/tu dois|fais-le|immédiatement/i.test(text)) return 'direct';
  return 'neutre';
}

function annotateSegment(segment) {
  return {
    text: segment,
    acte: detectSpeechAct(segment),
    politesse: detectPoliteness(segment),
    intention: /\?/g.test(segment) ? 'explicite' : 'implicite',
    contexte: /Monsieur|Madame|Directeur|Professeur/i.test(segment) ? 'formel' : 'informel',
    adaptation: /argot|emoji|lol|mdr/i.test(segment) ? 'variation' : 'standard'
  };
}

function annotateCorpus(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  const annotations = lines.map(annotateSegment);
  fs.writeFileSync(filePath.replace('.txt', '_annotations.json'), JSON.stringify(annotations, null, 2));
  return annotations;
}

// Exemple d’utilisation :
// annotateCorpus('corpus/exemple.txt');

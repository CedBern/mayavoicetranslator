// feedback_explicable.js
// Module de feedback explicable (XAI) pour MayaVoiceTranslator
// Fournit à l’utilisateur une justification claire pour chaque décision clé (reconnaissance, correction, annotation)

function generateFeedback(decision, context) {
  let feedback = '';
  switch (decision.type) {
    case 'reconnaissance':
      feedback = `Reconnaissance vocale : le mot « ${decision.input} » a été reconnu comme « ${decision.output} » car ${context.reason}.`;
      break;
    case 'correction':
      feedback = `Correction proposée : « ${decision.input} » → « ${decision.suggestion} » (motif : ${context.rule}).`;
      break;
    case 'annotation':
      feedback = `Annotation : l’énoncé est classé comme « ${decision.annotation.acte} » (raison : ${context.pattern}).`;
      break;
    default:
      feedback = 'Décision prise par le système.';
  }
  if (context.confidence !== undefined) {
    feedback += ` (Confiance : ${Math.round(context.confidence * 100)}%)`;
  }
  return feedback;
}

// Exemple d’utilisation :
// const feedback = generateFeedback(
//   { type: 'reconnaissance', input: 'bâteau', output: 'bateau' },
//   { reason: 'le modèle phonétique a détecté une prononciation proche', confidence: 0.92 }
// );
// console.log(feedback);

module.exports = { generateFeedback };

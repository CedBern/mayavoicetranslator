// Script d'automatisation pour générer les audios des questions du test de niveau
// Utilise le service NeuralTTSService interne (open source, Hugging Face, etc.)
// Génère les fichiers dans assets/audio/test-niveau/<lang>_q<idx>.wav

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import NeuralTTSService from '../services/NeuralTTSService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Questions à vocaliser (extraites du test de niveau)
const questions = {
  yua: [
    '¿Cómo se dice “agua” en maya?',
    '¿Qué significa “paal” en maya?',
    '¿Cuál es el saludo tradicional maya?',
    '¿Cómo se dice “maíz” en maya?',
    '¿Qué significa “k’i’ik’” en maya?',
    '¿Cómo se dice “familia” en maya?',
    '¿Qué representa el color azul en la cultura maya?',
    '¿Qué instrumento musical es tradicional en la cultura maya?',
    '¿Qué significa el término “Itzamná” en la cosmovisión maya?',
    '¿Qué significa “naj” en maya?',
    '¿Cómo se pregunta “¿Cómo estás?” en maya?',
    '¿Qué significa “ko’olel” en maya?',
    '¿Cómo se dice “sol” en maya?',
    '¿Qué palabra maya se usa para “padre”?',
    'Completa la frase: "El ___ brilla en el cielo" (maya)',
    'Traduce al maya: “La casa es grande” (opciones)',
    '¿Qué significa “ja’ab” en maya?',
    'Escoge la opción correcta para “niña” en maya',
    'Escucha y elige la palabra correcta',
    'Escucha y elige la traducción correcta'
  ],
  es: [
    '¿Cómo se dice “gracias” en español?',
    '¿Qué significa “familia” en español?',
    '¿Cuál es el saludo más común?',
    '¿Cómo se dice “maíz” en español?',
    '¿Qué representa el color verde en la bandera de México?',
    '¿Qué es un “mariachi”?',
    '¿Qué significa la palabra “mestizaje”?',
    '¿Qué instrumento es típico en la música ranchera?',
    '¿Qué significa el término “sincretismo” en la cultura mexicana?',
    '¿Qué significa “herencia” en español?',
    '¿Cómo se pregunta “¿Cómo estás?” en español?',
    '¿Qué significa “amistad” en español?',
    '¿Cómo se dice “escuela” en español?',
    '¿Qué palabra se usa para “padre” en español?',
    'Completa la frase: "La ___ es importante"',
    'Traduce al español: “The house is big”',
    '¿Qué significa “paz” en español?',
    'Escoge la opción correcta para “niña” en español',
    'Escucha y elige la palabra correcta',
    'Escucha y elige la traducción correcta'
  ],
  en: [
    'How do you say “thank you” in English?',
    'What does “family” mean in English?',
    'What is the most common greeting?',
    'How do you say “water” in English?',
    'What color is associated with peace in the UK flag?',
    'What is a “pub”?',
    'What does “melting pot” mean in American culture?',
    'Which instrument is typical in jazz music?',
    'What does “syncretism” mean in culture?',
    'What does “heritage” mean in English?',
    'How do you ask “How are you?” in English?',
    'What does “friendship” mean in English?',
    'How do you say “school” in English?',
    'Which word is used for “father” in English?',
    'Complete the sentence: "The ___ is important"',
    'Translate to English: “La casa es grande”',
    'What does “peace” mean in English?',
    'Choose the correct option for “girl” in English',
    'Listen and choose the correct word',
    'Listen and choose the correct translation'
  ],
  fr: [
    'Comment dit-on “merci” en français ?',
    'Que signifie “famille” en français ?',
    'Quel est le salut le plus courant ?',
    'Comment dit-on “eau” en français ?',
    'Quelle couleur est associée à la paix sur le drapeau français ?',
    'Qu’est-ce qu’une “boulangerie” ?',
    'Que signifie “métissage” en France ?',
    'Quel instrument est typique dans la musique française ?',
    'Que signifie “syncrétisme” en culture ?',
    'Que signifie “héritage” en français ?',
    'Comment demander “Comment ça va ?” en français ?',
    'Que signifie “amitié” en français ?',
    'Comment dit-on “école” en français ?',
    'Quel mot est utilisé pour “père” en français ?',
    'Complète la phrase : "La ___ est importante"',
    'Traduire en français : “The house is big”',
    'Que signifie “paix” en français ?',
    'Choisis la bonne option pour “fille” en français',
    'Écoute et choisis le mot correct',
    'Écoute et choisis la bonne traduction'
  ]
};

async function main() {
  const tts = new NeuralTTSService();
  await tts.initialize();

  for (const [lang, qs] of Object.entries(questions)) {
    const outDir = path.join(__dirname, '../assets/audio/test-niveau/', lang);
    await fs.mkdir(outDir, { recursive: true });
    for (let i = 0; i < qs.length; i++) {
      const text = qs[i];
      try {
        const audioPath = await tts.synthesize(text, lang);
        const dest = path.join(outDir, `q${i + 1}.wav`);
        await fs.copyFile(audioPath, dest);
        console.log(`✅ [${lang}] Q${i + 1}: ${dest}`);
      } catch (e) {
        console.error(`❌ [${lang}] Q${i + 1}: ${e.message}`);
      }
    }
  }
  console.log('🎤 Génération audio terminée.');
}

main();

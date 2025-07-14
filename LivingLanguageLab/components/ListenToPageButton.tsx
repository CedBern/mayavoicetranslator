import React, { useState } from 'react';

/**
 * Bouton universel pour lire à voix haute le contenu d'une page (TTS)
 * Utilise l'API Web Speech (SpeechSynthesis)
 * Usage : placer <ListenToPageButton text={texte} /> en haut de chaque page
 */
export default function ListenToPageButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR'; // à adapter dynamiquement selon la langue de la page
    utter.rate = 1;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      aria-label={speaking ? 'Arrêter la lecture' : 'Écouter cette page'}
      onClick={handleSpeak}
      style={{
        background: '#fff',
        border: '2px solid #4c1',
        borderRadius: 8,
        padding: '0.5em 1em',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        margin: 8
      }}
    >
      <span role="img" aria-label="haut-parleur" style={{ fontSize: 24 }}>🔊</span>
      {speaking ? 'Arrêter' : 'Écouter cette page'}
    </button>
  );
}

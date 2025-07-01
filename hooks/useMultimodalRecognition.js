// Hook React pour consommer l'API multimodale
// Utilisable dans n'importe quel composant React/React Native

import { useState } from 'react';

export function useMultimodalRecognition() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Envoie audio/vidéo/options à l'API multimodale
   * @param {Object} params { audioInput, videoInput, options }
   */
  async function recognize({ audioInput, videoInput, options }) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('http://localhost:4000/recognize-multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioInput, videoInput, options })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { recognize, loading, result, error };
}

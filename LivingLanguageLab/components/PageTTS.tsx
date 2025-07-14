import React from 'react';
import ListenToPageButton from './ListenToPageButton';

/**
 * Composant décorateur pour ajouter le bouton TTS en haut de chaque page.
 * Usage : <PageTTS text={texte} children={...} />
 */
export default function PageTTS({ text, children }: { text: string, children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
      <ListenToPageButton text={text} />
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function ContextTransliterationWidget() {
  const [text, setText] = useState('');
  const [context, setContext] = useState(null);
  const [translit, setTranslit] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    const res = await fetch('/api/context/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setContext(data.context);
    setLoading(false);
  }

  async function handleTransliterate() {
    setLoading(true);
    const res = await fetch('/api/context/transliterate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, context })
    });
    const data = await res.json();
    setTranslit(data);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Translittération Maya intelligente</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4} style={{ width: '100%' }} placeholder="Entrez un texte maya à analyser..." />
      <div style={{ margin: '1em 0' }}>
        <button onClick={handleAnalyze} disabled={loading || !text}>Analyser le contexte</button>
        <button onClick={handleTransliterate} disabled={loading || !context}>Translitérer</button>
      </div>
      {context && (
        <pre style={{ background: '#f7f7f7', padding: 10 }}><b>Contexte détecté :</b> {JSON.stringify(context, null, 2)}</pre>
      )}
      {translit && (
        <pre style={{ background: '#e7fbe7', padding: 10 }}><b>Résultat translittéré :</b> {JSON.stringify(translit, null, 2)}</pre>
      )}
    </div>
  );
}

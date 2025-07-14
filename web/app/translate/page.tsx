
"use client";
import React, { useState } from 'react';

export default function TranslatePage() {
  const [source, setSource] = useState('');
  const [from, setFrom] = useState('fr');
  const [to, setTo] = useState('en');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call /api/translate with source, from, to
    setResult('Traduction simulée (à connecter à l’API)');
  };

  return (
    <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Traduction multilingue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Texte à traduire</label>
          <textarea value={source} onChange={e => setSource(e.target.value)} className="border rounded px-2 py-1 w-full" rows={3} />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block mb-1">De</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1">
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              {/* Ajouter d'autres langues */}
            </select>
          </div>
          <div>
            <label className="block mb-1">Vers</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1">
              <option value="en">Anglais</option>
              <option value="fr">Français</option>
              <option value="es">Espagnol</option>
              {/* Ajouter d'autres langues */}
            </select>
          </div>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Traduire</button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Résultat</h2>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}

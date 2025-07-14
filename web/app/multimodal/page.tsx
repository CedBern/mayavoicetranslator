
"use client";
import React, { useState } from 'react';

export default function MultimodalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [modality, setModality] = useState('audio');
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call /api/multimodal with file and modality
    setResult('Résultat simulé (à connecter à l’API)');
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reconnaissance multimodale</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Modalité</label>
          <select value={modality} onChange={e => setModality(e.target.value)} className="border rounded px-2 py-1">
            <option value="audio">Audio</option>
            <option value="image">Image (OCR)</option>
            <option value="video">Vidéo (labial, signes)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Fichier</label>
          <input type="file" accept="audio/*,image/*,video/*" onChange={handleFileChange} className="border rounded px-2 py-1" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Analyser</button>
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

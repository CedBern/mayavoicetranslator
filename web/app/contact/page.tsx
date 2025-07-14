
"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call /api/contact
    setSent(true);
  };

  return (
    <div className="max-w-lg mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Contact & Support</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Votre message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="border rounded px-2 py-1 w-full" rows={4} />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Envoyer</button>
      </form>
      {sent && (
        <div className="mt-6 p-4 bg-green-100 rounded text-green-700">Message envoyé ! Merci pour votre retour.</div>
      )}
    </div>
  );
}

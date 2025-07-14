
"use client";
import React, { useState } from 'react';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call /api/feedback
    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Donner un feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Votre feedback</label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="border rounded px-2 py-1 w-full" rows={4} />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Envoyer</button>
      </form>
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 rounded text-green-700">Merci pour votre feedback !</div>
      )}
    </div>
  );
}

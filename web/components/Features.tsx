import React from 'react';

const Features = () => (
  <section id="features" className="py-16 px-4 max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Fonctionnalités</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Traduction Multilingue</h3>
        <p>Traduisez instantanément entre des dizaines de langues autochtones et mondiales.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Synthèse Vocale</h3>
        <p>Écoutez la prononciation authentique grâce à la synthèse vocale avancée.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Apprentissage</h3>
        <p>Progressez avec des modules d'apprentissage adaptés à chaque langue et culture.</p>
      </div>
    </div>
  </section>
);

export default Features;

import React from 'react';

const Hero = () => (
  <section className="flex flex-col items-center justify-center min-h-[60vh] text-center pt-24 pb-12">
    <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 mb-4">TalkKin</h1>
    <p className="text-lg md:text-2xl text-gray-700 max-w-2xl mb-6">
      La plateforme moderne pour la traduction, la synthèse vocale et l'apprentissage des langues autochtones.
    </p>
    <a href="#features" className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition">Découvrir</a>
  </section>
);

export default Hero;

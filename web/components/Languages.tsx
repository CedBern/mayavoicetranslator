import React from 'react';

const Languages = () => (
  <section id="languages" className="py-16 px-4 max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Langues supportées</h2>
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <li>Français</li>
      <li>Español</li>
      <li>English</li>
      <li>Maya Yucatèque</li>
      <li>Quechua</li>
      <li>Guarani</li>
      <li>Nahuatl</li>
      <li>Aymara</li>
      <li>Basque</li>
      <li>Catalan</li>
      <li>Corse</li>
      <li>Ch'ti</li>
      {/* Ajoute d'autres langues ici */}
    </ul>
  </section>
);

export default Languages;

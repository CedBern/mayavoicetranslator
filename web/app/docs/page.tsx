
export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Documentation & Guides</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><a href="#guide" className="text-indigo-600 hover:underline">Guide de démarrage</a></li>
        <li><a href="#faq" className="text-indigo-600 hover:underline">FAQ</a></li>
        <li><a href="#onboarding" className="text-indigo-600 hover:underline">Onboarding interactif</a></li>
      </ul>
      <div className="mt-8">
        <h2 id="guide" className="font-semibold text-lg mb-2">Guide de démarrage</h2>
        <p>(Contenu à compléter)</p>
        <h2 id="faq" className="font-semibold text-lg mt-6 mb-2">FAQ</h2>
        <p>(Contenu à compléter)</p>
        <h2 id="onboarding" className="font-semibold text-lg mt-6 mb-2">Onboarding interactif</h2>
        <p>(Contenu à compléter)</p>
      </div>
    </div>
  );
}

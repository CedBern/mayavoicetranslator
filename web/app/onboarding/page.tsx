
export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Onboarding interactif</h1>
      <ol className="list-decimal pl-6 space-y-2">
        <li>Découvrir les fonctionnalités principales du projet</li>
        <li>Créer un compte utilisateur (à venir)</li>
        <li>Essayer la reconnaissance multimodale</li>
        <li>Donner un feedback sur un résultat</li>
        <li>Explorer la documentation et les guides</li>
      </ol>
      <div className="mt-6 text-gray-600">(Ce module sera enrichi avec des tutoriels interactifs et vidéos.)</div>
    </div>
  );
}

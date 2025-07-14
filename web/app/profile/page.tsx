
export default function ProfilePage() {
  // TODO: fetch user profile, preferences, history
  return (
    <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Informations personnelles</h2>
        <div className="bg-gray-100 p-2 rounded">(Données simulées)</div>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Préférences</h2>
        <div className="bg-gray-100 p-2 rounded">(Préférences simulées)</div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Historique d’utilisation</h2>
        <div className="bg-gray-100 p-2 rounded">(Historique simulé)</div>
      </div>
    </div>
  );
}

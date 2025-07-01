
export default function DashboardPage() {
  // TODO: fetch user stats, history, badges, preferences
  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord utilisateur</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Historique</h2>
        <div className="bg-gray-100 p-2 rounded">(Historique simulé)</div>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Badges</h2>
        <div className="bg-gray-100 p-2 rounded">(Badges simulés)</div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Préférences</h2>
        <div className="bg-gray-100 p-2 rounded">(Préférences simulées)</div>
      </div>
    </div>
  );
}

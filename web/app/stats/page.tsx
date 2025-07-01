
export default function StatsPage() {
  // TODO: fetch stats, leaderboard, badges
  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Statistiques & Badges</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Leaderboard</h2>
        <div className="bg-gray-100 p-2 rounded">(Leaderboard simulé)</div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Badges</h2>
        <div className="bg-gray-100 p-2 rounded">(Badges simulés)</div>
      </div>
    </div>
  );
}

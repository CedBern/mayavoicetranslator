
export default function AdminPage() {
  // TODO: fetch users, logs, stats, config
  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Administration</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Utilisateurs</h2>
        <div className="bg-gray-100 p-2 rounded">(Liste simulée)</div>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Logs</h2>
        <div className="bg-gray-100 p-2 rounded">(Logs simulés)</div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Configuration</h2>
        <div className="bg-gray-100 p-2 rounded">(Config simulée)</div>
      </div>
    </div>
  );
}

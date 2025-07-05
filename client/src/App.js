import { useEffect, useState } from 'react';
import './App.css';
import MissionList from './components/MissionList';
import MissionView from './components/MissionView';

function App() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    // Charger la liste des missions au démarrage
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => setMissions(data))
      .catch(err => console.error("Erreur lors du chargement des missions:", err));
  }, []);

  const handleSelectMission = (missionId) => {
    fetch(`/api/missions/${missionId}`)
      .then(res => res.json())
      .then(data => setSelectedMission(data))
      .catch(err => console.error(`Erreur lors du chargement de la mission ${missionId}:`, err));
  };

  const handleBackToList = () => {
    setSelectedMission(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>T'aan - Le portail d'apprentissage du Maya Yucatèque</h1>
        <h2>Propulsé par Co'ox Mayab</h2>
      </header>
      <main>
        {selectedMission ? (
          <MissionView mission={selectedMission} onBack={handleBackToList} />
        ) : (
          <MissionList missions={missions} onSelectMission={handleSelectMission} />
        )}
      </main>
      <footer className="App-footer">
        <p>© 2024 Co'ox Mayab. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;

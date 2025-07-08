import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import MissionList from './components/MissionList';
import MissionView from './components/MissionView';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [selectedMission, setSelectedMission] = useState(null);
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setError('');
      fetch('/v1/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => {
          if (res.status === 401) {
            handleLogout(); // Token is invalid or expired
            throw new Error('Sesión expirada. Por favor, inicie sesión de nuevo.');
          }
          if (!res.ok) {
            throw new Error(`Error HTTP! estado: ${res.status}`);
          }
          return res.json();
        })
        .then(data => setMissions(data))
        .catch(err => setError(err.message));
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setMissions([]);
  };

  const handleSelectMission = (missionId) => {
    // This part remains the same for now, but might need auth token later
    fetch(`/v1/tasks/${missionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => setSelectedMission(data))
      .catch(err => console.error(`Error al cargar la mision ${missionId}:`, err));
  };

  const handleBackToList = () => {
    setSelectedMission(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>T'aan - El portal de aprendizaje de Maya Yucateco</h1>
        <div className="header-controls">
          <span>Bienvenido, validador.</span>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </header>
      <main>
        {error && <p className="error-message">{error}</p>}
        {selectedMission ? (
          <MissionView mission={selectedMission} onBack={handleBackToList} />
        ) : (
          <MissionList missions={missions} onSelectMission={handleSelectMission} />
        )}
      </main>
      <footer className="App-footer">
        <p>© 2025 Co'ox Mayab. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

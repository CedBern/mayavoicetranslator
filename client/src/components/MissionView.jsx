import './MissionView.css';

function MissionView({ mission, onBack }) {
  if (!mission) return null;

  return (
    <div className="mission-view-container">
      <button onClick={onBack} className="back-button">Volver a la lista</button>
      <h2>{mission.title}</h2>
      <p className="mission-description">{mission.description}</p>
      <div className="mission-level">Nivel MCER: {mission.cefr_level}</div>
      
      <h3>Contenido de la misión</h3>
      <div className="mission-content">
        {mission.content.map((item, index) => (
          <div key={index} className="mission-content-item">
            <h4>{item.type}</h4>
            <p>Maya: {item.maya}</p>
            <p>Español: {item.es}</p>
            {item.audio_path && (
              <audio controls src={`/content/audio/${item.audio_path}`}>
                Tu navegador no soporta el elemento de audio.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MissionView;

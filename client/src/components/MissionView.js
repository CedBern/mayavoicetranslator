import './MissionView.css';

function MissionView({ mission, onBack }) {
  if (!mission) return null;

  return (
    <div className="mission-view-container">
      <button onClick={onBack} className="back-button">Retour à la liste</button>
      <h2>{mission.title}</h2>
      <p className="mission-description">{mission.description}</p>
      <div className="mission-level">Niveau CECRL: {mission.cefr_level}</div>
      
      <h3>Contenu de la mission</h3>
      <div className="mission-content">
        {mission.content.map((item, index) => (
          <div key={index} className="mission-content-item">
            <h4>{item.type}</h4>
            <p>Maya: {item.maya}</p>
            <p>Français: {item.fr}</p>
            {item.audio_path && (
              <audio controls src={`/content/audio/${item.audio_path}`}>
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MissionView;

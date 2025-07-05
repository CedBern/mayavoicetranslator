import './MissionList.css';

function MissionList({ missions, onSelectMission }) {
  return (
    <div className="mission-list-container">
      <h2>Missions Pédagogiques</h2>
      <p>Sélectionnez une mission pour commencer votre apprentissage.</p>
      <ul className="mission-list">
        {missions.map(mission => (
          <li key={mission.id} className="mission-item" onClick={() => onSelectMission(mission.id)}>
            <div className="mission-title">{mission.title}</div>
            <div className="mission-description">{mission.description}</div>
            <div className="mission-level">Niveau CECRL: {mission.cefr_level}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissionList;

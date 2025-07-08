import './MissionList.css';

function MissionList({ missions, onSelectMission }) {
  return (
    <div className="mission-list-container">
      <h2>Misiones Pedagógicas</h2>
      <p>Selecciona una misión para comenzar tu aprendizaje.</p>
      <ul className="mission-list">
        {missions.map(mission => (
          <li key={mission.id} className="mission-item" onClick={() => onSelectMission(mission.id)}>
            <div className="mission-title">{mission.title}</div>
            <div className="mission-description">{mission.description}</div>
            <div className="mission-level">Nivel MCER: {mission.cefr_level}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissionList;

function MissionsPanel({ missions, onComplete }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Missions</h2>

      {missions.map((mission) => (
        <div
          key={mission.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h3 style={{ margin: "0 0 5px 0" }}>
            {mission.title}
          </h3>

          <p style={{ margin: "0 0 10px 0" }}>
            Reward: {mission.xp} XP
          </p>

          <button onClick={() => onComplete(mission.xp)}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

export default MissionsPanel;
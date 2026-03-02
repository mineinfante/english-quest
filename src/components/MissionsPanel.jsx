function MissionsPanel({ t, missions, onComplete }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>{t.panels.missionsTitle}</h2>

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
            {t.labels.reward}: {mission.xp} XP
          </p>

          <button onClick={() => onComplete(mission.xp)}>
            {t.buttons.complete}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MissionsPanel;
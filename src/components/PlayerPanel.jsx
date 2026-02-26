
function PlayerPanel({ xp, level, currentLevelXP, progressPercent, onGainXp }) {
  return (
    <div
        style={{
        backgroundColor: "#e2e8f0",
        color: "#1e293b",
        padding: "24px",
        borderRadius: "16px",
        marginTop: "30px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
        maxWidth: "420px"
        }}
    >
        <h2>Player Status</h2>
        <h2 style={{ marginBottom: "4px" }}>
            Level {level}
        </h2>
        <p>Total XP: {xp}</p>

        <div
        style={{
            height: "10px",
            backgroundColor: "#cbd5e1",
            borderRadius: "8px",
            overflow: "hidden",
            marginTop: "12px"
        }}
        >
        <div
            style={{
            width: `${progressPercent}%`,
            height: "100%",
            backgroundColor: "#3b82f6",
            transition: "width 0.4s ease"
            }}
        />
        </div>

        <p style={{ marginTop: "6px", fontSize: "14px" }}>
        {currentLevelXP} / 100 XP
        </p>

        <button onClick={onGainXp}>
            Gain 10 XP
        </button>
    </div>
  )
}

export default PlayerPanel
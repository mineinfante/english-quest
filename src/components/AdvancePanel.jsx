export default function AdvancePanel({
  currentAdvance,
  activeVivencia,
  activeConquista,
  levelState,
  isAdvanceRunning,
  setIsAdvanceRunning,
  advanceProgress,
  onStartAdvance,
  manualScore,
  setManualScore
}) {

  if (!currentAdvance) {
    return null
  }

  const isStarted = advanceProgress?.started === true

  return (
    <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

      {/* SUMMARY */}
      {!isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            Advance Preview
          </h2>

          <div className="advance-content">
            <p><strong>ID:</strong> {currentAdvance.id}</p>
            <p><strong>Objective:</strong> {currentAdvance.objective}</p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <p><strong>Vivencia:</strong> {activeVivencia}</p>
            <p><strong>Conquista:</strong> {activeConquista}</p>
            <p><strong>XP:</strong> {levelState?.xp ?? 0}</p>

            <div style={{ marginTop: "20px" }}>
              <button
                className="tab-button active"
                onClick={() => {
                  if (!isStarted) {
                    onStartAdvance()
                  }
                  setIsAdvanceRunning(true)
                }}
              >
                {isStarted ? "Continue" : "Start Advance"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* WORKSPACE */}
      {isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            Advance Workspace
          </h2>

          <div className="advance-content">
            <p style={{ opacity: 0.7 }}>
              LLM content will appear here.
            </p>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                minHeight: "150px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)"
              }}
            >
              User response area (coming next step)
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>
                Manual Quiz Score (0–100)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={manualScore}
                onChange={(e) => setManualScore(e.target.value)}
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  width: "100%"
                }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                className="tab-button"
                onClick={() => setIsAdvanceRunning(false)}
              >
                Back to Summary
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
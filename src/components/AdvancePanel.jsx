import ConquestCompletionPanel from "./ConquestCompletionPanel"

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
  setManualScore,
  isDayEvaluation,
  examScore,
  setExamScore,
  handleSubmitDayExam,
  handleSubmitFinalExam,
  isFinalEvaluationDay,
  vivenciasList,
  conquistasList,
  setActiveVivencia,
  setActiveConquista
}) {

  if (!currentAdvance) {
    return null
  }

  if (isDayEvaluation) {
    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Day Final Exam
            </h2>

            <div className="advance-content">
              <p>
                This is the official evaluation of the day.
              </p>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="tab-button active"
                  onClick={() => setIsAdvanceRunning(true)}
                >
                  Start Exam
                </button>
              </div>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Day Final Exam
            </h2>

            <div className="advance-content">

              <p style={{ opacity: 0.7 }}>
                Submit your final score for this day.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  Exam Score (0–100)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examScore}
                  onChange={(e) => setExamScore(e.target.value)}
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

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitDayExam}
                >
                  Submit Exam
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  Back
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    )
  }

  if (isFinalEvaluationDay) {

    if (levelState?.finalExam?.passed) {
      return (
        <ConquestCompletionPanel
          vivenciaId={activeVivencia}
          conquistaId={activeConquista}
          onNextConquista={() => {
            const currentIndex = conquistasList.indexOf(activeConquista)
            const nextConquista = conquistasList[currentIndex + 1]

            if (nextConquista) {
              setActiveConquista(nextConquista)
            }
          }}
          onNextVivencia={() => {
            const currentIndex = vivenciasList.indexOf(activeVivencia)
            const nextVivencia = vivenciasList[currentIndex + 1]

            if (!nextVivencia) return

            // Buscar primera conquista pendiente en la nueva vivencia
            const nextVivenciaState = levelState?.vivencias?.[nextVivencia]

            let firstPendingConquista = conquistasList[0]

            for (let conquista of conquistasList) {
              const conquistaState = nextVivenciaState?.[conquista]

              if (!conquistaState?.finalExam?.passed) {
                firstPendingConquista = conquista
                break
              }
            }

            setActiveVivencia(nextVivencia)
            setActiveConquista(firstPendingConquista)
          }}

        />
      )
    }

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Evaluación Final
            </h2>

            <div className="advance-content">
              <p>
                Esta es la evaluación oficial de la conquista.
              </p>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="tab-button active"
                  onClick={() => setIsAdvanceRunning(true)}
                >
                  Iniciar Evaluación
                </button>
              </div>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Evaluación Final
            </h2>

            <div className="advance-content">

              <p style={{ opacity: 0.7 }}>
                Ingresa tu puntaje final (0–100)
              </p>

              {levelState?.finalExam?.attempts > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <p>
                    Intentos: {levelState.finalExam.attempts}
                  </p>

                  <p>
                    Último puntaje: {levelState.finalExam.score}
                  </p>

                  <p style={{
                    color: levelState.finalExam.passed ? "#22c55e" : "#f97316",
                    fontWeight: "600"
                  }}>
                    {levelState.finalExam.passed
                      ? "Aprobado"
                      : "No aprobado"}
                  </p>
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  Puntaje
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examScore}
                  onChange={(e) => setExamScore(e.target.value)}
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

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitFinalExam}
                >
                  Enviar Evaluación
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  Volver
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    )
  }

  const isStarted = advanceProgress?.started === true

  return (
    <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

      {/* SUMMARY */}
      {!isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            {isDayEvaluation ? "Day Final Exam" : "Advance Preview"}
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
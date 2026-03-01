import ConquestCompletionPanel from "./ConquestCompletionPanel"
import { UI_TEXT } from "../config/uiText"
import { useEffect } from "react"

export default function AdvancePanel({
  currentAdvance,
  activeVivencia,
  activeConquista,
  levelState,
  activeDay,
  blockedNavigation,
  setBlockedNavigation,
  setActiveDay,
  isLockedForEditing,
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
  handleSubmitReview,
  isFinalEvaluationDay,
  needsReview,
  isReviewDay,
  vivenciasList,
  conquistasList,
  setActiveVivencia,
  setActiveConquista
}) {

  useEffect(() => {
    setIsAdvanceRunning(false)
  }, [activeDay])

  if (!currentAdvance) {
    return null
  }

  if (blockedNavigation && !levelState?.finalExam?.passed) {
    return (
      <div className="advance-card fade-container summary">
        <h2 className="advance-title">
          Conquista no completada
        </h2>

        <div className="advance-content">
          <p>
            No has concluido la conquista actual. 
            Debes aprobar el Assessment antes de poder avanzar.
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              className="tab-button active"
              onClick={() => {
                setActiveDay("final-evaluation")
                setIsAdvanceRunning(false)
                setExamScore("")
                setBlockedNavigation(null)
              }}
            >
              Ir al Assessment
            </button>

            <button
              className="tab-button"
              onClick={() => {
                setBlockedNavigation(null)
              }}
            >
              Permanecer aquí
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isDayEvaluation) {
    const structuralDay = activeDay
    const examData = levelState?.dayExams?.[structuralDay]

    const alreadyPassed = examData?.passed === true

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>
        
        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Day Final Exam
            </h2>

            <div className="advance-content">

              {alreadyPassed ? (
                <>
                  <p>This assessment has already been approved.</p>

                  <div style={{ marginTop: "12px" }}>
                    <p>Attempts: {examData.attempts}</p>
                    <p>Final Score: {examData.score}</p>
                  </div>
                </>
              ) : (
                <>
                  <p>This is the official evaluation of the day.</p>

                  <div style={{ marginTop: "20px" }}>
                    <button
                      className="tab-button active"
                      onClick={() => setIsAdvanceRunning(true)}
                    >
                      Start Exam
                    </button>
                  </div>
                </>
              )}

            </div>
          </>
        )}

        {isAdvanceRunning && !alreadyPassed && (
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

  if (isReviewDay) {
    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Review
            </h2>

            <div className="advance-content">
              <div style={{ marginTop: "20px" }}>
                <button
                  className="tab-button active"
                  onClick={() => setIsAdvanceRunning(true)}
                >
                  Start Review
                </button>
              </div>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              Review
            </h2>

            <div className="advance-content">

              <p style={{ opacity: 0.7 }}>
                Enter your Review score (0–100)
              </p>

              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  Review Score
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

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitReview}
                >
                  Submit Review
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

  if (activeDay === "final-evaluation") {

    // 🔴 Forzar salida de workspace si necesita review
    if (needsReview && isAdvanceRunning) {
      setIsAdvanceRunning(false)
    }

    if (levelState?.finalExam?.passed) {

      // 🟢 Solo mostrar botones si acaba de completarse
      if (levelState?.justCompletedConquest && !blockedNavigation) {
        return (
          <ConquestCompletionPanel
            vivenciaId={activeVivencia}
            conquistaId={activeConquista}
            onNextConquista={() => {
              const currentIndex = conquistasList.indexOf(activeConquista)
              const nextConquista = conquistasList[currentIndex + 1]

              if (nextConquista) {
                setActiveConquista(nextConquista)
                setActiveDay(1)
              }
            }}
            onNextVivencia={() => {
              const currentIndex = vivenciasList.indexOf(activeVivencia)
              const nextVivencia = vivenciasList[currentIndex + 1]

              if (!nextVivencia) return

              setActiveVivencia(nextVivencia)
              setActiveConquista(conquistasList[0])
              setActiveDay(1)
            }}
          />
        )
      }

      // 🔵 Si no es recién completada, solo mensaje informativo
      return (
        <div className="advance-card fade-container summary">
          <h2 className="advance-title">
            Assessment Already Approved
          </h2>

          <div className="advance-content">
            <p>
              This conquest has already been successfully completed.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.panels.finalAssessmentTitle}
            </h2>

            <div className="advance-content">
              <p>
                Esta es la evaluación oficial de la conquista.
              </p>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="tab-button active"
                  onClick={() => {
                    if (needsReview) {
                      setActiveDay("review-day")
                    } else {
                      setIsAdvanceRunning(true)
                    }
                  }}
                >
                  {needsReview
                    ? UI_TEXT.en.buttons.review
                    : UI_TEXT.en.buttons.startAssessment
                  }
                </button>
              </div>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.panels.finalAssessmentTitle}
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
                  onClick={() => {
                    if (needsReview) {
                      setActiveDay("review-day")
                    } else {
                      handleSubmitFinalExam()
                    }
                  }}
                >
                  {needsReview
                    ? UI_TEXT.en.buttons.review
                    : UI_TEXT.en.buttons.submitAssessment}
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  {UI_TEXT.en.buttons.back}
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
                disabled={isLockedForEditing}
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
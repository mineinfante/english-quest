import ConquestCompletionPanel from "./ConquestCompletionPanel"
import { UI_TEXT } from "../config/uiText"
import { useEffect } from "react"
import { PEDAGOGICAL_TEXT } from "../content/pedagogicalText"

function resolveNestedKey(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

export default function AdvancePanel({
  t,
  currentLanguage,
  currentAdvance,
  activeVivencia,
  activeConquista,
  levelState,
  activeDay,
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
  needsReview,
  isReviewDay,
  vivenciasList,
  conquistasList,
  setActiveVivencia,
  setActiveConquista
}) {

  useEffect(() => {
    // 🔴 No cerrar workspace automáticamente en review-day
    if (activeDay !== "review-day") {
      setIsAdvanceRunning(false)
    }
  }, [activeDay])

  if (!currentAdvance && activeDay !== "final-evaluation" && !isReviewDay) return null

  /* ===================================================== */
  /* ================= DAY EVALUATION ==================== */
  /* ===================================================== */

  if (isDayEvaluation) {

    const structuralDay = activeDay
    const examData = levelState?.dayExams?.[structuralDay]
    const alreadyPassed = examData?.passed === true

    const hasFailed =
      examData?.attempts > 0 &&
      examData?.passed === false

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {t.panels.dayAssessmentTitle}
            </h2>

          {examData && (alreadyPassed || hasFailed) && (
            <div
              className={`status-badge ${
                alreadyPassed
                  ? "status-badge--completed"
                  : "status-badge--failed"
              }`}
            >
              {
                alreadyPassed
                  ? t.labels.statusCompleted
                  : t.labels.statusPendingEvaluation
              }
            </div>
          )}

            <div className="advance-content">
              {alreadyPassed ? (
                <>
                  <p>{t.messages.alreadyApproved}</p>
                  <div style={{ marginTop: "12px" }}>
                    <p>{t.labels.attempts}: {examData.attempts}</p>
                    <p>{t.labels.finalScore}: {examData.score}</p>
                  </div>
                </>
              ) : (
                <>
                  <p>{t.messages.dayAssessmentDescription}</p>
                  <div style={{ marginTop: "20px" }}>
                    <button
                      className="tab-button active"
                      onClick={() => setIsAdvanceRunning(true)}
                    >
                      {t.buttons.startAssessment}
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
              {t.panels.dayAssessmentTitle}
            </h2>

            <div className="advance-content">
              <p style={{ opacity: 0.7 }}>
                {t.messages.enterExamScore}
              </p>

              <label style={{ display: "block", marginBottom: "6px" }}>
                {t.labels.examScore}
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={examScore}
                onChange={(e) => setExamScore(e.target.value)}
              />

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitDayExam}
                >
                  {t.buttons.submitAssessment}
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  {t.buttons.back}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  /* ===================================================== */
  /* ================= REVIEW ============================ */
  /* ===================================================== */

  if (isReviewDay) {

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {t.days.review}
            </h2>

            <div className="advance-content">
              <button
                className="tab-button active"
                onClick={() => setIsAdvanceRunning(true)}
              >
                {t.buttons.review}
              </button>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {t.days.review}
            </h2>

            <div className="advance-content">

              <label style={{ display: "block", marginBottom: "6px" }}>
                {t.labels.reviewScore}
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={manualScore}
                onChange={(e) => setManualScore(e.target.value)}
              />

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitReview}
                >
                  {t.buttons.submitAssessment}
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  {t.buttons.back}
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    )
  }

  /* ===================================================== */
  /* ================= FINAL EVALUATION ================== */
  /* ===================================================== */

  if (activeDay === "final-evaluation") {

    const finalExam = levelState?.finalExam || { passed: false, attempts: 0 }

    if (finalExam?.passed && !levelState?.justCompletedConquest) {
      return (
        <div className="advance-card fade-container summary">
          <h2 className="advance-title">
            {t.panels.finalAssessmentTitle}
          </h2>

          <div className="advance-content">
            <p>{t.labels.statusCompleted}</p>
          </div>
        </div>
      )
    }

    if (finalExam?.passed && levelState?.justCompletedConquest) {
      return (
        <ConquestCompletionPanel
          t={t}
          vivenciaId={activeVivencia}
          conquistaId={activeConquista}
          onNextConquista={() => {
            const currentIndex = conquistasList.indexOf(activeConquista)
            const nextConquista = conquistasList[currentIndex + 1]
            if (nextConquista) {
              setActiveConquista(nextConquista)
              setActiveDay(1)
              setIsAdvanceRunning(false)
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

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {finalExam && (finalExam.passed || finalExam.attempts > 0) && (
          <div
            className={`status-badge ${
              finalExam.passed
                ? "status-badge--completed"
                : "status-badge--failed"
            }`}
          >
            {
              finalExam.passed
                ? t.labels.statusCompleted
                : t.labels.statusPendingEvaluation
            }
          </div>
        )}

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {t.panels.finalAssessmentTitle}
            </h2>

            <div className="advance-content">
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
                  ? t.buttons.review
                  : t.buttons.startAssessment}
              </button>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {t.panels.finalAssessmentTitle}
            </h2>

            <div className="advance-content">

              <label>
                {t.labels.examScore}
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={examScore}
                onChange={(e) => setExamScore(e.target.value)}
              />

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="tab-button active"
                  onClick={handleSubmitFinalExam}
                >
                  {t.buttons.submitAssessment}
                </button>

                <button
                  className="tab-button"
                  onClick={() => setIsAdvanceRunning(false)}
                >
                  {t.buttons.back}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  /* ===================================================== */
  /* ================= NORMAL ADVANCE ==================== */
  /* ===================================================== */

  const progress = advanceProgress || {}
  const isStarted = progress.started === true
  const isFinished = progress.finished === true
  const isPassed = progress.passed === true

  let badgeClass = null

  if (isFinished && isPassed) {
    badgeClass = "status-badge--completed"
  } else if (isFinished && !isPassed) {
    badgeClass = "status-badge--failed"
  } else if (isStarted) {
    badgeClass = "status-badge--started"
  }

  return (
    <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

      {badgeClass && (
        <div className={`status-badge ${badgeClass}`}>
          {
            badgeClass === "status-badge--completed"
              ? t.labels.statusCompleted
              : badgeClass === "status-badge--failed"
              ? t.labels.statusPendingEvaluation
              : t.labels.statusStarted
          }
        </div>
      )}

      {!isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            {t.panels.advancePreview}
          </h2>

          <div className="advance-content">
            <p><strong>ID:</strong> {currentAdvance.id}</p>
            <p>
              <strong>{t.labels.objective}:</strong>{" "}
              {
                PEDAGOGICAL_TEXT[currentLanguage]?.[activeConquista]?.[
                  currentAdvance.order - 1
                ]?.objective
              }
            </p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <button
              className="tab-button active"
              onClick={() => {
                if (!isStarted) onStartAdvance()
                setIsAdvanceRunning(true)
              }}
            >
              {isStarted
                ? t.buttons.continue
                : t.buttons.startAdvance}
            </button>
          </div>
        </>
      )}

      {isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            {t.panels.advanceWorkspace}
          </h2>

          <div className="advance-content">

            <label>
              {t.labels.manualScore}
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={manualScore}
              onChange={(e) => setManualScore(e.target.value)}
              disabled={isLockedForEditing}
            />

            <div style={{ marginTop: "20px" }}>
              <button
                className="tab-button"
                onClick={() => setIsAdvanceRunning(false)}
              >
                {t.buttons.back}
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
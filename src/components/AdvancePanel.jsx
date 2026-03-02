import ConquestCompletionPanel from "./ConquestCompletionPanel"
import { UI_TEXT } from "../config/uiText"
import { useEffect } from "react"

export default function AdvancePanel({
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
    setIsAdvanceRunning(false)
  }, [activeDay])

  if (!currentAdvance) return null

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
              {UI_TEXT.en.panels.dayAssessmentTitle}
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
                  ? UI_TEXT.en.labels.statusCompleted
                  : UI_TEXT.en.labels.statusPendingEvaluation
              }
            </div>
          )}

            <div className="advance-content">
              {alreadyPassed ? (
                <>
                  <p>{UI_TEXT.en.messages.alreadyApproved}</p>
                  <div style={{ marginTop: "12px" }}>
                    <p>{UI_TEXT.en.labels.attempts}: {examData.attempts}</p>
                    <p>{UI_TEXT.en.labels.finalScore}: {examData.score}</p>
                  </div>
                </>
              ) : (
                <>
                  <p>{UI_TEXT.en.messages.dayAssessmentDescription}</p>
                  <div style={{ marginTop: "20px" }}>
                    <button
                      className="tab-button active"
                      onClick={() => setIsAdvanceRunning(true)}
                    >
                      {UI_TEXT.en.buttons.startAssessment}
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
              {UI_TEXT.en.panels.dayAssessmentTitle}
            </h2>

            <div className="advance-content">
              <p style={{ opacity: 0.7 }}>
                {UI_TEXT.en.messages.enterExamScore}
              </p>

              <label style={{ display: "block", marginBottom: "6px" }}>
                {UI_TEXT.en.labels.examScore}
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
                  {UI_TEXT.en.buttons.submitAssessment}
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

  /* ===================================================== */
  /* ================= REVIEW ============================ */
  /* ===================================================== */

  if (isReviewDay) {

    return (
      <div className={`advance-card fade-container ${isAdvanceRunning ? "workspace" : "summary"}`}>

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.days.review}
            </h2>

            <div className="advance-content">
              <button
                className="tab-button active"
                onClick={() => setIsAdvanceRunning(true)}
              >
                {UI_TEXT.en.buttons.review}
              </button>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.days.review}
            </h2>

            <div className="advance-content">

              <label style={{ display: "block", marginBottom: "6px" }}>
                {UI_TEXT.en.labels.reviewScore}
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
                  {UI_TEXT.en.buttons.submitAssessment}
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

  /* ===================================================== */
  /* ================= FINAL EVALUATION ================== */
  /* ===================================================== */

  if (activeDay === "final-evaluation") {
console.log("=== FINAL BLOCK ENTERED ===")
console.log("activeDay:", activeDay)
console.log("isReviewDay:", isReviewDay)
console.log("needsReview:", needsReview)
console.log("finalExam:", levelState?.finalExam)

    const finalExam = levelState?.finalExam || { passed: false, attempts: 0 }

    if (finalExam?.passed && levelState?.justCompletedConquest) {
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
                ? UI_TEXT.en.labels.statusCompleted
                : UI_TEXT.en.labels.statusPendingEvaluation
            }
          </div>
        )}

        {!isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.panels.finalAssessmentTitle}
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
                  ? UI_TEXT.en.buttons.review
                  : UI_TEXT.en.buttons.startAssessment}
              </button>
            </div>
          </>
        )}

        {isAdvanceRunning && (
          <>
            <h2 className="advance-title">
              {UI_TEXT.en.panels.finalAssessmentTitle}
            </h2>

            <div className="advance-content">

              <label>
                {UI_TEXT.en.labels.examScore}
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
                  {UI_TEXT.en.buttons.submitAssessment}
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
              ? UI_TEXT.en.labels.statusCompleted
              : badgeClass === "status-badge--failed"
              ? UI_TEXT.en.labels.statusPendingEvaluation
              : UI_TEXT.en.labels.statusStarted
          }
        </div>
      )}

      {!isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            {UI_TEXT.en.panels.advancePreview}
          </h2>

          <div className="advance-content">
            <p><strong>ID:</strong> {currentAdvance.id}</p>
            <p><strong>{UI_TEXT.en.labels.objective}:</strong> {currentAdvance.objective}</p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <button
              className="tab-button active"
              onClick={() => {
                if (!isStarted) onStartAdvance()
                setIsAdvanceRunning(true)
              }}
            >
              {isStarted
                ? UI_TEXT.en.buttons.continue
                : UI_TEXT.en.buttons.startAdvance}
            </button>
          </div>
        </>
      )}

      {isAdvanceRunning && (
        <>
          <h2 className="advance-title">
            {UI_TEXT.en.panels.advanceWorkspace}
          </h2>

          <div className="advance-content">

            <label>
              {UI_TEXT.en.labels.manualScore}
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
                {UI_TEXT.en.buttons.back}
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
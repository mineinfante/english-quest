import { useState, useEffect } from "react"
import PlayerPanel from "./components/PlayerPanel"
import MissionsPanel from "./components/MissionsPanel"
import { CONTENT } from "./content"
import Header from "./components/Header"
import AdvancePanel from "./components/AdvancePanel.jsx"
import { createInitialPlayer } from "./state/createInitialPlayer"
import { resolvePassingScore } from "./engine/passingScoreEngine.js"
import { resolveEvaluationMessage } from "./engine/evaluationMessageEngine"

function App() {

  // =============================
  // 1️⃣ Estado principal del jugador
  // =============================
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem("player")
    if (saved) return JSON.parse(saved)
    return createInitialPlayer()
  })

  // =============================
  // 2️⃣ Estados de UI
  // =============================
  const [activeVivencia, setActiveVivencia] = useState("family")
  const [activeConquista, setActiveConquista] = useState("A1")
  const [isAdvanceRunning, setIsAdvanceRunning] = useState(false)
  const [manualScore, setManualScore] = useState("")
  const [examScore, setExamScore] = useState("")

  // =============================
  // 3️⃣ Derivados
  // =============================
  const levelState =
    player.vivencias[activeVivencia]?.[activeConquista]

  const dayExamPassingScore =
    CONTENT[activeVivencia]?.[activeConquista]?.meta?.dayExamPassingScore

console.log("Day Exam Passing Score:", dayExamPassingScore)    
console.log("Day Exams:", levelState?.dayExams)

  const currentDay = levelState?.currentDay ?? 1

  const isFinalEvaluationDay =
    currentDay === "final-evaluation"

  // =============================
  // 🟣 Conquista Final Exam Aprobada
  // =============================
  const isConquistaFinalExamPassed =
    levelState?.finalExam?.passed === true
    
  // 🟣 E3.1 — Needs Review (derived, no persistido)
  const needsReview =
    levelState?.finalExam?.attempts > 0 &&
    levelState?.finalExam?.passed === false

  const maxDayUnlocked =
    Math.max(levelState?.maxDayUnlocked ?? 1, currentDay)

  const currentAdvanceIndex =
    levelState?.currentAdvanceIndex ?? 0

  const maxAdvanceUnlocked =
    Math.max(
      levelState?.maxAdvanceUnlocked ?? 0,
      currentAdvanceIndex
    )

  const contentAdvances =
    CONTENT[activeVivencia]?.[activeConquista]?.advances ?? []

  const advancesOrder =
    levelState?.advancesOrder ?? []

  const advances =
    advancesOrder.length > 0
      ? advancesOrder
          .map((id) =>
            contentAdvances.find((a) => a.id === id)
          )
          .filter(Boolean)
      : contentAdvances

  // =============================
  // 🟣 Conquista completada
  // =============================
  const minDaysRequired =
    CONTENT[activeVivencia]?.[activeConquista]?.meta?.minDaysRequired ?? 1

  const isConquistaCompleted =
    levelState &&
    Array.from({ length: minDaysRequired }, (_, i) => i + 1).every((day) => {
      return advances.every((advance) => {
        const progress =
          levelState?.advancesProgress?.[
            `${day}-${advance.id}`
          ]
        return progress?.finished && progress?.passed
      })
    })

  // =============================
  // 🟣 Día completado
  // =============================
  const isDayCompleted =
    advances.length > 0 &&
    advances.every((advance) => {
      const progress =
        levelState?.advancesProgress?.[
          `${currentDay}-${advance.id}`
        ]

      return (
        progress?.finished === true &&
        progress?.passed === true
      )
    })

  // =============================
  // 🟣 E2 — Derived Day Evaluation
  // =============================
  const shouldShowDayEvaluation =
    levelState?.dayExams?.[currentDay]?.unlocked === true

  // =============================
  // 🟣 E3 — Conquista Ready For Final Exam
  // =============================
  const isConquistaReadyForFinalExam =
    levelState &&
    Array.from({ length: minDaysRequired }, (_, i) => i + 1).every((day) => {
      return levelState?.dayExams?.[day]?.passed === true
    })

console.log("E3 Ready:", isConquistaReadyForFinalExam)


  // =============================
  // 🟣 Derived Advances (E2 + E3)
  // =============================
  let derivedAdvances = [...advances]

  // E2 — Día evaluation
  if (shouldShowDayEvaluation) {
    derivedAdvances = [
      ...derivedAdvances,
      {
        id: "day-evaluation",
        title: "Evaluación",
        dynamic: true
      }
    ]
  }


console.log(
  "Derived Advances IDs:",
  derivedAdvances.map(a => a.id)
)


  const currentAdvance =
    derivedAdvances[currentAdvanceIndex] ?? null

  const isDayEvaluation =
    currentAdvance?.id === "day-evaluation"

  const isConquistaEvaluation =
    currentAdvance?.id === "conquista-evaluation"

  const advanceProgress =
    currentAdvance
      ? levelState?.advancesProgress?.[
          `${currentDay}-${currentAdvance.id}`
        ]
      : null

  const passingScore = currentAdvance
    ? resolvePassingScore({
        vivenciaId: activeVivencia,
        conquistaId: activeConquista,
        advanceId: currentAdvance.id
      })
    : null

    console.log("Resolved Passing Score:", passingScore)

  // =============================
  // 🔵 Estado por día (visual)
  // =============================
  const getDayStatus = (day) => {
    const dayAdvances = advances

    if (!dayAdvances.length) return "empty"

    const allCompleted = dayAdvances.every((advance) => {
      const progress =
        levelState?.advancesProgress?.[
          `${day}-${advance.id}`
        ]
      return progress?.finished && progress?.passed
    })

    if (allCompleted) return "completed"

    const anyStarted = dayAdvances.some((advance) => {
      const progress =
        levelState?.advancesProgress?.[
          `${day}-${advance.id}`
        ]
      return progress?.started === true
    })

    if (anyStarted) return "started"

    return "idle"
  }

  const xp = levelState?.xp ?? 0

  const vivenciasList = Object.keys(CONTENT)

  const conquistasList =
    Object.keys(CONTENT[activeVivencia] || {})
      .filter((key) => key !== "meta")

  // =============================
  // 4️⃣ Misiones
  // =============================
  const missions = [
    { id: "m1", title: "Write 5 sentences in English", xp: 20 },
    { id: "m2", title: "Read 1 short paragraph aloud", xp: 15 },
    { id: "m3", title: "Learn 10 new words", xp: 30 }
  ]

  const completeMission = (xpAmount) => {
    if (!currentAdvance) return

    setPlayer((prev) => {

      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const score = Number(manualScore)
      if (isNaN(score)) return prev

      const requiredScore = resolvePassingScore({
        vivenciaId: activeVivencia,
        conquistaId: activeConquista,
        advanceId: currentAdvance.id
      })

      const didPass = score >= requiredScore

      const advanceKey = `${currentDay}-${currentAdvance.id}`
      const baseXP = 7
      const bonusXP = didPass ? 3 : 0
      const totalXP = baseXP + bonusXP

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              xp: conquistaData.xp + totalXP,
              advancesProgress: {
                ...conquistaData.advancesProgress,
                [advanceKey]: {
                  ...conquistaData.advancesProgress[advanceKey],
                  finished: true,
                  passed: didPass,
                  quizScore: score,
                  attempts:
                    (conquistaData.advancesProgress[advanceKey]?.attempts || 0) + 1
                }
              }
            }
          }
        }
      }
    })
  }

  // =============================
  // 5️⃣ Persistencia
  // =============================
  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(player))
  }, [player])

  useEffect(() => {
    setIsAdvanceRunning(false)
  }, [currentAdvanceIndex, activeVivencia, activeConquista])

  // =============================
  // 🔁 Motor automático de día
  // =============================
  useEffect(() => {
    if (!isDayCompleted) return
    if (!levelState?.dayExams?.[currentDay]?.passed) return
    if (currentDay !== maxDayUnlocked) return

    const minDaysRequired =
      CONTENT[activeVivencia]?.[activeConquista]?.meta?.minDaysRequired ?? 1

    if (currentDay >= minDaysRequired) return

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      if (conquistaData.currentDay !== currentDay) return prev

      const nextDay = currentDay + 1

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              currentDay: nextDay,
              maxDayUnlocked: Math.max(
                conquistaData.maxDayUnlocked ?? 1,
                nextDay
              ),
              currentAdvanceIndex: 0
            }
          }
        }
      }
    })
  }, [isDayCompleted, levelState, currentDay])

  // =============================
  // 🟣 E2 — Unlock Day Exam
  // =============================
  useEffect(() => {
    if (!isDayCompleted) return

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const currentExam =
        conquistaData.dayExams?.[currentDay]

      if (!currentExam || currentExam.unlocked) {
        return prev
      }

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              dayExams: {
                ...conquistaData.dayExams,
                [currentDay]: {
                  ...currentExam,
                  unlocked: true
                }
              }
            }
          }
        }
      }
    })
  }, [isDayCompleted, currentDay, activeVivencia, activeConquista])

  // =============================
  // 🟣 E3 — Unlock Conquista Final Exam
  // =============================
  useEffect(() => {
    if (!isConquistaReadyForFinalExam) return
    if (levelState?.finalExam?.unlocked) return

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      if (conquistaData.finalExam.unlocked) return prev

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              finalExam: {
                ...conquistaData.finalExam,
                unlocked: true
              }
            }
          }
        }
      }
    })
  }, [
    isConquistaReadyForFinalExam,
    activeVivencia,
    activeConquista,
    levelState
  ])

  // =============================
  // 6️⃣ Progreso visual
  // =============================
  const level = Math.floor(xp / 100) + 1
  const currentLevelXP = xp % 100
  const progressPercent = (currentLevelXP / 100) * 100

  const changeAdvance = (newIndex) => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              currentAdvanceIndex: newIndex,
              currentAdvanceIndexByDay: {
                ...conquistaData.currentAdvanceIndexByDay,
                [currentDay]: newIndex
              },
              maxAdvanceUnlocked: Math.max(
                conquistaData.maxAdvanceUnlocked ?? 0,
                newIndex
              )
            }
          }
        }
      }
    })
  }

  const changeDay = (day) => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const savedIndex =
        conquistaData.currentAdvanceIndexByDay?.[day] ?? 0

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              currentDay: day,
              currentAdvanceIndex: savedIndex
            }
          }
        }
      }
    })
  }

  const moveAdvance = (oldIndex, newIndex) => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const currentOrder = conquistaData.advancesOrder ?? []

      if (
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= currentOrder.length ||
        newIndex >= currentOrder.length
      ) return prev

      const newOrder = [...currentOrder]
      const [movedItem] = newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, movedItem)

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              advancesOrder: newOrder
            }
          }
        }
      }
    })
  }

  const handleStartAdvance = () => {
    if (!currentAdvance) return

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              advancesProgress: {
                ...conquistaData.advancesProgress,
                [`${currentDay}-${currentAdvance.id}`]: {
                  ...conquistaData.advancesProgress[
                    `${currentDay}-${currentAdvance.id}`
                  ],
                  started: true
                }
              }
            }
          }
        }
      }
    })
  }

  const handleSubmitDayExam = () => {
    const score = Number(examScore)

    if (isNaN(score)) return

    const passed = score >= dayExamPassingScore

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const currentExam =
        conquistaData.dayExams[currentDay]

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              dayExams: {
                ...conquistaData.dayExams,
                [currentDay]: {
                  ...currentExam,
                  attempts: currentExam.attempts + 1,
                  score,
                  passed
                }
              }
            }
          }
        }
      }
    })

    setExamScore("")
    setIsAdvanceRunning(false)
  }

  // =============================
  // 🟣 E3 — Submit Conquista Final Exam
  // =============================
  const handleSubmitFinalExam = () => {
    const score = Number(examScore)

    if (isNaN(score)) return

    const finalExamPassingScore =
      CONTENT[activeVivencia]?.[activeConquista]?.meta?.finalExamPassingScore

    const passed = score >= finalExamPassingScore

    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const currentFinalExam = conquistaData.finalExam

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              finalExam: {
                ...currentFinalExam,
                attempts: currentFinalExam.attempts + 1,
                score,
                passed
              }
            }
          }
        }
      }
    })

    setExamScore("")
    setIsAdvanceRunning(false)
  }

  // =============================
  // 🧪 Debug: completar día actual
  // =============================
  const debugCompleteDay = () => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const updatedProgress = { ...conquistaData.advancesProgress }

      advances.forEach((advance) => {
        const key = `${currentDay}-${advance.id}`

        updatedProgress[key] = {
          ...updatedProgress[key],
          started: true,
          finished: true,
          passed: true
        }
      })

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              advancesProgress: updatedProgress
            }
          }
        }
      }
    })
  }

  // =============================
  // 🧪 Debug: completar conquista actual
  // =============================
  const debugCompleteConquest = () => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia]
      const conquistaData = vivenciaData[activeConquista]

      const minDaysRequired =
        CONTENT[activeVivencia]?.[activeConquista]?.meta?.minDaysRequired ?? 1

      const updatedDayExams = { ...conquistaData.dayExams }

      for (let day = 1; day <= minDaysRequired; day++) {
        updatedDayExams[day] = {
          ...updatedDayExams[day],
          unlocked: true,
          passed: true,
          attempts: 1,
          score: 100
        }
      }

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              currentDay: minDaysRequired,
              maxDayUnlocked: minDaysRequired,
              dayExams: updatedDayExams
            }
          }
        }
      }
    })
  }

// =============================
// 🟣 Evaluation Message Resolver
// =============================
const evaluationMessageData =
  currentDay === "final-evaluation"
    ? resolveEvaluationMessage({
        evaluationType: "conquest",
        vivenciaId: activeVivencia,
        conquistaId: activeConquista,
        levelState
      })
    : shouldShowDayEvaluation
    ? resolveEvaluationMessage({
        evaluationType: "day",
        vivenciaId: activeVivencia,
        conquistaId: activeConquista,
        levelState
      })
    : null

const evaluationMessage =
  evaluationMessageData?.fallback ?? null

  //RENDERIZA
  return (
    <div style={{ padding: "20px" }}>

      <Header
        vivenciasList={vivenciasList}
        conquistasList={conquistasList}
        activeVivencia={activeVivencia}
        setActiveVivencia={setActiveVivencia}
        activeConquista={activeConquista}
        setActiveConquista={setActiveConquista}
        advances={derivedAdvances}
        currentAdvanceIndex={currentAdvanceIndex}
        maxAdvanceUnlocked={maxAdvanceUnlocked}
        onChangeAdvance={changeAdvance}
        onMoveAdvance={moveAdvance}
        advancesProgress={levelState?.advancesProgress}
        dayExams={levelState?.dayExams}
        currentDay={currentDay}
        maxDayUnlocked={maxDayUnlocked}
        onChangeDay={changeDay}
        getDayStatus={getDayStatus}
        totalDays={minDaysRequired}
        levelState={levelState}
        isConquistaReadyForFinalExam={isConquistaReadyForFinalExam}
        needsReview={needsReview}
        evaluationMessage={evaluationMessage}
      />

      {/* Pruebas MIG */}
      {/* Debug Controls */}
      <div className="debug-controls">
        <button
          className="tab-button debug-day"
          onClick={debugCompleteDay}
        >
          Complete Current Day
        </button>

        <button
          className="tab-button debug-conquest"
          onClick={debugCompleteConquest}
        >
          Complete Current Conquest
        </button>
      </div>

      <div className="dashboard-row">
        <AdvancePanel
          currentAdvance={currentAdvance}
          activeVivencia={activeVivencia}
          activeConquista={activeConquista}
          levelState={levelState}
          isAdvanceRunning={isAdvanceRunning}
          setIsAdvanceRunning={setIsAdvanceRunning}
          advanceProgress={advanceProgress}
          onStartAdvance={handleStartAdvance}
          manualScore={manualScore}
          setManualScore={setManualScore}
          isDayEvaluation={isDayEvaluation}
          examScore={examScore}
          setExamScore={setExamScore}
          handleSubmitDayExam={handleSubmitDayExam}
          handleSubmitFinalExam={handleSubmitFinalExam}
          isFinalEvaluationDay={isFinalEvaluationDay}
          needsReview={needsReview}
          vivenciasList={vivenciasList}
          conquistasList={conquistasList}
          setActiveVivencia={setActiveVivencia}
          setActiveConquista={setActiveConquista}
        />

        <div className="player-wrapper">
          <PlayerPanel
            xp={xp}
            level={level}
            currentLevelXP={currentLevelXP}
            progressPercent={progressPercent}
            onGainXp={() => completeMission(10)}
          />
        </div>
      </div>

      <MissionsPanel
        missions={missions}
        onComplete={completeMission}
      />
    </div>
  )
}

export default App
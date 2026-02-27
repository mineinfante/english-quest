import { useState, useEffect } from "react"
import PlayerPanel from "./components/PlayerPanel"
import MissionsPanel from "./components/MissionsPanel"
import { CONTENT } from "./content"
import Header from "./components/Header"
import AdvancePanel from "./components/AdvancePanel.jsx"
import { createInitialPlayer } from "./state/createInitialPlayer"

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

  // =============================
  // 3️⃣ Derivados
  // =============================
  const levelState =
    player.vivencias[activeVivencia]?.[activeConquista]

  const currentDay = levelState?.currentDay ?? 1

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

  const currentAdvance =
    advances[currentAdvanceIndex] ?? null

  const advanceProgress =
    currentAdvance
      ? levelState?.advancesProgress?.[
          `${currentDay}-${currentAdvance.id}`
        ]
      : null

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
      return progress?.completed === true
    })

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

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              xp: conquistaData.xp + xpAmount,
              advancesProgress: {
                ...conquistaData.advancesProgress,
                [`${currentDay}-${currentAdvance.id}`]: {
                  ...conquistaData.advancesProgress[
                    `${currentDay}-${currentAdvance.id}`
                  ],
                  completed: true
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
    if (currentDay !== maxDayUnlocked) return

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
  }, [isDayCompleted])

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

  return (
    <div style={{ padding: "20px" }}>
      <Header
        vivenciasList={vivenciasList}
        conquistasList={conquistasList}
        activeVivencia={activeVivencia}
        setActiveVivencia={setActiveVivencia}
        activeConquista={activeConquista}
        setActiveConquista={setActiveConquista}
        advances={advances}
        currentAdvanceIndex={currentAdvanceIndex}
        maxAdvanceUnlocked={maxAdvanceUnlocked}
        onChangeAdvance={changeAdvance}
        onMoveAdvance={moveAdvance}
        advancesProgress={levelState?.advancesProgress}
        currentDay={currentDay}
        maxDayUnlocked={maxDayUnlocked}
        onChangeDay={changeDay}
      />

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
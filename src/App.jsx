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

    if (saved) {
      return JSON.parse(saved)
    }

    return createInitialPlayer()
  })

  // =============================
  // 2️⃣ Estados de UI
  // =============================
  const [activeVivencia, setActiveVivencia] = useState("family")
  const [activeConquista, setActiveConquista] = useState("A1")
  const [isAdvanceRunning, setIsAdvanceRunning] = useState(false)

  // =============================
  // 3️⃣ Derivados desde el estado
  // =============================
  const levelState =
    player.vivencias[activeVivencia]?.[activeConquista]

  const currentDay =
    levelState?.currentDay ?? 1
  
  const currentAdvanceIndex =
    levelState?.currentAdvanceIndex ?? 0

  const maxAdvanceUnlocked =
    Math.max(
      levelState?.maxAdvanceUnlocked ?? 0,
      currentAdvanceIndex
    )
    
  // =============================
  // Construcción ordenada desde advancesOrder
  // =============================

  const contentAdvances =
    CONTENT[activeVivencia]?.[activeConquista]?.advances ?? []

  const advancesOrder =
    levelState?.advancesOrder ?? []

  const advances =
    advancesOrder.length > 0
      ? advancesOrder
          .map((id) =>
            contentAdvances.find((advance) => advance.id === id)
          )
          .filter(Boolean)
      : contentAdvances
                        
  const currentAdvance =
    advances[currentAdvanceIndex] ?? null

  const advanceProgress =
    currentAdvance
      ? levelState?.advancesProgress?.[currentAdvance.id]
      : null

  const xp = levelState?.xp ?? 0

  const vivenciasList = Object.keys(CONTENT)

  const conquistasList =
    Object.keys(CONTENT[activeVivencia] || {})
      .filter((key) => key !== "meta")


  // =============================
  // 4️⃣ Misiones temporales
  // =============================
  const missions = [
    { id: "m1", title: "Write 5 sentences in English", xp: 20 },
    { id: "m2", title: "Read 1 short paragraph aloud", xp: 15 },
    { id: "m3", title: "Learn 10 new words", xp: 30 }
  ]

  const completeMission = (xpAmount) => {
    setPlayer((prev) => {
      const vivenciaData =
        prev.vivencias[activeVivencia] || {}

      const conquistaData =
        vivenciaData[activeConquista] || {
          xp: 0,
          daysInLevel: 0,
          currentAdvanceIndex: 0,
          maxAdvanceUnlocked: 0,
          completedAdvances: []
        }

        return {
          ...prev,
          vivencias: {
            ...prev.vivencias,
            [activeVivencia]: {
              ...vivenciaData,
              [activeConquista]: {
                ...conquistaData,
                xp: conquistaData.xp + xpAmount,
                maxAdvanceUnlocked: Math.floor((conquistaData.xp + xpAmount) / 100),
                advancesProgress: {
                  ...conquistaData.advancesProgress,
                  [currentAdvance.id]: {
                    ...conquistaData.advancesProgress[currentAdvance.id],
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
  // 6️⃣ Cálculo visual de progreso
  // =============================
  const level = Math.floor(xp / 100) + 1
  const currentLevelXP = xp % 100
  const progressPercent = (currentLevelXP / 100) * 100

  const changeAdvance = (newIndex) => {
    setPlayer((prev) => {
      const vivenciaData = prev.vivencias[activeVivencia] || {}
      const conquistaData =
        vivenciaData[activeConquista] || {
          xp: 0,
          daysInLevel: 0,
          currentAdvanceIndex: 0,
          maxAdvanceUnlocked: 0,
          completedAdvances: []
        }

      const prevMax = conquistaData.maxAdvanceUnlocked ?? 0

      return {
        ...prev,
        vivencias: {
          ...prev.vivencias,
          [activeVivencia]: {
            ...vivenciaData,
            [activeConquista]: {
              ...conquistaData,
              currentAdvanceIndex: newIndex,
              maxAdvanceUnlocked: Math.max(prevMax, newIndex)
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
      ) {
        return prev
      }

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

      const updatedAdvancesProgress = {
        ...conquistaData.advancesProgress,
        [currentAdvance.id]: {
          ...conquistaData.advancesProgress[currentAdvance.id],
          started: true
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
              advancesProgress: updatedAdvancesProgress
            }
          }
        }
      }
    })
  }

  // =============================
  // 7️⃣ Render
  // =============================
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
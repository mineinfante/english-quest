import { CONTENT } from "../content"

export function createInitialPlayer() {
  const vivencias = {}

  Object.keys(CONTENT).forEach((vivencia) => {
    vivencias[vivencia] = {}

    Object.keys(CONTENT[vivencia]).forEach((level) => {

      const advances =
        CONTENT[vivencia][level]?.advances ?? []

      const advancesProgress = {}

      advances.forEach((advance) => {
        advancesProgress[advance.id] = {
          started: false,
          completed: false,
          validationPassed: false,
          attempts: 0,
          quizScore: 0
        }
      })

      // 🔹 Nuevo: orden personalizable de avances
      const advancesOrder = advances.map((advance) => advance.id)

      vivencias[vivencia][level] = {
        xp: 0,
        daysInLevel: 0,
        currentDay: 1,
        currentAdvanceIndex: 0,
        maxAdvanceUnlocked: 0,
        completedAdvances: [],
        weakAreas: {
          grammar: {},
          vocabulary: {},
          functions: {}
        },
        advancesOrder,       // ← agregado
        advancesProgress
      }
    })
  })

  return { vivencias }
}
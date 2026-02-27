import { CONTENT } from "../content"

export function createInitialPlayer() {
  const vivencias = {}

  Object.keys(CONTENT).forEach((vivencia) => {
    vivencias[vivencia] = {}

    Object.keys(CONTENT[vivencia]).forEach((level) => {

      const advances =
        CONTENT[vivencia][level]?.advances ?? []

      const advancesProgress = {}

      const totalDays =
        CONTENT[vivencia][level]?.meta?.minDaysRequired ?? 7

      for (let day = 1; day <= totalDays; day++) {
        advances.forEach((advance) => {
          const dayAdvanceKey = `${day}-${advance.id}`

          advancesProgress[dayAdvanceKey] = {
            started: false,
            finished: false,
            passed: false,
            attempts: 0,
            quizScore: 0
          }
        })
      }

      advances.forEach((advance) => {
        advancesProgress[advance.id] = {
          started: false,
          finished: false,
          passed: false,
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
        maxDayUnlocked: 1,
        currentAdvanceIndex: 0,
        currentAdvanceIndexByDay: {},
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
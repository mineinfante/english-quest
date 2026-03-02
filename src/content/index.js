/**
 * CONTENT CATALOG
 * Define el mapa pedagógico completo.
 * No contiene estado del jugador.
 */

function createAdvance(config) {
  const requiredFields = [
    "id",
    "order",
    "vivencia",
    "level",
    "type",
    "linguisticTargets",
    "successCriteria",
    "buildPrompt"
  ]

  requiredFields.forEach((field) => {
    if (!config[field]) {
      throw new Error(`Advance missing required field: ${field}`)
    }
  })

  if (typeof config.id !== "string") {
    throw new Error("Advance id must be string")
  }

  if (!Number.isInteger(config.order) || config.order <= 0) {
    throw new Error("Advance order must be positive integer")
  }

  return { ...config }
}

const VIVENCIAS_CONFIG = [
  { id: "family", nameKey: "vivencias.family", context: "family life" },
  { id: "friends", nameKey: "vivencias.friends", context: "social situations with friends" },
  { id: "school", nameKey: "vivencias.school", context: "school environment" },
  { id: "jobInterview", nameKey: "vivencias.jobInterview", context: "job interview situations" },
  { id: "work", nameKey: "vivencias.work", context: "professional work environment" },
  { id: "travel", nameKey: "vivencias.travel", context: "travel situations" },
  { id: "shopping", nameKey: "vivencias.shopping", context: "shopping situations" },
  { id: "restaurant", nameKey: "vivencias.restaurant", context: "restaurant situations" },
  { id: "phoneCall", nameKey: "vivencias.phoneCall", context: "phone conversations" },
  { id: "doctor", nameKey: "vivencias.doctor", context: "medical situations" },
  { id: "neighbors", nameKey: "vivencias.neighbors", context: "neighborhood interactions" },
  { id: "team", nameKey: "vivencias.team", context: "team collaboration" },
  { id: "official", nameKey: "vivencias.official", context: "official procedures" },
  { id: "meeting", nameKey: "vivencias.meeting", context: "formal meetings" },
  { id: "difficult", nameKey: "vivencias.difficult", context: "challenging situations" },
  { id: "custom", nameKey: "vivencias.custom", context: "custom user context" }
]

const CONQUISTAS_CONFIG = [
  { id: "A1", nameKey: "conquistas.A1", cefr: "A1", minDays: 7 },
  { id: "A2", nameKey: "conquistas.A2", cefr: "A2", minDays: 10 },
  { id: "B1", nameKey: "conquistas.B1", cefr: "B1", minDays: 5 },
  { id: "B2", nameKey: "conquistas.B2", cefr: "B2", minDays: 8 },
  { id: "C1", nameKey: "conquistas.C1", cefr: "C1", minDays: 9 },
  { id: "C2", nameKey: "conquistas.C2", cefr: "C2", minDays: 15 }
]

const A1_TEMPLATE = [
  { order: 1, title: "First Echo", type: "reading" },
  { order: 2, title: "First Attempt", type: "writing" },
  { order: 3, title: "Make it Sound", type: "vocabulary" },
  { order: 4, title: "Live it", type: "speaking" },
  { order: 5, title: "Shape it", type: "review" },
  { order: 6, title: "Polish it", type: "reading" },
  { order: 7, title: "Give it Rhythm", type: "writing" },
  { order: 8, title: "With Ease", type: "vocabulary" },
  { order: 9, title: "My Mark", type: "speaking" },
  { order: 10, title: "My Moment", type: "review" },
  { order: 11, title: "My Voice", type: "integration" },
  { order: 12, title: "New Echo", type: "final-review" }
]

function createLevelTemplate(levelId) {
  return [
    { order: 1, title: "First Echo", type: "reading" },
    { order: 2, title: "First Attempt", type: "writing" },
    { order: 3, title: "Make it Sound", type: "vocabulary" },
    { order: 4, title: "Live it", type: "speaking" },
    { order: 5, title: "Shape it", type: "review" },
    { order: 6, title: "Polish it", type: "reading" },
    { order: 7, title: "Give it Rhythm", type: "writing" },
    { order: 8, title: "With Ease", type: "vocabulary" },
    { order: 9, title: "My Mark", type: "speaking" },
    { order: 10, title: "My Moment", type: "review" },
    { order: 11, title: "My Voice", type: "integration" },
    { order: 12, title: "New Echo", type: "final-review" }
  ]
}

const ADVANCE_TEMPLATES = {
  A1: createLevelTemplate("A1"),
  A2: createLevelTemplate("A2"),
  B1: createLevelTemplate("B1"),
  B2: createLevelTemplate("B2"),
  C1: createLevelTemplate("C1"),
  C2: createLevelTemplate("C2")
}

const CEFR_RULES = {
  A1: {
    complexity: "basic",
    grammar: ["present simple", "be", "possessive adjectives"],
    sentenceMin: 3
  },
  A2: {
    complexity: "elementary",
    grammar: ["past simple", "can", "there is/are"],
    sentenceMin: 4
  },
  B1: {
    complexity: "intermediate",
    grammar: ["present perfect", "past continuous"],
    sentenceMin: 5
  },
  B2: {
    complexity: "upper-intermediate",
    grammar: ["conditionals", "modal verbs"],
    sentenceMin: 6
  },
  C1: {
    complexity: "advanced",
    grammar: ["reported speech", "advanced conditionals"],
    sentenceMin: 8
  },
  C2: {
    complexity: "proficient",
    grammar: ["discourse markers", "style variation"],
    sentenceMin: 10
  }
}

function generateAdvancesForLevel({ vivenciaId, levelId, context, template }) {
  return template.map((item) => {
    const advanceId = `${vivenciaId}-${levelId}-${String(item.order).padStart(2, "0")}`

    const rules = CEFR_RULES[levelId]

    return createAdvance({
    id: advanceId,
    order: item.order,
    title: null,
    titleKey: `advance.${levelId}.${item.order}.title`,
    vivencia: vivenciaId,
    level: levelId,
    type: item.type,

    objective: null,
    objectiveKey: `advance.${levelId}.${item.order}.objective`,

    linguisticTargets: {
        grammar: rules.grammar,
        vocabulary: ["context vocabulary"],
        functions: ["communication in context"]
    },

    successCriteria: {
        minSentences: rules.sentenceMin,
        requiredStructures: rules.grammar,
        maxCEFR: levelId
    },

    passingScore: null, // 🔹 N1 opcional (si es null, usará N2 o N3)

    buildPrompt: ({ language = "en" } = {}) => {
      if (language === "es") {
        return `
    Eres un mentor académico de inglés.

    Nivel: ${levelId}
    Contexto: ${context}
    Complejidad: ${rules.complexity}

    Crea contenido estructurado adaptado al nivel CEFR ${levelId}.
    Incluye gramática: ${rules.grammar.join(", ")}

    Devuelve SOLO JSON válido.
    `
      }

      return `
    You are an English language mentor.

    Level: ${levelId}
    Context: ${context}
    Complexity: ${rules.complexity}

    Create structured content adapted to CEFR ${levelId}.
    Include grammar: ${rules.grammar.join(", ")}

    Return ONLY valid JSON.
    `
    }
    })
  })
}

function generateContent() {
  const content = {}

  VIVENCIAS_CONFIG.forEach((vivencia) => {
    content[vivencia.id] = {
      meta: {
        nameKey: vivencia.nameKey,
        passingScore: 70 // 🔹 N3 default por vivencia
      }
    }

    CONQUISTAS_CONFIG.forEach((conquista) => {

      const template = ADVANCE_TEMPLATES[conquista.id] || []

      content[vivencia.id][conquista.id] = {
        meta: {
          nameKey: conquista.nameKey,
          //Mínimo 7 días por conquista, cada día debes cumplir todos los avances
          //minDaysRequired: 7,
          minDaysRequired: conquista.minDays,
          requiredXP: 50,
          passingScore: 75,
          dayExamPassingScore: 80,
          finalExamPassingScore: 85,
          reviewPassingScore: 70
        },
        
        advances: generateAdvancesForLevel({
          vivenciaId: vivencia.id,
          levelId: conquista.id,
          context: vivencia.context,
          template
        })
      }

    })
  })

  return content
}

export const CONTENT = generateContent()
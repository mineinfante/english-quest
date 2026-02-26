// src/content/englishQuestContent.js

/**
 * English Quest — Static Content Catalog
 *
 * Define:
 * - Vivencias
 * - Conquistas CEFR
 * - Avances secuenciales
 * - Generador dinámico de prompts
 *
 * ⚠️ No guarda progreso.
 * ⚠️ No depende de React.
 */

export const CONTENT = {
  family: {
    A1: [
      {
        id: "family_A1_01",
        order: 1,
        title: "Introducing Your Family",
        objective: "Describe basic family members using simple present.",
        minDaysRequired: 1,
        buildPrompt: ({ playerName }) => `
You are guiding ${playerName} in English Quest.

Level: A1
Context: Family

Task:
Help the learner describe their family members using simple present tense.

Encourage use of:
- I have...
- My mother is...
- My brother likes...

Keep vocabulary basic.
Correct gently.
`
      },
      {
        id: "family_A1_02",
        order: 2,
        title: "Daily Life at Home",
        objective: "Describe daily routines at home.",
        minDaysRequired: 2,
        buildPrompt: ({ playerName }) => `
You are guiding ${playerName} in English Quest.

Level: A1
Context: Family

Task:
Help the learner describe daily routines at home.

Encourage:
- I wake up at...
- We eat dinner at...
- My father works...

Focus on present simple and time expressions.
`
      }
    ]
  },

  friends: {
    A1: [
      {
        id: "friends_A1_01",
        order: 1,
        title: "Talking About Friends",
        objective: "Describe friends physically and emotionally.",
        minDaysRequired: 1,
        buildPrompt: ({ playerName }) => `
Guide ${playerName} to describe friends.

Use:
- He is...
- She likes...
- We play...

Focus on adjectives and simple present.
`
      }
    ]
  },

  work: {
    A1: [
      {
        id: "work_A1_01",
        order: 1,
        title: "Introducing Your Job",
        objective: "Explain basic job role.",
        minDaysRequired: 1,
        buildPrompt: ({ playerName }) => `
Help ${playerName} describe their job.

Encourage:
- I work as...
- I help...
- I use...

Keep vocabulary simple.
`
      }
    ]
  }
}
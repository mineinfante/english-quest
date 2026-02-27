/**
 * Evaluation Message Engine
 *
 * Responsabilidades:
 * - Definir estructura del mensaje de evaluación
 * - Construir prompt base para LLM
 * - Ofrecer fallback local si no hay LLM
 *
 * Este módulo NO llama directamente al LLM.
 */

export function resolveEvaluationMessage({
  evaluationType,
  vivenciaId,
  conquistaId,
  levelState
}) {

  const baseContext = {
    evaluationType,
    vivenciaId,
    conquistaId
  }

  // 🔹 Construcción del prompt base (para futuro LLM)
  const prompt = buildEvaluationPrompt({
    ...baseContext,
    levelState
  })

  // 🔹 Fallback local mientras no usamos LLM
  const fallback = buildFallbackMessage(baseContext)

  return {
    prompt,
    fallback
  }
}

/**
 * Construye el prompt estructurado para LLM
 */
function buildEvaluationPrompt({
  evaluationType,
  vivenciaId,
  conquistaId,
  levelState
}) {

  return `
You are an academic English mentor.

Evaluation type: ${evaluationType}
Vivencia: ${vivenciaId}
Conquista: ${conquistaId}

Generate a motivating but formal message
for a student about to take this evaluation.

Return ONLY JSON:
{
  "title": "...",
  "message": "..."
}
`
}

/**
 * Fallback local si no usamos LLM
 */
function buildFallbackMessage({ evaluationType }) {

  if (evaluationType === "conquest") {
    return {
      title: "Es momento de tu Evaluación Final.",
      message:
        "Has completado todos los días requeridos. Ahora demostrarás tu progreso real. Respira, concéntrate y recuerda que esta evaluación representa tu crecimiento."
    }
  }

  if (evaluationType === "day") {
    return {
      title: "Es momento de tu Evaluación.",
      message:
        "Has completado los avances de este día. Esta evaluación confirmará tu comprensión antes de avanzar."
    }
  }

  return {
    title: "Evaluación",
    message: "Prepárate para demostrar tu progreso."
  }
}
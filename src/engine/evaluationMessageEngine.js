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
  levelState,
  t
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
  const fallback = buildFallbackMessage({
    ...baseContext,
    t
  })

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
function buildFallbackMessage({ evaluationType, t }) {

  if (evaluationType === "conquest") {
    return {
      title: t.evaluation.final.title,
      message: t.evaluation.final.message
    }
  }

  if (evaluationType === "day") {
    return {
      title: t.evaluation.day.title,
      message: t.evaluation.day.message
    }
  }

  if (evaluationType === "review") {
    return {
      title: t.evaluation.review.title,
      message: t.evaluation.review.message
    }
  }

  return {
    title: t.evaluation.day.title,
    message: t.evaluation.day.message
  }
}
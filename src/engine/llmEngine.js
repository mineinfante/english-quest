import { validateLLMResponse } from "../validators/llmResponseValidator"

const MAX_LLM_RETRIES = 2

/**
 * Ejecuta llamada al LLM con validación estructural
 * y política de reintentos automática.
 * 
 * @param {Function} llmCall - función async que devuelve string (respuesta cruda del LLM)
 * @returns {Promise<object>} respuesta validada
 */
export async function executeLLM(llmCall) {
  let attempts = 0

  while (attempts < MAX_LLM_RETRIES) {
    try {
      const rawResponse = await llmCall()
      const validated = validateLLMResponse(rawResponse)
      return validated
    } catch (error) {
      attempts++
      console.warn(`LLM attempt ${attempts} failed:`, error.message)
    }
  }

  // Fallback después de agotar intentos
  throw new Error("LLM failed after maximum retries")
}
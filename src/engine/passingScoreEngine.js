/**
 * Passing Score Resolution Engine
 * 
 * Jerarquía:
 * N1 → avance × conquista × vivencia
 * N2 → conquista × vivencia
 * N3 → vivencia
 * Default → 70
 */

import { CONTENT } from "../content"

/**
 * Estructura esperada dentro de CONTENT:
 * 
 * content[vivencia].meta.passingScore                → N3
 * content[vivencia][conquista].meta.passingScore     → N2
 * advance.passingScore                               → N1
 */

const DEFAULT_PASSING_SCORE = 70

export function resolvePassingScore({
  vivenciaId,
  conquistaId,
  advanceId
}) {

  const vivencia = CONTENT[vivenciaId]
  if (!vivencia) return DEFAULT_PASSING_SCORE

  const conquista = vivencia[conquistaId]
  if (!conquista) return DEFAULT_PASSING_SCORE

  const advance = conquista.advances?.find(
    (a) => a.id === advanceId
  )

  // 🔹 N1 → avance específico
  if (advance?.passingScore != null) {
    return advance.passingScore
  }

  // 🔹 N2 → conquista
  if (conquista.meta?.passingScore != null) {
    return conquista.meta.passingScore
  }

  // 🔹 N3 → vivencia
  if (vivencia.meta?.passingScore != null) {
    return vivencia.meta.passingScore
  }

  // 🔹 Default global
  return DEFAULT_PASSING_SCORE
}
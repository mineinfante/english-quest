export default function ConquestCompletionPanel({
  vivenciaId,
  conquistaId,
  onNextConquista,
  onNextVivencia
}) {
  return (
    <div className="advance-card fade-container summary">

      <h2 className="advance-title">
        Conquista completada
      </h2>

      <div className="advance-content">

        <p>
          Has completado esta conquista con éxito.
        </p>

        <p style={{ marginTop: "8px", opacity: 0.8 }}>
          Ahora puedes decidir cómo continuar tu progreso académico.
        </p>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <button
            className="tab-button active"
            onClick={onNextConquista}
          >
            Continuar con la siguiente conquista (mismo nivel CEFR)
          </button>

          <button
            className="tab-button"
            onClick={onNextVivencia}
          >
            Continuar con la siguiente vivencia (mismo nivel CEFR)
          </button>

        </div>

      </div>

    </div>
  )
}
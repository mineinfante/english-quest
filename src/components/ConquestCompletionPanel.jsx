export default function ConquestCompletionPanel({
  t,
  vivenciaId,
  conquistaId,
  onNextConquista,
  onNextVivencia
}) {
  return (
    <div className="advance-card fade-container summary">

      <h2 className="advance-title">
        {t.panels.conquestCompletedTitle}
      </h2>

      <div className="advance-content">

        <p>
          {t.messages.conquestCompletedMessage}
        </p>

        <p style={{ marginTop: "8px", opacity: 0.8 }}>
          {t.messages.conquestNextStepMessage}
        </p>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <button
            className="tab-button active"
            onClick={onNextConquista}
          >
            {t.buttons.nextConquista}
          </button>

          <button
            className="tab-button"
            onClick={onNextVivencia}
          >
            {t.buttons.nextVivencia}
          </button>

        </div>

      </div>

    </div>
  )
}
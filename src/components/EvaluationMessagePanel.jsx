export default function EvaluationMessagePanel({
  title,
  message
}) {
  return (
    <div
      style={{
        marginTop: "14px",
        padding: "18px",
        borderRadius: "14px",
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(34,197,94,0.20))",
        border: "1px solid rgba(255,255,255,0.15)"
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>
        {title}
      </h3>

      <p style={{ opacity: 0.9, lineHeight: "1.6" }}>
        {message}
      </p>
    </div>
  )
}
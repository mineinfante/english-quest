import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"

import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { CONTENT } from "../content"
import EvaluationMessagePanel from "./EvaluationMessagePanel"
import { UI_TEXT } from "../config/uiText"

function SortableAdvanceButton({
  id,
  title,
  isActiveProp,
  progress,
  onClick,
  ...rest
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  }

  //const isExam = progress && "attempts" in progress
  const isExam =
    id === "day-evaluation" ||
    id === "conquista-evaluation"

  const isStarted = !isExam && progress?.started && !progress?.finished
console.log("ADVANCE PROGRESS:", id, progress)
console.log("IS STARTED?", id, progress?.started)


  const isPassed = isExam
    ? progress?.passed === true
    : progress?.finished && progress?.passed

  const isFailed = isExam
    ? progress?.attempts > 0 && progress?.passed === false
    : progress?.finished && !progress?.passed
    
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`tab-button ${isActiveProp ? "active" : ""}`}
      {...attributes}
      {...rest}
    >
      {/* Click normal */}
      <button
        style={{
          all: "unset",
          cursor: "pointer",
          padding: "4px 6px"
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {title}
      </button>

      {/* Drag handle */}
      <span
        {...listeners}
        style={{
          cursor: "grab",
          fontSize: "10px",
          opacity: 0.6,
          userSelect: "none"
        }}
      >
        ⠿
      </span>

      {(isActiveProp || isStarted || isPassed || isFailed) && (
        <span
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isPassed
              ? "white"
              : isFailed
              ? "#f97316"
              : isStarted
              ? "#facc15"
              : isActiveProp
              ? "#22c55e"
              : "transparent",
            boxShadow: isPassed
              ? "0 0 6px rgba(255,255,255,0.6)"
              : isActiveProp && !isStarted
              ? "0 0 6px rgba(34,197,94,0.6)"
              : "none"
          }}
        />
      )}
    </div>
  )
}

export default function Header({
  vivenciasList,
  conquistasList,
  activeVivencia,
  setActiveVivencia,
  activeConquista,
  setActiveConquista,
  advances,
  currentAdvanceIndex,
  maxAdvanceUnlocked,
  onChangeAdvance,
  onMoveAdvance,
  advancesProgress,
  dayExams,
  currentDay,
  maxDayUnlocked,
  onChangeDay,
  getDayStatus,
  totalDays,
  levelState,
  isConquistaReadyForFinalExam,
  needsReview,
  evaluationMessage,
  activeDay,
  setActiveDay,
  advancesContainerRef
}) {

  return (
    <div className="header-wrapper">

      {/* Vivencias */}
      <div className="header-row">
        <span className="header-label">Vivencias</span>
        <div className="tabs-container tabs-vivencias">
          {vivenciasList.map((vivencia) => (
            <button
              key={vivencia}
              onClick={() => setActiveVivencia(vivencia)}
              className={`tab-button ${
                activeVivencia === vivencia ? "active" : ""
              }`}
            >
              {CONTENT[vivencia]?.meta?.name || vivencia}
            </button>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div className="header-row">
        <span className="header-label">Conquistas</span>
        <div className="tabs-container tabs-conquistas">
          {conquistasList.map((conquista) => (
            <button
              key={conquista}
              onClick={() => setActiveConquista(conquista)}
              className={`tab-button ${
                activeConquista === conquista ? "active" : ""
              }`}
            >
              {
                CONTENT[activeVivencia]?.[conquista]?.meta?.name
                || conquista
              }
            </button>
          ))}
        </div>
      </div>

      <div className="divider-soft" />

      {/* Días */}
      <div className="header-row">
        <span className="header-label">Días</span>
        <div className="tabs-container tabs-dias">
          <div style={{ margin: "0 auto", display: "flex", gap: "8px" }}>
            {
              [
                ...Array.from({ length: totalDays }, (_, i) => i + 1),
                ...(needsReview
                    ? ["review-day"]
                    : isConquistaReadyForFinalExam
                    ? ["final-evaluation"]
                    : [])
              ].map((day) => {
              const isFinal = day === "final-evaluation"

              const finalExam = levelState?.finalExam

              let status

              if (isFinal) {
                if (!finalExam) {
                  status = "locked"
                } else if (finalExam.passed) {
                  status = "completed"
                } else if (finalExam.attempts > 0) {
                  status = "started"
                } else {
                  status = "active"
                }
              } else {
                status = getDayStatus(day)
              }

              const isLocked = isFinal
                ? false
                : day > maxDayUnlocked

              const isActive = isFinal
                ? currentDay === "final-evaluation"
                : day === activeDay
                
              return (
                <button
                  key={day}
                  className={`tab-button ${isActive ? "active" : ""}`}
                  style={{
                    opacity: isLocked ? 0.5 : 1,
                    cursor: isLocked ? "not-allowed" : "pointer",
                    position: "relative"
                  }}
                  onClick={() => {
                    if (isLocked) return

                    if (isFinal) {
                      onChangeDay("final-evaluation")
                    } else {
                      onChangeDay(day)
                    }
                  }}
                  disabled={isLocked}
                >
                  {day === "final-evaluation"
                  ? UI_TEXT.en.days.assessment
                  : day === "review-day"
                  ? UI_TEXT.en.days.review
                  : day
                  }

                  {isLocked && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        fontSize: "10px",
                        opacity: 0.8
                      }}
                    >
                      🔒
                    </span>
                  )}

                  {!isLocked && isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 6px rgba(34,197,94,0.6)"
                      }}
                    />
                  )}

                  {!isLocked && status === "completed" && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 0 6px rgba(255,255,255,0.6)"
                      }}
                    />
                  )}

                  {!isLocked && status === "started" && !isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#facc15"
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Avances */}
      {currentDay !== "final-evaluation" && (
        <div className="header-row">
        <span className="header-label">Avances</span>

        <div
          className="tabs-container tabs-avances"
          ref={advancesContainerRef}
        >

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event
              if (!over || active.id === over.id) return

              const oldIndex = advances.findIndex(a => a.id === active.id)
              const newIndex = advances.findIndex(a => a.id === over.id)

              if (oldIndex === -1 || newIndex === -1) return

              onMoveAdvance(oldIndex, newIndex)
            }}
          >
            <SortableContext
              key={`day-${activeDay}`}
              items={advances.map(a => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              {advances.map((advance, index) => {
                const isActive = index === currentAdvanceIndex;

                let progress;

                if (advance.id === "day-evaluation") {
                  progress = dayExams?.[activeDay];
                } else if (advance.id === "conquista-evaluation") {
                  progress = levelState?.finalExam;
                } else {
                  progress =
                    advancesProgress?.[
                      `${activeDay}-${advance.id}`
                    ];
                }

                return (
                  <SortableAdvanceButton
                    key={advance.id}
                    id={advance.id}
                    title={advance.title}
                    isActiveProp={isActive}
                    progress={progress}
                    data-index={index}
                    onClick={() => onChangeAdvance(index)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
       </div>
      )}

      {currentDay === "final-evaluation" && evaluationMessage && (
        <EvaluationMessagePanel
          title={evaluationMessage.title}
          message={evaluationMessage.message}
        />
      )}
    </div>
  )
}
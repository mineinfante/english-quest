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

function SortableAdvanceButton({
  id,
  title,
  isActiveProp,
  progress,
  onClick
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

  const isStarted = progress?.started && !progress?.completed
  const isCompleted = progress?.completed

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`tab-button ${isActiveProp ? "active" : ""}`}
      {...attributes}
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

      {(isActiveProp || isStarted || isCompleted) && (
        <span
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isCompleted
              ? "white"
              : isActiveProp
              ? "#22c55e"
              : "#facc15",
            boxShadow: isCompleted
              ? "0 0 6px rgba(255,255,255,0.6)"
              : isActiveProp
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
  currentDay,
  maxDayUnlocked,
  onChangeDay
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
            {[1,2,3,4,5,6,7].map((day) => {
              const isLocked = day > maxDayUnlocked
              const isActive = day === currentDay

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
                    if (!isLocked) onChangeDay(day)
                  }}
                  disabled={isLocked}
                >
                  {day}

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
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Avances */}
      <div className="header-row">
        <span className="header-label">Avances</span>

        <div className="tabs-container tabs-avances">
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
              key={`day-${currentDay}`}
              items={advances.map(a => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              {advances.map((advance, index) => {
                const isActive = index === currentAdvanceIndex
                const progress =
                  advancesProgress?.[
                    `${currentDay}-${advance.id}`
                  ]

                return (
                  <SortableAdvanceButton
                    key={advance.id}
                    id={advance.id}
                    title={advance.title}
                    isActiveProp={isActive}
                    progress={progress}
                    onClick={() => onChangeAdvance(index)}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>

    </div>
  )
}
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
    opacity: 1,
    cursor: "pointer",
    position: "relative",
  }

  const isStarted = progress?.started && !progress?.completed
  const isCompleted = progress?.completed

  return (
    <button
      ref={setNodeRef}
      style={style}
      disabled={false}
      className={`tab-button ${isActiveProp ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      {...attributes}
    >
      {title}

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
              ? "#22c55e"   // verde activo
              : "#facc15",  // amarillo iniciado
            boxShadow: isCompleted
              ? "0 0 6px rgba(255,255,255,0.6)"
              : isActiveProp
              ? "0 0 6px rgba(34,197,94,0.6)"
              : "none"
          }}
        />
      )}
    </button>
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
  onChangeAdvance,
  onMoveAdvance,
  advancesProgress,
  currentDay
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
              const isLocked = day > currentDay
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
              items={advances.map(a => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              {advances.map((advance, index) => {
                const isActive = index === currentAdvanceIndex
                const progress = advancesProgress?.[advance.id]

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
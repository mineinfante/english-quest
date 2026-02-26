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
  isUnlocked,
  isActive,
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
    opacity: isUnlocked ? 1 : 0.4,
    cursor: isUnlocked ? "pointer" : "not-allowed",
    position: "relative",
  }

    const isStarted = progress?.started && !progress?.completed
    const isCompleted = progress?.completed

  return (
    <button
      ref={setNodeRef}
      style={style}
      disabled={false}
      className={`tab-button ${isActive ? "active" : ""}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {title}

        {isStarted && (
        <span
            style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)"
            }}
        />
        )}

        {isCompleted && (
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
  maxAdvanceUnlocked,
  onChangeAdvance,
  onMoveAdvance,
  advancesProgress
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

                {[1,2,3,4,5,6,7].map((day) => (
                <button
                    key={day}
                    className={`tab-button ${day === 1 ? "active" : ""}`}
                >
                    {day}
                </button>
                ))}
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
                const isUnlocked = true
                const isActive = index === currentAdvanceIndex
                const progress = advancesProgress?.[advance.id]

                return (
                  <SortableAdvanceButton
                    key={advance.id}
                    id={advance.id}
                    title={advance.title}
                    isUnlocked={isUnlocked}
                    isActive={isActive}
                    progress={progress}
                    onClick={() => onChangeAdvance(index)}                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>

    </div>
  )
}
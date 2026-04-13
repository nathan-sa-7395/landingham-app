"use client";

import { useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type { KanbanBoardProps, KanbanItem } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { CardDetailModal } from "./CardDetailModal";

/**
 * Generic Kanban board. 100% client-agnostic:
 *  - No Convex imports.
 *  - No hardcoded domain terms (columns and card bodies come from props).
 *  - The consumer owns persistence via `onDragEnd`.
 *
 * This folder is designed to be copied into a different project wholesale.
 */
export function KanbanBoard<TMeta = Record<string, unknown>>({
  columns,
  items,
  onDragEnd,
  renderCard,
  renderDetails,
  emptyColumnLabel,
  className,
}: KanbanBoardProps<TMeta>) {
  const [selected, setSelected] = useState<KanbanItem<TMeta> | null>(null);

  // Group items by status once per render for fast column lookups.
  const itemsByStatus = useMemo(() => {
    const map: Record<string, KanbanItem<TMeta>[]> = {};
    for (const col of columns) map[col.id] = [];
    for (const item of items) {
      if (!map[item.status]) map[item.status] = [];
      map[item.status].push(item);
    }
    return map;
  }, [columns, items]);

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    onDragEnd(draggableId, source.droppableId, destination.droppableId);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`flex justify-center gap-4 overflow-x-auto pb-4 ${className ?? ""}`}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              items={itemsByStatus[column.id] ?? []}
              onCardClick={setSelected}
              renderCard={renderCard}
              emptyLabel={emptyColumnLabel}
            />
          ))}
        </div>
      </DragDropContext>

      <CardDetailModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        {selected && renderDetails(selected)}
      </CardDetailModal>
    </>
  );
}

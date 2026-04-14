"use client";

import { Droppable } from "@hello-pangea/dnd";
import type { ReactNode } from "react";
import type { KanbanColumnDef, KanbanItem } from "./types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps<TMeta> {
  column: KanbanColumnDef;
  items: KanbanItem<TMeta>[];
  onCardClick: (item: KanbanItem<TMeta>) => void;
  renderCard?: (item: KanbanItem<TMeta>) => ReactNode;
  emptyLabel?: string;
}

/**
 * A single droppable column. Renders its header and hands the
 * item list to KanbanCard. Fully presentational.
 */
export function KanbanColumn<TMeta>({
  column,
  items,
  onCardClick,
  renderCard,
  emptyLabel,
}: KanbanColumnProps<TMeta>) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 self-stretch">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: column.accentColor ?? "#a78bfa" }}
          />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
            {column.title}
          </h3>
        </div>
        <span className="text-xs text-zinc-500">{items.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-2 p-3 transition ${
              snapshot.isDraggingOver ? "bg-violet-500/5" : ""
            }`}
          >
            {items.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-800 py-6 text-center text-xs text-zinc-600">
                {emptyLabel ?? "No items"}
              </div>
            )}
            {items.map((item, index) => (
              <KanbanCard
                key={item.id}
                item={item}
                index={index}
                renderCard={renderCard}
                onClick={() => onCardClick(item)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

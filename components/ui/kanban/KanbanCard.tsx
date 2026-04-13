"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { ReactNode } from "react";
import type { KanbanItem } from "./types";

interface KanbanCardProps<TMeta> {
  item: KanbanItem<TMeta>;
  index: number;
  onClick: () => void;
  renderCard?: (item: KanbanItem<TMeta>) => ReactNode;
}

/**
 * A single draggable card. Delegates its body to `renderCard` when
 * provided, otherwise shows a simple title + subtitle. Contains no
 * domain logic whatsoever.
 */
export function KanbanCard<TMeta>({
  item,
  index,
  onClick,
  renderCard,
}: KanbanCardProps<TMeta>) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-sm text-zinc-100 shadow-sm transition hover:border-cyan-500/40 hover:shadow-neon ${
            snapshot.isDragging ? "ring-2 ring-cyan-400/60" : ""
          }`}
        >
          {renderCard ? (
            renderCard(item)
          ) : (
            <>
              <div className="font-medium">{item.title}</div>
              {item.subtitle && (
                <div className="mt-1 text-xs text-zinc-400">{item.subtitle}</div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

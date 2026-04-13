/**
 * Generic, client-agnostic Kanban types.
 *
 * The Kanban component knows nothing about your domain. It operates on a
 * minimal shape: every item has an id, a status (matching a column id),
 * a title, an optional subtitle, and an opaque `metadata` blob the
 * consumer can use however it likes (rendered via `renderCard` /
 * `renderDetails`).
 */
import type { ReactNode } from "react";

export interface KanbanItem<TMeta = Record<string, unknown>> {
  id: string;
  status: string;
  title: string;
  subtitle?: string;
  metadata?: TMeta;
}

export interface KanbanColumnDef {
  id: string;
  title: string;
  /** Optional Tailwind class or CSS color for the column accent. */
  accentColor?: string;
}

export interface KanbanBoardProps<TMeta = Record<string, unknown>> {
  columns: KanbanColumnDef[];
  items: KanbanItem<TMeta>[];
  /**
   * Fired when a card is dropped into a column (including the same one).
   * The consumer is responsible for persisting the change.
   */
  onDragEnd: (itemId: string, fromStatus: string, toStatus: string) => void;
  /** Optional custom card body. Falls back to title + subtitle. */
  renderCard?: (item: KanbanItem<TMeta>) => ReactNode;
  /** Required: body of the modal shown when a card is clicked. */
  renderDetails: (item: KanbanItem<TMeta>) => ReactNode;
  /** Optional text shown when a column has no items. */
  emptyColumnLabel?: string;
  /** Optional className forwarded to the board wrapper. */
  className?: string;
}

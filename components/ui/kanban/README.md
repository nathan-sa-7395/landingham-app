# Generic Kanban Board

A client-agnostic drag-and-drop Kanban component. This folder has **zero** domain or backend dependencies — you can copy `components/ui/kanban` into any Next.js + Tailwind project and use it as-is.

## Dependencies

- `react`
- `@hello-pangea/dnd`
- Tailwind CSS (for styling)

## Usage

```tsx
import { KanbanBoard, type KanbanItem } from "@/components/ui/kanban";

type MyMeta = { ownerName: string; price: number };

const columns = [
  { id: "todo",  title: "To Do" },
  { id: "doing", title: "In Progress" },
  { id: "done",  title: "Done" },
];

const items: KanbanItem<MyMeta>[] = myRows.map((row) => ({
  id: row.id,
  status: row.status,
  title: row.name,
  subtitle: `$${row.price}`,
  metadata: { ownerName: row.owner, price: row.price },
}));

<KanbanBoard
  columns={columns}
  items={items}
  onDragEnd={(id, _from, to) => myUpdateStatus(id, to)}
  renderDetails={(item) => (
    <div>
      <p>Owner: {item.metadata?.ownerName}</p>
      <p>Price: ${item.metadata?.price}</p>
    </div>
  )}
/>
```

## Contract

- **`columns`**: column definitions (`id`, `title`, optional `accentColor`).
- **`items`**: list of cards. Every item has an `id`, a `status` matching a column id, a `title`, an optional `subtitle`, and an opaque `metadata` blob.
- **`onDragEnd(itemId, fromStatus, toStatus)`**: called when a card is dropped. You persist the change.
- **`renderCard(item)`** *(optional)*: customise the card body. Defaults to title + subtitle.
- **`renderDetails(item)`**: body of the modal shown when a card is clicked.

## Design rules (don't break these)

1. No imports from outside this folder except React, `@hello-pangea/dnd`, and types.
2. No hardcoded column titles, labels, or domain terms in the source.
3. Persistence is the consumer's responsibility.

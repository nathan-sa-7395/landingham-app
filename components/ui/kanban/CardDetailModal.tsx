"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

interface CardDetailModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/**
 * Minimal modal used for card details. Content is provided entirely
 * by the consumer via children (so the Kanban library stays generic).
 */
export function CardDetailModal({
  open,
  onClose,
  children,
  title,
}: CardDetailModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-neon"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {title ?? "Details"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-zinc-200">{children}</div>
      </div>
    </div>
  );
}

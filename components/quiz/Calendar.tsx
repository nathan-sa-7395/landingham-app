"use client";

import { useMemo, useState } from "react";

interface CalendarProps {
  value: number | null; // unix ms of chosen slot
  onChange: (ts: number) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// 9:00 → 16:30 in 30-minute increments.
const TIME_SLOTS: { label: string; h: number; m: number }[] = [];
for (let h = 9; h < 17; h++) {
  for (const m of [0, 30]) {
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = ((h + 11) % 12) + 1;
    TIME_SLOTS.push({
      label: `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`,
      h,
      m,
    });
  }
}

/**
 * Custom in-app calendar for the quiz's booking step.
 * Shows a month grid + time-slot picker. No external library.
 */
export function Calendar({ value, onChange }: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => {
    if (value == null) return null;
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const monthDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
            )
          }
          className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-zinc-100">{monthLabel}</span>
        <button
          type="button"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
            )
          }
          className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          →
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {WEEKDAYS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) => {
          if (!day) return <div key={i} />;
          const isPast = day < today;
          const isSelected =
            selectedDay != null && day.getTime() === selectedDay.getTime();
          return (
            <button
              type="button"
              key={i}
              disabled={isPast}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square rounded-lg text-sm transition ${
                isPast
                  ? "cursor-not-allowed text-zinc-700"
                  : isSelected
                    ? "bg-violet-500 font-semibold text-zinc-950 shadow-neon"
                    : "text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDay && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-zinc-400">
            Available times
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const slotDate = new Date(selectedDay);
              slotDate.setHours(slot.h, slot.m, 0, 0);
              const ts = slotDate.getTime();
              const selected = value === ts;
              return (
                <button
                  type="button"
                  key={slot.label}
                  onClick={() => onChange(ts)}
                  className={`rounded-lg border px-3 py-2 text-xs transition ${
                    selected
                      ? "border-violet-400 bg-violet-500/20 text-violet-200"
                      : "border-zinc-800 text-zinc-300 hover:border-violet-500/40"
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

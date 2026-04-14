"use client";

import { useMemo, useState } from "react";

interface CalendarProps {
  value: number | null; // unix ms of chosen slot, always stored as ET
  onChange: (ts: number) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// 9:00 → 16:30 in 30-minute increments (ET hours).
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
 * Returns the UTC offset for America/New_York on the given calendar date.
 * EDT = UTC-4 (2nd Sunday March → 1st Sunday November)
 * EST = UTC-5 (otherwise)
 */
function etOffsetHours(year: number, month: number, day: number): number {
  const nthSunday = (y: number, mo: number, n: number) => {
    const first = new Date(Date.UTC(y, mo, 1));
    const firstSunday = (7 - first.getUTCDay()) % 7;
    return firstSunday + (n - 1) * 7 + 1;
  };
  const dstStart = new Date(Date.UTC(year, 2, nthSunday(year, 2, 2), 7)); // 2nd Sun Mar 2:00 AM ET = 7:00 UTC
  const dstEnd = new Date(Date.UTC(year, 10, nthSunday(year, 10, 1), 6)); // 1st Sun Nov 2:00 AM ET = 6:00 UTC
  const date = new Date(Date.UTC(year, month, day));
  return date >= dstStart && date < dstEnd ? 4 : 5; // hours behind UTC
}

/**
 * Build a UTC timestamp that represents h:m on year/month/day in Eastern Time.
 */
function makeETTimestamp(year: number, month: number, day: number, h: number, m: number): number {
  const offset = etOffsetHours(year, month, day);
  return Date.UTC(year, month, day, h + offset, m);
}

/**
 * "Today" in Eastern Time as a plain calendar date { year, month, day }.
 */
function todayET(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return {
    year: parseInt(parts.find((p) => p.type === "year")!.value),
    month: parseInt(parts.find((p) => p.type === "month")!.value) - 1,
    day: parseInt(parts.find((p) => p.type === "day")!.value),
  };
}

/**
 * Custom in-app calendar for the quiz's booking step.
 * All times are treated as Eastern Time regardless of the user's locale.
 */
export function Calendar({ value, onChange }: CalendarProps) {
  const et = useMemo(() => todayET(), []);

  // "today" as a UTC midnight timestamp for comparison
  const todayUTC = useMemo(
    () => Date.UTC(et.year, et.month, et.day),
    [et],
  );

  const [viewMonth, setViewMonth] = useState({ year: et.year, month: et.month });

  // Which calendar day is selected (UTC midnight, used only for highlighting)
  const [selectedDayUTC, setSelectedDayUTC] = useState<number | null>(() => {
    if (value == null) return null;
    // Reverse: find the ET date of the stored timestamp
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(value));
    const y = parseInt(parts.find((p) => p.type === "year")!.value);
    const mo = parseInt(parts.find((p) => p.type === "month")!.value) - 1;
    const d = parseInt(parts.find((p) => p.type === "day")!.value);
    return Date.UTC(y, mo, d);
  });

  const monthDays = useMemo(() => {
    const { year, month } = viewMonth;
    const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells: number[] = []; // UTC midnight timestamps, -1 for empty cells
    for (let i = 0; i < firstWeekday; i++) cells.push(-1);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(Date.UTC(year, month, d));
    while (cells.length % 7 !== 0) cells.push(-1);
    return cells;
  }, [viewMonth]);

  const monthLabel = new Date(Date.UTC(viewMonth.year, viewMonth.month, 1))
    .toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const prevMonth = () =>
    setViewMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  const nextMonth = () =>
    setViewMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );

  return (
    <div className="space-y-5">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth}
          className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">←</button>
        <span className="text-sm font-semibold text-zinc-100">{monthLabel}</span>
        <button type="button" onClick={nextMonth}
          className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">→</button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {WEEKDAYS.map((w, i) => <div key={i}>{w}</div>)}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((dayUTC, i) => {
          if (dayUTC === -1) return <div key={i} />;
          const isPast = dayUTC < todayUTC;
          const isSelected = dayUTC === selectedDayUTC;
          const dayNum = new Date(dayUTC).getUTCDate();
          return (
            <button
              type="button"
              key={i}
              disabled={isPast}
              onClick={() => setSelectedDayUTC(dayUTC)}
              className={`aspect-square rounded-lg text-sm transition ${
                isPast
                  ? "cursor-not-allowed text-zinc-700"
                  : isSelected
                    ? "bg-violet-500 font-semibold text-zinc-950 shadow-neon"
                    : "text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDayUTC !== null && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400">Available times</span>
            <span className="text-xs text-zinc-500">Eastern Time (ET)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const d = new Date(selectedDayUTC);
              const ts = makeETTimestamp(
                d.getUTCFullYear(),
                d.getUTCMonth(),
                d.getUTCDate(),
                slot.h,
                slot.m,
              );
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

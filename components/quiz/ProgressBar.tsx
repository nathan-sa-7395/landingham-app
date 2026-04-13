"use client";

interface ProgressBarProps {
  current: number; // 1-indexed
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-xs uppercase tracking-wider text-zinc-400">
        <span>
          Step {current} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

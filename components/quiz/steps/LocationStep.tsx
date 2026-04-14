"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function LocationStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
        Where would you like to market?
      </h2>
      <p className="mb-6 text-sm text-zinc-400">
        City, region, or "nationwide" — whatever makes sense for you.
      </p>
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Dallas, TX"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
      />
    </div>
  );
}

"use client";

const OPTIONS = [
  "Less than $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function BudgetStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
        What is your annual Marketing Budget?
      </h2>
      <p className="mb-6 text-sm text-zinc-400">
        This helps us tailor the right mix of channels.
      </p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const checked = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                checked
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-neon"
                  : "border-zinc-800 text-zinc-200 hover:border-cyan-500/40"
              }`}
            >
              <span>{opt}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  checked ? "border-cyan-300" : "border-zinc-700"
                }`}
              >
                {checked && <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

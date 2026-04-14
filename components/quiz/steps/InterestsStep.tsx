"use client";

const OPTIONS = ["Billboard", "Local TV", "Digital (AI Videos)", "Radio"];

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export function InterestsStep({ value, onChange }: Props) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
        Choose all that you're interested in
      </h2>
      <p className="mb-6 text-sm text-zinc-400">Select one or more channels.</p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const checked = value.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                checked
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-neon"
                  : "border-zinc-800 text-zinc-200 hover:border-cyan-500/40"
              }`}
            >
              <span>{opt}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  checked
                    ? "border-cyan-300 bg-cyan-400 text-zinc-950"
                    : "border-zinc-700"
                }`}
              >
                {checked && "✓"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

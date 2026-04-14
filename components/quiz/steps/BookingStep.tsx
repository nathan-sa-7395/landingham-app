"use client";

import type { QuizFormData } from "../QuizFunnel";
import { Calendar } from "../Calendar";

interface Props {
  data: QuizFormData;
  update: <K extends keyof QuizFormData>(key: K, val: QuizFormData[K]) => void;
}

export function BookingStep({ data, update }: Props) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
        Book a time to be contacted
      </h2>
      <p className="mb-6 text-sm text-zinc-400">
        Pick a slot and share your contact info.
      </p>

      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <Calendar
          value={data.bookingAt}
          onChange={(ts) => update("bookingAt", ts)}
        />
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full name"
          value={data.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
        />
        <input
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
        />
      </div>
    </div>
  );
}

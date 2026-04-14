"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProgressBar } from "./ProgressBar";
import { InterestsStep } from "./steps/InterestsStep";
import { CadenceStep } from "./steps/CadenceStep";
import { LocationStep } from "./steps/LocationStep";
import { BudgetStep } from "./steps/BudgetStep";
import { BookingStep } from "./steps/BookingStep";

export interface QuizFormData {
  interests: string[];
  cadence: string;
  location: string;
  budget: string;
  bookingAt: number | null;
  fullName: string;
  email: string;
  phone: string;
}

const INITIAL: QuizFormData = {
  interests: [],
  cadence: "",
  location: "",
  budget: "",
  bookingAt: null,
  fullName: "",
  email: "",
  phone: "",
};

const TOTAL_STEPS = 5;

const slide = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.28, ease: "easeOut" },
};

/**
 * Multi-step public-facing quiz funnel. Holds all form state, animates
 * between steps with Framer Motion, and submits to Convex on completion.
 */
export function QuizFunnel() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizFormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createLead = useMutation(api.leads.createLead);

  const update = <K extends keyof QuizFormData>(key: K, val: QuizFormData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.interests.length > 0;
      case 2:
        return data.cadence !== "";
      case 3:
        return data.location.trim().length > 0;
      case 4:
        return data.budget !== "";
      case 5:
        return (
          data.bookingAt !== null &&
          data.fullName.trim() !== "" &&
          /.+@.+\..+/.test(data.email) &&
          data.phone.trim() !== ""
        );
      default:
        return false;
    }
  };

  const submit = async () => {
    if (!canProceed() || data.bookingAt == null) return;
    setSubmitting(true);
    try {
      await createLead({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        interests: data.interests,
        cadence: data.cadence,
        location: data.location.trim(),
        budget: data.budget,
        bookingAt: data.bookingAt,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950/80 p-10 text-center shadow-neon">
        <div className="mb-4 text-5xl">✨</div>
        <h2 className="mb-2 text-2xl font-semibold text-violet-300">
          Thanks — we'll be in touch!
        </h2>
        <p className="text-sm text-zinc-400">
          Your booking is locked in. A member of our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-10 shadow-neon">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div key={step} {...slide}>
            {step === 1 && (
              <InterestsStep
                value={data.interests}
                onChange={(v) => update("interests", v)}
              />
            )}
            {step === 2 && (
              <CadenceStep
                value={data.cadence}
                onChange={(v) => update("cadence", v)}
              />
            )}
            {step === 3 && (
              <LocationStep
                value={data.location}
                onChange={(v) => update("location", v)}
              />
            )}
            {step === 4 && (
              <BudgetStep
                value={data.budget}
                onChange={(v) => update("budget", v)}
              />
            )}
            {step === 5 && (
              <BookingStep
                data={data}
                update={update}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:text-zinc-100 disabled:opacity-30"
        >
          ← Back
        </button>
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={next}
            disabled={!canProceed()}
            className="rounded-lg bg-violet-500 px-6 py-2 text-sm font-semibold text-zinc-950 shadow-neon transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canProceed() || submitting}
            className="rounded-lg bg-violet-500 px-6 py-2 text-sm font-semibold text-zinc-950 shadow-neon transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Book my call"}
          </button>
        )}
      </div>
    </div>
  );
}

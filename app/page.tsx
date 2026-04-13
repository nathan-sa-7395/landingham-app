import Image from "next/image";
import { QuizFunnel } from "@/components/quiz/QuizFunnel";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-2xl" />

      {/* Top-left logo */}
      <div className="relative px-6 pt-5">
        <Image
          src="/logo-light.png"
          alt="Last Minute Media Deals"
          width={120}
          height={36}
          priority
          className="h-auto w-28"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-10 sm:pt-14">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
            Get the right media mix in{" "}
            <span className="text-cyan-400">minutes</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400">
            Tell us what you need and we'll match you with high-converting
            billboard, TV, and radio inventory — priced to move.
          </p>
        </header>

        <QuizFunnel />
      </div>
    </main>
  );
}

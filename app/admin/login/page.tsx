"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Two-phase login: enter email → enter 6-digit OTP.
 * Both phases hit our /api/auth/* routes, which talk to Convex.
 */
export default function LoginPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed");
      }
      setPhase("code");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Invalid code");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-neon">
        <div className="mb-5 flex justify-center">
          <Image
            src="/logo-light.png"
            alt="Last Minute Media Deals"
            width={200}
            height={60}
            priority
            className="h-auto w-40"
          />
        </div>
        <h1 className="mb-1 text-2xl font-semibold text-zinc-100">
          Admin Login
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          {phase === "email"
            ? "Enter your email to receive a one-time code."
            : `We sent a code to ${email}. Check your server console.`}
        </p>

        {phase === "email" ? (
          <form onSubmit={requestOtp} className="space-y-3">
            <input
              type="email"
              required
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-neon transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              autoFocus
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-lg tracking-[0.4em] text-zinc-100 placeholder-zinc-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-neon transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPhase("email");
                setCode("");
                setError(null);
              }}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300"
            >
              Use a different email
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

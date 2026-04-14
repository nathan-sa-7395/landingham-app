import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 p-6">
      <span className="text-lg font-semibold tracking-wide text-zinc-100">
        Landingham &amp; Winningmore
      </span>
      <SignIn />
    </main>
  );
}

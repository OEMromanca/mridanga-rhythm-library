"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAccount, signInAccount } from "@/lib/auth/accounts";
import { supabase } from "@/lib/supabase/client";
import { useAccount } from "./AccountProvider";
import { AuthShell } from "./AuthShell";
import { PasswordInput } from "./PasswordInput";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const router = useRouter();
  const { user, loading } = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (register && password !== confirmPassword) { setError("Your passwords don’t match."); return; }
    setPending("email");
    try {
      if (register) {
        await registerAccount(email, password, window.location.origin);
      } else {
        await signInAccount(email, password);
      }
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn’t sign you in. Please try again.");
    } finally { setPending(null); }
  }

  async function social(provider: "google") {
    setError("");
    setPending(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in didn’t finish. Please try again.");
      setPending(null);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-semibold text-zinc-900">{register ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-zinc-600">{register ? "Join the Mridanga Rhythm Library." : "Sign in to Mridanga Rhythm Library."}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-700">Email address</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={pending !== null} className="h-10 bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-600 focus:ring-purple-600 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</Label>
              {!register && <Link href="/forgot-password" className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline">Forgot password?</Link>}
            </div>
            <PasswordInput id="password" value={password} onChange={setPassword} autoComplete={register ? "new-password" : "current-password"} placeholder={register ? "Create a password" : "Enter your password"} disabled={pending !== null} />
          </div>
          {register && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-zinc-700">Confirm password</Label>
              <PasswordInput id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Repeat your password" disabled={pending !== null} />
            </div>
          )}
          {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending !== null || loading} className="h-10 w-full bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-xl">
            {pending === "email" || loading ? <Loader2 className="animate-spin" /> : register ? <Check /> : <ArrowRight />}
            {register ? "Create account" : "Sign in"}
          </Button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">or continue with</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <div className="space-y-2.5">
          <Button type="button" variant="outline" className="h-10 w-full bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm rounded-xl gap-3 flex items-center justify-center font-medium" disabled={pending !== null || loading} onClick={() => void social("google")}>
            {pending === "google" ? (
              <Loader2 className="animate-spin h-4 w-4 text-zinc-600" />
            ) : (
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54L20.0303 3.115C17.9503 1.19 15.2203 0 12.0003 0C7.31028 0 3.25528 2.69 1.28028 6.61L5.27028 9.7C6.21028 6.87 8.86028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.07 18.1L19.99 21.14C22.28 19.03 23.49 15.94 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.27 14.3C5.03 13.59 4.9 12.81 4.9 12C4.9 11.19 5.03 10.41 5.27 9.7L1.28 6.61C0.47 8.22 0 10.06 0 12C0 13.94 0.47 15.78 1.28 17.39L5.27 14.3Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0003 24C15.2403 24 17.9703 22.92 19.99 21.14L16.07 18.1C15.0003 18.82 13.6203 19.25 12.0003 19.25C8.86028 19.25 6.21028 17.13 5.27 14.3L1.28 17.39C3.25528 21.31 7.31028 24 12.0003 24Z"
                  fill="#34A853"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600">
        {register ? "Already have an account?" : "New to the library?"}{" "}
        <Link href={register ? "/auth" : "/register"} className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
          {register ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </AuthShell>
  );
}

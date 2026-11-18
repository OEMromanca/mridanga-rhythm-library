"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Heslo musí mať aspoň 6 znakov.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Zadané heslá sa nezhodujú.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }

      setIsSuccess(true);

      // Redirect after 2.5 seconds to /auth
      setTimeout(() => {
        router.push("/auth");
      }, 2500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa aktualizovať heslo. Odkaz môže byť neplatný alebo exspiroval."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-semibold">Zmena hesla</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Zadajte vaše nové heslo pre zabezpečenie účtu.
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-zinc-900">Heslo bolo úspešne zmenené</h2>
            <p className="text-sm text-zinc-600">
              Vaše heslo bolo aktualizované. O chvíľu budete presmerovaní na prihlásenie.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild className="w-full bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-xl">
              <Link href="/auth">
                Prejsť na prihlásenie
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-zinc-700">Nové heslo</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="h-10 pl-9 bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-600 focus:ring-purple-600 rounded-xl"
              />
            </div>
            <p className="text-xs text-zinc-500">Minimálne 6 znakov</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">Potvrdenie nového hesla</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="h-10 pl-9 bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-600 focus:ring-purple-600 rounded-xl"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="h-10 w-full bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-xl">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Uložiť nové heslo
          </Button>

          <div className="text-center pt-2">
            <Link href="/auth" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Späť na prihlásenie
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa odoslať email na obnovu hesla. Skúste to znova."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-semibold">Zabudli ste heslo?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Zadajte vašu emailovú adresu a pošleme vám odkaz na obnovenie hesla.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <MailCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-zinc-900">Skontrolujte si email</h2>
            <p className="text-sm text-zinc-600">
              Na adresu <span className="font-medium text-zinc-900">{email}</span> sme odoslali pokyny na obnovenie hesla.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline" className="w-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded-xl">
              <Link href="/auth">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Späť na prihlásenie
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Emailová adresa</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="h-10 bg-card border-slate-800 text-foreground"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="h-10 w-full bg-purple-600 text-white font-medium hover:bg-purple-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Odoslať odkaz na obnovu
          </Button>

          <div className="text-center pt-2">
            <Link href="/auth" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Späť na prihlásenie
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

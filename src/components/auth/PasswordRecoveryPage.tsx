import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, updateRecoveryPassword, signOutAccount } from "@/lib/auth/accounts";
import { useAccount } from "./AccountProvider";
import { AuthShell } from "./AuthShell";
import { PasswordInput } from "./PasswordInput";

export function PasswordRecoveryPage({ reset = false }: { reset?: boolean }) {
  const { user, loading } = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [recoveryLink, setRecoveryLink] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (reset) {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      setRecoveryLink(hash.get("type") === "recovery" && Boolean(hash.get("access_token")));
      if (hash.get("error_description")) setError(hash.get("error_description") ?? "This reset link is no longer valid.");
    }
    setChecked(true);
  }, [reset]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (reset && password !== confirm) { setError("Your passwords don’t match."); return; }
    setPending(true);
    try {
      if (reset) {
        await updateRecoveryPassword(password);
        await signOutAccount();
      } else {
        await requestPasswordReset(email, window.location.origin);
      }
      setSuccess(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setPending(false); }
  }

  const invalidLink = reset && checked && !loading && (!recoveryLink || !user);

  return (
    <AuthShell>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">{success ? <Check className="h-6 w-6" /> : <Mail className="h-6 w-6" />}</div>
      <h1 className="font-display text-3xl font-semibold">{success ? reset ? "Password updated" : "Check your email" : reset ? "Set a new password" : "Forgot your password?"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{success ? reset ? "Your new password is ready. Sign in to continue." : "If there’s an account with that email, you’ll receive a password reset link." : invalidLink ? "This reset link is invalid or has expired. Request a new one below." : reset ? "Choose a new password for your account." : "Enter your email and we’ll send you a reset link."}</p>
      {reset && (!checked || loading) ? <Loader2 className="mx-auto mt-6 animate-spin text-primary" aria-label="Checking reset link" /> : !success && !invalidLink && (
        <form onSubmit={submit} className="mt-6 space-y-4">
          {reset ? <><div className="space-y-2"><Label htmlFor="new-password">New password</Label><PasswordInput id="new-password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="Create a new password" disabled={pending} /></div><div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><PasswordInput id="confirm-password" value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Repeat your new password" disabled={pending} /></div></> : <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" disabled={pending} className="h-10 bg-card" /></div>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending} className="h-10 w-full">{pending ? <Loader2 className="animate-spin" /> : reset ? <Check /> : <Mail />}{reset ? "Update password" : "Send reset link"}</Button>
        </form>
      )}
      {invalidLink && <Button asChild className="mt-6 w-full"><Link href="/forgot-password">Request a new link</Link></Button>}
      <Button asChild variant="ghost" className="mt-6 w-full"><Link href="/auth"><ArrowLeft />Back to sign in</Link></Button>
    </AuthShell>
  );
}

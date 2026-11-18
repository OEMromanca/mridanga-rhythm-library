import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordInput({ id, value, onChange, autoComplete = "current-password", placeholder = "Enter your password", minLength, disabled }: {
  id: string; value: string; onChange: (value: string) => void; autoComplete?: string; placeholder?: string; minLength?: number; disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} minLength={minLength} required disabled={disabled} className="h-10 bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-600 focus:ring-purple-600 rounded-xl pr-11" />
      <Button type="button" variant="ghost" size="icon" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"} aria-pressed={visible} className="absolute right-0.5 top-0.5 text-zinc-400 hover:text-zinc-700" disabled={disabled}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
    </div>
  );
}
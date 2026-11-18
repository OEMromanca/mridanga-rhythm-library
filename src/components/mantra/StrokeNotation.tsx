import type { Notation } from "@/lib/mantra/types";
import { cn } from "@/lib/utils";
import { CircleIcon, CrossCircleIcon } from "@/components/ui/Icons";

/**
 * Renders one notation value, mapping circle (○) to CircleIcon and cross-circle (×) to CrossCircleIcon,
 * or fallback to text / symbol.
 */
export function StrokeNotation({ value, className }: { value: Notation; className?: string }) {
  if (!value) {
    return <span className={cn("text-muted-foreground/50", className)} aria-label="empty">–</span>;
  }
  if (value === "○") {
    return <CircleIcon className={cn("w-4 h-4 text-primary inline-block", className)} />;
  }
  if (value === "×") {
    return <CrossCircleIcon className={cn("w-4 h-4 text-primary inline-block", className)} />;
  }
  return <span className={cn("font-mono text-lg leading-none text-foreground", className)}>{value}</span>;
}

import type { Stroke } from "@/lib/mantra/types";
import { cn } from "@/lib/utils";

export function NotationPreview({
  strokes,
  max,
  size = "sm",
}: {
  strokes: Stroke[];
  max?: number;
  size?: "sm" | "lg";
}) {
  const shown = max ? strokes.slice(0, max) : strokes;
  const rest = strokes.length - shown.length;
  if (strokes.length === 0) return <span className="text-sm text-muted-foreground">No strokes yet</span>;
  return (
    <div className={cn("flex flex-wrap items-center", size === "lg" ? "gap-2" : "gap-1")}>
      {shown.map((st, i) => (
        <span
          key={st.id}
          className={cn(
            "rounded-md bg-token font-mono font-medium text-token-foreground",
            size === "lg" ? "px-3 py-1.5 text-base" : "px-1.5 py-0.5 text-xs",
          )}
          title={`${i + 1}. ${st.name}`}
        >
          {st.name}
        </span>
      ))}
      {rest > 0 && <span className="font-mono text-xs text-muted-foreground">+{rest}</span>}
    </div>
  );
}

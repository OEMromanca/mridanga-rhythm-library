import { Drum, Music2 } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/mantra/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  selected,
  counts,
  onSelect,
  isBeatsActive,
  onSelectBeats,
}: {
  selected: Category | "Beats";
  counts: Record<string, number>;
  onSelect: (c: Category) => void;
  isBeatsActive?: boolean;
  onSelectBeats?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
          <Drum className="h-5 w-5" />
        </div>
        <div className="font-display text-[17px] font-semibold leading-tight">
          Mridanga
          <span className="block text-xs font-sans font-medium text-muted-foreground">Rhythm Library</span>
        </div>
      </div>
      <div className="mx-5 border-t border-border" />
      <nav aria-label="Rhythm categories" className="flex-1 overflow-y-auto px-3 py-4">
        {onSelectBeats && (
          <div className="mb-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Management</p>
            <button
              onClick={onSelectBeats}
              aria-current={isBeatsActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isBeatsActive ? "bg-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
              )}
            >
              <Drum className={cn("h-4 w-4 shrink-0", isBeatsActive ? "text-primary" : "text-muted-foreground")} />
              <span className="flex-1 truncate text-left">Beats</span>
            </button>
          </div>
        )}
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
        <ul className="space-y-0.5">
          {CATEGORIES.map((c) => {
            const active = c === selected;
            return (
              <li key={c}>
                <button
                  onClick={() => onSelect(c)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
                  )}
                >
                  <Music2 className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="flex-1 truncate text-left">{c}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {counts[c] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="px-5 py-4 text-[11px] leading-relaxed text-muted-foreground">
        Sample data and placeholder symbols for illustration only.
      </p>
    </div>
  );
}

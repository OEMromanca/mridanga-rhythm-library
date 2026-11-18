"use client";

import { Drum, Music2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/mantra/types";
import type { Mantra } from "@/lib/mantra/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  mantras,
  isBeatsActive,
  onSelectBeats,
}: {
  mantras: Mantra[];
  isBeatsActive?: boolean;
  onSelectBeats?: () => void;
}) {
  const pathname = usePathname();

  // Compute counts dynamically from mantras
  const counts = mantras.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find first mantra ID for each category to link to /tal/[id]
  const firstMantraPerCategory = CATEGORIES.reduce((acc, cat) => {
    const found = mantras.find((m) => m.category === cat);
    if (found) {
      acc[cat] = found.id;
    }
    return acc;
  }, {} as Record<string, string>);

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
            const firstId = firstMantraPerCategory[c];
            const href = firstId ? `/tal/${firstId}` : "#";
            
            // Check if active based on pathname matching /tal/[id] where the tal belongs to category c
            const activeMantra = mantras.find((m) => pathname === `/tal/${m.id}`);
            const active = activeMantra?.category === c;

            return (
              <li key={c}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
                    !firstId && "opacity-50 pointer-events-none"
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
                </Link>
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

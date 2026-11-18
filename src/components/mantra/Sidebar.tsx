import { Drum } from "lucide-react";
import type { Mantra } from "@/lib/mantra/types";
import { SidebarNavLinks } from "./SidebarNavLinks";

export function Sidebar({
  mantras,
  isBeatsActive,
  onSelectBeats,
}: {
  mantras: Mantra[];
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
      <SidebarNavLinks
        mantras={mantras}
        isBeatsActive={isBeatsActive}
        onSelectBeats={onSelectBeats}
      />
      <p className="px-5 py-4 text-[11px] leading-relaxed text-muted-foreground">
        Sample data and placeholder symbols for illustration only.
      </p>
    </div>
  );
}

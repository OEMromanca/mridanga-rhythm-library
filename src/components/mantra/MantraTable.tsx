import { Pencil, SearchX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Mantra } from "@/lib/mantra/types";
import { NotationPreview } from "./NotationPreview";

interface RowActions {
  onDetails: (m: Mantra) => void;
  onEdit: (m: Mantra) => void;
  onDelete: (m: Mantra) => void;
  isAdmin?: boolean;
}

function IconAction({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={onClick}
          className={danger ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : "text-muted-foreground"}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function MantraRow({ mantra, onDetails, onEdit, onDelete, isAdmin }: { mantra: Mantra; isAdmin?: boolean } & RowActions) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/40 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,1fr)_auto] md:items-center md:gap-6">
      <div>
        <button onClick={() => onDetails(mantra)} className="text-left font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline">
          {mantra.name}
        </button>
        <p className="mt-0.5 text-xs text-muted-foreground">{mantra.strokes.length} strokes</p>
      </div>
      <NotationPreview strokes={mantra.strokes} max={8} />
      <div className="text-sm text-muted-foreground">{mantra.author || "—"}</div>
      <div className="flex items-center gap-1 md:justify-end">
        <Button variant="outline" size="sm" onClick={() => onDetails(mantra)}>Details</Button>
        {isAdmin && (
          <>
            <IconAction label={`Edit ${mantra.name}`} onClick={() => onEdit(mantra)}><Pencil className="h-4 w-4" /></IconAction>
            <IconAction danger label={`Delete ${mantra.name}`} onClick={() => onDelete(mantra)}><Trash2 className="h-4 w-4" /></IconAction>
          </>
        )}
      </div>
    </div>
  );
}

export function MantraTable({ mantras, query, isAdmin, ...actions }: { mantras: Mantra[]; query: string; isAdmin?: boolean } & RowActions) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,1fr)_auto] gap-6 border-b border-border bg-muted/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Mantra</span>
        <span>Notation</span>
        <span>Author</span>
        <span className="w-[150px] text-right">Actions</span>
      </div>
      {mantras.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">{query ? "No matching mantras" : "No mantras yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {query ? `Nothing matches “${query}”. Try another name or author.` : "Add the first mantra to this category."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {mantras.map((m) => <MantraRow key={m.id} mantra={m} isAdmin={isAdmin} {...actions} />)}
        </div>
      )}
    </div>
  );
}

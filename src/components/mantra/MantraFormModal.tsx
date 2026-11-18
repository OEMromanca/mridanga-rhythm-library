import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type Category, type Mantra } from "@/lib/mantra/types";
import { StrokeEditor } from "./StrokeEditor";

export type FormState = { mode: "create"; category: Category } | { mode: "edit"; mantra: Mantra } | null;

const empty = (category: Category): Mantra => ({ id: "", name: "", category, author: "", description: "", strokes: [] });

export function MantraFormModal({ state, onClose, onSave }: { state: FormState; onClose: () => void; onSave: (m: Mantra, mode: "create" | "edit") => void }) {
  const [draft, setDraft] = useState<Mantra>(empty("Kaharwa Tal"));

  useEffect(() => {
    if (!state) return;
    setDraft(state.mode === "edit" ? structuredClone(state.mantra) : empty(state.category));
  }, [state]);

  const set = <K extends keyof Mantra>(k: K, v: Mantra[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = draft.name.trim();
    const finalName = trimmedName !== "" ? trimmedName : `${draft.category} Variation`;

    // In create mode, we want to omit or clear id so Supabase generates a valid UUID automatically.
    // In edit mode, we keep the existing valid id.
    const mantraToSave: Mantra = {
      ...draft,
      id: state?.mode === "create" ? "" : draft.id,
      name: finalName,
      author: draft.author.trim() ? draft.author.trim() : "",
      description: draft.description.trim() ? draft.description.trim() : "",
    };

    onSave(mantraToSave, state!.mode);
  };

  const isOpen = !!state;
  const title = state?.mode === "edit" ? "Edit Mantra" : "Add Mantra";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={submit} className="space-y-6" noValidate>
        <p className="text-sm text-muted-foreground -mt-2">Notation symbols are temporary placeholders.</p>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic information</legend>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="m-name">Mantra name</Label>
            <Input id="m-name" placeholder="e.g. Kaharwa Variation 2" value={draft.name}
              onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-cat">Category *</Label>
            <select id="m-cat" required value={draft.category} onChange={(e) => set("category", e.target.value as Category)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-author">Author</Label>
            <Input id="m-author" placeholder="Teacher or source" value={draft.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="m-desc">Description & notes</Label>
            <Textarea id="m-desc" rows={4} placeholder="Practice notes, variations, tempo hints…" value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strokes ({draft.strokes.length})</legend>
          <StrokeEditor strokes={draft.strokes} onChange={(s) => set("strokes", s)} />
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Mantra</Button>
        </div>
      </form>
    </Modal>
  );
}

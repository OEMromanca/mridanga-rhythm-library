import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type Category, type Mantra } from "@/lib/mantra/types";
import { NotationPreview } from "./NotationPreview";
import { StrokeNotation } from "./StrokeNotation";
import { StrokeEditor } from "./StrokeEditor";

export function MantraDetailsModal({
  isOpen,
  onClose,
  mantra,
  onSave,
  isAdmin,
}: {
  isOpen: boolean;
  onClose: () => void;
  mantra: Mantra | null;
  onSave: (updatedMantra: Mantra) => void;
  isAdmin?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Mantra | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    setIsEditing(false);
    setErrors({});
    if (mantra) {
      setFormData(structuredClone(mantra));
    } else {
      setFormData(null);
    }
  }, [mantra, isOpen]);

  const setField = <K extends keyof Mantra>(k: K, v: Mantra[K]) => {
    if (formData) {
      setFormData({ ...formData, [k]: v });
    }
  };

  const handleSave = () => {
    if (!formData) return;
    if (!formData.name.trim()) {
      setErrors({ name: "Mantra name is required." });
      return;
    }
    const updated = {
      ...formData,
      name: formData.name.trim(),
      author: formData.author.trim(),
    };
    onSave(updated);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      setErrors({});
      if (mantra) {
        setFormData(structuredClone(mantra));
      }
    } else {
      onClose();
    }
  };

  if (!mantra || !formData) return null;

  const title = isEditing ? "Edit Mantra" : mantra.name;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 -mt-2">
            <Badge variant="secondary">{mantra.category}</Badge>
            <span className="text-sm text-muted-foreground">by {mantra.author || "Unknown author"}</span>
          </div>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stroke sequence</h3>
            <div className="rounded-xl bg-muted/50 p-4"><NotationPreview strokes={mantra.strokes} size="lg" /></div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stroke details</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">Bol / Stroke</th>
                    <th className="px-4 py-2.5 text-center">Large Head <span className="normal-case">(pravá)</span></th>
                    <th className="px-4 py-2.5 text-center">Small Head <span className="normal-case">(ľavá)</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mantra.strokes.map((s, i) => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-mono font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-center"><StrokeNotation value={s.largeHeadNotation} /></td>
                      <td className="px-4 py-3 text-center"><StrokeNotation value={s.smallHeadNotation} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description & Notes</h3>
            {mantra.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed">{mantra.description}</p>
            ) : (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">No description or notes added yet.</p>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleCancel}>Close</Button>
            {isAdmin && (
              <Button onClick={() => setIsEditing(true)}><Pencil className="h-4 w-4" /> Edit Mantra</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground -mt-2">Modify mantra details and stroke sequence below.</p>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic information</legend>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="m-name">Mantra name *</Label>
              <Input
                id="m-name"
                placeholder="e.g. Kaharwa Variation 2"
                value={formData.name}
                aria-invalid={!!errors.name}
                onChange={(e) => {
                  setField("name", e.target.value);
                  setErrors({});
                }}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-cat">Category *</Label>
              <select
                id="m-cat"
                required
                value={formData.category}
                onChange={(e) => setField("category", e.target.value as Category)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-author">Author</Label>
              <Input
                id="m-author"
                placeholder="Teacher or source"
                value={formData.author}
                onChange={(e) => setField("author", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="m-desc">Description & notes</Label>
              <Textarea
                id="m-desc"
                rows={4}
                placeholder="Practice notes, variations, tempo hints…"
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Strokes ({formData.strokes.length})
            </legend>
            <StrokeEditor strokes={formData.strokes} onChange={(s) => setField("strokes", s)} />
          </fieldset>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="button" onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import type { Mantra } from "@/lib/mantra/types";

export function DeleteConfirmationDialog({
  mantra,
  onCancel,
  onConfirm,
}: {
  mantra: Mantra | null;
  onCancel: () => void;
  onConfirm: (m: Mantra) => void;
}) {
  const isOpen = !!mantra;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete this mantra?">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground -mt-2">
          “<span className="font-semibold text-foreground">{mantra?.name}</span>” will be removed from the library.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mantra && onConfirm(mantra)}
          >
            Delete Mantra
          </Button>
        </div>
      </div>
    </Modal>
  );
}

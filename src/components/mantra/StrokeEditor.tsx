import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { ArrowDown, ArrowUp, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_NOTATION, STROKE_NAMES, uid, type Stroke, type StrokeName } from "@/lib/mantra/types";
import {
  circleImg,
  filledCircleImg,
  circleNumber1Img,
  filledCircleNumber2Img,
  circleNumber3Img,
  circleNumber4Img,
  filledCircleNumber1Img,
  filledCircleNumber3Img,
  filledCircleNumber4Img,
  twoCirclesImg,
  tCircleImg,
} from "@/assets/icons";

const LARGE_HEAD_OPTIONS = [
  { value: "", img: null },
  { value: "circleImg", img: circleImg },
  { value: "filledCircleImg", img: filledCircleImg },
  { value: "filledCircleNumber1Img", img: filledCircleNumber1Img },
  { value: "filledCircleNumber2Img", img: filledCircleNumber2Img },
  { value: "filledCircleNumber3Img", img: filledCircleNumber3Img },
];

const SMALL_HEAD_OPTIONS = [
  { value: "", img: null },
  { value: "circleNumber1Img", img: circleNumber1Img },
  { value: "filledCircleNumber1Img", img: filledCircleNumber1Img },
  { value: "circleNumber3Img", img: circleNumber3Img },
  { value: "filledCircleNumber3Img", img: filledCircleNumber3Img },
  { value: "circleNumber4Img", img: circleNumber4Img },
  { value: "filledCircleNumber4Img", img: filledCircleNumber4Img },
  { value: "twoCirclesImg", img: twoCirclesImg },
  { value: "tCircleImg", img: tCircleImg },
];

const selectCls =
  "h-9 w-full rounded-md border border-input bg-background px-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function CustomDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: typeof LARGE_HEAD_OPTIONS;
  onChange: (val: string) => void;
  ariaLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedOpt = options.find((o) => o.value === value);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, { capture: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <div className="flex items-center justify-center flex-1">
          {selectedOpt?.img ? (
            <Image src={selectedOpt.img} alt="" width={32} height={32} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-xs text-muted-foreground">–</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      {isOpen && coords && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
          }}
          className="z-[9999] max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {opt.img ? (
                <Image src={opt.img} alt="" width={32} height={32} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">–</span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export function StrokeEditor({ strokes, onChange }: { strokes: Stroke[]; onChange: (s: Stroke[]) => void }) {
  const update = (i: number, patch: Partial<Stroke>) => onChange(strokes.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...strokes];
    const [item] = next.splice(i, 1);
    if (item) next.splice(i + d, 0, item);
    onChange(next);
  };
  const add = () => onChange([...strokes, { id: uid(), name: "Dha", largeHeadNotation: "", smallHeadNotation: "" }]);

  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
        <span>#</span><span>Stroke</span><span>Large Head (pravá)</span><span>Small Head (ľavá)</span><span className="w-[108px]" />
      </div>
      {strokes.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">No strokes yet. Add the first one below.</p>
      )}
      {strokes.map((s, i) => {
        return (
          <div key={s.id} className="grid grid-cols-[2rem_1fr_1fr_1fr] items-center gap-2 rounded-lg bg-muted/40 p-1.5 sm:grid-cols-[2rem_1fr_1fr_1fr_auto]">
            <span className="text-center font-mono text-xs text-muted-foreground">{i + 1}</span>
            <select
              aria-label={`Stroke ${i + 1} name`}
              className={selectCls}
              value={s.name}
              onChange={(e) => {
                const name = e.target.value as StrokeName;
                update(i, { name, largeHeadNotation: DEFAULT_NOTATION[name].large, smallHeadNotation: DEFAULT_NOTATION[name].small });
              }}
            >
              {STROKE_NAMES.map((n) => <option key={n}>{n}</option>)}
            </select>

            {/* Large Head Custom Dropdown with pure icons */}
            <CustomDropdown
              ariaLabel={`Stroke ${i + 1} large head`}
              value={s.largeHeadNotation}
              options={LARGE_HEAD_OPTIONS}
              onChange={(val) => update(i, { largeHeadNotation: val })}
            />

            {/* Small Head Custom Dropdown with pure icons */}
            <CustomDropdown
              ariaLabel={`Stroke ${i + 1} small head`}
              value={s.smallHeadNotation}
              options={SMALL_HEAD_OPTIONS}
              onChange={(val) => update(i, { smallHeadNotation: val })}
            />

            <div className="col-span-4 flex justify-end gap-0.5 sm:col-span-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Move down" disabled={i === strokes.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" aria-label={`Remove stroke ${i + 1}`} onClick={() => onChange(strokes.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4" /> Add Stroke</Button>
    </div>
  );
}

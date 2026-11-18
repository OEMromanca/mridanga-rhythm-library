import Image from "next/image";
import {
  circleImg,
  circleNumber1Img,
  circleNumber3Img,
  circleNumber4Img,
  filledCircleImg,
  filledCircleNumber1Img,
  filledCircleNumber2Img,
  filledCircleNumber3Img,
  filledCircleNumber4Img,
  twoCirclesImg,
  tCircleImg,
} from "@/assets/icons";
import { DrumIcon, BeatIcon } from "@/components/ui/Icons";

export function BeatsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <DrumIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mridanga Beats & Strokes</h1>
          <p className="text-sm text-muted-foreground">Prehľad základných úderov mridangy (CircleIcon = otvorený úder, CrossCircleIcon = zatvorený úder).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Big Head */}
<div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
  <div className="flex items-center gap-2 mb-4">
    <span className="text-purple-600">🎵</span>
    <h3 className="font-display text-xl font-semibold tracking-tight flex items-center gap-2 text-zinc-900">Big Head</h3>
  </div>
  <hr className="border-t border-zinc-100 mb-4" />

  <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-start justify-center min-h-[180px]">
    
      <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Image src={circleImg} alt="Open stroke" width={64} height={64} className="w-16 h-16 object-contain" />
        <span className="text-lg font-semibold text-zinc-800">- Open stroke</span>
      </div>
      <div className="flex items-center gap-3">
        <Image src={filledCircleImg} alt="Closed stroke" width={64} height={64} className="w-16 h-16 object-contain" />
        <span className="text-lg font-semibold text-zinc-800">- Closed stroke</span>
      </div>
      <div className="flex items-center gap-3">
        <Image src={filledCircleNumber1Img} alt="dugi 1" width={64} height={64} className="w-16 h-16 object-contain" />
        <span className="text-lg font-semibold text-zinc-800">- dugi 1</span>
      </div>
      <div className="flex items-center gap-3">
        <Image src={filledCircleNumber2Img} alt="dugi 2" width={64} height={64} className="w-16 h-16 object-contain" />
        <span className="text-lg font-semibold text-zinc-800">- dugi 2</span>
      </div>
      <div className="flex items-center gap-3">
        <Image src={filledCircleNumber3Img} alt="dugi 3" width={64} height={64} className="w-16 h-16 object-contain" />
        <span className="text-lg font-semibold text-zinc-800">- dugi 3</span>
      </div>
    </div>

    <p className="text-xs text-zinc-400 mt-6">Big Head Beats / Strokes skeleton</p>
    <p className="text-xs text-zinc-400">List of beats for the right side will be displayed here.</p>
  </div>
</div>

        {/* Right Column: Small Head */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="font-display text-xl font-semibold tracking-tight flex items-center gap-2">
              <BeatIcon className="w-5 h-5 text-primary" /> Small Head
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-start justify-start p-6 border-2 border-dashed border-border rounded-lg mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image src={circleNumber1Img} alt="one finger open" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- one finger open</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={filledCircleNumber1Img} alt="one finger closed" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- one finger closed</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={circleNumber3Img} alt="three fingers open" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- three fingers open</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={filledCircleNumber3Img} alt="three fingers closed" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- three fingers closed</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={circleNumber4Img} alt="four fingers open" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- four fingers open</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={filledCircleNumber4Img} alt="four fingers closed" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- four fingers closed</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={twoCirclesImg} alt="one finger up" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- one finger up</span>
              </div>
              <div className="flex items-center gap-3">
                <Image src={tCircleImg} alt="thumb one finger close" width={64} height={64} className="w-16 h-16 object-contain" />
                <span className="text-lg font-semibold text-zinc-800">- thumb one finger close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

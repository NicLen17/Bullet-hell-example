import type { PlaneColors } from "@/lib/customization";
import { PaperPlaneSvg } from "@/components/paper-plane-svg";

type PlanePreviewProps = {
  colors: PlaneColors;
  size?: number;
};

export function PlanePreview({ colors, size = 72 }: PlanePreviewProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-white/15 bg-black/40 p-4"
      style={{ minHeight: size + 32 }}
    >
      <div
        style={{ width: size, height: size }}
        className="drop-shadow-[0_0_14px_rgba(220,38,38,0.5)]"
      >
        <PaperPlaneSvg colors={colors} className="h-full w-full" />
      </div>
    </div>
  );
}

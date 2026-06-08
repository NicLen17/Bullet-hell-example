import type { PlaneColors } from "@/lib/customization";

type PaperPlaneSvgProps = {
  className?: string;
  colors?: PlaneColors;
};

export function PaperPlaneSvg({ className, colors }: PaperPlaneSvgProps) {
  const body = colors?.body ?? "#dc2626";
  const accent = colors?.accent ?? "#22c55e";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M32 6 L52 22 L42 28 L56 48 L32 40 L8 48 L22 28 L12 22 Z"
        fill={body}
        stroke={accent}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M32 6 L32 40"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M24 26 L32 30 L40 26"
        fill="white"
        fillOpacity="0.18"
      />
    </svg>
  );
}

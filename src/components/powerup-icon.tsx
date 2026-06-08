import type { PowerupKind } from "@/lib/power-ups";
import { getPowerupDef } from "@/lib/power-ups";

type PowerupIconProps = {
  kind: PowerupKind;
  size?: number;
  className?: string;
};

export function PowerupIcon({ kind, size = 28, className = "" }: PowerupIconProps) {
  const def = getPowerupDef(kind);
  const s = size;

  return (
    <svg
      viewBox="0 0 32 32"
      width={s}
      height={s}
      className={className}
      aria-hidden
      style={{ filter: `drop-shadow(0 0 6px ${def.glow})` }}
    >
      {kind === "shield" && (
        <>
          <path
            d="M16 3L6 10v9c0 8 5 14 10 17 5-3 10-9 10-17v-9L16 3z"
            fill="none"
            stroke={def.color}
            strokeWidth="2.5"
          />
          <path d="M16 11v12M12 17h8" stroke={def.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "invuln" && (
        <>
          <polygon
            points="16,4 19,12 28,12 21,17 24,26 16,21 8,26 11,17 4,12 13,12"
            fill={def.color}
            opacity="0.9"
          />
          <circle cx="16" cy="16" r="4" fill="#0a0a0a" />
        </>
      )}
      {kind === "frenzy" && (
        <>
          <circle cx="16" cy="16" r="12" fill="none" stroke={def.color} strokeWidth="2.5" />
          <path d="M16 8v8l6 4" stroke={def.color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 16h3M21 16h3" stroke={def.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "bomb" && (
        <>
          <circle cx="14" cy="18" r="8" fill={def.color} />
          <path d="M18 10l4-4M20 8l2-2" stroke={def.color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="8" r="2" fill="#fef08a" />
          <path d="M10 22c4 3 8 3 12 0" stroke="#fef08a" strokeWidth="2" fill="none" />
        </>
      )}
      {kind === "multishot" && (
        <>
          <path d="M6 16h20M22 16l-4-5M22 16l-4 5" stroke={def.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 16l-3-4M10 16l-3 4" stroke={def.color} strokeWidth="2" strokeLinecap="round" />
          <path d="M14 16l-2-3M14 16l-2 3" stroke={def.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "rof" && (
        <>
          <circle cx="16" cy="16" r="11" fill="none" stroke={def.color} strokeWidth="2" />
          <path
            d="M16 8v8M16 16l5 3"
            stroke={def.color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M8 22h6M18 22h6" stroke={def.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "grow" && (
        <>
          <rect x="10" y="14" width="12" height="12" rx="2" fill={def.color} opacity="0.85" />
          <path d="M16 6v16M10 10l6-6 6 6" stroke={def.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "shrink" && (
        <>
          <rect x="13" y="17" width="6" height="6" rx="1" fill={def.color} />
          <path d="M16 26v-8M10 20l6 6 6-6" stroke={def.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

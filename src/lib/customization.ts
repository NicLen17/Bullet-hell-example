export type BackgroundId = "grid" | "city" | "space";

export type PlaneColors = {
  body: string;
  accent: string;
};

export type GameCustomization = {
  backgroundId: BackgroundId;
  planeColors: PlaneColors;
};

export const CUSTOMIZATION_KEY = "avion-papel-customization";

export const DEFAULT_PLANE_COLORS: PlaneColors = {
  body: "#dc2626",
  accent: "#22c55e",
};

export const DEFAULT_CUSTOMIZATION: GameCustomization = {
  backgroundId: "grid",
  planeColors: DEFAULT_PLANE_COLORS,
};

export const BACKGROUND_OPTIONS: {
  id: BackgroundId;
  label: string;
  description: string;
}[] = [
  { id: "grid", label: "Clásico", description: "Cuadrícula roja" },
  { id: "city", label: "Ciudad", description: "Noche urbana" },
  { id: "space", label: "Espacio", description: "Nebulosa" },
];

export function loadCustomization(): GameCustomization {
  if (typeof window === "undefined") return DEFAULT_CUSTOMIZATION;
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_KEY);
    if (!raw) return DEFAULT_CUSTOMIZATION;
    const parsed = JSON.parse(raw) as Partial<GameCustomization>;
    return {
      backgroundId: parsed.backgroundId ?? "grid",
      planeColors: {
        body: parsed.planeColors?.body ?? DEFAULT_PLANE_COLORS.body,
        accent: parsed.planeColors?.accent ?? DEFAULT_PLANE_COLORS.accent,
      },
    };
  } catch {
    return DEFAULT_CUSTOMIZATION;
  }
}

export function saveCustomization(custom: GameCustomization): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(custom));
  } catch {
    /* noop */
  }
}

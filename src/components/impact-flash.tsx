type ImpactFlashProps = {
  active: boolean;
};

export function ImpactFlash({ active }: ImpactFlashProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-40 transition-opacity duration-75 ${
        active ? "animate-impact-flash opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(circle at center, rgba(220,38,38,0.55) 0%, rgba(127,29,29,0.85) 45%, rgba(0,0,0,0.7) 100%)",
        mixBlendMode: "screen",
      }}
      aria-hidden
    />
  );
}

import type { BackgroundId } from "@/lib/customization";

type GameBackgroundProps = {
  backgroundId: BackgroundId;
};

export function GameBackground({ backgroundId }: GameBackgroundProps) {
  if (backgroundId === "city") {
    return (
      <>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0f172a 0%, #1e1b4b 35%, #0a0a0a 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[38%] items-end justify-center gap-1 px-2 opacity-80">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              className="w-[4%] min-w-[8px] rounded-t-sm bg-gradient-to-t from-primary/40 to-slate-600/60"
              style={{ height: `${28 + ((i * 17) % 55)}%` }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-25">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-yellow-200"
              style={{
                left: `${(i * 23) % 100}%`,
                top: `${(i * 31) % 55}%`,
                opacity: 0.3 + (i % 5) * 0.12,
              }}
            />
          ))}
        </div>
      </>
    );
  }

  if (backgroundId === "space") {
    return (
      <>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #312e81 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, #7c2d12 0%, transparent 45%), linear-gradient(180deg, #020617 0%, #0a0a0a 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-60">
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: i % 7 === 0 ? 2 : 1,
                height: i % 7 === 0 ? 2 : 1,
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 19.3) % 100}%`,
                opacity: 0.2 + (i % 4) * 0.15,
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5" />
    </>
  );
}

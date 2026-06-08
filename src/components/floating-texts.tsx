import type { FloatingText } from "@/lib/game-types";

type FloatingTextsProps = {
  items: FloatingText[];
};

const KIND_CLASS: Record<FloatingText["kind"], string> = {
  gain: "text-accent text-shadow-glow-accent animate-float-up",
  loss: "text-primary text-3xl font-black text-shadow-glow-primary animate-float-up-loss",
  shield: "text-accent text-xl font-bold animate-float-up",
  multiplier: "text-yellow-300 text-lg font-bold animate-float-up",
  powerup: "text-xl font-black animate-float-up",
};

export function FloatingTexts({ items }: FloatingTextsProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${KIND_CLASS[item.kind]}`}
          style={{
            left: item.x,
            top: item.y,
            color: item.color,
            textShadow: item.color ? `0 0 12px ${item.color}` : undefined,
          }}
        >
          {item.text}
        </div>
      ))}
    </>
  );
}

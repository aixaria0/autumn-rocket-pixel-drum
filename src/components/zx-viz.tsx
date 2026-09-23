import type { ZxDiagram } from "@/lib/qec/zx";

export function ZxViz({ diagram }: { diagram: ZxDiagram }) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted">{diagram.caption}</p>
      <svg viewBox="0 0 320 170" className="h-40 w-full rounded-lg bg-bg">
        {diagram.wires.map((w, i) => {
          const a = diagram.spiders.find((s) => s.id === w.a);
          const b = diagram.spiders.find((s) => s.id === w.b);
          if (!a || !b) return null;
          const bump = i % 2 === 0 ? 0 : 10;
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} C ${a.x + 40} ${a.y + bump}, ${b.x - 40} ${b.y + bump}, ${b.x} ${b.y}`}
              fill="none"
              className="stroke-muted"
              strokeWidth={1.4}
            />
          );
        })}
        {diagram.spiders.map((s) => (
          <g key={s.id}>
            <circle
              cx={s.x}
              cy={s.y}
              r={14}
              className={s.color === "Z" ? "fill-ok" : "fill-bad"}
              opacity={0.85}
            />
            <text
              x={s.x}
              y={s.y + 4}
              textAnchor="middle"
              className="fill-accent-fg font-mono"
              fontSize={9}
            >
              {s.phase}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

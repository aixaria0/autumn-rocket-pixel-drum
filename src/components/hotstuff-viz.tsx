import type { HotStuffRound } from "@/lib/bft/hotstuff";
import { cn } from "@/lib/utils";

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

export function HotStuffViz({ round }: { round: HotStuffRound }) {
  const r = 92;
  const cx = 120;
  const cy = 120;
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <svg viewBox="0 0 240 240" className="h-52 w-52 justify-self-center">
        {round.packets.slice(0, 28).map((p, i) => {
          const a1 = (2 * Math.PI * p.from) / round.n - Math.PI / 2;
          const a2 = (2 * Math.PI * p.to) / round.n - Math.PI / 2;
          return (
            <line
              key={i}
              x1={r2(cx + r * Math.cos(a1))}
              y1={r2(cy + r * Math.sin(a1))}
              x2={r2(cx + r * Math.cos(a2))}
              y2={r2(cy + r * Math.sin(a2))}
              className="stroke-border"
              strokeWidth={0.8}
              opacity={0.45}
            />
          );
        })}
        {round.nodes.map((n) => {
          const a = (2 * Math.PI * n.id) / round.n - Math.PI / 2;
          const x = r2(cx + r * Math.cos(a));
          const y = r2(cy + r * Math.sin(a));
          return (
            <g key={n.id}>
              <circle
                cx={x}
                cy={y}
                r={n.id === round.leader ? 14 : 11}
                className={cn(
                  !n.honest ? "fill-bad" : n.locked ? "fill-ok" : "fill-elevated",
                )}
                stroke="currentColor"
                strokeWidth={n.id === round.leader ? 1.6 : 1}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="fill-fg font-mono"
                fontSize={10}
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="space-y-2 text-sm">
        {round.phases.map((p) => (
          <li key={p.name} className="flex items-center justify-between border-b border-border py-1.5">
            <span className="font-mono text-xs uppercase tracking-wide text-muted">{p.name}</span>
            <span className={cn("font-mono tabular-nums", p.ok ? "text-ok" : "text-warn")}>
              {p.votes}/{round.quorum}
            </span>
          </li>
        ))}
        <li className="pt-2 text-xs text-subtle">
          n={round.n} f={round.f} leader={round.leader} byzantine={round.byzantine} view={round.view}
        </li>
      </ol>
    </div>
  );
}

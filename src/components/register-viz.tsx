import { cn } from "@/lib/utils";

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

export function RegisterViz({
  n = 12,
  entangled = true,
  label,
}: {
  n?: number;
  entangled?: boolean;
  label?: string;
}) {
  const r = 86;
  const cx = 110;
  const cy = 110;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: r2(cx + r * Math.cos(a)), y: r2(cy + r * Math.sin(a)) };
  });
  return (
    <div>
      {label && <p className="mb-2 text-xs text-muted">{label}</p>}
      <svg viewBox="0 0 220 220" className="mx-auto h-48 w-48">
        {entangled &&
          pts.map((p, i) => {
            const q = pts[(i + n / 2) % n];
            return (
              <line
                key={`c${i}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                className="stroke-ok/25"
                strokeWidth={0.8}
              />
            );
          })}
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={9}
              className={cn(entangled ? "fill-ok/80" : "fill-elevated")}
              stroke="currentColor"
              strokeWidth={1}
            />
            <text x={p.x} y={p.y + 3} textAnchor="middle" className="fill-accent-fg font-mono" fontSize={8}>
              {i}
            </text>
          </g>
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-muted font-mono" fontSize={10}>
          {entangled ? "GHZ" : "prod"}
        </text>
      </svg>
    </div>
  );
}

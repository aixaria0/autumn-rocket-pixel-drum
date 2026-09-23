import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { seeded } from "@/lib/quantum/math";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/markets")({ component: Markets });

function qaoaEnergy(gamma: number, beta: number) {
  // 4-node ring MaxCut, p=1 analytic-ish toy
  const e = 2 - 0.5 * Math.sin(4 * gamma) * Math.sin(2 * beta) * 4;
  return e;
}

function Markets() {
  const [gamma, setGamma] = useState(0.4);
  const [beta, setBeta] = useState(0.3);
  const [vol, setVol] = useState(0.2);
  const energy = qaoaEnergy(gamma, beta);

  const paths = useMemo(() => {
    const rng = seeded(Math.round(gamma * 1000 + beta * 100));
    return Array.from({ length: 24 }, (_, t) => {
      let s = 100;
      for (let i = 0; i <= t; i++) s *= 1 + (rng() - 0.48) * vol;
      return { t, s: Number(s.toFixed(2)) };
    });
  }, [gamma, beta, vol]);

  const var95 = useMemo(() => {
    const rng = seeded(3);
    const losses: number[] = [];
    for (let i = 0; i < 400; i++) {
      let s = 1;
      for (let d = 0; d < 12; d++) s *= 1 + (rng() - 0.49) * vol;
      losses.push(1 - s);
    }
    losses.sort((a, b) => a - b);
    return losses[Math.floor(0.95 * losses.length)];
  }, [vol]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Markets</h1>
        <p className="mt-1 text-sm text-muted">
          Toy QAOA MaxCut weights plus a Monte Carlo option fan. Educational, not a trading system.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">QAOA energy</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{energy.toFixed(3)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">VaR 95% (12 steps)</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{(var95 * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">Vol</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{vol.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>QAOA angles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-xs text-muted">
            γ <span className="font-mono">{gamma.toFixed(2)}</span>
            <Slider className="mt-3" min={0} max={1.6} step={0.02} value={[gamma]} onValueChange={(v) => setGamma(v[0])} />
          </label>
          <label className="block text-xs text-muted">
            β <span className="font-mono">{beta.toFixed(2)}</span>
            <Slider className="mt-3" min={0} max={1.6} step={0.02} value={[beta]} onValueChange={(v) => setBeta(v[0])} />
          </label>
          <label className="block text-xs text-muted">
            σ <span className="font-mono">{vol.toFixed(2)}</span>
            <Slider className="mt-3" min={0.05} max={0.5} step={0.01} value={[vol]} onValueChange={(v) => setVol(v[0])} />
          </label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monte Carlo fan</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paths}>
              <XAxis dataKey="t" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  fontSize: 12,
                  color: "var(--color-fg)",
                }}
              />
              <Line type="monotone" dataKey="s" stroke="var(--color-accent)" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

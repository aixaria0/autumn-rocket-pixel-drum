import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ZxViz } from "@/components/zx-viz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUDIT_ZX_LEAN } from "@/lib/formal/zxLean";
import { BICYCLE_HX, STEANE_HX, decodeBPOSD, randomError } from "@/lib/qec/bposd";
import { distill15to1, distillCurve } from "@/lib/qec/magic";
import { bicycleLayout } from "@/lib/qec/qldpc";
import { decodeSurface, encodeLogicalZero } from "@/lib/qec/surface";
import { ZX_RULES, bellDiagrams } from "@/lib/qec/zx";
import { seeded } from "@/lib/quantum/math";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/formal")({ component: Formal });

function Formal() {
  const diagrams = bellDiagrams();
  const [step, setStep] = useState(0);
  const [p, setP] = useState(0.12);
  const [code, setCode] = useState<"steane" | "bicycle">("steane");
  const [result, setResult] = useState<ReturnType<typeof decodeBPOSD> | null>(null);
  const [dp, setDp] = useState(0.05);
  const [surf, setSurf] = useState<ReturnType<typeof decodeSurface> | null>(null);
  const layout = bicycleLayout();
  const curve = useMemo(() => distillCurve(), []);
  const dres = distill15to1(dp);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Formal layer</h1>
        <p className="mt-1 text-sm text-muted">
          Qudit ZX axioms, Lean fragment, BP-OSD, bicycle Tanner graph, surface patch, 15-to-1 distillation.
        </p>
      </div>

      <Tabs defaultValue="zx">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="zx">ZX</TabsTrigger>
          <TabsTrigger value="lean">Lean</TabsTrigger>
          <TabsTrigger value="decode">BP-OSD</TabsTrigger>
          <TabsTrigger value="surface">Surface</TabsTrigger>
          <TabsTrigger value="magic">Distill</TabsTrigger>
        </TabsList>

        <TabsContent value="zx" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Qudit ZX rewrite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ZxViz diagram={diagrams[step]} />
              <Button size="sm" variant="secondary" onClick={() => setStep((s) => 1 - s)}>
                {step === 0 ? "Apply fusion" : "Reset circuit"}
              </Button>
              <div className="grid gap-3">
                {ZX_RULES.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-bg p-3">
                    <p className="text-xs font-medium text-fg">{r.name}</p>
                    <pre className="mt-2 overflow-auto font-mono text-[11px] leading-5 text-muted">{r.lean}</pre>
                    <p className="mt-2 text-xs text-subtle">{r.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lean" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>QuditZX.lean</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[28rem] overflow-auto rounded-lg border border-border bg-bg p-4 font-mono text-[11px] leading-5 text-muted">
                {QUDIT_ZX_LEAN}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decode" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>BP-OSD decoder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={code === "steane" ? "default" : "secondary"} onClick={() => setCode("steane")}>
                  Steane [[7,1,3]]
                </Button>
                <Button size="sm" variant={code === "bicycle" ? "default" : "secondary"} onClick={() => setCode("bicycle")}>
                  Bicycle 6
                </Button>
              </div>
              <label className="block text-xs text-muted">
                Physical p <span className="font-mono">{p.toFixed(2)}</span>
                <Slider className="mt-3" min={0.02} max={0.25} step={0.01} value={[p]} onValueChange={(v) => setP(v[0])} />
              </label>
              <Button
                onClick={() => {
                  const H = code === "steane" ? STEANE_HX : BICYCLE_HX;
                  const err = randomError(H[0].length, p, seeded(Date.now() % 99991));
                  setResult(decodeBPOSD(H, err, code));
                }}
              >
                Inject error and decode
              </Button>
              {result && (
                <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <dt className="text-muted">Syndrome</dt>
                  <dd>{result.syndrome.join("")}</dd>
                  <dt className="text-muted">Estimate</dt>
                  <dd>{result.errorEst.join("")}</dd>
                  <dt className="text-muted">Iterations</dt>
                  <dd>{result.iterations}</dd>
                  <dt className="text-muted">OSD</dt>
                  <dd>{result.osd}</dd>
                  <dt className="text-muted">Matched</dt>
                  <dd className={result.success ? "text-ok" : "text-bad"}>{result.success ? "yes" : "no"}</dd>
                </dl>
              )}
              <svg viewBox="0 0 240 180" className="h-48 w-full">
                {layout.checks.map((ch, i) => (
                  <polygon
                    key={i}
                    points={ch.map((idx) => `${layout.nodes[idx].x},${layout.nodes[idx].y}`).join(" ")}
                    className="fill-ok/10 stroke-ok/40"
                  />
                ))}
                {layout.nodes.map((n) => (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r={10} className="fill-elevated stroke-accent" />
                    <text x={n.x} y={n.y + 3} textAnchor="middle" className="fill-fg font-mono" fontSize={9}>
                      {n.id}
                    </text>
                  </g>
                ))}
              </svg>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surface" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Surface-code memory (d=3 educational)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  const mem = encodeLogicalZero();
                  setSurf(decodeSurface(mem, "X", 0));
                }}
              >
                Inject X on qubit 0
              </Button>
              {surf && (
                <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <dt className="text-muted">Synd X</dt>
                  <dd>{surf.syndX.join("")}</dd>
                  <dt className="text-muted">Synd Z</dt>
                  <dd>{surf.syndZ.join("")}</dd>
                  <dt className="text-muted">After X</dt>
                  <dd>{surf.syndX2.join("")}</dd>
                  <dt className="text-muted">After Z</dt>
                  <dd>{surf.syndZ2.join("")}</dd>
                  <dt className="text-muted">Corrected</dt>
                  <dd className={surf.corrected ? "text-ok" : "text-warn"}>{surf.corrected ? "yes" : "partial"}</dd>
                </dl>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="magic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>15-to-1 magic-state distillation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-xs text-muted">
                Input p <span className="font-mono">{dp.toFixed(3)}</span>
                <Slider className="mt-3" min={0.005} max={0.12} step={0.005} value={[dp]} onValueChange={(v) => setDp(v[0])} />
              </label>
              <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                <div>
                  <p className="text-xs text-muted">p out</p>
                  <p>{dres.outputP.toExponential(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">yield</p>
                  <p>{dres.yieldProb.toFixed(3)}</p>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curve}>
                    <XAxis dataKey="p" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    />
                    <Line type="monotone" dataKey="out" stroke="var(--color-accent)" dot={false} strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-subtle">{dres.protocol}. Leading term 35 p³.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

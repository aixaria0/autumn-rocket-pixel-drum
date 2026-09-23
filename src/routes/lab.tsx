import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ghzFidelityExact } from "@/lib/quantum/ghz";
import { applyDepolarizing, collectShadows, fidelityToPure } from "@/lib/quantum/shadows";
import { seeded } from "@/lib/quantum/math";
import { bell, ghz, productZero, Statevector } from "@/lib/quantum/state";

export const Route = createFileRoute("/lab")({ component: Lab });

function build(preset: string, groverIter: number) {
  if (preset === "bell") return bell();
  if (preset === "ghz") return ghz(3);
  if (preset === "ghz12") return ghz(12);
  if (preset === "grover") {
    const st = new Statevector(2);
    st.h(0); st.h(1);
    for (let i = 0; i < groverIter; i++) {
      st.z(0); st.z(1); st.cx(0, 1); st.z(1); st.cx(0, 1);
      st.h(0); st.h(1);
      st.x(0); st.x(1);
      st.cx(0, 1);
      st.z(1);
      st.cx(0, 1);
      st.x(0); st.x(1);
      st.h(0); st.h(1);
    }
    return st;
  }
  return productZero(2);
}

function Lab() {
  const [preset, setPreset] = useState("bell");
  const [iter, setIter] = useState(1);
  const [noise, setNoise] = useState(0);
  const [fid, setFid] = useState<number | null>(null);

  const state = useMemo(() => {
    const ideal = build(preset, iter);
    return applyDepolarizing(ideal, noise, seeded(9));
  }, [preset, iter, noise]);

  const probs = preset === "ghz12" ? [] : state.probs();
  const qasm =
    preset === "bell"
      ? "OPENQASM 2.0;\nqreg q[2];\nh q[0];\ncx q[0],q[1];"
      : preset === "ghz"
        ? "OPENQASM 2.0;\nqreg q[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];"
        : preset === "ghz12"
          ? "OPENQASM 2.0;\nqreg q[12];\nh q[0];\n// CX 0→1..11"
          : "OPENQASM 2.0;\nqreg q[2];\nh q[0];\nh q[1];";

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Lab</h1>
        <p className="mt-1 text-sm text-muted">
          Local statevector composer. No cloud backend. GHZ-12 uses exact |⟨GHZ|ψ⟩|², not 4ⁿ tomography.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["bell", "ghz", "ghz12", "grover", "product"].map((p) => (
          <Button key={p} size="sm" variant={preset === p ? "default" : "secondary"} onClick={() => { setPreset(p); setFid(null); }}>
            {p.toUpperCase()}
          </Button>
        ))}
      </div>
      {preset === "grover" && (
        <label className="max-w-sm text-xs text-muted">
          Grover iterations <span className="font-mono">{iter}</span>
          <Slider className="mt-3" min={0} max={4} step={1} value={[iter]} onValueChange={(v) => setIter(v[0])} />
        </label>
      )}
      <label className="max-w-sm text-xs text-muted">
        Depolarizing <span className="font-mono">{noise.toFixed(2)}</span>
        <Slider className="mt-3" min={0} max={0.25} step={0.01} value={[noise]} onValueChange={(v) => setNoise(v[0])} />
      </label>
      {preset !== "ghz12" && (
        <Card>
          <CardHeader>
            <CardTitle>Probability mass</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {probs.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-16 text-subtle">{i.toString(2).padStart(state.n, "0")}</span>
                <div className="h-2 flex-1 rounded-full bg-elevated">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${p * 100}%` }} />
                </div>
                <span className="w-14 tabular-nums text-muted">{(p * 100).toFixed(1)}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>QASM</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto font-mono text-xs text-muted">{qasm}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{preset === "ghz12" ? "Exact GHZ fidelity" : "Shadow fidelity"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              onClick={() => {
                const ideal = build(preset, iter);
                if (preset === "ghz12") {
                  setFid(ghzFidelityExact(state));
                } else {
                  const snaps = collectShadows(state, 160, 11);
                  setFid(fidelityToPure(snaps, ideal).fid);
                }
              }}
            >
              Estimate
            </Button>
            <p className="font-mono text-2xl tabular-nums">
              {fid === null ? "—" : `${(fid * 100).toFixed(1)}%`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

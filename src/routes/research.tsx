import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SURFACE_D3, QUDIT_COMMUTATOR } from "@/lib/qec/surface";
import { QLDPC_FAMILIES } from "@/lib/qec/qldpc";

export const Route = createFileRoute("/research")({ component: Research });

function Research() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Research</h1>
        <p className="mt-1 text-sm text-muted">
          Error budget, hardware ranking, QEC families, and qudit surface-code generators.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { k: "CX error", v: "0.0019" },
          { k: "Readout", v: "0.011" },
          { k: "T1 / T2", v: "78 / 61 µs" },
        ].map((m) => (
          <Card key={m.k}>
            <CardContent className="p-5">
              <p className="text-xs text-muted">{m.k}</p>
              <p className="mt-1 font-mono text-xl tabular-nums">{m.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Hardware ranking for a first hybrid prototype</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="py-2">Platform</th>
                <th>Fit</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border">
                <td className="py-2 text-fg">Superconducting</td>
                <td>Speed / visualization</td>
                <td>Fast gates, mature hybrid loops</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 text-fg">Trapped ion</td>
                <td>Highest-assurance certs</td>
                <td>All-to-all, seconds-scale coherence</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 text-fg">Photonic</td>
                <td>Networked later</td>
                <td>Entanglement distribution</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Qudit surface-code stabilizers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p className="font-mono text-xs text-fg">A_v = ∏ X_e on δ(v) · B_p = ∏ Z_e on ∂p</p>
          <p>{QUDIT_COMMUTATOR}</p>
          <p>
            Distance-{SURFACE_D3.distance} educational patch: {SURFACE_D3.n} data qubits,{" "}
            {SURFACE_D3.stars.length} stars, {SURFACE_D3.plaquettes.length} plaquettes.
          </p>
          <ul className="grid gap-1 font-mono text-xs">
            {SURFACE_D3.stars.map((s) => (
              <li key={s.label}>
                {s.label} X{s.sites.join("")}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>qLDPC constructions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="py-2">Family</th>
                <th>Rate</th>
                <th>Distance</th>
                <th>Locality</th>
              </tr>
            </thead>
            <tbody>
              {QLDPC_FAMILIES.map((f) => (
                <tr key={f.name} className="border-t border-border">
                  <td className="py-2 text-fg">{f.name}</td>
                  <td className="font-mono text-muted">{f.rate}</td>
                  <td className="font-mono text-muted">{f.distance}</td>
                  <td className="text-muted">{f.locality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

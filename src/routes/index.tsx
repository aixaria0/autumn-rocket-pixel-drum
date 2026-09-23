import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CertCard } from "@/components/cert-card";
import { EventLog } from "@/components/event-log";
import { HotStuffViz } from "@/components/hotstuff-viz";
import { RegisterViz } from "@/components/register-viz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type HybridKind, runHybridRound } from "@/lib/hybrid";
import { copy } from "@/lib/i18n";
import { useChimera } from "@/lib/store";

export const Route = createFileRoute("/")({ component: CommandDesk });

function CommandDesk() {
  const t = copy[useChimera((s) => s.locale)];
  const lastCert = useChimera((s) => s.lastCert);
  const lastRound = useChimera((s) => s.lastRound);
  const lastCorr = useChimera((s) => s.lastCorr);
  const recordRound = useChimera((s) => s.recordRound);
  const pushLog = useChimera((s) => s.pushLog);
  const [kind, setKind] = useState<HybridKind>("bell");
  const [shots, setShots] = useState(180);
  const [noise, setNoise] = useState(0.04);
  const [busy, setBusy] = useState(false);

  async function launch(forceReject = false) {
    setBusy(true);
    try {
      const k = forceReject ? "product" : kind;
      const res = await runHybridRound({
        kind: k,
        qubits: k === "ghz12" ? 12 : k === "ghz" ? 4 : 2,
        shots: k === "ghz12" ? 80 : shots,
        noise: forceReject ? 0.28 : noise,
        seed: Date.now() % 1e6,
      });
      recordRound(res.cert, res.round, res.counts, res.correlators);
      pushLog(
        `${res.cert.accepted ? "ACCEPT" : "REJECT"} F=${res.cert.fidelity.toFixed(3)} n=${res.cert.qubits} view=${res.round.view}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Command</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Classical shadows (or GHZ stabilizers on 12 qubits) estimate the post-condition. A 7-node HotStuff
          mesh commits only if F ≥ 0.65 and a 2f+1 quorum holds.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hybrid round</CardTitle>
            <CardDescription>Shadow tomography bound to BFT commit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs value={kind} onValueChange={(v) => setKind(v as HybridKind)}>
              <TabsList className="flex h-auto flex-wrap">
                <TabsTrigger value="bell">Bell</TabsTrigger>
                <TabsTrigger value="ghz">GHZ-4</TabsTrigger>
                <TabsTrigger value="ghz12">GHZ-12</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
              </TabsList>
            </Tabs>
            <label className="block text-xs text-muted">
              {t.shots}{" "}
              <span className="float-end font-mono tabular-nums">{kind === "ghz12" ? 80 : shots}</span>
              <Slider
                className="mt-3"
                min={40}
                max={400}
                step={10}
                value={[shots]}
                onValueChange={(v) => setShots(v[0])}
                disabled={kind === "ghz12"}
              />
            </label>
            <label className="block text-xs text-muted">
              {t.noise} <span className="float-end font-mono tabular-nums">{noise.toFixed(2)}</span>
              <Slider
                className="mt-3"
                min={0}
                max={0.3}
                step={0.01}
                value={[noise]}
                onValueChange={(v) => setNoise(v[0])}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => launch(false)} disabled={busy}>
                {busy ? "Running…" : t.launch}
              </Button>
              <Button variant="secondary" onClick={() => launch(true)} disabled={busy}>
                Guillotine
              </Button>
            </div>
          </CardContent>
        </Card>

        {lastCert ? <CertCard cert={lastCert} /> : (
          <Card>
            <CardContent className="flex h-full min-h-48 items-center text-sm text-muted">
              No certificate yet. Launch a round.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>12-qubit register</CardTitle>
            <CardDescription>GHZ when the last cert used 12 qubits</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterViz
              n={lastCert?.qubits === 12 ? 12 : lastCert?.qubits === 4 ? 4 : 12}
              entangled={!lastCert || lastCert.accepted}
            />
          </CardContent>
        </Card>
        {lastRound && (
          <Card>
            <CardHeader>
              <CardTitle>HotStuff mesh</CardTitle>
              <CardDescription>Prepare / pre-commit / commit — Byzantine node shaded</CardDescription>
            </CardHeader>
            <CardContent>
              <HotStuffViz round={lastRound} />
              {lastCorr && (
                <p className="mt-4 font-mono text-xs text-muted">
                  XX {lastCorr.xx.toFixed(2)} · YY {lastCorr.yy.toFixed(2)} · ZZ {lastCorr.zz.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <EventLog />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EventLog } from "@/components/event-log";
import { HotStuffViz } from "@/components/hotstuff-viz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { runHotStuff } from "@/lib/bft/hotstuff";
import { runHybridRound } from "@/lib/hybrid";
import { useChimera } from "@/lib/store";

export const Route = createFileRoute("/lattice")({ component: Lattice });

function Lattice() {
  const recordRound = useChimera((s) => s.recordRound);
  const lastRound = useChimera((s) => s.lastRound);
  const pushLog = useChimera((s) => s.pushLog);
  const [byz, setByz] = useState(true);
  const [view, setView] = useState(0);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Lattice</h1>
        <p className="mt-1 text-sm text-muted">
          Seven-node HotStuff. One replica may be Byzantine. Honest-path reachability only — not intrusion.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <Switch checked={byz} onCheckedChange={setByz} />
          Byzantine replica
        </label>
        <Button
          variant="secondary"
          onClick={() => {
            const r = runHotStuff({
              accept: false,
              value: "timeout",
              view,
              byzantine: byz ? 1 : 99,
            });
            setView(r.view);
            recordRound(
              {
                version: 1,
                programHash: "view-change",
                precondition: "timeout",
                postcondition: "new view",
                proofType: "statistical",
                fidelity: 0,
                fidelityError: 0,
                witness: null,
                shots: 0,
                noise: 0,
                bft: { decided: false, view: r.view, quorum: r.quorum, leader: r.leader },
                accepted: false,
                timestamp: Date.now(),
                qubits: 0,
                binding: "view-change",
              },
              r,
            );
            pushLog(`view-change → view ${r.view}`);
          }}
        >
          View-change
        </Button>
        <Button
          onClick={async () => {
            const res = await runHybridRound({ kind: "bell", qubits: 2, shots: 160, noise: 0.03 });
            recordRound(res.cert, res.round, res.counts, res.correlators);
            setView(res.round.view);
            pushLog("hybrid round on lattice");
          }}
        >
          Hybrid round
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Packet mesh</CardTitle>
        </CardHeader>
        <CardContent>
          {lastRound ? <HotStuffViz round={lastRound} /> : <p className="text-sm text-muted">Idle.</p>}
        </CardContent>
      </Card>
      <EventLog />
    </div>
  );
}

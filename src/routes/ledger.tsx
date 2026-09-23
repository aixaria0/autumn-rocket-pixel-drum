import { createFileRoute } from "@tanstack/react-router";
import { CertCard } from "@/components/cert-card";
import { useChimera } from "@/lib/store";

export const Route = createFileRoute("/ledger")({ component: Ledger });

function Ledger() {
  const ledger = useChimera((s) => s.ledger);
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Ledger</h1>
        <p className="mt-1 text-sm text-muted">
          Bound QuantumHoareCert objects stored on this device. Classical quorum plus quantum witness.
        </p>
      </div>
      {ledger.length === 0 ? (
        <p className="text-sm text-muted">Empty. Launch a hybrid round from Command.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ledger.map((c) => (
            <CertCard key={c.binding + c.timestamp} cert={c} />
          ))}
        </div>
      )}
    </div>
  );
}

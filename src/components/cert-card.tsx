import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuantumHoareCert } from "@/lib/cert/hoare";
import { copy } from "@/lib/i18n";
import { useChimera } from "@/lib/store";

export function CertCard({ cert }: { cert: QuantumHoareCert }) {
  const locale = useChimera((s) => s.locale);
  const t = copy[locale];
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>QuantumHoareCert</CardTitle>
          <p className="font-mono text-[11px] text-subtle">#{cert.programHash}</p>
        </div>
        <Badge tone={cert.accepted ? "ok" : "bad"}>
          {cert.accepted ? t.accept : t.reject}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt className="text-muted">{t.fidelity}</dt>
          <dd className="font-mono tabular-nums">
            {(cert.fidelity * 100).toFixed(1)}% ± {(cert.fidelityError * 100).toFixed(1)}
          </dd>
          <dt className="text-muted">{t.witness}</dt>
          <dd className="font-mono tabular-nums">
            {cert.witness === null ? "—" : cert.witness.toFixed(3)}
          </dd>
          <dt className="text-muted">{t.quorum}</dt>
          <dd className="font-mono">
            {cert.bft.decided ? "commit" : "view-change"} / v{cert.bft.view}
          </dd>
          <dt className="text-muted">Binding</dt>
          <dd className="truncate font-mono text-xs">{cert.binding}</dd>
        </dl>
        <p className="text-xs text-muted">{cert.postcondition}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(cert, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? t.copied : t.copyCert}
        </Button>
      </CardContent>
    </Card>
  );
}

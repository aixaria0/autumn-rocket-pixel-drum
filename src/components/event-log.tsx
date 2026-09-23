import { useEffect, useState } from "react";
import { useChimera } from "@/lib/store";

export function EventLog() {
  const log = useChimera((s) => s.log);
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  if (!log.length) return null;
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-[11px] uppercase tracking-wide text-subtle">Event tape</p>
      <ul className="max-h-40 space-y-1 overflow-auto font-mono text-xs text-muted">
        {log.slice(-12).map((e, i) => (
          <li key={i}>
            {live ? new Date(e.t).toLocaleTimeString() : "--:--:--"} — {e.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

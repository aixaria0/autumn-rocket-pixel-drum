import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { runConsole } from "@/lib/console/commands";
import { useChimera } from "@/lib/store";

export const Route = createFileRoute("/console")({ component: ConsoleDesk });

function ConsoleDesk() {
  const lines = useChimera((s) => s.consoleLines);
  const pushConsole = useChimera((s) => s.pushConsole);
  const clearConsole = useChimera((s) => s.clearConsole);
  const recordRound = useChimera((s) => s.recordRound);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  useEffect(() => {
    if (!booted.current && lines.length === 0) {
      booted.current = true;
      pushConsole("CHIMERA console. type help.");
    }
  }, [lines.length, pushConsole]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  async function exec(raw?: string) {
    const msg = (raw ?? text).trim();
    if (!msg || busy) return;
    setText("");
    pushConsole(`› ${msg}`);
    setBusy(true);
    try {
      const out = await runConsole(msg);
      if (out.hybrid) {
        recordRound(out.hybrid.cert, out.hybrid.round, out.hybrid.counts, out.hybrid.correlators);
      }
      out.lines.forEach((l) => pushConsole(l));
    } catch (e) {
      pushConsole(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Console</h1>
          <p className="mt-1 text-sm text-muted">
            Shell over the same lattice — GHZ-12, BP-OSD, ZX axioms, distillation.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearConsole}>
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["help", "ghz 12", "decode steane", "surface", "distill 0.05", "zx"].map((p) => (
          <Button key={p} size="sm" variant="secondary" onClick={() => void exec(p)}>
            {p}
          </Button>
        ))}
      </div>
      <div className="min-h-[50dvh] overflow-auto rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-6 text-muted">
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith("›") ? "text-fg" : ""}>
            {l}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void exec();
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ghz 12"
          className="font-mono"
          autoComplete="off"
        />
        <Button type="submit" disabled={busy}>
          {busy ? "…" : "Run"}
        </Button>
      </form>
    </div>
  );
}

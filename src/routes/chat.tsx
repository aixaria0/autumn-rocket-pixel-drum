import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RegisterViz } from "@/components/register-viz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { talkToRegister } from "@/lib/chat/qubit";
import { localRegisterReply } from "@/lib/chat/fallback";
import { parseIntent, runHybridRound } from "@/lib/hybrid";
import { copy } from "@/lib/i18n";
import { useChimera } from "@/lib/store";

export const Route = createFileRoute("/chat")({ component: Chat });

function Chat() {
  const locale = useChimera((s) => s.locale);
  const t = copy[locale];
  const chat = useChimera((s) => s.chat);
  const pushChat = useChimera((s) => s.pushChat);
  const clearChat = useChimera((s) => s.clearChat);
  const recordRound = useChimera((s) => s.recordRound);
  const lastCert = useChimera((s) => s.lastCert);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  async function send(raw?: string) {
    const msg = (raw ?? text).trim();
    if (!msg || busy) return;
    setText("");
    pushChat({ role: "user", content: msg });
    setBusy(true);
    const intent = parseIntent(msg);
    let sim: string | undefined;
    if (intent.entangle || intent.noise > 0 || intent.product) {
      const kind = intent.product ? "product" : intent.ghz12 ? "ghz12" : intent.ghz ? "ghz" : "bell";
      const res = await runHybridRound({
        kind,
        qubits: kind === "ghz12" ? 12 : kind === "ghz" ? 4 : 2,
        shots: intent.shots,
        noise: intent.noise,
      });
      recordRound(res.cert, res.round, res.counts, res.correlators);
      sim = `F=${res.cert.fidelity.toFixed(3)} W=${res.cert.witness ?? "n/a"} BFT=${res.cert.accepted ? "ACCEPT" : "REJECT"} n=${res.cert.qubits}`;
    } else if (lastCert) {
      sim = `last cert F=${lastCert.fidelity.toFixed(3)} n=${lastCert.qubits} ${lastCert.accepted ? "ACCEPT" : "REJECT"}`;
    }
    try {
      const reply = await talkToRegister({
        data: {
          messages: [...chat, { role: "user", content: msg }],
          sim,
        },
      });
      const body = reply.ok ? reply.text : localRegisterReply(msg, sim);
      pushChat({ role: "assistant", content: body });
    } catch {
      pushChat({ role: "assistant", content: localRegisterReply(msg, sim) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="flex min-h-[70dvh] flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">12-qubit register</h1>
            <p className="mt-1 text-sm text-muted">{t.emptyChat}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat}>
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Restore GHZ on all twelve",
            "هر ۱۲ تا رو درهم‌تنیده کن با نویز سنگین",
            "Write the ZX hopf axiom in Lean",
          ].map((p) => (
            <Button key={p} size="sm" variant="secondary" onClick={() => send(p)}>
              {p}
            </Button>
          ))}
        </div>
        <div className="flex-1 space-y-3 overflow-auto rounded-xl border border-border bg-surface p-4">
          {chat.length === 0 && (
            <p className="text-sm text-muted">
              We are here — twelve of us, currently GHZ. Gates, certificates, Lean, or decoder questions.
            </p>
          )}
          {chat.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ms-auto max-w-[85%] rounded-lg bg-elevated px-3 py-2 text-sm"
                  : "max-w-[85%] rounded-lg border border-border px-3 py-2 text-sm text-muted"
              }
            >
              <p className="mb-1 text-[10px] uppercase tracking-wide text-subtle">
                {m.role === "user" ? "Commander" : "Register"}
              </p>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          <div ref={end} />
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
          />
          <Button type="submit" disabled={busy}>
            {t.send}
          </Button>
        </form>
      </div>
      <div className="hidden lg:block">
        <RegisterViz n={12} entangled={!lastCert || lastCert.accepted} label="Live mesh" />
      </div>
    </div>
  );
}

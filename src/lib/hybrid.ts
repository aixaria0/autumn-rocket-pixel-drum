import { runHotStuff, type HotStuffRound } from "@/lib/bft/hotstuff";
import { makeCert, type QuantumHoareCert } from "@/lib/cert/hoare";
import { ghzFidelityExact, ghzStabilizerFidelity } from "@/lib/quantum/ghz";
import { applyDepolarizing, bellWitness, collectShadows, fidelityToPure } from "@/lib/quantum/shadows";
import { bell, ghz, productZero, type Statevector } from "@/lib/quantum/state";
import { seeded } from "@/lib/quantum/math";

export type HybridKind = "bell" | "ghz" | "ghz12" | "product";

export type HybridResult = {
  cert: QuantumHoareCert;
  round: HotStuffRound;
  correlators?: { xx: number; yy: number; zz: number };
  counts?: Record<string, number>;
};

export async function runHybridRound(opts: {
  kind: HybridKind;
  qubits: number;
  shots: number;
  noise: number;
  seed?: number;
}): Promise<HybridResult> {
  const rng = seeded(opts.seed ?? 42);
  const n =
    opts.kind === "bell" ? 2 : opts.kind === "ghz12" ? 12 : opts.kind === "ghz" ? Math.max(3, opts.qubits) : opts.qubits;

  let target: Statevector;
  if (opts.kind === "bell") target = bell();
  else if (opts.kind === "product") target = productZero(n);
  else target = ghz(n);

  const noisy = applyDepolarizing(target.clone(), opts.noise, rng);
  const shots = n >= 8 ? Math.min(opts.shots, 96) : opts.shots;
  const snaps = collectShadows(noisy, shots, opts.seed ?? 42);

  let fid: number;
  let se: number;
  if (opts.kind === "ghz" || opts.kind === "ghz12") {
    const exact = ghzFidelityExact(noisy);
    const stab = ghzStabilizerFidelity(snaps, n);
    fid = 0.55 * exact + 0.45 * stab.fid;
    se = stab.se;
  } else if (n <= 4) {
    const r = fidelityToPure(snaps, target);
    fid = r.fid;
    se = r.se;
  } else {
    fid = ghzFidelityExact(noisy);
    se = 0.02;
  }

  const witness = n === 2 ? bellWitness(snaps) : null;
  const acceptQuantum = fid >= 0.65 && (witness === null || witness.w < 0);
  const round = runHotStuff({
    accept: acceptQuantum,
    value: `F=${fid.toFixed(4)}`,
  });
  const program =
    opts.kind === "bell"
      ? "H(0); CX(0,1)"
      : opts.kind === "product"
        ? "I"
        : `H(0); CX*(0,1..${n - 1})`;
  const cert = await makeCert({
    program,
    fidelity: fid,
    fidelityError: se,
    witness: witness?.w ?? null,
    shots,
    noise: opts.noise,
    qubits: n,
    decided: round.decided,
    view: round.view,
    quorum: round.quorum,
    leader: round.leader,
  });
  const counts = noisy.sample(rng, Math.min(128, shots));
  return {
    cert,
    round,
    correlators: witness ? { xx: witness.xx, yy: witness.yy, zz: witness.zz } : undefined,
    counts,
  };
}

export function parseIntent(text: string) {
  const t = text.toLowerCase();
  const ghz12 = /12|۱۲|twelve/.test(t);
  return {
    entangle: /ghz|entangle|درهم|bell|بل/.test(t),
    product: /product|جدا|separable|guillotine/.test(t),
    noise: /شدید|زیاد|heavy|kill|کشنده/.test(t)
      ? 0.22
      : /نویز|noise|خراب/.test(t)
        ? /کم|light|ریز/.test(t)
          ? 0.03
          : 0.1
        : 0,
    shots: ghz12 ? 80 : 180,
    ghz12,
    ghz: /ghz|ghz-4|چهار/.test(t),
  };
}

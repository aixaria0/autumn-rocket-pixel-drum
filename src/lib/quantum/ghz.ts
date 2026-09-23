import { estimatePauli, type Snapshot } from "./shadows";
import type { Statevector } from "./state";

/** Exact |⟨GHZ|ψ⟩|² for a pure statevector. */
export function ghzFidelityExact(st: Statevector) {
  const a = st.amp[0];
  const b = st.amp[(1 << st.n) - 1];
  const re = (a.re + b.re) * Math.SQRT1_2;
  const im = (a.im + b.im) * Math.SQRT1_2;
  return Math.min(1, Math.max(0, re * re + im * im));
}

export function ghzStabilizers(n: number) {
  const xs = "X".repeat(n);
  const zz: string[] = [];
  for (let i = 0; i < n - 1; i++) {
    zz.push("I".repeat(i) + "ZZ" + "I".repeat(n - i - 2));
  }
  return [xs, ...zz];
}

/** Shadow estimate of GHZ stabilizer fidelity (n+1 generators, not 4ⁿ Paulis). */
export function ghzStabilizerFidelity(snaps: Snapshot[], n: number) {
  const gens = ghzStabilizers(n);
  let acc = 0;
  let varAcc = 0;
  const values: { p: string; est: number }[] = [];
  for (const p of gens) {
    const { est, se } = estimatePauli(snaps, p);
    acc += est;
    varAcc += se * se;
    values.push({ p, est });
  }
  const fid = (1 + acc / gens.length) / 2;
  return {
    fid: Math.min(1, Math.max(0, fid)),
    se: Math.sqrt(varAcc) / (2 * gens.length),
    values,
  };
}

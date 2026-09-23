import { medianOfMeans, seeded } from "./math";
import { Statevector } from "./state";

export type Snapshot = { bits: string; measured: string };

const PAULIS = ["X", "Y", "Z"] as const;

function rotateToZ(st: Statevector, q: number, basis: string) {
  if (basis === "X") st.h(q);
  else if (basis === "Y") {
    st.s(q);
    st.h(q);
  }
}

function inverseFactor(obs: string) {
  let k = 0;
  for (const c of obs) if (c !== "I") k++;
  return 3 ** k;
}

/** Inverse-channel contribution: 0 unless snapshot basis matches the observable on every non-I site. */
export function snapshotContribution(bits: string, measured: string, observable: string) {
  let val = 1;
  for (let i = 0; i < observable.length; i++) {
    if (observable[i] === "I") continue;
    if (measured[i] !== observable[i]) return 0;
    val *= bits[i] === "0" ? 1 : -1;
  }
  return val * inverseFactor(observable);
}

export function collectShadows(state: Statevector, shots: number, seed = 7): Snapshot[] {
  const rng = seeded(seed);
  const snaps: Snapshot[] = [];
  for (let s = 0; s < shots; s++) {
    const measured = Array.from({ length: state.n }, () => PAULIS[Math.floor(rng() * 3)]);
    const copy = state.clone();
    for (let q = 0; q < state.n; q++) rotateToZ(copy, q, measured[q]);
    const p = copy.probs();
    let r = rng();
    let idx = p.length - 1;
    for (let i = 0; i < p.length; i++) {
      r -= p[i];
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    const bits = Array.from({ length: state.n }, (_, q) =>
      ((idx >> q) & 1) === 0 ? "0" : "1",
    ).join("");
    snaps.push({ bits, measured: measured.join("") });
  }
  return snaps;
}

export function estimatePauli(snaps: Snapshot[], pauli: string) {
  const vals = snaps.map((s) => snapshotContribution(s.bits, s.measured, pauli));
  return medianOfMeans(vals);
}

export function fidelityToPure(snaps: Snapshot[], target: Statevector) {
  const n = target.n;
  const dim = 1 << n;
  // For small n, sum over all Paulis: F = sum χ_ψ(P) χ_ρ(P) / 2^n
  const alphabet = ["I", "X", "Y", "Z"];
  const strings: string[] = [""];
  for (let q = 0; q < n; q++) {
    const next: string[] = [];
    for (const s of strings) for (const a of alphabet) next.push(s + a);
    strings.length = 0;
    strings.push(...next);
  }
  let fid = 0;
  let varAcc = 0;
  for (const p of strings) {
    const chiT = target.expectationPauli(p);
    const { est, se } = estimatePauli(snaps, p);
    fid += chiT * est;
    varAcc += (se * chiT) ** 2;
  }
  fid /= dim;
  const se = Math.sqrt(varAcc) / dim;
  return { fid: Math.min(1, Math.max(0, fid)), se };
}

/** Bell witness W = 0.5 - 0.25*(1 + XX - YY + ZZ). Negative => entangled. */
export function bellWitness(snaps: Snapshot[]) {
  const xx = estimatePauli(snaps, "XX").est;
  const yy = estimatePauli(snaps, "YY").est;
  const zz = estimatePauli(snaps, "ZZ").est;
  const w = 0.5 - 0.25 * (1 + xx - yy + zz);
  return { w, xx, yy, zz };
}

export function applyDepolarizing(state: Statevector, p: number, rng: () => number) {
  const copy = state.clone();
  for (let q = 0; q < copy.n; q++) {
    if (rng() >= p) continue;
    const k = Math.floor(rng() * 3);
    if (k === 0) copy.x(q);
    else if (k === 1) copy.y(q);
    else copy.z(q);
  }
  return copy;
}

/** Tiny CSS / qLDPC-style decoder: min-sum BP + OSD-0/OSD-1 over GF(2). */

export type DecoderResult = {
  syndrome: number[];
  residual: number[];
  errorEst: number[];
  success: boolean;
  iterations: number;
  name: string;
  osd: "bp" | "osd-0" | "osd-1";
  weight: number;
};

function mulGF2(H: number[][], e: number[]) {
  return H.map((row) => row.reduce((s, v, i) => s ^ (v & e[i]), 0));
}

function eq(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function wt(e: number[]) {
  return e.reduce((s, v) => s + v, 0);
}

/** Steane [[7,1,3]] X-checks (Hamming). */
export const STEANE_HX = [
  [1, 1, 1, 0, 1, 0, 0],
  [1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 0, 1],
];

/** Bicycle-style 6-qubit CSS X-checks (weight-4). */
export const BICYCLE_HX = [
  [1, 1, 0, 1, 1, 0],
  [0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 0, 1],
];

function bpMinsum(H: number[][], syndrome: number[], iters = 12) {
  const r = H.length;
  const n = H[0].length;
  const vn: { c: number; v: number }[][] = Array.from({ length: n }, () => []);
  const cn: { c: number; v: number }[][] = Array.from({ length: r }, () => []);
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < n; j++) {
      if (!H[i][j]) continue;
      vn[j].push({ c: i, v: j });
      cn[i].push({ c: i, v: j });
    }
  }
  const msgCV: Record<string, number> = {};
  const msgVC: Record<string, number> = {};
  const key = (c: number, v: number) => `${c}:${v}`;
  const channel = 2.2;
  for (const e of vn.flat()) {
    msgVC[key(e.c, e.v)] = channel;
  }

  let hard = Array(n).fill(0);
  for (let t = 0; t < iters; t++) {
    for (let c = 0; c < r; c++) {
      const neigh = cn[c];
      for (const { v } of neigh) {
        let sgn = syndrome[c] ? -1 : 1;
        let mag = 40;
        for (const { v: v2 } of neigh) {
          if (v2 === v) continue;
          const m = msgVC[key(c, v2)] ?? channel;
          sgn *= m >= 0 ? 1 : -1;
          mag = Math.min(mag, Math.abs(m));
        }
        msgCV[key(c, v)] = 0.75 * sgn * mag;
      }
    }
    hard = Array(n).fill(0);
    for (let v = 0; v < n; v++) {
      let llr = channel;
      for (const { c } of vn[v]) llr += msgCV[key(c, v)] ?? 0;
      hard[v] = llr < 0 ? 1 : 0;
      for (const { c } of vn[v]) {
        const out = llr - (msgCV[key(c, v)] ?? 0);
        msgVC[key(c, v)] = Math.max(-20, Math.min(20, out));
      }
    }
    if (eq(mulGF2(H, hard), syndrome)) return { error: hard, iterations: t + 1 };
  }
  return { error: hard, iterations: iters };
}

function gaussianSolve(H: number[][], s: number[]) {
  const r = H.length;
  const n = H[0].length;
  const A = H.map((row, i) => [...row, s[i]]);
  let rank = 0;
  const pivots: number[] = [];
  for (let col = 0; col < n && rank < r; col++) {
    let piv = -1;
    for (let i = rank; i < r; i++) if (A[i][col]) { piv = i; break; }
    if (piv < 0) continue;
    [A[rank], A[piv]] = [A[piv], A[rank]];
    for (let i = 0; i < r; i++) {
      if (i !== rank && A[i][col]) {
        for (let j = col; j <= n; j++) A[i][j] ^= A[rank][j];
      }
    }
    pivots.push(col);
    rank++;
  }
  const x = Array(n).fill(0);
  for (let i = 0; i < rank; i++) x[pivots[i]] = A[i][n];
  return x;
}

function osd1(H: number[][], syndrome: number[], seed: number[]) {
  let best = seed;
  let bestW = wt(seed);
  if (!eq(mulGF2(H, best), syndrome)) {
    best = gaussianSolve(H, syndrome);
    bestW = wt(best);
  }
  const n = seed.length;
  for (let i = 0; i < n; i++) {
    const cand = best.map((v, j) => (j === i ? v ^ 1 : v));
    if (eq(mulGF2(H, cand), syndrome) && wt(cand) < bestW) {
      best = cand;
      bestW = wt(cand);
    }
  }
  return best;
}

export function decodeBPOSD(
  H: number[][],
  error: number[],
  name = "qLDPC",
): DecoderResult {
  const syndrome = mulGF2(H, error);
  const bp = bpMinsum(H, syndrome);
  let est = bp.error;
  let osd: DecoderResult["osd"] = "bp";
  if (!eq(mulGF2(H, est), syndrome)) {
    est = gaussianSolve(H, syndrome);
    osd = "osd-0";
  }
  if (!eq(mulGF2(H, est), syndrome) || wt(est) > wt(error) + 1) {
    est = osd1(H, syndrome, est);
    osd = "osd-1";
  }
  const residual = est.map((v, i) => v ^ error[i]);
  const success = eq(mulGF2(H, est), syndrome);
  return {
    syndrome,
    residual,
    errorEst: est,
    success,
    iterations: bp.iterations,
    name,
    osd,
    weight: wt(est),
  };
}

export function randomError(n: number, p: number, rng: () => number) {
  return Array.from({ length: n }, () => (rng() < p ? 1 : 0));
}

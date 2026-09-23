/** Bravyi–Kitaev 15-to-1 magic-state distillation (leading-order toy). */

export type DistillResult = {
  inputP: number;
  outputP: number;
  yieldProb: number;
  protocol: string;
};

/** Output error ~ 35 p³; post-select success ~ 1 − 15p (small-p). */
export function distill15to1(p: number): DistillResult {
  const inputP = Math.min(0.49, Math.max(1e-6, p));
  const outputP = Math.min(0.5, 35 * inputP ** 3);
  const yieldProb = Math.max(0.01, Math.min(1, 1 - 15 * inputP + 80 * inputP ** 2));
  return {
    inputP,
    outputP,
    yieldProb,
    protocol: "Bravyi–Kitaev 15-to-1 (Reed–Muller)",
  };
}

export function distillCurve(points = 24) {
  return Array.from({ length: points }, (_, i) => {
    const p = 0.002 + (0.12 * i) / (points - 1);
    const r = distill15to1(p);
    return { p, out: r.outputP, yld: r.yieldProb };
  });
}

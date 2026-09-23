export type C = { re: number; im: number };

export const cz = (re = 0, im = 0): C => ({ re, im });
export const cadd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
export const cmul = (a: C, b: C): C => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
export const cabs2 = (a: C) => a.re * a.re + a.im * a.im;

export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function median(xs: number[]) {
  if (!xs.length) return 0;
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : 0.5 * (a[m - 1] + a[m]);
}

export function medianOfMeans(values: number[], batches = 8): { est: number; se: number } {
  if (!values.length) return { est: 0, se: 1 };
  const n = Math.min(batches, Math.max(1, Math.floor(values.length / 2)));
  const size = Math.floor(values.length / n);
  const means: number[] = [];
  for (let i = 0; i < n; i++) {
    const slice = values.slice(i * size, (i + 1) * size);
    if (!slice.length) continue;
    means.push(slice.reduce((s, v) => s + v, 0) / slice.length);
  }
  const est = median(means);
  const mad = median(means.map((m) => Math.abs(m - est))) + 1e-12;
  return { est, se: (1.4826 * mad) / Math.sqrt(means.length || 1) };
}

export const QLDPC_FAMILIES = [
  {
    name: "Hypergraph product",
    rate: "Θ(1)",
    distance: "Θ(√n)",
    locality: "4–8",
    note: "Product of two classical LDPC codes. Simplest asymptotic family.",
  },
  {
    name: "Lifted product",
    rate: "Θ(1)",
    distance: "n^{1/2+ε}",
    locality: "bounded",
    note: "Group lifts improve distance over plain HGP.",
  },
  {
    name: "Bivariate bicycle",
    rate: "Θ(1)",
    distance: "growing",
    locality: "weight-6",
    note: "Highly structured; good hardware layout. IBM-style bicycle codes.",
  },
  {
    name: "Good qLDPC",
    rate: "Θ(1)",
    distance: "almost linear",
    locality: "bounded",
    note: "Panteleev–Kalachev / Leverrier–Zémor existence + explicit constructions.",
  },
] as const;

/** Tiny bicycle check layout: cyclic shifts of (1,1,0,1,1,0). */
export function bicycleLayout() {
  const n = 6;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return { id: i, x: Math.round((120 + 90 * Math.cos(a)) * 100) / 100, y: Math.round((90 + 70 * Math.sin(a)) * 100) / 100 };
  });
  const checks = [
    [0, 1, 3, 4],
    [1, 2, 4, 5],
    [2, 3, 5, 0],
  ];
  return { nodes, checks };
}

export type SurfaceStabilizer = {
  kind: "star" | "plaquette";
  label: string;
  sites: number[];
  op: "X" | "Z";
};

/** Distance-3 planar surface code (9 data qubits, educational). */
export const SURFACE_D3 = {
  n: 9,
  distance: 3,
  d: 2,
  stars: [
    { kind: "star" as const, label: "A1", sites: [0, 1, 3, 4], op: "X" as const },
    { kind: "star" as const, label: "A2", sites: [1, 2, 4, 5], op: "X" as const },
    { kind: "star" as const, label: "A3", sites: [3, 4, 6, 7], op: "X" as const },
    { kind: "star" as const, label: "A4", sites: [4, 5, 7, 8], op: "X" as const },
  ],
  plaquettes: [
    { kind: "plaquette" as const, label: "B1", sites: [0, 1, 3], op: "Z" as const },
    { kind: "plaquette" as const, label: "B2", sites: [1, 2, 5], op: "Z" as const },
    { kind: "plaquette" as const, label: "B3", sites: [3, 6, 7], op: "Z" as const },
    { kind: "plaquette" as const, label: "B4", sites: [5, 7, 8], op: "Z" as const },
  ],
};

export function quditStar(d: number, edges: number[]) {
  return {
    op: "X" as const,
    formula: `A_v = ∏_{e ∈ δ(v)} X_e    (Weyl X on ℂ^${d})`,
    edges,
  };
}

export function quditPlaquette(d: number, edges: number[]) {
  return {
    op: "Z" as const,
    formula: `B_p = ∏_{e ∈ ∂p} Z_e    (Weyl Z, ω = e^{2πi/${d}})`,
    edges,
  };
}

export const QUDIT_COMMUTATOR =
  "ZX = ω XZ  ⇒  [A_v, B_p] = 0 when orientation phases cancel";

export type PauliErr = { kind: "X" | "Z" | "Y"; qubit: number };

function parity(sites: number[], bits: number[]) {
  return sites.reduce((s, q) => s ^ (bits[q] ?? 0), 0);
}

export function encodeLogicalZero() {
  return { n: SURFACE_D3.n, xErr: Array(SURFACE_D3.n).fill(0), zErr: Array(SURFACE_D3.n).fill(0) };
}

export function decodeSurface(
  mem: { n: number; xErr: number[]; zErr: number[] },
  kind: "X" | "Z" | "Y",
  qubit: number,
) {
  const xErr = [...mem.xErr];
  const zErr = [...mem.zErr];
  if (kind === "X" || kind === "Y") xErr[qubit] ^= 1;
  if (kind === "Z" || kind === "Y") zErr[qubit] ^= 1;

  const syndX = SURFACE_D3.stars.map((s) => parity(s.sites, zErr));
  const syndZ = SURFACE_D3.plaquettes.map((s) => parity(s.sites, xErr));

  // Educational correction: flip the first data qubit in the first fired check.
  const corrX = [...xErr];
  const corrZ = [...zErr];
  const firedZ = SURFACE_D3.plaquettes.find((_, i) => syndZ[i]);
  if (firedZ) corrX[firedZ.sites[0]] ^= 1;
  const firedX = SURFACE_D3.stars.find((_, i) => syndX[i]);
  if (firedX) corrZ[firedX.sites[0]] ^= 1;

  const syndX2 = SURFACE_D3.stars.map((s) => parity(s.sites, corrZ));
  const syndZ2 = SURFACE_D3.plaquettes.map((s) => parity(s.sites, corrX));
  const corrected = syndX2.every((b) => b === 0) && syndZ2.every((b) => b === 0);

  return { syndX, syndZ, syndX2, syndZ2, corrected, xErr, zErr, qubit, kind };
}

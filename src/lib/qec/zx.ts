export type Spider = {
  id: string;
  color: "Z" | "X";
  phase: string;
  x: number;
  y: number;
};

export type Wire = { a: string; b: string };

export type ZxDiagram = { spiders: Spider[]; wires: Wire[]; caption: string };

export const ZX_RULES = [
  {
    id: "fusion",
    name: "Spider fusion",
    lean: `axiom spider_fusion (c : Color) (α β : Phase) :
  connected (spider c α) (spider c β) = spider c (α + β)`,
    note: "Same-colour spiders connected by one or more wires fuse; phases add in ℤ_d.",
  },
  {
    id: "identity",
    name: "Identity",
    lean: `axiom spider_id (c : Color) :
  spider c 0 1 1 = wire`,
    note: "A 1-in 1-out spider of phase 0 is the identity wire.",
  },
  {
    id: "fourier",
    name: "Colour change",
    lean: `axiom colour_change (α : Phase) :
  fourier_on_legs (spider Z α) = spider X (F α)`,
    note: "Fourier boxes on every leg swap Z and X spiders (qudit Hadamard).",
  },
  {
    id: "hopf",
    name: "Hopf law",
    lean: `axiom hopf (d : ℕ) :
  loop (spider Z 0) (spider X 0) = scalar d`,
    note: "A green-red closed loop evaluates to the scalar d.",
  },
  {
    id: "copy",
    name: "Phase copy",
    lean: `axiom phase_copy (k : Fin d) :
  copy (spider X 0) (phaseZ (2*π*k/d)) = tensor_phase`,
    note: "Special phases that are multiples of 2π/d copy through the opposite colour.",
  },
  {
    id: "completeness",
    name: "Stabiliser completeness",
    lean: `theorem clifford_complete :
  ∀ (d1 d2 : Diagram), clifford d1 → (equiv d1 d2 ↔ rewrite_eq d1 d2)`,
    note: "Two Clifford diagrams represent the same map iff they rewrite into each other.",
  },
] as const;

export function bellDiagrams(): ZxDiagram[] {
  return [
    {
      caption: "Bell circuit — H then CX",
      spiders: [
        { id: "in0", color: "Z", phase: "0", x: 40, y: 40 },
        { id: "h", color: "Z", phase: "π", x: 120, y: 40 },
        { id: "x", color: "X", phase: "0", x: 200, y: 40 },
        { id: "out0", color: "Z", phase: "0", x: 280, y: 40 },
        { id: "in1", color: "Z", phase: "0", x: 40, y: 120 },
        { id: "out1", color: "Z", phase: "0", x: 280, y: 120 },
      ],
      wires: [
        { a: "in0", b: "h" },
        { a: "h", b: "x" },
        { a: "x", b: "out0" },
        { a: "in1", b: "out1" },
        { a: "x", b: "out1" },
      ],
    },
    {
      caption: "After fusion — two fused Bell spiders",
      spiders: [
        { id: "g", color: "Z", phase: "π", x: 110, y: 80 },
        { id: "r", color: "X", phase: "0", x: 210, y: 80 },
      ],
      wires: [
        { a: "g", b: "r" },
        { a: "g", b: "r" },
      ],
    },
  ];
}

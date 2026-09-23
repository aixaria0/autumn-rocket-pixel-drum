export const QUDIT_ZX_LEAN = `-- QuditZX.lean
-- Qudit ZX-calculus rewrite rules (Clifford fragment).
-- Phases live in ℤ_d; Fourier F is the qudit Hadamard.

import Mathlib.Data.Fin.Basic
import Mathlib.GroupTheory.OrderOfElements

namespace QuditZX

variable (d : ℕ) [NeZero d]

abbrev Phase := Fin d
inductive Color | Z | X deriving DecidableEq, Repr

/-- Abstract ZX diagram (syntax). -/
inductive Diagram where
  | spider (c : Color) (α : Phase) (ins outs : ℕ)
  | fourier
  | tensor (a b : Diagram)
  | compose (a b : Diagram)
  | cup | cap | wire
  | scalar (s : ℂ)
deriving Repr

open Color Diagram

/-- Same-colour spiders connected by ≥1 wire fuse; phases add in ℤ_d. -/
axiom spider_fusion (c : Color) (α β : Phase) (m n k : ℕ) :
  compose (spider c α m (n+k)) (spider c β (n+k) k) =
    spider c (α + β) m k

/-- A 1-in 1-out spider of phase 0 is the identity wire. -/
axiom spider_id (c : Color) :
  spider c 0 1 1 = wire

/-- Fourier boxes on every leg swap Z ↔ X (qudit Hadamard). -/
axiom colour_change (α : Phase) (m n : ℕ) :
  compose (tensor_pow fourier m)
    (compose (spider Z α m n) (tensor_pow fourier n)) =
    spider X α m n

/-- Green–red Hopf loop evaluates to the scalar d. -/
axiom hopf :
  compose (compose cup (tensor (spider Z 0 1 1) (spider X 0 1 1))) cap =
    scalar d

/-- Special phases (multiples of 2π/d) copy through the opposite colour. -/
axiom phase_copy (k : Fin d) :
  compose (spider X 0 1 2) (tensor (spider Z k 1 1) wire) =
    tensor (spider Z k 1 1) (spider Z k 1 1)

/-- Clifford fragment completeness: semantic equality ↔ rewrite equality. -/
axiom clifford_complete (d1 d2 : Diagram) :
  Clifford d1 → Clifford d2 → (sem d1 = sem d2 ↔ rewrite_eq d1 d2)

/-- Semantic interpretation: spiders are computational-basis (Z) or
    Fourier-basis (X) phase maps on (ℂ^d)^{⊗n}. -/
opaque sem : Diagram → Matrix (Fin (d ^ ?n)) (Fin (d ^ ?m)) ℂ

end QuditZX
`;

export const SURFACE_LEAN = `-- QuditSurface.lean
namespace QuditSurface
variable (d : ℕ) [NeZero d]

opaque X : Fin d → Unitary (Fin d)
opaque Z : Fin d → Unitary (Fin d)

/-- Vertex (star) stabilizer: product of Weyl-X on incident edges. -/
def star (edges : List (Fin n)) : Weyl :=
  edges.foldl (fun acc e => acc * X_on e) 1

/-- Plaquette stabilizer: product of Weyl-Z around a face. -/
def plaquette (edges : List (Fin n)) : Weyl :=
  edges.foldl (fun acc e => acc * Z_on e) 1

axiom commute_star_plaquette (v p : Face) :
  Weyl.commute (star (δ v)) (plaquette (∂ p))

end QuditSurface
`;

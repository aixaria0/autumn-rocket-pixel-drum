import{i as e,r as t,s as n}from"./utils-B1q3IMNi.js";import{r}from"./index-6lmqlz6s.js";import{o as i}from"./math-B71b-pSw.js";import{a,c as o,i as s,n as c,o as l,r as u,s as d,t as f}from"./zx-C273MRDu.js";import{i as p,r as m}from"./surface-sxJRxUpm.js";import{a as h,i as g,n as _,t as v}from"./card-BT1z3hNR.js";import{t as y}from"./slider-BWZOWiKo.js";import{i as b,n as x,r as S,t as C}from"./tabs-CgaGZmIl.js";import{n as w}from"./qldpc-DIVu-woJ.js";import{a as T,i as E,n as D,o as O,r as k,t as A}from"./LineChart-BQPOe7tb.js";var j=n(e()),M=t();function N({diagram:e}){return(0,M.jsxs)(`div`,{children:[(0,M.jsx)(`p`,{className:`mb-2 text-xs text-muted`,children:e.caption}),(0,M.jsxs)(`svg`,{viewBox:`0 0 320 170`,className:`h-40 w-full rounded-lg bg-bg`,children:[e.wires.map((t,n)=>{let r=e.spiders.find(e=>e.id===t.a),i=e.spiders.find(e=>e.id===t.b);if(!r||!i)return null;let a=n%2==0?0:10;return(0,M.jsx)(`path`,{d:`M ${r.x} ${r.y} C ${r.x+40} ${r.y+a}, ${i.x-40} ${i.y+a}, ${i.x} ${i.y}`,fill:`none`,className:`stroke-muted`,strokeWidth:1.4},n)}),e.spiders.map(e=>(0,M.jsxs)(`g`,{children:[(0,M.jsx)(`circle`,{cx:e.x,cy:e.y,r:14,className:e.color===`Z`?`fill-ok`:`fill-bad`,opacity:.85}),(0,M.jsx)(`text`,{x:e.x,y:e.y+4,textAnchor:`middle`,className:`fill-accent-fg font-mono`,fontSize:9,children:e.phase})]},e.id))]})]})}var P=`-- QuditZX.lean
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
`;function F(){let e=c(),[t,n]=(0,j.useState)(0),[F,I]=(0,j.useState)(.12),[L,R]=(0,j.useState)(`steane`),[z,B]=(0,j.useState)(null),[V,H]=(0,j.useState)(.05),[U,W]=(0,j.useState)(null),G=w(),K=(0,j.useMemo)(()=>o(),[]),q=d(V);return(0,M.jsxs)(`div`,{className:`grid gap-6`,children:[(0,M.jsxs)(`div`,{children:[(0,M.jsx)(`h1`,{className:`text-2xl font-medium tracking-tight`,children:`Formal layer`}),(0,M.jsx)(`p`,{className:`mt-1 text-sm text-muted`,children:`Qudit ZX axioms, Lean fragment, BP-OSD, bicycle Tanner graph, surface patch, 15-to-1 distillation.`})]}),(0,M.jsxs)(C,{defaultValue:`zx`,children:[(0,M.jsxs)(S,{className:`flex h-auto flex-wrap`,children:[(0,M.jsx)(b,{value:`zx`,children:`ZX`}),(0,M.jsx)(b,{value:`lean`,children:`Lean`}),(0,M.jsx)(b,{value:`decode`,children:`BP-OSD`}),(0,M.jsx)(b,{value:`surface`,children:`Surface`}),(0,M.jsx)(b,{value:`magic`,children:`Distill`})]}),(0,M.jsx)(x,{value:`zx`,className:`mt-4`,children:(0,M.jsxs)(v,{children:[(0,M.jsx)(g,{children:(0,M.jsx)(h,{children:`Qudit ZX rewrite`})}),(0,M.jsxs)(_,{className:`space-y-4`,children:[(0,M.jsx)(N,{diagram:e[t]}),(0,M.jsx)(r,{size:`sm`,variant:`secondary`,onClick:()=>n(e=>1-e),children:t===0?`Apply fusion`:`Reset circuit`}),(0,M.jsx)(`div`,{className:`grid gap-3`,children:f.map(e=>(0,M.jsxs)(`div`,{className:`rounded-lg border border-border bg-bg p-3`,children:[(0,M.jsx)(`p`,{className:`text-xs font-medium text-fg`,children:e.name}),(0,M.jsx)(`pre`,{className:`mt-2 overflow-auto font-mono text-[11px] leading-5 text-muted`,children:e.lean}),(0,M.jsx)(`p`,{className:`mt-2 text-xs text-subtle`,children:e.note})]},e.id))})]})]})}),(0,M.jsx)(x,{value:`lean`,className:`mt-4`,children:(0,M.jsxs)(v,{children:[(0,M.jsx)(g,{children:(0,M.jsx)(h,{children:`QuditZX.lean`})}),(0,M.jsx)(_,{children:(0,M.jsx)(`pre`,{className:`max-h-[28rem] overflow-auto rounded-lg border border-border bg-bg p-4 font-mono text-[11px] leading-5 text-muted`,children:P})})]})}),(0,M.jsx)(x,{value:`decode`,className:`mt-4`,children:(0,M.jsxs)(v,{children:[(0,M.jsx)(g,{children:(0,M.jsx)(h,{children:`BP-OSD decoder`})}),(0,M.jsxs)(_,{className:`space-y-4`,children:[(0,M.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,M.jsx)(r,{size:`sm`,variant:L===`steane`?`default`:`secondary`,onClick:()=>R(`steane`),children:`Steane [[7,1,3]]`}),(0,M.jsx)(r,{size:`sm`,variant:L===`bicycle`?`default`:`secondary`,onClick:()=>R(`bicycle`),children:`Bicycle 6`})]}),(0,M.jsxs)(`label`,{className:`block text-xs text-muted`,children:[`Physical p `,(0,M.jsx)(`span`,{className:`font-mono`,children:F.toFixed(2)}),(0,M.jsx)(y,{className:`mt-3`,min:.02,max:.25,step:.01,value:[F],onValueChange:e=>I(e[0])})]}),(0,M.jsx)(r,{onClick:()=>{let e=L===`steane`?s:u,t=l(e[0].length,F,i(Date.now()%99991));B(a(e,t,L))},children:`Inject error and decode`}),z&&(0,M.jsxs)(`dl`,{className:`grid grid-cols-2 gap-2 font-mono text-xs`,children:[(0,M.jsx)(`dt`,{className:`text-muted`,children:`Syndrome`}),(0,M.jsx)(`dd`,{children:z.syndrome.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`Estimate`}),(0,M.jsx)(`dd`,{children:z.errorEst.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`Iterations`}),(0,M.jsx)(`dd`,{children:z.iterations}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`OSD`}),(0,M.jsx)(`dd`,{children:z.osd}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`Matched`}),(0,M.jsx)(`dd`,{className:z.success?`text-ok`:`text-bad`,children:z.success?`yes`:`no`})]}),(0,M.jsxs)(`svg`,{viewBox:`0 0 240 180`,className:`h-48 w-full`,children:[G.checks.map((e,t)=>(0,M.jsx)(`polygon`,{points:e.map(e=>`${G.nodes[e].x},${G.nodes[e].y}`).join(` `),className:`fill-ok/10 stroke-ok/40`},t)),G.nodes.map(e=>(0,M.jsxs)(`g`,{children:[(0,M.jsx)(`circle`,{cx:e.x,cy:e.y,r:10,className:`fill-elevated stroke-accent`}),(0,M.jsx)(`text`,{x:e.x,y:e.y+3,textAnchor:`middle`,className:`fill-fg font-mono`,fontSize:9,children:e.id})]},e.id))]})]})]})}),(0,M.jsx)(x,{value:`surface`,className:`mt-4`,children:(0,M.jsxs)(v,{children:[(0,M.jsx)(g,{children:(0,M.jsx)(h,{children:`Surface-code memory (d=3 educational)`})}),(0,M.jsxs)(_,{className:`space-y-4`,children:[(0,M.jsx)(r,{onClick:()=>{let e=p();W(m(e,`X`,0))},children:`Inject X on qubit 0`}),U&&(0,M.jsxs)(`dl`,{className:`grid grid-cols-2 gap-2 font-mono text-xs`,children:[(0,M.jsx)(`dt`,{className:`text-muted`,children:`Synd X`}),(0,M.jsx)(`dd`,{children:U.syndX.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`Synd Z`}),(0,M.jsx)(`dd`,{children:U.syndZ.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`After X`}),(0,M.jsx)(`dd`,{children:U.syndX2.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`After Z`}),(0,M.jsx)(`dd`,{children:U.syndZ2.join(``)}),(0,M.jsx)(`dt`,{className:`text-muted`,children:`Corrected`}),(0,M.jsx)(`dd`,{className:U.corrected?`text-ok`:`text-warn`,children:U.corrected?`yes`:`partial`})]})]})]})}),(0,M.jsx)(x,{value:`magic`,className:`mt-4`,children:(0,M.jsxs)(v,{children:[(0,M.jsx)(g,{children:(0,M.jsx)(h,{children:`15-to-1 magic-state distillation`})}),(0,M.jsxs)(_,{className:`space-y-4`,children:[(0,M.jsxs)(`label`,{className:`block text-xs text-muted`,children:[`Input p `,(0,M.jsx)(`span`,{className:`font-mono`,children:V.toFixed(3)}),(0,M.jsx)(y,{className:`mt-3`,min:.005,max:.12,step:.005,value:[V],onValueChange:e=>H(e[0])})]}),(0,M.jsxs)(`div`,{className:`grid grid-cols-2 gap-3 font-mono text-sm`,children:[(0,M.jsxs)(`div`,{children:[(0,M.jsx)(`p`,{className:`text-xs text-muted`,children:`p out`}),(0,M.jsx)(`p`,{children:q.outputP.toExponential(2)})]}),(0,M.jsxs)(`div`,{children:[(0,M.jsx)(`p`,{className:`text-xs text-muted`,children:`yield`}),(0,M.jsx)(`p`,{children:q.yieldProb.toFixed(3)})]})]}),(0,M.jsx)(`div`,{className:`h-48`,children:(0,M.jsx)(T,{width:`100%`,height:`100%`,children:(0,M.jsxs)(A,{data:K,children:[(0,M.jsx)(k,{dataKey:`p`,tick:{fontSize:10}}),(0,M.jsx)(D,{tick:{fontSize:10}}),(0,M.jsx)(O,{contentStyle:{background:`var(--color-surface)`,border:`1px solid var(--color-border)`,fontSize:12}}),(0,M.jsx)(E,{type:`monotone`,dataKey:`out`,stroke:`var(--color-accent)`,dot:!1,strokeWidth:1.5})]})})}),(0,M.jsxs)(`p`,{className:`text-xs text-subtle`,children:[q.protocol,`. Leading term 35 p³.`]})]})]})})]})]})}export{F as component};
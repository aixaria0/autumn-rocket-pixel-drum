import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Button } from "./router-DgxUBSEx.mjs";
import { o as seeded } from "./math-B_58bcln.mjs";
import { a as decodeBPOSD, c as randomError, i as bellDiagrams, n as STEANE_HX, o as distill15to1, r as ZX_RULES, s as distillCurve, t as BICYCLE_HX } from "./zx-C_MMiGHv.mjs";
import { i as encodeLogicalZero, r as decodeSurface } from "./surface-wJOP2tvN.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
import { t as Slider } from "./slider-BQxpuEZ6.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DuDwHm66.mjs";
import { n as bicycleLayout } from "./qldpc-Bew_CNIs.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formal-Dn3tsP1a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ZxViz({ diagram }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-xs text-muted",
		children: diagram.caption
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 170",
		className: "h-40 w-full rounded-lg bg-bg",
		children: [diagram.wires.map((w, i) => {
			const a = diagram.spiders.find((s) => s.id === w.a);
			const b = diagram.spiders.find((s) => s.id === w.b);
			if (!a || !b) return null;
			const bump = i % 2 === 0 ? 0 : 10;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `M ${a.x} ${a.y} C ${a.x + 40} ${a.y + bump}, ${b.x - 40} ${b.y + bump}, ${b.x} ${b.y}`,
				fill: "none",
				className: "stroke-muted",
				strokeWidth: 1.4
			}, i);
		}), diagram.spiders.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: s.x,
			cy: s.y,
			r: 14,
			className: s.color === "Z" ? "fill-ok" : "fill-bad",
			opacity: .85
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: s.x,
			y: s.y + 4,
			textAnchor: "middle",
			className: "fill-accent-fg font-mono",
			fontSize: 9,
			children: s.phase
		})] }, s.id))]
	})] });
}
var QUDIT_ZX_LEAN = `-- QuditZX.lean
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
function Formal() {
	const diagrams = bellDiagrams();
	const [step, setStep] = (0, import_react.useState)(0);
	const [p, setP] = (0, import_react.useState)(.12);
	const [code, setCode] = (0, import_react.useState)("steane");
	const [result, setResult] = (0, import_react.useState)(null);
	const [dp, setDp] = (0, import_react.useState)(.05);
	const [surf, setSurf] = (0, import_react.useState)(null);
	const layout = bicycleLayout();
	const curve = (0, import_react.useMemo)(() => distillCurve(), []);
	const dres = distill15to1(dp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-medium tracking-tight",
			children: "Formal layer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Qudit ZX axioms, Lean fragment, BP-OSD, bicycle Tanner graph, surface patch, 15-to-1 distillation."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "zx",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex h-auto flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "zx",
							children: "ZX"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "lean",
							children: "Lean"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "decode",
							children: "BP-OSD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "surface",
							children: "Surface"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "magic",
							children: "Distill"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "zx",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Qudit ZX rewrite" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZxViz, { diagram: diagrams[step] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => setStep((s) => 1 - s),
								children: step === 0 ? "Apply fusion" : "Reset circuit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3",
								children: ZX_RULES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-fg",
											children: r.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "mt-2 overflow-auto font-mono text-[11px] leading-5 text-muted",
											children: r.lean
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-subtle",
											children: r.note
										})
									]
								}, r.id))
							})
						]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "lean",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "QuditZX.lean" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-[28rem] overflow-auto rounded-lg border border-border bg-bg p-4 font-mono text-[11px] leading-5 text-muted",
						children: QUDIT_ZX_LEAN
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "decode",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "BP-OSD decoder" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: code === "steane" ? "default" : "secondary",
									onClick: () => setCode("steane"),
									children: "Steane [[7,1,3]]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: code === "bicycle" ? "default" : "secondary",
									onClick: () => setCode("bicycle"),
									children: "Bicycle 6"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: [
									"Physical p ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: p.toFixed(2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										className: "mt-3",
										min: .02,
										max: .25,
										step: .01,
										value: [p],
										onValueChange: (v) => setP(v[0])
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									const H = code === "steane" ? STEANE_HX : BICYCLE_HX;
									const err = randomError(H[0].length, p, seeded(Date.now() % 99991));
									setResult(decodeBPOSD(H, err, code));
								},
								children: "Inject error and decode"
							}),
							result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Syndrome"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result.syndrome.join("") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Estimate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result.errorEst.join("") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Iterations"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result.iterations }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "OSD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result.osd }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Matched"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: result.success ? "text-ok" : "text-bad",
										children: result.success ? "yes" : "no"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 240 180",
								className: "h-48 w-full",
								children: [layout.checks.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
									points: ch.map((idx) => `${layout.nodes[idx].x},${layout.nodes[idx].y}`).join(" "),
									className: "fill-ok/10 stroke-ok/40"
								}, i)), layout.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: n.x,
									cy: n.y,
									r: 10,
									className: "fill-elevated stroke-accent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: n.x,
									y: n.y + 3,
									textAnchor: "middle",
									className: "fill-fg font-mono",
									fontSize: 9,
									children: n.id
								})] }, n.id))]
							})
						]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "surface",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Surface-code memory (d=3 educational)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								const mem = encodeLogicalZero();
								setSurf(decodeSurface(mem, "X", 0));
							},
							children: "Inject X on qubit 0"
						}), surf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-2 gap-2 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Synd X"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: surf.syndX.join("") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Synd Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: surf.syndZ.join("") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "After X"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: surf.syndX2.join("") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "After Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: surf.syndZ2.join("") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Corrected"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: surf.corrected ? "text-ok" : "text-warn",
									children: surf.corrected ? "yes" : "partial"
								})
							]
						})]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "magic",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "15-to-1 magic-state distillation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: [
									"Input p ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: dp.toFixed(3)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										className: "mt-3",
										min: .005,
										max: .12,
										step: .005,
										value: [dp],
										onValueChange: (v) => setDp(v[0])
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 font-mono text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "p out"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dres.outputP.toExponential(2) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "yield"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dres.yieldProb.toFixed(3) })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-48",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: curve,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "p",
												tick: { fontSize: 10 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 10 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
												background: "var(--color-surface)",
												border: "1px solid var(--color-border)",
												fontSize: 12
											} }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "out",
												stroke: "var(--color-accent)",
												dot: false,
												strokeWidth: 1.5
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-subtle",
								children: [dres.protocol, ". Leading term 35 p³."]
							})
						]
					})] })
				})
			]
		})]
	});
}
//#endregion
export { Formal as component };

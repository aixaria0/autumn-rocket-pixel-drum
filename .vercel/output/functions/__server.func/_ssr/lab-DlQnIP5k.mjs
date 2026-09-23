import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Button } from "./router-DgxUBSEx.mjs";
import { o as seeded } from "./math-B_58bcln.mjs";
import { a as collectShadows, c as ghzFidelityExact, n as applyDepolarizing, o as fidelityToPure, r as bell, s as ghz, t as Statevector, u as productZero } from "./state-CJOUlDmn.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
import { t as Slider } from "./slider-BQxpuEZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-DlQnIP5k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function build(preset, groverIter) {
	if (preset === "bell") return bell();
	if (preset === "ghz") return ghz(3);
	if (preset === "ghz12") return ghz(12);
	if (preset === "grover") {
		const st = new Statevector(2);
		st.h(0);
		st.h(1);
		for (let i = 0; i < groverIter; i++) {
			st.z(0);
			st.z(1);
			st.cx(0, 1);
			st.z(1);
			st.cx(0, 1);
			st.h(0);
			st.h(1);
			st.x(0);
			st.x(1);
			st.cx(0, 1);
			st.z(1);
			st.cx(0, 1);
			st.x(0);
			st.x(1);
			st.h(0);
			st.h(1);
		}
		return st;
	}
	return productZero(2);
}
function Lab() {
	const [preset, setPreset] = (0, import_react.useState)("bell");
	const [iter, setIter] = (0, import_react.useState)(1);
	const [noise, setNoise] = (0, import_react.useState)(0);
	const [fid, setFid] = (0, import_react.useState)(null);
	const state = (0, import_react.useMemo)(() => {
		const ideal = build(preset, iter);
		return applyDepolarizing(ideal, noise, seeded(9));
	}, [
		preset,
		iter,
		noise
	]);
	const probs = preset === "ghz12" ? [] : state.probs();
	const qasm = preset === "bell" ? "OPENQASM 2.0;\nqreg q[2];\nh q[0];\ncx q[0],q[1];" : preset === "ghz" ? "OPENQASM 2.0;\nqreg q[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];" : preset === "ghz12" ? "OPENQASM 2.0;\nqreg q[12];\nh q[0];\n// CX 0→1..11" : "OPENQASM 2.0;\nqreg q[2];\nh q[0];\nh q[1];";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Lab"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Local statevector composer. No cloud backend. GHZ-12 uses exact |⟨GHZ|ψ⟩|², not 4ⁿ tomography."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"bell",
					"ghz",
					"ghz12",
					"grover",
					"product"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: preset === p ? "default" : "secondary",
					onClick: () => {
						setPreset(p);
						setFid(null);
					},
					children: p.toUpperCase()
				}, p))
			}),
			preset === "grover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "max-w-sm text-xs text-muted",
				children: [
					"Grover iterations ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: iter
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						className: "mt-3",
						min: 0,
						max: 4,
						step: 1,
						value: [iter],
						onValueChange: (v) => setIter(v[0])
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "max-w-sm text-xs text-muted",
				children: [
					"Depolarizing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: noise.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						className: "mt-3",
						min: 0,
						max: .25,
						step: .01,
						value: [noise],
						onValueChange: (v) => setNoise(v[0])
					})
				]
			}),
			preset !== "ghz12" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Probability mass" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2",
				children: probs.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-xs font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-16 text-subtle",
							children: i.toString(2).padStart(state.n, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 flex-1 rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-accent",
								style: { width: `${p * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-14 tabular-nums text-muted",
							children: [(p * 100).toFixed(1), "%"]
						})
					]
				}, i))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "QASM" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-auto font-mono text-xs text-muted",
					children: qasm
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: preset === "ghz12" ? "Exact GHZ fidelity" : "Shadow fidelity" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const ideal = build(preset, iter);
							if (preset === "ghz12") setFid(ghzFidelityExact(state));
							else {
								const snaps = collectShadows(state, 160, 11);
								setFid(fidelityToPure(snaps, ideal).fid);
							}
						},
						children: "Estimate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-2xl tabular-nums",
						children: fid === null ? "—" : `${(fid * 100).toFixed(1)}%`
					})]
				})] })]
			})
		]
	});
}
//#endregion
export { Lab as component };

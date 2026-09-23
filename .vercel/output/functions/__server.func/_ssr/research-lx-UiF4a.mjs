import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SURFACE_D3, t as QUDIT_COMMUTATOR } from "./surface-wJOP2tvN.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
import { t as QLDPC_FAMILIES } from "./qldpc-Bew_CNIs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/research-lx-UiF4a.js
var import_jsx_runtime = require_jsx_runtime();
function Research() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Research"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Error budget, hardware ranking, QEC families, and qudit surface-code generators."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					{
						k: "CX error",
						v: "0.0019"
					},
					{
						k: "Readout",
						v: "0.011"
					},
					{
						k: "T1 / T2",
						v: "78 / 61 µs"
					}
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: m.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xl tabular-nums",
						children: m.v
					})]
				}) }, m.k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Hardware ranking for a first hybrid prototype" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[32rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Platform"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Why" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-fg",
										children: "Superconducting"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Speed / visualization" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Fast gates, mature hybrid loops" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-fg",
										children: "Trapped ion"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Highest-assurance certs" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "All-to-all, seconds-scale coherence" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-fg",
										children: "Photonic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Networked later" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Entanglement distribution" })
								]
							})
						]
					})]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Qudit surface-code stabilizers" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-fg",
						children: "A_v = ∏ X_e on δ(v) · B_p = ∏ Z_e on ∂p"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: QUDIT_COMMUTATOR }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Distance-",
						SURFACE_D3.distance,
						" educational patch: ",
						SURFACE_D3.n,
						" data qubits,",
						" ",
						SURFACE_D3.stars.length,
						" stars, ",
						SURFACE_D3.plaquettes.length,
						" plaquettes."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-1 font-mono text-xs",
						children: SURFACE_D3.stars.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							s.label,
							" X",
							s.sites.join("")
						] }, s.label))
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "qLDPC constructions" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Family"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rate" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Distance" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Locality" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: QLDPC_FAMILIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-fg",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-mono text-muted",
								children: f.rate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-mono text-muted",
								children: f.distance
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted",
								children: f.locality
							})
						]
					}, f.name)) })]
				})
			})] })
		]
	});
}
//#endregion
export { Research as component };

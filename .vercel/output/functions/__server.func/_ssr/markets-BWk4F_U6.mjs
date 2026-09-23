import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as seeded } from "./math-B_58bcln.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
import { t as Slider } from "./slider-BQxpuEZ6.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markets-BWk4F_U6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function qaoaEnergy(gamma, beta) {
	return 2 - .5 * Math.sin(4 * gamma) * Math.sin(2 * beta) * 4;
}
function Markets() {
	const [gamma, setGamma] = (0, import_react.useState)(.4);
	const [beta, setBeta] = (0, import_react.useState)(.3);
	const [vol, setVol] = (0, import_react.useState)(.2);
	const energy = qaoaEnergy(gamma, beta);
	const paths = (0, import_react.useMemo)(() => {
		const rng = seeded(Math.round(gamma * 1e3 + beta * 100));
		return Array.from({ length: 24 }, (_, t) => {
			let s = 100;
			for (let i = 0; i <= t; i++) s *= 1 + (rng() - .48) * vol;
			return {
				t,
				s: Number(s.toFixed(2))
			};
		});
	}, [
		gamma,
		beta,
		vol
	]);
	const var95 = (0, import_react.useMemo)(() => {
		const rng = seeded(3);
		const losses = [];
		for (let i = 0; i < 400; i++) {
			let s = 1;
			for (let d = 0; d < 12; d++) s *= 1 + (rng() - .49) * vol;
			losses.push(1 - s);
		}
		losses.sort((a, b) => a - b);
		return losses[Math.floor(.95 * losses.length)];
	}, [vol]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Markets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Toy QAOA MaxCut weights plus a Monte Carlo option fan. Educational, not a trading system."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "QAOA energy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular-nums",
							children: energy.toFixed(3)
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "VaR 95% (12 steps)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-2xl tabular-nums",
							children: [(var95 * 100).toFixed(1), "%"]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Vol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular-nums",
							children: vol.toFixed(2)
						})]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "QAOA angles" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: [
							"γ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: gamma.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								className: "mt-3",
								min: 0,
								max: 1.6,
								step: .02,
								value: [gamma],
								onValueChange: (v) => setGamma(v[0])
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: [
							"β ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: beta.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								className: "mt-3",
								min: 0,
								max: 1.6,
								step: .02,
								value: [beta],
								onValueChange: (v) => setBeta(v[0])
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: [
							"σ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: vol.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								className: "mt-3",
								min: .05,
								max: .5,
								step: .01,
								value: [vol],
								onValueChange: (v) => setVol(v[0])
							})
						]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monte Carlo fan" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: paths,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								hide: true,
								domain: ["auto", "auto"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-surface)",
								border: "1px solid var(--color-border)",
								fontSize: 12,
								color: "var(--color-fg)"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "s",
								stroke: "var(--color-accent)",
								dot: false,
								strokeWidth: 1.5
							})
						]
					})
				})
			})] })
		]
	});
}
//#endregion
export { Markets as component };

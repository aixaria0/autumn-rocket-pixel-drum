import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Button, n as useChimera, r as copy } from "./router-DgxUBSEx.mjs";
import { t as RegisterViz } from "./register-viz-uQaVU1eF.mjs";
import { r as runHybridRound } from "./hybrid-BG4a5oeu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BgYirYj9.mjs";
import { t as Slider } from "./slider-BQxpuEZ6.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-DuDwHm66.mjs";
import { n as HotStuffViz, t as EventLog } from "./hotstuff-viz-D70jtdgV.mjs";
import { t as CertCard } from "./cert-card-CeDaZBef.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CyXBtj0A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommandDesk() {
	const t = copy[useChimera((s) => s.locale)];
	const lastCert = useChimera((s) => s.lastCert);
	const lastRound = useChimera((s) => s.lastRound);
	const lastCorr = useChimera((s) => s.lastCorr);
	const recordRound = useChimera((s) => s.recordRound);
	const pushLog = useChimera((s) => s.pushLog);
	const [kind, setKind] = (0, import_react.useState)("bell");
	const [shots, setShots] = (0, import_react.useState)(180);
	const [noise, setNoise] = (0, import_react.useState)(.04);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function launch(forceReject = false) {
		setBusy(true);
		try {
			const k = forceReject ? "product" : kind;
			const res = await runHybridRound({
				kind: k,
				qubits: k === "ghz12" ? 12 : k === "ghz" ? 4 : 2,
				shots: k === "ghz12" ? 80 : shots,
				noise: forceReject ? .28 : noise,
				seed: Date.now() % 1e6
			});
			recordRound(res.cert, res.round, res.counts, res.correlators);
			pushLog(`${res.cert.accepted ? "ACCEPT" : "REJECT"} F=${res.cert.fidelity.toFixed(3)} n=${res.cert.qubits} view=${res.round.view}`);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Command"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: "Classical shadows (or GHZ stabilizers on 12 qubits) estimate the post-condition. A 7-node HotStuff mesh commits only if F ≥ 0.65 and a 2f+1 quorum holds."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Hybrid round" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Shadow tomography bound to BFT commit" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
							value: kind,
							onValueChange: (v) => setKind(v),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "flex h-auto flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "bell",
										children: "Bell"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "ghz",
										children: "GHZ-4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "ghz12",
										children: "GHZ-12"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "product",
										children: "Product"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: [
								t.shots,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "float-end font-mono tabular-nums",
									children: kind === "ghz12" ? 80 : shots
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									className: "mt-3",
									min: 40,
									max: 400,
									step: 10,
									value: [shots],
									onValueChange: (v) => setShots(v[0]),
									disabled: kind === "ghz12"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: [
								t.noise,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "float-end font-mono tabular-nums",
									children: noise.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									className: "mt-3",
									min: 0,
									max: .3,
									step: .01,
									value: [noise],
									onValueChange: (v) => setNoise(v[0])
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => launch(false),
								disabled: busy,
								children: busy ? "Running…" : t.launch
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => launch(true),
								disabled: busy,
								children: "Guillotine"
							})]
						})
					]
				})] }), lastCert ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertCard, { cert: lastCert }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex h-full min-h-48 items-center text-sm text-muted",
					children: "No certificate yet. Launch a round."
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "12-qubit register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "GHZ when the last cert used 12 qubits" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterViz, {
					n: 12,
					entangled: (lastCert?.qubits ?? 12) >= 4 && lastCert?.accepted !== false
				}) })] }), lastRound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "HotStuff mesh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Prepare / pre-commit / commit — Byzantine node shaded" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotStuffViz, { round: lastRound }), lastCorr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 font-mono text-xs text-muted",
					children: [
						"XX ",
						lastCorr.xx.toFixed(2),
						" · YY ",
						lastCorr.yy.toFixed(2),
						" · ZZ ",
						lastCorr.zz.toFixed(2)
					]
				})] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventLog, {})
		]
	});
}
//#endregion
export { CommandDesk as component };

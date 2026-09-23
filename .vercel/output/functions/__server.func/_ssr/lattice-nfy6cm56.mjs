import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Button, n as useChimera, o as cn } from "./router-DgxUBSEx.mjs";
import { n as runHotStuff, r as runHybridRound } from "./hybrid-BG4a5oeu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
import { n as HotStuffViz, t as EventLog } from "./hotstuff-viz-D70jtdgV.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lattice-nfy6cm56.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-border bg-elevated transition-colors data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-accent-fg" })
	});
}
function Lattice() {
	const recordRound = useChimera((s) => s.recordRound);
	const lastRound = useChimera((s) => s.lastRound);
	const pushLog = useChimera((s) => s.pushLog);
	const [byz, setByz] = (0, import_react.useState)(true);
	const [view, setView] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Lattice"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Seven-node HotStuff. One replica may be Byzantine. Honest-path reachability only — not intrusion."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: byz,
							onCheckedChange: setByz
						}), "Byzantine replica"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const r = runHotStuff({
								accept: false,
								value: "timeout",
								view,
								byzantine: byz ? 1 : 99
							});
							setView(r.view);
							recordRound({
								version: 1,
								programHash: "view-change",
								precondition: "timeout",
								postcondition: "new view",
								proofType: "statistical",
								fidelity: 0,
								fidelityError: 0,
								witness: null,
								shots: 0,
								noise: 0,
								bft: {
									decided: false,
									view: r.view,
									quorum: r.quorum,
									leader: r.leader
								},
								accepted: false,
								timestamp: Date.now(),
								qubits: 0,
								binding: "view-change"
							}, r);
							pushLog(`view-change → view ${r.view}`);
						},
						children: "View-change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							const res = await runHybridRound({
								kind: "bell",
								qubits: 2,
								shots: 160,
								noise: .03
							});
							recordRound(res.cert, res.round, res.counts, res.correlators);
							setView(res.round.view);
							pushLog("hybrid round on lattice");
						},
						children: "Hybrid round"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Packet mesh" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: lastRound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotStuffViz, { round: lastRound }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Idle."
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventLog, {})
		]
	});
}
//#endregion
export { Lattice as component };

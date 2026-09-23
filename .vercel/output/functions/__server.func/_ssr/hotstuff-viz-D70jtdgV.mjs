import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useChimera, o as cn } from "./router-DgxUBSEx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hotstuff-viz-D70jtdgV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EventLog() {
	const log = useChimera((s) => s.log);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLive(true), []);
	if (!log.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-[11px] uppercase tracking-wide text-subtle",
			children: "Event tape"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "max-h-40 space-y-1 overflow-auto font-mono text-xs text-muted",
			children: log.slice(-12).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				live ? new Date(e.t).toLocaleTimeString() : "--:--:--",
				" — ",
				e.text
			] }, i))
		})]
	});
}
function HotStuffViz({ round }) {
	const r = 92;
	const cx = 120;
	const cy = 120;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 240 240",
			className: "h-52 w-52 justify-self-center",
			children: [round.packets.slice(0, 28).map((p, i) => {
				const a1 = 2 * Math.PI * p.from / round.n - Math.PI / 2;
				const a2 = 2 * Math.PI * p.to / round.n - Math.PI / 2;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: cx + r * Math.cos(a1),
					y1: cy + r * Math.sin(a1),
					x2: cx + r * Math.cos(a2),
					y2: cy + r * Math.sin(a2),
					className: "stroke-border",
					strokeWidth: .8,
					opacity: .45
				}, i);
			}), round.nodes.map((n) => {
				const a = 2 * Math.PI * n.id / round.n - Math.PI / 2;
				const x = cx + r * Math.cos(a);
				const y = cy + r * Math.sin(a);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: y,
					r: n.id === round.leader ? 14 : 11,
					className: cn(!n.honest ? "fill-bad" : n.locked ? "fill-ok" : "fill-elevated"),
					stroke: "currentColor",
					strokeWidth: n.id === round.leader ? 1.6 : 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x,
					y: y + 4,
					textAnchor: "middle",
					className: "fill-fg font-mono",
					fontSize: 10,
					children: n.id
				})] }, n.id);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "space-y-2 text-sm",
			children: [round.phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between border-b border-border py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs uppercase tracking-wide text-muted",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("font-mono tabular-nums", p.ok ? "text-ok" : "text-warn"),
					children: [
						p.votes,
						"/",
						round.quorum
					]
				})]
			}, p.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "pt-2 text-xs text-subtle",
				children: [
					"n=",
					round.n,
					" f=",
					round.f,
					" leader=",
					round.leader,
					" byzantine=",
					round.byzantine,
					" view=",
					round.view
				]
			})]
		})]
	});
}
//#endregion
export { HotStuffViz as n, EventLog as t };

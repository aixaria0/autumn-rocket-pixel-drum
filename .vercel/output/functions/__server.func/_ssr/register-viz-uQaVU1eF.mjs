import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-DgxUBSEx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-viz-uQaVU1eF.js
var import_jsx_runtime = require_jsx_runtime();
function RegisterViz({ n = 12, entangled = true, label }) {
	const r = 86;
	const cx = 110;
	const cy = 110;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-xs text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 220 220",
		className: "mx-auto h-48 w-48",
		children: [
			entangled && Array.from({ length: n }, (_, i) => {
				const a1 = 2 * Math.PI * i / n - Math.PI / 2;
				const a2 = 2 * Math.PI * ((i + n / 2) % n) / n - Math.PI / 2;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: cx + r * Math.cos(a1),
					y1: cy + r * Math.sin(a1),
					x2: cx + r * Math.cos(a2),
					y2: cy + r * Math.sin(a2),
					className: "stroke-ok/25",
					strokeWidth: .8
				}, `c${i}`);
			}),
			Array.from({ length: n }, (_, i) => {
				const a = 2 * Math.PI * i / n - Math.PI / 2;
				const x = cx + r * Math.cos(a);
				const y = cy + r * Math.sin(a);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: y,
					r: 9,
					className: cn(entangled ? "fill-ok/80" : "fill-elevated"),
					stroke: "currentColor",
					strokeWidth: 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x,
					y: y + 3,
					textAnchor: "middle",
					className: "fill-accent-fg font-mono",
					fontSize: 8,
					children: i
				})] }, i);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: cx,
				y: 114,
				textAnchor: "middle",
				className: "fill-muted font-mono",
				fontSize: 10,
				children: entangled ? "GHZ" : "prod"
			})
		]
	})] });
}
//#endregion
export { RegisterViz as t };

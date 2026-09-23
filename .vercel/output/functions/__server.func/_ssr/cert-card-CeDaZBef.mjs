import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Badge, i as Button, n as useChimera, r as copy } from "./router-DgxUBSEx.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BgYirYj9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cert-card-CeDaZBef.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CertCard({ cert }) {
	const locale = useChimera((s) => s.locale);
	const t = copy[locale];
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "flex-row items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "QuantumHoareCert" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono text-[11px] text-subtle",
			children: ["#", cert.programHash]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone: cert.accepted ? "ok" : "bad",
			children: cert.accepted ? t.accept : t.reject
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "grid gap-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-x-4 gap-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: t.fidelity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono tabular-nums",
						children: [
							(cert.fidelity * 100).toFixed(1),
							"% ± ",
							(cert.fidelityError * 100).toFixed(1)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: t.witness
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono tabular-nums",
						children: cert.witness === null ? "—" : cert.witness.toFixed(3)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: t.quorum
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono",
						children: [
							cert.bft.decided ? "commit" : "view-change",
							" / v",
							cert.bft.view
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Binding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "truncate font-mono text-xs",
						children: cert.binding
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: cert.postcondition
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: async () => {
					await navigator.clipboard.writeText(JSON.stringify(cert, null, 2));
					setCopied(true);
					setTimeout(() => setCopied(false), 1200);
				},
				children: copied ? t.copied : t.copyCert
			})
		]
	})] });
}
//#endregion
export { CertCard as t };

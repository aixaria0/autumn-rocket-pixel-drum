import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useChimera } from "./router-DgxUBSEx.mjs";
import { t as CertCard } from "./cert-card-CeDaZBef.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-DR3wimZr.js
var import_jsx_runtime = require_jsx_runtime();
function Ledger() {
	const ledger = useChimera((s) => s.ledger);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-medium tracking-tight",
			children: "Ledger"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Bound QuantumHoareCert objects stored on this device. Classical quorum plus quantum witness."
		})] }), ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Empty. Launch a hybrid round from Command."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: ledger.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertCard, { cert: c }, c.binding + c.timestamp))
		})]
	});
}
//#endregion
export { Ledger as component };

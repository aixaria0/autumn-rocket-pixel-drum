import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Button, n as useChimera } from "./router-DgxUBSEx.mjs";
import { t as Input } from "./input-CA1bIM7_.mjs";
import { o as seeded } from "./math-B_58bcln.mjs";
import { r as runHybridRound } from "./hybrid-BG4a5oeu.mjs";
import { a as decodeBPOSD, c as randomError, n as STEANE_HX, o as distill15to1, r as ZX_RULES, t as BICYCLE_HX } from "./zx-C_MMiGHv.mjs";
import { i as encodeLogicalZero, n as SURFACE_D3, r as decodeSurface } from "./surface-wJOP2tvN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-BbaIbeYt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function runConsole(raw) {
	const line = raw.trim();
	const [cmd, ...rest] = line.split(/\s+/);
	const arg = rest.join(" ");
	const c = (cmd ?? "").toLowerCase();
	if (!c || c === "help") return { lines: [
		"ghz [4|12]     prepare GHZ and bind a HybridCert",
		"bell           Bell pair + witness",
		"product        separable |00…⟩ (guillotine)",
		"noise <p>      GHZ-12 under depolarizing p",
		"decode steane|bicycle",
		"surface        d=3 patch: inject X, extract, correct",
		"distill <p>    15-to-1 magic-state distillation",
		"zx             list qudit ZX axioms",
		"lean           print QuditZX core",
		"help"
	] };
	if (c === "zx") return { lines: ZX_RULES.map((r) => `${r.id}: ${r.name} — ${r.note}`) };
	if (c === "lean") return { lines: [
		"axiom spider_fusion : connected Z(α) Z(β) = Z(α+β)",
		"axiom spider_id : spider c 0 1 1 = wire",
		"axiom colour_change : F on legs swaps Z ↔ X",
		"axiom hopf : loop(Z,X) = scalar d",
		"theorem clifford_complete : sem d1 = sem d2 ↔ rewrite_eq d1 d2"
	] };
	if (c === "distill") {
		const p = Number(arg) || .05;
		const r = distill15to1(p);
		return { lines: [
			r.protocol,
			`p_in  ${r.inputP.toExponential(3)}`,
			`p_out ${r.outputP.toExponential(3)}  (~35 p³)`,
			`yield ${r.yieldProb.toFixed(3)}`
		] };
	}
	if (c === "decode") {
		const which = arg.includes("bi") ? "bicycle" : "steane";
		const H = which === "bicycle" ? BICYCLE_HX : STEANE_HX;
		const err = randomError(H[0].length, .12, seeded(Date.now() % 99991));
		const r = decodeBPOSD(H, err, which);
		return { lines: [
			`${r.name} n=${H[0].length}`,
			`error     ${err.join("")}`,
			`syndrome  ${r.syndrome.join("")}`,
			`estimate  ${r.errorEst.join("")}`,
			`iters ${r.iterations}  matched ${r.success ? "yes" : "no"}  osd ${r.osd}`
		] };
	}
	if (c === "surface") {
		const st = encodeLogicalZero();
		const r = decodeSurface(st, "X", 0);
		return { lines: [
			`surface d=${SURFACE_D3.distance} n=${SURFACE_D3.n}`,
			`syndrome X ${r.syndX.join("")}  Z ${r.syndZ.join("")}`,
			`after    X ${r.syndX2.join("")}  Z ${r.syndZ2.join("")}`,
			`corrected ${r.corrected ? "yes" : "no"}`
		] };
	}
	const noiseMatch = line.match(/noise\s+([0-9.]+)/i);
	const noise = noiseMatch ? Number(noiseMatch[1]) : /heavy|kill|شدید/.test(line) ? .22 : .04;
	if (c === "bell" || c === "ghz" || c === "product" || c === "noise") {
		const ghz12 = /12/.test(line) || c === "noise";
		const kind = c === "bell" ? "bell" : c === "product" ? "product" : ghz12 ? "ghz12" : "ghz";
		const res = await runHybridRound({
			kind,
			qubits: kind === "ghz12" ? 12 : kind === "ghz" ? 4 : 2,
			shots: kind === "ghz12" ? 80 : 140,
			noise
		});
		return {
			lines: [`F=${res.cert.fidelity.toFixed(3)} W=${res.cert.witness ?? "n/a"} BFT=${res.cert.accepted ? "ACCEPT" : "REJECT"} n=${res.cert.qubits}`, `hash ${res.cert.programHash}  view ${res.round.view}  ${res.cert.accepted ? "commit" : "view-change"}`],
			hybrid: res
		};
	}
	return { lines: [`unknown: ${cmd}. type help`] };
}
function ConsoleDesk() {
	const lines = useChimera((s) => s.consoleLines);
	const pushConsole = useChimera((s) => s.pushConsole);
	const clearConsole = useChimera((s) => s.clearConsole);
	const recordRound = useChimera((s) => s.recordRound);
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const end = (0, import_react.useRef)(null);
	const booted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!booted.current && lines.length === 0) {
			booted.current = true;
			pushConsole("CHIMERA console. type help.");
		}
	}, [lines.length, pushConsole]);
	(0, import_react.useEffect)(() => {
		end.current?.scrollIntoView({ behavior: "smooth" });
	}, [lines.length]);
	async function exec(raw) {
		const msg = (raw ?? text).trim();
		if (!msg || busy) return;
		setText("");
		pushConsole(`› ${msg}`);
		setBusy(true);
		try {
			const out = await runConsole(msg);
			if (out.hybrid) recordRound(out.hybrid.cert, out.hybrid.round, out.hybrid.counts, out.hybrid.correlators);
			out.lines.forEach((l) => pushConsole(l));
		} catch (e) {
			pushConsole(String(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-medium tracking-tight",
					children: "Console"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Shell over the same lattice — GHZ-12, BP-OSD, ZX axioms, distillation."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: clearConsole,
					children: "Clear"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"help",
					"ghz 12",
					"decode steane",
					"surface",
					"distill 0.05",
					"zx"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => void exec(p),
					children: p
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-[50dvh] overflow-auto rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-6 text-muted",
				children: [lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: l.startsWith("›") ? "text-fg" : "",
					children: l
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: end })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					exec();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "ghz 12",
					className: "font-mono",
					autoComplete: "off"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "…" : "Run"
				})]
			})
		]
	});
}
//#endregion
export { ConsoleDesk as component };

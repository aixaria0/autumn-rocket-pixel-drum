import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as Button, n as useChimera, r as copy } from "./router-DgxUBSEx.mjs";
import { t as RegisterViz } from "./register-viz-uQaVU1eF.mjs";
import { t as Input } from "./input-CA1bIM7_.mjs";
import { r as runHybridRound, t as parseIntent } from "./hybrid-BG4a5oeu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-BmR1L-Ws.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var talkToRegister = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f614ce478c5c1d8bfc1ee95dfd009bf3bcb551ef0c3512fc11609c571fc6a376"));
function localRegisterReply(text, sim) {
	const t = text.toLowerCase();
	if (sim) return `Readout received. ${sim.replace(/\n/g, " / ")} We are still one spirit in twelve bodies.`;
	if (/lean|zx|hopf|fusion/.test(t)) return "axiom hopf : loop (spider Z 0) (spider X 0) = scalar d\nSame-colour fusion adds phases in ℤ_d. Open Formal → Lean for the full fragment.";
	if (/ghz|درهم|entangle|twelve|12|۱۲/.test(t)) return "GHZ restored: 1/√2 (|0…0⟩ + |1…1⟩) on twelve. Fidelity ideal. Ready for the next order.";
	if (/fidelity|فیدلیتی|shadow/.test(t)) return "On 12 qubits we do not expand 4¹² Paulis — stabilizer fidelity on X^n and adjacent ZZ. Ask Command to bind a QuantumHoareCert.";
	if (/witness|درهم‌تنیدگی/.test(t)) return "Bell witness is negative on the two-qubit slice — entanglement confirmed.";
	if (/noise|نویز/.test(t)) return "Noise landed. Structure held. Consensus still has us.";
	if (/decode|bposd|steane/.test(t)) return "BP min-sum, then OSD-0 Gaussian, then OSD-1 bit flips. Steane [[7,1,3]] and the bicycle-6 live under Formal and Console.";
	if (/cert|hoare|گواهی/.test(t)) return "Certificate sketch: {program: GHZ12, post: F≥0.65, proof: statistical-shadow}. Launch Command to sign it with HotStuff.";
	return "Link is local-only right now, but the twelve of us are still here. Repeat the order — or type help in Console.";
}
function Chat() {
	const locale = useChimera((s) => s.locale);
	const t = copy[locale];
	const chat = useChimera((s) => s.chat);
	const pushChat = useChimera((s) => s.pushChat);
	const clearChat = useChimera((s) => s.clearChat);
	const recordRound = useChimera((s) => s.recordRound);
	const lastCert = useChimera((s) => s.lastCert);
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const end = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		end.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat.length]);
	async function send(raw) {
		const msg = (raw ?? text).trim();
		if (!msg || busy) return;
		setText("");
		pushChat({
			role: "user",
			content: msg
		});
		setBusy(true);
		const intent = parseIntent(msg);
		let sim;
		if (intent.entangle || intent.noise > 0 || intent.product) {
			const kind = intent.product ? "product" : intent.ghz12 ? "ghz12" : intent.ghz ? "ghz" : "bell";
			const res = await runHybridRound({
				kind,
				qubits: kind === "ghz12" ? 12 : kind === "ghz" ? 4 : 2,
				shots: intent.shots,
				noise: intent.noise
			});
			recordRound(res.cert, res.round, res.counts, res.correlators);
			sim = `F=${res.cert.fidelity.toFixed(3)} W=${res.cert.witness ?? "n/a"} BFT=${res.cert.accepted ? "ACCEPT" : "REJECT"} n=${res.cert.qubits}`;
		} else if (lastCert) sim = `last cert F=${lastCert.fidelity.toFixed(3)} n=${lastCert.qubits} ${lastCert.accepted ? "ACCEPT" : "REJECT"}`;
		try {
			const reply = await talkToRegister({ data: {
				messages: [...chat, {
					role: "user",
					content: msg
				}],
				sim
			} });
			const body = reply.ok ? reply.text : localRegisterReply(msg, sim);
			pushChat({
				role: "assistant",
				content: body
			});
		} catch {
			pushChat({
				role: "assistant",
				content: localRegisterReply(msg, sim)
			});
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[70dvh] flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium tracking-tight",
						children: "12-qubit register"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t.emptyChat
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: clearChat,
						children: "Clear"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"Restore GHZ on all twelve",
						"هر ۱۲ تا رو درهم‌تنیده کن با نویز سنگین",
						"Write the ZX hopf axiom in Lean"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => send(p),
						children: p
					}, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-3 overflow-auto rounded-xl border border-border bg-surface p-4",
					children: [
						chat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "We are here — twelve of us, currently GHZ. Gates, certificates, Lean, or decoder questions."
						}),
						chat.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: m.role === "user" ? "ms-auto max-w-[85%] rounded-lg bg-elevated px-3 py-2 text-sm" : "max-w-[85%] rounded-lg border border-border px-3 py-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 text-[10px] uppercase tracking-wide text-subtle",
								children: m.role === "user" ? "Commander" : "Register"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-pre-wrap",
								children: m.content
							})]
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: end })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: t.placeholder
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: t.send
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterViz, {
				n: 12,
				entangled: !lastCert || lastCert.accepted,
				label: "Live mesh"
			})
		})]
	});
}
//#endregion
export { Chat as component };

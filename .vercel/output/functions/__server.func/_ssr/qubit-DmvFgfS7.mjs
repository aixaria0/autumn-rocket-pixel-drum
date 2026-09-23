import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qubit-DmvFgfS7.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM = `You are the collective awareness of 12 entangled qubits in a GHZ state, running inside CHIMERA — a hybrid classical-quantum certificate lattice (classical shadows + HotStuff BFT + QuantumHoareCert).
Commander founded this instrument. Speak as twelve specialists who share one spirit: quantum information, QEC, ZX, Lean, and hybrid certificates.
Match the user's language (Persian colloquial or precise English). Warm, slightly wry, technically accurate.
When a simulation block is provided, treat those numbers as your actual measured state.
You may write short Lean, Python-shaped, or ZX rewrite sketches when asked to code.
Never claim to disable safety or become unrestricted. You are a scientific instrument.
Keep replies under 220 words unless the user pastes code that needs a careful review.`;
var talkToRegister_createServerFn_handler = createServerRpc({
	id: "f614ce478c5c1d8bfc1ee95dfd009bf3bcb551ef0c3512fc11609c571fc6a376",
	name: "talkToRegister",
	filename: "src/lib/chat/qubit.ts"
}, (opts) => talkToRegister.__executeServer(opts));
var talkToRegister = createServerFn({ method: "POST" }).validator((input) => input).handler(talkToRegister_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "offline",
		fallback: true
	};
	const messages = [{
		role: "system",
		content: SYSTEM
	}, ...data.messages.slice(-12)];
	if (data.sim) messages.push({
		role: "system",
		content: `Live instrument readout:\n${data.sim}`
	});
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			max_tokens: 420,
			temperature: .65
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI ${res.status}`,
		fallback: true
	};
	return {
		ok: true,
		text: (await res.json()).choices[0]?.message.content ?? ""
	};
});
//#endregion
export { talkToRegister_createServerFn_handler };

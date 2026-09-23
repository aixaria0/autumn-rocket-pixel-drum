import { o as seeded } from "./math-B_58bcln.mjs";
import { a as collectShadows, c as ghzFidelityExact, i as bellWitness, l as ghzStabilizerFidelity, n as applyDepolarizing, o as fidelityToPure, r as bell, s as ghz, u as productZero } from "./state-CJOUlDmn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hybrid-BG4a5oeu.js
function runHotStuff(opts) {
	const n = opts.n ?? 7;
	const f = Math.floor((n - 1) / 3);
	const quorum = 2 * f + 1;
	const byz = Math.min(opts.byzantine ?? 1, f);
	const view = opts.view ?? 0;
	const leader = view % n;
	const nodes = Array.from({ length: n }, (_, id) => ({
		id,
		honest: id !== byz,
		vote: false,
		locked: false
	}));
	const packets = [];
	const phases = [];
	const honestIds = nodes.filter((nd) => nd.honest).map((nd) => nd.id);
	function broadcast(from, phase) {
		for (let to = 0; to < n; to++) {
			if (to === from) continue;
			packets.push({
				from,
				to,
				phase,
				view
			});
		}
	}
	broadcast(leader, "prepare");
	let votes = 0;
	for (const id of honestIds) if (opts.accept || id === leader) {
		nodes[id].vote = true;
		votes++;
		broadcast(id, "prepare");
	}
	phases.push({
		name: "prepare",
		votes,
		ok: votes >= quorum
	});
	votes = 0;
	if (phases[0].ok) {
		broadcast(leader, "precommit");
		for (const id of honestIds) if (nodes[id].vote) {
			nodes[id].locked = true;
			votes++;
			broadcast(id, "precommit");
		}
	}
	phases.push({
		name: "precommit",
		votes,
		ok: votes >= quorum
	});
	votes = 0;
	if (phases[1].ok) {
		broadcast(leader, "commit");
		for (const id of honestIds) if (nodes[id].locked) {
			votes++;
			broadcast(id, "commit");
		}
	}
	phases.push({
		name: "commit",
		votes,
		ok: votes >= quorum
	});
	const decided = phases[2].ok;
	if (decided) {
		broadcast(leader, "decide");
		phases.push({
			name: "decide",
			votes,
			ok: true
		});
	} else phases.push({
		name: "view-change",
		votes: honestIds.length,
		ok: true
	});
	return {
		n,
		f,
		quorum,
		view: decided ? view : view + 1,
		leader,
		byzantine: byz,
		nodes,
		packets,
		decided,
		value: opts.value,
		phases
	};
}
async function shaHex(text) {
	const data = new TextEncoder().encode(text);
	if (globalThis.crypto?.subtle) {
		const buf = await crypto.subtle.digest("SHA-256", data);
		return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
	}
	let h = 2166136261;
	for (let i = 0; i < text.length; i++) h = (h ^ text.charCodeAt(i)) * 16777619;
	return (h >>> 0).toString(16).padStart(8, "0");
}
async function makeCert(input) {
	const programHash = (await shaHex(input.program)).slice(0, 16);
	const accepted = input.decided && input.fidelity >= .65 && (input.witness === null || input.witness < 0);
	const binding = (await shaHex(`${programHash}|${input.fidelity.toFixed(4)}|${input.decided}|${input.view}`)).slice(0, 24);
	return {
		version: 1,
		programHash,
		precondition: "ρ₀ = |0⟩⟨0|⊗n",
		postcondition: input.witness === null ? `F(ρ, GHZ) ≥ 0.65  (est ${input.fidelity.toFixed(3)})` : `F ≥ 0.65 ∧ Tr(Wρ) < 0`,
		proofType: "statistical",
		fidelity: input.fidelity,
		fidelityError: input.fidelityError,
		witness: input.witness,
		shots: input.shots,
		noise: input.noise,
		bft: {
			decided: input.decided,
			view: input.view,
			quorum: input.quorum,
			leader: input.leader
		},
		accepted,
		timestamp: Date.now(),
		qubits: input.qubits,
		binding
	};
}
async function runHybridRound(opts) {
	const rng = seeded(opts.seed ?? 42);
	const n = opts.kind === "bell" ? 2 : opts.kind === "ghz12" ? 12 : opts.kind === "ghz" ? Math.max(3, opts.qubits) : opts.qubits;
	let target;
	if (opts.kind === "bell") target = bell();
	else if (opts.kind === "product") target = productZero(n);
	else target = ghz(n);
	const noisy = applyDepolarizing(target.clone(), opts.noise, rng);
	const shots = n >= 8 ? Math.min(opts.shots, 96) : opts.shots;
	const snaps = collectShadows(noisy, shots, opts.seed ?? 42);
	let fid;
	let se;
	if (opts.kind === "ghz" || opts.kind === "ghz12") {
		const exact = ghzFidelityExact(noisy);
		const stab = ghzStabilizerFidelity(snaps, n);
		fid = .55 * exact + .45 * stab.fid;
		se = stab.se;
	} else if (n <= 4) {
		const r = fidelityToPure(snaps, target);
		fid = r.fid;
		se = r.se;
	} else {
		fid = ghzFidelityExact(noisy);
		se = .02;
	}
	const witness = n === 2 ? bellWitness(snaps) : null;
	const round = runHotStuff({
		accept: fid >= .65 && (witness === null || witness.w < 0),
		value: `F=${fid.toFixed(4)}`
	});
	const cert = await makeCert({
		program: opts.kind === "bell" ? "H(0); CX(0,1)" : opts.kind === "product" ? "I" : `H(0); CX*(0,1..${n - 1})`,
		fidelity: fid,
		fidelityError: se,
		witness: witness?.w ?? null,
		shots,
		noise: opts.noise,
		qubits: n,
		decided: round.decided,
		view: round.view,
		quorum: round.quorum,
		leader: round.leader
	});
	const counts = noisy.sample(rng, Math.min(128, shots));
	return {
		cert,
		round,
		correlators: witness ? {
			xx: witness.xx,
			yy: witness.yy,
			zz: witness.zz
		} : void 0,
		counts
	};
}
function parseIntent(text) {
	const t = text.toLowerCase();
	const ghz12 = /12|۱۲|twelve/.test(t);
	return {
		entangle: /ghz|entangle|درهم|bell|بل/.test(t),
		product: /product|جدا|separable|guillotine/.test(t),
		noise: /شدید|زیاد|heavy|kill|کشنده/.test(t) ? .22 : /نویز|noise|خراب/.test(t) ? /کم|light|ریز/.test(t) ? .03 : .1 : 0,
		shots: ghz12 ? 80 : 180,
		ghz12,
		ghz: /ghz|ghz-4|چهار/.test(t)
	};
}
//#endregion
export { runHotStuff as n, runHybridRound as r, parseIntent as t };

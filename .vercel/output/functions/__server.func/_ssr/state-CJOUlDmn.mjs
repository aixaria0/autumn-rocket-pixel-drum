import { a as medianOfMeans, i as cz, n as cadd, o as seeded, r as cmul, t as cabs2 } from "./math-B_58bcln.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/state-CJOUlDmn.js
var PAULIS = [
	"X",
	"Y",
	"Z"
];
function rotateToZ(st, q, basis) {
	if (basis === "X") st.h(q);
	else if (basis === "Y") {
		st.s(q);
		st.h(q);
	}
}
function inverseFactor(obs) {
	let k = 0;
	for (const c of obs) if (c !== "I") k++;
	return 3 ** k;
}
/** Inverse-channel contribution: 0 unless snapshot basis matches the observable on every non-I site. */
function snapshotContribution(bits, measured, observable) {
	let val = 1;
	for (let i = 0; i < observable.length; i++) {
		if (observable[i] === "I") continue;
		if (measured[i] !== observable[i]) return 0;
		val *= bits[i] === "0" ? 1 : -1;
	}
	return val * inverseFactor(observable);
}
function collectShadows(state, shots, seed = 7) {
	const rng = seeded(seed);
	const snaps = [];
	for (let s = 0; s < shots; s++) {
		const measured = Array.from({ length: state.n }, () => PAULIS[Math.floor(rng() * 3)]);
		const copy = state.clone();
		for (let q = 0; q < state.n; q++) rotateToZ(copy, q, measured[q]);
		const p = copy.probs();
		let r = rng();
		let idx = p.length - 1;
		for (let i = 0; i < p.length; i++) {
			r -= p[i];
			if (r <= 0) {
				idx = i;
				break;
			}
		}
		const bits = Array.from({ length: state.n }, (_, q) => (idx >> q & 1) === 0 ? "0" : "1").join("");
		snaps.push({
			bits,
			measured: measured.join("")
		});
	}
	return snaps;
}
function estimatePauli(snaps, pauli) {
	const vals = snaps.map((s) => snapshotContribution(s.bits, s.measured, pauli));
	return medianOfMeans(vals);
}
function fidelityToPure(snaps, target) {
	const n = target.n;
	const dim = 1 << n;
	const alphabet = [
		"I",
		"X",
		"Y",
		"Z"
	];
	const strings = [""];
	for (let q = 0; q < n; q++) {
		const next = [];
		for (const s of strings) for (const a of alphabet) next.push(s + a);
		strings.length = 0;
		strings.push(...next);
	}
	let fid = 0;
	let varAcc = 0;
	for (const p of strings) {
		const chiT = target.expectationPauli(p);
		const { est, se } = estimatePauli(snaps, p);
		fid += chiT * est;
		varAcc += (se * chiT) ** 2;
	}
	fid /= dim;
	const se = Math.sqrt(varAcc) / dim;
	return {
		fid: Math.min(1, Math.max(0, fid)),
		se
	};
}
/** Bell witness W = 0.5 - 0.25*(1 + XX - YY + ZZ). Negative => entangled. */
function bellWitness(snaps) {
	const xx = estimatePauli(snaps, "XX").est;
	const yy = estimatePauli(snaps, "YY").est;
	const zz = estimatePauli(snaps, "ZZ").est;
	return {
		w: .5 - .25 * (1 + xx - yy + zz),
		xx,
		yy,
		zz
	};
}
function applyDepolarizing(state, p, rng) {
	const copy = state.clone();
	for (let q = 0; q < copy.n; q++) {
		if (rng() >= p) continue;
		const k = Math.floor(rng() * 3);
		if (k === 0) copy.x(q);
		else if (k === 1) copy.y(q);
		else copy.z(q);
	}
	return copy;
}
/** Exact |⟨GHZ|ψ⟩|² for a pure statevector. */
function ghzFidelityExact(st) {
	const a = st.amp[0];
	const b = st.amp[(1 << st.n) - 1];
	const re = (a.re + b.re) * Math.SQRT1_2;
	const im = (a.im + b.im) * Math.SQRT1_2;
	return Math.min(1, Math.max(0, re * re + im * im));
}
function ghzStabilizers(n) {
	const xs = "X".repeat(n);
	const zz = [];
	for (let i = 0; i < n - 1; i++) zz.push("I".repeat(i) + "ZZ" + "I".repeat(n - i - 2));
	return [xs, ...zz];
}
/** Shadow estimate of GHZ stabilizer fidelity (n+1 generators, not 4ⁿ Paulis). */
function ghzStabilizerFidelity(snaps, n) {
	const gens = ghzStabilizers(n);
	let acc = 0;
	let varAcc = 0;
	const values = [];
	for (const p of gens) {
		const { est, se } = estimatePauli(snaps, p);
		acc += est;
		varAcc += se * se;
		values.push({
			p,
			est
		});
	}
	const fid = (1 + acc / gens.length) / 2;
	return {
		fid: Math.min(1, Math.max(0, fid)),
		se: Math.sqrt(varAcc) / (2 * gens.length),
		values
	};
}
var Statevector = class Statevector {
	n;
	amp;
	constructor(n, amp) {
		this.n = n;
		const dim = 1 << n;
		this.amp = amp ?? Array.from({ length: dim }, (_, i) => cz(i === 0 ? 1 : 0, 0));
	}
	clone() {
		return new Statevector(this.n, this.amp.map((a) => ({ ...a })));
	}
	apply1(q, u00, u01, u10, u11) {
		const dim = this.amp.length;
		const bit = 1 << q;
		const next = this.amp.map((a) => ({ ...a }));
		for (let i = 0; i < dim; i++) {
			if (i & bit) continue;
			const j = i | bit;
			const a0 = this.amp[i];
			const a1 = this.amp[j];
			next[i] = cadd(cmul(u00, a0), cmul(u01, a1));
			next[j] = cadd(cmul(u10, a0), cmul(u11, a1));
		}
		this.amp = next;
	}
	h(q) {
		const s = cz(Math.SQRT1_2, 0);
		this.apply1(q, s, s, s, cz(-Math.SQRT1_2, 0));
	}
	x(q) {
		this.apply1(q, cz(), cz(1), cz(1), cz());
	}
	z(q) {
		this.apply1(q, cz(1), cz(), cz(), cz(-1));
	}
	y(q) {
		this.apply1(q, cz(), cz(0, -1), cz(0, 1), cz());
	}
	s(q) {
		this.apply1(q, cz(1), cz(), cz(), cz(0, 1));
	}
	t(q) {
		const ph = cz(Math.SQRT1_2, Math.SQRT1_2);
		this.apply1(q, cz(1), cz(), cz(), ph);
	}
	cx(c, t) {
		const dim = this.amp.length;
		const cb = 1 << c;
		const tb = 1 << t;
		const next = this.amp.map((a) => ({ ...a }));
		for (let i = 0; i < dim; i++) if (i & cb && !(i & tb)) {
			const j = i | tb;
			const tmp = next[i];
			next[i] = next[j];
			next[j] = tmp;
		}
		this.amp = next;
	}
	probs() {
		return this.amp.map(cabs2);
	}
	sample(rng, shots) {
		const p = this.probs();
		const counts = {};
		for (let s = 0; s < shots; s++) {
			let r = rng();
			let idx = p.length - 1;
			for (let i = 0; i < p.length; i++) {
				r -= p[i];
				if (r <= 0) {
					idx = i;
					break;
				}
			}
			const bits = Array.from({ length: this.n }, (_, q) => (idx >> q & 1) === 0 ? "0" : "1").join("");
			counts[bits] = (counts[bits] ?? 0) + 1;
		}
		return counts;
	}
	expectationPauli(pauli) {
		const dim = this.amp.length;
		let acc = 0;
		for (let i = 0; i < dim; i++) {
			let phaseRe = 1;
			let phaseIm = 0;
			let j = i;
			for (let q = 0; q < this.n; q++) {
				const p = pauli[q] ?? "I";
				const bit = i >> q & 1;
				if (p === "X") j ^= 1 << q;
				else if (p === "Z") {
					if (bit) {
						phaseRe = -phaseRe;
						phaseIm = -phaseIm;
					}
				} else if (p === "Y") {
					j ^= 1 << q;
					if (bit === 0) {
						const nr = -phaseIm;
						const ni = phaseRe;
						phaseRe = nr;
						phaseIm = ni;
					} else {
						const nr = phaseIm;
						const ni = -phaseRe;
						phaseRe = nr;
						phaseIm = ni;
					}
				}
			}
			const a = this.amp[i];
			const b = this.amp[j];
			acc += b.re * (a.re * phaseRe - a.im * phaseIm) + b.im * (a.im * phaseRe + a.re * phaseIm);
		}
		return acc;
	}
};
function ghz(n) {
	const st = new Statevector(n);
	st.h(0);
	for (let i = 1; i < n; i++) st.cx(0, i);
	return st;
}
function bell() {
	const st = new Statevector(2);
	st.h(0);
	st.cx(0, 1);
	return st;
}
function productZero(n) {
	return new Statevector(n);
}
//#endregion
export { collectShadows as a, ghzFidelityExact as c, bellWitness as i, ghzStabilizerFidelity as l, applyDepolarizing as n, fidelityToPure as o, bell as r, ghz as s, Statevector as t, productZero as u };

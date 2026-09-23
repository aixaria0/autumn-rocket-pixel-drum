//#region node_modules/.nitro/vite/services/ssr/assets/zx-C_MMiGHv.js
/** Output error ~ 35 p³; post-select success ~ 1 − 15p (small-p). */
function distill15to1(p) {
	const inputP = Math.min(.49, Math.max(1e-6, p));
	return {
		inputP,
		outputP: Math.min(.5, 35 * inputP ** 3),
		yieldProb: Math.max(.01, Math.min(1, 1 - 15 * inputP + 80 * inputP ** 2)),
		protocol: "Bravyi–Kitaev 15-to-1 (Reed–Muller)"
	};
}
function distillCurve(points = 24) {
	return Array.from({ length: points }, (_, i) => {
		const p = .002 + .12 * i / (points - 1);
		const r = distill15to1(p);
		return {
			p,
			out: r.outputP,
			yld: r.yieldProb
		};
	});
}
function mulGF2(H, e) {
	return H.map((row) => row.reduce((s, v, i) => s ^ v & e[i], 0));
}
function eq(a, b) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}
function wt(e) {
	return e.reduce((s, v) => s + v, 0);
}
/** Steane [[7,1,3]] X-checks (Hamming). */
var STEANE_HX = [
	[
		1,
		1,
		1,
		0,
		1,
		0,
		0
	],
	[
		1,
		1,
		0,
		1,
		0,
		1,
		0
	],
	[
		1,
		0,
		1,
		1,
		0,
		0,
		1
	]
];
/** Bicycle-style 6-qubit CSS X-checks (weight-4). */
var BICYCLE_HX = [
	[
		1,
		1,
		0,
		1,
		1,
		0
	],
	[
		0,
		1,
		1,
		0,
		1,
		1
	],
	[
		1,
		0,
		1,
		1,
		0,
		1
	]
];
function bpMinsum(H, syndrome, iters = 12) {
	const r = H.length;
	const n = H[0].length;
	const vn = Array.from({ length: n }, () => []);
	const cn = Array.from({ length: r }, () => []);
	for (let i = 0; i < r; i++) for (let j = 0; j < n; j++) {
		if (!H[i][j]) continue;
		vn[j].push({
			c: i,
			v: j
		});
		cn[i].push({
			c: i,
			v: j
		});
	}
	const msgCV = {};
	const msgVC = {};
	const key = (c, v) => `${c}:${v}`;
	const channel = 2.2;
	for (const e of vn.flat()) msgVC[key(e.c, e.v)] = channel;
	let hard = Array(n).fill(0);
	for (let t = 0; t < iters; t++) {
		for (let c = 0; c < r; c++) {
			const neigh = cn[c];
			for (const { v } of neigh) {
				let sgn = syndrome[c] ? -1 : 1;
				let mag = 40;
				for (const { v: v2 } of neigh) {
					if (v2 === v) continue;
					const m = msgVC[key(c, v2)] ?? channel;
					sgn *= m >= 0 ? 1 : -1;
					mag = Math.min(mag, Math.abs(m));
				}
				msgCV[key(c, v)] = .75 * sgn * mag;
			}
		}
		hard = Array(n).fill(0);
		for (let v = 0; v < n; v++) {
			let llr = channel;
			for (const { c } of vn[v]) llr += msgCV[key(c, v)] ?? 0;
			hard[v] = llr < 0 ? 1 : 0;
			for (const { c } of vn[v]) {
				const out = llr - (msgCV[key(c, v)] ?? 0);
				msgVC[key(c, v)] = Math.max(-20, Math.min(20, out));
			}
		}
		if (eq(mulGF2(H, hard), syndrome)) return {
			error: hard,
			iterations: t + 1
		};
	}
	return {
		error: hard,
		iterations: iters
	};
}
function gaussianSolve(H, s) {
	const r = H.length;
	const n = H[0].length;
	const A = H.map((row, i) => [...row, s[i]]);
	let rank = 0;
	const pivots = [];
	for (let col = 0; col < n && rank < r; col++) {
		let piv = -1;
		for (let i = rank; i < r; i++) if (A[i][col]) {
			piv = i;
			break;
		}
		if (piv < 0) continue;
		[A[rank], A[piv]] = [A[piv], A[rank]];
		for (let i = 0; i < r; i++) if (i !== rank && A[i][col]) for (let j = col; j <= n; j++) A[i][j] ^= A[rank][j];
		pivots.push(col);
		rank++;
	}
	const x = Array(n).fill(0);
	for (let i = 0; i < rank; i++) x[pivots[i]] = A[i][n];
	return x;
}
function osd1(H, syndrome, seed) {
	let best = seed;
	let bestW = wt(seed);
	if (!eq(mulGF2(H, best), syndrome)) {
		best = gaussianSolve(H, syndrome);
		bestW = wt(best);
	}
	const n = seed.length;
	for (let i = 0; i < n; i++) {
		const cand = best.map((v, j) => j === i ? v ^ 1 : v);
		if (eq(mulGF2(H, cand), syndrome) && wt(cand) < bestW) {
			best = cand;
			bestW = wt(cand);
		}
	}
	return best;
}
function decodeBPOSD(H, error, name = "qLDPC") {
	const syndrome = mulGF2(H, error);
	const bp = bpMinsum(H, syndrome);
	let est = bp.error;
	let osd = "bp";
	if (!eq(mulGF2(H, est), syndrome)) {
		est = gaussianSolve(H, syndrome);
		osd = "osd-0";
	}
	if (!eq(mulGF2(H, est), syndrome) || wt(est) > wt(error) + 1) {
		est = osd1(H, syndrome, est);
		osd = "osd-1";
	}
	const residual = est.map((v, i) => v ^ error[i]);
	const success = eq(mulGF2(H, est), syndrome);
	return {
		syndrome,
		residual,
		errorEst: est,
		success,
		iterations: bp.iterations,
		name,
		osd,
		weight: wt(est)
	};
}
function randomError(n, p, rng) {
	return Array.from({ length: n }, () => rng() < p ? 1 : 0);
}
var ZX_RULES = [
	{
		id: "fusion",
		name: "Spider fusion",
		lean: `axiom spider_fusion (c : Color) (α β : Phase) :
  connected (spider c α) (spider c β) = spider c (α + β)`,
		note: "Same-colour spiders connected by one or more wires fuse; phases add in ℤ_d."
	},
	{
		id: "identity",
		name: "Identity",
		lean: `axiom spider_id (c : Color) :
  spider c 0 1 1 = wire`,
		note: "A 1-in 1-out spider of phase 0 is the identity wire."
	},
	{
		id: "fourier",
		name: "Colour change",
		lean: `axiom colour_change (α : Phase) :
  fourier_on_legs (spider Z α) = spider X (F α)`,
		note: "Fourier boxes on every leg swap Z and X spiders (qudit Hadamard)."
	},
	{
		id: "hopf",
		name: "Hopf law",
		lean: `axiom hopf (d : ℕ) :
  loop (spider Z 0) (spider X 0) = scalar d`,
		note: "A green-red closed loop evaluates to the scalar d."
	},
	{
		id: "copy",
		name: "Phase copy",
		lean: `axiom phase_copy (k : Fin d) :
  copy (spider X 0) (phaseZ (2*π*k/d)) = tensor_phase`,
		note: "Special phases that are multiples of 2π/d copy through the opposite colour."
	},
	{
		id: "completeness",
		name: "Stabiliser completeness",
		lean: `theorem clifford_complete :
  ∀ (d1 d2 : Diagram), clifford d1 → (equiv d1 d2 ↔ rewrite_eq d1 d2)`,
		note: "Two Clifford diagrams represent the same map iff they rewrite into each other."
	}
];
function bellDiagrams() {
	return [{
		caption: "Bell circuit — H then CX",
		spiders: [
			{
				id: "in0",
				color: "Z",
				phase: "0",
				x: 40,
				y: 40
			},
			{
				id: "h",
				color: "Z",
				phase: "π",
				x: 120,
				y: 40
			},
			{
				id: "x",
				color: "X",
				phase: "0",
				x: 200,
				y: 40
			},
			{
				id: "out0",
				color: "Z",
				phase: "0",
				x: 280,
				y: 40
			},
			{
				id: "in1",
				color: "Z",
				phase: "0",
				x: 40,
				y: 120
			},
			{
				id: "out1",
				color: "Z",
				phase: "0",
				x: 280,
				y: 120
			}
		],
		wires: [
			{
				a: "in0",
				b: "h"
			},
			{
				a: "h",
				b: "x"
			},
			{
				a: "x",
				b: "out0"
			},
			{
				a: "in1",
				b: "out1"
			},
			{
				a: "x",
				b: "out1"
			}
		]
	}, {
		caption: "After fusion — two fused Bell spiders",
		spiders: [{
			id: "g",
			color: "Z",
			phase: "π",
			x: 110,
			y: 80
		}, {
			id: "r",
			color: "X",
			phase: "0",
			x: 210,
			y: 80
		}],
		wires: [{
			a: "g",
			b: "r"
		}, {
			a: "g",
			b: "r"
		}]
	}];
}
//#endregion
export { decodeBPOSD as a, randomError as c, bellDiagrams as i, STEANE_HX as n, distill15to1 as o, ZX_RULES as r, distillCurve as s, BICYCLE_HX as t };

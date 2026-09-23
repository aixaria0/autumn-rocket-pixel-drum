//#region node_modules/.nitro/vite/services/ssr/assets/surface-wJOP2tvN.js
/** Distance-3 planar surface code (9 data qubits, educational). */
var SURFACE_D3 = {
	n: 9,
	distance: 3,
	d: 2,
	stars: [
		{
			kind: "star",
			label: "A1",
			sites: [
				0,
				1,
				3,
				4
			],
			op: "X"
		},
		{
			kind: "star",
			label: "A2",
			sites: [
				1,
				2,
				4,
				5
			],
			op: "X"
		},
		{
			kind: "star",
			label: "A3",
			sites: [
				3,
				4,
				6,
				7
			],
			op: "X"
		},
		{
			kind: "star",
			label: "A4",
			sites: [
				4,
				5,
				7,
				8
			],
			op: "X"
		}
	],
	plaquettes: [
		{
			kind: "plaquette",
			label: "B1",
			sites: [
				0,
				1,
				3
			],
			op: "Z"
		},
		{
			kind: "plaquette",
			label: "B2",
			sites: [
				1,
				2,
				5
			],
			op: "Z"
		},
		{
			kind: "plaquette",
			label: "B3",
			sites: [
				3,
				6,
				7
			],
			op: "Z"
		},
		{
			kind: "plaquette",
			label: "B4",
			sites: [
				5,
				7,
				8
			],
			op: "Z"
		}
	]
};
var QUDIT_COMMUTATOR = "ZX = ω XZ  ⇒  [A_v, B_p] = 0 when orientation phases cancel";
function parity(sites, bits) {
	return sites.reduce((s, q) => s ^ (bits[q] ?? 0), 0);
}
function encodeLogicalZero() {
	return {
		n: SURFACE_D3.n,
		xErr: Array(SURFACE_D3.n).fill(0),
		zErr: Array(SURFACE_D3.n).fill(0)
	};
}
function decodeSurface(mem, kind, qubit) {
	const xErr = [...mem.xErr];
	const zErr = [...mem.zErr];
	if (kind === "X" || kind === "Y") xErr[qubit] ^= 1;
	if (kind === "Z" || kind === "Y") zErr[qubit] ^= 1;
	const syndX = SURFACE_D3.stars.map((s) => parity(s.sites, zErr));
	const syndZ = SURFACE_D3.plaquettes.map((s) => parity(s.sites, xErr));
	const corrX = [...xErr];
	const corrZ = [...zErr];
	const firedZ = SURFACE_D3.plaquettes.find((_, i) => syndZ[i]);
	if (firedZ) corrX[firedZ.sites[0]] ^= 1;
	const firedX = SURFACE_D3.stars.find((_, i) => syndX[i]);
	if (firedX) corrZ[firedX.sites[0]] ^= 1;
	const syndX2 = SURFACE_D3.stars.map((s) => parity(s.sites, corrZ));
	const syndZ2 = SURFACE_D3.plaquettes.map((s) => parity(s.sites, corrX));
	return {
		syndX,
		syndZ,
		syndX2,
		syndZ2,
		corrected: syndX2.every((b) => b === 0) && syndZ2.every((b) => b === 0),
		xErr,
		zErr,
		qubit,
		kind
	};
}
//#endregion
export { encodeLogicalZero as i, SURFACE_D3 as n, decodeSurface as r, QUDIT_COMMUTATOR as t };

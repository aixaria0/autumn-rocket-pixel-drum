//#region node_modules/.nitro/vite/services/ssr/assets/math-B_58bcln.js
var cz = (re = 0, im = 0) => ({
	re,
	im
});
var cadd = (a, b) => ({
	re: a.re + b.re,
	im: a.im + b.im
});
var cmul = (a, b) => ({
	re: a.re * b.re - a.im * b.im,
	im: a.re * b.im + a.im * b.re
});
var cabs2 = (a) => a.re * a.re + a.im * a.im;
function seeded(seed) {
	let s = seed >>> 0;
	return () => {
		s = s * 1664525 + 1013904223 >>> 0;
		return s / 4294967296;
	};
}
function median(xs) {
	if (!xs.length) return 0;
	const a = [...xs].sort((x, y) => x - y);
	const m = Math.floor(a.length / 2);
	return a.length % 2 ? a[m] : .5 * (a[m - 1] + a[m]);
}
function medianOfMeans(values, batches = 8) {
	if (!values.length) return {
		est: 0,
		se: 1
	};
	const n = Math.min(batches, Math.max(1, Math.floor(values.length / 2)));
	const size = Math.floor(values.length / n);
	const means = [];
	for (let i = 0; i < n; i++) {
		const slice = values.slice(i * size, (i + 1) * size);
		if (!slice.length) continue;
		means.push(slice.reduce((s, v) => s + v, 0) / slice.length);
	}
	const est = median(means);
	return {
		est,
		se: 1.4826 * (median(means.map((m) => Math.abs(m - est))) + 1e-12) / Math.sqrt(means.length || 1)
	};
}
//#endregion
export { medianOfMeans as a, cz as i, cadd as n, seeded as o, cmul as r, cabs2 as t };

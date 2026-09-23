import { type C, cabs2, cadd, cmul, cz } from "./math";

export class Statevector {
  n: number;
  amp: C[];
  constructor(n: number, amp?: C[]) {
    this.n = n;
    const dim = 1 << n;
    this.amp = amp ?? Array.from({ length: dim }, (_, i) => cz(i === 0 ? 1 : 0, 0));
  }

  clone() {
    return new Statevector(this.n, this.amp.map((a) => ({ ...a })));
  }

  apply1(q: number, u00: C, u01: C, u10: C, u11: C) {
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

  h(q: number) {
    const s = cz(Math.SQRT1_2, 0);
    this.apply1(q, s, s, s, cz(-Math.SQRT1_2, 0));
  }
  x(q: number) {
    this.apply1(q, cz(), cz(1), cz(1), cz());
  }
  z(q: number) {
    this.apply1(q, cz(1), cz(), cz(), cz(-1));
  }
  y(q: number) {
    this.apply1(q, cz(), cz(0, -1), cz(0, 1), cz());
  }
  s(q: number) {
    this.apply1(q, cz(1), cz(), cz(), cz(0, 1));
  }
  t(q: number) {
    const ph = cz(Math.SQRT1_2, Math.SQRT1_2);
    this.apply1(q, cz(1), cz(), cz(), ph);
  }
  cx(c: number, t: number) {
    const dim = this.amp.length;
    const cb = 1 << c;
    const tb = 1 << t;
    const next = this.amp.map((a) => ({ ...a }));
    for (let i = 0; i < dim; i++) {
      if ((i & cb) && !(i & tb)) {
        const j = i | tb;
        const tmp = next[i];
        next[i] = next[j];
        next[j] = tmp;
      }
    }
    this.amp = next;
  }

  probs() {
    return this.amp.map(cabs2);
  }

  sample(rng: () => number, shots: number) {
    const p = this.probs();
    const counts: Record<string, number> = {};
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
      const bits = Array.from({ length: this.n }, (_, q) =>
        ((idx >> q) & 1) === 0 ? "0" : "1",
      ).join("");
      counts[bits] = (counts[bits] ?? 0) + 1;
    }
    return counts;
  }

  expectationPauli(pauli: string) {
    // pauli[0] is qubit 0 (little-endian string? we use pauli[i] = qubit i)
    const dim = this.amp.length;
    let acc = 0;
    for (let i = 0; i < dim; i++) {
      let phaseRe = 1;
      let phaseIm = 0;
      let j = i;
      for (let q = 0; q < this.n; q++) {
        const p = pauli[q] ?? "I";
        const bit = (i >> q) & 1;
        if (p === "X") {
          j ^= 1 << q;
        } else if (p === "Z") {
          if (bit) {
            phaseRe = -phaseRe;
            phaseIm = -phaseIm;
          }
        } else if (p === "Y") {
          j ^= 1 << q;
          // Y|0>=i|1>, Y|1>=-i|0>
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
}

export function ghz(n: number) {
  const st = new Statevector(n);
  st.h(0);
  for (let i = 1; i < n; i++) st.cx(0, i);
  return st;
}

export function bell() {
  const st = new Statevector(2);
  st.h(0);
  st.cx(0, 1);
  return st;
}

export function productZero(n: number) {
  return new Statevector(n);
}

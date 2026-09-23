import { distill15to1 } from "@/lib/qec/magic";
import { BICYCLE_HX, STEANE_HX, decodeBPOSD, randomError } from "@/lib/qec/bposd";
import { decodeSurface, encodeLogicalZero, SURFACE_D3 } from "@/lib/qec/surface";
import { ZX_RULES } from "@/lib/qec/zx";
import { runHybridRound, type HybridResult } from "@/lib/hybrid";
import { seeded } from "@/lib/quantum/math";

export type ConsoleOut = { lines: string[]; hybrid?: HybridResult };

export async function runConsole(raw: string): Promise<ConsoleOut> {
  const line = raw.trim();
  const [cmd, ...rest] = line.split(/\s+/);
  const arg = rest.join(" ");
  const c = (cmd ?? "").toLowerCase();

  if (!c || c === "help") {
    return {
      lines: [
        "ghz [4|12]     prepare GHZ and bind a HybridCert",
        "bell           Bell pair + witness",
        "product        separable |00…⟩ (guillotine)",
        "noise <p>      GHZ-12 under depolarizing p",
        "decode steane|bicycle",
        "surface        d=3 patch: inject X, extract, correct",
        "distill <p>    15-to-1 magic-state distillation",
        "zx             list qudit ZX axioms",
        "lean           print QuditZX core",
        "help",
      ],
    };
  }

  if (c === "zx") {
    return { lines: ZX_RULES.map((r) => `${r.id}: ${r.name} — ${r.note}`) };
  }

  if (c === "lean") {
    return {
      lines: [
        "axiom spider_fusion : connected Z(α) Z(β) = Z(α+β)",
        "axiom spider_id : spider c 0 1 1 = wire",
        "axiom colour_change : F on legs swaps Z ↔ X",
        "axiom hopf : loop(Z,X) = scalar d",
        "theorem clifford_complete : sem d1 = sem d2 ↔ rewrite_eq d1 d2",
      ],
    };
  }

  if (c === "distill") {
    const p = Number(arg) || 0.05;
    const r = distill15to1(p);
    return {
      lines: [
        r.protocol,
        `p_in  ${r.inputP.toExponential(3)}`,
        `p_out ${r.outputP.toExponential(3)}  (~35 p³)`,
        `yield ${r.yieldProb.toFixed(3)}`,
      ],
    };
  }

  if (c === "decode") {
    const which = arg.includes("bi") ? "bicycle" : "steane";
    const H = which === "bicycle" ? BICYCLE_HX : STEANE_HX;
    const err = randomError(H[0].length, 0.12, seeded(Date.now() % 99991));
    const r = decodeBPOSD(H, err, which);
    return {
      lines: [
        `${r.name} n=${H[0].length}`,
        `error     ${err.join("")}`,
        `syndrome  ${r.syndrome.join("")}`,
        `estimate  ${r.errorEst.join("")}`,
        `iters ${r.iterations}  matched ${r.success ? "yes" : "no"}  osd ${r.osd}`,
      ],
    };
  }

  if (c === "surface") {
    const st = encodeLogicalZero();
    const r = decodeSurface(st, "X", 0);
    return {
      lines: [
        `surface d=${SURFACE_D3.distance} n=${SURFACE_D3.n}`,
        `syndrome X ${r.syndX.join("")}  Z ${r.syndZ.join("")}`,
        `after    X ${r.syndX2.join("")}  Z ${r.syndZ2.join("")}`,
        `corrected ${r.corrected ? "yes" : "no"}`,
      ],
    };
  }

  const noiseMatch = line.match(/noise\s+([0-9.]+)/i);
  const noise = noiseMatch ? Number(noiseMatch[1]) : /heavy|kill|شدید/.test(line) ? 0.22 : 0.04;
  if (c === "bell" || c === "ghz" || c === "product" || c === "noise") {
    const ghz12 = /12/.test(line) || c === "noise";
    const kind = c === "bell" ? "bell" : c === "product" ? "product" : ghz12 ? "ghz12" : "ghz";
    const res = await runHybridRound({
      kind,
      qubits: kind === "ghz12" ? 12 : kind === "ghz" ? 4 : 2,
      shots: kind === "ghz12" ? 80 : 140,
      noise,
    });
    return {
      lines: [
        `F=${res.cert.fidelity.toFixed(3)} W=${res.cert.witness ?? "n/a"} BFT=${res.cert.accepted ? "ACCEPT" : "REJECT"} n=${res.cert.qubits}`,
        `hash ${res.cert.programHash}  view ${res.round.view}  ${res.cert.accepted ? "commit" : "view-change"}`,
      ],
      hybrid: res,
    };
  }

  return { lines: [`unknown: ${cmd}. type help`] };
}
